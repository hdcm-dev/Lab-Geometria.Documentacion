# Informe — Administración y prestabilidad de las funcionalidades (D)

## Mandato y alcance observado

Miré si **cada acción declarada del papel administrador existe en la pantalla, se alcanza y produce
su efecto observable**, y si cuando falla lo dice. Medio A (`tools/medios/web.sh`, Chromium en
contenedor, 1440x900, `--full`) sobre `https://aplicada.somee.com`, más cuatro sondas propias en
`tools/medios/lib/d-*.js` para lo que el clic de `web.sh` no alcanza (selects, dos ventanas
simultáneas, volcado de diálogos). Pantallas recorridas: `/ingreso`, `/registro-de-cuenta`,
`/cuentas`, `/entrega-comision`, `/trabajos/{id}`, `/credencial-propia/cambio-obligado`,
`/trabajo-nuevo` (sólo para sembrar).

**Siembra propia, según §6-bis del marco.** Registré `d-alumno-daf7260b@mesa-ux.invalid` («Comision
DeeUx»), la habilité, entré como ese alumno, envié dos trabajos —`Cubo de la mesa UX D`
(`bd5d056f-…`) y `Cubo chico de la mesa UX D` (`15d039f1-…`)— y ejercí sobre **esos dos** todas las
acciones de resolución. Ninguna acción tocó a Adolfo Vera, Damian Perez ni fernando rafale
filipuzzi: sus siete filas quedaron `Pendiente` de punta a punta (comparar `d-09` con `d-35`).
**La cuenta sembrada quedó dada de baja** (`d-33-baja-aplicada`), y con ella sus trabajos; el ingreso
con esa credencial ya es rechazado (`d-34`).

**Respuesta al reporte del Product Owner.** Lo que reportó **está resuelto**: aprobar, rechazar y
retirar existen, se alcanzan desde el listado, piden confirmación con la consecuencia escrita y
**cambian el estado en el listado**: `Pendiente → Finalizado` (`d-11`), `Pendiente → Rechazado`
(`d-13`), y `Retirar` borra la fila (`d-14`). El comentario del docente llega al alumno (`d-23`).
Los defectos que siguen son de **anuncio y de contexto**, no de efecto.

**Lo que NO llegué a observar**: 390 px y móvil real (no me tocaba y el recurso es serializado); el
papel administrador sobre trabajos de más de una comisión; la acción «Copiar la provisoria» (el
portapapeles del contenedor no es observable); qué pasa con un trabajo `Finalizado` que se retira
**después** de que el alumno lo abrió; y la recuperación de la sesión tras caída de red.

## Hallazgos

### D-01 · Aprobar, rechazar y retirar no confirman nada: el administrador vuelve al listado sin ningún mensaje de que la operación se aplicó
- **Capa de origen**: 5 superficie
- **Ubicación**: `/trabajos/{id}` → `/entrega-comision`, 1440x900
- **Evidencia**: nivel E1 — `d-11-aprobar-listado-despues.txt`, `d-13-…txt` y `d-14-…txt` no
  contienen la línea «La operación se aplicó y la lista se volvió a pedir», que **sí** aparece en
  `d-17-bloquear-despues.txt` y `d-33-baja-aplicada.txt` para las operaciones de `/cuentas`. La
  captura `d-11d-detalle-despues` muestra el listado sin banner alguno.
- **Severidad**: S2   **Confianza**: 0.95
- **Impacto si no se corrige**: el docente que aprueba un trabajo es devuelto a una lista de siete
  filas sin que nada le diga qué pasó; tiene que buscar la fila y leer el cartelito de estado para
  saber si su clic hizo algo. Es exactamente la sensación que reportó el Product Owner —«el botón no
  hace nada»— sobreviviendo a un producto que sí lo hace.
- **Propuesta de dirección**: que la resolución de una entrega anuncie su resultado con el mismo
  patrón que ya usa `/cuentas`, nombrando el trabajo y el desenlace.

### D-02 · «Rehabilitar» una cuenta bloqueada le destruye la contraseña al alumno, y eso no se dice antes de apretar
- **Capa de origen**: 5 superficie
- **Ubicación**: `/cuentas`, fila de la cuenta bloqueada, botón `Rehabilitar`
- **Evidencia**: nivel E1 — `d-17-bloquear-despues.txt` (queda `Bloqueada`), `d-19-rehabilitar-despues.png`:
  el clic en `Rehabilitar`, **sin confirmación previa**, abre «Contraseña provisoria de Comision
  DeeUx … No se vuelve a mostrar». `d-20-ingreso-clave-vieja.txt`: la contraseña que el alumno había
  elegido ya no lo deja pasar, cae en `/credencial-propia/cambio-obligado`. Que el reseteo es real y
  no cosmético lo prueba `d-22-cambio-provisoria-falsa.txt`: «La contraseña provisoria que escribiste
  no corresponde. Tu contraseña no cambió».
