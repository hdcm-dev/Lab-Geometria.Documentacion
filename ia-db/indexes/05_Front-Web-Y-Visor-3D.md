# 05 · Front web y visor 3D — las pantallas, sus guardianes y la escena

> **Propósito.** Qué pantallas existen, quién puede llegar a cada una, cómo se sostiene la sesión,
> qué dice el sello de versión, qué avisa el registro sobre los datos personales, y qué hace
> exactamente el bundle del visor y quién lo genera.
> **Fuente primaria.** `src/GeometriaFactory.Web/` (`Program.cs`, `App.razor`, `Components/`,
> `Services/`, `Integration/`, `wwwroot/`, `GeometriaFactory.Web.csproj`), `visor/src/`,
> `visor/package.json`, `visor/webpack.config.js`, `visor/geometriafactory-visor.csproj`,
> `scripts/verify-visual-system.sh`, `scripts/build-visor.sh` y los documentos de
> `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/` que cada sección nombra.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. La forma del front

**Blazor Interactive Server** (`ADR-10001`): el render ocurre en el servidor y el navegador
sostiene un circuito. Es lo que hace cierta `RA-01` desde el otro lado —ningún guion del navegador
invoca el servicio de datos— y lo que obliga a tratar la **desconexión como superficie**
(`ADR-10005`), no como error.

**El front no tiene estado propio ni persistencia** (`ADR-10002`). Lo único que guarda del lado del
servidor es lo que la sesión necesita mientras dura —y las claves de protección de datos, que
desde el 2026-09-01 **sobreviven al proceso** (§4)—.

**Tres capas de presentación** (`ADR-10004`), contadas con `git ls-files` (27 `.razor` en total):

| Carpeta | Contenido | Archivos |
| --- | --- | --- |
| raíz | `App.razor`, `Routes.razor`, `_Imports.razor` | 3 |
| `Components/Layout/` | Armazones: `MainLayout`, `AccessShell`, `WorkShell` | 3 |
| `Components/Pages/` | Superficies con ruta (14) + `NotFoundSurface` | 15 |
| `Components/Shared/` | `DegradedStateOverlay`, `Icon`, `StagePlaceholder`, `VersionSeal` | 4 |
| `Components/Work/` | `JsonTree`, `WorkResolution` | 2 |

**Interactividad por página, no global** (`App.razor`, encabezado): la superficie que escribe la
marca de sesión tiene que responder a una petición HTTP de verdad, y dentro de un circuito las
cabeceras ya salieron. Medido con grep sobre `Components/Pages/`:

| Modo | Superficies |
| --- | --- |
| `@rendermode InteractiveServer` en la página (6) | `InitialDestination`, `InitialProvisioning`, `OwnCredentialSetup`, `OwnCredentialChange`, `Status`, `NotFoundPage` |
| Render estático de servidor con POST (`@formname` / `method="post"`) | `SignIn`, `AccountRegistration`, `OwnCredentialForcedChange`, `AccountsPanel`, `StudentWorkPanel`, `WorkSubmission` |
| Estático, sin formulario propio | `ClassSubmissionList`, `WorkView` (este último aloja `WorkResolution` con `@rendermode="InteractiveServer"` **en la instancia**, `WorkView.razor`:165) |

El prerrenderizado queda encendido: la puerta de la etapa `b` lee el `<h1>` del cuerpo HTTP
(`App.razor`). `blazor.web.js` se pide desde el encabezado con prioridad alta porque el anfitrión
publicado no ofrece WebSocket —sólo `ServerSentEvents` y `LongPolling`— (`App.razor`, medido el
2026-09-02 según su comentario).

## 2. Las quince rutas

