# 07 · Persistencia: almacén SQLite, esquema, migraciones y respaldo

> **Propósito:** ubicar dónde y cómo el servicio guarda cuentas y trabajos: el `DbContext` y su mapeo EF Core, los dos repositorios, el modelo lógico de datos, el linaje de migraciones, la preparación y la salud del almacén, y los guiones que lo ubican, migran, vacían, respaldan y restituyen.
> **Fuente primaria:** `src/GeometriaFactory.Infrastructure/Persistence/` (código) y `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Modelo-Datos-Logico.md` (diseño); norma de respaldo y restitución: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/09-Devops/Entornos-Deploy.md` §11.1.
> **Revisión indexada:** Lab-Geometria `main` 5f07b12 (PR #234) · ia-db 4.0 · 2026-11-01.
> **No cubre:** derivación de contraseñas, acceso firmado y sesión (→ 08); imagen de contenedor y volúmenes (→ 12); ADR 06002/06003/06004/06007 como decisiones (→ 15); reglas RN/INV/RC (→ 05).

---

## 1. Mapa de archivos

| Ruta (relativa al repo) | Qué es |
| --- | --- |
| `src/GeometriaFactory.Infrastructure/Persistence/GeometriaFactoryDbContext.cs` | Contexto EF Core; uno por operación; `DbSet` `Accounts` y `Works`; mapeo por ensamblado (`ApplyConfigurationsFromAssembly`) |
| `src/GeometriaFactory.Infrastructure/Persistence/Configurations/` | 5 `IEntityTypeConfiguration`: `Account`, `Work`, `Piece`, `Component`, `Observation` |
| `src/GeometriaFactory.Infrastructure/Persistence/EfCoreAccountRepository.cs` | Adaptador único de `IAccountRepository` (CU-06005, `Infrastructure BT-09`) |
| `src/GeometriaFactory.Infrastructure/Persistence/EfCoreWorkRepository.cs` | Adaptador único de `IWorkRepository` (CU-06003/CU-06004, `BT-10`) |
| `src/GeometriaFactory.Infrastructure/Persistence/StorePreparation.cs` | Preparación al arrancar (CU-06010): migra, fija WAL, detiene el arranque ante linaje ajeno |
| `src/GeometriaFactory.Infrastructure/Persistence/StoreHealth.cs` | Salud viva del almacén (esquema + escritura real deshecha) |
| `src/GeometriaFactory.Infrastructure/Persistence/Migrations/` | 5 migraciones + `.Designer.cs` + `GeometriaFactoryDbContextModelSnapshot.cs` + `README.md` |
| `src/GeometriaFactory.Api/Composition/CompositionRoot.cs` | Registro: `UseSqlite(cadena;Pooling=False)`, `StorePreparation` y `StoreHealth` como scoped (composición → 04) |
| `src/GeometriaFactory.Api/Composition/TwoPhaseStartup.cs` | Invoca `StorePreparation` antes de abrir la escucha (arranque en dos fases → 04) |
| `scripts/store-path.sh`, `migrate.sh`, `reset-db.sh`, `respaldo-almacen.sh`, `restaurar-almacen.sh` | Guiones del almacén (§8) |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Modelo-Datos-Logico.md` | Modelo lógico: 5 tablas, 6 índices, 15 restricciones, TR-01 |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Operaciones-Internas/CU-06003-*.md`, `CU-06004-*.md`, `CU-06005-*.md`, `CU-06010-*.md` | Contratos internos de persistencia |

## 2. DbContext y configuraciones (EF Core 10, SQLite)

| Entidad | Tabla | Clave | Columnas notables | Índices / relaciones | Fuente |
| --- | --- | --- | --- | --- | --- |
| `Account` | `Account` | `Id` | `Email`, `NormalizedEmail`, `FirstName`, `LastName`, `Role` y `Status` como texto (`HasConversion<string>`), `PasswordHash` (nulable), `MustChangePassword` (default `false`), `CreatedAt`, `CredentialChangedAt` (nulable) | `UX_Account_NormalizedEmail` único; `UX_Account_SingleAdministrator` único parcial con filtro `"Role" = 'Administrator'` | `Configurations/AccountConfiguration.cs` |
| `Work` | `Work` | `Id` | `OwnerId`, `Name`, `DeclaredDate`, `Description`, `OriginalJson`, `Status` (texto), `AdministratorComment`, `RootFigureCount`, `CreatedAt`/`UpdatedAt` con conversor `SortableMoment` (DateTimeOffset→texto ordenable) | `IX_Work_Owner_Status` (OwnerId, Status); FK a `Account` con `Cascade`; `HasMany` Pieces y Observations con `Cascade`, navegación por campo | `Configurations/WorkConfiguration.cs` |
| `Piece` | `Pieza` | `Id` sombra (Guid) | `WorkId` sombra, `Position`, `Type` (texto), `DeclaredLength/Width/Radius`, `DeclaredArea`/`DerivedArea`, `DeclaredVolume`/`DerivedVolume` | único (`WorkId`, `Position`); `HasMany` Components `Cascade` | `Configurations/PieceConfiguration.cs` |
| `Component` | `Componente` | `Id` sombra | `PieceId` sombra, `Position`, `Role`, `Type` (texto), `DeclaredLength/Width/Radius/Area` | `IX_Componente_PieceId` | `Configurations/ComponentConfiguration.cs` |
| `Observation` | `Observacion` | `Id` sombra | `WorkId` sombra, `Kind` (texto), `PiecePosition` (nulable), `Field`, `DeclaredValue`, `DerivedValue` | `IX_Observacion_WorkId`; sin FK a Pieza | `Configurations/ObservationConfiguration.cs` |

Notas del código: los enumerados se guardan **por nombre**, no por posición; el contexto sólo expone `Accounts` y `Works` (Pieza/Componente/Observación se alcanzan por navegación). Nombres de tabla mixtos inglés/castellano: ver §9.

## 3. Repositorios

| Adaptador | Miembros | Reglas que implementa | Fuente |
| --- | --- | --- | --- |
| `EfCoreAccountRepository` | `FindByNormalizedEmailAsync`, `FindByIdAsync`, `AdministratorExistsAsync`, `EmailIsRegisteredAsync`, `AddAsync`, `UpdateAsync`, `ListAsync` (orden por correo normalizado — decisión declarada de la etapa `d`), `RemoveAsync` | Una unidad de trabajo por operación (`Infrastructure ADR-02`); sin repositorio genérico (`ADR-01`); `RemoveAsync` retira **explícitamente** los trabajos de los cuatro estados y la cuenta en una sola confirmación (RN-07, no depende de `PRAGMA foreign_keys`) | `EfCoreAccountRepository.cs` |
| `EfCoreWorkRepository` | `FindByIdAsync`, `AddAsync`, `UpdateAsync`, `RemoveAsync`, `ListOwnedByAsync`, `ListInAdministratorScopeAsync` (devuelven `WorkListEntry`, sin componentes ni texto original) | Recorte declarado trasladado a la consulta; borrado físico | `EfCoreWorkRepository.cs` |

## 4. Modelo de datos lógico (diseño)

Fuente: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Modelo-Datos-Logico.md` (v1.1, 2026-08-29).

