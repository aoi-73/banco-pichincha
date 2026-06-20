# Banca Internet Banco Andino — Homebanking API

Backend **FastAPI** del portal del **cliente** de **Banca Internet Banco Andino**.
Es un proyecto **separado** del core bancario que se conecta a la base PostgreSQL **ya existente**
`bd_core_financiero` (compartida con el core). **No crea tablas**: reutiliza las existentes.

- SQL crudo con SQLAlchemy `engine` + `text()` (sin ORM declarativo).
- Passwords con **bcrypt directo** (`bcrypt.checkpw` / `bcrypt.hashpw`), sin passlib.
- JWT con **python-jose** (HS256).
- Corre en el puerto **8002** (el core corre en 8001).
- CORS habilitado para `http://localhost:5173` (frontend React/Vite).

## Arquitectura (en capas)

```
app/
  core/         cfg_config (.env), cfg_database (engine + get_db),
                cfg_security (bcrypt + JWT), cfg_auth (dependencia get_cliente)
  repositories/ consultas/escrituras SQL con text()
  controllers/  orquestación y reglas de negocio
  routes/       routers FastAPI
  schemas/      modelos pydantic
main.py         crea la app, CORS, incluye routers, endpoint raíz "/"
```

## Puesta en marcha (Git Bash / Windows)

```bash
# 1) (opcional) entorno virtual
python -m venv .venv
source .venv/Scripts/activate     # Git Bash en Windows

# 2) dependencias
pip install -r requirements.txt

# 3) configuración
cp .env.example .env              # ajusta credenciales/SECRET_KEY si hace falta

# 4) levantar el servidor (puerto 8002)
uvicorn main:app --reload --port 8002
```

- Documentación interactiva (Swagger): http://localhost:8002/docs
- Endpoint raíz: http://localhost:8002/

### Smoke test end-to-end (contra la BD real)

```bash
python test_smoke.py
```

## Datos de prueba

- **Login**: `username` = `codcliente` en minúscula (ej. `cli000007`), `password` = `demo1234`.
- Cliente sugerido para probar todo: **`cli000007`** (2 cuentas de ahorro + 1 crédito con cuotas pendientes).
- Periodo de la cartera de créditos (`fagcuentacredito`): **202512**.

## Autenticación

`POST /auth/login` valida `activo='S'` y `bloqueado!='S'`, verifica el password con
`bcrypt.checkpw`, actualiza `ultimo_acceso` y resetea `intentos_fallidos`. Tras **5** intentos
fallidos marca `bloqueado='S'`. Emite un JWT con
`{sub: codcliente, tipo: "cliente", pkcliente, nombre}`.

Todos los demás endpoints exigen la cabecera `Authorization: Bearer <token>`. La dependencia
`get_cliente` exige `tipo == "cliente"`: un token de personal del core **no** sirve aquí.

## Endpoints y ejemplos (curl / httpie)

> Reemplaza `$TOKEN` por el `access_token` devuelto por el login.

### Auth
```bash
# Login
curl -X POST http://localhost:8002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cli000007","password":"demo1234"}'

http POST :8002/auth/login username=cli000007 password=demo1234
```

### Consultas
```bash
# Cuentas de ahorro
curl http://localhost:8002/cuentas/ahorro -H "Authorization: Bearer $TOKEN"
http :8002/cuentas/ahorro "Authorization: Bearer $TOKEN"

# Movimientos de una cuenta de ahorro
curl "http://localhost:8002/cuentas/ahorro/AHO0000003/movimientos?limit=50" \
  -H "Authorization: Bearer $TOKEN"

# Detalle por subproducto de la cuenta de ahorro (PF / CTS / AP)
#  - PF  -> plazo, tasa, interés pactado/devengado/pagado, renovaciones
#  - CTS -> capital, intangible y disponible (lo retirable por ley)
#  - AP  -> cuota, nro de cuotas, tasa incentivo + cronograma de depósitos
curl http://localhost:8002/cuentas/ahorro/PFI0000505/detalle \
  -H "Authorization: Bearer $TOKEN"

# Créditos del cliente (periodo 202512)
curl http://localhost:8002/cuentas/credito -H "Authorization: Bearer $TOKEN"

# Cronograma de cuotas de un crédito
curl http://localhost:8002/cuentas/credito/CRED0000006/cuotas \
  -H "Authorization: Bearer $TOKEN"
```

