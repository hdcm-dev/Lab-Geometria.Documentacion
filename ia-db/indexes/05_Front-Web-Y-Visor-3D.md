# 05 · Front web y visor 3D — las pantallas, sus guardianes y la escena

> **Propósito.** Qué pantallas existen, quién puede llegar a cada una, cómo se sostiene la sesión,
> y qué hace exactamente el bundle del visor.
> **Fuente primaria.** `src/GeometriaFactory.Web/`, `visor/src/`, `visor/package.json`,
> `visor/webpack.config.js`, `Web/03-UX-UI-DX/Experiencia-De-Uso.md` y
> `scripts/verify-visual-system.sh`. Verificado el 2026-09-11 sobre la revisión `89f3ab3`.

---

## 1. La forma del front

**Blazor Interactive Server** (`ADR-10001`): el render ocurre en el servidor y el navegador
sostiene un circuito. Es lo que hace cierta `RA-01` desde el otro lado —ningún guion del navegador
invoca el servicio de datos— y lo que obliga a tratar la **desconexión como superficie**
(`ADR-10005`), no como error.

**El front no tiene estado propio ni persistencia** (`ADR-10002`). Lo único que guarda del lado del
servidor es lo que la sesión necesita mientras dura — y las claves de protección de datos, que
desde el 2026-09-01 **sobreviven al proceso** (§4).

**Tres capas de presentación** (`ADR-10004`): `Components/Layout/` (armazones: `MainLayout`,
`AccessShell`, `WorkShell`), `Components/Pages/` (superficies con ruta) y `Components/Shared/` +
`Components/Work/` (componentes reutilizables: `DegradedStateOverlay`, `Icon`, `StagePlaceholder`,
`VersionSeal`, `JsonTree`, `WorkResolution`).

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

Quince directivas `@page` sobre catorce componentes con ruta; `NotFoundSurface` **no lleva
`@page`**: la alcanza la reejecución de `UseStatusCodePagesWithReExecute("/no-encontrado")`.

## 3. La tubería: cuatro intermediarios, en este orden

De `src/GeometriaFactory.Web/Program.cs` (líneas 193–238). **El orden es la decisión**, no un
detalle:

```text
UseStatusCodePagesWithReExecute("/no-encontrado")
UseStaticFiles
UseRouting
  ProvisioningGateMiddleware      ← guardián 1: corre ANTES de autenticar
UseAuthentication / UseAuthorization
  UnrestorableSessionMiddleware
  PanelSessionGateMiddleware      ← guardián 2
  StaleFormMiddleware
UseAntiforgery
MapRazorComponents<App>
```

| Intermediario | Qué decide |
| --- | --- |
| `ProvisioningGateMiddleware` | Mientras no exista administrador, **cualquier ruta desvía al aprovisionamiento inicial**; y una vez que existe, el aprovisionamiento deja de ser alcanzable. **Corre antes de `UseAuthentication` porque su decisión no mira quién pide: mira el estado del laboratorio.** Corre después de `UseStaticFiles` para no interceptar los recursos |
| `UnrestorableSessionMiddleware` | El estado «sesión no restablecible»: marca de sesión presente y testigo ausente |
| `PanelSessionGateMiddleware` | Ninguna ruta del panel es accesible sin sesión; sin marca, desvía a `/ingreso` |
| `StaleFormMiddleware` | Un envío que el marco no pudo verificar **no le muestra a la persona el error del marco** |

`ProvisioningStateProbe` responde si el laboratorio ya tiene administrador y **recuerda la
respuesta afirmativa para siempre**, para que el guardián 1 no cueste una petición por navegación.

**`ApiBaseUrl` es obligatoria**: `Program.cs` lanza si falta («La dirección del servicio de datos
llega por configuración»). El valor versionado en `appsettings.json` es el del contenedor de
desarrollo, `http://localhost:5080/`.

## 4. Cómo se sostiene la sesión

Los catorce servicios de `Services/`:

| Pieza | Responsabilidad |
| --- | --- |
| `SessionCookieDefaults` | Los valores fijos de la marca de sesión del navegador |
| `SessionClaims` | Lo **único** que la marca lleva adentro: identidad y papel |
| `SessionTokenStore` | **El testigo firmado del servicio de datos vive acá y en ningún otro lado** (`ADR-10003`) |
| `SessionState` | La sesión vista desde adentro: identidad, papel y el testigo que el cliente adjunta |
| `PendingCredentialChangeStore` | De quién es la cuenta en medio de un cambio forzado, del lado del servidor y contra una marca opaca |
| `DataProtectionState` | Dónde vive el almacén de claves de protección de datos, y cuántas hay. **Las claves sobreviven al proceso y el sitio lo declara** |
| `DataServiceReachability` | Si el servicio de datos responde, y desde cuándo se sabe |
| `ProvisioningStateProbe` | Si el laboratorio ya tiene administrador (ver §3) |
| `StartupObservations` | Los avisos que el marco emite **mientras arranca**, guardados para que el producto los declare en pantalla en vez de esperar a que alguien abra un archivo |
| `DeclaredDateText` | Cómo se **lee** la fecha que el alumno declaró. **No la convierte: sólo la presenta** |
| Los cuatro intermediarios | Ver §3 |

La credencial **nunca llega al navegador**: viaja del front al servicio de datos servidor a
servidor.

## 5. El sistema visual, y la puerta que lo cuida

