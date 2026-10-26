# 08 · DevOps — cómo se construye, se corre y se publica

> **Propósito.** Los guiones, las tres imágenes, los tres flujos de canalización, la publicación
> real tal como la describe el repositorio desde la mesa del 2026-09-14 (`R-13`) y la regla de
> etiquetar antes de desplegar.
> **Fuente primaria.** `scripts/`, `tools/`, `deploy/` (`Dockerfile`, `Dockerfile.web`,
> `compose.yaml`, `e2e/Dockerfile`), `.github/workflows/` (`ci.yml`, `deploy-front-ftp.yml`,
> `e2e.yml`), `Directory.Build.props`, `src/GeometriaFactory.Web/GeometriaFactory.Web.csproj`,
> `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Guia-Publicacion-Image-Docker.md` 1.5
> §2.2, `SDD/Docs/Producto/Pipeline-Producto.md` 1.9 y `changelog.md`.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. La regla que encabeza todo

**La configuración se declara siempre y en los dos lados —el que construye y el que ejecuta—
aunque el valor por omisión coincida** (`Pipeline-Producto.md` §3.1; encabezado de
`scripts/build.sh`). La coherencia por omisión no cuenta: el día que alguien agregue la
configuración de un solo lado, el otro sigue resolviendo `Debug` y se verifica una salida que nadie
construyó.

| Quién | Configuración | Por qué (fuente) |
| --- | --- | --- |
| `build.sh`, `test.sh`, las imágenes, los flujos | `Release` | Es lo que se verifica y se despliega (`scripts/test.sh` l.6–9) |
| `run-api.sh`, `run-web.sh`, `migrate.sh` | **`Debug` declarado** por omisión; `GF_CONFIGURATION=Release` si se pide la otra | Decisión del Product Owner: en desarrollo se trabaja en `Debug`. Construyen y levantan en la misma invocación, sin `--no-build` (`scripts/run-api.sh` l.13–18) |
| `verify-stage-c.sh`, `verify-navigation.sh` | `Release`, con `--no-build` | Miden lo que se despliega; **la asimetría es la decisión** y no se «corrige» por simetría (`scripts/run-web.sh` l.18–22) |
| `.vscode/tasks.json` y `launch.json` | `Debug` según `Pipeline-Producto.md` §3.1 | `.vscode/` queda fuera de este indexado: **no verificado** acá |

**Dos piezas sostienen la regla:**

- `scripts/assert-build-fresh.sh <csproj> <configuración>` es **la red debajo de todo
  `--no-build`**: construye en la configuración declarada y no vuelve con 0 salvo que la salida
  exista y esté al día. Usa la construcción incremental de MSBuild como oráculo; **la primera
  versión comparaba fechas y se descartó** por falsos positivos imposibles de limpiar con
  `Deterministic` (`scripts/assert-build-fresh.sh` l.12–40).
- `scripts/verify-explicit-configuration.sh` comprueba la regla sobre los archivos versionados de
  `scripts/*.sh`, `.github/workflows/*`, `deploy/Dockerfile`, `deploy/*.yaml`, `.vscode/*.json` y
  `.devcontainer/*.json`, con dos controles: **C-1** toda invocación declara su configuración;
  **C-2** todo `--no-build` va precedido de `assert-build-fresh.sh` (l.24–52). No necesita .NET.

> ⚠️ **Corrido sobre `4b114d7`, el guion da `NO CONFORME · 2 control(es) fallan`**: C-1 por
> `scripts/coverage.sh:51` (`dotnet run tools/informe-cobertura.cs` sin configuración) y C-2 por
> `.github/workflows/e2e.yml:111` (`--no-build` sin red). **No corre en `ci.yml`**, y su lista de
> objetivos **no incluye `deploy/Dockerfile.web`** (ver
> [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md)).

---

## 2. Construir

```bash
bash scripts/build.sh        # dotnet restore GeometriaFactory.sln → dotnet build -c Release --no-restore
bash scripts/build-visor.sh  # npm ci (npm install si falta el lock) → npm run build → cp dist/*.js{,.map} a wwwroot/js/
```

**Desde el 2026-09-12 el bundle del visor lo genera el `.csproj` del front, y es el único
generador** (`Web ADR-10008`; commit `6cc6f86`). `build.sh` **ya no encadena** `build-visor.sh`
(`scripts/build.sh` l.21–23). En `GeometriaFactory.Web.csproj`:

