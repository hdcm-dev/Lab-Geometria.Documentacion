# 06 · Superficie HTTP, contrato REST y tipos de transferencia

> **Propósito:** mapa de lo que la Api expone hacia afuera: rutas y verbos bajo `/v1/`, endpoints por grupo, tipos del proyecto `GeometriaFactory.Contracts`, respuesta de error única con `ErrorCode`, traducción motivo→protocolo (CU-00009), guarda de cambio de contraseña pendiente, OpenAPI/Scalar, contratos inter-unidad CU-08001..08008, DX y mensajes de error de la Api, y la política de deprecación del contrato.
> **Fuente primaria:** el código (`src/GeometriaFactory.Api/Endpoints/`, `src/GeometriaFactory.Contracts/`) y `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Contratos-REST.md` (1.11, 2026-09-13).
> **Revisión indexada:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** límite de tasa, cabeceras de seguridad, autenticación por dentro y revocación → [08](08_Seguridad-Identidad-Y-Sesion.md); cliente servidor-a-servidor del front → [09](09_Front-Web-Y-Experiencia-De-Uso.md); MinVer y etiquetas de construcción → [12](12_DevOps-Construccion-Versionado-Y-Despliegue.md); ADR como decisiones → [15](15_Decisiones-ADR.md); divergencias → [19](19_Observaciones-Del-Indexado.md).

Rutas relativas a la raíz del repo Lab-Geometria. Abreviatura: `API/` = `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/`.

---

## 1. Fuentes de este dominio

| Fuente | Versión / fecha | Qué fija |
| --- | --- | --- |
| `src/GeometriaFactory.Api/Endpoints/ContractRoutePrefix.cs` | código | `Major = 1`, `Value = "/v1"`: único lugar donde se escribe la versión |
| `src/GeometriaFactory.Api/Endpoints/{Authentication,Account,CommissionAccount,Work,Health}Endpoints.cs` | código | Rutas relativas, verbos, `WithName`, `RequireAuthorization`/`AllowAnonymous` |
| `src/GeometriaFactory.Api/Endpoints/ContractTranslation.cs` | código | Tabla motivo interno → `ErrorCode` + código HTTP + texto neutro; proyecciones a tipos del contrato |
| `src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs` | código | Intermediario de cambio de contraseña pendiente (excepción única A-05) |
| `src/GeometriaFactory.Api/Composition/ContractErrorHandler.cs` | código | Último borde: `500` con `UNCLASSIFIED_ERROR`, `400` ilegible sin cuerpo |
| `src/GeometriaFactory.Api/Composition/ApiDocumentation.cs` | código | OpenAPI + Scalar, esquema `Bearer`, publicación condicional |
| `src/GeometriaFactory.Api/Program.cs` (l. 16–122) | código | Orden: documentación, manejador de errores, guarda, `MapGroup("/v1")` |
| `src/GeometriaFactory.Contracts/` | código | Tipos de transferencia (Accounts, Works, Errors, Service) |
| `API/05-Arquitectura-Tecnica/Contratos-REST.md` | 1.11 · 2026-09-13 | Formato, 17 puntos, 11 códigos HTTP, tabla de traducción, versionado |
| `API/02-Especificacion-Funcional/Definicion-Superficie-HTTP.md` | 1.15 · 2026-09-14 | Puntos A-01..A-18 con papel y códigos, ausencias, puntos abiertos |
| `API/05-Arquitectura-Tecnica/Operaciones-Internas/CU-00009-Traducir-El-Motivo-Del-Contrato-A-Respuesta-De-Protocolo.md` | 1.3 · 2026-08-12 | Flujo de la doble traducción |
| `SDD/Docs/Producto/Contratos-Inter-Unidad/` | README 1.0 · 2026-08-15 | CU-08001..08008 + `Contratos-Abstractions.md` |
| `API/03-UX-UI-DX/DX-Developer-Experience.md` | 2.2 · 2026-08-16 | DX de Api, Domain, Application, Infrastructure |
| `API/03-UX-UI-DX/DX-Error-Messages.md` | 2.1 · 2026-08-16 | Catálogo de mensajes de error por capa |
| `API/09-Devops/Estrategia-Versionado.md` §6.b | 6.0 · 2026-09-13 | Política de deprecación del contrato REST |

---

## 2. Prefijo de contrato `/v1/`

