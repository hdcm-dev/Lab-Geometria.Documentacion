# Informe — Tipografía, escala y densidad (A)

## Mandato y alcance observado

Miré la razón de la escala tipográfica, el cuerpo base, la altura de línea, la medida de línea, la
jerarquía título/subtítulo/cuerpo/etiqueta/meta, el peso, el interletrado, las versalitas y la
densidad que resulta de todo eso, más el ritmo de espaciado en tanto lo sostiene.

**Medios.** Sonda propia `tools/medios/lib/a-sonda.js` (Playwright en contenedor, `getComputedStyle`
elemento por elemento, con el ancho en `ch` calculado midiendo el `0` de la fuente de cada elemento
sobre un `canvas`), corrida a **1440x900** y a **390x844** contra el producto desplegado
(`https://aplicada.somee.com`, sesión de administrador) y contra la maqueta (`http://127.0.0.1:18077`).
Segunda sonda `a-sonda2.js` para volcar el marcado y el estilo computado de la cabecera de grupo.
Capturas con `tools/medios/web.sh` y leídas con la herramienta `Read`.

**Pantallas medidas (7 del producto, 7 de la maqueta).** Producto: `/ingreso`,
`/registro-de-cuenta`, `/mis-trabajos`, `/cuentas`, `/entrega-comision`, `/trabajo-nuevo`.
Maqueta: `Ingreso`, `Registro-De-Cuenta`, `Panel-De-Trabajos-Del-Alumno`, `Panel-De-Cuentas`,
`Envio-De-Trabajo`, `Listado-De-La-Comision`, `Vista-De-Trabajo`.

**Lo que NO observé.** `/mi-contrasena` del producto: la sonda agotó los 45 s de `goto` en las dos
corridas, así que de esa pantalla no digo nada. Tampoco observé `/trabajos/{id}`,
`/trabajos/{id}/editar`, `/aprovisionamiento-inicial`, `/credencial-propia/*`, `/estado` ni
`/no-encontrado`. No observé el móvil real de 360 px (medio B, recurso serializado): todo lo que
afirmo del teléfono es a 390x844 en Chromium. No miré color ni contraste, ni ubicación de controles,
ni flujo: no es mi mandato.

---

## Hallazgos

### A-01 · El encabezado de grupo de `/entrega-comision` es un `h2` que el sistema pinta a 11 px en versalitas y en color secundario: el elemento que organiza toda la pantalla es el texto más chico y más apagado que hay en ella

- **Capa de origen**: 3 componente
- **Ubicación**: `src/GeometriaFactory.Web/wwwroot/css/app.css:715-718` (y su gemela
  `SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css`); se ve en
  `/entrega-comision` a 1440x900 y a 390x844.
- **Evidencia**: nivel **E2 + E1**.
  - E2, cita literal, `app.css:715-718`:
    `.gf-disclosure summary { cursor: pointer; font-size: var(--type-meta-size); font-weight: var(--type-meta-weight); letter-spacing: .04em; text-transform: uppercase; color: var(--color-text-secondary); }`
  - E2, la regla que esa otra pisa, `app.css:440-456`:
    `.gf-group-header { … font-family: inherit; font-size: var(--type-body-strong-size); font-weight: 500; cursor: pointer; }` — declara 14 px y **no gana**: `.gf-disclosure summary` tiene especificidad `0,1,1` contra `0,1,0` y va después. El `h2` de adentro remata la cadena con
    `app.css:470-478`: `.gf-group-heading { … font-size: inherit; font-weight: inherit; font-family: inherit; }`.
  - E1, medición: `out/a-medicion-1440.json` y `out/a-medicion-390.json`, `prod:/entrega-comision` →
    los cuatro `H2` computan `font-size: 11px`, `text-transform: uppercase`, `letter-spacing: 0.44px`.
    La sonda `a-sonda2.js` lo confirma sobre el elemento vivo: `csHeader {fs: "11px", tt: "uppercase"}`,
    `csHeading {fs: "11px", tt: "uppercase", ls: "0.44px"}`.
  - E1, captura: `out/a-entrega-1440.png` muestra `AV ADOLFO VERA — ADOLFOVER4@GMAIL.COM`; la
    equivalente de la maqueta `out/a-mq-listado-1440.png` muestra `AD Ana Diaz — ana@ej.test` a
    14 px, peso 500, caja mixta (medido: `mq:Listado-Comision H2 fs=14 fw=500 tt=none`).
  - E4, **Material Design 3, type scale**: `label-small` de 11 sp está definido para *etiquetas de
    control*, no para encabezados; los encabezados viven en `title-*`/`headline-*`. Aplica porque
    acá el rol semántico (encabezado de sección, nivel 2) recibió el token del rol más bajo de la
    escala, que es exactamente la inversión que la escala existe para impedir.
