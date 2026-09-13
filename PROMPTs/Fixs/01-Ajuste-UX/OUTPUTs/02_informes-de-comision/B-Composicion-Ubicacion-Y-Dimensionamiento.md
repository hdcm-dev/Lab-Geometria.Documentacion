# Informe — Composición, ubicación de controles y dimensionamiento (B)

## Mandato y alcance observado

Miré **el ancho útil y su tope, la retícula, el ancho y la alineación de columnas de tabla, el
agrupamiento y el orden de las acciones (destructivas frente a neutras), el tamaño de los blancos de
toque, la alineación de los campos de filtro, la posición de la acción primaria y el comportamiento
del envoltorio al angostarse**. No juzgo tipografía (comisión A), ni semántica del marcado, ni el
contenido de los textos.

**Medios.** `tools/medios/web.sh` (Chromium en contenedor, PNG + TXT) y tres sondas propias de
`getBoundingClientRect` / `getComputedStyle` (`tools/medios/lib/b-sonda.js`, `b-sonda2.js`,
`b-sonda3.js`), corridas contra `https://aplicada.somee.com` con la credencial de administrador del
contrato.

**Pantallas y anchos.** `/ingreso`, `/registro-de-cuenta`, `/entrega-comision`, `/cuentas`,
`/mi-contrasena`, `/estado`, `/mis-trabajos` y la vista de trabajo
`/trabajos/b5c0197e-2e31-4ac8-8130-4f9f1f2d8235` (abierta desde `/entrega-comision`; **sólo mirada**:
no aprobé, rechacé ni retiré nada), a **1440x900**, **1024x768** y **390x844**. Cité `app.css` y
`Estilos-Maqueta.css` con número de línea.

**Lo que NO llegué a observar.** El móvil real de 360 px (`movil.sh`): todas las mediciones de angosto
son de Chromium a 390 px. `/trabajo-nuevo`, `/trabajos/{id}/editar`, `/aprovisionamiento-inicial`,
`/credencial-propia/*` y `/no-encontrado`. La maqueta en `127.0.0.1:18077` sólo la leí como hoja de
estilos, no la capturé: la verificación de paridad la cargo por cita de CSS, no por imagen. Anchos
entre 769 y 1023 px y por encima de 1440 px quedaron sin medir.

---

## Hallazgos

### B-01 · El envoltorio de contenido no tiene tope de ancho, y a 1440 px cada fila separa el dato de su acción por más de mil píxeles

- **Capa de origen**: 3 componente (y su gemelo de maqueta)
- **Ubicación**: `src/GeometriaFactory.Web/wwwroot/css/app.css:255-259` — `.gf-shell-content { flex: 1 1 auto; min-width: 0; padding: var(--space-6) var(--space-7); }`; gemelo sin tope en `SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css` (la única regla con medida de lectura acotada es `.mq-portada { max-width: 1040px }`, línea 778, que ninguna pantalla de trabajo usa)
- **Evidencia**: nivel E1 — `out/b-sonda-medicion.json`: en las seis pantallas del shell, `contenedor.maxWidth = "none"` y `w = 1272` a 1440 px, `856` a 1024 px. En `/entrega-comision` a 1440 px el nombre del trabajo arranca en `x = 189` y su único botón «Abrir» queda en `x ≈ 1325`: **1136 px de recorrido** para la acción de cada fila (`out/b-entrega-comision-1440.png`). En `/trabajos/{id}` la tarjeta «Resolver esta entrega» mide 1232 px y contiene un área de comentario de 640 px: **592 px de tarjeta vacía** (`out/b-sonda-trabajo.json`). La única pantalla con tope es `/estado`, que está fuera del sistema visual por apartamiento declarado (`wwwroot/css/scaffold.css:14`, `max-width: 48rem`).
- **Evidencia complementaria**: nivel E4 — ley de Fitts: el tiempo de adquisición de un blanco crece con el logaritmo de la distancia dividida por su ancho; un blanco de 80 px a 1136 px de su fila es el peor caso de esa relación.
- **Severidad**: S2   **Confianza**: 0.95
- **Impacto si no se corrige**: en el monitor del docente cada operación de cada fila exige cruzar la pantalla entera, y la relación entre el dato y su acción hay que reconstruirla con la vista renglón por renglón.
- **Propuesta de dirección**: que el envoltorio de contenido tenga un tope de ancho declarado como token del sistema —no un valor suelto por pantalla— y que ese tope valga por igual en las dos hojas. El sistema ya tiene el vocabulario (`--shell-sidebar-width`, `.mq-portada`): falta el token del ancho útil y su aplicación en `.gf-shell-content` / su gemelo.