| Regla | Detalle | Fuente |
| --- | --- | --- |
| Forma | `/v{MAJOR}/`, sólo el `MAJOR` del producto; hoy `/v1` | `ContractRoutePrefix.cs`; ADR-00010 §2.1 |
| Dónde se aplica | `var contrato = app.MapGroup(ContractRoutePrefix.Value)`; los endpoints declaran rutas **relativas** | `Program.cs` l. 116–122 |
| Desde cuándo | BT-00032, 2026-09-12 (antes no había versión en la ruta, ADR-00008) | `Contratos-REST.md` §3.1 |
| Sin prefijo | `404` como ruta inexistente, sin redirección ni cuerpo | `ContractRoutePrefix.cs`; `Contratos-REST.md` §3.1 |
| Rutas exentas (3) | `/salud` (arranque y salud, A-16), `/openapi/v1.json`, `/documentacion` (describen, no son superficie) | `ContractRoutePrefix.cs`; ADR-08008 |
| Verificación | `ContractRoutePrefixTests` (integración) contrasta la tabla a mano con lo enrutado, en dos direcciones | `Contratos-REST.md` §3.1 → detalle en [11](11_Pruebas-Puertas-Y-Calidad.md) |

---

## 3. Endpoints por grupo (17 puntos: 16 bajo `/v1/` + 1 exento)

A-04 no existe (cerrado; ver `Definicion-Superficie-HTTP.md` §9). Columna «Acceso» según el código: `Anon` = `AllowAnonymous`, `Auth` = `RequireAuthorization`; el papel efectivo lo resuelve Application.

### 3.1 Autenticación — `AuthenticationEndpoints.cs`

| Punto | Verbo y ruta | `WithName` | Acceso | Papel (spec) | Códigos (spec) | CU |
| --- | --- | --- | --- | --- | --- | --- |
| A-01 | `POST /v1/auth/token` | `ExchangeCredentials` | Anon | Ninguno | 200, 400, 401, 403 | CU-00001 |

### 3.2 Cuentas propias y aprovisionamiento — `AccountEndpoints.cs`

| Punto | Verbo y ruta | `WithName` | Acceso | Papel (spec) | Códigos (spec) | CU |
| --- | --- | --- | --- | --- | --- | --- |
| A-02 | `POST /v1/cuentas` | `RegisterAccount` | Anon | Ninguno | 201, 400, 409 | CU-00003 |
| A-03 | `POST /v1/cuentas/administrador` | `ConfigureAdministrator` | Anon | Ninguno, sólo si no hay administrador | 201, 400, 409 | CU-00003 |
| A-05 | `POST /v1/cuenta/contrasena` | `ChangeOwnPassword` | Anon **a propósito** (intake 1.34) | Con sesión: Alumno/Administrador; sin sesión: contraseña actual + correo | ver spec | CU-00005 |
| A-17 | `GET /v1/aprovisionamiento` | `LaboratoryProvisioning` | Anon | Ninguno | 200 | CU-00003 |

A-05 tiene dos formas: con sesión responde un acceso nuevo y revoca los anteriores (REF-02); sin sesión, `200` sin cuerpo (`Definicion-Superficie-HTTP.md` §3 fila A-05; `AccountEndpoints.cs` l. 208–344).

### 3.3 Administración de la comisión — `CommissionAccountEndpoints.cs`

| Punto | Verbo y ruta | `WithName` | Acceso | Papel (spec) | Códigos (spec) | CU |
| --- | --- | --- | --- | --- | --- | --- |
| A-06 | `GET /v1/cuentas` | `ListCommissionAccounts` | Auth | Administrador | 200, 401, 403 | CU-00004 |
| A-07 | `POST /v1/cuentas/{id}/situacion` | `ChangeAccountStatus` | Auth | Administrador | ver spec | CU-00004 |
| A-08 | `DELETE /v1/cuentas/{id}` | `DeleteAccount` | Auth | Administrador | 204, 400, 401, 403, 404 | CU-00004 |
| A-09 | `POST /v1/cuentas/{id}/reseteo-de-contrasena` | `ResetAccountPassword` | Auth | Administrador | 200, 400, 401, 403, 404, 409 | CU-00005 |

Habilitar y rehabilitar (A-07) devuelven la contraseña provisoria (RN-00016). `{id}` lleva restricción `:guid` en el código.

