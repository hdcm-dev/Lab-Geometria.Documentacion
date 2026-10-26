# 06 · Persistencia y seguridad — dónde vive el dato y cómo se firma el acceso

> **Propósito.** El almacén, su esquema y su linaje, cómo se prepara al arrancar y cómo se
> respalda; los mecanismos de credencial y de acceso con sus parámetros exactos; y las defensas
> que entraron con las mesas del 2026-09-14 y 2026-09-15: revocación por cambio de credencial,
> admisión en cada petición, cuota de intentos fallidos, autorregistro por dominio, origen real
> detrás del front, cabeceras de seguridad, imágenes sin root y datos personales.
> **Fuente primaria.** `src/GeometriaFactory.Infrastructure/Persistence/` y `/Security/`,
> `src/GeometriaFactory.Api/Composition/` (`CompositionRoot.cs`, `CredentialAttemptThrottle.cs`,
> `ContractRateLimiting.cs`, `SecurityHeaders.cs`), `src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs`,
> `src/GeometriaFactory.Web/Program.cs` y `/Integration/`, `scripts/store-path.sh`,
> `scripts/respaldo-almacen.sh`, `scripts/restaurar-almacen.sh`, `deploy/Dockerfile`,
> `deploy/Dockerfile.web`, `SDD/Docs/Audit/Mesa-2026-09-14.md`, `SDD/Docs/Audit/Mesa-2026-09-15.md`.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. El almacén

**EF Core 10.0.11 sobre SQLite, un solo archivo.** Un curso, una instancia, un administrador.

| Aspecto | Valor | Fuente |
| --- | --- | --- |
| Paquetes | `Microsoft.EntityFrameworkCore.Sqlite` 10.0.11 y `.Design` 10.0.11 | `GeometriaFactory.Infrastructure.csproj` |
| Contexto | `GeometriaFactoryDbContext`, **por petición, nunca compartido** | `CompositionRoot.cs` (`AddDbContext`) |
| Configuraciones | `AccountConfiguration`, `WorkConfiguration`, `PieceConfiguration`, `ComponentConfiguration`, `ObservationConfiguration` | `Persistence/Configurations/` |
| Repositorios | `EfCoreAccountRepository`, `EfCoreWorkRepository` — **adaptadores por puerto, sin repositorio genérico** | `ADR-06001` |
| Modo de diario | **WAL**, fijado y **leído de vuelta** en la preparación | `StorePreparation.cs` |
| Agrupamiento | **`Pooling=False`** agregado a la cadena si no lo trae | `CompositionRoot.cs` |
| Ruta | `ConnectionStrings__Store` (nombre `Store`, `CompositionRoot.StoreConnectionName`), **obligatoria** | `CompositionRoot.cs` |

**La ruta no se declara en `appsettings.json`, y es deliberado** (el archivo lo dice en la llave
`_ConnectionStrings_Store`). Está versionado y se hornea en la imagen: una ruta absoluta sería la
de una máquina, y la relativa que hubo hasta la etapa `d` —`Data Source=geometriafactory.db`—
creaba la base **adentro del árbol del repositorio**. En desarrollo la calcula
`scripts/store-path.sh` (se *sourcea*; `gf_resolve_store` deja `GF_STORE_FILE` y exporta
`ConnectionStrings__Store`); en el despliegue la fija el `ENV` de `deploy/Dockerfile`:
`Data Source=/datos/geometriafactory.db`, sobre `VOLUME ["/datos"]`. **Sin ella el servicio no
arranca**: `AddCompositionRoot` lanza con un mensaje que nombra el guion y el `Dockerfile`.

**`Pooling=False` no es afinación: es lo que hace que la salud no mienta.** Con agrupamiento,
SQLite conserva el descriptor sobre el inodo y una base borrada se sigue leyendo; medido sobre el
binario, `/salud` contestaba `200 {"ready":true}` a los 2, 7, 12 y 17 s con el almacén borrado
(`R-2` de la mesa del 2026-09-01). El costo se acepta: p99 de 12,3 ms a mil trabajos contra un
umbral de 500 (medición del 2026-08-31, citada en `CompositionRoot.cs`).

**El front no tiene almacén**: `deploy/Dockerfile.web` no declara cadena de conexión y dice que
lo único que escribe son sus claves de protección de datos (§5.5).

### 1.1 El esquema real

Cinco tablas, con **nombres mixtos** —dos en inglés y tres en castellano—, tal como las fija cada
configuración y las registra `Migrations/GeometriaFactoryDbContextModelSnapshot.cs`:

