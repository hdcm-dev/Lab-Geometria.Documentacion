# US-1 · Alumno de la comisión, primera vez, desde el teléfono

Cuenta sembrada: `us1-ef3f162e@mesa-ux.invalid` (Usuario Uno). Teléfono: 390x844.
Todas las capturas están en `tools/medios/out/us1-*.png|txt`.

## Mi objetivo

Registrarme y entregar mi trabajo.

## ¿Lo logré? (sí / no / a medias — y en cuántos pasos)

**Sí, pero no solo.** Entregué el trabajo (queda en estado *Pendiente*,
identificador `cb843be7-12f3-45e0-bbad-d026905c2d8c`, `us1-18-enviado.png`), en **18 pasos** y
con **tres tropiezos que no habría podido resolver por mi cuenta**: no supe nunca qué contraseña
me tocaba, no supe nunca qué había que escribir en «Texto del trabajo», y hasta hoy **no vi mi
figura dibujada** aunque el sistema me dice que la dibujó.

Sin un docente al lado que me dictara la contraseña provisoria, mi recorrido se terminaba en el
paso 8.

## Diario del recorrido

1. Abro `https://aplicada.somee.com/` desde el teléfono y me manda a la pantalla de ingreso.
   Veo «Ingresar al laboratorio», Correo, Contraseña, y abajo «¿No tenés cuenta? Registrarte».
   Lo primero que me llama la atención es que el título está **metido dentro de un recuadro
   igual a los campos de texto**, con borde y todo; lo miré dos veces pensando que era un campo
   más para completar. — `us1-01-inicio.png`
2. Toco «Registrarte». Aparece el formulario: Correo, Nombre, Apellido, y arriba
   «Tu cuenta queda a la espera de que el docente la habilite. El laboratorio no envía correos».
   **Espero que me pida una contraseña y no me la pide.** No entiendo con qué voy a entrar
   después. — `us1-02-registro.png`
3. Completo los tres campos y toco «Registrarme». — `us1-03-registro-enviado.txt`
4. Me dice «Tu cuenta quedó registrada. Todavía no podés ingresar: el docente tiene que
   habilitarla. No vas a recibir ningún correo». Botón «Ir a ingresar». Otra vez el título
   dentro de un recuadro que parece campo. Y sigo sin saber **con qué contraseña** voy a entrar
   ni **a qué docente** tengo que avisarle. — `us1-03-registro-enviado.png`
5. Voy a ingresar igual, con mi correo y una contraseña que me invento (`geometria123`), a ver
   qué pasa. Me contesta en rojo «Tu cuenta está a la espera de que el docente la habilite.
   Todavía no podés entrar». Entiendo *qué* pasa, pero no *qué tengo que hacer yo*. —
   `us1-04-intento-ingreso.png`
6. (Corrida aparte, con la credencial del docente que me dieron para poder seguir.) Entro a
   «Cuentas», busco mi correo y toco «Habilitar» **sólo sobre mi fila**. —
   `us1-06-docente-filtro.png`, `us1-07-habilitada.png`
7. Ahí aparece, del lado del docente, un cartel que dice «Contraseña provisoria de Usuario Uno:
   `jD9FSPduEBXj` — dictásela, no se vuelve a mostrar». **Esa es la pieza que como alumno no
   tengo por ningún lado**: no me llega, no la puedo pedir desde mi pantalla, y ninguna pantalla
   mía me anticipó que iba a existir. — `us1-07-habilitada.png`
8. Vuelvo a mi ingreso y pruebo de nuevo con la contraseña inventada. Me deja pasar a «Elegí una
   contraseña nueva», que me dice «El docente te reseteó la clave» —y no me reseteó nada, yo
   recién me registré— y me pide una **«Contraseña provisoria»** que, si nadie me la dicta, no
   tengo. Probé después con otra contraseña cualquiera y también me llevó a la misma pantalla:
   parece que ahí entra cualquiera. — `us1-08-ingreso-tras-habilitar.png`, `us1-09-otra-clave.txt`
9. Con la provisoria que el docente me dictó, elijo mi contraseña. Me guarda bien… y me devuelve
   a la pantalla de ingreso a escribir correo y contraseña **otra vez**. Esperaba entrar
   derecho. — `us1-10-clave-nueva.txt`
10. Entro. Llego a «Mis trabajos», vacío, con «Cargá el texto que produjo tu programa de la
    Actividad 1 y mirálo dibujado» y un botón «Cargar mi primer trabajo». Acá sí supe qué
    tocar. — `us1-11-mis-trabajos.png`
