#!/bin/bash
# RapidCanvas Frontend Deploy Script
# Usage: bash infra/deploy-frontend.sh [dev|prod]  (default: dev)
set +e

DEPLOY_ENV="${1:-dev}"

if [[ "$DEPLOY_ENV" != "dev" && "$DEPLOY_ENV" != "prod" ]]; then
  echo "[ERROR] Invalid environment: $DEPLOY_ENV (must be 'dev' or 'prod')"
  exit 1
fi

echo "=========================================="
echo "RapidCanvas Frontend Deploy Script [$DEPLOY_ENV]"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Retry configuration
MAX_RETRIES="${MAX_RETRIES:-3}"
RETRY_DELAY="${RETRY_DELAY:-5}"

# Retry wrapper for curl commands
# Usage: curl_with_retry [curl args...]
# Returns: curl exit code, outputs response to stdout
curl_with_retry() {
  local attempt=1
  local response
  local http_status
  local curl_exit

  while [ $attempt -le $MAX_RETRIES ]; do
    response=$(curl -s -w "\n[HTTP_STATUS]:%{http_code}" "$@" 2>&1)
    curl_exit=$?
    http_status=$(echo "$response" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)

    # Success: 2xx status and curl succeeded
    if [ $curl_exit -eq 0 ] && [[ "$http_status" =~ ^2[0-9][0-9]$ ]]; then
      echo "$response"
      return 0
    fi

    # Retry on: curl failure, 5xx errors, 429 (rate limit)
    if [ $curl_exit -ne 0 ] || [[ "$http_status" =~ ^5[0-9][0-9]$ ]] || [ "$http_status" = "429" ]; then
      echo "[RETRY] Attempt $attempt/$MAX_RETRIES failed (HTTP: $http_status, curl: $curl_exit)" >&2
      if [ $attempt -lt $MAX_RETRIES ]; then
        local delay=$((RETRY_DELAY * attempt))
        echo "[RETRY] Waiting ${delay}s before retry..." >&2
        sleep $delay
      fi
      ((attempt++))
    else
      # Non-retryable error (4xx except 429)
      echo "$response"
      return 1
    fi
  done

  echo "[ERROR] All $MAX_RETRIES attempts failed" >&2
  echo "$response"
  return 1
}

# Load environment variables from .env if it exists
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Read config from environment-specific .rapidcanvas file
CONFIG_FILE="$SCRIPT_DIR/.rapidcanvas.$DEPLOY_ENV"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "[ERROR] Config file not found: $CONFIG_FILE"
  echo "[HINT] Expected .rapidcanvas.dev or .rapidcanvas.prod in infra/"
  exit 1
fi
echo "[INFO] Using config: $CONFIG_FILE"

