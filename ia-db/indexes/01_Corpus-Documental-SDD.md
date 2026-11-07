# 01 · Corpus documental SDD: mapa, autoridad y lectura

> **Propósito.** Ubicar cada carpeta y categoría del árbol `SDD/`, decir qué documento manda sobre cuál (autoridad, upstream/downstream) y en qué orden leerlo según el rol. No resume el contenido de ningún documento: para eso, el índice de dominio que corresponda.
> **Fuente primaria:** `SDD/Docs/README.md` (README raíz del producto, 2.9, 2026-09-13) y `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` (7.1, 2026-09-13).
> **Revisión indexada:** `Lab-Geometria` `main` `5f07b12`. Recuentos hechos con `git ls-files SDD` sobre esa revisión.

---

## 1. Árbol de `SDD/` (primer y segundo nivel)

```text
SDD/
├── README.md                     # puntero: no replica estado (reemplazado 2026-09-13, PR-09 de Mesa-2026-09-13-ciclo-2)
├── Intake/                       # PRODUCT-INTAKE (5.1) y PRODUCT-MANIFEST (7.1) vigentes + _legacy/ fechado
├── Docs/
│   ├── README.md                 # README raíz del producto: identidad, dos ejes, mapa, lectura por rol, estado
│   ├── Handoff-Checkout.md       # check-out 1.10 (2026-08-12) — SUPERADO, conservado como registro
│   ├── 00-Contexto/              # producto: visión, alcance, roadmap, compatibilidad
│   ├── 01-Necesidades-Negocio/   # producto: NB-00001..NB-00009
│   ├── Producto/                 # producto: Vista, Pipeline, Plan-Etapa-A, Norma de nombres, ADR, contratos inter-unidad, 11
│   ├── Audit/                    # informes de auditoría, migración, mesa, reanudación, observaciones
│   ├── Unidades-Entrega/
│   │   ├── GeometriaFactory-Api/ # categorías 02,03,05..11 de la unidad principal (rest-api)
│   │   └── GeometriaFactory-Web/ # categorías 02,03,05..11 del front (web-monolith)
│   └── _legacy/                  # archivado central de migraciones/consolidaciones (por fecha)
├── Expedientes/
│   └── 0001-Migracion-Normativa-A-13.16/   # sólo ubicación aquí → 17
└── Maquetas/
    └── GeometriaFactory-Web/     # maquetas HTML aprobadas; sólo ubicación aquí → 09
```

Fuentes: `SDD/README.md`; `SDD/Docs/README.md` §4; `git ls-files SDD`.

## 2. Volumen por carpeta (vivos / `_legacy`)

Total `SDD/`: **1330** archivos versionados = **651 vivos** + **679 bajo `_legacy/`**. Los 679 `_legacy` del repo están todos dentro de `SDD/`; se cuentan y ubican, no se indexan por contenido (origen de cada carpeta → 17).

| Carpeta | Vivos | `_legacy` | Nota |
| --- | ---: | ---: | --- |
| `SDD/README.md` | 1 | — | puntero |
| `SDD/Intake/` | 2 | 53 | `_legacy/` en 8 fechas (2026-08-08 … 2026-09-15) |
| `SDD/Docs/` (raíz: `README.md`, `Handoff-Checkout.md`) | 2 | 261 | `Docs/_legacy/`: `2026-08-15-migracion-8.2` 87, `2026-08-16-consolidacion-8.5` 33, `2026-08-16-consolidacion-m10` 138, `2026-08-24` 1, `2026-09-13` 2 |
| `Docs/00-Contexto/` | 5 | 19 | README + 4 documentos |
| `Docs/01-Necesidades-Negocio/` | 11 | 12 | README, `Necesidades-Negocio.md`, 9 NB en `Necesidades-De-Negocio/` |
| `Docs/Producto/` (raíz) | 5 | 9 | Vista, Pipeline, Plan-Etapa-A, Norma-De-Nomenclatura, Medicion PT-02/PT-03 |
| `Docs/Producto/Adrs/` | 13 | 6 | ADR de producto → 15 |
| `Docs/Producto/Contratos-Inter-Unidad/` | 10 | 10 | CU-08001..08008 → 06 |
| `Docs/Producto/11-Documentacion/` | 3 | 2 | README (plan documental), `Contrato-Agentes.md` (→ 18), `Bitacora-Eventualidades.md` (→ 18) |
| `Docs/Audit/` | 120 | 4 | → 16 (mesas/auditorías) y 17 (migraciones) |
| `Docs/Unidades-Entrega/GeometriaFactory-Api/` | 282 | 231 | detalle en §4 |
| `Docs/Unidades-Entrega/GeometriaFactory-Web/` | 127 | 72 | detalle en §4 |
| `SDD/Expedientes/0001-…/` | 53 | — | README + `actuaciones/` 13 + `propuestas/` 9 + `evidencia/` 30 |
| `SDD/Maquetas/GeometriaFactory-Web/` | 17 | — | `index.html`, 11 pantallas `.html`, `assets/` 4, README |

