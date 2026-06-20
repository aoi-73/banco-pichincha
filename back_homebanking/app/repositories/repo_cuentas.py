"""Consultas SQL de cuentas: ahorro, crédito, movimientos y cronograma."""
from sqlalchemy import text
from sqlalchemy.engine import Connection

# Periodo de la cartera de créditos (fagcuentacredito) verificado en la BD.
PERIODO_CARTERA = 202512


def listar_ahorros(conn: Connection, pkcliente: int) -> list[dict]:
    """Cuentas de ahorro del cliente uniendo el snapshot más reciente de fcuentaahorro."""
    sql = text(
        """
        SELECT a.codcuentaahorro,
               tca.destipocuentaahorro            AS tipo,
               f.montosaldocapitaltotal           AS saldo,
               ec.desestadocuenta                 AS estado,
               m.desmoneda                        AS moneda,
               f.tasaefectivaanual                AS tea
        FROM dcuentaahorro a
        JOIN fcuentaahorro f
          ON f.pkcuentaahorro = a.pkcuentaahorro
         AND f.periododia = (
               SELECT MAX(f2.periododia) FROM fcuentaahorro f2
               WHERE f2.pkcuentaahorro = a.pkcuentaahorro)
        JOIN dtipocuentaahorro tca ON tca.pktipocuentaahorro = f.pktipocuentaahorro
        JOIN destadocuenta ec      ON ec.pkestadocuenta      = f.pkestadocuenta
        JOIN dmoneda m             ON m.pkmoneda             = f.pkmoneda
        WHERE a.pkcliente = :pk
        ORDER BY a.codcuentaahorro
        """
    )
    return [dict(r) for r in conn.execute(sql, {"pk": pkcliente}).mappings().all()]


def buscar_cuenta_ahorro(conn: Connection, codcuentaahorro: str) -> dict | None:
    """Datos base de una cuenta de ahorro (pk, cliente, agencia, moneda, saldo)."""
    sql = text(
        """
        SELECT a.pkcuentaahorro, a.pkcliente, a.codcuentaahorro,
               f.pkagencia, f.pkmoneda, f.pkproductoahorro,
               f.montosaldocapitaltotal AS saldo
        FROM dcuentaahorro a
        JOIN fcuentaahorro f
          ON f.pkcuentaahorro = a.pkcuentaahorro
         AND f.periododia = (
               SELECT MAX(f2.periododia) FROM fcuentaahorro f2
               WHERE f2.pkcuentaahorro = a.pkcuentaahorro)
        WHERE TRIM(a.codcuentaahorro) = :cod
        """
    )
    row = conn.execute(sql, {"cod": codcuentaahorro}).mappings().first()
    return dict(row) if row else None


def listar_movimientos(conn: Connection, pkcuentaahorro: int, limit: int) -> list[dict]:
    """Movimientos de una cuenta de ahorro desde foperaciones."""
    sql = text(
        """
        SELECT o.fechahoraoperacion::date     AS fecha,
               co.desconceptooperacion        AS concepto,
               ct.descanaltransaccional       AS canal,
               mp.desmediopago                AS medio,
               o.montooperacion               AS monto,
               o.codtipoegresoingreso         AS signo
        FROM foperaciones o
        JOIN dconceptooperacion co  ON co.pkconceptooperacion = o.pkconceptooperacion
        LEFT JOIN dcanaltransaccional ct ON ct.pkcanaltransaccional = o.pkcanaltransaccional
        LEFT JOIN dmediopago mp     ON mp.pkmediopago = o.pkmediopago
        WHERE o.pkcuentaahorro = :pk
        ORDER BY o.fechahoraoperacion DESC, o.pkoperacion DESC
        LIMIT :lim
        """
    )
    return [dict(r) for r in conn.execute(sql, {"pk": pkcuentaahorro, "lim": limit}).mappings().all()]


def listar_creditos(conn: Connection, pkcliente: int) -> list[dict]:
    """Créditos del cliente en el periodo de cartera (fagcuentacredito).

    'pago_pendiente' = montosaldocliente (saldo total que el cliente adeuda).
    """
    sql = text(
        """
        SELECT cr.codcuentacredito,
               fa.fechadesembolsocredito  AS fecha_desembolso,
               fa.montosaldocapital       AS saldo_capital,
               fa.montosaldocliente       AS pago_pendiente,
               fa.diasatrasocredito       AS dias_atraso,
               cal.descalificacioncrediticia AS calificacion
        FROM dcuentacredito cr
        JOIN fagcuentacredito fa
          ON fa.pkcuentacredito = cr.pkcuentacredito AND fa.periodomes = :periodo
        LEFT JOIN dcalificacioncrediticia cal
          ON cal.pkcalificacioncrediticia = fa.pkcalificacioncrediticiainterna
        WHERE cr.pkcliente = :pk
        ORDER BY cr.codcuentacredito
        """
    )
    return [
        dict(r)
        for r in conn.execute(sql, {"pk": pkcliente, "periodo": PERIODO_CARTERA}).mappings().all()
    ]


