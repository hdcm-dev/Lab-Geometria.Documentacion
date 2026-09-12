# 07 · Pruebas y puertas de calidad — con qué se dice que algo anda

> **Propósito.** Las cuatro baterías, qué cubre cada una, las puertas que hay que pasar, sus
> umbrales exactos y cómo se corre cada instrumento.
> **Fuente primaria.** `tests/`, los cuatro `.csproj` de prueba, `scripts/test.sh`,
> `scripts/coverage.sh`, `tools/informe-cobertura.cs`, `coverlet.runsettings`,
> `pruebas-e2e.runsettings`, `scripts/verify-*.sh`, `scripts/lib-puerta.sh`. Verificado el
> 2026-09-11 sobre `89f3ab3`; **ninguna batería se corrió durante el indexado**.

---

## 1. Las cuatro baterías

| Batería | Marco | Métodos anotados | Qué cubre | ¿En la solución? |
| --- | --- | --- | --- | --- |
| `GeometriaFactory.Domain.Tests` | xUnit 2.9.2 | 67 | Entidades, invariantes, transiciones, y la **puerta de dependencias** (`DependencyGateTests`) | Sí |
| `GeometriaFactory.Application.Tests` | xUnit 2.9.2 | 51 | Casos de uso y la **puerta de puertos** (`PortGateTests`) | Sí |
| `GeometriaFactory.Integration.Tests` | xUnit 2.9.2 + `Mvc.Testing` 10.0.11 | 198 | La superficie HTTP ensamblada, el front sobre servicio real, seguridad, almacén, composición | Sí |
| `GeometriaFactory.E2ETests` | **NUnit 4.2.2 + Playwright 1.49.0** | 29 (28 `[Test]` + 1 `[TestCaseSource]`) | El navegador contra el producto entero | **No** — se compila y corre aparte |

Cobertura con `coverlet.collector` 6.0.4. **La pirámide está invertida a propósito**
(`Estrategia-Calidad.md` §3.1): 60 % integración, 40 % unitarias. Es lo que mide la puerta
`QG-04`.

**Tres pruebas son puertas y no pruebas de comportamiento**: `DependencyGateTests` (que ninguna
capa referencie hacia afuera), `PortGateTests` (que los cuatro puertos sigan siendo la frontera) y
`CompositionGateTests` (que la composición de raíz conecte todo lo que declara).

### 1.1 Lo que cubre la batería de integración, por familia

Veintisiete clases de prueba y tres andamios. Contrato y traducción (`ContractCoverageTests`,
`ContractTranslationTests`, `ContractErrorHandlerTests`) · superficie de trabajos y de cuentas
(`WorkSurfaceTests`, `WorkWebSurfaceTests`, `AccountLifecycleSurfaceTests`,
`AccountLifecycleWebSurfaceTests`, `AdministratorLifecycleTests`) · sesión y credencial
(`SessionCookieTests`, `SessionCredentialTests`, `SigningKeyStartupTests`,
`ForcedPasswordChangeTests`, `ForcedPasswordChangeSurfaceTests`, `ProvisionalPasswordTests`) ·
guardianes (`PanelSessionGateTests`, `ProvisioningGateTests`, `SecurityGuardsTests`) · almacén
(`StoreHealthTests`, `StoreJournalModeTests`, `HealthEndpointStoreTests`) · interpretación
(`FigureDerivationTests`, `FigureValidatorBatteryTests`, `TextTreeTests`) · presentación
(`DeclaredDateControlTests`, `SurfaceInteractionTests`) · documentación de la superficie
(`ApiDocumentationSurfaceTests`) · composición (`CompositionGateTests`) · y los andamios
compartidos `DataServiceHarness`, `PublicPieceHarness` y `Scenarios`.

### 1.2 Las ocho clases de la batería de extremo a extremo

| Clase | Qué mira |
| --- | --- |
| `IngresoTests` | La puerta del laboratorio: entrar, y que no se entre |
| `NavegacionTests` | Que cada destino exista, que se llegue, y que el que no existe se comporte (`RutasDelPanel` es el `TestCaseSource`) |
| `RecorridoDelAlumnoTests` | El camino completo del alumno: registrarse, entrar, cargar, corregir y reenviar |
| `ResolucionDelTrabajoTests` | Resolver una entrega: el recorrido que el docente hace todos los días |
| `FiguraQueNoSePudoLeerTests` | Qué le dice el producto al alumno cuando no reconoce las claves |
| `EstadoDelLaboratorioTests` | Lo que el laboratorio declara de sí mismo, sin sesión |
| `VentanaMuertaTests` | **Los segundos entre que la pantalla se dibuja y el circuito engancha** |
| `DisenoResponsivoTests` | Lo que el sistema visual promete por debajo de 768 px |

