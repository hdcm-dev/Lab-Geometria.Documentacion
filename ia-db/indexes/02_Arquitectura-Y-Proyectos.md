# 02 · Arquitectura y proyectos — cómo está partido el código

> **Propósito.** El mapa del eje de construcción: los siete proyectos, sus capas, su grafo, el
> orden en que se compilan, lo que la solución agrupa además de ellos, la configuración compartida
> y cómo se hablan las dos unidades desplegables.
> **Fuente primaria.** `GeometriaFactory.sln`, `Directory.Build.props`, `.editorconfig`, los seis
> `.csproj` de `src/`, `visor/geometriafactory-visor.csproj`, los dos `Program.cs`,
> `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` §2 y §3, `SDD/Docs/Producto/Vista-Producto.md`
> 1.11 §2 a §7, y `git ls-files src/ visor/ tests/`.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. Los siete proyectos de código

| Proyecto | Identidad | Rol | Depende de | Compone |
| --- | --- | --- | --- | --- |
| `GeometriaFactory-Domain` | `GeometriaFactory.Domain` | Entidades e invariantes. **Centro de la regla de dependencias** | — | `Api` |
| `GeometriaFactory-Application` | `GeometriaFactory.Application` | Casos de uso y **los cuatro puertos** | `Domain` | `Api` |
| `GeometriaFactory-Infrastructure` | `GeometriaFactory.Infrastructure` | Adaptadores de los cuatro puertos, seguridad y validador de figuras | `Application`, `Domain` | `Api` |
| `GeometriaFactory-Api` | `GeometriaFactory.Api` | Host REST: puntos de acceso, autenticación, límite de tasa, composición de raíz | `Application`, `Infrastructure`, `Contracts` | `Api` |
| `GeometriaFactory-Contracts` | `GeometriaFactory.Contracts` | Tipos de transferencia. **Único proyecto compartido por los dos procesos** | — | `Api` y `Web` |
| `GeometriaFactory-Web` | `GeometriaFactory.Web` | Front: páginas, componentes y cliente del servicio de datos. Hoja del grafo | `Contracts`, `Visor` (insumo) | `Web` |
| `GeometriaFactory-Visor` | `geometriafactory-visor` | Bundle 3D; **visualizador puro** (`RA-02`) | — | `Web` |

Fuente: `PRODUCT-MANIFEST` §2.B y §2.C; `Vista-Producto.md` §2. **Ningún proyecto lleva tipo D8
ni es `redistribuible`**: desde la migración a 13.16 los dos atributos son de la unidad de entrega
(`Vista-Producto.md` §2, fila 1.11 del control de cambios).

**El visor y su forma.** La identidad en minúscula con guion es la **del perfil del ecosistema
npm** y no una excepción (`PRODUCT-MANIFEST` §2.1). La carpeta `visor/` en la raíz y su nodo
`geometriafactory-visor.csproj` sin construcción son **decisiones del destino** (`PRODUCT-INTAKE`
§13.3). La 3.0 de este índice lo llamaba «apartamiento declarado»: `Vista-Producto.md` §2 lo
corrigió el 2026-09-13 porque **ningún ADR lo declara**, y su formalización queda como deuda `DD-1`
de `SDD/Docs/Audit/Mesa-2026-09-13.md`.

**El stack del front no lleva biblioteca de componentes.** `PRODUCT-MANIFEST` §2.A y §2.B y
`Vista-Producto.md` §2 dicen «con MudBlazor», pero ningún `.csproj` versionado la referencia: el
comentario de `GeometriaFactory.Web.csproj` declara que las etapas `a` y `b` **no la introducen**,
con `PA-01`/`V-5`/`BT-02` abiertos (ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md)).

## 2. El grafo, con la clase de cada arista

**Ocho aristas de compilación, de dos clases** (`PRODUCT-MANIFEST` §3; `Vista-Producto.md` §3 y
§3.1). Recontadas el 2026-10-26 contra los seis `.csproj` con el mismo resultado:

