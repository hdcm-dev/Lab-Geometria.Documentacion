# Informe — Accesibilidad y comportamiento (.NET / Blazor) (E)

## Mandato y alcance observado

Miré foco, recorrido por teclado, contraste medido, anuncio de estados a la tecnología asistiva,
semántica del marcado, errores de consola, y las consecuencias de las decisiones de Blazor
Interactive Server sobre la interfaz (render estático vs. interactivo, navegación mejorada,
reconexión). No miré paleta, gusto visual ni flujo de negocio.

**Medios propios.** Medio A (`tools/medios/web.sh`, Chromium 1440x900) con prefijo `e-`, y sonda
propia en cinco emisiones —`tools/medios/lib/e-sonda.js` a `e-sonda5.js`— corrida en el mismo
contenedor de Playwright contra `https://aplicada.somee.com`. La sonda lee `document.activeElement`,
`:focus-visible`, `getComputedStyle`, `getBoundingClientRect`, calcula la razón de contraste desde
los colores computados (con fondo efectivo compuesto sobre los ancestros y mezcla alfa), pulsa
`Tab` de verdad para reconstruir el recorrido real, y corta la red con `setOffline` para observar
el estado degradado.

**Pantallas y estados observados (once):** `/ingreso`, `/registro-de-cuenta`,
`/aprovisionamiento-inicial`, `/mis-trabajos`, `/trabajo-nuevo`, `/cuentas`, `/entrega-comision`,
`/mi-contrasena`, `/estado`, `/no-encontrado`, más el diálogo de baja (`/cuentas?baja=…`, abierto y
**no** enviado). En dos papeles: anónimo y administrador. Un solo ancho: 1440x900.

**Lo que NO llegué a observar.** El móvil real de 360 px (recurso serializado; se lo dejé a las
comisiones que lo pidieron primero). `/trabajos/{id}` y `/trabajos/{id}/editar` con un trabajo
propio sembrado por esta comisión: no sembré trabajos para no pisar el recorrido de las comisiones
C y D, así que el islote interactivo `WorkResolution` (`WorkView.razor:163`) queda **sin observar**.
`/credencial-propia/establecer` y `/credencial-propia/cambio-obligado`, que necesitan una cuenta
recién reseteada. Lectores de pantalla reales: el contrato los declara fuera de alcance, de modo que
todo lo que digo del anuncio sale del marcado y de las regiones vivas, no de una escucha.

---

## Hallazgos

### E-01 · El anillo de foco verde se dibuja sobre el `<h1>` de toda pantalla apenas carga, y el título queda pareciendo un campo de texto vacío

