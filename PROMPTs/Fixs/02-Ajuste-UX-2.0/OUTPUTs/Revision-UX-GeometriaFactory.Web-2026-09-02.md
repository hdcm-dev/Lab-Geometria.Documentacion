# Revisión de diseño y experiencia — `GeometriaFactory.Web`

**Fecha:** 2026-09-02 · **Procedimiento:** `INPUTs/Revision-UX-Agentica.md` · **Fase alcanzada:** 4 (clasificación). Parada para aprobación antes de reparar.

---

## 1. Alcance

| | |
| --- | --- |
| Instancia auditada | `https://aplicada.somee.com/` — despliegue vigente. **No se levantó nada local**: el front ya estaba en línea y el PO confirmó que los datos son de prueba |
| Navegador | Chrome for Testing 151.0.7922.34, headless, conducido por CDP desde `evidencia/nav.mjs` (Playwright sobre `connectOverCDP`) |
| **Apartamiento declarado** | §3 del procedimiento pide un **MCP de navegador**. El servidor `chrome-devtools-mcp` quedó registrado y sano, pero Claude Code sólo carga los MCP al arrancar y esta sesión ya estaba abierta. Se condujo el mismo Chrome por el mismo protocolo (CDP) desde guiones. **No se suplantó con `curl`**: cada medición se tomó sobre el DOM vivo, después de que el circuito Blazor terminara |
| Papeles | **Administrador** (`fernandofilipuzzi.utn@gmail.com`) y **Alumno** (`alumno-ux-2026-09-02@mesa-ux.invalid`, cuenta creada por la corrida) |
| Pantallas (8) | `/ingreso` · `/registro-de-cuenta` · `/entrega-comision` · `/trabajos/{id}` (las dos vistas: docente y alumno) · `/cuentas` · `/mi-contrasena` · `/credencial-propia/cambio-obligado` · `/mis-trabajos` · `/trabajo-nuevo` |
| Anchos | 360 · 767 · 768 · 769 · 900 · 1024 · 1200 · 1440 · 1920 |
| Temas | **Uno solo.** `app.css` no declara `prefers-color-scheme` (0 ocurrencias) ni `data-theme`. No hay tema oscuro que auditar |
| Higiene | Toda escritura se hizo sobre registros creados en esta corrida. **No se tocó ninguna cuenta ni ningún trabajo de alumnos reales** |

---

## 2. Tareas

| # | Tarea, en el vocabulario de quien la hace | Resultado |
| --- | --- | --- |
| T1 | Entrar al laboratorio | **Completada** |
| T2 | Registrarme como alumno y llegar a poder entrar | **Completada con fricción** (§3 · H-07) |
| T3 | Pegar el texto que imprimió mi programa y mandarlo | **Completada con fricción** (§3 · H-03) |
| T4 | Entender si mi fórmula está mal | **Completada con fricción** (§3 · H-05) |
| T5 | Ver qué entregó la comisión y abrir un trabajo | **Completada** |
| T6 | Habilitar la cuenta de un alumno y darle una contraseña | **Completada** |

---

## 3. Bitácora de fricción, en crudo

- **T2.** Registro pide correo, nombre y apellido, y ninguna contraseña. Antes de enviar no se dice cómo se va a entrar; se dice después, en la pantalla de confirmación, y ahí está bien dicho. La fricción real vino más tarde: entré con la provisoria → la pantalla de cambio obligado me pidió **escribir de nuevo la provisoria que acababa de usar para entrar** → al guardar la nueva me devolvió a `/ingreso` **con el correo vacío**. Tres tipeos de credenciales para entrar una vez.
- **T3.** Fui a pegar el texto y dudé: el campo «Texto del trabajo» mide 247×132 px y el JSON de una línea entró con **barra de desplazamiento horizontal**; no podía ver lo que había pegado. Al lado, un recuadro de 578×450 px que decía «Todavía no hay nada que dibujar». Busqué el botón de enviar y no estaba en pantalla: el que se ve es «Previsualizar».
- **T4.** Pegué **el ejemplo que la propia pantalla ofrece** en «Ver un ejemplo», sin tocar un carácter. El laboratorio me contestó que mi programa declara un área de 54,00 y que la geometría da 9,00. Si yo fuera el alumno, a esta altura no sé si el que está mal es mi programa o el laboratorio.
- **T5/T6.** A 1440 px la lista de cuentas se lee bien. Al angostar la ventana se rompe temprano: a 769 px «Adolfo Vera» se parte en `Ad/olfo/Ver/a`, el correo en ocho renglones y el encabezado «SITUACIÓN» queda **encima** de «FECHA DE REGISTRO».
- **Transversal.** Cada vez que pulsé «Filtrar» con la red lenta, la pantalla se quedó **en blanco** —sin encabezado, sin barra lateral, sin mensaje— hasta que volvió entera.
- **Entorno, no producto.** El hosting inyecta una franja publicitaria fija que tapa ~90 px del borde inferior en todas las pantallas, y bloquea WebSockets: Blazor cae a *long polling* en cada carga.

