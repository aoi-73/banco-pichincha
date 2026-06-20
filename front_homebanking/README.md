# Banco Andino — Banca por Internet (Homebanking)

Portal del **cliente final** de Banco Andino, construido en **React 18 + Vite (JavaScript)**.
Consume el backend FastAPI del Homebanking que corre en `http://localhost:8002`.

> Identidad visual de **Banco Andino**: isotipo de flor andina multicolor, paleta del textil
> andino (rojo `#e2132b`, magenta, turquesa, naranja, morado…), **franja tejida** superior,
> header con gradiente de marca, menú horizontal de íconos circulares y tarjetas redondeadas.

---

## Requisitos

- Node.js 18+ (probado con Node 24)
- El backend FastAPI del Homebanking corriendo en `http://localhost:8002`
  (el portal del **personal** usa el puerto `5173`; este portal del **cliente** usa el `5174`).

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda disponible en **http://localhost:5174**.

### Variable de entorno

Copie `.env.example` a `.env` y ajuste si su backend no está en el puerto por defecto:

```
VITE_BASE_URL=http://localhost:8002
```

## Usuario de prueba

| Usuario     | Contraseña |
|-------------|------------|
| `cli000001` | `demo1234` |
| `cli000002` | `demo1234` |

> El usuario es el `codcliente` en minúscula. `cli000002` es un buen ejemplo porque tiene
> cuentas de ahorro; `cli000001` tiene un crédito.

---

## Estructura del proyecto

```
src/
  services/      hb_api.js (axios central con interceptores) + un service por dominio
                 (authService, cuentasService, operacionesService, creditosService)
  context/       HBAuthContext.jsx           (estado de sesión)
  hooks/         useHBAuth, useCuentas, useMovimientos, useCreditos, useOperaciones
  components/
    layout/      PublicHeader + PublicFooter (sitio público), Header (menú de íconos
                 de la banca), PrivateRoute
    ui/          Logo (flor andina), Card, Tabla, Loader, Badge, Money, Alert
  pages/         LandingPage (home marketero), LoginPage, HomePage, CuentasAhorroPage,
                 MovimientosPage, CuentasCreditoPage, CuotasCreditoPage, PagoCuotaPage,
                 TransferenciaPage, SolicitarCreditoPage
  utils/         format.js  (S/ 1,234.56, fechas dd/mm/yyyy, parseo de errores)
  App.jsx · main.jsx · index.css
```

## Autenticación

- `POST /auth/login {username, password}` → `{ access_token, cliente: { codcliente, nombre, ... } }`.
- El token se guarda en `localStorage` bajo la clave **`hb_token`** y los datos del cliente en **`hb_user`**.
- La instancia central de axios (`services/hb_api.js`):
  - inyecta `Authorization: Bearer <token>` en cada request,
  - ante un **401** limpia la sesión y redirige a `/login`.
- Las rutas privadas (`PrivateRoute`) redirigen a `/login` si no hay token.

## Flujo de navegación

```
/  (público)  Home marketero  ──►  /login  ──►  /inicio  (banca privada)
```

- La raíz `/` es un **home marketero público** (estilo banca peruana): hero, productos,
  beneficios, promo y footer. Incluye un **widget "Banca por Internet"** donde el cliente
  escribe su **N° de tarjeta de ahorros** y continúa al login (que viaja precargado).
- `/login` pide la **clave de Internet** y autentica contra el backend.
- Tras iniciar sesión se entra a `/inicio` y al resto de la banca privada.

## Pantallas

0. **Home marketero** (`/`, público) — hero con gradiente de marca, accesos rápidos, grilla de
   productos (Ahorros, Cuenta Sueldo, Créditos, Tarjetas…), beneficios, promo y footer. CTA
   "Banca por Internet" e ingreso con número de tarjeta de ahorros.
1. **Login** — tarjeta centrada con logo Banco Andino sobre el gradiente de marca y franja tejida.
2. **Inicio** (`/inicio`) — bienvenida personalizada + accesos rápidos.
3. **Consultas › Cuentas de Ahorro** — tabla separada por Soles/Dólares, con Movimientos y Detalle.
4. **Movimientos** — cabecera de la cuenta (producto, n°, saldo, TEA) + tabla de movimientos.
5. **Consultas › Cuentas de Crédito** — saldo capital, pago pendiente, calificación, ver cuotas.
6. **Cronograma de cuotas** — n° cuota, vencimiento, monto, días de mora; botón "Pagar próxima cuota".
7. **Operaciones › Pago Cuotas Créditos** — confirma el pago y muestra comprobante.
8. **Operaciones › Transferencias Propias** — origen/destino entre cuentas del cliente + comprobante.
9. **Créditos › Producto Digital** — formulario de solicitud; maneja el **422 de elegibilidad**
   (cliente no apto) mostrando el motivo de forma amable.

## Endpoints consumidos

| Método | Endpoint | Uso |
|--------|----------|-----|
| POST | `/auth/login` | Login del cliente |
| GET  | `/cuentas/ahorro` | Cuentas de ahorro |
| GET  | `/cuentas/ahorro/{cod}/movimientos?limit=50` | Movimientos |
| GET  | `/cuentas/credito` | Créditos |
| GET  | `/cuentas/credito/{cod}/cuotas` | Cronograma |
| POST | `/operaciones/pago-cuota` | Pago de cuota |
| POST | `/operaciones/transferencia` | Transferencia propia |
| POST | `/creditos/solicitar` | Solicitud de crédito (ME/CO) |

## Manejo de errores / UX

- Loader mientras carga cada vista; mensaje claro si un endpoint falla.
- Montos formateados como `S/ 1,234.56`; fechas como `dd/mm/yyyy`.
- Tras pagar/transferir/solicitar, la vista correspondiente se refresca.
- Errores del backend (`{detail: "..."}`, validación 422, o `{detail:{error, elegibilidad}}`)
  se traducen a mensajes amables (ver `utils/format.js → extractError`).

## Build de producción

```bash
npm run build
npm run preview
```
