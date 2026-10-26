# 03 · Dominio y reglas de negocio — qué es verdad siempre

> **Propósito.** Las entidades, los conjuntos cerrados, los nueve invariantes, las dieciséis
> reglas, las tres máquinas de estado, el catálogo de condiciones y la lectura y derivación del
> texto de figuras, para poder razonar sobre el producto sin abrir el código.
> **Fuente primaria.** `src/GeometriaFactory.Domain/` (18 archivos versionados),
> `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` (5.1) §4.1 y §17.1.P.2,
> `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/` (`Reglas-De-Negocio/`,
> `Definicion-Modelo-De-Dominio.md` 1.10, `Definicion-Contrato-Del-Validador-De-Figuras.md` 1.2) y
> `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` (631 líneas).
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

Rutas abreviadas en este índice: `Api/02/` = `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/`;
`Api/05/Adrs/` = `.../GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/`; `Domain/` = `src/GeometriaFactory.Domain/`.

---

## 1. Las cinco entidades

`Domain/Entities/` (`Account.cs` 478 líneas, `Work.cs` 517, `Piece.cs` 115, `Component.cs` 75,
`Observation.cs` 91). Todas `sealed`, con propiedades de `private set`.

| Entidad | Qué es | Campos |
| --- | --- | --- |
| `Account` | La cuenta del alumno o del administrador | `Id`, `Email`, `NormalizedEmail`, `FirstName`, `LastName`, `Role`, `Status`, `PasswordHash?`, `MustChangePassword`, `CreatedAt`, **`CredentialChangedAt?`** (nuevo, ver abajo) |
| `Work` | El trabajo que el alumno carga | `Id`, `OwnerId`, `Name`, `DeclaredDate` (texto, no fecha), `Description?`, **`OriginalJson`**, `Status`, `AdministratorComment?`, `RootFigureCount?`, `Pieces`, `Observations`, `CreatedAt`, `UpdatedAt` |
| `Piece` | Cada figura del conjunto raíz. **Su identidad es su posición**, porque el texto del alumno no trae identificador | `Position`, `Type`, `DeclaredArea?`/`DerivedArea?`, `DeclaredVolume?`/`DerivedVolume?`, `Components`, `DeclaredLength?`, `DeclaredWidth?`, `DeclaredRadius?` |
| `Component` | Figura plana que forma parte de una pieza | `Position`, `Role`, `Type`, `DeclaredLength?`, `DeclaredWidth?`, `DeclaredRadius?`, `DeclaredArea?` |
| `Observation` | Lo que el producto emite al interpretar | `Kind`, `PiecePosition?`, `Field`, `DeclaredValue?`, `DerivedValue?` |

**El par declarado/derivado es el motivo de existir del producto.** Se guardan como dos
atributos y no uno calculado al vuelo (`Api/02/Definicion-Modelo-De-Dominio.md` §6): es lo que
hace visible el error de fórmula del programa del alumno.

| Hecho | Dónde |
| --- | --- |
| **`OriginalJson` se adopta carácter por carácter**, «ni `Trim` ni nada» (`RN-02008`) | `Work.Create` y `Work.Edit` |
| `Name` y `DeclaredDate` sí se recortan (`Trim`); `DeclaredDate` es `string` y se conserva como lo escribió el alumno | `Work.Create`; el front sólo lo presenta (`src/GeometriaFactory.Web/Services/DeclaredDateText.cs`) |
| Reeditar descarta la interpretación anterior **entera**: `RootFigureCount = null` y se vacían piezas y observaciones | `Work.Edit` |
| `RootFigureCount` cuenta las figuras del texto **incluidas las fallidas**; no es derivable de `Pieces` porque el conjunto admite huecos | `Work.AdoptInterpretation`, contrato del validador §3 |
| La familia plana/volumétrica **no se guarda**: se deriva del tipo | `Definicion-Modelo-De-Dominio.md` §6 |
| `Piece` se construye sólo por `Piece.Reconstruct(...)`, `Component` por `Component.Declare(...)`, `Observation` por `ValidationErrorAt(posición?, campo)` (sin valores) o `ValueDiscrepancyAt(posición, campo, declarado, derivado)` (especie `Warning`) | `Domain/Entities/` |