### B-02 · Cinco tablas hermanas de la misma pantalla no comparten retícula: la misma columna arranca en cinco abscisas distintas

- **Capa de origen**: 3 componente
- **Ubicación**: `/entrega-comision` a 1440 px y a 1024 px; `app.css:418` — `.gf-table { width: 100%; border-collapse: collapse; ... }`, sin `table-layout` ni anchos de columna
- **Evidencia**: nivel E1 — `out/b-sonda-medicion.json`, `tableLayout = "auto"` en las cinco tablas. Abscisa de la columna «Fecha del trabajo» a 1440 px: **446,5 / 530,0 / 566,2 / 589,7 / 610,1 px** (dispersión 163,6 px). Ancho de «Trabajo»: **257,5 / 341,0 / 377,2 / 400,7 / 421,1 px**. A 1024 px la dispersión es la misma en proporción (359,4 → 467,7). Visible sin instrumento en `out/b-entrega-comision-1440.png`: los cinco encabezados `TRABAJO / FECHA DEL TRABAJO / ESTADO / ACCIONES` quedan escalonados uno respecto de otro.
- **Evidencia complementaria**: nivel E4 — la retícula de un listado es una promesa de posición: columnas homónimas de la misma pantalla se leen en vertical, y sólo se pueden leer en vertical si están alineadas.
- **Severidad**: S2   **Confianza**: 0.97
- **Impacto si no se corrige**: la vista por alumno deja de ser una sola tabla legible en vertical y se vuelve cinco tablas que hay que releer por separado; el barrido de «qué trabajos hay pendientes» se hace fila por fila.
- **Propuesta de dirección**: que las tablas hermanas de una misma pantalla resuelvan sus columnas con la misma regla y no con el contenido de cada una —anchos declarados en el componente, no negociados por el texto más largo de cada grupo—, de modo que la abscisa de cada columna sea idéntica en las cinco.

### B-03 · El grupo de acciones de fila no cabe en su columna: envuelve en dos y tres renglones con borde derecho dentado, y la destructiva queda a la misma distancia que las neutras

- **Capa de origen**: 3 componente
- **Ubicación**: `/cuentas` a 1440 px y 1024 px; `app.css:337` — `.gf-row-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: flex-end; }`; gemelo en `Estilos-Maqueta.css` (`.mq-acciones-fila`)
- **Evidencia**: nivel E1 — `out/b-sonda-medicion.json`, `/cuentas`: los tres botones miden **80,4 / 186,4 / 119,4 px**; con `gap: 8px` necesitan **402,6 px** para un renglón. La columna «Operaciones» recibe **374,8 px** a 1440 px (27,8 px de menos) y **214,4 px** a 1024 px, mientras «Correo» se queda con **447,4** y **315,3 px**. Resultado medido: **2 renglones y 81,7 px de alto** a 1440 px, **3 renglones y 125,7 px de alto** a 1024 px, con los tres anchos distintos y por lo tanto borde izquierdo dentado en cada renglón. Se ve en `out/b-cuentas-1440.png` y `out/b-cuentas-1024.png`.
- **Evidencia complementaria**: nivel E2 — el `gap` entre «Resetear la contraseña» (neutra) y «Dar de baja» (destructiva) es `var(--space-2)` = **8 px**, exactamente el mismo que entre las dos neutras: el componente no distingue la acción irreversible de las demás por su posición ni por su separación.
- **Severidad**: S2   **Confianza**: 0.95
- **Impacto si no se corrige**: la fila de cuentas mide el triple de alto de lo necesario, el listado deja de ser barrible, y la acción irreversible («Dar de baja») queda a 8 px de una acción de rutina, en una posición que además cambia de renglón según el ancho de la ventana.
- **Propuesta de dirección**: que la columna de acciones se dimensione a partir de lo que sus acciones necesitan y no de lo que sobra después del texto, y que el grupo declare una separación mayor —de token, no ad hoc— entre la acción destructiva y las neutras, con un orden estable que no dependa del punto en el que envuelve.

### B-04 · En pantalla angosta la acción destructiva sube al primer lugar y la primaria se hunde al fondo, con blancos de toque de 36 px

