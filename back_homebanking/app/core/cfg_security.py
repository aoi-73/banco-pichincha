"""Utilidades de seguridad: hashing bcrypt directo y JWT (python-jose)."""
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.core.cfg_config import settings


# ---------------------------------------------------------------------------
# Passwords con bcrypt DIRECTO (NO passlib: rompe por incompatibilidad de versión)
# ---------------------------------------------------------------------------
def verificar_password(password_plano: str, password_hash: str) -> bool:
    """Compara la contraseña en texto contra el hash bcrypt almacenado."""
    try:
        return bcrypt.checkpw(password_plano.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        # Hash con formato inválido -> no autentica
        return False


def hashear_password(password_plano: str) -> str:
    """Genera un hash bcrypt (útil para crear/actualizar usuarios de prueba)."""
    return bcrypt.hashpw(password_plano.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------
def crear_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decodificar_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