DATAAPP_ID=$(grep "^DATAAPP_ID=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')
FASTAPI_ID=$(grep "^FASTAPI_ID=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')
DASHBOARD_PATH=$(grep "^dashboardPath=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')
API_PREFIX=$(grep "^API_PREFIX=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')

echo "[DEBUG] DataApp ID: $DATAAPP_ID"
echo "[DEBUG] FastAPI ID: $FASTAPI_ID"
echo "[DEBUG] Dashboard Path: $DASHBOARD_PATH"
echo "[DEBUG] API Prefix: ${API_PREFIX:-(none)}"

if [ -z "$DATAAPP_ID" ]; then
  echo "[ERROR] DATAAPP_ID not configured in $CONFIG_FILE"
  exit 1
fi

API_HOST="https://app.rapidcanvas.ai"

if [ -z "$RAPIDCANVAS_API_KEY" ]; then
  echo "[ERROR] RAPIDCANVAS_API_KEY environment variable not set"
  exit 1
fi

echo ""
echo "=========================================="
echo "Step 1: Get dataapp details"
echo "=========================================="

DATAAPP_RESPONSE=$(curl_with_retry "$API_HOST/api/dataapps/by-id/$DATAAPP_ID" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Accept: application/json")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to get dataapp details after $MAX_RETRIES attempts"
  exit 1
fi

DATAAPP_STATUS=$(echo "$DATAAPP_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
DATAAPP_BODY=$(echo "$DATAAPP_RESPONSE" | grep -v "\[HTTP_STATUS\]")

echo "[RESPONSE] HTTP Status: $DATAAPP_STATUS"

APP_TEMPLATE_ID=$(echo "$DATAAPP_BODY" | jq -r '.appTemplateId' 2>/dev/null)
DATAAPP_SLUG=$(echo "$DATAAPP_BODY" | jq -r '.slug' 2>/dev/null)
echo "[DEBUG] App Template ID: $APP_TEMPLATE_ID"
echo "[DEBUG] DataApp Slug: $DATAAPP_SLUG"

echo ""
echo "=========================================="
echo "Step 2: Get FastAPI details (for backend URL)"
echo "=========================================="

if [ -n "$FASTAPI_ID" ]; then
  # Get bearer token
  TOKEN_RESPONSE=$(curl_with_retry "$API_HOST/api/access_key/token" \
    -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
    -H "Accept: application/json")
  BEARER_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -v "\[HTTP_STATUS\]" | jq -r '.token' 2>/dev/null)

  FASTAPI_RESPONSE=$(curl_with_retry "$API_HOST/api/fastapi?id=$FASTAPI_ID" \
    -H "Authorization: Bearer $BEARER_TOKEN" \
    -H "Accept: application/json")
  FASTAPI_RESPONSE=$(echo "$FASTAPI_RESPONSE" | grep -v "\[HTTP_STATUS\]")

  FASTAPI_PROJECT_ID=$(echo "$FASTAPI_RESPONSE" | jq -r '.[0].projectId' 2>/dev/null)
  FASTAPI_NAME=$(echo "$FASTAPI_RESPONSE" | jq -r '.[0].name' 2>/dev/null)

  echo "[DEBUG] FastAPI Project ID: $FASTAPI_PROJECT_ID"
  echo "[DEBUG] FastAPI Name: $FASTAPI_NAME"

  if [ -n "$FASTAPI_PROJECT_ID" ] && [ "$FASTAPI_PROJECT_ID" != "null" ]; then
    BACKEND_URL="$API_HOST/fastapiapps/$FASTAPI_PROJECT_ID/$FASTAPI_NAME$API_PREFIX"
    echo "[DEBUG] Backend URL: $BACKEND_URL"
  else
    echo "[ERROR] Could not determine FastAPI project ID from API response"
    exit 1
  fi
else
  echo "[SKIP] FASTAPI_ID not configured - skipping backend URL setup"
  BACKEND_URL=""
fi

echo ""
echo "=========================================="
echo "Step 3: Configure frontend environment"
echo "=========================================="

# Update VITE_API_URL and VITE_BASE_URL in .env without wiping other vars
FRONTEND_ENV="$DASHBOARD_PATH/.env"
if [ -n "$BACKEND_URL" ]; then
  touch "$FRONTEND_ENV"
  for VAR_LINE in "VITE_FAST_API_BASE_URL=$BACKEND_URL" "VITE_API_URL=$BACKEND_URL" "VITE_BASE_URL=$API_HOST"; do
    VAR_NAME="${VAR_LINE%%=*}"
    if grep -q "^${VAR_NAME}=" "$FRONTEND_ENV"; then
      sed -i.bak "s|^${VAR_NAME}=.*|${VAR_LINE}|" "$FRONTEND_ENV" && rm -f "${FRONTEND_ENV}.bak"
    else
      echo "$VAR_LINE" >> "$FRONTEND_ENV"
    fi
  done
  echo "[INFO] Updated $FRONTEND_ENV:"
  echo "[INFO]   VITE_API_URL=$BACKEND_URL"
  echo "[INFO]   VITE_BASE_URL=$API_HOST"
else
  echo "[SKIP] No backend URL - skipping VITE_API_URL configuration"
fi

# Update vite.config.ts base path if we have the slug
if [ -n "$DATAAPP_SLUG" ] && [ "$DATAAPP_SLUG" != "null" ]; then
  VITE_CONFIG="$DASHBOARD_PATH/vite.config.ts"
  if [ -f "$VITE_CONFIG" ]; then
    # Replace the base path placeholder or existing slug with the actual slug
    sed -i.bak "s|/dataapps/[^'\"]*|/dataapps/$DATAAPP_SLUG|g" "$VITE_CONFIG"
    rm -f "$VITE_CONFIG.bak"
    echo "[INFO] Updated vite.config.ts base path to /dataapps/$DATAAPP_SLUG"
  fi
fi

echo ""
echo "=========================================="
echo "Step 4: Get app template details"
echo "=========================================="

APP_TEMPLATE_RESPONSE=$(curl_with_retry "$API_HOST/api/app-templates/$APP_TEMPLATE_ID" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Accept: application/json")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to get app template details after $MAX_RETRIES attempts"
  exit 1
fi

APP_TEMPLATE_STATUS=$(echo "$APP_TEMPLATE_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
APP_TEMPLATE_BODY=$(echo "$APP_TEMPLATE_RESPONSE" | grep -v "\[HTTP_STATUS\]")

APP_NAME=$(echo "$APP_TEMPLATE_BODY" | jq -r '.name' 2>/dev/null)
echo "[DEBUG] App Name: $APP_NAME"

ZIP_NAME="${APP_NAME}.zip"

echo ""
echo "=========================================="
echo "Step 5: Creating zip file"
echo "=========================================="

rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" "$DASHBOARD_PATH" -x "*/.*" -x ".*" -x "$DASHBOARD_PATH/node_modules/*" -x "$DASHBOARD_PATH/dist/*"

if [ -f "$DASHBOARD_PATH/.env" ]; then
  zip -u "$ZIP_NAME" "$DASHBOARD_PATH/.env"
  echo "[DEBUG] Added .env file to zip"
else
  echo "[ERROR] No .env file found at $DASHBOARD_PATH/.env - VITE_API_URL will default to localhost!"
  exit 1
fi

ZIP_SIZE=$(ls -lh "$ZIP_NAME" | awk '{print $5}')
echo "[DEBUG] Zip created: $ZIP_NAME ($ZIP_SIZE)"

echo ""
echo "=========================================="
echo "Step 6: Generating signed URL"
echo "=========================================="

RESPONSE=$(curl_with_retry "$API_HOST/api/signed-url/generate-file-upload-url" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Content-Type: application/json" \
  --max-time 60 \
  -d "{\"fileName\":\"$ZIP_NAME\",\"signedUrlObjectType\":\"APP_TEMPLATE_REACTJS\",\"metadata\":{\"appType\":\"reactjs\",\"SOURCE\":\"TENANT\"}}")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to get signed URL after $MAX_RETRIES attempts"
  rm -f "$ZIP_NAME"
  exit 1
fi

RESPONSE_BODY=$(echo "$RESPONSE" | grep -v "\[HTTP_STATUS\]")

INNER_JSON=$(echo "$RESPONSE_BODY" | jq -r '.responseEntity' 2>/dev/null)
if [ -n "$INNER_JSON" ] && [ "$INNER_JSON" != "null" ]; then
  SIGNED_URL=$(echo "$INNER_JSON" | jq -r '.signedUrl' 2>/dev/null)
else
  SIGNED_URL=$(echo "$RESPONSE_BODY" | jq -r '.signedUrl' 2>/dev/null)
fi

if [ "$SIGNED_URL" == "null" ] || [ -z "$SIGNED_URL" ]; then
  echo "[ERROR] Failed to get signed URL"
  rm -f "$ZIP_NAME"
  exit 1
fi

echo ""
echo "=========================================="
echo "Step 7: Uploading zip to signed URL"
echo "=========================================="

UPLOAD_RESPONSE=$(curl_with_retry -X PUT "$SIGNED_URL" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@$ZIP_NAME" \
  --max-time 180)

if [ $? -ne 0 ]; then
  echo "[ERROR] Upload failed after $MAX_RETRIES attempts"
  rm -f "$ZIP_NAME"
  exit 1
fi
echo "[SUCCESS] Zip file uploaded"

rm -f "$ZIP_NAME"

echo ""
echo "=========================================="
echo "Step 8: Update app template (trigger rebuild)"
echo "=========================================="

APP_TEMPLATE_PUT_BODY=$(echo "$APP_TEMPLATE_BODY" | jq '.buildStatus = "UNBUILT"')

PUT_TEMPLATE_RESPONSE=$(curl_with_retry -X PUT "$API_HOST/api/app-templates/$APP_TEMPLATE_ID" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$APP_TEMPLATE_PUT_BODY")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to update app template after $MAX_RETRIES attempts"
  exit 1
fi

echo ""
echo "=========================================="
echo "Step 9: Update dataapp"
echo "=========================================="

PUT_DATAAPP_RESPONSE=$(curl_with_retry -X PUT "$API_HOST/api/dataapps/$DATAAPP_ID" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$DATAAPP_BODY")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to update dataapp after $MAX_RETRIES attempts"
  exit 1
fi

echo ""
echo "=========================================="
echo "Step 10: Launch dataapp"
echo "=========================================="

LAUNCH_RESPONSE=$(curl_with_retry -X POST "$API_HOST/api/dataapps/$DATAAPP_ID/launch" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Content-Length: 0")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to launch dataapp after $MAX_RETRIES attempts"
  exit 1
fi

echo ""
echo "=========================================="
echo "[SUCCESS] Frontend Deploy complete!"
echo "App: $APP_NAME"
echo "DataApp ID: $DATAAPP_ID"
echo "=========================================="