Fuente: `git ls-files SDD` (instrumento del recuento).

## 3. Los dos ejes y cómo cuelga el árbol

| Eje | Qué dice | Dónde se fija | Consecuencia documental |
| --- | --- | --- | --- |
| Entrega | 2 unidades: `GeometriaFactory-Api` (principal, `rest-api`) y `GeometriaFactory-Web` (`web-monolith`); ninguna redistribuible | `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` §2.A | El árbol documental cuelga de la **unidad de entrega** (desde la migración 6.0 → 8.6) |
| Construcción | 7 proyectos de código | Manifiesto §2.B; detalle → 04 | Los proyectos **no** tienen árbol propio: `Domain`, `Application`, `Infrastructure`, `Contracts` se consolidan en la unidad `Api`; `Visor` en `Web` |
| Composición | qué proyecto compone qué unidad | Manifiesto §2.C | `Contracts` compone las dos |

Fuentes: `SDD/Docs/README.md` §2 y §4; manifiesto §2.A–§2.C.

## 4. Categorías por ámbito: autoridad, upstream y downstream

Cadena de especificación (orden canónico): 00 visión/alcance → 01 necesidades → 02 casos de uso y reglas → 03 experiencia de uso → 05 arquitectura y decisiones → 06 historias y tareas → 07 plan → 08 calidad → 09 canalización/publicación → 10 ejemplos → 11 cuerpo documental. **La 04 (`04-Prompts-AI`) no existe: omitida por gating**, ninguna unidad usa modelos de lenguaje (`SDD/Docs/README.md` §4 y §7.1).

### 4.1 Nivel producto

| Categoría | Rol autor | Versión / estado del README | Upstream | Downstream | Contenido → | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| 00-Contexto | AG-00000 (Product Manager; también AG-00010) | 1.4 · Aprobado · 2026-08-10 | PRODUCT-INTAKE §2, §4.2, §13; manifiesto §5 (`equipo_n`) | 01, 02, 03, 05, 07, 09, 10 | 02 (visión/alcance), 03 (roadmap) | `SDD/Docs/00-Contexto/README.md` |
| 01-Necesidades-Negocio | AG-00010 (Analista de Negocio) | 1.2 · Aprobado | `Necesidades-Negocio.md`; `00-Contexto/Vision-Producto.md` §2; `00-Contexto/README.md` §4 | 02-Especificacion-Funcional, 06-Backlog-Tecnico, 07-Plan-Sprint, 08-Calidad-Y-Pruebas | 02 | `SDD/Docs/01-Necesidades-Negocio/README.md` |
| Producto (Vista, Pipeline, plan documental) | AG-00050, AG-00090, AG-00110 | Vista 1.11, Pipeline 1.9 · Aprobado · 2026-09-13 | manifiesto §2–§5; intake §13–§15, §17 | 06, 08, 09, 11 de las unidades; `Docs/README.md` | 04, 12 | `SDD/Docs/Producto/Vista-Producto.md`, `SDD/Docs/Producto/Pipeline-Producto.md` |
| Producto/11-Documentacion | AG-00110 (Technical Writer) | 1.4 · **Propuesto** · 2026-08-11 (frontmatter `status: Vigente`, dos enums distintos declarados) | manifiesto 1.3, intake 1.26, Vista 1.2, Pipeline 1.0 | 11 de cada unidad | 18 (Contrato-Agentes, Bitácora) | `SDD/Docs/Producto/11-Documentacion/README.md` |
| Audit | Auditor independiente | — (carpeta) | no declarado por la fuente | no declarado por la fuente | 16, 17 | `SDD/Docs/README.md` §4 |

### 4.2 Por unidad de entrega (vivos / `_legacy`, versión del README de la categoría)