| Tabla | Configuración | Índices (instantánea del modelo) |
| --- | --- | --- |
| `Account` | `AccountConfiguration` | `UX_Account_NormalizedEmail` (único) · `UX_Account_SingleAdministrator` (único parcial, filtro `"Role" = 'Administrator'`) |
| `Work` | `WorkConfiguration` | `IX_Work_Owner_Status` (`OwnerId`, `Status`) |
| `Pieza` | `PieceConfiguration` | único sobre (`WorkId`, `Position`) |
| `Componente` | `ComponentConfiguration` | `PieceId` |
| `Observacion` | `ObservationConfiguration` | `WorkId` |

**Seis índices**, que cuadran uno a uno con `IX-01`…`IX-06` de
`SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Modelo-Datos-Logico.md` §3.
Los dos únicos de `Account` son **la segunda defensa de un invariante**: `INV-01`/`RN-02` (correo) e
`INV-05`/`RN-01` (un solo administrador, aunque dos peticiones simultáneas pasen la comprobación
previa de aplicación). El borrado es **en cascada** desde `Account` hacia sus `Work` (FK `OwnerId`,
`WorkConfiguration.cs` línea 119), desde `Work` hacia `Pieza` y `Observacion` (FK `WorkId`, líneas
127 y 134) y desde `Pieza` hacia `Componente` (FK `PieceId`, `PieceConfiguration.cs` línea 69).

**`Account` tiene 11 columnas** en la instantánea: `Id`, `Email`, `NormalizedEmail`, `FirstName`,
`LastName`, `Role`, `Status`, `PasswordHash`, `MustChangePassword`, `CreatedAt` y
**`CredentialChangedAt`** (nueva, §5.4). Los dos conjuntos cerrados (`Role`, `Status`) se guardan
**como texto y por su nombre**, nunca por posición; `PasswordHash` es nula mientras la cuenta está
`Pending`; `MustChangePassword` vale falso por omisión; los momentos van en UTC como texto
ordenable (`AccountConfiguration.cs`, `<remarks>`).

### 1.2 Las cinco transformaciones de esquema

`Persistence/Migrations/` (12 archivos versionados: cinco transformaciones, sus cinco
`.Designer.cs`, la instantánea y un `README.md`), con **linaje inmutable** (`ADR-06007`; el README:
«una transformación ya fusionada no se edita»):

| Migración | Qué agregó |
| --- | --- |
| `20260815010950_Account` | La cuenta |
| `20260815222049_Work` | El trabajo |
| `20260816153319_Interpretation` | Piezas, componentes y observaciones |
| `20260816230145_PieceOwnDimensions` | Las dimensiones propias de la pieza |
| `20260914112430_CredentialChangedAt` | **Nueva.** Columna `CredentialChangedAt` (`TEXT`, nula) en `Account`; `Down` la quita |

**La quinta es la primera que se aplica sobre un almacén con datos**: el laboratorio desplegado
existe desde el 2026-09-06 (comentario de `tests/GeometriaFactory.Integration.Tests/CredentialChangedAtMigrationTests.cs`
línea 18; la migración la introdujo el commit `7c94988`). `CredentialChangedAtMigrationTests` (1 prueba) lleva
el almacén hasta la transformación anterior, escribe una cuenta con SQL directo, aplica el resto y
comprueba que la fila sigue intacta y la columna nueva quedó nula — es `R-10` de la mesa del
2026-09-14.

Se **aplican al arrancar**, no por un paso aparte. `scripts/migrate.sh` **genera** una
transformación y **no la aplica**; para eso `Program.cs` guarda la fase 1 con `EF.IsDesignTime`.

### 1.3 Identidad del correo y escritura

| Decisión | Qué fija |
| --- | --- |
| `ADR-06003` | **Un único componente normaliza correos** (`Domain/Values/EmailIdentity.Normalize`), y el índice único sobre `NormalizedEmail` lo sostiene. La cuota por cuenta (§7) usa la misma función |
| `ADR-06002` | **Un archivo, escritor único, una unidad de trabajo por operación**. El alcance lo fija aplicación (`ADR-04005`) y el mecanismo esta capa |

## 2. El arranque en dos fases y la salud

`Composition/TwoPhaseStartup.cs`, `Persistence/StorePreparation.cs` y `Program.cs` (`ADR-00007`).

1. **Preparación** (`StorePreparation.PrepareAsync`): `MigrateAsync`, después
   `PRAGMA journal_mode=WAL;` **leyendo lo que el motor contesta** —sobre memoria o sobre un
   sistema de archivos sin mapeo compartido SQLite se queda en `delete` sin fallar—, y por último
   comprueba que no queden transformaciones pendientes. Va **una vez y no por conexión**: el PRAGMA
   es persistente.
2. **Servicio**: recién entonces se abre la superficie HTTP.

