# 12 · DevOps: construcción, configuración, versionado, imágenes y despliegue

> **Propósito.** Ubicar cómo se construye, configura, versiona, empaqueta en imágenes y despliega Lab-Geometria (Fábrica de Geometría), y qué guías dejan levantarlo en limpio.
> **Fuente primaria.** El código de construcción y despliegue: `Directory.Build.props`, `scripts/`, `deploy/`, `.github/workflows/`, `.devcontainer/`. El corpus que lo norma: `SDD/Docs/Unidades-Entrega/*/09-Devops/`.
> **Revisión indexada.** `main` 5f07b12 · ia-db 4.0 · 2026-11-01. Todas las rutas son relativas a la raíz del repositorio `Lab-Geometria`.
> **No cubre.** La deprecación del contrato `/v1/` (→ 06), el bundle del visor por dentro y su guía de publicación (→ 10), las puertas QG/PT/verify-stage que corren en CI (→ 11), el almacén y los guiones de respaldo y restauración (→ 07), la clave de firma como mecanismo (→ 08).

---

## 1. Mapa de archivos

```
Directory.Build.props            ← propiedades comunes a toda la solución + MinVer
.config/dotnet-tools.json        ← herramienta local dotnet-ef 10.0.11
.devcontainer/devcontainer.json  ← entorno único de desarrollo (.NET 10 + Node 22)
.gitignore                       ← artefactos, almacén, claves, salida E2E
.publish-web-offline.htm         ← página de mantenimiento (app_offline) del canal FTP
scripts/
  build.sh                       ← restore + build Release de GeometriaFactory.sln
  run-api.sh / run-web.sh        ← levantar cada pieza en desarrollo (Debug declarado)
  assert-build-fresh.sh          ← red debajo de todo `--no-build`
deploy/
  Dockerfile                     ← imagen del servicio de datos (Api)
  Dockerfile.web                 ← imagen del front (Web) con etapa del visor
  compose.yaml                   ← composición de VERIFICACIÓN (PT-04), no de despliegue
  e2e/Dockerfile                 ← imagen de la corrida E2E (Playwright + .NET 10)
.github/workflows/
  ci.yml                         ← puertas en todo cambio
  e2e.yml                        ← banco local + recorrido contra lo desplegado
  deploy-front-ftp.yml           ← canal alternativo FTP a somee (manual)
src/GeometriaFactory.Api/appsettings{,.Development}.json
src/GeometriaFactory.Web/appsettings{,.Development}.json
```

Conteo: 4 archivos en `deploy/`, 3 workflows. `scripts/` tiene 27 guiones versionados; aquí se indexan sólo los de construir/correr (los `verify-*`, `coverage.sh`, `test.sh`, `pruebas-e2e.sh`, `lib-puerta.sh` → 11; `migrate.sh`, `reset-db.sh`, `respaldo-*`, `restaurar-*`, `store-path.sh` → 07; `build-visor.sh` → 10).

---

## 2. `Directory.Build.props`

Fuente: `Directory.Build.props`. Apartamiento **AP-01** del árbol del intake §16 (declarado en `Plan-Etapa-A.md` §2.3): las propiedades viven una sola vez para toda la solución.

| Propiedad | Valor | Motivo declarado |
|---|---|---|
| `TargetFramework` | `net10.0` | — |
| `LangVersion` / `Nullable` / `ImplicitUsings` | `latest` / `enable` / `enable` | — |
| `InvariantGlobalization` | `true` | — |
| `TreatWarningsAsErrors` | `true` (con `WarningsAsErrors` vacío) | Puerta **QG-01**: cero advertencias, no se arrastran |
| `AnalysisLevel` | `latest` | — |
| `RestoreLockedMode` | `false` | Comentario: «Regla de anclaje de versiones (intake, encabezado de la Parte C)» |
| `Deterministic` | `true` | Consecuencia usada por `assert-build-fresh.sh` (§4) |
| `GenerateDocumentationFile` | `false` | — |
| `PackageReference MinVer` | `8.0.0`, `PrivateAssets="All"` | Decisión **D-03** de la mesa 2026-09-12 (ciclo 2); cierra PA-06 (Application) y PA-04 (Domain) |
| `MinVerTagPrefix` | `v` | Prefijo fijado en `Estrategia-Versionado.md` §3.b |

