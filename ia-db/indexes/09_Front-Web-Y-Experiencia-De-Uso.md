# 09 · Front web Blazor: pantallas, experiencia de uso, sistema visual y maquetas

> **Propósito:** ubicar cada pantalla del front (`GeometriaFactory.Web`), sus componentes, su cliente hacia el servicio de datos, los servicios de presentación y los documentos de experiencia (especificación funcional Web, wireframes, línea base visual, representaciones, maquetas HTML) que la gobiernan.
> **Fuente primaria:** `src/GeometriaFactory.Web/Components/` y `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/03-UX-UI-DX/Experiencia-De-Uso.md`.
> **Revisión:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** guardianes de sesión, cookie, almacén de token, cabeceras (→ `08`); el visor 3D por dentro (→ `10`); la publicación del front (→ `12`); las ADR como decisiones (→ `15`); las puertas que verifican estas pantallas (→ `11`).

---

## 1. Mapa rápido

| Necesitás… | Andá a |
| --- | --- |
| Qué ruta dibuja qué superficie | §2 |
| Shells, componentes compartidos y de trabajo | §3 |
| Cómo habla el front con la Api | §4 |
| Servicios de presentación (no de seguridad) | §5 |
| CSS, iconos y el único guion propio | §6 |
| Especificación funcional y CU-10001..10010 | §7 |
| Wireframes, línea base, representaciones, UX | §8 |
| Maquetas HTML y su bitácora | §9 |

---

## 2. Rutas `@page` (15) y superficies

Las once superficies `SUP-10001..10011` las fija `Linea-Base-Visual.md` §2; las rutas son castellanas. Todas bajo `src/GeometriaFactory.Web/Components/Pages/` salvo indicación.

| Ruta | Componente | Shell (`@layout`) | Superficie / CU | Nota |
| --- | --- | --- | --- | --- |
| `/` | `InitialDestination.razor` | `AccessShell` | NAV-01 / NAV-03 | Raíz que explica por qué elegir entre «Configurar el laboratorio» (`/aprovisionamiento-inicial`) e «Ingresar al laboratorio» (`/ingreso`); se ve sólo cuando el guardián de aprovisionamiento no puede decidir porque el servicio de datos está caído (Web ADR-10003 §6; `InitialDestination.razor` l. 40–49) |
| `/aprovisionamiento-inicial` | `InitialProvisioning.razor` | `AccessShell` | SUP-10001 · CU-10004 FA-03/04 | Sin acción secundaria ni «cancelar» |
| `/registro-de-cuenta` | `AccountRegistration.razor` | `AccessShell` | SUP-10002 · CU-10001 | Tres campos, ningún campo de contraseña; dominios admitidos (Api ADR-00012) |
| `/ingreso` | `SignIn.razor` | `AccessShell` | SUP-10003 · CU-10002 | Mensaje único que no distingue correo de contraseña; estado `sesion-no-restablecible` y «página vieja» |
| `/credencial-propia/establecer` | `OwnCredentialSetup.razor` | `AccessShell` | SUP-10004 · CU-10003 (establecimiento) | |
| `/credencial-propia/cambio-obligado` | `OwnCredentialForcedChange.razor` | `AccessShell` | SUP-10004 · CU-10003 (forzado, F-26) | Dice de quién es la cuenta |
| `/mi-contrasena` | `OwnCredentialChange.razor` | `WorkShell` | SUP-10004 · CU-10003 (voluntario) | Aviso «todavía no se puede» hasta enganchar el circuito |
| `/mis-trabajos` | `StudentWorkPanel.razor` | `WorkShell` | SUP-10005 · CU-10006 | Acción primaria también en vacío; mensaje neutro ajeno/inexistente (RN-03) |
| `/trabajo-nuevo` · `/trabajos/{WorkId}/editar` | `WorkSubmission.razor` | `WorkShell` | SUP-10006 · CU-10005 | Carga el bundle del visor con sello `?v=` SHA-256 |
| `/trabajos/{WorkId}` | `WorkView.razor` | `WorkShell` | SUP-10007 · CU-10007 | Aloja `WorkResolution` (SUP-10008) para el administrador |
| `/cuentas` | `AccountsPanel.razor` | `WorkShell` | SUP-10009 · CU-10004 | Provisoria visible una vez; diálogo irreversible sin Escape |
| `/entrega-comision` | `ClassSubmissionList.razor` | `WorkShell` | SUP-10010 · CU-10008 | Grupos con `<details>`; sin filtros sobre colección vacía (H-13) |
| `/estado` | `Status.razor` | `MainLayout` | Apartamiento AP-03 (no es superficie) | Salud de la pieza y observaciones del arranque; `css/scaffold.css` |
| `/no-encontrado` | `NotFoundPage.razor` → `NotFoundSurface.razor` | `AccessShell` | Propuesta declarada | Reejecución de `UseStatusCodePagesWithReExecute` |

