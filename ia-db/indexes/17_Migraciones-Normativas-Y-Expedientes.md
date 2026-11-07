# 17 · Migraciones normativas, archivado `_legacy` y expedientes

> **Propósito:** ubicar cada migración normativa del marco SDD que atravesó el corpus de `Lab-Geometria`
> (plan, informe, registros), las consolidaciones 8.5 y M10, los inventarios de renombre/renumeración,
> el archivado `_legacy/` (qué migración produjo cada carpeta) y el expediente EXP-0001.
> **Fuente primaria:** `SDD/Docs/Audit/` (Plan-/Informe-/Migracion-*), `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/`,
> `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` §1.1 (estado de la cadena).
> **Revisión indexada:** `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** el contenido vigente de los documentos migrados (índices 02–14), las ADR como decisión (→ 15),
> las mesas como instrumento (→ 16), el mapa del corpus (→ 01).

---

## 1. Cadena de migraciones (vista única)

Estado declarado en `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` (fila «Estado», l. 22):
ocho migraciones cerradas; el paso **13.3 → 13.7 no fue migración** (procedencia movida sin migrar el
2026-08-27, salida `C` de la quinta reanudación).

| # | Salto | Fecha | Plan | Informe (M6) | Veredicto declarado |
|---|---|---|---|---|---|
| 1 | 6.0 → 8.6 | 2026-08-15/16 | `Migracion-8.1-Arbol-De-Migracion.md` (inventario, pasada 1 de 2) | `Informe-Migracion-6.0-a-8.6.md` 6.0 (ronda 6) | APROBADO, 0 P0 / 0 P1 |
| 2 | 8.6 → 8.11 | 2026-08-16 | `Plan-Migracion-8.6-a-8.11.md` 1.0 | `Informe-Migracion-8.6-a-8.11.md` 2.0 | APROBADO (ronda 2): 0 P0, 0 P1, 2 P2, 1 P3 |
| 3 | 8.11 → 9.9 | 2026-08-17 | `Plan-Migracion-8.11-a-9.9.md` 1.0 | `Informe-Migracion-8.11-a-9.9.md` 1.0 | APROBADO: 0 P0, 0 P1, 3 P2, 3 P3 |
| 4 | 9.9 → 9.10 | 2026-08-17 | `Plan-Migracion-9.9-a-9.10.md` 1.0 | `Informe-Migracion-9.9-a-9.10.md` 1.0 | APROBADO sin hallazgos (alcance documental cero) |
| 5 | 9.10 → 9.12 | 2026-08-17 | `Plan-Migracion-9.10-a-9.12.md` 1.0 | `Informe-Migracion-9.10-a-9.12.md` 1.0 | APROBADO: 1 P3 cerrado |
| 6 | 9.12 → 10.0 | 2026-08-19/20 | `Plan-Migracion-9.12-a-10.0.md` 1.0 | `Informe-Migracion-9.12-a-10.0.md` 1.0 | APROBADO CON UN HALLAZGO (1 P2 cerrado); auditor no independiente (§0) |
| 7 | 10.0 → 13.3 | 2026-08-23/25 | `Plan-Migracion-10.0-a-13.3.md` 1.8 | `Informe-Migracion-10.0-a-13.3.md` 1.0 | APROBADO CON HALLAZGOS en 2ª ronda (1ª rechazó con 3 P0); auditor no independiente |
| — | 13.3 → 13.7 | 2026-08-27 | — | — | Sin migración: cambio de procedencia (manifiesto l. 22) |
| 8 | 13.7 → 13.16 | 2026-09-13 | `Plan-Migracion-13.7-a-13.16.md` 1.4 | `Informe-Migracion-13.7-a-13.16.md` 1.1 | Ronda 1: APROBADO CON OBSERVACIONES; cierre M4 en EXP-0001 act. 012; **migración completa**, manifiesto 7.1 |

Todas las rutas de la tabla son relativas a `SDD/Docs/Audit/`.

### 1.1 Rasgos de cada salto (sólo lo que el documento declara en cabecera o §1)

| Salto | Instrumento normativo citado | Rasgo | Fuente |
|---|---|---|---|
| 6.0 → 8.6 | `Master-Prompt-Migracion.md` 2.0 §10; `Migracion-Rules.md` §4.3.1/§4.3.2 | Salto major de los 15 archivos normativos; reemplazo de `Proyectos/` por `Unidades-Entrega/`; magnitudes: 26.057 identificadores renumerados, 844 enlaces (M4), 2208 citas (M2), 377 de regla (M9), 442 de artefacto (M8), 927 en la consolidación | `Informe-Migracion-6.0-a-8.6.md` §8 y `Migracion-8.1-Arbol-De-Migracion.md` §1 (magnitudes); el reemplazo de `Proyectos/` por `Unidades-Entrega/`, en el historial git: commit 10276bd («reestructuración a unidades de entrega, migración 6.0 a 8.2»), que borra `SDD/Docs/Proyectos` |
| 8.6 → 8.11 | `Master-Prompt-Migracion.md` 2.3, `Migracion-Rules.md` 3.4 | Diff tomado de `Estado-Del-Destino-2026-08-16.md` §4, «verificado y no reconstruido»; reparación de `N-01`, `N-04` antes de ronda 2 | `Plan-Migracion-8.6-a-8.11.md` cabecera; informe cabecera |
| 8.11 → 9.9 | `Master-Prompt-Migracion.md` 2.7, `Migracion-Rules.md` 3.7 | Siete filas de plan, M2–M5; invocado desde `Master-Prompt-Reanudacion.md` | `Plan-Migracion-8.11-a-9.9.md`; informe §1 |
| 9.9 → 9.10 | `Migracion-Rules.md` 3.8 | Un solo artefacto del framework; única escritura: bloque de procedencia | `Plan-Migracion-9.9-a-9.10.md` §1; informe §1 |
| 9.10 → 9.12 | `Migracion-Rules.md` 3.9 | 18 artefactos del framework (incluidas 11 reglas de categoría) con alcance documental cero | `Plan-Migracion-9.10-a-9.12.md` §1 |
| 9.12 → 10.0 | `Master-Prompt-Migracion.md` 2.8 | «Sexta migración de este destino» | `Plan-Migracion-9.12-a-10.0.md` cabecera |
| 10.0 → 13.3 | `Master-Prompt-Migracion.md` 2.8, M1 | Origina en salida `B` de `Estado-Del-Destino-2026-08-23.md` | `Plan-Migracion-10.0-a-13.3.md` cabecera |
| 13.7 → 13.16 | `Master-Prompt-Migracion.md` 2.10 | Base `b9675d8`; aplicado en `c14bf3b`; rama fusionada en `1d4afc4` (PR #205) | `Plan-Migracion-13.7-a-13.16.md` cabecera; `changelog.md` §«Migración normativa SDD 13.7 → 13.16» (l. 1708) |

Las versiones de `Master-Prompt`/`Migracion-Rules` viven en el repo del framework (IA.SDD), fuera de este índice: **no verificable aquí**.

---

## 2. Documentos de trabajo de las migraciones (`SDD/Docs/Audit/`)

### 2.1 Migración 6.0 → 8.x (archivo `Migracion-8.1-*`, `Migracion-M*`)

| Documento | Qué es | Estado declarado |
|---|---|---|
| `Migracion-8.1-Arbol-De-Migracion.md` | Diff normativo y árbol de migración (§4.3.1 renumeración, §4.3.2 estructural) | Pasada 1 de 2 — inventario, sin modificar el destino |
| `Migracion-8.1-Deduplicacion-Propuesta.md` | 25 pares de casos de uso «misma capacidad vista desde otra capa» | Propuesta no aplicada; reemplazada por 8.5 |
| `Migracion-8.5-Consolidacion-Decidida.md` 1.2 | Consolidación de CU por capacidad (capas Api/Application/Infrastructure/Domain por verbo del título) | Decidida, aplicada sobre el árbol definitivo |
| `Migracion-M10-Consolidacion-Fusion.md` 2.0 | Cierre del hallazgo M-10 del informe 6.0→8.6: inventario y cuatro salidas por categoría | Ejecutado y cerrado: 67/67 grupos, 18/18 carpetas `_fusion/` retiradas |
| `Migracion-M2-Propuesta-Intake.md` 1.0 | M2: intake 1.34 (plantilla 2.1) → plantilla 3.0, diff de estructura + batería; exige dos aprobaciones | Propuesta (el intake no se tocó por este documento) |

### 2.2 Registros JSON (citas, reconexión, renombre)

| Archivo | Migración / fase | Magnitud (recontada sobre el JSON) |
|---|---|---|
| `Migracion-8.1-Registro-Reconexion.json` | 6.0→8.x, reconexión de enlaces | lista de 703 entradas |
| `Migracion-8.1-Registro-Reconexion-Contracts.json` | 6.0→8.x, árbol de Contracts | 141 entradas |
| `Migracion-M2-Registro-Citas-17.json` | M2, citas al §17 del intake | 2208 entradas |
| `Migracion-M8-Registro-Citas-Arbol.json` | M8, citas de árbol | 71 resueltas / 74 pendientes |
| `Migracion-M8-Registro-Citas-Arbol-Lectura.json` | M8, lectura | 3 entradas |
| `Migracion-M8-Registro-Citas-Norma.json` | M8, citas a la norma | 315 resueltas + 15 por lectura |
| `Migracion-M8-Registro-Citas-PlanEtapaA.json` | M8, plan de la etapa a | 40 resueltas / 0 pendientes |
| `Migracion-M9-Registro-Citas-RN.json` | M9, citas de regla RN | 377 entradas |
| `Migracion-M10-Registro-Reconexion.json` | M10, pasada 1 | 92 reconectados / 2 sin resolver |
| `Migracion-M10-Registro-Reconexion-2.json` | M10, pasada 2 | 404 / 2 |
| `Migracion-M10-Registro-Reconexion-3.json` | M10, pasada 3 | 180 / 2 |
| `Migracion-M10-Registro-Reconexion-4.json` | M10, pasada 4 | 136 / 20 |
| `Migracion-M10-Registro-Reconexion-5.json` | M10, pasada 5 | 5 / 2 |
| `Migracion-M10-Registro-Reconexion-Web.json` | M10, unidad Web | 122 / 2 |
| `Migracion-M10-Registro-Renombre-Samples.json` | M10, renombre de samples | 26 entradas |
| `Migracion-8.11-Registro-Reconexion-Etiquetas.json` | 8.6→8.11, M5 (reparación previa al cierre) | 41 reconectadas en 27 docs; 4 sin reconectar; 1 fuera de alcance |
| `Cierre-N05-Registro-Reconexion.json` | Cierre de `N-05` (informe 8.6→8.11 2.0 §6), 2026-08-17 | 4 reconexiones; corrige el motivo «absorbido» del registro anterior (los cuatro existían renumerados) |

Método común declarado: «resolución por destino, no sustitución de patrón» (`Migracion-8.11-Registro-Reconexion-Etiquetas.json`, campo `metodo`).

### 2.3 Inventarios y planes de conversión posteriores

| Documento | Fecha | Qué mide | Resultado declarado |
|---|---|---|---|
| `Plan-Conversion-Nomenclatura-Item-Diferido.md` 1.0 | 2026-08-20 | Dos reparaciones post-M6: `N-01` (nombre de la columna del ítem diferido contra `Root-Rules.md` 7.0 §12.2) y remedio de `M-01` | «Ninguna reabre la migración» |
| `Inventario-Renumerado-R-4-2026-08-29.md` 1.0 | 2026-08-29 | Tramo `R-4` decidido al retirar ADR-14005: 507 ocurrencias renumeradas al mapa de bloques (00 Api, 02 Domain, 04 Application, 06 Infrastructure, 08 Contracts, 10 Web, 12 Visor) | 278 referencias `QG`/`CV` quedan sin bloque, por decisión |
| `Inventario-Renombre-F03-2026-08-31.md` 1.0 | 2026-08-31 | Tramo `R-3` (norma de nomenclatura §4.1, V-4 §7): qué NO se renombra | 723 ocurrencias candidatas en 133 documentos vivos, de 101 códigos de §6.8 del glosario |
| `Inventario-Marcas-A-Verificar-2026-08-31.md` 1.2 | 2026-08-31 | Marcas `[A VERIFICAR]` del corpus vivo | 71 apariciones, 5 incógnitas (2 ya sin pregunta); clasifica sin tocar |

La norma de nombres vigente → índice 14; las familias QG/CV como puertas → índice 11.

---

## 3. ADR 14001–14005 (sólo como origen migratorio)

Viven en `SDD/Docs/Producto/Adrs/`; su contenido y estado → índice 15.

| ADR | Título (del nombre de archivo) | Relación con la migración | Snapshots `_legacy` |
|---|---|---|---|
| ADR-14001 | Archivado central de la migración | Política del archivado `_legacy` | `Producto/Adrs/_legacy/2026-08-17/…-v1.0.md`, `2026-09-13/…-v1.2.md` |
| ADR-14002 | Familias propias del intake con ancho de origen | Identificadores heredados del intake | `2026-08-17/…-v1.0.md`, `2026-09-13/…-v1.2.md` |
| ADR-14003 | Dirección del backend por IP dinámica | Apartamiento declarado; tocado por EXP-0001 (`c14bf3b`) | `2026-09-13/…-v1.3.md` |
| ADR-14004 | Ítem obligatorio sin objeto se declara «No aplica» | Apartamiento; tocado por EXP-0001 | `2026-09-13/…-v1.2.md` |
| ADR-14005 | Familias acuñadas por el destino con ámbito de proyecto | Su retiro originó el tramo `R-4` | — |

Commit de introducción y campos 4–6 de los cinco apartamientos: `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/evidencia/E-008-apartamientos.txt`.

---

## 4. Archivado `_legacy/` (estructura y conteo; contenido no indexado)

**679 archivos versionados** bajo algún `_legacy/` (`git ls-files | grep /_legacy/`). Política: el contenido
retirado se conserva íntegro, «Archivado. Conservado íntegro, no descartado»
(`SDD/Docs/_legacy/2026-08-15-migracion-8.2/README.md`); nada se reescribe. Los snapshots por reemisión llevan sufijo `-vX.Y`; el archivado central de las migraciones conserva el nombre original sin sufijo (225 de los 679 archivos: 59 en `2026-08-15-migracion-8.2`, 33 en `consolidacion-8.5`, 132 en `consolidacion-m10`, 1 en `Api/03-UX-UI-DX/_legacy/2026-08-09`).

Los conteos por carpeta (total, desglose de `SDD/Docs/_legacy/` e `Intake/_legacy/`, totales por carpeta del corpus) son del índice 01 §2 y §4.2; aquí sólo la procedencia.

### 4.1 Archivos centrales (`SDD/Docs/_legacy/`)

| Carpeta | Archivos | Qué la produjo | Fuente |
|---|---|---|---|
| `2026-08-15-migracion-8.2/` | 87 | 6.0→8.x: árbol documental de `GeometriaFactory-Contracts` (deja de ser unidad de entrega) | su `README.md` |
| `2026-08-16-consolidacion-8.5/` | 33 | Consolidación 8.5 de CU de `GeometriaFactory-Api` | `Audit/Migracion-8.5-Consolidacion-Decidida.md` |
| `2026-08-16-consolidacion-m10/` | 138 | M-10: documentos absorbidos (Api y Web), 67 grupos | su `README.md`; `Audit/Migracion-M10-Consolidacion-Fusion.md` |
| `2026-08-24/` | 1 | `README-v1.6.md`: migración 10.0→13.3, M4 corte 2 (README raíz) | commit 6d195a4 |
| `2026-09-13/` | 2 | `README-v2.7.md`, `README-v2.8.md` (EXP-0001 M5) | EXP-0001 README §3 |

### 4.2 `SDD/Intake/_legacy/`

| Fecha | Archivos | Fecha | Archivos |
|---|---|---|---|
| 2026-08-08 | 32 | 2026-08-25 | 1 |
| 2026-08-16 | 2 | 2026-09-12 | 6 |
| 2026-08-17 | 5 | 2026-09-13 | 5 (incl. manifiesto `-v7.0` de EXP-0001) |
| 2026-08-19 | 1 | 2026-09-15 | 1 |

### 4.3 `_legacy/` por carpeta del corpus

| Ubicación (bajo `SDD/Docs/`) | Fechas (archivos) |
|---|---|
| `00-Contexto/_legacy/` | 08-08 (5), 08-09 (4), 08-18 (1), 08-23 (1), 09-12 (2), 09-13 (5), 09-14 (1) |
| `01-Necesidades-Negocio/_legacy/` y `…/Necesidades-De-Negocio/_legacy/` | 08-08 (2+7), 08-09 (1+2) |
| `Audit/_legacy/` | 09-14 (3), 09-15 (1) |
| `Producto/_legacy/`, `11-Documentacion/`, `Adrs/`, `Contratos-Inter-Unidad/` | 08-17 (5+1+2), 09-13 (2+4+8), 09-14 (2+1+2) |
| `Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/**/_legacy/` | 08-09, 08-09-b, 08-09-c, 08-10, 09-14 (72 en total, incl. Casos-De-Uso, Reglas-De-Negocio, Modelo-Datos) |
| `…/GeometriaFactory-Api/03-UX-UI-DX/_legacy/` | 08-09 (11), 08-09-c (3), 08-10 (4) |
| `…/GeometriaFactory-Api/05-Arquitectura-Tecnica/_legacy/` | 09-13 (2), 09-14 (4) |
| `…/GeometriaFactory-Api/06-Backlog-Tecnico/**/_legacy/` | 08-25 (114 HU + 2), 09-12 (1), 09-13 (2) |
| `…/GeometriaFactory-Api/07-Plan-Sprint/_legacy/` | 08-25, 09-12, 09-13 (2), 09-14, 09-15 |
| `…/GeometriaFactory-Api/08-Calidad-Y-Pruebas/_legacy/` | 09-14 (1) |
| `…/GeometriaFactory-Api/09-Devops/_legacy/` | 08-24 (4), 09-13 (3), 09-14 (1), 09-15 (1) |
| `…/GeometriaFactory-Web/02-Especificacion-Funcional/**/_legacy/` | 08-09 (7+4) |
| `…/GeometriaFactory-Web/03-UX-UI-DX/_legacy/` | 08-09 (16) |
| `…/GeometriaFactory-Web/05-Arquitectura-Tecnica/_legacy/` | 09-13 (2), 09-14 (1) |
| `…/GeometriaFactory-Web/06-Backlog-Tecnico/**/_legacy/` | 08-25 (30 HU + 2), 09-13 (1) |
| `…/GeometriaFactory-Web/07-Plan-Sprint/`, `08-Calidad-Y-Pruebas/` | 08-25 (1), 08-09 (1) |
| `…/GeometriaFactory-Web/09-Devops/_legacy/` | 08-24 (4), 09-13 (2), 09-14 (1) |

Correspondencia fecha → evento: 08-15/16 migración 6.0→8.x y consolidaciones; 08-17 migraciones 8.11→9.12;
08-19 (`Intake/_legacy/`) cierre 9.12→10.0, M4 y M5 (commit 514aba9); 08-24 migración 10.0→13.3, M4 corte 2 y
corte 09 (commits 6d195a4, 407240a); 08-25 cierre 10.0→13.3 (backlog HU); 09-13 EXP-0001 (24 snapshots declarados
en el README del expediente §3). 08-09-b, 08-09-c y 08-10 entraron al repo con la reestructuración 6.0→8.2
(commit 10276bd), con fechas de reemisión previas; 08-18 (commit 2e04013) y 08-23 (commit 4688a9e) son
reemisiones no migratorias. Las demás fechas (08-08, 08-09, 09-12, 09-14, 09-15) corresponden a reemisiones no
migratorias: **no verificado aquí** qué evento produjo cada una; ver `changelog.md` por fecha.

---

## 5. Expediente EXP-0001 — Migración normativa a 13.16

Carpeta: `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/`. Carátula: `README.md`.

| Campo | Valor (README) |
|---|---|
| Estado | Resuelto — migración completa, procedencia 13.16 (act. 013); lote de cierre F y G con default |
| Apertura / cierre | 2026-09-13 / 2026-09-13 |
| Ramas | `migracion/a-13.16` (base `b9675d8`, fusionada en `1d4afc4`, PR #205) y `migracion/a-13.16-aplicacion` |
| Forma | Adelanto declarado a una norma de expedientes que el framework aún no tenía; folios no se reescriben; evidencia con SHA-256 |
| Relación con Audit | Plan, mesa (`Audit/Mesa-2026-09-13.md` → índice 16) e informe viven en `SDD/Docs/Audit/`; el expediente los folia por enlace |

### 5.1 Actuaciones (`actuaciones/`)

| Nº | Tipo | Resumen |
|---|---|---|
| 001 | presentación | Pedido del PO: migrar Lab-Geometria; ante problema, mesa y no detención |
| 002 | testimonio | OK de la fase `k` (roadmap, mini-plan, changelog; commit `7864428`) |
| 003 | informe | M0: compuerta (base `b9675d8`), procedencia 13.7, diff sin major |
| 004 | mesa | Mesa de M1: 42 hallazgos, 10 del refutador, 30 veredictos, D-1..D-6 |
| 005 | providencia | M2–M4 sólo como propuesta; migración parcial declarada |
| 006 | informe | Seis propuestas con texto exacto y verificación |
| 007 | testimonio | Despacho del orquestador: sin push/PR/merge/tag; apartamiento de `Master-Prompt.md` §12.1 |
| 008 | testimonio | Instrucción del coordinador de tomar la delegación como aprobación: **no se asienta como aprobación** |
| 009 | auditoría | M6 rondas 1–2 aprobadas con observaciones |
| 010 | resolución | Lote de cuatro puntos al PO con sus defaults |
| 011 | testimonio | PO: «A aprobado / B aprobado» (plan 1.3 y diff del intake); C–E por default |
| 012 | auditoría | Cierre de M4 sobre `c14bf3b`: 0 P0, 2 P1, 3 P2, 8 P3 (`M6-19`..`M6-31`) |
| 013 | resolución | Migración completa; M5 (manifiesto 7.1, `add9f01`); lote F (116 cabeceras con versión citada) y G |

Fuente: `README.md` §1 y cada `actuaciones/NNN-*.md`.

### 5.2 Propuestas (`propuestas/`) y su guion

| Propuesta | Objeto |
|---|---|
| `P-01-intake-5.0.diff` | Intake 4.6 → 5.0 (M2) |
| `P-02-manifiesto-7.0.diff` | Manifiesto 6.1 → 7.0 (M3) |
| `P-03-vista-producto-1.11.diff` | `Vista-Producto.md` 1.10 → 1.11 |
| `P-04-pipeline-producto-1.9.diff` | `Pipeline-Producto.md` 1.8 → 1.9 |
| `P-06-ciclo-de-origen-118-filas.diff` | Campo «ciclo de origen» en 118 filas de ítems diferidos |
| `P-06b-ciclo-de-origen-8-cu.diff` | Campo 5 en los ocho ítems de `CU-08001`..`CU-08008` |
| `P-08-apartamientos.diff` | Apartamientos (ADR 14001–14004) |
| `aplicar-propuestas.sh` | Aplica por fases (`--aprobacion NNN --fase intake|manifiesto|…`); no corre sin actuación de aprobación |
| `E-016-verificacion-de-aplicacion.txt` | Ensayo del guion sobre worktree descartable |

No hay P-05 ni P-07 versionados (`git ls-files propuestas/`): la numeración tiene huecos; motivo **no verificado** en este índice.

### 5.3 Evidencia (`evidencia/`)

| Grupo | Archivos | Qué prueba |
|---|---|---|
| Arranque y reconocimiento | E-001, E-002, E-007, E-012 | Compuerta git, versiones 13.7 vs 13.16, volumen del corpus, build+tests base (553/553) |
| Ítems diferidos y ciclo de origen | E-005, E-006/b (retirada por la mesa), E-006e/f (v4), **E-006g/h (v5 vigente: 95 derivadas, 23 no derivables)**, E-013, E-015, E-015b, E-020 | Inventario de 118 filas y derivación por `git log -S` |
| Mesa | E-017 (jurado), E-018 (refutador), E-019 (panel, 42 hallazgos), E-021 (presidente) | Registro íntegro de la mesa de M1 |
| Puntos sueltos | E-003 (17 ocurrencias «activo de construcción»), E-004 (`verify-solution-tree.sh`), E-008, E-009 (prefijo `MN-`), E-010 (6 enlaces rotos en samples/contracts), E-011 (118 cabeceras, 23 versiones), E-014/b (`Rules-Examples` §3.6) | Mediciones puntuales |
| Cierre | E-022 (verificación de `c14bf3b`: 984 enlaces, 0 rotos), E-023 (build Web sin Node → `MSB3073`, `M6-27`), E-024 (audit de cierre íntegro) | Lo aplicado y su auditoría |

SHA-256 de cada pieza: `README.md` §2. Artefactos tocados por commit (`7864428`, `5682307`, `c14bf3b`, `c6d754e`, `add9f01`): `README.md` §3.

### 5.4 Lo que el expediente deja fuera

- Lote F (cabeceras con versión citada) y G (confirmación de la procedencia): con default, no reabren (README §4).
- Ítems `DD-1`..`DD-9` de `Audit/Mesa-2026-09-13.md` §8 → pendientes en índice 03.
- Migrar `RPI.VideoControl` a 13.16: expediente propio, fuera de este repo (act. 001, P-2).
- Lectura de `M6-31` (fase `k` cerrada sobre la `i` abierta) → índices 03/19.

---

## 6. Cómo ubicar algo rápido

| Busco… | Ir a |
|---|---|
| Por qué un documento tiene un snapshot `-vX.Y` | §4 por fecha + `changelog.md` de esa fecha |
| Dónde fue a parar una referencia rota tras 6.0→8.x | JSON de §2.2 (campo destino) |
| Qué aprobó el PO en la migración a 13.16 | EXP-0001 act. 011 |
| Versión normativa vigente del corpus | `PRODUCT-MANIFEST-Fabrica-De-Geometria.md` 7.1 §1.1 (SDD 13.16) |