| Falla en la preparación | Qué hace |
| --- | --- |
| El motor no queda en `wal` | Lanza: «la fuente lo declara WAL y el procedimiento de respaldo depende de él» |
| Cualquier excepción del proveedor | Se envuelve con la **causa** («su linaje no corresponde al de este servicio»), no el síntoma; la traza queda en `InnerException` y en el registro |
| Transformaciones pendientes al terminar | Lanza; el arranque se detiene |
| En `Program.cs` | Se atrapa, se registra, se imprime el mensaje y **sale con código 78** (`EX_CONFIG` de `sysexits`), para que un orquestador no reintente indefinidamente |

**`StoreHealth` responde si el almacén *sigue* estando** (hallazgo `MI-09`, mesa del 2026-08-31).
Dos comprobaciones, las dos necesarias: contar filas de `__EFMigrationsHistory` (abrir no alcanza:
SQLite crea el archivo al abrirlo) y forzar una escritura real deshecha
(`BEGIN IMMEDIATE; CREATE TABLE "__gf_salud_temporal" (x); ROLLBACK;`) — `BEGIN IMMEDIATE; ROLLBACK;`
a secas pasa sobre una base de sólo lectura, y lo destapó `UnAlmacenDeSoloLecturaNoEstaEnCondiciones`.
`BUSY`/`LOCKED` (códigos 5 y 6) cuentan como sano: hay alguien escribiendo. **No detecta disco
lleno**, y lo declara. No dice por qué falla (`RA-03`): el motivo va al registro.
`StoreHealthTests` tiene 4 pruebas. La ruta `/salud` y su contrato están en
[04_Superficie-HTTP-Y-Contratos.md](04_Superficie-HTTP-Y-Contratos.md).

**WAL deja tres archivos y no uno** (`EVE-00003`,
`SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md`): copiar sólo el `.db` no copia la
base. El `.gitignore` excluye `*.sqlite`, `*.sqlite3`, `*.db-shm`, `*.db-wal` y `geometriafactory*.db`.

## 3. Respaldo y restauración

| Guion | Qué hace | Propiedades que no negocia |
| --- | --- | --- |
| `scripts/respaldo-almacen.sh` | **La copia que el producto declaraba y no tenía** (`MI-01`, mesa del 2026-08-31) | `VACUUM INTO` y no `cp`; **no detiene el servicio** (WAL); **se niega** si el destino es el directorio del almacén; `PRAGMA integrity_check` **sobre la copia**, y si no da `ok` la borra y sale 1 |
| `scripts/restaurar-almacen.sh` | La otra mitad, «la que se hace con miedo» | Exige el servicio detenido **y lo comprueba por el archivo** (`-wal` con contenido); verifica la copia **antes** de instalarla; **no borra el almacén anterior: lo aparta con sello** |
| `scripts/reset-db.sh` | Deja el almacén en su estado de primer arranque | Resuelve la ruta por `store-path.sh`, igual que `run-api.sh` |

Los dos primeros tienen forma local (`<destino>` / `<archivo-de-copia>`) y forma
`--desde-contenedor <servicio> …`, que corre `sqlite3` **dentro** del contenedor —por eso la imagen
del servicio lo instala— y se ejecuta desde el directorio de la composición de despliegue, que este
repositorio no tiene. La restauración en contenedor **detiene y vuelve a levantar** el servicio. Los
códigos de salida del respaldo: 0 copia tomada y verificada, 1 no se tomó o no verificó, 2 falta con
qué. **Ningún guion fija frecuencia, destino ni retención**: es `PD-04`, del Product Owner.

**La política sí quedó escrita, en el intake.** `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md`
5.1 §10 (línea 339): los respaldos se toman **antes de cada despliegue y al cierre de cada
cuatrimestre** y se conservan **como máximo un cuatrimestre** (decisión `D-4` de la mesa del
2026-09-15; el PO puede cambiar los dos números). Y §11 `RN-B8` (línea 352) declara que el
mecanismo del respaldo del SQLite desplegado **lo implementa el PO en su despliegue**, fuera de este
repositorio. La constancia de restauración sobre copia (`R-09`) figura como hecha en
`Mesa-2026-09-14.md` §6.1, con remisión a `Guia-Publicacion-Image-Docker.md` §2.2.

**Toda rutina destructiva usa archivo propio** (`AGENTS.md` línea 63): el 2026-08-15 una corrida
de guiones se llevó la cuenta de administrador del PO. La línea 64 agrega que los contenedores
`lab-geometria-web` y `lab-geometria-api` son el despliegue real: ni `exec`, ni reinicio, ni
lectura de sus volúmenes.

## 4. Configuración sensible y sus guardias de arranque