### 3.4 Trabajos e interpretación — `WorkEndpoints.cs`

| Punto | Verbo y ruta | `WithName` | Acceso | Papel (spec) | Códigos (spec) | CU |
| --- | --- | --- | --- | --- | --- | --- |
| A-10 | `POST /v1/trabajos` | `SubmitWork` | Auth | Alumno | 201, 400, 401, 403 | CU-00006 |
| A-11 | `POST /v1/trabajos/{id}` | `ResubmitWork` | Auth | Alumno | 200, 400, 401, 403, 404, 409 | CU-00006 |
| A-12 | `DELETE /v1/trabajos/{id}` | `DeleteWork` | Auth | Alumno o Administrador | 204, 401, 403, 404, 409 | CU-00006 |
| A-13 | `GET /v1/trabajos` | `ListWorks` | Auth | Alumno o Administrador | 200, 401, 403, 404 | CU-00007 |
| A-14 | `GET /v1/trabajos/{id}` | `GetWork` | Auth | Alumno o Administrador | 200, 401, 403, 404 | CU-00007 |
| A-15 | `POST /v1/trabajos/{id}/desenlace` | `ResolveWork` | Auth | Administrador | 200, 400, 401, 403, 404, 409 | CU-00008 |
| A-18 | `POST /v1/interpretaciones` | `InterpretWork` | Auth | Alumno | 200, 400, 401, 403 | CU-00026 |

A-18 interpreta sin guardar nada (previsualización). Interpretación y reglas de dominio → [05](05_Dominio-Interpretacion-Y-Reglas-De-Negocio.md).

### 3.5 Salud (exenta) — `HealthEndpoint.cs`

| Punto | Verbo y ruta | `WithName` | Acceso | Respuesta | CU |
| --- | --- | --- | --- | --- | --- |
| A-16 | `GET /salud` | `Health` | Anon | `ServiceHealth`; `200` si listo, `503` si no (l. 81–82) | CU-00011 |

Arranque en dos fases → [04](04_Arquitectura-Y-Proyectos.md).

### 3.6 Lado de la guardia

Cuatro puntos fuera de la guardia de acceso firmado: el canje (A-01), el registro (A-02), la configuración del administrador (A-03) y la salud (A-16, `/salud`), «exactamente 4 fuera, ni uno más» (`QG-00005`, `TC-00007`; `Estrategia-Versionado.md` §6.1; ADR-00003 §2 punto 2; comentario de `src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs` l. 59-61; `Arquitectura-Unidad-Entrega.md` §3.4). `Contratos-REST.md` §3 cuenta cinco puntos sin credencial firmada: A-01, A-02, A-03, A-16 y A-17.

---

## 4. Formato de intercambio

| Regla | Decisión | Fuente |
| --- | --- | --- |
| Notación | JSON sobre los tipos de `GeometriaFactory.Contracts` | `Contratos-REST.md` §2.2 |
| Nombres de campo | Tal como los declara el tipo, sin transformación | íd. |
| Conjuntos cerrados (4) | Por nombre, nunca por posición: papel, estado de cuenta, estado de trabajo, especie de observación | íd. |
| Nulos | Se emiten | íd. |
| Decimales | Sin cultura, punto decimal (escenario E-8) | íd. |
| Lectura | Estricta: campo desconocido → `400` | íd. |
| Tamaño del cuerpo | Un límite por configuración; excedido → `400`, nunca truncar (RN-00008) | íd. |
| Texto original | No se normaliza en el borde | íd. |
| Transporte | Sin estado; credencial en `Authorization`; sin certificado en desarrollo | íd. |
| Descripción formal | Apartamiento declarado: el contrato formal es el ensamblado de tipos; la descripción OpenAPI se **genera** (ver §8) | `Contratos-REST.md` §2.1; ADR-00002 |

---

## 5. Tipos del proyecto Contracts

`GeometriaFactory.Contracts.csproj` no declara ninguna referencia de proyecto (puerta BT-02/QG-02: cero referencias a Domain). Los tipos de transferencia son `public sealed record`; `Errors/ErrorCode.cs`, `Works/WorkObservationKind.cs` y `Works/WorkOutcomeName.cs` son `public static class` con constantes `string`.

### 5.1 `Accounts/`