- **Capa de origen**: 3 componente (la regla `:focus-visible` sin calificar), disparado desde 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/wwwroot/css/app.css:151`; disparador en
  `src/GeometriaFactory.Web/Routes.razor:28`
- **Evidencia**: nivel **E1 + E2**.
  - Medición (`out/e-sonda.json`, `out/e-sonda-admin.json`, `out/e-sonda2.json`, 2026-09-02): en
    **ocho** pantallas `document.activeElement` es el `H1`, con `tabindex="-1"`,
    `el.matches(":focus-visible") === true` y `getComputedStyle(el).outline ===
    "rgb(15, 110, 86) solid 2px"`. Verificado en `/ingreso` («Ingresar al laboratorio»),
    `/registro-de-cuenta`, `/cuentas`, `/entrega-comision`, `/mis-trabajos`, `/trabajo-nuevo`,
    `/mi-contrasena` y `/estado`.
  - Persistencia medida en `/cuentas` a los 0, 300, 800, 1500, 3000, 6000 y 10000 ms: el anillo
    sigue puesto en las siete lecturas (`e-sonda2.json`, `cronologia`).
  - Captura: `out/e-01-ingreso.png` y `out/e-03-cuentas.png`. En las dos, el título aparece
    rodeado por un rectángulo redondeado verde de 2 px **inmediatamente arriba del primer campo
    real** del formulario.
  - Mecanismo confirmado en el documento servido, no inferido: `curl` de `/ingreso` devuelve
    `<blazor-focus-on-navigate selector="h1"></blazor-focus-on-navigate>`. Es `blazor.web.js` quien
    enfoca el `h1` **también en las superficies de render estático**, no sólo en las interactivas.
  - Cita literal, `app.css:149-153`:
    ```css
    /* Foco visible en todo elemento interactivo (base §7): anillo de 2px que no
       depende sólo del color. */
    :focus-visible {
      outline: 2px solid var(--color-brand-primary);
    ```
    El comentario dice «en todo elemento interactivo». El selector no lo dice: alcanza a cualquier
    nodo que reciba el foco, y el `h1` con `tabindex="-1"` lo recibe.
- **Evidencia adicional**: nivel **E4** — WCAG 2.2 **1.3.1 Info y relaciones (A)**: un encabezado
  presentado con la misma affordance visual que un campo de entrada comunica una relación que no
  existe. (No es un incumplimiento de **2.4.7 Foco visible**: el defecto es el exceso, no la falta.)
  Y falla el chequeo mecánico **C-3** del marco de esta mesa, que es motivo de `S1`/`S2` sin que
  nadie opine.
- **Severidad**: **S2**   **Confianza**: 0,98
- **Impacto si no se corrige**: en las once pantallas del producto la persona vidente ve, al llegar,
  un rectángulo de campo de texto alrededor del título —en `/ingreso` justo encima de «Correo»— y
  empieza a tipear ahí.
- **Propuesta de dirección**: que el anillo de foco quede reservado a lo que se puede accionar, y
  que el destino de foco al navegar siga cumpliendo su función para la tecnología asistiva sin
  pintar nada. La decisión de dónde poner el foco al navegar (`Routes.razor:28`) y la de a quién
  pintarle el anillo (`app.css:151`) son dos, y hoy están atadas. Cualquiera sea la salida, va
  **byte a byte idéntica** a `Estilos-Maqueta.css:146`, que tiene la regla gemela.

### E-02 · El foco automático en el `<h1>` deja el enlace de salto y toda la barra lateral fuera del recorrido hacia adelante

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Routes.razor:28`; efecto medido en `/cuentas` a 1440x900
- **Evidencia**: nivel **E1** — `out/e-sonda2.json`, `recorridoCuentas`. Cargada `/cuentas` y
  esperados 6 s, se pulsa `Tab` veintiséis veces. El **primer** `Tab` cae en
  `INPUT#accounts-search`, que es contenido principal. El enlace de salto «Ir al contenido» y los
  cuatro controles de la barra lateral —«Entrega de la comisión», «Cuentas», «Mi contraseña»,
  «Cerrar sesión»— **no aparecen en ningún momento** hasta el `Tab` número 26, ya dada la vuelta
  completa al documento. Contraprueba en el mismo archivo (`roboDeFoco`): si se pulsa `Tab` a los
  150 ms, **antes** de que `blazor.web.js` mueva el foco, el primer control es
  `A.gf-skip-link [Ir al contenido]`, como corresponde.
- **Evidencia adicional**: nivel **E4** — WCAG 2.2 **2.4.1 Evitar bloques (A)**: el mecanismo de
  salto existe en el marcado y está bien hecho, pero queda inalcanzable por el recorrido normal, de
  modo que no cumple su función. Y **2.4.3 Orden del foco (A)**: el orden en que se recorre no
  preserva el significado, porque salta la navegación entera.
- **Severidad**: **S2**   **Confianza**: 0,93
- **Impacto si no se corrige**: quien navega con teclado no puede llegar a «Cerrar sesión» ni cambiar
  de sección sin recorrer las veintiuna acciones de la tabla o sin conocer `Shift+Tab`, en cada
  pantalla y en cada navegación.
- **Propuesta de dirección**: que el destino del foco al navegar y el punto de arranque del recorrido
  por teclado sean compatibles: o el foco arranca antes del enlace de salto, o el enlace de salto y
  la navegación quedan alcanzables desde donde el foco efectivamente queda.

### E-03 · En las superficies de render interactivo el foco se pierde solo, a ~1,5 s de cargar, y cae al `<body>`

- **Capa de origen**: 5 superficie (consecuencia de `@rendermode InteractiveServer`)
- **Ubicación**: `/mi-contrasena` (`Components/Pages/OwnCredentialChange.razor:6`) y `/estado`
  (`Components/Pages/Status.razor:2`), 1440x900
- **Evidencia**: nivel **E1** — `out/e-sonda2.json`, `cronologia`. Serie temporal del
  `document.activeElement` tras `goto`:

  | t | `/estado` | `/mi-contrasena` | `/cuentas` (estático, control) |
  |---|---|---|---|
  | 0 – 800 ms | `H1 [Estado del servicio]`, `:focus-visible` = true | `H1 [Mi contraseña]`, true | `H1`, true |
  | 1500 ms en adelante | `BODY.gf-body`, `:focus-visible` = false | `BODY.gf-body`, false | `H1`, true |

  La lectura se repite a los 3, 6 y 10 s con el mismo resultado. El instante coincide con el arranque
  del circuito interactivo, que vuelve a dibujar el árbol y descarta el nodo que tenía el foco.
  Se reproduce en las dos pantallas y en las dos emisiones de la sonda.
- **Evidencia adicional**: nivel **E4** — WCAG 2.2 **2.4.3 Orden del foco (A)**: el foco se mueve
  solo, sin acción de la persona, a un lugar que no preserva el significado.
- **Severidad**: **S2**   **Confianza**: 0,9
- **Impacto si no se corrige**: en `/mi-contrasena` —una pantalla que es un formulario de
  credenciales— quien usa teclado o lector de pantalla pierde su posición un segundo y medio después
  de llegar, sin aviso, y el recorrido vuelve a empezar desde el principio del documento. Es además
  la contracara de E-01: en dos pantallas de once el destino de foco que el producto declara
  simplemente no queda.
- **Propuesta de dirección**: que el punto de foco tras la navegación **sobreviva** a la hidratación
  del circuito, o que se lo restablezca cuando el circuito termina de tomar la pantalla; y que el
  comportamiento sea el mismo en las once superficies, no uno para las estáticas y otro para las
  interactivas.

### E-04 · El sello de versión en la barra lateral mide 2,04:1 de contraste, menos de la mitad de lo exigido

- **Capa de origen**: 3 componente
- **Ubicación**: `src/GeometriaFactory.Web/wwwroot/css/app.css:178` contra
  `src/GeometriaFactory.Web/wwwroot/css/app.css:744`; marcado en
  `src/GeometriaFactory.Web/Components/Shared/VersionSeal.razor:15`
- **Evidencia**: nivel **E1 + E2**.
  - Medición (`out/e-sonda-admin.json`, cuatro pantallas del armazón de trabajo: `/cuentas`,
    `/entrega-comision`, `/mi-contrasena`, `/mis-trabajos`, `/trabajo-nuevo`): texto «Versión no
    identificada», color computado `rgb(92, 92, 87)` sobre fondo efectivo `rgb(4, 52, 44)`,
    `font-size: 11px`, `font-weight: 500`. **Razón medida: 2,04:1.** Visible en
    `out/e-03-cuentas.png`, abajo a la izquierda, bajo «Cerrar sesión».
  - Causa exacta, y por eso es de capa 3 y no de capa 6: `app.css:744` pone el color correcto
    **en el contenedor**…
    ```css
    .gf-shell-sidebar .gf-seal { color: var(--color-text-on-brand-soft); }
    ```
    …pero el texto vive en un hijo con clase `.gf-meta`, y `app.css:177-178` le fija un color propio
    que gana porque **se aplica al elemento que pinta el texto**, mientras el de `.gf-seal` sólo
    podía llegar por herencia:
    ```css
    .gf-meta        { font-size: var(--type-meta-size);        font-weight: var(--type-meta-weight);
                      letter-spacing: .04em; text-transform: uppercase; color: var(--color-text-secondary); }
    ```
    con `--color-text-secondary: #5C5C57` (`app.css:47`), pensado para fondo claro. Sobre el fondo
    claro del armazón de acceso el mismo sello mide **6,22:1** y pasa: el defecto aparece sólo donde
    `.gf-meta` cae dentro de la barra oscura.
- **Evidencia adicional**: nivel **E4** — WCAG 2.2 **1.4.3 Contraste (mínimo) (AA)**: exige 4,5:1
  para texto que no es de gran tamaño. 11 px con peso 500 no es de gran tamaño por ninguna
  definición del criterio.
- **Severidad**: **S2**   **Confianza**: 0,97
- **Impacto si no se corrige**: el único dato de diagnóstico que el producto muestra —qué versión
  está corriendo— es ilegible en las cinco pantallas donde más falta hace, que son las del armazón
  de trabajo.
- **Propuesta de dirección**: que la tipografía semántica de nivel «meta» no imponga un color pensado
  para un solo fondo, o que el sello dentro de la barra lateral gane el color sobre el elemento que
  efectivamente pinta el texto. Sea cual fuere, es capa 3 y va a las **dos** hojas: la maqueta
  arrastra la misma construcción en `Estilos-Maqueta.css:172-173`.

### E-05 · El marcador de posición de los campos mide 3,48:1

- **Capa de origen**: 2 tokens
- **Ubicación**: `src/GeometriaFactory.Web/wwwroot/css/app.css:48` (`--color-text-tertiary: #8A8A82`)
  aplicado en `app.css:288`; medido en `/cuentas`, campo `#accounts-search`
- **Evidencia**: nivel **E1 + E2** — `out/e-sonda-admin.json`, entrada `marcador de posicion`: color
  computado de `::placeholder` `rgb(138, 138, 130)` sobre fondo `rgb(255, 255, 255)`, `13px`,
  peso 400. **Razón medida: 3,48:1.** Cita: `app.css:288`
  `.gf-input::placeholder, .gf-textarea::placeholder { color: var(--color-text-tertiary); }`.
- **Evidencia adicional**: nivel **E4** — WCAG 2.2 **1.4.3 Contraste (mínimo) (AA)**, 4,5:1. El
  marcador de posición es texto y el criterio no lo exceptúa.
- **Severidad**: **S3**   **Confianza**: 0,95
- **Impacto si no se corrige**: la pista de qué se escribe en cada campo («nombre, apellido o
  correo») queda por debajo del mínimo para quien tiene visión reducida o mira la pantalla con luz
  de frente; y como es el único lugar donde se dice qué formato acepta el buscador, se pierde la
  instrucción, no un adorno.
- **Propuesta de dirección**: que el escalón terciario de texto alcance 4,5:1 sobre el fondo de
  campo, o que la pista deje de vivir sólo en el marcador de posición. El ajuste es de token y va a
  las dos hojas.

### E-06 · El aviso de corte de conexión llega tarde y de manera no fiable, porque el circuito cae a Long Polling en el hospedaje real

- **Capa de origen**: 6 instancia, con consecuencia sobre 5 superficie
- **Ubicación**: superficies con `@rendermode InteractiveServer` — `/estado`, `/no-encontrado`,
  `/mi-contrasena`, `/aprovisionamiento-inicial`, `/credencial-propia/*`, `/`
- **Evidencia**: nivel **E1**, cuatro mediciones distintas.
  1. Advertencia de consola presente en **toda** superficie interactiva
     (`out/e-sonda.json`, `out/e-sonda-admin.json`, `out/e-sonda2.json`):
     `warning: Warning: Failed to connect via WebSockets, using the Long Polling fallback transport.`
  2. Corte de red real con `setOffline` sobre `/mi-contrasena` (`out/e-sonda3b.json`): el aviso
     `#components-reconnect-modal` sigue en `display: none` a los 2, 5, 10 y **20 s**; recién a los
     **40 s** aparece con `class="… components-reconnect-show components-reconnect-retrying"`,
     `display: flex`, texto «Se cortó la conexión con el laboratorio. Reintentando…».
     **Entre veinte y cuarenta segundos de pantalla viva con controles muertos y cero aviso.**
  3. La misma prueba repetida (`e-sonda5.js`, captura `out/e-09-corte-aviso.png`) sondeando cada
     segundo durante **60 s**: el aviso **no llegó a mostrarse nunca**. O sea que la ventana no sólo
     es larga: es variable, y en una de dos corridas no terminó.
  4. Consecuencia colateral medida: `/estado`, `/no-encontrado` y `/mi-contrasena` **nunca alcanzan
     `networkidle`** —`out/e-06-estado.txt`, `out/e-07-no-encontrado.txt`,
     `out/e-05-mi-contrasena.txt`: `goto: page.goto: Timeout 45000ms exceeded`— mientras que las
     superficies de render estático (`/ingreso`, `/cuentas`, `/entrega-comision`, `/mis-trabajos`)
     lo alcanzan sin problema. El sondeo largo deja una petición abierta permanente.
  Se agrega un defecto de acompañamiento, nivel **E2**: `app.css:557-558` define
  `body.gf-inert .gf-shell, body.gf-inert .gf-canvas { pointer-events: none; … }`, y
  `grep -rn "gf-inert" --include=*.razor --include=*.cs --include=*.js src/GeometriaFactory.Web`
  **no devuelve una sola línea**: nadie aplica nunca esa clase. Medido en vivo
  (`e-sonda3b.json`, `bodyClase: "gf-body"`, `inert: false` en las seis lecturas del corte):
  durante el corte los controles siguen enfocables —el `Tab` llegó a `INPUT#credential-current`— y
  con aspecto normal.
- **Severidad**: **S2**   **Confianza**: 0,88
- **Impacto si no se corrige**: durante medio minuto o más, tras un corte, la persona sigue tipeando
  su contraseña nueva en una pantalla que ya no está conectada con nada, sin ninguna señal; y a
  veces la señal no llega. Además cualquier prueba E2E que espere `networkidle` sobre una superficie
  interactiva va a expirar, de modo que la afirmación «esto está cubierto por una prueba» es más
  frágil de lo que parece en esas pantallas.
- **Propuesta de dirección**: dos cosas separadas. Que la detección del corte no dependa de que el
  transporte preferido esté disponible en el hospedaje que el producto realmente usa —hoy no lo
  está, y está medido—; y que el estado degradado se **note** en los controles, que es para lo que
  la hoja ya tiene una regla escrita y nunca encendida.

### E-07 · Los diálogos de confirmación son `<dialog open>` no modal: el fondo queda expuesto a la tecnología asistiva

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/AccountsPanel.razor:112`, `:193`, `:233`
- **Evidencia**: nivel **E1 + E2**. Abierto el diálogo de baja en `/cuentas?baja=…` —sólo abierto,
  **no enviado**— la sonda mide (`out/e-sonda4.json`, `dialogo`):
  `open: true`, `esModal (":modal"): false`, `aria-modal: null`, `role: null`,
  `fondoInerte: false`, `position: "absolute"`. Cita literal, `AccountsPanel.razor:193`:
  ```razor
  <dialog class="gf-dialog" open aria-labelledby="accounts-deletion-heading" data-gf-dialog>
  ```
  `open` como atributo abre el diálogo en modo **no modal**: sin capa superior, sin `inert`
  implícito sobre el resto del documento y sin `aria-modal`. Lo que sí funciona, y lo digo porque es
  la mitad buena del hallazgo: hay una trampa de foco por guion —doce `Tab` seguidos quedaron los
  doce dentro del diálogo—, el foco entra solo al campo de confirmación
  (`INPUT#accounts-deletion-confirmation`), y `Escape` cierra.
- **Evidencia adicional**: nivel **E4** — WCAG 2.2 **2.4.3 Orden del foco (A)**. La trampa por guion
  cubre el recorrido por `Tab`, pero no el modo de exploración de un lector de pantalla, que recorre
  el árbol y no el orden de tabulación: ahí las seis filas de cuentas y sus veintiún botones siguen
  disponibles detrás del pedido de confirmación de una baja irreversible.
- **Severidad**: **S3**   **Confianza**: 0,82
- **Impacto si no se corrige**: la confirmación escrita de la baja —que es la defensa de superficie
  contra borrar una cuenta y todos sus trabajos— no aísla el contexto para quien no navega por
  `Tab`, y el aviso de arrastre puede quedar fuera de lo que la persona está leyendo.
- **Propuesta de dirección**: que el diálogo se abra como modal de verdad, de modo que el
  aislamiento del fondo lo garantice el navegador y no un guion; y si por alguna razón tiene que
  seguir siendo no modal, que lo declare como tal en el marcado. No agrego una octava entrada por
  esto: el guion de confirmación (`data-gf-match-input`) hace lo suyo y lo verifiqué funcionando.

---

## Lo que revisé y está bien (máximo 3)

1. **La semántica del marcado es sólida y no es casualidad.** En las once pantallas:
   `lang="es-AR"`, un único `<h1>` por pantalla con título distinto, `<main>` y `<nav>` presentes,
   **cero** campos sin etiqueta asociada (`inputsSinEtiqueta: []` en las once), cero botones o
   enlaces sin nombre accesible, cero `<img>` sin `alt`, y **cero** `<svg>` sin `aria-hidden` o
   `role` —los treinta y pico de iconos traen `aria-hidden="true" focusable="false"`—. Las cinco
   tablas de `/entrega-comision` y la de `/cuentas` tienen `<caption>` y `scope` en **todos** sus
   `<th>`, de columna y de fila. Medido en `out/e-sonda.json` y `out/e-sonda-admin.json`, campo
   `marcado`.
2. **Los estados se anuncian, no sólo se dibujan.** Las bandas de resultado llevan el papel que les
   toca y no uno de más: `role="alert"` para error y rechazo, `role="status"` para confirmación e
   información —`AccountsPanel.razor:147,153,159,166,173,179` y
   `ClassSubmissionList.razor:68,76,85,91,97`—, y la advertencia de arrastre de la baja está
   asociada al campo por `aria-describedby="accounts-deletion-warning"`
   (`AccountsPanel.razor:210`), de modo que se anuncia **antes** de que la persona escriba. La
   región viva de reconexión existe en el documento desde la carga, que es la única forma de que un
   lector de pantalla la anuncie cuando cambie.
3. **Ninguna pantalla arroja un error de consola ni una excepción de página.** Ocho capturas del
   medio A, `--- errores --- (ninguno)` en `e-02`, `e-03`, `e-04`, `e-08` y en la reemisión de
   `e-01`; y `errores: []` en las once entradas de las sondas. Lo único que aparece es la
   advertencia de transporte de E-06 y, en una corrida, un `ERR_NETWORK_CHANGED` del contenedor que
   no es del producto (se reemitió `e-01` y desapareció). El chequeo **C-4** pasa.

---

## Solicitudes de convocatoria

- **A esta mesa, sobre el sello de versión (para F, paridad).** `VersionSeal.razor:15` dibuja
  «Versión no identificada» en el pie de la barra lateral del armazón de trabajo; en la maqueta
  aprobada ninguno de los once archivos tiene ese sello en la barra lateral —`grep` de «Versión»
  sobre `SDD/Maquetas/GeometriaFactory-Web/*.html` sólo devuelve un comentario de
  `Panel-De-Trabajos-Del-Alumno.html:105 <!-- Versión angosta: … -->`—. No es mi mandato decidir si
  falta en la maqueta o sobra en el producto; lo levanto porque la corrección de E-04 necesita saber
  a qué árbol gemelo se aplica.
- **A quien tenga el móvil.** Todo lo de E-01, E-02 y E-04 está medido a 1440x900. El armazón de
  trabajo a 360 px puede colapsar la barra lateral, y con ella cambia tanto el recorrido por teclado
  como el fondo sobre el que se mide el sello. Convendría reproducir las tres mediciones en el
  ancho angosto antes de aprobar el parche.
- **Sin observar, y lo declaro para que no se dé por cubierto.** El islote interactivo
  `WorkResolution` (`WorkView.razor:163`) es el único `@rendermode` embebido del producto y es
  exactamente donde E-03 tendría su peor forma —una resolución de trabajo a medio escribir—.
  No lo observé porque no sembré trabajos propios.

---

## Registros producidos

| Archivo en `tools/medios/out/` | Qué muestra |
|---|---|
| `e-01-ingreso.png` / `.txt` | `/ingreso` a 1440x900, sin errores de consola. El anillo verde alrededor de «Ingresar al laboratorio», justo encima del campo «Correo» (E-01). |
| `e-02-registro.png` / `.txt` | `/registro-de-cuenta`, sin errores. |
| `e-03-cuentas.png` / `.txt` | `/cuentas` como administrador. Anillo sobre el `h1` (E-01) y el sello «Versión no identificada» ilegible al pie de la barra lateral (E-04). |
| `e-04-entrega.png` / `.txt` | `/entrega-comision` como administrador, sin errores. |
| `e-05-mi-contrasena.png` / `.txt` | `/mi-contrasena`; el `.txt` registra el `goto` expirando a los 45 s por no alcanzar nunca `networkidle` (E-06). |
| `e-06-estado.txt` | `/estado`: mismo vencimiento de `networkidle` (E-06). |
| `e-07-no-encontrado.txt` | `/no-encontrado`: ídem (E-06). |
| `e-08-mis-trabajos.png` / `.txt` | `/mis-trabajos` como administrador, sin errores. |
| `e-09-corte-aviso.png` | `/mi-contrasena` tras 60 s de red cortada: el aviso de reconexión **no** llegó a mostrarse (E-06, corrida 2). |
| `e-10-tras-reconexion.png` | La misma pantalla 20 s después de restablecer la red. |
| `e-sonda.json` | Papel anónimo, ocho rutas: foco al cargar, enfocables, contrastes calculados y auditoría de marcado. |
| `e-sonda-admin.json` | Papel administrador, siete rutas: lo mismo, más los contrastes del armazón de trabajo (E-04, E-05). |
| `e-sonda2.json` | Cronología del foco a siete tiempos en tres pantallas (E-01, E-03), recorrido real de 26 `Tab` en `/cuentas` (E-02) y contraprueba del `Tab` temprano. |
| `e-sonda3.json` | Corte de red sobre `/cuentas`: **no** aplica, la pantalla es de render estático y no tiene circuito. Se conserva por honestidad del registro. |
| `e-sonda3b.json` | Corte de red sobre `/mi-contrasena`: serie a 2, 5, 10, 20, 40 y 70 s; el aviso aparece entre los 20 y los 40 s (E-06). |
| `e-sonda4.json` | Diálogo de baja abierto y no enviado: modalidad, foco de entrada, doce `Tab` y `Escape` (E-07). |
| `tools/medios/lib/e-sonda.js` … `e-sonda5.js` | Los cinco guiones de la sonda, para que cualquiera reproduzca las mediciones. |