| Sección | Contenido |
| --- | --- |
| §2 Las cinco tablas | Cuenta, Trabajo, Pieza, Componente, Observación, con tipo físico, nulabilidad y default por columna |
| §3 Índices | IX-01 correo normalizado único; IX-02 papel único parcial (Administrador); IX-03 Trabajo(Dueño, Estado); IX-04 Pieza(Trabajo, Posición) único; IX-05 Componente(Pieza); IX-06 Observación(Trabajo) |
| §4 Restricciones | RE-01..RE-15: claves, conjuntos cerrados (2 papeles, 3 estados de cuenta, 4 de trabajo, 2 especies), cuatro arrastres del retiro (RE-06, 09, 11, 12), texto original no reemplazable (RE-08), sin borrado lógico ni partición (RE-15) |
| §5 TR-01 | Transformación inicial: se aplica al arrancar, inmutable una vez fusionada, falla → arranque detenido (`ADR-06007`) |
| §6 | Sin partición por instancia |
| §7 Trazabilidad | Tabla → entidad conceptual → CU-06001..06005, CU-06010 → RC; ADR 06002/06003/06004/06007 |
| §8 Puntos abiertos | Nombres definitivos; momento de modificación de cuenta; frecuencia del respaldo («a definir por el docente»; lo cierran Product Owner y `09-Devops`; la etiqueta PD-04 es de `scripts/respaldo-almacen.sh`); forma de la credencial derivada |