El comentario habla de «treinta y un proyectos de la solución» (incluye samples y tests; el recuento de proyectos → 04). Incoherencia interna de la fuente: el comentario de cabecera (AP-01) del mismo `Directory.Build.props` dice «los seis proyectos .NET comparten la misma puerta… repetida en seis archivos de proyecto».

---

## 3. Guiones de construir y correr

| Guion | Qué hace | Configuración | Detalle |
|---|---|---|---|
| `scripts/build.sh` | `dotnet restore` + `dotnet build GeometriaFactory.sln -c Release --no-restore` | `Release` declarado | Encabeza la regla «la configuración se declara siempre y en los dos lados» (`Pipeline-Producto.md` §3.1). El bundle del visor ya no se genera aquí: lo hace el target `BuildVisor` del `.csproj` del front (`Web ADR-10008`, → 10) |
| `scripts/run-api.sh` | Resuelve el almacén (`store-path.sh`), exige `AccessToken__SigningKey` y hace `dotnet run` del Api | `Debug` por omisión (`GF_CONFIGURATION`), decisión del PO; `ASPNETCORE_ENVIRONMENT=Development` | Sin clave sale con 1 y explica que la guardia de `CompositionRoot` no dejaría arrancar. Incluye la receta del contenedor de desarrollo `gf-back` (red `gfnet`, montaje `/datos`, puerto 5080), desactualizada: `Contrato-Agentes.md` dice que `gf-back` ya no corre desde el 2026-09-14 (D-6) |
| `scripts/run-web.sh` | `dotnet run` del front | `Debug` por omisión (`GF_CONFIGURATION`) | Marcado **[PROPUESTA SIN BASE DECLARADA]**: el intake §16 lo enumera sin contenido (`Plan-Etapa-A.md` §4) |
| `scripts/assert-build-fresh.sh` | Construye `<csproj> <Debug\|Release>` y sólo devuelve 0 si la construcción terminó en 0 **y** existe `bin/<conf>/<tfm>/<asm>.dll` | Valida que sea `Debug` o `Release` (exit 2 si no) | Ver §4 |

**Asimetría deliberada** (`run-api.sh`, `run-web.sh`): los guiones de desarrollo usan `Debug`; los `verify-*` siguen en `Release` porque miden lo que se despliega. Los comentarios piden no «corregirla» por simetría. La comprobación en todo el árbol la hace `scripts/verify-explicit-configuration.sh` (→ 11).

---

## 4. Red de compilación fresca

Fuente: `scripts/assert-build-fresh.sh` (encabezado).

| Aspecto | Contenido |
|---|---|
| Problema | Una construcción fallida seguida de `dotnet run --no-build` levanta el binario de la corrida anterior (código de salida perdido por `set -uo pipefail` sin `-e` y canalización a `tail`) |
| Diseño descartado | Comparar fechas de fuentes vs. ensamblado: con `Deterministic=true` da falsos positivos que no se limpian |
| Diseño vigente | Usa la construcción incremental de MSBuild como oráculo y luego verifica la existencia del ensamblado de esa configuración |
| Obligatoriedad | Todo guion que levanta con `--no-build` lo llama antes; `verify-explicit-configuration.sh` falla si no |

---

## 5. Configuración por entorno

### 5.1 Servicio de datos (Api)

| Llave | Dónde | Valor / regla | Fuente |
|---|---|---|---|
| `ConnectionStrings__Store` | Variable de entorno | **No se declara en `appsettings.json`** (deliberado); en desarrollo la calcula `scripts/store-path.sh` sobre `$XDG_DATA_HOME/geometria-factory/`; en imagen `Data Source=/datos/geometriafactory.db`. Sin ella el servicio no arranca | `src/GeometriaFactory.Api/appsettings.json` (`_ConnectionStrings_Store`), `deploy/Dockerfile` |
| `AccessToken__SigningKey` | Variable de entorno / `.env` del servidor | Secreto, ≥ 32 bytes; no está en repo ni imagen; sin ella no arranca | `scripts/run-api.sh`, `Guia-Publicacion-Image-Docker.md` §2.2 |
| `RateLimiting:*` | `appsettings.json` | Llaves `WindowSeconds`, `PermitsPerPerson`, `PermitsPerAddress`, `CredentialExchangePermitsPerAddress`, `CredentialFailuresPerAccount`, `CredentialFailureWindowSeconds` (valores → 08); se cambian con `RateLimiting__<Llave>` (semántica → 08) | `src/GeometriaFactory.Api/appsettings.json` |
| `Registration:AdmittedEmailDomains` | `appsettings.json` | `[]` (cualquiera); se declara con `Registration__AdmittedEmailDomains__N` (`Api ADR-00012`, → 08) | ídem |
| `ForwardedHeaders__KnownNetworks__0` | Composición del despliegue | Red del túnel; no va en `appsettings` | ídem, `Entornos-Deploy.md` (Web) §4.1 |
| `Documentacion__Publicada` | Composición | Opcional: publica OpenAPI y explorador (→ 06) | `Guia-Publicacion-Image-Docker.md` §2.2 |
| Kestrel (Development) | `appsettings.Development.json` | `http://0.0.0.0:5080`, sin certificado (intake §17.5) | `src/GeometriaFactory.Api/appsettings.Development.json` |
| Logging | `appsettings.json` | `Default` Information, `Microsoft.AspNetCore` Warning (Development: Information) | ídem |

