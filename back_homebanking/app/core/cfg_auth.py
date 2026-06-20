"""Dependencia get_cliente: valida el Bearer token y EXIGE tipo=='cliente'.

Un token emitido por el core bancario para personal (tipo != 'cliente')
NO debe servir en este portal.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.cfg_security import decodificar_token

bearer_scheme = HTTPBearer(auto_error=True)


def get_cliente(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    payload = decodificar_token(creds.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if payload.get("tipo") != "cliente":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este token no corresponde a un cliente del portal",
        )
    if payload.get("pkcliente") is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token sin pkcliente")
    return payload
