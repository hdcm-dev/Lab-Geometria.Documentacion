# Plan de mejoras, sus implicancias, y lo que se aplicó

**Fecha**: 2026-09-02 · **Ciclo**: 1 · **Diseña**: el cuerpo auditor. **Aprueba**: la mesa.
La separación es estructural: quien diseña el parche no vota su aprobación
(`Mesa-Evaluadora.md` §4.4).

## 1. La decisión de forma, y por qué condiciona todo lo demás

El precedente disponible era una **capa de override** (`escala.css`) cargada última. **Se
descartó**, y el motivo es medible.

Este repositorio tiene una puerta, `scripts/verify-visual-system.sh`, cuyo control `C-4` exige que
los tokens de `app.css` sean **exactamente** los de la maqueta, nombre por nombre y valor por
valor. Corrida antes de tocar nada:

```
== C-4 · tokens idénticos a los de la maqueta aprobada ==
CONFORME · 50 tokens, idénticos a los de la maqueta
```

Una capa encima habría dejado esa puerta **vigilando los tokens viejos**: seguiría diciendo
«conforme» sobre valores que ya no gobiernan nada, y la garantía que hoy existe se convertiría en
ruido. De modo que:

> **Los tokens se editan en su lugar, en los dos archivos, con el mismo valor.** La puerta que ya
> vigila la paridad es la que verifica el parche, en vez de quedarse ciega frente a él.

Las reglas de componente no pueden ser byte a byte idénticas —la maqueta usa `.mq-` y el producto
`.gf-`—, así que ahí la paridad es de **intención y de valor**, y se verifica con la captura del
mismo encuadre en los dos.

## 2. Los parches, por capa de origen

### Capa 2 · tokens — `P-01`

| Token | Antes | Ahora | Objetivo |
|---|---|---|---|
| `--type-title-size` | 17px | `clamp(1.375rem, 1.15rem + 1vw, 1.5625rem)` | `O-1`, `O-2` |
| `--type-body-strong-size` | 14px | 1.25rem (20px) | `O-1` |
| `--type-body-size` | 13px | 1rem (16px) | `O-1`, `O-2` |
| `--type-caption-size` | 12px | 0.8rem (12,8px) | `O-1` |
| `--type-meta-size` | 11px | 0.8rem (12,8px) | `O-1` |
| pesos de título y subtítulo | 500 / 500 | 600 / 600, con un paso de tamaño real entre ellos | `O-1` |
| `--space-4/6/8` | 14 / 18 / 22 px | 16 / 24 / 32 px | `O-3` |
| `--space-5/7/9` | 16 / 20 / 28 px | 20 / 28 / 40 px | `O-3` |
| `--lh-body` | *(literal 1.45)* | 1.5 | `A-06` |
| `--measure` | *(no existía)* | 72ch | `O-5` |
| `--content-max` | *(no existía)* | 1120px | `O-5` |
| `--shell-sidebar-width` | 168px | 232px | consecuencia de `O-2` |

**La razón es 1,25 y está declarada en el propio archivo.** Cinco roles sobre cuatro pasos:
`caption` y `meta` comparten el paso y se distinguen por caja, peso y color, que es como se
distinguen en cualquier sistema de diseño, en vez de por un píxel que nadie percibe.

**El cuerpo en 16 px no es estética.** Los campos heredan el token y Safari en iOS hace zoom
automático por debajo de 16 px, dejando la página desencuadrada al salir del campo. El alumno entra
desde el teléfono.

### Capa 3 · componentes — `P-02` a `P-08`

| Id | Qué corrige | Raíz |
|---|---|---|
| `P-02` | El encabezado de grupo y el nombre de cuenta dejan de heredar la tipografía de rótulo: caja mixta, tamaño de cuerpo fuerte, color primario | `R-03` |
| `P-03` | Tope de ancho por relleno lateral —sin envoltorio nuevo en el marcado, que habría que agregar en trece pantallas y en la maqueta— y medida de línea acotada para toda prosa | `R-04` |
| `P-04` | Retícula fija de tabla; la columna de acciones se declara **en la fila de encabezado**, que es donde en retícula fija se decide el ancho | `R-05` |
| `P-05` | El campo de filtro crece con el espacio disponible en vez de tener un mínimo fijo | `R-05` |
| `P-06` | Blancos de toque de 44 px; acciones de fila apiladas, con la destructiva en hueco propio | `R-05`, `R-06` |
| `P-07` | El anillo de foco deja de dibujarse sobre `h1` y `main` con `tabindex="-1"`. **No se toca `FocusOnNavigate`**: el anuncio de pantalla nueva sigue igual | `R-08` |
| `P-08` | Contraste: el sello de versión hereda el color de la barra en vez de que `.gf-meta` lo pise; el marcador de posición sube al token secundario | `R-10` |

### Capa 5 · superficies — `P-09` a `P-13`