| Target | Qué hace | Fuente |
| --- | --- | --- |
| `BuildVisor` | `BeforeTargets="BeforeBuild"`; ejecuta `scripts/build-visor.sh` **sólo si cambió una fuente del visor** (`Inputs`: `visor/src/**/*.ts`, `package-lock.json`, `webpack.config.js`, `tsconfig.json`; `Outputs`: `wwwroot/js/geometriafactory-visor.js`). Se apaga con `-p:SkipVisorBuild=true`; sin la bandera y sin Node **falla** | `.csproj` l.54–81 (comentario y target) |
| `DeclareVisorAsset` | Después de `BuildVisor`, antes de `ResolveProjectStaticWebAssets`: declara el bundle (y su `.map`, sólo si existe: `Condition="Exists(…)"`, l.89) como `Content` **dentro del target**, para que entre al manifiesto de recursos estáticos en la misma invocación; `Exclude="@(Content)"` evita `NETSDK1022` | l.83–91 |
| `SealVisorAsset` | Antes de `CoreCompile`: escribe `obj/…/VisorSeal.g.cs` con los **12 primeros caracteres del SHA-256** del bundle, o `sin-bundle`; las páginas piden `js/geometriafactory-visor.js?v=<sello>` | l.102–119 |

`build-visor.sh` queda como **ciclo corto de trabajo sobre el visor**
(`Web/09-Devops/Guia-Publicacion-Bundle-Visor.md` l.58). Consecuencia: **construir la solución
necesita Node** (por eso `ci.yml` y `deploy-front-ftp.yml` anclan `node-version: '22'`), salvo con
`SkipVisorBuild=true`. Sin el modo y sin Node la construcción falla con `MSB3073`; con el modo y sin
bundle termina en verde: **las dos conductas están declaradas como deuda `DD-2`**
(`Pipeline-Producto.md` §4, fila `Visor → Web`).

**La puerta `QG-01` vive en `Directory.Build.props`**: `net10.0`, `TreatWarningsAsErrors`,
`AnalysisLevel` latest, `Deterministic`, `InvariantGlobalization`. Ahí entró también **MinVer 8.0.0**
(§9). El mismo archivo dice «los seis proyectos .NET» (l.5) y «los treinta y un proyectos de la
solución» (l.51); la solución tiene **31** proyectos (`grep '^Project(' GeometriaFactory.sln`, sin
carpetas de solución) y el árbol versiona **31** `.csproj`.

**Todo corre dentro del contenedor de desarrollo**: el anfitrión **no tiene el kit de desarrollo**,
por decisión de la etapa `a` (intake §10). Lo que cuesta tiempo está en
`SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md`:

| Eventualidad | Lección |
| --- | --- |
| `EVE-00002` | Correr contenedores con `-u "$(id -u):$(id -g)"` y `DOTNET_CLI_HOME`, **o quedan archivos de root en el árbol** |
| `EVE-00005` | La imagen del SDK **no trae** `jq`, `python3` ni `sqlite3`, y no se agregan |
| `EVE-00006` | Una aplicación de un solo archivo necesita `#:project` y **no puede usar `JsonSerializer` con reflexión** (`IL2026`/`IL3050` son error) |
| `EVE-00008` | Una batería en verde reportada como puerta en rojo |

---

## 3. Correr localmente

| Guion | Qué hace | Nota |
| --- | --- | --- |
| `scripts/run-api.sh` | Levanta el servicio de datos; arranca, aplica las transformaciones y la salud responde | **Sale con 1 si falta `AccessToken__SigningKey`**: la guardia de `CompositionRoot` no deja arrancar sin clave, y el guion lo dice antes (l.67–92) |
| `scripts/run-web.sh` | Levanta la pieza pública; `ApiBaseUrl` llega por configuración | Rotulado **[PROPUESTA SIN BASE DECLARADA]** (`Plan-Etapa-A.md` §4) |
| `scripts/store-path.sh` | **Se sourcea**: `gf_resolve_store` deja `GF_STORE_FILE` y exporta `ConnectionStrings__Store` | Precedencia: `GEOMETRIAFACTORY_STORE_FILE` → `ConnectionStrings__Store` → `${XDG_DATA_HOME:-$HOME/.local/share}/geometria-factory/geometriafactory.db` (l.106–129) |
| `scripts/reset-db.sh` | Deja el almacén en su primer arranque | **Pregunta** mostrando qué archivo y cuánto hay adentro; `--assume-yes` es bandera declarada, no variable (l.13–40) |
| `scripts/migrate.sh <Nombre>` | **Genera** una transformación con `dotnet ef` (herramienta local, `dotnet tool restore`). **No la aplica**: se aplican solas al arrancar | Rotulado **[PROPUESTA SIN BASE DECLARADA]** |
| `scripts/respaldo-almacen.sh` / `restaurar-almacen.sh` | Copia (`VACUUM INTO` + `integrity_check`) y restauración (aparta el anterior con sello), en modo local o `--desde-contenedor <servicio>` | Detalle en [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) |

