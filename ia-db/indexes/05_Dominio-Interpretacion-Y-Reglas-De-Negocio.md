# 05 · Dominio, interpretación del texto y reglas de negocio

> **Propósito:** ubicar las entidades, los conjuntos cerrados, los invariantes, las reglas de negocio y conceptuales, los casos de uso funcionales (Api, Domain, Application) y la interpretación del texto del alumno con su verificación declarado/derivado.
> **Fuente primaria:** código `src/GeometriaFactory.Domain/`, `src/GeometriaFactory.Application/` y `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs`; documentos `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/` y `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md`.
> **Revisión:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01. Rutas relativas a la raíz del repo.
> **No cubre:** guardia de admisión, credenciales y política de registro por dominio → [08](08_Seguridad-Identidad-Y-Sesion.md); persistencia → [07](07_Persistencia-Y-Almacen.md); exposición HTTP → [06](06_Superficie-HTTP-Y-Contratos.md); pantallas → [09](09_Front-Web-Y-Experiencia-De-Uso.md); ADR → [15](15_Decisiones-ADR.md); capacidades F-n y NB-n → [02](02_Requerimientos-Necesidades-Y-Alcance.md).

Abreviaturas de ruta usadas abajo:

| Alias | Ruta |
| --- | --- |
| `DOM/` | `src/GeometriaFactory.Domain/` |
| `APP/` | `src/GeometriaFactory.Application/` |
| `EF/` | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/` |
| `OI/` | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Operaciones-Internas/` |
| `INTAKE` | `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` |

---

## 1. Documentos de dominio (dónde leer el detalle)

| Documento | Qué contiene | Fuente |
| --- | --- | --- |
| Especificación funcional (1051 líneas) | Alcance por proyecto (§1), catálogo de CU por proyecto (§5), reglas que hace cumplir cada capa (§6), matriz NB→CU→RN→US (§7) | `EF/Especificacion-Funcional.md` |
| Modelo de dominio (426 líneas) | 5 entidades (§2), cardinalidades (§3), 9 invariantes y correspondencia con las 16 RN (§4), transiciones de cuenta, trabajo y marca (§5), semántica derivada vs guardada (§6), fronteras (§7) | `EF/Definicion-Modelo-De-Dominio.md` |
| Contrato del validador de figuras (167 líneas) | Trampas T1–T4 (§2), qué devuelve (§3), garantías G-1..G-7 (§4), tipos (§5), escenarios E-1..E-8 (§6), batería obligatoria (§7), frontera con el visor (§8), puntos abiertos (§9) | `EF/Definicion-Contrato-Del-Validador-De-Figuras.md` |
| Modelo conceptual (188 líneas) | Decisiones de almacenamiento (§2), 5 entidades con diagrama (§3), conjuntos cerrados (§4), 7 reglas conceptuales (§5), qué no está (§6) | `EF/Modelo-Datos/Modelo-Conceptual.md` |
| Reglas conceptuales RC-06001..06007 | Un archivo por regla | `EF/Modelo-Datos/reglas-conceptuales-de-modelo/` |
| Reglas de negocio RN-02001..02016 | Un archivo por regla | `EF/Reglas-De-Negocio/` |
| Casos de uso funcionales CU-00021..00029 | Un archivo por capacidad, flujo de la persona al almacén | `EF/Casos-De-Uso/` |
| Operaciones internas CU-06001, CU-06002 | Interpretar y verificar | `OI/CU-06001-…`, `OI/CU-06002-…` |
| Invariantes en el intake | Tabla INV-01..09 con su RN de origen | `INTAKE` §17.1.P.2 · GeometriaFactory-Domain (≈ línea 786) |
| Escenarios de datos | E-1..E-8 transcriptos completos | `INTAKE` §20 (línea 1431 en adelante) |

> Nota de trazabilidad: la tarea de indexado ubicaba los INV en `INTAKE` §14; en 5f07b12 la tabla vive en §17.1.P.2 · GeometriaFactory-Domain (§14 es «Estilo arquitectónico del producto» y sólo los nombra).

