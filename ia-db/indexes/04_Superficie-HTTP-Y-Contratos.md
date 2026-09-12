# 04 · Superficie HTTP y contratos — qué expone el servicio de datos

> **Propósito.** Las rutas reales, los tipos que viajan, los códigos de error y cómo se traducen,
> para escribir un cliente o un caso de prueba sin abrir el código.
> **Fuente primaria.** `src/GeometriaFactory.Api/Endpoints/`, `src/GeometriaFactory.Contracts/`,
> y `Api/05-Arquitectura-Tecnica/Contratos-REST.md` **1.5**. Verificado el 2026-09-11 sobre la
> revisión `89f3ab3`.

---

## 1. Los diecisiete puntos de acceso

Diecisiete llamadas `Map{Get,Post,Delete}` sobre catorce rutas, en los cinco archivos de
`src/GeometriaFactory.Api/Endpoints/`. **No hay versionado de rutas** (`ADR-00008`): el producto
no tiene clientes de terceros y la contrapartida aceptada es el **despliegue conjunto**.

| Id | Verbo y ruta | Papel exigido | Qué hace |
| --- | --- | --- | --- |
| `A-01` | `POST /auth/token` | — | Canjea correo y contraseña por credencial firmada |
| `A-02` | `POST /cuentas` | — | Registra una cuenta de alumno. **Sin campo de contraseña**: es anónimo por diseño |
| `A-03` | `POST /cuentas/administrador` | — | Configura la cuenta administradora, **sólo mientras no exista ninguna** |
| `A-05` | `POST /cuenta/contrasena` | Alumno o Administrador | Cambia la contraseña propia. **Es el único punto que levanta la marca** de cambio pendiente |
| `A-06` | `GET /cuentas` | Administrador | Lista las cuentas de la comisión con su situación y su marca |
| `A-07` | `POST /cuentas/{id}/situacion` | Administrador | Cambia la situación. **Habilitar y rehabilitar devuelven la provisoria** |
| `A-08` | `DELETE /cuentas/{id}` | Administrador | Baja con arrastre, transportando **el correo escrito como confirmación** |
| `A-09` | `POST /cuentas/{id}/reseteo-de-contrasena` | Administrador | Resetea y devuelve la provisoria **una sola vez** |
| `A-10` | `POST /trabajos` | Alumno | Envía un trabajo nuevo, con el texto original **sin normalizar** |
| `A-11` | `POST /trabajos/{id}` | Alumno | Reenvía un trabajo que quedó en `Borrador` |
| `A-12` | `DELETE /trabajos/{id}` | Alumno o Administrador | Elimina, **con los dos alcances opuestos** |
| `A-13` | `GET /trabajos` | Alumno o Administrador | Lista con el alcance que el papel determina, **sin componentes** |
| `A-14` | `GET /trabajos/{id}` | Alumno o Administrador | Detalle del trabajo interpretado |
| `A-15` | `POST /trabajos/{id}/desenlace` | Administrador | Aprueba o rechaza un trabajo en `Pendiente`, con comentario opcional |
| `A-16` | `GET /salud` | — | Estado del servicio. **Lo consume el `healthcheck` del contenedor** |
| `A-17` | `GET /aprovisionamiento` | — | Responde **si el laboratorio ya tiene administrador**, y nada más. Sólo lectura |
| `A-18` | `POST /interpretaciones` | Alumno | **Interpreta un texto sin guardar nada**, para la previsualización. No constituye ningún trabajo |

Los `{id}` son `{id:guid}` en el código. **Cinco sin credencial firmada** —`A-01`, `A-02`, `A-03`,
`A-16`, `A-17`— **y doce bajo la guardia.** `A-04` está retirado y **no reciclado**.

**Dos rutas más, condicionales**: `GET /openapi/v1.json` (`ApiDocumentation.cs`) y el explorador
Scalar en `/documentacion`, que **no se publican solos** (`ADR-08008`): dependen del ajuste
`Documentacion:Publicada`.

**Por qué existe `A-17`, que parece redundante con `A-16`.** El guardián de aprovisionamiento del
front necesitaba que un anónimo pudiera preguntar si el laboratorio ya tiene administrador, y
ninguno de los puntos anteriores servía: `A-03` escribe, `A-06` exige papel y `A-16` responde por
la salud. **El dato no se le agregó a `A-16` a propósito**: la salud la consume el `healthcheck`
del contenedor, y mezclarle un hecho del producto acopla dos cosas que cambian por motivos
distintos.

## 2. Los tipos que viajan

`src/GeometriaFactory.Contracts/`, **tipos planos sin dependencias** (`ADR-08001`), 31 archivos.

