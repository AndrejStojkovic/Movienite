#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 2

echo "Running database migrations..."
uv run alembic upgrade head

echo "Starting application..."
exec uv run uvicorn main:app --host 0.0.0.0 --port 23245
