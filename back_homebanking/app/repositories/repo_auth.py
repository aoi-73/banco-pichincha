"""Consultas SQL relacionadas con la autenticación del cliente del portal.

El cliente vive en dcliente y se autentica vía usuarios_homebanking.
NO se cruzan dpersonal ni dasesor (universos distintos).
"""
from sqlalchemy import text
from sqlalchemy.engine import Connection

MAX_INTENTOS = 5


def buscar_usuario_por_username(conn: Connection, username: str) -> dict | None:
    """Busca el usuario (case-insensitive) y une dcliente para nombre/codcliente."""
    sql = text(
        """
        SELECT u.pkusuario, u.pkcliente, u.username, u.password_hash,
               u.intentos_fallidos, u.bloqueado, u.activo,
               TRIM(c.codcliente) AS codcliente, c.nomcliente
        FROM usuarios_homebanking u
        JOIN dcliente c ON c.pkcliente = u.pkcliente
        WHERE LOWER(u.username) = LOWER(:username)
        """
    )
    row = conn.execute(sql, {"username": username}).mappings().first()
    return dict(row) if row else None


def registrar_login_exitoso(conn: Connection, pkusuario: int) -> None:
    """Actualiza ultimo_acceso y resetea intentos_fallidos."""
    conn.execute(
        text(
            """
            UPDATE usuarios_homebanking
            SET ultimo_acceso = now(), intentos_fallidos = 0, fecultactualizacion = now()
            WHERE pkusuario = :pk
            """
        ),
        {"pk": pkusuario},
    )
    conn.commit()


def registrar_login_fallido(conn: Connection, pkusuario: int) -> int:
    """Incrementa intentos_fallidos; tras MAX_INTENTOS marca bloqueado='S'.
    Devuelve el nuevo número de intentos.
    """
    nuevos = conn.execute(
        text(
            """
            UPDATE usuarios_homebanking
            SET intentos_fallidos = intentos_fallidos + 1,
                bloqueado = CASE WHEN intentos_fallidos + 1 >= :maxi THEN 'S' ELSE bloqueado END,
                fecultactualizacion = now()
            WHERE pkusuario = :pk
            RETURNING intentos_fallidos
            """
        ),
        {"pk": pkusuario, "maxi": MAX_INTENTOS},
    ).scalar()
    conn.commit()
    return nuevos