---

## 2. Entidades (`DOM/Entities/`)

| Entidad (código) | Término de dominio | Atributos principales | Operaciones de dominio | Fuente |
| --- | --- | --- | --- | --- |
| `Account` | Cuenta (alumno o administrador) | `Id`, `Email`, `NormalizedEmail`, `FirstName`, `LastName`, `Role`, `Status`, `PasswordHash?`, `MustChangePassword`, `CreatedAt`, `CredentialChangedAt?` | `ConfigureAdministrator`, `Register`, `Enable`, `Block`, `AdmitDeletion`, `ResetPassword`, `ReplaceCredential`, `EvaluateAdmission` (→ 08) | `DOM/Entities/Account.cs` |
| `Work` | Trabajo | `Id`, `OwnerId`, `Name`, `DeclaredDate`, `Description?`, `OriginalJson`, `Status`, `AdministratorComment?`, `RootFigureCount?`, `Pieces`, `Observations`, `CreatedAt`, `UpdatedAt` | `Create`, `Edit`, `AdoptInterpretation`, `Submit`, `ApplyOutcome`, `ResolveStudentAccess`, `ResolveAdministratorScope`; `StatusOutsideAdministratorScope = Draft` | `DOM/Entities/Work.cs` |
| `Piece` | Pieza (identidad = posición) | `Position`, `Type`, `DeclaredArea/DerivedArea`, `DeclaredVolume/DerivedVolume`, `DeclaredLength/Width/Radius`, `Components` | `Reconstruct` | `DOM/Entities/Piece.cs` |
| `Component` | Componente | `Position`, `Role` (`ComponentRole`), `Type`, `DeclaredLength/Width/Radius/Area` | `Declare` | `DOM/Entities/Component.cs` |
| `Observation` | Observación | `Kind`, `PiecePosition?`, `Field`, `DeclaredValue?`, `DerivedValue?` | `ValidationErrorAt(pos, field)`, `ValueDiscrepancyAt(…)` | `DOM/Entities/Observation.cs` |

Cardinalidades (fuente `EF/Definicion-Modelo-De-Dominio.md` §3):

```
Cuenta(alumno) 1 ── 0..N Trabajo
Trabajo        1 ── 0..N Pieza ── 1 ── 0..N Componente
Trabajo        1 ── 0..N Observación ··· 0..1 Pieza (por posición; sin posición = trabajo entero)
Trabajo        1 ── 0..1 comentario del administrador (atributo, no entidad)
```

Resultados sin excepciones de negocio:

| Tipo | Forma | Fuente |
| --- | --- | --- |
| `DomainResult` / `DomainResult<T>` | `Succeeded`, `Value?`, `ConditionCode?`; `Applied()` / `Rejected(code)` | `DOM/Guards/DomainResult.cs` |
| `ApplicationResult` / `ApplicationResult<T>` | Igual, más `Rejected(code, context)` que devuelve contexto junto al rechazo | `APP/ApplicationResult.cs` |

La traducción del código de condición a respuesta HTTP → [06](06_Superficie-HTTP-Y-Contratos.md).

---

## 3. Valores y conjuntos cerrados (`DOM/Values/`)

