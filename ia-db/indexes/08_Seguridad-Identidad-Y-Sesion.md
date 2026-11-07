# 08 · Seguridad: identidad, credenciales, acceso firmado y sesión

> **Propósito:** ubicar cada mecanismo de seguridad del producto —quién se autentica, cómo se guarda y verifica la credencial, cómo se emite y revoca el acceso firmado, qué limita la tasa, qué cabeceras salen y cómo sostiene la sesión el front— con su clase y su documento fuente.
> **Fuente primaria:** `src/GeometriaFactory.Infrastructure/Security/`, `src/GeometriaFactory.Api/Composition/`, `src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs`, `src/GeometriaFactory.Web/Services/Session*.cs` y las ADR/CU/BT citadas. Rutas relativas a la raíz del repo `Lab-Geometria`.
> **Revisión indexada:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** pantallas de ingreso como UX (→ 09), rutas y contrato de error (→ 06), imágenes sin root y cadena de suministro (→ 12), ADR como registro (→ 15).

---

## 1. Mapa rápido

| Mecanismo | Pieza | Clase / archivo | Decisión / caso de uso |
|---|---|---|---|
| Identidad única: personas, no aplicaciones | Api | (sin código propio: no existe otra identidad) | `ADR-00009`, `BT-00028` (Descartada) |
| Derivar contraseña y verificar | Api / Infrastructure | `src/GeometriaFactory.Infrastructure/Security/PasswordDerivation.cs`, `src/GeometriaFactory.Application/Accounts/CredentialCheck.cs` | `CU-06006`, `ADR-06004` |
| Contraseña provisoria (reseteo y habilitación) | Infrastructure | `src/GeometriaFactory.Infrastructure/Security/ProvisionalPasswordFactory.cs` | `CU-06007`, `ADR-06005`, RN-06016 |
| Emitir y validar el acceso firmado | Infrastructure | `src/GeometriaFactory.Infrastructure/Security/AccessTokenIssuer.cs`, `SigningOptions.cs` | `CU-06008`, `BT-00010`, `ADR-00003` |
| Admisión de la cuenta (dominio) | Domain | `src/GeometriaFactory.Domain/Guards/Admission.cs`, `Account.EvaluateAdmission` en `src/GeometriaFactory.Domain/Entities/Account.cs` | INV-09, `BT-00011` |
| Guardia transversal por petición + revocación | Api | `src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs` | `BT-00011`, Mesa-2026-09-14 R-05, REF-02 |
| Autorregistro por dominios admitidos | Application | `src/GeometriaFactory.Application/Accounts/RegistrationPolicy.cs` | `ADR-00012`; Mesa-2026-09-14 R-07 (escalada E-1) |
| Límite de tasa por persona / origen | Api | `src/GeometriaFactory.Api/Composition/ContractRateLimiting.cs` | `BT-00029`, `ADR-00011` |
| Cuota de fallos por cuenta | Api | `src/GeometriaFactory.Api/Composition/CredentialAttemptThrottle.cs` | `ADR-00011` |
| Origen real del navegador | Web | `src/GeometriaFactory.Web/Integration/BrowserOriginForwardingHandler.cs` | `ADR-10009` |
| Cabeceras de seguridad | Api y Web | `src/GeometriaFactory.Api/Composition/SecurityHeaders.cs`, `src/GeometriaFactory.Web/Integration/SecurityHeaders.cs` | `SDD/Docs/Audit/Mesa-2026-09-15.md` D-3 sobre R-06 (2026-09-14) |
| CORS | Api | no se configura | `BT-00030` (Done, indagación) |
| Cookie de sesión y testigo en servidor | Web | `src/GeometriaFactory.Web/Services/SessionCookieDefaults.cs`, `SessionClaims.cs`, `SessionState.cs`, `SessionTokenStore.cs` | `ADR-10003` |
| Guardianes del encaminamiento | Web | `PanelSessionGateMiddleware.cs`, `ProvisioningGateMiddleware.cs`, `UnrestorableSessionMiddleware.cs` (en `src/GeometriaFactory.Web/Services/`) | `ADR-10003` §2 |
| Cambio de contraseña pendiente sin sesión (front) | Web | `src/GeometriaFactory.Web/Services/PendingCredentialChangeStore.cs` | CU-02 FA-02/FA-04 |
| Protección de datos (claves persistidas) | Web | `src/GeometriaFactory.Web/Program.cs`, `src/GeometriaFactory.Web/Services/DataProtectionState.cs` | — |