Conteo: 15 directivas `@page` en 14 archivos (`WorkSubmission` declara dos). `Routes.razor` y `App.razor` en la raíz del proyecto; `App.razor` fija la interactividad por página y no global: ni `<Routes />` ni `<HeadOutlet />` llevan modo de render, y las páginas declaran `@rendermode InteractiveServer` una por una (comentarios de `App.razor`); `Ingreso` (`SignIn.razor`) es la única superficie estática a propósito, y `WorkView` declara el modo sólo en la instancia de `WorkResolution` (`WorkView.razor` l. 165). SUP-10011 (estado degradado) no tiene ruta: es superposición (§3).

---

## 3. Layouts y componentes

| Archivo | Rol | Fuente de diseño |
| --- | --- | --- |
| `Components/Layout/AccessShell.razor` | Shell de acceso; segunda ubicación obligatoria del sello de versión | `Experiencia-De-Uso.md` §3.2 (diagrama 1) |
| `Components/Layout/WorkShell.razor` | Shell de trabajo: navegación con `aria-current="page"`, carga real de documento en superficies que dibujan, indicador permanente del estado del servicio de datos (H-06) | `Experiencia-De-Uso.md` §3.2 (diagrama 2) |
| `Components/Layout/MainLayout.razor` | Layout mínimo de `/estado` | — |
| `Components/Shared/DegradedStateOverlay.razor` | SUP-10011 · CU-10010: un `span` por tramo; el marco aplica la clase de estado | `Wireframes-Estado-Degradado-Y-Reconexion.md` |
| `Components/Shared/VersionSeal.razor` | CMP-09 sello de versión (dos ubicaciones) | `Representacion-Sello-De-Version.md` §2 |
| `Components/Shared/Icon.razor` | Catálogo de iconos portado de la constante `ICONOS` de la maqueta; tamaños `gf-icon--16/20/24` | `SDD/Maquetas/GeometriaFactory-Web/assets/js/Maqueta.js`; norma §6.12 |
| `Components/Shared/StagePlaceholder.razor` | Aviso de pantalla en construcción | — |
| `Components/Work/JsonTree.razor` | Árbol del texto; raíz nula si no se pudo leer; despliega dos niveles al abrir | `Wireframes-Vista-De-Trabajo.md` |
| `Components/Work/WorkResolution.razor` | SUP-10008 · CU-10009: aprobar/rechazar con comentario opcional y retirar; no lleva `@page`; se dibuja interactivo dentro de SUP-10007; aviso de falla sobre los botones; cada control abre su diálogo | `Wireframes-Resolucion-Del-Trabajo.md` §3 |
| `_Imports.razor` | Usings comunes de los componentes | — |

---

## 4. Cliente servidor-a-servidor

| Elemento | Fuente | Qué fija |
| --- | --- | --- |
| `DataServiceClient` | `src/GeometriaFactory.Web/Integration/DataServiceClient.cs` | **Única** salida del front hacia el servicio de datos (`Web/05` §3.1 capa 3); sostiene `RA-01` (la sesión interactiva no llega al servicio) |
| `DataServiceOutcome<TValue>` | `src/GeometriaFactory.Web/Integration/DataServiceOutcome.cs` | Resultado o error del contrato; la falla **no** viaja como excepción hasta la superficie (Web CU-10010, Contracts CU-06 FA-02) |

Operaciones de `DataServiceClient` (líneas del archivo):