| Enum / clase | Miembros (código = valor) | Etiqueta de dominio | Fuente |
| --- | --- | --- | --- |
| `FigureType` | `Cylinder`=1, `Cube`=2, `Orthohedron`=3, `Rectangle`=4, `Square`=5, `Circle`=6, `DevelopedRectangle`=7 | Cilindro, Cubo, Ortoedro, Rectangulo, Cuadrado, Circulo, RectanguloDesarrollado | `DOM/Values/FigureType.cs` |
| `WorkStatus` | `Draft`=1, `Submitted`=2, `Approved`=3, `Rejected`=4 | Borrador, **Pendiente**, **Finalizado**, Rechazado | `DOM/Values/WorkStatus.cs` |
| `WorkOutcome` | `Approve`=1, `Reject`=2 | Aprobar, Rechazar | `DOM/Values/WorkOutcome.cs` |
| `WorkOperation` | `View`=1, `Edit`=2, `Delete`=3 | Ver, editar, eliminar (pertenencia) | `DOM/Values/WorkOperation.cs` |
| `Role` | `Student`=1, `Administrator`=2 | Alumno, Administrador | `DOM/Values/Role.cs` |
| `AccountStatus` | `Pending`=1, `Enabled`=2, `Blocked`=3 | Pendiente, Habilitado, Bloqueado | `DOM/Values/AccountStatus.cs` |
| `ComponentRole` | `Cap`=1, `Face`=2, `Base`=3, `Lateral`=4, `Side`=5 | Tapa, Cara, Base, Lateral, Lado | `DOM/Values/ComponentRole.cs` |
| `ObservationKind` | `Warning`=1, `ValidationError`=2 | Advertencia, Error de validación | `DOM/Values/ObservationKind.cs` |
| `EmailIdentity` | `Normalize(email)` = `Trim().ToUpperInvariant()` | Identidad del correo (unicidad INV-01) | `DOM/Values/EmailIdentity.cs` |

Equivalencia de vocabulario: el código dice `Submitted`/`Approved`, el corpus dice `Pendiente`/`Finalizado` (el XML-doc de `WorkStatus.cs` lleva la etiqueta). Norma de nombres → [14](14_Glosario-Y-Nomenclatura.md).

### 3.1 Códigos de condición

| Catálogo | Códigos (en el orden del archivo) | Fuente |
| --- | --- | --- |
| Domain, base (12) | `REQUIRED_FIELD_MISSING`, `ADMINISTRATOR_ALREADY_CONFIGURED`, `EMAIL_UNIQUENESS_NOT_VERIFIED`, `SETUP_WITHOUT_CREDENTIAL`, `INITIAL_STATUS_NOT_NEGOTIABLE`, `ACCOUNT_NOT_ENABLED_FOR_CREDENTIAL`, `CREDENTIAL_ALREADY_SET`, `CURRENT_CREDENTIAL_NOT_VERIFIED`, `EMPTY_DERIVED_VALUE`, `ACCOUNT_PENDING`, `ACCOUNT_BLOCKED`, `PASSWORD_CHANGE_PENDING` | `DOM/Values/ConditionCode.cs` |
| Domain, etapa d (7) | `CREDENTIAL_NOT_ALLOWED_ON_REGISTRATION`, `ADMINISTRATOR_ROLE_OUTSIDE_THIS_PATH`, `ACCOUNT_TRANSITION_NOT_ALLOWED`, `ENABLE_WITHOUT_TEMPORARY_CREDENTIAL`, `DELETION_WITHOUT_WORK_CASCADE`, `OPERATION_NOT_APPLICABLE_TO_ADMINISTRATOR_ACCOUNT`, `RESET_WITH_WORK_CASCADE` | idem |
| Domain, etapa f (4) | `OBSERVATION_ON_MISSING_PIECE`, `ERROR_WITHOUT_LOCATION`, `WARNING_MISSING_BOTH_VALUES`, `UNKNOWN_OBSERVATION_KIND` | idem |
| Domain, etapa e (14) | `WORK_WITHOUT_OWNER`, `ORIGINAL_JSON_ALTERED`, `EDIT_OUTSIDE_DRAFT`, `WORK_NOT_FOUND_FOR_REQUESTER`, `OPERATION_OUTSIDE_DRAFT`, `UNKNOWN_OPERATION`, `WORK_OUTSIDE_ADMINISTRATOR_SCOPE`, `SCOPE_REQUIRES_ADMINISTRATOR_ROLE`, `SUBMISSION_OUTSIDE_DRAFT`, `SUBMISSION_WITHOUT_PARSE_RESULT`, `TRANSITION_FROM_TERMINAL_STATUS`, `OUTCOME_OUTSIDE_SUBMITTED`, `OUTCOME_REQUIRES_ADMINISTRATOR_ROLE`, `UNKNOWN_OUTCOME` | idem |
| Application (9) | `EMAIL_ALREADY_REGISTERED`, `EMAIL_DOMAIN_NOT_ADMITTED` (política → 08), `ACCOUNT_NOT_FOUND`, `ADMINISTRATOR_ROLE_REQUIRED`, `DELETION_CONFIRMATION_MISMATCH`, `RESET_LIMITED_TO_STUDENT_ACCOUNTS`, `REQUESTER_NOT_DECLARED`, `WORK_NOT_FOUND`, `UNRECOGNIZED_ROLE` | `APP/Accounts/ApplicationConditionCode.cs` |
| Infrastructure (2) | `UNREADABLE_PASSWORD_HASH`, `RANDOMNESS_SOURCE_UNAVAILABLE` | `APP/Accounts/InfrastructureConditionCode.cs` |