- **Severidad**: **S1**   **Confianza**: 0.97
- **Impacto si no se corrige**: en la pantalla que el docente más usa, lo único que separa un alumno
  de otro se lee más chico que los datos que agrupa, y el correo del alumno queda en versalitas con
  interletrado —`ADOLFOVER4@GMAIL.COM`—, que es la forma menos legible posible de un dato que se lee
  carácter por carácter y que además se transcribe. La cabecera deja de funcionar como punto de
  anclaje al recorrer la lista.
- **Propuesta de dirección**: que el encabezado de grupo recupere el rol tipográfico de encabezado
  —el que la maqueta aprobada ya le da y que `.gf-group-header` ya declara— y que la regla genérica
  de `summary` deje de alcanzarlo. Ningún dato de identidad de una persona (nombre, correo) debe
  llevar `text-transform: uppercase`.

### A-02 · La escala tipográfica no tiene razón: sus cuatro pasos valen 1,077 · 1,083 · 1,091 · 1,214, y el título es apenas 1,31 veces el cuerpo

- **Capa de origen**: 2 tokens
- **Ubicación**: `src/GeometriaFactory.Web/wwwroot/css/app.css:90-94` y su gemela
  `Estilos-Maqueta.css:83-87`.
- **Evidencia**: nivel **E2 + E1 + E4**.
  - E2, cita literal, `app.css:87-94`:
    ```
    /* --- tipografía (base §2.2) ------------------------------------------- */
    --type-title-size:        17px; --type-title-weight:        500;
    --type-body-strong-size:  14px; --type-body-strong-weight:  500;
    --type-body-size:         13px; --type-body-weight:         400;
    --type-caption-size:      12px; --type-caption-weight:      400;
    --type-meta-size:         11px; --type-meta-weight:         500;
    ```
    El comentario remite a un «base §2.2» y **no declara ninguna razón**. C-1 del marco (§3-bis) pide
    exactamente eso: «los pasos no siguen una razón declarada».
  - Razones calculadas: 12/11 = **1,091**; 13/12 = **1,083**; 14/13 = **1,077**; 17/14 = **1,214**.
    Rango total 17/11 = **1,545** para cinco pasos.
  - Jerarquía efectiva: **título/cuerpo = 17/13 = 1,308** y **subtítulo/cuerpo = 14/13 = 1,077**, con
    **el mismo peso 500 en los dos**: entre un `h1` y un `h2` no hay ni tamaño ni peso que los separe.
  - E1, medición: en las 6 pantallas del producto medidas a 1440 y a 390, el reparto de tamaños es
    siempre `{11, 12, 13, 14, 17}`; en `/cuentas` a 1440, 20 de 55 elementos son 13 px/400 y 14 son
    11 px/500 (`out/a-medicion-1440.json`).
  - E4, **Tim Brown, «More Meaningful Typography» (A List Apart, 2011)** y la práctica de escala
    modular que de ahí salió: una escala se genera con **una** razón, y la más chica de uso corriente
    es la tercera menor, **1,2**. Cuatro razones distintas, tres de ellas por debajo de 1,1, no
    generan escala: generan cinco tamaños casi iguales.
  - E4, **Material Design 3, type scale**: la razón entre el cuerpo (`body-medium`, 14 sp) y el
    encabezado de pantalla (`headline-small`, 24 sp) es **1,71**; contra `display-small` (36 sp),
    **2,57**. Aplica porque es el sistema de referencia del mismo problema —una escala de producto
    con familia neutra— y fija el orden de magnitud que hace visible una jerarquía.
