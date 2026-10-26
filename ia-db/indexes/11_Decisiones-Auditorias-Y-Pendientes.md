# 11 · Decisiones, auditorías y lo que queda abierto — quién decidió qué, dónde quedó escrito y qué falta

> **Propósito.** Qué se decidió, quién lo decidió, dónde está escrito, cómo se tramitó (auditorías,
> mesas, expediente, lotes de reparación) y qué sigue sin decidir o sin hacer.
> **Fuente primaria.** Los tres directorios `Adrs/` (59 ADR), `SDD/Docs/Audit/` (120 archivos: 103
> `.md` y 17 `.json`), `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/` (53 archivos),
> `00-Contexto/Roadmap-Producto.md` §4 y §5.2, `Api/07-Plan-Sprint/Mini-Plan.md` §3.6 y §9.1,
> `changelog.md` y el historial de git.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

Rutas abreviadas: `Api/` = `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/`, `Web/` =
`SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/`, `Audit/` = `SDD/Docs/Audit/`, `EXP-0001` =
`SDD/Expedientes/0001-Migracion-Normativa-A-13.16/`.

---

## 1. Cómo se decide en este producto

**Cada decisión la toma el proyecto de código que puede sostenerla**, y las que alcanzan a más de
uno se toman **desde el productor**, citadas y no reabiertas por los consumidores
(`SDD/Docs/Producto/Vista-Producto.md` 1.11 §5). Lo que sí es normativo de nivel producto son las
**tres reglas de arquitectura del intake §14** (`RA-01` ningún JavaScript del navegador invoca la
API, `RA-02` el visor es un visualizador puro, `RA-03` todo pasa por el front), que **no las decide
ninguna ADR: las reciben** (`PRODUCT-INTAKE` 5.1 §14, l.579-581).

Hay cuatro vías por las que una decisión entra al árbol, y conviene no confundirlas:

| Vía | Quién decide | Dónde queda | Ejemplo vigente |
| --- | --- | --- | --- |
| **ADR** | El arquitecto de la unidad (AG-05), a veces «sobre decisión del Product Owner» | `Adrs/` de la unidad o de `Producto/` | `ADR-00009`, `ADR-00010` |
| **Decisión del Product Owner** | El PO, con su literal | Intake (§13.1, control de cambios), `Audit/A3-Decisiones-Del-Product-Owner.md`, `D1`, `D5`, y la sección «Respuestas del PO» de cada mesa | `E-02`, `E-04`, `E-05` (2026-09-12); `E-1` del 2026-09-13; `E-1`, `E-3`, `E-6` del 2026-09-14 |
| **Mesa** | Un jurado de cinco, por mayoría | `Audit/Mesa-AAAA-MM-DD*.md` | Los veredictos `R-*` del 2026-09-14 |
| **Mesa delegada** | Un jurado al que el PO **le delegó** la decisión | `Audit/Mesa-2026-09-15.md` | Las seis `D-1..D-6`; el rótulo **[DECISIÓN de mesa delegada]** lo llevan lo aplicado por `D-1` (`Medicion-PT-05.md` §2) y por `D-4` (intake 5.1 §10) |

**Una escalada sin respuesta no queda en el aire: rige su default**, que cada mesa escribe en la
columna «Si no respondés» (`Audit/Mesa-2026-09-14.md` §8: `E-2`, `E-4`, `E-5` y `E-7` rigen por
default).

## 2. Las 59 ADR

Recontadas con `git ls-files | grep /Adrs/` sin `_legacy/`: **13** en `SDD/Docs/Producto/Adrs/`,
**31** en `Api/05-Arquitectura-Tecnica/Adrs/` y **15** en `Web/05-Arquitectura-Tecnica/Adrs/`. En la
3.0 eran 53: entraron seis, todas entre el 2026-09-12 y el 2026-09-14.

