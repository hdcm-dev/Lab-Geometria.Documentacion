# Informe — Flujo del alumno (C)

## Mandato y alcance observado

Miré la **navegabilidad y la continuidad del recorrido de la persona que entrega**, de punta a punta
y sobre la instancia desplegada (`https://aplicada.somee.com`), con el medio A (`tools/medios/web.sh`,
Chromium en contenedor) y una sonda Playwright propia (`tools/medios/lib/c-sonda.js`) para leer el DOM
donde la imagen no alcanzaba.

**Recorrido efectivamente completado**, sembrando la cuenta `c-alumno-1e313397@mesa-ux.invalid`:

registro → pantalla de «cuenta registrada» → habilitación desde `/cuentas` con la credencial de
administrador (provisoria `dDH8jc9BgHU5`) → primer ingreso → cambio obligado de contraseña →
`/mis-trabajos` vacío → `/trabajo-nuevo` → pegado del JSON de `samples/api/01-basico/cuerpos/E5.txt`
→ **Previsualizar** (dibuja el cubo, 1 de 2 figuras) → **Enviar** → el trabajo queda en **Borrador**
con una observación → `/trabajos/{id}` con visor 3D, árbol del texto y observaciones →
`/trabajos/{id}/editar` → corrección (la `Piramide` reemplazada por un `Ortoedro` válido) →
reenvío → el trabajo queda en **Pendiente**. Trabajo sembrado: `7deb9eb8-6f3c-494e-bb31-50652d1a139a`.

Pantallas y anchos: `/registro-de-cuenta`, `/ingreso`, `/credencial-propia/cambio-obligado`,
`/mis-trabajos`, `/trabajo-nuevo`, `/trabajos/{id}`, `/trabajos/{id}/editar`, a **1440x900** y a
**390x844**. `/cuentas` sólo como instrumento para habilitar y bloquear mi propia cuenta sembrada.

**Nada me frenó**: llegué hasta el final del recorrido, incluido el reenvío. Lo que no observé:
el estado *Finalizado* / *Rechazado* (depende de una resolución del docente, que es mandato de la
comisión D), el retiro/baja de un trabajo ya entregado (no existe acción de alumno para eso: es el
hallazgo C-06), `/entrega-comision`, `/estado`, `/aprovisionamiento-inicial`, el móvil real de 360 px
(`movil.sh`, recurso serializado que no tomé) y la maqueta aprobada (mandato de F).

**Estado en que dejo el laboratorio**: la cuenta `c-alumno-1e313397@mesa-ux.invalid` quedó
**BLOQUEADA** desde `/cuentas` (`c-21-cuenta-bloqueada-1440.png`), y verifiqué que ya no puede
ingresar (`c-22-bloqueada-no-entra-1440.txt`). No toqué ninguna otra cuenta ni ningún trabajo ajeno.

## Hallazgos

Tuve nueve; me quedo con los siete de mayor severidad. Los dos que dejo fuera están al pie.

### C-01 · La pantalla de envío nunca dice qué formato ni qué vocabulario espera el «Texto del trabajo»

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/WorkSubmission.razor:288-295` — `/trabajo-nuevo`, 1440x900 y 390x844
- **Evidencia**: nivel E1 + E3 — sonda `c-sonda.js`: `TEXTAREA id=submission-text name=Input.OriginalJson ph=` (sin `placeholder`); la única guía en pantalla es `WorkSubmission.razor:99` «Pegá el texto tal como lo devolvió tu programa. No hace falta que le cambies nada.». No hay ejemplo, ni esquema, ni lista de tipos admitidos, ni enlace a nada. Capturas `c-10-trabajo-nuevo-1440.png`, `c-18-trabajo-nuevo-390.png`. Tuve que abrir `samples/api/01-basico/cuerpos/E5.txt` **fuera del producto** para saber qué pegar.
- **Severidad**: S2   **Confianza**: 0.95
- **Impacto si no se corrige**: el alumno cuyo programa produce una salida distinta de la esperada no tiene desde la pantalla ninguna forma de saber cuál era la esperada, y descubre el formato por ensayo y error contra el botón Enviar.
- **Propuesta de dirección**: que la pantalla declare, sin salir de ella, la forma que espera (un ejemplo mínimo copiable y los tipos de figura reconocidos), disponible antes de pegar y no sólo después de fallar.

### C-02 · Al primer ingreso el producto le dice al alumno «el docente te reseteó la clave», un reseteo que nunca ocurrió

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/OwnCredentialForcedChange.razor:87` — `/credencial-propia/cambio-obligado`
- **Evidencia**: nivel E3 — `c-07-alumno-primer-ingreso-1440.png` / `.txt`: en el **primer** ingreso tras la habilitación, la pantalla dice «El docente te reseteó la clave. La que te pasó sirve sólo para esto…». Y aguas arriba, `c-02-registro-hecho-1440.txt` («Tu cuenta quedó registrada… No vas a recibir ningún correo») **no menciona en ningún lado que va a existir una contraseña provisoria ni que el docente se la va a dictar**. El formulario de registro tampoco pide contraseña (`c-01-registro-1440.png`).
- **Severidad**: S2   **Confianza**: 0.9
- **Impacto si no se corrige**: el recién registrado queda sin saber qué esperar —no sabe que hay una clave que alguien le tiene que pasar— y cuando por fin entra, el producto le habla de un reseteo que él no pidió y que no existió.
- **Propuesta de dirección**: que la confirmación de registro anuncie el mecanismo completo (el docente habilita y **te dicta una provisoria**), y que la pantalla de cambio obligado distinga el primer ingreso del reseteo posterior.

