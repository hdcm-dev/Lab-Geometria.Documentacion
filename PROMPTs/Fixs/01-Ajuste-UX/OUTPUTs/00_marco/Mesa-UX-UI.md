# Marco — Mesa evaluadora de experiencia e interfaz de usuario

> **Derivado de** `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Base/Mesa-Evaluadora.md`.
> Este archivo **no reemplaza** al marco base: lo especializa para un objeto distinto. El marco base
> juzga **artefactos de especificación**; esta mesa juzga **una interfaz en ejecución**. Todo lo que
> no se redefine acá rige tal como está en el base, con su numeración.
>
> **Habilitado por** `/IA/PROMPTs/IA.Prompts/Base/Medios.md`: sin medio de observación no hay
> veredicto sobre la ejecución, y este marco convoca agentes que sólo pueden hablar de lo que
> observaron.

---

## 0. Qué cambia respecto del marco base

| Del marco base | Cómo queda en esta mesa | Por qué |
|---|---|---|
| El objeto es `spec → plan → tareas → código` | El objeto es **la pantalla en ejecución**, con la maqueta aprobada y el sistema de estilos como capas de origen | Un defecto de proporción tipográfica no vive en la spec: vive en el token, y el token vive en dos hojas de estilo |
| §3 coherencia: cinco chequeos sobre requisitos | §3-bis **cinco chequeos mecánicos de interfaz** (abajo) | Un requisito sin prueba no es lo que falla acá; lo que falla es una escala sin razón y un control sin lugar |
| E1 = prueba que falla | E1 = **registro de un medio** (`.txt` con error de consola, medición en el navegador, prueba E2E en rojo) | `Medios.md` §5 |
| E3 = contraejemplo construido | E3 = **recorrido reproducible** que deja a la persona sin salida, con captura del estado final | Es la forma que toma «no es intuitivo» cuando deja de ser opinión |
| Panel de especialistas | **Comisiones**: cada una es un analista independiente **con su propio medio**, que produce informe y acta | El pedido del Product Owner: comisiones con analistas independientes que investiguen y hagan sus casos |
| Núcleo permanente de 4 roles | Núcleo de 4 **más los usuarios estándar**, que no son expertos y por eso no se los puede reemplazar por uno | Un experto no puede simular no saber; su juicio ya está contaminado por el modelo mental del sistema |
| Relator | **Consultor de documentación**, que además abastece a las comisiones del corpus y verifica cada cita | El corpus son 1.143 archivos: sin abastecimiento, cada comisión lo recorre entero o inventa |
| — | **Moderadores** (§4.6, nuevo): fijan objetivos de mejora medibles y conducen a las comisiones hacia ellos | Sin objetivo, una mesa de UX produce una lista de gustos |
| §5.5 reparación en la capa de origen | Se declara la **cadena de capas de interfaz** (§1-bis) y el parche va a la más alta que lo contenga | Corregir una pantalla cuando el defecto está en el token repite el defecto en las otras doce |

---

## 1-bis. Las capas de origen de una interfaz

Ordenadas de arriba hacia abajo. Un parche que no se aplica en la capa más alta que contiene el
defecto **se rechaza**, aunque funcione.

1. **Catálogo de diseño** — `Design-Rules-*` del framework. Reglas de tipografía, color, espaciado.
2. **Tokens del sistema visual** — las variables CSS de `:root`. Una escala, un ritmo, un radio.
3. **Componente** — la clase que compone tokens: `.gf-btn`, `.gf-table`, `.gf-page-header`.
4. **Maqueta aprobada** — `SDD/Maquetas/GeometriaFactory-Web/*.html`: la línea de base visual.
5. **Superficie Blazor** — `Components/Pages/*.razor`.
6. **Instancia desplegada** — lo que se ve en `aplicada.somee.com`.

**Regla de paridad.** La maqueta (4) y la superficie (5) tienen que decir lo mismo. Un parche que
toca una y no la otra es una regresión programada: se aplica a las dos o no se aplica. Cuando el
defecto es de las capas 2 o 3, el parche se escribe **una vez** y se instala **byte a byte idéntico**
en los dos árboles.

---

## 3-bis. Los cinco chequeos mecánicos de interfaz

Se corren **antes** de convocar a nadie. Lo que falle entra como `S1`/`S2` con ancla `E1`, sin que
nadie opine. Son baratos y sirven para no gastar un panel entero en descubrir lo obvio.