Los comentarios del archivo declaran que los nombres ingleses se **transcriben** de `Norma-De-Nomenclatura.md` §6.8.1 (fijados por F-03), no se acuñan (`DOM/Values/ConditionCode.cs`).

---

## 4. Invariantes INV-01..09

Fuente: `INTAKE` §17.1.P.2 · GeometriaFactory-Domain y `EF/Definicion-Modelo-De-Dominio.md` §4.1–§4.3.

| INV | Enunciado (resumido) | RN de origen |
| --- | --- | --- |
| INV-01 | El correo del alumno es único en todo el sistema | RN-02002 |
| INV-02 | Un alumno sólo accede a sus propios trabajos | RN-02003 |
| INV-03 | Un trabajo eliminado **por un alumno** estaba en `Borrador` y le pertenecía | RN-02004 |
| INV-04 | Un trabajo `Finalizado` tiene JSON interpretado sin errores (puede tener advertencias) | RN-02005 |
| INV-05 | Existe exactamente un administrador; su alta sólo mientras no exista ninguno | RN-02001 |
| INV-06 | Un alumno `Pendiente` o `Bloqueado` no obtiene token | RN-02006 |
| INV-07 | `Finalizado` y `Rechazado` no cambian de estado ni de contenido | RN-02010 |
| INV-08 | La cuenta `Administrador` está siempre `Habilitado` y no admite baja | RN-02001, RN-02006 (`SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` §17.1.P.2; `EF/Definicion-Modelo-De-Dominio.md` §4.1 y §4.3) |
| INV-09 | Con la marca de cambio de contraseña pendiente, sólo se puede cambiar la propia contraseña | RN-02012, RN-02013, RN-02016 (`EF/Definicion-Modelo-De-Dominio.md` §4.1) |

Cómo se sostiene en runtime INV-06/INV-09 (guardia de admisión, `DOM/Guards/Admission.cs`) → [08](08_Seguridad-Identidad-Y-Sesion.md).

---

## 5. Reglas de negocio RN-02001..02016

Un archivo por regla en `EF/Reglas-De-Negocio/`; declaradas en `INTAKE` §4.1.

| RN | Título (del archivo) |
| --- | --- |
| RN-02001 | Administrador único y papeles fijos |
| RN-02002 | Correo del alumno único |
| RN-02003 | Trabajo ajeno indistinguible de inexistente |
| RN-02004 | Eliminación acotada al borrador |
| RN-02005 | Finalización sin errores de validación |
| RN-02006 | Cuenta pendiente o bloqueada sin acceso |
| RN-02007 | Baja con arrastre y confirmación escrita |
| RN-02008 | Texto original conservado íntegro |
| RN-02009 | Observación de error con posición y campo |
| RN-02010 | Desenlace exclusivo del administrador y terminalidad |
| RN-02011 | El administrador no ve los borradores |
| RN-02012 | Reseteo conserva la cuenta y sus trabajos |
| RN-02013 | Cambio forzado antes de toda otra capacidad |
| RN-02014 | Provisoria producida por el sistema |
| RN-02015 | Reseteo independiente del estado de cuenta |
| RN-02016 | Habilitar produce la provisoria |