---

## 4. Resumen

El sistema de diseño está sano y ya pasó por una mano de ajuste: la escala tipográfica es modular declarada (razón 1,25), el espaciado es base 4, el anillo de foco está en **todos** los elementos alcanzables, `aria-current="page"` marca el menú, los estados vacíos tienen texto y salida, y a 360 px las tablas se convierten en fichas. **Nada de eso hay que rehacerlo.**

Lo que falla son cuatro cosas concretas y medidas. Una es del sistema y se arrastra a todas las listas: la retícula fija reparte ancho idéntico a columnas de contenido distinto, y por debajo de ~1200 px el texto se hace astillas y un encabezado pisa al otro. Otra es del sistema y es un token: el gris terciario da 3,48:1 sobre blanco, por debajo del piso de WCAG. La tercera es de las pantallas y es fácil: los tres formularios de filtro no usan el indicador de espera que el sistema ya tiene, y por eso la pantalla se va a blanco. La cuarta es la más cara y no es de estilos: **el ejemplo que la pantalla de envío ofrece, pegado tal cual, produce una advertencia** — el producto se desmiente a sí mismo justo en lo único que vino a hacer, que es volver visible el error de fórmula.

Y hay una decisión pendiente que no puedo tomar yo: en la pantalla de envío, el campo donde se pega el trabajo es lo más chico de la pantalla y el dibujo vacío es lo más grande.

---

## 5. Hallazgos