| # | Chequeo | Cómo se mide | Falla cuando |
|---|---|---|---|
| C-1 | **Existe una escala tipográfica** | Listar los `--type-*-size` y calcular la razón entre pasos consecutivos | Los pasos no siguen una razón declarada, o el rango total no distingue un título de un párrafo |
| C-2 | **Existe un ritmo de espaciado** | Listar los `--space-*` y su progresión | La progresión es arbitraria (pasos de 2 px sin criterio) o hay más pasos que usos |
| C-3 | **Ningún elemento no interactivo recibe el anillo de foco** | Cargar cada pantalla y leer `document.activeElement` y su `:focus-visible` | Un elemento sin acción queda con anillo al cargar |
| C-4 | **Ninguna pantalla arroja errores de consola** | El `.txt` del medio A por pantalla | Hay una línea `console:` o `pageerror:` |
| C-5 | **Paridad maqueta ↔ producto** | Diferencia de las dos hojas de estilo y de los textos literales por pantalla | Un componente existe en una y no en la otra sin decisión escrita |

---

## 4. Composición de esta mesa

### 4.1 Núcleo permanente (se convoca siempre)

| Rol | Pregunta que responde | Evidencia que puede producir |
|---|---|---|
| **Requisitos de uso** | ¿Cada pantalla declara qué se puede hacer en ella y con qué resultado? | E2 sobre maqueta y wireframe |
| **Verificación / E2E** | ¿Qué afirmación de esta mesa está cubierta por una prueba que corre sola? | E1 (`GeometriaFactory.E2ETests`) |
| **Implementador ingenuo** | ¿Se puede reproducir este ajuste sin preguntar nada? | E2 |
| **Abogado del diablo** | Ataca la propuesta dominante. Entra **después** de leer al resto | cualquiera |

### 4.2 Comisiones de especialidad (catálogo, activadas por señal observable)

| Comisión | Se convoca cuando… | Mandato | Fuera de mandato |
|---|---|---|---|
| **A · Tipografía, escala y densidad** | hay más de un tamaño de letra declarado en tokens | La razón de la escala, el cuerpo base, la altura de línea, la medida de línea, la jerarquía | Color, flujo, contenido |
| **B · Composición, ubicación y dimensionamiento** | hay más de un control por pantalla | Ancho útil, columnas, agrupamiento de acciones, alineación, orden de tabulación visual, densidad | Tipografía (la toma A), semántica |
| **C · Flujo del alumno** | existe un recorrido de más de dos pantallas para un papel | Navegabilidad y continuidad del recorrido de la persona que **entrega** | Todo lo del papel administrador |
| **D · Administración y prestabilidad** | existe un papel con acciones sobre datos de otros | Que cada acción declarada **exista, se alcance y produzca su efecto** | Estética |
| **E · Accesibilidad y comportamiento (.NET/Blazor)** | hay foco, teclado, estados de red o render interactivo | Foco, teclado, contraste, anuncio de estados, errores de consola, coste de render | Gusto visual |
| **F · Paridad maqueta ↔ producto** | existe una maqueta aprobada | Toda diferencia entre las dos, en las dos direcciones | Proponer diseño nuevo |

### 4.3 Usuarios estándar (no son expertos, y ahí está su valor)

Se convocan **siempre que la mesa juzgue una interfaz**, y son los únicos que pueden fundar un
hallazgo de intuitividad. Carta de mandato común:

```yaml
usuario_estandar:
  competencia: usar la interfaz con un objetivo concreto y decir dónde se detuvo
  no_competencia: proponer solución, nombrar componentes, citar reglas de diseño
  evidencia_admisible: [E3]          # el recorrido que lo dejó sin salida
  obligacion: declarar el objetivo ANTES de empezar y no cambiarlo
  prohibicion: leer el código, la maqueta o la especificación
```

| Id | Quién es | Objetivo declarado |
|---|---|---|
| `US-1` | Alumno de la comisión, primera vez, entra desde el teléfono | Registrarse y entregar un trabajo |
| `US-2` | Alumno que ya entregó y vuelve | Ver qué le dijeron de su trabajo y corregirlo |
| `US-3` | Docente que abre el laboratorio por primera vez en la semana | Habilitar una cuenta nueva y resolver un trabajo pendiente |

Un usuario estándar que **logra** su objetivo lo declara igual: «lo logré, y me costó acá» es un
hallazgo, y su severidad la fija el jurado, no él.