Infraestructura propia en `Infraestructura/`: `BancoLocal` (levanta el producto entero),
`ElLaboratorio` (la fachada de siembra y limpieza), `PruebaE2E` (la base común, con
`EsperaDelCircuito`), `ArranqueDeLaSuite` y `ParalelismoDelEnsamblado`.

## 2. Cómo se corre cada cosa

```bash
bash scripts/build.sh          # QG-01 · build-visor.sh → restore → build -c Release
bash scripts/build-visor.sh    # sólo el bundle
bash scripts/test.sh           # QG-02 · dotnet test GeometriaFactory.sln --configuration Release
bash scripts/coverage.sh       # QG-03 y QG-04 · cobertura y reparto de la pirámide
bash scripts/pruebas-e2e.sh [-- Playwright.BrowserName=firefox]   # la cuarta batería
```

**Todo se prueba en `Release`**, y está declarado: `Release` es lo que produce `build.sh` y lo que
verifican las puertas. Probar sin decirlo mediría la salida de `Debug` —otra salida, de otra
antigüedad— y la batería quedaría verde sobre algo que no se despliega.

### 2.1 Los dos modos de la batería de extremo a extremo

| Modo | Cómo se dispara | Qué toca |
| --- | --- | --- |
| **Banco local** | `scripts/pruebas-e2e.sh` sin `URL_BASE` | La suite publica y levanta el producto entero, con **almacén de esa corrida y puertos pedidos al sistema**. No hace falta ningún secreto y **no se toca ningún dato ajeno**. Es el modo que se corre antes de empujar un cambio |
| **Desplegado** | `URL_BASE=… API_BASE_URL=… E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… scripts/pruebas-e2e.sh` | El navegador contra el sitio publicado. **Es el único modo que puede decir «el sitio publicado anda»**, y el único que toca datos reales: siembra su alumno y sus trabajos, y los borra al terminar |

**Todo corre dentro de un contenedor**, construido desde `deploy/e2e/Dockerfile` la primera vez: el
anfitrión no tiene el kit de desarrollo ni las bibliotecas de sistema que piden los navegadores.
**No se tocan los contenedores del Product Owner**: el contenedor es efímero (`docker run --rm`,
con `-u "$(id -u):$(id -g)"`) y sin nombre fijo.

`pruebas-e2e.runsettings` fija `chromium` por defecto —el navegador se pisa desde la línea de
comandos, después del separador de argumentos—, `ExpectTimeout` de **10 segundos** (este anfitrión
no ofrece WebSocket: negocia `ServerSentEvents` y `LongPolling`, y cada ida y vuelta pasa por
sondeo largo) y **dos clases a la vez** (`NumberOfTestWorkers` 2), porque subirlo agrega ruido de
red y no velocidad.

**Un archivo `.runsettings` que no se lee no corre nada y no lo dice con esas palabras.** Un
vistazo distraído lee «cero fallos» donde no se ejecutó una sola prueba. Pasó el 2026-09-02.

## 3. Las puertas

### 3.1 `QG-01` · construcción sin advertencias

`TreatWarningsAsErrors` en `Directory.Build.props`. Termina en **0 y sin advertencias**, o no
termina.

### 3.2 `QG-02` · la batería entera

`scripts/test.sh`. Cero rojas y cero deshabilitadas sin motivo escrito.

### 3.3 `QG-03` · cobertura, **por proyecto**

Umbrales transcriptos del intake §22 (asunción `A-3`) y confirmados por el Product Owner el
2026-08-26 con la decisión `D1` (`Audit/D1-Confirmacion-De-Asunciones.md` §3.2), que los volvió
**bloqueantes**. Están en `tools/informe-cobertura.cs`:

| Proyecto | Líneas | Ramas |
| --- | --- | --- |
| `GeometriaFactory.Domain` | 90 % | 85 % |
| `GeometriaFactory.Application` | 85 % | 80 % |
| `GeometriaFactory.Infrastructure` | 85 % | 80 % |
| `GeometriaFactory.Api` | 75 % | 70 % |

**`Contracts` y `Web` no llevan umbral de líneas**: sus puertas son de otra forma —DTOs
ejercitados y pasos de guion— y el informe no los mide.

### 3.4 `QG-04` · el reparto de la pirámide

