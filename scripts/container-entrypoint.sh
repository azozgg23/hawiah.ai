#!/usr/bin/env bash
set -e

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo "Received shutdown signal, cleaning up..."
    if [ -n "$BACKEND_PID" ]; then
        kill -TERM "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    fi
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    echo "Cleanup complete."
}

trap cleanup SIGTERM SIGINT

MISSING_VARS=""
[ -z "$SUPABASE_URL" ] && MISSING_VARS="$MISSING_VARS SUPABASE_URL"
[ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && MISSING_VARS="$MISSING_VARS SUPABASE_SERVICE_ROLE_KEY"
[ -z "$SUPABASE_ANON_KEY" ] && MISSING_VARS="$MISSING_VARS SUPABASE_ANON_KEY"
[ -z "$SUPABASE_JWT_SECRET" ] && MISSING_VARS="$MISSING_VARS SUPABASE_JWT_SECRET"

if [ -n "$MISSING_VARS" ]; then
    echo "ERROR: Missing required environment variables:$MISSING_VARS"
    echo "Please set all required variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET"
    exit 1
fi

echo "Starting backend..."
cd /app/backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "Waiting for backend to be ready..."
TIMEOUT=30
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
    if python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" 2>/dev/null; then
        echo "Backend is ready."
        break
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "ERROR: Backend failed to start within ${TIMEOUT} seconds"
    kill -TERM "$BACKEND_PID" 2>/dev/null || true
    exit 1
fi

echo "Starting frontend..."
cd /app/frontend
HOSTNAME=0.0.0.0 PORT=3000 node server.js &
FRONTEND_PID=$!

echo "Both services started. Monitoring processes..."
set +e
wait -n "$BACKEND_PID" "$FRONTEND_PID"
EXIT_CODE=$?
set -e

cleanup
exit $EXIT_CODE