### 5.2 Front (Web)

| Llave | Dónde | Valor / regla | Fuente |
|---|---|---|---|
| `ApiBaseUrl` | `appsettings.json` | `http://localhost:5080/` (valor del contenedor de desarrollo); la dirección real no se versiona (intake §17.6) | `src/GeometriaFactory.Web/appsettings.json` |
| `ApiBaseUrl` en imagen | Variable de entorno | La imagen **lleva** el valor de desarrollo: un contenedor sin configurar arranca sano y apunta a la nada (`ADR-14003` §4). La guarda `${API_BASE_URL:?...}` vive en la composición del proyecto de contenedor, fuera de este repo | `deploy/Dockerfile.web` (cola) |
| `ApiBaseUrl` en FTP | Secreto `API_BASE_URL` | Se reescribe en `publish/appsettings.json`; exige reinicio (`Program.cs` lo lee una vez) | `.github/workflows/deploy-front-ftp.yml` |
| `DataProtection__KeysDirectory` | Composición | `/claves` en producción; por omisión `App_Data/claves` (→ 08) | `Guia-Publicacion-Image-Docker.md` §2.2, `deploy/Dockerfile.web` |
| Kestrel (Development) | `appsettings.Development.json` | `http://0.0.0.0:5090` | `src/GeometriaFactory.Web/appsettings.Development.json` |