| Llave | Obligatoria | Si falta o es inválida | Fuente |
| --- | --- | --- | --- |
| `ConnectionStrings__Store` | Sí | El servicio no arranca (lanza en `AddCompositionRoot`) | `CompositionRoot.cs` |
| `AccessToken__SigningKey` | Sí, **≥ 32 bytes UTF-8** | El servicio no arranca: dos guardias, ausente y corta | `CompositionRoot.cs`; `SigningKeyStartupTests` (4 pruebas) |
| `AccessToken__LifetimeInMinutes`, `__Issuer`, `__Audience` | No | 480 / `GeometriaFactory` / `GeometriaFactory` | `SigningOptions.cs` |
| `PasswordDerivation__Iterations` | No | 210.000 | `CompositionRoot.cs` línea 183 |
| `RateLimiting__*` | No | Valores de `appsettings.json` (§7) | `ContractRateLimiting.cs` |
| `ForwardedHeaders__KnownNetworks__N` | No | Sin redes de confianza más allá del bucle local; una red no CIDR **detiene el arranque** | `ContractRateLimiting.cs`; `Web/Program.cs` |
| `Registration__AdmittedEmailDomains__N` | No | Vacío: el autorregistro admite cualquier dominio (§6) | `appsettings.json` llave `_Registration` |
| `DataProtection__KeysDirectory` (front) | No | `App_Data/claves` bajo la raíz de contenido | `Web/Program.cs` |

**La guardia de la clave de firma detiene el arranque**, y su fundamento es el despliegue del
2026-08-15: el contenedor se levantó sin la variable, respondió salud y el defecto apareció con una
persona intentando entrar. El mensaje **nombra la llave y nunca el valor** (`Infrastructure ADR-04`
§7). Lanza dentro de `AddCompositionRoot`, antes de construir la aplicación, de modo que **no pasa
por el `try` que devuelve 78** (§2); el código de salida en ese caso no se midió.
`deploy/compose.yaml` no declara la clave a propósito: es un secreto del host y vive en el `.env`
del proyecto de despliegue.

## 5. Credenciales y acceso

### 5.1 Derivación de contraseña — `PasswordDerivation`

`ADR-06004`, **derivación anclada con parámetros versionados**:

| Parámetro | Valor |
| --- | --- |
| Función | **PBKDF2-SHA256** (constante pública `AnchoredFunction`), vía `Rfc2898DeriveBytes`: la plataforma la provee y Argon2 exigía un paquete de terceros |
| Iteraciones | **210.000** (`AnchoredIterations`); configurable por `PasswordDerivation:Iterations` porque subirla no invalida credenciales guardadas |
| Sal | 16 bytes |
| Clave derivada | 32 bytes |
| Forma guardada | `PBKDF2-SHA256$<iteraciones>$<sal base64>$<derivado base64>`; la verificación lee los parámetros **del valor**, no de la configuración |

La cadena vacía **no se deriva**. Nada de lo que pasa por la clase se registra, y por eso no recibe
registrador. Un valor con otra etiqueta es ilegible, no «no coincide»
(`InfrastructureConditionCode.UnreadablePasswordHash`).

### 5.2 Contraseña provisoria — `ProvisionalPasswordFactory`

`ADR-06005`: **no adivinable y sin repetirse**. Longitud fija **12**; alfabeto de **57** caracteres
(`ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789`: sin `0`, `O`, `1`, `l`, `I` ni
puntuación); elección **uniforme sin sesgo de módulo**. Si la fuente de aleatoriedad no responde
devuelve nulo —nunca un valor parcial— y la respuesta es `503`
(`RandomnessSourceUnavailable`, `ContractTranslation.cs`). Se muestra al administrador una vez y deja
la marca de cambio pendiente (`INV-09`). `ProvisionalPasswordTests` la cubre.

### 5.3 Acceso firmado — `AccessTokenIssuer` + `SigningOptions`

| Aspecto | Valor |
| --- | --- |
| Sección | `AccessToken` (`SigningOptions.SectionName`) |
| Algoritmo | **HMAC-SHA256** con clave simétrica (`SecurityAlgorithms.HmacSha256`) |
| Clave | `SigningKey`, mínimo **32 bytes** (`MinimumSigningKeySizeInBytes`) |
| Emisor y audiencia | `GeometriaFactory` por omisión; se validan los dos |
| Vigencia | `LifetimeInMinutes`, **480** (ocho horas); menor que 1 no emite |
| Momentos del descriptor | `IssuedAt` (`iat`), `NotBefore` y `Expires`, todos desde el `issuedAt` que recibe |
| Reclamos propios | `sub` (identificador de cuenta), `email`, y el papel en `ClaimTypes.Role` |
| Validación | `ClockSkew` 30 s; `RoleClaimType` = papel; `NameClaimType` = `email`; `MapInboundClaims = false` |
| Bibliotecas | `Microsoft.IdentityModel.JsonWebTokens` 8.22.0; el host valida con `Microsoft.AspNetCore.Authentication.JwtBearer` 10.0.11 |