- **Severidad**: **S2**   **Confianza**: 0.95
- **Impacto si no se corrige**: es literalmente lo que el Product Owner señaló. Con pasos de 1 px la
  jerarquía no se percibe: en `out/a-ingreso-390.png` el `h1` «Ingresar al laboratorio» (17 px) y la
  marca «Fábrica de Geometría» (14 px) pesan lo mismo, y en `out/a-entrega-1440.png` el `h1` de la
  pantalla no se distingue del texto de las filas. Todo el producto se lee como un solo bloque plano
  y el usuario no tiene por dónde entrar a la pantalla.
- **Propuesta de dirección**: que la escala se genere con **una razón declarada en el propio archivo**
  (≥ 1,2 entre pasos consecutivos), que la razón **título/cuerpo quede en 1,5 o más** —el umbral que
  el moderador de objetivos ya propuso— y que entre título y subtítulo exista un escalón real, de
  tamaño o de peso, y no de 1 px. Se cambia la escala, **no** la familia: el contrato de entrada lo
  autoriza expresamente (`Mesa-UX-UI.md` §6-bis, «cambiar la escala de tamaños dentro de la misma
  familia no lo es [cambio de alcance]»).

### A-03 · El cuerpo base de 13 px, y en particular los campos de formulario a 13 px, quedan por debajo de todo mínimo nombrado, y en el teléfono disparan el zoom automático del navegador

- **Capa de origen**: 2 tokens
- **Ubicación**: `app.css:92` (`--type-body-size: 13px`), `app.css:133` (`body.gf-body { font-size: var(--type-body-size); }`), `app.css:283-284` (`.gf-input`), `app.css:323` (`.gf-btn`). Pantallas `/ingreso`, `/registro-de-cuenta`, `/cuentas` a **390x844**.
- **Evidencia**: nivel **E1 + E2 + E4**.
  - E2, `app.css:284`: `font-family: inherit; font-size: var(--type-body-size); color: var(--color-text-primary);` dentro del bloque `.gf-input, .gf-select, .gf-textarea`.
  - E1, medición a 390x844 (`out/a-medicion-390.json`): **todos** los campos computan `font-size: 13px` —
    `#signin-email`, `#signin-password`, `#registration-email`, `#registration-first-name`,
    `#registration-last-name`, `#accounts-search`—, con caja de 38 px de alto, y los botones 13 px con
    36 px de alto. La etiqueta de cada campo es `--type-caption-size` = **12 px**.
  - E1, medición comparada 1440 vs 390: el reparto de tamaños es **idéntico** en los dos anchos; el
    bloque `@media (max-width: 768px)` de `app.css:837-875` contiene **cero** declaraciones de
    `font-size` (verificado por conteo). El sistema no responde al ancho en nada tipográfico.
  - E1, captura `out/a-ingreso-390.png`: el formulario completo cabe en el tercio superior de una
    pantalla de 844 px de alto, con las etiquetas «Correo» y «Contraseña» a 12 px.
  - E4, **WebKit / Safari en iOS**: un control de formulario con `font-size` menor a **16 px** hace que
    el navegador **acerque el viewport al enfocarlo**, y el usuario queda con la página desplazada y
    fuera de escala. Aplica de lleno: `US-1` del marco (§4.3) es «alumno … entra desde el teléfono», y
    lo primero que toca es `#signin-email`.
  - E4, **Apple HIG, Typography (iOS)**: el cuerpo por omisión es **17 pt** y 11 pt es el piso
    absoluto para texto auxiliar. **Material Design 3**: `body-large` 16 sp / `body-medium` 14 sp; no
    hay ningún rol de cuerpo por debajo de 14 sp. 13 px de cuerpo queda por debajo de los dos.
