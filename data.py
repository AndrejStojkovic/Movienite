import datetime
from dataclasses import dataclass


@dataclass
class User:
    id: str
    username: str
    avatar_url: str | None
    email: str
    discord_id: str
    created_at: datetime.datetime
    is_admin: bool


@dataclass
class NewUser:
    username: str
    avatar_url: str | None
    email: str
    discord_id: str
    created_at: datetime.datetime
    is_admin: bool

    def to_user(self, user_id: str) -> User:
        return User(
            id=user_id,
            username=self.username,
            avatar_url=self.avatar_url,
            email=self.email,
            discord_id=self.discord_id,
            created_at=self.created_at,
            is_admin=self.is_admin
        )