# 01 · El corpus documental `SDD/` — dónde vive cada cosa y qué gobierna

> **Propósito.** Que un agente encuentre el documento que decide algo sin recorrer los 650 archivos
> vivos de `SDD/`. Este índice **no resume el contenido de los documentos**: dice dónde están,
> cuántos son y qué autoridad tiene cada uno. Qué decidió cada ADR, mesa o auditoría está en
> [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).
> **Fuente primaria.** `SDD/README.md`, `SDD/Docs/README.md` 2.9 §4 y §7, la carátula de
> `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/README.md`, y el árbol de `SDD/` contado con
> `git ls-files SDD` (sin `_legacy/`).
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. Cómo está partido el corpus

`SDD/` son los artefactos del **Framework SDD**; el framework mismo vive en `IA/IA.SDD` y **no se
copia acá** (`SDD/README.md`: «vive en un repositorio aparte y no se copia acá»). `SDD/README.md`
es **un puntero y no replica estado**: se reescribió el 2026-09-13 porque su versión del
2026-08-09 afirmaba que `Docs/` estaba vacía (parche PR-09 de `Audit/Mesa-2026-09-13-ciclo-2.md`).

```text
SDD/                                  650 vivos (más 679 en _legacy/)
├── README.md                         puntero: Docs/README, Intake/, Audit/, Expedientes/
├── Intake/                    2      el intake y el manifiesto derivado
├── Maquetas/                 17      once maquetas HTML de la Fase B2, índice, README y 4 assets
├── Expedientes/              53      un expediente de caso: EXP-0001 (nuevo desde la 3.0)
└── Docs/                    577      todo lo generado
    ├── README.md                     README raíz del producto (2.9)
    ├── Handoff-Checkout.md           el traspaso
    ├── 00-Contexto/           5      visión, alcance, roadmap, compatibilidad + README
    ├── 01-Necesidades-Negocio/ 11    NB-00001 a NB-00009 + índice + README
    ├── Producto/             31      vista, pipeline, norma de nombres, ADR y contratos de frontera
    ├── Audit/               120      103 informes .md + 17 registros .json
    └── Unidades-Entrega/
        ├── GeometriaFactory-Api/ 282 categorías 02, 03, 05, 06, 07, 08, 09, 10, 11
        └── GeometriaFactory-Web/ 126 las mismas nueve
```

Contado con `git ls-files SDD | grep -v _legacy/` agrupado por carpeta. De los 577 de `Docs/`,
560 son `.md`; en todo `SDD/` vivo hay 580 `.md`, que suman 106.633 líneas (los 650 archivos vivos suman 149.243;
`xargs cat | wc -l`).

**El árbol cuelga de la unidad de entrega y no del proyecto de código** desde la migración 6.0 →
8.6 (`Docs/README.md` §4). Los siete proyectos de código **no tienen árbol documental propio**: su
contenido está consolidado en la unidad que componen —`Domain`, `Application`, `Infrastructure` y
`Contracts` en `GeometriaFactory-Api`; `Visor` en `GeometriaFactory-Web`—, con una subsección por
proyecto dentro de cada documento.

**`_legacy/` es registro histórico y no se reescribe.** Cada emisión que se reemplaza deja su
estado anterior en `_legacy/AAAA-MM-DD/<Documento>-vX.Y.md` (las filas de control de cambios lo
dicen: «Estado anterior en `_legacy/2026-09-15/`»). Los 679 archivados se reparten así: 303 en
`Docs/Unidades-Entrega/**/_legacy`, 261 en `Docs/_legacy`, 53 en `Intake/_legacy`, el resto en las
demás carpetas. **Todo lo que este índice nombra es vivo.**

**La categoría `04-Prompts-AI` no existe en ninguna unidad**: ningún proyecto usa modelos de
lenguaje y la omisión está declarada en el manifiesto (`Docs/README.md` §4 y §7.1, «Omitida por
gating»).