**No hay acceso de refresco** (`ADR-00003` §2 punto 5): la renovación es por reingreso. La única
emisión fuera del canje es la del cambio de contraseña con sesión (§5.4), que exige verificar la
contraseña vigente. **No existe identidad de aplicación**: la API autentica personas, no clientes
(`ADR-00009`, decisión del PO del 2026-09-12).

### 5.4 La guardia transversal: admisión, marca y revocación

`ADR-00003` 1.1, **credencial firmada, papel por punto y guardia transversal**. La guardia es
`PendingPasswordChangeGuard`, un **intermediario** y no un filtro por punto («el olvido no se
nota»), con **una sola exención** por nombre de punto: `ChangeOwnPassword` (`A-05`). En
`Program.cs` va después de `UseAuthorization`. Por cada petición autenticada **lee la cuenta del
almacén** y decide:

| Situación de la cuenta | Respuesta | Desde |
| --- | --- | --- |
| No existe (fue eliminada) | `401` genérico, igual que credencial inválida: no revela si existió | `23ae495` (`R-05`) |
| `Pending` o `Blocked` | `403` `AccountNotEnabled` | `23ae495` (`R-05`): antes sólo miraba la marca |
| Habilitada con marca de cambio pendiente | `403` `PasswordChangeRequired` | etapa `c` |
| **Acceso emitido antes de `CredentialChangedAt`**, o sin `iat` si la cuenta ya cambió | `401` genérico | `7c94988` (`REF-02`) |
| Admisible | Sigue | — |

**El orden es el del dominio** (`Account.EvaluateAdmission`: situación primero, marca después). La
comparación de revocación es **por segundos**, porque `iat` no tiene fracción: el acceso que el
propio cambio emite en el mismo segundo sigue sirviendo.

**Quién escribe `CredentialChangedAt`.** Sólo `Account.ReplaceCredential`, cuando la propia cuenta
reemplaza su contraseña (`Account.cs` línea 456); `AccountEndpoints.cs` le pasa `changedAt: now` en
las dos formas de `A-05` (líneas 248 y 290). La forma **con sesión** responde además con un acceso
nuevo (línea 322) y el front lo reemplaza en la sesión; la forma sin sesión responde `200` sin
cuerpo. El reseteo del docente **no** escribe la columna: corta por la marca de cambio pendiente, que
la guardia lee del almacén aunque el acceso siga vigente. El detalle de ruta y forma de `A-05` está
en [04_Superficie-HTTP-Y-Contratos.md](04_Superficie-HTTP-Y-Contratos.md).

### 5.5 Protección de datos del front

Las claves **sobreviven al proceso** desde el 2026-09-01 (hallazgo `H-1` de la mesa del
2026-09-01-C): sin `AddDataProtection` regía un repositorio efímero y se rompían en silencio los
testigos de antifalsificación, la marca de sesión y los descriptores de componente de Blazor.

| Aspecto | Valor (`src/GeometriaFactory.Web/Program.cs`) |
| --- | --- |
| Directorio | `DataProtection:KeysDirectory`, o `App_Data/claves` bajo la raíz de contenido, **fuera de `wwwroot`** |
| Sonda | Escribe y borra `.escritura` al arrancar; si no puede, **el front no arranca** |
| Propósito | `SetApplicationName("GeometriaFactory.Web")` |
| Cifrado | **Ninguno**, apartamiento declarado: DPAPI de usuario falla sin perfil, el de máquina no es mejora honesta, y no hay certificado |
| Visibilidad | `DataProtectionState` publica la ruta en la página de estado |
| Repositorio | `App_Data/` y `**/App_Data/` ignorados (`.gitignore`, bloque comentado) |

**Perder ese directorio cuesta un re-login de la comisión y ningún dato**: riesgo **aceptado por
escrito** por el PO, sin respaldo de las claves (intake §11 `RN-B7`, línea 351).

## 6. El ciclo de la cuenta visto desde la seguridad

Los estados son `Pending = 1`, `Enabled = 2`, `Blocked = 3` (`Domain/Values/AccountStatus.cs`); el
papel, `Student`/`Administrator`. Las reglas del ciclo están en
[03_Dominio-Y-Reglas-De-Negocio.md](03_Dominio-Y-Reglas-De-Negocio.md); lo que importa acá:

| Acto | Efecto de seguridad |
| --- | --- |
| Autorregistro (`A-02`, anónimo) | Cuenta `Pending`, sin `PasswordHash`. **Filtro por dominio** antes de consultar la unicidad (§6.1) |
| Habilitación por el docente | Provisoria (§5.2) + marca de cambio pendiente |
| Bloqueo o baja | **Corta los accesos ya emitidos** en la próxima petición (§5.4). La baja borra la cuenta **y todos sus trabajos** (cascada, §1.1) |
| Reseteo por el docente | Nueva provisoria + marca, y **libera la cuota de intentos fallidos** de esa cuenta (§7) |
| Cambio de la propia contraseña | Levanta la marca, escribe `CredentialChangedAt` y **revoca todo acceso anterior** |

