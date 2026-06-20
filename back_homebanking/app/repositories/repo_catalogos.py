"""Resolución de PKs de catálogos por su código (NO se hardcodean PKs).

Los códigos de catálogo son estables; sus PKs se cachean en memoria tras
la primera consulta para evitar ir a la BD en cada operación.
"""
from sqlalchemy import text
from sqlalchemy.engine import Connection

# cache: (tabla, codigo) -> pk
_cache: dict[tuple[str, str], int] = {}

# Definición de cada catálogo: tabla -> (columna_pk, columna_codigo)
_CATALOGOS = {
    "dtipooperacion": ("pktipooperacion", "codtipooperacion"),
    "dconceptooperacion": ("pkconceptooperacion", "codconceptooperacion"),
    "dmediopago": ("pkmediopago", "codmediopago"),
    "dcanaltransaccional": ("pkcanaltransaccional", "codcanaltransaccional"),
    "dcondicioncontable": ("pkcondicioncontable", "codcondicioncontable"),
    "dmoneda": ("pkmoneda", "codmoneda"),
}


def resolver_pk(conn: Connection, tabla: str, codigo: str) -> int:
    """Devuelve el PK de un registro de catálogo dado su código."""
    clave = (tabla, codigo)
    if clave in _cache:
        return _cache[clave]
    if tabla not in _CATALOGOS:
        raise ValueError(f"Catálogo no soportado: {tabla}")
    pk_col, cod_col = _CATALOGOS[tabla]
    # Se compara con TRIM porque varios códigos son CHAR de ancho fijo (con espacios).
    sql = text(f"SELECT {pk_col} FROM {tabla} WHERE TRIM({cod_col}) = :cod")
    pk = conn.execute(sql, {"cod": codigo}).scalar()
    if pk is None:
        raise ValueError(f"Código '{codigo}' no encontrado en {tabla}")
    _cache[clave] = pk
    return pk


# Atajos legibles ---------------------------------------------------------
def pk_tipooperacion(conn, cod):  # CRE, DEB, TRF, PAG, GIR, AJU
    return resolver_pk(conn, "dtipooperacion", cod)


def pk_concepto(conn, cod):  # DCAP, PCAP, PINT, ... TRAN
    return resolver_pk(conn, "dconceptooperacion", cod)


def pk_mediopago(conn, cod):  # APP, WEB, EFE, TRF...
    return resolver_pk(conn, "dmediopago", cod)


def pk_canal(conn, cod):  # WEB, APP, VEN...
    return resolver_pk(conn, "dcanaltransaccional", cod)


def pk_condicioncontable(conn, cod):  # '01' Vigente Normal
    return resolver_pk(conn, "dcondicioncontable", cod)


def pk_moneda(conn, cod):  # SO, DO, EU
    return resolver_pk(conn, "dmoneda", cod)
