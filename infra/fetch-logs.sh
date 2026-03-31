#!/bin/bash
# Fetch build/runtime logs from RapidCanvas API
# Usage: ./fetch-logs.sh [--fastapi] [--watch] [--tail N] [--id ID]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Read config
CONFIG_FILE="$SCRIPT_DIR/.rapidcanvas"
if [ -f "$CONFIG_FILE" ]; then
  DATAAPP_ID=$(grep "^DATAAPP_ID=" "$CONFIG_FILE" 2>/dev/null | cut -d'=' -f2 | tr -d ' ')
  FASTAPI_ID=$(grep "^FASTAPI_ID=" "$CONFIG_FILE" 2>/dev/null | cut -d'=' -f2 | tr -d ' ')
fi

API_HOST="${RAPIDCANVAS_API_HOST:-https://app.rapidcanvas.ai}"

# Parse arguments
WATCH=false
TAIL_LINES=0
MODE="dataapp"  # dataapp or fastapi
TARGET_ID=""

show_usage() {
  echo "Usage: $0 [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --fastapi, -f     Fetch FastAPI logs (default: DataApp logs)"
  echo "  --watch, -w       Watch logs in real-time"
  echo "  --tail N, -n N    Show last N lines"
  echo "  --id ID           Override app ID from .rapidcanvas"
  echo ""
  echo "Examples:"
  echo "  $0 --tail 20              # Last 20 lines of DataApp build logs"
  echo "  $0 --fastapi --watch      # Stream FastAPI logs in real-time"
  echo "  $0 -f -n 50               # Last 50 lines of FastAPI logs"
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --fastapi|-f)
      MODE="fastapi"
      shift
      ;;
    --watch|-w)
      WATCH=true
      shift
      ;;
    --tail|-n)
      TAIL_LINES="$2"
      shift 2
      ;;
    --id)
      TARGET_ID="$2"
      shift 2
      ;;
    --help|-h)
      show_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done

# Validate API key
if [ -z "$RAPIDCANVAS_API_KEY" ]; then
  echo "[ERROR] RAPIDCANVAS_API_KEY not set"
  exit 1
fi

# Set target ID based on mode
if [ -n "$TARGET_ID" ]; then
  # User provided explicit ID
  if [ "$MODE" = "fastapi" ]; then
    FASTAPI_ID="$TARGET_ID"
  else
    DATAAPP_ID="$TARGET_ID"
  fi
fi

# Validate we have the required ID
if [ "$MODE" = "fastapi" ]; then
  if [ -z "$FASTAPI_ID" ]; then
    echo "[ERROR] FASTAPI_ID not set. Use --id or configure in .rapidcanvas"
    exit 1
  fi
  echo "[INFO] Mode: FastAPI | ID: $FASTAPI_ID"
else
  if [ -z "$DATAAPP_ID" ]; then
    echo "[ERROR] DATAAPP_ID not set. Use --id or configure in .rapidcanvas"
    exit 1
  fi
  echo "[INFO] Mode: DataApp | ID: $DATAAPP_ID"
fi

# ============================================
# DataApp Logs (GET, JSON response)
# ============================================
fetch_dataapp_logs() {
  local response
  response=$(curl -s -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
    "$API_HOST/api/dataapps/$DATAAPP_ID/logs?mode=offline")

  local logs
  logs=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('logs',''))" 2>/dev/null)

  if [ -z "$logs" ]; then
    echo "[ERROR] Failed to fetch logs or empty response"
    return 1
  fi

  if [ "$TAIL_LINES" -gt 0 ]; then
    echo "$logs" | tail -n "$TAIL_LINES"
  else
    echo "$logs"
  fi
}

check_dataapp_build_status() {
  local logs="$1"
  if echo "$logs" | grep -q "BUILD COMPLETED SUCCESSFULLY"; then
    return 0
  elif echo "$logs" | grep -q "Build failed"; then
    return 1
  else
    return 2  # Still building
  fi
}

watch_dataapp_logs() {
  echo "=========================================="
  echo "Watching DataApp Build Logs"
  echo "DataApp ID: $DATAAPP_ID"
  echo "=========================================="
  echo ""

  LAST_LOG_HASH=""
  while true; do
    LOGS=$(fetch_dataapp_logs 2>/dev/null || echo "")
    CURRENT_HASH=$(echo "$LOGS" | md5sum | cut -d' ' -f1)

    if [ "$CURRENT_HASH" != "$LAST_LOG_HASH" ] && [ -n "$LOGS" ]; then
      clear
      echo "=== DataApp Build Logs ($(date '+%H:%M:%S')) ==="
      if [ "$TAIL_LINES" -gt 0 ]; then
        echo "$LOGS" | tail -n "$TAIL_LINES"
      else
        echo "$LOGS" | tail -n 50
      fi

      check_dataapp_build_status "$LOGS"
      STATUS=$?
      if [ $STATUS -eq 0 ]; then
        echo ""
        echo "[SUCCESS] Build completed!"
        exit 0
      elif [ $STATUS -eq 1 ]; then
        echo ""
        echo "[FAILED] Build failed. Check logs above for errors."
        exit 1
      fi

      LAST_LOG_HASH="$CURRENT_HASH"
    fi

    sleep 3
  done
}

# ============================================
# FastAPI Logs (POST, SSE stream)
# ============================================
fetch_fastapi_logs() {
  # FastAPI uses SSE (Server-Sent Events) via POST
  # Requires Content-Type: application/json with empty body
  local logs
  logs=$(curl -s -N -X POST \
    -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
    -H "Accept: text/event-stream" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "$API_HOST/api/fastapi/$FASTAPI_ID/log-stream" \
    --max-time 15 2>/dev/null | \
    sed -n 's/^data://p')

  if [ -z "$logs" ]; then
    echo "[ERROR] Failed to fetch FastAPI logs or empty response"
    return 1
  fi

  if [ "$TAIL_LINES" -gt 0 ]; then
    echo "$logs" | tail -n "$TAIL_LINES"
  else
    echo "$logs"
  fi
}

stream_fastapi_logs() {
  echo "=========================================="
  echo "Streaming FastAPI Logs (SSE)"
  echo "FastAPI ID: $FASTAPI_ID"
  echo "Press Ctrl+C to stop"
  echo "=========================================="
  echo ""

  # Stream SSE data in real-time using curl with no buffering
  # Requires Content-Type: application/json with empty body
  # Parse SSE format: lines starting with "data:" contain the log message
  curl -s -N -X POST \
    -H "X-API-KEY: $RAPIDCANVAS_API_KEY" \
    -H "Accept: text/event-stream" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "$API_HOST/api/fastapi/$FASTAPI_ID/log-stream" 2>/dev/null | \
    while IFS= read -r line; do
      # SSE format: "data:<message>"
      if [[ "$line" == data:* ]]; then
        # Extract message after "data:"
        msg="${line#data:}"
        echo "$msg"
      fi
    done
}

# ============================================
# Main
# ============================================
if [ "$MODE" = "fastapi" ]; then
  if [ "$WATCH" = true ]; then
    stream_fastapi_logs
  else
    fetch_fastapi_logs
  fi
else
  if [ "$WATCH" = true ]; then
    watch_dataapp_logs
  else
    fetch_dataapp_logs
  fi
fi
