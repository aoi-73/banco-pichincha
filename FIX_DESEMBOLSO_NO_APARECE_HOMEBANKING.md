# Fix — El desembolso no aparece en el Homebanking (rompe Criterio 1)

## Síntoma
Se aprueba y desembolsa una solicitud desde el Core. El Core marca la
solicitud como "Desembolsado" correctamente. El cliente entra al Homebanking
y **no ve el crédito nuevo** en su lista de créditos.

## Causa raíz (confirmada en el código)

`back_core_financiero/app/repositories/rep_evaluacion.py` → función
`desembolsar()`:

```python
def desembolsar(db: Session, sol) -> dict:
    ...
    cc = db.execute(text("""
        INSERT INTO dcuentacredito (...)
        ...
    """), {...}).fetchone()
    ...
    db.execute(text("""
        INSERT INTO foperaciones (...)   -- movimiento de desembolso
        ...
    """), {...})
    db.commit()
    return {...}
```

Esta función inserta en `dcuentacredito` (la cuenta) y en `foperaciones` (el
movimiento contable), pero **nunca inserta una fila en `fagcuentacredito`**
— la tabla de hechos que guarda saldos, tasa, días de atraso y estado del
crédito por periodo.

El Homebanking (`back_homebanking/app/repositories/repo_cuentas.py` →
`listar_creditos()`) exige esa fila con un **INNER JOIN**:

```sql
FROM dcuentacredito cr
JOIN fagcuentacredito fa
  ON fa.pkcuentacredito = cr.pkcuentacredito AND fa.periodomes = :periodo  -- 202512
WHERE cr.pkcliente = :pk
```

Sin fila en `fagcuentacredito` para `periodomes = 202512`, el `JOIN` no
devuelve nada → el crédito es invisible para el cliente, aunque exista en
`dcuentacredito` y el Core lo marque como desembolsado.

## Bug relacionado (mismo origen, afecta Criterio 2): TEA incorrecta en el cronograma

`back_core_financiero/app/controllers/ctl_creditos.py` → `generar_cronograma()`:

```python
tea = ctl_scoring.TEA_POR_TIPO.get(
    (sol.codtiposolicitud or "CO"), {"mid": 40.0}
)["mid"]
```