---

## 2. Identidad: la API autentica personas

| Punto | Contenido | Fuente |
|---|---|---|
| Decisión | Toda aplicación obtiene el acceso canjeando credenciales de una persona (`POST /auth/token`); no hay otra clase de identidad | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/ADR-00009-La-Api-Autentica-Personas-No-Aplicaciones.md` |
| Estado | Aceptado 2026-09-12, por decisión del PO | ídem §3 |
| Lo que no cambia | Riesgo `R-02` (tramo front→API en claro si es HTTP plano) sigue aceptado; los cuatro puntos fuera de la guardia siguen siendo cuatro | ídem §2 |
| Consecuencia | `BT-00028` (API key / `client_credentials` para terceros) **Descartada** el 2026-09-12: «no hay nada que construir» | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/06-Backlog-Tecnico/tareas-tecnicas/BT-00028-Autenticacion-Por-Cliente-Para-Terceros-Api-Key-O-Client-Credentials.md` |

---

## 3. Credenciales

### 3.1 Derivación y verificación (`CU-06006`)

| Parámetro | Valor | Fuente |
|---|---|---|
| Función | `PBKDF2-SHA256` (`AnchoredFunction`) | `src/GeometriaFactory.Infrastructure/Security/PasswordDerivation.cs` |
| Iteraciones | `210_000` (`AnchoredIterations`, inyectable por constructor) | ídem |
| Sal / derivado | 16 bytes / 32 bytes | ídem |
| API | `Derive(string?) → string?`; `Verify(plaintext, stored) → CredentialCheck` | ídem |
| Resultado | `CredentialCheck`: `Matches = 1`, `DoesNotMatch = 2`, `Unreadable = 3` (defecto del almacén; **no** se colapsa con «no coincide») | `src/GeometriaFactory.Application/Accounts/CredentialCheck.cs` |
| Fuera de alcance del CU | No decide admisión (dominio), no emite acceso (`CU-06008`), no produce contraseñas (`CU-06007`) | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Operaciones-Internas/CU-06006-Derivar-La-Contrasena-Y-Verificar-Una-Credencial.md` §1 (v1.2, Aprobado) |
| Decisión | Derivación anclada con parámetros versionados | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/ADR-06004-Derivacion-De-Clave-Anclada-Con-Parametros-Versionados.md` |

### 3.2 Contraseña provisoria (`CU-06007`)

| Parámetro | Valor | Fuente |
|---|---|---|
| Longitud | 12 (`Length`) | `src/GeometriaFactory.Infrastructure/Security/ProvisionalPasswordFactory.cs` |
| Alfabeto | `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789` (sin caracteres confundibles) | ídem |
| API | `Produce() → string?`; lo que se guarda es su forma derivada por `PasswordDerivation` | ídem |
| Registro | La clase no recibe registrador (no debe dejar la contraseña en bitácoras) | ídem |
| Consumidores | Dos, un mecanismo: reseteo (F-26) y habilitación de cuenta (RN-06016), desde `PRODUCT-INTAKE` 1.13 | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Operaciones-Internas/CU-06007-Producir-La-Contrasena-Provisoria-Del-Reseteo.md` §1 (v1.5) |
| Decisión | No adivinable y sin repetirse | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/ADR-06005-Contrasena-Provisoria-No-Adivinable-Y-Sin-Repetirse.md` |

Ambos orígenes dejan la cuenta con la **marca de cambio de contraseña pendiente** (ver §5).

---

## 4. Acceso firmado (`CU-06008`)