| Ruta | Componente | Quién llega |
| --- | --- | --- |
| `/` | `InitialDestination` | Cualquiera: decide a dónde mandar según el estado del laboratorio y la sesión |
| `/aprovisionamiento-inicial` | `InitialProvisioning` | Anónimo, **sólo mientras no exista administrador** |
| `/ingreso` | `SignIn` | Anónimo |
| `/registro-de-cuenta` | `AccountRegistration` | Anónimo — **el registro es anónimo por diseño** |
| `/credencial-propia/establecer` | `OwnCredentialSetup` | Primer ingreso |
| `/credencial-propia/cambio-obligado` | `OwnCredentialForcedChange` | Cuenta con la marca de `INV-09` |
| `/mi-contrasena` | `OwnCredentialChange` | Con sesión |
| `/mis-trabajos` | `StudentWorkPanel` | Alumno |
| `/trabajo-nuevo` | `WorkSubmission` | Alumno |
| `/trabajos/{WorkId}/editar` | `WorkSubmission` | Alumno, sobre un borrador |
| `/trabajos/{WorkId}` | `WorkView` | Alumno (propio) o Administrador |
| `/entrega-comision` | `ClassSubmissionList` | Administrador |
| `/cuentas` | `AccountsPanel` | Administrador |
| `/estado` | `Status` | Diagnóstico del laboratorio, sin sesión |
| `/no-encontrado` | `NotFoundPage` | Cualquiera |

Quince directivas `@page` sobre catorce componentes con ruta (grep `^@page`); `NotFoundSurface`
**no lleva `@page`**: la alcanza la reejecución de `UseStatusCodePagesWithReExecute("/no-encontrado")`,
que conserva el 404.

## 3. La tubería: el orden es la decisión

De `src/GeometriaFactory.Web/Program.cs` (líneas 229–280). Desde el 2026-09-14/15 la tubería
**abre con dos piezas nuevas** antes de las páginas de estado:

```text
UseForwardedHeaders               ← nuevo (R-02, ADR-10009): primero de todo
UseSecurityHeaders                ← nuevo (Mesa-2026-09-15 D-3): después, porque HSTS mira https
UseStatusCodePagesWithReExecute("/no-encontrado")
UseStaticFiles
UseRouting
  ProvisioningGateMiddleware      ← guardián 1: corre ANTES de autenticar
UseAuthentication / UseAuthorization
  UnrestorableSessionMiddleware
  PanelSessionGateMiddleware      ← guardián 2
  StaleFormMiddleware
UseAntiforgery
MapRazorComponents<App>().AddInteractiveServerRenderMode()
```

| Pieza | Qué decide |
| --- | --- |
| `UseForwardedHeaders` | Resuelve la dirección real del navegador detrás del túnel. Confía **sólo** en las redes de `ForwardedHeaders:KnownNetworks` (misma llave que el servicio de datos); sin ninguna declarada, la cabecera entrante se ignora. Una red que no es CIDR **detiene el arranque** (`Program.cs`:180–198) |
| `UseSecurityHeaders` | `Integration/SecurityHeaders.cs`: las cabeceras de seguridad del front, con una CSP **sin `script-src` ni `style-src`** porque el marcado lleva guiones en línea (deuda `DD-R10-2`). Va después de `UseForwardedHeaders` porque HSTS mira si la petición llegó por `https`. Valores: [06_Persistencia-Y-Seguridad.md](06_Persistencia-Y-Seguridad.md) §9 |
| `ProvisioningGateMiddleware` | Mientras no exista administrador, **cualquier ruta desvía al aprovisionamiento inicial**; una vez que existe, el aprovisionamiento deja de armar formulario. **Corre antes de `UseAuthentication` porque mira el estado del laboratorio, no quién pide**, y después de `UseStaticFiles` para no interceptar recursos |
| `UnrestorableSessionMiddleware` | «Sesión no restablecible»: marca de sesión presente y testigo ausente (reciclado del proceso, `Web ADR-03` §6.1) |
| `PanelSessionGateMiddleware` | Ninguna ruta del panel es accesible sin sesión; sin marca, desvía a `/ingreso` |
| `StaleFormMiddleware` | Un envío que el marco no pudo verificar **no le muestra a la persona el error del marco**; va antes de `UseAntiforgery` porque la envuelve |

Los guardianes **acotan y no hacen cumplir**: quien verifica es el servicio de datos en cada
solicitud (comentarios de `Program.cs`). El detalle de las cabeceras como control de seguridad
está en [06_Persistencia-Y-Seguridad.md](06_Persistencia-Y-Seguridad.md).

`ProvisioningStateProbe` recuerda el «sí» para siempre y **no recuerda el «no» ni un segundo**,
para que el guardián 1 no cueste un viaje de red por navegación (`Program.cs`:153–158).

## 4. Cómo se sostiene la sesión, y cómo se habla con el servicio de datos