def buscar_cuenta_credito(conn: Connection, codcuentacredito: str) -> dict | None:
    """Datos base de un crédito + agencia/moneda/producto/asesor del periodo de cartera."""
    sql = text(
        """
        SELECT cr.pkcuentacredito, cr.pkcliente, cr.codcuentacredito,
               fa.pkagencia, fa.pkmoneda, fa.pkproducto, fa.pkasesor
        FROM dcuentacredito cr
        LEFT JOIN fagcuentacredito fa
          ON fa.pkcuentacredito = cr.pkcuentacredito AND fa.periodomes = :periodo
        WHERE TRIM(cr.codcuentacredito) = :cod
        """
    )
    row = conn.execute(
        sql, {"cod": codcuentacredito, "periodo": PERIODO_CARTERA}
    ).mappings().first()
    return dict(row) if row else None


def detalle_subproducto_ahorro(conn: Connection, codcuentaahorro: str) -> dict | None:
    """Trae el snapshot más reciente de fcuentaahorro con el código de tipo y los
    campos específicos de cada subproducto (PF / CTS / AP). Incluye pkcliente para
    validar pertenencia y pkcuentaahorro para el cronograma del Ahorro Programado.
    """
    sql = text(
        """
        SELECT a.pkcuentaahorro, a.pkcliente, a.codcuentaahorro,
               t.codtipocuentaahorro, t.destipocuentaahorro,
               f.fechavigencia_pf, f.nrodiasplazofijo_pf, f.montosaldocapital_pf,
               f.montointerespactado_pf, f.montointeresdevengado_pf,
               f.montointerespagado_pf, f.tasapagada_pf, f.numerorenovacion_pf,
               f.montocapital_cts, f.montointeres_cts,
               f.montocapitalintangible_cts, f.montointeresintangible_cts,
               f.montocapital_ap, f.montocuota_ap, f.nrocuota_ap,
               f.tasaincentivo_ap, f.fechavigencia_ap
        FROM dcuentaahorro a
        JOIN fcuentaahorro f
          ON f.pkcuentaahorro = a.pkcuentaahorro
         AND f.periododia = (
               SELECT MAX(f2.periododia) FROM fcuentaahorro f2
               WHERE f2.pkcuentaahorro = a.pkcuentaahorro)
        JOIN dtipocuentaahorro t ON t.pktipocuentaahorro = f.pktipocuentaahorro
        WHERE TRIM(a.codcuentaahorro) = :cod
        """
    )
    row = conn.execute(sql, {"cod": codcuentaahorro}).mappings().first()
    return dict(row) if row else None


def cronograma_ahorro_programado(conn: Connection, pkcuentaahorro: int) -> list[dict]:
    """Calendario de depósitos del Ahorro Programado desde fcuentaahorroprogramado."""
    sql = text(
        """
        SELECT TRIM(coddeposito)        AS coddeposito,
               fechadepositocuota       AS fecha_programada,
               fechaefectuadocuota      AS fecha_efectuada,
               montocuota               AS monto_cuota,
               montoamortizado          AS monto_amortizado,
               nrodiasretrazo           AS dias_retraso,
               codestadocuota           AS estado,
               (fechaefectuadocuota IS NOT NULL) AS depositada
        FROM fcuentaahorroprogramado
        WHERE pkcuentaahorro = :pk
        ORDER BY coddeposito
        """
    )
    return [dict(r) for r in conn.execute(sql, {"pk": pkcuentaahorro}).mappings().all()]


def listar_cuotas(conn: Connection, pkcuentacredito: int) -> list[dict]:
    """Cronograma de cuotas desde fplanpagomes.

    El marcador real de pago es fechapagocuota (NULL = pendiente). El campo
    codestadocuota '01'=vigente / '02'=vencida (no es flag de pago).
    """
    sql = text(
        """
        SELECT nrocuota,
               fechavencimientopagocuota  AS fecha_vencimiento,
               montocuota                 AS monto_cuota,
               montosaldo                 AS monto_saldo,
               diasatrasocuota            AS dias_atraso,
               codestadocuota             AS estado,
               (fechapagocuota IS NOT NULL) AS pagada
        FROM fplanpagomes
        WHERE pkcuentacredito = :pk
        ORDER BY nrocuota
        """
    )
    return [dict(r) for r in conn.execute(sql, {"pk": pkcuentacredito}).mappings().all()]