- **Severidad**: S2   **Confianza**: 0.9
- **Impacto si no se corrige**: el docente bloquea una cuenta por una clase y al rehabilitarla deja
  al alumno afuera sin saberlo. Si cierra el modal con «Listo» sin copiar la provisoria —y nada le
  advierte que va a aparecer— la contraseña se pierde y hace falta otro reseteo.
- **Propuesta de dirección**: que rehabilitar y resetear sean dos cosas distintas, o que
  `Rehabilitar` declare **antes** del clic que va a generar una provisoria, con la misma
  confirmación que ya tienen el reseteo y la baja.

### D-03 · Las operaciones de fila tiran abajo el filtro con el que el administrador encontró la cuenta
- **Capa de origen**: 5 superficie
- **Ubicación**: `/cuentas`, enlaces `Resetear la contraseña` y `Dar de baja` de cada fila, y el
  `Cancelar` de sus diálogos
- **Evidencia**: nivel E1 — volcado del marcado en `d-fila.js`: son `<a href="/cuentas?reseteo={id}">`
  y `<a href="/cuentas?baja={id}">`, sin el `buscar` vigente, y el `Cancelar` del diálogo apunta a
  `/cuentas` pelado (volcado de `d-conf.js`). Medido: `d-29-resetear-despues.txt` sale de
  `/cuentas?buscar=daf7260b` y termina en `/cuentas?reseteo=d0f6a607-…` mostrando otra vez las seis
  cuentas; `d-33-baja-aplicada.txt` vuelve al listado completo después de la baja. En contraste, el
  formulario de `Bloquear` sí conserva el filtro: `action="/cuentas?buscar=daf7260b"`.
- **Severidad**: S3   **Confianza**: 0.95
- **Impacto si no se corrige**: con una comisión de treinta alumnos, cada operación obliga a volver
  a tipear el filtro; y como la lista vuelve completa, la fila sobre la que se acaba de operar hay
  que buscarla de nuevo para comprobar el efecto.
- **Propuesta de dirección**: que toda operación de fila y su cancelación regresen al listado **tal
  como estaba filtrado**, como ya hace el cambio de situación.

### D-04 · La pantalla avisa que el trabajo ya no existe, pero sigue mostrándolo y ofreciendo la acción
- **Capa de origen**: 5 superficie
- **Ubicación**: `/trabajos/{id}` de un trabajo retirado desde otra ventana
- **Evidencia**: nivel E3 — recorrido en `d-concurrencia.js` con dos sesiones de administrador sobre
  `15d039f1-…`: la ventana 2 lo retira; la ventana 1, que lo tenía abierto, aprieta `Retirar` y
  confirma. `d-31c-ventana-vieja-despues.png`: sale el aviso rojo «No encontramos ese trabajo.»
  —bien— pero debajo siguen el título, el estado `Rechazado`, el 3D, el comentario del docente y un
  botón `Retirar` habilitado, junto al texto contradictorio «Esta entrega ya tiene desenlace y no se
  puede cambiar». Sin errores de consola.
- **Severidad**: S3   **Confianza**: 0.9
- **Impacto si no se corrige**: el docente puede seguir apretando indefinidamente una acción sobre
  un trabajo borrado, y la pantalla le sigue mostrando datos que ya no están en ningún lado.
- **Propuesta de dirección**: que el aviso de «no existe» sea terminal en esa pantalla: sin acciones
  ofrecidas y con la única salida al listado.

### D-05 · Un enlace directo a una pantalla de administración sin sesión rebota al ingreso sin decir por qué y sin volver después
- **Capa de origen**: 5 superficie
- **Ubicación**: cualquier ruta de administrador; medido en `/cuentas?buscar=daf7260b`
- **Evidencia**: nivel E1 — `d-27-cuentas-sin-sesion.txt`: pedida sin sesión, `url final:
  https://aplicada.somee.com/ingreso`, y el texto visible es el formulario pelado, **sin una sola
  línea que explique el rebote**. `d-28-rebote-y-vuelta.txt`: tras ingresar desde ese rebote, la
  `url final` es `/entrega-comision` — se perdieron la pantalla pedida y su filtro. Ocurrió también
  en uso real, a mitad de una sesión que venía funcionando: `d-25a-resetear-antes.png` es el
  formulario de ingreso donde tenía que haber estado el listado de cuentas.
