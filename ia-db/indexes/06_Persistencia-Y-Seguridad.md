# 06 · Persistencia y seguridad — dónde vive el dato y cómo se firma el acceso

> **Propósito.** El almacén, su esquema, cómo se prepara al arrancar, cómo se respalda, y los
> cuatro mecanismos de seguridad, con sus parámetros exactos.
> **Fuente primaria.** `src/GeometriaFactory.Infrastructure/Persistence/` y `/Security/`,
> `src/GeometriaFactory.Api/Composition/CompositionRoot.cs`, `scripts/store-path.sh`,
> `scripts/respaldo-almacen.sh`, `deploy/Dockerfile`. Verificado el 2026-09-11 sobre `89f3ab3`.

---

## 1. El almacén

**EF Core 10.0.11 sobre SQLite, un solo archivo.** Un curso, una instancia, un administrador.

| Aspecto | Valor |
| --- | --- |
| Contexto | `GeometriaFactoryDbContext` |
| Configuraciones | `AccountConfiguration`, `WorkConfiguration`, `PieceConfiguration`, `ComponentConfiguration`, `ObservationConfiguration` |
| Repositorios | `EfCoreAccountRepository`, `EfCoreWorkRepository` — **adaptadores por puerto, sin repositorio genérico** (`ADR-06001`) |
| Modo de diario | **WAL**, fijado por `PRAGMA journal_mode=WAL;` en `StorePreparation.cs` |
| Ruta | `ConnectionStrings__Store` (nombre `Store`, `CompositionRoot.StoreConnectionName`), **obligatoria**: sin ella el servicio **no arranca** |

**La ruta no se declara en `appsettings.json`, y es deliberado.** El archivo está versionado y se
hornea en la imagen: una ruta absoluta sería la de una máquina, y la relativa que hubo hasta la
etapa `d` creaba la base **adentro del árbol del repositorio**. Hoy el valor llega por variable de
entorno: en desarrollo la calcula `scripts/store-path.sh` —`GEOMETRIAFACTORY_STORE_FILE` si está,
si no `ConnectionStrings__Store`, si no `$XDG_DATA_HOME/geometria-factory/geometriafactory.db`— y
en el despliegue la fija el `ENV` del `Dockerfile` sobre el volumen `/datos`. **Arrancar sin ella
sería escribir en un archivo que nadie eligió**, y la guardia de `CompositionRoot` lo impide con
un mensaje que nombra el guion.

**El front no tiene almacén**: `deploy/Dockerfile.web` no monta volumen ni declara cadena de
conexión, y lo dice con esas palabras.

### 1.1 Las cuatro transformaciones de esquema

`Persistence/Migrations/`, con **linaje inmutable** (`ADR-06007`):

| Migración | Qué agregó |
| --- | --- |
| `20260815010950_Account` | La cuenta |
| `20260815222049_Work` | El trabajo |
| `20260816153319_Interpretation` | Piezas, componentes y observaciones |
| `20260816230145_PieceOwnDimensions` | Las dimensiones propias de la pieza |

Se **aplican al arrancar**, no por un paso aparte. `scripts/migrate.sh` **genera** una
transformación durante el desarrollo y **no la aplica**. `Migrations/README.md` explica el linaje.

### 1.2 Unicidad del correo, y el índice que la sostiene

`ADR-06003`: **exactamente un componente normaliza correos en todo el producto**
(`Domain/Values/EmailIdentity.Normalize`), y hay un índice único sobre `NormalizedEmail` que
sostiene `INV-01`. La convención cierra por escrito la puerta por la que ese defecto vuelve.

### 1.3 Escritura

`ADR-06002`: **un archivo escritor único, una unidad de trabajo por operación**. El alcance lo fija
la capa de aplicación (`ADR-04005`, un caso de uso una unidad de trabajo) y el mecanismo esta capa;
**se deciden en capas distintas y no se pisan**.

## 2. El arranque en dos fases

`Composition/TwoPhaseStartup.cs` y `Persistence/StorePreparation.cs` (`ADR-00007`).

1. **Preparación**: aplica las transformaciones de esquema sobre la base que haya, y fija
   `PRAGMA journal_mode=WAL`, **una vez en la preparación y no por conexión**, porque el PRAGMA es
   persistente.
2. **Servicio**: recién entonces se atienden peticiones.

**Si el almacén no queda en WAL, el arranque lo dice y falla**, con el motivo escrito: la fuente lo
declara WAL y **el procedimiento de respaldo depende de él** — una copia tomada con el servicio
escribiendo puede quedar inconsistente sin WAL.

`GET /salud` (`A-16`) **invoca la preparación** y por eso es el punto que consume el `healthcheck`
del contenedor. `StoreHealth` es lo que responde por el estado del almacén — existe para contestar
si el almacén **sigue** estando, y `StoreHealthTests` lo cubre.

**WAL deja tres archivos y no uno** (`EVE-00003`): copiar sólo el `.db` no copia la base. El
`.gitignore` excluye `*.sqlite`, `*.db-shm`, `*.db-wal` y `geometriafactory*.db`.

## 3. Respaldo y restauración

