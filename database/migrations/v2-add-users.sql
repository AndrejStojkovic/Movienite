CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    username   TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    email      TEXT UNIQUE NOT NULL,
    discord_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_admin   BOOLEAN DEFAULT FALSE
);

ALTER TABLE movies
    ADD COLUMN IF NOT EXISTS user_id INTEGER NULL,
    ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_movies_user_id ON movies (user_id);