**El almacén de desarrollo salió del árbol** tras el 2026-08-15, cuando una corrida de guiones se
llevó la cuenta de administrador del Product Owner (`scripts/store-path.sh` l.13–28).

**El servicio escucha en 5080, no en 8080** en el contenedor de desarrollo: la configuración de
Kestrel gana sobre `ASPNETCORE_URLS` (`EVE-00001`); el `appsettings.json` del front trae
`ApiBaseUrl: http://localhost:5080/`. **Los contenedores del Product Owner no se tocan**
(`EVE-00007` nombra los `gf-*`; desde `160770d` `AGENTS.md` protege `lab-geometria-web` y
`lab-geometria-api`, y el mensaje del commit dice que los `gf-*` «ya no corren»): un servicio de
prueba se levanta aparte, con puerto libre y almacén propio. `run-api.sh` l.29–49 documenta cómo relanzar `gf-back` montando el almacén en
`/datos`, el mismo nombre que usa la imagen.

---

## 4. Catálogo de `scripts/` y `tools/`

**27 archivos en `scripts/`** y **13 en `tools/`** (`git ls-files`). Entre 89f3ab3 y 4b114d7 entró
uno solo, `scripts/verify-solution-tree.sh`; ninguno se retiró (`git diff --name-status`).

| Familia | Archivos | Dónde se detalla |
| --- | --- | --- |
| Construcción y ejecución | `build.sh`, `build-visor.sh`, `test.sh`, `run-api.sh`, `run-web.sh`, `migrate.sh` | §2 y §3 |
| Almacén | `store-path.sh`, `reset-db.sh`, `respaldo-almacen.sh`, `restaurar-almacen.sh` | §3 y [`06`](06_Persistencia-Y-Seguridad.md) |
| Red de configuración | `assert-build-fresh.sh`, `verify-explicit-configuration.sh` | §1 |
| Puertas de etapa | `verify-stage-{c,d,e,f,g,h,i}.sh` (7) y `lib-puerta.sh` (forma común de `d`, `e`, `f`; `g` y `h` toman sólo `puerta_no_corrieron`, `R-24`) | [`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) |
| Otras verificaciones | `verify-navigation.sh`, `verify-propagacion.sh`, `verify-viewer-lifecycle.sh`, `verify-visual-system.sh`, `verify-solution-tree.sh` | [`07`](07_Pruebas-Y-Puertas-De-Calidad.md) |
| Cobertura y extremo a extremo | `coverage.sh` (invoca `tools/informe-cobertura.cs`), `pruebas-e2e.sh` | [`07`](07_Pruebas-Y-Puertas-De-Calidad.md) |
| `tools/` | 2 `.cs` de un solo archivo (`barrido-cobertura-de-contrato`, `informe-cobertura`), 8 `.mjs` (conductores de navegador: `captura-de-superficies`, `sonda-circuito-en-el-anfitrion`, `verificar-*` ×5, `medicion-pintado-del-listado`) y 3 `.sh` (`medicion-pintado-del-listado`, `medicion-volumen-de-comision`, `verificar-resolucion-del-trabajo`) | Instrumentos de medición: [`07`](07_Pruebas-Y-Puertas-De-Calidad.md) |

**`verify-solution-tree.sh` (DC-5, commit `f6b21c4`)** corre en `ci.yml` antes de construir; sus
seis controles y por qué nació están en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) §3.9. Sobre `4b114d7` da
«El árbol de solución está completo».

**`pruebas-e2e.sh`** corre la suite en un contenedor construido desde `deploy/e2e/Dockerfile`
(imagen `gf-e2e:local` por omisión, `IMAGEN_E2E` la cambia), en modo **banco local** (sin
`URL_BASE`) o **desplegado** (con `URL_BASE`, `API_BASE_URL`, `E2E_ADMIN_EMAIL`,
`E2E_ADMIN_PASSWORD`) (l.1–54).

---

## 5. Las tres imágenes

Las dos de producto son **multietapa, sin linaje con el contenedor de desarrollo**, y comparten tres
mecánicas:

| Mecánica | Cómo | Por qué |
| --- | --- | --- |
| **Se sellan con su revisión** | `COPY .gi[t] ./.git/` (patrón tolerante a la ausencia) **después del restore**; `git rev-parse HEAD` → `-p:SourceRevisionId`. `ARG SOURCE_REVISION_ID=desconocida` es el respaldo para un tarball sin `.git` | Una imagen que informa una revisión ajena **falla sin síntoma** (`deploy/Dockerfile` l.9–33) |
| **Completan el clon superficial** | Si existe `.git/shallow`: `git fetch --unshallow --tags origin`; si no se puede, avisa y la versión sale `0.0.0-alpha.0`, **visiblemente falsa** | BuildKit clona desde URL con `--depth=1 --no-tags`, y MinVer calcula `0.0.0-alpha.0` sin advertir —medido el 2026-09-12— (l.35–62) |
| **Corren sin root** | `USER $APP_UID` (`app`, uid **1654**); el directorio de estado es de ese usuario desde la imagen | Mesa del 2026-09-14, «imágenes sin `USER`»; PR #219, commit `2c29d62` |

### 5.1 `deploy/Dockerfile` — el servicio de datos

```text
build:  mcr.microsoft.com/dotnet/sdk:10.0
        COPY Directory.Build.props, .sln, src/ → restore de GeometriaFactory.Api.csproj
        → COPY .gi[t] → (unshallow si hace falta) → publish -c Release -p:SourceRevisionId
final:  mcr.microsoft.com/dotnet/aspnet:10.0
        + curl (healthcheck) y sqlite3 (respaldo desde adentro), sin versión anclada, «se anclan las dos juntas»
        ENV ASPNETCORE_URLS=http://+:8080 · ConnectionStrings__Store="Data Source=/datos/geometriafactory.db"
        /datos de 1654 · VOLUME /datos · USER $APP_UID · EXPOSE 8080
```

**Un volumen que ya existe conserva su dueño**: si lo creó una versión anterior es de root y **el
servicio no arranca** (sale con 78, `attempt to write a readonly database`, medido el 2026-09-14).
Antes del primer despliegue de esta versión:
`docker run --rm -v <volumen>:/datos alpine chown -R 1654:1654 /datos` (l.90–103; `changelog.md`
«Las dos imágenes dejan de correr como root»).

### 5.2 `deploy/Dockerfile.web` — el front (desde el 2026-09-06, PR #186)

```text
visor:  node:22
        COPY visor/package*.json → npm ci → COPY visor/ y scripts/build-visor.sh → bash scripts/build-visor.sh
build:  mcr.microsoft.com/dotnet/sdk:10.0
        restore de GeometriaFactory.Web.csproj → COPY del bundle a wwwroot/js/ ANTES de publish
        → COPY .gi[t] → (unshallow) → publish -c Release -p:SourceRevisionId -p:SkipVisorBuild=true
final:  mcr.microsoft.com/dotnet/aspnet:10.0
        + curl (sólo healthcheck; NO sqlite3: el front no tiene almacén)
        ENV ASPNETCORE_URLS=http://+:8080 · /app/App_Data/claves de 1654 · USER $APP_UID · EXPOSE 8080
        ENTRYPOINT dotnet GeometriaFactory.Web.dll
```

- **Por qué existe** (encabezado): la vía FTP arrastraba el `550` de IIS —que obliga a bajar el
  sitio en cada publicación— y la reescritura de `ApiBaseUrl` **dentro del artefacto** (el
  apartamiento de `ADR-14003`). En la imagen, `Program.cs` lee `ApiBaseUrl` de `IConfiguration`
  (l.204) y una variable de entorno la satisface: **cambiar de destino es cambiar el entorno**.
- **Se lee una sola vez**, al construir el `HttpClient`: cambiar `ApiBaseUrl` exige reiniciar.
- **La imagen lleva horneado `http://localhost:5080/`**: `Program.cs` lanza si el valor **falta**,
  pero no falta, así que **un contenedor sin configurar arranca sano y falla en silencio**. La guarda
  no puede vivir en la imagen; el encabezado dice que vive en la composición del proyecto de
  contenedor con `${API_BASE_URL:?…}` (l.128–139). **Eso está fuera del repositorio y no se
  verificó.**
- El front escribe **sólo** sus claves de protección de datos, en `App_Data/claves` o en
  `DataProtection:KeysDirectory` si se declara (`Program.cs` l.62–64).
- La versión de Node es la de los flujos (`node-version: '22'`): si allá cambia, cambia acá.

**Verificación declarada del PR #186** (hoy en `changelog.md` «Dockerizar el front», **repuesta el
2026-09-12**): la imagen construye y queda sellada; el bundle viaja adentro, **501 676 bytes**
servidos en `/js/`; con `ApiBaseUrl` apuntando al servicio por nombre de red, `/estado` informa la
versión y el reloj **del servicio de datos**. La entrada misma declara que llegó tarde a su fusión.

