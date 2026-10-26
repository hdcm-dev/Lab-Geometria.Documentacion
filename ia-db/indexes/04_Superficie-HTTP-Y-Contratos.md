# 04 · Superficie HTTP y contratos — qué expone el servicio de datos

> **Propósito.** Las rutas reales, el prefijo de versión, los tipos que viajan, los códigos de
> error y cómo se traducen, el límite de tasa, las cabeceras y el documento OpenAPI, para escribir
> un cliente o un caso de prueba sin abrir el código.
> **Fuente primaria.** `src/GeometriaFactory.Api/Endpoints/`, `src/GeometriaFactory.Api/Composition/`,
> `src/GeometriaFactory.Contracts/`, `src/GeometriaFactory.Web/Integration/`, y
> `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Contratos-REST.md` **1.11**
> (2026-09-13) con `02-Especificacion-Funcional/Definicion-Superficie-HTTP.md` **1.15** (2026-09-14).
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. Los diecisiete puntos de acceso

Diecisiete llamadas `Map{Get,Post,Delete}` en los cinco contratos de punto de
`src/GeometriaFactory.Api/Endpoints/` (`AuthenticationEndpoints` 1, `AccountEndpoints` 4,
`CommissionAccountEndpoints` 4, `WorkEndpoints` 7, `HealthEndpoint` 1), sobre **catorce constantes
de ruta y trece plantillas distintas** (`/cuentas` la declaran dos constantes: `RegistrationRoute` y
`AccountsRoute`). **Desde `BT-00032` (2026-09-12) dieciséis cuelgan de `/v1` y uno queda exento.**

| Id | Verbo y ruta pública | Papel exigido | Metadato | Qué hace |
| --- | --- | --- | --- | --- |
| `A-01` | `POST /v1/auth/token` | — | `AllowAnonymous` + política `canje` | Canjea correo y contraseña por `SessionResponse` |
| `A-02` | `POST /v1/cuentas` | — | `AllowAnonymous` | Registra una cuenta de alumno **sin campo de contraseña**; sólo con correo de un dominio admitido si el despliegue declara alguno (§4) |
| `A-03` | `POST /v1/cuentas/administrador` | — | `AllowAnonymous` | Configura la cuenta administradora, **sólo mientras no exista ninguna** |
| `A-05` | `POST /v1/cuenta/contrasena` | Alumno o Administrador **con sesión**; ninguno en la forma forzada | `AllowAnonymous` | Cambia la contraseña propia exigiendo la vigente. **Dos formas** (§1.1). Único punto que levanta la marca |
| `A-06` | `GET /v1/cuentas` | Administrador | `RequireAuthorization` | Lista las cuentas de la comisión con su situación y su marca |
| `A-07` | `POST /v1/cuentas/{id}/situacion` | Administrador | `RequireAuthorization` | Cambia la situación. **Habilitar y rehabilitar devuelven la provisoria** |
| `A-08` | `DELETE /v1/cuentas/{id}` | Administrador | `RequireAuthorization` | Baja con arrastre, con **el correo escrito como confirmación** en el cuerpo. `204` |
| `A-09` | `POST /v1/cuentas/{id}/reseteo-de-contrasena` | Administrador | `RequireAuthorization` | Resetea, devuelve la provisoria **una sola vez** y **libera la cuota de fallos de la cuenta** (§6) |
| `A-10` | `POST /v1/trabajos` | Alumno | `RequireAuthorization` | Envía un trabajo nuevo, con el texto original **sin normalizar**. `201` |
| `A-11` | `POST /v1/trabajos/{id}` | Alumno | `RequireAuthorization` | Reenvía un trabajo que quedó en `Borrador` |
| `A-12` | `DELETE /v1/trabajos/{id}` | Alumno o Administrador | `RequireAuthorization` | Elimina, **con los dos alcances opuestos**. `204` |
| `A-13` | `GET /v1/trabajos` | Alumno o Administrador | `RequireAuthorization` | Lista con el alcance que el papel determina, **sin componentes**; filtro `?alumno=` |
| `A-14` | `GET /v1/trabajos/{id}` | Alumno o Administrador | `RequireAuthorization` | Detalle del trabajo interpretado |
| `A-15` | `POST /v1/trabajos/{id}/desenlace` | Administrador | `RequireAuthorization` | Aprueba o rechaza un trabajo en `Pendiente`, con comentario opcional |
| `A-16` | `GET /salud` — **exento** | — | `AllowAnonymous` | `ServiceHealth`; `200` listo, `503` si no. **Evalúa el almacén en cada consulta** |
| `A-17` | `GET /v1/aprovisionamiento` | — | `AllowAnonymous` | `LaboratoryProvisioning`: **si el laboratorio ya tiene administrador**, y nada más. Sólo `200` |
| `A-18` | `POST /v1/interpretaciones` | Alumno | `RequireAuthorization` | **Interpreta un texto sin guardar nada**, para la previsualización |