### 6.1 Autorregistro por dominio admitido (`R-07`)

`Api ADR-00012` 1.0 (2026-09-14), commit `203c4e9`, PR #220. `RegistrationPolicy`
(`src/GeometriaFactory.Application/Accounts/RegistrationPolicy.cs`):

| Regla | Detalle |
| --- | --- |
| Llave | `Registration__AdmittedEmailDomains__0`, `__1`…; se aceptan con o sin `@`, los vacíos se ignoran |
| Sin dominios | **Admite cualquiera**: el producto no conoce el dominio institucional y no lo inventa |
| Comparación | **Exacta sobre el dominio entero**, sin distinguir mayúsculas; `frre.utn.edu.ar.example.com` no es `frre.utn.edu.ar`, y un subdominio no entra por su padre |
| Orden | Se evalúa **antes** de la unicidad: la respuesta no dice si el correo ya tenía cuenta (`RegisterAccountUseCase.cs`) |
| Rechazo | `EMAIL_DOMAIN_NOT_ADMITTED`, **`400`** (`ContractTranslation.cs` línea 76); la pantalla de registro lo avisa |
| Pruebas | `RegistrationDomainTests` (3) |

**Hoy no rige**: `appsettings.json` trae `"AdmittedEmailDomains": []`, y la mesa del 2026-09-15
(`D-2`, 5-0) decidió **no declarar ninguno** hasta que el PO confirme el dominio o exista el alta por
el docente — un dominio mal elegido deja alumnos afuera (`RN-B1`). Es la deuda `DD-R10-1`.

## 7. Cuota de intentos fallidos, reseteo y topes por origen

**La fuerza bruta apunta a una cuenta, y es la cuenta la que se protege** (`Api ADR-00011` 1.1).
`CredentialAttemptThrottle`, un singleton del proceso:

| Aspecto | Valor |
| --- | --- |
| Quién lo consulta | El canje `A-01` y la forma **sin sesión** de `A-05`, sobre el cuerpo ya enlazado y **antes de derivar** |
| Partición | Correo **normalizado con `EmailIdentity.Normalize`**, exista o no la cuenta |
| Tope | **10 fallos en 900 s**, ventana deslizante propia (`CredentialFailuresPerAccount`, `CredentialFailureWindowSeconds`) |
| Qué cuenta | **Sólo fallos**: los ingresos correctos no gastan |
| Rechazo | `429`, `Retry-After` = espera real hasta que vence el fallo más viejo, **sin cuerpo**: indistinguible del rechazo del middleware y neutro sobre la existencia de la cuenta |
| Liberación | `Release(email)`: la llama el reseteo del docente (`CommissionAccountEndpoints.cs` línea 253) |
| Carrera aceptada | Consultar y anotar son dos pasos: el exceso posible es la concurrencia en vuelo |
| Barrido | Por encima de 4096 cuentas anotadas se descartan las vencidas |

**Por qué una ventana propia** (commit `3b7482e`, `R-03`): el `PartitionedRateLimiter` del marco
no permite quitar una partición, y sin eso la mitigación de `ADR-00011` §6 —que el reseteo de la
contraseña por el docente libere a la cuenta limitada— no existía (mensaje del commit). Hoy la ADR
dice «el docente puede resetear la contraseña, que libera la cuota de la cuenta» (línea 56). **Por qué en el punto y no en el middleware**: el correo viaja en el
cuerpo, y el middleware sólo sabe contar peticiones.

**Topes por origen y por persona** (`ContractRateLimiting.cs`, `appsettings.json`): las políticas
`contrato` y `canje`, sus particiones y sus cifras están en
[04_Superficie-HTTP-Y-Contratos.md](04_Superficie-HTTP-Y-Contratos.md) §6.

Los topes por origen se dimensionan para **trescientos alumnos detrás de una dirección** (el front o
el NAT de la facultad); dejaron de ser 120 y 30 en el commit `410a7c4`. Se ajustan cuando `PT-05`
mida el uso real (`DD-R9-6`). `UseRateLimiter` va **después de autenticar y antes de autorizar**:
quien tantea la guardia con accesos inventados gasta cuota de su origen. `/salud` no pasa por el
limitador. `RateLimitingTests` tiene 17 métodos de prueba. La forma del `429` en el contrato está en
[04_Superficie-HTTP-Y-Contratos.md](04_Superficie-HTTP-Y-Contratos.md).

## 8. El origen real detrás del front

