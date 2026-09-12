# 02 · Arquitectura y proyectos — cómo está partido el código

> **Propósito.** El mapa del eje de construcción: los siete proyectos, sus capas, su grafo, el
> orden en que se compilan y dónde vive cada responsabilidad en el árbol.
> **Fuente primaria.** `GeometriaFactory.sln`, los seis `.csproj` de `src/`,
> `SDD/Docs/Producto/Vista-Producto.md` §2 y §3, y `git ls-files src/ visor/` en la revisión
> `89f3ab3`.

---

## 1. Los siete proyectos de código

| Proyecto | Identidad | Rol | Depende de | Compone |
| --- | --- | --- | --- | --- |
| `GeometriaFactory-Domain` | `GeometriaFactory.Domain` | Entidades e invariantes. **Centro de la regla de dependencias** | — | `Api` |
| `GeometriaFactory-Application` | `GeometriaFactory.Application` | Casos de uso y **los cuatro puertos** | `Domain` | `Api` |
| `GeometriaFactory-Infrastructure` | `GeometriaFactory.Infrastructure` | Adaptadores de los cuatro puertos, seguridad y validador de figuras | `Application`, `Domain` | `Api` |
| `GeometriaFactory-Api` | `GeometriaFactory.Api` | Host REST: puntos de acceso, autenticación, composición de raíz | `Application`, `Infrastructure`, `Contracts` | `Api` |
| `GeometriaFactory-Contracts` | `GeometriaFactory.Contracts` | Tipos de transferencia. **Único proyecto compartido por los dos procesos** | — | `Api` y `Web` |
| `GeometriaFactory-Web` | `GeometriaFactory.Web` | Front: páginas y componentes. Hoja del grafo | `Contracts`, `Visor` | `Web` |
| `GeometriaFactory-Visor` | `geometriafactory-visor` | Bundle 3D; **visualizador puro** | — | `Web` |

**El visor es la excepción de nombre y de ruta, y está declarada.** Va en minúscula con guiones
porque la forma general sería un nombre inválido en su gestor de paquetes, y su carpeta es
`visor/` en la raíz y no bajo `src/`, para que las dos cadenas de herramientas no compartan raíz.
Es apartamiento declarado, no incumplimiento (`Vista-Producto.md` §2).

## 2. El grafo, con la clase de cada arista

**Ocho aristas de compilación, de dos clases** (`Vista-Producto.md` §3.1, cerrada el 2026-08-31
contra los `.csproj`; recontadas el 2026-09-11 con el mismo resultado):

```text
referencias de proyecto (7) — las que un .csproj materializa
    Domain         -> Application
    Domain         -> Infrastructure
    Application    -> Infrastructure
    Application    -> Api
    Infrastructure -> Api
    Contracts      -> Api
    Contracts      -> Web

activo de construcción (1) — ningún .csproj puede expresarlo
    Visor          -> Web        (scripts/build-visor.sh copia el bundle a wwwroot/js/)
```

**`Web → Api` no está en el grafo de compilación**: es de **tiempo de ejecución**, por HTTP con
los tipos de `Contracts`, contra los que los dos extremos compilan por separado. Por eso el grafo
sigue siendo acíclico, y por eso el producto tiene dos procesos desplegables y no uno.

**Orden topológico, cuatro niveles:**

```text
nivel 0: Domain, Contracts, Visor      (paralelizables)
nivel 1: Application, Web              (paralelizables)
nivel 2: Infrastructure
nivel 3: Api
```

**La solución no contiene los siete.** `GeometriaFactory.sln` tiene **nueve proyectos**: los seis
de `src/` y tres de `tests/`. El visor es Node y se construye aparte; la batería de extremo a
extremo tampoco está en la solución (ver
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md)).