**La cadena de especificación se lee en orden** 00 → 01 → 02 → 03 → 05 → 06 → 07 → 08 → 09 → 10 →
11 (`Docs/README.md` §4, último párrafo).

## 2. La entrada: intake, manifiesto y sus fuentes

| Documento | Versión vigente | Qué es | Quién lo escribe |
| --- | --- | --- | --- |
| `Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` (2.016 líneas) | **5.1**, 2026-09-15, Aprobado | **El documento humano de entrada.** Problema, alcance MoSCoW (§4), restricciones (§10), estilo arquitectónico (§14), árbol del repositorio (§16), una sección por unidad (§17.1 `Api`, §17.2 `Web`), los **ocho** escenarios de datos `§20.E-1` a `§20.E-8` y los supuestos (§22) | El Product Owner, asistido por agente |
| `Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` (319 líneas) | **7.1**, 2026-09-13, Aprobado | La composición **derivada** de intake §13: tablas de unidades (§2.A), de proyectos (§2.B), matriz (§2.C), los dos grafos (§3), validaciones bloqueantes (§4), flags (§5). «No se completa a mano» | El orquestador, con confirmación humana |

**Los dos son documento humano en el sentido operativo: lo desalineado se eleva, no se corrige**
(`AGENTS.md` l.61, que se regenera desde `Producto/11-Documentacion/Contrato-Agentes.md` l.107). La
misma fila alcanza a **los requerimientos técnicos**.

**Las tres fuentes del intake no están en este repositorio.** El intake (sección «Fuentes de este
intake y regla de veracidad») declara que vienen de `Lab-Geometria.Documentacion`: **RF**
`PROMPTs/03-Ejecutar-Prompt-Integrador-Documento-Intake/INPUTs/Requerimientos-Funcionales.md`,
**RT** `…/INPUTs/Requerimientos-Tecnicos.md` y **AN** `Analisis/Analisis-Actividad-Documento-Integrador.md`.
Toda afirmación del intake cita `RF §x`, `RT §x` o `AN §x`. `git ls-files` del repositorio indexado
no tiene ninguna carpeta `PROMPTs/`: **su contenido no se verificó para este índice**.

**Qué movió el intake desde la 3.0** (filas 4.0 a 5.1 de su control de cambios, todas entre el
2026-09-12 y el 2026-09-15):

| Entrada | Qué cambió, en una línea |
| --- | --- |
| 4.0 – 4.1 | Todo proyecto bajo el árbol de solución: el visor pasa a `GeometriaFactory.sln` como **nodo sin construcción** (`visor/geometriafactory-visor.csproj`) |
| 4.2 | La topología del 2026-09-06 —contenedores en el servidor propio, túnel y dominio propio— entra en §14 (`F-14`) y §9 (`X-10`) |
| 4.3 – 4.5 | La API se expone a otros clientes (`E-02`, `E-04`, `E-05` de la mesa del 2026-09-12); deja de decir «no hay clientes de terceros»; `D-01` se cierra con `Api ADR-00009` |
| 4.6 | §16 anota que la solución agrupa los veinte samples |
| 5.0 | Migración normativa 13.7 → 13.16, fase M2, sobre la plantilla 3.6, aprobada en EXP-0001 actuación 011 |
| 5.1 | §10: la Ley 25.326 aplica y entra la fila «Tratamiento de datos personales» (mesa delegada del 2026-09-15, D-4) |

## 3. Nivel producto