### C-03 · Terminar el cambio obligado de contraseña expulsa al alumno al formulario de ingreso en vez de dejarlo adentro

- **Capa de origen**: 5 superficie
- **Ubicación**: `/credencial-propia/cambio-obligado` → `/ingreso?estado=confirmacion-contrasena`
- **Evidencia**: nivel E3 — `c-08-clave-corta-1440.txt`: `url final: https://aplicada.somee.com/ingreso?estado=confirmacion-contrasena`, con el texto «Tu contraseña quedó guardada. Ya podés entrar con ella». El alumno venía de **una sesión ya autenticada** (llegó a esa pantalla por un ingreso exitoso) y termina teniendo que tipear correo y contraseña de nuevo.
- **Severidad**: S3   **Confianza**: 0.95
- **Impacto si no se corrige**: un paso obligatorio del recorrido termina devolviendo a la persona al principio; en el teléfono, donde el tipeo cuesta, es un reingreso completo sin ninguna razón visible.
- **Propuesta de dirección**: que al guardar la contraseña la sesión continúe hasta `/mis-trabajos`, con la confirmación mostrada ahí.

### C-04 · La pantalla del trabajo, que es donde se leen las observaciones, no ofrece ninguna forma de corregirlo

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/WorkView.razor` — `/trabajos/{id}` en estado Borrador
- **Evidencia**: nivel E1 + E3 — sonda `c-sonda.js` sobre `/trabajos/7deb9eb8-…`: el inventario completo de acciones de `main` es **una sola**: `A href=/mis-trabajos txt="Volver a mis trabajos"`. Ni «Editar», ni «Reenviar», ni «Eliminar». Captura `c-14-ver-trabajo-1440.png`.
- **Severidad**: S2   **Confianza**: 0.95
- **Impacto si no se corrige**: el alumno lee qué está mal y desde ahí no puede hacer nada al respecto: tiene que volver al listado y descubrir que el acceso a la corrección estaba en la fila de la tabla, no donde estaba el diagnóstico.
- **Propuesta de dirección**: que la acción de corregir esté en la misma pantalla que las observaciones, mientras el estado la admita.

### C-05 · La observación pierde su explicación al pasar de la confirmación de envío a la pantalla del trabajo

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/WorkView.razor:199-215` (se dibuja `LocationOf(observation)` y, si los hay, los valores declarado/derivado; el texto explicativo de la observación no se dibuja)
- **Evidencia**: nivel E1 — dos registros del mismo hallazgo, misma sesión. `c-13-enviado-1440.txt` (confirmación de envío): «Figura 2 · posición 1 · campo «Tipo» / **No se pudo interpretar el campo «Tipo» de esta figura, así que la figura no se reconstruyó. El resto del texto sí se interpretó.**». `c-14-ver-trabajo-1440.txt` (pantalla del trabajo, mismo trabajo): sólo «Error / Figura 2 · posición 1 · campo «Tipo»». La frase que explica qué pasó existe únicamente en la pantalla transitoria del envío.
- **Severidad**: S2   **Confianza**: 0.9
- **Impacto si no se corrige**: el alumno que vuelve al día siguiente —el caso normal— ve un localizador sin explicación; la única versión comprensible del problema está en una pantalla a la que ya no puede volver.
- **Propuesta de dirección**: que la pantalla del trabajo muestre la observación completa, con la misma redacción que la confirmación de envío.

### C-06 · Entregar es irreversible y el producto no lo avisa ni antes ni al abrir la edición: la advertencia llega recién con el trabajo ya reescrito