60 % integración / 40 % unitarias (`PiramideIntegracion = 60`), invertida a propósito.

**Códigos de salida de `coverage.sh`: `0` las dos puertas pasan, `1` alguna no pasa, `2` no se pudo
medir. El `2` no es aprobación.** Y `QG-02` frena antes que `QG-03`: **no se mide cobertura sobre
rojo**.

**Por qué existe `coverlet.runsettings`.** Sin él, el denominador de ramas incluye código que
emiten los generadores: medido el 2026-08-29, **202 de las 407 ramas de `GeometriaFactory.Api`**
—la mitad— salían del generador de comentarios XML de OpenAPI. Se excluye **sólo**
`GeneratedCodeAttribute`: la primera versión sumaba `CompilerGeneratedAttribute` y `SkipAutoProps`
y excluyó de más —`Application` pasó de 148 ramas a 6, y con seis ramas el porcentaje deja de
medir nada—. **Un denominador demasiado chico miente igual que uno demasiado grande, y encima no
se nota.**

**Una advertencia sobre las ramas**: coverlet cuenta también las que genera el compilador
—máquinas de estado de `async`, comprobaciones de nulo— que ningún test escribe a propósito. El
número de ramas es un **piso**.

### 3.5 Las puertas de etapa

Cada una verifica los criterios de transición de su etapa (`Roadmap-Producto.md` §5.2), y todas
comparten la forma de `scripts/lib-puerta.sh` (`puerta_abre` / `criterio` / `puerta_cierra`).
Las etapas `a` y `b` no tienen guion propio y nunca lo tuvieron.

| Guion | Criterios (según su encabezado) |
| --- | --- |
| `verify-stage-c.sh` | 4 — administrador, sesión, cambio de contraseña, credencial no observable; más dos controles que no son criterios |
| `verify-stage-d.sh` | 10 — ciclo de vida de la cuenta del alumno |
| `verify-stage-e.sh` | 5 — el trabajo con dueño, estado y persistencia |
| `verify-stage-f.sh` | 8 — la interpretación del texto real |
| `verify-stage-g.sh` | 7 — la visualización |
| `verify-stage-h.sh` | 7 — el circuito de revisión; **cierra el producto construible** |
| `verify-stage-i.sh` | 7 — **la del despliegue real, escrita antes de que la fase ocurriera**; `I-4` e `I-5` son los dos no mecánicos, y `I-4` exige que `Medicion-PT-05.md` exista **y ya no diga `SIN MEDIR`** |

Y cinco puertas que no son de etapa: `verify-navigation.sh` (toda ruta del mapa es alcanzable),
`verify-visual-system.sh` (los cinco controles del sistema visual, ver
[`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md)), `verify-viewer-lifecycle.sh` (`PT-02`
sobre el bundle, **con navegador de verdad**: sin degradación tras diez ciclos),
`verify-explicit-configuration.sh` (la regla de configuración explícita) y `verify-propagacion.sh`
(la compuerta de la dirección inversa, que revisa que una decisión haya vuelto a quien preguntó).

`scripts/assert-build-fresh.sh` es **la red que va debajo de todo `dotnet run --no-build`**.

## 4. Las herramientas de medición

`tools/` no tiene dependencias nuevas: son aplicaciones de un solo archivo de C# y guiones de Node
que corren con lo que ya está (`tools/node_modules/` trae sólo `playwright` y `playwright-core`).

| Herramienta | Qué mide |
| --- | --- |
| `informe-cobertura.cs` | El análisis de `QG-03` y `QG-04` |
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

**La evidencia versionada vive en `evidencia/<fecha>-<asunto>/`** —quince carpetas, del
2026-09-01 al 2026-09-02—, y se elige y se copia: los resultados crudos de las corridas
(`resultados-e2e/`, `TestResults/`) están ignorados por `.gitignore`. Una prueba que no se probó
fallando no es una prueba.

## 5. Estado

Última corrida declarada: **522 pruebas pasan, 0 fallan** (`changelog.md`, entrada del 2026-09-03),
con `verify-visual-system.sh` conforme en los cinco controles. **La medición se tomó contra el
producto levantado desde el fuente**, no contra el despliegue público, que a esa fecha servía la
versión anterior. **No hay corrida declarada posterior al PR #186** (`Dockerfile.web`), que no toca
código probado por las baterías; el commit `6fa6844` declara su propia verificación —la imagen
construye, el bundle viaja adentro, `/estado` muestra la versión del servicio de datos— y esa
evidencia no está versionada en `evidencia/`.