| Aspecto | Valor | Fuente |
|---|---|---|
| Algoritmo | HMAC-SHA256 (`SecurityAlgorithms.HmacSha256`) | `src/GeometriaFactory.Infrastructure/Security/AccessTokenIssuer.cs` |
| Reclamos | Cuatro, ninguno por defecto: identificador, correo, papel (`ClaimTypes.Role`) y expiración | ídem, remarks |
| Clave mínima | 32 bytes UTF-8 (`MinimumSigningKeySizeInBytes`); más corta cuenta como **ausente** y no se arranca. El mínimo es «PROPUESTA de la etapa `c`: ninguna fuente da longitud» | ídem |
| Sin clave | No se emite ni se verifica (`SigningKeyIsProvided`) | ídem |
| Validación | `ValidationParameters`, `ClockSkew` 30 s | ídem |
| Configuración | Sección `AccessToken`: `SigningKey` (vacía por defecto), `LifetimeInMinutes = 480`, `Issuer`/`Audience` = `GeometriaFactory` → variable `AccessToken__SigningKey` | `src/GeometriaFactory.Infrastructure/Security/SigningOptions.cs` |
| Vigencia | Criterio: caduca dentro de la sesión de una clase, renovación = reingreso, **sin acceso de refresco**; el número va a configuración (ninguna fuente lo da) | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/06-Backlog-Tecnico/tareas-tecnicas/BT-00010-Fijar-La-Vigencia-Del-Acceso-Firmado.md` (Done, etapa `a`) |
| Sin estado | El emisor no sostiene sesión; la conserva el servidor del front (§9) | `AccessTokenIssuer.cs` remarks; `CU-06008` §1 |
| Admisión previa | Una cuenta `Pending`, `Blocked` o marcada no llega al emisor | `AccessTokenIssuer.cs` remarks |
| Registro en la Api | `AddJwtBearer` en la composición | `src/GeometriaFactory.Api/Composition/CompositionRoot.cs` (l. ~221) |

---

## 5. Admisión y revocación en cada petición

### 5.1 Evaluación del dominio

`Admission` es un `readonly record struct` (`IsAdmissible`, `Reason`; `Admissible()`, `NotAdmissible(reason)`) — `src/GeometriaFactory.Domain/Guards/Admission.cs`.

Orden de `Account.EvaluateAdmission` (`src/GeometriaFactory.Domain/Entities/Account.cs` l. ~472):

| Orden | Condición | Motivo (`ConditionCode`) |
|---|---|---|
| 1 | `AccountStatus.Pending` | `AccountPending` |
| 2 | `AccountStatus.Blocked` | `AccountBlocked` |
| 3 | `MustChangePassword` | `PasswordChangePending` |
| — | ninguna | admisible |

Consumidores: `src/GeometriaFactory.Application/Accounts/ResolveSignInUseCase.cs` (canje) y la guardia de §5.2.

### 5.2 Guardia transversal (`PendingPasswordChangeGuard`)

Fuente: `src/GeometriaFactory.Api/Endpoints/PendingPasswordChangeGuard.cs`; tarea `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/06-Backlog-Tecnico/tareas-tecnicas/BT-00011-Construir-La-Guardia-De-Admision-Transversal.md` (Done, etapa `c`).

| Regla | Detalle |
|---|---|
| Forma, excepción `A-05`, corte (INV-09), qué no hace | → [06 §8](06_Superficie-HTTP-Y-Contratos.md); aquí sólo la admisión y la revocación |
| Sin acceso | Los cuatro puntos anónimos (canje, registro, configuración del administrador, salud) no pasan por la guardia |
| Lectura | La admisión entera se lee **del almacén** en cada petición (Mesa-2026-09-14 R-05), no de los reclamos |
| Revocación por bloqueo/eliminación (`ADR-00003` 1.1 §2 punto 5; Mesa-2026-09-14 R-05 + REF-02) | Un acceso aún válido criptográficamente deja de servir si la cuenta ya no se admite |
| Cuenta inexistente | `401` genérico, como credencial que no corresponde (no revela existencia) |
| Revocación por cambio de credencial (REF-02) | Acceso emitido antes de `Account.CredentialChangedAt` → `401` genérico; comparación por **segundos** (el acceso del propio cambio sigue sirviendo); sin momento de emisión no se admite si hubo cambio |
| Respuesta | Un código por motivo, sin nombrar la operación (CU-02 CA-05) |

`CredentialChangedAt` llega con la migración `20260914112430_CredentialChangedAt` (detalle de persistencia → 07).

### 5.3 Orden de la tubería de la Api

`src/GeometriaFactory.Api/Program.cs`: `UseForwardedHeaders` (l. 78) → `UseSecurityHeaders` (81) → `UseRouting` (83) → `UseAuthentication` (84) → `UseRateLimiter` (92) → `UseAuthorization` (94) → `UseMiddleware<PendingPasswordChangeGuard>` (100). El limitador va después de autenticar y antes de autorizar para que tantear la guardia gaste cuota (comentario l. 86–91; `BT-00029`).

---

## 6. Autorregistro por dominios admitidos

| Regla | Fuente |
|---|---|
| Lista por configuración `Registration:AdmittedEmailDomains` (`Registration__AdmittedEmailDomains__0`…); se acepta con o sin `@` | `src/GeometriaFactory.Application/Accounts/RegistrationPolicy.cs`; `src/GeometriaFactory.Api/Composition/CompositionRoot.cs` l. ~200 |
| Lista vacía = sin restricción (`RegistrationPolicy.Unrestricted`); `appsettings.json` la trae vacía y documentada | `src/GeometriaFactory.Api/appsettings.json` |
| Comparación exacta sobre el dominio entero, sin mayúsculas; ni subdominio ni sufijo entran | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/ADR-00012-El-Autorregistro-Admite-Los-Dominios-Que-El-Despliegue-Declara.md` §2.3 |
| El dominio se verifica **antes** que la unicidad (no abre enumeración, RN-02) | ídem §2.4 |
| Prueba | `tests/GeometriaFactory.Integration.Tests/RegistrationDomainTests.cs` |