| id | eje | A/B/C | sev. | criterio / regla | evidencia | reparación |
| --- | --- | --- | --- | --- | --- | --- |
| H-01 | Accesibilidad | **B** | Alta | WCAG **1.4.3** (piso 4,5:1) | `--color-text-tertiary: #8A8A82` sobre `#FFFFFF` = **3,48:1** medido en `/trabajos/{id}`, sobre texto de 16 px. Usos: `.gf-json-count` (app.css:728), `.gf-scene-motion__note` (:667, :952) y los `::placeholder` de todos los campos (:331) | Subir el token a **`#71716B`** (4,91:1 sobre blanco, 4,55:1 sobre `#F7F6F4`). Un solo valor en `:root`; ninguna pantalla se toca |
| H-02 | Jerarquía / layout | **B** | Alta | Anchos de campo arbitrarios sin retícula; colisión de texto | `.gf-table { table-layout: fixed }` (app.css:1004) **sin retícula declarada**: las cuatro columnas de datos miden lo mismo — 67/99/130/170 px a 769/900/1024/1200. A 769 px el texto del encabezado «SITUACIÓN» mide 83 px en una columna de 67 px con `overflow-wrap:normal` (:1013) y `overflow:visible`, y **pinta hasta x=484 mientras su columna termina en x=456**: pisa «FECHA DE REGISTRO». Captura `evidencia/20-cuentas-769.png` | Declarar proporciones por tabla (`<col>` o `nth-child` en el sistema), no partes iguales. La regla R-05 que trajo `fixed` resolvió la alineación entre tablas hermanas y hay que conservarla: lo que falta es el reparto |
| H-03 | Jerarquía / tarea | **C** | Alta | Peso visual proporcional a la frecuencia de uso; Fitts | En `/trabajo-nuevo`, `.gf-two-columns` (1fr/2fr, app.css:629) le da al **«Texto del trabajo»** —el dato central del producto— **247×132 px** con `white-space:pre` y desplazamiento horizontal, mientras la previsualización **vacía** ocupa 578×450 px. «Enviar» queda en **y=949** (fuera de una ventana de 900 px de alto) y «Previsualizar», que es secundario, en y=697. Capturas `54-trabajo-nuevo.png`, `55-previsualizacion.png` | **Requiere decisión.** app.css:626 declara la disposición «decidida aguas arriba y probada en el aula: no se rediseña». Propuesta en §7 |
| H-04 | Retroalimentación | **A** | Alta | Nielsen «visibilidad del estado»; `Experiencia-De-Uso.md` §2.1: «Toda acción que cruza al servidor **muestra indicador de espera**» | Con la red a 400 kb/s, al pulsar «Filtrar»: `document.readyState` = `loading`, `document.querySelector("main")` = **null**, cuerpo en blanco. Los tres formularios son `<form class="gf-filters" method="get">` **sin `data-gf-pending`** (`AccountsPanel.razor:258`, `StudentWorkPanel.razor:168`, `ClassSubmissionList.razor:123`). El sistema ya lo resuelve: `surface-interaction.js:139`, y las formas mutantes sí lo usan | Agregar `data-gf-pending` a los tres formularios de filtro. Es alinear con lo ya decidido |
| H-05 | Confianza / tarea | **A** | Alta | ISO 9241-110 «conformidad con expectativas» | El ejemplo de «Ver un ejemplo», pegado **verbatim**, devuelve: *«Area · Tu programa declara 54.00 · La geometría da 9.00»*. Trabajo `8d7a2adb-9a99-4a2a-97e5-f52a1ac18a77` en la cuenta de prueba. El ejemplo declara el área total del cubo (54) pero emite **una sola cara**, y la derivación suma lo emitido (9) | Corregir el ejemplo para que emita las seis caras, o que declare `Area: 9.00`. **La regla de derivación no se toca**: el ejemplo es lo que está mal |
| H-06 | Microcopia | **A** | Media | `Experiencia-De-Uso.md:93` («no aparece el nombre del formato del texto, ni «commit», ni «deploy», ni «request»») y `:436` («sin jerga de implementación… ni identificadores internos») | Cuatro frases: «No salió ninguna **solicitud** hacia el **servicio de datos**» (`AccountRegistration.razor:75`, `OwnCredentialChange.razor:62`, `OwnCredentialForcedChange.razor:105`, `InitialProvisioning.razor:47`); «La operación se aplicó y **la lista se volvió a pedir**» (`/cuentas`); «Es el texto **JSON** que imprime tu programa»; «**Identificador del trabajo** d6b4a2e1-…» mostrado al alumno | Reescribir las cuatro con el vocabulario de la cátedra. El identificador: quitarlo de la vista del alumno |
| H-07 | Flujo | **A** | Media | Nielsen «minimizar la carga»; pasos contra pasos necesarios | Primer ingreso = **tres** entradas de credenciales: entrar con la provisoria → reescribir la provisoria en el cambio obligado → volver a `/ingreso` con **el correo vacío** y entrar de nuevo | Prellenar el correo al volver de `/credencial-propia/cambio-obligado` (una consulta en la cadena, sin cambiar contratos) |
| H-08 | Correspondencia | **A** | Media | Nielsen «visibilidad del estado» | Tras enviar, el `h1` sigue diciendo **«Trabajo nuevo»** y el subtítulo «Pegá el texto tal como lo devolvió tu programa», encabezando un panel que dice que el trabajo ya se envió. Captura `56-tras-enviar.png` | Cambiar `h1` y subtítulo cuando `_state` trae resultado |
| H-09 | Jerarquía | **A** | Media | Peso visual proporcional a la frecuencia de uso | En `/cuentas` cada fila mide **211 px** por tres botones apilados en la columna de operaciones (208 px de ancho fijo), y **«Dar de baja»** —destructiva y rara— es el elemento de más peso visual de la pantalla. Captura `10-cuentas.png` | Dejar la operación frecuente como botón y llevar baja y reseteo a un grupo secundario |
| H-10 | Accesibilidad | **A** | Baja | WCAG **3.3.1** | Los errores de formulario son **sólo globales**: `[aria-invalid=true]` = **0 elementos** en las cuatro formas probadas. El mensaje va en `role="alert"` y sí se anuncia | Marcar `aria-invalid` en el campo que falló |
| H-11 | Microcopia | **A** | Baja | Reconocer antes que recordar | «Figura **1** · posición **0** · campo «Area»»: dos numeraciones distintas para lo mismo en un renglón | Unificar |
| H-12 | Microcopia | **A** | Baja | — | «Con 1 advertencia, que **no impiden** la entrega» | Concordar singular/plural |
| H-13 | Arquitectura de información | **A** | Baja | Hick; «quitar lo que compite» | En «Mis trabajos» sin ningún trabajo se dibujan igual el buscador, el selector de estado y «Filtrar», sobre una lista vacía | No dibujar los filtros cuando el conjunto está vacío |

---

## 6. Plan

