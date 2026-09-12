# 03 · Dominio y reglas de negocio — qué es verdad siempre

> **Propósito.** Las entidades, los conjuntos cerrados, los nueve invariantes, las dieciséis
> reglas y el catálogo de condiciones, para poder razonar sobre el producto sin abrir el código.
> **Fuente primaria.** `src/GeometriaFactory.Domain/`, `PRODUCT-INTAKE` §14,
> `Api/02-Especificacion-Funcional/Reglas-De-Negocio/` y
> `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` (631 líneas). Verificado
> el 2026-09-11 sobre la revisión `89f3ab3`.

---

## 1. Las cinco entidades

| Entidad | Qué es | Campos |
| --- | --- | --- |
| `Account` | La cuenta del alumno o del administrador | `Id`, `Email`, `NormalizedEmail`, `FirstName`, `LastName`, `Role`, `Status`, `PasswordHash?`, `MustChangePassword`, `CreatedAt` |
| `Work` | El trabajo que el alumno carga | `Id`, `OwnerId`, `Name`, `DeclaredDate` (texto, no fecha), `Description?`, **`OriginalJson`**, `Status`, `AdministratorComment?`, `RootFigureCount?`, `CreatedAt`, `UpdatedAt` |
| `Piece` | Cada figura del conjunto raíz. **Su identidad es su posición**, porque el dato del alumno no trae identificador | `Position`, `Type`, `DeclaredArea?`/`DerivedArea?`, `DeclaredVolume?`/`DerivedVolume?`, `DeclaredLength?`, `DeclaredWidth?`, `DeclaredRadius?` |
| `Component` | Figura plana que forma parte de una pieza | `Position`, `Role`, `Type`, `DeclaredLength?`, `DeclaredWidth?`, `DeclaredRadius?`, `DeclaredArea?` |
| `Observation` | Lo que el producto emite al interpretar | `Kind`, `PiecePosition?`, `Field`, `DeclaredValue?`, `DerivedValue?` |

**El par declarado/derivado es el motivo de existir del producto.** No es un detalle de
implementación: es lo que hace visible el error de fórmula del programa del alumno.

**`OriginalJson` se conserva íntegro y sin normalizar** (`RN-02008`). Ninguna capa lo reescribe.
**`DeclaredDate` es un `string`**: la fecha que el alumno declaró se conserva como la escribió y el
front sólo la presenta (`Services/DeclaredDateText.cs`).

## 2. Los conjuntos cerrados

De `src/GeometriaFactory.Domain/Values/`. **Los valores son ingleses en el código y castellanos en
la pantalla**, con la correspondencia fijada por la decisión `F-02` de la norma de nombres.

| Conjunto | Valores | Nota |
| --- | --- | --- |
| `AccountStatus` | `Pending`, `Enabled`, `Blocked` | El administrador está **siempre** `Enabled` (`INV-08`) |
| `Role` | `Student`, `Administrator` | Dos papeles fijos; no hay permisos finos |
| `WorkStatus` | `Draft`, `Submitted`, `Approved`, `Rejected` | En pantalla: `Borrador`, `Pendiente`, `Finalizado`, `Rechazado` (`ContractTranslation.cs`). `Approved` y `Rejected` son **terminales** (`INV-07`) |
| `WorkOutcome` | `Approve`, `Reject` | Las dos decisiones del administrador |
| `WorkOperation` | `View`, `Edit`, `Delete` | Lo que se pide sobre un trabajo |
| `FigureType` | `Cylinder`, `Cube`, `Orthohedron`, `Rectangle`, `Square`, `Circle`, `DevelopedRectangle` | Siete tipos |
| `ComponentRole` | `Cap`, `Face`, `Base`, `Lateral`, `Side` | Tapa, cara, base, lateral, lado |
| `ObservationKind` | `Warning`, `ValidationError` | La advertencia **no impide** pasar a `Submitted`; el error sí |

`WorkOutcomeRequest` **no lleva el estado pretendido**: se pide un desenlace y el dominio decide a
qué estado lleva. Que el tipo no lo declare es lo que vuelve imposible pedirlo.

`EmailIdentity.Normalize` es **el único normalizador de correos del producto** (`ADR-06003`).

## 3. Los nueve invariantes (`PRODUCT-INTAKE` §14)

Un invariante es lo que tiene que ser verdad **siempre**, aunque la petición llegue por fuera de
la interfaz.