| Tipo | Campos | Uso |
| --- | --- | --- |
| `CredentialExchangeRequest` | `Email?`, `Password?` | A-01 |
| `SessionResponse` | `AccessToken`, `AccountId`, `Email`, `Role` | A-01, A-05 con sesión |
| `AccountRegistrationRequest` | `Email?`, `FirstName?`, `LastName?` (sin contraseña) | A-02 |
| `AccountRegistrationResponse` | `AccountId`, `Email`, `Status` | A-02 |
| `AdministratorSetupRequest` | `Email?`, `FirstName?`, `LastName?`, `Password?` | A-03 |
| `AccountSetupResponse` | `AccountId`, `Email`, `Role` | A-03 |
| `OwnPasswordChangeRequest` | `CurrentPassword?`, `NewPassword?`, `Email?` (= null) | A-05 |
| `AccountListItem` | `AccountId`, `Email`, `FirstName`, `LastName`, `Status`, `RegisteredAt`, `MustChangePassword` | A-06 |
| `AccountStatusChangeRequest` / `Response` | `AccountId`, `IntendedStatus?` / `ResultingStatus`, `ProvisionalPassword?`, `MustChangePassword` | A-07 |
| `AccountDeletionRequest` | `AccountId`, `ConfirmationEmail?` | A-08 |
| `PasswordResetRequest` / `Response` | `AccountId` / `Status`, `ProvisionalPassword`, `MustChangePassword` | A-09 |

### 5.2 `Works/`

| Tipo | Campos | Uso |
| --- | --- | --- |
| `WorkSubmissionRequest` | `WorkId?`, `Name`, `DeclaredDate`, `Description?`, `OriginalJson` | A-10, A-11 |
| `WorkSubmissionResponse` | `WorkId`, `Status`, `RegisteredAt`, `Observations` | A-10, A-11 |
| `WorkInterpretationRequest` / `Response` | `OriginalJson?` / `RootFigureCount`, `Pieces`, `Observations`, `Tree?` | A-18 |
| `WorkListItem` | `WorkId`, `Name`, `DeclaredDate`, `Status`, `OwnerId`, `OwnerEmail`, `OwnerFirstName`, `OwnerLastName` (proyección pobre, CU-08004) | A-13 |
| `WorkDetailResponse` | datos + `OriginalJson`, `Status`, `AdministratorComment?`, dueño, `CreatedAt`, `UpdatedAt`, `RootFigureCount?`, `Pieces`, `Observations`, `Tree?` | A-14 |
| `WorkOutcomeRequest` / `Response` | `WorkId?`, `Outcome`, `Comment?` / `WorkId`, `Status`, `ResolvedAt` | A-15 |
| `WorkPiece` / `WorkPieceComponent` | posición, tipo, áreas/volúmenes declarados y derivados, medidas declaradas, componentes | A-14, A-18 |
| `WorkObservation` | `Kind`, `PiecePosition?`, `Field`, `DeclaredValue?`, `DerivedValue?` | A-10, A-11, A-14, A-18 |
| `WorkTextNode` | `Name?`, `Kind`, `Value?`, `Position?`, `Children` (árbol del texto, derivado al leer) | A-14, A-18 |
| `WorkObservationKind` | constantes `Warning`, `ValidationError` | — |
| `WorkOutcomeName` | constantes `Approve`, `Reject` | A-15 |

### 5.3 `Service/` y `Errors/`

| Tipo | Campos | Uso |
| --- | --- | --- |
| `ServiceHealth` | `Ready`, `Version`, `ServerTimeUtc` | A-16 |
| `LaboratoryProvisioning` | `AdministratorConfigured` | A-17 |
| `ErrorResponse` | `Code`, `Message`, `Details`, `OccurredAt` | toda respuesta de error con código |
| `ErrorDetail` | `Field`, `FigureIndex?` (= null) | ubicación del fallo |
| `ErrorCode` | constantes `string` (§6.1) | conjunto cerrado |

---

## 6. Respuesta de error única y `ErrorCode`

Forma única: `ErrorResponse(Code, Message, Details, OccurredAt)` — código, texto neutro, detalles de ubicación y momento, nada más (CU-08006; CU-00009 §4 paso 4).

### 6.1 Constantes de `ErrorCode.cs` (16 en el código)