Detalle normativo: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Entornos-Deploy.md` §5–§6 (configuración y secretos) y `.../GeometriaFactory-Web/09-Devops/Entornos-Deploy.md` §4–§5.

---

## 6. Entorno de desarrollo

| Elemento | Contenido | Fuente |
|---|---|---|
| Imagen del devcontainer | `mcr.microsoft.com/devcontainers/dotnet:1-10.0-trixie` + feature Node `22` | `.devcontainer/devcontainer.json` |
| Puertos reenviados | 5080 (Api, HTTP sin certificado), 5090 (Web) | ídem |
| Post-creación | `dotnet tool restore` | ídem |
| Extensiones | `ms-dotnettools.csdevkit`, `ms-dotnettools.csharp` | ídem |
| Usuario | `vscode` | ídem |
| Herramienta local | `dotnet-ef` 10.0.11, `rollForward: false` | `.config/dotnet-tools.json` |
| Contenedores de desarrollo del PO | Vigentes: `lab-geometria-web` y `lab-geometria-api` (→ 18); `gf-back` de la receta de `run-api.sh` ya no corre (D-6) | `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`, `scripts/run-api.sh` |

### 6.1 `.gitignore` (bloques propios, sobre la base VisualStudio.gitignore)

| Bloque | Patrones | Motivo |
|---|---|---|
| Bundle del visor | `src/GeometriaFactory.Web/wwwroot/js/*.js`, `*.js.map` (salvo `.gitkeep`); `visor/dist/` (marcado AP-04) | Artefacto generado (→ 10; `wwwroot/js/README.md`, apartamientos AP-02/AP-04) |
| Almacén local | `*.sqlite`, `*.sqlite3`, `*.db-shm`, `*.db-wal`, `geometriafactory*.db` | Nunca entra al repo |
| Publicación manual | `.publish-web/` | Salida de `dotnet publish` |
| Volcados | `core.*` | EVE-00008 (124 MB la primera vez) |
| Claves de protección de datos | `App_Data/`, `**/App_Data/` | Se guardan sin cifrar (apartamiento declarado) |
| Salida E2E | `resultados-e2e/` | Evidencia de una corrida; lo elegido iba a `evidencia/<fecha>/` (retirada de la raíz, → 19) |
| Secretos | `*.env` | Está en la base VisualStudio («User-specific files», l. 12), no en un bloque propio |

Fuente: `.gitignore`.

---

## 7. Imágenes de `deploy/`

Las dos imágenes de ejecución (`deploy/Dockerfile`, `deploy/Dockerfile.web`) son multietapa y **sin linaje** con el devcontainer (intake §17.5.P.8/P.9); la imagen E2E es de una sola etapa.

| Imagen | Archivo | Etapas | Base final | Usuario | Puerto | Herramientas extra | Estado durable |
|---|---|---|---|---|---|---|---|
| Servicio de datos | `deploy/Dockerfile` | `build` (sdk:10.0) → `final` | `mcr.microsoft.com/dotnet/aspnet:10.0` | `$APP_UID` = 1654 (`app`) | 8080 | `curl` (healthcheck), `sqlite3` (respaldo desde el contenedor) | `VOLUME /datos`; `ConnectionStrings__Store` apunta ahí |
| Front | `deploy/Dockerfile.web` | `visor` (node:22, `npm ci` + `build-visor.sh`) → `build` (sdk:10.0, `publish -p:SkipVisorBuild=true`) → `final` | `aspnet:10.0` | 1654 | 8080 | `curl` | `/app/App_Data/claves` (claves de protección de datos) |
| E2E | `deploy/e2e/Dockerfile` | única | `mcr.microsoft.com/playwright:v1.49.0-noble` + .NET 10 por `dotnet-install.sh --channel 10.0` | (de la base) | — | — | — |

Puntos comunes de las dos imágenes de ejecución (fuente: `deploy/Dockerfile`, `deploy/Dockerfile.web`):

| Mecanismo | Contenido |
|---|---|
| Autosellado de revisión | `COPY .gi[t]` (patrón tolerante a ausencia) después del `restore`; `SourceRevisionId` = `git rev-parse HEAD`, o el `ARG SOURCE_REVISION_ID` (por omisión `desconocida`) si no hay `.git` |
| Clon superficial | Si existe `.git/shallow`, `git fetch --unshallow --tags origin`; si falla, avisa y la versión sale `0.0.0-alpha.0` (visiblemente falsa) |
| Sin root | Mesa `SDD/Docs/Audit/Mesa-2026-09-14.md` (imágenes sin `USER`); PR #219 según `Guia-Publicacion-Image-Docker.md` §2.2 |
| Volumen preexistente de root | Hay que `chown -R 1654:1654`; si no, el Api sale con código 78 `attempt to write a readonly database` (medido 2026-09-14) y el front se niega a arrancar |
| Lista de herramientas | No crece sin justificación escrita; sin versión anclada (si se anclan, las dos juntas) |

La imagen E2E existe porque la primera corrida (2026-09-02) usó una imagen `gf-e2e:local` armada a mano y nunca versionada; su etiqueta debe acompañar la versión de `Microsoft.Playwright.NUnit` del proyecto E2E (`deploy/e2e/Dockerfile`).

### 7.1 `deploy/compose.yaml`

| Aspecto | Contenido |
|---|---|
| Naturaleza | **Composición de verificación** (`PT-04`): construye, migra sobre base vacía, responde salud; no es la de despliegue |
| Servicio | `api` (contexto `..`, `deploy/Dockerfile`, arg `SOURCE_REVISION_ID`), puerto `${API_PORT:-8080}:8080`, volumen `store:/datos`, `restart: unless-stopped` |
| Healthcheck | `curl --fail http://localhost:8080/salud`, intervalo 30 s, timeout 5 s, 3 reintentos, `start_period` 30 s ([ASUNCIÓN] intake §17.5) |
| Clave de firma | No se declara: secreto del host, se pasa por línea de comandos |
| Despliegue real | Repositorio aparte `Container.Lab-Geometria` (red, IP, volúmenes, límites, `.env`) |
| Divergencia declarada | El intake §16, `Pipeline-Producto.md` §4 y `Entornos-Deploy.md` §3 aún lo describen como «despliegue desde Git en destino»; elevado al PO |