```text
referencias de proyecto (7) — las que un .csproj materializa
    Domain         -> Application
    Domain         -> Infrastructure
    Application    -> Infrastructure
    Application    -> Api            (directa y declarada; GeometriaFactory.Api.csproj explica por qué)
    Infrastructure -> Api
    Contracts      -> Api
    Contracts      -> Web

insumo de construcción (1) — generador: GeometriaFactory.Web.csproj, target BuildVisor (Web ADR-10008)
    Visor          -> Web            (sin referencia de proyecto; el bundle se copia a wwwroot/js/)
```

**`Application → Api` se declara aunque llegue transitiva por `Infrastructure`**, porque
`CompositionRoot` nombra los cuatro puertos de `Application`; el orden topológico es el mismo bajo
las dos lecturas (comentario de `src/GeometriaFactory.Api/GeometriaFactory.Api.csproj`, discrepancia
`X-1`).

**`Domain` llega a `Api` sólo transitivamente, y `Api` lo usa.** No hay `ProjectReference` de `Api`
a `Domain`, pero **cuatro** archivos de `Api` importan espacios de `GeometriaFactory.Domain`:
`Endpoints/CommissionAccountEndpoints.cs`, `Endpoints/ContractTranslation.cs`,
`Endpoints/WorkEndpoints.cs` y, nuevo desde la 3.0, `Composition/CredentialAttemptThrottle.cs`
(usa `EmailIdentity.Normalize`, `ADR-06003`). En `89f3ab3` eran tres. El grafo declarado no
cambia: es uso por la arista transitiva `Domain → Application → Api`.

**`Web → Api` no está en el grafo de compilación**: es de **tiempo de ejecución**, por HTTP con
los tipos de `Contracts`, contra los que los dos extremos compilan por separado. Por eso el grafo
es acíclico y por eso el producto tiene **dos procesos desplegables** y no uno
(`Vista-Producto.md` §3). El manifiesto la ubica en otro grafo, el **de integración**
(`[Api] -> [Web]`, `PRODUCT-MANIFEST` §3), que ordena la generación de la documentación y no el
build.

**Orden topológico, cuatro niveles** (`PRODUCT-MANIFEST` §3; `Vista-Producto.md` §3):

```text
nivel 0: Domain, Contracts, Visor      (paralelizables)
nivel 1: Application, Web              (paralelizables)
nivel 2: Infrastructure
nivel 3: Api
```

**Qué dice cada `.csproj` de sí mismo** (comentarios de cabecera):

| Proyecto | Puerta que declara | Verificador |
| --- | --- | --- |
| `Domain` | `BT-04`: cero referencias de proyecto y cero paquetes | `tests/GeometriaFactory.Domain.Tests/DependencyGateTests.cs`, sobre el ensamblado compilado |
| `Application` | Una sola dependencia saliente; ni EF Core ni marco web | `tests/GeometriaFactory.Application.Tests/PortGateTests.cs` |
| `Contracts` | `BT-02`/`QG-02`: cero referencias hacia `Domain` (ninguna referencia de proyecto) | `tests/GeometriaFactory.Integration.Tests`, sobre el ensamblado |
| `Infrastructure` | Dos dependencias salientes; toda versión de paquete anclada en el archivo | — |
| `Api` | Tres referencias declaradas | `tests/GeometriaFactory.Integration.Tests/CompositionGateTests.cs` (`QG-10`, puertos) |
| `Web` | Una referencia, `Contracts`; la arista a `Api` llega por `ApiBaseUrl` | — |

## 3. La solución: treinta y un proyectos, de cuatro clases

`GeometriaFactory.sln` nombra **31 `.csproj`** y **9 carpetas de solución** (`visor`, `samples` y
sus siete segmentos). La 3.0 contaba **nueve proyectos**: entraron el visor (2026-09-12, `6cc6f86`),
`E2ETests`, los nueve samples `.csproj` (2026-09-12) y once nodos inertes de samples (2026-09-13,
`252809a`).