- **Capa de origen**: 5 superficie
- **Ubicación**: `/trabajos/{id}/editar` con el trabajo en estado Pendiente; leyenda de `WorkSubmission.razor:306`
- **Evidencia**: nivel E3 — recorrido reproducible en tres registros. (a) Antes de enviar, la única advertencia es `c-10-trabajo-nuevo-1440.txt`: «Enviar es la única forma de guardar. Si el texto no verifica, queda en borrador y lo reenviás» — **nunca dice qué pasa si sí verifica**. (b) Con el trabajo ya en Pendiente, `/trabajos/{id}/editar` **abre igual**, titulada «Volver sobre tu borrador», con el formulario editable y el botón Enviar activo y sin ningún aviso: `c-19-editar-pendiente-1440.png` y `.txt`. (c) El bloqueo aparece **sólo después** de apretar Enviar: `c-20-reenvio-pendiente-1440.txt`, «Este trabajo está en «Pendiente» y ya no se puede modificar». Tampoco hay para el alumno ninguna acción de retiro o baja del trabajo ya entregado.
- **Severidad**: S2   **Confianza**: 0.95
- **Impacto si no se corrige**: la persona rehace su texto sobre un formulario que el producto le presentó como editable y lo pierde al enviar; y el paso más irreversible del recorrido es el único que se toma sin aviso.
- **Propuesta de dirección**: que el envío declare por adelantado que un trabajo que verifica queda cerrado, y que la edición de un trabajo no editable no se ofrezca como editable — que la pantalla lo diga al abrirse, no al enviarse.

### C-07 · El listado nombra el estado pero no dice qué significa ni que hay observaciones esperando

- **Capa de origen**: 5 superficie
- **Ubicación**: `/mis-trabajos`, 1440x900 y 390x844
- **Evidencia**: nivel E3 — `c-14a-listado-con-trabajo-1440.png`: la fila muestra «Trabajo C mesa UX · 02/09/2026 · `Borrador` · Abrir/Editar/Eliminar», sin ningún indicio de que ese Borrador tiene **una observación sin resolver** ni de que quedó así porque el texto no verificó. `c-17a-listado-390.png`: en Pendiente la fila conserva sólo «Abrir» y las acciones Editar/Eliminar desaparecen sin explicación. Los cuatro estados del filtro (Borrador, Pendiente, Finalizado, Rechazado) no se definen en ninguna pantalla del recorrido.
- **Severidad**: S3   **Confianza**: 0.85
- **Impacto si no se corrige**: el alumno que vuelve no distingue «lo dejé a medias» de «me lo rebotaron», y no sabe si le queda algo por hacer sin abrir cada trabajo uno por uno.
- **Propuesta de dirección**: que el listado diga, por fila, si hay algo pendiente de su parte, y que los estados tengan una explicación breve alcanzable desde el listado.

**Hallazgos dejados fuera por el tope de 7** (los declaro para que no se pierdan): (1) el campo
`Fecha del trabajo` se dibuja como `mm/dd/yyyy` en un producto en español rioplatense, a los dos
anchos (`c-10-trabajo-nuevo-1440.png`, `c-18-trabajo-nuevo-390.png`), S3; (2) la previsualización
dice «1 de 2 figuras se pudieron interpretar» y marca la figura como «No dibujada» **sin decir por
qué**, de modo que previsualizar no adelanta nada de lo que después dirá la observación
(`c-12-previsualizar-1440.png`), S3.

## Lo que revisé y está bien (máximo 3)

1. **El ciclo corregir-y-reenviar cierra de verdad.** Un texto que no verifica deja el trabajo en Borrador conservando todo lo escrito, la observación localiza figura y campo, y el reenvío corregido lo lleva a Pendiente sin perder nada: `c-13-enviado-1440.txt` (Borrador) → `c-16-reenviado-1440.txt` («Tu trabajo quedó en estado Pendiente… El texto se interpretó y quedó entregado»), mismo identificador de trabajo.
2. **El vacío inicial enseña qué hacer.** `/mis-trabajos` sin trabajos no muestra una tabla vacía: muestra «Todavía no cargaste ningún trabajo», la frase que ata la tarea a la Actividad 1 y un botón único «Cargar mi primer trabajo» que lleva al lugar correcto (`c-09-mis-trabajos-vacio-1440.png`, `c-11-mis-trabajos-vacio-390.png`).
3. **Ninguna pantalla del recorrido del alumno arrojó errores de consola.** Los veintidós registros `.txt` producidos cierran todos con `--- errores --- (ninguno)`, incluido el visor 3D en `/trabajos/{id}` a los dos anchos.

## Solicitudes de convocatoria

