#!/usr/bin/env bash
# KSOR Development Environment Init Script
set -e

# TODO: confirm with team — adjust DB connection details for your environment
DB_HOST="${PGHOST:-localhost}"
DB_PORT="${PGPORT:-5432}"
DB_NAME="${PGDATABASE:-ksor}"
DB_USER="${PGUSER:-ksor_app}"

echo "=== KSOR Dev Environment Init ==="

# 1. Apply database schema
echo "[1/3] Applying database schema..."
# TODO: confirm with team — supply password via PGPASSWORD env var or .pgpass
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f server/database/ksor_schema.sql

# 2. Start FastAPI backend (background)
echo "[2/3] Starting FastAPI backend..."
cd server
# TODO: confirm with team — ensure venv is activated or adjust python path
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# 3. Start Vite frontend (background)
echo "[3/3] Starting Vite frontend..."
cd web
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "=== Dev servers started ==="
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
