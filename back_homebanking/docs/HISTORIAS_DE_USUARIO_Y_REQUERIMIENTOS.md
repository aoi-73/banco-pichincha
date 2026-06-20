# Homebanking Banca Internet Banco Andino — Historias de Usuario y Requerimientos Funcionales

**Producto:** Portal del cliente de **Banca Internet Banco Andino**.
**Backend:** FastAPI (puerto 8002) sobre PostgreSQL `bd_core_financiero` (base compartida con el core; **no se crean tablas**, se reutilizan las existentes).
**Frontend:** React + Vite (puerto 5174), estilo BBVA.
**Seguridad:** JWT (HS256) + bcrypt directo. Todas las operaciones, salvo el login, exigen un token de tipo `cliente`.

> Este documento define **actores**, **historias de usuario (HU)** con criterios de aceptación, **requerimientos funcionales (RF)**, **no funcionales (RNF)**, **reglas de negocio (RN)** y la **matriz de trazabilidad** HU → RF → endpoint.

---

## 1. Alcance

**Incluido:** autenticación del cliente; consulta de cuentas de ahorro (incl. detalle por subproducto PF/CTS/AP y cronograma de Ahorro Programado); consulta de movimientos; consulta de créditos y cronograma de cuotas; transferencia entre cuentas de ahorro propias; pago de crédito debitando una cuenta de ahorro; pago de servicios debitando una cuenta de ahorro; solicitud de crédito (ME/CO) que llega al core.

**Fuera de alcance** (tablas vacías o inexistentes en la BD): tarjetas, inversiones/fondos mutuos, seguros, giros, débito automático, convenios, zona colaboradores.

---

## 2. Actores

| Actor | Descripción |
|---|---|
| **Cliente** | Persona titular de productos en la caja, registrada en `dcliente` y habilitada en `usuarios_homebanking`. Único usuario interactivo del portal. |
| **Core Financiero** | Sistema/BD `bd_core_financiero` compartido con el core bancario. Recibe las solicitudes de crédito (`dsolicitud`) y refleja saldos/operaciones (`foperaciones`, `fcuentaahorro`, `fplanpagomes`). Actor de sistema. |
| **Personal del banco** *(no usuario del portal)* | Evalúa las solicitudes de crédito en el core. No interactúa con este frontend. |

---

## 3. Épicas

- **E1 — Acceso y seguridad**
- **E2 — Consulta de cuentas de ahorro**
- **E3 — Consulta de créditos**
- **E4 — Operaciones monetarias**
- **E5 — Solicitud de crédito**

---

## 4. Historias de Usuario

> Formato: *Como [rol] quiero [acción] para [beneficio]*. Criterios de aceptación en estilo Gherkin.

### E1 — Acceso y seguridad

#### HU-01 — Iniciar sesión
**Como** cliente **quiero** ingresar con mi usuario y clave **para** acceder de forma segura a mi banca por internet.
- **CA1 (Dado)** un usuario `activo='S'` y `bloqueado!='S'`, **(Cuando)** envío usuario + clave correctos, **(Entonces)** recibo un JWT (`tipo=cliente`) con `codcliente`, `pkcliente` y `nombre`, se actualiza `ultimo_acceso` y se resetean los intentos fallidos.
- **CA2** Si la clave es incorrecta, se incrementa `intentos_fallidos` y se informa los intentos restantes.
- **CA3** Tras **5** intentos fallidos la cuenta se marca `bloqueado='S'` y se niega el acceso.
- **CA4** Si el usuario está inactivo o bloqueado, se rechaza el login con mensaje claro.
- **CA5** La verificación de la clave usa **bcrypt** contra `password_hash` (nunca texto plano).

#### HU-02 — Mantener sesión segura / cerrar sesión
**Como** cliente **quiero** que mi sesión use un token con vencimiento **para** proteger mis datos.
- **CA1** Todo endpoint distinto de `/auth/login` exige `Authorization: Bearer <token>`.
- **CA2** El token debe ser de `tipo=cliente`; un token de personal del core es rechazado (**403**).
- **CA3** Un token inválido o expirado devuelve **401**; el frontend limpia la sesión y redirige a login.

### E2 — Consulta de cuentas de ahorro

#### HU-03 — Ver mis cuentas de ahorro
**Como** cliente **quiero** ver mis cuentas de ahorro con su saldo **para** conocer mi posición.
- **CA1** Se listan solo las cuentas del cliente del token con: código, tipo, saldo, estado, moneda y TEA.
- **CA2** El saldo proviene del snapshot más reciente de `fcuentaahorro`.

