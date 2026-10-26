# 07 · Pruebas y puertas de calidad — con qué se dice que algo anda

> **Propósito.** Las cuatro baterías, qué cubre cada una y cuántas pruebas tiene; las puertas
> que hay que pasar —de calidad, técnicas, de etapa y de árbol—, sus umbrales exactos, qué corre
> en la integración continua y cómo se corre cada instrumento.
> **Fuente primaria.** `tests/`, los cuatro `.csproj` de prueba, `GeometriaFactory.sln`,
> `scripts/test.sh`, `scripts/coverage.sh`, `tools/informe-cobertura.cs`, `coverlet.runsettings`,
> `pruebas-e2e.runsettings`, `scripts/verify-*.sh`, `scripts/lib-puerta.sh`,
> `.github/workflows/{ci,e2e}.yml` y las `Estrategia-Calidad.md` de las dos unidades de entrega.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`. **Ninguna batería ni
> ninguna puerta se corrió durante el indexado**: los recuentos son del fuente, con `git grep`.

---

## 1. Las cuatro baterías

Recuento de métodos anotados con `git grep -E '^\s*\[(Fact|Theory|Test|TestCaseSource)'` sobre
`4b114d7`. Los casos de `[Theory]` se cuentan sumando los `[InlineData]`; los de `[MemberData]`
salen en tiempo de ejecución y **no se pueden contar sin correr**.

| Batería | Marco | Métodos | Casos estáticos | Qué cubre | ¿En la solución? |
| --- | --- | --- | --- | --- | --- |
| `GeometriaFactory.Domain.Tests` | xUnit 2.9.2 | **67** (54 `Fact` + 13 `Theory`) | **94** (54 + 40 `InlineData`) | Entidades, invariantes, transiciones, y la **puerta de dependencias** (`DependencyGateTests`) | Sí, construye |
| `GeometriaFactory.Application.Tests` | xUnit 2.9.2 | **54** (50 + 4) | **61** (50 + 11) | Casos de uso y la **puerta de puertos** (`PortGateTests`) | Sí, construye |
| `GeometriaFactory.Integration.Tests` | xUnit 2.9.2 + `Mvc.Testing` 10.0.11 | **240** (212 + 28) | ≥ 298 (212 + 86) más tres teorías con `MemberData` | La superficie HTTP ensamblada, el front sobre servicio real, seguridad, almacén, composición | Sí, construye |
| `GeometriaFactory.E2ETests` | **NUnit 4.2.2 + Playwright 1.49.0** | **28** (28 `[Test]`, uno de ellos con `[TestCaseSource]`: sus casos sólo se conocen corriendo) | — | El navegador contra el producto entero | **Visible, sin construir**: nodo en la `.sln` sin `.Build.0` |

Los cuatro anclan `Microsoft.NET.Test.Sdk` 17.12.0. Los tres de xUnit llevan `coverlet.collector`
6.0.4 y `xunit.runner.visualstudio` 2.8.2; el de extremo a extremo, `NUnit3TestAdapter` 4.6.0 y
`NUnit.Analyzers` 4.3.0, y **no referencia ningún proyecto del producto** (su `.csproj` lo dice:
sólo ve lo que ve una persona).

**Total xUnit: 361 métodos. Con la cuarta batería, 389.** Contra la 3.0 (`89f3ab3`): Domain igual
(67), Application **+3** (51 → 54), Integración **+42** (198 → 240), E2E igual (28).

**Ninguna prueba está deshabilitada**: no hay `Skip =` en `tests/`, ni `[Ignore]`, `[Explicit]`
ni `Assert.Ignore` en la batería de NUnit (`ElLaboratorio.cs`:158-159 explica por qué se descartó
`Assert.Ignore`: una corrida en gris se lee como «no hizo falta probar»).

**Tres pruebas son puertas y no pruebas de comportamiento**: `DependencyGateTests` (7 métodos: que
ninguna capa referencie hacia afuera), `PortGateTests` (3: que los cuatro puertos sigan siendo la
frontera) y `CompositionGateTests` (4: que la composición de raíz conecte todo lo que declara).

**Cómo entró la cuarta batería a la solución.** El commit `6cc6f86` (2026-09-12, decisión del PO
del 2026-09-11) llevó la `.sln` de 9 a 20 proyectos y dejó `GeometriaFactory.E2ETests` «visible
sin `.Build.0`»: `GeometriaFactory.sln`:168-169 sólo le declaran `ActiveCfg`. Por eso
`scripts/test.sh` —que corre la solución— **no la construye ni la corre**. Hoy la `.sln` declara
**31 proyectos** (40 entradas `Project(`, nueve de ellas carpetas de solución); ver
[`02_Arquitectura-Y-Proyectos.md`](02_Arquitectura-Y-Proyectos.md).

### 1.1 La batería de integración, por familia

**Treinta y cinco clases de prueba y tres andamios** (`DataServiceHarness`, `PublicPieceHarness`,
`Scenarios`): los **38 archivos `.cs`** de `tests/GeometriaFactory.Integration.Tests/` (`git ls-files`). Los métodos de la tabla suman los 240 de §1. Las ocho marcadas con ★ entraron después de la 3.0.

| Familia | Clases (métodos) |
| --- | --- |
| Contrato y traducción | `ContractCoverageTests` (4), `ContractTranslationTests` (6, tres con `MemberData`), `ContractErrorHandlerTests` (4), ★ `ContractRoutePrefixTests` (6: la superficie contra el contrato en las dos direcciones, con el prefijo `/v1/` de `ADR-00010`) |
| Trabajos y cuentas | `WorkSurfaceTests` (31), `WorkWebSurfaceTests` (13), `AccountLifecycleSurfaceTests` (18), `AccountLifecycleWebSurfaceTests` (8), `AdministratorLifecycleTests` (6), ★ `RegistrationDomainTests` (3: el autorregistro admite sólo los dominios declarados, `Api ADR-00012`, `R-07`) |
| Sesión y credencial | `SessionCookieTests` (7), `SessionCredentialTests` (4), `SigningKeyStartupTests` (4), `ForcedPasswordChangeTests` (4), `ForcedPasswordChangeSurfaceTests` (4), `ProvisionalPasswordTests` (5) |
| Guardianes y borde | `PanelSessionGateTests` (6), `ProvisioningGateTests` (11), `SecurityGuardsTests` (11), ★ `RateLimitingTests` (17: límite de tasa de `BT-00029` y `ADR-00011`), ★ `BrowserOriginForwardingTests` (3: el front reenvía el origen del navegador, `R-02`), ★ `SecurityHeadersTests` (3: cabeceras de seguridad en las dos piezas, HSTS sólo por `https`, `R-06`/D-3) |
| Almacén | `StoreHealthTests` (4), `StoreJournalModeTests` (2), `HealthEndpointStoreTests` (1), ★ `CredentialChangedAtMigrationTests` (1: una transformación de esquema sobre un almacén con datos, `R-10`) |
| Interpretación | `FigureDerivationTests` (9), `FigureValidatorBatteryTests` (14), `TextTreeTests` (9), ★ `FigureTextReadingTests` (3: lo que el alumno puede escribir mal; las pruebas que llevaron `QG-06` de 94,2 % a 99,1 %) |
| Presentación | `DeclaredDateControlTests` (3), `SurfaceInteractionTests` (4), ★ `VersionSealTests` (3: el sello de versión, `CMP-09`, `R-14`) |
| Documentación de la superficie | `ApiDocumentationSurfaceTests` (5) |
| Composición | `CompositionGateTests` (4) |

Fuentes de la columna «qué»: el `<summary>` de cada clase nueva y `changelog.md` (entradas del
2026-09-13 al 2026-09-15).

### 1.2 Las ocho clases de la batería de extremo a extremo

| Clase | Métodos | Qué mira |
| --- | --- | --- |
| `IngresoTests` | 3 | La puerta del laboratorio: entrar, y que no se entre |
| `NavegacionTests` | 6 | Que cada destino exista y se llegue, y que el que no existe se comporte (uno parametrizado por `RutasDelPanel`, `TestCaseSource`, línea 44) |
| `RecorridoDelAlumnoTests` | 1 | El camino completo del alumno: registrarse, entrar, cargar, corregir y reenviar |
| `ResolucionDelTrabajoTests` | 3 | Resolver una entrega: el recorrido que el docente hace todos los días |
| `FiguraQueNoSePudoLeerTests` | 2 | Qué le dice el producto al alumno cuando no reconoce las claves |
| `EstadoDelLaboratorioTests` | 5 | Lo que el laboratorio declara de sí mismo, sin sesión |
| `VentanaMuertaTests` | 2 | **Los segundos entre que la pantalla se dibuja y el circuito engancha** |
| `DisenoResponsivoTests` | 6 | Lo que el sistema visual promete por debajo de 768 px |

Infraestructura propia en `Infraestructura/`: `BancoLocal` (levanta el producto entero),
`ElLaboratorio` (la fachada de siembra y limpieza), `PruebaE2E` (la base común),
`ArranqueDeLaSuite` y `ParalelismoDelEnsamblado`.

**Lo que cambió en la infraestructura desde la 3.0:**

- **Se espera una condición del producto, no un evento de carga.** `PruebaE2E` ya no hace
  `WaitForLoadStateAsync(LoadState.Load)` tras el ingreso: sondea cada 100 ms, hasta 30 s, que la
  página **salga de `/ingreso` o muestre un `role="alert"`**. El evento de carga se agotaba en el
  banco local de CI «dos corridas de tres» (`changelog.md`, entradas del 2026-09-14). La misma
  corrección se aplicó a `RecorridoDelAlumnoTests` y `NavegacionTests`.
- **Los clientes HTTP de siembra hablan con `/v1/`** (`ElLaboratorio`, `BancoLocal`), por
  `ADR-00010`.
- **El bundle del visor ya no lo genera `build-visor.sh` antes de probar**: lo genera
  `GeometriaFactory.Web.csproj` (target `BuildVisor`, `BeforeTargets="BeforeBuild"`: antes de compilar,
  sólo si cambió una fuente del visor; se apaga con `-p:SkipVisorBuild=true`), y por eso llega al
  publicar el front (`Web ADR-10008`; `GeometriaFactory.Web.csproj`:55-60 y 77).
- `PruebaE2E.EsperaDelCircuito` = **30 000 ms**; la traza se graba siempre y se conserva sólo si
  el caso falla (se apaga con `TRAZAR=false`).

## 2. Cómo se corre cada cosa

```bash
bash scripts/verify-solution-tree.sh   # el árbol de solución (DC-5); no necesita .NET
bash scripts/build.sh                  # QG-01 · restore → build -c Release, con el bundle del visor
bash scripts/test.sh                   # QG-02 · dotnet test GeometriaFactory.sln --configuration Release
bash scripts/coverage.sh               # QG-03, QG-06 y QG-04 · cobertura, validador y pirámide
bash scripts/pruebas-e2e.sh [chromium|firefox|webkit]   # la cuarta batería, en contenedor
```

**Todo se prueba en `Release`**, y está declarado (`scripts/test.sh`): `Release` es lo que produce
`build.sh` y lo que verifican las puertas. Probar sin decirlo mediría la salida de `Debug` —otra
salida, de otra antigüedad— y la batería quedaría verde sobre algo que no se despliega.

**El navegador de `pruebas-e2e.sh` es hoy un argumento posicional** (o `NAVEGADOR=`), no un
`-- Playwright.BrowserName=…` como registraba la 3.0; el guion rechaza con salida 2 cualquier otro
valor que `chromium`, `firefox` o `webkit`. La imagen es `gf-e2e:local` (o `IMAGEN_E2E`), se
construye desde `deploy/e2e/Dockerfile` la primera vez, y corre con `--network host`.

### 2.1 Los dos modos de la batería de extremo a extremo

| Modo | Cómo se dispara | Qué toca |
| --- | --- | --- |
| **Banco local** | `scripts/pruebas-e2e.sh` sin `URL_BASE` | La suite publica y levanta el producto entero, con **almacén de esa corrida y puertos pedidos al sistema**. No hace falta ningún secreto y **no se toca ningún dato ajeno**. Es el modo que se corre antes de empujar un cambio, y **el que corre la CI en cada empujón** (§4) |
| **Desplegado** | `URL_BASE=… API_BASE_URL=… E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… scripts/pruebas-e2e.sh` | El navegador contra el sitio publicado. **Es el único modo que puede decir «el sitio publicado anda»**, y el único que toca datos reales: siembra su alumno y sus trabajos, y los borra al terminar. **Sólo a mano** (§4) |

**No se tocan los contenedores del Product Owner**: el contenedor es efímero (`docker run --rm`,
con `--user "$(id -u):$(id -g)"`) y sin nombre fijo. La cabecera de `scripts/pruebas-e2e.sh` todavía
nombra `gf-api`, `gf-web`, `gf-back` y `gf-tunnel` como su despliegue local; desde `160770d`
`AGENTS.md` protege `lab-geometria-web` y `lab-geometria-api`, y el mensaje de ese commit dice que
los `gf-*` «ya no corren».

`pruebas-e2e.runsettings` fija `chromium` por defecto —el navegador se pisa desde la línea de
comandos, después del separador de argumentos—, `ExpectTimeout` de **10 segundos** (el anfitrión
no ofrece WebSocket: negocia `ServerSentEvents` y `LongPolling`), `Headless`, **dos clases a la
vez** (`NumberOfTestWorkers` 2, porque subirlo agrega ruido de red y no velocidad) y
`ResultsDirectory` `resultados-e2e`. Las trazas y capturas caen aparte, en
`tests/GeometriaFactory.E2ETests/resultados-e2e/`; las dos rutas están ignoradas.

**Un archivo `.runsettings` que no se lee no corre nada y no lo dice con esas palabras.** Un
vistazo distraído lee «cero fallos» donde no se ejecutó una sola prueba. Pasó el 2026-09-02
(comentario de cabecera del propio archivo).

## 3. Las puertas

### 3.0 Los `QG-*` se numeran por proyecto de código, no por producto

Cada proyecto de código tiene su propia lista `QG-01…QG-NN` en la `Estrategia-Calidad.md` de su
unidad de entrega, y **el mismo número nombra cosas distintas** según el proyecto. Recuento de filas
`| QG-` por subsección:

| Proyecto | Gates | Fuente (§3) |
| --- | --- | --- |
| `GeometriaFactory-Api` | 15 | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/08-Calidad-Y-Pruebas/Estrategia-Calidad.md` §3.1 |
| `GeometriaFactory-Domain` | 8 | ídem §3.2 |
| `GeometriaFactory-Application` | 11 | ídem §3.3 |
| `GeometriaFactory-Infrastructure` | 14 | ídem §3.4 |
| `GeometriaFactory-Web` | 12 | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/08-Calidad-Y-Pruebas/Estrategia-Calidad.md` §3.1 |
| `GeometriaFactory-Visor` | 9 | ídem §3.2 |

**Los instrumentos del repositorio usan los rótulos de un proyecto para todo el producto**: el
`QG-03` de `coverage.sh` es la cobertura de los cuatro proyectos (en Infrastructure esa fila es
`QG-05`, y su `QG-03` es la batería del validador 10/10), el `QG-04` es la pirámide del `Api` (en
Domain `QG-04` es la inspección de dependencias), y el `QG-06` es el piso del validador de
Infrastructure. Lo que sigue usa los rótulos **de los instrumentos**, que es como se leen en la
salida.

### 3.1 `QG-01` · construcción sin advertencias

`TreatWarningsAsErrors` en `Directory.Build.props` (y repetido en el `.csproj` de E2E). Termina en
**0 y sin advertencias**, o no termina. Desde la 3.0 el mismo archivo suma **MinVer 8.0.0**
(`MinVerTagPrefix` `v`), y por eso `ci.yml` hace el checkout con `fetch-depth: 0`: sin etiquetas,
MinVer calcula `0.0.0-alpha.0` sin advertir ([`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md)).