| Grupo | Métodos |
| --- | --- |
| Salud y provisión | `GetServiceHealthAsync` (120), `GetLaboratoryProvisioningAsync` (151), `ConfigureAdministratorAsync` (161) |
| Sesión y credencial | `ExchangeCredentialsAsync` (168), `ChangeOwnPasswordAsync` (186) |
| Cuentas | `RegisterAccountAsync` (215), `ListAccountsAsync` (227), `ChangeAccountStatusAsync` (239), `DeleteAccountAsync` (258), `ResetAccountPasswordAsync` (281) |
| Trabajos | `InterpretWorkAsync` (311), `SubmitWorkAsync` (322), `ResubmitWorkAsync` (335), `DeleteWorkAsync` (350), `ResolveWorkAsync` (375), `ListWorksAsync` (398), `GetWorkAsync` (418) |

Las rutas HTTP que consumen están en `06`; el reenvío del origen del navegador (`BrowserOriginForwardingHandler.cs`) en `08`.

---

## 5. Servicios de presentación (no de seguridad)

| Servicio | Fuente | Qué hace |
| --- | --- | --- |
| `DataServiceReachability` | `Services/DataServiceReachability.cs` | Singleton: consulta **siempre** si el servicio de datos responde y guarda la lectura (`Lectura(Responde, Momento)`) unos segundos; origen: decisión del PO de que «la desconexión se vea venir» en lugar de un nombre estable sobre 443 |
| `DeclaredDateText` | `Services/DeclaredDateText.cs` | Presenta la fecha declarada sin convertirla (`ToDisplay`, `ToControlValue`); conviven dos formas en el almacén (RC-06) |
| `StaleFormMiddleware` | `Services/StaleFormMiddleware.cs` | Envío con antiforgery inválido → redirige a la misma ruta con `?pagina-vieja=1` en vez de mostrar el error del marco |
| `StartupObservations` (+ `StartupObservationsProvider`) | `Services/StartupObservations.cs` | Guarda avisos ≥ Warning del arranque; distingue declarados (`Motivo`) de novedades (`SinDeclarar`); se exhiben en `/estado` |
| `VersionIdentity` | `Services/VersionIdentity.cs` | Contrato del sello (CMP-09) resuelto una vez desde `AssemblyInformationalVersion`; `0.0.0` = indeterminada; origen: mesa `Mesa-2026-09-14.md` R-14 |

Los servicios `Session*`, `PanelSessionGate*`, `ProvisioningGate*`, `UnrestorableSession*`, `PendingCredentialChangeStore`, `DataProtectionState` y `ProvisioningStateProbe` van a `08`.

---

## 6. `wwwroot`: sistema visual e interacción

| Archivo | Líneas | Contenido |
| --- | --- | --- |
| `wwwroot/css/app.css` | 1247 | Hoja única del producto: tokens, escala tipográfica, foco visible de 2 px, iconos `currentColor`, aviso de indisponibilidad, cartel de reconexión superpuesto (tres reglas que enciende el marco), esqueletos de carga, bloque de escena ≈4:3, casillas de movimiento automático, tarjetas apiladas en versión angosta; 174 selectores de clase `.gf-*` distintos (134 sin modificadores `--`) |
| `wwwroot/css/scaffold.css` | 19 | Sólo para `/estado` (etapa `b`) |
| `wwwroot/interaction/surface-interaction.js` | 723 | **Único guion propio**: copiar en un gesto, estado en curso, acción inhabilitada hasta coincidir lo tecleado, Escape y foco confinado en diálogos; además dibuja escenas y enlaza el árbol (`DOMContentLoaded`). Sin red, sin almacenamiento, sin textos de producto; mejora progresiva |
| `wwwroot/js/README.md` + `.gitkeep` | 6 | Carpeta reservada |

El guion lo cuadra `scripts/verify-stage-c.sh` C-4 contra la lista cerrada de atributos de `Norma-De-Nomenclatura.md` §6.17.3, §6.23 y §6.26 —treinta desde la mesa del 2026-09-14—, en las dos direcciones (`scripts/verify-stage-c.sh` l. 257–258; detalle de la puerta → `11`).

---

## 7. Especificación funcional Web

