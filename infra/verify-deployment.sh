#!/bin/bash
# RapidCanvas Deployment Verification Script
set -e

echo "=========================================="
echo "RapidCanvas Deployment Verification"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Read config
CONFIG_FILE="$SCRIPT_DIR/.rapidcanvas"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "[ERROR] .rapidcanvas config file not found at $CONFIG_FILE"
  exit 1
fi

DATAAPP_ID=$(grep "^DATAAPP_ID=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')
FASTAPI_ID=$(grep "^FASTAPI_ID=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d ' ')

API_HOST="${RAPIDCANVAS_API_HOST:-https://app.rapidcanvas.ai}"

if [ -z "$RAPIDCANVAS_API_KEY" ]; then
  echo "[ERROR] RAPIDCANVAS_API_KEY environment variable not set"
  exit 1
fi

FAILED=0

echo ""
echo "=========================================="
echo "Step 1: Verify DataApp Status"
echo "=========================================="

if [ -n "$DATAAPP_ID" ]; then
  DATAAPP_RESPONSE=$(curl -s -w "\n[HTTP_STATUS]:%{http_code}" "$API_HOST/api/dataapps/by-id/$DATAAPP_ID" \
    -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
    -H "Accept: application/json")

  DATAAPP_STATUS=$(echo "$DATAAPP_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
  DATAAPP_BODY=$(echo "$DATAAPP_RESPONSE" | grep -v "\[HTTP_STATUS\]")

  if [ "$DATAAPP_STATUS" == "200" ]; then
    DATAAPP_STATE=$(echo "$DATAAPP_BODY" | jq -r '.launchStatus // .status // "unknown"' 2>/dev/null)
    DATAAPP_NAME=$(echo "$DATAAPP_BODY" | jq -r '.name // "unknown"' 2>/dev/null)
    DATAAPP_URL=$(echo "$DATAAPP_BODY" | jq -r '.accessUrl // .url // empty' 2>/dev/null)

    echo "[INFO] DataApp: $DATAAPP_NAME"
    echo "[INFO] Status: $DATAAPP_STATE"

    if [ -n "$DATAAPP_URL" ]; then
      echo "[INFO] URL: $DATAAPP_URL"
    fi

    if [ "$DATAAPP_STATE" == "RUNNING" ] || [ "$DATAAPP_STATE" == "LAUNCHED" ] || [ "$DATAAPP_STATE" == "ACTIVE" ]; then
      echo "[OK] DataApp is running"
    else
      echo "[WARN] DataApp status: $DATAAPP_STATE (may still be starting)"
    fi
  else
    echo "[ERROR] Failed to get DataApp status (HTTP $DATAAPP_STATUS)"
    FAILED=1
  fi
else
  echo "[SKIP] No DATAAPP_ID configured"
fi

echo ""
echo "=========================================="
echo "Step 2: Verify FastAPI Status"
echo "=========================================="

if [ -n "$FASTAPI_ID" ]; then
  # Get bearer token first
  TOKEN_RESPONSE=$(curl -s -w "\n[HTTP_STATUS]:%{http_code}" "$API_HOST/api/access_key/token" \
    -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
    -H "Accept: application/json")

  TOKEN_STATUS=$(echo "$TOKEN_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
  TOKEN_BODY=$(echo "$TOKEN_RESPONSE" | grep -v "\[HTTP_STATUS\]")

  if [ "$TOKEN_STATUS" == "200" ]; then
    BEARER_TOKEN=$(echo "$TOKEN_BODY" | jq -r '.token // .access_token' 2>/dev/null)
    if [ -z "$BEARER_TOKEN" ] || [ "$BEARER_TOKEN" == "null" ]; then
      BEARER_TOKEN=$(echo "$TOKEN_BODY" | jq -r '.' 2>/dev/null | tr -d '"')
    fi

    FASTAPI_RESPONSE=$(curl -s -w "\n[HTTP_STATUS]:%{http_code}" "$API_HOST/api/fastapi?id=$FASTAPI_ID" \
      -H "Authorization: Bearer $BEARER_TOKEN" \
      -H "Accept: application/json")

    FASTAPI_STATUS=$(echo "$FASTAPI_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)
    FASTAPI_BODY=$(echo "$FASTAPI_RESPONSE" | grep -v "\[HTTP_STATUS\]")

    if [ "$FASTAPI_STATUS" == "200" ]; then
      FASTAPI_STATE=$(echo "$FASTAPI_BODY" | jq -r '.[0].launchStatus // .[0].status // "unknown"' 2>/dev/null)
      FASTAPI_NAME=$(echo "$FASTAPI_BODY" | jq -r '.[0].name // "unknown"' 2>/dev/null)
      PROJECT_ID=$(echo "$FASTAPI_BODY" | jq -r '.[0].projectId // empty' 2>/dev/null)

      echo "[INFO] FastAPI App: $FASTAPI_NAME"
      echo "[INFO] Status: $FASTAPI_STATE"
      echo "[INFO] Project ID: $PROJECT_ID"

      # Construct the runtime URL
      if [ -n "$PROJECT_ID" ] && [ -n "$FASTAPI_NAME" ]; then
        RUNTIME_URL="$API_HOST/fastapiapps/$PROJECT_ID/$FASTAPI_NAME"
        echo "[INFO] Runtime URL: $RUNTIME_URL"

        # Test the health endpoint
        echo ""
        echo "[INFO] Testing backend /api/health..."
        HEALTH_RESPONSE=$(curl -s -w "\n[HTTP_STATUS]:%{http_code}" "$RUNTIME_URL/api/health" \
          -H "Authorization: Bearer $BEARER_TOKEN" \
          --max-time 10 2>/dev/null || echo "[HTTP_STATUS]:timeout")

        HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | grep "\[HTTP_STATUS\]" | cut -d':' -f2)

        if [ "$HEALTH_STATUS" == "200" ]; then
          echo "[OK] Backend health check passed"
        elif [ "$HEALTH_STATUS" == "timeout" ]; then
          echo "[WARN] Backend health check timed out (may still be starting)"
        else
          echo "[WARN] Backend health check returned HTTP $HEALTH_STATUS"
        fi
      fi

      if [ "$FASTAPI_STATE" == "RUNNING" ] || [ "$FASTAPI_STATE" == "LAUNCHED" ] || [ "$FASTAPI_STATE" == "ACTIVE" ]; then
        echo "[OK] FastAPI is running"
      else
        echo "[WARN] FastAPI status: $FASTAPI_STATE (may still be starting)"
      fi
    else
      echo "[ERROR] Failed to get FastAPI status (HTTP $FASTAPI_STATUS)"
      FAILED=1
    fi
  else
    echo "[ERROR] Failed to get bearer token (HTTP $TOKEN_STATUS)"
    FAILED=1
  fi
else
  echo "[SKIP] No FASTAPI_ID configured"
fi

echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo "[SUCCESS] Deployment verification complete"
else
  echo "[FAILED] Some checks failed - see above"
fi
echo "=========================================="

exit $FAILED