---

## 7. Límite de tasa y cuota de intentos

### 7.1 Políticas de `UseRateLimiter`

Fuente: `src/GeometriaFactory.Api/Composition/ContractRateLimiting.cs` (`ContractRateLimiting`, `RateLimitingOptions`, sección `RateLimiting`). Tarea: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/06-Backlog-Tecnico/tareas-tecnicas/BT-00029-Rate-Limiting-Por-Clave-O-Por-Ip.md` (v1.4, Done, etapa `k`).

| Política | Partición | Opción (defecto) |
|---|---|---|
| `contrato` | `persona:{accountId}` con acceso; `origen:{ip}` sin acceso | `PermitsPerPerson` = 60; `PermitsPerAddress` = 1200 |
| `canje` | `canje:{ip}` | `CredentialExchangePermitsPerAddress` = 600 |
| Ventana | deslizante, 6 segmentos | `WindowSeconds` = 60 |
| Rechazo | con `Retry-After` | — |
| Validación | umbral ≤ 0 detiene el arranque nombrando la llave (`Validate()`) | — |

Origen: tras `UseForwardedHeaders` con `ForwardedHeaders:KnownNetworks` (ej. `ForwardedHeaders__KnownNetworks__0=172.23.0.0/16`); sin redes declaradas la partición por dirección colapsa en una sola detrás del túnel (remarks de la clase).

### 7.2 Cuota de fallos por cuenta (`ADR-00011`)

Fuente: `src/GeometriaFactory.Api/Composition/CredentialAttemptThrottle.cs`; `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/ADR-00011-El-Canje-Se-Protege-Por-Cuenta-Y-El-Origen-Tolera-Una-Comision.md`.

| Regla | Valor |
|---|---|
| Defensa contra fuerza bruta | **por cuenta** (OWASP *login throttling*), desde cualquier origen |
| Umbral / ventana | `CredentialFailuresPerAccount` = 10 fallos / `CredentialFailureWindowSeconds` = 900 s, deslizante |
| Partición | correo escrito normalizado (`EmailIdentity.Normalize`), exista o no la cuenta (no revela existencia) |
| Ingresos correctos | no cuentan; `Release(email)` libera la cuota (desde ADR 1.1) |
| Alcance | canje y la forma sin sesión de `A-05` (sólo cuenta la vigente que no verificó) |
| Ubicación | en el punto (`Refusal`, `RecordFailure`), **no** en `UseRateLimiter` |
| Topes por origen | holgados, tamaño de una comisión (~300 alumnos tras una dirección) |
| Prueba | `tests/GeometriaFactory.Integration.Tests/RateLimitingTests.cs` |

---

## 8. Origen real del navegador (front → Api)

Fuente: `src/GeometriaFactory.Web/Integration/BrowserOriginForwardingHandler.cs`; `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Adrs/ADR-10009-El-Front-Le-Dice-Al-Servicio-De-Datos-De-Donde-Llego-El-Navegador.md` (Aprobado 2026-09-14).

| Paso | Detalle |
|---|---|
| 1 | El front resuelve la IP real con `UseForwardedHeaders` primero, confiando sólo en `ForwardedHeaders:KnownNetworks` (CIDR inválido detiene el arranque) — `src/GeometriaFactory.Web/Program.cs` l. ~180–229 |
| 2 | `DelegatingHandler` agrega `X-Forwarded-For` con esa IP, **reemplazando** cualquier valor previo, sólo dentro de una petición HTTP del navegador |
| 3 | En el circuito interactivo no agrega nada: esas llamadas llevan sesión y se particionan por persona |
| 4 | Que cuente lo decide el despliegue de la Api (`ForwardedHeaders__KnownNetworks`) |
| Prueba | `tests/GeometriaFactory.Integration.Tests/BrowserOriginForwardingTests.cs` |

---

## 9. Cabeceras de seguridad

| Cabecera | Api (`src/GeometriaFactory.Api/Composition/SecurityHeaders.cs`) | Web (`src/GeometriaFactory.Web/Integration/SecurityHeaders.cs`) |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | `nosniff` |
| `X-Frame-Options` | `DENY` | `DENY` |
| `Referrer-Policy` | `no-referrer` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ídem |
| `Content-Security-Policy` | `frame-ancestors 'none'` | `frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'` |
| `Strict-Transport-Security` | `max-age=86400` (condicional, ver fuente) | `max-age=86400` (condicional) |

