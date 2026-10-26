# 00 · Índice maestro — qué es la Fábrica de Geometría y en qué estado está

> **Propósito.** Dar en una sola lectura el producto, su stack, su composición, su estado de
> avance y sus magnitudes, para que un agente pueda ubicarse sin abrir el repositorio, y decirle
> qué índice abrir después.
> **Fuente primaria.** `README.md`, `AGENTS.md`, `changelog.md`, `Directory.Build.props`,
> `GeometriaFactory.sln`, `SDD/Docs/README.md` 2.9 §1–§7, `SDD/Docs/00-Contexto/Roadmap-Producto.md`
> 1.16 §2 y §5.2, el `Mini-Plan.md` de `GeometriaFactory-Api` 3.8 §3.6 y §9.1, el historial de git
> y los conteos con `git ls-files`.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. El producto en cinco renglones

En la Actividad 1 de Programación 2 el alumno escribe un programa que modela figuras planas y
volumétricas y las describe en un texto JSON. **Fábrica de Geometría cierra la cadena dentro de un
producto**: el alumno se registra «sin correo» —sin que medie ningún envío—, carga su trabajo, lo envía, lo ve
interpretado con sus advertencias y lo mira en tres dimensiones; el docente habilita cuentas,
revisa lo que la comisión entregó y deja su desenlace (`SDD/Docs/README.md` §1, `AGENTS.md`).

Lo que el producto vuelve visible es el **error de fórmula**: el valor que el programa del alumno
declara junto al valor que el producto deriva de las dimensiones. Ese par es la observación y el
motivo de existir del producto.

**Las personas siguen siendo dos** —el administrador (el docente) y el usuario (el alumno)—, pero
**desde el 2026-09-12 la API se ofrece también a aplicaciones propias además del front**, que
actúan en nombre de esas mismas personas: «no hay clientes de terceros» fue cierto hasta el intake
4.2 (`SDD/Docs/README.md` §1; `Api ADR-00009`, la API autentica personas y no aplicaciones). Por eso
la superficie pública se versiona en la ruta, `/v{MAJOR}/` (`Api ADR-00010`). Lo que no cambió: una
instancia, un curso, un administrador y sin escalera de ambientes.

## 2. Ficha