| Clase | Cuántos | Cuáles | ¿Se construye con la solución? |
| --- | --- | --- | --- |
| Producto .NET (`src/`) | 6 | los de §1 | Sí |
| Pruebas (`tests/`) | 4 | `Domain.Tests`, `Application.Tests`, `Integration.Tests`, `E2ETests` | Sí las tres primeras; **`E2ETests` no**: sólo tiene `ActiveCfg`, sin `Build.0` |
| Samples ejecutables | 9 | `samples/{domain,application,infrastructure}/0N-…`, `Microsoft.NET.Sdk` | Sí; cada uno referencia su proyecto de `src/` |
| Nodos inertes `Microsoft.Build.NoTargets/3.7.56` | 12 | `visor/geometriafactory-visor.csproj` y 11 samples (`api` 4, `contracts` 3, `visor` 3, `web` 1) | Se «construyen» sin producir ensamblado |

Medido: `grep -c '\.csproj"' GeometriaFactory.sln` → 31; `grep -c 'Build.0'` → 60, es decir
30 proyectos × 2 configuraciones; `git ls-files '*.csproj' | xargs grep -l NoTargets` → 12. La
solución declara sólo `Debug|Any CPU` y `Release|Any CPU`. El detalle de los samples está en
[`09_Samples-Ejecutables.md`](09_Samples-Ejecutables.md); el de las baterías, en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md).

**Referencias de las baterías** (los `.csproj` de `tests/`):

```text
Domain.Tests       -> Domain
Application.Tests  -> Application
Integration.Tests  -> Api, Contracts, Web
E2ETests           -> (ninguna referencia de proyecto; Playwright + NUnit contra el producto levantado)
```

**La regla que sostiene el árbol es una puerta.** `scripts/verify-solution-tree.sh` (decisión
`DC-5` del Product Owner del 2026-09-11: «todos los proyectos quedan bajo el árbol de solución»)
corre en `.github/workflows/ci.yml`; sus seis controles `A-1`…`A-6` y por qué nació están en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) §3.9.

## 4. Qué vive en cada proyecto

Recuentos de `git ls-files` sobre `4b114d7`; «`.cs`» excluye el `.csproj` y los `appsettings`.

### 4.1 `Domain` — 17 `.cs`, sin paquetes propios en el `.csproj` (hereda `MinVer` 8.0.0, `PrivateAssets=All`, de `Directory.Build.props`; mismos archivos que en la 3.0, cambió `Account.cs`)

```text
Entities/   Account · Work · Piece · Component · Observation
Values/     AccountStatus · Role · WorkStatus · WorkOutcome · WorkOperation ·
            FigureType · ComponentRole · ObservationKind · ConditionCode · EmailIdentity
Guards/     Admission · DomainResult
```

Sin dependencias salientes. **El dominio no lee el reloj ni el conjunto** (`ADR-02006`). `Account`
cambió en el período (`CredentialChangedAt`, que sostiene la revocación de accesos al cambiar la
contraseña, `7c94988`). Los conjuntos cerrados están en
[`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md).

### 4.2 `Application` — 28 `.cs`, sin paquetes propios en el `.csproj` (hereda `MinVer` 8.0.0, `PrivateAssets=All`, de `Directory.Build.props`; 27 en la 3.0)

```text
Ports/      IAccountRepository · IWorkRepository · IFigureValidator · ISystemClock
            (+ FigureInterpretation, TextNode — los tipos que los puertos transportan)
Accounts/   RegisterAccountUseCase · ConfigureAdministratorUseCase · ResolveSignInUseCase ·
            ChangeOwnPasswordUseCase · ResetStudentPasswordUseCase ·
            GovernCommissionAccountsUseCase · CredentialCheck · AccountIdentity ·
            AccountSnapshot · ProvisionalCredentialOutcome · RegistrationPolicy (nuevo) ·
            ApplicationConditionCode · InfrastructureConditionCode
Works/      ResolveWorkUseCase · ConsultOwnWorksUseCase · LoadAndEditOwnWorkUseCase ·
            DeleteWorkUseCase · ReviewCommissionWorksUseCase · WorkDetail · WorkListEntry ·
            WorkOutcomeSnapshot
ApplicationResult
```

**Los cuatro puertos son la frontera hacia afuera del dominio** (`ADR-04002`); los define esta capa
y los implementa `Infrastructure`. `ADR-04004` fija el **orden fijo de las cuatro
comprobaciones**; `ADR-04005`, **un caso de uso, una unidad de trabajo**. **`RegistrationPolicy`**
(`Api ADR-00012`, 2026-09-14) acota el autorregistro a los dominios de correo que declara el
despliegue (`Registration__AdmittedEmailDomains__N`); sin dominios, no restringe.

### 4.3 `Infrastructure` — 27 `.cs` (25 en la 3.0)

```text
Persistence/    GeometriaFactoryDbContext · EfCoreAccountRepository · EfCoreWorkRepository ·
                StorePreparation · StoreHealth · Configurations/ (5) ·
                Migrations/ (5 transformaciones × 2 archivos + snapshot + README.md)
Security/       PasswordDerivation · AccessTokenIssuer · ProvisionalPasswordFactory · SigningOptions
Figures/        LocalFigureValidator
Time/           UtcSystemClock
```

La quinta transformación es `20260914112430_CredentialChangedAt`. Paquetes:
`Microsoft.EntityFrameworkCore.Sqlite` 10.0.11, `Microsoft.EntityFrameworkCore.Design` 10.0.11
(`PrivateAssets=all`), `Microsoft.IdentityModel.JsonWebTokens` 8.22.0. Detalle en
[`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md).

