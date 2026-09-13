# Instrucciones comunes a toda comisión y a todo usuario estándar

## 1. Lo que tenés que leer, y nada más

1. `OUTPUTs/00_marco/Mesa-UX-UI.md` — el marco de esta mesa.
2. `OUTPUTs/01_contrato-y-base/Contrato-De-Entrada.md` — objeto, restricciones y medios.
3. Tu propia carta de mandato, que te llega en el pedido.

**No leas los informes de las otras comisiones.** El panel trabaja a ciegas: si leés a otro,
repetís a otro, y la mesa pierde el único valor que tiene el panel.

## 2. Los medios, y cómo se usan sin pisarse

Todo lo que afirmes sobre la ejecución tiene que salir de un medio. Sin registro, es conjetura
(nivel `C`) y no funda ninguna corrección.

```bash
cd /home/fernando/workspaces/workspace-dev/tools/medios
./web.sh <url> <NOMBRE> --size 1440x900 --full --wait 2000 --pasos '<verbos>'
```

- **Prefijo obligatorio.** Tu `NOMBRE` empieza SIEMPRE con tu identificador (`a-`, `b-`, `c-`,
  `d-`, `e-`, `f-`, `us1-`, `us2-`, `us3-`). `out/` es compartido y un nombre repetido borra el
  registro de otra comisión.
- Deja `out/<NOMBRE>.png` y `out/<NOMBRE>.txt`. **Leé el `.txt`**: trae la URL final, el resultado
  de cada paso y los errores de consola. **Leé el `.png` con la herramienta Read**, que renderiza
  imágenes: un juicio visual sin haber mirado la imagen no es admisible.
- El `.txt` importa tanto como el `.png`: una vista que se ve bien y arroja errores de consola está
  rota, y la imagen sola no lo muestra.

### Entrar como administrador

```
--pasos 'fill #signin-email = fernandofilipuzzi.utn@gmail.com; fill #signin-password = fernando486; click button[type=submit]; wait 6000; goto <url siguiente>; wait 4000'
```

**El botón se aprieta con `click button[type=submit]`.** `click text=Ingresar` toca el `h1`
«Ingresar al laboratorio» y no envía nada: eso ya se midió y no es un defecto del producto.

### Rutas del producto

`/ingreso` · `/registro-de-cuenta` · `/aprovisionamiento-inicial` · `/mis-trabajos` ·
`/trabajo-nuevo` · `/trabajos/{id}` · `/trabajos/{id}/editar` · `/entrega-comision` · `/cuentas` ·
`/mi-contrasena` · `/credencial-propia/establecer` · `/credencial-propia/cambio-obligado` ·
`/estado` · `/no-encontrado`

### La maqueta aprobada

`http://127.0.0.1:18077/<Archivo>.html` — `Ingreso.html`, `Registro-De-Cuenta.html`,
`Panel-De-Trabajos-Del-Alumno.html`, `Envio-De-Trabajo.html`, `Vista-De-Trabajo.html`,
`Resolucion-Del-Trabajo.html`, `Listado-De-La-Comision.html`, `Panel-De-Cuentas.html`,
`Credencial-Propia.html`, `Aprovisionamiento-Inicial.html`, `Estado-Degradado-Y-Reconexion.html`.

### Medir geometría y tipografía (cuando la imagen no alcanza)

Copiá un guion a `tools/medios/lib/<tu-prefijo>-sonda.js` y corrélo así:

```bash
docker run --rm --network host -v /home/fernando/workspaces/workspace-dev/tools/medios/lib:/work \
  -w /work --user $(id -u):$(id -g) -e PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
  mcr.microsoft.com/playwright:v1.62.1-noble node <tu-prefijo>-sonda.js
```

Dentro del guion: `require("/work/node_modules/playwright-core")`. Sirve para leer
`getComputedStyle`, `getBoundingClientRect`, `document.activeElement` y contrastes: es la
diferencia entre «se ve chico» y «el título mide 17 px y el cuerpo 13 px, razón 1,31».

## 3. Reglas duras de conducta

1. **No inventes.** Toda afirmación lleva ancla: archivo del medio, o cita literal con ruta y línea.
2. **No opines fuera de tu mandato.** Si ves algo que no te toca, emitís una
   `solicitud_convocatoria`, no un hallazgo.
3. **No actúes sobre datos de alumnos reales.** Sólo sobre cuentas y trabajos que vos sembraste,
   con correo terminado en `@mesa-ux.invalid`. Aprobar o rechazar el trabajo de Adolfo Vera,
   Damian Perez o Fernando Rafale Filipuzzi está prohibido.
4. **No modifiques código en esta etapa.** Las comisiones detectan; el cuerpo auditor corrige. Si
   proponés un cambio, va como `propuesta_de_direccion`, no como parche aplicado.
5. **No toques** `gf-api`, `gf-web`, `gf-back`, `gf-tunnel`, ni la carpeta `PROMPTs/` fuera de
   `OUTPUTs/`.

## 4. Lo que entregás

Un archivo `OUTPUTs/02_informes-de-comision/<Tu-Id>-<Tu-Nombre>.md` con esta forma exacta:

```markdown
# Informe — <comisión> (<id>)

## Mandato y alcance observado
Qué mirabas, con qué medio, qué pantallas y anchos, y qué NO llegaste a observar.

## Hallazgos

### <ID>-01 · <una oración: qué está mal>
- **Capa de origen**: <1 catálogo | 2 tokens | 3 componente | 4 maqueta | 5 superficie | 6 instancia>
- **Ubicación**: <ruta:línea, o pantalla + ancho>
- **Evidencia**: nivel <E1|E2|E3|E4|C> — <archivo del medio, cita literal o medición>
- **Severidad**: <S1|S2|S3|S4>   **Confianza**: <0..1>
- **Impacto si no se corrige**: <una oración concreta>
- **Propuesta de dirección**: <qué habría que lograr, NO cómo escribirlo>

## Lo que revisé y está bien (máximo 3)

## Solicitudes de convocatoria (si las hay)

## Registros producidos
Lista de `tools/medios/out/<prefijo>-*.png|txt` con qué muestra cada uno.
```

**Tope: 7 hallazgos.** Si tenés más, quedate con los 7 de mayor severidad y decilo.

Tu respuesta final al orquestador es un resumen de una pantalla: cuántos hallazgos, sus ids,
severidades y una línea cada uno. El informe completo va al archivo.