**`CredentialChangedAt` es el único cambio del dominio entre `89f3ab3` y `4b114d7`** (commit
`7c94988`, «cambiar la contraseña propia revoca los accesos anteriores»). Es el instante del último
reemplazo de credencial hecho por la propia cuenta, o nulo; existe para que un acceso emitido antes
del cambio deje de servir (`SDD/Docs/Audit/Mesa-2026-09-14.md`, REF-02). El reseteo del
administrador no lo toca, porque ése ya corta por la marca. Quién lo compara y cómo se persiste
está en [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md).

## 2. Los conjuntos cerrados

De `Domain/Values/`. Todos son `enum` numerados desde 1. **Los valores son ingleses en el código y
castellanos en la pantalla**, con la correspondencia fijada por la decisión `F-02` (`F-02a`,
2026-08-12) de `SDD/Docs/Producto/Norma-De-Nomenclatura.md` §5.2.

| Conjunto | Valores | Nota |
| --- | --- | --- |
| `AccountStatus` | `Pending`, `Enabled`, `Blocked` | El administrador está **siempre** `Enabled` (`INV-08`) |
| `Role` | `Student`, `Administrator` | Dos papeles fijos; no hay permisos finos |
| `WorkStatus` | `Draft`, `Submitted`, `Approved`, `Rejected` | En pantalla `Borrador`, `Pendiente`, `Finalizado`, `Rechazado` (`src/GeometriaFactory.Api/Endpoints/ContractTranslation.cs`). `Approved` y `Rejected` son **terminales** (`Work.IsTerminal`, `INV-07`) |
| `WorkOutcome` | `Approve`, `Reject` | Las dos decisiones del administrador |
| `WorkOperation` | `View`, `Edit`, `Delete` | Lo que se pide sobre un trabajo |
| `FigureType` | `Cylinder`, `Cube`, `Orthohedron`, `Rectangle`, `Square`, `Circle`, `DevelopedRectangle` | Siete tipos; `DevelopedRectangle` **sólo existe como componente** (§8) |
| `ComponentRole` | `Cap`, `Face`, `Base`, `Lateral`, `Side` | Tapa, cara, base, lateral, lado |
| `ObservationKind` | `Warning`, `ValidationError` | La advertencia **no impide** pasar a `Submitted`; el error sí |

`WorkOutcomeRequest` (`src/GeometriaFactory.Contracts/Works/WorkOutcomeRequest.cs`) lleva
`WorkId?`, `Outcome` y `Comment?`: **no lleva el estado pretendido**. Se pide un desenlace y el
dominio decide a qué estado lleva.

`Work.StatusOutsideAdministratorScope` (= `Draft`) es el predicado de alcance de `RN-02011`
**expuesto como dato**, para que la consulta de listado lo use tal cual en lugar de repetir la
comparación.

`EmailIdentity.Normalize` = `Trim()` + `ToUpperInvariant()`: **el único normalizador de correos
del producto**. Sostiene `INV-01`; la decisión de comparar ignorando mayúsculas y ninguna otra
normalización es `Api/05/Adrs/ADR-06003`, y el índice único sobre la forma normalizada es la
segunda defensa.

## 3. Los nueve invariantes

La tabla vive en `PRODUCT-INTAKE` **§17.1.P.2 · GeometriaFactory-Domain** (líneas 786–800,
«transcriptos completos de RT §7.3») y se repite en `Api/02/Definicion-Modelo-De-Dominio.md` §4.1.
Un invariante es lo que tiene que ser verdad **siempre**, aunque la petición llegue por fuera de la
interfaz.