Correspondencia diseño ↔ código de índices: IX-01 = `UX_Account_NormalizedEmail`; IX-02 = `UX_Account_SingleAdministrator`; IX-03 = `IX_Work_Owner_Status`; IX-04 = `IX_Pieza_WorkId_Position`; IX-05 = `IX_Componente_PieceId`; IX-06 = `IX_Observacion_WorkId`.

## 5. Migraciones (linaje)

Directorio: `src/GeometriaFactory.Infrastructure/Persistence/Migrations/`.

| # | Migración | Fecha | Qué hace |
| --- | --- | --- | --- |
| 1 | `20260815010950_Account` | 2026-08-15 | Crea `Account` y sus dos índices únicos |
| 2 | `20260815222049_Work` | 2026-08-15 | Crea `Work`, FK a `Account`, `IX_Work_Owner_Status` |
| 3 | `20260816153319_Interpretation` | 2026-08-16 | Crea `Pieza`, `Componente`, `Observacion` con FKs e índices |
| 4 | `20260816230145_PieceOwnDimensions` | 2026-08-16 | Agrega `DeclaredLength/Width/Radius` a `Pieza` |
| 5 | `20260914112430_CredentialChangedAt` | 2026-09-14 | Agrega `CredentialChangedAt` (DateTimeOffset nulable) a `Account` (uso → 08) |
| — | `GeometriaFactoryDbContextModelSnapshot.cs` | — | Instantánea del modelo vigente |

**Regla:** una transformación ya fusionada no se edita; si hay que corregir, entra una nueva (`Migrations/README.md`; intake §17.3.P.7; `Infrastructure ADR-07`; `Modelo-Datos-Logico.md` §5). La etapa `a` no generó ninguna (README). Se aplican solas al arrancar; no hay paso manual de aplicación.
Prueba de la última: `tests/GeometriaFactory.Integration.Tests/CredentialChangedAtMigrationTests.cs` (baterías → 11).

## 6. Preparación y salud del almacén

### 6.1 CU-06010 — Preparar el almacén al arrancar

| Paso | Código (`StorePreparation.PrepareAsync`) | Contrato (`CU-06010-Preparar-El-Almacen-Al-Arrancar.md`) |
| --- | --- | --- |
| Ruta | No la resuelve: la lee `CompositionRoot.cs` con `GetConnectionString("Store")` y detiene el arranque si falta | §3: de configuración; en producción a volumen, nunca dentro de la imagen |
| Migrar | `Database.MigrateAsync` | §4.3: todas las pendientes, en orden |
| Diario | `PRAGMA journal_mode=WAL;` y **se lee la respuesta**; si no es `wal`, lanza | §4.4: modo WAL (precondición del respaldo) |
| Linaje ajeno | Un único `catch` (toda excepción salvo cancelación) la envuelve: «su linaje no corresponde…»; traza sólo como `InnerException` (RA-03) | §6 `MIGRATION_NOT_APPLICABLE`: detiene el arranque, no aproxima ni descarta |
| Pendientes tras migrar | `GetPendingMigrationsAsync` ≠ ∅ → lanza | QG-11: cero peticiones con preparación incompleta |
| Ruta no escribible | Cae en el mismo `catch` y sale con el mismo mensaje de linaje (no distingue este caso; ver §9) | §6 `STORE_PATH_UNAVAILABLE`: detiene, sin ruta alternativa |
| Resultado | `IsPrepared = true` (sin ruta); la salud publica `Ready = StoreIsPrepared && IsUsableAsync` (`HealthEndpoint.cs`), no sólo este dato | §7: archivo en ruta, esquema al día, WAL; primer arranque vacío |

Pruebas: `StoreJournalModeTests.cs` (en `tests/GeometriaFactory.Integration.Tests/`).

### 6.2 Salud viva (`StoreHealth.IsUsableAsync`)

| Comprobación | Por qué | Fuente |
| --- | --- | --- |
| `SELECT COUNT(*) FROM "__EFMigrationsHistory"` > 0 | Abrir no alcanza: SQLite crea el archivo al abrirlo | `StoreHealth.cs` |
| `BEGIN IMMEDIATE; CREATE TABLE "__gf_salud_temporal"(x); ROLLBACK;` | Detecta sólo lectura; `BEGIN IMMEDIATE; ROLLBACK;` a secas no lo detectaba (medido) | `StoreHealth.cs` |
| `BUSY`/`LOCKED` (5/6) = sano | Escritor único (`ADR-06002`): otro escribiendo prueba que se puede escribir | `StoreHealth.cs` |
| No detecta disco lleno | Declarado, no supuesto | `StoreHealth.cs` |
| `Pooling=False` en la cadena | Sin agrupamiento la salud no miente sobre un archivo borrado | `src/GeometriaFactory.Api/Composition/CompositionRoot.cs` |

