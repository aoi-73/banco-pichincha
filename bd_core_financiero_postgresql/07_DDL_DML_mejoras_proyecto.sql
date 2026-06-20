-- ============================================================================
-- 07_DDL_DML_mejoras_proyecto_banco_andino.sql
-- ----------------------------------------------------------------------------
-- Cambios y mejoras aplicados a bd_core_financiero durante el desarrollo del
-- Core + Homebanking (Banco Andino). Ejecutar DESPUÉS de los scripts 00-06.
--
-- Contenido:
--   A. Tablas puente de identidad   : dpersonalcargo, dpersonalasesor
--   B. Recuperaciones / Mora        : dtipogestioncobranza, fgestioncobranza
--   C. Calendario (relleno)         : dtiempomes / dtiempo (días 2015-2027)
--   D. Catálogo de productos        : reducción a 2 (Empresarial=ME+PE, Consumo)
--   E. Notas de calibración de datos (mora realista) — referencial
--
-- Idempotente: usa IF NOT EXISTS / ON CONFLICT donde aplica.
-- ============================================================================

-- ============================================================================
-- A. TABLAS PUENTE DE IDENTIDAD
--    El modelo original no liga el personal (dpersonal) con su cargo
--    (dcargopersonal) ni con su asesor (dasesor). Estas tablas resuelven el
--    login por rol y la carga de "Mi cartera" del asesor.
-- ============================================================================

-- A.1 Persona <-> Cargo (rol funcional en el token)
CREATE TABLE IF NOT EXISTS dpersonalcargo (
    pkpersonalcargo     SERIAL PRIMARY KEY,
    pkpersonal          INTEGER NOT NULL REFERENCES dpersonal(pkpersonal),
    pkcargopersonal     INTEGER NOT NULL REFERENCES dcargopersonal(pkcargopersonal),
    flagactivo          CHAR(1) NOT NULL DEFAULT 'S',
    fecultactualizacion TIMESTAMP DEFAULT NOW(),
    UNIQUE (pkpersonal)
);

-- A.2 Persona <-> Asesor (pkasesor en el token, para Mi Cartera)
CREATE TABLE IF NOT EXISTS dpersonalasesor (
    pkpersonalasesor    SERIAL PRIMARY KEY,
    pkpersonal          INTEGER NOT NULL REFERENCES dpersonal(pkpersonal),
    pkasesor            INTEGER NOT NULL REFERENCES dasesor(pkasesor),
    flagactivo          CHAR(1) NOT NULL DEFAULT 'S',
    fecultactualizacion TIMESTAMP DEFAULT NOW(),
    UNIQUE (pkpersonal)
);

-- A.3 Asignación de cargos a empleados de prueba (DNI -> codcargopersonal)
--     (E01=Asesor, F02=Administrador, F01=Jefe Regional, F04=Riesgos,
--      F05=Funcionario/Comité, E03=Analista)
INSERT INTO dpersonalcargo (pkpersonal, pkcargopersonal)
SELECT p.pkpersonal, cp.pkcargopersonal
FROM (VALUES
    ('11111111','E01'), ('11111112','F02'), ('11111113','F01'),
    ('11111114','F04'), ('11111115','F05'), ('11111116','E03')
) AS m(dni, codcargo)
JOIN dpersonal p      ON p.numerodni = m.dni
JOIN dcargopersonal cp ON cp.codcargopersonal = m.codcargo
ON CONFLICT (pkpersonal) DO UPDATE SET pkcargopersonal = EXCLUDED.pkcargopersonal;

-- A.4 Resto de empleados sin cargo -> Asesor de Negocios (E01)
INSERT INTO dpersonalcargo (pkpersonal, pkcargopersonal)
SELECT p.pkpersonal, (SELECT pkcargopersonal FROM dcargopersonal WHERE codcargopersonal='E01')
FROM dpersonal p
WHERE NOT EXISTS (SELECT 1 FROM dpersonalcargo dc WHERE dc.pkpersonal = p.pkpersonal);

-- A.5 Asignación de asesores de prueba (DNI -> pkasesor con cartera real)
INSERT INTO dpersonalasesor (pkpersonal, pkasesor)
SELECT p.pkpersonal, m.pkasesor
FROM (VALUES
    ('11111111',31), ('11111112',36), ('11111113',12),
    ('11111114',18), ('11111115',40), ('11111116',78)
) AS m(dni, pkasesor)
JOIN dpersonal p ON p.numerodni = m.dni
ON CONFLICT (pkpersonal) DO UPDATE SET pkasesor = EXCLUDED.pkasesor;