- **Severidad**: **S2**   **Confianza**: 0.9 (0.75 para el zoom de iOS: es comportamiento documentado
  del motor, pero el contrato declara a WebKit `sin_observar` y no lo pude medir)
- **Impacto si no se corrige**: el alumno que entra desde el teléfono —el recorrido de primer uso—
  pelea con un formulario cuyo texto está por debajo del mínimo de la plataforma y que, en Safari,
  además le mueve la pantalla apenas toca el primer campo.
- **Propuesta de dirección**: subir el cuerpo base a un valor que esté dentro de los mínimos
  nombrados, y que **los controles de formulario no bajen de 16 px en anchos de teléfono**, aunque el
  cuerpo de la página sea menor. La regla se escribe una vez, en el token o en el componente de
  campo, no pantalla por pantalla.

### A-04 · La medida de línea no está acotada fuera del encabezado de página: un párrafo del producto mide 171 caracteres por renglón a 1440 px

- **Capa de origen**: 3 componente
- **Ubicación**: `app.css:176` (`.gf-caption`, sin `max-width`) contra `app.css:268`
  (`.gf-page-header .gf-subtitle { … max-width: 62ch; }`). Se ve en `/entrega-comision` a 1440x900,
  párrafo emitido en `src/GeometriaFactory.Web/Components/Pages/ClassSubmissionList.razor:269`.
- **Evidencia**: nivel **E1 + E2 + E4**.
  - E2, `app.css:176`: `.gf-caption { font-size: var(--type-caption-size); font-weight: var(--type-caption-weight); color: var(--color-text-secondary); }` — ni `max-width` ni medida.
  - E2, `ClassSubmissionList.razor:269`:
    `<p class="gf-caption gf-mt-5">Sólo figuran los alumnos con trabajos entregados. Si un alumno no aparece, todavía no entregó nada.</p>`
  - E1, medición a 1440 (`out/a-medicion-1440.json`, `prod:/entrega-comision`): ese `<p>` computa
    **171,2 ch** de ancho. El mismo párrafo en la maqueta (`mq:Listado-Comision`) mide también
    **171,2 ch**: el defecto está en la capa compartida, no en la superficie Blazor.
    Otros del mismo tipo en la maqueta: `mq:Vista-Trabajo` con **112,7 ch** y **107,7 ch**.
    Y `prod:/entrega-comision` `span.gf-group-name` a **165 ch**.
  - E4, **Robert Bringhurst, «The Elements of Typographic Style», §2.1.2**: «cualquier cosa entre
    **45 y 75 caracteres** se considera una longitud de línea satisfactoria», con **66** como ideal
    para una columna simple. Aplica porque es la regla canónica de medida y la que el propio sistema
    ya usó al escribir `62ch` en la línea 268.
  - E4, **WCAG 2.2, SC 1.4.8 Visual Presentation (AAA)**: el ancho no debe superar **80 caracteres**.
    171 ch es más del doble.
- **Severidad**: **S3**   **Confianza**: 0.95
- **Impacto si no se corrige**: los renglones largos hacen perder el salto de línea —el ojo vuelve al
  renglón que ya leyó—, y el texto que explica por qué un alumno no aparece en la lista es
  precisamente el que hay que leer entero cuando algo no cuadra.
- **Propuesta de dirección**: que **toda prosa** del sistema —no sólo el subtítulo del encabezado de
  página— tenga una medida acotada, con el mismo criterio y el mismo valor que ya está escrito en la
  línea 268, y que el tope viva en el rol tipográfico y no en el contenedor.

### A-05 · El ritmo de espaciado contradice el comentario que lo declara: dice «escala base 4» y tres de sus nueve pasos no son múltiplos de 4; cinco pasos se apiñan en una banda de 8 px y uno no se usa nunca

