import httpx
from functools import lru_cache
from supabase import Client, create_client

from app.config import settings


_shared_http_client = httpx.Client(timeout=30.0)


@lru_cache(maxsize=1)
def get_service_client() -> Client:
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY,
        client=_shared_http_client,
    )


def get_user_client(access_token: str) -> Client:
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY,
        access_token=access_token,
        client=_shared_http_client,
    )
