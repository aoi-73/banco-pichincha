"""Controlador de consultas de cuentas (ahorro, crédito, movimientos, cuotas)."""
from fastapi import HTTPException, status
from sqlalchemy.engine import Connection

from app.repositories import repo_cuentas


def listar_ahorros(conn: Connection, pkcliente: int) -> list[dict]:
    return repo_cuentas.listar_ahorros(conn, pkcliente)


def movimientos_ahorro(
    conn: Connection, pkcliente: int, codcuentaahorro: str, limit: int
) -> list[dict]:
    cuenta = repo_cuentas.buscar_cuenta_ahorro(conn, codcuentaahorro)
    if cuenta is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuenta no encontrada")
    if cuenta["pkcliente"] != pkcliente:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="La cuenta no pertenece al cliente"
        )
    return repo_cuentas.listar_movimientos(conn, cuenta["pkcuentaahorro"], limit)


def detalle_ahorro(conn: Connection, pkcliente: int, codcuentaahorro: str) -> dict:
    """Detalle específico según el subproducto de la cuenta de ahorro (PF/CTS/AP)."""
    d = repo_cuentas.detalle_subproducto_ahorro(conn, codcuentaahorro)
    if d is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuenta no encontrada")
    if d["pkcliente"] != pkcliente:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="La cuenta no pertenece al cliente"
        )

    cod = d["codtipocuentaahorro"]
    resp = {
        "codcuentaahorro": d["codcuentaahorro"].strip(),
        "tipo": d["destipocuentaahorro"],
        "codtipo": cod,
    }

    if cod == "PF":
        resp["plazo_fijo"] = {
            "fecha_vigencia": d["fechavigencia_pf"],
            "nro_dias_plazo": d["nrodiasplazofijo_pf"],
            "saldo_capital": d["montosaldocapital_pf"],
            "interes_pactado": d["montointerespactado_pf"],
            "interes_devengado": d["montointeresdevengado_pf"],
            "interes_pagado": d["montointerespagado_pf"],
            "tasa_pagada": d["tasapagada_pf"],
            "nro_renovaciones": d["numerorenovacion_pf"],
        }
    elif cod == "CT":
        intangible = d["montocapitalintangible_cts"] + d["montointeresintangible_cts"]
        total = d["montocapital_cts"] + d["montointeres_cts"]
        resp["cts"] = {
            "capital": d["montocapital_cts"],
            "interes": d["montointeres_cts"],
            "capital_intangible": d["montocapitalintangible_cts"],
            "interes_intangible": d["montointeresintangible_cts"],
            "disponible": total - intangible,
        }
    elif cod == "AP":
        cronograma = repo_cuentas.cronograma_ahorro_programado(conn, d["pkcuentaahorro"])
        resp["ahorro_programado"] = {
            "capital": d["montocapital_ap"],
            "monto_cuota": d["montocuota_ap"],
            "nro_cuotas": d["nrocuota_ap"],
            "tasa_incentivo": d["tasaincentivo_ap"],
            "fecha_vigencia": d["fechavigencia_ap"],
            "cronograma": cronograma,
        }
    else:  # AC - Ahorro Corriente: sin detalle adicional de subproducto
        resp["mensaje"] = "Cuenta de ahorro corriente: sin detalle de subproducto adicional"

    return resp


def listar_creditos(conn: Connection, pkcliente: int) -> list[dict]:
    return repo_cuentas.listar_creditos(conn, pkcliente)


def cuotas_credito(conn: Connection, pkcliente: int, codcuentacredito: str) -> list[dict]:
    credito = repo_cuentas.buscar_cuenta_credito(conn, codcuentacredito)
    if credito is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crédito no encontrado")
    if credito["pkcliente"] != pkcliente:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="El crédito no pertenece al cliente"
        )
    return repo_cuentas.listar_cuotas(conn, credito["pkcuentacredito"])