Detrás del túnel toda petición llega del contenedor del túnel, y detrás del front **toda la
comisión llegaba con la dirección del front** y compartía una sola cuota anónima: un cliente podía
dejar a la clase sin ingreso (`R-02`, choca con `RN-B1`).

| Pieza | Qué hace | Fuente |
| --- | --- | --- |
| Servicio de datos | `UseForwardedHeaders` **primero en la tubería** (tras el manejador de errores), con `XForwardedFor` y `XForwardedProto`; las redes de `ForwardedHeaders:KnownNetworks` **se suman** al bucle local | `Api/Program.cs`; `ContractRateLimiting.cs` |
| Front | Resuelve su propia dirección real con `UseForwardedHeaders` y las mismas llaves | `Web/Program.cs` líneas 180–229 |
| Front → servicio | `BrowserOriginForwardingHandler`: si la llamada corre dentro de una petición HTTP del navegador (ingreso, registro, cambio obligado) **reemplaza** `X-Forwarded-For` con la dirección que el front resolvió | `Web/Integration/BrowserOriginForwardingHandler.cs` |

**El navegador no puede elegir su partición**: el front escribe la dirección resuelta, no reenvía
la cabecera que trajo el cliente. En el circuito interactivo no se agrega nada: esas llamadas llevan
sesión y se particionan por persona. **La cabecera sólo cuenta si el servicio confía en la red del
front**; sin esa llave la ignora, que es lo seguro. Decisión `Web ADR-10009` 1.0 (2026-09-14), commit
`ed097f8`, PR #216; `BrowserOriginForwardingTests` (3). El valor real de `KnownNetworks` vive en la
composición del despliegue, fuera del repositorio; `Mesa-2026-09-14.md` §6.1 lo da por declarado en
producción (**no verificado** desde este árbol).

## 9. Cabeceras de seguridad, en el origen

Mesa del 2026-09-15, `D-3` (5-0) sobre `R-06`: **en el origen y no en el borde**, porque el borde
(túnel y proveedor) es del PO, el agente no lo alcanza y no se verifica con la batería. Un middleware
`SecurityHeaders` en cada pieza, puesto después de `UseForwardedHeaders`:

| Cabecera | Front (`Web/Integration/SecurityHeaders.cs`) | Servicio de datos (`Api/Composition/SecurityHeaders.cs`) |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | `nosniff` |
| `X-Frame-Options` | `DENY` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | **`no-referrer`** |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ídem |
| `Content-Security-Policy` | `frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'` | `frame-ancestors 'none'` |
| `Strict-Transport-Security` | `max-age=86400`, **sólo sobre `https`** | ídem |

**Sin `preload` ni `includeSubDomains`**, condición del refutador del 2026-09-14. **Sin `script-src`
ni `style-src` en el front**: el marcado lleva guiones en línea del marco y del sello del visor, y sin
`nonce` rompe la pantalla — deuda `DD-R10-2`. La CSP del servicio se limita a no ser enmarcado
porque el explorador `/documentacion` carga guiones de un CDN. En el servicio, `UseSecurityHeaders`
va después de `UseForwardedHeaders` y antes de `UseRouting` (`Api/Program.cs` l.78–83); en el front,
después de `UseForwardedHeaders` porque HSTS depende de que la petición haya llegado por `https`. La
CSP rige en modo **obligatorio**, no `Report-Only` como pedía la condición de `R-06` en
`Mesa-2026-09-14.md` (`git grep Report-Only -- src` → 0). `SecurityHeadersTests` (3), commit
`f68ae34`.

## 10. Imágenes sin root

Commit `2c29d62`, PR #219, lote 1 de la mesa del 2026-09-14:

| Imagen | Usuario | Directorio que le pertenece |
| --- | --- | --- |
| `deploy/Dockerfile` (servicio de datos) | `USER $APP_UID` = `app`, **uid 1654** de la imagen base | `/datos`, creado y `chown` en la imagen |
| `deploy/Dockerfile.web` (front) | ídem | `/app/App_Data` |

**Un volumen que ya existe conserva su dueño**: si es de root, el servicio sale con 78 y el front no
arranca porque no puede escribir sus claves (§5.5). El `chown` previo al primer despliegue sin root,
las herramientas que cada imagen agrega (`curl`, `sqlite3`) y la construcción de las imágenes están
en [08_DevOps-Construccion-Y-Despliegue.md](08_DevOps-Construccion-Y-Despliegue.md) §5.

## 11. Datos personales

Intake 5.1 §10 (2026-09-15), decisión `D-4` (5-0) de la mesa delegada sobre `REF-01`/`E-3`:

