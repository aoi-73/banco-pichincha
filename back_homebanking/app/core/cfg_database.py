"""Engine de SQLAlchemy (SQL crudo con text()) y dependencia get_db.

No se usa ORM declarativo: solo engine + Connection + text().
La BD bd_core_financiero YA EXISTE y es compartida con el core; no se crean tablas.
"""
from sqlalchemy import create_engine
from sqlalchemy.engine import Connection

from app.core.cfg_config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)


def get_db() -> Connection:
    """Entrega una conexión por request. Modo 'commit as you go':
    los controllers que escriben deben llamar conn.commit() explícitamente.
    """
    conn = engine.connect()
    try:
        yield conn
    finally:
        conn.close()
