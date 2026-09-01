# 08 · Construcción, ejecución y despliegue

> **Propósito:** con qué comando se hace cada cosa, qué sabe cada artefacto de infraestructura y
> dónde termina la canalización.
> **Fuente primaria:** `scripts/`, `deploy/`, `.github/workflows/`, `.devcontainer/` y
> `SDD/Docs/Producto/Pipeline-Producto.md` más las categorías `09-Devops` de las dos unidades.

---

## 1. La regla que encabeza todo

**La configuración de compilación se declara siempre y en los dos lados** —el que construye y el que
ejecuta— **aunque el valor por omisión coincida** (`Pipeline-Producto.md` §3.1). Tiene puerta
propia: `scripts/verify-explicit-configuration.sh`. `scripts/assert-build-fresh.sh` es la red que va
debajo de todo `dotnet run --no-build`: construye en la configuración declarada y **no vuelve con 0
salvo que la salida de esa configuración exista y esté al día**.

**Todo corre dentro del contenedor de desarrollo**: el host no tiene el kit.

## 2. Los guiones

| Guion | Qué hace |
| --- | --- |
| `build.sh` | Producto entero en Release: encadena el bundle del visor con la compilación de la solución. **0 y sin advertencias** |
| `build-visor.sh` | Instalación reproducible → empaquetado → **copia del bundle al front** |
| `test.sh` | Las tres baterías en Release. Es **el mismo guion** en la máquina de quien construye y en la canalización |
| `coverage.sh` | `QG-03` y `QG-04`. Salidas 0 / 1 / **2 (no se pudo medir)** |
| `run-api.sh` | Levanta el servicio de datos en el contenedor, **HTTP sin certificado** |
| `run-web.sh` | Levanta el front; la dirección del servicio llega por `ApiBaseUrl`, nunca embebida |
| `store-path.sh` | **Se sourcea, no se ejecuta.** Un único lugar que resuelve dónde vive el almacén de desarrollo |
| `reset-db.sh` | Deja el almacén en su estado de primer arranque: vacío y con el esquema al día |
| `migrate.sh` | **Genera** una transformación de esquema. **No la aplica**: se aplican solas al arrancar |
| `respaldo-almacen.sh` / `restaurar-almacen.sh` | La copia y la vuelta atrás — el único mecanismo del producto para volver sobre datos |
| `assert-build-fresh.sh`, `lib-puerta.sh` | Infraestructura común de las puertas |
| `verify-*.sh` | Las puertas de etapa y las técnicas — ver [`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) |

`tools/` guarda instrumentos de medición puntuales: `informe-cobertura.cs` (el analizador de
`QG-03`, que corre con `dotnet run` y **no agrega ninguna dependencia**),
`barrido-cobertura-de-contrato.cs`, `medicion-pintado-del-listado.*` y
`medicion-volumen-de-comision.sh`.

## 3. Entorno de desarrollo

`.devcontainer/devcontainer.json`: imagen `mcr.microsoft.com/devcontainers/dotnet:1-10.0-trixie` con
Node **22**, `dotnet tool restore` al crear, y dos puertos publicados:

| Puerto | Servicio |
| --- | --- |
| **5080** | `GeometriaFactory.Api` (HTTP, sin certificado) |
| **5090** | `GeometriaFactory.Web` |

**El 5080 sale de `appsettings.Development.json`**, que declara un extremo de Kestrel en
`http://0.0.0.0:5080`: **la configuración de Kestrel gana sobre `ASPNETCORE_URLS`**, y ésa es la
eventualidad `EVE-00001` de la bitácora. **La imagen de despliegue escucha en 8080**
(`ENV ASPNETCORE_URLS=http://+:8080` del `Dockerfile`), de modo que al publicarla se mapea contra
8080 y no contra 5080.

## 4. La imagen del servicio — `deploy/Dockerfile`

Multietapa, sólo el entorno de ejecución en la imagen final y **sin linaje** con la imagen de
desarrollo. Puntos que cuestan tiempo si no se saben:

- **La imagen se sella a sí misma**: la revisión se deriva del `.git` del contexto cuando está, y
  cae en `SOURCE_REVISION_ID` sólo si no puede. El argumento como única fuente permitía que la
  imagen informara por `/salud` una revisión que no era la suya — **una falla sin síntoma**.
- La copia del `.git` usa el patrón `.gi[t]` a propósito: **un patrón que no encuentra nada no rompe
  la construcción**, y construir desde un tarball sin `.git` sigue funcionando.
- El almacén vive en el volumen `/datos`, con `ConnectionStrings__Store` fijado por `ENV`.
- Se instalan **dos** herramientas y cada una con su motivo escrito: `curl` (lo necesita el
  `healthcheck`) y `sqlite3` (para que el respaldo se pueda tomar **desde adentro** del contenedor).
  Ninguna lleva versión anclada; si algún día se anclan, se anclan las dos juntas.

## 5. `deploy/compose.yaml` **no es el despliegue**

Es la **composición de verificación**: prueba que la imagen arranca, aplica sus transformaciones
sobre base vacía y responde salud. Eso es `PT-04`, y es todo lo que hace.

**El despliegue en destino vive en otro repositorio, `Container.Lab-Geometria`**, que es el que
conoce la red macvlan, la IP en la LAN, el directorio del disco, el techo de memoria y los secretos
del `.env`. El criterio del reparto: **si para cambiarlo hay que conocer el fuente, es del fuente;
si hay que conocer el host, es del proyecto de contenedor.** Por eso esta composición **no declara
la clave de firma**: es un secreto del host.

> El intake §16 todavía describe este archivo como «despliegue desde Git en destino», y con él
> `Pipeline-Producto.md` §4 y `Entornos-Deploy.md` §3. Era cierto cuando se escribieron; el proyecto
> de contenedor se creó después. **Corregirlo es escritura controlada sobre documento humano y está
> elevado al Product Owner.**

**El acto de desplegar es manual y del Product Owner**: la canalización termina en un artefacto
verificado, no en un servicio corriendo.

## 6. La canalización del front — `.github/workflows/deploy-front-ftp.yml`

Dispara en `push` a `main` con filtro de rutas de **tres** entradas: `src/GeometriaFactory.Web/**`,
`visor/**` y `src/GeometriaFactory.Contracts/**`. La tercera entró por corrección declarada: sin
ella, un cambio de contrato no dispara la publicación y **las dos unidades quedan desalineadas sin
que nada falle**.

Orden del flujo: anclar .NET 10 y Node → **`scripts/build.sh` (`QG-01`)** → **`scripts/test.sh`
(`QG-02`)** → publicar por FTP → **comprobar que la dirección pública responde**. Las dos puertas se
agregaron el 2026-08-18: hasta entonces una advertencia y la batería entera en rojo pasaban igual,
y la comprobación final tampoco lo veía —la página carga y responde 200 con el producto roto por
dentro—. **Los dos pasos invocan los guiones del repositorio** y no reescriben sus órdenes.
Ninguna dirección real vive en el archivo: todas llegan como secretos.

## 7. Límites del entorno local

- Los contenedores **`gf-api`, `gf-web`, `gf-back`, `gf-tunnel` son del Product Owner**. Un servicio
  de prueba se levanta **aparte**, con puerto libre y almacén propio (eventualidad `EVE-00007`).
- Correr contenedores con `-u "$(id -u):$(id -g)"` y `DOTNET_CLI_HOME`, o dejan archivos de root en
  el árbol (`EVE-00002`).
- La imagen del SDK **no trae** `jq`, `python3` ni `sqlite3`, y **no se agregan**: hay un escapador
  `awk` y aplicaciones de un solo archivo de C# (`EVE-00005`).
- Una aplicación de un solo archivo necesita `#:project` para referenciar un proyecto y **no puede
  usar `JsonSerializer` con reflexión** — `IL2026`/`IL3050` son errores acá (`EVE-00006`).
- SQLite en WAL deja **tres** archivos y no uno (`EVE-00003`).
