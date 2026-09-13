
# ​Plan del proyecto - Servicio con fines academicos

## Contexto

  - Leer este `/PROG2/Geometria/Lab-Geometria.Documentacion/Analisis/01-Analisis-Contexto-Existente/Analisis-Contexto-Existente.md`

  - Los siguientes documentos `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/03-Ejecutar-Prompt-Integrador-Documento-Intake/INPUTs/Requerimientos-Tecnicos.md` y  `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/03-Ejecutar-Prompt-Integrador-Documento-Intake/INPUTs/Requerimientos-Funcionales.md`, heredan del documento correcto, la otra información que describen se debe reeditar con el contexto de este prompt
  
  Pensaba una solución en .net  10 con blazor con paginas interfactive server y usando librerias mudblazor. deberia ser dos servicicios, un front service y un backend service que ofresca un api rest- con arquitectura clean . el front consume el api rest.  el backend deberia usar sqlite para la persistencia. 

  La idea principal es que el backend corra en un docker , una vez que este construido el servicio , yo haria el despliegue a traves de compose llamando al git directamente y haciendo la construccion en destino  - compose soporta desplegar desde un repositorio git, pero el front haria el despliegue en un servidor hosted gratuido a traves de ftp , el cual este tiene un dominio publico con https y como servidor information server. 
  
  Por que ese esquema, para accededer desde la facultad se necesita ip estatica, mi servidor no tiene ip estatica entonces me bloquea, se me ocurrio  que el front corra en un servidor que no lo bloqueen, y que el front consuma las ip de mi servidor con ip dinamica, - la ip dinamica relamente no cambia tanto, y para el tipo de proyecto que estoy haciendo esta bien -.  esto me resuelve un problema del servidor hosted gratuito que se resetea el estado de persistencia. Acá necesitaria un workflow para hacer el despliegue en somee.com a traves de ftp. y me deberias dejar el dokerfile para hacer yo el despliegue en mi servidor. Por otro lado este host no tiene el sdk de .net asíque el desarrollo y pureba, testeo y ajuste vas a tener que hacer un devcontainer.

  La aplicación a desarrolar es basica.
  1- cuentas de usuarios para  alumnos deben registrarse, con su correo como cuenta y algunos datos, nombre y apellido.
  2- cuenta de usuario para administrador, la primera vez que corra el servicio debe solicitar la configuracion de la cuenta de adnimistrador.
  3- la cuenta del alumno le debe permiri cargar trabajo, el trabajo se define como un conjunto de piezas a manufacturar , se necesita el nombre del trabjao, fecha, descripción y un json  con el actividad2 de `tup_prog_2_2026_actividad1` se lo debe validar y lo debe previsualizar como en `tools_json_figure_viewer , podes reutilizar este para embemberlo en las paginas blazord.  por cada trabajo se crea un identificador. debe poder guardarlo como borrador para reeditarlo en este estado de borrador
  4- el alumno debe poder ver sus trabajos cargados y su estado de pendiente, borrador o finalizado. 
  5- el administrador a ver la lista de trabajos y va a poder visualizar , mediante el visualizador de 
   `tools_json_figure_viewer` embebido en el pagina blazor el trabajo, y la estructura del json., el listado debe poder agrupar y filtrar los trabajos por alumnos , el alumno solo puede borrar sus trabajos relativos a los que estan como borrador.
  6- el administrador debe autorizar las altas de cuentas de alumnos, como tambien bloquearlas o darlas de baja fisicamente.
  7- el json que genera el alumno con su aplicación sigue la estructura que se muestra en `/PROG2/Geometria/tup_prog_2_2026_actividad1/Actividad1/Ejemplo2` asique el servicio debe leer y validar esa estructura. ahora comor reconstruye los objetos de dominio del servicio se pueden ajustar a un modelo realista 
  8- podes crear un proyecto javascript con nodejs, que empquete un webappk y genere un bundle javascript para incluir en blazor , intercala un main.js que tenga las funciones externas que medie entre el javascript interoperative de blazor y la clase servicio javascript que interfacea al bundle. el bundle webapck puede ser en type script transpilado luego.
  9- El flujo de auntetificacion de la api rest por el backend es ROPC,bearer token jwt, 
  10- el flujo de creacion de la cuenta del alumno, pide correo para usuario, . Desde el panel del administrador se da habilita la cuenta, luego el usuario al ingresa  se le solicita la contraseña. no se envia notificaciones de correo al usuario.
  11- desarrollo y entregables aproximado.
  11.a - scaffolding solución , verifica si compila 
  11.b - front + menu laterales, superior
  11.c - front login administrador y creacion cuenta administrador y back logica de dominio, base de datos - flujo completo de alta de usuario administrador, 
  11.d - front logica completa de alta de usuario y habilitacion de adminsitrador.
  12.e - alta trabajo y vista de trabajos
  13.f - importacion json trabjao y validacion
  14.g - visualizacion json en figuras 3d y en modelo de arbol.
  15. otros trabajos que queden pendientes