- **Severidad**: S3   **Confianza**: 0.85
- **Impacto si no se corrige**: el docente que guardó el enlace de una cuenta, o al que se le venció
  la sesión, aterriza en un ingreso mudo y después en otra pantalla, sin entender qué pasó con lo
  que había pedido.
- **Propuesta de dirección**: decir por qué se volvió al ingreso y regresar a la pantalla pedida,
  con su filtro, después de ingresar.

### D-06 · Con un reseteo pendiente, una contraseña equivocada no se denuncia: el ingreso deja pasar a la pantalla de cambio obligado
- **Capa de origen**: 5 superficie
- **Ubicación**: `/ingreso` → `/credencial-propia/cambio-obligado`
- **Evidencia**: nivel E1 — `d-21-ingreso-clave-falsa.txt`: con `estoNoEsLaClave999` la `url final`
  es `/credencial-propia/cambio-obligado` y el texto dice «El docente te reseteó la clave», sin
  ningún error. Comparar con `d-34-ingreso-cuenta-dada-de-baja.txt`, donde una credencial mala sí
  produce «El correo o la contraseña no corresponden». **No es un pase libre**:
  `d-22-cambio-provisoria-falsa.txt` muestra que el cambio se rechaza sin la provisoria correcta.
- **Severidad**: S3   **Confianza**: 0.9
- **Impacto si no se corrige**: el alumno que se equivoca al tipear queda en una pantalla que le
  pide una provisoria que quizá nunca le dieron, y el docente recibe el reclamo como «no puedo
  entrar» sin poder distinguir un error de tipeo de un reseteo mal comunicado.
- **Propuesta de dirección**: que el ingreso diga que la credencial no corresponde antes de derivar
  a cambiar la contraseña.

### D-07 · El aviso de trabajo inexistente afirma algo que no ocurrió
- **Capa de origen**: 5 superficie
- **Ubicación**: `/trabajos/{id}` de un trabajo retirado, abierto por URL
- **Evidencia**: nivel E1 — `d-15-trabajo-retirado-url.txt`: «No encontramos ese trabajo. **Volviste
  al listado desde el que lo pediste.**», y sin embargo `url final:
  https://aplicada.somee.com/trabajos/bd5d056f-…`, con la página vacía salvo el enlace de vuelta.
- **Severidad**: S4   **Confianza**: 0.95
- **Impacto si no se corrige**: el mensaje describe una navegación que no pasó, y el docente que lo
  lee no sabe si está en el listado o no.
- **Propuesta de dirección**: que el texto describa dónde está la persona, o que el producto haga lo
  que el texto dice.

## Lo que revisé y está bien (máximo 3)

1. **La resolución de entregas funciona de punta a punta, y con red de seguridad.** `Aprobar`,
   `Rechazar` y `Retirar` existen en `/trabajos/{id}`, se alcanzan con un clic desde el listado, y
   cada una abre un diálogo que declara la consecuencia antes de ejecutarla («El trabajo pasa a
   Finalizado. Es definitivo», «El trabajo deja de existir y desaparece también del listado de
   Comision DeeUx»). El efecto queda en el listado: `Finalizado` (`d-11`), `Rechazado` (`d-13`),
   fila borrada (`d-14`). Y el comentario del docente le llega al alumno tal cual, bajo «COMENTARIO
   DEL DOCENTE» (`d-23-alumno-ve-rechazo.txt`).
2. **Las cinco operaciones sobre cuentas existen y tienen efecto comprobado, no sólo cartel.**
   Habilitar (`d-04`), Bloquear (`d-17`) —y el bloqueo se siente: el alumno es rechazado con «Tu
   cuenta dejó de estar habilitada. Pedile al docente que la rehabilite» (`d-18`)—, Rehabilitar
   (`d-19`), Resetear (`d-30`) y Dar de baja (`d-33`), esta última protegida por tipeo del correo
   completo, con el botón deshabilitado hasta que coincide.
3. **Los filtros de las dos pantallas filtran, quedan en la URL y retienen lo elegido.**
   `/entrega-comision?alumno=&estado=Rechazado` y `/cuentas?buscar=daf7260b&situacion=Habilitada`
   devuelven exactamente lo pedido, los controles siguen mostrando el valor aplicado, y el caso
   vacío tiene su propio texto con salida («Ninguna cuenta coincide con el filtro … Limpiar el
   filtro»). Medido en `d-16b`…`d-16e` y en la sonda `d-retencion.js`. Ninguna de las trece capturas
   del recorrido arrojó `console:` ni `pageerror:` del producto.