| Ruta (bajo `SDD/Docs/`) | Versión | Qué gobierna |
| --- | --- | --- |
| `README.md` | **2.9** (2026-09-13) | README raíz: identidad, los dos ejes (§2), mapa (§4), lectura por rol (§5), estado por categoría (§7.1) y por etapa (§7.2), **y §8, «lo que todavía no está decidido»**. Dejó de replicar magnitudes (§7.3) |
| `Producto/Vista-Producto.md` | **1.11** | El mapa que ninguna categoría `05` da sola: proyectos, **grafo de dependencias**, contratos de frontera, lo transversal, riesgos de integración. Es donde `Docs/README.md` §7.3 manda a buscar las magnitudes vivas |
| `Producto/Pipeline-Producto.md` | **1.9** | Orden de construcción y salida del producto; §3.1 «la configuración de compilación se declara siempre y en los dos lados» |
| `Producto/Plan-Etapa-A.md` | **1.13** | Plan del andamiaje; declara el apartamiento `AP-01` (`Directory.Build.props` y `.editorconfig` compartidos) |
| `Producto/Norma-De-Nomenclatura.md` | **1.31** (fila del 2026-09-14) | **La fuente de nombres.** Ver [`10_Glosario-Y-Nomenclatura.md`](10_Glosario-Y-Nomenclatura.md) |
| `Producto/Medicion-Puertas-Tecnicas-PT-02-PT-03.md` | 2.0 | Las dos puertas técnicas medidas sobre el bundle del visor |
| `Producto/Adrs/` (13) | — | ADR de frontera: `ADR-08001` a `ADR-08008` (contratos compartidos) y `ADR-14001` a `ADR-14005` (apartamientos de la migración; **`ADR-14005` está RETIRADO** desde el 2026-08-29) |
| `Producto/Contratos-Inter-Unidad/` (10) | — | `README.md`, `Contratos-Abstractions.md` y los ocho contratos `CU-08001` a `CU-08008` que cruzan entre las dos unidades; los ocho se reemitieron el 2026-09-13 (estado anterior en `_legacy/2026-09-13/`) |
| `Producto/11-Documentacion/` (3) | — | `README.md` (plan documental, 1.4), `Contrato-Agentes.md` —**del que se regenera `AGENTS.md`**; fila 1.1 del 2026-09-14, «al día con lo que corre» (`R-18`)— y `Bitacora-Eventualidades.md` |
| `00-Contexto/` (5) | — | `Vision-Producto.md` 1.7, `Alcance-Producto.md` 1.7, `Roadmap-Producto.md` **1.16** —**única fuente del roadmap**, con las fases `a` a `i`, `j…` y **`k`**—, `Compatibilidad-Plataformas.md` 1.6 y `README.md` |
| `01-Necesidades-Negocio/` (11) | — | Las nueve `NB-00001` a `NB-00009` (en `Necesidades-De-Negocio/`), `Necesidades-Negocio.md` y `README.md`; ninguna cambió desde la 3.0 (`git log 89f3ab3..4b114d7` vacío); la última fila de su control de cambios es ≤ 2026-08-11, aunque git registra cambios sin fila hasta el 2026-08-16 |
| `Handoff-Checkout.md` | 1.10 | El traspaso: qué queda hecho, qué queda con salvedad |

## 4. `GeometriaFactory-Api` — la unidad del servicio de datos (282 vivos)

