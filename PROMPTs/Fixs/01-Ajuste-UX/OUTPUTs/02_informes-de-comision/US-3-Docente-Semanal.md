# US-3 · Docente que abre el laboratorio una vez por semana

Notebook de 1440x900. Todas las capturas están en `tools/medios/out/` con prefijo `us3-`.
Cuenta sembrada: `us3-832ba876@mesa-ux.invalid` («Docente Semanal»).
No toqué ningún trabajo ni ninguna cuenta de Adolfo Vera, Damian Perez ni fernando rafale filipuzzi:
los miré (`us3-13`) y nada más.

## Mi objetivo

Habilitar la cuenta nueva que se registró, y resolver un trabajo que quedó pendiente.

## ¿Lo logré? (sí / no / a medias — y en cuántos pasos)

**Sí, las dos cosas.** En 23 pasos registrados.

- Habilitar la cuenta: **la encontré rápido**. Entré, el menú de la izquierda decía «Cuentas», entré ahí
  y mi cuenta estaba con la etiqueta «Pendiente» y un botón «Habilitar» al lado. Dos clics desde que entré.
- Resolver un trabajo: **sí, y de las tres maneras**. La pregunta que me trajo acá tiene respuesta clara:

  | Lo que apreté | Estado antes | Estado después | Captura |
  |---|---|---|---|
  | Aprobar | Pendiente | **Finalizado** | `us3-15-antes-de-resolver.png` → `us3-17-aprobado.png` |
  | Rechazar | Pendiente | **Rechazado** | `us3-19-rechazar-dialogo.png` → `us3-19-rechazar.txt` |
  | Retirar | Pendiente | **el trabajo dejó de existir** | `us3-20-retirar-antes.png` → `us3-21-retirado.txt` |

  No se me quedó nada en pendiente. Los tres botones hacen lo que terminan diciendo que hacen.
  Y el alumno lo ve igual desde su lado (`us3-22-alumno-ve.png`): el rechazado figura Rechazado,
  el aprobado figura Finalizado y el retirado ya no está en su listado.

Al terminar **dejé la cuenta bloqueada** (`us3-23-bloqueada.png`: «DOCENTE SEMANAL — Bloqueada»).

## Diario del recorrido

1. **Abrí `aplicada.somee.com`** (`us3-01-entrada.png`). Me manda solo a la pantalla de ingreso.
   Lo primero que hice fue ir a escribir mi correo en el recuadro de arriba, el que dice
   «Ingresar al laboratorio» — porque tiene exactamente la misma forma que los dos recuadros de abajo.
   No es un campo, es el título. Me di cuenta recién cuando leí lo que decía adentro.
2. **Apreté «Registrarte»** (`us3-02-registro.png`). Pide correo, nombre y apellido, y avisa que la cuenta
   queda esperando que el docente la habilite. No pide contraseña y no explica de dónde va a salir después.
3. **Me registré** (`us3-03-registro-enviado.png`). «Tu cuenta quedó registrada». Bien claro.
   El título vuelve a estar dibujado dentro de un recuadro de campo de texto.
4. **Entré como docente** y me quedó **una pantalla en blanco, toda blanca** (`us3-04-docente-inicio.png`).
   Ni un error, ni un cartel. Pensé que me había equivocado la contraseña.
5. **Lo intenté de nuevo con más paciencia** y entró (`us3-05-docente-inicio-2.png`): caigo en
   «Entrega de la comisión», con los trabajos de todos los alumnos, todos en «Pendiente».
6. **Fui a «Cuentas»** (`us3-06-cuentas.png`). Acá no me trabé nada: el menú de la izquierda tiene tres
   cosas y una se llama «Cuentas». Mi cuenta estaba abajo de todo, «Pendiente», con el botón «Habilitar».
7. **Apreté «Habilitar»** (`us3-07-habilitada.png`). Se aplicó y salió un cartelito con una contraseña
   provisoria — `VBoV78WHBKkK` — que dice que no se vuelve a mostrar y que se la tengo que **dictar** al alumno.
   Con esas mayúsculas y minúsculas mezcladas, dictarla por teléfono es una lotería.
8. **Entré como el alumno con la provisoria** (`us3-08-alumno-primer-ingreso.png`): me pide elegir una nueva,
   y me vuelve a pedir la provisoria, que acabo de tipear en la pantalla anterior.
9. **Guardé la contraseña nueva** y en vez de entrar al laboratorio **me devolvió al formulario de ingreso**
   (`us3-09-alumno-panel.png`). Tuve que escribir correo y contraseña otra vez.
