import os
from urllib.parse import urlencode

import httpx
from dotenv import load_dotenv

load_dotenv()

discord_client_id = os.getenv("DISCORD_CLIENT_ID")
discord_client_secret = os.getenv("DISCORD_CLIENT_SECRET")
redirect_uri = os.getenv("DISCORD_REDIRECT_URI")
scopes = ["identify", "email"]


def get_oauth_url():
    base_url = "https://discord.com/api/oauth2/authorize"
    query_string = urlencode({
        'client_id': discord_client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': ' '.join(scopes),
    })

    return f"{base_url}?{query_string}"


def get_access_token(code: str):
    token_url = "https://discord.com/api/oauth2/token"
    data = {
        'client_id': discord_client_id,
        'client_secret': discord_client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = httpx.post(token_url, data=data, headers=headers)
    response.raise_for_status()
    token_data = response.json()

    return token_data['access_token'], token_data['refresh_token']


def get_discord_user(discord_access_token: str):
    user_url = "https://discord.com/api/users/@me"
    headers = {
        'Authorization': f'Bearer {discord_access_token}'
    }
    response = httpx.get(user_url, headers=headers)
    response.raise_for_status()

    return response.json()
