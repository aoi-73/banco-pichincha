"""Schemas pydantic para solicitud de crédito."""
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class SolicitudCreditoRequest(BaseModel):
    montosolicitud: Decimal = Field(..., gt=0)
    plazo: int = Field(..., gt=0, description="Número de cuotas / meses")
    codtipocredito: Literal["ME", "CO"] = Field(..., description="ME=Microempresa, CO=Consumo")
    codactividadeconomica: str
    montoingresoneto: Decimal = Field(..., ge=0)


class SolicitudCreditoResponse(BaseModel):
    mensaje: str
    pksolicitud: int
    codsolicitud: str
    estado: str
    montosolicitud: Decimal
    plazo: int