### 4.1 `Services/` — quince archivos

| Pieza | Responsabilidad |
| --- | --- |
| `SessionCookieDefaults` | Los valores fijos de la marca de sesión del navegador |
| `SessionClaims` | Lo **único** que la marca lleva adentro: identidad y papel |
| `SessionTokenStore` | **El testigo firmado del servicio de datos vive acá y en ningún otro lado** (`ADR-10003`); singleton |
| `SessionState` | La sesión vista desde adentro. **Nuevo: `ReplaceAccessToken`** (REF-02), que toma el acceso nuevo que devuelve el cambio de contraseña propia; sólo actúa sobre una sesión ya abierta en el custodio |
| `PendingCredentialChangeStore` | De quién es la cuenta en medio de un cambio forzado, contra una marca opaca: la pantalla no vuelve a pedir el correo |
| `DataProtectionState` | Dónde vive el almacén de claves y cuántas hay; lo declara `/estado` |
| `DataServiceReachability` | Si el servicio de datos responde, y desde cuándo se sabe (singleton, junto a `TimeProvider.System`) |
| `ProvisioningStateProbe` | Si el laboratorio ya tiene administrador (§3) |
| `StartupObservations` | Los avisos del marco **mientras arranca**, para declararlos en pantalla; la ventana se cierra en `ApplicationStarted` |
| `DeclaredDateText` | Cómo se **lee** la fecha que el alumno declaró. **No la convierte: sólo la presenta** |
| `VersionIdentity` | **Nuevo (R-14).** La identidad de versión, resuelta una vez en la composición (§6) |
| Los cuatro intermediarios | Ver §3 |

**La marca de sesión** (`Program.cs`:115–141): `HttpOnly`, `SameSite=Strict`, `Secure` siempre
fuera de Development (en Development, `SameAsRequest`), sin `MaxAge` (dura la ventana), 8 h con
vencimiento deslizante, y `/ingreso` como destino de login, logout y acceso denegado.

**Las claves de protección de datos** (`Program.cs`:62–105): `PersistKeysToFileSystem` en
`App_Data/claves` (o `DataProtection:KeysDirectory`), `SetApplicationName("GeometriaFactory.Web")`,
y **el arranque falla si el directorio no se puede escribir**. Quedan sin cifrar en disco como
apartamiento declarado. El porqué y el respaldo, en
[06_Persistencia-Y-Seguridad.md](06_Persistencia-Y-Seguridad.md).

### 4.2 `Integration/` — cuatro archivos

| Pieza | Qué hace |
| --- | --- |
| `DataServiceClient` | Cliente tipado; `BaseAddress` = `ApiBaseUrl`, timeout 10 s. **Desde `de0b73b` antepone `v1/` a toda ruta del contrato** (`ContractPrefix`) **salvo `salud`**; la interpretación `A-18` pasa de `"/interpretaciones"` a `v1/interpretaciones` |
| `DataServiceOutcome` | El desenlace de cada llamada: valor o error tipado |
| `BrowserOriginForwardingHandler` | **Nuevo** (`ADR-10009`). Agrega `X-Forwarded-For` con la dirección del navegador **sólo si la llamada corre dentro de una petición HTTP del navegador** (ingreso, registro, cambio obligado); en el circuito no agrega nada. **Reemplaza** cualquier valor previo: el navegador no elige su partición |
| `SecurityHeaders` | **Nuevo.** Ver §3 |

`ChangeOwnPasswordAsync` devuelve ahora `DataServiceOutcome<string?>`: con sesión, el **acceso
nuevo** que emitió el servicio (el cambio revoca los anteriores, REF-02 / commit `7c94988`); sin
sesión (cambio forzado), nulo. `OwnCredentialChange.razor` lo pasa a `Session.ReplaceAccessToken`.

**`ApiBaseUrl` es obligatoria**: `Program.cs`:204–206 lanza si falta. El valor versionado en
`appsettings.json` es el del contenedor de desarrollo, `http://localhost:5080/`. Las rutas y los
códigos, en [04_Superficie-HTTP-Y-Contratos.md](04_Superficie-HTTP-Y-Contratos.md).

La credencial **nunca llega al navegador**: viaja del front al servicio de datos servidor a
servidor.

## 5. El sistema visual, y la puerta que lo cuida