**Entra en esta corrida** (con el informe aprobado): H-01, H-02, H-04, H-05, H-06, H-08, H-10, H-11, H-12, H-13.

**No entra:** H-03 (es C: se propone, no se aplica). H-07 y H-09 quedan a tu criterio — H-07 toca el flujo de vuelta desde el cambio obligado y H-09 reordena acciones; ninguna de las dos es «alinear con lo ya decidido», así que prefiero que las apruebes una por una.

**Orden:** primero H-01 y H-02, que son del sistema y se ven en todas las pantallas; después las de pantalla. Después de cada bloque se repiten las mediciones sobre lo tocado y se adjunta antes/después. Máximo tres iteraciones por hallazgo.

---

## 7. Propuesta C — H-03, la pantalla de envío

**Qué falta en el sistema.** `.gf-two-columns` sólo existe en una proporción: 1fr/2fr, con la columna angosta a la izquierda. En la **vista de trabajo** eso es correcto —el dibujo es el contenido—. En el **envío** la tarea es la contraria: la persona viene a pegar un texto, y el dibujo todavía no existe.

**Alternativa A — invertir la proporción sólo en el envío.** `.gf-two-columns--submission { grid-template-columns: minmax(0,2fr) minmax(0,1fr) }` y `.gf-textarea--work-text { min-height: 320px }`. Cuesta dos reglas. Conserva el patrón, la nomenclatura y el orden en pantalla angosta. Deja «Enviar» dentro de la primera pantalla.

**Alternativa B — una sola columna hasta que haya algo que dibujar.** El formulario ocupa el ancho útil; la previsualización aparece recién cuando se pulsa «Previsualizar». Es más fiel a la tarea, pero cambia la disposición que «se probó en el aula» y hace que la pantalla salte al previsualizar.

**Qué otras pantallas lo necesitarían:** ninguna. `/trabajos/{id}/editar` comparte la superficie SUP-06 y hereda lo que se decida; SUP-07 se queda como está.

**Costo de no hacerlo:** el campo central del producto sigue midiendo 247×132 px con desplazamiento horizontal, y el botón que cierra la tarea sigue fuera de la primera pantalla.

**Recomiendo A**: resuelve lo medido con dos reglas y sin tocar el patrón.

---

## 8. Cobertura — lo que no se pudo revisar, y por qué

- **Estado de carga con esqueletos:** no existe y no puede provocarse. El front es renderizado en el servidor: a 3G el documento llega completo (`readyState: complete`, 0 esqueletos). El hueco real de espera es el de H-04.
- **Desenlace del trabajo** (Aprobar / Rechazar / Retirar): la superficie se auditó, **no se ejecutó**. Los únicos trabajos sobre los que podía dispararlo son los dos que creé, y preferí no dejar estado a medias antes de que vieras el informe. Se puede completar si lo pedís.
- **Superficies no auditadas:** `SUP-01` aprovisionamiento inicial (inalcanzable: ya hay administrador), `/trabajos/{id}/editar`, `SUP-11` estado degradado y reconexión, y las dos de «no encontrado».
- **Un solo tema**, porque el sistema declara uno solo. No es una omisión de la corrida.
- **`prefers-reduced-motion`** está declarado en `app.css:161` y apaga animaciones y transiciones; **no se verificó** que detenga la órbita de la cámara y el giro de las figuras del visor, que es lo que más se mueve. Queda abierto.
- **Objetivo mínimo (WCAG 2.5.8):** las dos casillas del control de movimiento miden 16×16 px, pero su `<label for=…>` (128×27 px) es parte del objetivo. Queda **al límite**, no como incumplimiento.
- **Entorno, fuera del producto:** franja publicitaria fija del hosting tapando ~90 px inferiores; WebSockets bloqueados con caída a *long polling*; avisos de WebGL por software, que son del navegador headless.

---

# Fase 5 — Reparación · 2026-09-03

Aprobado el informe completo, incluida la propuesta C con la **alternativa A**. Rama
`ajuste-ux-2.0-mesa-agentica`.

## 9. Cómo se verificó

Las mediciones de la Fase 5 **no se tomaron contra `aplicada.somee.com`**, que sigue sirviendo la
versión anterior: se levantó el producto entero desde el fuente —servicio de datos en `127.0.0.1:5081`
y front en `127.0.0.1:5091`, contenedor `mcr.microsoft.com/dotnet/sdk:10.0`, base SQLite propia y
vacía— y se pobló con datos creados en la corrida: un administrador, tres alumnos y dos trabajos.
Los puertos son 5081/5091 y no 5080/5090 **a propósito**: ésos ya los ocupan `gf-api` y `gf-web`, que
son del Product Owner y no se tocaron.