Qué capa hace cumplir cada una: `EF/Especificacion-Funcional.md` §6 (Api §6.1, Application §6.2, Infrastructure §6.3) y, para el Domain, el catálogo de las 16 RN con su invariante y CU afectados en §12.1 · `GeometriaFactory-Domain`. Matriz NB→CU→RN→US: §7 del mismo archivo.

---

## 6. Reglas conceptuales de modelo RC-06001..06007

Fuente: `EF/Modelo-Datos/reglas-conceptuales-de-modelo/` y `EF/Modelo-Datos/Modelo-Conceptual.md` §5. Su materialización en el esquema → [07](07_Persistencia-Y-Almacen.md).

| RC | Regla |
| --- | --- |
| RC-06001 | Texto original escrito una sola vez |
| RC-06002 | Identidad posicional de la pieza |
| RC-06003 | Valor declarado y derivado por separado |
| RC-06004 | La familia (plana/volumétrica) no se persiste: se deriva del tipo |
| RC-06005 | Retiro físico con arrastre |
| RC-06006 | Tres sellos de tiempo distintos |
| RC-06007 | La marca no es un estado de cuenta |

---

## 7. Máquinas de estado

Fuente: `EF/Definicion-Modelo-De-Dominio.md` §5; código `DOM/Entities/Account.cs`, `DOM/Entities/Work.cs`.

### 7.1 Trabajo

```
(alta) ─► Borrador ──envío sin errores de validación──► Pendiente (Submitted)
            │  ▲ reedición / envío con errores               │
            └──┘                                    administrador: Approve ─► Finalizado (terminal)
Borrador ─► (eliminado por el alumno)                           Reject  ─► Rechazado  (terminal)
Pendiente/Finalizado/Rechazado ─► (eliminado por el administrador, borrado físico)
```

| Estado | Edita alumno | Elimina alumno | Lo ve el administrador |
| --- | --- | --- | --- |
| Borrador | Sí | Sí | No (RN-02011) |
| Pendiente | No | No | Sí |
| Finalizado / Rechazado | No | No | Sí (comentario opcional) |

El validador **no** decide el estado: el dominio lo resuelve con las observaciones (`Work.AdoptInterpretation`/`Submit`; `EF/Definicion-Contrato-Del-Validador-De-Figuras.md` §3).

### 7.2 Cuenta y marca

| Desde → Hacia | Papel | Efecto | Regla |
| --- | --- | --- | --- |
| — → Pendiente | Alumno | Auto-registro sin credencial | CU-02001 |
| — → Habilitado | Administrador | Configuración inicial, una sola vez | CU-02012, INV-05 |
| Pendiente → Habilitado | Alumno | Fija provisoria y pone la marca | RN-02016 |
| Habilitado → Bloqueado | Alumno | No procede sobre el administrador | F-03 |
| Bloqueado → Habilitado | Alumno | Provisoria nueva + marca | RN-02016 |
| Cualquiera → (baja) | Alumno | Arrastra los trabajos, con confirmación escrita | RN-02007 |
| Marca: puesta | Alumno | Habilitar/rehabilitar/resetear | RN-02012, RN-02016 |
| Marca: levantada | La propia cuenta | Sólo al reemplazar la credencial | RN-02013 |

Mecánica de la provisoria y del hash → [08](08_Seguridad-Identidad-Y-Sesion.md).

---

## 8. Casos de uso

### 8.1 Funcionales de la Api (capacidades) — `EF/Casos-De-Uso/`

