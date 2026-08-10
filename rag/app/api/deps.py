from fastapi import Header, HTTPException

from ..config import get_settings

settings = get_settings()


def require_service(
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_service_secret: str | None = Header(default=None, alias="X-Service-Secret"),
) -> str:
    """Validate that the Express gateway forwarded a real user. The Express server
    validates the JWT and forwards the user id plus a shared secret."""
    if not x_user_id or not x_user_id.strip():
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")
    if not x_service_secret or x_service_secret != settings.rag_service_secret:
        raise HTTPException(status_code=401, detail="Invalid service secret")
    return x_user_id.strip()