### Operaciones
```bash
# Pago de la PRÓXIMA cuota pendiente del crédito.
#  - "monto" opcional: si se omite, paga la cuota completa.
#  - "cuenta_origen" opcional: si se envía, DEBITA esa cuenta de ahorro (valida saldo)
#    y registra el cargo en foperaciones; si se omite, solo registra el pago del crédito.
curl -X POST http://localhost:8002/operaciones/pago-cuota \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"codcuentacredito":"CRED0000006","monto":40.00,"cuenta_origen":"AHO0000003"}'

# Transferencia entre cuentas de ahorro PROPIAS (debita origen / abona destino)
curl -X POST http://localhost:8002/operaciones/transferencia \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"cuenta_origen":"AHO0000003","cuenta_destino":"APR0000703","monto":25.50}'

# Catálogo de servicios disponibles para pagar
curl http://localhost:8002/operaciones/servicios -H "Authorization: Bearer $TOKEN"

# Pago de servicio DEBITANDO una cuenta de ahorro (valida saldo)
curl -X POST http://localhost:8002/operaciones/pago-servicio \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"cuenta_origen":"AHO0000003","codservicio":"LUZ","codsuministro":"REC-998877","monto":50.00}'
```

### Crédito
```bash
# Solicitar crédito (solo ME = Microempresa, CO = Consumo)
curl -X POST http://localhost:8002/creditos/solicitar \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"montosolicitud":5000,"plazo":12,"codtipocredito":"CO",
       "codactividadeconomica":"0111","montoingresoneto":2500}'
```

## Notas técnicas de la BD (verificadas contra `bd_core_financiero`)

- **`foperaciones`**: se llenan todas las columnas `NOT NULL` (`codtipkar` `CR`/`DB`,
  `codkardex` único, `codtipoegresoingreso` `I`/`E`, `periododia` FK a `dtiempo`,
  `pkconceptooperacion`, `pktipooperacion`, `pkmoneda`, `pkagenciaorigen`, montos,
  `fechahoraoperacion`). `pkoperacion` sale de `foperaciones_pkoperacion_seq`.
- **`periododia`** es FK al calendario `dtiempo` (poblado 2015–2027); se usa la fecha del
  servidor (`CURRENT_DATE` → `yyyymmdd`), que existe en `dtiempo`.
- **PKs de catálogos no se hardcodean**: se resuelven por código (`dtipooperacion`,
  `dconceptooperacion`, `dmediopago`, `dcanaltransaccional`, `dcondicioncontable`, `dmoneda`)
  con cache en memoria.
- **`fclientefuenteingreso`** tiene PK compuesta `(pkcliente, periodomes)`: el registro de
  ingreso en `/creditos/solicitar` usa `ON CONFLICT ... DO UPDATE` (idempotente).
- **`dsolicitud`**: `pksolicitud` desde `dsolicitud_pksolicitud_seq` y
  `codsolicitud = 'SOL' || LPAD(currval(...)::text, 7, '0')`. Estado inicial `01` (En Evaluación).
- **Detección de cuota pendiente** (`/operaciones/pago-cuota`): el marcador real de pago en la
  BD es **`fechapagocuota`** (`NULL` = pendiente). El campo `montocapitalpagado` trae el capital
  amortizado del cronograma (siempre > 0), por lo que **no** funciona como flag de pago; usarlo
  como `montocapitalpagado = 0` no seleccionaría ninguna cuota. Por eso la "próxima cuota
  pendiente" se determina con el menor `nrocuota` cuyo `fechapagocuota IS NULL`, y el pago marca
  `fechapagocuota = CURRENT_DATE` (+ `montocapitalpagado = :monto`).

## Alcance

**Incluye**: consultas (ahorro, crédito, movimientos, cuotas) + operaciones (pago de cuota,
transferencia entre cuentas propias) + solicitar crédito (ME/CO).

**Fuera de alcance** (tablas vacías o inexistentes): giros, débito automático, convenios,
tarjetas, seguros, zona colaboradores.

## Observaciones de los datos sembrados

- Las `foperaciones` existentes (~3 094) son todas de crédito; **ninguna referencia cuentas de
  ahorro**, por lo que `GET /cuentas/ahorro/{cod}/movimientos` puede devolver `[]` hasta que se
  generen transferencias (que sí crean movimientos de ahorro).