### 5.3 `deploy/e2e/Dockerfile` — la corrida de extremo a extremo

No despliega nada. Base `mcr.microsoft.com/playwright:v1.49.0-noble` —**la misma versión que
`Microsoft.Playwright.NUnit` 1.49.0** de `GeometriaFactory.E2ETests.csproj`; si una cambia, cambia la
otra— más .NET 10 por `dotnet-install.sh --channel 10.0`. Existe porque la primera corrida del
2026-09-02 se hizo con una imagen armada a mano y nunca versionada: «una prueba que sólo una
persona puede correr no es una compuerta, es una anécdota» (l.6–9).

---

## 6. `deploy/compose.yaml` **no es el despliegue**

Es la **composición de verificación** del servicio de datos (`PT-04`): un servicio `api`,
`build` desde `deploy/Dockerfile` con `SOURCE_REVISION_ID: ${SOURCE_REVISION_ID:-desconocida}` (ya
no hace falta: el árbol trae su `.git`), `restart: unless-stopped`, puerto
`${API_PORT:-8080}:8080`, volumen `store:/datos` y `healthcheck` con `curl` sobre `/salud`
(intervalo 30 s, timeout 5 s, 3 reintentos, `start_period` 30 s). **No incluye el front ni declara
la clave de firma**, y su ausencia no es descuido.