| Aspecto | Declaración (`PRODUCT-INTAKE-Fabrica-De-Geometria.md` líneas 338–339) |
| --- | --- |
| Normativa | **Aplica la Ley 25.326**; hasta la 5.0 la fila decía «no aplica ninguna» |
| Qué se guarda | Correo, nombre y apellido, y los trabajos |
| Finalidad | Identificar a la persona y sus trabajos dentro del laboratorio; ninguna otra |
| Quién accede | El docente de la comisión y la propia persona sobre lo suyo |
| Comunicación | **No se envían correos ni se comparten** los datos |
| Retención | Mientras la cuenta exista; la baja borra la cuenta y sus trabajos |
| Respaldos | Antes de cada despliegue y al cierre de cuatrimestre; como máximo un cuatrimestre (`PD-04`) |
| Corrección y supresión | Se le piden al docente |

**El aviso en pantalla** está en `Components/Pages/AccountRegistration.razor` (párrafo
`registration-privacy`, PR #229), antes del botón y enlazado con `aria-describedby`. Dice qué se
guarda, para qué, quién lo ve, que no se envían correos ni se comparten, y que la corrección o la
baja se piden al docente. La alternativa de una casilla de consentimiento se refutó (`D-4` c).

## 12. El reloj

`UtcSystemClock` implementa `ISystemClock`, singleton. **Todo el tiempo del producto es UTC**, y el
dominio no lo lee: lo recibe (`ADR-02006`). El momento de emisión del acceso y `CredentialChangedAt`
salen del mismo reloj (`clock.UtcNow` en los puntos).

## 13. Lo que la seguridad **no** hace, y es decisión

| Ausencia | Fundamento |
| --- | --- |
| Sin correlación distribuida ni trazas entre procesos | El manifiesto §5 declara `tiene_observabilidad_critica` sólo en `Api`, por su p99, y ninguna entrega declara SLO de disponibilidad (`PRODUCT-MANIFEST-Fabrica-De-Geometria.md` línea 281) |
| Sin multi-tenant, permisos finos ni varios administradores | Una instancia, un curso, dos papeles fijos (`INV-05`) |
| Sin identidad de aplicación ni credencial por cliente | `ADR-00009`: el cliente es una persona |
| Sin acceso de refresco | `ADR-00003` §2 punto 5 |
| Ningún mensaje mostrado al usuario incluye direcciones de servicios internos, y ningún DTO lleva el hash de contraseña ni la clave de firma | `RA-03` (intake líneas 581, 919 y 1046), con su contracara: registro estructurado del lado del servidor de cada error y cada acceso rechazado (intake línea 1046) |
| Las claves del front no se cifran ni se respaldan | §5.5; `RN-B7` aceptado |
| La salud no detecta disco lleno | `StoreHealth`, declarado |
| La imagen del front **no exige** `ApiBaseUrl` | Lleva horneado `http://localhost:5080/`; la guarda vive en la composición del proyecto de contenedor (`${API_BASE_URL:?...}`), fuera del repositorio (`deploy/Dockerfile.web`, comentario final) |

## 14. Deuda abierta del dominio

| Id | Qué falta | Evento de cierre | Fuente |
| --- | --- | --- | --- |
| `DD-R10-1` | Declarar `Registration__AdmittedEmailDomains__0` en producción | El PO confirma el dominio, o entra el alta por el docente | `Mesa-2026-09-15.md` §5 |
| `DD-R10-2` | `script-src`/`style-src` con `nonce` en la CSP del front | Primera unidad que toque el marcado de `App` o los guiones en línea | ídem |
| `DD-R9-1` | `restaurar-almacen.sh`: paridad de modos y comparación de `__EFMigrationsHistory` | `Entornos-Deploy.md` de Api §11.1 declara el guion como mecanismo de `RN-B8` | `Mesa-2026-09-14.md` §7 |
| `DD-R9-5` | Reconciliar `Modelo-Datos-Logico.md` con el esquema real | Próxima migración, o respuesta a `E-4` | ídem |
| `DD-R9-6` | Ajustar los topes por origen | `Medicion-PT-05.md` deja de decir `SIN MEDIR` | ídem |
| `DD-R9-7` | Detalle público de `R-07` (el de `R-03` y `R-05`/`REF-02` ya se publicó en `Mesa-2026-09-14.md` 1.3) | La composición declara el dominio y se agrega el detalle en una versión 1.x | ídem |

La migración `20260914112430_CredentialChangedAt` es posterior a `DD-R9-5` y no cerró la deuda: el
modelo lógico sigue en su versión 1.1 del 2026-08-10. El registro completo de deudas, por familia,
está en [11_Decisiones-Auditorias-Y-Pendientes.md](11_Decisiones-Auditorias-Y-Pendientes.md) §5.2.
Las contradicciones medidas entre documentos y
árbol están en [12_Observaciones-Del-Indexado.md](12_Observaciones-Del-Indexado.md).