- **Capa de origen**: 2 tokens
- **Ubicación**: `app.css:96-99`; gemela `Estilos-Maqueta.css:89-92`.
- **Evidencia**: nivel **E2 + E1**.
  - E2, cita literal, `app.css:96-99`:
    ```
    /* --- espaciado (base §2.3, escala base 4) ------------------------------ */
    --space-1:  4px; --space-2:  8px; --space-3: 12px; --space-4: 14px;
    --space-5: 16px; --space-6: 18px; --space-7: 20px; --space-8: 22px;
    --space-9: 28px;
    ```
    **14, 18 y 22 no son múltiplos de 4.** El archivo afirma de sí mismo algo que sus propios valores
    desmienten en la línea siguiente.
  - Progresión: +4, +4, **+2, +2, +2, +2, +2**, +6. Cinco pasos (`--space-4` a `--space-8`) viven
    dentro de una banda de 8 px y no se distinguen entre sí en pantalla. Es literalmente el modo de
    falla que el marco nombra en C-2 (§3-bis): «la progresión es arbitraria (pasos de 2 px sin
    criterio) o hay más pasos que usos».
  - E1, conteo de usos sobre `app.css`: `--space-1` 14, `--space-2` 36, `--space-3` 44, `--space-4` 26,
    `--space-5` 21, `--space-6` 5, `--space-7` 5, **`--space-8` 0**, `--space-9` 4. Verificado también
    en `Estilos-Maqueta.css`: `--space-8` aparece **0** veces. **Hay más pasos que usos.**
- **Severidad**: **S3**   **Confianza**: 0.98
- **Impacto si no se corrige**: el ritmo no puede sostener la jerarquía tipográfica —si el salto entre
  un nivel y el siguiente es de 2 px, el lector no lo lee como salto—, y quien construya una pantalla
  nueva elige entre `14`, `16`, `18`, `20` y `22` sin ningún criterio para decidir, que es cómo un
  sistema de espaciado se convierte en una lista de números.
- **Propuesta de dirección**: que el ritmo tenga la progresión que su comentario declara —o que el
  comentario diga la que efectivamente hay—, con menos pasos y distinguibles entre sí, y que ningún
  paso quede sin uso. Es la contraparte de A-02: una escala con razón necesita un ritmo con razón.

### A-06 · La altura de línea del cuerpo es 1,45 y no llega al 1,5 que la norma pide, y el mismo 1,45 se aplica al texto de 11 px en versalitas, donde no alcanza

- **Capa de origen**: 3 componente
- **Ubicación**: `app.css:134` (`line-height: 1.45` en `body.gf-body`), `app.css:141-142`
  (`line-height: 1.2` en `h1` y en `h2, h3, h4`), `app.css:177-178` (`.gf-meta`).
- **Evidencia**: nivel **E2 + E1 + E4**.
  - E2, `app.css:132-136`: `body.gf-body { … font-size: var(--type-body-size); line-height: 1.45; … }`.
  - E1, medición: en las **13** pantallas medidas (producto y maqueta, 1440 y 390) el cuerpo computa
    invariablemente `font-size: 13px` / `line-height: 18.85px` → **1,45**; los `h1` y `h2` computan
    **1,2**; los bloques de `.gf-caption` y `.gf-meta` heredan **1,45**.
  - E4, **WCAG 2.2, SC 1.4.8 Visual Presentation (AAA)**: el interlineado dentro de un párrafo debe
    ser **al menos 1,5** veces el tamaño de la letra. 1,45 se queda a 0,05 y ningún texto largo del
    producto lo cumple. La misma cifra reaparece en **SC 1.4.12 Text Spacing (AA)**, que exige que el
    contenido siga siendo usable cuando el usuario **impone** 1,5: un sistema que ya diseñó a 1,45 no
    dejó holgura para absorber ese ajuste.
  - E4, práctica corriente de tipografía de pantalla: la altura de línea sube al bajar el cuerpo y al
    subir la medida. Acá pasa lo contrario en los dos ejes: el texto **más chico** (11 y 12 px) y el
    **más ancho** (171 ch, A-04) son los que se quedan con la altura de línea del cuerpo.