10. **Entré de verdad como alumno** (`us3-10-mis-trabajos.png`): «Todavía no cargaste ningún trabajo»,
    con un botón grande «Cargar mi primer trabajo». Muy claro.
11. **Abrí el formulario de trabajo nuevo** (`us3-11-trabajo-nuevo.png`): nombre, fecha, descripción y
    «Texto del trabajo», con la ayuda «Pegá el texto tal como lo devolvió tu programa».
12. **Pegué un texto normal** («Un cuadrado de lado 5») porque es lo que dice el cartel: texto.
    Me quedó en **Borrador** con el error «No se pudo interpretar el texto» (`us3-12-envio-naive.png`).
    El error no dice qué forma tiene que tener ni muestra un ejemplo. Me quedé sin saber qué pegar.
13. **Abrí un trabajo ya entregado para copiar la forma** (`us3-13-mirar-trabajo-ajeno.png`, sólo mirar).
    Ahí vi que abajo de todo hay un desplegable «TEXTO ORIGINAL» y que el texto es en realidad un JSON.
    De paso vi el panel del docente: «Resolver esta entrega» con Aprobar, Rechazar y Retirar.
    Esta pantalla, además, tarda muchísimo en terminar de cargar (más de 30 segundos hasta que para).
14. **Armé mi trabajo con esa forma y lo mandé** (`us3-14-envio-valido.png`): quedó **Pendiente**. Ahora sí.
15. **Volví como docente y lo abrí** (`us3-15-antes-de-resolver.png`): estado Pendiente, el cubo dibujado,
    y el panel de resolver arriba. Abajo del dibujo dice «Se dibujaron las **1 figuras** del trabajo».
16. **Apreté «Aprobar»** (`us3-16-aprobar-despues.png`): salió un cartel de confirmación que explica bien
    que pasa a Finalizado, que es definitivo, y que repite el comentario que escribí. Esto me gustó.
17. **Confirmé** (`us3-17-aprobado.png`): me tiró de vuelta al listado completo de toda la comisión,
    **sin ningún cartel que me diga que salió bien**. Tuve que buscar la fila de mi alumno entre todas
    para confirmar que decía «Finalizado». Y justo esa fila me quedaba tapada por la publicidad del hosting.
18. **Cargué dos trabajos más** para poder probar los otros dos botones (`us3-18-envio-2/3.txt`).
19. **Rechacé uno** (`us3-19-rechazar-dialogo.png` → `us3-19-rechazar.txt`): mismo cartel, quedó «Rechazado».
20. **Apreté «Retirar»** en el otro (`us3-20-retirar-despues.png`). **Antes de apretarlo no sabía qué hacía.**
    «Retirar» me sonaba a sacarlo de la cola de corrección, o devolverlo a borrador. El cartel me avisó
    que «el trabajo deja de existir». Menos mal que había cartel.
21. **Confirmé el retiro** (`us3-21-retirado.txt`): el trabajo desapareció del listado. Otra vez sin cartel de éxito.
22. **Miré el laboratorio con los ojos del alumno** (`us3-22-alumno-ve.png`): los tres estados coinciden.
23. **Bloqueé la cuenta** (`us3-23-bloqueada.png`). Acá sí salió el cartel verde «La operación se aplicó».

## Dónde me trabé

### US3-01 · Aprobé y no me enteré de que había aprobado
- **Qué quería hacer**: resolver el trabajo y ver que quedó resuelto.
- **Qué me mostró la pantalla**: después de confirmar, el listado entero de la comisión, con los ocho
  alumnos, tal cual como estaba antes. Ningún cartel, ninguna marca, nada arriba.
- **Qué hice**: bajé buscando la fila de mi alumno entre todas las demás para ver si el estado había cambiado.
  Encima esa fila me quedó tapada por la franja de publicidad del hosting.
- **Qué pasó**: sí había cambiado a «Finalizado», pero eso lo supe treinta segundos después de apretar.
  Lo raro es que la pantalla de «Cuentas» **sí** avisa: cuando bloqueé la cuenta salió el cartel verde
  «La operación se aplicó y la lista se volvió a pedir». La de trabajos no dice nada.
- **Cuánto me costó**: lo resolví solo, pero quedé con la duda unos segundos las tres veces.
- **Evidencia**: `us3-17-aprobado.png`, `us3-19-rechazar.txt`, `us3-21-retirado.txt` (sin cartel)
  contra `us3-23-bloqueada.txt` (con cartel).