#### HU-04 — Ver el detalle por subproducto (PF / CTS / AP)
**Como** cliente **quiero** ver el detalle específico de cada cuenta **para** entender sus condiciones.
- **CA1** Plazo Fijo (PF): vigencia, plazo en días, saldo capital, interés pactado/devengado/pagado, tasa y renovaciones.
- **CA2** CTS: capital, interés, intangible y **disponible** (= total − intangible, lo retirable por ley).
- **CA3** Ahorro Programado (AP): cuota, n.º de cuotas, tasa incentivo y **cronograma de depósitos** (`fcuentaahorroprogramado`).
- **CA4** Ahorro Corriente (AC): se informa que no tiene detalle de subproducto adicional.
- **CA5** Pedir el detalle de una cuenta ajena devuelve **403**.

#### HU-05 — Ver movimientos de una cuenta
**Como** cliente **quiero** ver los movimientos de una cuenta **para** revisar mi historial.
- **CA1** Se muestran fecha, concepto, canal, medio, monto y signo (I=ingreso / E=egreso), con límite configurable (`limit`, por defecto 50).
- **CA2** Solo movimientos de cuentas propias (**403** si es ajena).

### E3 — Consulta de créditos

#### HU-06 — Ver mis créditos
**Como** cliente **quiero** ver mis créditos vigentes **para** conocer mi deuda.
- **CA1** Se listan código, fecha de desembolso, saldo capital, pago pendiente, días de atraso y calificación, del periodo de cartera vigente.

#### HU-07 — Ver el cronograma de cuotas
**Como** cliente **quiero** ver el cronograma de un crédito **para** planificar mis pagos.
- **CA1** Se muestran n.º de cuota, vencimiento, monto, saldo, días de atraso, estado y si está pagada.
- **CA2** Solo créditos propios (**403** si es ajeno).

### E4 — Operaciones monetarias

#### HU-08 — Transferir entre mis cuentas de ahorro
**Como** cliente **quiero** transferir entre mis cuentas propias **para** mover mi dinero.
- **CA1** Origen y destino deben pertenecer al cliente del token (**403** si no).
- **CA2** Origen y destino deben ser distintos (**400**).
- **CA3** El origen debe tener saldo suficiente (**409** si no).
- **CA4** Se registran 2 movimientos en `foperaciones` (débito 'E' en origen, crédito 'I' en destino, tipo TRF, canal APP) y se actualizan los saldos (débito origen / abono destino).
- **CA5** Se devuelve un comprobante con los identificadores de operación.

#### HU-09 — Pagar mi crédito desde una cuenta de ahorro
**Como** cliente **quiero** pagar la cuota de mi crédito debitando mi cuenta de ahorro **para** no usar efectivo.
- **CA1** Se paga la **próxima cuota pendiente** (la de menor n.º con `fechapagocuota IS NULL`).
- **CA2** Si no se indica monto, se paga la **cuota completa**.
- **CA3** Si se indica `cuenta_origen`, se valida que sea del cliente (**403**) y con saldo suficiente vs. el monto de la cuota (**409**), se **debita el ahorro** (cargo 'E') y se reduce su saldo.
- **CA4** Se marca la cuota como pagada (`fechapagocuota = hoy`) y se registran los movimientos en `foperaciones` (pago al crédito + débito del ahorro).
- **CA5** Si el crédito no tiene cuotas pendientes, devuelve **409**.
- **CA6** Comprobante con n.º de cuota, monto pagado, operación de débito de ahorro y kardex.

#### HU-10 — Pagar servicios desde una cuenta de ahorro
**Como** cliente **quiero** pagar servicios (luz, agua, etc.) desde mi cuenta de ahorro **para** gestionar mis pagos en línea.
- **CA1** Puedo consultar el catálogo de servicios disponibles.
- **CA2** Debo indicar servicio válido, n.º de suministro/recibo, cuenta de ahorro origen y monto > 0.
- **CA3** Servicio inválido → **400**; cuenta ajena → **403**; saldo insuficiente → **409**.
- **CA4** Se registra el cargo en `foperaciones` (concepto PSER, tipo PAG, canal APP, signo 'E') y se reduce el saldo del ahorro.
- **CA5** Comprobante con servicio, suministro, cuenta debitada, monto y kardex.

### E5 — Solicitud de crédito