- **Severidad**: **S3**   **Confianza**: 0.85
- **Impacto si no se corrige**: los párrafos largos y anchos quedan sin aire suficiente para que el
  ojo encuentre el renglón siguiente, y el producto queda a 0,05 de un criterio nombrado que podría
  cumplir sin costo.
- **Propuesta de dirección**: que la altura de línea del texto corrido llegue al umbral de 1,5, y que
  sea función del rol tipográfico —más aire para los roles chicos y para las medidas largas— en lugar
  de un único valor heredado del `body`.

### A-07 · La densidad es la misma a 1440 px que a 390 px: el sistema no ajusta un solo tamaño de letra al ancho

- **Capa de origen**: 2 tokens
- **Ubicación**: `app.css:837-875`, el único `@media (max-width: 768px)` del archivo.
- **Evidencia**: nivel **E1 + E2**.
  - E2, conteo sobre el bloque: `app.css` declara `font-size` **61** veces; dentro del bloque de
    768 px, **0**. El bloque reordena la disposición (`flex-direction`, `grid-template-columns`,
    `display`) y no toca la tipografía.
  - E1, medición: el reparto de tamaños de `/ingreso`, `/registro-de-cuenta`, `/mis-trabajos`,
    `/cuentas`, `/entrega-comision` y `/trabajo-nuevo` es el **mismo conjunto** `{11,12,13,14,17}` a
    1440x900 y a 390x844 (`out/a-medicion-1440.json` vs `out/a-medicion-390.json`).
  - E1, el efecto en los dos extremos: a **1440** el `h1` de `/entrega-comision` mide 17 px sobre una
    columna de contenido de ~1272 px —un título que ocupa 446 px de 1272, es decir el 35 % del ancho—
    mientras la prosa de al lado corre 171 ch (A-04): la página se ve vacía arriba y saturada abajo.
    A **390** el mismo 17 px es el título de una tarjeta de 316 px de ancho, y ahí conviven con él
    campos de 13 px y etiquetas de 12 px (`out/a-ingreso-390.png`, `out/a-entrega-390.png`).
- **Severidad**: **S3**   **Confianza**: 0.9
- **Impacto si no se corrige**: un mismo cuerpo de 13 px que es *chico* en el escritorio es *chico*
  en el teléfono por motivos distintos, y ninguno de los dos anchos recibe la densidad que le
  corresponde. Es la otra mitad de «las proporciones son inadecuadas»: no sólo la razón entre pasos,
  también la ausencia de una proporción distinta por ancho.
- **Propuesta de dirección**: que la escala tenga al menos dos puntos de anclaje por ancho —o que se
  exprese en unidades que respondan al ancho—, de manera que el título gane presencia en el
  escritorio y el cuerpo gane tamaño en el teléfono, sin duplicar reglas por pantalla.

---

## Lo que revisé y está bien (máximo 3)

1. **El subtítulo del encabezado de página tiene medida acotada, y la medida es la correcta.**
   `app.css:268`: `.gf-page-header .gf-subtitle { margin: var(--space-1) 0 0; max-width: 62ch; }`.
   Medido a 1440 en `/entrega-comision`: **62,0 ch** exactos, y **60,7 ch** en `/trabajo-nuevo`.
   Cae de lleno en el rango 45–75 de Bringhurst. El criterio existe y está bien elegido; lo que
   falta es aplicarlo al resto de la prosa (A-04).
2. **Los números tienen cifras de ancho fijo.** `app.css:180`:
   `.gf-num { font-variant-numeric: tabular-nums; }`, usado en el recuento de trabajos y en las
   columnas numéricas. Es la decisión correcta para datos en columna y no es habitual verla tomada.
3. **La familia tipográfica es una sola y no hay literales de tamaño fuera de la escala en el
   producto.** Los 61 `font-size` de `app.css` resuelven todos contra un `--type-*-size`, y las
   mediciones sobre las seis pantallas del producto no encontraron **ningún** tamaño fuera del
   conjunto `{11,12,13,14,17}` (los `13,3333` y `17,3333` que aparecen a 1440 son de la franja
   publicitaria que inserta el alojamiento de Somee, no del producto). La escala está mal
   proporcionada, pero está **cerrada**: corregir los cinco tokens corrige el producto entero.

