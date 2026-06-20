"""Schemas pydantic para operaciones (pago de cuota, transferencia)."""
from decimal import Decimal

from pydantic import BaseModel, Field


class PagoCuotaRequest(BaseModel):
    codcuentacredito: str
    monto: Decimal | None = Field(default=None, description="Si se omite, paga la cuota completa")
    cuenta_origen: str | None = Field(
        default=None,
        description="Cuenta de ahorro propia desde la que se debita el pago. "
        "Si se omite, solo se registra el pago del crédito (sin debitar ahorro).",
    )


class PagoCuotaResponse(BaseModel):
    mensaje: str
    codcuentacredito: str
    nrocuota: int
    monto_pagado: Decimal
    pkoperacion: int
    cuenta_origen: str | None = None
    pkoperacion_debito_ahorro: int | None = None
    codkardex: str


# --- Pago de servicios ---
class ServicioOut(BaseModel):
    codservicio: str
    nombre: str


class PagoServicioRequest(BaseModel):
    cuenta_origen: str
    codservicio: str
    codsuministro: str = Field(..., description="N° de suministro / recibo / contrato")
    monto: Decimal = Field(..., gt=0)


class PagoServicioResponse(BaseModel):
    mensaje: str
    servicio: str
    codsuministro: str
    cuenta_origen: str
    monto: Decimal
    pkoperacion: int
    codkardex: str


class TransferenciaRequest(BaseModel):
    cuenta_origen: str
    cuenta_destino: str
    monto: Decimal = Field(..., gt=0)


class TransferenciaResponse(BaseModel):
    mensaje: str
    cuenta_origen: str
    cuenta_destino: str
    monto: Decimal
    pkoperacion_debito: int
    pkoperacion_credito: int