Prueba: `tests/GeometriaFactory.Integration.Tests/SecurityHeadersTests.cs`.

## 10. CORS

No se configura. `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/06-Backlog-Tecnico/tareas-tecnicas/BT-00030-Declarar-Cors-Condicional-Al-Cliente-Que-Aparezca-D-01.md` (v2.0, Done, indagación, etapa `k`): condicional a que aparezca un cliente propio JavaScript de navegador desde otro origen (`D-01` cerró con `ADR-00009`; la ficha conserva el nombre sólo por los enlaces, v1.3); el riesgo está registrado en `05` §9.1 de la Api. No hay llamada de CORS en `src/` (verificado por búsqueda en `5f07b12`).

---

## 11. Sesión del front (`ADR-10003`)

Decisión: la credencial de sesión vive del lado del servidor y **nunca llega al navegador**; el navegador conserva sólo una marca `HttpOnly` que no la transporta — `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Adrs/ADR-10003-Credencial-De-Sesion-En-El-Estado-Del-Circuito.md`.

| Pieza | Contenido | Fuente |
|---|---|---|
| Esquema / cookie | `gf-session` / `gf.session` | `src/GeometriaFactory.Web/Services/SessionCookieDefaults.cs` |
| Atributos | `HttpOnly`; `Secure` siempre fuera de Development (`SameAsRequest` en Development); `SameSite=Strict`; 8 h deslizante | `src/GeometriaFactory.Web/Program.cs` l. ~115–133 (el `Cookies.Append` de `SignIn.razor` es la marca de §11.2, no esta cookie) |
| Reclamos de la marca | `gf:session`, `gf:account`, `gf:email`, `gf:role` (el testigo **no** está) | `src/GeometriaFactory.Web/Services/SessionClaims.cs` |
| Almacén del testigo | `SessionTokenStore`: diccionario en memoria del proceso, alcance de aplicación (`Keep`, `Find`, `Contains`, `Discard`, `Clear`) | `src/GeometriaFactory.Web/Services/SessionTokenStore.cs` |
| Estado por circuito | `SessionState`: `OpenAsync` (id GUID nuevo), `CloseAsync`, `IsOpen` (marca + testigo presente), `UseAccessToken()` (única salida del testigo), `ReplaceAccessToken`, `IsAdministrator` | `src/GeometriaFactory.Web/Services/SessionState.cs` |
| Pruebas | `SessionCookieTests.cs`, `SessionCredentialTests.cs` | `tests/GeometriaFactory.Integration.Tests/` |