| Archivo | Líneas (`wc -l`) | Papel |
| --- | ---: | --- |
| `wwwroot/css/app.css` | 1.247 | Todo el sistema visual; **bloque `:root` en las líneas 41–165** (las 1–40 son el comentario de cabecera) |
| `wwwroot/css/scaffold.css` | 19 | Andamiaje de la etapa `a`; sólo lo carga `/estado` por `<HeadContent>`, y por eso puede tener literales de color |
| `wwwroot/interaction/surface-interaction.js` | 723 | **El único guion propio de la pieza pública**: copiar, estado en curso, acción habilitada por coincidencia, diálogos; además invoca a `window.GeometriaFactoryViewer` |

**Los tokens de `:root`**: 65 propiedades distintas (grep `--nombre:` en el bloque `:root`, líneas 41–165) —fondo,
texto y borde; marca y cuatro acentos de módulo (`--color-accent-module-a..d`); éxito, aviso,
error e información; `--type-*` (cinco tamaños con su peso), interlínea y medida; **nueve pasos**
`--space-1..9`; radios, bordes, movimiento y ancho de la barra lateral. Hay un bloque
`prefers-reduced-motion` (línea 167) y tres bloques `@media (max-width: 768px)` (líneas 886, 1141
y 1243).

**Los atributos `data-gf-*`**: 27 distintos aparecen hoy en el marcado y en el guion (grep);
`scripts/verify-stage-c.sh` C-4 (línea 272) autoriza una lista cerrada de **30**, ampliada de 17 a
30 el 2026-09-14 (`changelog.md`, «La puerta `c` autoriza los trece atributos…»). La puerta es de
[07_Pruebas-Y-Puertas-De-Calidad.md](07_Pruebas-Y-Puertas-De-Calidad.md).

`scripts/verify-visual-system.sh` (102 líneas, sin .NET) es la puerta del sistema visual, con
**cinco controles de pasa/falla**. Las cifras de la columna derecha se recontaron el 2026-10-26
replicando cada control en un directorio temporal (la puerta escribe en `/tmp`):

| Control | Qué exige | Medido sobre `4b114d7` |
| --- | --- | --- |
| `C-1` | Ningún literal de color en `app.css` fuera del bloque `:root` | 0 literales después de la línea 165 |
| `C-2` | Ningún atributo `style=` en línea en ningún `.razor` | 0 en 27 `.razor` |
| `C-3` | Toda clase `gf-*` que un `.razor` usa está definida en `app.css` | 128 usadas, todas entre las 174 definidas |
| `C-4` | **Los tokens de `app.css` son exactamente los de la maqueta aprobada** (`SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css`) | 54 renglones de declaración, idénticos |
| `C-5` | Toda clase que la versión angosta **enciende** la emite algún componente | 2 encendidas (`gf-stacked-cards`, `gf-table-wrapper`), las dos con emisor |

**`C-4` es la razón por la que la escala vive en los tokens y no en una hoja aparte**: una capa
adicional habría hecho divergir los dos catálogos y la puerta lo habría rechazado. Por lo mismo,
el ajuste de contraste de `--color-text-tertiary` (hoy `#71716B`, `app.css`:54) se hizo en las
dos hojas.

**`C-5` existe porque `C-3` no lo cubría**: `C-3` mira si toda clase usada está definida, y por
construcción no ve una clase definida y encendida que nadie emite. Fue `MI-02` (P0 votado 5-0 el
2026-08-31): por debajo de 768 px las tres superficies de lista no dibujaban ninguna fila, con los
cuatro controles anteriores en verde (`verify-visual-system.sh`:16–26).

### 5.1 Lo que dejó la mesa de UX/UI del 2026-09-03

`changelog.md`, entrada «Lo que la segunda mesa de UX/UI midió y reparó — 2026-09-03» (ya no es la
última: le siguen treinta y nueve entradas `## `). El sistema visual pasó sin observaciones y se hicieron
**doce reparaciones puntuales**: `--color-text-tertiary` llevado a 4,91:1, reparto declarado de
columnas por forma de tabla, proporción invertida en el envío, peso visual de «Dar de baja»,
indicador de espera (`data-gf-pending`) en los tres filtros, `aria-invalid` en el campo que falló,
filtros que no se dibujan sobre listas vacías, y **jerga de implementación retirada de cuatro
lugares** (`Experiencia-De-Uso.md` §2.1 y §6).

