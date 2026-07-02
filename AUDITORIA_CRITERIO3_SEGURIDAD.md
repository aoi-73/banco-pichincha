# Auditoría Criterio 3 — Seguridad y RBAC con JWT

Contexto para Claude Code: este documento es el resultado de una auditoría manual
del código real de `back_core_financiero` y `back_homebanking` contra la rúbrica
del curso (Criterio 3: autenticación JWT + autorización por rol, acciones
críticas bloqueadas con 403 a quien no corresponde). Describe **qué está mal,
dónde, por qué importa, y qué cambiar**. No es código listo para pegar — hay que
implementarlo respetando el resto del proyecto.

Producto de referencia: Crédito Microempresa (ME) — pero los hallazgos de este
documento son transversales a todo el backend, no específicos de un producto.

---

## 0. Resumen ejecutivo

`back_homebanking` (el backend de cliente standalone) está **bien implementado**:
JWT + bcrypt real, bloqueo por intentos fallidos, y **todas** las rutas de cuentas
filtran por `cliente["pkcliente"]` (sin IDOR). No tocar esa lógica salvo el punto
de logging (sección 4).

`back_core_financiero` (el backend de personal) tiene la matriz de roles bien
diseñada (`cfg_roles.py`, `cfg_auth.py`) pero **el login no verifica una
contraseña real**, y **varios endpoints sensibles no tienen ningún tipo de
autenticación**. Estos son los puntos que hay que corregir para que el proyecto
cumpla el Criterio 3 en nivel Excelente.

---

## 1. CRÍTICO — El login del Core no verifica contraseña real

**Archivo:** `back_core_financiero/app/controllers/ctl_auth.py`

```python
# En desarrollo: password = numerodni (simplificado)
# En producción: verify_password(password, row.password_hash)
if password != numerodni:
    return None
```

