"""
Setup de la tabla puente persona <-> credenciales (Auditoría Criterio 3, punto 1).

El login del Core comparaba `password != numerodni` en texto plano. Este script:
  1. Crea la tabla `dpersonalcredenciales` (idempotente).
  2. Siembra un password_hash (bcrypt) por cada empleado, usando su DNI como
     contraseña de prueba (valor de demo, pero guardado hasheado).

Ejecutar:  venv/Scripts/python.exe scripts/setup_dpersonalcredenciales.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import bcrypt                                # noqa: E402
from sqlalchemy import create_engine, text   # noqa: E402
from app.core.cfg_config import settings     # noqa: E402

DDL = """
CREATE TABLE IF NOT EXISTS dpersonalcredenciales (
    pkpersonalcredenciales SERIAL PRIMARY KEY,
    pkpersonal             INTEGER NOT NULL REFERENCES dpersonal(pkpersonal),
    password_hash          VARCHAR(100) NOT NULL,
    fecultactualizacion    TIMESTAMP DEFAULT NOW(),
    UNIQUE (pkpersonal)
);
"""


def hash_password(p: str) -> str:
    """Hash bcrypt directo (evita el bug passlib<->bcrypt). Demo."""
    return bcrypt.hashpw(p.encode()[:72], bcrypt.gensalt()).decode()


def main():
    engine = create_engine(settings.DATABASE_URL)
    with engine.begin() as c:
        c.execute(text(DDL))
        print("[OK] tabla dpersonalcredenciales lista")

        personal = c.execute(text("SELECT pkpersonal, numerodni FROM dpersonal")).fetchall()
        n = 0
        for pkpersonal, numerodni in personal:
            c.execute(text("""
                INSERT INTO dpersonalcredenciales (pkpersonal, password_hash)
                VALUES (:p, :h)
                ON CONFLICT (pkpersonal) DO NOTHING
            """), {"p": pkpersonal, "h": hash_password(numerodni)})
            n += 1
        print(f"[OK] credenciales sembradas/verificadas para {n} empleados (password de prueba = DNI)")

    print("\nSetup completado.")


if __name__ == "__main__":
    main()