- **Capa de origen**: 3 componente
- **Ubicación**: `/trabajos/{id}` a 390 px; `app.css:872` — `.gf-footer-actions { flex-direction: column-reverse; }` dentro de `@media (max-width: 768px)`; gemelo en `Estilos-Maqueta.css:884` (`.mq-acciones-pie`)
- **Evidencia**: nivel E1 — `out/b-sonda-detalle.json`, `/trabajos/…` a 390x844: `flexDirection = "column-reverse"`, y las ordenadas son **Retirar (destructive) y = 582,9**, **Rechazar (secondary) y = 682,9**, **Aprobar (primary) y = 730,9**. A 1440 y 1024 px el mismo grupo es `row` con el orden inverso: Aprobar, Rechazar, Retirar. Visible en `out/b-trabajo-390.png`: el botón rojo «Retirar» es el primero debajo del comentario y ocupa el lugar que la acción primaria tiene en las otras dos anchuras.
- **Evidencia complementaria**: nivel E1 + E4 — todos los botones miden **36 px** de alto (`36,0` y `36,8` px medidos en las tres anchuras, `app.css:321` declara `min-height: 34px`). Apple *Human Interface Guidelines* pide un blanco de al menos **44x44 pt** y Material Design **48x48 dp**; WCAG 2.2 SC 2.5.5 (AAA) pide 44 px CSS. A 36 px, ningún control del producto llega a ninguno de los tres umbrales en el teléfono.
- **Severidad**: S2   **Confianza**: 0.93
- **Impacto si no se corrige**: en el teléfono, el control más prominente y el primero que encuentra el pulgar del docente al terminar de escribir el comentario es el que retira el trabajo, no el que lo aprueba; y todos los blancos están 8 px por debajo del mínimo de las dos guías de plataforma.
- **Propuesta de dirección**: que el orden de las acciones en angosto sea una decisión declarada por rol de la acción (primaria arriba, destructiva abajo y separada) y no el efecto colateral de invertir una fila pensada para dos botones; y que el blanco de toque mínimo del sistema se fije en el umbral de plataforma en lugar de en 34 px.

### B-05 · El ancho de los campos de filtro es un mínimo fijo que no depende del espacio disponible: el marcador de posición se recorta justamente donde sobra lugar

- **Capa de origen**: 3 componente
- **Ubicación**: `/cuentas` a 1440 px y 1024 px; `app.css:313` — `.gf-filters .gf-field { margin-bottom: 0; min-width: 180px; }` y `app.css:307` — `.gf-field-search .gf-input { padding-left: calc(var(--space-3) * 2 + 16px); }`
- **Evidencia**: nivel E1 — `out/b-sonda-detalle.json`, medición del marcador con `canvas.measureText` sobre la tipografía computada del propio campo: el texto «nombre, apellido o correo» mide **145,4 px**; el campo de 183 px, descontando los **40 px** de relleno izquierdo del ícono, deja **129,0 px** útiles → `recortado: true` a **1440 px** y a **1024 px**, donde el envoltorio tiene 1272 y 856 px de ancho. A **390 px** el mismo campo mide 362 px, deja 308 px útiles y **no se recorta**. Visible en `out/b-cuentas-1440.png`: «nombre, apellido o c».
- **Severidad**: S3   **Confianza**: 0.92
- **Impacto si no se corrige**: la única pista de qué se puede escribir en el buscador de cuentas se corta a mitad de palabra en los dos anchos de escritorio, con mil píxeles de espacio libre a la derecha; el criterio de dimensionamiento queda invertido respecto del espacio real.
- **Propuesta de dirección**: que el ancho de un campo se derive de lo que tiene que caber en él —su contenido más largo previsto, contando el relleno del ícono— y del espacio disponible, en vez de un mínimo fijo igual para todos los campos y para todos los anchos.

### B-06 · La barra lateral tiene ancho fijo y el identificador de la persona se derrama fuera de ella en todas las pantallas del shell