### 4.4 `Contracts` — 31 `.cs`, sin paquetes propios en el `.csproj` (hereda `MinVer` 8.0.0, `PrivateAssets=All`, de `Directory.Build.props`; sin cambios de archivos)

```text
Accounts/   13 tipos de transferencia de cuenta y sesión
Works/      13 tipos de trabajo, listado, detalle, observación y desenlace
Errors/     ErrorCode · ErrorDetail · ErrorResponse
Service/    ServiceHealth · LaboratoryProvisioning
```

**Tipos planos, sin dependencias** (`ADR-08001`), y **tipo de error único con conjunto cerrado**
(`ADR-08002`); `ErrorCode.cs` creció en el período (`git diff --stat`: +11 líneas). Es el ensamblado
que los dos procesos compilan a la vez: un cambio incompatible rompe la compilación de los dos
extremos antes que el tiempo de ejecución (`ADR-08003`). Las menciones a `GeometriaFactory-Domain`
en `Works/WorkObservationKind.cs` y `Works/WorkOutcomeName.cs` son comentarios, no referencias.

### 4.5 `Api` — 16 `.cs` (12 en la 3.0)

```text
Program.cs
Composition/  CompositionRoot · TwoPhaseStartup · ContractErrorHandler · ApiDocumentation ·
              ContractRateLimiting (nuevo) · CredentialAttemptThrottle (nuevo) · SecurityHeaders (nuevo)
Endpoints/    AuthenticationEndpoints · AccountEndpoints · CommissionAccountEndpoints ·
              WorkEndpoints · HealthEndpoint · PendingPasswordChangeGuard · ContractTranslation ·
              ContractRoutePrefix (nuevo)
```

Paquetes: `Microsoft.AspNetCore.Authentication.JwtBearer` 10.0.11, `Microsoft.AspNetCore.OpenApi`
10.0.11, `Microsoft.EntityFrameworkCore.Design` 10.0.11 (`PrivateAssets=all`, sólo tiempo de
diseño), `Scalar.AspNetCore` 2.16.20. **Host delgado con composición de raíz única**
(`ADR-00001`) y **arranque en dos fases con punto de salud sin acceso** (`ADR-00007`); la fase 1
que no puede preparar el almacén termina con código **78** (`EX_CONFIG`) en lugar de colgarse
(`Program.cs`). La superficie está en
[`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md).

### 4.6 `Web` — 55 archivos versionados (52 en la 3.0), y `Visor` — 5 fuentes TypeScript

`Web`: **27 `.razor`** —`App`, `Routes`, `_Imports`, 3 de `Layout/`, 15 de `Pages/`, 4 de
`Shared/`, 2 de `Work/`—; **20 `.cs`** —`Program.cs`, **4 en `Integration/`** (`DataServiceClient`,
`DataServiceOutcome`, `BrowserOriginForwardingHandler` y `SecurityHeaders`, los dos últimos
nuevos) y **15 en `Services/`** (`VersionIdentity` nuevo)—; dos `appsettings`; y `wwwroot/`
(`css/app.css`, `css/scaffold.css`, `interaction/surface-interaction.js`, `js/.gitkeep` +
`js/README.md`). Sin `PackageReference` propio; única referencia de proyecto: `Contracts` (hereda `MinVer` de
`Directory.Build.props`).

`Visor`: 15 archivos versionados —5 `.ts` (`src/contract.ts`, `src/main.ts`,
`src/viewer/{instance,meshes,palette}.ts`), `package.json`, `package-lock.json`, `tsconfig.json`,
`webpack.config.js`, `src/viewer/README.md`, cuatro de `verification/` y el nodo `.csproj`—.
Dependencias ancladas exactas: `three` 0.169.0; de desarrollo `typescript` 5.6.3, `webpack`
5.95.0, `webpack-cli` 5.1.4, `ts-loader` 9.5.1, `@types/three` 0.169.0 (`visor/package.json`).
Ambos en [`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md).