### 3.2 `QG-02` · la batería entera

`scripts/test.sh` (`dotnet test GeometriaFactory.sln --configuration Release`). Cero rojas y cero
deshabilitadas sin motivo escrito. Corre las tres baterías de xUnit; la de extremo a extremo no
(§1).

### 3.3 `QG-03` · cobertura, **por proyecto**

Umbrales transcriptos del intake §22 (asunción `A-3`) y confirmados por el Product Owner el
2026-08-26 con la decisión `D1` (`SDD/Docs/Audit/D1-Confirmacion-De-Asunciones.md` §3.2), que los
volvió **bloqueantes**. Están, una sola vez, en la tabla `umbral` de `tools/informe-cobertura.cs`,
y coinciden con `Estrategia-Testing.md` (Api) §0.1:

| Proyecto | Líneas | Ramas |
| --- | --- | --- |
| `GeometriaFactory.Domain` | 90 % | 85 % |
| `GeometriaFactory.Application` | 85 % | 80 % |
| `GeometriaFactory.Infrastructure` | 85 % | 80 % |
| `GeometriaFactory.Api` | 75 % | 70 % |

**`Contracts` y `Web` no llevan umbral de líneas**: el informe los lista con «sin umbral de líneas
en la fuente», porque sus puertas son de otra forma —DTOs ejercitados y pasos de guion—.
**La unidad no se promedia**: «se cumplen los cuatro o no se cumple», y el 83,75 que daría el
promedio «no significa nada» (`Estrategia-Testing.md` §0.1). El 75 del `Api` es el único piso que
**baja** el de su tipo (`rest-api` pide 80), y la ADR que lo justificaría **sigue faltando** (ídem).