| Bloque | Proyecto | Dónde vive | Cuántas | Temas |
| --- | --- | --- | --- | --- |
| `ADR-000xx` | `Api` | `Api/05/Adrs/` | **12** | Host delgado · formato de intercambio · credencial firmada y guardia transversal · dos traducciones con tabla única · sin paginación con reingreso declarado · composición de raíz · arranque en dos fases · sin versionado de rutas (**superada en parte**) · **la API autentica personas** · **versión en la ruta, sólo el MAJOR** · **el canje se protege por cuenta** · **el autorregistro admite los dominios que el despliegue declara** |
| `ADR-020xx` | `Domain` | `Api/05/Adrs/` | 6 | Modelo rico con invariantes · guardas y resultados tipados · estabilidad de la superficie · frontera de autenticación · guarda única de admisibilidad · el dominio no lee el reloj ni el conjunto |
| `ADR-040xx` | `Application` | `Api/05/Adrs/` | 6 | Inversión de dependencias · los cuatro puertos · estabilidad · orden fijo de las cuatro comprobaciones · un caso de uso una unidad de trabajo · resultado tipado y catálogo cerrado |
| `ADR-060xx` | `Infrastructure` | `Api/05/Adrs/` | 7 | Adaptadores por puerto · escritor único · comparación de correos y su índice · derivación de clave anclada · provisoria no adivinable · lectura tolerante y tabla de derivación · transformaciones al arrancar con linaje inmutable |
| `ADR-080xx` | `Contracts` (nivel producto) | `Producto/Adrs/` | 8 | Tipos planos · tipo de error único con conjunto cerrado · versionado por compilación compartida · regla de exposición · listado separado del detalle · el visor recibe piezas y no el texto · el aviso de selección va en las opciones · el explorador no se publica solo |
| `ADR-100xx` | `Web` | `Web/05/Adrs/` | **9** | Render en el servidor · sin estado propio · credencial de sesión en el circuito · tres capas de presentación · estado degradado como superficie · aislamiento del visor · dirección del servicio desde configuración · **el bundle lo genera el `.csproj` del front** · **el front le dice al servicio de dónde llegó el navegador** |
| `ADR-120xx` | `Visor` | `Web/05/Adrs/` | 6 | Tres capas con fachada plana · seis funciones planas · visualizador puro sin red ni identidad · motor de dibujo empaquetado · disposición determinista por índice · bundle generado y versionado |
| `ADR-140xx` | Producto (apartamientos) | `Producto/Adrs/` | 5 | Archivado central de la migración · familias propias del intake · dirección del backend por IP dinámica · ítem obligatorio sin objeto se declara «no aplica» · familias acuñadas por el destino (**retirada**) |

**Estados**, leídos de la línea `**Estado:**` de cada una: **46 `Aprobado`**, **11 `Aceptado`**
(`08006`–`08008`, `14001`–`14004`, `00009`–`00012`), **1 `Superado parcialmente`** (`ADR-00008`) y
**1 `RETIRADO`** (`ADR-14005`, el 2026-08-29, «sin haber sido aceptado»: las dos familias se
renumeraron y pasaron a cumplir la norma). La 3.0 la listaba como un tema vigente más.

### 2.1 Las seis nuevas y las que cambiaron de fondo