### 11.1 Guardianes del encaminamiento

`ADR-10003` §2 declara cuatro guardianes (aprovisionamiento, sesión, papel, …) que **acotan lo que se ofrece sin hacer cumplir nada** (el cumplimiento es de la Api).

| Middleware (orden de la tubería, `src/GeometriaFactory.Web/Program.cs` l. 255 → 263 → 271) | Comportamiento | Fuente |
|---|---|---|
| `ProvisioningGateMiddleware` | Sin administrador → todo desvía a `/aprovisionamiento-inicial`; ya provisto, esa ruta desvía neutro a `/ingreso`. Corre antes de `UseAuthentication`; el costo de preguntar está en `ProvisioningStateProbe` | `src/GeometriaFactory.Web/Services/ProvisioningGateMiddleware.cs`; `Program.cs` l. 255 |
| `UnrestorableSessionMiddleware` | Corre después de `UseAuthentication` y antes de `PanelSessionGateMiddleware`. Marca viva en el navegador sin testigo en memoria (proceso reciclado) → `/ingreso?estado=sesion-no-restablecible` | `src/GeometriaFactory.Web/Services/UnrestorableSessionMiddleware.cs` |
| `PanelSessionGateMiddleware` | Ninguna ruta del panel sin sesión → `/ingreso`; ajuste `PanelWalkthroughWithoutSession` para recorrido | `src/GeometriaFactory.Web/Services/PanelSessionGateMiddleware.cs` |
| Pruebas | `PanelSessionGateTests.cs`, `ProvisioningGateTests.cs` | `tests/GeometriaFactory.Integration.Tests/` |

### 11.2 Cambio de contraseña pendiente en el front

`PendingCredentialChangeStore` guarda del lado del servidor el correo de quien debe cambiar la contraseña, referido por la marca `gf-cambio-pendiente` (`Remember`, `Find`, `Discard`) — `src/GeometriaFactory.Web/Services/PendingCredentialChangeStore.cs`. Pruebas: `ForcedPasswordChangeTests.cs`, `ForcedPasswordChangeSurfaceTests.cs`, `ProvisionalPasswordTests.cs`.

---

## 12. Protección de datos del front

| Aspecto | Detalle | Fuente |
|---|---|---|
| Persistencia de claves | `AddDataProtection().PersistKeysToFileSystem(...)`, `SetApplicationName("GeometriaFactory.Web")` | `src/GeometriaFactory.Web/Program.cs` l. ~82 |
| Directorio | `DataProtection:KeysDirectory` (relativo a ContentRoot) o `App_Data/claves` por defecto | ídem l. ~62 |
| Arranque | Sonda de escritura: si el directorio no se puede escribir, el arranque falla con mensaje (sin claves, antifalsificación, marca de sesión y componentes interactivos fallan en silencio al reciclar) | ídem |
| Claves sin cifrar | **Apartamiento declarado**: se intentó DPAPI y se retiró con motivo medido | ídem, comentario tras l. 84 |
| Observación | `DataProtectionState(keysDirectory)`: `Directory`, `CountKeys()` para el diagnóstico | `src/GeometriaFactory.Web/Services/DataProtectionState.cs` |

---

## 13. Referencias cruzadas

| Tema | Índice |
|---|---|
| Rutas `/v1/`, `ErrorCode`, traducción motivo→HTTP | 06 |
| `Account`, `ConditionCode`, INV/RN | 05 |
| Migración `CredentialChangedAt`, almacén | 07 |
| Pantallas de ingreso, aprovisionamiento, cambio forzado | 09 |
| Configuración por entorno (`AccessToken__SigningKey`, puertos), imágenes sin root | 12 |
| Registro de ADR 00009–00012, 06004–06005, 10003, 10009 | 15 |
| Mesa-2026-09-14 (R-05) | 16 |