## 10. Qué se tocó

| Archivo | Hallazgos |
| --- | --- |
| `wwwroot/css/app.css` | H-01 · H-02 · H-03 · H-09 |
| `SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css` | H-01 |
| `Components/Pages/AccountsPanel.razor` | H-02 · H-04 · H-13 |
| `Components/Pages/StudentWorkPanel.razor` · `ClassSubmissionList.razor` | H-02 · H-04 · H-13 |
| `Components/Pages/WorkSubmission.razor` | H-05 · H-06 · H-08 · H-11 · H-12 |
| `Components/Pages/SignIn.razor` | H-07 · H-10 |
| `Components/Pages/OwnCredentialForcedChange.razor` | H-06 · H-07 |
| `Components/Pages/OwnCredentialChange.razor` · `AccountRegistration.razor` · `InitialProvisioning.razor` | H-06 · H-10 |
| `Components/Layout/WorkShell.razor` | H-06 |
| `tests/GeometriaFactory.Integration.Tests/` (2 archivos) | Afirmaciones sobre la copia y la redirección que cambiaron |

**El catálogo de la maqueta aprobada se tocó, y hay que decirlo.** El control `C-4` de
`scripts/verify-visual-system.sh` exige que los tokens del producto y los de la maqueta sean
idénticos, así que H-01 se aplicó en los dos. Es un valor en dos archivos, y queda a la vista del
Product Owner por si prefiere otro.

## 11. Antes y después, medido

| id | Antes | Después | Estado |
| --- | --- | --- | --- |
| H-01 | `.gf-json-count` **3,48:1** sobre blanco; 6 incumplimientos en la vista de trabajo | Token a `#71716B`. **0 incumplimientos** de contraste en la vista de trabajo, en cuentas y en el envío | **Cerrado** |
| H-02 | Columnas de «Cuentas» **67 / 67 / 67 / 67 / 208** a 769 px; «SITUACIÓN» pintaba hasta 484 con su columna terminando en 456 | **162 / 192 / 103 / 103 / 208** a 769 px, **0 colisiones** a 769, 1024 y 1440. La tabla desborda dentro de su envoltorio (`sw` 768 · `cw` 474) en vez de astillar el texto. La fecha ya no se parte | **Cerrado** |
| H-03 | «Texto del trabajo» **247 × 132**; escena vacía **578 × 450**; «Enviar» en y=949 | Texto **537 × 320**; escena **289 × 240** | **Parcial** — ver §12 |
| H-04 | Al filtrar: `main` = null, cuerpo en blanco, sin indicador | A los 20 ms del envío: `aria-busy="true"`, botón inhabilitado, rótulo «Filtrando» y hilandera. Medido guardando el estado en `sessionStorage`, que sobrevive a la navegación | **Cerrado** |
| H-05 | El ejemplo de la pantalla, pegado tal cual, devolvía «declara 54.00 · la geometría da 9.00» | El ejemplo, pegado tal cual: **«El texto se interpretó y quedó entregado»**, cero observaciones. Con un volumen adulterado a propósito, la advertencia aparece —y sólo ésa— | **Cerrado** |
| H-06 | «No salió ninguna solicitud hacia el servicio de datos» (×4) · «Servicio de datos en línea» (todas las pantallas) · «texto JSON» · `Identificador del trabajo <Guid>` | «Todavía no se registró nada» / «Tu contraseña no cambió» · «El laboratorio está en línea» · «Es el texto que imprime tu programa» · el identificador ya no se dibuja | **Cerrado** |
| H-07 | Tres tipeos de credenciales para entrar la primera vez | El ingreso llega con el correo puesto: `correoPrellenado = "dami.ale91@mesa-ux.invalid"` | **Cerrado** |
| H-08 | Enviado el trabajo, el `h1` seguía diciendo «Trabajo nuevo» | `h1` = **«Tu trabajo se envió»**, sin el subtítulo que pedía pegar el texto | **Cerrado** |
| H-09 | «Dar de baja» era el elemento de más peso de la pantalla | Sin recuadro ni relleno; conserva color de peligro e ícono y recupera el borde al apuntarlo. La acción frecuente es ahora la única enmarcada | **Cerrado** |
| H-10 | `[aria-invalid=true]` = **0 elementos** en las cuatro formas | Con el correo puesto y la contraseña vacía: `["signin-password"]`, y sólo ése | **Cerrado** |
| H-11 | «Figura 1 · posición 0» | «Figura 1 · **posición 0 en el texto**» | **Cerrado, reclasificado** — ver §12 |
| H-12 | «Con 1 advertencia, que no impiden la entrega» | «Con 1 advertencia, que **no impide** la entrega» | **Cerrado** |
| H-13 | Filtros dibujados sobre listas vacías | **0 formularios de filtro** con la colección vacía, en las tres listas. En «Entrega de la comisión» la barra se conserva si hay un alumno elegido: ese filtro vuelve a pedir la colección y sin la barra no habría cómo deshacerlo | **Cerrado** |