| Categoría | `Api` vivos/legacy | README `Api` | `Web` vivos/legacy | README `Web` | Rol | Contenido → |
| --- | --- | --- | --- | --- | --- | --- |
| 02-Especificacion-Funcional | 39 / 72 | 3.0 · Aprobado · 2026-08-16 | 14 / 11 | 2.0 · Aprobado · 2026-08-16 | AG-00020 | 05, 06, 09 |
| 03-UX-UI-DX | 5 / 18 | 2.0 · Aprobado | 23 / 16 | 2.0 · Aprobado (downstream inmediato: Fase B2 de maqueta) | AG-00030 | 06 (DX), 09 (UX) |
| 05-Arquitectura-Tecnica | 52 / 6 | 2.4 · Aprobado · 2026-08-16 | 30 / 3 | 2.1 · Aprobado · 2026-09-12 | AG-00050 | 04, 07, 08, 10, 15 |
| 06-Backlog-Tecnico | 153 / 119 | 2.2 · Aprobado · 2026-09-12 | 34 / 33 | 2.0 · Aprobado | AG-00060 | 03 |
| 07-Plan-Sprint | 2 / 6 | 2.2 · Aprobado | 2 / 1 | 2.0 · Aprobado | AG-00070 | 03 |
| 08-Calidad-Y-Pruebas | 9 / 1 | 2.1 · Aprobado | 11 / 1 | 2.1 · Aprobado · 2026-09-02 | AG-00080 | 11 |
| 09-Devops | 6 / 9 | 2.4 · Aprobado | 7 / 7 | 2.4 · Aprobado | AG-00090 | 12 |
| 10-Examples | 15 / 0 | 2.1 · Aprobado · 2026-09-13 | 5 / 0 | 2.1 · Aprobado | AG-00100 | 13 |
| 11-Documentacion | 1 / 0 | 2.0 · **Propuesto** | 1 / 0 | 2.0 · **Propuesto** | AG-00110 | — (sólo README con el plan; upstream: `Producto/11-Documentacion/README.md` 1.1) |

Upstream/downstream declarados en las cabeceras (ejemplos verificados): `Api/02` → 03, 05, 06, 08, 09, 10; `Api/03` ← 02 completo → 05, 06, 08, 09, 10, 11; `Api/10` y `Web/10` → `08-Calidad-Y-Pruebas/Matriz-Sensado-Deriva.md` (sondas `VER-xx`) y 11; `Web/02` → `Web/03` como downstream más directo. Las cabeceras de 05–09 no traen campo «Trazabilidad» en el formato de las demás (no verificado si la declaran en otro lugar; en los README de 06 y 09 no aparece declaración de upstream/downstream).

Fuentes: `SDD/Docs/Unidades-Entrega/*/*/README.md`; recuento por `git ls-files`.

> **Nota de deriva (no se resuelve aquí → 19).** Varias cabeceras de unidad citan recuentos anteriores a la consolidación (p. ej. `Api/03` y `Api/10` dicen «doce casos de uso»; `Docs/README.md` §7.3 dice que la unidad `Api` tiene nueve).

## 5. El manifiesto como composición documental

| Sección del manifiesto | Qué gobierna en el corpus |
| --- | --- |
| §1 Bloque de producto | `Nombre-Producto`, `Slug-Producto` (`Fabrica-De-Geometria`, derivado), `Raiz-Codigo` (`GeometriaFactory`), `Artefacto-Agrupacion` (`GeometriaFactory.sln`), unidad principal; origen: PRODUCT-INTAKE 5.0 §13.1–§13.3 |
| §1.1 Procedencia del framework | versión SDD de la que procede el árbol (13.16 desde la migración 13.7 → 13.16) → 17 |
| §1.2 Perfil de convención de nombres | → 14 |
| §2.A / §2.B / §2.C / §2.1 | unidades, proyectos, matriz de composición, regla de nombres de código |
| §3 Los dos grafos | compilación e integración → 04 |
| §4 Validaciones bloqueantes | resultado de las validaciones sobre las unidades de entrega |
| §5 Flags derivados | condicionan qué categorías se emiten (p. ej. gating de 04: omitida por `usa_llm` == false) |
| §6 Control de cambios | historial de versiones del manifiesto |

Es artefacto **derivado** por el orquestador desde el intake; «no se completa a mano». La cabecera del README raíz declara que lo **refleja** sin replicar su versión, pero su §2 dice reflejar el manifiesto **2.2** §2.A–§2.C (el vigente es 7.1): contradicción interna del README. Fuente: `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` (cabecera y §1–§6); `SDD/Docs/README.md` (cabecera «Refleja» y §2).

## 6. Pipeline SDD y regla de autoridad

| Regla | Enunciado | Fuente |
| --- | --- | --- |
| Generación | El corpus lo generan subagentes del framework por fases; cada fase cierra con auditoría independiente; detención obligatoria entre fases | `SDD/Docs/README.md` §6 |
| Regeneración | Parte del intake y del manifiesto derivado | `SDD/Docs/README.md` §6 |
| Obligaciones del que interviene | abrir la fuente original antes de citarla; contar sobre el instrumento; declarar lo que no está decidido en vez de resolverlo por conveniencia | `SDD/Docs/README.md` §6 |
| Satélites no emitidos | `CHANGELOG.md` (el registro es `changelog.md` de la raíz del código; apartamiento declarado), `CONTRIBUTING.md`, `LICENSE.md` | `SDD/Docs/README.md` §6 |
| Avance de construcción | única fuente: `changelog.md` raíz; el README publica, no replica | `SDD/Docs/README.md` §7.2 → 03 |
| Magnitudes | viven contadas en `Producto/Vista-Producto.md`; el README dejó de replicarlas | `SDD/Docs/README.md` §7.3 |
| Roadmap | única fuente: `00-Contexto/Roadmap-Producto.md` | `SDD/Docs/README.md` §7.3 → 03 |
| Pipeline de producto | orquesta por encima del `Pipeline-CI-CD.md` de cada unidad: no lo duplica, lo referencia; orden en 4 niveles topológicos; no publica paquetes | `SDD/Docs/Producto/Pipeline-Producto.md` §1–§2 → 12 |
| Vista de producto | mapa de proyectos, grafo, contratos inter-proyecto, decisiones de producto, riesgos; §8 traza contrato ↔ arista | `SDD/Docs/Producto/Vista-Producto.md` → 04, 06 |

