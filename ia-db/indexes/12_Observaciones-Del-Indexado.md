# 12 · Observaciones del indexado — qué se verificó y qué no cuadró

> **Propósito.** Dejar por escrito cómo se verificó esta base y qué divergencias entre el corpus y el
> árbol quedaron a la vista. **Ninguna se resolvió acá**: este índice las registra con su evidencia y
> las deja a quien corresponda.
> **Fuente primaria.** El árbol versionado de Lab-Geometria (`git ls-files`), su historia
> `89f3ab3..4b114d7` y los once índices hermanos de esta misma regeneración.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

La base anterior (3.0) se verificó el 2026-09-11 contra `89f3ab3`. Entre las dos revisiones hay
**204 commits**, **46 fusiones de primer padre** (PR #187 a #233) y **428 archivos** cambiados
(`git log --oneline 89f3ab3..4b114d7 | wc -l`; `git diff --stat 89f3ab3..4b114d7`). `4b114d7` es la
fusión del PR #233 (2026-09-15) y lleva la etiqueta `v1.2.0` (`git tag --points-at`).

---

## 1. Qué se verificó, y con qué

### 1.1 El procedimiento

| Paso | Qué se hizo |
| --- | --- |
| Regeneración | **Doce agentes**, uno por índice (00 a 11), regeneraron cada uno su archivo desde las fuentes, sin copiar cifras de la 3.0 |
| Refutación | **Dos escépticos por índice** intentaron refutar cada afirmación: uno con la lente de **magnitudes** (todo conteo se vuelve a contar), otro con la de **trazabilidad** (toda afirmación apunta a una fuente que existe y dice eso). Lo confirmado se corrigió en el índice |
| Consolidación | Los índices reportaron sus divergencias candidatas; este índice **volvió a medir cada una** con instrumento y admitió sólo las reales y no duplicadas (§3), con las descartadas en §4 |
| Alcance | Sólo lo versionado: `git ls-files` da **1888** archivos en `4b114d7`. Se excluyeron `_legacy/` (679 archivos), `SDD/Maquetas/` (17, sólo contados), binarios, imágenes y la propia ia-db |

### 1.2 Los instrumentos

| Afirmación | Instrumento |
| --- | --- |
| Qué cambió desde la 3.0 | `git log --oneline 89f3ab3..4b114d7`, `git diff --stat`, `git log --first-parent --merges` |
| Qué commit o PR resolvió cada O | `git log -S'<texto>' 89f3ab3..4b114d7 -- <archivo>` y `git log --merges --ancestry-path <commit>..4b114d7` |
| Recuentos de identificadores | `grep -c 'public const string'` sobre `ErrorCode.cs` (16) y `ConditionCode.cs` (37) |
| Puntos de acceso y su guardia | `grep` de `AllowAnonymous` (6) y `RequireAuthorization` (11 llamadas) en `src/GeometriaFactory.Api/Endpoints/` |
| Proyectos y aristas | `GeometriaFactory.sln` (31 `.csproj`), `git ls-files '*.csproj'` (31), los `ProjectReference` de los seis `.csproj` de `src/` (7) |
| ADR vivas | `git ls-files 'SDD/Docs/*/Adrs/*'` sin `_legacy/`: Producto 13, Api 31, Web 15 = **59** |
| Archivos del corpus vivo | `git ls-tree -r SDD/Docs` sin `_legacy/`: **577** |
| Cabeceras contra control de cambios | `sed -n 1,14p` del documento frente a las filas `\| N.N \| 2026-…` de su tabla |
| Etiquetas contra fusiones | `git rev-list --first-parent --merges v1.0.0..4b114d7` + `git tag --points-at` + `git diff --name-only <m>^1 <m>` |
| Escenarios de los samples | `git ls-tree -r samples \| grep -E '/E[1-8]\.txt$'` (52, en 11 carpetas) |
| Configuración explícita | `bash scripts/verify-explicit-configuration.sh` corrido **en lectura** sobre el árbol en `4b114d7` (no escribe archivos) |

**Lo que no se verificó, y se declara.** Fuera de `verify-explicit-configuration.sh`, no se corrió
ninguna batería, puerta, sample ni construcción de imagen. Las cifras de resultado que publica esta
base —pruebas que pasan, bytes del bundle, porcentajes de cobertura— **se citan de `changelog.md` y
de los commits con su fecha**. No se abrió `Container.Lab-Geometria` ni el despliegue del PO
(`~/docker/lab-geometria`), así que lo que el árbol atribuye a esa composición **no está comprobado**.

## 2. Las nueve observaciones de la 3.0, vueltas a medir

| O | Estado en `4b114d7` | Evidencia |
| --- | --- | --- |
| O-1 | **Vigente** | `Vista-Producto.md` 1.11 l.71 sigue diciendo 15 puntos; también l.189 y l.251 («quince») |
| O-2 | **Vigente, y creció** | La tabla dice 50 ADR (l.69); hay **59**. Además l.10, l.35, l.198 y l.206 dicen **45** |
| O-3 | **Vigente, con magnitud nueva** | 16 constantes contra 18 vivos de `Contratos-Abstractions.md` 1.4 §5.1 |
| O-4 | **Resuelta en `65ead7e` (PR #208)** | `SDD/README.md` pasó a ser un puntero (l.10) |
| O-5 | **Resuelta en `160770d` (PR #218)** | `AGENTS.md` l.82–84 declara «no está emitido» para las tres guías |
| O-6 | **Resuelta en `6cc6f86` (PR #187)** | `samples/README.md` 2.0: «diecisiete implementadas… tres en esqueleto» (l.5) |
| O-7 | **Resuelta a medias** | El README raíz se corrigió (2.0); **10 READMEs locales** siguen con 13 enlaces colgados |
| O-8 | **Resuelta en `6cc6f86` (PR #187)** | `GeometriaFactory.sln` l.54 declara la batería E2E, sin `.Build.0` |
| O-9 | **Resuelta en `6b16127` y `b180b76` (PR #188)** | `changelog.md` l.1078 repone la entrada; el FTP pasa a canal manual |

### O-1 · `Vista-Producto.md` §1 declara quince puntos de acceso, y hay diecisiete — vigente

**Hecho.** `Vista-Producto.md` pasó de la 1.9 a la **1.11** (2026-09-13) y la tabla de magnitudes
(l.71) sigue diciendo **15**. La fila 5 de la tabla de contratos (l.189) y la de l.251 repiten
«quince». `Contratos-REST.md` 1.11 y el código cuentan **diecisiete** (6 `AllowAnonymous` + 11
`RequireAuthorization`). Ninguna de las dos emisiones nuevas de la vista tocó esas filas.

### O-2 · `Vista-Producto.md` cuenta mal las ADR — vigente, y creció

**Hecho.** La l.69 dice «ADR: **50** — nivel Producto 10, `Api` 27, `Web` 13». El árbol tiene
**59**: Producto 13, Api 31, Web 15. En `89f3ab3` eran 53 (13 + 27 + 13). La cabecera (l.10), l.35,
l.198 y l.206 hablan de **45** ADR, cifra que no coincide con ningún recuento, y la l.198 afirma
«**No hay `Producto/Adrs/`**» mientras el mismo §5 enlaza `Adrs/ADR-08003…`.

**Interpretación.** El desfase dejó de ser de las cinco `ADR-140xx`: entre las dos revisiones
entraron seis ADR —cuatro de Api (`ADR-00009` a `ADR-00012`) y dos de Web (`ADR-10008`, `ADR-10009`),
`git diff --name-status 89f3ab3 4b114d7`— sin que la tabla se tocara.

### O-3 · `ErrorCode` tiene dieciséis constantes contra dieciocho códigos vivos — vigente

**Hecho.** `ErrorCode.cs` declara **16** constantes. Entró `EmailDomainNotAdmitted` (2026-09-14,
`Api ADR-00012`) y siguen faltando `STATE_FORBIDS_OUTCOME` y `OUTCOME_ADMIN_ONLY`, que
`Contratos-Abstractions.md` §5.1 numera 12 y 13 entre **dieciocho** vivos. El comentario se
contradice: l.16 «los quince… de los diecisiete vivos», l.21–23 «los dos que siguen faltando…
son de la etapa `h`», l.26 «Son dieciocho vivos». El desenlace se sigue cubriendo con
`ContractTranslation.WorkStateForbidsOutcome` (l.246). Los recuentos documentales que no cuadran
entre sí están en O-18.

### O-4 · `SDD/README.md` afirmaba que `Docs/` estaba vacía — resuelta en `65ead7e` (PR #208)

**Evidencia.** El commit `65ead7e` (2026-09-13, parche PR-09 de `Audit/Mesa-2026-09-13-ciclo-2.md`)
lo reemplazó por un puntero. Su l.10 dice que el contenido anterior «quedó vencido sin que nada lo
señalara». `SDD/Docs/` tiene hoy 577 archivos vivos.

### O-5 · `AGENTS.md` remitía a tres documentos inexistentes — resuelta en `160770d` (PR #218)

**Evidencia.** `Contrato-Agentes.md` 1.1 (R-18 de `Audit/Mesa-2026-09-14.md`) regeneró `AGENTS.md`
el 2026-09-14. Las l.82–84 siguen nombrando `Vision-General-Sistema.md`, `Guia-Inicio-Rapido.md` y
`Guia-Despliegue.md`, pero ahora **declaran que no están emitidas** y remiten a lo que existe. La
regeneración dejó otras dos divergencias: O-10 y O-11.

### O-6 · `samples/README.md` declaraba todo en esqueleto — resuelta en `6cc6f86` (PR #187)

**Evidencia.** `git log -S'Esqueleto — sin código**'` da `6cc6f86` (2026-09-12); la versión 2.0 del
README declara el estado real por carpeta, y la 2.1 (`9413dfc`) suma la vigésima, `api/04`. Sólo
las tres de `contracts/` siguen en esqueleto. Quedan defectos nuevos en el mismo README: O-59.

### O-7 · Enlaces a `SDD/Docs/Proyectos/` en `samples/` — resuelta a medias

**Hecho.** La 2.0 de `samples/README.md` corrigió **sus** diecinueve enlaces (fila 2.0, l.100; la
única aparición que queda es esa fila de historia). Los READMEs locales no se barrieron:
`git grep -c 'SDD/Docs/Proyectos/' 'samples/*/*/README.md'` da **10 archivos y 13 apariciones**
(api/01–03, contracts/01–03, domain/01–03, visor/01). `git ls-files SDD/Docs/Proyectos` da 0. El
mismo residuo en el código del front es O-44.

### O-8 · La batería E2E no estaba en la solución — resuelta en `6cc6f86` (PR #187)

**Evidencia.** `GeometriaFactory.sln` l.54 declara `GeometriaFactory.E2ETests` y las l.168–169 le dan
`ActiveCfg` **sin `.Build.0`**: entra al árbol y no se construye con la solución. Lo que la 3.0
dejaba como pregunta (el fundamento) está escrito ahora en el propio `.csproj`, que a su vez quedó
desactualizado: O-49.

### O-9 · `deploy/Dockerfile.web` sin registro — resuelta en `6b16127` y `b180b76` (PR #188)

**Evidencia.** `6b16127` (2026-09-12) «Reponer en changelog.md la entrada faltante del PR #186»:
`changelog.md` l.1078 «Dockerizar el front — 2026-09-06 (repuesta el 2026-09-12, después de la
fusión)». `b180b76` declara el FTP alternativo y le quita el disparo automático
(`deploy-front-ftp.yml` queda con `on: workflow_dispatch`). Hoy diez documentos vivos de `SDD/Docs/`
nombran `Dockerfile.web`, entre ellos `Guia-Publicacion-Image-Docker.md` (fila «Front», l.103).
`deploy/compose.yaml` sigue sin el front, pero ahora se declara **de verificación, no de despliegue**
(l.1). Lo que quedó sin alinear del cambio de canal está en O-14 a O-17.

## 3. Divergencias nuevas — **nueva** en todas

Cada fila se midió sobre `4b114d7`. La columna «Índice» dice dónde está el detalle del tema.

### 3.1 Puerta de entrada y corpus

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-10 | `AGENTS.md` l.76: «Las **siete** eventualidades completas… están en la bitácora»; la bitácora tiene **8** identificadores distintos `EVE-00001`…`EVE-00008` | `AGENTS.md`; `SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md` | 00 |
| O-11 | `AGENTS.md` l.71: «El servicio escucha en 5080, no en 8080». El Kestrel 5080 sólo está en `appsettings.Development.json` l.5; `deploy/Dockerfile` fija `ASPNETCORE_URLS=http://+:8080` (l.68) y `EXPOSE 8080` (l.108) | `AGENTS.md`; `src/GeometriaFactory.Api/appsettings.Development.json`; `deploy/Dockerfile` | 00, 08 |
| O-12 | `SDD/Docs/README.md` 2.9: l.46 «Refleja `PRODUCT-MANIFEST`… **2.2**», cuando el manifiesto vigente es el **7.1**, y la propia l.14 dice que no replica versiones; l.71 «`GeometriaFactory-Visor` **no tiene solución de código**», pero `GeometriaFactory.sln` l.26 declara `visor\geometriafactory-visor.csproj` | `SDD/Docs/README.md` §2, §2.2; `GeometriaFactory.sln`; `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` §1 | 00, 01 |
| O-13 | `SDD/Docs/README.md` l.190, fila `i`: `verify-stage-i.sh` «mide criterios de una versión anterior del roadmap y es deuda declarada (`DD-R8-1`)». El guion se reescribió en `0e9cf03` (PR #226, 2026-09-14): su cabecera enumera `I-1`…`I-6` vigentes y la l.289 exige que la medición deje de decir `SIN MEDIR` | `SDD/Docs/README.md` §7.2; `scripts/verify-stage-i.sh` | 00, 11 |
| O-20 | La fecha de cabecera quedó atrás de la última fila del control de cambios: `Roadmap-Producto.md` 1.16 (cabecera 09-13, fila 09-14); `Api/07-Plan-Sprint/Mini-Plan.md` 3.8 (cabecera 09-13, fila 09-15; filas en orden 3.6, 3.8, 3.7, l.891–893); `Producto/Plan-Etapa-A.md` 1.13 (08-13 / 09-13); `Handoff-Checkout.md` 1.10 (08-12 / 08-31); `Web/09-Devops/README.md` 2.4 (08-16 / 09-12); `Api/09-Devops/Guia-Publicacion-Image-Docker.md` 1.5 (08-11 / 09-15); `Producto/Norma-De-Nomenclatura.md` sin campo de versión, fecha 08-31, última fila 1.31 del 09-14 | los siete documentos, cabecera y control de cambios | 01, 08, 10, 11 |
| O-21 | `Contrato-Agentes.md`: el frontmatter dice `version: "1.0"` y `last_review: 2026-08-30`, pero el control de cambios tiene la fila 1.1 del 2026-09-14 (l.141) y la 1.0 está archivada en `_legacy/2026-09-14/`. Su l.121 dice que la publicación real «se describe en un solo lugar en la fase `i` (R-13)», en futuro; `Mesa-2026-09-14.md` l.230 da R-13 por «Hecho» (PR #225) y la guía tiene §2.2 «La publicación real» | `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`; `SDD/Docs/Audit/Mesa-2026-09-14.md` | 01, 08 |
| O-22 | `PRODUCT-MANIFEST` 7.1 §1 l.18: «Intake (origen)… **5.0**»; el intake vigente es la **5.1**. La 5.1 cambió §10 y no §13, de donde se deriva el manifiesto: desfase de cita, no de contenido | `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md`; `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` | 01 |
| O-23 | Las NB-00001…00009 recibieron commits el 2026-08-15 y 08-16 (`afc645b`: 6 archivos, +31 −1) y su última fila de control de cambios es del 2026-08-11 o anterior. Es previo a `89f3ab3`: ningún commit entre las dos revisiones toca esa carpeta | `SDD/Docs/01-Necesidades-Negocio/Necesidades-De-Negocio/NB-0000[1-9]` | 01 |

### 3.2 Composición y arquitectura

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-14 | El manifiesto 7.1 (l.142, l.154), `SDD/Docs/README.md` (l.55, l.75, l.84) y `Vista-Producto.md` §2 declaran el front «con **MudBlazor**» y/o «en el **hosting público**». Ningún `.csproj` referencia MudBlazor (`git grep -il mudblazor -- '*.csproj'` sólo da el comentario de `GeometriaFactory.Web.csproj` l.9–17, que declara el apartamiento de **no** introducirlo), y el canal vigente son contenedores del servidor propio (`deploy-front-ftp.yml` l.26–31) | manifiesto §2.A, §2.B; `SDD/Docs/README.md` §2.1, §3; `src/GeometriaFactory.Web/GeometriaFactory.Web.csproj` | 00, 02 |
| O-24 | `PRODUCT-MANIFEST` l.231: «las **seis** aristas internas del backend —las de §2.B que no tocan a `Contracts` ni al `Visor`—». Los `.csproj` dan **cinco**: Application→Domain, Infrastructure→Domain, Infrastructure→Application, Api→Application, Api→Infrastructure | manifiesto §3; `src/*/GeometriaFactory.*.csproj` | 02 |
| O-25 | `Vista-Producto.md` §5 (l.203), §6 (l.225) y RI-02 (l.235) citan sólo `Api ADR-00008` «sin versionado de rutas»; ADR-00008 está «Superado parcialmente» por `ADR-00010` desde el 2026-09-12 y `ContractRoutePrefix.Value = "/v1"` (l.42, `de0b73b`, PR #195). La guía de publicación 1.5 §5 (l.173) sigue fijando «Rutas con prefijo o sufijo de versión: Exactamente **0**» sobre «los **quince** puntos» | `SDD/Docs/Producto/Vista-Producto.md`; `src/GeometriaFactory.Api/Endpoints/ContractRoutePrefix.cs`; `Api/09-Devops/Guia-Publicacion-Image-Docker.md` | 02, 08 |
| O-26 | `Api/05/Arquitectura-Unidad-Entrega.md` l.922: «ADR-00001 a ADR-00010, las **diez**»; la carpeta tiene `ADR-00011` y `ADR-00012`, y el mismo documento cita `ADR-00011` en l.760. `Web/05/Arquitectura-Unidad-Entrega.md` l.497 lista ADR-10001…10007; existen `ADR-10008` y `ADR-10009`, y el documento no nombra ninguna de las dos (0 apariciones) | las dos `Arquitectura-Unidad-Entrega.md`; sus `Adrs/` | 02 |
| O-27 | `Directory.Build.props` l.5 «los **seis** proyectos .NET» y l.51 «los treinta y un proyectos de la solución»; `.editorconfig` l.1 «para los seis proyectos». La solución tiene 31 `.csproj` | `Directory.Build.props`; `.editorconfig`; `GeometriaFactory.sln` | 02, 08 |
| O-28 | `CompositionRoot.cs` se contradice dos veces. Remarks l.21: «**3 de 4** puertos conectados»; l.137–144 registra los cuatro (`IFigureValidator` incluido). Remarks l.31: «Si no llega, el servicio **arranca** y no emite ningún acceso»; l.151–177 lanza si `SigningKey` falta o mide menos de 32 bytes («EL ARRANQUE SE DETIENE»), y `SigningKeyStartupTests` (4 pruebas) lo fija. La guardia es de `39b0f61` (PR #38, 2026-08-15) | `src/GeometriaFactory.Api/Composition/CompositionRoot.cs`; `tests/GeometriaFactory.Integration.Tests/SigningKeyStartupTests.cs` | 02, 06 |
| O-29 | `Vista-Producto.md` l.21 (índice): «3.1 La discrepancia del grafo, y por qué **sigue abierta**»; el encabezado l.139: «… y **cómo se cerró**» | `SDD/Docs/Producto/Vista-Producto.md` | 02 |

### 3.3 Dominio, contrato y superficie HTTP

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-18 | Recuento de códigos del contrato en tres versiones: intake 5.1 l.829 y l.1207 «diecisiete vivos sobre veinte emitidos»; `Contratos-REST.md` 1.11 l.205 y l.310 «diecisiete» y **0** apariciones de `EMAIL_DOMAIN_NOT_ADMITTED`, aunque su §6 exige que un código nuevo entre a la tabla de §5; `Contratos-Abstractions.md` 1.4: §5.1 (l.103) «Los **dieciocho**», pero su índice (l.23) y l.143 siguen en «diecisiete vivos» y «veinte emitidos». El código, 16 (O-3) | intake; `Api/05-Arquitectura-Tecnica/Contratos-REST.md`; `SDD/Docs/Producto/Contratos-Inter-Unidad/Contratos-Abstractions.md` | 00, 04 |
| O-19 | `Api/02/Glosario-Funcional.md` l.65–68: «**quince** puntos», «**diez** códigos de respuesta», «**diecisiete**» códigos. Contratos-REST declara 17 puntos y el código 16 constantes. El glosario no tuvo commits entre `89f3ab3` y `4b114d7` | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/Glosario-Funcional.md` | 10 |
| O-30 | `Account.cs` l.98 declara `CredentialChangedAt` (`7c94988`, PR #212; migración `20260914112430_CredentialChangedAt`). `Definicion-Modelo-De-Dominio.md` y `Modelo-Datos-Logico.md` 1.1 (2026-08-10) tienen **0** apariciones. Es la deuda `DD-R9-5` (R-23), cuyo evento de cierre («próxima migración») ya ocurrió | `src/GeometriaFactory.Domain/Entities/Account.cs`; `Api/02/Definicion-Modelo-De-Dominio.md`; `Api/05/Modelo-Datos-Logico.md`; `Audit/Mesa-2026-09-14.md` l.249 | 03, 06 |
| O-31 | `Definicion-Contrato-Del-Validador-De-Figuras.md` §9 (l.158) da por abierto «el valor derivado del área de una pieza volumétrica»; `ADR-06006` l.23 lo cierra («la forma canónica es la suma de los componentes») | `Api/02/Definicion-Contrato-Del-Validador-De-Figuras.md`; `Api/05/Adrs/ADR-06006-…md` | 03 |
| O-32 | `ConditionCode.cs` l.3 de los remarks: «ACÁ ESTÁN LOS **TREINTA Y TRES**»; la clase declara **37** constantes | `src/GeometriaFactory.Domain/Values/ConditionCode.cs` | 03 |
| O-33 | `CREDENTIAL_ALREADY_SET` está declarada (`ConditionCode.cs`), descrita en `DX-Error-Messages.md` (l.439, l.591, l.1012, l.1142) y esperada por `Casos-Prueba-Referenciales.md` l.722, pero **ningún código la emite**: `git grep CredentialAlreadySet -- src` sólo da la declaración | `ConditionCode.cs`; `Api/03-UX-UI-DX/DX-Error-Messages.md`; `Api/08-Calidad-Y-Pruebas/Casos-Prueba-Referenciales.md` | 03 |
| O-34 | `Contratos-REST.md` l.189 dice que el front «**no reenvía** la dirección del navegador», y lo mismo dicen los remarks de `ContractRateLimiting.cs` (l.47) y `CredentialAttemptThrottle.cs` (l.14). Desde `ed097f8` (PR #216, `Web ADR-10009`) el front sí la reenvía: `Web/Program.cs` l.199 y l.215 conectan `BrowserOriginForwardingHandler` | `Contratos-REST.md` §4.1; los dos `.cs` de `Api/Composition/`; `src/GeometriaFactory.Web/Program.cs` | 04 |
| O-35 | Recuento de la guardia en tres versiones: `Contratos-REST.md` §3 l.99 «cinco… y **doce** bajo la guardia», con A-05 como «`Alumno` o `Administrador`» (l.84); `Definicion-Superficie-HTTP.md` 1.15 l.114 «cinco… A-05 admite las dos formas y los **diez** restantes… Cinco más uno más diez son dieciséis», sobre «**Diecisiete** puntos», y su índice (l.19) dice «Los dieciséis». El código: **6** `AllowAnonymous` (A-05 incluido, `AccountEndpoints.cs` l.344) y **11** `RequireAuthorization` | `Contratos-REST.md` §3; `Api/02/Definicion-Superficie-HTTP.md`; `src/GeometriaFactory.Api/Endpoints/*.cs` | 04 |
| O-36 | `Contratos-REST.md` §2.1 (l.46–52): el contrato «no [se declara] en una descripción formal de servicio». El servicio publica `/openapi/v1.json` (`Composition/ApiDocumentation.cs`, ADR-08008), y desde `c392531` (PR #217) declara el esquema Bearer | `Contratos-REST.md` §2.1; `src/GeometriaFactory.Api/Composition/ApiDocumentation.cs` | 04 |
| O-37 | Comentarios de código con recuentos vencidos: `HealthEndpoint.cs` l.12 «una de las **CUATRO** ausencias declaradas de la guardia»; `PendingPasswordChangeGuard.cs` l.60 «Los **cuatro** puntos que no exigen acceso» (son cinco sin A-05, seis con A-05); `ContractErrorHandler.cs` l.26 «§5.1 declara **dos** respuestas sin código», y `Contratos-REST.md` §5.1 tiene tres filas (`401`, `400`, `429`, l.237–239) | los tres `.cs`; `Contratos-REST.md` §5.1 | 04 |
| O-38 | `Mesa-2026-09-15.md` D-3 «Aplicado» (l.54): «la API, **lo mismo**». El front pone `Referrer-Policy: strict-origin-when-cross-origin` (`Web/Integration/SecurityHeaders.cs` l.33) y la API `no-referrer` (`Api/Composition/SecurityHeaders.cs` l.31). R-06 de `Mesa-2026-09-14.md` (l.139) pedía la CSP primero en `Report-Only`; `git grep Report-Only -- src` da 0 | las dos `SecurityHeaders.cs`; `Audit/Mesa-2026-09-15.md`; `Audit/Mesa-2026-09-14.md` | 04, 06 |
| O-39 | El intake (l.906) declara los reclamos «Identificador de usuario, correo, rol, expiración», y `ADR-00009` habla de «la credencial de **cuatro** reclamos» (l.72, CA-06 l.115). `AccessTokenIssuer.cs` l.82–95 emite `sub`, `email` y el rol, más `iss`, `aud`, `iat`, `nbf` y `exp`, y la revocación de REF-02 depende de `iat` (`PendingPasswordChangeGuard.cs` l.96–101) | intake; `Api/05/Adrs/ADR-00009-…md`; `src/GeometriaFactory.Infrastructure/Security/AccessTokenIssuer.cs` | 06 |

### 3.4 Front y visor

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-40 | `App.razor` l.12–14: «`Ingreso` es la **ÚNICA** superficie que se dibuja así; las demás siguen declarando `@rendermode InteractiveServer`». De las 14 páginas con `@page`, sólo **6** lo declaran; 8 no (SignIn, AccountRegistration, OwnCredentialForcedChange, AccountsPanel, StudentWorkPanel, WorkSubmission, ClassSubmissionList, WorkView). `WorkResolution.razor` l.29–31 lo admite: «sólo SEIS declaraban» | `src/GeometriaFactory.Web/App.razor`; `Components/Pages/*.razor`; `Components/Work/WorkResolution.razor` | 05 |
| O-41 | El intake 5.1 l.339 declara retención, respaldos de como máximo un cuatrimestre, finalidad y supresión, y cierra: «El registro del front informa **todo esto** antes del envío (`Web`, PR #229)». El aviso de `AccountRegistration.razor` no menciona retención ni respaldos, y su comentario (l.149–150) dice que eso «lo redacta el Product Owner en el intake» | intake §10; `src/GeometriaFactory.Web/Components/Pages/AccountRegistration.razor` | 05, 06 |
| O-42 | Tres textos del visor lo dan por vacío «en la etapa `a`»: `visor/package.json` («bundle vacío pero real»), `visor/src/viewer/README.md` l.3 («está vacía») y `visor/webpack.config.js` l.3 («no hay motor gráfico todavía»). La carpeta tiene `instance.ts` (404 líneas), `meshes.ts` (200) y `palette.ts` (60), y `three` 0.169.0 es dependencia | `visor/package.json`; `visor/src/viewer/README.md`; `visor/webpack.config.js` | 02, 05 |
| O-43 | `ADR-10008` tiene dos fechas: cabecera `**Fecha:** 2026-09-13` (l.7) y «**Aprobado** desde 2026-09-12» (l.38). Además el código le atribuye el sello `?v=` (`WorkView.razor` l.71, target `SealVisorAsset` del `.csproj` l.102), y el ADR no lo menciona (`grep -ciE 'sello|\?v='` → 0) | `Web/05/Adrs/ADR-10008-…md`; `src/GeometriaFactory.Web/GeometriaFactory.Web.csproj`; `WorkView.razor` | 02, 05 |
| O-44 | **11 archivos** de `src/GeometriaFactory.Web` citan rutas `SDD/Docs/Proyectos/…` (11 apariciones), que no existen (`git ls-files SDD/Docs/Proyectos` → 0). Es el mismo residuo de O-7, fuera de `samples/` | `git grep -l 'SDD/Docs/Proyectos' -- src` | 05 |

### 3.5 Persistencia, respaldo y despliegue

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-45 | `Api/09/Entornos-Deploy.md` §11.1 (l.466): «No se declara ninguna frecuencia, **ninguna retención**…», y presenta `scripts/respaldo-almacen.sh` como lo que cumple el respaldo (l.461). El intake 5.1 l.339 declara respaldos antes de cada despliegue y al cierre de cuatrimestre, conservados como máximo un cuatrimestre, y l.352 dice que el mecanismo «lo implementa el Product Owner en su despliegue». `DD-R9-1` confirma que «el guion no es el mecanismo que rige» | `Api/09-Devops/Entornos-Deploy.md`; intake §10, §11; `Audit/Mesa-2026-09-14.md` l.245 | 06 |
| O-46 | `deploy/Dockerfile.web` l.25: «El `.csproj` del front **NO** invoca a `npm`»; l.69–71: el `.csproj` «genera el bundle por sí mismo (`BuildVisor`)», y `GeometriaFactory.Web.csproj` l.77 lo declara. **Ya registrada** como R-22 de `Mesa-2026-09-14.md` (P3, «`Dockerfile.web`:25») | `deploy/Dockerfile.web`; `GeometriaFactory.Web.csproj` | 06, 08 |
| O-15 | Documentos de Web que siguen dando el hosting como canal: `Web/09-Devops/README.md` l.64 «La **única** imagen de contenedor del producto es la del backend» (existe `deploy/Dockerfile.web`) y l.110 «Ambientes 2: contenedor de desarrollo y hosting público»; `Web/09/Entornos-Deploy.md` l.33 «La única unidad desplegable» y l.100 el FTP como «la única pieza de automatización», con **0** apariciones de `Dockerfile.web`; `ADR-10002` l.17 y l.44 fundan la decisión en que «el hosting gratuito… resetea el estado» (registrado como R-22) | los tres documentos de `Unidades-Entrega/GeometriaFactory-Web/` | 01, 08, 11 |
| O-16 | `deploy-front-ftp.yml` l.4: «EL FILTRO DE RUTAS LLEVA TRES ENTRADAS», y `on:` sólo tiene `workflow_dispatch` desde `b180b76`; l.34: «Los **cinco** secretos», y el flujo lee **seis** (`API_BASE_URL`, `FTP_PASSWORD`, `FTP_SERVER`, `FTP_SERVER_DIR`, `FTP_USERNAME`, `PUBLIC_URL`); l.113: «`Program.cs` linea 70 lee `ApiBaseUrl`», y la lectura está en l.204. `Pipeline-Producto.md` §4 (l.133) sigue afirmando el filtro | `.github/workflows/deploy-front-ftp.yml`; `src/GeometriaFactory.Web/Program.cs`; `SDD/Docs/Producto/Pipeline-Producto.md` | 08 |
| O-17 | `deploy/compose.yaml` sigue descrito como «despliegue desde Git en destino» en `Api/09/Entornos-Deploy.md` l.92 y en la guía de publicación l.61, mientras el archivo se declara «COMPOSICIÓN DE VERIFICACIÓN — no es la de despliegue» (l.1) | `deploy/compose.yaml`; los dos documentos de `Api/09-Devops/` | 08 |
| O-47 | La guía de publicación l.37: «El intake **§13** lo declara… en su fila «Despliegue manual del backend»». La fila está en l.336, dentro de **§10** (l.325); §13 empieza en l.392 | `Api/09-Devops/Guia-Publicacion-Image-Docker.md`; intake | 08 |
| O-48 | `Mesa-2026-09-14.md` conserva `DD-R9-7` con «R-03, R-05 con REF-02 y R-07» (l.251) y «Detalle reservado: R-03, R-05 con REF-02, R-07» (l.311), aunque su fila 1.3 (l.323) «Publica el detalle de R-03 y de R-05 con REF-02» | `SDD/Docs/Audit/Mesa-2026-09-14.md` | 06 |
| O-74 | La guía de publicación 1.5 §5 (l.173) adopta la métrica de `ADR-00008` §8 «Rutas con prefijo o sufijo de versión: exactamente **0**», sobre la «inspección de los **quince** puntos»; la superficie tiene 17 puntos y 16 cuelgan de `/v1` (`ContractRoutePrefix.Value`) desde `ADR-00010` | `Api/09-Devops/Guia-Publicacion-Image-Docker.md`; `src/GeometriaFactory.Api/Endpoints/ContractRoutePrefix.cs` | 08 |

### 3.6 Pruebas, puertas y versionado

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-49 | `GeometriaFactory.E2ETests.csproj` l.6: «**NO SE AGREGA A `GeometriaFactory.sln` A PROPOSITO**»; la solución lo declara (l.54) desde `6cc6f86`, cuyo mensaje dice haber reescrito los textos «NO ENTRA EN GeometriaFactory.sln» | `tests/GeometriaFactory.E2ETests/GeometriaFactory.E2ETests.csproj`; `GeometriaFactory.sln` | 07 |
| O-50 | `verify-stage-h.sh` l.128: «Las etapas `d`, `e` y `f` siguen sin guion propio»; existen `verify-stage-d.sh` (101 líneas), `-e.sh` (68) y `-f.sh` (122), y `ci.yml` corre d y e (l.92, l.94) | `scripts/verify-stage-*.sh`; `.github/workflows/ci.yml` | 07 |
| O-51 | `pruebas-e2e.runsettings` l.52 manda copiar la evidencia «a `evidencia/<fecha>/`»; esa carpeta se retiró de la raíz en `3662bf9` (PR #207) y `git ls-files 'evidencia/*'` da 0 | `pruebas-e2e.runsettings`; `changelog.md` | 07 |
| O-52 | **31** apariciones de `**Condicionado` en `Api/08-Calidad-Y-Pruebas` (Criterios-Validacion 16, Estrategia-Calidad 11, README 4) para puertas de cobertura que `D1` volvió bloqueantes y que `ci.yml` corre (l.87, `coverage.sh`). Está registrado como `RE-04` **pendiente** en `Decisiones-Y-Frases-Retiradas.md` l.75 | `Api/08-Calidad-Y-Pruebas/*.md`; `SDD/Docs/Audit/Decisiones-Y-Frases-Retiradas.md` | 07 |
| O-53 | Los rótulos QG del instrumento de cobertura no coinciden con la numeración por proyecto: `tools/informe-cobertura.cs` llama `QG-03` a la cobertura y `QG-04` a la pirámide, mientras `Estrategia-Calidad.md` §3 usa `QG-04` en Domain para la inspección de dependencias (l.194) y en Application para «ninguna prueba toca la base» (l.215), y en Infrastructure `QG-03` es la batería del validador (l.240) y la cobertura es `QG-05` (l.242) | `tools/informe-cobertura.cs`; `Api/08/Estrategia-Calidad.md` §3 | 07 |
| O-54 | `verify-stage-i.sh` l.38: «el criterio de `I-4` no es que la medición dé bien»; la misma cabecera define la medición como `I-3` (PT-05) y la l.281 dice «EL CRITERIO DE I-3» | `scripts/verify-stage-i.sh` | 07 |
| O-55 | Los dos `Pipeline-CI-CD.md` (Api 3.11 y Web 3.9, ambos del 2026-09-13) tienen **0** menciones de `coverage.sh`, `verify-stage-d` y `verify-solution-tree`, que `ci.yml` corre (l.75, l.87, l.92). `changelog.md` lo declara | los dos `09-Devops/Pipeline-CI-CD.md`; `ci.yml` | 07 |
| O-56 | `scripts/build.sh` l.15–16 remite a `verify-explicit-configuration.sh` para comprobar la regla. Corrido sobre `4b114d7`: «**NO CONFORME · 2 control(es) fallan**» — C-1 en `scripts/coverage.sh:51` y C-2 en `.github/workflows/e2e.yml:111`. El guion no corre en `ci.yml` y su lista de objetivos (l.44–52) no incluye `deploy/Dockerfile.web` | `scripts/verify-explicit-configuration.sh` (salida medida); `ci.yml` | 08 |
| O-57 | Estrategia-Versionado §3.c (fijada el 2026-09-12): «Toda fusión a `main` que cambie código de producción recibe una etiqueta». En `v1.0.0..4b114d7` hay 37 fusiones de primer padre; **11 tocan `src/`** y **8 no tienen etiqueta**: PR #211, #212, #214, #216, #217, #220, #222 y #229. Con el criterio ampliado (`*.csproj`, `deploy/Dockerfile*`…) podrían ser más: **no verificado** | `Api/09-Devops/Estrategia-Versionado.md` §3.c; `git rev-list` + `git tag --points-at` | 08 |

### 3.7 Samples, nomenclatura y auditorías

| O | Hecho medido | Fuentes | Índice |
| --- | --- | --- | --- |
| O-59 | `samples/README.md` 2.1: §3 deja `api/01-basico` en «11/13 con divergencias» (l.68), cuando su README local (l.6) dice «las 13 líneas coinciden»; la fila de `web/01-datos-seed` está partida en dos líneas (l.75–76) y la tabla se rompe; §5 (l.91) habla de «las **siete** carpetas» con escenarios `.txt`, y hay **52** archivos `E[1-8].txt` en **11** carpetas | `samples/README.md`; `samples/api/01-basico/README.md` | 09 |
| O-60 | Los tres `contracts/0N/README.md` (y `samples/README.md` l.59–61) dan `dotnet run --project samples/contracts/0N`, sobre un `.csproj` con `Sdk="Microsoft.Build.NoTargets/3.7.56"`, que no produce ejecutable. Va en línea con «Esqueleto — sin código» | `samples/contracts/0N/` | 09 |
| O-61 | `Norma-De-Nomenclatura.md` §6.8.6 se titula «Los **22**» (l.653) y tiene 22 filas `CONTRATO_` (l.653–683), pero §5 (l.254) sigue en «los 101… los **21** de contrato», §6.8 en «(101)» (l.39, l.532) y los encabezados §6.12–§6.15 en «fuera de los **155**» | `SDD/Docs/Producto/Norma-De-Nomenclatura.md` | 10 |
| O-62 | La regla del glosario de la norma (§6.1, l.330) dice «El rango son las **diecisiete** tablas», y las seis secciones §6.21–§6.26 agregadas por las versiones 1.18 a 1.31 quedan afuera | Norma §6.1, §7 `V-1` | 10 |
| O-63 | Norma §3, regla de forma 3: «Un solo nivel de subsegmento». En `src/` hay 11 archivos con `namespace …Infrastructure.Persistence.Migrations` y 5 con `…Persistence.Configurations` | Norma §3, §6.11; `src/GeometriaFactory.Infrastructure/Persistence/` | 10 |
| O-64 | Norma §6.10 declara `GeometriaFactory.Infrastructure.Validation`; no existe ningún namespace `Validation`, y el validador vive en `namespace GeometriaFactory.Infrastructure.Figures` (`Figures/LocalFigureValidator.cs`, `421f3da`), que la norma no nombra (0) | Norma §6.10 | 10 |
| O-65 | Norma §6.11 (l.764) declara `FigureViewer.razor`; `git grep FigureViewer -- src tests` da 0 | Norma §6.11 | 10 |
| O-66 | Norma §6.11: «toda carpeta y todo archivo bajo `src/`, `tests/` o `visor/` va en inglés»; los **13** `.cs` de `tests/GeometriaFactory.E2ETests/` tienen nombre castellano (`IngresoTests.cs`, `BancoLocal.cs`…), con la carpeta `Infraestructura/`; la norma no menciona E2E (0) | Norma §6.11; `tests/GeometriaFactory.E2ETests/` | 10 |
| O-67 | `RT-06` con dos sentidos: el intake (l.548) y la norma §5.3 la usan para «las dos se despliegan juntas ante un cambio de contrato»; la única RT-06 declarada (`Web/02/Especificacion-Funcional.md` l.220) dice «La pieza pública no guarda estado propio» | intake; Norma §5.3; `Web/02-Especificacion-Funcional/Especificacion-Funcional.md` | 10 |
| O-68 | Prefijos de familia de las mesas: `Mesa-2026-09-14.md` declara `RN9-` (l.9) y nombra sus 24 hallazgos `R-01`…`R-24` (`RN9-` aparece 4 veces); `Mesa-2026-09-15.md` declara `RN10-` y lo usa 1 vez. «Prefijo de familia» da 0 en cinco de las doce mesas (08-27, 08-29, 08-31, 09-01-C, 09-02) | `SDD/Docs/Audit/Mesa-*.md` | 10 |
| O-69 | La norma usa `R-3` y `R-4` con dos sentidos: §8.1 (l.2310) define `R-3` como «Clase 4: las 6 funciones de la fachada», y el recuadro de l.2225 dice «`R-3` —los códigos de condición»; l.2196 llama `R-4` al renumerado de QG/CV | Norma §8, §8.1 | 10 |
| O-58 | `Mesa-2026-09-13.md` cierra con «Deuda declarada: 7 (DD-1 a DD-7)» (l.245) y su tabla §8 tiene **9** filas `DD-`; la actuación 004 de `SDD/Expedientes/0001-…/README.md` (l.33) resume «6 deudas» | `SDD/Docs/Audit/Mesa-2026-09-13.md`; `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/README.md` | 11 |
| O-70 | `B-02-03-GeometriaFactory-Api-r1.md` l.61: «**quince** hallazgos: un P0, cinco P1, seis P2 y cinco P3» (suma 17); el documento tiene 17 encabezados `#### \`B-API-` | `SDD/Docs/Audit/B-02-03-GeometriaFactory-Api-r1.md` | 11 |
| O-71 | `Informe-Migracion-13.7-a-13.16.md` l.7 habla de «dos rondas… y una tercera» del auditor independiente; l.78 dice que la Ronda 3 la corrió el orquestador «y no un auditor independiente», y l.134 suma una «Ronda 4, acotada», también del orquestador | `SDD/Docs/Audit/Informe-Migracion-13.7-a-13.16.md` | 11 |
| O-72 | El evento de cierre de `DD-5` («Próxima fila de control de cambios del intake», `Mesa-2026-09-13.md` l.206) ocurrió con la fila 5.1 del 2026-09-15, y `visor.bundle.js` sigue apareciendo **5** veces en el intake | `Audit/Mesa-2026-09-13.md`; intake | 11 |
| O-73 | La tabla de deuda de `Mesa-2026-09-15.md` (l.87) tiene las columnas Id, Qué falta, Quién y Evento de cierre; le faltan «Por qué no hoy» y «Ciclo de origen», que la de `Mesa-2026-09-14.md` (l.243) sí trae | las dos mesas | 11 |

**Huecos de numeración.** No hay hueco: O-10 a O-74 se asignaron a divergencias admitidas; el orden
no es cronológico sino el de la consolidación, agrupada por tema en las tablas.

## 4. Candidatas que no se admitieron, y por qué

| Candidata | Por qué no entra |
| --- | --- |
| «R-07 tiene el mecanismo fusionado pero no está vigente» | No es divergencia: `appsettings.json` l.14 (`AdmittedEmailDomains: []`), `RegisterAccountUseCase.cs` l.40 y `Mesa-2026-09-14.md` l.140 dicen lo mismo: **no rige hasta que el PO declare el dominio**. Es estado declarado |
| «El rótulo "401 de la guardia" no corresponde a la guardia del código» | Homonimia, no contradicción medible: `Contratos-REST.md` §5.1 llama guardia a la de `CU-00002` (credencial ausente o vencida), y `PendingPasswordChangeGuard` es otra pieza. No hay cifra ni afirmación que refutar |
| «El changelog declara Application 56 y el fuente da 61» | La entrada es del 2026-09-14 por la mañana (l.1909–1920); `203c4e9` (R-07, 16:14 del mismo día) agregó las pruebas. Antes de ese commit, 48 `[Fact]` + 8 `[InlineData]` = **56**: la cifra era correcta a su fecha. Lo que sí es cierto es que ninguna entrada posterior publica el recuento nuevo (61) |
| «El glosario funcional repite §3.1 y §3.2» | Los `### 3.1`/`### 3.2` repetidos son subsecciones por proyecto (l.149–309): es jerarquía de encabezados mal nivelada, no numeración duplicada del mismo nivel. Se conserva sólo la parte de cifras (O-19) |
| «samples/README §5: 49 archivos `.txt`» (índice 09, primera versión) | Recontado: son **52** en 11 carpetas. Entró la versión corregida (O-59) |
| Duplicados entre índices | MudBlazor (00 y 02) → O-14; `Vista-Producto` 45 ADR (02 y 11) → O-2; visor sin solución y manifiesto 2.2 (00 y 01) → O-12; README §7.2 (00 y 11) → O-13; fechas de cabecera (00, 01, 08, 10, 11) → O-20; `ErrorCode` 16 vs 18 (04) → O-3; aviso de registro (05 y 06) → O-41; `Dockerfile.web` y npm (06 y 08) → O-46; D-3 de la mesa (04 y 06) → O-38; `package.json` del visor (02 y 05) → O-42; `Directory.Build.props` (02 y 08) → O-27 |

## 5. Correcciones a la propia ia-db 3.0

La evidencia manda sobre el índice, y eso vale también hacia atrás. Tres afirmaciones de la 3.0 eran
falsas **ya en `89f3ab3`**:

| Afirmación de la 3.0 | Lo que dice el árbol | Instrumento |
| --- | --- | --- |
| 06 l.133: «Sin `AccessToken__SigningKey` el ingreso falla, y falla al usarlo: **el arranque no la exige**» | El arranque **se detiene** si la clave falta o mide menos de 32 bytes, desde `39b0f61` (PR #38, 2026-08-15). La 3.0 repitió el remarks contradictorio de O-28 | `git show 89f3ab3:src/GeometriaFactory.Api/Composition/CompositionRoot.cs \| grep -n SigningKey` → l.165, 168, 173, 177, iguales en `4b114d7` |
| 05 l.150: `src/main.ts` «(fachada, **114** líneas)» | **137** líneas en `89f3ab3` y en `4b114d7` | `git show 89f3ab3:visor/src/main.ts \| wc -l` |
| 12 §1: «los cinco controles conformes» (citado de `changelog.md`) | Hoy el guion da **NO CONFORME**, 2 controles fallan (O-56). No se sabe si en `89f3ab3` daba conforme: la 3.0 no lo corrió | `bash scripts/verify-explicit-configuration.sh` sobre `4b114d7` |

## 6. Lo que sí cuadró, y conviene decirlo

- **Los diecisiete puntos de acceso** del código (6 `AllowAnonymous` + 11 `RequireAuthorization`)
  coinciden en el **total** con `Contratos-REST.md` §3 y con `Definicion-Superficie-HTTP.md`; lo que
  no cuadra es el reparto (O-35).
- **Las ocho aristas de compilación** siguen siendo ocho: los siete `ProjectReference` de `src/`
  (Application 1, Infrastructure 2, Api 3, Web 1) más `Visor → Web` por el target `BuildVisor`
  (`GeometriaFactory.Web.csproj` l.77).
- **Treinta y un proyectos** en `GeometriaFactory.sln`, los mismos 31 `.csproj` que da `git ls-files`.
- **Los treinta y siete códigos de condición** de `ConditionCode.cs` siguen siendo 37, como en la 3.0;
  lo que envejeció es su comentario (O-32).
- **`Dockerfile.web` sigue coherente con el código que describe**: `Web/Program.cs` l.204–206 lee
  `ApiBaseUrl` de la configuración y lanza si falta.
- **El cambio de canal del front quedó registrado** donde la 3.0 lo echaba de menos: `changelog.md`,
  la guía de publicación §2.2 y el propio flujo de FTP, que se declara alternativo y manual (O-9).
- **Cuatro de las nueve observaciones de la 3.0 se cerraron del todo** (O-4, O-5, O-6, O-8) y una a
  medias (O-7), cada una con su commit y su PR. Las de recuento en `Vista-Producto.md` y `ErrorCode`
  (O-1 a O-3) son las únicas que sobreviven, y las tres crecieron.

## 7. Cómo tratar estas observaciones

**La evidencia manda sobre el índice**: si al abrir una fuente contradice algo que esta base afirma,
**vale la fuente**, y la corrección se anota acá (§5 es el ejemplo). Ninguna de las divergencias de §2
y §3 se corrigió en el corpus desde esta base: **escribir sobre `SDD/`, `changelog.md`, `samples/` o
el código no es alcance de un indexado**, y sobre el intake y los requerimientos técnicos ni siquiera
es alcance de un agente.

El patrón dominante es el mismo que registró la 3.0, ahora medido en más de sesenta lugares: **un
recuento o un registro envejece en el documento que cita y no en el que produce** —cabeceras contra
control de cambios (O-20), comentarios de código contra el código que comentan (O-28, O-32, O-37,
O-49, O-50), cierres de mesa contra su tabla (O-58, O-70)—. Es el riesgo `RI-06` que el producto ya
tiene declarado en `Vista-Producto.md` §7. Varias están **ya registradas** como deuda o hallazgo en
el corpus (O-30 = `DD-R9-5`/R-23; O-15 y O-46 = R-22; O-52 = `RE-04`); el resto no tiene registro
encontrado. El detalle de cada tema vive en su índice: [01](01_Corpus-Documental-SDD.md),
[02](02_Arquitectura-Y-Proyectos.md), [03](03_Dominio-Y-Reglas-De-Negocio.md),
[04](04_Superficie-HTTP-Y-Contratos.md), [05](05_Front-Web-Y-Visor-3D.md),
[06](06_Persistencia-Y-Seguridad.md), [07](07_Pruebas-Y-Puertas-De-Calidad.md),
[08](08_DevOps-Construccion-Y-Despliegue.md), [09](09_Samples-Ejecutables.md),
[10](10_Glosario-Y-Nomenclatura.md) y [11](11_Decisiones-Auditorias-Y-Pendientes.md); la entrada
general es [00](00_MASTER-INDEX.md).
