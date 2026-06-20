"""Smoke test end-to-end contra la BD REAL usando TestClient.

Ejecuta el flujo completo de un cliente del portal y muestra la salida.
Uso:  python test_smoke.py
"""
import json

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
USER = "cli000007"
PWD = "demo1234"


def show(title, resp):
    print(f"\n===== {title}  ->  HTTP {resp.status_code} =====")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False, default=str))
    except Exception:
        print(resp.text)


def main():
    # 0) Raíz
    show("GET /", client.get("/"))

    # 1) Login OK
    r = client.post("/auth/login", json={"username": USER, "password": PWD})
    show("POST /auth/login (ok)", r)
    token = r.json()["access_token"]
    H = {"Authorization": f"Bearer {token}"}

    # 1b) Login mal password
    show("POST /auth/login (bad pwd)",
         client.post("/auth/login", json={"username": USER, "password": "xxx"}))

    # 1c) Sin token -> 403
    show("GET /cuentas/ahorro (sin token)", client.get("/cuentas/ahorro"))

    # 2) Ahorro
    r = client.get("/cuentas/ahorro", headers=H)
    show("GET /cuentas/ahorro", r)
    cuentas = r.json()
    cod_ahorro = cuentas[0]["codcuentaahorro"]

    # 3) Movimientos
    show(f"GET /cuentas/ahorro/{cod_ahorro}/movimientos?limit=5",
         client.get(f"/cuentas/ahorro/{cod_ahorro}/movimientos?limit=5", headers=H))

    # 4) Crédito
    r = client.get("/cuentas/credito", headers=H)
    show("GET /cuentas/credito", r)
    cod_credito = r.json()[0]["codcuentacredito"]

    # 5) Cuotas
    show(f"GET /cuentas/credito/{cod_credito}/cuotas",
         client.get(f"/cuentas/credito/{cod_credito}/cuotas", headers=H))

    # 6) Pago de cuota (monto explícito pequeño)
    show("POST /operaciones/pago-cuota",
         client.post("/operaciones/pago-cuota", headers=H,
                     json={"codcuentacredito": cod_credito, "monto": 50.00}))

    # 7) Transferencia entre cuentas propias
    show("POST /operaciones/transferencia",
         client.post("/operaciones/transferencia", headers=H,
                     json={"cuenta_origen": cuentas[0]["codcuentaahorro"],
                           "cuenta_destino": cuentas[1]["codcuentaahorro"],
                           "monto": 25.50}))

    # 7b) Movimientos de la cuenta destino tras la transferencia
    show(f"GET movimientos destino {cuentas[1]['codcuentaahorro']}",
         client.get(f"/cuentas/ahorro/{cuentas[1]['codcuentaahorro']}/movimientos?limit=5", headers=H))

    # 8) Solicitar crédito (Consumo)
    show("POST /creditos/solicitar (CO)",
         client.post("/creditos/solicitar", headers=H,
                     json={"montosolicitud": 5000, "plazo": 12, "codtipocredito": "CO",
                           "codactividadeconomica": "0111", "montoingresoneto": 2500}))


if __name__ == "__main__":
    main()