### US3-02 · Quise escribir mi correo en el título de la pantalla
- **Qué quería hacer**: entrar.
- **Qué me mostró la pantalla**: tres recuadros iguales, uno arriba del otro. El de arriba tenía el borde
  más marcado, así que me pareció el primero de la lista.
- **Qué hice**: fui a tipear ahí.
- **Qué pasó**: no era un campo, era el título «Ingresar al laboratorio». Pasa en todas las pantallas:
  «Trabajo nuevo», «Mis trabajos», «Entrega de la comisión», «Tu cuenta quedó registrada» — todos los
  títulos están dibujados dentro de un recuadro con la misma forma y el mismo redondeado que los campos.
- **Cuánto me costó**: lo resolví solo, pero lo hice mal la primera vez y me sigue confundiendo la vista.
- **Evidencia**: `us3-01-entrada.png`, `us3-03-registro-enviado.png`, `us3-10-mis-trabajos.png`,
  `us3-11-trabajo-nuevo.png`.

### US3-03 · Entré y me quedó la pantalla toda en blanco
- **Qué quería hacer**: entrar como docente.
- **Qué me mostró la pantalla**: nada. Blanco entero, 1440x900 de blanco.
- **Qué hice**: esperé, y después lo intenté de nuevo desde cero.
- **Qué pasó**: la segunda vez entró bien. No hubo ningún mensaje que me dijera si había fallado la
  contraseña, si se había caído algo, o si tenía que esperar.
- **Cuánto me costó**: probé 2 veces. Si me pasa en el aula con los alumnos mirando, no sé qué decirles.
- **Evidencia**: `us3-04-docente-inicio.png` (blanco) contra `us3-05-docente-inicio-2.png` (bien).

### US3-04 · No sabía que «Retirar» borraba el trabajo
- **Qué quería hacer**: probar los tres botones que me ofrece el panel de resolver.
- **Qué me mostró la pantalla**: «Aprobar» y «Rechazar» juntos a la izquierda, y «Retirar» solo, lejos,
  pegado al borde derecho, con la letra colorada pero el recuadro finito y blanco, más discreto que los otros dos.
- **Qué hice**: lo apreté suponiendo que sacaba el trabajo de la lista de corrección o lo devolvía a borrador.
- **Qué pasó**: el cartel me dijo «El trabajo deja de existir y desaparece también del listado del alumno.
  No se puede deshacer». O sea, borra. La palabra «Retirar» y el aspecto discreto del botón me hicieron
  esperar la acción más suave de las tres, y es la más brava.
- **Cuánto me costó**: lo resolví solo porque el cartel me frenó a tiempo. Sin ese cartel lo borraba.
- **Evidencia**: `us3-15-antes-de-resolver.png` (el botón), `us3-20-retirar-despues.png` (el cartel).

### US3-05 · No hay forma de saber qué texto hay que pegar
- **Qué quería hacer**: cargar un trabajo para tener algo que resolver.
- **Qué me mostró la pantalla**: un campo que se llama «Texto del trabajo» y arriba «Pegá el texto tal
  como lo devolvió tu programa. No hace falta que le cambies nada».
- **Qué hice**: pegué texto: «Un cuadrado de lado 5».
- **Qué pasó**: quedó en Borrador con la observación «No se pudo interpretar el texto. Revisá que sea el
  que emite tu programa, pegado entero». El error no dice qué forma tiene que tener, no muestra un ejemplo
  y no dice que en realidad es un JSON. Como docente no tengo el programa del alumno a mano.
  Sólo salí adelante abriendo un trabajo ya entregado de otro y copiando la forma del texto de ahí.
- **Cuánto me costó**: probé 2 veces y la segunda sólo funcionó porque me copié de un trabajo ajeno.
- **Evidencia**: `us3-12-envio-naive.png`, `us3-13-mirar-trabajo-ajeno.png`, `us3-14-envio-valido.txt`.

### US3-06 · La contraseña provisoria hay que dictarla y es indictable
- **Qué quería hacer**: habilitar la cuenta y pasarle la clave al alumno.
- **Qué me mostró la pantalla**: `VBoV78WHBKkK`, con el aviso «Dictásela, o pasásela por el canal que uses
  con la comisión. No se vuelve a mostrar».
- **Qué hice**: la leí en voz alta mentalmente para ver si podía dictarla.
- **Qué pasó**: «V-B-o-V…» — mayúscula, minúscula, mayúscula. En el aula, dictar eso a alguien que la
  tipea mal una vez significa volver a resetear. La pantalla misma me propone dictarla y me da algo
  que no se puede dictar.