### 4.4 Jurado (5, funciones del base §4.3, sin cambios)

Evidencia · Impacto · Costo-beneficio · Coherencia histórica · Riesgo e irreversibilidad.

Se agrega una **regla de perito propia de esta mesa**: cuando el hallazgo lo emite un usuario
estándar, el perito convocado **no puede ser el mismo usuario**. La comisión de especialidad que
corresponda traduce el recorrido a causa técnica y responde. Así el usuario no tiene que saber por
qué le pasó lo que le pasó.

### 4.5 Cuerpo auditor

Diseña parches con **texto exacto** de CSS o de marcado, la **capa de §1-bis** en la que se aplican,
la lista de archivos gemelos que hay que tocar para no romper la paridad, y su **criterio de
verificación observable**: qué captura, con qué medio, muestra qué.

### 4.6 Moderadores (rol nuevo de esta mesa)

Dos, y no votan.

- **Moderador de objetivos.** Antes del panel convierte el pedido del Product Owner en **objetivos
  de mejora medibles**, cada uno con su instrumento. «Que se vea mejor» no es un objetivo; «que la
  razón entre título y cuerpo sea ≥ 1,5 y quede medida en el navegador» sí.
- **Moderador de convergencia.** Durante el ciclo corta la deliberación cuando dos comisiones
  discuten sobre lo mismo con nombres distintos, y aplica el criterio de parada de §7 del base
  (menos del 20 % de hallazgos válidos nuevos respecto del ciclo anterior).

### 4.7 Consultor de documentación

Abastece: por cada hallazgo, ubica en el corpus la regla, el wireframe o la decisión que lo
gobierna, y **verifica que la cita exista y diga lo que el hallazgo afirma**. Una cita que no
resiste esa verificación degrada el hallazgo a nivel `C`. No emite hallazgos ni vota.

---

## 5-bis. El ciclo, con lo que cambia

1. **Contrato de entrada** (§2 del base) — obligatorio, incluyendo **qué medios se van a usar y qué
   queda sin observar**.
2. **Chequeos mecánicos de interfaz** (§3-bis).
3. **Objetivos de mejora** del moderador de objetivos, con instrumento por objetivo.
4. **Barrido de señales** y **mesa de convocatoria** (§5.1c del base: los cinco jueces votan
   `CONVOCAR` / `NO_CONVOCAR` con motivo / `INSTANCIAR_AD_HOC`).
5. **Comisiones a ciegas y en paralelo.** Cada una **observa por su cuenta** con su propio medio y
   con prefijo propio de archivos, para que ningún registro pise el de otra. Techo de hallazgos por
   comisión. Cada una declara además **hasta tres cosas que revisó y están bien**.
6. **Consolidación** del consultor, **veredicto** del jurado por hallazgo, **parches** del cuerpo
   auditor, **aprobación** en mesa con los cuatro resultados del base §5.5.
7. **Aplicación y verificación**: se aplica, se vuelve a observar **con el mismo medio y el mismo
   encuadre**, y se comparan las dos capturas. Si la verificación no se puede observar, el parche no
   se puede declarar aplicado.
8. **Cierre** con el bloque del base §7, más dos campos propios:

```yaml
medios_usados: [<medio: qué observó>]
sin_observar: [<qué quedó fuera del alcance de los medios y por qué>]
```

---

## 6-bis. Escaladas propias de esta mesa

A los siete disparadores del base se agrega uno, y se acota otro:

- **Nuevo · Cambio de identidad visual.** Cambiar la paleta, la marca o la familia tipográfica es
  cambio de alcance (disparador 3): se escala. **Cambiar la escala de tamaños dentro de la misma
  familia no lo es**, y la mesa lo resuelve sola: es precisamente lo que el Product Owner pidió.
- **Acotado · Datos reales.** Toda acción de una comisión sobre el laboratorio desplegado se limita
  a **cuentas y trabajos que la propia comisión sembró**. Actuar sobre el trabajo de un alumno real
  es irreversible con impacto material (disparador 4) y está prohibido sin decisión del Product
  Owner.

---

## 7-bis. Regla de cierre que esta mesa no negocia

> Un ajuste de interfaz se declara aplicado cuando **existe la captura posterior**, tomada con el
> mismo medio y el mismo encuadre que la anterior, y las dos están versionadas juntas.

Una prueba en verde no cierra un defecto visual, y una descripción de lo que se cambió tampoco.