**Sigue abierto** (ninguna entrada posterior del `changelog.md` lo cierra): la acción primaria del
envío fuera de la primera pantalla, y en «Entrega de la comisión» un alumno filtrado sin entregas
que muestra el vacío de colección y no el de filtro.

## 6. El sello de versión (`R-14`)

`Components/Shared/VersionSeal.razor` (CMP-09) va en las **dos ubicaciones obligatorias** que
declara `Representacion-Sello-De-Version.md` §2–§3: `AccessShell` y `WorkShell` (grep). Hasta el
2026-09-14 decía «Versión no identificada» siempre; desde `059311e` (`Mesa-2026-09-14.md` R-14,
PR #222) lee `VersionIdentity`, registrado como singleton en `Program.cs`:163.

| `AssemblyInformationalVersion` (la escribe MinVer: `<versión>+<sha>`) | Variante | Lo que se dibuja |
| --- | --- | --- |
| Sin atributo, vacío, o que empieza con `0.0.0` | Origen indeterminado | `Versión no identificada` |
| Versión con `-` (p. ej. `-alpha.0.N`, el caso de `main`) | Preliminar | `Versión <v>` + distintivo `preliminar` (`gf-badge--warning`) |
| Versión sin `-` | Publicada | `Versión <v>` |

- **El sello no compone ni reformatea la versión** (§4 del documento): la recibe formada.
- **El identificador de construcción (lo posterior al `+`) no se muestra en la línea**: §4 lo
  reserva para el detalle.
- **No hecho y declarado**: el detalle de diagnóstico —construcción, origen, «copiar para
  reportar»— sigue sin dibujarse (`VersionSeal.razor`, comentario; `changelog.md` 2026-09-14).
- La misma fuente alimenta `/salud` del servicio de datos. Cómo se calcula la versión (MinVer,
  etiquetas), en [08_DevOps-Construccion-Y-Despliegue.md](08_DevOps-Construccion-Y-Despliegue.md).

## 7. El registro: dominio admitido y aviso de datos personales

`Components/Pages/AccountRegistration.razor` sumó dos cosas desde la 3.0:

| Cambio | Fuente | Qué hace |
| --- | --- | --- |
| Nuevo desenlace `EmailDomainNotAdmitted` | `203c4e9`; `Api ADR-00012`; R-07 / E-1 | Traduce `ErrorCode.EmailDomainNotAdmitted`: banner de error («Registrate con tu correo institucional. Todavía no se registró nada.»), marca el campo con `gf-field--error` y `aria-invalid`. **No nombra los dominios ni dice si el correo tenía cuenta** |
| Aviso de tratamiento de datos personales | `0a154ca`; PR #229; `Mesa-2026-09-14.md` REF-01, escalada E-3 | Un `<p class="gf-caption" id="registration-privacy">` **antes del botón**, que lo referencia con `aria-describedby` |

El aviso dice, literal: qué se guarda (correo, nombre y apellido), para qué (identificar los
trabajos en este laboratorio), quién lo ve (el docente de la comisión), que **no se envían correos
ni se comparten**, y cómo corregirlos o darse de baja (pedírselo al docente). Su comentario
declara que «afirma sólo lo que el producto hace hoy» y que la finalidad, la retención de
respaldos y la supresión son del Product Owner en el intake.

Que el mecanismo de dominios **rija** depende de que la composición declare el dominio, y la mesa
del 2026-09-15 (D-2) decidió **no declararlo** todavía (`DD-R10-1`). La regla de negocio y el
contrato están en [03_Dominio-Y-Reglas-De-Negocio.md](03_Dominio-Y-Reglas-De-Negocio.md) y
[04_Superficie-HTTP-Y-Contratos.md](04_Superficie-HTTP-Y-Contratos.md).

## 8. El visor

**Un proyecto Node independiente**, en `visor/` y no bajo `src/`, para que las dos cadenas de
herramientas no compartan raíz. Desde el 2026-09-12 además aparece en `GeometriaFactory.sln`
como nodo **inerte** (§8.4).

| Aspecto | Valor |
| --- | --- |
| Fuentes (`wc -l`) | `src/main.ts` (fachada, 137), `src/contract.ts` (tipos, 87), `src/viewer/instance.ts` (404), `meshes.ts` (200), `palette.ts` (60), `viewer/README.md` (8) |
| Empaquetado | webpack 5.95.0 + webpack-cli 5.1.4, `ts-loader` 9.5.1, TypeScript 5.6.3, `@types/three` 0.169.0 (`package.json`) → `dist/geometriafactory-visor.js` (sin `devtool` en `webpack.config.js`, el modo production no emite `.map`; `scripts/build-visor.sh`:29 y `DeclareVisorAsset` lo copian o declaran sólo si existe) |
| Global expuesto | `GeometriaFactoryViewer` (`library.type: 'window'`) |
| Motor de dibujo | **three.js 0.169.0 empaquetado adentro**, `externals: {}`, sin red de distribución (`ADR-12004`) |
| Presupuesto de tamaño | 560 KiB (`maxAssetSize` y `maxEntrypointSize` = `560 * 1024`, `hints: 'warning'`); el umbral salió de 483 KiB medidos el 2026-08-16. El bundle medido el 2026-09-06 pesaba 501.676 bytes (commit `6fa6844`; `changelog.md`:1099). El bundle no se versiona, así que **no se re-midió** |
| Destino en el front | `wwwroot/js/geometriafactory-visor.js`; la carpeta sólo versiona `.gitkeep` y `README.md` |

### 8.1 La fachada: seis funciones planas

`ADR-12002`. Es **el punto de extensión del producto** (`Extensibilidad.md` §2, que lo toma de
`PRODUCT-INTAKE` §18). Exportaciones de `main.ts` (grep `export`):

| Función | Línea | Qué hace |
| --- | ---: | --- |
| `initialize(element, options?)` → `string` | 45 | Crea una escena en un elemento y devuelve el identificador de la instancia |
| `loadPieces(id, pieces)` → `DrawOutcome` | 72 | Dibuja las piezas **ya reconstruidas** y declara las no dibujadas (`UndrawnPiece`) |
| `selectPiece(id, index)` | 83 | Selecciona por **índice**, que es la identidad de la pieza |
| `resize(id)` | 96 | Reacomoda la escena al tamaño del recuadro |
| `destroy(id)` | 108 | Libera la instancia |
| `setMotion(id, options)` | 120 | Prende o apaga los dos movimientos (`MotionOptions`) |

`liveInstanceCount()` (línea 135) se exporta además como **instrumento de medición de `PT-02`**,
no como superficie. Los seis tipos (`DrawOutcome`, `MotionOptions`, `Piece`, `PieceComponent`,
`UndrawnPiece`, `ViewerOptions`) se reexportan desde `contract.ts` (línea 27). **La única vía del
visor hacia el anfitrión** es `ViewerOptions.onPieceSelected` (`contract.ts`:75; `ADR-08007`),
que `instance.ts` invoca al seleccionar desde la escena.

### 8.2 Las tres reglas que el visor sostiene

- **`RA-02` · visualizador puro**: sin red, sin configuración, sin identidad. La puerta cuenta
  cero formas de petición **en el fuente y en el bundle generado** (`ADR-12003`).
- **Recibe piezas reconstruidas, no el texto** (`SDD/Docs/Producto/Adrs/ADR-08006`). Por eso existe
  `A-18`.
- **Disposición determinista derivada del índice** (`ADR-12005`): la misma entrada dibuja lo mismo,
  y el árbol del texto y la escena se sincronizan por índice.

El anfitrión lo aísla tras su fachada (`ADR-10006`): el front nunca toca three.js directamente;
sólo `surface-interaction.js` llama a `window.GeometriaFactoryViewer`.

### 8.3 Quién genera el bundle: el `.csproj` del front (`ADR-10008`)

Cambio central del período (`6cc6f86`, 2026-09-12). Antes, `scripts/build-visor.sh` se invocaba a
mano desde cuatro lugares y **un clon limpio construía un front sin visor sin que nada fallara**.
Ahora lo genera `src/GeometriaFactory.Web/GeometriaFactory.Web.csproj` con tres targets
(`BuildVisor`, `DeclareVisorAsset`, `SealVisorAsset`), descritos en
[08_DevOps-Construccion-Y-Despliegue.md](08_DevOps-Construccion-Y-Despliegue.md) §2. Lo que importa
del lado del front es el sello que deja `SealVisorAsset` en `VisorSeal.Value`:

`WorkSubmission.razor` y `WorkView.razor` piden `js/geometriafactory-visor.js?v=@VisorSeal.Value`
(con `defer`; `WorkView` además `fetchpriority="low"`). No se usa `MapStaticAssets` porque sus
rutas se resuelven después de `UseRouting`, dentro del alcance del guardián 1 (comentario del
`.csproj`).

`scripts/build-visor.sh` (33 líneas) sigue siendo el ciclo corto: `npm ci` (o `npm install` si no
hay archivo de bloqueo), `npm run build` y copia a `wwwroot/js/`. Fuera del `.csproj` hoy sólo lo
**invoca** la etapa `node:22` de `deploy/Dockerfile.web` (líneas 46–48), que el ADR conserva a
propósito; en `scripts/verify-stage-g.sh`:65 y `scripts/verify-viewer-lifecycle.sh`:33 aparece
sólo como mensaje. La imagen, en [08_DevOps-Construccion-Y-Despliegue.md](08_DevOps-Construccion-Y-Despliegue.md).

### 8.4 El nodo de solución `visor/geometriafactory-visor.csproj`

SDK `Microsoft.Build.NoTargets/3.7.56`, `EnableDefaultItems=false` (evita arrastrar `node_modules/`)
y un único `None Include` por glob de fuentes, configuración y `verification/**`. **No tiene
`Exec` ni `ProjectReference`**: la arista `Visor → Web` sigue siendo un activo de construcción.
Existe por la decisión del PO del 2026-09-11 de que todo proyecto de código quede bajo el árbol de
solución (comentario del archivo).

### 8.5 Cómo se verifica

`visor/verification/` guarda las dos páginas y guiones con que se miden `PT-02` y la etapa `g`:

| Archivo | Líneas | Qué mide |
| --- | ---: | --- |
| `lifecycle.html` + `lifecycle.mjs` | 22 + 171 | `PT-02`: diez ciclos de creación y liberación sobre el paquete construido, con Chromium de Playwright, usando las piezas del escenario `E-1` del intake |
| `stage-g.html` + `stage-g.mjs` | 27 + 214 | La puerta de la etapa `g` |

Los guiones que los corren son `scripts/verify-viewer-lifecycle.sh` y `scripts/verify-stage-g.sh`;
sus umbrales están en [07_Pruebas-Y-Puertas-De-Calidad.md](07_Pruebas-Y-Puertas-De-Calidad.md). Los
samples que ejercen la fachada sin backend, en [09_Samples-Ejecutables.md](09_Samples-Ejecutables.md).

## 9. Lo que cambió en este dominio entre `89f3ab3` y `4b114d7`

`git log 89f3ab3..4b114d7 -- src/GeometriaFactory.Web visor` da nueve commits; 22 archivos del
dominio y de `scripts/` cambiaron.

| Commit | Qué tocó en el front o el visor |
| --- | --- |
| `6cc6f86` | `BuildVisor`/`DeclareVisorAsset`/`SealVisorAsset`; nodo `visor/*.csproj`; `?v=` en las dos páginas |
| `de0b73b` | `DataServiceClient` antepone `v1/` |
| `7c94988` | El cambio de contraseña propia devuelve acceso nuevo; `SessionState.ReplaceAccessToken` |
| `ed097f8` | `UseForwardedHeaders` + `BrowserOriginForwardingHandler` (`ADR-10009`) |
| `203c4e9` | Desenlace `EmailDomainNotAdmitted` en el registro |
| `059311e` (+ merge `9befaba`) | `VersionIdentity` y el sello con tres variantes |
| `0a154ca` | Aviso de datos personales en el registro |
| `f68ae34` | `SecurityHeaders` en la tubería (D-3) |

Las contradicciones medidas entre lo que dicen los comentarios y documentos de este dominio y lo
que hay en el árbol (encabezado de `App.razor`, aviso del registro frente al intake 5.1,
comentarios de «etapa `a`» en el visor, rutas `SDD/Docs/Proyectos/…`) se registran en
[12_Observaciones-Del-Indexado.md](12_Observaciones-Del-Indexado.md).