| Campo | Valor |
| --- | --- |
| Producto | **Fábrica de Geometría** — la cátedra lo llama «el laboratorio» |
| Repositorio indexado | `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión `4b114d7` (2026-09-15, fusión del PR #233), **etiquetada `v1.2.0`** |
| Repositorio de esta base | `PROG2/Geometria/Lab-Geometria.Documentacion` |
| Tipo | Laboratorio de cátedra, **público de consulta** (`README.md`): **2 unidades de entrega** sobre **7 proyectos de código** |
| Marco documental | Framework **SDD**, procedencia **13.16** desde la migración del 2026-09-13 (`SDD/Docs/README.md` §7.1); vive en `IA/IA.SDD` y no se copia acá |
| Product Owner | El docente de Programación 2 |
| Fusión de PR | **La hace el agente** con los checks en verde y sin reserva; con reserva entrega el enlace y espera (`AGENTS.md`, «Límites»: decisión del 2026-08-31, reafirmada el 2026-09-14) |
| Despliegue real | Contenedores `lab-geometria-api` y `lab-geometria-web` del Product Owner, publicados por túnel bajo dominio propio (`AGENTS.md`; `Roadmap-Producto.md` §2.1 fila `i`) |

### 2.1 Stack, con las versiones ancladas

| Pieza | Versión | Dónde consta |
| --- | --- | --- |
| Plataforma | **.NET 10** (`net10.0`), `LangVersion latest`, `Nullable`, `InvariantGlobalization`, `TreatWarningsAsErrors` | `Directory.Build.props` |
| Versión del producto | **MinVer 8.0.0**, prefijo `v`; sin etiqueta calcula `<siguiente>-alpha.0.<altura>` | `Directory.Build.props` |
| Servicio de datos | ASP.NET Core (`Microsoft.NET.Sdk.Web`), `JwtBearer` 10.0.11, `OpenApi` 10.0.11, **Scalar.AspNetCore 2.16.20** | `src/GeometriaFactory.Api/*.csproj` |
| Persistencia | **EF Core 10.0.11 sobre SQLite** | `src/GeometriaFactory.Infrastructure/*.csproj` |
| Firma del acceso | `Microsoft.IdentityModel.JsonWebTokens` 8.22.0 | ídem |
| Front | **Blazor Interactive Server** (`Microsoft.NET.Sdk.Web`), **sin MudBlazor**: el `.csproj` declara el apartamiento de no introducirlo | `src/GeometriaFactory.Web/GeometriaFactory.Web.csproj` l.9–17 |
| Visor | **TypeScript 5.6.3 + webpack 5.95.0 + three.js 0.169.0**; el bundle lo genera el target `BuildVisor` del `.csproj` del front | `visor/package.json`; `GeometriaFactory.Web.csproj` l.77 |
| Pruebas | xUnit 2.9.2 (Domain, Application, Integration) · NUnit 4.2.2 + **Playwright 1.49.0** (E2E) · coverlet 6.0.4 | `tests/*/*.csproj` |
| Imágenes | `dotnet/sdk:10.0` → `dotnet/aspnet:10.0`; el front suma una etapa `node:22`; las dos corren como `USER $APP_UID` | `deploy/Dockerfile`, `deploy/Dockerfile.web` |

## 3. Los dos ejes, que no coinciden

El producto se lee sobre dos ejes distintos —qué se despliega y qué se compila— y confundirlos es
el defecto que el modelo existe para hacer imposible (`SDD/Docs/README.md` §2).

### 3.1 Eje de entrega — qué se despliega

| Unidad de entrega | Tipo | Rol | Dónde corre hoy |
| --- | --- | --- | --- |
| `GeometriaFactory-Api` (**principal**) | `rest-api` | Contrato REST bajo `/v1/`, credencial firmada, preparación del almacén; sostiene el dato, las reglas y la única base | Contenedor en el servidor propio (`deploy/Dockerfile`) |
| `GeometriaFactory-Web` | `web-monolith` | Front; **único punto de contacto del navegador** | Contenedor en el servidor propio (`deploy/Dockerfile.web`). El canal FTP se conserva **como alternativa documentada y antecedente, no como canal vigente** (`Roadmap-Producto.md` §2.1 fila `i`); `deploy-front-ftp.yml` sólo se dispara a mano (`workflow_dispatch`) |

Ninguna es `redistribuible`. Entre ellas, **HTTP servidor a servidor** con credencial firmada. El
detalle de imágenes, composición y publicación está en
[`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md).

### 3.2 Eje de construcción — qué se compila

Los siete proyectos de código, su grafo y su orden están en
[`02_Arquitectura-Y-Proyectos.md`](02_Arquitectura-Y-Proyectos.md). Constancia que gobierna lo
demás: **un proyecto de código no se entrega, se compila**. Lo nuevo desde la 3.0: **todo cuelga del
árbol de solución**, por decisión `DC-5` del Product Owner del 2026-09-11 —el visor como nodo sin
construcción, los veinte samples y la batería E2E— y `scripts/verify-solution-tree.sh` lo vigila en
CI (`changelog.md`, entradas del 2026-09-12 y del 2026-09-13).

### 3.3 Las tres reglas de arquitectura de nivel producto

Vienen del intake (§14, `PRODUCT-INTAKE` l.579–581); ninguna ADR las decide.

| Regla | Enunciado | Qué cambió con la API pública |
| --- | --- | --- |
| `RA-01` | Ningún guion del navegador invoca el servicio de datos | **Sigue vigente para el front** tras `E-02` [DECISIÓN 2026-09-12]; la exposición pública es hacia otras aplicaciones propias. CORS no aplica hoy: ningún cliente propio es JavaScript de navegador desde otro origen (`changelog.md`, «CORS no aplica hoy») |
| `RA-02` | El bundle del visor es un **visualizador puro**: sin red, sin configuración, sin identidad | Nada |
| `RA-03` | Todo lo que el navegador obtiene del backend pasa por el front, y ningún mensaje expone la dirección de un servicio interno | Nada |

## 4. Estado de la construcción

**Ocho etapas comprometidas cerradas (`a`–`h`), la `i` realizada y abierta, la `k` cerrada**, y
`j…` sin especificar (`SDD/Docs/README.md` §7.2; `Roadmap-Producto.md` §2.1).

