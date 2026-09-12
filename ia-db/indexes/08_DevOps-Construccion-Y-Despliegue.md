# 08 · DevOps — cómo se construye, se corre y se publica

> **Propósito.** Los guiones, las dos imágenes, los flujos de canalización y el reparto entre lo
> que este repositorio sabe y lo que sabe el proyecto de contenedor.
> **Fuente primaria.** `scripts/`, `deploy/` (`Dockerfile`, `Dockerfile.web`, `compose.yaml`,
> `e2e/Dockerfile`), `.github/workflows/` (`ci.yml`, `deploy-front-ftp.yml`, `e2e.yml`),
> `Directory.Build.props`, `Api/09-Devops/` y `Web/09-Devops/`, y el commit `6fa6844` (PR #186).
> Verificado el 2026-09-11 sobre `89f3ab3`.

---

## 1. La regla que encabeza todo

**La configuración se declara siempre y en los dos lados —el que construye y el que ejecuta—
aunque el valor por omisión coincida** (`Pipeline-Producto.md` §3.1). `build.sh` produce `Release`,
y por eso todo lo que después levanta, prueba o publica esa salida dice `Release` también. **La
coherencia por omisión no cuenta**: el día que alguien agregue la configuración de un solo lado, el
otro sigue resolviendo `Debug` y se verifica una salida que nadie construyó.
`scripts/verify-explicit-configuration.sh` comprueba que la regla se cumpla en todo el árbol.

## 2. Construir

```bash
bash scripts/build.sh        # build-visor.sh → dotnet restore → dotnet build -c Release --no-restore
bash scripts/build-visor.sh  # npm ci (o npm install la primera vez) → npm run build → cp dist/*.js{,.map} a wwwroot/js/
```

`build.sh` **encadena el bundle primero**, porque `Visor → Web` es una dependencia de construcción
real que ningún `.csproj` puede expresar. `build-visor.sh` usa `npm ci` cuando hay
`package-lock.json` y `npm install` la primera vez, versionando el resultado. **Es el único lugar
desde donde se genera el bundle**: `deploy-front-ftp.yml` retiró su paso suelto y
`deploy/Dockerfile.web` invoca el guion en vez de repetir sus órdenes.

**Todo corre dentro del contenedor de desarrollo**: el anfitrión **no tiene el kit de desarrollo**,
y es decisión de la etapa `a` (intake §10). Consecuencias que cuestan tiempo:

- Correr contenedores con `-u "$(id -u):$(id -g)"` y `DOTNET_CLI_HOME`, **o dejan archivos de root
  en el árbol** (`EVE-00002`).
- La imagen del SDK **no trae** `jq`, `python3` ni `sqlite3`, y no se agregan: hay un escapador
  `awk` y aplicaciones de un solo archivo de C# (`EVE-00005`).
- Una aplicación de un solo archivo necesita `#:project` para referenciar un proyecto, y **no puede
  usar `JsonSerializer` con reflexión**: `IL2026`/`IL3050` son errores acá (`EVE-00006`).

## 3. Correr localmente

| Guion | Qué hace |
| --- | --- |
| `scripts/run-api.sh` | Levanta el servicio de datos en el contenedor de desarrollo; arranca, aplica las transformaciones y el punto de salud responde |
| `scripts/run-web.sh` | Levanta la pieza pública |
| `scripts/store-path.sh` | **Un solo lugar que dice dónde vive el almacén de desarrollo** |
| `scripts/reset-db.sh` | Deja el almacén en su estado de primer arranque |
| `scripts/migrate.sh` | **Genera** una transformación de esquema. No la aplica |
| `scripts/respaldo-almacen.sh` / `restaurar-almacen.sh` | Copia y restauración del almacén, con archivo propio |

**El servicio escucha en 5080, no en 8080**: la configuración de Kestrel gana sobre
`ASPNETCORE_URLS`, y publicar hay que hacerlo con `-p <libre>:5080` (`EVE-00001`).

**Los contenedores `gf-api`, `gf-web`, `gf-back` y `gf-tunnel` son el despliegue local del Product
Owner y no se tocan** (`EVE-00007`): un servicio de prueba se levanta aparte, con puerto libre y
almacén propio.

## 4. Las dos imágenes

### 4.1 `deploy/Dockerfile` — el servicio de datos

Dos etapas:

```text
build:  mcr.microsoft.com/dotnet/sdk:10.0
        restore → publish -c Release, SELLANDO la revisión de git en SourceRevisionId
final:  mcr.microsoft.com/dotnet/aspnet:10.0
        + curl y sqlite3 (los necesita el healthcheck y la operación del almacén)
        ENV ASPNETCORE_URLS=http://+:8080
        ENV ConnectionStrings__Store="Data Source=/datos/geometriafactory.db"
        VOLUME /datos · EXPOSE 8080
```

**La imagen se sella con la revisión**: el `Dockerfile` copia `.git` si existe (`COPY .gi[t]`, un
patrón que no rompe si no encuentra nada) y deriva la revisión de ahí; `SOURCE_REVISION_ID` queda
como respaldo para construir desde un tarball sin `.git`.

### 4.2 `deploy/Dockerfile.web` — el front (desde el 2026-09-06, PR #186)

Tres etapas, **sin linaje con la imagen del contenedor de desarrollo**:

```text
visor:  node:22
        npm ci en visor/ → bash scripts/build-visor.sh   (el bundle, que el .csproj no produce)
build:  mcr.microsoft.com/dotnet/sdk:10.0
        restore de GeometriaFactory.Web.csproj → COPY del bundle a wwwroot/js/ ANTES de publish
        → publish -c Release, sellando SourceRevisionId igual que la otra imagen
final:  mcr.microsoft.com/dotnet/aspnet:10.0
        + curl (sólo para el healthcheck; NO sqlite3: el front no tiene almacén)
        ENV ASPNETCORE_URLS=http://+:8080 · EXPOSE 8080 · sin VOLUME
        ENTRYPOINT dotnet GeometriaFactory.Web.dll
```

**Por qué existe, según su propio encabezado.** La publicación por FTP arrastraba dos costos que
no son del producto: el `550` de IIS —que obliga a bajar el sitio en cada publicación— y la
reescritura de `ApiBaseUrl` **dentro del artefacto publicado**, que es el apartamiento que declara
`ADR-14003`. En la imagen no pasa ninguna de las dos: `Program.cs` lee `ApiBaseUrl` de
`IConfiguration`, y **una variable de entorno la satisface sin tocar el artefacto**. La misma
imagen sirve para cualquier destino; cambiar de destino es cambiar el entorno.

**Lo que la imagen no cambia y hay que saber**:

- `Program.cs` sigue leyendo la dirección **una sola vez**, al construir el `HttpClient`. Cambiar
  `ApiBaseUrl` exige reiniciar el contenedor.
- **La imagen lleva un `ApiBaseUrl` horneado**: el de `appsettings.json`, `http://localhost:5080/`.
  `Program.cs` lanza cuando el valor **falta**, pero acá no falta, así que **un contenedor sin
  configurar arranca sano y falla en silencio** al hablar con la API — la falla que `ADR-14003` §4
  describe. **La guarda no puede vivir en esta imagen** (el valor de desarrollo es legítimo con
  `dotnet run`): vive en la composición del proyecto de contenedor, con `${API_BASE_URL:?…}`.
  **Eso está fuera de este repositorio y no se verificó.**
- La versión de Node es la que los tres flujos declaran (`node-version: '22'`): si allá cambia,
  cambia acá.

**Lo que el commit declara haber verificado** (`git show 6fa6844`): la imagen construye y queda
sellada; el bundle viaja adentro, 501.676 bytes servidos en `/js/`; con `ApiBaseUrl` apuntando a
`lab-geometria-api:8080`, `/estado` muestra la versión y el reloj **del servicio de datos**.
**Ninguna de las tres está en `evidencia/`, en `changelog.md` ni en `SDD/`** (ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) O-9).