| Id | Enunciado | Regla asociada |
| --- | --- | --- |
| `INV-01` | El correo del alumno es único en todo el sistema | `RN-02002` |
| `INV-02` | Un alumno sólo accede a sus propios trabajos | `RN-02003` |
| `INV-03` | Un trabajo eliminado **por un alumno** estaba en `Borrador` y le pertenecía | `RN-02004` |
| `INV-04` | Un trabajo `Finalizado` tiene texto interpretado sin errores (puede tener advertencias) | `RN-02005` |
| `INV-05` | Existe **exactamente un** administrador; su alta sólo es posible mientras no exista ninguno | `RN-02001` |
| `INV-06` | Un alumno `Pendiente` o `Bloqueado` no obtiene credencial | `RN-02006` |
| `INV-07` | Un trabajo `Finalizado` o `Rechazado` no cambia de estado ni de contenido | `RN-02010` |
| `INV-08` | La cuenta administradora está **siempre** `Habilitado`: nace habilitada, nada la lleva a `Pendiente` ni a `Bloqueado`, y no admite baja. Toda cuenta de alumno nace `Pendiente` | `RN-02001`, `RN-02006` |
| `INV-09` | Una cuenta con **cambio de contraseña pendiente** no ejerce ninguna capacidad salvo cambiar su propia contraseña. La marca la ponen sólo el reseteo y la habilitación, y la levanta sólo el cambio efectivo hecho por la propia cuenta | `RN-02012`, `RN-02013`, `RN-02016` |

**`INV-08` no viene de las fuentes: lo propuso la categoría 02 del dominio** después de que la
familia de defectos que su ausencia habilita se abriera dos veces por puertas distintas, las dos
terminando con la instancia sin nadie capaz de habilitar, desbloquear ni revisar.

## 4. Las dieciséis reglas de negocio

`Api/02-Especificacion-Funcional/Reglas-De-Negocio/RN-02001..RN-02016`. **Diez tienen invariante
asociado y seis no**, porque describen comportamientos o alcances de consulta y no condiciones
permanentes sobre el estado.

| Regla | Qué decide |
| --- | --- |
| `RN-02001` | Administrador único y papeles fijos |
| `RN-02002` | Correo del alumno único |
| `RN-02003` | **Trabajo ajeno indistinguible de inexistente** |
| `RN-02004` | Eliminación del alumno acotada al borrador |
| `RN-02005` | Finalización sin errores de validación |
| `RN-02006` | Cuenta pendiente o bloqueada sin acceso |
| `RN-02007` | Baja con arrastre y **confirmación escrita** del correo |
| `RN-02008` | Texto original conservado íntegro |
| `RN-02009` | Observación de error con posición y campo |
| `RN-02010` | Desenlace exclusivo del administrador, y terminalidad |
| `RN-02011` | **El administrador no ve los borradores** |
| `RN-02012` | Resetear conserva la cuenta y sus trabajos |
| `RN-02013` | Cambio forzado **antes de toda otra capacidad** |
| `RN-02014` | La provisoria la produce el sistema |
| `RN-02015` | Resetear es **independiente del estado de cuenta** |
| `RN-02016` | Habilitar produce la provisoria |

**Las dos que más se malinterpretan.** `RN-02003`: pedir el trabajo de otro devuelve «no
encontrado» y no «no autorizado» —decir «no autorizado» confirmaría que ese trabajo existe—.
`RN-02016` cierra la escritura anónima **de contraseña**, no la escritura anónima: el registro de
cuenta sigue siendo anónimo por diseño, y así debe seguir.

## 5. La superficie del dominio

Métodos públicos, todos devolviendo `DomainResult` / `DomainResult<T>`: **no hay excepciones como
mecanismo de flujo** (`ADR-02002`, resultados tipados).

| Entidad | Operaciones |
| --- | --- |
| `Account` | `ConfigureAdministrator`, `Register` (estáticas, crean) · `Enable(provisionalPasswordHash)`, `Block()`, `AdmitDeletion(worksCascadeDeclared)`, `ResetPassword(hash, worksCascadeDeclared)`, `ReplaceCredential(newHash, currentCredentialVerified)`, `EvaluateAdmission()` → `Admission` |
| `Work` | `Create` (estática) · `Edit`, `AdoptInterpretation`, `Submit`, `ApplyOutcome`, `ResolveStudentAccess(requesterId, operation)`, `ResolveAdministratorScope(requesterRole, operation)` |
| `Guards` | `Admission.Admissible()` / `Admission.NotAdmissible(reason)` — **la guarda única de admisibilidad** (`ADR-02005`) |