## 5. Configuración de construcción compartida

### 5.1 `Directory.Build.props` — una vez para los 31

En la raíz; es el **apartamiento `AP-01`** del árbol del intake §16, declarado en
`Plan-Etapa-A.md` §2.3. Su comentario de cabecera todavía dice «los seis proyectos .NET», y el del
bloque de MinVer dice «los treinta y un proyectos de la solución», que es lo que alcanza (no hay
otro `Directory.Build.props` versionado).

| Propiedad | Valor | Por qué (comentario del archivo) |
| --- | --- | --- |
| `TargetFramework` | `net10.0` | Plataforma del producto |
| `LangVersion` | `latest` | — |
| `Nullable`, `ImplicitUsings` | `enable` | — |
| `InvariantGlobalization` | `true` | — |
| **`TreatWarningsAsErrors`** | **`true`** (con `WarningsAsErrors` vacío) | **La puerta `QG-01`: cero advertencias, y no se arrastran** |
| `AnalysisLevel` | `latest` | Analizadores del SDK en su nivel más reciente |
| `RestoreLockedMode` | `false` | Bajo el rótulo «regla de anclaje de versiones» del intake, Parte C |
| `Deterministic` | `true` | — |
| `GenerateDocumentationFile` | `false` | — |
| **`PackageReference MinVer`** | **`8.0.0`**, `PrivateAssets="All"` | **Nuevo** (`38f0992`, `BT-00033`, decisión `D-03` de la mesa del 2026-09-12) |
| `MinVerTagPrefix` | `v` | `Estrategia-Versionado.md` §3.b |

**La versión la calcula MinVer desde las etiquetas y no se escribe en ningún archivo.** Sobre un
commit sin etiqueta sube PATCH y agrega `-alpha.0.<altura>` (ejemplo del archivo:
`0.8.1-alpha.0.134` sobre `main` el 2026-09-12); un clon sin historial calcula `0.0.0-alpha.0.<n>`
sin fallar, y por eso `ci.yml` pide `fetch-depth: 0` y los dos `Dockerfile` completan el historial.
El SHA lo sigue poniendo el SDK: `AssemblyInformationalVersion` queda `<versión>+<sha>` porque los
dos `Dockerfile` pasan `-p:SourceRevisionId`. Cómo se etiqueta y publica está en
[`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md).

### 5.2 `.editorconfig` — la puerta de estilo

`root = true`; UTF-8, LF, espacios, 4 de sangría (2 en `json/yml/ts/js/md/sh`). En `*.{cs,razor}`,
**dos reglas de nombres con severidad `warning`** —interfaces con prefijo `I` en PascalCase, campos
privados `_camelCase`— que `TreatWarningsAsErrors` vuelve bloqueantes (`Norma-De-Nomenclatura.md`
§3). Su cabecera también dice «para los seis proyectos». No hay `.globalconfig`, `global.json`,
`Directory.Packages.props` ni `nuget.config` versionados. Única biblioteca de analizadores
explícita: `NUnit.Analyzers` 4.3.0 en `E2ETests`.

### 5.3 La arista `Visor → Web` dentro de `GeometriaFactory.Web.csproj`

**Nuevo desde la 3.0** (`6cc6f86`, 2026-09-12; `Web ADR-10008`, aprobado desde el 2026-09-12 según su §3, con fecha de documento
2026-09-13). Hasta
entonces la materializaba `scripts/build-visor.sh` invocado a mano desde cuatro lugares, y un clon
limpio construía un front sin visor sin que nada fallara. Tres targets lo realizan —`BuildVisor`,
`DeclareVisorAsset` y `SealVisorAsset`—; qué hace cada uno y cuándo corre está en
[`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) §2.