## 7. Documento superado: `Handoff-Checkout.md`

| Campo | Valor |
| --- | --- |
| Versión / fecha | 1.10 · 2026-08-12 · autor Orquestador SDD (`Master-Prompt.md` 5.2 §12) |
| Estado real | **Superado** por la migración 6.0 → 8.6 (inventario de siete proyectos, doce CU, `RN-01..16`) |
| Por qué no se reconectó | reescribir identificadores dejando recuentos viejos produciría afirmaciones nunca ciertas (hallazgo M-08 de `Audit/Informe-Migracion-6.0-a-8.6.md`) |
| Dónde está hoy lo que inventariaba | composición → manifiesto §2; inventario por categoría → `Producto/Vista-Producto.md`; CU de `Api` → `Api/02-Especificacion-Funcional/README.md`; archivado → READMEs de `_legacy/`; estado de migración → informe 6.0 → 8.6 |

Fuente: `SDD/Docs/Handoff-Checkout.md` (bloque inicial). **No usar como fuente de estado.**

## 8. Flujo de lectura por rol

| Rol | Orden recomendado | Por qué |
| --- | --- | --- |
| Product Owner (el docente) | 00 → 01 → 06 → 07 | visión, necesidades y compromiso por etapa antes de aprobar un punto de control |
| Desarrollador que retoma | 00 → `Producto/Vista-Producto.md` → 02 → 05 → 10 → 11 | el mapa entero antes de entrar por un proyecto |
| Auditor o QA | 02 → 08 → `Audit/` | criterios y matriz, luego lo ya revisado |
| Operador | `Producto/Pipeline-Producto.md` → 09 de la unidad → 11 | el despliegue es conjunto |

Advertencia común: ningún rol empieza por la categoría de un proyecto suelto. Fuente: `SDD/Docs/README.md` §5.

**Para una IA que entra al corpus:** `SDD/README.md` (puntero) → `SDD/Docs/README.md` → manifiesto → `Producto/Vista-Producto.md` → la categoría de la unidad que toque. Para estado vigente, `changelog.md` y `00-Contexto/Roadmap-Producto.md`, nunca `Handoff-Checkout.md`.

## 9. Responsables y numeración de roles

| Rol | Responsable | Canal |
| --- | --- | --- |
| Product Owner | docente de Programación 2 | punto de control de cada etapa, OK explícito |
| Lead técnico | el mismo docente, asistido por agente de IA | el PR de la etapa |
| Auditoría | auditor independiente, desde cero en cada fase | `Docs/Audit/` |
| Dueño del problema | la cátedra | consultivo, vía PO |

Roles `AG` en cinco dígitos desde la migración 10.0 → 13.3 (framework 12.0): `AG-00` → `AG-00000`, `AG-01` → `AG-00010`…; el rango `AG-00020 a AG-00110` incluye `AG-00031` (subagente de fase). Fuente: `SDD/Docs/README.md` §4 y §10.

## 10. Ubicaciones remitidas

| Ubicación | Qué es (sólo ubicación) | Índice |
| --- | --- | --- |
| `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/` | expediente resuelto (apertura y cierre 2026-09-13): `README.md`, `actuaciones/`, `propuestas/`, `evidencia/` | 17 |
| `SDD/Maquetas/GeometriaFactory-Web/` | maquetas HTML, aprobadas por el PO el 2026-08-11; README con barra de validación (§3) | 09 |
| `SDD/Docs/Audit/` | 120 archivos vivos: 103 `.md` (informes) y 17 `.json` (registros de reconexión, citas y renombre) | 16, 17 |
| `SDD/Docs/Producto/Adrs/` y `*/05-Arquitectura-Tecnica/Adrs/` | ADR | 15 |
| `SDD/Docs/README.md` §7–§8 (estado, puntos abiertos) | estado y pendientes | 03 |
| `SDD/Docs/README.md` §9 (glosario rápido) | vocabulario | 14 |