| CU | Capacidad | Caso de uso Application que lo realiza (código) |
| --- | --- | --- |
| CU-00021 | Dar de alta una cuenta de alumno | `APP/Accounts/RegisterAccountUseCase.cs` |
| CU-00022 | Ingresar al laboratorio y sostener la sesión | `APP/Accounts/ResolveSignInUseCase.cs`, `APP/Accounts/ChangeOwnPasswordUseCase.cs` (`ExecuteAsync`, `ExecuteWithCurrentCredentialAsync`) |
| CU-00023 | Gobernar las cuentas de la comisión | `APP/Accounts/GovernCommissionAccountsUseCase.cs` (`ListAsync`, `ChangeStatusAsync`, `DeleteAsync`) |
| CU-00024 | Resetear la contraseña de un alumno | `APP/Accounts/ResetStudentPasswordUseCase.cs` |
| CU-00025 | Configurar el administrador en el primer arranque | `APP/Accounts/ConfigureAdministratorUseCase.cs` (`IsConfiguredAsync`, `ExecuteAsync`) |
| CU-00026 | Enviar un trabajo y ver sus observaciones | `APP/Works/LoadAndEditOwnWorkUseCase.cs` (`LoadAsync`, `EditAsync`) |
| CU-00027 | Eliminar un trabajo | `APP/Works/DeleteWorkUseCase.cs` |
| CU-00028 | Consultar listado y detalle | `APP/Works/ConsultOwnWorksUseCase.cs`, `APP/Works/ReviewCommissionWorksUseCase.cs` (`ListAsync`, `DetailAsync`) |
| CU-00029 | Dar desenlace a la revisión | `APP/Works/ResolveWorkUseCase.cs` (→ `WorkResolution`) |

Los nueve sustituyen a los doce previos a la consolidación 8.5 (`EF/Especificacion-Funcional.md` §5.1; la migración → [17](17_Migraciones-Normativas-Y-Expedientes.md)).

### 8.2 Contratos por capa (`EF/Especificacion-Funcional.md` §5.2–§5.4)

| Proyecto | Rango | Cantidad | Documento que los desarrolla |
| --- | --- | --- | --- |
| Domain | CU-02001..02013 | 13 | Remiten a CU-00021..00029 |
| Application | CU-04001..04011 | 11 | Remiten a CU-00021..00029 |
| Infrastructure | CU-06001..06010 | 10 | `OI/`; aquí sólo 06001–06002 (resto → 07, 08, 04) |

### 8.3 Tipos de transferencia de Application

| Tipo | Uso | Fuente |
| --- | --- | --- |
| `AccountIdentity(Id, Email, Role)` | Identidad resuelta de una cuenta | `APP/Accounts/AccountIdentity.cs` |
| `AccountSnapshot` | Fila del listado de cuentas | `APP/Accounts/AccountSnapshot.cs` |
| `ProvisionalCredentialOutcome` | Provisoria devuelta una sola vez | `APP/Accounts/ProvisionalCredentialOutcome.cs` |
| `WorkListEntry` / `WorkDetail` | Listado sin componentes / detalle con desenlace | `APP/Works/WorkListEntry.cs`, `APP/Works/WorkDetail.cs` |
| `WorkOutcomeSnapshot` | Estado del trabajo tras cargar/editar | `APP/Works/WorkOutcomeSnapshot.cs` |

### 8.4 Puertos de dominio (`APP/Ports/`)

| Puerto | Rol | Adaptador |
| --- | --- | --- |
| `IAccountRepository`, `IWorkRepository` | Almacén de cuentas y trabajos | → [07](07_Persistencia-Y-Almacen.md) |
| `IFigureValidator` | `Interpret(originalJson)` → `FigureInterpretation` | `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` |
| `FigureInterpretation` | Cantidad de figuras raíz + piezas + observaciones + árbol | `APP/Ports/FigureInterpretation.cs` |
| `TextNode` / `TextNodeKind` | Árbol del texto con el mismo índice que la escena (F-13) | `APP/Ports/TextNode.cs` |

(`ISystemClock` → [04](04_Arquitectura-Y-Proyectos.md).)

---

## 9. Interpretación del texto y verificación (validador local)