Usa `sol.codtiposolicitud`, que **no es el tipo de crédito** (ME/PE/CO/HI/GE)
— es un código de "tipo de solicitud" que siempre vale `'01'` ("Crédito
Nuevo"). `TEA_POR_TIPO` no tiene la clave `'01'`, así que **siempre cae al
fallback `{"mid": 40.0}`**, sin importar si el crédito es Microempresa,
Consumo, etc. El tipo de crédito real vive en `dproducto.codtipocredito`,
accesible solo vía `sol.pkproducto` (join), no como columna directa de
`dsolicitud`.

Efecto práctico: todo cronograma generado hasta ahora usó 40% en vez del
35% real de Microempresa (o el que corresponda al tipo real).

## Causa de fondo (para que Claude Code entienda el porqué, no solo el parche)

El score/TEA se calcula una sola vez, en `crear_solicitud()`, y se devuelve
en la respuesta del POST — pero **no se persiste en ninguna tabla**. Por eso
tanto `generar_cronograma()` como `desembolsar()` tienen que "adivinar" la
TEA usando un atajo (`TEA_POR_TIPO` + un campo equivocado), en vez de leer
la tasa que realmente se aprobó.

## Fix propuesto

### 1. Helper único para obtener el tipo de crédito real de una solicitud

En `rep_solicitudes.py` (o donde tenga sentido), agregar:

```python
def obtener_codtipocredito(db: Session, pksolicitud: int) -> str:
    """Tipo de crédito real (ME/PE/CO/HI/GE) vía dsolicitud -> dproducto."""
    row = db.execute(text("""
        SELECT p.codtipocredito
        FROM dsolicitud s
        JOIN dproducto p ON p.pkproducto = s.pkproducto
        WHERE s.pksolicitud = :pk
    """), {"pk": pksolicitud}).scalar()
    return (row or "CO").strip()
```

### 2. Corregir `generar_cronograma()` para usar el tipo real

Reemplazar:
```python
tea = ctl_scoring.TEA_POR_TIPO.get(
    (sol.codtiposolicitud or "CO"), {"mid": 40.0}
)["mid"]
```
por:
```python
codtipocredito = repsol.obtener_codtipocredito(db, sol.pksolicitud)
tea = ctl_scoring.TEA_POR_TIPO.get(codtipocredito, {"mid": 40.0})["mid"]
```

### 3. Corregir `desembolsar()` para que también inserte en `fagcuentacredito`

Después de crear `dcuentacredito` y antes/después de `foperaciones`, agregar
un INSERT a `fagcuentacredito` con el mismo `periodomes = 202512` que usa el
resto del sistema (ver `PERIODO` en `rep_evaluacion.py` y `PERIODO_CARTERA`
en el Homebanking). Columnas obligatorias (`NOT NULL`) a llenar, con la
fuente de cada valor:

| Columna | De dónde sale |
|---|---|
| `periodomes` | Constante `202512` (igual que el resto del sistema) |
| `pkcuentacredito` | El `pkcuentacredito` recién creado (`cc.pkcuentacredito`) |
| `pkestadocredito` | `destadocredito` código `'01'` (Vigente) |
| `nrocuotas` | `sol.plazosolicitudcredito` |
| `montoaprobadocredito` | `monto` (mismo que ya usa `desembolsar` hoy) |
| `pkproducto` | `sol.pkproducto` |
| `pkmoneda` | El mismo `cat.mon` que ya se usa para `foperaciones` |
| `tasainterescompensatoria` | `TEA_POR_TIPO[codtipocredito]["mid"]` (usar el helper del punto 1) |
| `tasainteresmoratoria` | `tasainterescompensatoria * 1.5` (mismo patrón que usa el resto de la BD, ver `08_DML_actualizacion_tarifario_microempresa.sql`) |
| `fechadesembolsocredito` | `hoy.date()` |
| `pkcliente` | `sol.pkcliente` |
| `pkagencia` | `sol.pkagencia` (ya existe en `dsolicitud`) |
| `pkasesor` | `sol.pkasesor` (ya existe en `dsolicitud`) |

Además, para que el saldo se vea correcto en Homebanking y en el Core
(`montosaldocapital`, `montosaldocliente` — tienen `DEFAULT 0`, pero un
crédito recién desembolsado debería mostrar el monto completo como deuda):

```python
"montosaldocapital": monto,
"montosaldocliente": monto,
"car_vig_capital": monto,
```

### 4. Idempotencia
Igual que en otros scripts del proyecto, si `desembolsar()` se llama dos
veces sobre la misma solicitud (no debería, pero por seguridad), usar
`ON CONFLICT (periodomes, pkcuentacredito) DO NOTHING` o verificar antes con
un `SELECT` — actualmente no hay `UNIQUE` explícito en `fagcuentacredito`
sobre esas dos columnas, revisar si hace falta agregarlo.

## Cómo probar que quedó bien

1. Aprobar y desembolsar una solicitud nueva desde el Core (como ya veníamos
   haciendo).
2. `SELECT * FROM fagcuentacredito WHERE pkcuentacredito = (SELECT pkcuentacredito FROM dcuentacredito WHERE codcuentacredito = '<el nuevo código>') AND periodomes = 202512;`
   → debe devolver 1 fila, no 0.
3. Entrar al Homebanking del cliente → el crédito nuevo debe aparecer en la
   lista, con el saldo correcto.
4. Generar el cronograma de esa misma solicitud (`GET
   /solicitudes/{cod}/cronograma`) y confirmar que la TEA que usa coincide
   con `TEA_POR_TIPO["ME"]["mid"]` (35%), no con el fallback de 40%.
