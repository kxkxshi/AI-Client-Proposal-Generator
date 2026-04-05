"""
JWT verification for Supabase tokens.

Supabase new projects (2024+) use ES256 (Elliptic Curve asymmetric signing).
Tokens are verified using the public keys from Supabase's JWKS endpoint.
Older projects used HS256 with the JWT Secret — both are supported here.
"""
import logging
import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, status
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Cached JWKS keys — fetched once on first request, reused for all subsequent ones.
# Restart the server if Supabase rotates keys (rare).
_jwks_cache: dict | None = None


def _fetch_jwks() -> dict:
    """Fetch Supabase's JSON Web Key Set (public keys for ES256 verification)."""
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    jwks_url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
    logger.info(f"Fetching JWKS from: {jwks_url}")
    try:
        response = httpx.get(jwks_url, timeout=10.0)
        response.raise_for_status()
        _jwks_cache = response.json()
        logger.info(f"JWKS loaded: {len(_jwks_cache.get('keys', []))} key(s)")
        return _jwks_cache
    except Exception as e:
        logger.error(f"Failed to fetch JWKS: {e}")
        return {"keys": []}


def _find_key_in_jwks(kid: str) -> dict | None:
    """Find a public key by kid from the cached JWKS."""
    jwks = _fetch_jwks()
    keys = jwks.get("keys", [])
    # Match by kid
    matched = next((k for k in keys if k.get("kid") == kid), None)
    if matched:
        return matched
    # Fallback: if only one key, use it
    if len(keys) == 1:
        logger.warning(f"No key matched kid='{kid}', using only available key.")
        return keys[0]
    logger.error(f"No matching key found for kid='{kid}'. Available kids: {[k.get('kid') for k in keys]}")
    return None


def verify_supabase_token(token: str) -> dict:
    """
    Validate a JWT token issued by Supabase.

    - ES256 tokens (new Supabase projects): verified using JWKS public keys
    - HS256 tokens (old Supabase projects): verified using SUPABASE_JWT_SECRET

    Returns the decoded payload (includes 'sub' = user UUID).
    Raises HTTP 401 if invalid or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # ── 1. Decode header (no verification) to find algorithm + kid ────────────
    try:
        header = jwt.get_unverified_header(token)
    except JWTError as e:
        logger.error(f"Failed to decode token header: {e}")
        raise credentials_exception

    alg = header.get("alg", "HS256")
    kid = header.get("kid")
    logger.debug(f"Token alg={alg} kid={kid}")

    # ── 2. Get the appropriate verification key ───────────────────────────────
    if alg in ("ES256", "RS256", "ES384", "RS384"):
        # Asymmetric: use JWKS public key
        if not settings.supabase_url:
            logger.error("SUPABASE_URL not set in .env — cannot fetch JWKS for ES256 verification")
            raise credentials_exception
        key = _find_key_in_jwks(kid) if kid else None
        if key is None:
            # Try refreshing JWKS cache and retry once
            global _jwks_cache
            _jwks_cache = None
            key = _find_key_in_jwks(kid) if kid else None
        if key is None:
            raise credentials_exception
        algorithms = [alg]
    else:
        # Symmetric HS256: use the JWT secret
        key = settings.supabase_jwt_secret
        algorithms = ["HS256"]

    # ── 3. Verify signature + claims ─────────────────────────────────────────
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=algorithms,
            options={"verify_aud": False},
        )
        user_id: str = payload.get("sub")
        if not user_id:
            logger.error("Token verified but missing 'sub' claim")
            raise credentials_exception

        logger.info(f"Token verified (alg={alg}) for user: {user_id}")
        return payload

    except JWTError as e:
        logger.error(f"JWT verification failed (alg={alg}): {e}")
        raise credentials_exception