Fuentes: `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` (631 líneas), `OI/CU-06001-Interpretar-El-Texto-Original-Y-Reconstruir-Las-Piezas.md`, `OI/CU-06002-Verificar-Los-Valores-Declarados-Contra-Los-Derivados.md`, `EF/Definicion-Contrato-Del-Validador-De-Figuras.md`.

### 9.1 Las cuatro trampas del formato

| Id | Trampa | Tratamiento en el código |
| --- | --- | --- |
| T1 | Ortoedro emite `Tapas` donde se espera `Bases` | `ComponentKeysOf`: `Bases` y `Tapas` → `ComponentRole.Base` |
| T2 | Comas finales y comentarios | `JsonDocumentOptions { AllowTrailingCommas = true, CommentHandling = Skip }` |
| T3 | Caras del cubo como `Cuadrado` o `Rectangulo` | `TryReadComponentType` acepta ambos |
| T4 | Valores declarados erróneos (área cubo 4·l², volumen ortoedro sin largo) | Sólo **advertencia** con declarado y derivado; nunca rechazo |
| (5ª) | Existencia contra veracidad: `0.00` es valor legible | La figura no se descarta (E-6) |

### 9.2 Lectura (CU-06001)

| Paso / caso | Comportamiento | Ubicación |
| --- | --- | --- |
| Raíz array | Cada elemento es una figura | `Interpret` |
| Raíz objeto | Una figura suelta (E-3, E-4) — derivación declarada de la etapa f | `Interpret` |
| No legible ni con tolerancia (FA-04) | 0 figuras, 1 error con campo `Texto`, sin posición, árbol nulo | `Interpret`, `WholeTextField` |
| Raíz vacía (FA-03) / ni array ni objeto | 0 figuras, 1 error campo `Texto` | `Interpret` |
| `Tipo` desconocido o ausente (FA-01/02) | Error con posición y campo `Tipo`; sigue con la siguiente (G-2) | `Reconstruct`, `TryReadPieceType` |
| Dimensión presente pero ilegible (E-8, p. ej. `"3,50"`) | Error con posición y nombre del campo (`Largo`, `Ancho`, `Radio`, `Altura`, `Area`, `Volumen`) | `ReadComponent`, `TryReadNumber` |
| Dimensión ausente (FA-05) | El código **no** da error: `TryReadNumber` devuelve verdadero con valor nulo («ausente no es ilegible», `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` l. 536-560). Divergencia con FA-05 de CU-06001 §5, que exige error | `TryReadNumber` |
| Posición no reconstruida | Queda reservada, no se compacta (G-3); figura en el árbol | `Interpret`, `Shape` |
| Árbol del texto | Mismo índice que la escena por construcción | `Shape`, `Describe` |

Tipos aceptados como pieza: `Cilindro`, `Cubo`, `Ortoedro`, `Rectangulo`, `Cuadrado`, `Circulo`; `RectanguloDesarrollado` sólo como componente `Lado` del cilindro (`TryReadPieceType` vs `TryReadComponentType`; contrato §5). Componentes por tipo: Cilindro `Tapas`+`Lado`; Cubo `Caras`; Ortoedro `Bases`/`Tapas`+`Laterales`.

### 9.3 Verificación (CU-06002)

| Aspecto | Valor | Ubicación |
| --- | --- | --- |
| Tolerancia | Absoluta `0.01` (`ComparisonTolerance`) | `LocalFigureValidator.cs` |
| Operador | Estricto: advierte si `|declarado − derivado| > 0.01`; exactamente 0.01 no advierte (FA-02) | `Discrepant` |
| Campos | `Area` siempre; `Volumen` sólo en volumétricas (FA-03) | `Verify` |
| Derivación | `DeriveArea`, `DeriveVolume`, `CubeEdge`, `CylinderVolume`, `OrthohedronVolume`, `HeightFromLaterals`, `HasCompleteComponentSet` | idem |
| Observación | `Observation.ValueDiscrepancyAt(pos, campo, declarado, derivado)` | `DOM/Entities/Observation.cs` |