- **A la comisión E (accesibilidad y comportamiento)**: en todas las pantallas del recorrido el `document.activeElement` al cargar es el `H1`, que recibe el anillo de foco visible sin ser interactivo (sonda `c-sonda.js`: `== activeElement al cargar == H1`; visible en cada PNG de este informe). Es el chequeo C-3 del marco y no es mi mandato.
- **A la comisión B (composición y dimensionamiento)**: en `/trabajo-nuevo` y `/trabajos/{id}/editar` el **primer** `button[type=submit]` del documento es «Cerrar sesión» de la barra lateral, antes que «Enviar» (lo comprobé por accidente: `c-13` en su primera corrida cerró la sesión al apretar `button[type=submit]`). Además, «Previsualizar» queda al pie derecho del panel de dibujo, a más de 500 px por debajo del campo que previsualiza, y en 390x844 la barra de navegación con «Cerrar sesión» ocupa los primeros ~230 px de toda pantalla.
- **A quien corresponda por política de credenciales**: el cambio obligado aceptó `abc` como contraseña nueva sin ninguna objeción (`c-08-clave-corta-1440.txt`), y el campo `#forced-new` declara `aria-describedby="forced-requirement"` mientras el texto que lo describe no enuncia ningún requisito. No es mi mandato.

## Registros producidos

Todos en `tools/medios/out/`, con `.png` y `.txt` salvo las capturas intermedias (`shot`), que sólo dejan `.png`.

| Registro | Ancho | Qué muestra |
|---|---|---|
| `c-01-registro-1440` | 1440x900 | `/registro-de-cuenta` vacío: no pide contraseña |
| `c-02a-registro-lleno-1440` | 1440x900 | El formulario de registro completado (shot) |
| `c-02-registro-hecho-1440` | 1440x900 | «Tu cuenta quedó registrada»; no menciona la provisoria |
| `c-03-registro-390` | 390x844 | El registro en el teléfono |
| `c-04-ingreso-390` | 390x844 | `/ingreso` en el teléfono, con el texto del reseteo |
| `c-05-admin-cuentas-1440` | 1440x900 | `/cuentas` con la cuenta sembrada en Pendiente |
| `c-06-habilitada-1440` | 1440x900 | Habilitación y diálogo con la provisoria `dDH8jc9BgHU5` |
| `c-07-alumno-primer-ingreso-1440` | 1440x900 | Primer ingreso → cambio obligado con el texto del reseteo (C-02) |
| `c-08-clave-corta-1440` | 1440x900 | La contraseña se guarda y expulsa a `/ingreso` (C-03) |
| `c-09-mis-trabajos-vacio-1440` | 1440x900 | El vacío inicial del panel de trabajos |
| `c-10-trabajo-nuevo-1440` | 1440x900 | `/trabajo-nuevo` sin ninguna guía de formato (C-01) |
| `c-11-mis-trabajos-vacio-390` | 390x844 | El vacío inicial en el teléfono |
| `c-12a-formulario-lleno-1440` | 1440x900 | El formulario con el JSON pegado (shot) |
| `c-12-previsualizar-1440` | 1440x900 | Previsualización: 1 de 2 figuras, «No dibujada» sin motivo |
| `c-13-enviado-1440` | 1440x900 | Envío → Borrador, con la observación **explicada** (C-05) |
| `c-14a-listado-con-trabajo-1440` | 1440x900 | El listado con el Borrador, sin señal de observación (C-07) |
| `c-14-ver-trabajo-1440` | 1440x900 | `/trabajos/{id}`: visor 3D, árbol, observación sin explicación y una sola acción (C-04, C-05) |
| `c-15-editar-1440` | 1440x900 | `/trabajos/{id}/editar`: corrige a ciegas, sin las observaciones a la vista |
| `c-16-reenviado-1440` | 1440x900 | Reenvío corregido → Pendiente |
| `c-17a-listado-390` | 390x844 | El listado en Pendiente, en el teléfono |
| `c-17-detalle-pendiente-390` | 390x844 | El trabajo entregado en el teléfono, con el visor 3D |
| `c-18-trabajo-nuevo-390` | 390x844 | `/trabajo-nuevo` en el teléfono |
| `c-19-editar-pendiente-1440` | 1440x900 | La edición de un Pendiente **abre editable y sin aviso** (C-06) |
| `c-20-reenvio-pendiente-1440` | 1440x900 | El bloqueo aparece recién al enviar (C-06) |
| `c-21-cuenta-bloqueada-1440` | 1440x900 | La cuenta sembrada queda **Bloqueada** |
| `c-22-bloqueada-no-entra-1440` | 1440x900 | La cuenta bloqueada ya no ingresa |

Guion de sonda: `tools/medios/lib/c-sonda.js` (inventario de campos de `/trabajo-nuevo`, inventario
de acciones de `/trabajos/{id}` y `document.activeElement`).