11. Se abre «Trabajo nuevo»: Nombre, Fecha, Descripción, «Texto del trabajo», y arriba «Pegá el
    texto tal como lo devolvió tu programa. No hace falta que le cambies nada». **Ese es todo el
    instructivo.** Ningún ejemplo, ningún formato, ningún texto de ayuda dentro del recuadro.
    Yo todavía no tengo el programa hecho, así que no sé qué pegar. — `us1-12-trabajo-nuevo.png`
12. Pruebo lo más obvio: escribo `Un cuadrado de lado 5` y toco «Previsualizar». Me dice
    «0 de 0 figuras se pudieron interpretar» y «El texto no se pudo leer… **revisá las
    observaciones**: dicen dónde se cortó la lectura». **Busco las observaciones y no están en
    ninguna parte de la pantalla.** — `us1-13-intento1.png`
13. Segundo intento, adivinando que si es Programación debe ser JSON:
    `{"tipo":"cuadrado","lado":5}`. Ahora sí lee el texto y me arma un «Árbol del texto», pero
    dice «0 de 1 figura se pudo interpretar» y marca «No dibujada · Figura 1 · posición 0»,
    **sin decirme qué le faltó ni qué nombres de figura acepta**. — `us1-14-intento2.png`
14. Tercer intento a puro tanteo: pongo una lista y mayúsculas,
    `[{"Tipo":"Cuadrado","Lado":5,"X":10,"Y":10}]`. Ahora dice «1 de 1 figura se pudo
    interpretar». **Acerté por probar, no porque la pantalla me lo dijera.** —
    `us1-15-intento3.png`
15. Pero el «Área de dibujo» sigue en gris rayado, **vacía**. Esperé 12 segundos más por si
    tardaba y quedó igual. Me dice que interpretó mi cuadrado y yo no veo ningún cuadrado. —
    `us1-16-dibujo-espera.png`
16. Toco «Enviar». Me rebota con «Falta el nombre, la fecha o el texto del trabajo». Yo tenía el
    nombre y el texto puestos: lo que faltaba era **la fecha**, pero el mensaje no me dice cuál
    de los tres es ni me marca el campo. — `us1-17-enviar.png`
17. Cargo la fecha y envío. «Tu trabajo quedó en estado Pendiente… El texto se interpretó y quedó
    entregado», con el identificador. **Objetivo cumplido.** — `us1-18-enviado.png`
18. Voy a «Mis trabajos» y toco el título «Actividad 1» de la tarjeta esperando abrirlo: no pasa
    nada, hay que tocar el botón «Abrir». Lo abro: mi trabajo está entregado, sin observaciones,
    y dice «Se dibujaron las 1 figuras del trabajo» — **con el área de dibujo otra vez vacía**. —
    `us1-19-ver-trabajo.png`, `us1-20-detalle.png`

Al terminar, dejé mi cuenta **bloqueada** desde el panel del docente (`us1-21-bloqueada.png`).
No toqué ninguna otra cuenta ni ningún trabajo ajeno.

## Dónde me trabé

### US1-01 · Me registré y nunca supe con qué contraseña iba a entrar
- **Qué quería hacer**: registrarme y después entrar a cargar mi trabajo.
- **Qué me mostró la pantalla**: un registro con Correo, Nombre y Apellido, sin ningún campo de
  contraseña, y el aviso «Tu cuenta queda a la espera de que el docente la habilite. El
  laboratorio no envía correos». Después, «Tu cuenta quedó registrada… No vas a recibir ningún
  correo».
- **Qué hice**: intenté ingresar con una contraseña inventada.
- **Qué pasó**: me frenó con «Tu cuenta está a la espera de que el docente la habilite». En
  ningún momento ninguna pantalla mía me dijo que **el docente me va a tener que dictar una
  contraseña provisoria**, ni a qué docente avisarle, ni por qué canal.
- **Cuánto me costó**: no lo resolví solo. Se destrabó únicamente porque alguien con la
  credencial de docente habilitó la cuenta y **me leyó la contraseña provisoria de su pantalla**.
- **Evidencia**: `us1-02-registro.png`, `us1-03-registro-enviado.png`, `us1-04-intento-ingreso.png`,
  `us1-07-habilitada.png`

### US1-02 · La pantalla de contraseña nueva me pide algo que nunca me dieron, y me cuenta una historia que no es la mía
- **Qué quería hacer**: entrar por primera vez, ya habilitada la cuenta.
- **Qué me mostró la pantalla**: «Elegí una contraseña nueva — **El docente te reseteó la clave**.
  La que te pasó sirve sólo para esto», y un campo obligatorio **«Contraseña provisoria»**.