| Id | Enunciado | Regla asociada |
| --- | --- | --- |
| `INV-01` | El correo del alumno es único en todo el sistema | `RN-02002` |
| `INV-02` | Un alumno sólo accede a sus propios trabajos | `RN-02003` |
| `INV-03` | Un trabajo eliminado **por un alumno** estaba en `Borrador` y le pertenecía | `RN-02004` |
| `INV-04` | Un trabajo `Finalizado` tiene texto interpretado sin errores (puede tener advertencias) | `RN-02005` |
| `INV-05` | Existe **exactamente un** administrador; su alta sólo es posible mientras no exista ninguno | `RN-02001` |
| `INV-06` | Un alumno `Pendiente` o `Bloqueado` no obtiene credencial de acceso (token) | `RN-02006` |
| `INV-07` | Un trabajo `Finalizado` o `Rechazado` no cambia de estado ni de contenido | `RN-02010` |
| `INV-08` | La cuenta administradora está **siempre** `Habilitado`: nace habilitada, nada la lleva a `Pendiente` ni a `Bloqueado`, y no admite baja. Toda cuenta de alumno nace `Pendiente` | `RN-02001`, `RN-02006` |
| `INV-09` | Una cuenta con **cambio de contraseña pendiente** no ejerce ninguna capacidad salvo cambiar su propia contraseña. La ponen sólo el reseteo y la habilitación, y la levanta sólo el cambio efectivo hecho por la propia cuenta | `RN-02012`, `RN-02013`, `RN-02016` |

**`INV-08` no viene de las fuentes: lo propuso la categoría 02 del dominio** (decisión del
2026-08-09) después de que la familia de defectos que su ausencia habilita se abriera dos veces por
puertas distintas —nacer `Pendiente` y poder bloquearla—, las dos terminando con la instancia sin
nadie capaz de habilitar, desbloquear ni revisar.

**Cómo los hace cumplir el código.** El dominio no conoce el conjunto de cuentas: `INV-01` e
`INV-05` llegan como **declaraciones** del consumidor (`emailUniquenessVerified`,
`administratorAbsenceDeclared`). `INV-06` e `INV-09` pasan por **una sola guarda**,
`Account.EvaluateAdmission()` (§6). `INV-08` está en que las cuatro operaciones de ciclo de vida
rechazan al administrador con `OperationNotApplicableToAdministratorAccount`.

## 4. Las dieciséis reglas de negocio

`Api/02/Reglas-De-Negocio/RN-02001..RN-02016` (16 archivos vigentes, más `_legacy/`; **ninguno
cambió** entre `89f3ab3` y `4b114d7`). El enunciado completo está en `PRODUCT-INTAKE` §4.1 (16
filas). **Diez tienen invariante asociado y seis no** (`RN-02007`, `-08`, `-09`, `-11`, `-14`,
`-15`), porque describen comportamientos o alcances de consulta y no condiciones permanentes sobre
el estado (intake §17.1.P.2, línea 800).

| Regla | Qué decide | Versión |
| --- | --- | --- |
| `RN-02001` | Administrador único y papeles fijos | 1.4 |
| `RN-02002` | Correo del alumno único | 1.2 |
| `RN-02003` | **Trabajo ajeno indistinguible de inexistente** | 1.2 |
| `RN-02004` | El alumno elimina sólo en borrador; el administrador, cualquier trabajo que ve | 1.2 |
| `RN-02005` | No se pasa a `Pendiente` con errores de validación | 1.2 |
| `RN-02006` | Cuenta pendiente o bloqueada sin acceso | 1.1 |
| `RN-02007` | Baja con arrastre de trabajos y **confirmación escrita** del correo | 1.5 |
| `RN-02008` | Texto original conservado íntegro | 1.3 |
| `RN-02009` | Observación de error con posición y campo | 1.2 |
| `RN-02010` | Desenlace exclusivo del administrador, y terminalidad | 1.1 |
| `RN-02011` | **El administrador no ve los borradores** | 1.1 |
| `RN-02012` | Resetear conserva la cuenta y sus trabajos | 1.5 |
| `RN-02013` | Cambio forzado **antes de toda otra capacidad** | 1.4 |
| `RN-02014` | La provisoria la produce el sistema, no la escribe el administrador | 1.2 |
| `RN-02015` | Resetear es **independiente del estado de cuenta** | 1.2 |
| `RN-02016` | Habilitar produce la provisoria | 1.2 |

**Las dos que más se malinterpretan.** `RN-02003`: pedir el trabajo de otro devuelve «no
encontrado» y no «no autorizado» —decir «no autorizado» confirmaría que ese trabajo existe—; el
dominio lo declara con `WorkNotFoundForRequester` y la traducción a «no encontrado» es de la API.
`RN-02016` cierra la escritura anónima **de contraseña**, no la escritura anónima: el registro de
cuenta sigue siendo anónimo por diseño (`Account.Register` rechaza toda credencial con
`CredentialNotAllowedOnRegistration`).