**El criterio del reparto es uno solo** (encabezado, l.20–22): **si para cambiarlo hay que conocer el
fuente, es del fuente; si hay que conocer el host, es del proyecto de contenedor**. El encabezado
nombra ese proyecto, `Container.Lab-Geometria`, como el que conoce red, IP, directorio del disco,
techo de memoria y secretos del `.env`.

> ⚠️ **El encabezado avisa que el intake §16, `Pipeline-Producto.md` §4 y `Entornos-Deploy.md` §3
> todavía describen este archivo como «despliegue desde Git en destino»**, y que corregirlo está
> elevado al Product Owner. Sobre `4b114d7` esa frase sigue en `Api/09-Devops/Entornos-Deploy.md`
> 3.5 l.92 y en `Guia-Publicacion-Image-Docker.md` 1.5 §2 (l.61), que en su propia §2.2 dice lo
> contrario. En `Pipeline-Producto.md` 1.9 la frase ya no aparece (`grep`).

---

## 7. La publicación real (`R-13`, `Guia-Publicacion-Image-Docker.md` 1.5 §2.2)

**Hasta el 2026-09-14 el despliegue real no estaba descrito en el repositorio**, sólo en una
constancia del servidor; la mesa del 2026-09-14 lo pidió como `R-13` y se resolvió en el PR #225
(commit `03804c7`, «La publicación real queda descrita en el repositorio»). La guía **no transcribe
nombres de red, rangos ni rutas del anfitrión**.

**La composición vive en el servidor**, fuera del repositorio, y construye **desde la URL de
GitHub** con la referencia `LAB_GEOMETRIA_REF` (rama, commit o etiqueta) y
`BUILDKIT_CONTEXT_KEEP_GIT_DIR=1`, que es lo que deja sellarse a la imagen.

| Servicio | Construcción | Estado durable | Salud | Límite |
| --- | --- | --- | --- | --- |
| Servicio de datos | `deploy/Dockerfile` | Directorio del anfitrión en `/datos`: el almacén SQLite | `GET /salud` | 512 MiB |
| Front | `deploy/Dockerfile.web` | Directorio del anfitrión en `/claves`: claves de protección de datos | El bundle del visor | 256 MiB |

**Publicación**: los dos servicios en la red de un túnel del anfitrión, **sin puertos publicados**,
bajo dominio propio: `https://geometria.aplicada.stream` (front) y
`https://api-geometria.aplicada.stream` (servicio de datos).

| Variable (sólo el nombre) | Servicio | Qué es |
| --- | --- | --- |
| `LAB_GEOMETRIA_REF` | Composición | Qué revisión se construye |
| `AccessToken__SigningKey` | Datos | **Secreto**, en el `.env` del servidor con modo 600; cambiarla invalida todo acceso emitido |
| `ForwardedHeaders__KnownNetworks__0` | Los dos | La red del túnel, a la que se le cree `X-Forwarded-For` (`Api ADR-00011`, `Web ADR-10009`) |
| `Documentacion__Publicada` | Datos | Opcional: publica OpenAPI y el explorador (`ADR-08008`) |
| `Registration__AdmittedEmailDomains__N` | Datos | Opcional (`Api ADR-00012`); **hoy no se declara** (mesa 2026-09-15, D-2) |
| `ApiBaseUrl` | Front | Dirección del servicio de datos dentro de la red del túnel |
| `DataProtection__KeysDirectory` | Front | `/claves` |