| Categoría (archivos) | Documentos que más se consultan |
| --- | --- |
| `02-Especificacion-Funcional` (6 en raíz) | `Definicion-Superficie-HTTP.md` **1.15** (**la superficie se decide acá**), `Definicion-Modelo-De-Dominio.md`, `Definicion-Contrato-Del-Validador-De-Figuras.md`, `Glosario-Funcional.md`, `Especificacion-Funcional.md`, `README.md` |
| `02/Casos-De-Uso/` (9) | `CU-00021` a `CU-00029`: alta de cuenta, ingreso, gobierno de cuentas, reseteo, configuración del administrador, envío, eliminación, listado y detalle, desenlace |
| `02/Reglas-De-Negocio/` (16) | `RN-02001` a `RN-02016` — ver [`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md) |
| `02/Modelo-Datos/` (8) | `Modelo-Conceptual.md` y siete reglas conceptuales `RC-06001` a `RC-06007` en `reglas-conceptuales-de-modelo/` |
| `03-UX-UI-DX` (5) | `DX-Error-Messages.md` §1.4 es **el único lugar donde `RA-03` se puede violar hacia afuera**; `DX-Developer-Experience.md`, `Guia-Onboarding-Developer.md`, `Glosario-UX.md`, `README.md` |
| `05-Arquitectura-Tecnica` (7 en raíz) | `Arquitectura-Unidad-Entrega.md`, **`Contratos-REST.md` 1.11**, `Contratos-Abstractions.md`, `Modelo-Datos-Logico.md`, `Flujo-Ejecucion.md`, `Decisiones-Arquitectura.md`, `README.md` |
| `05/Adrs/` (**31**) | `000xx` Api (**12**), `020xx` Domain (6), `040xx` Application (6), `060xx` Infrastructure (7). Nuevos desde la 3.0: `ADR-00009` a `ADR-00012`; `ADR-00008` queda **«Superado parcialmente por `ADR-00010`»** |
| `05/Operaciones-Internas/` (14) | `README.md` y 13 casos de uso que no son de la superficie: `CU-00009` a `CU-00011` (traducción, composición, arranque) y `CU-06001` a `CU-06010` |
| `06-Backlog-Tecnico` (4 en raíz) | `Backlog-Tecnico.md` 3.2, `Product-Backlog.md` 4.7, `Definition-Of-Ready.md`, `README.md` |
| `06/historias-usuario/` (114) | Las historias `US-*` |
| `06/tareas-tecnicas/` (**35**, nueva) | `BT-00001` a `BT-00035`, extraídas del bloque `00xxx` a un archivo cada una (commit `b06117f`). **34 en `Done` y 1 `Descartada`** (`BT-00028`, por `ADR-00009`). `BT-00027` a `BT-00035` son el tramo `k` |
| `07-Plan-Sprint` (2) | **`Mini-Plan.md` 3.8** y `README.md`. El mini-plan lleva el tramo `k` (§3.5), **el plan ejecutable del cierre de la fase `i` (§3.6)** y la bitácora de avance (§9) |
| `08-Calidad-Y-Pruebas` (9) | `Estrategia-Calidad.md`, `Estrategia-Testing.md`, `Criterios-Validacion.md` (`CV-00002`, la batería del validador), `Matriz-Cobertura-Pruebas.md`, `Matriz-Sensado-Deriva.md`, `Plan-Pruebas.md`, `Casos-Prueba-Referenciales.md`, `Definition-Of-Done.md`, `README.md` |
| `09-Devops` (6) | `Pipeline-CI-CD.md`, `Entornos-Deploy.md`, `Estrategia-Versionado.md`, `Guia-Publicacion-Image-Docker.md` **1.5** —§2.2 describe «la publicación real, tal como corre desde el 2026-09-06», **incluida la imagen del front `deploy/Dockerfile.web`**—, `Supply-Chain-Seguridad.md`, `README.md` |
| `10-Examples` (**15**) | `README.md`, los doce `ejemplo-0N-<nivel>-<capa>.md`, **`ejemplo-04-cliente-http-basico-api.md`** (nuevo, el onboarding de un cliente externo) y `CU-00012`, la colección reproducible |
| `11-Documentacion` (1) | Sólo el `README.md` con el plan: la categoría está **planificada**, no emitida |

## 5. `GeometriaFactory-Web` — la unidad del front (126 vivos)

| Categoría (archivos) | Documentos que más se consultan |
| --- | --- |
| `02-Especificacion-Funcional` (4 en raíz) | `Definicion-Contrato-De-Fachada.md` (las seis funciones del visor), `Glosario-Funcional.md`, `Especificacion-Funcional.md`, `README.md` |
| `02/Casos-De-Uso/` (10) | `CU-10001` a `CU-10010`, de registrar la cuenta a sostener el estado degradado |
| `03-UX-UI-DX` (23) | `Experiencia-De-Uso.md`, `Linea-Base-Visual.md`, `Glosario-UX.md`, `Contrato-Datos-Maqueta.md`, `Bitacora-Validacion-Maqueta.md`, dos `DX-*`, `Guia-Onboarding-Developer.md`, `README.md`, once `Wireframes-*.md` y tres `Representacion-*.md` |
| `05-Arquitectura-Tecnica` (6 en raíz) | `Arquitectura-Unidad-Entrega.md`, `Contratos-Abstractions.md`, `Extensibilidad.md` (§2: **el punto de extensión del producto es la fachada de seis funciones**), `Flujo-Ejecucion.md`, `Decisiones-Arquitectura.md`, `README.md` |
| `05/Adrs/` (**15**) | `100xx` Web (**9**) y `120xx` Visor (6). Nuevos desde la 3.0: `ADR-10008` (el bundle lo genera el proyecto del front) y `ADR-10009` (el front le dice al servicio de dónde llegó el navegador) |
| `05/Contrato-Componente-Visor/` (8) | `README.md` y `CU-12001` a `CU-12007`, el contrato del bundle aislado de su anfitrión |
| `06-Backlog-Tecnico` (4 + 30) | `Backlog-Tecnico.md`, `Product-Backlog.md` 4.6, `Definition-Of-Ready.md`, `README.md` y 30 historias en `historias-usuario/` |
| `07-Plan-Sprint` (2) | `Mini-Plan.md` y `README.md` |
| `08-Calidad-Y-Pruebas` (11) | Los ocho comunes más `Pruebas-Extremo-A-Extremo.md`, `Guia-Testing-Extensibilidad.md` y `README.md` |
| `09-Devops` (7) | `Guia-Publicacion-Front-Ftp.md`, `Guia-Publicacion-Bundle-Visor.md`, `Pipeline-CI-CD.md`, `Entornos-Deploy.md`, `Estrategia-Versionado.md`, `Supply-Chain-Seguridad.md`, `README.md`. **La imagen del front no tiene guía propia acá**: la describe la guía de la unidad `Api` (§4) |
| `10-Examples` (5) | `README.md`, tres ejemplos por nivel y `ejemplo-01-datos-seed.md` |
| `11-Documentacion` (1) | Sólo el `README.md` con el plan |

**`SDD/Maquetas/GeometriaFactory-Web/`** (17 archivos: once maquetas `.html`, `index.html`,
`README.md` y cuatro assets en `assets/css` y `assets/js`) guarda las maquetas aprobadas en la Fase
B2. `scripts/verify-visual-system.sh` control `C-4` exige que **los tokens de `app.css` sean
exactamente los de la maqueta aprobada** (l.12 y l.73 del guion): la maqueta no es decorado, es
instrumento de una puerta. Se cuenta y no se indexa.

## 6. `Docs/Audit/` — 120 archivos, por familia

Eran 107 en la 3.0; los 13 nuevos están marcados ✚.

| Familia | Cuántos | Qué contiene |
| --- | --- | --- |
| Informes de fase `A-00-01`, `B-02-03-*`, `B2-*`, `C-05-*`, `D-06-07-*`, `E-08-*`, `F-09-*`, `G-10-*`, `H-Final-*`, `I-1/I-2-*` | 31 | El informe que cierra cada fase de especificación, con su dictamen y sus rondas `-rN` (los `B-02-03` son 15, uno o más por proyecto de código) |
| `Coherencia-Corpus-r1/r2`, `F26-Propagacion-r1/r2` | 4 | Barridos de coherencia del corpus |
| `Informe-Migracion-*` | **8** | Las ocho migraciones normativas cerradas, de 6.0 → 8.6 a ✚ **13.7 → 13.16** (APROBADO CON OBSERVACIONES, 2026-09-13) |
| `Plan-Migracion-*` | **7** | Un plan por migración salvo la 6.0 → 8.6; ✚ `Plan-Migracion-13.7-a-13.16.md` 1.4 |
| `Migracion-*` + `Cierre-N05-*` | 21 + 1 | 5 `.md` de trabajo (árbol, deduplicación, consolidación, propuesta de intake), 16 registros `.json` de reconexión de citas y `Cierre-N05-Registro-Reconexion.json` |
| `Mesa-*` | **12** | Las mesas: `2026-08-27`, `08-29`, `08-31`, `08-31-B`, `09-01-C`, `09-02`, y ✚ `09-12`, `09-12-ciclo-2`, `09-13`, `09-13-ciclo-2`, `09-14`, `09-15` (§6.1) |
| `Estado-Del-Destino-*` | **7** | Los contrastes de estado de cada reanudación: `08-16`, `08-17`, `08-18`, `08-23`, `08-27`, ✚ `09-12` (séptima), ✚ `09-13` (octava) |
| `Medicion-*` / `Inventario-*` | 3 + 3 | `PT-05` (**1.5, «SIN MEDIR»**), pintado del listado, volumen de comisión; marcas `[A VERIFICAR]`, renombre `F03`, renumerado `R-4` |
| `Observacion-*` | 6 | Observaciones elevadas al framework, no al producto |
| Fase `k` ✚ | 3 | `Apertura-Fase-k-2026-09-12.md`, `DoR-Tramo-k-2026-09-12.md` (DoR criterio por criterio) y `BT-00027-Cierre-2026-09-12.md` (verificaciones con comando y salida) |
| Decisiones, planes y reportes sueltos | 14 | `A3-Decisiones-Del-Product-Owner.md`, `D1-Confirmacion-De-Asunciones.md`, `Decisiones-Y-Frases-Retiradas.md`, `Clasificacion-Pendientes-A1.md`, `Cierre-De-Hallazgos-Abiertos-2026-08-17.md`, `Plan-Cierre-De-Pendientes.md`, `Plan-Conversion-Nomenclatura-Item-Diferido.md`, `Plan-Mejora-Integral-2026-08-31.md`, `Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md`, `Evaluacion-Del-Codigo-2026-08-27.md`, `Analisis-Refresco-Al-Restaurar-La-Ventana.md`, `Reporte-Hallazgos-De-Los-Samples-2026-08-30.md`, `Reporte-Despliegue-Somee.md`, `Reporte-Primera-Aplicacion-Del-Instrumento.md` |

### 6.1 Las seis mesas nuevas, en una línea cada una

| Registro | Versión | Quién la convoca | Prefijo | Qué produjo (dónde mirar) |
| --- | --- | --- | --- | --- |
| `Mesa-2026-09-12.md` | 1.2 | `Master-Prompt-Reanudacion.md` §3.1, séptima reanudación, base `5c95dab` | `RS-` | Escaladas `E-02`, `E-04`, `E-05` al PO (§9) |
| `Mesa-2026-09-12-ciclo-2.md` | 1.1 | Convocatoria directa: el PO respondió `E-02`/`E-04` y pidió plan | `RT-` (sin hallazgos propios) | **El plan de exposición pública**: los diez ítems de la fase `k` (§4, citado por `Roadmap-Producto.md` §2) |
| `Mesa-2026-09-13.md` | 1.3 | `Master-Prompt-Migracion.md` 2.10, fase M1 de la migración a 13.16, base `b9675d8` | `MN-` | La mesa del plan de migración; foliada en EXP-0001 actuación 004 |
| `Mesa-2026-09-13-ciclo-2.md` | 1.1 | Octava reanudación, fase R1.5, base `4fc2763` | `RN8-` | Parches `PR-01`… (p. ej. el de `SDD/README.md`, PR-09) y la deuda `DD-R8-1` (la puerta `verify-stage-i.sh`, según `Docs/README.md` §7.2) |
| `Mesa-2026-09-14.md` | 1.4 | Mesa de expertos a pedido: «una evaluación de todo el proyecto», base `5defb47` | `RN9-` | Evaluación integral: **24 ítems `R-01` a `R-24`**, dictamen (§5), plan en lotes (§6), escaladas `E-1` a `E-7` (§8). **Reserva de detalle en `R-07`** por ser repositorio público (cabecera) |
| `Mesa-2026-09-15.md` | 1.0 | Mesa delegada por el PO, base `2c34070` | `RN10-` | Seis decisiones `D-1` a `D-6`, «todas 5-0, aplicadas en la misma rama» (§6); fuera del contrato, la visita a la facultad |

## 7. `SDD/Expedientes/` — nuevo desde la 3.0

`SDD/README.md` lo nombra como cuarta entrada. Hay **un** expediente:

| Pieza | Cuántos | Qué es |
| --- | --- | --- |
| `0001-Migracion-Normativa-A-13.16/README.md` | 1 | La carátula de **EXP-0001**: migración de SDD 13.7 a 13.16, abierta y cerrada el 2026-09-13, estado **«resuelto»**, con índice foliado de actuaciones (§1) y de evidencia con SHA-256 (§2) |
| `actuaciones/` | 13 | `001` presentación del PO a `013` resolución final; incluye el OK del PO a la fase `k` (`002`) y la aprobación del plan y del intake (`011`) |
| `evidencia/` | 30 | `E-001` a `E-024` con variantes (`E-006b…h`, `E-014b`, `E-015b`): salidas de comandos `.txt`, tres guiones `.py`, un `.sh`, dos `.md`. Sólo se cuentan |
| `propuestas/` | 9 | Siete `.diff` (`P-01` intake 5.0, `P-02` manifiesto 7.0, `P-03` vista 1.11, `P-04` pipeline 1.9, `P-06`, `P-06b`, `P-08`), `aplicar-propuestas.sh` y `E-016` |

**Autoridad.** La carátula declara que la forma de expediente es **un adelanto a una norma que el
framework todavía no tiene**, y que el plan, la mesa y el informe de la migración **viven en
`Docs/Audit/` y el expediente los folia por enlace, sin duplicarlos**. `Mesa-2026-09-13-ciclo-2.md`
lo trata como «forma histórica (framework 13.18) y no se toca».

## 8. Dónde está cada plan y cada bitácora

| Busco… | Está en | Estado |
| --- | --- | --- |
| el plan de la fase en curso | `Api/07-Plan-Sprint/Mini-Plan.md` §3.6, **«el plan ejecutable del cierre»** de `i` (nació del `R-17` de la mesa del 2026-09-14) | Seis criterios del roadmap §5.2: 1, 2, 5 y 6 «Hecho»; 3 (`PT-05`) y 4 (circuito sobre el despliegue real) **esperan la visita**, del PO |
| el plan de la fase `k` | `Mini-Plan.md` §3.5 y `Mesa-2026-09-12-ciclo-2.md` §4 | Cerrada con OK del PO el 2026-09-13 (`Docs/README.md` §7.2) |
| el plan del andamiaje | `Producto/Plan-Etapa-A.md` | Etapa `a` cerrada |
| los planes de migración | `Audit/Plan-Migracion-*.md` (7) | Las ocho migraciones cerradas (`Docs/README.md` §7.1) |
| planes transversales | `Audit/Plan-Mejora-Integral-2026-08-31.md`, `Plan-Cierre-De-Pendientes.md`, `Plan-Conversion-Nomenclatura-Item-Diferido.md` | Registro de su fecha |
| qué contesta y qué no la fase `i` | `Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md` | Anterior al plan ejecutable de §3.6 |
| la bitácora del entorno | `Producto/11-Documentacion/Bitacora-Eventualidades.md` | Viva |
| la bitácora de la maqueta | `Web/03-UX-UI-DX/Bitacora-Validacion-Maqueta.md` | Fase B2 |
| la bitácora de avance por tramo | `Mini-Plan.md` §9 de cada unidad | Viva |
| el avance de la construcción | `changelog.md`, en la raíz del repositorio de código —**única fuente**, `Docs/README.md` §7.2— | Viva |

## 9. Qué cambió en el corpus desde la 3.0 (`89f3ab3` → `4b114d7`)

`git diff --name-status 89f3ab3..4b114d7 -- SDD`, sin `_legacy/`: **108 archivos agregados y 61
modificados**; en `_legacy/` entraron 74 emisiones archivadas.

| Qué | Dónde |
| --- | --- |
| Expediente nuevo, 53 archivos | `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/` (§7) |
| 35 tareas técnicas a archivo propio | `Api/06-Backlog-Tecnico/tareas-tecnicas/` |
| 13 informes de auditoría | Seis mesas, dos estados del destino, el informe y el plan de la migración 13.16, tres de la fase `k` (§6) |
| 6 ADR | `Api ADR-00009` a `ADR-00012`, `Web ADR-10008` y `ADR-10009` |
| 1 ejemplo | `Api/10-Examples/ejemplo-04-cliente-http-basico-api.md` |
| Reemisiones de nivel producto | Intake 3.4 → **5.1**, manifiesto 5.4 → **7.1**, `Docs/README.md` → 2.9, `Vista-Producto` 1.11, `Pipeline-Producto` 1.9, `Roadmap-Producto` 1.16, `Norma-De-Nomenclatura` 1.31, `Contrato-Agentes` 1.1, los ocho `CU-0800x` y `Contratos-Abstractions` |
| Reemisiones de unidad | `Definicion-Superficie-HTTP` 1.15, `Contratos-REST` 1.11, `Mini-Plan` 3.8, `Guia-Publicacion-Image-Docker` 1.5, devops de las dos unidades y calidad de `Api` |
| `SDD/README.md` | Pasó a puntero (2026-09-13) |

**Magnitudes que la 3.0 publicaba y ya no valen**: 542 vivos → **650**; 1.147 totales → **1.329**;
`Audit/` 107 → **120**; `Api/05/Adrs` 27 → **31**; `Web/05/Adrs` 13 → **15**; `Api/10-Examples`
14 → **15**; «siete migraciones» → **ocho**; seis mesas → **doce**. Todas recontadas sobre
`4b114d7`.

## 10. Cómo leerlo, por intención

| Quiero… | Abro |
| --- | --- |
| entender el producto entero antes de tocar una parte | `Docs/README.md` → `Docs/Producto/Vista-Producto.md` |
| la superficie HTTP exacta | `Api/02-Especificacion-Funcional/Definicion-Superficie-HTTP.md` y `Api/05-Arquitectura-Tecnica/Contratos-REST.md` — ver [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md) |
| saber cómo se nombra algo antes de escribirlo | `Producto/Norma-De-Nomenclatura.md` §6 |
| saber si el entorno ya le falló a alguien | `Producto/11-Documentacion/Bitacora-Eventualidades.md` |
| qué falta para cerrar la fase `i` | `Api/07-Plan-Sprint/Mini-Plan.md` §3.6 y `Audit/Medicion-PT-05.md` |
| la última evaluación integral del proyecto | `Audit/Mesa-2026-09-14.md` y lo que decidió `Audit/Mesa-2026-09-15.md` |
| dónde quedó parado el destino al reanudar | `Audit/Estado-Del-Destino-2026-09-13.md` (el más reciente) |
| cómo se hizo la última migración normativa | `Audit/Informe-Migracion-13.7-a-13.16.md` → `SDD/Expedientes/0001-…/README.md` |
| el avance real de la construcción | `changelog.md` en la raíz del repositorio — y `git log` cuando el changelog calla |
| qué queda abierto | `Docs/README.md` §8, `Mini-Plan.md` §3.6 y la deuda declarada de cada mesa (§7 de `Mesa-2026-09-14.md`, §5 de `Mesa-2026-09-15.md`) |

**Leé la versión en el control de cambios, no sólo en la cabecera.** En varios documentos vivos
la fecha de cabecera quedó atrás de la última fila de su control de cambios (`Roadmap-Producto`,
`Mini-Plan`, `Plan-Etapa-A`, `Handoff-Checkout`, `Web/09-Devops/README.md`), y `Contrato-Agentes.md`
declara `version: "1.0"` en su frontmatter con una fila 1.1. El detalle medido está en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).

**Ningún rol debería empezar por la categoría de un proyecto de código suelto**: son siete y se
condicionan entre sí, y la mayoría de los defectos que la propia auditoría del producto registró
nacieron de leer una parte y afirmar algo del todo (`Docs/README.md` §5).