#### HU-11 — Solicitar un préstamo
**Como** cliente **quiero** solicitar un préstamo en línea **para** que el banco lo evalúe sin ir a una agencia.
- **CA1** Indico monto, plazo (n.º de cuotas), tipo (ME=Microempresa / CO=Consumo), actividad económica e ingreso neto mensual.
- **CA2** Solo se aceptan tipos **ME** y **CO** (**400** en otro caso).
- **CA3** La actividad económica debe existir en el catálogo (**400** si no).
- **CA4** Se registra la solicitud en `dsolicitud` con estado inicial **"En Evaluación"**; el `codsolicitud` se deriva de la secuencia (`'SOL'||LPAD(...)`).
- **CA5** Se registra/actualiza la fuente de ingreso del cliente de forma idempotente.
- **CA6** La solicitud queda disponible para el **core financiero**; se informa al cliente que pasará por evaluación.

---

## 5. Requerimientos Funcionales (RF)

| RF | Descripción | Método y endpoint |
|---|---|---|
| RF-01 | Autenticar al cliente y emitir JWT (`tipo=cliente`) | `POST /auth/login` |
| RF-02 | Validar estado del usuario (activo/bloqueado) y manejar intentos fallidos (bloqueo a los 5) | (lógica de RF-01) |
| RF-03 | Exigir JWT válido de tipo `cliente` en todos los endpoints protegidos | dependencia `get_cliente` |
| RF-04 | Listar cuentas de ahorro del cliente con saldo, tipo, estado, moneda y TEA | `GET /cuentas/ahorro` |
| RF-05 | Devolver detalle por subproducto (PF/CTS/AP/AC) y cronograma de AP | `GET /cuentas/ahorro/{cod}/detalle` |
| RF-06 | Listar movimientos de una cuenta de ahorro (con `limit`) | `GET /cuentas/ahorro/{cod}/movimientos` |
| RF-07 | Listar créditos del cliente (periodo de cartera vigente) | `GET /cuentas/credito` |
| RF-08 | Devolver el cronograma de cuotas de un crédito | `GET /cuentas/credito/{cod}/cuotas` |
| RF-09 | Transferir entre cuentas de ahorro propias (valida saldo; mueve saldos) | `POST /operaciones/transferencia` |
| RF-10 | Pagar la próxima cuota pendiente; opcionalmente debitar una cuenta de ahorro | `POST /operaciones/pago-cuota` |
| RF-11 | Exponer el catálogo de servicios disponibles | `GET /operaciones/servicios` |
| RF-12 | Pagar un servicio debitando una cuenta de ahorro | `POST /operaciones/pago-servicio` |
| RF-13 | Registrar una solicitud de crédito (ME/CO) en estado "En Evaluación" | `POST /creditos/solicitar` |
| RF-14 | Validar pertenencia de cuentas/créditos al cliente del token (403) | transversal |
| RF-15 | Validar saldo suficiente en operaciones de débito (409) | RF-09, RF-10, RF-12 |

---

## 6. Requerimientos No Funcionales (RNF)

| RNF | Descripción |
|---|---|
| RNF-01 | **Seguridad — autenticación**: JWT HS256 con `SECRET_KEY` y expiración configurables; claves verificadas con **bcrypt** directo (sin passlib). |
| RNF-02 | **Aislamiento de roles**: un token de personal del core (`tipo != cliente`) no puede operar el portal. |
| RNF-03 | **Integridad de datos**: el backend reutiliza la BD compartida y **no crea tablas**; respeta todas las columnas `NOT NULL` y claves foráneas (p. ej. `periododia` ∈ `dtiempo`). |
| RNF-04 | **Arquitectura en capas**: `core` / `repositories` / `controllers` / `routes` / `schemas`; SQL crudo con `text()` (sin ORM declarativo). |
| RNF-05 | **Interoperabilidad**: API REST/JSON; CORS habilitado para el frontend (`http://localhost:5174`). |
| RNF-06 | **Despliegue**: backend en puerto **8002** (el core corre en 8001; no deben colisionar). |
| RNF-07 | **Catálogos sin hardcodear**: los PKs de catálogo (concepto, tipo de operación, medio, canal, moneda) se resuelven por su código. |
| RNF-08 | **Trazabilidad**: cada operación genera filas en `foperaciones` con `codkardex` único y devuelve identificadores en el comprobante. |
| RNF-09 | **Usabilidad**: toda operación monetaria tiene confirmación previa y comprobante posterior; montos en formato S/ y fechas dd/mm/yyyy; opción "ocultar importes". |
| RNF-10 | **Manejo de errores**: códigos HTTP consistentes (400 validación, 401 sesión, 403 pertenencia/rol, 404 no encontrado, 409 negocio). |