Los `{id}` son `{id:guid}` en el código; el filtro de `A-13` es la constante
`WorkEndpoints.StudentFilterParameter = "alumno"`, en castellano porque es superficie. `A-04` está
retirado y **no reciclado** (`AccountEndpoints.cs`, cabecera).

**El recuento por metadato: seis `AllowAnonymous` —`A-01`, `A-02`, `A-03`, `A-05`, `A-16`,
`A-17`— y once `RequireAuthorization`.** Los documentos cuentan distinto, porque `A-05` acepta las
dos formas: `Contratos-REST.md` §3 dice «cinco sin credencial firmada y doce bajo la guardia», y
`Definicion-Superficie-HTTP.md` §3 «cinco, `A-05` con las dos formas, y diez restantes», que suman
dieciséis sobre una tabla de diecisiete (ver
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md)).

### 1.1 `A-05`, el punto de dos formas

| Forma | Cómo se reconoce | Qué exige | Qué responde |
| --- | --- | --- | --- |
| **Con sesión** | La petición trae un acceso firmado utilizable; **el correo del cuerpo no se mira** | Contraseña vigente | **`200` con `SessionResponse` nuevo** (REF-02, PR #212): el cambio revoca todo acceso emitido antes, incluido el que lo pidió, y el nuevo se emite con el mismo instante con que se selló el cambio |
| **Forzada, sin sesión** | Sin acceso; la cuenta la nombra `Email` | Contraseña vigente, **y la cuota de fallos por cuenta** (§6) | `200` **sin cuerpo**: la persona vuelve a canjear |
| Ni acceso ni correo | — | — | `401` `INVALID_CREDENTIALS`, la respuesta neutra |

Lleva `AllowAnonymous` a propósito (intake 1.34): exigir acceso dejaba inalcanzable el cambio
forzado, porque RN-13 le niega la sesión a la cuenta marcada. La guardia de cambio pendiente la
exceptúa **por nombre de punto** (`ChangeOwnPassword`), no por ruta
(`PendingPasswordChangeGuard.ExemptEndpointName`). Fuente: `AccountEndpoints.cs` líneas 208–344.

**Por qué existe `A-17`, que parece redundante con `A-16`.** El guardián de aprovisionamiento del
front necesitaba que un anónimo preguntara si hay administrador; `A-03` escribe, `A-06` exige papel
y `A-16` responde por la salud. **El dato no se le agregó a `A-16` a propósito**: la salud la
consume el `healthcheck` de las composiciones, y mezclarle un hecho del producto acopla dos cosas
que cambian por motivos distintos (`AccountEndpoints.cs`, comentario de `A-17`).

## 2. El prefijo de versión

`Endpoints/ContractRoutePrefix.cs` es **el único lugar donde la versión se escribe**: `Major = 1`,
`Value = "/v1"`. `Program.cs` abre **un solo grupo** (`app.MapGroup(ContractRoutePrefix.Value)`) del
que cuelgan los cuatro contratos de punto del producto; cada contrato declara su ruta **relativa**.
Lo decidió `ADR-00010` (versión 1.2, aceptado): **sólo el `MAJOR`, y es el del producto**. Supera
parcialmente a `ADR-00008` (derogada su regla 1; subsisten las reglas 2 a 5 y el despliegue
conjunto entre las dos piezas que compilan contra el mismo ensamblado).

| Ruta fuera del prefijo | Por qué |
| --- | --- |
| `/salud` (`A-16`) | Es del arranque y la salud, no del contrato: la piden los `healthcheck` de las dos composiciones y la página de estado del front, y es donde se informa la versión contra la que `ADR-00010` §8 compara el prefijo |
| `/openapi/v1.json` | Describe la superficie y no es parte de ella (`ADR-08008`). El `v1` es el del **documento** |
| `/documentacion` | Explorador Scalar; mismo motivo |

`ContractRoutePrefix.ExemptRoutes` enumera las tres; una cuarta ruta sin prefijo hace fallar la
prueba aunque tenga motivo. **Sin prefijo no hay contrato**: `/cuentas` o `/trabajos` responden
`404`, sin redirección y sin cuerpo, y no `401` (`ContractRoutePrefixTests`).

**La convivencia de dos `MAJOR` está escrita y no ejercida**: cuando exista `/v{N+1}/`, `/v{N}/`
convive un cuatrimestre como mínimo con `Deprecation` y `Sunset`, y al vencer responde `410`
(`Contratos-REST.md` §3.1, `09-Devops/Estrategia-Versionado.md` §6.b, `BT-00035`). **Hoy sólo
existe `/v1/`**; ninguna respuesta lleva esas cabeceras y `410` no está entre los códigos.

## 3. Los tipos que viajan

`src/GeometriaFactory.Contracts/`, **tipos planos sin dependencias** (`ADR-08001`): **31 archivos
`.cs` con 32 tipos** (`WorkPieceComponent` vive dentro de `Works/WorkPiece.cs`). Ningún tipo cambió
entre `89f3ab3` y `4b114d7`: el único archivo tocado es `Errors/ErrorCode.cs` (+11 líneas, §4).

| Carpeta | Tipos |
| --- | --- |
| `Accounts/` (13) | `CredentialExchangeRequest`, `SessionResponse`, `AccountRegistrationRequest`/`Response`, `AdministratorSetupRequest`, `AccountSetupResponse`, `OwnPasswordChangeRequest`, `PasswordResetRequest`/`Response`, `AccountStatusChangeRequest`/`Response`, `AccountDeletionRequest`, `AccountListItem` |
| `Works/` (14 en 13 archivos) | `WorkSubmissionRequest`/`Response`, `WorkInterpretationRequest`/`Response`, `WorkListItem`, `WorkDetailResponse`, `WorkPiece`, `WorkPieceComponent`, `WorkObservation`, `WorkObservationKind`, `WorkTextNode`, `WorkOutcomeRequest`/`Response`, `WorkOutcomeName` |
| `Errors/` (3) | `ErrorCode`, `ErrorDetail`, `ErrorResponse` |
| `Service/` (2) | `ServiceHealth`, `LaboratoryProvisioning` |

Formas que conviene tener a mano:

| Tipo | Forma |
| --- | --- |
| `SessionResponse` | `(AccessToken, AccountId, Email, Role)` — lo devuelven `A-01` y la forma con sesión de `A-05` |
| `ErrorResponse` | `(Code, Message, Details, OccurredAt)`; `Details` es lista de `ErrorDetail(Field, FigureIndex?)` |
| `ServiceHealth` | `(Ready, Version, ServerTimeUtc)` |
| `LaboratoryProvisioning` | `(AdministratorConfigured)` |

**El listado no arrastra el detalle** (`ADR-08005`): `WorkListItem` es proyección propia. **El visor
recibe piezas reconstruidas y no el texto** (`ADR-08006`), y `A-18` es la contrapartida declarada.
`ContractTranslation` traduce piezas, observaciones y árbol del texto **por transposición y no por
redacción**: los conjuntos cerrados viajan **por su nombre**, el orden es el del conjunto raíz, y
el campo de una observación conserva la clave del texto del alumno (`Tipo`, `Largo`, `Area`).

**El formato de intercambio** lo fija `ADR-00002` y `Contratos-REST.md` §2.2 para los dos extremos:
ocho filas, **seis reglas de formato** (nombres tal como el tipo, conjuntos cerrados por nombre,
nulos emitidos, decimales sin cultura, lectura estricta, un solo límite de cuerpo sin truncar) más
la notación y la **prohibición de normalizar el texto original**. *No verificado*: en `src/` no
aparece configuración explícita del serializador ni del límite de cuerpo (búsqueda de
`ConfigureHttpJsonOptions`, `UnmappedMember`, `MaxRequestBodySize` sin resultados); la regla se
declara en el documento y no se localizó en el código.

## 4. Los códigos de error del contrato

`ErrorCode` es un **conjunto cerrado**: lo que no declara, no viaja como código, y **la capa que
expone no inventa códigos** (`ADR-00004`). **Dieciséis constantes en el ensamblado** (`grep -c
'public const string'` sobre `ErrorCode.cs`).

| Constante | Valor | Cuándo |
| --- | --- | --- |
| `RequiredFieldMissing` | `REQUIRED_FIELD_MISSING` | Falta un campo (la respuesta lo nombra en `Details`); también alta sin credencial, valor derivado vacío y desenlace fuera del conjunto |
| `InvalidCredentials` | `INVALID_CREDENTIALS` | **Genérico a propósito**: cuenta inexistente o credencial no verificada, sin decir cuál |
| `AccountNotEnabled` | `ACCOUNT_NOT_ENABLED` | Cuenta `Pending` o `Blocked`, **con texto distinto por motivo** y el mismo código |
| `EmailAlreadyRegistered` | `EMAIL_ALREADY_REGISTERED` | `RN-02002` |
| `EmailDomainNotAdmitted` | `EMAIL_DOMAIN_NOT_ADMITTED` | **Nuevo (2026-09-14, `ADR-00012`, PR #220)**: el correo del registro no es de un dominio admitido. Se verifica **antes** que la unicidad; el texto no nombra los dominios. Sale con **`400` y no `409`**: es un campo que no cumple lo que el despliegue pide, no un estado del conjunto (`ContractTranslation.cs` l.72–76). Sólo rige si la composición declara `Registration__AdmittedEmailDomains__N`; ver [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) §6.1 |
| `AdministratorAlreadyConfigured` | `ADMINISTRATOR_ALREADY_CONFIGURED` | `RN-02001` |
| `PasswordChangeRequired` | `PASSWORD_CHANGE_REQUIRED` | Un solo código para todas las operaciones bloqueadas y los dos orígenes de la marca |
| `ServiceUnavailable` | `SERVICE_UNAVAILABLE` | **Lo emite el front, no el servicio de datos** (§9) |
| `ConfirmationMismatch` | `CONFIRMATION_MISMATCH` | El correo de confirmación de la baja no es el de la cuenta; **no se devuelve el esperado** |
| `StudentNotFound` | `STUDENT_NOT_FOUND` | Filtro por alumno inexistente y, por adopción declarada, cuenta inexistente en un punto de administración |
| `OperationAdminOnly` | `OPERATION_ADMIN_ONLY` | El papel no alcanza; **no tiene nada que ocultar** |
| `ResetNotApplicableToAdministratorAccount` | `RESET_NOT_APPLICABLE_TO_ADMINISTRATOR_ACCOUNT` | El reseteo no se aplica a la cuenta del docente |
| `WorkNotFound` | `WORK_NOT_FOUND` | Inexistente, ajeno o fuera de alcance: **indistinguibles** (`RN-02003`) |
| `StateForbidsDelete` | `STATE_FORBIDS_DELETE` | El alumno elimina fuera de `Draft`; la respuesta **declara el estado actual** |
| `StateForbidsUpdate` | `STATE_FORBIDS_UPDATE` | Enviar o reeditar fuera de `Draft`, y el desenlace fuera de `Pendiente` |
| `UnclassifiedError` | `UNCLASSIFIED_ERROR` | Cierra el conjunto: **ningún fallo llega sin representación** |

**Dieciséis constantes contra dieciocho vivos declarados.** `Contratos-Abstractions.md` §5.1 cuenta
**dieciocho** desde su 1.4 (2026-09-14). Los dos que faltan son los del desenlace
—`STATE_FORBIDS_OUTCOME` y `OUTCOME_ADMIN_ONLY` en `Contratos-REST.md` §5— y **nunca se
escribieron**: el código los cubre reusando `StateForbidsUpdate` y `OperationAdminOnly`, con el
fundamento en `ContractTranslation.cs`. El comentario de `ErrorCode.cs` dice a la vez «los quince
… de los diecisiete vivos» (línea 16) y «Son dieciocho vivos» (línea 26). Divergencias en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).

## 5. La traducción: una sola tabla, en un solo lugar

`Endpoints/ContractTranslation.cs` traduce **motivo interno → código del contrato → código de
respuesta + texto para la persona** (`ADR-00004`, `CU-00009`). Ninguna otra capa traduce; la
guardia de cambio pendiente también llama a `ContractTranslation.Translate`.

| Código de respuesta | Cuándo aparece (leído sobre el código) |
| --- | --- |
| `200` / `201` / `204` | Éxito; `201` en `A-02`, `A-03` y `A-10`; `204` en `A-08` y `A-12` |
| `400` | Campo requerido ausente, alta sin credencial, valor derivado vacío, **dominio de correo no admitido**, confirmación que no coincide, desenlace fuera del conjunto; y **sin cuerpo** la petición ilegible (`ContractErrorHandler`) |
| `401` | Cuenta inexistente o credencial no verificada (`INVALID_CREDENTIALS`); en la guardia, además, **cuenta que ya no existe** y **acceso emitido antes del último cambio de credencial** (REF-02). El `401` del esquema de autenticación —sin acceso, vencido o mal firmado— va **sin código** |
| `403` | Cuenta pendiente o bloqueada; cambio de contraseña requerido; papel que no alcanza (`AdministratorRoleRequired`, `OutcomeRequiresAdministratorRole`, `ScopeRequiresAdministratorRole`); y **`UNCLASSIFIED_ERROR` con `403`** cuando quien carga o reedita no es alumno (`WorkWritingLimitedToStudents`, apartamiento declarado de la etapa `e`) |
| `404` | Trabajo no encontrado por las tres vías; cuenta o alumno no encontrado |
| `409` | Administrador ya configurado, correo ya registrado, reseteo no aplicable, envío o reedición fuera de `Draft`, eliminación o desenlace en estado que no lo admite, y **dos huecos que salen como `UNCLASSIFIED_ERROR`** (`AccountTransitionNotAllowed`, `OperationNotApplicableToAdministratorAccount`) |
| `429` | Cuota agotada (§6). **Sin cuerpo y sin código del contrato**, con `Retry-After` |
| `500` | `UNCLASSIFIED_ERROR` para los defectos que ninguna petición bien formada alcanza (trabajo sin dueño, solicitante no declarado, papel no reconocido, texto original alterado, el `_ =>` final) y para toda excepción no traducida (`ContractErrorHandler`) |
| `503` | `UNCLASSIFIED_ERROR` cuando falta la fuente de aleatoriedad o se intentó habilitar sin provisoria; y `A-16` con el servicio sin condiciones |

**`UNCLASSIFIED_ERROR` tiene cuatro destinos** —`500`, `503`, `409` y `403`—; los dos últimos son
apartamientos declarados en `ADR-00004` 2.0 §2.1 (`Contratos-REST.md` §5.2).

**Tres respuestas sin código del contrato** (`Contratos-REST.md` §5.1): el `401` del esquema de
autenticación (sin acceso, vencido o mal firmado; §5.1 lo rotula «`401` de la guardia»), el `400` de
petición ilegible y el `429` del límite. El `401` que emite `PendingPasswordChangeGuard` **sí lleva**
`INVALID_CREDENTIALS`: pasa por `ContractTranslation.Translate(AccountNotFound)`
(`PendingPasswordChangeGuard.cs` l. 88–115). El manejador de errores no toca `404`, `405` ni
`415`, que son del protocolo (`ContractErrorHandler.cs`).

**Elecciones que se leen mal si no se explican.** El desenlace sobre un trabajo que no está en
`Pendiente` responde **`409` y no `403`**: quien pide tiene la facultad. El motivo
`OPERATION_OUTSIDE_DRAFT` tiene **dos destinos según la operación** y por eso sale por métodos
propios (`WorkStateForbidsDelete`, `WorkStateForbidsUpdate`, `WorkStateForbidsOutcome`), igual que
`ACCOUNT_NOT_FOUND` (`401` en el canje, `404` en administración). Y hay **tres filas que hoy nadie
alcanza y se conservan** (barrido del 2026-08-31): el compilador no garantiza la alcanzabilidad.

Las etiquetas de estado a pantalla también viven acá (`LabelOf`): `Draft` → «Borrador»,
`Submitted` → «Pendiente», `Approved` → «Finalizado», el resto → «Rechazado».

## 6. El límite de tasa

**Nuevo desde la 3.0** (`BT-00029`, corregido por `ADR-00011` 1.1 y la mesa del 2026-09-14).
Lo realizan `Composition/ContractRateLimiting.cs` (middleware nativo `Microsoft.AspNetCore.RateLimiting`)
y `Composition/CredentialAttemptThrottle.cs` (ventana propia por cuenta). **El sujeto es la
persona, o la dirección de origen cuando no hay persona; nunca una clave de aplicación, que no
existe** (`ADR-00009`).

| Cuota | Partición | Por omisión | Llave (`RateLimiting__…`) |
| --- | --- | --- | --- |
| Política `contrato`, con acceso válido | `persona:{sub}` | **60** por ventana | `PermitsPerPerson` |
| Política `contrato`, sin acceso válido | `origen:{dirección}` | **1200** por ventana | `PermitsPerAddress` |
| Política `canje`, sólo `A-01` | `canje:{dirección}`; **reemplaza** a la del grupo | **600** por ventana | `CredentialExchangePermitsPerAddress` |
| Fallos por cuenta: `A-01` y la forma forzada de `A-05` | correo normalizado con `EmailIdentity.Normalize`, exista o no la cuenta | **10** fallos | `CredentialFailuresPerAccount` |
| Ventana del contrato y del canje | deslizante, 6 segmentos, cola 0 | **60** s | `WindowSeconds` |
| Ventana de fallos por cuenta | deslizante | **900** s | `CredentialFailureWindowSeconds` |

Las seis cifras están compiladas en `RateLimitingOptions` y repetidas en `appsettings.json`; un
valor menor que 1 **detiene el arranque** nombrando la llave. Antes de `ADR-00011` las dos por
origen eran **120** y **30**: la comisión entera detrás del front agotaba el canje (`RN-B1`).

| Regla | Fuente |
| --- | --- |
| La política `contrato` cuelga del **grupo `/v1` entero**: un punto nuevo la hereda. `/salud` y el explorador quedan fuera | `Program.cs` |
| `UseRateLimiter` va **después de autenticar y antes de autorizar**: la partición lee `sub`, y una petición que la guardia rechaza con `401` también gasta cuota de origen | `Program.cs` |
| El exceso responde **`429`, `Retry-After` en segundos enteros y sin cuerpo**. La ventana deslizante del marco no informa la espera: en la práctica sale la ventana entera (60). La cuota por cuenta calcula la espera real hasta que vence el fallo más viejo, acotada a 1–900 | `ContractRateLimiting.RetryAfterSeconds`, `CredentialAttemptThrottle.Refusal` |
| La cuota por cuenta se consulta **antes de buscar la cuenta y antes de derivar**; **cuentan los fallos, no los ingresos**; en `A-05` sólo cuenta la vigente que no verificó | `AuthenticationEndpoints.cs`, `AccountEndpoints.cs` |
| El `429` por cuenta **no dice si la cuenta existe**: mismo intento, misma forma | `CredentialAttemptThrottle.cs`, cabecera |
| **El reseteo del docente (`A-09`) libera la cuota** de la cuenta (`Release`), mitigación de `ADR-00011` §6 (R-03, PR #214) | `CommissionAccountEndpoints.cs` |
| La dirección de origen sale de `X-Forwarded-For` **sólo desde un proxy conocido**: `ForwardedHeaders__KnownNetworks__0=<CIDR>` en la composición; un valor que no es CIDR detiene el arranque; sin llave, sólo el bucle local | `ContractRateLimiting.AddContractRateLimiting` |

**Los umbrales no salen de una medición, y se declara**: por persona, el triple del caudal de
`05` §8.1 (20 por minuto para una comisión, [ASUNCIÓN]); por origen, trescientos alumnos detrás de
una dirección, redondeo de los 334 de `Audit/Medicion-Volumen-De-Comision-2026-08-31.md`. Se
ajustan **por configuración** cuando `PT-05` mida el uso real (`RateLimitingOptions`, remarks).

## 7. Cabeceras

### 7.1 Cabeceras de seguridad, en el origen

**Nuevas desde la 3.0** (mesa `SDD/Docs/Audit/Mesa-2026-09-15.md` D-3 sobre `R-06`): un middleware
`SecurityHeaders` en cada pieza (`Api/Composition/SecurityHeaders.cs`, `Web/Integration/SecurityHeaders.cs`).
Los valores de cada cabecera, el orden en la tubería y la deuda de la CSP están en
[`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) §9. Lo que toca a un cliente de la
superficie: toda respuesta del servicio de datos lleva `Referrer-Policy: no-referrer` y
`Content-Security-Policy: frame-ancestors 'none'`, y HSTS sólo cuando la petición llegó por `https`.

### 7.2 Otras cabeceras de la superficie

| Cabecera | Quién y cuándo |
| --- | --- |
| `Authorization: Bearer <acceso>` | La pone `DataServiceClient.SendAsync` cuando hay acceso; es la única forma de presentarlo |
| `Retry-After` | En todo `429` (§6) |
| `X-Forwarded-For` | **Nuevo**: el front la escribe hacia el servicio de datos (§9) |
| `Deprecation`, `Sunset` | **Futuras**; ninguna respuesta las lleva hoy (§2) |

## 8. El documento OpenAPI

`Composition/ApiDocumentation.cs` genera `GET /openapi/v1.json` con `AddOpenApi` y publica el
explorador Scalar en `/documentacion`. **No se publican solos** (`ADR-08008`): siempre en
`Development`; fuera de él, sólo con `Documentacion__Publicada=true`. Se sirven sin acceso.

**Nuevo desde la 3.0: el documento declara el esquema `Bearer`** (mesa del 2026-09-14, R-08, commit
`c392531`). Un transformador de documento agrega `components.securitySchemes.Bearer`
(`type: http`, `scheme: bearer`, `bearerFormat: JWT`), y un transformador de operación le pone el
requisito **a toda operación con `IAuthorizeData` y sin `IAllowAnonymous`**: se deriva de los
metadatos, así que un punto nuevo queda bien descripto sin tocar el archivo. Por el recuento de §1,
lo llevan **las once** operaciones con `RequireAuthorization`; `A-05`, por ser `AllowAnonymous`,
aparece sin requisito aunque su forma corriente use sesión. `ApiDocumentationSurfaceTests` lo
comprueba sobre tres puntos (`GET /v1/trabajos` sí; `POST /v1/auth/token` y `GET /salud` no).

## 9. El cliente del front

`src/GeometriaFactory.Web/Integration/DataServiceClient.cs` es **la única salida** del front hacia
esta superficie, y `DataServiceOutcome` el tipo con el que devuelve el resultado.

| Rasgo | Detalle | Fuente |
| --- | --- | --- |
| Prefijo | `ContractPrefix = "v1/"` antepuesto a toda ruta salvo `salud`; **escrito a mano**, porque el front no referencia al servicio (`Web ADR-07`). Estrenar un `MAJOR` es cambio de código, no de configuración | `DataServiceClient.cs` líneas 37–49 |
| Dirección | `ApiBaseUrl` por configuración (`ADR-10007`); `appsettings.json` versiona `http://localhost:5080/`. En producción llega como secreto en `deploy-front-ftp.yml` o como variable del contenedor de `deploy/Dockerfile.web` (ver [`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md)). Se lee **una sola vez**, al construir el `HttpClient`; sin ella el front no arranca | `Web/Program.cs` línea 204 |
| Tiempo de espera | `HttpClient.Timeout` de **10 s** | `Web/Program.cs` línea 211 |
| `SERVICE_UNAVAILABLE` | Lo produce el cliente ante excepción de transporte, cancelación, éxito sin cuerpo legible o **cualquier error que no traiga un `ErrorResponse` con código**, salvo el `401`, que convierte en `INVALID_CREDENTIALS`. Mensaje fijo, **sin la dirección del servicio** (`RA-03`) | `ReadErrorAsync`, `Unavailable` |
| `A-05` | Con acceso, lee el `SessionResponse` nuevo y devuelve el acceso que reemplaza al anterior; sin acceso, `200` sin cuerpo | `ChangeOwnPasswordAsync` |
| Reenvío de origen | **Nuevo** (R-02, commit `ed097f8`): `BrowserOriginForwardingHandler` agrega `X-Forwarded-For` con la dirección del navegador en las llamadas que corren dentro de una petición HTTP del navegador. Cuándo la escribe y cuándo el servicio la cree: [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) §8 | `BrowserOriginForwardingHandler.cs`, `Web/Program.cs` líneas 175–215 |

**Leído en el código, no ejercitado**: el front no tiene manejo propio del `429` (no aparece
`429`, `TooManyRequests` ni `RetryAfter` en `src/GeometriaFactory.Web`), y como el `429` llega sin
cuerpo, `ReadErrorAsync` lo convierte en `SERVICE_UNAVAILABLE` con el texto «El laboratorio está
en pie, pero no está pudiendo llegar a tus datos en este momento».

## 10. Lo que la superficie no hace, y es decisión

| Ausencia | Fundamento |
| --- | --- |
| **Sin paginación** en los listados de trabajos y de cuentas | `ADR-00005`, con condición de reingreso declarada. Su párrafo sobre el caudal quedó superado por el `429` (`Contratos-REST.md` §4) |
| **Una sola versión publicada**, sin convivencia todavía | `ADR-00010` §2.1; ver §2 |
| **Ningún JavaScript del navegador la invoca**; el front la consume servidor a servidor | `RA-01` (`Contratos-REST.md` §1) |
| **Ningún mensaje transporta una dirección interna, una ruta del almacén ni un secreto** | `RA-03` (`Contratos-REST.md` §5.4), con su contracara: registro del lado del servidor de cada error y cada acceso rechazado; `ContractErrorHandler` registra método y ruta, **nunca el cuerpo** |
| **Sin clave de aplicación**: la superficie autentica personas | `ADR-00009` |
| **Sin `422`**: un texto del alumno que no verifica es éxito con observaciones, no fallo | `Contratos-REST.md` §4 y §5.3 |
| **El explorador no se publica solo** | `ADR-08008` |

## 11. Las pruebas que fijan la superficie

Batería `tests/GeometriaFactory.Integration.Tests/`, que levanta el `Program` real en memoria. Una
selección de las que tocan este dominio, con su cantidad de `[Fact]`/`[Theory]` contada sobre `4b114d7` (la
batería entera y sus umbrales están en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md)):

| Archivo | Atributos | Qué fija |
| --- | --- | --- |
| `WorkSurfaceTests.cs` | 31 | La superficie de trabajos (*no verificado* más allá del nombre) |
| `AccountLifecycleSurfaceTests.cs` | 18 | El ciclo de vida de cuentas por HTTP (*no verificado* más allá del nombre) |
| `ForcedPasswordChangeSurfaceTests.cs` | 4 | El cambio de contraseña requerido (*no verificado* más allá del nombre) |
| `RateLimitingTests.cs` | 17 | Las cuotas con los umbrales por omisión, `Retry-After`, la cuota por cuenta y `X-Forwarded-For` desde red declarada |
| `SecurityGuardsTests.cs` | 11 | La guardia y sus respuestas |
| `ContractRoutePrefixTests.cs` | 6 | Tabla de rutas en las dos direcciones, 17 = 16 + 1, `404` sin prefijo, `/salud` fuera |
| `ContractTranslationTests.cs` | 6 | La tabla de traducción |
| `ApiDocumentationSurfaceTests.cs` | 5 | Publicación del documento y del explorador; esquema `Bearer` |
| `ContractCoverageTests.cs` | 4 | Cobertura de los códigos del contrato |
| `ContractErrorHandlerTests.cs` | 4 | `400` sin cuerpo y `500` con código genérico |
| `SessionCredentialTests.cs` | 4 | El acceso firmado |
| `BrowserOriginForwardingTests.cs` | 3 | El reenvío de la dirección del navegador |
| `SecurityHeadersTests.cs` | 3 | Cabeceras en las dos piezas; HSTS sólo sobre `https` |
| `RegistrationDomainTests.cs` | 3 | `EMAIL_DOMAIN_NOT_ADMITTED` |

Las columnas «Qué fija» salen del nombre del archivo y de sus métodos (`ContractRoutePrefixTests`,
`ApiDocumentationSurfaceTests`, `SecurityHeadersTests`, `BrowserOriginForwardingTests` leídos
método por método); el resto, *no verificado* más allá del nombre.