| Grupo | Tipos |
| --- | --- |
| Sesión y cuenta (13) | `CredentialExchangeRequest`, `SessionResponse`, `AccountRegistrationRequest`/`Response`, `AdministratorSetupRequest`, `AccountSetupResponse`, `OwnPasswordChangeRequest`, `PasswordResetRequest`/`Response`, `AccountStatusChangeRequest`/`Response`, `AccountDeletionRequest`, `AccountListItem` |
| Trabajo (13) | `WorkSubmissionRequest`/`Response`, `WorkInterpretationRequest`/`Response`, `WorkListItem`, `WorkDetailResponse`, `WorkPiece`, `WorkObservation`, `WorkObservationKind`, `WorkTextNode`, `WorkOutcomeRequest`/`Response`, `WorkOutcomeName` |
| Error (3) | `ErrorCode`, `ErrorDetail`, `ErrorResponse` |
| Servicio (2) | `ServiceHealth`, `LaboratoryProvisioning` |

**El listado no arrastra el detalle** (`ADR-08005`): `WorkListItem` es una proyección propia, sin
componentes. **El visor recibe piezas reconstruidas y no el texto** (`ADR-08006`), y `A-18` existe
como contrapartida declarada de esa decisión.

**El formato de intercambio está fijado para los dos extremos en un solo lugar** (`ADR-00002`,
`Contratos-REST.md` §2.2), con seis reglas de formato y la **prohibición de normalizar el texto
original**. Es la mitigación de `RI-01`: ninguna regla depende de que dos configuraciones
coincidan.

## 3. Los códigos de error del contrato

`ErrorCode` es un **conjunto cerrado**: lo que no declara, no viaja como código. **La capa que
expone no inventa códigos**; un motivo interno sin código propio cae en `UNCLASSIFIED_ERROR`, y el
hueco se declara en lugar de taparse.

| Constante | Valor | Cuándo |
| --- | --- | --- |
| `RequiredFieldMissing` | `REQUIRED_FIELD_MISSING` | La solicitud llega incompleta; también un desenlace fuera del conjunto (`UnknownOutcome`) |
| `InvalidCredentials` | `INVALID_CREDENTIALS` | **Genérico a propósito**: cubre cuenta inexistente y credencial no verificada sin declarar cuál |
| `AccountNotEnabled` | `ACCOUNT_NOT_ENABLED` | Cuenta `Pending` o `Blocked` (`RN-02006`) |
| `EmailAlreadyRegistered` | `EMAIL_ALREADY_REGISTERED` | `RN-02002` |
| `AdministratorAlreadyConfigured` | `ADMINISTRATOR_ALREADY_CONFIGURED` | `RN-02001`, `INV-05` |
| `PasswordChangeRequired` | `PASSWORD_CHANGE_REQUIRED` | Un solo código para todas las operaciones bloqueadas y los dos orígenes de la marca (`INV-09`) |
| `ServiceUnavailable` | `SERVICE_UNAVAILABLE` | **Lo emite el front, no el servicio de datos**: `DataServiceClient` lo produce cuando el servicio no responde, y **sin la dirección del servicio que falló** (`RA-03`) |
| `ConfirmationMismatch` | `CONFIRMATION_MISMATCH` | El correo de confirmación de la baja no es el de la cuenta. **La respuesta no devuelve el esperado** |
| `StudentNotFound` | `STUDENT_NOT_FOUND` | El alumno referenciado no existe |
| `OperationAdminOnly` | `OPERATION_ADMIN_ONLY` | El papel no alcanza. **No tiene nada que ocultar**: el recurso no es ajeno |
| `ResetNotApplicableToAdministratorAccount` | `RESET_NOT_APPLICABLE_TO_ADMINISTRATOR_ACCOUNT` | `RN-02015`, `INV-08`. No es negativa de facultad: quien pide la tiene |
| `WorkNotFound` | `WORK_NOT_FOUND` | Inexistente, ajeno o fuera de alcance: **las tres respuestas son indistinguibles** (`RN-02003`) |
| `StateForbidsDelete` | `STATE_FORBIDS_DELETE` | El alumno pide eliminar fuera de `Draft`. **La respuesta declara el estado actual** |
| `StateForbidsUpdate` | `STATE_FORBIDS_UPDATE` | Enviar o reeditar fuera de `Draft`, y también el desenlace fuera de `Pendiente` |
| `UnclassifiedError` | `UNCLASSIFIED_ERROR` | Cierra el conjunto: **ningún fallo llega a la persona sin representación** |