**Procedimiento de actualización** (en el directorio de la composición):

1. **Etiquetar** el commit de `main` que se va a construir (§8).
2. **Respaldo**: `scripts/respaldo-almacen.sh --desde-contenedor <servicio-de-datos> <dir>` y una
   copia del directorio de claves del front (archivos de uid 1654, modo 600: la copia la toma un
   contenedor como root).
3. `docker compose build --pull && docker compose up -d`.
4. **Verificar**: los dos `healthy`; `/salud` con `ready` y la versión terminada en el commit
   esperado; el sello del front con esa misma versión; migraciones, recuentos e `integrity_check` en
   `ok`; la clave del front, la misma de antes.

**Reversión**: `LAB_GEOMETRIA_REF=<commit o etiqueta anterior> docker compose up -d --build`; si una
migración dejó mal el almacén, `scripts/restaurar-almacen.sh` con el respaldo y el servicio detenido.
**Revertir el código no revierte los datos** (guía §4). Reemplazo de versión: **detener y arrancar**,
con ventana de indisponibilidad (guía §2).

**El acto de desplegar es manual y del Product Owner** (intake §10, fila «Despliegue manual del backend»,
l.336; la guía §0, l.37, lo atribuye a §13): la canalización termina en un artefacto verificado. La guía conserva en §2.1
la **prueba única del mecanismo** en cinco comprobaciones, la quinta —que el volumen sobreviva a un
reemplazo— declarada como agregado propio. La **constancia de reproducibilidad** (tres corridas del
2026-09-14) quedó en `Mini-Plan.md` 3.8 §9.1 (mesa 2026-09-15, D-6; **no leída en este indexado**).

---

## 8. Etiquetar antes de desplegar

| Momento | Regla | Fuente |
| --- | --- | --- |
| Hasta 2026-09-12 | Etiqueta por **etapa cerrada** | `Api/09-Devops/Estrategia-Versionado.md` 6.0 §1 regla 4 |
| Desde 2026-09-12 | **Toda fusión a `main` que cambie código de producción** recibe `v<MAJOR>.<MINOR>.<PATCH>` | idem §3.c (`BT-00033`) |
| 2026-09-14 | Producción corría `main` sin etiqueta (`/salud`: `1.1.3-alpha.0.18+8d8c857`): divergencia declarada al PO | guía 1.4 §2.2; `changelog.md` l.2042 |
| Desde 2026-09-15 | **Antes de cada despliegue, el commit de `main` que se construye recibe su etiqueta** (`git tag -a vX.Y.Z <commit>` y `git push origin vX.Y.Z`); la composición sigue en `main` y MinVer sella la versión limpia | `SDD/Docs/Audit/Mesa-2026-09-15.md` D-5 (5-0); guía **1.5** §2.2 |

**`4b114d7` es la fusión que recibió `v1.2.0`** (etiqueta anotada del 2026-09-15; `git tag
--points-at`). Etiquetas del repositorio, por fecha: `v0.1.0`, `v0.2.0`, `v0.5.0`, `v0.7.0`,
`v0.8.0`, `v1.0.0` (2026-09-12), `v1.1.0`, `v1.1.1`, `v1.1.2` (2026-09-13) y `v1.2.0`.