| Id | Qué corrige | Raíz |
|---|---|---|
| `P-09` | **El producto deja de afirmar lo que no hizo.** `UndrawnPositions` contaba piezas *reconstruidas*; ahora cuenta piezas **con algo que dibujar**. Y aparece un aviso propio cuando de una figura no se pudo derivar ningún valor: «no salió ninguna observación» dejaba de poder significar dos cosas | `R-11` |
| `P-10` | La pantalla de envío declara qué claves reconoce el laboratorio, con un ejemplo colapsado | `R-11` |
| `P-11` | Aprobar, rechazar y retirar acusan recibo. Viaja por la dirección porque la vuelta es un `forceLoad`, igual que ya hace `/ingreso` con `estado` | `R-12` |
| `P-12` | El primer ingreso deja de afirmar un reseteo que no ocurrió, y el registro anticipa la provisoria dictada | `R-14` |
| `P-13` | La pantalla del trabajo dice qué se puede hacer en cada estado. **No se inventa una acción que el dominio no tiene**: `Work.cs:475` sólo admite editar un borrador | `R-13`, `R-15` |

## 3. Implicancias evaluadas antes de aplicar

Esto es lo que la mesa se preguntó, y las respuestas cambiaron el plan.

| Implicancia | Evaluación | Qué se hizo con ella |
|---|---|---|
| **Con la letra más grande, ¿algo deja de entrar?** | Sí: la barra lateral de 168 px partía «Entrega de la comisión» y «Cerrar sesión» en dos renglones | Se ensanchó el token a 232 px, y se verificó con captura |
| **La retícula fija, ¿rompe alguna tabla?** | **Sí, y rompió.** `width: 1%` en la celda de acciones, que en retícula automática significa «lo mínimo», en retícula fija se toma literal: la columna quedó en **10 px medidos** y el botón «Abrir» se partió en seis renglones | Se movió el ancho a la fila de encabezado. **Lo encontró la captura del propio parche**, no un razonamiento |
| **¿Y el encabezado?** | `overflow-wrap: anywhere` heredado partía «ADVERTENCI/AS» y «12/08/20 26» | Se acotó a las celdas de datos |
| **¿Se puede tocar la maqueta?** | Es la línea de base aprobada, pero la **regla de paridad** obliga: un parche que toca una hoja y no la otra es una regresión programada | Se aplicó a las dos, y `C-4` lo verifica |
| **¿Cambiar la escala reabre una decisión cerrada?** | No. La identidad son paleta, marca y familia, y ninguna se toca. `Mesa-UX-UI.md` §6-bis lo declara explícitamente resoluble por la mesa | Se resolvió sin escalar |
| **El parche de `R-11`, ¿puede romper lo que sí funciona?** | Es el riesgo caro del ciclo: el envío con claves del contrato **anda bien** y muestra el valor central del producto | Se verificó el par completo: con claves del contrato **sigue** dibujando y advirtiendo la discrepancia |
| **¿Y el `<strong>` dentro de la banda de aviso?** | `.gf-banner` es contenedor flexible: un elemento adentro se vuelve ítem propio y **partió el texto en tres columnas** | Se sacó. Lo encontró la captura, otra vez |
| **¿Alguna prueba existente cambia de significado?** | Sí: `ResolucionDelTrabajoTests` esperaba `\/entrega-comision$`, y el acuse agrega parámetros | Se actualizó **y** se le agregó la afirmación del acuse, que era lo que faltaba |

## 4. Lo que se aplicó y lo que no

**Aplicado**: `P-01` a `P-13`, cubriendo las raíces `R-01` a `R-08`, `R-10` a `R-16`.

**No aplicado, con motivo asentado** (`NO_APLICAR`, no ignorado):

- **`R-17` · divergencias de paridad y sello de versión** (2-3). El `README.md` de la maqueta la
  aprueba «con sus tres huecos declarados… su vía es una iteración 5», y esa iteración no ocurrió.
  Corregir el producto contra una fuente que el propio Product Owner dejó a medias sería alinearlo
  con algo que no manda. **Deuda declarada.**
- **`R-09` · recorrido de teclado** (`INSUFICIENTE`, 3-2). La mitad que procede —el enlace de salto
  antes del contenido— se absorbió en `P-07`. La otra mitad, `E-03` (el foco se pierde solo a
  ~1,5 s en superficies interactivas), tiene su causa en el circuito y no en la hoja: un parche a
  ciegas puede empeorarlo. **Vuelve al ciclo 2 con pedido concreto**: medir en qué momento del
  ciclo de vida del circuito se descarta el nodo enfocado.
- **`R-18` · trece hallazgos sueltos**, ninguno `S1` ni `S2` salvo `E-06` —el aviso de corte de
  conexión llega tarde porque el hospedaje no pasa WebSockets y el circuito cae a sondeo largo—,
  que depende del alojamiento y no de este ciclo.

## 5. Criterio de verificación, por parche

Ninguno se declaró aplicado sin esto (`Mesa-UX-UI.md` §7-bis).

| Parche | Cómo se verificó |
|---|---|
| `P-01` a `P-08` | Captura del mismo encuadre, antes y después, en maqueta **y** producto, a 1440x900 y 390x844. Más los cinco controles de `verify-visual-system.sh` |
| `P-09`, `P-10` | Las tres afirmaciones de `FiguraQueNoSePudoLeerTests` corridas **en rojo** contra el sitio publicado sin el arreglo, y en verde contra un laboratorio completo levantado por la mesa |
| `P-11` | `ResolucionDelTrabajoTests` con la afirmación del acuse agregada |
| `P-12`, `P-13` | Recorrido completo: aprovisionamiento, registro, habilitación, cambio obligado, dos entregas |
| todos | 522 pruebas de las tres baterías |
