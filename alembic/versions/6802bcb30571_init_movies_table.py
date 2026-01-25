"""init_movies_table

Revision ID: 6802bcb30571
Revises: 
Create Date: 2026-01-25 23:22:03.192338

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '6802bcb30571'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create movies table
    op.execute("""
        CREATE TABLE IF NOT EXISTS movies
        (
            id             TEXT PRIMARY KEY,
            title          TEXT NOT NULL,
            original_title TEXT,
            description    TEXT,
            letterboxd_url TEXT,
            imdb_url       TEXT,
            boobies        BOOLEAN DEFAULT FALSE,
            watched        BOOLEAN DEFAULT FALSE,
            image_link     TEXT,
            rating         NUMERIC(2,1),
            votes          TEXT,
            inserted_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
    """)

    # Create index
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_movies_watched ON movies(watched)
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TABLE IF EXISTS movies CASCADE")