**Las firmas cuentan lo que el dominio no hace**: `Enable` y `ResetPassword` reciben el hash de la
provisoria **ya derivado**, `ReplaceCredential` recibe el hecho de que la credencial actual **ya se
verificó**, y `AdmitDeletion` recibe que el arrastre de trabajos **ya se declaró**. El dominio no
deriva, no verifica y no consulta: decide sobre hechos que le entregan (`ADR-02006`).

## 6. El catálogo cerrado de condiciones

`ConditionCode` (`Domain/Values/ConditionCode.cs`) declara **37 constantes**. Son la moneda
interna: el dominio y la aplicación hablan en códigos de condición, y **una sola tabla** los
traduce a códigos de contrato en la frontera (`ADR-00004`, ver
[`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md)).

| Familia | Códigos |
| --- | --- |
| Forma de la petición | `RequiredFieldMissing`, `EmptyDerivedValue` |
| Alta y unicidad | `AdministratorAlreadyConfigured`, `EmailUniquenessNotVerified`, `SetupWithoutCredential`, `InitialStatusNotNegotiable`, `CredentialNotAllowedOnRegistration`, `AdministratorRoleOutsideThisPath` |
| Credencial | `AccountNotEnabledForCredential`, `CredentialAlreadySet`, `CurrentCredentialNotVerified`, `AccountPending`, `AccountBlocked`, `PasswordChangePending` |
| Ciclo de vida de la cuenta | `AccountTransitionNotAllowed`, `EnableWithoutTemporaryCredential`, `DeletionWithoutWorkCascade`, `OperationNotApplicableToAdministratorAccount`, `ResetWithWorkCascade` |
| Interpretación | `ObservationOnMissingPiece`, `ErrorWithoutLocation`, `WarningMissingBothValues`, `UnknownObservationKind`, `OriginalJsonAltered` |
| Trabajo y alcance | `WorkWithoutOwner`, `EditOutsideDraft`, `WorkNotFoundForRequester`, `OperationOutsideDraft`, `UnknownOperation`, `WorkOutsideAdministratorScope`, `ScopeRequiresAdministratorRole`, `SubmissionOutsideDraft`, `SubmissionWithoutParseResult` |
| Desenlace | `TransitionFromTerminalStatus`, `OutcomeOutsideSubmitted`, `OutcomeRequiresAdministratorRole`, `UnknownOutcome` |

La capa de aplicación suma los suyos en `ApplicationConditionCode` (`EmailAlreadyRegistered`,
`AccountNotFound`, `AdministratorRoleRequired`, `DeletionConfirmationMismatch`,
`ResetLimitedToStudentAccounts`, `WorkNotFound`, `RequesterNotDeclared`, `UnrecognizedRole`) y
la de infraestructura en `InfrastructureConditionCode` (`UnreadablePasswordHash`,
`RandomnessSourceUnavailable`); estos dos viven en `Application/Accounts/`.

**Varios describen un defecto del producto, no un pedido mal hecho.** Si alguno se alcanzara, la
respuesta correcta es `500`: están inventariados en `Audit/Mesa-2026-08-31.md` y la traducción
los deja deliberadamente en el genérico.

## 7. La interpretación del texto y la derivación de valores

La hace `LocalFigureValidator` (`Infrastructure/Figures/`), que implementa el puerto
`IFigureValidator`. **La derivación es por tipo de figura**, con la tabla de `ADR-06006` (lectura
tolerante y tabla de derivación por tipo), verificada sobre el código:

| Tipo | Área derivada | Volumen derivado | Componentes que exige |
| --- | --- | --- | --- |
| `Rectangle`, `Square` | largo × ancho | — | ninguno en particular; si trae, al menos uno |
| `Circle` | π r² | — | — |
| `DevelopedRectangle` | del desarrollo | — | — |
| `Cube` | de sus caras | arista³ | al menos una `Face` |
| `Cylinder` | de tapas y lado | π r² h | una `Cap` **y** una `Side` |
| `Orthohedron` | de base y laterales | largo × ancho × alto | una `Base` **y** una `Lateral` |

Cuando el valor declarado y el derivado no coinciden, se emite una **advertencia** con los dos
números; cuando el texto no se puede interpretar como figuras, se emiten **errores de validación**
con posición y campo (`RN-02009`), y el trabajo queda en `Borrador`.

**La batería obligatoria son diez casos**, declarada en `Api/08/Criterios-Validacion.md`
`CV-00002` y ejercida por `FigureValidatorBatteryTests`; los ocho escenarios de datos `E-1` a
`E-8` del intake §20 son el material de prueba y **no se inventan datos**. Los cuerpos
ejecutables están en `samples/api/02-intermedio/cuerpos/`.