**Quince constantes en el ensamblado, diecisiete códigos vivos en el contrato.** Los dos del
desenlace —`CONTRATO_ESTADO_NO_PERMITE_DESENLACE` y
`CONTRATO_DESENLACE_EXCLUSIVO_DEL_ADMINISTRADOR`— **nunca se escribieron**: el código los cubre
reusando `StateForbidsUpdate` y `OperationAdminOnly`, con el fundamento escrito en
`ContractTranslation.cs`, y el comentario de `ErrorCode.cs` sigue diciendo «ese punto es de la
etapa `h`». La divergencia está registrada en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) O-3.

## 4. La traducción: una sola tabla, en un solo lugar

`Endpoints/ContractTranslation.cs` traduce **código de condición → código de contrato + código de
respuesta + texto para la persona** (`ADR-00004`). Ninguna otra capa traduce. Leída sobre el
código el 2026-09-11:

| Código de respuesta | Cuándo aparece |
| --- | --- |
| `400` | Campo requerido ausente, alta sin credencial, valor derivado vacío, confirmación que no coincide, desenlace fuera del conjunto |
| `401` | Cuenta inexistente o credencial no verificada — los dos como `INVALID_CREDENTIALS` |
| `403` | Cuenta pendiente, bloqueada o no habilitada; cambio de contraseña requerido; operación exclusiva del administrador (`AdministratorRoleRequired`, `OutcomeRequiresAdministratorRole`, `ScopeRequiresAdministratorRole`) |
| `404` | Trabajo no encontrado (por las tres vías), alumno no encontrado |
| `409` | Administrador ya configurado, correo ya registrado, reseteo no aplicable, edición o envío fuera de `Draft`, desenlace fuera de `Pendiente`, y dos defectos del producto que salen como `UNCLASSIFIED_ERROR` (`AccountTransitionNotAllowed`, `OperationNotApplicableToAdministratorAccount`) |
| `500` | Genérico (`UNCLASSIFIED_ERROR`), para los defectos que ninguna petición bien formada alcanza: trabajo sin dueño, solicitante no declarado, papel no reconocido, texto original alterado, y el `_ =>` que cierra la tabla |
| `503` | **`UNCLASSIFIED_ERROR`**, cuando la fuente de aleatoriedad no está disponible o se intentó habilitar sin provisoria. **El servicio de datos nunca emite `SERVICE_UNAVAILABLE`**: ese código es del front |

**Dos elecciones que se leen mal si no se explican.** El desenlace sobre un trabajo que no está en
`Pendiente` responde **`409` y no `403`**: quien pide **tiene** la facultad, lo que no procede es
la operación sobre ese estado. Y hay **tres filas de traducción que hoy nadie alcanza y se
conservan igual**: sus invocadores comprueban antes, pero eso no lo garantiza el compilador, y
tres filas cuestan menos que volver a razonar la alcanzabilidad cada vez que alguien agregue un
invocador.

`ContractTranslation.cs` es también donde vive la **traducción de estados a pantalla**: `Draft` →
«Borrador», `Submitted` → «Pendiente», `Approved` → «Finalizado», `Rejected` → «Rechazado».

## 5. Lo que la superficie no hace, y es decisión

| Ausencia | Fundamento |
| --- | --- |
| **Sin paginación** en el listado de trabajos y en el de cuentas | `ADR-00005`, con **condición de reingreso declarada**: se reabre si el volumen la exige. `D5` cerró el volumen de la comisión por **incognoscible** |
| **Sin versionado de rutas** | `ADR-00008`: no hay clientes de terceros; la contrapartida es el despliegue conjunto |
| **Ningún JavaScript del navegador la invoca** | `RA-01`. El front la consume servidor a servidor |
| **Ningún mensaje transporta una dirección interna, una ruta del almacén ni un secreto** | `RA-03`, con su contracara: el registro estructurado del lado del servidor de cada error y cada acceso rechazado |
| **El explorador no se publica solo** | `ADR-08008` |

## 6. El cliente del front

`src/GeometriaFactory.Web/Integration/DataServiceClient.cs` es el único que habla con esta
superficie, y `DataServiceOutcome` el tipo con el que devuelve el resultado. La dirección llega
**por configuración** (`ADR-10007`): `ApiBaseUrl` en `appsettings.json`, con el valor del
contenedor de desarrollo (`http://localhost:5080/`) versionado. **La dirección real llega por dos
vías según cómo se publique**: inyectada como secreto en el `appsettings.json` publicado por
`deploy-front-ftp.yml`, o como variable de entorno del contenedor construido con
`deploy/Dockerfile.web` (ver
[`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) §4.2). En las
dos, `Program.cs` la lee **una sola vez**, al construir el `HttpClient`: cambiarla exige reiniciar
el proceso.
