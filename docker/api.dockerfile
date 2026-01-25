FROM alpine:latest

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY pyproject.toml uv.lock ./
COPY database/db.py /app/database/db.py
COPY *.py /app/

# Copy Alembic configuration and migrations
COPY alembic.ini /app/
COPY alembic /app/alembic

# Copy entrypoint script
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

RUN uv sync --frozen --no-dev

EXPOSE 23245

CMD ["/app/entrypoint.sh"]