## 5. `deploy/compose.yaml` **no es el despliegue**

Es la **composición de verificación** del servicio de datos: un solo servicio `api`, construido
desde `deploy/Dockerfile` con `SOURCE_REVISION_ID`, puerto `${API_PORT:-8080}:8080`, volumen
`store:/datos` y `healthcheck` con `curl` sobre `/salud` cada 30 s. Prueba que la imagen arranca,
aplica sus transformaciones sobre una base vacía y responde salud. Eso es `PT-04`, y es todo lo
que hace. **No incluye la imagen del front.**

**El despliegue en destino vive en otro repositorio, `Container.Lab-Geometria`**, que es el que
conoce la red macvlan, la IP en la LAN, el directorio del disco contra el que monta la base, el
techo de memoria y los secretos del `.env` — y, según `Dockerfile.web`, la guarda de
`API_BASE_URL` del front.

| | Esta composición | La de despliegue |
| --- | --- | --- |
| Para qué | Probar que la imagen del servicio arranca | Correr los servicios en un host |
| Qué sabe | Del fuente | De la infraestructura |
| Red, IP, puertos | No tiene | Los tiene |
| Volúmenes, `.env`, secretos | No tiene | Los tiene |

**El criterio del reparto es uno solo: si para cambiarlo hay que conocer el fuente, es del fuente;
si hay que conocer el host, es del proyecto de contenedor.** Por eso esta composición **no declara
la clave de firma**, y su ausencia no es descuido.