| ADR | Fecha | Origen | Qué decide |
| --- | --- | --- | --- |
| `ADR-00009` 1.0 | 2026-09-12 | Decisión del PO que cierra `D-01` | **Dos identidades y nada más (administrador y usuario).** Toda aplicación propia canjea las credenciales de una persona en `POST /auth/token`; **no hay claves de API ni `client_credentials`**. Por eso `BT-00028` pasó a `Descartada` |
| `ADR-00010` 1.2 | 2026-09-12 | `E-04`, PO | La superficie pública lleva **`/v{MAJOR}/`**, sólo el `MAJOR`, que **es el del producto**. Deroga la regla 1 de `ADR-00008`; las reglas 2 a 5 subsisten (§2.3) |
| `ADR-00011` 1.1 | 2026-09-14 | Autocorrección de un defecto de `BT-00029` | Fuerza bruta frenada **por cuenta**: 10 fallos por correo normalizado en 900 s; topes por origen holgados del tamaño de una comisión; las seis cifras configurables (`RateLimiting__*`) hasta que `PT-05` mida. Desde la 1.1 el reseteo del docente **libera la cuota** (`R-03`) |
| `ADR-00012` 1.0 | 2026-09-14 | `R-07` / `E-1` de la mesa del 2026-09-14, por delegación | El autorregistro admite sólo los dominios de `Registration__AdmittedEmailDomains__N`. **Se apartó de lo que el PO eligió en `E-1`** («alta sólo por el docente») porque rompía `F-02` y `/v1/`; la alternativa queda abierta en la ADR (`Mesa-2026-09-14.md` §6.1). Vacío = cualquiera (`src/GeometriaFactory.Api/appsettings.json` l.12-14) |
| `ADR-10008` 1.1 | 2026-09-13 | Mesa de la Feature 20 del framework (2026-09-11) | `GeometriaFactory.Web.csproj` es **el único generador del bundle** (target `BuildVisor`, se apaga con `-p:SkipVisorBuild=true`) |
| `ADR-10009` 1.0 | 2026-09-14 | `R-02` de la mesa del 2026-09-14 | El front resuelve la dirección real con `UseForwardedHeaders` sobre `KnownNetworks` y la reenvía en `X-Forwarded-For` (`BrowserOriginForwardingHandler`); en el circuito interactivo no agrega nada |
| `ADR-00003` → 1.1 | 2026-09-14 | `R-05` + `REF-02` | La guardia evalúa la admisión de la cuenta **en cada petición**, y cambiar la contraseña propia revoca los accesos anteriores (§2 punto 5; PR #211 y #212) |
| `ADR-00008` → 1.1 | 2026-09-12 | `BT-00027` | Lleva aviso de lectura: su premisa «no hay clientes de terceros» dejó de ser cierta con el intake 4.3/4.4 |
| `ADR-14003` → 1.4 | 2026-09-13 | Fase M1 de la migración 13.7 → 13.16 | Contador de saltos **2 → 3**, «no contemplado». Declara que el 2026-09-06 el producto realizó un canal que no depende de esta dirección (`F-14`, `X-10`) y que **el ADR de topología que la supere está asignado al PO** (`Mesa-2026-09-12.md` §8) |

**La tensión que la 3.0 marcaba sobre `ADR-14003`** —`Dockerfile.web` la citaba como el apartamiento
que la imagen retiraba sin que ninguna ADR lo registrara— **quedó declarada, no resuelta**: la 1.4
lo nombra y lo remite a una ADR de topología que todavía no existe (§5.1).

**Las que más se citan al discutir algo nuevo**: `ADR-08002` (nadie inventa códigos), `ADR-00004`
(una sola tabla de traducción), `ADR-08006` (el visor recibe piezas), `ADR-12003` (visualizador
puro, medido sobre el bundle), `ADR-14004` (**ítem obligatorio sin objeto se declara «no aplica»**
con su condición de reapertura) y, desde la fase `k`, `ADR-00009` y `ADR-00010`.

## 3. Las auditorías de fase y las migraciones normativas

Las fases A a H las cerró un auditor **invocado desde cero, sin participación en la generación**;
la fase I es la excepción y lo declara en el §0 de cada informe (archivos sin cambio entre
`89f3ab3` y `4b114d7`).

| Fase | Alcance | Dictamen |
| --- | --- | --- |
| A | `00-Contexto`, `01-Necesidades-Negocio` | Aprobado con observaciones (`A-00-01-r3`) |
| B | `02` y `03`, por proyecto | 15 informes en siete proyectos; el de `Api` **rechazado en r1** (17 hallazgos `B-API-*`) y **aprobado en r2** el mismo día, 2026-08-11 |
| B2 | Validación visual de maqueta | Rechazado en r1 (2026-08-09), **aprobado en r2** |
| C | `05-Arquitectura-Tecnica` | Aprobado (r2) |
| D | `06` y `07` | Aprobado |
| E | `08-Calidad-Y-Pruebas` | Aprobado (r2) |
| F | `09-Devops` | Aprobado |
| G | `10-Examples` | Aprobado (r2) |
| H | Consolidado final | **Apto para handoff** (`H-Final-Consolidado-r1`) |
| I | Examples de `Domain` | `I-1-…` e `I-2-…`: **APROBADO CON HALLAZGOS** (2026-08-29), con el auditor declarado **no independiente** y una segunda ronda desde cero recomendada (`I-04`) |

**Ocho migraciones normativas del framework, las ocho cerradas**: 6.0 → 8.6, 8.6 → 8.11, 8.11 →
9.9, 9.9 → 9.10, 9.10 → 9.12, 9.12 → 10.0, 10.0 → 13.3 y **13.7 → 13.16** (`SDD/Docs/README.md`
2.9 §7.1). Hay **ocho** `Informe-Migracion-*` y **siete** `Plan-Migracion-*`: la 6.0 → 8.6 no tiene
plan en `Audit/` (la 3.0 decía que todas tenían los dos). Entre la séptima y la octava la
procedencia pasó de 13.3 a 13.7 **sin migrar** (quinta reanudación, salida `C`).

### 3.1 La octava migración y el primer expediente

| Campo | Valor | Fuente |
| --- | --- | --- |
| Expediente | **EXP-0001**, abierto y **resuelto** el 2026-09-13; la forma de expediente es un **adelanto a una norma que el framework todavía no tiene** | `EXP-0001/README.md` |
| Contenido | 13 actuaciones foliadas, 7 propuestas (`P-01` a `P-04`, `P-06`, `P-06b` y `P-08`; no hay `P-05` ni `P-07`), más el guion `aplicar-propuestas.sh` y la verificación `E-016`: 9 archivos en `propuestas/`, 30 archivos de evidencia con SHA-256 | `git ls-files SDD/Expedientes` |
| Mesa de M1 | `Audit/Mesa-2026-09-13.md`, familia `MN-`: 44 hallazgos detectados, 30 veredictos, dictámenes `D-1` a `D-6`, **ninguna escalada** | §6.1, §10 |
| Dictamen clave | **`D-1`**: con el PO ausente, **commitear en la rama cuenta como escritura**; M2–M4 sólo como propuesta. **`D-6`**: bump mayor del intake, 4.6 → 5.0 | §6.1 |
| Aprobación | Actuación 011, literal del PO: «A - está aprobado / B - está aprobado» (plan 1.3 y diff del intake); C, D y E por default | Actuación 011 |
| Auditoría | `Informe-Migracion-13.7-a-13.16.md` 1.1: dos rondas del auditor independiente **aprobadas con observaciones**; una ronda 3 del orquestador (no independiente), acotada a `M6-14`..`M6-17`, que los cierra; y el audit de cierre de M4, también **aprobado con observaciones** (0 P0, 2 P1, 3 P2, 8 P3; `M6-19` a `M6-31`) | §0 |
| Resultado | Intake **5.0**, manifiesto **7.0 → 7.1**, procedencia **SDD 13.16**; lote de cierre `F` (cabeceras de trazabilidad, default «déjalo» → `DD-8`) y `G` (procedencia, default «confirmado») | Actuación 013 §3-§4 |
| Lo que el expediente no admitió | La instrucción de un coordinador de tratar una delegación anterior del PO como aprobación **no se asentó como aprobación** | Actuación 008 |

## 4. Las mesas de evaluación

Una **mesa** se convoca **por condición y no por calendario**: hay corpus previo, el estado está
leído y hay una decisión de alcance por tomar (`Mesa-Rules.md` §0.0, citado en cada registro).
Cada ciclo estrena un **prefijo de familia** verificado sin colisión. Hay **12 registros**
`Audit/Mesa-*.md`; seis son posteriores a la 3.0.

| Mesa | Prefijo | Qué la fundó | Qué dejó |
| --- | --- | --- | --- |
| `Mesa-2026-08-27` | — | Pendientes vencidos | Les dio un evento posterior a tres filas vencidas **en lugar de advertir que la medición existía desde hacía catorce días**: hallazgo `HM-02`, reporte 17 al framework |
| `Mesa-2026-08-29` | — | Nomenclatura de familias | El renumerado `R-4` de `QG`/`CV`/`PT` al mapa de bloques (`Inventario-Renumerado-R-4-2026-08-29.md`), que dejó sin objeto a `ADR-14005` |
| `Mesa-2026-08-31` / `-B` | `M-`, `MI-` | Estado del corpus | `M-01`..`M-06` (puntos «abiertos» que ya estaban cerrados; `M-06` lo funda `R-2`) y el plan de mejora integral con 12 hallazgos `MI-01`..`MI-12`, los doce `PROCEDE` (más `MI-13`, aporte del presidente en `Plan-Mejora-Integral-2026-08-31.md`) |
| `Mesa-2026-09-01-C` | `H-` | «El botón que no hacía nada» | `H-1` **cierto y grave** (claves de protección de datos efímeras); `H-2` **plausible, no probado** |
| `Mesa-2026-09-02` | `V-`, `A-` | «El socket» | `V-1` no se arregla desde el producto · `V-2` no es la causa del desenlace no aplicado · `V-3` sí es la causa de la ventana muerta · `A-1` se ejecutó sin resultado |
| `Mesa-2026-09-12` | `RS-` | Séptima reanudación, base `5c95dab` | Parches `RS-P-01..06` (entre ellos, **la entrada del PR #186 repuesta en `changelog.md`** y el FTP pasado a `workflow_dispatch`); escaladas **`E-02`, `E-04`, `E-05`**, las tres respondidas ese día; deuda del §8 (ADR de topología, entre otras) |
| `Mesa-2026-09-12-ciclo-2` | `RT-` | Convertir `E-02`/`E-04` en plan | **El plan de diez ítems de la fase `k`** (§4) y la convención de versionado: SemVer para el producto, `/v{MAJOR}/` para el contrato, evento de etiqueta = cada fusión a `main` que cambie código de producción, herramienta MinVer (`D-03`), convivencia de un cuatrimestre (`D-02`) |
| `Mesa-2026-09-13` | `MN-` | Fase M1 de la migración 13.7 → 13.16 | §3.1; deudas `DD-1` a `DD-9` |
| `Mesa-2026-09-13-ciclo-2` | `RN8-` | Octava reanudación, base `4fc2763` | 16 hallazgos, los 16 unánimes (salvaguarda de homogeneidad disparada); parches `PR-01..PR-09`; deudas `DD-R8-1..6`; escalada **`E-1`** (secuencialidad del roadmap) |
| `Mesa-2026-09-14` | `RN9-` | Pedido del PO: «evaluación de todo el proyecto», para la salida D (fase `i`) | 26 ítems consolidados, 25 procedentes, 1 refutado; **plan en cuatro lotes**; siete escaladas `E-1..E-7`; deudas `DD-R9-1..7` (§5) |
| `Mesa-2026-09-15` | `RN10-` | El PO **delega** las seis decisiones que la anterior le había dejado | `D-1..D-6`, todas 5-0, **aplicadas en la misma rama** (PR #233); deudas `DD-R10-1..3` (§5) |

La segunda mesa de UX/UI (2026-09-03) está en `changelog.md` l.1003; la primera (2026-09-02) no
tiene entrada propia. Su evidencia vivía en `evidencia/2026-09-02-mesa-ux/`, y **`evidencia/` salió del árbol el 2026-09-13** (PR #207,
`3662bf9`): hoy se lee del historial (`git show 3662bf9^:evidencia/…`).

### 4.1 Los ciclos de decisión del 2026-09-12 y 2026-09-13

| Escalada | Qué se preguntó | Respuesta del PO (literal) | Dónde quedó |
| --- | --- | --- | --- |
| `E-02` | La API quedó públicamente alcanzable | **B**: «la API debe ser expuesta públicamente; la idea es ofrecerla para otros clientes» | Intake 4.3; fila `k` del roadmap |
| `D-01` | Quién es el cliente externo | «no hay tercero — es re simple: un administrador, y luego usuarios generales» | `ADR-00009`; intake 4.4 |
| `E-04` | Qué evento dispara una etiqueta | «buscar cómo se hace en el estándar en la industria» → convención del ciclo 2 | Intake 4.3 §17.1.P.3; `ADR-00010`; MinVer |
| `E-05` | El estado durable del front | Front: **riesgo aceptado** («cuesta un re-login, no hay datos»); backend: **se respalda el SQLite** | Intake §11, `RN-B7` y `RN-B8` |
| `E-1` (09-13) | La secuencialidad, después de que `k` cerró con `i` abierta | «(2) Reescribir §4 (Recommended)» | `Roadmap-Producto.md` 1.15 §4: la secuencialidad rige `a`–`i`; **`k` depende del despliegue real, no del cierre de `i`** |

**La fase `k` —exposición pública y versionado del contrato— se abrió el 2026-09-12 y cerró el
2026-09-13 con el OK del PO** («tenés el ok de la fase K», `EXP-0001` actuación 002). Sus nueve
tareas `BT-00027`..`BT-00035`: **ocho `Done`** y **`BT-00028` `Descartada`** por `ADR-00009`
(campo `Estado` de cada ficha en `Api/06-Backlog-Tecnico/tareas-tecnicas/`). Evidencia en
`Audit/Apertura-Fase-k-2026-09-12.md`, `Audit/DoR-Tramo-k-2026-09-12.md` y
`Audit/BT-00027-Cierre-2026-09-12.md`.

### 4.2 La mesa del 2026-09-14 y sus lotes

Base `5defb479`; jurado de cinco (Evidencia, Impacto, Costo, Coherencia histórica, Riesgo); **19 de
26 ítems unánimes (73 %)**; dos vetos (`R-07` y las columnas de `R-23`). **Reserva de detalle**:
tres ítems explotables no se describieron hasta el commit que los corrige; `R-03` y `R-05`+`REF-02`
se publicaron en la 1.3, `R-07` conserva la reserva operativa (`Mesa-2026-09-14.md` 1.4,
encabezado).

| Ítem | Qué era | Nivel | Desenlace al 2026-09-14 (§6.1) |
| --- | --- | --- | --- |
| `R-01` | Runner propio expuesto a `pull_request` de forks | P1 urgente | PR #209 |
| `R-02` | Partición de origen compartida detrás del front | P1 | PR #216 (`ADR-10009`) |
| `R-03` | La cuota por cuenta no se liberaba con el reseteo | P2 | PR #214 (`ADR-00011` 1.1) |
| `R-04` | Margen de los topes por origen | P3 | **Después de `PT-05`** (`DD-R9-6`) |
| `R-05` + `REF-02` | Un acceso firmado sobrevivía a la baja o al cambio de contraseña | P2 | PR #211 y #212 (`ADR-00003` 1.1) |
| `R-06` | Sin cabeceras de seguridad | P2 | Cerrado el 2026-09-15 por `D-3`, en el origen |
| `R-07` | Alta de cuentas | P2 | Mecanismo en PR #220 (`ADR-00012`); **no rige** sin dominio declarado (`DD-R10-1`) |
| `R-08` | OpenAPI sin `securitySchemes` | P3 | PR #217 |
| `R-09` | Restauración del SQLite nunca probada | P1 antes de alumnos | «Hecho: respaldos con `integrity_check`» (§6.1) |
| `R-10`, `R-11`, `R-16` | Criterios 5 y 6 de `i`; umbral de `PT-05` | P1-P2 | PR #227 (reformulación, `E-6`), #221 (13 atributos `data-gf-*` en `C-4`), receta del formulario |
| `R-12` | CI sin puertas de fase ni cobertura | P2 | PR #228 (`QG-06` con instrumento) |
| `R-13`, `R-14` | Publicación real no descrita; front sin versión visible | P1, P2 | PR #225 y #222 |
| `R-15` | E2E desplegado atado al FTP | P2 | PR #209 |
| `R-17` | La fase `i` sin plan ejecutable | P1 | PR #231 (`Mini-Plan.md` §3.6) |
| `R-18` | `AGENTS.md` con guías inexistentes y contenedores vencidos | P1/P2 | PR #218 (guías completas → `DD-R9-2`) |
| `R-19` | Informes de cierre de `a`–`h` inexistentes | P2 | `E-7` por default: deuda con evento «cierre de `i`» |
| `R-20`..`R-23` | ADR antes de `j…`; bordes sin cerco; ADR desactualizadas; modelo lógico ≠ esquema | P2-P3 | **Lote 3, sin empezar: por evento** |
| `R-24` | Puertas `g` y `h` verdes sin correr pruebas | P3 | PR #223 |
| `RN9-REF-01` | Datos personales sin declaración de tratamiento (Ley 25.326) | P2 | Aviso en el registro (PR #229); intake 5.1 §10 por `D-4` |

| Escalada | Respuesta | Qué rige |
| --- | --- | --- |
| `E-1` alta de cuentas | «Alta sólo por el docente» | Se implementó otra cosa, declarada: dominios admitidos (`ADR-00012`) |
| `E-2` pasaje de `ADR-00011` contradicho | Sin respuesta | Default, y además se corrigió el mecanismo (#214) |
| `E-3` datos personales | «Declararlo en el intake» | Lo escribió la mesa delegada (`D-4`) |
| `E-4` columnas «Momento/Autor del comentario» | Sin respuesta | Default: sólo se documenta, no se migra (`DD-R9-5`) |
| `E-5` umbral de `PT-05` | Sin respuesta | Lo decidió la mesa delegada (`D-1`) |
| `E-6` criterios 5 y 6 de `i` | «Aceptar la propuesta» | `Roadmap-Producto.md` 1.16 §5.2 |
| `E-7` dónde viven los informes de cierre | Sin respuesta | Default: deuda con evento «cierre de `i`» |

### 4.3 La mesa delegada del 2026-09-15

Pedido literal del PO: «proponga alternativas, que elijan la mejor y más razonable y la apliquen —
lo mismo con cualquier otra cosa». Cinco comisiones a ciegas (Producto, Seguridad, Operaciones,
Calidad, Cumplimiento) y un refutador; base `2c34070`.

| Decisión | Elegida (todas 5-0) | Aplicado en |
| --- | --- | --- |
| `D-1` umbral de `PT-05` (`E-5`) | **≤ 5 s** a la primera pantalla funciona; 5–10 s, o un reintento, o la escena 3D sin dibujar: **con reservas**; > 10 s o un paso que no termina: **no funciona** | `Audit/Medicion-PT-05.md` 1.5 §2. Sigue `SIN MEDIR` |
| `D-2` dominio del autorregistro | **No declarar ninguno** hasta que el PO confirme el dominio o exista el alta por el docente (la opción `frre.utn.edu.ar` tuvo veto de Producto) | Nada en la composición → `DD-R10-1` |
| `D-3` cabeceras (`R-06`) | **En el origen**, un middleware por pieza: HSTS `max-age=86400` sin `preload` ni `includeSubDomains`; CSP sin `script-src` | `SecurityHeaders.cs` en `src/GeometriaFactory.Web/Integration/` y `src/GeometriaFactory.Api/Composition/`; `SecurityHeadersTests` (3 pruebas) |
| `D-4` datos personales (`E-3`, `REF-01`) | Declarar finalidad, acceso, retención y supresión, **afirmando sólo lo que el producto hace**; respaldos por un cuatrimestre como máximo | `PRODUCT-INTAKE` 5.1 §10 |
| `D-5` etiqueta o `main` | **Etiquetar antes de desplegar** (`Estrategia-Versionado.md` §3.c ya lo mandaba); sube MINOR | `Guia-Publicacion-Image-Docker.md` 1.5 §2.2; **etiqueta `v1.2.0` sobre `4b114d7`** (`git tag --points-at`) |
| `D-6` constancia de dos corridas | Las tres publicaciones del 2026-09-14 (`cc024c5`, `8d8c857`, `2c34070`) **son** la constancia | `Mini-Plan.md` 3.8 §9.1 |

Fuera del contrato, y lo dice la mesa (§4): **la visita a la facultad** y los ajustes de GitHub
(forks, runner).

## 5. Lo que queda abierto

### 5.1 De nivel producto

| Punto | Estado | Evento de cierre | Fuente |
| --- | --- | --- | --- |
| **Cerrar la fase `i`** | Criterios 1, 2, 5 y 6 **hechos**; 3 (`PT-05`) y 4 (circuito sobre el despliegue real) **sin hacer**; falta además el **OK del PO sobre los seis** | Una visita a la facultad con un alumno de verdad: los pasos 3 a 6 de la receta cierran los dos | `Mini-Plan.md` 3.8 §3.6; `Medicion-PT-05.md` §2.1 |
| **`PT-05`** | **`SIN MEDIR`**, con receta y umbral desde el 2026-09-15. El criterio no exige que dé bien: exige que se documente sea cual sea | La visita | `Medicion-PT-05.md` 1.5 |
| **El caudal de 20 peticiones por minuto** | Provisorio y sin fundamento desde que `D5` se cerró **por incognoscible** (2026-08-20); es «el único umbral de `A-5` que sigue abierto» | El caudal observado en la visita | `Medicion-PT-05.md` §2; `SDD/Docs/README.md` §8 |
| **ADR de topología** que supere a `ADR-14003` en ese punto | Asignado al PO; de él depende `DD-4` | Que se redacte en `Producto/Adrs/` e indexe en `Vista-Producto.md` §5 | `Mesa-2026-09-12.md` §8 |
| **Retiro formal del hosting externo** (FTP) | El canal se conserva como alternativo, sin disparo automático | Los tres pasos de `DESPLIEGUE.md` (fuera del corpus), con constancia | `Mesa-2026-09-12.md` §8 |
| **Dominio admitido del autorregistro** | Mecanismo fusionado, **no rige**; el riesgo de `R-07` queda mitigado por el límite de tasa y la baja desde el panel | El PO confirma el dominio o entra el alta por el docente (`DD-R10-1`) | `Mesa-2026-09-15.md` §5 |
| **Ajustes de GitHub y del runner** | Aprobación de forks, rotación de `E2E_ADMIN_*`, revisión del runner: del PO | — | `Mesa-2026-09-14.md` §6.1, lote 0 |
| **Las capacidades `j…`** (F-15, F-16, F-17) | Ninguna especificada; antes exigen ADR de impacto | Apertura de `j` en `Roadmap-Producto.md` §2.1 (`DD-R9-3`) | `Mesa-2026-09-14.md` §7 |

### 5.2 Deuda declarada vigente, por familia

Todas con los campos de `Root-Rules.md` §12.2 (qué, por qué no hoy, quién, evento, ciclo de origen),
salvo `DD-R10-1..3`, que asienta sólo qué, quién y evento (`Mesa-2026-09-15.md` §5).

| Familia | Ítems | Abiertos | Lo esencial |
| --- | --- | --- | --- |
| `DD-1`..`DD-9` (`Mesa-2026-09-13.md` §8) | 9 | 9 | ADR de la ruta `visor/` (`DD-1`); el sello `sin-bundle` y comentarios de código, incluido `Dockerfile.web` (`DD-2`); ejemplos de `Contracts` y 6 enlaces rotos (`DD-3`); canales y topología en 09 (`DD-4`); `visor.bundle.js` en el intake (`DD-5`); **las cabeceras «Trazabilidad upstream» con versión citada: 116, ampliadas a 129** (`DD-8`); nueve eventos que nombran un momento y no un artefacto (`DD-9`) |
| `DD-R8-1`..`DD-R8-6` (`Mesa-2026-09-13-ciclo-2.md` §7) | 6 | 4 | **Cerradas:** `DD-R8-1` (la puerta de `i` reescrita, PR #226) y `DD-R8-3` (por `E-1`). Abiertas: el `changelog.md` que llega tarde a una fusión propia —**quinta vez**— (`DD-R8-2`); la bitácora vacía del Mini-Plan de `Web` (`DD-R8-4`); «vigente» sin fecha en el manifiesto (`DD-R8-5`); el conjunto cerrado de estados de fase (`DD-R8-6`) |
| Barrido de filas «Vigente» atadas a la fase `i` | 1 | 1 | 21 filas el 2026-09-12; re-enunciado por criterio: **16** después de `PR-07` |
| `DD-R9-1`..`DD-R9-7` (`Mesa-2026-09-14.md` §7) | 7 | 7 | Guion de restauración (`DD-R9-1`); guías de `11-Documentacion` (`DD-R9-2`); ADR antes de `j…` (`DD-R9-3`); cercar bordes (`DD-R9-4`); modelo lógico (`DD-R9-5`); topes por origen tras `PT-05` (`DD-R9-6`); detalle reservado de `R-07` (`DD-R9-7`) |
| `DD-R10-1`..`DD-R10-3` (`Mesa-2026-09-15.md` §5) | 3 | 3 | Dominio admitido (PO); CSP con `nonce` en el front (agente, primera unidad que toque el marcado); `Pipeline-CI-CD.md` con los pasos de `ci.yml` del PR #228 (agente, próxima emisión de `09-Devops`) |

Recuentos de «abiertos» leídos de los propios registros; ninguna fila con su evento ocurrido según
el contraste de `Mesa-2026-09-14.md` §7, salvo `DD-R8-1` (PR #226) y `DD-R8-3` (respuesta a `E-1`).
Después del contraste, el evento de `DD-5` («próxima fila de control de cambios del intake»)
**ocurrió** con la fila 5.1 del 2026-09-15 sin tocar `visor.bundle.js`, que sigue en el intake:
la deuda queda abierta con su evento vencido. **El framework
no fija un conjunto cerrado para el campo `Estado`** del ítem diferido, de modo que el recuento
depende de la regex de quien cuenta (`Mesa-2026-09-13-ciclo-2.md` §7, observación al framework).

### 5.3 De la construcción y de la documentación

| Punto | Estado | Fuente |
| --- | --- | --- |
| La acción primaria del envío fuera de la primera pantalla (ordenada 1061 a 1440×900); **cerrarlo pide una decisión** | Sin desenlace posterior en `changelog.md` | `changelog.md` l.1071 |
| «Entrega de la comisión»: un alumno filtrado sin entregas muestra el vacío de colección | Ídem | `changelog.md` l.1074 |
| `H-2` de la mesa del 2026-09-01-C | **Plausible, no probado** | `Mesa-2026-09-01-C.md` |
| La ventana muerta del circuito (`V-1`/`V-3`) bajo el front en contenedor | Ninguna fuente posterior lo mide (`git grep -i websocket` sobre las mesas de septiembre y `changelog.md`: sin salida) | `Mesa-2026-09-02.md` |
| La imagen del front **arranca sana sin configurar** y apunta a `localhost:5080` | Declarado en `deploy/Dockerfile.web` l.128-140; la guarda vive en la composición, fuera del repositorio | `Dockerfile.web` |
| `PRODUCT-INTAKE` §16 describe `deploy/compose.yaml` como «despliegue desde Git en destino» | Sigue en el texto (l.661); la guía de publicación aclara que **la composición real no es esa** | `Guia-Publicacion-Image-Docker.md` l.98 |
| `Producto/11-Documentacion` | `README.md` en `Propuesto`, `Contrato-Agentes.md` 1.1 (al día por `R-18`) y `Bitacora-Eventualidades.md`; **las guías de inicio y de despliegue no están emitidas**, y `AGENTS.md` ya lo dice (l.83-84) | `DD-R9-2` |
| `CHANGELOG.md` en `SDD/Docs/` no se emite | **Apartamiento declarado**: el registro es `changelog.md` de la raíz | — |
| El PR #186 sin entrada en `changelog.md` | **Cerrado**: entrada repuesta y marcada como tal (`RS-P-03`, `6b16127`) | `changelog.md` l.1078 |
| Dos vías de publicación del front | **Resuelto en parte**: el FTP quedó como canal alternativo, sólo por `workflow_dispatch` (`RS-P-06`, `b180b76`); su retiro formal es del PO (§5.1) | `Mesa-2026-09-12.md` §7 |

## 6. Lo que este producto aprendió sobre sus propios pendientes

De los ocho puntos que `SDD/Docs/README.md` §8 llegó a listar, **seis se cerraron sin que nadie
tocara esa tabla**: **un resumen derivado no tiene forma de saber que su fuente cambió**. Tres
veces en un mismo día (`D1`, `PT-01.a`, `PA-01`) una decisión bien tomada no volvió a quien había
hecho la pregunta; está elevado como **reporte 21**, y `scripts/verify-propagacion.sh` es la
compuerta que existe para atraparlo.

**Septiembre repitió el patrón y le sumó tres lecciones propias:**

- **Una cita con número de versión envejece sola.** `Medicion-PT-05.md` corrigió **tres veces** la
  misma cita al roadmap (1.8 → 1.9 → 1.10) hasta que la 1.3 **le quitó el número**
  (`Root-Rules.md` §10 R1). Las 129 cabeceras de `DD-8` son el mismo defecto a escala.
- **El registro de cambios llega tarde a las fusiones propias**: cinco veces, la última el PR #207
  (`DD-R8-2`). El remedio que propone la mesa no es más disciplina sino **hacerlo subproducto del
  acto** o comprobarlo en la compuerta de arranque.
- **Una delegación no es una aprobación, salvo que diga serlo.** `EXP-0001` se negó a asentar una
  delegación previa como aprobación del plan (actuación 008); dos días después el PO **delegó
  explícitamente** seis decisiones en una mesa, y la mesa rotuló como suyas las que aplicó
  en el texto (`D-1` y `D-4`); `D-1` declara además que el PO puede reemplazarla sin reabrir nada
  (`Mesa-2026-09-15.md` l.35).

**Un punto abierto que no bloquea no es un punto barato: es uno que nadie vuelve a mirar.** Lo que
hoy separa a la fase `i` de su cierre no es trabajo de agente sino **una persona en la red de la
facultad**: todo lo demás está hecho y verificado (`Mini-Plan.md` §3.6).

Las contradicciones medidas entre documentos de este dominio y el árbol están en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md). El calendario de fases y la
publicación, en [`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md);
el mapa de dónde vive cada documento, en [`01_Corpus-Documental-SDD.md`](01_Corpus-Documental-SDD.md).