| Constante | Valor | Alias documental | Etapa |
| --- | --- | --- | --- |
| `RequiredFieldMissing` | `REQUIRED_FIELD_MISSING` | DXT-01 | c |
| `InvalidCredentials` | `INVALID_CREDENTIALS` | DXT-02 | c |
| `AccountNotEnabled` | `ACCOUNT_NOT_ENABLED` | DXT-03 | c |
| `EmailAlreadyRegistered` | `EMAIL_ALREADY_REGISTERED` | DXT-04 | c |
| `EmailDomainNotAdmitted` | `EMAIL_DOMAIN_NOT_ADMITTED` | Api ADR-00012 | 2026-09-14 |
| `AdministratorAlreadyConfigured` | `ADMINISTRATOR_ALREADY_CONFIGURED` | DXT-06 | c |
| `PasswordChangeRequired` | `PASSWORD_CHANGE_REQUIRED` | DXT-16 | c |
| `ServiceUnavailable` | `SERVICE_UNAVAILABLE` | DXT-11 (sin destino en la Api) | c |
| `ConfirmationMismatch` | `CONFIRMATION_MISMATCH` | DXT-05 | d |
| `StudentNotFound` | `STUDENT_NOT_FOUND` | DXT-10 | d |
| `OperationAdminOnly` | `OPERATION_ADMIN_ONLY` | DXT-19 | d |
| `ResetNotApplicableToAdministratorAccount` | `RESET_NOT_APPLICABLE_TO_ADMINISTRATOR_ACCOUNT` | DXT-17 | d |
| `WorkNotFound` | `WORK_NOT_FOUND` | DXT-07 | e |
| `StateForbidsDelete` | `STATE_FORBIDS_DELETE` | DXT-08 | e |
| `StateForbidsUpdate` | `STATE_FORBIDS_UPDATE` | DXT-20 | e |
| `UnclassifiedError` | `UNCLASSIFIED_ERROR` | DXT-12 | c |

Identificadores en inglés y sin prefijo `CONTRATO_` (norma de nomenclatura §5.3 → [14](14_Glosario-Y-Nomenclatura.md)).

> **Divergencia:** el recuento de códigos difiere entre `ErrorCode.cs` y `Contratos-REST.md` §5; ver N-2 en [19](19_Observaciones-Del-Indexado.md).

### 6.2 Código del contrato → código HTTP (tabla documental)

| Código | HTTP | Nota | Fuente |
| --- | --- | --- | --- |
| `REQUIRED_FIELD_MISSING` | 400 | nombra el campo ausente | `Contratos-REST.md` §5 |
| `INVALID_CREDENTIALS` | 401 | genérico, no dice qué campo | íd. |
| `ACCOUNT_NOT_ENABLED` | 403 | con motivo (Pendiente/Bloqueado) | íd. |
| `PASSWORD_CHANGE_REQUIRED` | 403 | un código para todo lo bloqueado | íd. |
| `WORK_NOT_FOUND` | 404 | inexistente/ajeno/fuera de alcance indistinguibles (RN-00003) | íd. |
| `STUDENT_NOT_FOUND` | 404 | filtro por alumno o cuenta administrada inexistente | íd. |
| `EMAIL_ALREADY_REGISTERED` | 409 | no declara situación ni papel | íd. |
| `EMAIL_DOMAIN_NOT_ADMITTED` | 400 | no nombra dominios admitidos | `ContractTranslation.cs` l. 76 |
| `ADMINISTRATOR_ALREADY_CONFIGURED` | 409 | sin camino alternativo | `Contratos-REST.md` §5 |
| `CONFIRMATION_MISMATCH` | 400 | no devuelve el correo esperado | íd. |
| `STATE_FORBIDS_DELETE` | 409 | declara el estado actual | íd. |
| `STATE_FORBIDS_UPDATE` | 409 | declara el estado actual | íd. |
| `OPERATION_ADMIN_ONLY` | 403 | facultad, nada que ocultar | íd. |
| `RESET_NOT_APPLICABLE_TO_ADMINISTRATOR_ACCOUNT` | 409 | no es 403 | íd. |
| `UNCLASSIFIED_ERROR` | 500 / 503 (+409, 403 como apartamiento declarado) | 503 si almacén degradado | íd. §5, §5.2; ADR-00004 2.0 §2.1 |
| `SERVICE_UNAVAILABLE` | ninguno | sólo lo produce la pieza pública | íd. |

### 6.3 Respuestas sin código del contrato (3)