-- A.6 Resto de asesores (round-robin sobre los pkasesor existentes)
INSERT INTO dpersonalasesor (pkpersonal, pkasesor)
SELECT p.pkpersonal,
       (ARRAY(SELECT pkasesor FROM dasesor ORDER BY pkasesor))[
         (ROW_NUMBER() OVER (ORDER BY p.pkpersonal) % (SELECT COUNT(*) FROM dasesor)) + 1]
FROM dpersonal p
JOIN dpersonalcargo pc ON pc.pkpersonal = p.pkpersonal
JOIN dcargopersonal cp ON cp.pkcargopersonal = pc.pkcargopersonal AND cp.codcargopersonal='E01'
WHERE NOT EXISTS (SELECT 1 FROM dpersonalasesor da WHERE da.pkpersonal = p.pkpersonal);


-- ============================================================================
-- B. RECUPERACIONES / MORA (MPR Recuperación del Crédito)
-- ============================================================================

-- B.1 Catálogo de tipos de gestión de cobranza
CREATE TABLE IF NOT EXISTS dtipogestioncobranza (
    pktipogestion       SERIAL PRIMARY KEY,
    codtipogestion      VARCHAR(10) UNIQUE NOT NULL,
    destipogestion      VARCHAR(60) NOT NULL,
    fecultactualizacion TIMESTAMP DEFAULT NOW()
);

INSERT INTO dtipogestioncobranza (codtipogestion, destipogestion) VALUES
    ('SMS',  'Envío de SMS'),
    ('LLAM', 'Llamada telefónica'),
    ('VISI', 'Visita domiciliaria'),
    ('CART', 'Carta / notificación'),
    ('COMP', 'Compromiso de pago'),
    ('JUDI', 'Derivación judicial')
ON CONFLICT (codtipogestion) DO NOTHING;

-- B.2 Registro de gestiones de cobranza sobre créditos morosos
CREATE TABLE IF NOT EXISTS fgestioncobranza (
    pkgestion           BIGSERIAL PRIMARY KEY,
    pkcuentacredito     INTEGER NOT NULL REFERENCES dcuentacredito(pkcuentacredito),
    pktipogestion       INTEGER NOT NULL REFERENCES dtipogestioncobranza(pktipogestion),
    fechagestion        DATE NOT NULL DEFAULT CURRENT_DATE,
    diasatrasoalmomento INTEGER,
    banda               VARCHAR(20),   -- PREVENTIVA|TEMPRANA|TARDIA|JUDICIAL|CASTIGO
    gestor              VARCHAR(20),   -- codpersonal del gestor
    resultado           VARCHAR(120),
    compromisopago      DATE,
    montocomprometido   NUMERIC(14,2),
    fecultactualizacion TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_fgestion_credito ON fgestioncobranza(pkcuentacredito);


-- ============================================================================
-- C. CALENDARIO (relleno de la dimensión de tiempo)
--    foperaciones.periododia es FK a dtiempo; dtiempo.periodomes es FK a
--    dtiempomes. Se rellenan meses y días 2015-2027 para soportar movimientos.
-- ============================================================================

-- C.1 Meses 2015-2027
INSERT INTO dtiempomes (periodomes, mes, anio, descripcionmes, bimestre, trimestre,
                        cuatrimestre, semestre, fecultactualizacion)
SELECT CAST(TO_CHAR(m,'YYYYMM') AS INTEGER), EXTRACT(MONTH FROM m)::int,
       EXTRACT(YEAR FROM m)::int, TO_CHAR(m,'YYYY-MM'),
       CEIL(EXTRACT(MONTH FROM m)/2.0)::int, EXTRACT(QUARTER FROM m)::int,
       CEIL(EXTRACT(MONTH FROM m)/4.0)::int,
       CASE WHEN EXTRACT(MONTH FROM m) <= 6 THEN 1 ELSE 2 END, NOW()
FROM generate_series('2015-01-01'::date,'2027-12-01'::date,'1 month') m
ON CONFLICT (periodomes) DO NOTHING;

-- C.2 Días 2015-2027
INSERT INTO dtiempo (periododia, dia, mes, anio, periodomes, descripciondia, diasemana,
                     diaanio, semanaanio, semanames, descripcionmes, feriado,
                     bimestre, trimestre, cuatrimestre, semestre, fecultactualizacion)
SELECT CAST(TO_CHAR(d,'YYYYMMDD') AS INTEGER), EXTRACT(DAY FROM d)::int,
       EXTRACT(MONTH FROM d)::int, EXTRACT(YEAR FROM d)::int,
       CAST(TO_CHAR(d,'YYYYMM') AS INTEGER), TO_CHAR(d,'DD/MM/YYYY'),
       EXTRACT(ISODOW FROM d)::int, EXTRACT(DOY FROM d)::int,
       EXTRACT(WEEK FROM d)::int, CEIL(EXTRACT(DAY FROM d)/7.0)::int,
       TO_CHAR(d,'YYYY-MM'), 'N', CEIL(EXTRACT(MONTH FROM d)/2.0)::int,
       EXTRACT(QUARTER FROM d)::int, CEIL(EXTRACT(MONTH FROM d)/4.0)::int,
       CASE WHEN EXTRACT(MONTH FROM d) <= 6 THEN 1 ELSE 2 END, NOW()
FROM generate_series('2015-01-01'::date,'2027-12-31'::date,'1 day') d
ON CONFLICT (periododia) DO NOTHING;


-- ============================================================================
-- D. CATÁLOGO DE PRODUCTOS — reducción a 2 (Empresarial=ME+PE, Consumo)
--    Reasigna créditos/operaciones/metas de Hipotecario(04)/Mediana(05)/
--    Gran empresa(06) y luego elimina esos tipos.
--    *** EJECUTAR SOLO SI YA HAY DATOS DE CARTERA CARGADOS (scripts 04/06) ***
-- ============================================================================

-- D.1 Reasignar cartera y operaciones: Mediana/Gran -> Pequeña(02); Hipotecario -> Consumo(03)
DO $$
DECLARE pk_pe INT; pk_co INT;
BEGIN
  SELECT MIN(pkproducto) INTO pk_pe FROM dproducto WHERE codtipocredito='02';
  SELECT MIN(pkproducto) INTO pk_co FROM dproducto WHERE codtipocredito='03';
  IF pk_pe IS NULL OR pk_co IS NULL THEN RETURN; END IF;

  UPDATE fagcuentacredito SET pkproducto=pk_pe
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('05','06'));
  UPDATE fagcuentacredito SET pkproducto=pk_co
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('04'));
  UPDATE foperaciones SET pkproducto=pk_pe
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('05','06'));
  UPDATE foperaciones SET pkproducto=pk_co
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('04'));
  UPDATE fplanpagomes SET pkproducto=pk_pe
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('05','06'));
  UPDATE fplanpagomes SET pkproducto=pk_co
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('04'));
  UPDATE dsolicitud SET pkproducto=pk_pe
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('05','06'));
  UPDATE dsolicitud SET pkproducto=pk_co
    WHERE pkproducto IN (SELECT pkproducto FROM dproducto WHERE codtipocredito IN ('04'));
