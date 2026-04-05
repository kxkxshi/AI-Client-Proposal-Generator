from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import verify_supabase_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Extract and validate the Supabase JWT from the Authorization header.
    Returns the decoded token payload (includes 'sub', 'email', etc.)
    """
    token = credentials.credentials
    payload = verify_supabase_token(token)
    return payload


def get_current_user_id(
    payload: dict = Depends(get_current_user),
) -> str:
    """Returns only the user's UUID string (Supabase 'sub' claim)."""
    return payload["sub"]
