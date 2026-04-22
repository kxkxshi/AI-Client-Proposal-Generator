from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    openrouter_api_key: str
    supabase_jwt_secret: str
    supabase_url: str = ""          # e.g. https://xyz.supabase.co
    app_env: str = "development"
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