**Por qué es grave:** el "password" para cualquier usuario del Core es
literalmente su propio número de DNI. El DNI no es un secreto — puede
conocerse o inferirse — así que cualquiera que sepa el DNI de un
administrador, jefe regional, riesgos, comité o gerencia puede loguearse
como esa persona y heredar todos sus permisos. Esto contradice directamente
lo que evalúa el Criterio 3 ("autenticación... que cada actor solo pueda
hacer lo que le corresponde").

El propio archivo `cfg_security.py` ya tiene `hash_password()` y
`verify_password()` implementados con bcrypt — están definidos pero **nunca
se usan** en el flujo de login real.

**Qué cambiar:**
1. Agregar una columna de contraseña hasheada a `dpersonal` (o a una tabla
   puente nueva, siguiendo el patrón de `dpersonalcargo`/`dpersonalasesor`
   que ya usa el proyecto) si no existe.
2. Sembrar esa columna con `hash_password(...)` para los usuarios de prueba
   (puede seguir siendo el DNI como valor de contraseña *de prueba*, pero
   guardado hasheado y verificado con `verify_password`, no comparado en
   texto plano).
3. Reemplazar `if password != numerodni` por
   `if not verify_password(password, row.password_hash)`.
4. Si por alcance del curso se decide mantener un modo "demo" con contraseña
   predecible, dejarlo explícito y documentado como tal en el informe — pero
   preferible resolverlo de verdad, ya es la misma cantidad de trabajo.

---

## 2. CRÍTICO — Endpoints del Core sin ninguna autenticación

Estas rutas no tienen `Depends(get_current_user)` ni `Depends(requiere_rol(...))`
— cualquiera con la URL del backend (sin token, sin login) puede llamarlas:

| Archivo | Endpoint(s) | Qué expone |
|---|---|---|
| `app/routes/rtr_clientes.py` | `GET /{codcliente}` | Datos personales del cliente (PII) |
| `app/routes/rtr_ahorros.py` | `GET /resumen-agencia/{codagencia}`<br>`GET /cliente/{codcliente}`<br>`GET /{codcuentaahorro}` | Saldos y cuentas de ahorro de cualquier cliente |
| `app/routes/rtr_dashboard.py` | `GET /kpis`<br>`GET /productividad-asesores`<br>`GET /evolucion-historica`<br>`GET /desembolsos` | KPIs de negocio y desempeño de asesores |
| `app/routes/rtr_scoring.py` | `POST /evaluar` | Ejecuta el scoring crediticio de cualquier cliente sin login |
| `app/routes/rtr_creditos.py` | `GET /cartera`<br>`GET /{codcuentacredito}`<br>`GET /{codcuentacredito}/cronograma` | Cartera de créditos, detalle y cronograma de pagos |

**Qué cambiar:** agregar `user: dict = Depends(get_current_user)` como mínimo
a cada uno de estos endpoints (siguiendo el mismo patrón ya usado en el resto
de `rtr_creditos.py` y en `rtr_recuperaciones.py`). Para los que devuelven
datos que deberían estar restringidos por rol (por ejemplo,
`productividad-asesores` o `evolucion-historica`, que son datos gerenciales),
usar `Depends(requiere_rol("consultar_mora"))` o crear una acción nueva en
`cfg_roles.py` (p. ej. `"consultar_dashboard": {"administrador", "gerencia",
"jefe_regional"}`) en vez de dejarlos abiertos a cualquier rol autenticado.

---

## 3. CRÍTICO — IDOR en `GET /creditos/cartera` y en `POST /hb/pagar`

### 3.1 `rtr_creditos.py` → `GET /cartera`
```python
@router.get("/cartera")
def cartera(
    pkasesor: int = Query(..., description="PK del asesor autenticado"),
    periodomes: int = Query(202512),
    db: Session = Depends(get_db),
):
    rows = rep_creditos.get_cartera_asesor(db, pkasesor, periodomes)
```
El comentario del propio parámetro dice "PK del asesor autenticado", pero
nada obliga a que el `pkasesor` que se manda por query coincida con el
usuario del token — de hecho, el endpoint ni siquiera pide token. Cualquiera
puede pasar cualquier `pkasesor` y ver la cartera completa de otro asesor.

**Qué cambiar:** quitar `pkasesor` de los query params, agregar
`user: dict = Depends(get_current_user)`, y tomar el asesor desde
`user.get("pkasesor")` (ya viene en el JWT, ver `ctl_auth.py`). Si el rol es
`administrador`/`gerencia`/`jefe_regional` (con visión de toda la cartera,
no solo la propia), permitir opcionalmente pasar `pkasesor` pero validando
`puede(user["rol"], "ver_cartera_ajena")` o similar antes de usarlo.

### 3.2 `back_core_financiero/app/routes/rtr_homebanking.py` → `POST /pagar`
```python
@router.post("/pagar")
def pagar(data: PagoIn, db: Session = Depends(get_db), cli: dict = Depends(cliente_actual)):
    cuota = rephb.proxima_cuota(db, data.codcuentacredito)
    ...
    res = rephb.registrar_pago(db, cuota, monto, cli["pkcliente"])
```
`rep_homebanking.proxima_cuota(db, codcuentacredito)` busca la cuota **solo
por el código de cuenta**, sin filtrar por el cliente autenticado. Un cliente
logueado puede mandar el `codcuentacredito` de otro cliente y pagar (o
manipular el estado de pago de) un crédito que no es suyo.

**Qué cambiar:** en `rep_homebanking.py`, la consulta de `proxima_cuota` debe
unirse con `dcuentacredito` y filtrar también por
`cc.pkcliente = :pkcliente_autenticado`, devolviendo 404 si el crédito no le
pertenece al cliente del token — exactamente el mismo patrón que ya usa
`back_homebanking/app/controllers/ctrl_cuentas.py` en el backend standalone
(ese sí filtra bien, se puede copiar el patrón de ahí).

> Nota: esto refuerza además la sección 3.3.1 de tu informe (auditoría de
> ciberseguridad, "IDOR — Cumple"). Con este hallazgo, esa afirmación queda
> desactualizada para `back_core_financiero`; conviene corregir el código
> antes de reafirmar "Cumple" en el documento.

---

## 4. MENOR — Logging de credenciales en Homebanking

**Archivo:** `back_homebanking/app/repositories/repo_auth.py`

```python
def buscar_usuario_por_username(conn: Connection, username: str) -> dict | None:
    ...
    print(username)
    row = conn.execute(sql, {"username": username}).mappings().first()
    print(row)
    return dict(row) if row else None
```
Son prints de depuración olvidados. `row` incluye `password_hash` — aunque
está hasheado, no debería aparecer en logs de producción, y el propio
`username` tampoco debería loguearse sin necesidad.

**Qué cambiar:** eliminar ambos `print()`. Si se necesita logging real, usar
el logger estándar de la app y loguear solo el resultado (encontrado/no
encontrado), nunca el hash ni el payload completo.

---

## 5. Ya está bien — no tocar / no regresar

Para que Claude Code no "arregle" algo que ya funciona:

- **`cfg_roles.py`** — la matriz de permisos (`PERMISOS`) está completa y
  correctamente alineada a la rúbrica: `resolver_comite` incluye `comite`,
  `derivar_judicial` restringido a `administrador`/`gerencia`,
  `castigar_credito` restringido a `comite`/`gerencia`. **Este archivo no
  necesita cambios.**
- **`cfg_auth.py` / `requiere_rol()`** (Core) — el patrón de dependencia está
  bien hecho, solo falta aplicarlo en los endpoints listados en la sección 2.
- **`back_homebanking` completo** (login, `cfg_auth.py`, `route_cuentas.py`,
  `route_operaciones.py`) — JWT real, bcrypt real, bloqueo por intentos
  fallidos (5 intentos → bloqueado), y filtrado por `pkcliente` en todas las
  consultas. Es el ejemplo a seguir para corregir los puntos de arriba.
- El punto de mejora que menciona el informe actual ("el rol comité debería
  poder castigar créditos") **ya está resuelto en el código** —
  `castigar_credito` en `cfg_roles.py` sí incluye `comite`. Esa nota del
  informe está desactualizada y se puede quitar una vez verificado en vivo.

---

## 6. Checklist de verificación (para correr en Postman/Core después del fix)

- [ ] Login con contraseña incorrecta → 401 (ya no acepta cualquier valor ≠ DNI)
- [ ] Login con contraseña correcta hasheada → 200 + token
- [ ] `GET /clientes/{codcliente}` sin token → 401/403
- [ ] `GET /ahorros/{codcuentaahorro}` sin token → 401/403
- [ ] `GET /dashboard/kpis` sin token → 401/403
- [ ] `POST /scoring/evaluar` sin token → 401/403
- [ ] `GET /creditos/cartera` sin `pkasesor` en query, con token de otro asesor → devuelve solo su propia cartera
- [ ] `POST /hb/pagar` con `codcuentacredito` de OTRO cliente, logueado como cliente A → 404 (no encontrado / no pertenece)
- [ ] Repetir la matriz de roles del Criterio 3 del informe (403 a quien no corresponde) para confirmar que sigue funcionando tras los cambios