- **Capa de origen**: 2 tokens (y 3 componente)
- **Ubicación**: `app.css:115` — `--shell-sidebar-width: 168px;` (idéntico en `Estilos-Maqueta.css:108`); `app.css:229` — `.gf-shell-sidebar { width: var(--shell-sidebar-width); flex: none; ... }`; `app.css:253` — `.gf-sidebar-person { font-size: var(--type-body-size); }`, sin `overflow`, sin `text-overflow` y sin `word-break`
- **Evidencia**: nivel E1 — `out/b-sonda-medicion.json`: en `/entrega-comision`, `/cuentas`, `/mi-contrasena`, `/mis-trabajos` y `/trabajos/{id}`, a **1440 px y a 1024 px**, `sidebarPersona = { scrollW: 182, clientW: 144, recortado: true }` para «fernandofilipuzzi.utn@gmail.com». Visible en `out/b-mi-contrasena-1440.png` y `out/b-cuentas-1440.png`: se lee «fernandofilipuzzi.utn@gmail» cortado contra el borde de la barra. A 390 px la barra pasa a fila completa y el texto entra (`recortado: false`).
- **Severidad**: S3   **Confianza**: 0.96
- **Impacto si no se corrige**: en las cinco pantallas de trabajo la persona no puede confirmar con qué cuenta está operando —justo la información que importa cuando el mismo docente tiene cuenta de alumno—, y el texto queda cortado sin ninguna marca de que sigue.
- **Propuesta de dirección**: que el ancho de la barra sea función del contenido que tiene que sostener (los rótulos de navegación y el identificador de la persona), o que el identificador declare cómo se comporta cuando no entra —recorte con marca, o quiebre— en vez de derramarse en silencio.

### B-07 · Hay un solo punto de quiebre para tres regímenes de composición, y en el intermedio el contenido se sale de su tarjeta

- **Capa de origen**: 2 tokens / 3 componente
- **Ubicación**: `app.css:837` — `@media (max-width: 768px)`, la **única** consulta de medios de dimensionamiento en las 909 líneas del archivo (la otra, línea 118, es `prefers-reduced-motion`); gemelo único en `Estilos-Maqueta.css:863`. Pantallas afectadas: `/trabajos/{id}` y `/cuentas` a 1024 px
- **Evidencia**: nivel E1 — `out/b-sonda-trabajo.json`, `/trabajos/{id}` a **1024x768**: `.gf-two-columns` resuelve `266,656px 533,344px`; la tarjeta de observaciones termina en `x = 454,7` y sus valores `<dd class="gf-num">` («343.00», «1,029.00») llegan hasta **`x = 472,5`**, es decir **17,8 px fuera de su propia tarjeta**, invadiendo la columna de la escena que empieza en `470,7`. Se ve en `out/b-trabajo-1024.png`. En la misma anchura, `/cuentas` parte los nombres de la primera columna palabra por palabra («COMISION / DEEUX», «FERNANDO / RAFALE / FILIPUZZI») y el grupo de acciones pasa a tres renglones (B-03).
- **Evidencia complementaria**: nivel E2 — la relación de la retícula `minmax(0, 1fr) minmax(0, 2fr)` (`app.css:587`) es la misma a 1024 y a 1440 px: la columna de datos hereda un tercio de un envoltorio que se achicó 416 px, sin ninguna regla que la rescate.
- **Severidad**: S2   **Confianza**: 0.90
- **Impacto si no se corrige**: en la franja de anchos más común de una notebook, el producto no está ni en su composición ancha ni en la angosta: el texto se sale de los recuadros y se superpone con la columna vecina.
- **Propuesta de dirección**: que el sistema declare los regímenes de composición que realmente tiene —ancho, intermedio y angosto— con sus puntos de quiebre en el token, y que la proporción de la retícula de dos columnas sea una decisión por régimen y no un valor único; en las dos hojas.

---

**Ítems por encima del tope.** Se aplicó el tope de 7. Queda **fuera del informe, sin perderse**: `/estado`
a 390 px **desborda en horizontal** (`scrollWidth 553` contra `clientWidth 390`, `out/b-sonda-detalle.json`;
la causa medida son los `<dd>` de `dl.health`, `x = 237,9`, ancho `315,6`, que nacen de
`wwwroot/css/scaffold.css:15` — `grid-template-columns: max-content 1fr`, sin regla para angosto). Es la
única pantalla que hace desplazar la página de costado, y la única con tope de ancho. Su hoja está
declarada **fuera del sistema visual** por el apartamiento AP-03 (`scaffold.css:1-8`), así que la corrección
no toca las capas 2 ni 3; por eso quedó octava y no entre las siete.

## Lo que revisé y está bien (máximo 3)