- **Cuánto me costó**: no lo resolví; salí adelante porque yo mismo la copié de la pantalla.
- **Evidencia**: `us3-07-habilitada.png`.

### US3-07 · Elegí mi contraseña nueva y me echó al formulario de ingreso
- **Qué quería hacer**: entrar por primera vez con la cuenta nueva.
- **Qué me mostró la pantalla**: el formulario para elegir contraseña, que además me pide de nuevo la
  provisoria que acababa de usar para entrar.
- **Qué hice**: puse la provisoria, la nueva dos veces, y «Guardar contraseña».
- **Qué pasó**: «Tu contraseña quedó guardada. Ya podés entrar con ella» — y me dejó parado otra vez en
  el formulario de ingreso, vacío. Tuve que escribir correo y contraseña de nuevo. Ya estaba adentro:
  no entiendo por qué me sacó.
- **Cuánto me costó**: lo resolví solo, con un ingreso de más.
- **Evidencia**: `us3-08-alumno-primer-ingreso.png`, `us3-09-alumno-panel.png`, `us3-10-mis-trabajos.png`.

## Lo que me resultó fácil (máximo 3)

1. **Encontrar dónde se habilita una cuenta.** El menú tiene tres cosas y una dice «Cuentas». Adentro,
   cada fila tiene la situación al lado («Pendiente») y el botón que corresponde a esa situación
   («Habilitar» si está pendiente, «Bloquear» si está habilitada, «Rehabilitar» si está bloqueada).
   No tuve que buscar nada. (`us3-06-cuentas.png`)
2. **Los carteles de confirmación de Aprobar y Rechazar.** Dicen a qué estado pasa el trabajo, avisan que
   es definitivo, explican qué le queda al alumno si quiere corregir, y me repiten el comentario que
   escribí para que lo relea antes de mandarlo. (`us3-16-aprobar-despues.png`, `us3-19-rechazar-dialogo.png`)
3. **Que lo que hice como docente se vea igual del lado del alumno.** Aprobado→Finalizado,
   rechazado→Rechazado, retirado→ya no está. Sin sorpresas. (`us3-22-alumno-ve.png`)

## Anotaciones que no son trabas mías pero las vi

- La pantalla de un trabajo tarda más de 30 segundos en dejar de cargar, y deja una conexión abierta que
  nunca termina de asentarse (`us3-13-mirar-trabajo-ajeno.txt`: `ERR_NETWORK_CHANGED`,
  `Connection disconnected with error 'TypeError: Failed to fetch'`).
- Abajo del dibujo dice «Se dibujaron las **1 figuras** del trabajo» cuando hay una sola.
  (`us3-15-antes-de-resolver.png`)
- La franja de publicidad del hosting tapa una banda de la pantalla a media altura en todas las vistas
  largas, y me tapó justo la fila que necesitaba mirar después de aprobar. Doy por hecho que es del
  hosting y no del laboratorio, pero como docente no puedo distinguirlo.
- En el correo del docente, abajo a la izquierda, la dirección aparece cortada («fernandofilipuzzi.utn@gmail»).
  (`us3-06-cuentas.png`)

## Registros producidos

`tools/medios/out/`, todos con prefijo `us3-`: `us3-01-entrada`, `us3-02-registro`,
`us3-03-registro-enviado`, `us3-04-docente-inicio` (pantalla en blanco), `us3-05-docente-inicio-2`,
`us3-06-cuentas`, `us3-07-habilitada` (provisoria), `us3-08-alumno-primer-ingreso`, `us3-09-alumno-panel`,
`us3-10-mis-trabajos`, `us3-11-trabajo-nuevo`, `us3-12-envio-naive` (borrador), `us3-13-mirar-trabajo-ajeno`,
`us3-14-envio-valido`, `us3-15-antes-de-resolver` (antes), `us3-16-aprobar-antes`, `us3-16-aprobar-despues`
(cartel), `us3-17-aprobado` (después), `us3-18-envio-2`, `us3-18-envio-3`, `us3-19-rechazar-dialogo`,
`us3-19-rechazar`, `us3-20-retirar-antes`, `us3-20-retirar-despues` (cartel de Retirar),
`us3-21-retirado-dialogo`, `us3-21-retirado`, `us3-22-alumno-ve`, `us3-23-bloqueada` (cuenta bloqueada).