END $$;

-- D.2 Eliminar productos fuera de alcance del catálogo
DELETE FROM dproducto WHERE codtipocredito IN ('04','05','06');

-- D.3 Metas por tipo (fmetatipocredito): consolidar HI->CO, MD/GE->PE y limpiar dtipocredito
DO $$
DECLARE pk_pe INT; pk_co INT; r RECORD;
BEGIN
  SELECT pktipocredito INTO pk_pe FROM dtipocredito WHERE codtipocredito='PE';
  SELECT pktipocredito INTO pk_co FROM dtipocredito WHERE codtipocredito='CO';
  -- HI -> CO ; MD/GE -> PE  (reasignación simple; si hay choque por periodo, se mantiene la fila destino)
  UPDATE fmetatipocredito SET pktipocredito=pk_co
    WHERE pktipocredito IN (SELECT pktipocredito FROM dtipocredito WHERE codtipocredito='HI')
      AND NOT EXISTS (SELECT 1 FROM fmetatipocredito d WHERE d.pktipocredito=pk_co
                      AND d.periodomes=fmetatipocredito.periodomes);
  UPDATE fmetatipocredito SET pktipocredito=pk_pe
    WHERE pktipocredito IN (SELECT pktipocredito FROM dtipocredito WHERE codtipocredito IN ('MD','GE'))
      AND NOT EXISTS (SELECT 1 FROM fmetatipocredito d WHERE d.pktipocredito=pk_pe
                      AND d.periodomes=fmetatipocredito.periodomes);
  -- eliminar metas remanentes de tipos fuera de alcance y el catálogo
  DELETE FROM fmetatipocredito
    WHERE pktipocredito IN (SELECT pktipocredito FROM dtipocredito WHERE codtipocredito IN ('HI','MD','GE'));
  DELETE FROM dtipocredito WHERE codtipocredito IN ('HI','MD','GE');
END $$;


-- ============================================================================
-- E. NOTA — Calibración de datos (mora realista) [REFERENCIAL, opcional]
--    Durante el proyecto se recalibró la calificación/mora de la cartera a
--    distribuciones reales (Normal ~83%, Pérdida ~11%, mora global ~13%),
--    usando un script Python (scripts/recalibrar_cartera.py del backend).
--    No se incluye aquí como SQL puro porque usa muestreo aleatorio controlado.
--    Si se desea, ejecutarlo desde el backend tras cargar los datos.
-- ============================================================================

-- Fin del script 07.