## Solicitudes de convocatoria (si las hay)

- **A la comisión B (composición y dimensionamiento)**: el modal de contraseña provisoria se abre
  centrado y tapa la columna `SITUACIÓN` de la fila sobre la que se acaba de operar, que es
  justamente lo que hay que verificar (`d-04-habilitar-despues.png`, `d-19-rehabilitar-despues.png`).
- **A la comisión E (accesibilidad y comportamiento)**: al cargar `/cuentas` y `/entrega-comision`
  el `h1` aparece con anillo de foco sin ser interactivo (`d-03-cuentas.png`,
  `d-11d-detalle-despues.png`). Es el chequeo C-3 y no es de mi mandato.

## Registros producidos

Todos en `tools/medios/out/`.

| Registro | Qué muestra |
|---|---|
| `d-00-ingreso`, `d-01-registro-vista` | El laboratorio en pie y la pantalla de registro antes de sembrar |
| `d-02a-registro-antes`, `d-02-registro-hecho` | Registro de la cuenta sembrada, antes y después |
| `d-03-cuentas` | Panel de cuentas del administrador, estado inicial |
| `d-04a-habilitar-antes`, `d-04-habilitar-despues` | `Habilitar`: `Pendiente → Habilitada` y la provisoria |
| `d-05`, `d-06` | Primer ingreso del alumno y cambio obligado de contraseña |
| `d-07a-mis-trabajos`, `d-07`, `d-08`, `d-12` | Envío de los dos trabajos sembrados, con sus identificadores |
| `d-09-entrega-comision` | Listado de la comisión antes de tocar nada: los siete trabajos `Pendiente` |
| `d-10a…d-10c` | Primer intento de aprobar: el diálogo de confirmación aparece y el trabajo sigue `Pendiente` |
| `d-11a`…`d-11d`, `d-11-aprobar-listado-despues` | **Aprobar completo**: antes, confirmación, después, y el listado con `Finalizado` |
| `d-13a`…`d-13c`, `d-13-rechazar-listado-despues` | **Rechazar completo**, y el listado con `Rechazado` |
| `d-14a`…`d-14c`, `d-14-retirar-listado-despues` | **Retirar completo**, y el listado sin la fila |
| `d-15-trabajo-retirado-url` | URL de un trabajo retirado: el aviso que afirma una vuelta que no ocurre (D-07) |
| `d-16a`…`d-16e` | Filtros de las dos pantallas, aplicados y con resultado |
| `d-17a`, `d-17`, `d-18` | `Bloquear` y su efecto medido en el ingreso del alumno |
| `d-19a`, `d-19` | `Rehabilitar` disparando el reseteo no anunciado (D-02) |
| `d-20`, `d-21`, `d-22` | La contraseña vieja ya no sirve; clave falsa no denunciada; provisoria falsa sí rechazada |
| `d-23a`, `d-23-alumno-ve-rechazo` | El alumno ve `Rechazado` y el comentario del docente |
| `d-25a-resetear-antes` | Sesión de administrador perdida en pleno recorrido, sin explicación (D-05) |
| `d-26-reintento-1`, `d-26-reintento-2` | Los dos reintentos que sí entraron: el rebote no es sistemático |
| `d-27`, `d-28` | Ruta de administración sin sesión: rebote mudo y destino perdido (D-05) |
| `d-29a`, `d-29`, `d-30a`, `d-30` | `Resetear la contraseña`: confirmación, pérdida del filtro (D-03) y provisoria nueva |
| `d-31a`…`d-31c` | Dos ventanas: la vieja avisa el fallo pero sigue ofreciendo la acción (D-04) |
| `d-32a`, `d-32b`, `d-33a`, `d-33b`, `d-33-baja-aplicada` | **Dar de baja** con confirmación por tipeo del correo, y la lista sin la cuenta |
| `d-34-ingreso-cuenta-dada-de-baja` | La credencial sembrada ya no entra |
| `d-35-cierre-listado` | Cierre: sin rastro de la cuenta sembrada y los trabajos reales intactos |

Sondas propias: `tools/medios/lib/d-sonda.js`, `d-filtros.js`, `d-retencion.js`, `d-fila.js`,
`d-conf.js`, `d-dialogo.js`, `d-concurrencia.js`, `d-sel.js`.