### 9.4 Garantías del contrato G-1..G-7

`EF/Definicion-Contrato-Del-Validador-De-Figuras.md` §4: texto original intacto (G-1), un defecto no corta el análisis (G-2), posición reservada (G-3), ningún mensaje genérico (G-4), valor calculado erróneo = advertencia (G-5), sin red ni configuración propia (G-6), texto mal escrito = resultado y no avería (G-7).

### 9.5 Condiciones de error del contrato (sólo documentales)

| Código | Documento | Estado en código |
| --- | --- | --- |
| `ORIGINAL_JSON_MISSING` | `OI/CU-06001…` §6 | No aparece en `src/`; el adaptador hace `ArgumentNullException.ThrowIfNull` — **no verificado como equivalente** |
| `PARSE_RESULT_UNAVAILABLE` | `OI/CU-06001…` §6 | No aparece en `src/` |
| `PIECE_SET_NOT_REBUILT` | `OI/CU-06002…` §6 (decisión derivada declarada) | No aparece en `src/` |


---

## 10. Escenarios de datos E-1..E-8

Fuente: `INTAKE` §20 (líneas 1431–1731+) y `EF/Definicion-Contrato-Del-Validador-De-Figuras.md` §6. La colección de peticiones que los usa → [13](13_Samples-Ejecutables.md); la batería de pruebas → [11](11_Pruebas-Puertas-Y-Calidad.md).

| Esc. | Contenido | Ejercita | Resultado esperado |
| --- | --- | --- | --- |
| E-1 | JSON semilla: `Cilindro(3,3)`, `Cubo(3)`, `Ortoedro(7,7,21)` | Camino completo, operador estricto | 3 piezas, 2 advertencias (área cubo 36 vs 54; volumen ortoedro) |
| E-2 | `Ortoedro(7,7,21)` como lo emite el programa | T1 + T2 + T4 | 1 pieza, 2 bases (desde `Tapas`), 4 laterales; área sin observación y 1 advertencia de volumen (`EF/Definicion-Contrato-Del-Validador-De-Figuras.md` §6) |
| E-3 | `Cubo(3)` de Ejemplo1, caras `Cuadrado` | T3, T4 | 1 advertencia de área (36.00 vs 54.00) |
| E-4 | `Cubo(3)` de Ejemplo2, caras `Rectangulo` | T3, criterio negativo | 0 observaciones |
| E-5 | Cubo válido en 0, tipo desconocido en 1 | RN-02009 | 1 error posición 1 campo `Tipo`; la 0 se reconstruye |
| E-6 | `Rectangulo` con `Largo: 0.00` | Existencia vs veracidad | Se interpreta; nunca error |
| E-7 | Seis tipos dibujables, `Bases` en ortoedro | Cobertura de tipos | 6 piezas, 0 errores |
| E-8 | Ortoedro válido + cubo con `"Largo": "3,50"` | Dimensión no legible (intake 1.12, decisión del PO) | 1 error posición 1 campo `Largo` |

---

## 11. Dónde está cada cosa (consulta rápida)

| Pregunta | Ir a |
| --- | --- |
| ¿Cuándo un trabajo pasa a Pendiente? | `DOM/Entities/Work.cs` (`Submit`), RN-02005, §7.1 |
| ¿Por qué un ajeno da «no encontrado»? | `Work.ResolveStudentAccess`, RN-02003, `WORK_NOT_FOUND_FOR_REQUESTER` |
| ¿Qué ve el administrador? | `Work.ResolveAdministratorScope`, RN-02011, CU-02011 |
| ¿Cómo se deriva el área de un cilindro? | `LocalFigureValidator.DeriveArea` |
| ¿Qué pasa con un `0.00`? | E-6, CU-06002 FA-04 |
| ¿Qué es la marca de cambio pendiente? | `Account.MustChangePassword`, RC-06007, §7.2 |