**El acto de desplegar es manual y del Product Owner**: la canalización termina en un artefacto
verificado y no en un servicio corriendo (intake §17.5.P.7 y §17.5.P.8).

> ⚠️ **El intake §16 todavía describe este archivo como «despliegue desde Git en destino»**, y con
> él `Pipeline-Producto.md` §4 y `Entornos-Deploy.md` §3. Era cierto cuando se escribieron: el
> proyecto de contenedor se creó después y esa decisión se tomó en otro árbol y nunca volvió al
> intake. **Corregirlo es escritura controlada sobre documento humano y está elevado.**

## 6. Los tres flujos de canalización

Los tres anclan .NET `10.0.x` y Node `22`.

### 6.1 `ci.yml` — las puertas

Sobre `push` a `main`, `pull_request` y a mano. Corre `./scripts/build.sh` (`QG-01`) y
`./scripts/test.sh` (`QG-02`) en `ubuntu-latest`. **Los mismos guiones que en la máquina de quien
construye.**

### 6.2 `deploy-front-ftp.yml` — publicar el front al hosting

Se dispara sólo cuando cambia lo que afecta al front: `src/GeometriaFactory.Web/**`, `visor/**`,
`src/GeometriaFactory.Contracts/**` **o el propio flujo** —la cuarta entrada entró por un defecto
pagado el 2026-09-01: un cambio al flujo no lo disparaba—. Pasa las dos puertas, publica, y
después:

1. **Inyecta `ApiBaseUrl` desde el secreto `API_BASE_URL`** en el `appsettings.json` publicado — la
   dirección real del servicio de datos **no se versiona**.
2. **Baja la aplicación del anfitrión** con `app_offline.htm` antes de subir. El `550` **no era
   transitorio** (medido el 2026-09-01: tres intentos, el mismo archivo, 90 y 180 s de espera):
   IIS tiene los ensamblados abiertos mientras el sitio corre. Sin bajarla el `appsettings` nuevo
   tampoco surte efecto sin reinicio.
3. Comprueba que la dirección pública responde `200` **y después mira el contenido**.