---

## 8. Workflows de GitHub Actions

| Workflow | Disparo | Runner | Qué hace | Secretos |
|---|---|---|---|---|
| `ci.yml` (`ci`) | `push` a `main`, `pull_request`, `workflow_dispatch` | `ubuntu-latest` | checkout `fetch-depth: 0` (MinVer) · setup-dotnet `10.0.x` · setup-node `22` · `verify-solution-tree.sh` · `build.sh` (QG-01) · `test.sh` (QG-02) · `coverage.sh` (QG-03/06/04) · `verify-stage-d/e/h.sh` | Ninguno |
| `e2e.yml` (`e2e`) | `push` a `main`, `pull_request`, `workflow_dispatch` (input `navegadores`, por omisión `chromium,firefox,webkit`) | Trabajos de prueba en `[self-hosted, i7infra-dev]`; `matriz` y `resumen` en `ubuntu-latest` | `banco-local`: levanta el producto propio, chromium, sin secretos (en PR sólo si la rama es del mismo repo). `matriz` + `pruebas`: sólo en `workflow_dispatch`, contra lo desplegado. `resumen`: refleja resultados. `concurrency: e2e-laboratorio`, sin cancelar | `PUBLIC_URL`, `API_BASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` (sólo `pruebas`) |
| `deploy-front-ftp.yml` (`deploy-front-ftp`) | Sólo `workflow_dispatch` | `ubuntu-latest` | `build.sh` · `test.sh` · `dotnet publish` del Web · inyecta `ApiBaseUrl` · sube `app_offline.htm` y espera 503 · FTP (`SamKirkland/FTP-Deploy-Action@v4.3.5`, con segundo intento) · borra `app_offline.htm` con `if: always()` · comprueba la URL pública | `API_BASE_URL`, `FTP_SERVER`, `FTP_SERVER_DIR`, `FTP_USERNAME`, `FTP_PASSWORD`, `PUBLIC_URL` |

Motivos registrados en los encabezados:

- `ci.yml` existe porque el único flujo previo (FTP) filtraba por rutas del front y los cambios de Api/Infrastructure/Domain/`scripts/` no disparaban ninguna puerta (U-01 y U-03 se fusionaron rotas). Separa **verificar** (siempre) de **publicar** (manual). Las etapas `c`, `f`, `g`, `i` siguen manuales. Fuente: `.github/workflows/ci.yml`.
- `e2e.yml` modo desplegado no corre en cada push: toca datos reales y depende de un sitio que puede caer; su atadura a `deploy-front-ftp` se quitó (mesa 2026-09-14, R-15). El runner propio no ejecuta código de forks (R-01). Fuente: `.github/workflows/e2e.yml`.
- `deploy-front-ftp.yml` es **canal alternativo, no productivo, desde 2026-09-06** (séptima reanudación, 2026-09-12): el canal vigente es el túnel sobre contenedores del servidor propio. Pasó a manual porque `main` se publicó dos veces a dos topologías el 2026-09-12. Fuente: `.github/workflows/deploy-front-ftp.yml`.