`wwwroot/css/app.css` (1.247 líneas) define **todos los tokens en `:root`**: color de fondo,
texto y borde; marca y cuatro acentos de módulo; estados de éxito, aviso, error e información;
tipografía (`--type-*`), interlínea y medida; nueve pasos de espaciado; radios, bordes, movimiento
y ancho del armazón. `scaffold.css` es lo mínimo del andamiaje.
`wwwroot/interaction/surface-interaction.js` es la única interacción de superficie autorizada del
lado del navegador (norma §6.17).

`scripts/verify-visual-system.sh` es la puerta, con **cinco controles de pasa/falla**:

| Control | Qué exige |
| --- | --- |
| `C-1` | Ningún literal de color en `app.css` fuera del bloque `:root` |
| `C-2` | Ningún atributo `style=` en línea en ningún `.razor` |
| `C-3` | Toda clase `gf-*` que un `.razor` usa está definida en `app.css` |
| `C-4` | **Los tokens de `app.css` son exactamente los de la maqueta aprobada** |
| `C-5` | Toda clase que la versión angosta **enciende** la emite algún componente |

**`C-4` es la razón por la que la escala vive en los tokens y no en una hoja aparte**: una capa
adicional habría hecho divergir los dos catálogos y la puerta lo habría rechazado.

**`C-5` existe porque `C-3` no lo cubría**: `C-3` pregunta si toda clase usada está definida, y no
si toda clase encendida por la versión angosta la emite alguien. La diferencia era invisible con
los cinco controles anteriores en verde y la batería entera pasando.

## 6. Lo que las dos mesas de UX/UI dejaron

**Mesa del 2026-09-03** (`changelog.md`, última entrada): el sistema visual pasó sin
observaciones —escala tipográfica, espaciado, anillo de foco, marca del ítem activo y fichas de la
versión angosta— y se hicieron **doce reparaciones puntuales**: contraste de
`--color-text-tertiary` llevado a 4,91:1, reparto declarado de columnas por forma de tabla,
proporción invertida en el envío, peso visual de «Dar de baja», indicador de espera en los tres
formularios de filtro, `aria-invalid` en el campo que falló, filtros que no se dibujan sobre listas
vacías, y **jerga de implementación retirada de cuatro lugares** —`Experiencia-De-Uso.md` §2.1 y §6
la prohíben con todas las letras—.

**Queda abierto**: la acción primaria del envío sigue fuera de la primera pantalla, y en «Entrega
de la comisión» un alumno filtrado sin entregas muestra el vacío de colección y no el de filtro.

## 7. El visor

**Un proyecto Node independiente**, en `visor/` y no bajo `src/`, para que las dos cadenas de
herramientas no compartan raíz.

| Aspecto | Valor |
| --- | --- |
| Fuentes | `src/main.ts` (fachada, 114 líneas), `src/contract.ts` (tipos), `src/viewer/instance.ts`, `meshes.ts`, `palette.ts` (+ `viewer/README.md`) |
| Empaquetado | webpack 5.95.0 + webpack-cli 5.1.4, `ts-loader` 9.5.1, TypeScript 5.6.3 → `dist/geometriafactory-visor.js` (+ `.map`) |
| Global expuesto | `GeometriaFactoryViewer` (`library.type: window`) |
| Motor de dibujo | **three.js 0.169.0 empaquetado adentro**, no por red de distribución (`ADR-12004`) |
| Presupuesto de tamaño | 560 KB (`maxAssetSize` y `maxEntrypointSize` de `webpack.config.js`); el bundle medido el 2026-09-06 pesa 501.676 bytes (commit `6fa6844`) |
| Cómo llega al front | `scripts/build-visor.sh` copia el bundle a `wwwroot/js/` — es el **activo de construcción** `Visor → Web`. En la imagen del front lo produce la etapa `node:22` de `deploy/Dockerfile.web` |

### 7.1 La fachada: seis funciones planas

`ADR-12002`. **Es el único punto de extensión declarado del producto** (`Extensibilidad.md`).

| Función | Qué hace |
| --- | --- |
| `initialize(element, options?)` → `string` | Crea una escena en un elemento y devuelve el identificador de la instancia |
| `loadPieces(id, pieces)` → `DrawOutcome` | Dibuja las piezas **ya reconstruidas** y declara las no dibujadas (`UndrawnPiece`) |
| `selectPiece(id, index)` | Selecciona por **índice**, que es la identidad de la pieza |
| `resize(id)` | Reacomoda la escena al tamaño del recuadro |
| `setMotion(id, options)` | Prende o apaga los dos movimientos (`MotionOptions`) |
| `destroy(id)` | Libera la instancia |

`liveInstanceCount()` se exporta además como **instrumento de verificación** de la puerta `PT-02`,
que mide que no haya degradación tras diez ciclos de creación y liberación. Los tipos
(`DrawOutcome`, `MotionOptions`, `Piece`, `PieceComponent`, `UndrawnPiece`, `ViewerOptions`) se
reexportan desde `contract.ts`.

### 7.2 Las tres reglas que el visor sostiene

- **`RA-02` · visualizador puro**: sin red, sin configuración, sin identidad. La puerta se mide
  **sobre el bundle generado** y no sobre el fuente (`ADR-12003`) — es la mitigación de `RI-04`.
- **Recibe piezas reconstruidas, no el texto** (`ADR-08006`). Por eso existe `A-18`.
- **Disposición determinista derivada del índice** (`ADR-12005`): la misma entrada dibuja lo mismo,
  y el árbol del texto y la escena se sincronizan por índice.

El anfitrión lo aísla tras su fachada (`ADR-10006`): el front nunca toca three.js directamente.
`visor/verification/` guarda las dos páginas y guiones (`lifecycle.*`, `stage-g.*`) con que se
miden `PT-02` y la etapa `g`.