El sello va en la consulta y no por `MapStaticAssets` porque esas rutas se resuelven después de
`UseRouting`, dentro del alcance del guardián de aprovisionamiento. `deploy/Dockerfile.web`
conserva una etapa `node:22` que corre el guion y publica con `-p:SkipVisorBuild=true`.
**`visor/geometriafactory-visor.csproj` no construye nada**: lista las fuentes por glob con
`EnableDefaultItems=false` (sin eso arrastraría `node_modules/`, 6.592 ítems medidos según su
comentario). La clase de la arista no cambia: sigue siendo insumo, no referencia.

## 6. Las dos unidades desplegables y cómo se hablan

| Unidad | Tipo | Proyectos que compone | Imagen | Rol |
| --- | --- | --- | --- | --- |
| `GeometriaFactory-Api` (**principal**) | `rest-api` | `Api`, `Infrastructure`, `Application`, `Domain`, `Contracts` | `deploy/Dockerfile` (`ENTRYPOINT GeometriaFactory.Api.dll`, `:8080`) | Servidor propio: sostiene el dato, las reglas y **la única base** |
| `GeometriaFactory-Web` | `web-monolith` | `Web`, `Contracts`, `Visor` | `deploy/Dockerfile.web` (tres etapas: `node:22`, `sdk:10.0`, `aspnet:10.0`; `:8080`) | Hosting público: **único punto de contacto del navegador** |

Fuente: `PRODUCT-MANIFEST` §2.A y §2.C. La partición responde a la topología: el front vive donde
no lo bloquean y los datos donde persisten (intake §14).

### 6.1 El tramo front → servicio de datos

```text
navegador ──HTTPS──▶ front (Blazor Interactive Server)
                       │  DataServiceClient (HttpClient tipado, timeout 10 s)
                       │   + BrowserOriginForwardingHandler (X-Forwarded-For)
                       │   + Authorization: Bearer <acceso firmado de la persona>
                       ▼
                     servicio de datos   ApiBaseUrl + "v1/…"   (y "salud" sin prefijo)
```

| Aspecto | Cómo es | Fuente |
| --- | --- | --- |
| Dirección | `ApiBaseUrl` **por configuración**; sin ella el front no arranca. El valor versionado es el de desarrollo (`http://localhost:5080/`) | `Web/Program.cs`; `Web ADR-10007` |
| Versión de ruta | El cliente antepone `v1/` a toda ruta del contrato salvo `salud`; la cifra está duplicada a propósito porque `Web` no referencia `Api` | `DataServiceClient.cs` (`ContractPrefix`); `Api ADR-00010` |
| Credencial | El acceso firmado de la **persona**, obtenido por canje en `v1/auth/token`, viaja como `Bearer`. **No hay credencial de aplicación** | `DataServiceClient.SendAsync`; `Api ADR-00009` |
| Custodia | El acceso vive en `SessionTokenStore` (singleton del front); el navegador sólo tiene la marca opaca de sesión | `Services/SessionTokenStore.cs`; `Web ADR-10003` |
| Origen del navegador | `BrowserOriginForwardingHandler` **reescribe** `X-Forwarded-For` con la dirección que el front resolvió, sólo dentro de una petición HTTP del navegador (ingreso, registro, cambio obligado); en el circuito interactivo no agrega nada | `Integration/BrowserOriginForwardingHandler.cs`; `Web ADR-10009` (2026-09-14) |
| Confianza en la cabecera | Ambos lados la leen con `UseForwardedHeaders` **sólo** si la red del proxy está en `ForwardedHeaders:KnownNetworks`; un valor que no es CIDR detiene el arranque del front | los dos `Program.cs`; `ContractRateLimiting.KnownNetworksSetting` |
| Estilo | Petición-respuesta, servidor a servidor; sin sondeo ni conexión persistente | `Web/05 Arquitectura-Unidad-Entrega.md` §4 |

