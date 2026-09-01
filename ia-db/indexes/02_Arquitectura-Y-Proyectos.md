# 02 · Arquitectura y proyectos de código

> **Propósito:** ubicar cualquier archivo de `src/` en su capa y explicar por qué las dependencias
> van en la dirección en que van.
> **Fuente primaria:** `Lab-Geometria/src/` (comentarios `<summary>`/`<remarks>` de cada tipo),
> `GeometriaFactory.sln`, `Directory.Build.props` y
> `SDD/Docs/Unidades-Entrega/*/05-Arquitectura-Tecnica/`.

---

## 1. El grafo

```mermaid
graph TD
  Domain[GeometriaFactory.Domain<br/>sin dependencias]
  Application[GeometriaFactory.Application<br/>casos de uso + 4 puertos]
  Infrastructure[GeometriaFactory.Infrastructure<br/>adaptadores]
  Contracts[GeometriaFactory.Contracts<br/>tipos de transferencia]
  Api[GeometriaFactory.Api<br/>host REST]
  Web[GeometriaFactory.Web<br/>front Blazor]
  Visor[geometriafactory-visor<br/>bundle 3D]

  Application --> Domain
  Infrastructure --> Application
  Infrastructure --> Domain
  Api --> Application
  Api --> Infrastructure
  Api --> Contracts
  Web --> Contracts
  Visor -. bundle copiado por build-visor.sh .-> Web
  Web == HTTP, credencial firmada ==> Api
```

La arista doble `Web ⇒ Api` **es de integración, no de compilación**. Las aristas de compilación son
ocho: las siete referencias de proyecto del diagrama más `Visor → Web`.

**El dominio es el centro de la regla de dependencias**: no referencia nada, no lee el reloj y no
conoce el conjunto (`ADR-02006`). Una prueba de la batería de dominio —`DependencyGateTests`—
verifica esa regla como puerta.

---

## 2. `GeometriaFactory.Domain` — entidades e invariantes

```
Entities/   Account · Work · Piece · Component · Observation
Values/     AccountStatus · ComponentRole · ConditionCode · EmailIdentity · FigureType
            ObservationKind · Role · WorkOperation · WorkOutcome · WorkStatus
Guards/     Admission (resultado de admisibilidad, Domain CU-04) · DomainResult (resultado tipado)
```

Modelo de dominio **rico con invariantes explícitas** (`ADR-02001`), superficie pública de guardas y
resultados tipados (`ADR-02002`), y una **guarda única de admisibilidad** (`ADR-02005`). El detalle
de cada tipo está en [`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md).

## 3. `GeometriaFactory.Application` — casos de uso y puertos

```
Accounts/   RegisterAccountUseCase (CU-01) · ResolveSignInUseCase (CU-03)
            ChangeOwnPasswordUseCase (CU-03 FA-03/FA-05) · ConfigureAdministratorUseCase (CU-10)
            GovernCommissionAccountsUseCase (CU-02) · ResetStudentPasswordUseCase (CU-11)
            AccountIdentity · AccountSnapshot · CredentialCheck · ProvisionalCredentialOutcome
            ApplicationConditionCode · InfrastructureConditionCode
Works/      LoadAndEditOwnWorkUseCase (CU-04) · ConsultOwnWorksUseCase (CU-06)
            ReviewCommissionWorksUseCase (CU-07) · DeleteWorkUseCase (CU-09)
            ResolveWorkUseCase (CU-10) · WorkDetail · WorkListEntry · WorkOutcomeSnapshot
Ports/      IAccountRepository · IWorkRepository · IFigureValidator · ISystemClock
            FigureInterpretation (lo que devuelve el validador) · TextNode (el texto como árbol)
ApplicationResult.cs   Resultado tipado con catálogo cerrado de condiciones (ADR-04006)
```

**Los cuatro puertos y la frontera que declaran** son `ADR-04002`. Tres los declaró el intake
(`IWorkRepository`, `IFigureValidator`, `ISystemClock`); el cuarto, `IAccountRepository`, lo
**propuso** `Plan-Etapa-A.md` §1.5 y existe desde la etapa `c`. Reglas asociadas: inversión de
dependencias (`ADR-04001`), **un caso de uso, una unidad de trabajo** (`ADR-04005`) y **orden fijo
de las cuatro comprobaciones** (`ADR-04004`).

## 4. `GeometriaFactory.Infrastructure` — adaptadores

```
Persistence/  GeometriaFactoryDbContext (UNO POR OPERACIÓN) · StorePreparation
              EfCoreAccountRepository · EfCoreWorkRepository
              Configurations/ (5) · Migrations/ (4 + snapshot)
Security/     AccessTokenIssuer · PasswordDerivation · ProvisionalPasswordFactory · SigningOptions
Figures/      LocalFigureValidator — motor propio, en proceso y SIN RED
Time/         UtcSystemClock
```

**Un adaptador por puerto, sin repositorio genérico** (`ADR-06001`). El detalle está en
[`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md).

## 5. `GeometriaFactory.Contracts` — la frontera

```
Accounts/  12 tipos: registro, canje de credenciales, sesión, cambio y reseteo de contraseña,
           alta y situación de cuenta, listado
Works/     13 tipos: envío, interpretación, listado, detalle, pieza, observación, desenlace, árbol de texto
Errors/    ErrorCode (conjunto CERRADO) · ErrorDetail · ErrorResponse
Service/   ServiceHealth · LaboratoryProvisioning
```

**Único proyecto compartido por las dos unidades desplegables**: tipos planos sin dependencias
(`ADR-08001`), tipo de error único con conjunto cerrado (`ADR-08002`), versionado por compilación
compartida (`ADR-08003`) y regla de exposición de la frontera (`ADR-08004`).

## 6. `GeometriaFactory.Api` — host delgado

```
Program.cs             Arranque
Composition/           CompositionRoot (ÚNICO lugar donde se conectan puertos y adaptadores, ADR-06)
                       TwoPhaseStartup (arranque en dos fases, ADR-07)
                       ContractErrorHandler (el último borde: todo fallo sale cumpliendo el contrato)
                       ApiDocumentation (documento OpenAPI + explorador Scalar)
Endpoints/             AuthenticationEndpoints · AccountEndpoints · CommissionAccountEndpoints
                       WorkEndpoints · HealthEndpoint · ContractTranslation · PendingPasswordChangeGuard
```

**Host delgado con composición de raíz única** (`ADR-00001`): los puntos de acceso traducen y
delegan; no deciden. Ver [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md).

## 7. `GeometriaFactory.Web` y el visor

Detallados en [`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md).

---

## 8. Lo que `Directory.Build.props` impone a los seis

| Propiedad | Valor | Por qué |
| --- | --- | --- |
| `TargetFramework` | `net10.0` | Plataforma única del producto |
| `Nullable` / `ImplicitUsings` | `enable` | — |
| `InvariantGlobalization` | `true` | Sin dependencia de datos de cultura |
| `TreatWarningsAsErrors` | `true` | **Es la puerta `QG-01`**: una advertencia detiene la construcción |
| `Deterministic` | `true` | Construcción reproducible |
| `AnalysisLevel` | `latest` | — |

El archivo existe como **apartamiento `AP-01`** del árbol del intake §16, declarado en
`Plan-Etapa-A.md` §2.3: la puerta vive una sola vez en lugar de repetirse en seis `.csproj` y
desincronizarse.
