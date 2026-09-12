# 00 · Índice maestro — qué es la Fábrica de Geometría y en qué estado está

> **Propósito.** Dar en una sola lectura el producto, su stack, su composición y su estado de
> avance, para que un agente pueda ubicarse sin abrir el repositorio.
> **Fuente primaria.** `SDD/Docs/README.md` 2.5, `SDD/Docs/Producto/Vista-Producto.md` 1.9,
> `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md`, `changelog.md`, el historial de git y el
> árbol de código en la revisión `89f3ab3`.

---

## 1. El producto en cinco renglones

En la Actividad 1 de Programación 2 el alumno escribe un programa que modela figuras planas y
volumétricas y las describe en un texto. Hoy ese texto se pega en una página suelta y se mira: no
hay identidad, no hay persistencia y no hay entrega. **Fábrica de Geometría cierra esa cadena
dentro de un producto**: el alumno se registra sin correo institucional, carga su trabajo, lo
envía, lo ve interpretado con sus advertencias y lo mira en tres dimensiones sin salir de la
aplicación; el docente habilita cuentas, revisa lo que la comisión entregó y deja su desenlace.

Lo que el producto vuelve visible, y que hoy pasa desapercibido, es el **error de fórmula**: el
valor que el programa del alumno declara junto al valor que el producto deriva de las dimensiones.
El par es la observación, y es el motivo de existir del producto
(`SDD/Docs/README.md` §1, `00-Contexto/Vision-Producto.md`).

**La audiencia son dos personas del aula** —el alumno de la comisión y el docente—. No hay
integradores externos, no hay auditoría, no hay clientes de terceros. Esa audiencia acotada
explica casi todas las decisiones técnicas: una instancia, un curso, un administrador, sin
versionado de rutas y sin escalera de ambientes.

## 2. Ficha