**El activo `Visor → Web` es también lo que obliga a la imagen del front a tener una etapa de
Node**: el `.csproj` del front no invoca a `npm`, `wwwroot/js/` está en el `.gitignore`, y un clon
limpio construye un front **sin visor y sin que nada falle**. `deploy/Dockerfile.web` lo resuelve
invocando `scripts/build-visor.sh` en su primera etapa (ver
[`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) §4.2).

## 3. Qué vive en cada proyecto

Los recuentos son de archivos `.cs` versionados, sin el `.csproj` ni los `appsettings`.

### 3.1 `Domain` — 17 archivos, sin paquetes

```text
Entities/   Account · Work · Piece · Component · Observation
Values/     AccountStatus · Role · WorkStatus · WorkOutcome · WorkOperation ·
            FigureType · ComponentRole · ObservationKind · ConditionCode · EmailIdentity
Guards/     Admission · DomainResult
```

Sin dependencias salientes. **El dominio no lee el reloj ni el conjunto** (`ADR-02006`): lo que no
cruza la frontera es tan contrato como lo que cruza. Los conjuntos cerrados están en
[`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md).

### 3.2 `Application` — 27 archivos, sin paquetes

```text
Ports/      IAccountRepository · IWorkRepository · IFigureValidator · ISystemClock
            (+ FigureInterpretation, TextNode — los tipos que los puertos transportan)
Accounts/   RegisterAccountUseCase · ConfigureAdministratorUseCase · ResolveSignInUseCase ·
            ChangeOwnPasswordUseCase · ResetStudentPasswordUseCase ·
            GovernCommissionAccountsUseCase · CredentialCheck · AccountIdentity ·
            AccountSnapshot · ProvisionalCredentialOutcome ·
            ApplicationConditionCode · InfrastructureConditionCode
Works/      ResolveWorkUseCase · ConsultOwnWorksUseCase · LoadAndEditOwnWorkUseCase ·
            DeleteWorkUseCase · ReviewCommissionWorksUseCase · WorkDetail · WorkListEntry ·
            WorkOutcomeSnapshot
ApplicationResult
```

**Los cuatro puertos son la frontera hacia afuera del dominio** (`ADR-04002`), y la dependencia se
invierte: los define esta capa y los implementa `Infrastructure`. `ADR-04004` fija el **orden fijo
de las cuatro comprobaciones**; `ADR-04005`, **un caso de uso, una unidad de trabajo**.

### 3.3 `Infrastructure` — 25 archivos

```text
Persistence/    GeometriaFactoryDbContext · EfCoreAccountRepository · EfCoreWorkRepository ·
                StorePreparation · StoreHealth · Configurations/ (5) ·
                Migrations/ (4 transformaciones + snapshot + README)
Security/       PasswordDerivation · AccessTokenIssuer · ProvisionalPasswordFactory · SigningOptions
Figures/        LocalFigureValidator
Time/           UtcSystemClock
```

Paquetes: `Microsoft.EntityFrameworkCore.Sqlite` 10.0.11, `Microsoft.EntityFrameworkCore.Design`
10.0.11, `Microsoft.IdentityModel.JsonWebTokens` 8.22.0. Detalle en
[`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md).

### 3.4 `Contracts` — 31 archivos, sin paquetes

```text
Accounts/   13 tipos de transferencia de cuenta y sesión
Works/      13 tipos de trabajo, listado, detalle, observación y desenlace
Errors/     ErrorCode · ErrorDetail · ErrorResponse
Service/    ServiceHealth · LaboratoryProvisioning
```

**Tipos planos, sin dependencias** (`ADR-08001`), y **tipo de error único con conjunto cerrado**
(`ADR-08002`). Es el ensamblado que los dos procesos compilan a la vez: por eso un cambio
incompatible rompe la compilación de los dos extremos antes que el tiempo de ejecución, que es la
política de versionado del producto (`ADR-08003`).

### 3.5 `Api` — 12 archivos

```text
Program.cs
Composition/  CompositionRoot · TwoPhaseStartup · ContractErrorHandler · ApiDocumentation
Endpoints/    AuthenticationEndpoints · AccountEndpoints · CommissionAccountEndpoints ·
              WorkEndpoints · HealthEndpoint · PendingPasswordChangeGuard · ContractTranslation
```

Paquetes: `Microsoft.AspNetCore.Authentication.JwtBearer` 10.0.11, `Microsoft.AspNetCore.OpenApi`
10.0.11, `Microsoft.EntityFrameworkCore.Design` 10.0.11, `Scalar.AspNetCore` 2.16.20.

**Host delgado con composición de raíz única** (`ADR-00001`) y **arranque en dos fases con punto
de salud sin acceso** (`ADR-00007`). La superficie está en
[`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md).

### 3.6 `Web` — 52 archivos versionados, y `Visor` — 5 fuentes TypeScript

`Web`: 18 componentes `.razor` (3 de `Layout/`, 15 de `Pages/`), 4 de `Shared/`, 2 de `Work/`,
2 de `Integration/`, 14 servicios en `Services/`, `Program.cs`, `App.razor`, `Routes.razor`,
`_Imports.razor`, dos `appsettings`, y `wwwroot/` (`css/app.css`, `css/scaffold.css`,
`interaction/surface-interaction.js`, `js/.gitkeep` + `js/README.md`). Único paquete de proyecto:
la referencia a `Contracts`. Ambos en [`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md).

## 4. Configuración de construcción compartida

`Directory.Build.props`, en la raíz, gobierna los seis proyectos .NET. Es el **apartamiento
`AP-01`** del árbol del intake §16, declarado en `Plan-Etapa-A.md` §2.3: la puerta es la misma
para los seis y vivir repetida en seis archivos la desincroniza.

| Propiedad | Valor | Por qué |
| --- | --- | --- |
| `TargetFramework` | `net10.0` | Plataforma del producto |
| `LangVersion` | `latest` | — |
| `Nullable`, `ImplicitUsings` | `enable` | — |
| `InvariantGlobalization` | `true` | Un curso, una cultura |
| **`TreatWarningsAsErrors`** | **`true`** | **Es la puerta `QG-01`: cero advertencias, y no se arrastran** |
| `AnalysisLevel` | `latest` | — |
| `Deterministic` | `true` | Reproducibilidad de la imagen |
| `GenerateDocumentationFile` | `false` | — |

## 5. Lo transversal, y dónde se decide cada cosa

Cada preocupación se decide **en un solo lugar**; esta tabla dice cuál (`Vista-Producto.md` §6).

| Preocupación | Dónde se decide |
| --- | --- |
| Formato de errores común, conjunto cerrado, ninguna capa inventa códigos | `Contracts ADR-08002` + `Api ADR-00004` |
| Regla de exposición de la frontera | `Contracts ADR-08004` |
| Formato de intercambio y su configuración, **una sola en todo el producto** | `Api ADR-00002` + `Contratos-REST.md` §2.2 |
| Normalización de correos: **exactamente un componente lo hace** | `Infrastructure ADR-06003` |
| Unidad de trabajo y escritura | `Application ADR-04005` + `Infrastructure ADR-06002` |
| Versionado: por compilación compartida, **sin versionado de rutas, con despliegue conjunto** | `Contracts ADR-08003` + `Api ADR-00008` |
| Dirección del servicio de datos en el front: **por configuración**, y como IP dinámica actualizada a mano | `Web ADR-10007` + `Producto ADR-14003` |
| Registro y trazas: **no hay correlación distribuida, y es decisión** | `Api/05` §7 y §8 |

## 6. Riesgos de integración, los que viven en las fronteras

| Id | Riesgo | Mitigación |
| --- | --- | --- |
| `RI-01` | Los dos extremos se configuran distinto sin romper ninguna compilación | Una sola configuración de intercambio, y verificación **ejerciendo el servicio real** |
| `RI-02` | Los dos procesos se despliegan desacoplados tras un cambio de contrato | **Despliegue conjunto** declarado como regla operativa |
| `RI-03` | Una capa de arriba reabre lo que una de abajo ya decidió | Tabla de decisiones heredadas en el §2.2 de cada documento maestro |
| `RI-04` | El bundle del visor adquiere red, configuración o identidad | Puerta medida **sobre el bundle generado** (`ADR-12003`) |
| `RI-05` | Una dirección interna o un secreto cruzan dentro de un mensaje de error | `DX-Error-Messages.md` §1.4, con tabla de prohibiciones |
| `RI-06` | Un identificador o un recuento envejece en un documento y no en el otro | **Contar sobre el instrumento**, no heredar el número. Es el defecto con más historia del producto |

`RI-06` es el que cada indexado vuelve a encontrar: ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).