**Ese tercer paso existe porque el `200` no alcanzaba.** Hasta el 2026-09-01 el flujo podía
declarar éxito con el sitio **publicado y sin datos**: la página de estado devuelve `200` aunque
adentro diga que el servicio de datos no responde. Hoy el flujo lee `/estado`, busca la marca de
fallo y corta. **Publicado y roto no es un éxito.**

Secretos que consume: `API_BASE_URL`, `FTP_SERVER`, `FTP_SERVER_DIR`, `FTP_USERNAME`,
`FTP_PASSWORD`, `PUBLIC_URL`. **Cada uno se comprueba no vacío antes de usarse**, porque un secreto
vacío falla adentro de `curl` con un mensaje que manda a buscar el problema al lugar equivocado.

**Este flujo sigue vivo después del PR #186.** `Dockerfile.web` dice «hasta hoy el front se
publicaba por transferencia», pero nada en el árbol retiró la publicación por FTP ni declaró cuál
de las dos vías es la del despliegue. Las dos coexisten (O-9).

### 6.3 `e2e.yml` — el recorrido

Sobre `push` a `main`, `pull_request`, a mano con una lista de navegadores (`chromium,firefox,webkit`
por omisión), y **encadenado al fin de `deploy-front-ftp`**. Concurrencia serializada en el grupo
`e2e-laboratorio` con `cancel-in-progress: false` —cancelar a mitad de camino dejaría cuentas
sembradas sin limpiar—. Cuatro trabajos:

| Trabajo | Dónde | Qué hace |
| --- | --- | --- |
| `banco-local` | `self-hosted, i7infra-dev` | Compila la batería de extremo a extremo —**que no está en la solución**—, instala el navegador con `playwright.ps1 install --with-deps` y corre la suite contra el banco local |
| `matriz` | `ubuntu-latest` | Sólo a mano o cuando `deploy-front-ftp` terminó bien: arma la lista de navegadores |
| `pruebas` | `self-hosted, i7infra-dev`, por navegador | El **modo desplegado**: `URL_BASE` = `PUBLIC_URL`, `API_BASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` desde los secretos |
| `resumen` | `ubuntu-latest` | Consolida, siempre |

## 7. Versionado y sello

**Versionado por compilación compartida** (`ADR-08003`): un cambio incompatible de `Contracts`
rompe la compilación de los dos extremos antes que el tiempo de ejecución. **Sin versionado de
rutas** (`ADR-00008`), con **despliegue conjunto** como contrapartida aceptada, que es la
mitigación de `RI-02`.

El sello de versión que el front muestra sale de la compilación compartida
(`Components/Shared/VersionSeal.razor`), y **las dos imágenes** llevan la revisión de git horneada
en `SourceRevisionId`.

**`changelog.md` es la única fuente del avance de construcción**, se actualiza **en la rama de la
etapa y no después de la fusión**, y **cuando no coincide con el historial del repositorio gana el
historial** — que es lo que pasa hoy con el PR #186.

## 8. Documentación de referencia

| Tema | Documento |
| --- | --- |
| Canalización del servicio de datos | `Api/09-Devops/Pipeline-CI-CD.md` |
| Ambientes y despliegue | `Api/09-Devops/Entornos-Deploy.md`, `Web/09-Devops/Entornos-Deploy.md` |
| Publicar la imagen del servicio | `Api/09-Devops/Guia-Publicacion-Image-Docker.md` |
| Publicar el front por FTP | `Web/09-Devops/Guia-Publicacion-Front-Ftp.md` |
| Publicar el bundle | `Web/09-Devops/Guia-Publicacion-Bundle-Visor.md` |
| Publicar la imagen del front | **No hay documento.** La única fuente es el propio `deploy/Dockerfile.web` y el commit `6fa6844` |
| Cadena de suministro | `*/09-Devops/Supply-Chain-Seguridad.md` |
| Versionado | `*/09-Devops/Estrategia-Versionado.md` |
| Despliegue en Somee (hosting) | `Audit/Reporte-Despliegue-Somee.md` |