- **Qué hice**: quedarme mirando. A mí nadie me reseteó nada: yo me acababa de registrar, y no
  tengo ninguna «provisoria» en la mano.
- **Qué pasó**: sin la provisoria dictada por el docente no se puede pasar de ahí. Además probé
  entrar dos veces con dos contraseñas distintas, las dos inventadas, y **las dos me llevaron
  igual a esta pantalla**: nunca me dijo que mi contraseña estuviera mal, así que llegué acá
  creyendo que había entrado bien.
- **Cuánto me costó**: probé 2 veces; lo resolví recién con la provisoria de la corrida del
  docente.
- **Evidencia**: `us1-08-ingreso-tras-habilitar.png`, `us1-09-otra-clave.txt`, `us1-10-clave-nueva.txt`

### US1-03 · «Texto del trabajo»: nadie me dice qué hay que poner
- **Qué quería hacer**: cargar mi trabajo.
- **Qué me mostró la pantalla**: un recuadro grande rotulado «Texto del trabajo» y, como única
  ayuda, «Pegá el texto tal como lo devolvió tu programa. No hace falta que le cambies nada».
  Sin ejemplo, sin formato, sin ninguna ayuda dentro del recuadro.
- **Qué hice**: escribí en castellano «Un cuadrado de lado 5»; después probé JSON en minúsculas;
  después JSON en lista y con mayúsculas.
- **Qué pasó**: recién en el **tercer** intento me dijo «1 de 1 figura se pudo interpretar».
  Acerté adivinando. Un compañero que no adivine el formato no entrega.
- **Cuánto me costó**: probé 3 veces.
- **Evidencia**: `us1-12-trabajo-nuevo.png`, `us1-13-intento1.png`, `us1-14-intento2.png`,
  `us1-15-intento3.png`

### US1-04 · Me manda a leer «las observaciones» y las observaciones no están
- **Qué quería hacer**: entender por qué mi texto no se leía.
- **Qué me mostró la pantalla**: «El texto no se pudo leer, así que no hay estructura que
  mostrar. **Revisá las observaciones: dicen dónde se cortó la lectura**».
- **Qué hice**: recorrí toda la pantalla de arriba abajo buscando esas observaciones.
- **Qué pasó**: no hay ninguna sección de observaciones en «Trabajo nuevo». El mensaje me manda
  a un lugar que no existe. Y cuando el texto sí se leyó pero la figura no se pudo interpretar,
  lo único que me dijo fue «No dibujada · Figura 1 · posición 0», sin un motivo.
- **Cuánto me costó**: no lo resolví; seguí a ciegas probando formatos.
- **Evidencia**: `us1-13-intento1.png`, `us1-14-intento2.png`

### US1-05 · Me dice que dibujó mi figura y el dibujo está vacío
- **Qué quería hacer**: «mirálo dibujado», que es lo que promete la pantalla de mis trabajos.
- **Qué me mostró la pantalla**: en «Trabajo nuevo», «1 de 1 figura se pudo interpretar»; en la
  vista de mi trabajo entregado, «**Se dibujaron las 1 figuras del trabajo**» y dos tildes,
  «Órbita de la cámara» y «Giro de las figuras».
- **Qué hice**: previsualicé, esperé 12 segundos más por si tardaba, y después abrí el trabajo ya
  entregado.
- **Qué pasó**: el «Área de dibujo» quedó siempre gris con unas rayas, sin ninguna figura, en las
  tres pantallas. Nunca vi mi cuadrado. No hubo ningún error de consola que me avisara.
- **Cuánto me costó**: no lo resolví.
- **Evidencia**: `us1-15-intento3.png`, `us1-16-dibujo-espera.png` (12 s de espera),
  `us1-20-detalle.png`, `us1-20-detalle.txt` (sin errores de consola)

### US1-06 · «Falta el nombre, la fecha o el texto» y no me dice cuál
- **Qué quería hacer**: enviar el trabajo.
- **Qué me mostró la pantalla**: en rojo, «Falta el nombre, la fecha o el texto del trabajo. El
  texto vacío es un campo sin completar, no un texto que no verifica».
- **Qué hice**: releí mis campos uno por uno para descubrir cuál era.
- **Qué pasó**: era la fecha, que además está vacía por defecto, no tiene ninguna marca de
  obligatoria y se muestra como `mm/dd/yyyy` —al revés de como escribimos la fecha acá—.
  Ningún campo quedó resaltado.