| Guion | Qué hace |
| --- | --- |
| `scripts/respaldo-almacen.sh` | **La copia que el producto declaraba y no tenía** |
| `scripts/restaurar-almacen.sh` | La otra mitad, «la que se hace con miedo» |
| `scripts/reset-db.sh` | Deja el almacén en su estado de primer arranque: vacío, sin ninguna cuenta |

**Toda rutina destructiva usa archivo propio.** El 2026-08-15 una corrida de guiones se llevó una
cuenta, y esa es la razón por la que el límite está escrito en `AGENTS.md`. La imagen del servicio
de datos trae `sqlite3` **porque tiene almacén que respaldar**; la del front no lo trae porque no
tiene nada que respaldar.

## 4. Los cuatro mecanismos de seguridad

### 4.1 Derivación de contraseña — `PasswordDerivation`

`ADR-06004`, **derivación anclada con parámetros versionados**:

| Parámetro | Valor |
| --- | --- |
| Función | **PBKDF2-SHA256** (constante pública `AnchoredFunction`) |
| Iteraciones | **210.000** (constante pública `AnchoredIterations`; el constructor la admite como parámetro sólo para las pruebas) |
| Sal | 16 bytes, de `RandomNumberGenerator` |
| Clave derivada | 32 bytes |

Los parámetros son constantes públicas **a propósito**: el criterio los determina por completo y no
queda margen de gusto. Un hash que no se puede leer sale como
`InfrastructureConditionCode.UnreadablePasswordHash`.

### 4.2 Contraseña provisoria — `ProvisionalPasswordFactory`

`ADR-06005`: **no adivinable y sin repetirse**. La produce el sistema (`RN-02014`), se muestra al
administrador una sola vez para que la comunique, y deja la cuenta con la marca de cambio pendiente
(`INV-09`). **El administrador no conoce la contraseña definitiva**: la elige el alumno. Si la
fuente de aleatoriedad no está, el código de condición es `RandomnessSourceUnavailable` y la
respuesta es `503`.

La tecla de escape ya no descarta la provisoria de la pantalla — era irrecuperable y se reparó.

### 4.3 Acceso firmado — `AccessTokenIssuer` + `SigningOptions`

| Aspecto | Valor |
| --- | --- |
| Sección de configuración | `AccessToken` (`SigningOptions.SectionName`) |
| Clave | **`AccessToken__SigningKey`**, mínimo **32 bytes** UTF-8 (`MinimumSigningKeySizeInBytes`) |
| Emisor y audiencia | `GeometriaFactory` por defecto, configurables |
| Vigencia | `LifetimeInMinutes`, **480 por defecto** (ocho horas); menor que 1 es inválido |
| Tolerancia de reloj | 30 segundos (`ClockSkew`) |
| Reclamos | `sub` (identificador de cuenta), `email`, y el papel en `ClaimTypes.Role` |
| Biblioteca | `Microsoft.IdentityModel.JsonWebTokens` 8.22.0; el host valida con `JwtBearer` 10.0.11 |

**Sin `AccessToken__SigningKey` el ingreso falla, y falla al usarlo**: el arranque no la exige, de
modo que el síntoma aparece en el primer canje y no al levantar el servicio.
`SigningKeyStartupTests` es la prueba que cubre ese camino.

**Credencial firmada, papel por punto y guardia transversal** (`ADR-00003`): el papel se exige en
cada punto de acceso, y la marca de cambio pendiente la corta un intermediario transversal
(`PendingPasswordChangeGuard`) en lugar de repetirse en cada `MapPost`, «porque el olvido no se
nota».

### 4.4 Protección de datos del front

Las claves de protección del front **sobreviven al proceso** y el sitio lo declara en pantalla
(`DataProtectionState`). El directorio por omisión es `App_Data/claves` bajo la raíz de contenido,
**sin cifrar** —apartamiento declarado en el `.gitignore`: el anfitrión no expone perfil de usuario
y el laboratorio no tiene certificado—. **El almacén de claves nunca entra al repositorio**:
`App_Data/` está ignorado, y hay un commit que existe sólo para eso. Que fueran efímeras era el
hallazgo `H-1` de la mesa del 2026-09-01-C.

## 5. El reloj

`UtcSystemClock` implementa `ISystemClock`. **Todo el tiempo del producto es UTC**, y el dominio no
lo lee: lo recibe (`ADR-02006`).

## 6. Lo que la seguridad **no** hace, y es decisión

| Ausencia | Fundamento |
| --- | --- |
| Sin correlación distribuida ni trazas entre procesos | El manifiesto §5 declara observabilidad crítica **sólo en `Api`**, y no hay SLO de disponibilidad |
| Sin multi-tenant, sin permisos finos, sin varios administradores | Una instancia, un curso, dos papeles fijos (`INV-05`) |
| Sin escalera de ambientes | La audiencia son dos personas del aula |
| Ningún mensaje de error transporta dirección interna, ruta del almacén ni secreto | `RA-03`, con su contracara: **registro estructurado del lado del servidor de cada error y cada acceso rechazado** |
| La imagen del front **no exige** `ApiBaseUrl` al arrancar | Lleva el valor de desarrollo horneado, y un contenedor sin configurar arranca sano apuntando a un servicio que no existe. La guarda vive en la composición del proyecto de contenedor, fuera de este repositorio (`deploy/Dockerfile.web`, comentario final) |