Las puertas que estos flujos ejecutan, por dentro → 11. Detalle de stages y triggers: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Pipeline-CI-CD.md` §2–§3 y `.../GeometriaFactory-Web/09-Devops/Pipeline-CI-CD.md` §2–§5 (incluida la resolución de PD-01 en Web §3).

---

## 9. Versionado de construcción

Fuentes: `Directory.Build.props`, `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Estrategia-Versionado.md` (v6.0), `.../GeometriaFactory-Web/09-Devops/Estrategia-Versionado.md` (v3.2).

| Aspecto | Regla | Ubicación |
|---|---|---|
| Herramienta | MinVer 8.0.0 (cerró PA-04, 2026-09-12) | `Directory.Build.props`; Api `Estrategia-Versionado.md` §3 |
| Prefijo de etiqueta | `v` (fijado 2026-08-18) | Api §3.b, Web §3.b |
| Commit sin etiqueta | `<última>.(PATCH+1)-alpha.0.<altura>`; no es canal de anticipo, marca «no es entrega» | `Directory.Build.props`; Api §5.b |
| SHA | `AssemblyInformationalVersion = <versión>+<sha>` vía `-p:SourceRevisionId` de los Dockerfile | `Directory.Build.props` |
| Requisito | Historial y etiquetas completos (si no, `0.0.0-alpha.0.<n>` sin fallar) | `ci.yml`, Dockerfiles |
| Evento de etiqueta | Toda fusión a `main` que cambie código de producción (`src/**`, `visor/**`, `Directory.Build.props`, `*.csproj`, `.sln`, `deploy/Dock…`; PD-VER-02) recibe `v<MAJOR>.<MINOR>.<PATCH>` | Api §3.c |
| Número | Conventional Commits: `feat`→MINOR, `fix`→PATCH, `!`/`BREAKING CHANGE`→MAJOR; MAJOR compartido con `/v{MAJOR}/` | Api §3.c (deprecación → 06) |
| Quién etiqueta | `PD-VER-01` decidida 2026-09-12: opción (b), etiqueta manual que crea quien fusiona código de producción a `main`, sin job de CI; la mesa delegada 2026-09-15 (D-5) precisa el momento: «antes de cada despliegue» | Api §3.c; `Guia-Publicacion-Image-Docker.md` §2.2 |
| Etiquetas retroactivas | No (propuesta `v0.9.0`/`v0.9.1` descartada, 2026-09-12) | Api `Estrategia-Versionado.md` (tabla de §3.c) |
| Sello visible | `/salud` informa la versión; el sello del front la muestra (componente → 09) | `Guia-Publicacion-Image-Docker.md` §2.2 |

Etiquetas existentes en el repo (`git tag`, verificado sobre 5f07b12): `v0.1.0`, `v0.2.0`, `v0.5.0`, `v0.7.0`, `v0.8.0`, `v1.0.0`, `v1.1.0`, `v1.1.1`, `v1.1.2`, `v1.2.0`. `v1.0.0` = `8e5e2f9`, en producción desde 2026-09-13 (Api `Estrategia-Versionado.md`). Las cinco `v0.x` se repusieron el 2026-08-18. Lo que cada versión entregó → 03.

Web `Estrategia-Versionado.md` §6–§8 trata qué versiona la unidad Web, cambios incompatibles y crecimiento del punto de extensión del visor.

---

## 10. Despliegue

### 10.1 Canales

| Canal | Estado | Destino | Fuente |
|---|---|---|---|
| Túnel con dominio propio sobre contenedores del servidor propio (i7infra) | **Vigente desde 2026-09-06** | `https://geometria.aplicada.stream` (front) y `https://api-geometria.aplicada.stream` (datos) | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Guia-Publicacion-Image-Docker.md` §2.2 |
| FTP a hosting compartido (somee.com) | Alternativo / antecedente, manual | `https://www.aplicada.somee.com` | `.github/workflows/deploy-front-ftp.yml`, `SDD/Docs/Audit/Reporte-Despliegue-Somee.md` |

### 10.2 Despliegue real (fase i)

Fuente: `Guia-Publicacion-Image-Docker.md` §2.2 (v1.5; la fila «Ventana» sale de §2 y §4), verificada contra el servidor el 2026-09-14 (mesa R-13). No transcribe redes ni rutas del anfitrión (repositorio público).

| Aspecto | Contenido |
|---|---|
| Composición | En el servidor, fuera del repo; construye desde la URL de GitHub con `LAB_GEOMETRIA_REF` y `BUILDKIT_CONTEXT_KEEP_GIT_DIR=1` |
| Servicio de datos | `deploy/Dockerfile`; directorio del anfitrión en `/datos`; salud `GET /salud`; límite 512 MiB |
| Front | `deploy/Dockerfile.web`; directorio del anfitrión en `/claves`; límite 256 MiB |
| Red | Red del túnel, sin puertos publicados |
| Variables | `LAB_GEOMETRIA_REF`, `AccessToken__SigningKey` (`.env` modo 600), `ForwardedHeaders__KnownNetworks__0`, `Documentacion__Publicada`, `Registration__AdmittedEmailDomains__N` (hoy no se declara), `ApiBaseUrl`, `DataProtection__KeysDirectory` |
| Actualización | 1) respaldo (`respaldo-almacen.sh --desde-contenedor`) + copia de claves; 2) `docker compose build --pull && docker compose up -d`; 3) verificar `healthy`, `/salud` `ready` con la versión del commit, sello del front, migraciones/recuentos, `integrity_check` ok, clave del front igual |
| Reversión | `LAB_GEOMETRIA_REF=<anterior> docker compose up -d --build`; datos con `restaurar-almacen.sh` (revertir código no revierte datos) |
| Ventana | Detener y arrancar: sin solapamiento (sin proxy inverso; almacén de escritor único) — guía §2 y §4 «Ventana y comunicación» |
| Acto de desplegar | Manual y del PO; la canalización termina en un artefacto verificado (`deploy/compose.yaml`, `Api/09 Pipeline-CI-CD.md` §1) |

Reversión normativa por situación: `Guia-Publicacion-Image-Docker.md` §4. Dirección dinámica y cómo el front alcanza al servicio sin violar `RA-03`: Api `Entornos-Deploy.md` §4.

### 10.3 Publicación por FTP con `app_offline`

Fuentes: `.github/workflows/deploy-front-ftp.yml`, `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/09-Devops/Guia-Publicacion-Front-Ftp.md` (v1.5), `SDD/Docs/Audit/Reporte-Despliegue-Somee.md` (v1.1), `.publish-web-offline.htm`.

| Hecho | Contenido |
|---|---|
| El `550` | IIS mantiene abiertos los ensamblados mientras la app corre; medido en la corrida #37 (2026-09-01), tres intentos fallan en `GeometriaFactory.Web.pdb`; se retiraron los tres intentos con espera sobre la aplicación viva y queda un segundo intento con la aplicación abajo (`app_offline.htm`) — `.github/workflows/deploy-front-ftp.yml` |
| Mecanismo | Subir `app_offline.htm` → esperar 503 (hasta 150 s) + 20 s → subir → borrar `app_offline.htm` con `if: always()` |
| Reinicio | `Program.cs` lee `ApiBaseUrl` una sola vez: una publicación que no reinicia no cambia la dirección |
| Normalización | El secreto `FTP_SERVER` se limpia de `ftp://` y barra final |
| `.publish-web-offline.htm` | Página mínima «Actualizando el laboratorio» en la raíz (el workflow genera la suya en línea) |
| Primer despliegue (2026-08-13) | `PT-01.a` pasa (`/estado` 200); `net10.0` soportado; `RA-03` se sostiene; **sin WebSockets** (sólo SSE y LongPolling) — `Reporte-Despliegue-Somee.md` §2–§3 |
| Mecanismo del hosting | Raíz sin subcarpeta, `web.config` obligatorio (sin él 500), espejado con borrado y respaldo previo (169 archivos) — `Reporte-Despliegue-Somee.md` §1; `Guia-Publicacion-Front-Ftp.md` §2.1–§2.2 |

### 10.4 Entornos

| Documento | Versión | Contenido principal |
|---|---|---|
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Entornos-Deploy.md` | 3.5 | Ambientes (§1, con apartamiento del modelo de la categoría), provisión y aprobación `plan`→`apply` (§2), cómo llega el código (§3), dirección dinámica (§4), configuración (§5), secretos (§6), respaldo como único mecanismo de vuelta atrás (§11.1) |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/09-Devops/Entornos-Deploy.md` | 3.4 | Ambientes, bundle no versionado (§2, → 10), provisión, configuración (redes de proxies de confianza, §4.1), secretos (§5), promoción (§6), resolución PA-05 (§8) |

---

## 11. Cadena de suministro

| Aspecto | Decisión | Fuente |
|---|---|---|
| Inventario (SBOM) | CycloneDX, JSON, adjunto al informe de cierre, sin firma propia (PO, 2026-08-24, `Audit/A3-Decisiones-Del-Product-Owner.md` §4) | Api `Supply-Chain-Seguridad.md` §2.b |
| Firma de imagen | No cumplido y sin objeto: la imagen no se publica en registro, se construye en destino (intake §17.1.P.7) | Api §3 |
| Dependencias core del Api | Tres (acceso a datos con motor embebido, derivación de clave, emisión de acceso firmado) | Api §5 |
| Anclaje | Versiones exactas (MinVer 8.0.0, dotnet-ef 10.0.11, Playwright v1.49.0, FTP-Deploy-Action v4.3.5); acciones `@v4`; herramientas de SO sin anclar | archivos citados en §2, §6, §7, §8 |
| Secciones | Integridad de construcción (§4), análisis de dependencias (§5), estático/dinámico (§6), vulnerabilidades (§7) por proyecto | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Supply-Chain-Seguridad.md` (v3.3), `.../GeometriaFactory-Web/09-Devops/Supply-Chain-Seguridad.md` (v3.4) |

---

## 12. Corpus 09-Devops (vivo)

| Documento | Api | Web |
|---|---|---|
| `README.md` (puertas por stage, frontera del despliegue, recuentos) | v2.4 — §4 «quince quality gates», §5 frontera | v2.4 — §4 «once quality gates», §5 tres decisiones derivadas |
| `Pipeline-CI-CD.md` | v3.11 (727 líneas) | v3.9 (465 líneas) |
| `Estrategia-Versionado.md` | v6.0 | v3.2 |
| `Entornos-Deploy.md` | v3.5 | v3.4 |
| `Supply-Chain-Seguridad.md` | v3.3 | v3.4 |
| Guía de publicación | `Guia-Publicacion-Image-Docker.md` v1.5 | `Guia-Publicacion-Front-Ftp.md` v1.5 (`Guia-Publicacion-Bundle-Visor.md` → 10) |

Versiones anteriores en `09-Devops/_legacy/` (fechas 2026-08-24, 09-13, 09-14, 09-15): sólo ubicación (→ 17). Auditoría de la categoría: `SDD/Docs/Audit/F-09-Devops-Siete-Proyectos-r1.md` (→ 16).

---

## 13. Onboarding: levantarlo en limpio

| Guía | Versión | Contenido |
|---|---|---|
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/03-UX-UI-DX/Guia-Onboarding-Developer.md` | 2.1 (835 líneas) | Prerrequisitos por proyecto (§1), instalación dentro del devcontainer: `build.sh` sin advertencias y `test.sh` entero (§2), primer ejemplo (§3), diagnóstico de la primera hora (§4), próximos pasos (§5), «las tres cosas que no fallan» (§6), dónde va una regla nueva (§7), inversión de dependencias (§8), atajos (§9) |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/03-UX-UI-DX/Guia-Onboarding-Developer.md` | 1.1 | La primera hora sobre la fachada del visor: 5 min dibujar, 30 min contrato entero, 1 h interior (§3); diagnóstico (§4) |

Secuencia mínima derivada de las fuentes (no es un documento del repo):

| Paso | Orden | Fuente |
|---|---|---|
| 1 | Abrir en el devcontainer (instala `dotnet-ef`) | `.devcontainer/devcontainer.json` |
| 2 | `scripts/build.sh` | `scripts/build.sh` |
| 3 | `export AccessToken__SigningKey=…` (≥ 32 bytes) y `scripts/run-api.sh` → `:5080` | `scripts/run-api.sh` |
| 4 | `scripts/run-web.sh` → `:5090` | `scripts/run-web.sh`, `appsettings.Development.json` |
| 5 | Ensayo de imagen: `docker compose -f deploy/compose.yaml up` (+ clave por línea de comandos) | `deploy/compose.yaml` |

Sample de onboarding de cliente externo contra `/v1/` (BT-00034) → 13.

---

## 14. Observaciones de este dominio

| # | Observación | Fuentes |
|---|---|---|
| D-1 | `deploy/Dockerfile.web` (comentario de la etapa 1) dice que el `.csproj` del front «NO invoca a `npm`», pero el mismo archivo, `build.sh` y los workflows afirman que el target `BuildVisor` lo genera (por eso `SkipVisorBuild=true`). El comentario de la etapa 1 quedó desactualizado | `deploy/Dockerfile.web`, `scripts/build.sh` |
| D-2 | `deploy/compose.yaml` declara que el intake §16, `Pipeline-Producto.md` §4 y `Entornos-Deploy.md` §3 aún lo describen como despliegue | `deploy/compose.yaml` |
| D-3 | `.gitignore` remite a `evidencia/<fecha>/` para la evidencia elegida; esa carpeta fue retirada de la raíz en esta revisión | `.gitignore` (→ 19) |
| D-5 | El repositorio `Container.Lab-Geometria` y el `.env` del servidor no son verificables desde este repo | `deploy/compose.yaml`, `Guia-Publicacion-Image-Docker.md` §2.2 |
| D-6 | `scripts/run-api.sh` conserva la receta del contenedor `gf-back`, que según el contrato de agentes ya no corre desde el 2026-09-14 | `scripts/run-api.sh`, `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md` |