- **Cuánto me costó**: lo resolví solo, pero perdí un envío.
- **Evidencia**: `us1-17-enviar.png`, `us1-12-trabajo-nuevo.png`

### US1-07 · Los títulos parecen campos de texto vacíos
- **Qué quería hacer**: leer la pantalla y saber dónde escribir.
- **Qué me mostró la pantalla**: en **todas** las pantallas, el título («Ingresar al
  laboratorio», «Tu cuenta quedó registrada», «Mis trabajos», «Trabajo nuevo», «Actividad 1»)
  aparece dentro de un recuadro con borde marcado, idéntico a los campos de Correo y Contraseña.
- **Qué hice**: en la primera pantalla intenté ubicarme y tardé en darme cuenta de que el primer
  «campo» era en realidad el título.
- **Qué pasó**: en el teléfono, donde entra poco, el título ocupa el ancho completo y se lee como
  un campo más para completar. Es la primera cosa que ve alguien que abre esto por primera vez.
- **Cuánto me costó**: lo resolví solo, pero me confundió en cada pantalla nueva.
- **Evidencia**: `us1-01-inicio.png`, `us1-03-registro-enviado.png`, `us1-11-mis-trabajos.png`,
  `us1-12-trabajo-nuevo.png`, `us1-20-detalle.png`

*(Me quedaron afuera cosas menores: que después de guardar la contraseña me haga escribirla de
nuevo en vez de entrar, y que el título de la tarjeta «Actividad 1» no se pueda tocar aunque
parezca tocable —hay que usar el botón «Abrir», que además tiene el iconito de «se abre en otro
lado» y no se abre en otro lado—.)*

## Lo que me resultó fácil (máximo 3)

1. **Encontrar dónde registrarme.** «¿No tenés cuenta? Registrarte» estaba justo debajo del
   botón de ingreso, lo vi sin buscar (`us1-01-inicio.png`).
2. **Saber qué hacer cuando no tenía ningún trabajo.** La pantalla vacía me dijo qué iba a pasar
   y me puso un botón grande, «Cargar mi primer trabajo»; no dudé (`us1-11-mis-trabajos.png`).
3. **Entender que quedé entregado.** El cartel «Tu trabajo quedó en estado Pendiente… quedó
   entregado» con el identificador me dejó tranquilo, y después lo vi igual en mi listado
   (`us1-18-enviado.png`, `us1-19-ver-trabajo.png`).

## Registros producidos

`tools/medios/out/`:

- `us1-01-inicio.*` — pantalla de ingreso al abrir el sitio en el teléfono.
- `us1-02-registro.*` — formulario de registro (sin campo de contraseña).
- `us1-03-registro-enviado.*` — confirmación «Tu cuenta quedó registrada».
- `us1-04-intento-ingreso.*` — ingreso rechazado por cuenta pendiente.
- `us1-05-docente-cuentas.*`, `us1-06-docente-filtro.*` — corrida del docente: panel de cuentas y
  filtro sobre mi correo.
- `us1-07-habilitada.*` — mi cuenta habilitada y el cartel con la contraseña provisoria.
- `us1-08-ingreso-tras-habilitar.*` — pantalla de cambio obligado pidiendo la provisoria.
- `us1-09-otra-clave.*` — segunda contraseña inventada, mismo destino.
- `us1-10-clave-nueva.*` — contraseña propia guardada, vuelta al ingreso.
- `us1-11-mis-trabajos.*` — panel del alumno vacío.
- `us1-12-trabajo-nuevo.*` — formulario de carga sin ninguna pista de formato.
- `us1-13-intento1.*` — texto en castellano: no se pudo leer, «revisá las observaciones».
- `us1-14-intento2.*` — JSON en minúsculas: 0 de 1 figura, sin motivo.
- `us1-15-intento3.*` — JSON en lista y mayúsculas: 1 de 1, dibujo vacío.
- `us1-16-dibujo-espera.*` — el mismo texto con 12 s de espera: dibujo igual de vacío.
- `us1-17-enviar.*` — envío rechazado por «falta el nombre, la fecha o el texto».
- `us1-18-enviado.*` — trabajo entregado, estado Pendiente.
- `us1-19-ver-trabajo.*` — mi trabajo en el listado.
- `us1-20-detalle.*` — vista del trabajo entregado: «se dibujaron las 1 figuras», escena vacía.
- `us1-21-bloqueada.*` — mi cuenta dejada bloqueada al terminar.

`tools/medios/lib/us1-sonda*.js` — guiones que usé sólo para ubicar los campos de cada
formulario (el navegador de la mesa necesita el nombre del campo para tipear).