---

## Solicitudes de convocatoria

- **A la comisión F (paridad maqueta ↔ producto).** El hallazgo A-01 es también un desvío de paridad:
  la maqueta emite la cabecera de grupo como `<h2><button …>` a `--type-body-strong-size` (medido:
  `mq:Listado-Comision H2 fs=14 fw=500 tt=none`) y el producto la emite como `<summary><h2>`, forma
  que activa `.gf-disclosure summary` y la degrada a 11 px en versalitas. La diferencia es de
  **marcado**, no de hoja de estilos, y por eso la regla de paridad de `Mesa-UX-UI.md` §1-bis no la
  detecta comparando las dos hojas. No lo trato yo: mi mandato termina en la tipografía resultante.
- **A la comisión E (accesibilidad y comportamiento).** En las capturas `out/a-entrega-1440.png`,
  `out/a-ingreso-390.png` y `out/a-trabajonuevo-390.png` el `h1` aparece con el anillo de foco al
  cargar la pantalla, sin que nadie lo haya enfocado (chequeo C-3 del marco). Lo registro porque lo
  vi; no es mi mandato y no lo emito como hallazgo.
- **A la comisión B (composición y dimensionamiento).** El `span.gf-group-name` de
  `/entrega-comision` mide **165 ch** a 1440 px con `white-space: nowrap` y elipsis: la cabecera se
  estira hasta el ancho completo. La consecuencia tipográfica ya está en A-04; la decisión de ancho
  es de B.

---

## Registros producidos

| Archivo | Qué muestra |
|---|---|
| `tools/medios/lib/a-sonda.js` | La sonda: `getComputedStyle` de todo elemento de texto visible de 14 pantallas, con `font-size`, `line-height`, `font-weight`, `letter-spacing`, `text-transform` y el ancho en `ch` medido contra la fuente real de cada elemento |
| `tools/medios/lib/a-sonda2.js` | Sonda dirigida: marcado y estilo computado de la cabecera de grupo de `/entrega-comision`, y las reglas de la hoja desplegada que la gobiernan |
| `tools/medios/out/a-medicion-1440.json` | Medición completa a 1440x900: 6 pantallas del producto + 7 de la maqueta. Es el ancla de A-01, A-02, A-04, A-06 y A-07 |
| `tools/medios/out/a-medicion-390.json` | Misma medición a 390x844. Ancla de A-03 y A-07 |
| `tools/medios/out/a-entrega-1440.png` / `.txt` | `/entrega-comision` a 1440, página completa: las cabeceras de grupo en versalitas de 11 px (A-01) y el párrafo de 171 ch al pie (A-04) |
| `tools/medios/out/a-entrega-390.png` / `.txt` | La misma pantalla a 390: la escala no cambió (A-07) |
| `tools/medios/out/a-mq-listado-1440.png` / `.txt` | `Listado-De-La-Comision` de la maqueta a 1440: la cabecera de grupo a 14 px en caja mixta, contraprueba de A-01 |
| `tools/medios/out/a-ingreso-1440.png` / `.txt` | `/ingreso` a 1440: título 17 px contra cuerpo 13 px (A-02) |
| `tools/medios/out/a-ingreso-390.png` / `.txt` | `/ingreso` a 390: campos a 13 px y etiquetas a 12 px (A-03); marca de 14 px y `h1` de 17 px sin jerarquía perceptible (A-02) |
| `tools/medios/out/a-cuentas-1440.png` / `.txt` | `/cuentas` a 1440: densidad de la tabla con 20 elementos a 13 px y 14 a 11 px |
| `tools/medios/out/a-trabajonuevo-390.png` / `.txt` | `/trabajo-nuevo` a 390: el anillo de foco en el `h1` y la escala sin ajuste por ancho |
| `tools/medios/out/a-probe-conn.png` / `.txt` | Prueba de alcance de la instancia desplegada, previa a todo lo demás |