Origen: `StoreHealth`, hallazgo `MI-09` de la mesa del 2026-08-31; `Pooling=False`, hallazgo `R-2` de la mesa del 2026-09-01 (con agrupamiento, /salud seguía en 200 con el almacén borrado) (mesas → 16). Consumidor: `src/GeometriaFactory.Api/Endpoints/HealthEndpoint.cs` (ruta → 06). Pruebas: `StoreHealthTests.cs`, `HealthEndpointStoreTests.cs`.

## 7. Operaciones internas de guardado, recuperación y borrado

| CU | Qué garantiza | Condiciones (§6) | Fuente |
| --- | --- | --- | --- |
| CU-06003 Guardar y recuperar los trabajos | Una unidad de trabajo; listado con recorte declarado sin componentes ni texto original; texto original escrito una sola vez (RN-06008) | `QUERY_WITHOUT_DECLARED_SCOPE`, `WRITE_REWRITES_ORIGINAL_JSON`, `CONCURRENT_WRITE_REJECTED` (no reintenta), `STORE_UNAVAILABLE` | `Operaciones-Internas/CU-06003-Guardar-Y-Recuperar-Los-Trabajos.md` |
| CU-06004 Borrado físico y arrastre de la baja | Retiro físico de trabajo con piezas/componentes/observaciones; baja de cuenta arrastra todos sus trabajos en los cuatro estados; todo o nada | `PARTIAL_DELETION_NOT_ALLOWED`, `STORE_UNAVAILABLE` | `Operaciones-Internas/CU-06004-Ejecutar-El-Borrado-Fisico-Y-El-Arrastre-De-La-Baja.md` |
| CU-06005 Guardar y recuperar las cuentas | Recuperación por correo/id, preguntas de existencia, materialización con marca de cambio pendiente; la credencial llega ya derivada | `EMAIL_ALREADY_REGISTERED`, `ADMINISTRATOR_UNIQUENESS_VIOLATED`, `STORE_UNAVAILABLE` | `Operaciones-Internas/CU-06005-Guardar-Y-Recuperar-Las-Cuentas-De-La-Comision.md` |