> ⚠️ **Medido sobre la historia de primer padre entre `v1.0.0` y `4b114d7`**: 37 fusiones, **11
> tocan `src/` y 8 de ésas no tienen etiqueta** (PR #211, #212, #214, #216, #217, #220, #222 y
> #229, todas del 2026-09-14), contra la regla §3.c vigente desde el 2026-09-12. Va a
> [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).

---

## 9. Versionado y sello

- **MinVer 8.0.0** en `Directory.Build.props` (decisión `D-03` de la mesa del 2026-09-12, commit
  `38f0992`): la versión se calcula desde la última etiqueta `v*` alcanzable; fuera de un commit
  etiquetado sube PATCH y agrega `-alpha.0.<altura>`, **que no es un canal de anticipo** sino la
  marca de que esa construcción no se entrega. Necesita historial y etiquetas: por eso `ci.yml`
  usa `fetch-depth: 0` y los dos `Dockerfile` completan el clon. `AssemblyInformationalVersion`
  queda `<versión>+<sha>`.
- **El sello del front** sale de `Components/Shared/VersionSeal.razor`; `I-1` de la puerta `i`
  exige que front y servicio sellen **la misma versión** (`changelog.md` «La puerta de `i` mide el
  despliegue que existe»).
- **Contrato**: versionado por compilación compartida (`ADR-08003`); **desde el 2026-09-12 la
  superficie pública lleva `/v{MAJOR}/`** (`ADR-00010`; `ContractRoutePrefix.Value = "/v1"`, commit
  `de0b73b`), que deroga la regla 1 de `ADR-00008` y conserva el **despliegue conjunto**. Detalle
  en [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md).
- **`changelog.md` es la fuente del avance** y se actualiza en la rama, no después de la fusión;
  cuando no coincide con el historial, gana el historial.

---

## 10. Los tres flujos de canalización

Los tres anclan .NET `10.0.x` (`actions/setup-dotnet@v4`) y Node `22` (`actions/setup-node@v4`).

### 10.1 `ci.yml` — las puertas, en todo cambio

Disparo: `push` a `main`, `pull_request` y `workflow_dispatch`. Un trabajo, `puertas`, en
`ubuntu-latest`, **sin secretos y sin publicar**:

| # | Paso | Desde |
| --- | --- | --- |
| 1 | `actions/checkout@v4` con **`fetch-depth: 0`** (MinVer; el historial cuesta 8,5 MiB) | 2026-09-12 |
| 2 | `bash scripts/verify-solution-tree.sh` (DC-5), antes de construir | `f6b21c4` |
| 3 | `./scripts/build.sh` — `QG-01` | — |
| 4 | `./scripts/test.sh` — `QG-02` | — |
| 5 | `./scripts/coverage.sh` — `QG-03`, `QG-06`, `QG-04` | 2026-09-14, `R-12` |
| 6 | `verify-stage-d.sh`, `verify-stage-e.sh`, `verify-stage-h.sh` | 2026-09-14, `R-12` |

Las puertas `c`, `f`, `g` e `i` **siguen siendo manuales** (l.89–90); por qué, y qué otras
verificaciones no corren en ningún flujo, en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) §4.

### 10.2 `deploy-front-ftp.yml` — canal alternativo, **sólo a mano**

**Desde el 2026-09-12 el disparo es únicamente `workflow_dispatch`** (commit `b180b76`): el canal
vigente es el túnel sobre contenedores del servidor propio, y el hosting externo (somee.com) se
conserva **como alternativa y antecedente, no como canal vigente** (`PRODUCT-INTAKE` §14 F-14 4.2;
`Roadmap-Producto.md` 1.10). Antes se disparaba con cada fusión que tocara el front, y `main` se
publicó **dos veces a dos topologías** el mismo 2026-09-12 (encabezado l.26–34).

Pasos: `build.sh` (`QG-01`) → `test.sh` (`QG-02`) → `dotnet publish -c Release` → **inyecta
`ApiBaseUrl`** desde el secreto en `publish/appsettings.json` → **baja la aplicación** con
`app_offline.htm` y **espera ver el 503** (hasta 150 s) más **20 s** para que el proceso obrero
suelte los ensamblados → sube por FTP (`SamKirkland/FTP-Deploy-Action@v4.3.5`), con **un segundo
intento** tras 30 s → **levanta la aplicación** con `if: always()` y espera que deje de dar 503/000
(hasta 120 s) → exige **200** en la dirección pública **y después lee `/estado`** buscando
`class="failure"`. **Publicado y roto no es un éxito.**