**Lo que el autorregistro suma y no es regla del dominio.** Desde el commit `203c4e9`
(PR #220, 2026-09-14, `Api/05/Adrs/ADR-00012`, R-07/E-1) el autorregistro **puede** restringirse a
dominios de correo declarados por la composición. El rechazo lo decide la aplicación
(`RegisterAccountUseCase`, código `EmailDomainNotAdmitted`), no el dominio: **no hay `RN` ni `INV`
nuevo**. La llave de configuración y su estado en producción están en
[`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) §6.1; el código del contrato y su
`400`, en [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md) §4.

## 5. Las tres máquinas de estado

`Api/02/Definicion-Modelo-De-Dominio.md` §5, contrastado con el código.

**Cuenta** (sólo cuentas `Student`; el administrador nace `Enabled` y ninguna operación le aplica):

| Desde | Hacia | Operación | Lo que el código hace |
| --- | --- | --- | --- |
| — | `Pending` | `Register` | Único estado inicial admitido (`InitialStatusNotNegotiable`); sin credencial, marca levantada |
| — | `Enabled` | `ConfigureAdministrator` | Exige hash ya derivado (`SetupWithoutCredential`); marca levantada |
| `Pending` o `Blocked` | `Enabled` | `Enable(hash)` | Fija la provisoria y **pone la marca** en un solo acto; sin hash → `EnableWithoutTemporaryCredential` |
| `Enabled` | `Enabled` | `Enable` | **Idempotente**: aplica sin fijar credencial ni poner marca (FA-02) |
| `Enabled` | `Blocked` | `Block()` | No toca la credencial. Desde `Pending` o `Blocked` → `AccountTransitionNotAllowed` |
| cualquiera | (baja) | `AdmitDeletion(cascada)` | No cambia nada: **admite o rechaza**; sin arrastre declarado → `DeletionWithoutWorkCascade` |

**Trabajo:**

| Desde | Hacia | Operación | Condición |
| --- | --- | --- | --- |
| — | `Draft` | `Create` | Estado inicial de todo trabajo |
| `Draft` | `Draft` | `Edit`, o `Submit` con errores declarados | Enviar con errores **no es un rechazo**: se aplica y queda en `Draft` |
| `Draft` | `Submitted` | `Submit` sin errores | Exige `parseResultDeclared`; las advertencias no impiden (`RN-02005`) |
| `Submitted` | `Approved` / `Rejected` | `ApplyOutcome` | Sólo `Administrator`; comentario opcional (vacío → `null`) |
| terminal | — | cualquiera | `TransitionFromTerminalStatus` (`AdoptInterpretation`, `Submit`, `ApplyOutcome`); `Edit` → `EditOutsideDraft` |

No hay retorno de `Submitted` a `Draft` (`SubmissionOutsideDraft`). La eliminación no es una
transición del dominio: el alumno la pide por `ResolveStudentAccess(_, Delete)` y el
administrador por `ResolveAdministratorScope(_, Delete)`.

**Marca de cambio de contraseña pendiente** (ortogonal al estado de cuenta):

| Acto | Efecto sobre la marca |
| --- | --- |
| Alta (los dos caminos) | Nace levantada |
| `Enable` con transición, `ResetPassword` | La ponen (si ya estaba, sigue puesta) |
| `ReplaceCredential` por la propia cuenta | **Único acto que la levanta** |
| `Block`, `AdmitDeletion` | No la tocan |

`ResetPassword` **no es una transición de la máquina de cuenta** (`RN-02015`): procede sobre
`Pending`, `Enabled` y `Blocked`, sin ninguna comprobación de estado —su ausencia es la forma
estructural de la regla— y sobre una cuenta sin credencial **fija** en lugar de reemplazar.

## 6. La superficie del dominio

Métodos públicos, todos devolviendo `DomainResult` / `DomainResult<T>` (`Domain/Guards/DomainResult.cs`,
`Succeeded` + `ConditionCode?`): **no hay excepciones como mecanismo de flujo**
(`Api/05/Adrs/ADR-02002`). Las únicas excepciones son guardas de argumento contra un mal uso del
programador: `ArgumentNullException` sobre colecciones nulas en `AdoptInterpretation`
(`Domain/Entities/Work.cs:283–284`) y, en `Guards/`, `ArgumentException` si se construye un rechazo
sin código o una no admisión sin motivo, y `ArgumentNullException` si se construye un éxito sin valor
(`DomainResult.cs:32, 55, 61`; `Admission.cs:29`). Ninguna se usa como mecanismo de flujo.

| Entidad | Operaciones |
| --- | --- |
| `Account` | `ConfigureAdministrator(email, nombre, apellido, hash, administratorAbsenceDeclared, emailUniquenessVerified, requestedStatus, createdAt)`, `Register(email, nombre, apellido, hash, emailUniquenessVerified, requestedRole, requestedStatus, createdAt)` (estáticas) · `Enable(provisionalHash)`, `Block()`, `AdmitDeletion(worksCascadeDeclared)`, `ResetPassword(provisionalHash, worksCascadeDeclared)`, **`ReplaceCredential(newHash, currentCredentialVerified, changedAt = null)`**, `EvaluateAdmission()` → `Admission` |
| `Work` | `Create(ownerId, name, declaredDate, description, originalJson, originalJsonPreservedDeclared, createdAt)` (estática) · `Edit(..., updatedAt)`, `AdoptInterpretation(rootFigureCount, pieces, observations, updatedAt)`, `Submit(parseResultDeclared, validationErrorsDeclared, updatedAt)`, `ApplyOutcome(requesterRole, outcome, comment, updatedAt)`, `ResolveStudentAccess(requesterId, operation)`, `ResolveAdministratorScope(requesterRole, operation)` |
| `Guards` | `Admission.Admissible()` / `Admission.NotAdmissible(reason)` — **la guarda única de admisibilidad** (`Api/05/Adrs/ADR-02005`) |

**Las firmas cuentan lo que el dominio no hace.** `Enable` y `ResetPassword` reciben el hash de la
provisoria **ya derivado**; `ReplaceCredential` recibe que la credencial actual **ya se verificó**
y, desde `4b114d7`, el instante del cambio; `AdmitDeletion` recibe que el arrastre **ya se
declaró**; toda fecha la aporta el consumidor. El dominio no deriva, no verifica, no consulta y no
lee el reloj (`Api/05/Adrs/ADR-02006`). `ReplaceCredential` sin `changedAt` conserva el valor
anterior de `CredentialChangedAt`.

**`EvaluateAdmission`**, en este orden: `Pending` → `AccountPending`; `Blocked` →
`AccountBlocked`; marca puesta → `PasswordChangePending`; si no, admisible. Se resuelve por estado
y marca, **nunca por papel**.

**`AdoptInterpretation` reemplaza y no acumula**, y no decide el estado (eso es `Submit`). Rechaza,
en este orden: terminal; `rootFigureCount < 0` (`RequiredFieldMissing`); pieza u observación con
posición fuera de `[0, rootFigureCount)` (`ObservationOnMissingPiece`); especie desconocida;
error sin campo, o sin posición habiendo figuras (`ErrorWithoutLocation`); advertencia sin los dos
valores (`WarningMissingBothValues`).

**`ResolveStudentAccess`**: operación desconocida se rechaza **antes** de mirar la pertenencia;
ajeno o solicitante vacío → `WorkNotFoundForRequester`; `Edit`/`Delete` fuera de `Draft` →
`OperationOutsideDraft`; `View` procede en los cuatro estados. **`ResolveAdministratorScope`**:
papel antes que estado (`ScopeRequiresAdministratorRole`), sólo `View` y `Delete`, y `Draft` →
`WorkOutsideAdministratorScope`.

## 7. El catálogo cerrado de condiciones

`Domain/Values/ConditionCode.cs` (190 líneas) declara **37 constantes** `public const string`, en
`UPPER_SNAKE_CASE` inglés. Son la moneda interna: el dominio y la aplicación hablan en códigos de
condición, y **una sola tabla** los traduce a códigos de contrato en la frontera
(`Api/05/Adrs/ADR-00004`, ver [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md)).
Por etapa, según los separadores del archivo: 12 de la `c`, 7 de la `d`, 4 de la `f` y 14 de la
`e`. El catálogo no cambió desde `89f3ab3` (37 también allí).

| Familia | Códigos |
| --- | --- |
| Forma de la petición (2) | `RequiredFieldMissing`, `EmptyDerivedValue` |
| Alta y unicidad (6) | `AdministratorAlreadyConfigured`, `EmailUniquenessNotVerified`, `SetupWithoutCredential`, `InitialStatusNotNegotiable`, `CredentialNotAllowedOnRegistration`, `AdministratorRoleOutsideThisPath` |
| Credencial y admisión (6) | `AccountNotEnabledForCredential`, `CredentialAlreadySet`, `CurrentCredentialNotVerified`, `AccountPending`, `AccountBlocked`, `PasswordChangePending` |
| Ciclo de vida de la cuenta (5) | `AccountTransitionNotAllowed`, `EnableWithoutTemporaryCredential`, `DeletionWithoutWorkCascade`, `OperationNotApplicableToAdministratorAccount`, `ResetWithWorkCascade` |
| Interpretación (5) | `ObservationOnMissingPiece`, `ErrorWithoutLocation`, `WarningMissingBothValues`, `UnknownObservationKind`, `OriginalJsonAltered` |
| Trabajo y alcance (9) | `WorkWithoutOwner`, `EditOutsideDraft`, `WorkNotFoundForRequester`, `OperationOutsideDraft`, `UnknownOperation`, `WorkOutsideAdministratorScope`, `ScopeRequiresAdministratorRole`, `SubmissionOutsideDraft`, `SubmissionWithoutParseResult` |
| Desenlace (4) | `TransitionFromTerminalStatus`, `OutcomeOutsideSubmitted`, `OutcomeRequiresAdministratorRole`, `UnknownOutcome` |

**`CredentialAlreadySet` está declarada y ninguna operación la emite** (0 usos de
`ConditionCode.CredentialAlreadySet` en `src/`). Está inventariada así en
`SDD/Docs/Audit/Mesa-2026-08-31.md` (línea 209): retirarla es decisión del Product Owner.
`ReplaceCredential` sobre una cuenta sin credencial devuelve `CurrentCredentialNotVerified`, no
este código.

La capa de aplicación suma **9** en `ApplicationConditionCode` (`EmailAlreadyRegistered`,
**`EmailDomainNotAdmitted`** —nuevo, `ADR-00012`—, `AccountNotFound`, `AdministratorRoleRequired`,
`DeletionConfirmationMismatch`, `ResetLimitedToStudentAccounts`, `RequesterNotDeclared`,
`WorkNotFound`, `UnrecognizedRole`) y la de infraestructura **2** en `InfrastructureConditionCode`
(`UnreadablePasswordHash`, `RandomnessSourceUnavailable`); las dos clases viven en
`src/GeometriaFactory.Application/Accounts/`.

**Varios describen un defecto del producto, no un pedido mal hecho.** Si alguno se alcanzara, la
respuesta correcta es `500`: están inventariados en `SDD/Docs/Audit/Mesa-2026-08-31.md` y la
traducción los deja deliberadamente en el genérico.

## 8. La lectura del texto y la derivación de valores

La hace `LocalFigureValidator` (`src/GeometriaFactory.Infrastructure/Figures/`), que implementa el
puerto `IFigureValidator.Interpret(string originalJson)` de
`src/GeometriaFactory.Application/Ports/`. Motor propio, en proceso y **sin red**. Ni el
validador ni sus puertos cambiaron entre `89f3ab3` y `4b114d7`; lo nuevo es la batería que fija su
lectura (§9). Contrato: `Api/02/Definicion-Contrato-Del-Validador-De-Figuras.md`; tabla de
derivación: `Api/05/Adrs/ADR-06006` (lectura tolerante y tabla de derivación por tipo).

**Lo que devuelve** (`FigureInterpretation`): `RootFigureCount`, `Pieces`, `Observations` y
`Tree` (`TextNode?`, el árbol del texto). **No devuelve el estado**: lo resuelve el dominio.

### 8.1 Las trampas del formato y las garantías

| Id | Trampa (contrato §2) | Qué hace el código |
| --- | --- | --- |
| T1 | El ortoedro emite `Tapas` donde el visor previo exige `Bases` | Las dos claves son **sinónimas** y producen componentes `Base` |
| T2 | Comas finales: el texto no es JSON estricto | `AllowTrailingCommas = true` y comentarios omitidos (`JsonCommentHandling.Skip`) |
| T3 | Caras del cubo como `Cuadrado` o como `Rectangulo` | Se aceptan las dos y **el tipo se conserva como llegó** |
| T4 | Valores calculados incorrectos en dos casos reproducibles (área del cubo con `4·l²`, volumen del ortoedro sin el largo) | **Se señalan con advertencia; no se rechazan ni se corrigen** |
| — | Existencia contra veracidad | Un `0.00` presente es una dimensión legible: la figura no se descarta |

Las siete garantías `G-1`…`G-7` del contrato §4: el texto no se modifica; un defecto no descarta
el resto; la posición fallida **queda reservada** y no se compacta; ningún mensaje es genérico; un
valor erróneo es advertencia, nunca rechazo; sin red ni configuración propia; **un texto mal
escrito es un resultado, no una avería** (G-7).

### 8.2 Cómo se lee

| Paso | Regla del código |
| --- | --- |
| Texto que no se puede leer ni con tolerancia | 0 figuras, un error sin posición con campo **`Texto`**, árbol nulo |
| Raíz que no es lista ni objeto, o lista vacía | 0 figuras y el mismo error sobre `Texto` |
| Raíz objeto | Es **una figura suelta** (escenarios `E-3`, `E-4`), posición 0 |
| Tipos de pieza aceptados | `Cilindro`, `Cubo`, `Ortoedro`, `Rectangulo`, `Cuadrado`, `Circulo` (seis) |
| Tipos de componente aceptados | `Rectangulo`, `Cuadrado`, `Circulo`, `RectanguloDesarrollado` |
| Claves de componente | Cilindro: `Tapas`→`Cap`, `Lado`→`Side` · Cubo: `Caras`→`Face` · Ortoedro: `Bases`/`Tapas`→`Base`, `Laterales`→`Lateral` · planas: ninguna |
| Campos numéricos | `Largo`, `Ancho`, `Radio`, `Altura`, `Area`, `Volumen` |
| Figura o componente sin `Tipo`, con `Tipo` no texto o desconocido, o que no es objeto | No hay pieza; error en su posición con campo **`Tipo`** (`E-5`) |
| Campo ausente o escrito `null` | Se lee **como ausente**, no como ilegible |
| Campo presente que no es número (p. ej. `"3,50"`) | Error en su posición **con ese campo** (`E-8`) |
| Valores que la pieza no usa (p. ej. `"Relleno": true`) | No la invalidan; aparecen en el árbol con su forma |
| El árbol | Se arma del **texto**, no de las piezas: las figuras fallidas también están, y su posición es la misma del bucle por construcción. Los números se muestran con `GetRawText` (`3.00` sigue siendo `3.00`). Clases de nodo: `Object`, `Array`, `Text`, `Number`, `Boolean`, `Empty` |

### 8.3 La tabla de derivación por tipo

**El área derivada de una pieza volumétrica es la suma de las áreas declaradas de sus
componentes**, y la fórmula por tipo se usa sólo donde no hay componentes que sumar (`ADR-06006`:
es la única vía que reproduce los 113.09 del cilindro de `E-1`). Verificada sobre el código:

| Tipo de pieza | Área derivada | Volumen derivado | Condición para derivar |
| --- | --- | --- | --- |
| `Rectangle`, `Square` | `Largo × Ancho` de la pieza | — | Los dos presentes; no lee componentes |
| `Circle` | `π · Radio²` | — | `Radio` presente |
| `Cube` | Σ áreas de los componentes | `arista³`, arista = `Largo` de la pieza o de la primera `Face` | Área: al menos una `Face` **y** todos los componentes con `Area` |
| `Cylinder` | Σ áreas de los componentes | `π · r² · h`, `r` = `Radio` de la pieza o de la primera `Cap`, `h` = `Largo` de la pieza o del `Side` | Área: una `Cap` **y** un `Side`, todos con `Area` |
| `Orthohedron` | Σ áreas de los componentes | `largo × ancho × alto`, base de la pieza o de la primera `Base` | Área: una `Base` **y** un `Lateral`, todos con `Area` |

**La altura del ortoedro**: `Altura` si viene; si no, **la dimensión del lateral que no es un lado
de la base** (con la misma tolerancia), que es la única regla que satisface a `E-1`/`E-2` y a `E-7`
a la vez (derivación de la etapa `f`, declarada). **Un juego de componentes incompleto no se
suma**: el ortoedro de `E-8` trae `Bases` sin `Laterales` y su área no se deriva. Sin valor
declarado o sin valor derivado **no se compara**.

`DevelopedRectangle` no es tipo de pieza: es la superficie lateral del cilindro desenrollada
(`Ancho = 2πr`, `Largo = altura`). La rama `Largo × Ancho` que el código le reserva **no se alcanza
desde `Interpret`** (`tests/GeometriaFactory.Integration.Tests/FigureTextReadingTests.cs`, remarks).

### 8.4 La comparación

`ComparisonTolerance = 0.01`, absoluta, con **operador estricto**: advierte sólo si
`|declarado − derivado| > 0.01`. Sale de que el emisor redondea a dos decimales; el operador
estricto decide que `E-1` dé **dos** advertencias y no tres, porque el área de su cilindro difiere
en exactamente 0.01. Cada discrepancia es una advertencia sobre el campo `Area` o `Volumen` con
los dos números. Errores de lectura → trabajo en `Borrador` al enviar (`RN-02005`, `RN-02009`).

## 9. Lo que fija este comportamiento

Cuatro clases en `tests/GeometriaFactory.Integration.Tests/` usan `LocalFigureValidator`, sin
host, base ni red. Lo que miden y cómo corren está en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md).

| Clase | Qué fija | `[Fact]` / `[Theory]` (`InlineData`) |
| --- | --- | --- |
| `FigureValidatorBatteryTests` (259 líneas) | **La batería obligatoria de diez casos** (`CV-00002` de `.../GeometriaFactory-Api/08-Calidad-Y-Pruebas/Criterios-Validacion.md`), con los textos de `E-1`…`E-8` del intake §20 transcriptos carácter por carácter, más `E-7` y las garantías | 13 / 1 (2) |
| `FigureDerivationTests` (207) | Los caminos de derivación cuando falta un dato | 5 / 4 (11) |
| **`FigureTextReadingTests`** (80, **nueva**, commit `27fa0e1`) | La lectura de lo que falta, sobra o no se puede tipar: figura sin `Tipo`, componente no objeto o de tipo inexistente, `null` como ausente, valores que la pieza no usa | 2 / 1 (5) |
| `TextTreeTests` (179) | El árbol del texto | 9 / 0 |

**Por qué entró `FigureTextReadingTests` (R-12, `SDD/Docs/Audit/Mesa-2026-09-14.md`).** Cuando la
puerta `QG-06` tuvo instrumento, el validador daba **94,2 %** de líneas contra un piso de 95 %;
con esta clase pasa a **99,1 %** según el mensaje del commit `27fa0e1` (cifra no re-medida en esta
indexación). Ninguna prueba se escribió para mover el número: cada una afirma qué hace el producto
con un texto que un alumno puede escribir. Los cuerpos ejecutables por HTTP de `E1`…`E8` están en
`samples/api/02-intermedio/cuerpos/` (ver [`09_Samples-Ejecutables.md`](09_Samples-Ejecutables.md)).
**No se inventan datos de prueba** (intake §15, regla de delivery 5; `CV-00002`).

---

Las contradicciones entre documentos y código que aparecieron al verificar este índice
(contadores viejos en `ConditionCode.cs`, el punto abierto que `ADR-06006` ya cerró, el atributo
`CredentialChangedAt` ausente del modelo de dominio y la condición `CredentialAlreadySet`) están
en [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).
