"""Router de operaciones (pago de cuota, transferencia, pago de servicios). Exigen get_cliente."""
from fastapi import APIRouter, Depends
from sqlalchemy.engine import Connection

from app.controllers import ctrl_operaciones
from app.core.cfg_auth import get_cliente
from app.core.cfg_database import get_db
from app.schemas.sch_operaciones import (
    PagoCuotaRequest,
    PagoCuotaResponse,
    PagoServicioRequest,
    PagoServicioResponse,
    ServicioOut,
    TransferenciaRequest,
    TransferenciaResponse,
)

router = APIRouter(prefix="/operaciones", tags=["operaciones"], dependencies=[Depends(get_cliente)])


@router.post("/pago-cuota", response_model=PagoCuotaResponse)
def pago_cuota(
    body: PagoCuotaRequest,
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    return ctrl_operaciones.pago_cuota(
        conn, cliente["pkcliente"], body.codcuentacredito, body.monto, body.cuenta_origen
    )


@router.post("/transferencia", response_model=TransferenciaResponse)
def transferencia(
    body: TransferenciaRequest,
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    return ctrl_operaciones.transferencia(
        conn, cliente["pkcliente"], body.cuenta_origen, body.cuenta_destino, body.monto
    )


@router.get("/servicios", response_model=list[ServicioOut])
def servicios(cliente: dict = Depends(get_cliente)):
    """Catálogo de servicios disponibles para pagar (set acotado; no hay biller en la BD)."""
    return ctrl_operaciones.listar_servicios()


@router.post("/pago-servicio", response_model=PagoServicioResponse)
def pago_servicio(
    body: PagoServicioRequest,
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    return ctrl_operaciones.pago_servicio(
        conn, cliente["pkcliente"], body.cuenta_origen, body.codservicio, body.codsuministro, body.monto
    )
