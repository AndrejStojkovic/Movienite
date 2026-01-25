"""add_users_table

Revision ID: b2c9999537da
Revises: 6802bcb30571
Create Date: 2026-01-25 23:22:15.894101

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b2c9999537da'
down_revision: Union[str, Sequence[str], None] = '6802bcb30571'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create users table
    op.execute("""
        CREATE TABLE IF NOT EXISTS users
        (
            id         SERIAL PRIMARY KEY,
            username   TEXT UNIQUE NOT NULL,
            avatar_url TEXT,
            email      TEXT UNIQUE NOT NULL,
            discord_id TEXT UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            is_admin   BOOLEAN DEFAULT FALSE
        )
    """)

    # Add user_id column to movies table and create foreign key
    op.execute("""
        ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS user_id INTEGER NULL,
            ADD CONSTRAINT fk_user
                FOREIGN KEY (user_id)
                    REFERENCES users (id)
                    ON DELETE SET NULL
    """)

    # Create index on user_id
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_movies_user_id ON movies (user_id)
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop index
    op.execute("DROP INDEX IF EXISTS idx_movies_user_id")

    # Drop foreign key constraint and column
    op.execute("""
        ALTER TABLE movies
            DROP CONSTRAINT IF EXISTS fk_user,
            DROP COLUMN IF EXISTS user_id
    """)

    # Drop users table
    op.execute("DROP TABLE IF EXISTS users CASCADE")