| Campo | Valor |
| --- | --- |
| Producto | **Fábrica de Geometría** — la cátedra lo llama «el laboratorio» |
| Repositorio indexado | `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión `89f3ab3` (2026-09-06, fusión del PR #186) |
| Repositorio de esta base | `PROG2/Geometria/Lab-Geometria.Documentacion` |
| Tipo | Laboratorio de cátedra: **2 unidades de entrega** sobre **7 proyectos de código** |
| Stack | C# sobre **.NET 10** · ASP.NET Core en el servicio de datos · **Blazor Interactive Server** en el front · **EF Core 10.0.11 sobre SQLite** · **TypeScript 5.6 + webpack 5.95 + three.js 0.169** en el visor |
| Marco documental | Framework **SDD**, que vive en `IA/IA.SDD` y no se copia acá |
| Product Owner | El docente de Programación 2. **Fusionar un PR y borrar su rama son suyos** |

## 3. Los dos ejes, que no coinciden

El producto se lee sobre dos ejes distintos, y confundirlos es el defecto que el modelo existe
para hacer imposible (`SDD/Docs/README.md` §2).

### 3.1 Eje de entrega — qué se despliega

| Unidad de entrega | Tipo | Rol | Dónde corre |
| --- | --- | --- | --- |
| `GeometriaFactory-Api` (**principal**) | `rest-api` | Puntos de acceso, credencial firmada, preparación del almacén. Sostiene el dato, las reglas y la única base | Contenedor Linux en el servidor propio (`deploy/Dockerfile`) |
| `GeometriaFactory-Web` | `web-monolith` | Front público; **único punto de contacto del navegador** | Hosting público gratuito por FTP (`deploy-front-ftp.yml`) y, desde el 2026-09-06, **también como imagen de contenedor** (`deploy/Dockerfile.web`) |

Ninguna de las dos es `redistribuible`. La integración entre ellas es **HTTP servidor a servidor**,
con credencial firmada.

### 3.2 Eje de construcción — qué se compila

Los siete proyectos de código, su grafo y su orden topológico están en
[`02_Arquitectura-Y-Proyectos.md`](02_Arquitectura-Y-Proyectos.md). Aquí sólo la constancia que
gobierna todo lo demás: **un proyecto de código no se entrega, se compila**, y los atributos «tipo
D8» y `redistribuible` son de la unidad de entrega y de nada más.

### 3.3 Las tres reglas de arquitectura de nivel producto

Vienen del intake §14, **no las decide ninguna ADR: las recibe**.

| Regla | Enunciado | Dónde tiene mecanismo |
| --- | --- | --- |
| `RA-01` | Ningún guion del navegador invoca el servicio de datos | Render en el servidor (`Web ADR-10001`); `Contratos-REST.md` §1 declara las tres ausencias que se derivan |
| `RA-02` | El bundle del visor es un **visualizador puro**: sin red, sin configuración, sin identidad | `Visor ADR-12003`, con puerta medida **sobre el bundle generado** y no sobre el fuente |
| `RA-03` | Todo lo que el navegador obtiene del backend pasa por el front, y ningún mensaje expone la dirección de un servicio interno | `Api ADR-00004` §2 y `DX-Error-Messages.md` §1.4 |

## 4. Estado de la construcción

Nueve etapas, `a` a `i`. **Ocho cerradas; la `i` está planificada y no ejecutada**
(`SDD/Docs/README.md` §7.2, `00-Contexto/Roadmap-Producto.md`).

| Etapa | Qué entregó | Estado |
| --- | --- | --- |
| `a` · Andamiaje | Esqueleto ambulante de las dos piezas, con `PT-01` y `PT-04` medidas | Cerrada |
| `b` · Cáscara pública | Las once superficies alcanzables y el sistema visual portado | Cerrada |
| `c` · Administrador | Identidad del administrador, sesión y cambio de contraseña, persistidos | Cerrada |
| `d` · Cuenta del alumno | Registro, habilitación con provisoria, primer ingreso y reseteo | Cerrada |
| `e` · Trabajos | Alta, listado, reedición, eliminación y listado de la comisión | Cerrada |
| `f` · Importación y validación | Interpretación del texto, batería obligatoria de **diez** casos, envío como única acción de guardado | Cerrada |
| `g` · Visualización 3D | Dibujo de las piezas reconstruidas y árbol del texto | Cerrada |
| `h` · Revisión | Aprobación y rechazo con comentario, y el desenlace visible para el alumno | Cerrada |
| `i` · Despliegue real | **Su puerta está escrita y la fase no ocurrió**: `scripts/verify-stage-i.sh` con siete criterios y `Audit/Medicion-PT-05.md` en `SIN MEDIR` | Planificada |

**Después de la etapa `h` el trabajo siguió sin abrir la `i`.** Entre el 2026-09-01 y el
2026-09-03 entraron el circuito de revisión reparado, la cuarta batería de pruebas —extremo a
extremo— y dos mesas de UX/UI; la última entrada de `changelog.md` es **«Lo que la segunda mesa
de UX/UI midió y reparó — 2026-09-03»**. **El 2026-09-06 se fusionó el PR #186 «Dockerizar el
front»**, que agrega `deploy/Dockerfile.web` —una imagen multietapa del front que resuelve
`ApiBaseUrl` por variable de entorno y retira los dos costos de la publicación por FTP—.
**Ese commit no tiene entrada en `changelog.md` ni en el corpus `SDD/`**: el historial de git es
la única fuente que lo registra (ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) O-9). El avance vivo lo
declara `changelog.md`; esta base publica su resultado y no lo replica.

## 5. Magnitudes, contadas sobre el instrumento

Cada fila se contó el **2026-09-11** sobre la ruta que la produce, en la revisión `89f3ab3`.
Donde el corpus declara otro número, la divergencia está registrada en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) y **no se resolvió acá**.

| Magnitud | Cantidad | Contada sobre |
| --- | --- | --- |
| Proyectos de código | 7 | `PRODUCT-MANIFEST` §2 y el árbol |
| Proyectos en la solución | 9 (6 de `src/` + 3 de `tests/`) | `GeometriaFactory.sln` |
| Aristas de compilación | **8** — 7 referencias de proyecto + 1 activo de construcción (`Visor → Web`) | Los `ProjectReference` de los seis `.csproj` y `scripts/build-visor.sh` |
| Puntos de acceso HTTP | **17** operaciones sobre 14 rutas | Las llamadas `Map{Get,Post,Delete}` de `src/GeometriaFactory.Api/Endpoints/` |
| Códigos del contrato | **17 vivos** declarados sobre 20 emitidos; **15 constantes** en el ensamblado | `Contratos-REST.md` §5 · `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs` |
| Códigos de condición | **37** | `src/GeometriaFactory.Domain/Values/ConditionCode.cs` |
| Páginas del front | **15 rutas** `@page` sobre 15 componentes (uno de ellos, `WorkSubmission`, lleva dos rutas; `NotFoundSurface` no lleva ninguna y se alcanza por reejecución) | `src/GeometriaFactory.Web/Components/Pages/` |
| Funciones de la fachada del visor | 6 (+1 de verificación, `liveInstanceCount`) | Los `export function` de `visor/src/main.ts` |
| Reglas de negocio | 16, `RN-02001` a `RN-02016` | `Api/02/Reglas-De-Negocio/` |
| Invariantes del dominio | 9, `INV-01` a `INV-09` | `PRODUCT-INTAKE` §14 |
| ADR emitidas | **53** — Producto 13, `Api` 27, `Web` 13 | Los tres directorios `Adrs/`, sin `_legacy/` |
| Casos de uso | **48** — `Api` 23, `Web` 17, Producto 8 | Todos los `CU-*.md` vivos de `SDD/Docs/` |
| Historias de usuario | 144 — `Api` 114, `Web` 30 | `06-Backlog-Tecnico/historias-usuario/`, sin `_legacy/` |
| Informes de auditoría | 107 archivos | `SDD/Docs/Audit/` |
| Corpus SDD vivo | **542** archivos sobre 1.147 (el resto es `_legacy/`) | `find SDD -type f` |
| Baterías de prueba | 4 — 3 en la solución + la de extremo a extremo, fuera de ella | `tests/` |
| Métodos de prueba anotados | 345 — Domain 67, Application 51, Integration 198, E2E 29 (28 `[Test]` + 1 `[TestCaseSource]`) | Atributos en `tests/`, sin `bin/` |
| Samples | 19 directorios en 7 capas; **16 con código, 3 sólo README** | `samples/` |
| Escenarios de datos | 8, `E-1` a `E-8` | `PRODUCT-INTAKE` §20; los cuerpos viven en `samples/api/02-intermedio/cuerpos/` |
| Imágenes de contenedor | **2** — `deploy/Dockerfile` (servicio de datos) y `deploy/Dockerfile.web` (front) | `deploy/` |
| Eventualidades del entorno | 8, `EVE-00001` a `EVE-00008` | `Producto/11-Documentacion/Bitacora-Eventualidades.md` |

## 6. Lo que queda abierto, de nivel producto

| Punto | Quién lo cierra |
| --- | --- |
| **El caudal de 20 peticiones por minuto es provisorio y su fundamento ya no existe** —se derivaba de «una comisión operando durante una clase», y `D5` cerró por **incognoscible** el volumen de la comisión— | `PT-05`, en la fase `i`, midiendo |
| **`PT-05` sin medir**: si los alumnos alcanzan el laboratorio desde la red de la facultad | La fase `i` sobre el destino real |
| **Cuatro asuntos aparcados en la fase `i` que no la necesitan** | El Product Owner, cuando quiera (`Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md`) |
| Dos hallazgos de UX abiertos por la mesa del 2026-09-03 | Decisión de diseño, no ajuste fino |
| **La imagen del front existe y ninguna fuente documental la registra**; la publicación por FTP sigue activa en paralelo | El Product Owner: decidir cuál de las dos vías es la del despliegue y dejarlo escrito |

El detalle, con su trazabilidad, está en
[`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).

## 7. Las cinco cosas que más cuestan si no se saben

1. **El servicio escucha en 5080**, no en 8080: la configuración de Kestrel gana sobre
   `ASPNETCORE_URLS`. Publicar `-p <libre>:5080` (`EVE-00001`).
2. **`ConnectionStrings__Store` es obligatoria**: sin ella el servicio no arranca, a propósito.
   En desarrollo la calcula `scripts/store-path.sh`.
3. **Sin `AccessToken__SigningKey` de 32 bytes o más el ingreso falla**, y falla al usarlo.
4. **Los contenedores `gf-api`, `gf-web`, `gf-back` y `gf-tunnel` son del Product Owner.** Un
   servicio de prueba se levanta aparte, con puerto libre y almacén propio.
5. **`TreatWarningsAsErrors` está puesto**: una advertencia detiene la construcción (`QG-01`).

Las ocho eventualidades completas, con lo que se probó y no funcionó, están en
`SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md`.