| Etapa | Qué entregó | Estado |
| --- | --- | --- |
| `a` · Andamiaje | Esqueleto ambulante de las dos piezas, con `PT-01` y `PT-04` medidas | Cerrada |
| `b` · Cáscara pública | Las once superficies alcanzables y el sistema visual portado | Cerrada |
| `c` · Administrador | Alta inicial, sesión y cambio de contraseña, persistidos | Cerrada |
| `d` · Cuenta del alumno | Registro, habilitación con provisoria, primer ingreso y reseteo | Cerrada |
| `e` · Trabajos | Alta, listado, reedición, eliminación y listado de la comisión | Cerrada |
| `f` · Importación y validación | Interpretación del texto, batería obligatoria de **diez** casos, envío como única acción de guardado | Cerrada |
| `g` · Visualización 3D | Piezas reconstruidas en escena y árbol del texto | Cerrada |
| `h` · Revisión | Aprobación y rechazo con comentario; el desenlace visible para el alumno | Cerrada. **Cierra el alcance comprometido** |
| `i` · Despliegue real | **Realizado desde el 2026-09-06 y no cerrado**: le faltan criterios de la transición `i` → `j…` | **Abierta** (§4.1) |
| `j…` · Agregados | `F-15`, `F-16`, `F-17`; ninguna especificada | Sin planificar: depende del cierre de `i` |
| `k` · API pública y versionado | Contrato bajo `/v1/`, MinVer, límite de tasa, OpenAPI y Scalar publicados, sample de onboarding, política de deprecación | **Cerrada**, OK explícito del Product Owner del 2026-09-13 («tenés el ok de la fase K») |

### 4.1 La fase `i`, criterio por criterio

**Ya no es «planificada y no ejecutada», como decía la 3.0**: el despliegue corre desde el
2026-09-06 y desde el 2026-09-14 tiene plan ejecutable (`Mini-Plan.md` de Api §3.6, por `R-17` de
`SDD/Docs/Audit/Mesa-2026-09-14.md`). Estado de los seis criterios de `Roadmap-Producto.md` §5.2,
tal como lo asientan §3.6 y la bitácora §9.1 del `Mini-Plan.md` (3.8, 2026-09-15):

| # | Criterio | Estado asentado | Qué falta | Quién |
| --- | --- | --- | --- | --- |
| 1 | Contenedores desde su composición, imágenes selladas, túnel, dominio; publicación reproducible | Hecho; **constancia de tres corridas** del 2026-09-14 (`cc024c5`, `8d8c857`, `2c34070`), por `Mesa-2026-09-15.md` D-6 | Nada | — |
| 2 | Servidor a servidor; el navegador no llega al servicio de datos | Hecho: `I-2` pasa | Nada | — |
| 3 | **`PT-05` medida desde la red de la facultad**, con un alumno de verdad | **SIN MEDIR** (`Audit/Medicion-PT-05.md` 1.5). Umbral fijado por mesa delegada: **≤ 5 s** a la primera pantalla; 5–10 s «con reservas»; > 10 s «no funciona» | **La visita** | PO + un alumno |
| 4 | Circuito completo sobre el despliegue real | No presenciado | La misma visita (receta de `Medicion-PT-05.md` §2.1) | PO + un alumno |
| 5 | Esquema aplicado solo, con prueba sobre datos existentes | Hecho: `I-5` pasa; `CredentialChangedAtMigrationTests` | Nada | — |
| 6 | Puertas `c` a `h` siguen pasando sin corregir el producto | Hecho: `d`, `e`, `h` en CI; `c`, `f`, `g` corridas el 2026-09-14 sobre `b240143`, CONFORME | Nada | — |