### 3.4 `QG-06` · el validador de figuras, con piso propio — **nuevo**

**95 % de líneas** sobre `GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs`, donde
viven los dos motores (interpretación y verificación de valores), informado **aparte** del número
de Infrastructure: un 85 % del proyecto con el validador en 80 es incumplimiento aunque el promedio
cierre. Las ramas se muestran y no deciden. Si el informe no trae el archivo, sale con 2. Entró con
`R-12` de la mesa del 2026-09-14 (PR #228); medido entonces: **210/223 = 94,2 %** sin las pruebas
nuevas y **221/223 = 99,1 %** con `FigureTextReadingTests` (`changelog.md`, entrada del
2026-09-14).

### 3.5 `QG-04` · el reparto de la pirámide

60 % integración / 40 % unitarias (`PiramideIntegracion = 60`), invertida a propósito
(`Estrategia-Calidad.md` del Api §3.1: lo que el proyecto aporta es cableado, «y el cableado se
verifica ejerciéndolo»). **Se cuenta del informe `.trx`, no de los atributos**: una `[Theory]` con
datos es un método y varios casos. Integración = ensamblado cuyo nombre contiene `Integration`
(sin distinguir mayúsculas: el `.trx` escribe la ruta en minúsculas); unitarias = el resto.

**Códigos de salida de `coverage.sh`: `0` las puertas pasan, `1` alguna no pasa, `2` no se pudo
medir. El `2` no es aprobación.** Y `QG-02` frena antes que `QG-03`: **no se mide cobertura sobre
rojo** (si `dotnet test` falla, sale con 2).

**Cómo une los informes `tools/informe-cobertura.cs`**, que es donde estaban los errores de medida:

- **Deduplica por contenido** (SHA-256): con `--logger trx`, VSTest deja cada adjunto dos veces.
- **Une, no suma**: cada proyecto de prueba trae el ensamblado entero; sumar daba 33,3 % a una
  clase que sólo ejercía una batería. La unión es por (archivo, línea).
- **Resuelve la raíz de `<sources>`** de cada informe: con la ruta cruda, Domain daba **77,7 %**;
  con la resuelta, **96,0 %**, sobre la misma corrida.
- **Ramas: el máximo entre corridas**, que es un **piso** de la unión real.

**Por qué existe `coverlet.runsettings`.** Sin él, el denominador de ramas incluye código que
emiten los generadores: medido el 2026-08-29, **202 de las 407 ramas de `GeometriaFactory.Api`**
salían de `OpenApiXmlCommentSupport_generated`. Se excluye **sólo** `GeneratedCodeAttribute`: la
primera versión sumaba `CompilerGeneratedAttribute` y `SkipAutoProps` y `Application` pasó de 148
ramas a 6. **Un denominador demasiado chico miente igual que uno demasiado grande, y encima no se
nota.** Y aun así coverlet cuenta ramas que genera el compilador (máquinas de estado de `async`,
comprobaciones de nulo): **el número de ramas es un piso**.

### 3.6 Las puertas técnicas `PT-01` a `PT-05`

Se declaran aparte de los gates porque su consecuencia es otra: **una puerta que no pasa detiene la
planificación de las etapas que dependen de ella y no se arrastra como deuda** (intake §15, citado
en `Estrategia-Calidad.md` del Api §3.3).

| Puerta | Qué mide | Instrumento o registro |
| --- | --- | --- |
| `PT-01` (cuatro partes) | Arranque en la dirección pública, transporte del circuito, estabilidad 20 min, salida hacia el servicio | `Estrategia-Calidad.md` de Web §3.2 |
| `PT-02` | El bundle crea y libera escena diez veces sin degradarse (contextos WebGL) | `scripts/verify-viewer-lifecycle.sh`, con navegador en contenedor |
| `PT-03` | El motor 3D va **dentro** del bundle; cero redes externas | Inspección del paquete; `SDD/Docs/Producto/Medicion-Puertas-Tecnicas-PT-02-PT-03.md` |
| `PT-04` | La imagen multietapa construye, arranca, aplica esquema y responde salud | Etapa `a` |
| `PT-05` | La premisa de la topología **desde la red de la facultad** | `SDD/Docs/Audit/Medicion-PT-05.md` 1.5: **sigue `SIN MEDIR`**; umbral decidido por la mesa del 2026-09-15 (D-1): primera pantalla ≤ 5 s, «con reservas» entre 5 y 10 s, «no funciona» > 10 s |

### 3.7 Las puertas de etapa

Cada una verifica los criterios de transición de su etapa (`Roadmap-Producto.md` §5.2). Las
etapas `a` y `b` no tienen guion `verify-stage-*` (los dos criterios de `b` son
`verify-navigation.sh` y `verify-visual-system.sh`, §3.9). **No todas comparten forma**: la 3.0
decía que sí, y `lib-puerta.sh` dice lo contrario.

| Guion | Criterios | Forma | Qué necesita |
| --- | --- | --- | --- |
| `verify-stage-c.sh` | 4 (`C-1`…`C-4`: administrador, sesión que persiste entre reinicios, esquema solo, credencial no observable) + dos controles de guardianes que no son criterios | Propia: levanta las dos piezas en `Release`, como `Production` | `dotnet`, `curl` |
| `verify-stage-d.sh` | 10 (`D-1`…`D-10`, ciclo de vida de la cuenta del alumno y reseteo) | `lib-puerta.sh` entera: `puerta_abre` / `criterio` / `puerta_cierra` | `dotnet` |
| `verify-stage-e.sh` | 5 (`E-1`…`E-5`, el trabajo con dueño, estado e identificador) | `lib-puerta.sh` entera | `dotnet` |
| `verify-stage-f.sh` | 8: siete por `criterio` (`F-1`…`F-7`) y `F-8` delegado a `PT-02`/`PT-03` | `lib-puerta.sh` entera | `dotnet`, `docker` |
| `verify-stage-g.sh` | 7 (`G-1`…`G-7`): cuatro y media en navegador (`visor/verification/stage-g.mjs`, imagen `playwright:v1.48.0-jammy`), `G-2` es `PT-02`, `G-6` y media de `G-7` en la batería | Propia + `puerta_no_corrieron` | `dotnet`, `docker`, bundle construido |
| `verify-stage-h.sh` | 7 (`H-1`…`H-7`); `H-7` no es mecánico y **se declara, no se marca** | Propia + `puerta_no_corrieron` | `dotnet` |
| `verify-stage-i.sh` | **6** (`I-1`…`I-6`, reescrita: antes eran siete) | Propia, contra un despliegue real | `PUBLIC_URL`, `API_URL`, `curl`; `I-6` corre las otras |

**El control `C-4` de la etapa `c`** autoriza una lista cerrada de atributos `data-gf-*` en el
marcado: **30** (`verify-stage-c.sh`:272-279), y eran 17 hasta el PR de la mesa del 2026-09-14
(`R-11`, `E-6`), cuando la puerta estaba en rojo sobre `main` porque las etapas `e` a `h` habían
agregado trece sin sumarlos. **No confundir con el `C-4` de `verify-visual-system.sh`** (§3.9).

**La puerta de `i` mide un despliegue que existe**, y es distinta de las otras ocho: sin las dos
direcciones sale con **2** («no se puede medir»), sin `curl` con 3.

| Criterio | Qué se comprueba |
| --- | --- |
| `I-1` | Las dos direcciones responden; `/salud` informa una versión **sellada** con revisión; la revisión está en la historia de `main` (o es `REVISION_ESPERADA`); el front sella **la misma versión** que el servicio |
| `I-2` | No hay `appsettings*.json` bajo `wwwroot/`; `/appsettings.json` no se sirve; el marcado no nombra la máquina del servicio de datos |
| `I-3` | Que `SDD/Docs/Audit/Medicion-PT-05.md` exista **y ya no diga `SIN MEDIR`** (hoy lo dice: falla, como corresponde) |
| `I-4` | **Se declara**: el circuito completo lo recorren dos personas |
| `I-5` | `ready: true` en la salud, que es la fase 1 del arranque: el esquema aplicado |
| `I-6` | **Corre** `verify-navigation`, `verify-visual-system` y `verify-stage-c` a `h`; lo que el entorno no puede medir queda `SIN MEDIR` y el resultado, **`INCOMPLETA`** (salida 2), no conforme |

Verificada contra producción el 2026-09-14: `I-1`, `I-2` e `I-5` pasan; `I-6` sin medir en ese
anfitrión; `I-3` falla (`changelog.md`, «La puerta de `i` mide el despliegue que existe»).

**«No se pudo medir» no es «falla»**, y las puertas lo distinguen: `f`, `g` e `i` salen con **2** e
imprimen `SIN MEDIR` / `INCOMPLETA` cuando falta `docker` o `dotnet`, en lugar de inventar un
defecto del producto o saltear en silencio.

### 3.8 `R-24` · ninguna puerta en verde sin correr las pruebas que nombra — **nuevo**

**El defecto.** `dotnet test` con un filtro que no coincide con nada **sale con 0** («No test
matches the given testcase filter»). `verify-stage-g.sh` y `verify-stage-h.sh` corrían así: con una
prueba renombrada, la puerta quedaba en verde sin haberla corrido. `lib-puerta.sh` comparaba el
recuento contra lo pedido, pero **una teoría con varios casos tapaba un nombre que dejó de existir**.

**La corrección** (mesa del 2026-09-14, ítem `R-24`, 5-0, P3; PR #223). `lib-puerta.sh` suma
`puerta_no_corrieron <registro> <prueba>…`: corre `dotnet test` con
`PUERTA_REGISTRADOR='console;verbosity=normal'` y busca **cada nombre** pedido como línea
`Passed <…>.<nombre>`; imprime los que faltan, y la puerta falla con «no corrieron, porque no
existen con ese nombre». `d`, `e` y `f` la usan en cada `criterio`; `g` y `h` toman **sólo esa
función** y nada más de la forma.

**Verificado al introducirla** (`changelog.md`, entrada del 2026-09-14): la batería de `h` con un
sexto nombre inexistente salía con 0 y corrían 5; con la función, lo lista, también con un prefijo
parcial. `verify-stage-e.sh` CONFORME con 5 criterios y 28 pruebas.

### 3.9 Las puertas que no son de etapa

| Guion | Qué verifica |
| --- | --- |
| `verify-solution-tree.sh` — **nuevo** | `DC-5`: todo proyecto y toda carpeta de sample tienen nodo en `GeometriaFactory.sln`. Seis controles `A-1`…`A-6` (todo `.csproj` de `src/`, `tests/` y `visor/` en la solución; un proyecto por carpeta `samples/<segmento>/<NN-…>`; anidamiento como en el disco; todo lo nombrado existe; nodos `NoTargets` inertes; sólo `Debug|Any CPU` y `Release|Any CPU`). Salidas 0/1/2. No necesita .NET. Nació porque `6cc6f86` dejó afuera diez carpetas de samples, al día siguiente quedó afuera una undécima (`api/04-cliente-http-basico`) y nada lo notó (`verify-solution-tree.sh`:11-18) |
| `verify-navigation.sh` | Primer criterio de `b`: las trece rutas responden 200 con su `<h1>`, `SUP-08` y `SUP-11` sin ruta, los tres destinos de cada papel, 404 con pantalla. Corre **en desarrollo y con la puerta de servicio puesta** |
| `verify-visual-system.sh` | Segundo criterio de `b`, cinco controles: `C-1` sin literales de color fuera de `:root`; `C-2` sin `style=` en `.razor`; `C-3` toda `gf-*` usada está definida; **`C-4` los tokens de `app.css` son exactamente los de la maqueta aprobada**; `C-5` toda clase que la versión angosta enciende la emite algún componente (nació de `MI-02`) |
| `verify-viewer-lifecycle.sh` | `PT-02` sobre el bundle construido, **con navegador de verdad** en contenedor; sin base, sin servicio y sin sesión |
| `verify-explicit-configuration.sh` | La configuración de compilación se declara siempre y en los dos lados, aunque coincida con la de omisión |
| `verify-propagacion.sh` | La dirección inversa: lee `SDD/Docs/Audit/Decisiones-Y-Frases-Retiradas.md` §2 y falla sólo por las filas en estado `vigilada` |

`verify-stage-c.sh` levanta las dos piezas con `--no-build` detrás de
`scripts/assert-build-fresh.sh`, la red de la regla de configuración explícita descrita en
[`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) §1.

## 4. Qué corre en la integración continua

| Flujo | Disparo | Dónde | Qué corre |
| --- | --- | --- | --- |
| `ci.yml`, trabajo `puertas` | `push` a `main`, todo `pull_request`, a mano | `ubuntu-latest` | `verify-solution-tree.sh` → `build.sh` (**QG-01**) → `test.sh` (**QG-02**) → `coverage.sh` (**QG-03, QG-06, QG-04**) → `verify-stage-d.sh`, `-e.sh` y `-h.sh`. Con .NET 10 y Node 22. No publica ni lee secretos |
| `e2e.yml` | Banco local en cada `push` a `main` y `pull_request` (salvo forks, `R-01`); desplegado **sólo a mano** | runner propio | La cuarta batería en sus dos modos (§2.1) |
| `deploy-front-ftp.yml` | **Sólo `workflow_dispatch`** | — | `build.sh` y `test.sh` antes de subir |

Trabajos, disparos, runners y secretos de cada flujo: [`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) §10.

**Qué sigue siendo manual, y por qué** (`ci.yml`, comentario de los pasos de puerta): `c` levanta
las dos piezas, `f` y `g` corren un navegador en contenedor, e `i` mira el despliegue. Tampoco
corren en CI `verify-navigation`, `verify-visual-system`, `verify-viewer-lifecycle`,
`verify-explicit-configuration` ni `verify-propagacion` (no figuran en ningún flujo).

**Cómo llegaron a CI la cobertura y las puertas `d`/`e`/`h`.** Hasta la mesa del 2026-09-14
(`R-12`) existían y nadie las corría: «una puerta que no corre no frena» (`ci.yml`). El recorrido
desplegado se disparaba al terminar `deploy-front-ftp`; esa atadura se quitó (`R-15`, PR #209).

## 5. Las herramientas de medición

`tools/` versiona **13 archivos**, sin dependencias nuevas: aplicaciones de un solo archivo de C#
(`dotnet run tools/<x>.cs`) y guiones de Node. `tools/node_modules/` **no está versionado**.

| Herramienta | Qué mide |
| --- | --- |
| `informe-cobertura.cs` | El análisis de `QG-03`, `QG-06` y `QG-04` (§3.3–3.5) |
| `barrido-cobertura-de-contrato.cs` | Cobertura del conjunto de códigos del contrato |
| `medicion-pintado-del-listado.{mjs,sh}` | El tiempo de pintado del listado |
| `medicion-volumen-de-comision.sh` | El volumen que la comisión soporta |
| `captura-de-superficies.mjs` | Capturas de todas las superficies |
| `sonda-circuito-en-el-anfitrion.mjs` | El circuito interactivo sobre el anfitrión real |
| `verificar-primer-arranque.mjs` | El primer arranque, por pantalla |
| `verificar-acuse-de-la-escena.mjs` | Que la pantalla no afirme que dibujó lo que no dibujó |
| `verificar-escena-al-cambiar-de-tamano.mjs` | Que la escena acompañe el tamaño del recuadro |
| `verificar-aviso-de-reconexion.mjs` | Que la desconexión se vea venir |
| `verificar-resolucion-del-trabajo.{mjs,sh}` | Que el botón de aprobar haga algo |

Los tres `.sh` de medición se tocaron después de la 3.0: sus peticiones pasan a `/v1/`
(`git diff 89f3ab3..4b114d7 -- tools`). `scripts/` versiona **27** guiones.

## 6. Dónde queda la evidencia

**La carpeta `evidencia/` de la raíz ya no existe**: se retiró el 2026-09-13 por decisión del
Product Owner (PR #207, `3662bf9`). Su contenido —corridas fechadas del 2026-09-01 al 2026-09-13—
**vive en el historial** y se cita como `git show 3662bf9^:evidencia/<corrida>/<archivo>`
(`changelog.md`, «Se retira `evidencia/` de la raíz»). `git ls-files 'evidencia/*'` da **0**.

Hoy la evidencia versionada de corridas va en los expedientes:
`SDD/Expedientes/0001-Migracion-Normativa-A-13.16/evidencia/` (por ejemplo, `E-012-build-y-tests-base.txt`
y `E-023-build-sin-modo-y-sin-node.txt`). Los resultados crudos (`resultados-e2e/`, `TestResults/`)
siguen ignorados. **Una prueba que no se probó fallando no es una prueba**: las entradas del
`changelog.md` lo declaran caso por caso («vistas fallar sin el middleware», «6 de 19 en rojo»).

## 7. Estado

| Fecha | Corrida declarada | Fuente |
| --- | --- | --- |
| 2026-09-03 | 522 pasan, 0 fallan | `changelog.md`:1062 |
| 2026-09-13 | **553/553** — Domain 94, Application 56, Integración 403; E2E banco local **32/32** | `changelog.md`:1679; repetido en `Mesa-2026-09-14.md`:171 y `SDD/Expedientes/0001-…/evidencia/E-012` |
| 2026-09-14 | `QG-06` 221/223 = 99,1 %; `verify-stage-d` CONFORME (31), `-e` (28), `-h` CONFORME | `changelog.md`, entrada de `R-12` |
| 2026-09-14 | E2E banco local, dos corridas: **32/32** | `changelog.md`, «La batería E2E espera condiciones del producto» |
| 2026-09-14 | `c`, `f` y `g` CONFORME sobre `main` (criterio 6 de `i`) | `Mesa-2026-09-14.md` §6.1 |
| 2026-09-14 | Suite completa en verde: Domain 94, Application 56, Integración 404 → 406 → 407 → 410 → **411** (= 561) en cinco entradas sucesivas | `changelog.md`:1807, 1830, 1884, 1899, 1920 |

**No hay corrida completa declarada sobre `4b114d7`.** La última suite completa declarada es la de
`changelog.md`:1920 (entrada «El documento OpenAPI dice cómo se autentica…», 2026-09-14): Domain 94,
Application 56, Integración 411, o sea **561**; ninguna entrada posterior declara el total. Hoy
Application tiene 61 casos contados contra los 56 declarados (pruebas nuevas en
`AccountLifecycleUseCaseTests`). **Cuántos casos tiene hoy la batería de
integración no está verificado**: las tres teorías con `MemberData` de `ContractTranslationTests`
sólo se expanden corriendo.

**La puerta de `i` no puede cerrar todavía**: `I-3` falla mientras `Medicion-PT-05.md` diga `SIN
MEDIR`, e `I-4` es un acto de dos personas sobre el despliegue real. Lo que queda abierto de la
fase está en [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md);
lo que no cuadró al indexar, en [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).