---

## 7. Reglas de Negocio (RN)

- **RN-01** El cliente del portal sale **solo** de `dcliente` vía `usuarios_homebanking`; no se cruzan `dpersonal` ni `dasesor`.
- **RN-02** Login: `activo='S'` y `bloqueado!='S'`; 5 intentos fallidos → `bloqueado='S'`.
- **RN-03** "Próxima cuota pendiente" = menor `nrocuota` con `fechapagocuota IS NULL` (marcador real de pago; `montocapitalpagado` es el capital amortizado del cronograma, no un flag de pago).
- **RN-04** Pago de cuota: monto por defecto = cuota completa; si se debita de ahorro, debe haber saldo suficiente.
- **RN-05** Transferencia: solo entre cuentas de ahorro **propias** y distintas, con saldo suficiente en origen.
- **RN-06** Toda operación de débito reduce el saldo del ahorro en `fcuentaahorro` (snapshot vigente) para que la validación de fondos sea real entre operaciones.
- **RN-07** `foperaciones` (NOT NULL obligatorios): `codtipkar` ('CR'/'DB'), `codkardex` único, `codtipoegresoingreso` ('I'/'E'), `periododia` (FK a `dtiempo`), `pkconceptooperacion`, `pktipooperacion`, `pkmoneda`, `pkagenciaorigen`, montos y `fechahoraoperacion`; PK desde `foperaciones_pkoperacion_seq`.
- **RN-08** Catálogos por código: `dtipooperacion` (CRE/DEB/TRF/PAG…), `dconceptooperacion` (PCAP/TRAN/PSER/RAHO…), `dmediopago` (APP/WEB…), `dcanaltransaccional` (APP/WEB…), `dcondicioncontable` ('01' Vigente Normal), `dmoneda` (SO/DO/EU).
- **RN-09** Solicitud de crédito: solo ME y CO; estado inicial "En Evaluación"; `pksolicitud` de `dsolicitud_pksolicitud_seq` y `codsolicitud='SOL'||LPAD(currval,7,'0')`; `fclientefuenteingreso` con `ON CONFLICT (pkcliente, periodomes)` (idempotente).
- **RN-10** Pago de servicios: catálogo acotado del portal (no existe biller en la BD); concepto PSER, tipo PAG, canal APP, signo 'E'.

---

## 8. Matriz de Trazabilidad

| Historia | RF asociados | Endpoint(s) | Reglas |
|---|---|---|---|
| HU-01 | RF-01, RF-02 | `POST /auth/login` | RN-01, RN-02 |
| HU-02 | RF-03 | (todos los protegidos) | RNF-01, RNF-02 |
| HU-03 | RF-04 | `GET /cuentas/ahorro` | — |
| HU-04 | RF-05, RF-14 | `GET /cuentas/ahorro/{cod}/detalle` | — |
| HU-05 | RF-06, RF-14 | `GET /cuentas/ahorro/{cod}/movimientos` | — |
| HU-06 | RF-07 | `GET /cuentas/credito` | — |
| HU-07 | RF-08, RF-14 | `GET /cuentas/credito/{cod}/cuotas` | — |
| HU-08 | RF-09, RF-14, RF-15 | `POST /operaciones/transferencia` | RN-05, RN-06, RN-07, RN-08 |
| HU-09 | RF-10, RF-14, RF-15 | `POST /operaciones/pago-cuota` | RN-03, RN-04, RN-06, RN-07 |
| HU-10 | RF-11, RF-12, RF-14, RF-15 | `GET /operaciones/servicios`, `POST /operaciones/pago-servicio` | RN-06, RN-07, RN-10 |
| HU-11 | RF-13 | `POST /creditos/solicitar` | RN-09 |

---

## 9. Datos de prueba

- Login: `username` = `codcliente` en minúscula (ej. `cli000007`), clave `demo1234`, DNI (validación de front) `11200007`.
- `cli000007` tiene 2 cuentas de ahorro y un crédito con cuotas pendientes (ejercita todos los flujos).

---

## 10. Diagramas

Los diagramas UML (PlantUML) están en [`docs/uml/`](./uml/): casos de uso, arquitectura/componentes, clases, modelo de datos (ER) y secuencias de los flujos clave. Se previsualizan con la extensión **PlantUML** de VS Code (`Alt+D`).