Carpeta: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/02-Especificacion-Funcional/`.

| Documento | Líneas | Contenido |
| --- | --- | --- |
| `Especificacion-Funcional.md` | 382 | Catálogo de CU (§3), matriz NB→CU→RN→US (§4), restricciones transversales de la pieza pública (§6), consumo del contrato de fachada (§7) |
| `Definicion-Contrato-De-Fachada.md` | 335 | Seis funciones y códigos de condición de la fachada del visor (contenido → `10`) |
| `Glosario-Funcional.md` | 227 | → `14` |
| `README.md` | 94 | Punto de entrada y artefactos omitidos |

Casos de uso (`Casos-De-Uso/`), todos en estado «Propuesto» en el catálogo:

| CU | Qué hace la persona | Actor | Superficie |
| --- | --- | --- | --- |
| CU-10001 | Registrarse sin elegir contraseña | Alumno | SUP-10002 |
| CU-10002 | Iniciar y cerrar sesión sin exponer la credencial | Persona con cuenta | SUP-10003 |
| CU-10003 | Establecer, cambiar y cambiar obligado la contraseña | Persona con cuenta | SUP-10004 |
| CU-10004 | Administrar cuentas (habilitar, bloquear, resetear, baja con confirmación escrita) | Administrador | SUP-10009, SUP-10001 |
| CU-10005 | Enviar un trabajo y ver el resultado de la interpretación | Alumno | SUP-10006 |
| CU-10006 | Listado propio; editar/eliminar sólo en borrador | Alumno | SUP-10005 |
| CU-10007 | Abrir un trabajo: escena y árbol sincronizados por índice | Alumno dueño / Administrador | SUP-10007 |
| CU-10008 | Recorrer la entrega de la comisión sin borradores | Administrador | SUP-10010 |
| CU-10009 | Resolver con comentario opcional | Administrador | SUP-10008 |
| CU-10010 | Estado degradado y reconexión | Cualquiera | SUP-10011 |

---

## 8. Experiencia de uso (`03-UX-UI-DX/`)

Carpeta: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/03-UX-UI-DX/`. `Glosario-UX.md` → `14`; `Guia-Onboarding-Developer.md` → `12`.

| Documento | Líneas | Qué fija |
| --- | --- | --- |
| `README.md` | 178 | Variante aplicada, orden de lectura, once superficies y su recorte |
| `Experiencia-De-Uso.md` | 492 | Principios (§2), flujos y los dos shells (§3), estados y feedback (§4), accesibilidad (§5), performance percibida (§7), errores y recuperación (§8); v1.5 del 2026-10-27 admite ayuda de usuario con límite didáctico (→ Web ADR-10010) |
| `Linea-Base-Visual.md` | 312 | Identificadores `SUP-` (11), `CMP-` (73), `EST-` (74), `NAV-` (24) distintos citados |
| `Contrato-Datos-Maqueta.md` | 140 | Campos exhibidos `DM-XX`, formato de presentación, invariantes que el sistema no puede contradecir |
| `Representacion-Fila-De-Trabajo.md` | 120 | Fila de trabajo y su variante angosta |
| `Representacion-Lista-De-Observaciones.md` | 136 | Lista de observaciones |
| `Representacion-Sello-De-Version.md` | 151 | Sello (CMP-09) y contrato de identidad §4 |
| `DX-Developer-Experience.md` | 274 | DX sobre la fachada del visor |
| `DX-Error-Messages.md` | 206 | Catálogo de condiciones de la fachada y su diagnóstico |
| `Bitacora-Validacion-Maqueta.md` | 159 | §9 |

Wireframes (estructura común §1–§9: pantalla, layout, componentes, interacciones, estados, versión angosta, notas, trazabilidad):

| Wireframe | Líneas | Superficie |
| --- | --- | --- |
| `Wireframes-Aprovisionamiento-Inicial.md` | 173 | SUP-10001 |
| `Wireframes-Registro-De-Cuenta.md` | 165 | SUP-10002 |
| `Wireframes-Ingreso.md` | 169 | SUP-10003 |
| `Wireframes-Credencial-Propia.md` | 236 | SUP-10004 |
| `Wireframes-Panel-De-Trabajos-Del-Alumno.md` | 169 | SUP-10005 |
| `Wireframes-Envio-De-Trabajo.md` | 193 | SUP-10006 |
| `Wireframes-Vista-De-Trabajo.md` | 204 | SUP-10007 |
| `Wireframes-Resolucion-Del-Trabajo.md` | 204 | SUP-10008 |
| `Wireframes-Panel-De-Cuentas.md` | 257 | SUP-10009 |
| `Wireframes-Listado-De-La-Comision.md` | 172 | SUP-10010 |
| `Wireframes-Estado-Degradado-Y-Reconexion.md` | 194 | SUP-10011 |

