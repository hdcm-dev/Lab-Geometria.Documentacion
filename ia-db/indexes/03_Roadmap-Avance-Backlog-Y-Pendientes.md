# 03 · Roadmap, avance de la construcción, backlog y pendientes

> **Propósito:** ubicar en qué etapa está el producto, qué cerró cada una y con qué criterio, dónde se registra el avance, cómo se organiza el backlog (épicas, historias, tareas técnicas) y qué queda abierto hoy.
> **Fuente primaria:** `SDD/Docs/00-Contexto/Roadmap-Producto.md` 1.16 (única fuente del roadmap) y `changelog.md` (única fuente del avance de construcción, `SDD/Docs/README.md` §7.2).
> **Alcance de esta revisión:** Lab-Geometria `main` = `5f07b12` (PR #234), 2026-10-27. Versión ia-db 4.0.
> **No cubre:** el contenido técnico de cada tarea (índice de su dominio, 04–13), las mesas como instrumento (16), las puertas y su medición (11), las ADR (15).

---

## 1. Mapa de fuentes

| Qué | Fuente (ruta relativa al repo) | Versión / fecha | Estado declarado |
|---|---|---|---|
| Roadmap de producto (fases, dependencias, criterios de transición) | `SDD/Docs/00-Contexto/Roadmap-Producto.md` | 1.16 · 2026-09-14 (cabecera dice 2026-09-13) | Aprobado |
| Registro de avance de construcción | `changelog.md` (2140 líneas) | última entrada 2026-09-15 | Vivo |
| Estado por etapa, publicado | `SDD/Docs/README.md` §7.2 | — | Publica el resultado del changelog, no lo replica |
| Puntos abiertos de nivel producto | `SDD/Docs/README.md` §8 | al 2026-08-31 | — |
| Plan de la etapa `a` | `SDD/Docs/Producto/Plan-Etapa-A.md` | 1.13 · 2026-08-13 | Propuesto |
| Product-Backlog Api | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/06-Backlog-Tecnico/Product-Backlog.md` | 4.7 · 2026-09-13 | Propuesto |
| Product-Backlog Web | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/06-Backlog-Tecnico/Product-Backlog.md` | 4.6 · 2026-09-13 | Propuesto |
| Backlog-Tecnico Api | `.../GeometriaFactory-Api/06-Backlog-Tecnico/Backlog-Tecnico.md` | 3.2 · 2026-09-12 | Propuesto |
| Backlog-Tecnico Web | `.../GeometriaFactory-Web/06-Backlog-Tecnico/Backlog-Tecnico.md` | 2.3 · 2026-08-25 | Propuesto |
| Definition-Of-Ready (Api / Web) | `.../06-Backlog-Tecnico/Definition-Of-Ready.md` | 2.0 · 2026-08-16 (ambas) | Propuesto |
| README de 06 (Api / Web) | `.../06-Backlog-Tecnico/README.md` | 2.2 · 2026-09-12 / 2.0 · 2026-08-16 | Aprobado |
| Mini-Plan Api | `.../GeometriaFactory-Api/07-Plan-Sprint/Mini-Plan.md` | 3.8 · 2026-09-13 | Propuesto |
| Mini-Plan Web | `.../GeometriaFactory-Web/07-Plan-Sprint/Mini-Plan.md` | 2.2 · 2026-08-25 | Propuesto |
| README de 07 (Api / Web) | `.../07-Plan-Sprint/README.md` | 2.2 / 2.0 · 2026-08-16 | Aprobado |
| Plan de cierre de los «90 pendientes» | `SDD/Docs/Audit/Plan-Cierre-De-Pendientes.md` | 1.0 · 2026-08-20 | Plan (no cierra nada) |
| Clasificación A1 de pendientes | `SDD/Docs/Audit/Clasificacion-Pendientes-A1.md` | 1.0 · 2026-08-20 | Clasificación (no cierra nada) |
| Qué contesta la fase `i` y qué no | `SDD/Docs/Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md` | 1.0 · 2026-08-31 | Emitido |
| Formulario de `PT-05` | `SDD/Docs/Audit/Medicion-PT-05.md` | 1.5 | **SIN MEDIR** |

> Nota: `SDD/Docs/README.md` §7.1 declara 06 y 07 «Aprobado» por categoría, mientras cada documento de backlog y plan lleva `Estado: Propuesto` en su cabecera. Se registra la divergencia en `19_Observaciones-Del-Indexado.md`.

---

## 2. Principios de planificación

| Principio | Fuente |
|---|---|
| Sin fechas: el hito es «etapa cerrada y demostrada», no una fecha de calendario | `Roadmap-Producto.md` §1.1 |
| Unidad de planificación = la etapa del intake (misma letra); no hay sprints ni agrupación intermedia | `Roadmap-Producto.md` §1.2, §3 |
| Corte vertical con esqueleto ambulante previo; no se planifica por capa | `Roadmap-Producto.md` §1.2 |
| `a` y `b` son hitos internos; de `c` en adelante todo hito es demostrable | `Roadmap-Producto.md` §2 |
| Alcance comprometido `a`–`i` estrictamente secuencial; sin OK explícito del PO no se avanza | `Roadmap-Producto.md` §4 |
| Fases posteriores (`j…`, `k`) declaran si dependen de un cierre o de un hecho (decisión del PO sobre `E-1`, 2026-09-13) | `Roadmap-Producto.md` §4 y §7 (1.15) |
| No regresión: al cerrar cada fase siguen pasando sin correcciones los guiones de las anteriores | `Roadmap-Producto.md` §4 |
| Puerta técnica que no pasa detiene la planificación de lo que depende; no se arrastra como deuda | `Roadmap-Producto.md` §2.2 |
| Ubicación de F-25 en `g` y de F-26 en `d`: decisión de planificación del roadmap (el intake no les asigna etapa) | `Roadmap-Producto.md` §3 |

---

## 3. Fases del producto

### 3.1 Tabla de fases (objetivo, capacidades, release, estado)

| Fase | Objetivo (resumen) | Capacidades | Release | Estado | Cierre / evidencia |
|---|---|---|---|---|---|
| `a` · Andamiaje | Compila y las dos piezas desplegables arrancan desde sus guiones; PT-01 y PT-04 medidas | — | Hito interno | **Cerrada** | merges #20, #24–#29 (2026-08-12/13) |
| `b` · Cáscara de la pieza pública | Todas las rutas navegables con marcador de posición, sobre el sistema visual | — | Hito interno | **Cerrada** | #32, #33 (2026-08-14) |
| `c` · Administrador: alta inicial y sesión | Primer arranque, ingreso, cambio de contraseña, salida, persistido | F-01, F-05 | Demostración `c` | **Cerrada** | #34 (2026-08-14); entrada repuesta 2026-08-16 |
| `d` · Alumno: ciclo de vida de la cuenta | Registro, habilitación con provisoria, primer ingreso, reseteo de credencial | F-02, F-03, F-04, F-26 | Demostración `d` | **Cerrada** | #39, #40 (2026-08-15); repuesta 2026-08-16 |
| `e` · Alta de trabajo y vista de trabajos | Cargar, listar, reeditar, eliminar; listado de comisión sin `Borrador` | F-06, F-07, F-08, F-12 | Demostración `e` | **Cerrada** | #44, #45 (2026-08-15); repuesta 2026-08-16 |
| `f` · Importación y validación | Interpretar el texto al enviar; `Pendiente` o `Borrador` con errores localizados | F-09, F-10, F-22 | Demostración `f` | **Cerrada** | `ff62b78` (2026-08-16, «fusión a main: reanudación, etapa `f` y etapa `g`», sin PR; trae `421f3da` «etapa f: el validador de figuras…»), rama `codigo/etapa-f-validador` según `changelog.md` |
| `g` · Visualización y árbol | Vista 3D y árbol del texto para los dos papeles | F-11, F-13, F-25 | Demostración `g` | **Cerrada** | #57 (2026-08-17) |
| `h` · Circuito de revisión | Aprobar/rechazar `Pendiente` con comentario opcional; desenlace visible al alumno | F-21, F-23, F-24 | Demostración `h`; **cierra el alcance comprometido** | **Cerrada** | #58 (2026-08-17); OK del PO de las ocho fases el 2026-08-18 (`Roadmap-Producto.md` §7, 1.8) |
| `i` · Despliegue real | Front y servicio de datos en contenedores de i7infra, túnel bajo `geometria.aplicada.stream`, PT-05 desde la facultad | F-14 | Primer despliegue real verificado | **Realizada, no cerrada** (despliegue 2026-09-06) | ver §3.3 |
| `j…` · Agregados | `Could Have` diferidas, de a una, cuando `i` cierre | F-15, F-16, F-17; candidatos X-6, X-7 | Sin release comprometido | **No planificada** («ninguna está especificada todavía») | `Roadmap-Producto.md` §2.1 |
| `k` · Exposición pública de la API y versionado del contrato | Diez ítems del plan de `Mesa-2026-09-12-ciclo-2.md` §4 | Sin `F-` (trabajo de plataforma) | **`v1.0.0`** (contrato bajo `/v1/`) y **`v1.1.x`** (límite de tasa y correcciones), 2026-09-13 | **Cerrada con OK explícito del PO 2026-09-13** («tenés el ok de la fase K») | #189–#202; `changelog.md` «Punto de control de la fase `k`» |

Fuentes: `Roadmap-Producto.md` §2.1 y §3; `SDD/Docs/README.md` §7.2; `changelog.md`; historial git (`git log --merges`).

### 3.2 Dependencias

| Fase | Depende de | Fuente |
|---|---|---|
| `b`…`h` | la fase anterior, en orden estricto | `Roadmap-Producto.md` §4 |
| `g` | además PT-02 y PT-03 antes de comprometerla | `Roadmap-Producto.md` §2.2, §4 |
| `i` | cierre de `h` (publica el alcance comprometido entero) | `Roadmap-Producto.md` §4 |
| `j…` | cierre de `i` | `Roadmap-Producto.md` §4 |
| `k` | el **hecho** del despliegue real (2026-09-06), no el cierre de `i`; por eso cerró con `i` abierta | `Roadmap-Producto.md` §4 |

### 3.3 Criterios de transición

**Comunes a toda transición (7):** guiones anteriores pasan sin corrección; pruebas de las reglas introducidas; informe de cierre autocontenido e indizado; PR de la fase abierto (es el punto de control); OK explícito del PO; rama incorporada antes de abrir la siguiente; guiones con datos verificados del intake. Fuente: `Roadmap-Producto.md` §5.1.

**Propios por transición:** tabla en `Roadmap-Producto.md` §5.2 (`— → a` … `i → j…`). El detalle de `a → b` (8 propios + 7 comunes) y cómo se verifica cada uno está en `Plan-Etapa-A.md` §5.

**Transición `i → j…` — estado al 2026-09-14** (`GeometriaFactory-Api/07-Plan-Sprint/Mini-Plan.md` §3.6, PR #231):

| # | Criterio (`Roadmap-Producto.md` §5.2) | Estado | Falta | Quién |
|---|---|---|---|---|
| 1 | Contenedores desde la composición, imágenes selladas, túnel y dominio, publicación reproducible | Hecho; constancia de 3 corridas (`cc024c5`, `8d8c857`, `2c34070`) | — | — |
| 2 | Servidor a servidor; el navegador no llega al servicio de datos | Hecho (`I-2`) | — | — |
| 3 | `PT-05` medida desde la red de la facultad | **SIN MEDIR** | la visita con un alumno real | PO |
| 4 | Circuito completo sobre el despliegue real | **No presenciado** | la misma visita | PO + alumno |
| 5 | Esquema aplicado solo (reformulado por `E-6`) | Hecho (`I-5`; `CredentialChangedAtMigrationTests`, PR #212) | — | — |
| 6 | Puertas `c`–`h` en `main` sin corregir el producto (reformulado por `E-6`) | Hecho: `c`,`f`,`g` CONFORME sobre `b240143`; `d`,`e`,`h` en CI (PR #228) | — | — |

Punto de control de `i`: OK explícito del PO sobre los seis, como en `k` (`Mini-Plan.md` Api §3.6). Medición y puertas: ver `11_Pruebas-Puertas-Y-Calidad.md`.

### 3.4 Puertas técnicas por fase (sólo ubicación)

| Puerta | Fase donde se mide | Fuente |
|---|---|---|
| PT-01 (4 partes), PT-04 | `a` | `Roadmap-Producto.md` §2.2 |
| PT-02, PT-03 | antes de comprometer `g` | ídem |
| PT-05 | `i` (única puerta técnica de la fase; la letra corrió de `h` a `i` el 2026-08-08) | ídem |

Resultados y mediciones: `11_Pruebas-Puertas-Y-Calidad.md`.

### 3.5 Etiquetas de versión en el historial

`v0.1.0`, `v0.2.0`, `v0.5.0`, `v0.7.0`, `v0.8.0`, `v1.0.0` (2026-09-12), `v1.1.0`, `v1.1.1`, `v1.1.2`, `v1.2.0` (2026-09-15, fusión de la mesa delegada, `Mesa-2026-09-15.md` D-5). Fuente: `git tag`; `changelog.md` «Mesa delegada…». Mecanismo de versionado (MinVer): `12_DevOps-Construccion-Versionado-Y-Despliegue.md`.

---

## 4. Registro de avance: `changelog.md`

| Regla | Fuente |
|---|---|
| Lo actualiza el equipo de desarrollo **en la rama de la etapa, no después de la fusión** | `changelog.md` cabecera; intake §16, §17.5.P.7 |
| Lo verifica el PO en la revisión del PR de la etapa (punto de control bloqueante) | `changelog.md` cabecera |
| **Si el changelog y el historial no coinciden, gana el historial**; se repara el changelog | `changelog.md` cabecera; `GeometriaFactory-Api/09-Devops/Estrategia-Versionado.md` §11 |
| Las bitácoras §9 de los Mini-Plan no se completan retroactivamente: desde 2026-08-16 el avance va al changelog | `Mini-Plan.md` Api §9 |
| Antecedente: `c`, `d`, `e` se fusionaron sin entrada y se repusieron el 2026-08-16 desde commits y código (divergencia `D-01`) | `changelog.md` cabecera; `SDD/Docs/Audit/Estado-Del-Destino-2026-08-16.md` §2 |

### 4.1 Secciones del changelog (en orden)

| Línea | Sección | Fecha |
|---|---|---|
| 36–626 | Etapas `a` a `h` (subsecciones típicas: Agregado / Decidido y elevado al punto de control / No hecho, y declarado) | 2026-08-12 a 2026-08-17 |
| 627 | Las puertas que faltaban — `d`, `e`, `f` | — |
| 688 | Los prerrequisitos de la fase `i` (repuesto 2026-08-18) | 2026-08-18 |
| 765 | La puerta de la etapa `i` | — |
| 844 | Las etiquetas que nunca se crearon (repuestas) | 2026-08-18 |
| 916 | El recorrido que se puede correr sin permiso de nadie | 2026-09-02 |
| 1003 | Lo que la segunda mesa de UX/UI midió y reparó | 2026-09-03 |
| 1078 | Dockerizar el front (repuesta 2026-09-12) | 2026-09-06 |
| 1109–1337 | Bundle por `.csproj`, decisiones del PO del ciclo 1, ADR-00009, `/v1/` (BREAKING), MinVer, CORS | 2026-09-12 |
| 1362–1748 | Producción desde `main`, límite de tasa, `v1.0.0` en producción, sample de onboarding, deprecación, 20 samples en la solución, canje por cuenta, **OK de la fase `k`**, migración 13.7→13.16, retiro de `evidencia/` | 2026-09-13 |
| 1769–2110 | Runner propio, mesa a pedido, revocación por bloqueo/baja/cambio de credencial, E2E, origen real, OpenAPI con autenticación, imágenes sin root, dominios admitidos, sello de versión, puertas en CI, publicación real, puerta de `i` | 2026-09-14 |
| 2122 | Mesa delegada: seis decisiones que eran del PO (`v1.2.0`) | 2026-09-15 |

Fuente: `grep '^## ' changelog.md`. Los merges #234 (ADR-10010, ayuda de usuario) y #235 (asiento de la delegación del merge), ambos del 2026-10-27, **no agregan entrada** al changelog (ver `19_Observaciones-Del-Indexado.md`).

### 4.2 Historial de merges #187–#235 (agrupado)

| PR | Fecha | Tema | Índice de dominio |
|---|---|---|---|
| #187–#188 | 2026-09-12 | estructura de solución (visor y samples); séptima reanudación | 04, 16 |
| #189–#202 | 2026-09-12/13 | **fase `k`**: backlog técnico v2, Mini-Plan tramo `k`, ADR-00009, BT-00027/32/33/31/30/29/35/34, cierre de fase | 06, 08, 12, 15 |
| #203–#204 | 2026-09-13 | samples en la solución; canje limitado por cuenta | 13, 08 |
| #205–#208 | 2026-09-13 | migración a 13.16; retiro de `evidencia/`; reparación de la octava reanudación | 17 |
| #209–#226 | 2026-09-14 | lotes 0–2 de la mesa del 2026-09-14 (runner, seguridad, E2E, OpenAPI, imágenes sin root, dominios, sello, puertas, publicación real, puerta de `i`) | 08, 11, 12 |
| #227–#232 | 2026-09-14 | criterios de `i` y PT-05; cobertura del validador; aviso de datos personales; plan ejecutable de `i`; E2E; estado de los lotes | 03, 11, 16 |
| #233 | 2026-09-15 | mesa delegada (D-1..D-6) → `v1.2.0` | 16 |
| #235, #234 | 2026-10-27 | asiento de la delegación del merge; ADR-10010 | 18, 15 |

Fuente: `git log --merges` sobre `5f07b12`.

---

## 5. Plan de la etapa `a`

`SDD/Docs/Producto/Plan-Etapa-A.md` (1.13, Propuesto, 626 líneas):

| § | Contenido |
|---|---|
| 1 | La decisión de nombres que le tocó al PO |
| 2 | Árbol de archivos exacto de la etapa |
| 3 | Orden de construcción |
| 4 | Guiones que la etapa necesita |
| 5 | Verificación del cierre: 8 criterios propios de `a → b` + 7 comunes, con instrumento cada uno |
| 6 | Lo que la etapa `a` no hace |
| 7 | Riesgos y contradicciones elevados sin resolver |

---

## 6. Backlogs

### 6.1 Estructura y conteos (sobre `git ls-files`, sin `_legacy/`)

| Unidad | Product-Backlog | Historias (`historias-usuario/`) | Backlog-Tecnico | Tareas técnicas |
|---|---|---|---|---|
| `GeometriaFactory-Api` (Api, Domain, Application, Infrastructure) | 4.7 | **114**: US-00001–00030 (30), US-02001–02027 (27), US-04001–04032 (32), US-06001–06025 (25) | 3.2 | **35 archivos** BT-00001–BT-00035 en `tareas-tecnicas/`; además BT-02001–02016, BT-04001–04021, BT-06001–06026 sólo como filas del documento |
| `GeometriaFactory-Web` (Web, visor) | 4.6 | **30** con archivo: US-10001–10030; más **14 inline** US-12001–US-12014 (visor) en `Product-Backlog.md` §3.2 | 2.3 | BT-10001–10023 y BT-12001–12018 sólo como filas del documento |
| **Total** | — | **158** (144 con archivo + 14 inline) | — | — |

Fuente: `git ls-files SDD/Docs/Unidades-Entrega/*/06-Backlog-Tecnico`. Las 14 historias del visor US-12001..US-12014 están completas **inline** en `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/06-Backlog-Tecnico/Product-Backlog.md` §3.2 (índice, Given/When/Then, trazabilidad); el documento justifica no darles archivo propio con `Rules-Backlog-Tecnico.md` §2.1/§3.3 (banda 10–20, elección declarada).

### 6.2 Épicas de producto por proyecto de código

| Proyecto | Épicas (etapa) | Etapas sin épica (declarado) | Fuente |
|---|---|---|---|
| Api | EP-00001 (`a`), 00002 (`c`), 00003 (`d`), 00004 (`e`), 00005 (`f`), 00006 (`h`) | `b`, `g` | Product-Backlog Api §2.1 |
| Domain | EP-02001 (`a`) … EP-02006 (`h`) | `b`, `g` | §2.2 |
| Application | EP-04001 (`a`) … EP-04006 (`h`) | `b`, `g` | §2.3 |
| Infrastructure | EP-06001 (`a`) … EP-06005 (`f`) | `b`, `g`, `h` | §2.4 |
| Web | EP-10001 (`a`) … EP-10008 (`h`) — **las ocho etapas comprometidas** | ninguna | Product-Backlog Web §2.1 |
| Visor | EP-12001 (`a`), EP-12002 (medición PT-02/PT-03 **antes de `g`**, no es etapa nueva), EP-12003 (`g`) | `b`–`f`, `h` | Product-Backlog Web §2.2 y §2.1 «Por qué EP-12002…» |

Otras secciones del Product-Backlog: §1 objetivos, §3 historias por épica, §4 métricas de avance, §5 refinamiento, §6 puntos abiertos, §7 control de cambios.

### 6.3 Épicas técnicas de la Api (Backlog-Tecnico Api §2)

| Épica técnica | Nombre |
|---|---|
| EP-T01 | Fundaciones, composición de raíz y arranque |
| EP-T02 | Superficie y formato de intercambio |
| EP-T03 | Guardia y traducción |
| EP-T04 | Las cuatro superficies de acceso |
| EP-T05 | Verificación, muestras y despliegue |
| EP-T06 | Exposición pública y versionado del contrato (tramo `k`) |

§3 detalla las tareas; §4 traza BT ↔ US ↔ CU. Fuente: `.../GeometriaFactory-Api/06-Backlog-Tecnico/Backlog-Tecnico.md`.

### 6.4 Tareas técnicas BT-00001 a BT-00035 (estado y etapa)

| Rango | Etapa | Estado | Tema (título abreviado) |
|---|---|---|---|
| BT-00001–00010 | `a` | Done | proyecto y pruebas de integración; composición de raíz; arranque en dos fases y salud; imagen multietapa y PT-04; anclaje de nombres/versiones; cero advertencias; rutas y verbos de los quince puntos; formato de intercambio; límite de cuerpo; vigencia del acceso firmado |
| BT-00011–00016 | `c` | Done | guardia de admisión; inspección de los quince puntos; traductor con tabla única; tres familias empobrecidas; dos códigos de huecos; superficie de acceso y credencial propia |
| BT-00017 | `d` | Done | superficie de gobierno de la comisión |
| BT-00018 | `e` | Done | superficie de trabajos |
| BT-00019–00021 | `h` | Done | superficie de desenlace; colección de peticiones; ocho escenarios del PO |
| BT-00022 | `c` | Done | batería de integración |
| BT-00023–00024 | `e` | Done | eliminación forzada; texto original byte a byte |
| BT-00025 | `d` | Done | confirmar cinco valores rotulados como asunción |
| BT-00026 | `h` | Done | construir la imagen en destino desde el repositorio |
| BT-00027 | `k` | Done | reescribir ADR-00008 con `/v{MAJOR}/` |
| **BT-00028** | `k` | **Descartada** (por ADR-00009: la API autentica personas) | autenticación por cliente |
| BT-00029–00035 | `k` | Done | rate limiting; CORS condicional; OpenAPI/Scalar en producción; rutas `/v1/`; MinVer y etiquetas; sample de onboarding; política de deprecación |

Fuente: cabecera `**Estado:**` y `Etapa del producto` de cada `.../GeometriaFactory-Api/06-Backlog-Tecnico/tareas-tecnicas/BT-000NN-*.md`. Contenido técnico de cada una: índice de su dominio (04, 06, 07, 08, 11, 12, 13, 15).

### 6.5 Definition-Of-Ready

| Documento | Secciones | Notas |
|---|---|---|
| `.../GeometriaFactory-Api/06-Backlog-Tecnico/Definition-Of-Ready.md` 2.0 | §1 DoR de historias (Api: ocho criterios sí/no — traza a CU, necesidad y etapa con dos excepciones CU-00010/CU-00012, Given/When/Then ≥2 escenarios, punto de acceso de los quince, guardia, códigos vivos del conjunto cerrado, no decide qué se dice…), §2 DoR de tareas, §3 excepciones, §4 aprobador, §5 qué no es | por proyecto de código |
| `.../GeometriaFactory-Web/06-Backlog-Tecnico/Definition-Of-Ready.md` 2.0 | misma estructura §1–§6 | — |
| Evaluación de DoR del tramo `k` | `SDD/Docs/Audit/DoR-Tramo-k-2026-09-12.md` | citada por Mini-Plan Api §3.5 |

---

## 7. Mini-Plan por unidad

| Unidad | Secciones | Tramos destacados | Bitácora §9 |
|---|---|---|---|
| Api 3.8 (`.../GeometriaFactory-Api/07-Plan-Sprint/Mini-Plan.md`) | §1 información general y capacidad, §2 objetivo de cada tramo, §3 ítems comprometidos, §4 orden de construcción, §5 DoD aplicada, §6 riesgos, §7 criterios de hecho, §8 trazabilidad, §9 bitácora, §10 control de cambios — cada una por Api/Domain/Application/Infrastructure | §3.5 tramo `k` (sólo Api; los otros tres proyectos no tienen tramo `k`); **§3.6 plan ejecutable del cierre de `i`** | §9.1 Api: dos entradas del 2026-09-14 (criterio 6 y constancia de reproducibilidad); §9.2–9.4 sin entradas (estado del 2026-08-10) |
| Web 2.2 (`.../GeometriaFactory-Web/07-Plan-Sprint/Mini-Plan.md`) | misma estructura, por Web y visor | tramo del visor previo a `g` (PT-02/PT-03) | §9.1–9.2 sin entradas (estado del 2026-08-10) |

Regla: «Mini-plan y no planes de iteración» porque la cadencia es la etapa, no el calendario (`Mini-Plan.md` §1.1). Los README de `07-Plan-Sprint/` declaran qué artefactos no se emiten y por qué (§2).

---

## 8. Lo que queda abierto (lista consolidada única)

Estado a `5f07b12`. Cada fila remite al índice de dominio para el detalle.

| # | Pendiente | Titular | Evento de cierre | Fuente | Detalle en |
|---|---|---|---|---|---|
| 1 | **Visita a la facultad**: medir `PT-05` (criterio 3 de `i`) y presenciar el circuito completo sobre el despliegue real (criterio 4) | PO + un alumno | la visita | `Mini-Plan.md` Api §3.6; `Medicion-PT-05.md` (SIN MEDIR) | 11 |
| 2 | **OK del PO de la fase `i`** sobre los seis criterios | PO | tras (1) | `Mini-Plan.md` Api §3.6 | — |
| 3 | Caudal de 20 peticiones/min **provisorio**, sin fundamento desde que `D5` se cerró por incognoscible (2026-08-20) | se resuelve midiendo (PT-05) | (1) | `SDD/Docs/README.md` §8 | 08, 11 |
| 4 | `R-04`: ajustar los topes de tasa por origen | agente | después de PT-05, con su resultado | `Audit/Mesa-2026-09-14.md` §6.1; `Mini-Plan.md` Api §3.6 | 08 |
| 5 | Umbral de PT-05 (`E-5`): decidido por mesa delegada (≤5 s / con reservas 5–10 s / no funciona >10 s); el PO puede reemplazarlo en la visita | PO (opcional) | la visita | `Audit/Mesa-2026-09-15.md` D-1; `Medicion-PT-05.md` 1.5 | 11 |
| 6 | `DD-R10-1`: declarar `Registration__AdmittedEmailDomains__0` en producción | PO | confirmar el dominio de la comisión, o alta por el docente | `Audit/Mesa-2026-09-15.md` §5 | 08 |
| 7 | `DD-R10-2`: `script-src`/`style-src` con `nonce` en la CSP del front | agente | primera unidad que toque el marcado de `App` | `Audit/Mesa-2026-09-15.md` §5 | 08 |
| 8 | `DD-R10-3`: `Pipeline-CI-CD.md` con los pasos de `ci.yml` del PR #228 | agente | próxima emisión de `09-Devops` | `Audit/Mesa-2026-09-15.md` §5 | 12 |
| 9 | Lote 0 «sólo PO»: forks y runner en GitHub, rotación de credenciales del recorrido desplegado (`R-06` cerrado en el origen por D-3, `SecurityHeaders`) | PO | — | `Audit/Mesa-2026-09-15.md` D-3 y §4; `changelog.md` 2026-09-14 y 2026-09-15 | 08, 12 |
| 10 | `E-1`/`R-07`: alternativa «alta sólo por el docente» queda abierta en `ADR-00012` | PO | — | `Audit/Mesa-2026-09-14.md` §6.1 | 08, 15 |
| 12 | Lote 3: `R-20`..`R-23`, guías, guion de `R-09` | agente | por evento | `Audit/Mesa-2026-09-14.md` §6.1 | 16 |
| 13 | Fase `j…`: F-15, F-16, F-17 (y X-6, X-7) sin especificar | PO | cierre de `i` | `Roadmap-Producto.md` §2.1, §4 | 02 |
| 14 | Tres asuntos aparcados en el punto de control de `i` que **no** necesitan la fase (`E-04`): fecha de última modificación de la cuenta, sello de desenlace, conjunto de tipos reconstruibles (la frecuencia del respaldo la fijó `Mesa-2026-09-15.md` D-4: antes de cada despliegue y al cierre de cada cuatrimestre, conservación máxima un cuatrimestre, `PD-04`) | PO | decisión | `Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md` §3; `Audit/Mesa-2026-09-15.md` D-4 | 07, 05 |
| 15 | `DD-R9-1`: mejorar `restaurar-almacen.sh` (paridad de modos, `__EFMigrationsHistory`) | agente, a pedido del PO | a pedido | `Audit/Mesa-2026-09-14.md` §7 | 07 |
| 16 | `DD-R9-2`: guías `Vision-General-Sistema.md` y `Guia-Inicio-Rapido.md` | titular de 11 | alta de un colaborador humano o emisión de `Producto/11-Documentacion` | `Audit/Mesa-2026-09-14.md` §7; `Contrato-Agentes.md` | 12, 18 |
| 17 | `DD-R9-3`: ADR de impacto antes de F-15, F-16, F-17 | PO | apertura de `j…` | `Audit/Mesa-2026-09-14.md` §7 | 15 |
| 18 | `DD-R9-4`: pruebas de ensamblado de los bordes (ADR-00001) | desarrollo Api y Web | primera PR de `j…` que toque `Api.Endpoints` o Web | `Audit/Mesa-2026-09-14.md` §7 | 04, 11 |
| 19 | `DD-R9-5`: reconciliar `Modelo-Datos-Logico.md` con el esquema real | titular de 05 de Api | próxima migración o respuesta a E-4 | `Audit/Mesa-2026-09-14.md` §7 | 07 |
| 20 | `DD-R9-7`: detalle reservado de R-07 (R-03 y R-05 ya publicados en 1.3) | quien corrija | commit que corrige cita el registro | `Audit/Mesa-2026-09-14.md` §7 y 1.3 | 08 |
| 21 | `E-7`: dónde viven los informes de cierre (R-19); rige el default | PO | cierre de `i` | `Audit/Mesa-2026-09-14.md` §8 | 16 |

**Antecedentes del reparto de pendientes (históricos, no listas vivas):**

| Documento | Qué aporta |
|---|---|
| `Audit/Plan-Cierre-De-Pendientes.md` (2026-08-20) | Los «90 pendientes» no son 90 decisiones del PO: familias F1 ya decidido en código (11), F2 anclaje (20), F3 valor de producto (25), F4 a clasificar (34); como máximo 25 del PO. Frentes A–D |
| `Audit/Clasificacion-Pendientes-A1.md` (2026-08-20) | Cuatro grupos que se cierran leyendo; 16 restantes; salvedad sobre las 9 «decididas en su caso de uso» |
| `Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md` | 10 asuntos atados a `i`: 6 la necesitan (imagen en destino, dominio del túnel, caudal, herramienta de versión, vigencia del acceso, generador de inventario de componentes), 4 no (fila 14) |
| `SDD/Docs/README.md` §8 | Al 2026-08-31 queda un punto abierto de nivel producto (el caudal); lección: los resúmenes derivados no se enteran del cierre de su fuente |

Las mesas que originaron estos pendientes (alcance, hallazgos, desenlace): `16_Mesas-Auditorias-Y-Reanudaciones.md`.

---

## 9. Divergencias detectadas (remitidas a 19)

| Divergencia | Fuentes |
|---|---|
| `#234`/`#235` (2026-10-27) sin entrada en `changelog.md` pese a la regla de la cabecera | `changelog.md` vs `git log` |
| Cabecera del roadmap fecha 2026-09-13 y su versión 1.16 es del 2026-09-14 | `Roadmap-Producto.md` cabecera vs §7 |
| 06/07 «Aprobado» en el índice vs `Propuesto` en cada documento | `SDD/Docs/README.md` §7.1 vs cabeceras |
| Bitácoras §9 sin entradas al 2026-08-10: Domain §9.2 y Application §9.3 (Api) dicen «la etapa `a` todavía no arrancó», Infrastructure §9.4 y Web §9.1 «fase de especificación», Visor §9.2 «Ningún tramo está abierto»; sólo el Mini-Plan Api declara que no se completan retroactivamente | `Mini-Plan.md` Api §9 y Web §9 |