**Por qué existe el reenvío del origen.** `BT-00029` limitó el canje y lo anónimo **por dirección
de origen**, y detrás del front toda la comisión era una sola dirección: un cliente que inundara el
ingreso dejaba afuera a la clase (`RN-B1`). `Api ADR-00011` pasó la defensa de fuerza bruta a **la
cuenta** (`CredentialAttemptThrottle`) y dejó la dirección del navegador del lado del front, que la
resolvió con `ADR-10009` (mesa `SDD/Docs/Audit/Mesa-2026-09-14.md`, `R-02`). La red del front
**no está declarada en el árbol versionado**: `deploy/compose.yaml` no nombra `KnownNetworks`, y el
ejemplo `172.23.0.0/16` sólo figura en un comentario de `Web/Program.cs`.

### 6.2 La tubería de cada host, en orden

| # | `Api/Program.cs` | `Web/Program.cs` |
| --- | --- | --- |
| 1 | `UseExceptionHandler` (`ContractErrorHandler`) | `UseForwardedHeaders` |
| 2 | `UseForwardedHeaders` | `UseSecurityHeaders` |
| 3 | `UseSecurityHeaders` | `UseStatusCodePagesWithReExecute("/no-encontrado")` |
| 4 | `UseRouting` | `UseStaticFiles` |
| 5 | `UseAuthentication` | `UseRouting` |
| 6 | `UseRateLimiter` (después de autenticar, antes de autorizar) | `ProvisioningGateMiddleware` (guardián 1) |
| 7 | `UseAuthorization` | `UseAuthentication` · `UseAuthorization` |
| 8 | `PendingPasswordChangeGuard` | `UnrestorableSessionMiddleware` |
| 9 | `MapApiDocumentation` · `MapHealthEndpoint` (fuera de `/v1`) | `PanelSessionGateMiddleware` (guardián 2) |
| 10 | `MapGroup("/v1").RequireRateLimiting("contrato")` con los cuatro grupos de puntos | `StaleFormMiddleware` · `UseAntiforgery` · `MapRazorComponents<App>` |