**Puertas del repositorio:** `scripts/verify-visual-system.sh` **CONFORME · los cinco controles pasan**
(C-1 literales de color, C-2 `style=` en línea, C-3 clases usadas contra definidas, C-4 tokens contra
la maqueta, C-5 clases de la versión angosta). Construcción **sin advertencias** (`QG-01`).
Pruebas: **522 pasan, 0 fallan** (94 dominio · 56 aplicación · 372 integración).

Tres pruebas de integración fallaron con la primera corrida y se corrigieron: afirmaban la copia y la
redirección anteriores —`"Figura 2 · posición 1 · campo «Tipo»"` y
`"/ingreso?estado=confirmacion-contrasena"`—. Eran las viejas afirmaciones, no defectos nuevos.

## 12. Lo que queda abierto, y dos correcciones al informe

**H-03 quedó a medias, y es lo único que no cerró.** El campo pasó de 247 × 132 a 537 × 320 y la
escena vacía dejó de comerse la pantalla, pero **«Enviar» se fue más abajo, no más arriba**: de la
ordenada 949 a la 1061, porque el campo que lo precede ahora es más alto. A 1440 × 900 sigue fuera de
la primera pantalla mientras «Previsualizar» —el secundario— se ve en la 503. No lo forcé con una
tercera iteración de espaciados, que es exactamente lo que §12 del procedimiento manda no hacer.
**Es una decisión, no un ajuste fino**: para que la acción primaria entre en la primera pantalla hay
que mover la sección «Enviar el trabajo» a la columna de la previsualización —que ahora queda con
espacio de sobra debajo del lienzo— o achicar el campo otra vez. Lo primero separa el botón del
formulario que envía; lo segundo deshace la reparación. Queda para decidir.

**Corrección 1 · H-01.** El informe decía que el token terciario alcanzaba también a los
`::placeholder` «de todos los campos». **No es así**: la mesa anterior ya los había corregido en su
propia sección de `app.css` —regla `R-10`, marcadores a `--color-text-secondary`—, y eso está aguas
abajo en la cascada. Lo afirmé leyendo la línea 331 sin ver el reemplazo posterior. El incumplimiento
medido, y lo que la reparación arregla, son `.gf-json-count` y las notas de la escena.

**Corrección 2 · H-11.** No era un hallazgo. Al abrir el código en la clasificación apareció la
decisión declarada: se nombran las dos numeraciones porque el alumno recorre su lista con la que
empieza en 1 y busca en su código con la que empieza en 0. La decisión es correcta y **se conserva**;
lo que se cambió es sólo que ahora se dice de dónde sale el cero.

**Cobertura que se completó después del informe:**

- **Desenlace del trabajo:** ejecutado de punta a punta contra un trabajo propio en la instancia
  local. Confirmación previa con la advertencia de irreversibilidad, el comentario citado en la
  confirmación, y de vuelta en la lista: ««Cubo con un volumen mal» quedó finalizado». **Sin
  hallazgos.**
- **`prefers-reduced-motion`:** con la preferencia puesta, los dos controles de movimiento arrancan
  **apagados** y el lienzo no cambia un solo píxel en 2,5 s; sin ella, se mueve. **Conforme.**
- **`/aprovisionamiento-inicial`** quedó recorrida al montar la instancia local. Sin hallazgos.

**Residuos declarados, no reparados:** el `summary` «Texto original» mide 19,2 px de alto (objetivo
por debajo de 24 px, no reportado como hallazgo en su momento); las casillas de movimiento siguen en
16 × 16 con su rótulo como parte del objetivo; y en «Entrega de la comisión», un alumno filtrado sin
entregas muestra el vacío de colección —«Todavía no hay ningún trabajo entregado»— en vez del vacío
de filtro. Este último lo encontré reparando H-13, es un defecto real y **no lo toqué** porque está
fuera de los hallazgos aprobados.