**La puerta `scripts/verify-stage-i.sh` se reescribió el 2026-09-14 (PR #226)**: mide estos
criterios y queda NO CONFORME mientras `Medicion-PT-05.md` diga `SIN MEDIR` (l.289–290: `bad` suma
una falla); sale INCOMPLETA sólo si nada falla y alguna puerta anterior quedó sin medir por falta de
`dotnet` o `docker` (l.243–244, l.306). **El punto de control es el OK del PO sobre los seis.**
Lo que falta no lo puede producir ningún agente: es la visita a la facultad
(`Mesa-2026-09-15.md` §4).

### 4.2 Qué pasó entre la 3.0 (`89f3ab3`) y esta revisión

**204 commits** entre el 2026-09-12 y el 2026-09-15 —96 el 12, 37 el 13, 69 el 14 y 2 el 15; de ellos
143 sin fusión: 85, 27, 30 y 1— y **428 archivos tocados** (`git diff --stat 89f3ab3..4b114d7`). Cuatro tramos:

| Tramo | PR | Qué dejó |
| --- | --- | --- |
| Estructura de la solución | #187, #203 | Bundle generado por el `.csproj` (`Web ADR-10008`); la solución pasa de 9 a 20 y de 20 a **31** proyectos |
| Fase `k` | #189–#202, #204 | `ADR-00009` (personas, no aplicaciones), `ADR-00010` (`/v{MAJOR}/`), MinVer, `/v1/` (BREAKING), CORS declarado, límite de tasa, sample `api/04-cliente-http-basico`, deprecación por un cuatrimestre (`Estrategia-Versionado.md` §6.b); fix del canje por cuenta (`ADR-00011`, PR #204). El #188 es una reanudación (`reanudacion/7-2026-09-12`) |
| Migración normativa SDD 13.7 → 13.16 | #205, #206 | Intake 5.0, manifiesto 7.0/7.1, primer expediente `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/`; retiro de `evidencia/` de la raíz (#207) |
| Mesas del 2026-09-14 y del 2026-09-15, lotes 0–2 | #209–#233 | Seguridad (admisión en cada petición, revocación por cambio de contraseña, origen real detrás del front `Web ADR-10009`, dominios admitidos `Api ADR-00012`, cabeceras de seguridad), imágenes sin root, OpenAPI con `Bearer`, puertas que no quedan en verde sin correr, `QG-06` con instrumento, plan ejecutable de `i`, aviso de datos personales, Ley 25.326 en el intake 5.1 |

### 4.3 Etiquetas y lo que corre

| Etiqueta | Commit | Nota |
| --- | --- | --- |
| `v0.1.0` · `v0.2.0` · `v0.5.0` · `v0.7.0` · `v0.8.0` | `760effd` · `cf085fe` · `718ce74` · `aaccd35` · `8ec80a4` | Las cinco repuestas el 2026-08-18 |
| **`v1.0.0`** | `8e5e2f9` (PR #195) | Primera fusión con el contrato bajo `/v1/`; salida de `0.x` |
| `v1.1.0` · `v1.1.1` · `v1.1.2` | `1748503` · `b58dec3` · `b9675d8` | Límite de tasa (#198) · samples bajo la solución, DC-5 (#203) · canje por cuenta, `ADR-00011` (#204) |
| **`v1.2.0`** | **`4b114d7`** (PR #233) | Desde la mesa del 2026-09-15 (D-5) **se etiqueta el commit antes de desplegarlo** |

Contado con `git tag -l` (diez etiquetas). **La etiqueta es manual**: la crea quien fusiona código de
producción, con el número que MinVer imprime (`PD-VER-01`, `changelog.md` 2026-09-13). **Qué versión
corre hoy en producción no se verificó para esta base**: la informa `/salud` y no el repositorio; la
última constancia escrita es `1.1.3-alpha.0.18` el 2026-09-14 (`changelog.md`, «La puerta de `i` mide
el despliegue que existe»).

## 5. Magnitudes, contadas sobre el instrumento

Cada fila se contó el **2026-10-26 sobre `4b114d7`**, sobre lo versionado (`git ls-files`). La
columna «3.0» es el valor que publicaba la base anterior sobre `89f3ab3`, para ver el salto. Donde el
corpus declara otro número, la divergencia va al índice 12 y **no se resuelve acá**.

### 5.1 El repositorio

| Carpeta | Archivos versionados | 3.0 (recontado sobre `89f3ab3`) |
| --- | ---: | ---: |
| **Total** | **1.888** | 1.709 |
| `SDD/` | 1.329 | 1.147 |
| `samples/` | 238 | 218 |
| `src/` | 182 | 172 |
| `tests/` | 63 | 55 |
| `scripts/` | 27 | 26 |
| `visor/` | 15 | 14 |
| `tools/` | 13 | 13 |
| raíz | 10 | 10 |
| `deploy/` | 4 | 4 |
| `.github/` | 3 | 3 |
| `evidencia/` | **0** — retirada el 2026-09-13 (PR #207); se cita como `git show 3662bf9^:evidencia/…` | 43 |

### 5.2 El corpus `SDD/`

| Parte | Archivos |
| --- | ---: |
| **Vivo** (sin `_legacy/`) | **650** de 1.329 — en la 3.0, 542 de 1.147 |
| `_legacy/` | 679 (todo el `_legacy/` del repositorio está bajo `SDD/`) |
| `SDD/Docs/` vivo | 577 |
| `SDD/Expedientes/` | 53 — un expediente, `0001-Migracion-Normativa-A-13.16` |
| `SDD/Maquetas/` | 17 (sólo se cuentan) |
| `SDD/Intake/` | 2 — `PRODUCT-INTAKE` **5.1** y `PRODUCT-MANIFEST` **7.1** |

### 5.3 Producto y contrato

| Magnitud | Cantidad | Contada sobre |
| --- | --- | --- |
| Proyectos de código | 7 | `SDD/Docs/README.md` §2.2 y el árbol |
| Proyectos en la solución | **31** (3.0: 9) — 6 de `src/`, 4 de `tests/` (E2E incluida), el nodo del visor y 20 samples; **12 son nodos sin construcción** `Microsoft.Build.NoTargets/3.7.56` (el visor y once samples) | `GeometriaFactory.sln` y la primera línea de cada `.csproj` |
| Aristas de compilación | **8** — 7 `ProjectReference` + 1 insumo de construcción (`Visor → Web`, target `BuildVisor`) | Los `.csproj` de `src/` |
| Operaciones HTTP | **17** (16 bajo `/v1/` + `/salud`), sobre **13 rutas distintas**; más 2 rutas exentas de documentación (`/openapi/v1.json`, `/documentacion`) | Llamadas `Map{Get,Post,Delete}` de `src/GeometriaFactory.Api/Endpoints/`; `ContractRoutePrefix.ExemptRoutes` |
| Constantes de código del contrato | **16** (3.0: 15; entra `EMAIL_DOMAIN_NOT_ADMITTED`) | `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs` |
| Códigos de condición | 37 | `src/GeometriaFactory.Domain/Values/ConditionCode.cs` |
| Transformaciones de esquema | **5** (la quinta, `CredentialChangedAt`, es la primera aplicada sobre datos) | `src/GeometriaFactory.Infrastructure/Persistence/Migrations/` |
| Páginas del front | 15 rutas `@page` sobre 14 componentes con ruta, de los 15 `.razor` de la carpeta (`WorkSubmission` lleva dos; `NotFoundSurface`, ninguna) | `src/GeometriaFactory.Web/Components/Pages/` |
| Funciones de la fachada del visor | 6 (+1 de verificación, `liveInstanceCount`) | `export function` de `visor/src/main.ts` |
| Reglas de negocio | 16, `RN-02001` a `RN-02016` | `Api/02-Especificacion-Funcional/Reglas-De-Negocio/` |
| Invariantes del dominio | 9, `INV-01` a `INV-09` | `PRODUCT-INTAKE` |
| Escenarios de datos | 8, `E-1` a `E-8` | `PRODUCT-INTAKE` §20 |
| ADR vivas | **59** (3.0: 53) — Producto 13, `Api` **31**, `Web` **15** | Archivos `ADR-*` de los `Adrs/` vivos |
| Casos de uso | 48 — `Api` 23, `Web` 17, Producto 8 | `CU-*.md` vivos |
| Historias de usuario | 144 — `Api` 114, `Web` 30 | `06-Backlog-Tecnico/historias-usuario/` vivos |
| Archivos de auditoría | **120**: 103 informes `.md` y 17 registros `.json` (3.0: 107 = 90 + 17) | `SDD/Docs/Audit/` sin `_legacy/` |
| Eventualidades del entorno | 8, `EVE-00001` a `EVE-00008` | `Producto/11-Documentacion/Bitacora-Eventualidades.md` |

### 5.4 Pruebas, samples e instrumentos

| Magnitud | Cantidad | Contada sobre |
| --- | --- | --- |
| Baterías | 4 — Domain, Application, Integration y E2E; las cuatro en la solución, la E2E **sin construirse con ella** y corrida por `scripts/pruebas-e2e.sh` | `tests/`, `AGENTS.md` |
| Métodos de prueba anotados | **389** (3.0: 344) — Domain 67, Application 54, Integration 240 (`[Fact]`/`[Theory]`), E2E 28 `[Test]` (uno de ellos con `[TestCaseSource]`) | Atributos en los `.cs` versionados de `tests/` |
| Casos ejecutados | Último recuento total escrito: Domain 94, Application 56, Integration 411 (`changelog.md`, entrada del OpenAPI, 2026-09-14); E2E 32/32 | **No verificado**: no se corrió la suite, y las pruebas posteriores (`FigureTextReadingTests`, `SecurityHeadersTests`) no tienen recuento total escrito |
| Samples | **20** directorios en 7 capas (3.0: 19); **17 con código**, 3 sólo `README` + nodo (`contracts/0N`) | `samples/` |
| Guiones | 27 (suma `verify-solution-tree.sh`), de ellos 7 puertas de etapa `verify-stage-{c..i}.sh` | `scripts/` |
| Herramientas | 13 | `tools/` |
| Flujos de CI | 3 — `ci.yml`, `e2e.yml`, `deploy-front-ftp.yml` (manual) | `.github/workflows/` |
| Dockerfiles | 3 — servicio de datos, front y la imagen del banco E2E (`deploy/e2e/Dockerfile`, Playwright 1.49.0); más `deploy/compose.yaml`, **de verificación y no de despliegue** | `deploy/` |

## 6. Decisiones clave, en una línea cada una

| Decisión | Fuente |
| --- | --- |
| La API autentica **personas** (administrador y usuario); no hay claves de API ni `client_credentials` | `Api ADR-00009` |
| El contrato se versiona en la ruta, **sólo el `MAJOR`**, y ese `MAJOR` es el del producto; `/salud` y la documentación quedan fuera | `Api ADR-00010`; `ContractRoutePrefix.cs` |
| `ADR-00008` queda **superado parcialmente**: cae la regla de una sola versión viva; subsiste el despliegue conjunto `Api`/`Web` | `changelog.md`, 2026-09-12 |
| La versión la calcula MinVer desde etiquetas `v*`; la etiqueta es manual y se pone antes de desplegar | `Directory.Build.props`; `Estrategia-Versionado.md`; `Mesa-2026-09-15.md` D-5 |
| Un `MAJOR` viejo convive **un cuatrimestre** con `Deprecation` y `Sunset`, y al vencer responde `410` | `Estrategia-Versionado.md` 6.0 §6.b |
| El límite de tasa es por persona autenticada o por origen; la defensa del canje es **por cuenta** | `Api ADR-00011`; `appsettings.json` del servicio |
| El front reenvía al servicio la dirección real del navegador, sólo desde redes declaradas | `Web ADR-10009` |
| El autorregistro admite los dominios que el despliegue declara; **sin la llave, cualquiera**, y en producción no se declaró | `Api ADR-00012`; `Mesa-2026-09-15.md` `DD-R10-1` |
| El bundle del visor lo genera y sella el `.csproj` del front, con un solo generador | `Web ADR-10008` |
| Todo proyecto y sample bajo el árbol de solución, vigilado por una puerta | `DC-5`; `scripts/verify-solution-tree.sh` |
| Las imágenes corren sin root (uid 1654) | `deploy/Dockerfile*`; `changelog.md` 2026-09-14 |

El registro completo de decisiones, mesas y auditorías está en
[`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).

## 7. Lo que queda abierto, de nivel producto

| Punto | Quién lo cierra |
| --- | --- |
| **`PT-05` sin medir y el circuito no presenciado** (criterios 3 y 4 de `i`) | El PO, con la visita a la facultad y un alumno |
| **El caudal de 20 peticiones por minuto sigue provisorio** —es el único umbral de `A-5` abierto— y los topes por origen se ajustan después de `PT-05` (`R-04`, `DD-R9-6`) | `PT-05`, midiendo |
| El dominio admitido del autorregistro no está declarado en producción (`DD-R10-1`) | El PO, o la llegada del alta por el docente |
| CSP sin `script-src`/`style-src` con `nonce` (`DD-R10-2`) y `Pipeline-CI-CD.md` sin los pasos nuevos de `ci.yml` (`DD-R10-3`) | El agente, en su evento de cierre |
| 129 cabeceras «Trazabilidad upstream» que citan versión del intake o del manifiesto (`DD-8` de `Mesa-2026-09-13.md`: 116, ampliadas a 129 por `Mesa-2026-09-13-ciclo-2.md`) | Ofrecidas al PO; sin fecha |
| Ajustes de GitHub (forks, runner) y rotación de credenciales del recorrido desplegado | El PO (`changelog.md`, 2026-09-14, lote 0) |

**Resuelto respecto de la 3.0**: la imagen del front ya tiene entrada en `changelog.md` («Dockerizar
el front», repuesta el 2026-09-12) y la vía vigente está decidida —contenedores; FTP como
alternativa—. El detalle y la trazabilidad están en
[`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).

## 8. Las seis cosas que más cuestan si no se saben

1. **En desarrollo el servicio escucha en 5080**, no en 8080: lo fija `Kestrel` en
   `appsettings.Development.json`, que gana sobre `ASPNETCORE_URLS` (`EVE-00001`). **La imagen escucha
   en 8080** (`deploy/Dockerfile` l.68 y l.108).
2. **`ConnectionStrings__Store` es obligatoria**: sin ella el servicio no arranca, a propósito; en
   desarrollo la calcula `scripts/store-path.sh` (`appsettings.json`, `_ConnectionStrings_Store`).
3. **Sin `AccessToken__SigningKey` de 32 bytes o más el servicio se niega a arrancar** y nombra la
   llave, no el valor (`CompositionRoot.cs` l.149–179). La 3.0 lo describía mal: la guardia está desde `39b0f61` (2026-08-15), igual en `89f3ab3`.
4. **`lab-geometria-web` y `lab-geometria-api` son el despliegue real del PO**: ni `exec`, ni reinicio,
   ni lectura de volúmenes. Un servicio de prueba se levanta aparte, puerto libre y almacén propio
   (`AGENTS.md`). Los `gf-*` que nombraba la 3.0 ya no corren.
5. **Un volumen con archivos de root no arranca la imagen nueva** (código 78, base de sólo lectura):
   antes del primer despliegue sin root, `chown -R 1654:1654` sobre el volumen (`changelog.md`,
   «Las dos imágenes dejan de correr como root»).
6. **`TreatWarningsAsErrors` está puesto** (`QG-01`), y **`dotnet test` con un filtro sin
   coincidencias sale 0**: las puertas lo cubren con `puerta_no_corrieron` de `scripts/lib-puerta.sh`.

## 9. Qué índice responde qué

| Si necesitás… | Abrí |
| --- | --- |
| Dónde vive cada documento del corpus `SDD/`, qué autoridad tiene y qué es `_legacy/` y `Expedientes/` | [`01_Corpus-Documental-SDD.md`](01_Corpus-Documental-SDD.md) |
| Los siete proyectos, sus capas, el grafo, los 31 de la solución y los transversales | [`02_Arquitectura-Y-Proyectos.md`](02_Arquitectura-Y-Proyectos.md) |
| Entidades, conjuntos cerrados, invariantes, reglas de negocio y derivación de valores | [`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md) |
| Rutas `/v1/`, tipos, códigos, límite de tasa, OpenAPI y deprecación | [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md) |
| Pantallas, guardianes, sistema visual, sello de versión y fachada del visor | [`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md) |
| Almacén, transformaciones, respaldo, firma del acceso, revocación y cabeceras de seguridad | [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) |
| Las cuatro baterías, las puertas `QG-*` y `verify-stage-*`, umbrales e instrumentos | [`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) |
| Guiones, imágenes, flujos de CI, MinVer, etiquetas y publicación real | [`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) |
| Los veinte samples y qué muestra cada uno | [`09_Samples-Ejecutables.md`](09_Samples-Ejecutables.md) |
| Cómo se nombra algo y qué significa cada término | [`10_Glosario-Y-Nomenclatura.md`](10_Glosario-Y-Nomenclatura.md) |
| ADR, auditorías, mesas, deudas `DD-*` y lo que queda abierto | [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md) |
| Qué se verificó al construir esta base y qué divergencias quedaron a la vista | [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) |

**El avance vivo lo declara `changelog.md`** —y cuando no coincide con el historial, **gana el
historial** (`changelog.md` l.8)—; esta base publica su resultado al 2026-10-26 y no lo replica.