| Respuesta | Cuándo | Fuente |
| --- | --- | --- |
| `401` de la guardia | sin credencial, vencida o mal firmada; cuerpo vacío | `Contratos-REST.md` §5.1 |
| `400` ilegible | cuerpo ilegible, valor fuera de conjunto, campo desconocido, exceso de tamaño; sin cuerpo en todo entorno | §5.1; `ContractErrorHandler.cs` |
| `429` | cuota excedida, `Retry-After`, sin cuerpo | §5.1 → mecanismo en [08](08_Seguridad-Identidad-Y-Sesion.md) |

`404`, `405` y `415` del protocolo no se tocan (`ContractErrorHandler.cs`).

### 6.4 Señales que no son fallos

Envío cuyo texto no verifica → éxito con `Borrador` y observaciones; listado vacío → éxito con colección vacía (`Contratos-REST.md` §5.3).

### 6.5 Los once códigos HTTP en uso

`200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `429`, `500`, `503`; sin `422` (el texto que no verifica no es fallo). Tabla con origen declarado/derivado en `Contratos-REST.md` §4 y `Definicion-Superficie-HTTP.md` §4.

---

## 7. Traducción motivo → protocolo (CU-00009)

| Paso | Qué | Fuente |
| --- | --- | --- |
| 1 | El endpoint termina con un motivo interno | CU-00009 §4 |
| 2 | Motivo → código del contrato (conjunto cerrado; si nada corresponde, el genérico) | CU-00009 §4; `ContractTranslation.Translate` (l. 58–209) |
| 3 | Código del contrato → código HTTP (tabla única) | `Definicion-Superficie-HTTP.md` §6 |
| 4 | Componer `ErrorResponse` | CU-08006 |
| 5 | Verificar que el texto no exponga direcciones, rutas del almacén ni secretos (RA-03) | CU-00009 §4; `Contratos-REST.md` §5.4 |
| 6 | Responder y registrar del lado del servidor | íd. |

Implementación:

| Pieza | Qué hace | Fuente |
| --- | --- | --- |
| `ContractTranslation.Translate(conditionCode)` | `switch` sobre `ConditionCode` (Domain), `ApplicationConditionCode`, `InfrastructureConditionCode`; devuelve `Translation(ErrorCode, StatusCode, texto)`; por omisión `UNCLASSIFIED_ERROR`/500 | `ContractTranslation.cs` l. 58–209 |
| Respuestas específicas | `WorkStateForbidsOutcome`, `WorkStateForbidsDelete`, … declaran el estado actual con etiqueta en castellano (`Borrador`, `Pendiente`, `Finalizado`, `Rechazado`) | l. 236–318 |
| `StudentNotFound` / detalles por campo | `ErrorDetail(field)` por campo ausente | l. 330–350 |
| Proyecciones | piezas, componentes, observaciones y árbol → tipos del contrato | l. 369–453 |
| `ContractErrorHandler` | `IExceptionHandler`: excepción no prevista → `500` + `UNCLASSIFIED_ERROR`; `BadHttpRequestException` → `400` sin cuerpo; deja detalle en el registro | `ContractErrorHandler.cs`; `Program.cs` l. 21 |

Lo que ninguna respuesta puede decir (dirección interna, ruta del almacén, clave de firma, contraseña o derivado, provisoria fuera de su resultado, trazas): `Contratos-REST.md` §5.4; `Definicion-Superficie-HTTP.md` §8.

---

## 8. Guarda de cambio de contraseña pendiente

Respuesta del contrato: todo punto con acceso firmado salvo **A-05** (`ChangeOwnPassword`) responde `PASSWORD_CHANGE_REQUIRED`/403 mientras la cuenta tenga el cambio de contraseña pendiente (`src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs`; `Contratos-REST.md` §5). El mecanismo (intermediario, corte antes de leer o escribir, origen de la marca, qué no hace) está en [08 §5.2](08_Seguridad-Identidad-Y-Sesion.md).

--- | --- | --- |
| Forma | Intermediario (`UseMiddleware<PendingPasswordChangeGuard>`), no filtro por punto, para no olvidar puntos nuevos | `PendingPasswordChangeGuard.cs`; `Program.cs` l. 100 |
| Alcance | Todo punto con acceso firmado salvo **A-05** | íd. (CU-02 paso 5, FA-02, FA-04) |
| Efecto | Corta antes de leer/escribir (INV-09); responde `PASSWORD_CHANGE_REQUIRED`/403 | íd.; `Contratos-REST.md` §5 |
| Origen de la marca | Se lee del almacén, no del acceso: corta aunque el acceso siga válido (Api CU-05 CA-06); cubre habilitación (RN-16) y reseteo (F-26) | íd. |
| Qué no hace | No autoriza: la facultad sobre el dato es de Application | íd. |

---

## 9. Descripción OpenAPI y explorador Scalar

| Aspecto | Detalle | Fuente |
| --- | --- | --- |
| Documento | `GET /openapi/v1.json`, **generado** desde los puntos declarados (no hay segunda fuente) | `ApiDocumentation.cs` (`DocumentRoute`) |
| Explorador | Scalar en `/documentacion`, título «Fábrica de Geometría · superficie HTTP» | `ApiDocumentation.cs` l. 117–123 |
| Publicación | Siempre en Development; fuera, sólo con `Documentacion__Publicada=true` (`Documentacion:Publicada`) | l. 109–115; ADR-08008 |
| Autenticación declarada | Esquema `Bearer` (HTTP, `bearer`, formato JWT) en componentes; requisito por operación derivado de metadatos `RequireAuthorization` sin `AllowAnonymous` | l. 56–94; mesa 2026-09-14 R-08 |
| Acceso | No exige acceso; va después de la autorización | l. 95–105 |
| Origen | Revierte la renuncia a OpenAPI del intake; retomada por el PO en la etapa g | comentario de `ApiDocumentation.cs` |
| Fuera del prefijo | Describen la superficie; deben poder describir dos `MAJOR` | íd.; BT-00032 |

---

## 10. Contratos inter-unidad CU-08001..08008

Nivel producto, en `SDD/Docs/Producto/Contratos-Inter-Unidad/`; los tipos que declaran viven en `src/GeometriaFactory.Contracts/`.

| CU | Archivo | Versión · fecha | Declara | Tipos (código) |
| --- | --- | --- | --- | --- |
| CU-08001 | `CU-08001-Contrato-De-Canje-De-Credenciales-Y-Sesion.md` | 1.9 · 2026-08-11 | Canje de credenciales y sesión; qué no viaja | `CredentialExchangeRequest`, `SessionResponse` |
| CU-08002 | `CU-08002-Contrato-De-Administracion-De-Cuentas.md` | 1.11 · 2026-08-14 | Registro sin contraseña, cambio propio, listado, cambio de situación, baja | `Account*`, `OwnPasswordChangeRequest` |
| CU-08003 | `CU-08003-Contrato-De-Carga-Y-Edicion-Del-Trabajo.md` | 1.6 · 2026-08-12 | Crear, reeditar, enviar, eliminar; texto original como cadena única | `WorkSubmission*` |
| CU-08004 | `CU-08004-Contrato-De-Listado-De-Trabajos.md` | 1.7 · 2026-08-12 | Elemento de listado deliberadamente pobre | `WorkListItem` |
| CU-08005 | `CU-08005-Contrato-De-Detalle-Del-Trabajo-Interpretado.md` | 1.6 · 2026-08-10 | Trabajo completo con piezas y observaciones | `WorkDetailResponse`, `WorkPiece*`, `WorkObservation` |
| CU-08006 | `CU-08006-Contrato-De-Respuesta-De-Error.md` | 1.10 · 2026-08-12 | Tipo único de error, transversal | `ErrorResponse`, `ErrorDetail`, `ErrorCode` |
| CU-08007 | `CU-08007-Contrato-De-Desenlace-De-La-Revision.md` | 1.4 · 2026-08-10 | Aprobar/rechazar un `Pendiente` con comentario opcional | `WorkOutcome*`, `WorkOutcomeName` |
| CU-08008 | `CU-08008-Contrato-De-Reseteo-Y-Cambio-Obligatorio-De-Contrasena.md` | 1.10 · 2026-08-12 | Reseteo con provisoria y cambio obligatorio (F-26) | `PasswordReset*`, `AccountStatusChangeResponse` |

Complementos: `README.md` (mapa, 1.0) y `Contratos-Abstractions.md`. La correspondencia CU→tipo es de este índice, deducida de nombres y propósitos; no hay tabla explícita en una sola fuente (**no verificado campo a campo**).

---

## 11. Experiencia del desarrollador (Api)

| Tema | Resumen | Fuente |
| --- | --- | --- |
| Superficie pública | La Api no tiene otra que la HTTP; no expone tipos propios | `DX-Developer-Experience.md` §1.2 |
| Frontera | «Esta capa decide cómo se dice, y no qué se dice» | §1.3 |
| Ausencias deliberadas | Sin CORS, sin WebSockets, sin puntos para navegador (RA-01) | §1.2; `Definicion-Superficie-HTTP.md` §7 |
| Onboarding y quick-start | Reiniciar almacén, correr servicio, ejecutar colección (8 envíos: 6 `Pendiente`, 2 `Borrador`) | `DX-Developer-Experience.md` §2.1, §3.1 → colección en [13](13_Samples-Ejecutables.md) |
| Diátaxis, métricas, feedback | por capa | §4–§7 |

El documento cubre también Domain, Application e Infrastructure (§1.2–§1.4 de cada uno); este índice sólo toma la parte de la Api.

---

## 12. Mensajes de error de la Api

| Tema | Resumen | Fuente |
| --- | --- | --- |
| Principio | Qué pasó, por qué, qué hacer | `DX-Error-Messages.md` §1.1 |
| Familias empobrecidas (3) | Credenciales inválidas, recurso no visible, correo ya registrado | §1.5 |
| Taxonomía | Categorías en uso; respuestas sin código; código sin destino; huecos cerrados | §2.1 |
| Catálogo | Entrada inválida, credencial, situación de cuenta, facultad, recurso no visible, conflicto de estado, no clasificado | §3.1 |
| Tono y localización | Castellano, voseo en los textos neutros | §4.1, §5.1; textos literales en `ContractTranslation.cs` |
| Recuento | 17 códigos, 16 con destino, 18 entradas (16 + 2) | §6.1 (ver divergencia §6.1 de este índice) |

---

## 13. Versionado y deprecación del contrato

### 13.1 Clases de cambio (`Contratos-REST.md` §6)

| Cambio | Clase |
| --- | --- |
| Quitar/renombrar punto, cambiar verbo | Mayor |
| Cambiar papel o lado de la guardia | Mayor (+ ADR-00003) |
| Cambiar código HTTP de un código del contrato | Mayor |
| Quitar código o reciclar identificador retirado | Mayor |
| Cambiar una de las ocho filas de formato | Mayor |
| Agregar punto | Menor |
| Agregar código al conjunto cerrado | Menor |
| Corregir para cumplir lo declarado | Parche |

Dentro de un `MAJOR` no conviven dos formas de un punto.

### 13.2 Política de deprecación (`Estrategia-Versionado.md` §6.b, fijada 2026-09-13)

| Aspecto | Regla |
| --- | --- |
| Cuándo se abre `/v{N+1}/` | Sólo por cambio Mayor del contrato REST |
| Convivencia mínima | Un cuatrimestre desde que `/v{N+1}/` entra a producción (D-02), contado desde el despliegue real |
| Aviso | Toda respuesta de `/v{N}/` (incluidos 401 y 429) lleva `Deprecation: @<epoch>` (borrador IETF) y `Sunset` (RFC 8594) |
| Retiro | Fusión propia; las rutas responden `410 Gone`, sin redirección ni cuerpo |
| Cuántas conviven | Dos como máximo |
| Qué no se depreca | `/salud`, `/openapi/v1.json`, `/documentacion` |
| Materialización | No la fija la política (p. ej. un segundo `MapGroup`) |
| Caso vigente | Sólo `/v1/`; nada deprecado; medido 2026-09-13 con `curl` contra producción |

Ninguna respuesta lleva hoy `Deprecation` ni `Sunset` (`Contratos-REST.md` §4). MinVer y etiquetas → [12](12_DevOps-Construccion-Versionado-Y-Despliegue.md).

---

## 14. Puntos abiertos de la superficie

`Definicion-Superficie-HTTP.md` §9: A-04 y los dos huecos de código cerrados; quedan abiertos (3) rutas y verbos derivados salvo el canje, (4) 500/503 bajo un mismo código, (5) límite de tamaño del cuerpo sin fuente, (6) vigencia exacta del acceso firmado (heredado). Lista consolidada de pendientes → [03](03_Roadmap-Avance-Backlog-Y-Pendientes.md).