### 8.1 Ayuda de usuario en el código

| Superficie | Fuente | Qué hay |
| --- | --- | --- |
| Envío | `Components/Pages/WorkSubmission.razor` (≈ l. 318–360) | Vocabulario de claves que el laboratorio lee (`Tipo`, `Largo`, `Ancho`, `Radio`, `Altura`, `Area`, `Volumen`, `Caras`/`Bases`/`Laterales`/`Tapas`) y `<details>` «Ver un ejemplo» con el cubo del intake (6 caras de 3, área 54, volumen 27; corrección H-05) |
| Vista | `Components/Pages/WorkView.razor` (≈ l. 258–345) | «Texto original» colapsado; ayuda no visible (`gf-sr-only`) en las casillas de movimiento; texto por estado de qué puede hacer el alumno (no inventa reeditar un entregado) |

Que el ejemplo del cubo respete el límite «la ayuda no entrega el JSON ni las clases resueltas» de Web ADR-10010 es un juicio **no verificado** por este índice.

### 8.2 Mensajes de error al usuario

| Situación | Dónde se resuelve |
| --- | --- |
| Credencial inválida (mensaje único) | `SignIn.razor` |
| Página vieja / antiforgery | `StaleFormMiddleware.cs` + `SignIn.razor` |
| Trabajo ajeno o inexistente (neutro, RN-03) | `StudentWorkPanel.razor`, `WorkSubmission.razor` |
| Servicio de datos indisponible (sin datos viejos) | `WorkView.razor`, `ClassSubmissionList.razor`, `DegradedStateOverlay.razor` |
| Principios y catálogo | `Experiencia-De-Uso.md` §8; texto traducido por la capa del motivo interno (→ `06`) |

---

## 9. Maquetas HTML

Carpeta: `SDD/Maquetas/GeometriaFactory-Web/` (validación visual, no producto).

| Archivo | Superficie | Shell |
| --- | --- | --- |
| `index.html` | Entrada | — |
| `Aprovisionamiento-Inicial.html` | SUP-10001 | Acceso |
| `Registro-De-Cuenta.html` | SUP-10002 | Acceso |
| `Ingreso.html` | SUP-10003 | Acceso |
| `Credencial-Propia.html` | SUP-10004 | Acceso / Trabajo |
| `Panel-De-Trabajos-Del-Alumno.html` | SUP-10005 | Trabajo |
| `Envio-De-Trabajo.html` | SUP-10006 | Trabajo |
| `Vista-De-Trabajo.html` | SUP-10007 | Trabajo |
| `Resolucion-Del-Trabajo.html` | SUP-10008 (alojada en Vista) | Trabajo |
| `Panel-De-Cuentas.html` | SUP-10009 | Trabajo |
| `Listado-De-La-Comision.html` | SUP-10010 | Trabajo |
| `Estado-Degradado-Y-Reconexion.html` | SUP-10011 | Superposición |
| `assets/css/Estilos-Maqueta.css`, `assets/js/Maqueta.js`, `assets/js/Datos-Maqueta.js`, `assets/js/Visor-Tridimensional.js` | Estilo, barra de validación, datos (`Contrato-Datos-Maqueta.md`), visor | — |
| `README.md` (458 l.) | Cómo se abre, barra de validación, navegación, datos, panel del contrato de fachada (§6.b), RA en la maqueta (§9) | — |

Bitácora (`03-UX-UI-DX/Bitacora-Validacion-Maqueta.md`, estado **Aprobado**):

| Iteración | Fecha | Cambio |
| --- | --- | --- |
| 1 | 2026-08-09 | La resolución pasa a alojarse en Vista-De-Trabajo |
| 2 | 2026-08-09 | Nace el panel del contrato de fachada (el visor no tiene maqueta propia, decisión del PO) |
| 3 | 2026-08-09 | Absorción del visor real de la cátedra |
| 4 | 2026-08-09 | Los dos movimientos automáticos |

**Aprobación (§3):** el Product Owner aprobó la maqueta explícitamente el 2026-08-09, al cierre de la iteración 4, sobre las once superficies con el visor real montado, el panel del contrato de fachada operativo y los dos movimientos automáticos gobernables.

Secciones posteriores: §2.b (después de la aprobación), §4 hallazgos y propagación, §5 sin resolver, §5.b ronda de corrección de la auditoría.