(Directorio común: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/`. Traducción de estos motivos a HTTP → 06.)

## 8. Ruta del almacén y guiones

| Guion | Función | Puntos clave | Fuente |
| --- | --- | --- | --- |
| `store-path.sh` | Se **sourcea**; `gf_resolve_store` deja `GF_STORE_FILE` y exporta `ConnectionStrings__Store` | Precedencia: `GEOMETRIAFACTORY_STORE_FILE` → `ConnectionStrings__Store` → `${XDG_DATA_HOME:-$HOME/.local/share}/geometria-factory/geometriafactory.db`. Sacó el almacén del árbol (antes `src/GeometriaFactory.Api/geometriafactory.db`) tras la pérdida del 2026-08-15 | `scripts/store-path.sh` |
| `migrate.sh <Nombre>` | **Genera** (no aplica) una migración con `dotnet ef migrations add` (herramienta local, `dotnet tool restore`) | `--configuration ${GF_CONFIGURATION:-Debug}` declarado; necesita la cadena (sourcea `store-path.sh`); `Program.cs` saltea la fase 1 con `EF.IsDesignTime`; marcado `[PROPUESTA SIN BASE DECLARADA]` | `scripts/migrate.sh` |
| `reset-db.sh [--assume-yes]` | Sólo borra (`rm -f`) el `.db`, `-shm` y `-wal` tras pedir que se escriba `borrar` (salvo `--assume-yes`); el esquema lo aplica el próximo arranque, como avisa el guion | Pregunta mostrando archivo y recuento por tabla (`STORE_INVENTORY`: `Account`, `Work`); `?` si no puede contar; la bandera declarada, no variable de entorno | `scripts/reset-db.sh` |
| `respaldo-almacen.sh [--desde-contenedor <servicio>] <dir>` | Copia en caliente | `VACUUM INTO` (no `cp`), sin detener el servicio (WAL), rechaza destino = dir del almacén, `PRAGMA integrity_check` sobre la copia (si falla la borra, sale 1); nombre `geometriafactory-<sello UTC>.db`; no fija frecuencia ni retención (PD-04 del PO). Origen: `MI-01`, mesa 2026-08-31 | `scripts/respaldo-almacen.sh` |
| `restaurar-almacen.sh [--desde-contenedor <servicio>] <copia>` | Restitución | Exige servicio detenido (comprueba `-wal` con contenido); verifica la copia antes de instalar; **aparta** el almacén anterior (y `-wal`/`-shm`) con sufijo `.apartado-<sello>`; modo contenedor detiene y relanza (agregado tras mesa 2026-09-01). Salidas 0/1/2 | `scripts/restaurar-almacen.sh` |

Norma de diseño de respaldo y restitución: `Entornos-Deploy.md` §11.1 (WAL como condición del respaldo, `VACUUM INTO`, restitución con servicio detenido, el respaldo como único mecanismo para volver atrás sobre datos).

Variables de configuración por entorno, imagen con `sqlite3` y volúmenes → 12.

## 9. Divergencias y no verificable (detalle en 19)

| Observación | Fuente A | Fuente B |
| --- | --- | --- |
| El alcance del índice habla de «seis migraciones»; `git ls-files` muestra **cinco** (Account, Work, Interpretation, PieceOwnDimensions, CredentialChangedAt) | Mapa de índices de la 4.0 | `src/.../Persistence/Migrations/` |
| El diseño declara una transformación inicial **TR-01** que crea las 5 tablas; el código las crea en 3 migraciones escalonadas por etapa | `Modelo-Datos-Logico.md` §5 | `Migrations/` + `README.md` (etapa `a` no genera ninguna) |
| Diseño: «Dimensiones» como columna de texto no normalizada; código: columnas reales `DeclaredLength/Width/Radius` | `Modelo-Datos-Logico.md` §2.3–2.4 | Pieza: `20260816230145_PieceOwnDimensions.cs`, `PieceConfiguration.cs`; Componente: `20260816153319_Interpretation.cs`, `ComponentConfiguration.cs` (que lo declara «apartamiento declarado» de §2.4) |
| Diseño: Observación «Posición de la figura» no nulable; código: `PiecePosition` sin `IsRequired` | `Modelo-Datos-Logico.md` §2.5 | `ObservationConfiguration.cs` (lo declara apartamiento de §2.5, etapa `f`) |
| Diseño no incluye `CredentialChangedAt` en Cuenta (v1.1 anterior a 2026-09-14) | `Modelo-Datos-Logico.md` §2.1 | `20260914112430_CredentialChangedAt.cs` |
| Comentario del `DbContext` aún dice que Piece/Component/Observation «siguen sin mapeo» (etapa `e`); hoy están mapeadas | `GeometriaFactoryDbContext.cs` remarks | `Configurations/*.cs` |
| Comentario de `StorePreparation.IsPrepared` aún dice que es «el único dato» que publica la salud; hoy `Ready` también evalúa `IsUsableAsync` | `StorePreparation.cs` | `HealthEndpoint.cs` |
| Contrato distingue `STORE_PATH_UNAVAILABLE` de `MIGRATION_NOT_APPLICABLE` (§6, CA-05); el código envuelve toda falla no cancelada (ruta no escribible, WAL) en un único mensaje de linaje | `CU-06010-Preparar-El-Almacen-Al-Arrancar.md` §6 | `StorePreparation.cs` (`catch`) |
| Diseño declara en Trabajo «Momento del comentario» y «Autor del comentario» (FK a Cuenta); ninguna migración las crea y el remarks dice que «entran con» la etapa `h`, y siguen sin entrar en 5f07b12 | `Modelo-Datos-Logico.md` §2.2 | `WorkConfiguration.cs`, `20260815222049_Work.cs` y posteriores |
| `Work.CreatedAt`/`UpdatedAt` pasan por el conversor `SortableMoment`; `Account.CreatedAt` no | `WorkConfiguration.cs` | `AccountConfiguration.cs` |
| Tablas `Account`/`Work` en inglés y `Pieza`/`Componente`/`Observacion` en castellano; §8 del diseño deja los nombres abiertos | `Configurations/*.cs` | `Modelo-Datos-Logico.md` §8 |
| RE-10 (posición < cantidad de figuras) y RE-14 (par declarado/derivado) no aparecen como restricciones del esquema; **no verificado** si se sostienen sólo en dominio | `Modelo-Datos-Logico.md` §4 | `Migrations/*.cs` (sin CHECK) |
