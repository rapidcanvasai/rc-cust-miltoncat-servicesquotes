#!/bin/bash
# RapidCanvas Backend Deploy Script (FastAPI)
set +e

echo "=========================================="
echo "RapidCanvas Backend Deploy Script"
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

# Read config from .rapidcanvas
CONFIG_FILE="$SCRIPT_DIR/.rapidcanvas"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "[ERROR] .rapidcanvas config file not found at $CONFIG_FILE"
  exit 1
fi

FASTAPI_ID=$(grep "^FASTAPI_ID=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')
BACKEND_PATH=$(grep "^backendPath=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')
BACKEND_PATH="${BACKEND_PATH:-backend}"

echo "[DEBUG] FastAPI ID: $FASTAPI_ID"
echo "[DEBUG] Backend Path: $BACKEND_PATH"

if [ -z "$FASTAPI_ID" ]; then
  echo "[ERROR] FASTAPI_ID not configured in $CONFIG_FILE"
  exit 1
fi

if [ ! -d "$BACKEND_PATH" ]; then
  echo "[ERROR] Backend path '$BACKEND_PATH' does not exist"
  exit 1
fi

API_HOST="https://app.rapidcanvas.ai"

if [ -z "$RAPIDCANVAS_API_KEY" ]; then
  echo "[ERROR] RAPIDCANVAS_API_KEY environment variable not set"
  exit 1
fi

echo ""
echo "=========================================="
echo "Step 1: Get Bearer token"
echo "=========================================="

TOKEN_RESPONSE=$(curl_with_retry "$API_HOST/api/access_key/token" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Accept: application/json")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to get Bearer token after $MAX_RETRIES attempts"
  exit 1
fi

TOKEN_STATUS=$(echo "$TOKEN_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
TOKEN_BODY=$(echo "$TOKEN_RESPONSE" | grep -v "\[HTTP_STATUS\]")

BEARER_TOKEN=$(echo "$TOKEN_BODY" | jq -r '.token // .access_token // .' 2>/dev/null)
if [ -z "$BEARER_TOKEN" ] || [ "$BEARER_TOKEN" == "null" ]; then
  BEARER_TOKEN=$(echo "$TOKEN_BODY" | tr -d '"')
fi

echo "[DEBUG] Bearer token obtained"

echo ""
echo "=========================================="
echo "Step 2: Get FastAPI app details"
echo "=========================================="

FASTAPI_RESPONSE=$(curl_with_retry "$API_HOST/api/fastapi?id=$FASTAPI_ID" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Accept: application/json")

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to get FastAPI app details after $MAX_RETRIES attempts"
  exit 1
fi

FASTAPI_STATUS=$(echo "$FASTAPI_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
FASTAPI_BODY=$(echo "$FASTAPI_RESPONSE" | grep -v "\[HTTP_STATUS\]")

APP_NAME=$(echo "$FASTAPI_BODY" | jq -r '.[0].name' 2>/dev/null)
PROJECT_ID=$(echo "$FASTAPI_BODY" | jq -r '.[0].projectId' 2>/dev/null)

echo "[DEBUG] App Name: $APP_NAME"
echo "[DEBUG] Project ID: $PROJECT_ID"

ZIP_NAME="${APP_NAME}.zip"

echo ""
echo "=========================================="
echo "Step 3: Creating zip file"
echo "=========================================="

rm -f "$ZIP_NAME"

PY_FILES=$(find "$BACKEND_PATH" -maxdepth 1 -name "*.py" -type f)
if [ -n "$PY_FILES" ]; then
  zip -j "$ZIP_NAME" $PY_FILES
  echo "[INFO] Added Python files"
else
  echo "[ERROR] No .py files found in $BACKEND_PATH"
  exit 1
fi

if [ -f "$BACKEND_PATH/requirements.txt" ]; then
  zip -j "$ZIP_NAME" "$BACKEND_PATH/requirements.txt"
else
  echo "[ERROR] requirements.txt not found in $BACKEND_PATH"
  exit 1
fi

# Include .env if it exists in backend path
if [ -f "$BACKEND_PATH/.env" ]; then
  zip -j "$ZIP_NAME" "$BACKEND_PATH/.env"
  echo "[INFO] Added .env file to zip"
fi

# Include data/ directory (DuckDB database) if it exists
if [ -d "$BACKEND_PATH/data" ]; then
  (cd "$BACKEND_PATH" && zip -r "../$ZIP_NAME" data/)
  echo "[INFO] Added data/ directory to zip"
fi

ZIP_SIZE=$(ls -lh "$ZIP_NAME" | awk '{print $5}')
echo "[DEBUG] Zip created: $ZIP_NAME ($ZIP_SIZE)"

echo ""
echo "=========================================="
echo "Step 4: Generating signed URL"
echo "=========================================="

RESPONSE=$(curl_with_retry "$API_HOST/api/signed-url/generate-file-upload-url" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Content-Type: application/json" \
  --max-time 60 \
  -d "{\"fileName\":\"$ZIP_NAME\",\"signedUrlObjectType\":\"FASTAPI_APP\",\"metadata\":{\"projectId\":\"$PROJECT_ID\",\"fastApiAppId\":\"$FASTAPI_ID\"}}")

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
echo "Step 5: Uploading zip to signed URL"
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
echo "Step 6: Launch the FastAPI app"
echo "=========================================="

LAUNCH_RESPONSE=$(curl_with_retry -X POST "$API_HOST/api/fastapi/$FASTAPI_ID/launch" \
  -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
  -H "Accept: application/json" \
  -H "Content-Length: 0")

if [ $? -ne 0 ]; then
  echo "[ERROR] Launch failed after $MAX_RETRIES attempts"
  exit 1
fi
echo "[SUCCESS] App launched successfully"

echo ""
echo "=========================================="
echo "[SUCCESS] Backend Deploy complete!"
echo "App: $APP_NAME"
echo "FastAPI ID: $FASTAPI_ID"
echo "=========================================="
