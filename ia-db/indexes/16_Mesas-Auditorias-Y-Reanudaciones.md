# 16 · Mesas de expertos, auditorías de producto y reanudaciones

> **Propósito:** ubicar cada instrumento de evaluación que el producto corrió sobre sí mismo —mesas de
> expertos, informes de estado de las reanudaciones, auditorías por ronda y observaciones del proceso—
> con su fecha, su alcance, lo que encontró y cómo terminó.
> **Fuente primaria:** `SDD/Docs/Audit/` (sólo los archivos vivos; `SDD/Docs/Audit/_legacy/` se cuenta).
> **Revisión indexada:** `main` `5f07b12` (PR #234) · ia-db 4.0 · 2026-11-01.
> **No cubre:** la lista consolidada de pendientes (→ `03`), las migraciones normativas, sus planes,
> informes y registros JSON, y el expediente 0001 (→ `17`), las mediciones de puertas `PT-xx`/`QG-xx`
> (→ `11`), ni el contenido de las ADR que estas instancias propusieron (→ `15`). Aquí sólo se dice
> **qué instancia** lo decidió y **dónde** consta.

---

## 1. Mapa rápido

| Familia de documento | Patrón de archivo (en `SDD/Docs/Audit/`) | Cantidad viva | Qué es | Emite veredicto |
|---|---|---|---|---|
| Mesa de evaluación / de expertos | `Mesa-AAAA-MM-DD[-X\|-ciclo-2].md` | 12 | Panel a ciegas + refutador + jurado de cinco; mira lo existente y emite **plan** | No (veredicto por hallazgo: PROCEDE / NO_PROCEDE / ESCALAR) |
| Informe de estado de reanudación | `Estado-Del-Destino-AAAA-MM-DD.md` | 7 | Fase R3 del orquestador de reanudación: seis dimensiones, divergencias, salida elegida | No («declara estado») |
| Auditoría por ronda | `<Fase>-…-rN.md` | ver §4 | Auditor independiente sobre una tanda: APROBADO / RECHAZADO | Sí |
| Evidencia de corrida de fase `k` | `Apertura-Fase-k-…`, `DoR-Tramo-k-…`, `BT-00027-Cierre-…` | 3 | Verificación con comando y salida | Estado `Aprobado` |
| Plan / cierre / análisis | `Plan-Mejora-Integral-…`, `Cierre-De-Hallazgos-…`, `Analisis-Refresco-…` | 3 | Insumo de decisión | No |
| Observación del proceso | `Observacion-*.md`, `Reporte-Primera-Aplicacion-Del-Instrumento.md` | 7 | Defecto de **cómo** se trabajó, no de lo producido | No |
| Archivo | `_legacy/2026-09-14/`, `_legacy/2026-09-15/` | 4 | Versiones previas de `Mesa-2026-09-14` (1.2, 1.3) y de `Medicion-PT-05` (1.3, 1.4) | — |

Vocabulario del método (definido en cada registro; la norma vive en el framework, fuera del repo):

| Término | Significado | Fuente en el repo |
|---|---|---|
| Clase del ancla `E1`–`E4`, `C` | Fuerza de la evidencia de un hallazgo (`C` = sin ancla, se descarta) | `SDD/Docs/Audit/Mesa-2026-08-27.md` §1 |
| Nivel `P0`–`P3` | Severidad (se reusa de `Master-Prompt.md` §10) | ídem |
| Severidad `S1`–`S4` + confianza `[0,1]` | Escala del marco del PO adoptada por la mesa del 08-29 | `SDD/Docs/Audit/Mesa-2026-08-29.md` §0 |
| Salvaguarda de homogeneidad | Si el jurado vota 5-0 en > 80 % de los ítems, el ciclo es sospechoso | `SDD/Docs/Audit/Mesa-2026-08-31-B.md` §7 |
| Compuerta de capa de origen | Ningún parche corrige aguas abajo un defecto de aguas arriba | `SDD/Docs/Audit/Mesa-2026-08-27.md` §7 |
| Prefijo de familia del ciclo | Cada mesa acuña un prefijo libre (`MI-`, `RS-`, `RT-`, `MN-`, `RN8-`, `RN9-`, `RN10-`) verificado sin colisión en `Audit/` | cabeceras de cada `Mesa-*.md` |
| Salidas A–E de reanudación | A reparar · B migrar · C seguir en la versión declarada · D continuar la construcción · E retomar migración a medias | `SDD/Docs/Audit/Estado-Del-Destino-2026-09-12.md` §8.1 |

---

## 2. Las mesas, una por una

### 2.1 Tabla resumen

| Fecha | Registro | Versión | Convocatoria | Instrumento | Prefijo | Resultado en una línea |
|---|---|---|---|---|---|---|
| 2026-08-27 | `Mesa-2026-08-27.md` | 1.1 | Orquestador de reanudación 1.10, R1.5 (5.ª reanudación) | `Mesa-Rules.md` 1.0 (SDD 13.7) | `H-` | 9 hallazgos, 7 proceden, 6 parches; 4 escaladas `E-01..E-04` |
| 2026-08-29 | `Mesa-2026-08-29.md` | 1.2 | Marco del PO (`Mesa-Evaluadora.md`) | Marco del PO §1–§9, 2 ciclos de 3 | `H-`, `ESC-` | Instrumento de cobertura mal construido (suma → unión); `ESC-001` sin objeto |
| 2026-08-31 | `Mesa-2026-08-31.md` | 3.0 | PO, sobre lo abierto, «con agresividad» | `Mesa-Rules.md` 1.0 (SDD 13.8) | `M-` | 6 hallazgos, ninguno P0; plan de 4 unidades ejecutado el mismo día |
| 2026-08-31 | `Mesa-2026-08-31-B.md` | 1.1 | PO, condición §0.0 (sin orquestador) | `Mesa-Rules.md` 1.1 | `MI-` | 12 hallazgos, 12 PROCEDE, 2 P0; plan de 15 unidades |
| 2026-09-01 | `Mesa-2026-09-01-C.md` | 1.0 | PO, «el botón que no hacía nada» | `Mesa-Rules.md` §0.0 | `H-`, `A-`, `AB-` | Claves de protección de datos efímeras (cierto); `X-10` descartado |
| 2026-09-02 | `Mesa-2026-09-02.md` | 1.0 | PO, «el socket» | `Mesa-Rules.md` §0.0 | `V-`, `A-` | El anfitrión no ofrece WebSocket; ventana muerta ~3 s no eliminable |
| 2026-09-12 | `Mesa-2026-09-12.md` | 1.2 | Reanudación 7, R1.5 | `Mesa-Rules.md` (SDD 13.14) | `RS-` | 6 parches aplicados; 3 escaladas `E-02`, `E-04`, `E-05` |
| 2026-09-12 | `Mesa-2026-09-12-ciclo-2.md` | 1.1 | Directa, respuestas del PO a `E-02`/`E-04` | `Mesa-Rules.md` §0.0 | `RT-` (sin hallazgos propios) | Plan de 10 ítems → fila `k` del roadmap |
| 2026-09-13 | `Mesa-2026-09-13.md` | 1.3 | `Master-Prompt-Migracion.md` 2.10 M1 | `Mesa-Rules.md` | `MN-` | 30 filas de jurado; siete propuestas (`P-01`–`P-04`, `P-06`, `P-06b`, `P-08`; no hay `P-05` ni `P-07`); deuda `DD-1..DD-9` (→ `17`) |
| 2026-09-13 | `Mesa-2026-09-13-ciclo-2.md` | 1.1 | Reanudación 8, R1.5 | `Mesa-Rules.md` 1.4 | `RN8-` | 14 ítems `C-01..C-14` + 2 `RN8-REF`; una escalada `E-1` |
| 2026-09-14 | `Mesa-2026-09-14.md` | 1.4 | Mesa de expertos **a pedido** del PO | `Knowledge-Mesa-De-Expertos-A-Pedido.md` 1.1 + `Mesa-Rules.md` 1.4 | `RN9-` | 24 riesgos `R-01..R-24` + `RN9-REF-01`; plan en 4 lotes, mayormente ejecutado |
| 2026-09-15 | `Mesa-2026-09-15.md` | 1.0 | Mesa **delegada** por el PO | ídem | `RN10-` | 6 decisiones `D-1..D-6`, todas 5-0, aplicadas |

Fuera de `Audit/`: dos **mesas de UX/UI** (2026-09-02 y 2026-09-03) cuyos informes viven en el repo
de documentación (`Lab-Geometria.Documentacion/PROMPTs/Fixs/01-Ajuste-UX/` y `02-Ajuste-UX-2.0/`,
**no versionados en Lab-Geometria**). En este repo dejan rastro en `changelog.md:1003` («Lo que la
segunda mesa de UX/UI midió y reparó — 2026-09-03»), en `src/GeometriaFactory.Web/wwwroot/css/app.css:963`
y `:1148`, en `SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css:41` y `:942`, y en
comentarios de pruebas (`tests/GeometriaFactory.E2ETests/FiguraQueNoSePudoLeerTests.cs:12`,
`tests/GeometriaFactory.Integration.Tests/ForcedPasswordChangeSurfaceTests.cs:124`). Las doce reparaciones de la segunda mesa (2026-09-03) y sus mediciones
sí son verificables en `changelog.md:1003`; el informe completo de OUTPUTs y la primera mesa (2026-09-02)
no lo son **[no verificable aquí]**; el detalle visual va a `09`.

### 2.2 Mesa 2026-08-27 — primera mesa del destino

Fuente: `SDD/Docs/Audit/Mesa-2026-08-27.md` · consume: `Estado-Del-Destino-2026-08-27.md`.

| Hallazgo | Nivel / ancla | Veredicto | Parche |
|---|---|---|---|
| `H-01` tres filas «Cerrado» con el generador del inventario adentro | P1 / E2 | PROCEDE 5-0 | `P-01` → «Cerrado en parte» en las dos `Pipeline-CI-CD.md` |
| `H-02` `-Web` `PA-05` VENCIDO sobre punto cerrado | P1 / E2 | PROCEDE 5-0 | `P-02` |
| `H-03` evidencia con identificador equivocado (`ADR-10002` → `ADR-00002`) | P2 / E2 | PROCEDE 5-0 | `P-03` |
| `H-04` manifiesto e intake declaran plantillas distintas | P2 / E2 | PROCEDE 4-1 | `P-04` |
| `H-05` tres filas vencidas por evento que no podía cerrarlas | P1 / E4 | PROCEDE 5-0 | `P-06` → evento reasignado a fase `i` |
| `H-06` cita de versión del roadmap vieja | P3 / E2 | PROCEDE 5-0 | `P-05` |
| `H-07` recuento de diferidos: seis documentos, eran ocho | P2 / E1 | PROCEDE 5-0 | corregido en el informe de estado |
| `H-08` 456 citas de versión en cabeceras de trazabilidad | — / E1 | NO PROCEDE 4-1 | va a deuda declarada (§8) |
| `H-09` seis candidatos a enlace roto | — | NO PROCEDE 5-0 | ninguno era enlace |

Escaladas (§9): `E-01` regla de etiquetas (respondida por default); `E-02` herramienta de versión
`D7` (contestada 2026-08-30, opción c); `E-03` umbrales de `-Web` (opción b); `E-04` once ítems sin
evento de cierre (opción a). Jurado 5-0 en 78 %, bajo el umbral de homogeneidad.

### 2.3 Mesa 2026-08-29 — el instrumento de cobertura

Fuente: `SDD/Docs/Audit/Mesa-2026-08-29.md` (supera a la 08-27 en el **instrumento**, no en contenido).

- **Reajuste:** corre con el marco del PO (cinco chequeos mecánicos, severidad S1–S4, confianza) en vez de `Mesa-Rules.md` (§0).
- **Hallazgos:** `H-01` `tools/informe-cobertura.cs` sumaba informes en vez de unirlos (PROCEDE 5-0, parche `P-01`); `H-02` 40 historias `US-08xxx` citadas y nunca acuñadas (PROCEDE 5-0); `H-03` familias `QG`/`CV`/`PT` sin prefijo declarado (PROCEDE 4-1, ADR en `Propuesto`); `H-04` cobertura de `Domain` 77,7 % (ESCALAR → `ESC-001`).
- **Desenlace de `ESC-001`** (§7.1, opción A): la unión por ruta cruda tampoco alcanzaba; con unión por **ruta resuelta** `Domain` da 96,0 % líneas / 86,9 % ramas → **la escalada no tenía objeto**.
- **Ciclo 2** (§10): ambigüedad que `ADR-14005` no reparó; la mesa decide **no** repararla pese a tener aprobación y la eleva al framework (§10.3–§10.4).

### 2.4 Mesas 2026-08-31 (A y B) — «verifica condiciones, no efectos»

| Mesa | Fuente | Hallazgos | Desenlace |
|---|---|---|---|
| A (mañana) | `SDD/Docs/Audit/Mesa-2026-08-31.md` | `M-01..M-06` (2 P1, 3 P2, 1 P3), ninguna escalada | Plan de 4 unidades (README §8, barrido de ramas defensivas, ADR de apartamientos, índice vivo de hallazgos) **ejecutado y cerrado** el mismo día; §8ter mide que las cuatro creencias de partida estaban mal (p. ej. «dos códigos sin traducción» eran **quince**) |
| B (segunda del día) | `SDD/Docs/Audit/Mesa-2026-08-31-B.md` | `MI-01..MI-12`, los 12 PROCEDE; `MI-01` y `MI-02` **P0** 5-0 | Diagnóstico: *«este producto verifica sus condiciones y no verifica sus efectos»*. Plan en `Plan-Mejora-Integral-2026-08-31.md` §2 (reenvío en §0 de la mesa) |

Hallazgos de la mesa B (§7):

| Id | Tema | Nivel |
|---|---|---|
| `MI-01` | El respaldo, único mecanismo de vuelta atrás declarado, no existe en ningún árbol | P0 |
| `MI-02` | Bajo 768 px las tres listas no dibujan filas (tarjetas apiladas inexistentes) | P0 |
| `MI-03` | «El filtro no escala con el total» es falso: la petición filtrada hace dos llamadas | P1 |
| `MI-04` | `D4` límite de tamaño de cuerpo anclado a etapa cerrada | P1 |
| `MI-05` | El aparato de compuertas no es contrastable | P1 |
| `MI-06` | `ADR-10001` declara que toda interacción cruza el circuito; 9 de 15 superficies no | P1 |
| `MI-07` | Cartel de reconexión imposible en 9 de 11 superficies | P1 |
| `MI-08` | Propagación de `D3`/`D8`: «la vigencia del acceso no tiene número» | P1 |
| `MI-09` | `/salud` es sello de arranque, no verificación | P1 |
| `MI-10` | Panel de Cuentas sin medir con la misma mitigación inaplicable | P1 |
| `MI-11` | Tres de cuatro promesas de accesibilidad del listado sin implementar | P1 |
| `MI-12` | Esqueleto > 400 ms inconstruible bajo el modo de render | P1 |

Unanimidad 5 de 12 (42 %): sin sospecha de homogeneidad.

### 2.5 Mesas 2026-09-01-C y 2026-09-02 — el anfitrión real

| | `Mesa-2026-09-01-C.md` «El botón que no hacía nada» | `Mesa-2026-09-02.md` «El socket» |
|---|---|---|
| Disparador | Defecto reportado tres veces y declarado cerrado dos | Aviso de WebSocket en la consola |
| Corpus | PR #161–#167, registros del anfitrión, siete corridas del banco | La mesa anterior, PR #161–#173, siete mediciones nuevas |
| Hallazgos | `H-1` claves de protección de datos efímeras — **cierto y grave**; `H-2` H-1 explica el botón — **plausible, no probado** (tras el despliegue #44 el botón funciona; la causa queda verosímil sin refutar) | `V-1` el socket no se arregla desde el producto; `V-2` no es la causa del desenlace no aplicado; `V-3` sí causa la **ventana muerta** (0,9 s carga → 6,4 s respuesta) |
| Acciones | `A-1` persistir claves fuera de `wwwroot` y fallar al arrancar si no se puede; `A-2` publicar el estado en `/estado`; `A-3..A-5` banco como el anfitrión y sonda de circuito | `A-1` precargar el circuito — **ejecutada sin resultado** (mediana 3,1 s antes y después); `A-2` declarar el límite del anfitrión |
| Abierto / decisión | `AB-1..AB-4`; el PO **descarta `X-10`** (nombre público sobre 443) y pide que la desconexión se vea venir (indicador del armazón) | No forzar sondeo largo desde el cliente |

### 2.6 Mesas 2026-09-12 (ciclo 1 y 2) — séptima reanudación

Fuentes: `SDD/Docs/Audit/Mesa-2026-09-12.md`, `SDD/Docs/Audit/Mesa-2026-09-12-ciclo-2.md`. Base `5c95dab`; antecedente: la mesa de la sexta reanudación, archivada en la rama `archivo/reanudacion-6-2026-09-12` y **no** en `main`.

- **Ciclo 1:** seis parches `RS-P-01..06` aplicados como commits locales (intake §14/§9, roadmap fila `i`, entrada de changelog para PR #186, README §7, `Medicion-PT-05.md`, y el workflow FTP pasa a `workflow_dispatch`); `RS-OPE-04` (ADR de topología) a deuda; aparte, `D-01` (quién es el cliente externo) quedó como ítem diferido, no escalada, y se cerró el 2026-09-12 con `ADR-00009` (ciclo 2 §8); tres escaladas (§10: «Escaladas: 3»):

| Escalada | Tema | Respuesta del PO (ciclo 2 §8) | Asentada en |
|---|---|---|---|
| `E-02` | La API quedó públicamente alcanzable | «la API debe ser expuesta públicamente» (opción B) | intake 4.3 §17.1.P.3, `X-9`, `RA-01`; `Roadmap-Producto.md` 1.11 fila `k` |
| `E-04` | Qué evento dispara una etiqueta | mandato a la mesa: SemVer, `/v{MAJOR}/` en la ruta, etiqueta por fusión con MinVer (`D-03`), convivencia un cuatrimestre (`D-02`) | intake 4.3; roadmap 1.11 fila `k` ítems 1, 3, 7, 8, 10 |
| `E-05` | Estado durable de front y backend | front: riesgo aceptado (`RN-B7`); backend: se respalda el SQLite (`RN-B8`) | intake 4.3 §11 |

- **Ciclo 2:** convierte las respuestas en plan de **diez ítems** que abre la fase `k` (desarrollo de la fase → `03`; el contrato `/v1/` → `06`).

### 2.7 Mesa 2026-09-13 (M1 de la migración) y 2026-09-13-ciclo-2 (octava reanudación)

| | `Mesa-2026-09-13.md` | `Mesa-2026-09-13-ciclo-2.md` |
|---|---|---|
| Base | `b9675d8` | `4fc2763` (merge PR #207) |
| Objeto | Plan de migración 13.7 → 13.16 (`PM-01..PM-10`) | `SDD/Docs/` (554 vivos), intake 5.0, manifiesto 7.1, changelog |
| Resultado | 30 filas de jurado (53 % 5-0); dictámenes `D-1..D-6`; siete propuestas en el expediente (`P-01`–`P-04`, `P-06`, `P-06b`, `P-08`; `Mesa-2026-09-13.md` §10); deuda `DD-1..DD-9`; sin escaladas | `C-01..C-14` (contradicciones roadmap/README/puerta `i`/changelog sin #207, referencias a `evidencia/` retirada, recuentos de diferidos no reproducibles, README raíz y `SDD/README.md` desactualizados) + `RN8-REF-01/02` |
| Escalada | Ninguna | `E-1` regla de secuencialidad del roadmap tras cerrar `k` con `i` abierta → PO: «(2) Reescribir §4» (`Roadmap-Producto.md` 1.15 §4) |
| Detalle | → `17` (expediente 0001, actuación 004) | parches `PR-01..PR-09` en `reanudacion/8-2026-09-13-reparacion` |

### 2.8 Mesa 2026-09-14 — expertos a pedido, «evaluar y entender»

Fuente: `SDD/Docs/Audit/Mesa-2026-09-14.md` 1.4 (versiones 1.2 y 1.3 en `SDD/Docs/Audit/_legacy/2026-09-14/`). Base `5defb47`. Pedido: evaluar el proyecto entero antes de la fase `i`. Repo público: tres ítems explotables se publicaron recién al corregirse.

| Ítems | Tema | Estado al cierre (§6.1) |
|---|---|---|
| `R-01`, `R-15` | Runner propio expuesto a PR de forks; E2E atado al canal FTP retirado | Hecho, PR #209 |
| `R-02` | Partición de origen compartida detrás del front | Hecho, PR #216 (`Web ADR-10009`) |
| `R-03` | Cuota de intentos por cuenta no se liberaba con el reseteo | Hecho, PR #214 (`ADR-00011` 1.1) |
| `R-05` + `REF-02` | Acceso firmado seguía valiendo tras bloqueo o cambio de credencial | Hecho, PR #211–#212 (`ADR-00003` 1.1) |
| `R-06` | Sin cabeceras de seguridad | Decidido en la mesa del 09-15 (D-3) |
| `R-07` | Alta de cuentas por dominio | Mecanismo PR #220 (`Api ADR-00012`); no rige hasta declarar dominio |
| `R-08`, `R-18` | OpenAPI sin `securitySchemes`; `AGENTS.md` con guías y contenedores vencidos | Hecho, PR #217, #218 |
| `R-09` | Restauración del SQLite nunca probada | Respaldos con `integrity_check` antes de cada despliegue |
| `R-10`, `R-16` | Criterio 5 de `i` y PT-05 sin umbral | Reformulación PR #227; umbral → mesa 09-15 |
| `R-11`, `R-24` | Puerta `c` en rojo; puertas `g`/`h` verdes sin pruebas | Hecho, PR #221, #223, #226 |
| `R-12` | CI sin puertas de fase ni cobertura | Hecho, PR #228 (`QG-06` 99,1 %) |
| `R-13`, `R-14` | Publicación real dispersa; front sin versión | Hecho, PR #225, #222 |
| `R-17` | Fase `i` sin plan | Hecho, PR #231 (`Mini-Plan.md` 3.7 §3.6) |
| `R-19` | Dónde viven los informes de cierre a–h | Escalada `E-7` (§8): en `SDD/Docs/Audit/` desde `i`; `a`–`h` como apartamiento declarado |
| `R-20..R-23` | `j…`, cercos, ADR desactualizadas, modelo lógico | Lote 3, por evento (§6.1) |
| `R-04` | Margen de topes por origen | Después de PT-05 |
| `RN9-REF-01` | Datos personales (Ley 25.326) | Aviso PR #229; intake → mesa 09-15 (D-4) |

Dictamen §5: producto sano (553/553 pruebas, sin advertencias, `v1.1.2` en producción idéntico a `main`); el corpus no describía fielmente publicación, versión del front, modelo lógico, contrato de agentes, una mitigación de `ADR-00011` y una puerta en rojo.

### 2.9 Mesa 2026-09-15 — delegada

Fuente: `SDD/Docs/Audit/Mesa-2026-09-15.md`. Base `2c34070`. El PO delega las seis decisiones «sólo del PO» de la mesa anterior: «elijan la mejor y más razonable y la apliquen».

| Decisión | Alternativa elegida (5-0) | Aplicado en |
|---|---|---|
| `D-1` umbral PT-05 (`E-5`) | ≤ 5 s funciona · 5–10 s con reservas · > 10 s no funciona | `Medicion-PT-05.md` 1.5 §2, rotulado «DECISIÓN de mesa delegada» |
| `D-2` dominio del autorregistro | No declarar ninguno hasta confirmación del PO | nada; deuda `DD-R10-1` |
| `D-3` cabeceras de seguridad | Middleware en el origen de cada pieza, HSTS corto, CSP con `nonce` diferida | `SecurityHeaders.cs` en Web y Api + `SecurityHeadersTests`; deuda `DD-R10-2` |
| `D-4` datos personales | Declarar finalidad, acceso, retención y supresión en el intake | intake 5.1 §10 |
| `D-5` etiqueta o `main` | Etiquetar el commit de `main` antes de desplegar | `Guia-Publicacion-Image-Docker.md` 1.5 §2.2; etiqueta `v1.2.0` |
| `D-6` constancia de dos corridas | Tres publicaciones del 2026-09-14 (`cc024c5`, `8d8c857`, `2c34070`) | `Mini-Plan.md` |

Fuera del alcance de la mesa: la visita a la facultad (criterios 3 y 4 de `i`) y los ajustes de forks/runner. Deuda `DD-R10-1..3` (§5). El estado de estos pendientes hoy → `03`.

---

## 3. Reanudaciones: los informes de estado del destino

Cada informe es la fase R3 del orquestador de reanudación; lo supera el siguiente.

| N.º | Fecha | Fuente | Orquestador | Salto normativo leído | Salida elegida (PO salvo indicación) |
|---|---|---|---|---|---|
| 1 | 2026-08-16 | `Estado-Del-Destino-2026-08-16.md` | `Master-Prompt-Reanudacion.md` 1.1 | 8.6 → 8.11 | **B** migrar (divergencia `D-01` queda abierta) |
| 2 | 2026-08-17 | `Estado-Del-Destino-2026-08-17.md` | 1.2 | 8.11 → 9.1 | **A** reparar primero (§7) |
| 3 | 2026-08-18 | `Estado-Del-Destino-2026-08-18.md` | 1.7 | 9.12 → 9.19 | **A**, sólo `D-01`; `D-03` (cero etiquetas) y `D-04` (nueve vs diez casos) abiertas |
| 4 | 2026-08-23 | `Estado-Del-Destino-2026-08-23.md` | 1.9 | 10.0 → 13.3 | **A** en la primera vuelta; en la segunda (§8.1), reparada `D-04` en PR #79, **B** migrar → migración 10.0→13.3; compuerta de arranque detenida por entrega viva (§2) |
| 5 | 2026-08-27 | `Estado-Del-Destino-2026-08-27.md` | 1.10 (primera con R1.5 = mesa) | 13.3 → 13.7 | **A** con los seis parches de la mesa; luego **C** (procedencia a 13.7) y **D** a continuación (§8.1) |
| 6 | 2026-09-12 | — (archivada en la rama `archivo/reanudacion-6-2026-09-12`, fuera de `main`) | SDD 13.10 | — | **[no verificable en `main`]** |
| 7 | 2026-09-12 | `Estado-Del-Destino-2026-09-12.md` | SDD 13.14, base `5c95dab` | 13.7 → 13.14 | **A** (ya ejecutada), seguida de **C** y **D** como trabajo siguiente; la eligió la corrida, no el PO (§8.1) |
| 8 | 2026-09-13 | `Estado-Del-Destino-2026-09-13.md` | 1.14, SDD 13.18, base `4fc2763` | 13.16 → 13.18 | **A, después D** + `E-1` opción (2); T0 se detuvo por 57 borrados en `evidencia/` → PR #207 |

---

## 4. Auditorías de producto y de corpus

### 4.1 Auditorías por ronda (APROBADO / RECHAZADO)

| Auditoría | Rondas (fuente) | Fecha | Rama | r1 | Desenlace |
|---|---|---|---|---|---|
| Propagación de F-26 y cierre de B2 | `F26-Propagacion-r1.md`, `-r2.md` | 08-09 / 08-10 | `sdd/fase-b2-cierre-y-reseteo-de-clave` | RECHAZADO: 30 hallazgos (4 P0, 13 P1, 9 P2, 4 P3) | r2 **APROBADO**; 8 hallazgos nuevos, ninguno P0/P1 |
| Maqueta de Web (Fase B2) | `B2-Maqueta-GeometriaFactory-Web-r1.md`, `-r2.md` | 08-09 / 08-11 | — / `sdd/cierre-de-huecos` | RECHAZADO: 18 (1 P0, 8 P1, 4 P2, 5 P3), la matriz de sensado declara cubrir 211 identificadores y cuatro CMP no están en ninguna fila | r2 **APROBADO**, emitida tarde (siete fases corrieron sobre una línea de base rechazada) |
| Coherencia del corpus completo | `Coherencia-Corpus-r1.md`, `-r2.md` | 08-10 | `sdd/api-fase-b` | Rechaza la tanda: 12 (2 P0, 4 P1, 4 P2, 2 P3) | r2 **APROBADO**; 3 nuevos, ninguno P0/P1 |
| Examples de los siete proyectos (Fase G) | `G-10-Examples-Siete-Proyectos-r1.md`, `-r2.md` | 08-11 | `sdd/fase-g-examples` | RECHAZO (1 P0, 4 P1, 2 P2, 3 P3) | r2 **APROBADO**, 1 P3 nuevo; 19 carpetas versionadas |
| Final consolidada (Fase H) | `H-Final-Consolidado-r1.md` | 08-11 | `sdd/fase-h-consolidacion` `58255c8` | — | **APTO PARA HANDOFF**: 15 criterios de `Root-Rules.md` §6 cumplen; 0 P0, 0 P1 |
| Fase I, incremento 1 y 2 (`Domain`) | `I-1-10-Examples-GeometriaFactory-Domain-r1.md`, `I-2-…-r1.md` | 08-29 | — | **APROBADO CON HALLAZGOS**; auditor **no independiente** (declarado en §0) | `I-02` P1: `Contrato-Agentes.md` inexistente bloqueaba `AGENTS.md` |

Las demás auditorías de fase (`A-00-01-r*`, `B-02-03-*`, `C-05-*`, `D-06-07-*`, `E-08-*`, `F-09-*`) son
del tramo de especificación; `E-08-*` se desarrolla en `11` y `F-09-*` en `12`. Las demás se nombran aquí
sin desarrollar su contenido (todas en `SDD/Docs/Audit/`):

| Familia | Archivos | Dictamen de la última ronda |
|---|---|---|
| Fase A, categorías 00–01 | `A-00-01-r1.md`, `-r2.md`, `-r3.md` (r3 por intake 1.3) | r3 APROBADO CON OBSERVACIONES |
| Fase B, categorías 02–03 por proyecto | `B-02-03-GeometriaFactory-{Api,Application,Infrastructure,Visor}-r1/r2.md`, `-{Contracts,Domain}-r1/r2/r3.md`, `-Web-r1.md` (16) | Web r1 APROBADO CON OBSERVACIONES; el resto no se desarrolla aquí |
| Fase C, categoría 05 | `C-05-Arquitectura-Siete-Proyectos-r1.md`, `-r2.md` | r2 APROBADO (dos P3) |
| Fase D, categorías 06–07 | `D-06-07-Backlog-Siete-Proyectos-r1.md` | APROBADO |

### 4.2 Evaluación del código — 2026-08-27

Fuente: `SDD/Docs/Audit/Evaluacion-Del-Codigo-2026-08-27.md` (complementa el informe de estado 08-27; mide el código, no emite veredicto).

| Medida | Valor en esa fecha |
|---|---|
| `src/` (seis proyectos) | 166 archivos, 12 484 líneas |
| `tests/` (tres proyectos) | 47 archivos, 11 102 líneas |
| `visor/` | 10 archivos, 1 093 líneas |
| Batería | 311/311 (Domain 94, Application 56, Integración 161) |
| `TODO`/`FIXME`/`NotImplementedException` | 0 |

Frentes pendientes (§2): etapa `i`; Fases I y J nunca corridas; diez puertas pasadas a bloqueantes, dos sin instrumento. Hallazgos nuevos (§3): prueba intermitente en puerta bloqueante (reparada), catálogo de errores documentado ≠ emitido, `samples/` apuntando al árbol documental anterior.

### 4.3 Corridas de la fase `k` — 2026-09-12

| Documento | Base | Qué deja |
|---|---|---|
| `Apertura-Fase-k-2026-09-12.md` 1.1 | `9167e68` | El commit `706db57` agrega la fila `k` (hecho estructural, `Rules-Backlog-Tecnico.md` §3.6); bloque `BT-00027..BT-00035` en `GeometriaFactory-Api`; Product-Backlog y Web no se reabren; autocorrección §11: las 35 `BT` pasan a archivo individual (umbral de 30 por proyecto de código) |
| `DoR-Tramo-k-2026-09-12.md` 1.2 | `f2283a3` | Seis criterios de DoR por ficha: 8 `Ready`, `BT-00028` **Descartada** en 1.2 (la resolvió `ADR-00009`); sin ciclos entre las BT (§5) |
| `BT-00027-Cierre-2026-09-12.md` 1.0 | `cfb11f7` | `ADR-00010` (`/v{MAJOR}/`) aceptada; `ADR-00008` superada en parte; 16 documentos con la premisa «no hay clientes de terceros» reescrita; verificación con `git grep` (47 líneas clasificadas) |

El contenido técnico de cada `BT` → `03` y su dominio; las ADR → `15`.

### 4.4 Plan, cierre y análisis

| Documento | Fecha | Estado | Contenido |
|---|---|---|---|
| `Plan-Mejora-Integral-2026-08-31.md` 1.0 | 2026-08-31 | **Propuesto**, ninguna unidad ejecutada al emitirse | Entrega P4 de la mesa 08-31-B: diagnóstico «verificaciones en una sola dirección», 15 unidades una por PR (§2), implicancias (§3), exclusiones (§4), primera unidad detallada (§6). Prefijo renumerado `F-NN` → `MI-NN` |
| `Cierre-De-Hallazgos-Abiertos-2026-08-17.md` 1.0 | 2026-08-17 | Emitido | Diez hallazgos que quedaban de las migraciones: 3 cerrados con trabajo (`A-01`, `A-02`, `N-05`), 3 por verificación (`N-03`, `M-06`, `M-07`), 3 por declaración (`N-02`, `M-04`, `M-05`), 1 elevado (`A-06`) |
| `Analisis-Refresco-Al-Restaurar-La-Ventana.md` 1.0 | 2026-08-19 | Análisis, ningún cambio aplicado | Premisa **no confirmada** (el retoque citado no está en ningún árbol); mecanismo de Blazor Server; recomendación A + C, D acotada, B no |

---

## 5. Observaciones del proceso

Defectos de **cómo** trabajó el orquestador, señalados casi siempre por el PO.

| Observación | Versión / fecha | Estado | Qué registra | Instrumento que dejó |
|---|---|---|---|---|
| `Observacion-Ejecucion-De-La-Orquestacion.md` | 1.2 / 2026-08-11 | Aprobado | El orquestador no verificaba las entregas de los subagentes ni llevaba registro fase × proyecto × ronda; Fase B de Api sin auditar hasta H; siete fases sobre línea de base rechazada | Corrección §6 |
| `Observacion-Ciclo-De-Correccion-Sin-Corte.md` | 1.2 / 2026-08-11 | Aprobado | Intake 1.0 → 1.28 en cuatro días: 13 decisiones, 5 correcciones de fondo, 11 de forma; 8 de 28 versiones sólo arreglaban la anterior | Clasificación + criterio de corte + plan con estado + regla preventiva (§4) |
| `Reporte-Primera-Aplicacion-Del-Instrumento.md` | 1.0 / 2026-08-12 | Aprobado | Única aplicación del instrumento anterior (pasada final sobre `Handoff-Checkout.md`): efectos `O-1..O-5`; §5 declara lo que no prueba (una sola corrida, regla preventiva nunca aplicada) | — |
| `Observacion-Desviacion-De-Nomenclatura.md` | 1.0 / 2026-08-12 | Aprobado | Identificadores en castellano desde el intake 1.1 sin decisión (razonamiento circular de `Plan-Etapa-A.md` `D-01`) | `SDD/Docs/Producto/Norma-De-Nomenclatura.md` 1.0 (→ `14`) |
| `Observacion-Sincronizacion-Escena-Arbol.md` | 2.0 / 2026-08-16 | **Cerrada** por `ADR-08007` | La fachada del visor no tenía canal visor → anfitrión para marcar el nodo del árbol (`F-13`) | → `10`, `15` |
| `Observacion-Alcance-Aguas-Arriba-De-ADR-08006.md` | 5.0 / 2026-08-30 | Reabierta y vuelta a cerrar | `ADR-08006` (el visor recibe piezas, no texto) alcanzaba cuatro afirmaciones, no tres; la cuarta (los §6 de `10-Examples` del visor) estuvo 18 días desalineada | → `15` |
| `Observacion-Contradiccion-Plantilla-Intake-3.4.md` | 1.0 / 2026-08-17 | **Elevada** al framework | La plantilla de intake 3.4 declara la Parte C «por unidad de entrega» y su encabezado dice «por proyecto de código» (origen: `A-06`) | Se cierra cuando el framework publique la corrección **[estado posterior no verificable en el repo]** |

---

## 6. Patrones que las instancias registran

| Patrón | Dónde se nombra |
|---|---|
| Confiar en la fuente declarativa sin abrirla | `Mesa-2026-08-31.md` §8ter; `Mesa-2026-09-01-C.md` §3 |
| Verificar la condición y no el efecto | `Mesa-2026-08-31-B.md` §0; `Plan-Mejora-Integral-2026-08-31.md` §1; `Mesa-2026-09-01-C.md` §5.2 |
| Cifras con número de versión en prosa que envejecen | `Mesa-2026-08-27.md` `H-08`; `Mesa-2026-09-13-ciclo-2.md` `C-09`, `C-10` |
| Escalar un número producido por un instrumento roto | `Mesa-2026-08-29.md` §5, §7.1 |
| Atribuir mejora a una acción sin medir (mediana vs promedio) | `Mesa-2026-09-02.md` §4.1 |
| Ciclo de corrección sin criterio de corte | `Observacion-Ciclo-De-Correccion-Sin-Corte.md` §2 |

---

## 7. Dónde seguir

| Necesitás… | Índice |
|---|---|
| Lo que todavía queda abierto de estas mesas (visita a la facultad, `DD-R10-*`, lote 3) | `03_Roadmap-Avance-Backlog-Y-Pendientes.md` |
| Mesa 2026-09-13 dentro del expediente 0001, planes e informes de migración | `17_Migraciones-Normativas-Y-Expedientes.md` |
| `PT-05`, `QG-06`, puertas `c`/`f`/`g` y su medición | `11_Pruebas-Puertas-Y-Calidad.md` |
| Las ADR citadas (`00009..00012`, `10009`, `08006`, `08007`, `14005`) | `15_Decisiones-ADR.md` |
| Cabeceras de seguridad, guardia de admisión, límite de tasa | `08_Seguridad-Identidad-Y-Sesion.md` |
| Delegación del merge y `AGENTS.md` | `18_Forma-De-Trabajo-Y-Agentes.md` |
