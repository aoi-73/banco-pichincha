# Diagramas UML (PlantUML)

Diagramas del homebanking de Banca Internet Banco Andino. Se editan y previsualizan con la extensión
**PlantUML** de VS Code (`jebbs.plantuml`).

| Archivo | Diagrama |
|---|---|
| `01_casos_de_uso.puml` | Casos de uso (actores Cliente / Core) |
| `02_arquitectura_componentes.puml` | Arquitectura en capas (Frontend → routes → controllers → repositories → BD) |
| `03_diagrama_clases.puml` | Clases: DTOs (schemas) y módulos por capa |
| `04_modelo_datos_er.puml` | Modelo de datos (ER) de las tablas reutilizadas |
| `05_secuencias.puml` | 5 secuencias: login, pago de crédito desde ahorro, pago de servicios, transferencia, solicitar crédito |

## Previsualizar en VS Code
1. Instala la extensión **PlantUML** (`jebbs.plantuml`).
2. Abre un `.puml` y pulsa `Alt + D` (o paleta → "PlantUML: Preview Current Diagram").
3. En `05_secuencias.puml` (5 diagramas), coloca el cursor dentro del bloque `@startuml … @enduml` que quieras ver.

> Requiere Java + Graphviz instalados, o configurar el servidor de render en la extensión.

## Exportar (opcional, por terminal con plantuml.jar)
```bash
java -jar plantuml.jar docs/uml/*.puml          # genera PNG
java -jar plantuml.jar -tsvg docs/uml/*.puml    # genera SVG
```