Antes de la tubería, el front **falla al arrancar** si no puede escribir el almacén de claves de
protección de datos (`App_Data/claves` o `DataProtection:KeysDirectory`), y el servicio corre la
fase 1 de `TwoPhaseStartup`. Los guardianes del front están en
[`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md); la guardia y el límite de tasa, en
[`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md) y
[`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md).

## 7. Piezas transversales nuevas

| Pieza | Dónde | Qué fija | Origen |
| --- | --- | --- | --- |
| **`SecurityHeaders`** (dos clases homónimas, una por host) | `Api/Composition/SecurityHeaders.cs`, `Web/Integration/SecurityHeaders.cs` | Las cabeceras de seguridad de toda respuesta; difieren en `Referrer-Policy` y en la CSP. Valores: [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) §9 | Mesa `Mesa-2026-09-15.md`, `D-3` sobre `R-06`: **en el origen**, porque el borde es del Product Owner (`f68ae34`) |
| **`VersionIdentity`** (`CMP-09`) | `Web/Services/VersionIdentity.cs`, singleton en `Web/Program.cs` | Lee `AssemblyInformationalVersion` una vez: lo previo al `+` es la versión, lo posterior el identificador de construcción; con `-` es **preliminar**; `0.0.0` o ausencia es **indeterminada** | `Representacion-Sello-De-Version.md` §4; mesa `Mesa-2026-09-14.md`, `R-14` (`059311e`). Lo consume `Shared/VersionSeal.razor` |
| **`ContractRoutePrefix`** | `Api/Endpoints/ContractRoutePrefix.cs` | `Major = 1`, `Value = "/v1"`; tres rutas exentas: `/salud`, el documento OpenAPI y `/documentacion`. Sin prefijo, `404` sin redirección | `Api ADR-00010` (`de0b73b`) |
| **`ContractRateLimiting`** + **`CredentialAttemptThrottle`** | `Api/Composition/` | Políticas `contrato` (por persona o por origen) y `canje` (por origen), ventana deslizante; fallos por cuenta en el punto, no en el middleware. Cifras en `appsettings.json` `RateLimiting` | `BT-00029` (`6f15894`), `Api ADR-00011` (`410a7c4`) |
| **`BrowserOriginForwardingHandler`** | `Web/Integration/` | §6.1 | `Web ADR-10009` (`ed097f8`) |
| **`RegistrationPolicy`** | `Application/Accounts/` | §4.2 | `Api ADR-00012` (`203c4e9`) |

## 8. Dónde se decide cada cosa

Cada preocupación se decide **en un solo lugar** (`Vista-Producto.md` §6, con las correcciones que
el árbol impone):

| Preocupación | Dónde se decide |
| --- | --- |
| Formato de errores común, conjunto cerrado, ninguna capa inventa códigos | `Contracts ADR-08002` + `Api ADR-00004` |
| Regla de exposición de la frontera | `Contracts ADR-08004` |
| Formato de intercambio, **una sola configuración en todo el producto** | `Api ADR-00002` + `Contratos-REST.md` §2.2 |
| Normalización de correos: **exactamente un componente** (también la usa la partición por cuenta) | `Infrastructure ADR-06003` |
| Unidad de trabajo y escritura | `Application ADR-04005` + `Infrastructure ADR-06002` |
| Versionado del contrato: compilación compartida y **despliegue conjunto**; **versión `MAJOR` en la ruta** desde el 2026-09-12 | `Contracts ADR-08003` + `Api ADR-00008` (regla 1 **derogada**) + `Api ADR-00010` |
| Versión del producto: MinVer desde etiquetas `v*` | `Directory.Build.props`; `Estrategia-Versionado.md` |
| Identidad: **personas, no aplicaciones**; el front actúa en nombre de una | `Api ADR-00009` |
| Dirección del servicio de datos en el front: **por configuración** | `Web ADR-10007` + `Producto ADR-14003` |
| Origen del navegador hacia el servicio | `Web ADR-10009` + `Api ADR-00011` |
| Bundle del visor: un solo generador | `Web ADR-10008` |
| Cabeceras de seguridad: en el origen, una clase por host | Mesa `Mesa-2026-09-15.md` `D-3` (sin ADR) |
| Registro y trazas: **no hay correlación distribuida, y es decisión** | `Api/05` §7 y §8 |

`Vista-Producto.md` §5 y §6 y el riesgo `RI-02` siguen diciendo «**sin versionado de rutas**» y
citando sólo `ADR-00008`; la superficie se publica bajo `/v1` (ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md)).

## 9. Riesgos de integración, los que viven en las fronteras

`Vista-Producto.md` §7, sin cambios de texto en el período:

| Id | Riesgo | Mitigación |
| --- | --- | --- |
| `RI-01` | Los dos extremos se configuran distinto sin romper ninguna compilación | Una sola configuración de intercambio, y verificación **ejerciendo el servicio real** |
| `RI-02` | Los dos procesos se despliegan desacoplados tras un cambio de contrato | **Despliegue conjunto** como regla operativa. Hoy además el `MAJOR` en la ruta: el prefijo del cliente es una constante de código, no de configuración |
| `RI-03` | Una capa de arriba reabre lo que una de abajo ya decidió | Tabla de decisiones heredadas en el §2.2 de cada documento maestro |
| `RI-04` | El bundle del visor adquiere red, configuración o identidad | Puerta medida **sobre el bundle generado** (`ADR-12003`) y fachada (`ADR-10006`) |
| `RI-05` | Una dirección interna o un secreto cruzan dentro de un mensaje de error | `DX-Error-Messages.md` §1.4, con tabla de prohibiciones |
| `RI-06` | Un identificador o un recuento envejece en un documento y no en el otro | **Contar sobre el instrumento**, no heredar el número |

`RI-06` es el que este indexado volvió a encontrar —el mismo producto declara 45 ADR y hay 59,
«seis» proyectos donde la configuración alcanza a 31—: ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) y, para el inventario de
decisiones, [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).