1. **`/ingreso` y `/registro-de-cuenta` están bien compuestas en las tres anchuras.** La tarjeta se
   acota a 380 px y se centra (`app.css:202`, `width: 100%; max-width: 380px`); el botón primario va a
   ancho completo (338 px a 1440 y 1024 px, 316 px a 390 px, `out/b-sonda-detalle.json`) y no hay
   desborde horizontal en ninguna (`scrollWidth = clientWidth` en las tres). Es la prueba de que el
   sistema **sabe** acotar un ancho útil: sólo no lo hace en las pantallas del shell (B-01).
2. **Las tarjetas apiladas por debajo de 768 px funcionan.** En `/cuentas` a 390 px cada fila es una
   tarjeta de 362 px con sus tres acciones a ancho completo, legibles y sin desborde
   (`out/b-cuentas-390.png`, `scrollW 390 = clientW 390`). La transición de tabla a tarjeta está
   resuelta; lo que falta es el régimen del medio (B-07).
3. **Los campos de filtro sí están alineados entre sí.** En `/cuentas` los dos campos comparten
   ordenada e altura (`y = 130,6`, `h = 38` los dos) y en `/entrega-comision` también (`y = 148`,
   `h = 38`), en las tres anchuras (`out/b-sonda-medicion.json`). La alineación entre campos no es el
   defecto; el criterio de ancho sí (B-05).

## Solicitudes de convocatoria

1. **Foco al cargar sobre un elemento no interactivo.** El `h1` de cada pantalla aparece con anillo de
   foco en la captura inicial, sin que nadie haya tocado nada: `out/b-ingreso-1440.png`
   («Ingresar al laboratorio»), `out/b-cuentas-1440.png` («Cuentas de la comisión»),
   `out/b-trabajo-1440.png` («probando trabajo»). Es el chequeo **C-3** del marco y compete a la
   **comisión E**; lo dejo señalado y no lo cuento como hallazgo mío.
2. **La franja publicitaria del hospedaje** («Hosted Windows Virtual Server…») ocupa 92 px fijos al pie
   del viewport y tapa contenido en las tres anchuras (visible en todas mis capturas). No es del
   producto, pero condiciona cualquier juicio sobre el pie de página y sobre el alto útil: es decisión
   de **la mesa**, no de una comisión.

## Registros producidos

Todos en `/home/fernando/workspaces/workspace-dev/tools/medios/out/`.

| Archivo | Qué muestra |
|---|---|
| `b-ingreso-1440.png` · `-1024` · `-390` (+ `.txt`) | `/ingreso` en las tres anchuras; tarjeta acotada a 380 px, sin errores de consola |
| `b-registro-1440.png` · `-1024` · `-390` (+ `.txt`) | `/registro-de-cuenta` en las tres anchuras |
| `b-entrega-comision-1440.png` · `-1024` · `-390` (+ `.txt`) | Las cinco tablas hermanas escalonadas (B-02) y el recorrido de 1136 px hasta «Abrir» (B-01) |
| `b-cuentas-1440.png` · `-1024` · `-390` (+ `.txt`) | Acciones en 2 y 3 renglones con borde dentado y destructiva a 8 px (B-03); marcador recortado (B-05); tarjetas apiladas correctas a 390 px |
| `b-mi-contrasena-1440.png` · `-1024` · `-390` (+ `.txt`) | Identificador de la persona cortado contra el borde de la barra (B-06) |
| `b-estado-1440.png` · `-1024` · `-390` (+ `.txt`) | Única pantalla con tope de ancho; desborde horizontal a 390 px (ítem octavo) |
| `b-trabajo-1440.png` · `-1024` · `-390` (+ `.txt`) | Vista de trabajo: tarjeta de 1232 px con control de 640 px (B-01); valores fuera de la tarjeta a 1024 px (B-07); «Retirar» arriba de todo a 390 px (B-04) |
| `b-sonda-medicion.json` | Salida de `lib/b-sonda.js`: contenedor, `max-width`, barra, columnas de tabla, grupos de acción y filtros, en 7 pantallas x 3 anchuras |
| `b-sonda-detalle.json` | Salida de `lib/b-sonda2.js`: ancho real del marcador contra ancho útil, alturas de botón, dirección y ordenadas de `.gf-footer-actions`, culpables del desborde horizontal |
| `b-sonda-trabajo.json` | Salida de `lib/b-sonda3.js`: retícula de dos columnas y elementos que se salen de su tarjeta en `/trabajos/{id}` |

Guiones: `tools/medios/lib/b-sonda.js`, `b-sonda2.js`, `b-sonda3.js`.