El `550` **no era transitorio** (corrida #37 del 2026-09-01: tres intentos, el mismo archivo, 90 y
180 s de espera): IIS tiene los ensamblados abiertos mientras el sitio corre. Los 20 s son 3 s
medidos «con seis veces de margen» (corrida #40).

Secretos que lee: `API_BASE_URL`, `FTP_SERVER`, `FTP_SERVER_DIR`, `FTP_USERNAME`, `FTP_PASSWORD`,
`PUBLIC_URL` (**seis**). Sólo `API_BASE_URL` y `PUBLIC_URL` se comprueban no vacíos con `test -n`
(l.81 y l.266); **la 3.0 de este índice decía que se comprobaban todos, y no es así**.

### 10.3 `e2e.yml` — el recorrido

Disparo: `push` a `main`, `pull_request` y `workflow_dispatch` con `navegadores`
(`chromium,firefox,webkit` por omisión). **Desde el 2026-09-14 ya no se encadena al fin de
`deploy-front-ftp`** (`R-15`): el modo desplegado se lanza a mano después de que el Product Owner
publica. Concurrencia `e2e-laboratorio` con `cancel-in-progress: false`.

| Trabajo | Dónde | Cuándo | Qué hace |
| --- | --- | --- | --- |
| `banco-local` | `self-hosted, i7infra-dev` | Siempre, **salvo un PR desde un fork** (`R-01`, PR #209) | Compila la batería E2E, instala chromium con `playwright.ps1 install --with-deps` y corre la suite **sin variables**: levanta el producto con un almacén propio |
| `matriz` | `ubuntu-latest` | **Sólo `workflow_dispatch`** | Filtra la lista a `chromium|firefox|webkit` |
| `pruebas` | `self-hosted, i7infra-dev`, por navegador, `fail-fast: false` | Tras `matriz` | Modo desplegado: `URL_BASE` = `PUBLIC_URL`, `API_BASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` |
| `resumen` | `ubuntu-latest` | `always()` | Tabla en el resumen; `skipped` **no es rojo** |

Los dos trabajos con resultados suben `resultados-e2e/**` como artefacto con retención de 14 días.

---

## 11. Documentación de referencia

Rutas relativas a `SDD/Docs/Unidades-Entrega/` salvo indicación; versión según el encabezado de cada
documento.

| Tema | Documento | Versión |
| --- | --- | --- |
| **Publicación real, etiqueta, reversión** | `GeometriaFactory-Api/09-Devops/Guia-Publicacion-Image-Docker.md` | 1.5 |
| Canalización del servicio de datos | `GeometriaFactory-Api/09-Devops/Pipeline-CI-CD.md` | 3.11 |
| Canalización del front | `GeometriaFactory-Web/09-Devops/Pipeline-CI-CD.md` | 3.9 |
| Ambientes | `GeometriaFactory-Api/09-Devops/Entornos-Deploy.md`, `GeometriaFactory-Web/09-Devops/Entornos-Deploy.md` | 3.5 · 3.4 |
| Versionado | `GeometriaFactory-Api/09-Devops/Estrategia-Versionado.md`, `GeometriaFactory-Web/…` | 6.0 · 3.2 |
| Cadena de suministro | `GeometriaFactory-{Api,Web}/09-Devops/Supply-Chain-Seguridad.md` | 3.3 · 3.4 |
| Publicar por FTP (canal alternativo) | `GeometriaFactory-Web/09-Devops/Guia-Publicacion-Front-Ftp.md` | 1.5 |
| Publicar el bundle | `GeometriaFactory-Web/09-Devops/Guia-Publicacion-Bundle-Visor.md` | 1.0 |
| Matriz de configuración y aristas | `SDD/Docs/Producto/Pipeline-Producto.md` §3.1 y §4 | 1.9 |
| Eventualidades de operación | `SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md` (`EVE-00001`…`00008`) | — |
| Despliegue en somee (antecedente) | `SDD/Docs/Audit/Reporte-Despliegue-Somee.md` | — |
| Auditoría de la categoría | `SDD/Docs/Audit/F-09-Devops-Siete-Proyectos-r1.md` | — |
| Imagen del front | **Sin guía propia**: `deploy/Dockerfile.web`, `changelog.md` «Dockerizar el front» y la guía 1.5 §2.2 | — |
| `Guia-Despliegue.md`, `Guia-Contenedor.md` | **No emitidas** (`Producto/11-Documentacion/README.md` l.110: «Planificado»; `AGENTS.md` l.84) | — |

---

## 12. Divergencias a la vista en este dominio

Medidas sobre `4b114d7`; no se corrigen en el repositorio. El hecho, la línea y el instrumento de
cada una están en [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md); acá sólo
el mapa:

| Tema | Observación |
| --- | --- |
| `deploy-front-ftp.yml`: filtro de rutas que ya no existe, «cinco» secretos que son seis, `Program.cs` «línea 70»; `Pipeline-Producto.md` §4 repite el filtro | O-16 |
| `deploy/Dockerfile.web` l.25 «el `.csproj` NO invoca a `npm`» | O-46 |
| Documentos de Web que dan el hosting como canal único | O-15 |
| `compose.yaml` descrito como «despliegue desde Git en destino» | O-17 |
| «Rutas con prefijo o sufijo de versión: exactamente 0» en la guía 1.5 §5 (l.173) | O-74 |
| Fecha de cabecera de la guía 1.5 atrás de su control de cambios | O-20 |
| `Contrato-Agentes.md` l.121, `R-13` en futuro | O-21 |
| Fusiones que tocan `src/` sin etiqueta desde `v1.0.0` | O-57 |
| `verify-explicit-configuration.sh` NO CONFORME | O-56 |
| «Los seis proyectos .NET» de `Directory.Build.props` | O-27 |
| La guía §0 (l.37) atribuye al intake §13 una fila que está en §10 | O-47 |
