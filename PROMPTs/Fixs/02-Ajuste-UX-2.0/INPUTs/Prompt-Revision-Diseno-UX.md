# Revisión de diseño y experiencia de usuario

**Alias:** Prompt-Revision-Diseno-UX
**Naturaleza:** procedimiento
**Qué produce:** un informe de hallazgos con evidencia medida, clasificados por origen, y un plan de reparación por fases
**Cuándo se cita:** al cerrar cualquier desarrollo con superficie visual, antes de darlo por terminado
**Requiere:** navegador automatizable (Playwright) contra la app corriendo, y sesión autenticada si la pantalla lo pide

---

## 0. Qué es esto

Un procedimiento de revisión, no una orden de rediseño. La diferencia importa: un agente al que se le
pide «mejorá el diseño» produce opinión disfrazada de diagnóstico, y termina en gradientes, bordes
redondeados y una pantalla que ya no se parece a las demás del producto. Lo que sigue obliga a **medir
antes de opinar**, a **separar el defecto de la pantalla del defecto del sistema**, y a **parar** cuando
la reparación excede lo que un agente puede decidir solo.

El rediseño es una salida posible del procedimiento, no su premisa.

---

## 1. Entrada — lo completa quien invoca

| Campo | Valor |
| --- | --- |
| **Pantallas** | URLs o rutas a revisar. Una por línea |
| **Base URL** | Dónde corre la app (local, túnel, staging) |
| **Sesión** | Ruta al `storageState.json`, o credenciales de un usuario de prueba, o «pública» |
| **Stack** | Framework de UI y de render |
| **Sistema de diseño vigente** | Alias de la base de conocimiento que lo caracteriza, o «ninguno» |
| **Alcance** | `auditar` (solo informe) · `auditar y reparar` · `auditar y rediseñar` |
| **Restricciones del caso** | Lo que no se puede tocar en este desarrollo puntual |

Si algún campo falta, **preguntá antes de empezar**. No lo infieras: revisar la pantalla equivocada, o
revisarla sin sesión y auditar la de login, es la forma más cara de perder una corrida.

---

## 2. Carga de conocimiento

Antes de abrir el navegador:

1. Si hay un **sistema de diseño caracterizado**, cargá su base de conocimiento y la de su
   implementación, si son dos documentos. Leé completas las secciones de **tokens**, **convención de
   nombres**, **criterios de aceptación** y **anti-patrones**. Esas cuatro son el patrón de medida.
2. Prestá atención a los anti-patrones marcados como **defectos del artefacto**: son fallas del sistema
   mismo, documentadas para que no se copien. Un hallazgo que coincide con uno de ellos **no es culpa de
   la pantalla**, y confundirlo lleva a reparar en el lugar equivocado.
3. Si **no hay** sistema caracterizado, decilo explícitamente en el informe y usá el marco de §5 solo.
   No inventes un sistema de diseño de la nada en medio de una revisión: eso es otro trabajo, y se
   decide aparte.
4. Registrá qué documentos cargaste y en qué versión. El informe tiene que ser reproducible.

---

## 3. Especialistas

Levantá **un subagente por eje**, en paralelo. Cada uno recibe las mismas capturas y el mismo DOM, y
devuelve hallazgos con evidencia. Ninguno propone soluciones todavía: primero se observa.

### 3.1 Conformidad con el sistema

**Pregunta que responde:** ¿esta pantalla está escrita con el vocabulario del sistema, o lo esquiva?

Busca: colores, radios y sombras literales donde debería haber tokens; clases inventadas fuera de la
convención de nombres; hojas de estilo o bloques `<style>` nuevos; componentes reimplementados a mano
cuando el sistema ya trae uno; uso del framework base donde el sistema corre un eje propio; envoltorios
obligatorios ausentes.

**Evidencia:** cita de la línea y de la regla del documento que incumple.

### 3.2 Accesibilidad

**Pregunta que responde:** ¿esta pantalla se puede usar sin mouse, sin vista y sin oído?

Piso: **WCAG 2.2 nivel AA**. Los criterios que más se rompen en paneles de administración:

- **1.4.3 Contraste (mínimo)** — 4,5:1 texto normal, 3:1 texto grande. Medilo sobre color computado, no
  sobre el token que creías estar usando.
- **1.4.11 Contraste de elementos no textuales** — 3:1 para bordes de control e íconos con significado.
- **2.1.1 Teclado** y **2.1.2 Sin trampas** — toda rama de navegación alcanzable; nada que abra solo por
  hover.
- **2.4.7 Foco visible** y **2.4.11 Foco no oscurecido** — el anillo existe *y* se ve, no tapado por
  encabezados fijos.
- **2.5.8 Tamaño del objetivo (mínimo)** — 24×24 px CSS, con las excepciones de espaciado. Los botones
  de solo ícono en filas de tabla son el caso que falla.
- **3.3.1 Identificación de error**, **3.3.2 Etiquetas o instrucciones**, **3.3.3 Sugerencia ante error**
  — el error tiene que ser texto, no solo un borde rojo.
- **4.1.2 Nombre, rol, valor** y **4.1.3 Mensajes de estado** — botones de solo ícono con nombre
  accesible; regiones vivas para lo que aparece sin recargar.
- **Movimiento** — `prefers-reduced-motion` respetado, incluida la conmutación de tema.

**Evidencia:** número de criterio, selector del elemento, valor medido.

### 3.3 Adaptabilidad

**Pregunta que responde:** ¿la pantalla sobrevive fuera del ancho en que la escribieron?

Anchos de prueba: **390 · 560 · 768 · 992 · 1024 · 1440**. Si el sistema declara sus umbrales, probá
**en el umbral y un pixel a cada lado** — ahí es donde se rompe, no en el medio del rango.

Busca: desbordes horizontales; tablas sin envoltorio de scroll; columnas ocultas en móvil que llevan
información que no está en ninguna celda visible; controles que quedan bajo el objetivo mínimo al
comprimirse; texto que se parte en tres líneas donde había lugar para una; formularios cuyos anchos de
campo no responden a ninguna grilla.

**Evidencia:** captura al ancho donde falla, más el ancho exacto en que empieza a fallar.

### 3.4 Experiencia de uso

**Pregunta que responde:** ¿alguien que no escribió esta pantalla puede completar la tarea sin adivinar?

Marco, en este orden de utilidad:

- **Heurísticas de Nielsen**, de las diez las que más rinden acá: visibilidad del estado del sistema,
  correspondencia con el mundo real, prevención del error antes que mensaje de error, reconocer en vez
  de recordar, y diseño estético y minimalista entendido como *quitar lo que compite*, no como adornar.
- **ISO 9241-110**, principios de diálogo: adecuación a la tarea, autodescripción, conformidad con
  expectativas, tolerancia al error.
- **Divulgación progresiva** — un campo que solo aplica a una rama de la elección no se muestra en las
  otras. Es la mejora de mayor rendimiento en formularios con tipos condicionales, y casi siempre está
  pendiente.
- **Jerarquía visual** — agrupamiento por proximidad y semejanza; que el peso visual de un elemento sea
  proporcional a su frecuencia de uso, no a su gravedad. Una acción destructiva y rara no puede ser lo
  más pesado de la pantalla.
- **Diseño de formularios** — una pregunta por línea salvo que dos sean naturalmente una sola; etiquetas
  arriba del control; campos obligatorios marcados de una sola manera; el texto de ayuda antes del
  error, no después.
- **Ley de Fitts** para el tamaño y la cercanía de los objetivos frecuentes; **ley de Hick** para no
  poner catorce opciones donde hay tres decisiones reales.

Dos advertencias, porque son los dos lugares donde esta clase de revisión se vuelve palabrería:
«7±2» no es una regla de diseño de interfaces y no se cita como tal; y una heurística sin un caso
concreto de la pantalla enfrente es decoración del informe. **Cada hallazgo nombra la tarea que
entorpece.**

### 3.5 Síntesis

Un quinto agente, que corre **después** de los cuatro. Recibe todos los hallazgos y hace tres cosas:

1. **Deduplica.** El mismo defecto llega por tres ejes distintos; se reporta una vez, con los tres
   fundamentos.
2. **Clasifica** por origen, según §6.
3. **Prioriza** por impacto sobre la tarea × frecuencia de uso × costo de reparación. No por facilidad.

---

## 4. Protocolo de observación

### 4.1 El DOM que vale es el renderizado

Si la app hidrata en el cliente, lo que devuelve el primer `GET` es un estado de carga: esqueletos y
marcadores. **Auditar un volcado estático de una app así produce un informe entero sobre pantallas que
no existen.** Esperá a que el circuito termine y auditá el DOM vivo.

### 4.2 Hay que manejar la interfaz, no solo mirarla

Cuatro estados no se observan en ninguna captura estática, y son cuatro de los que más defectos
esconden:

| Estado | Cómo provocarlo |
| --- | --- |
| **Formulario en error** | Enviar vacío, y enviar con un valor inválido en cada campo con validación |
| **Superficie vacía / sin resultados / con error** | Filtrar por algo que no exista; cortar la respuesta del backend; entrar con el recurso vacío |
| **Carga** | Ralentizar la red en el navegador y capturar antes de que resuelva |
| **Acción en curso** | Disparar la acción con la red ralentizada y verificar que el control quedó inhabilitado |

### 4.3 Mediciones obligatorias

- **Recorrido de teclado completo:** tabulá desde el principio, registrando `document.activeElement` en
  cada parada. Un anillo que no se ve, un salto de orden o un control inalcanzable son hallazgos.
- **Contraste sobre color computado**, no sobre el token declarado.
- **Censo de atributos:** nombres accesibles en controles de solo ícono, regiones vivas, `aria-current`
  en el ítem de menú activo, `aria-busy` donde hay esqueleto, `aria-expanded` sincronizado con el estado
  real y no solo presente.
- **Capturas antes/después** al mismo ancho y con el mismo estado, para poder comparar.
- Si el sistema tiene **tema claro y oscuro**, todo lo anterior en los dos. La mitad de los defectos de
  contraste solo existen en uno.

### 4.4 Higiene

No modifiques datos que no sean de prueba. Si la pantalla tiene acciones destructivas, ejecutalas contra
registros creados por vos en la misma corrida. Si no podés garantizar eso, **auditá el estado y no lo
dispares**, y dejalo anotado como cobertura faltante.

---

## 5. Umbral de reporte

Un hallazgo entra al informe si cumple las tres:

1. **Es observable.** Hay una captura, un valor medido o una línea de código que lo muestra.
2. **Afecta la tarea.** Se puede nombrar qué le cuesta más al usuario por culpa de esto.
3. **Tiene una reparación enunciable.** Aunque la decisión no sea tuya.

«Se ve viejo» no cumple ninguna de las tres. «El botón de revocar es el elemento de mayor peso visual de
la pantalla siendo la acción menos frecuente y la más destructiva, lo que empuja al clic accidental»
cumple las tres.

---

## 6. Clasificación por origen — el núcleo del procedimiento

Cada hallazgo va a exactamente una categoría. De esto depende **dónde** se repara, y equivocarse acá es
lo que hace que las revisiones no acumulen.

| | Situación | Qué se hace |
| --- | --- | --- |
| **A** | La pantalla **no usa bien** el sistema. El sistema ya resuelve el caso y la pantalla lo esquivó | **Reparar en la pantalla.** No requiere aprobación: es alinear con lo ya decidido |
| **B** | La pantalla **usa bien** el sistema, y **el sistema está mal**. Coincide con un defecto ya documentado del artefacto | **No reproducirlo.** Si el documento prescribe una reparación local, aplicarla. Si no, dejar el hallazgo registrado contra el sistema, no contra la pantalla. **Nunca** se arregla inventando CSS suelto en una pantalla |
| **C** | El sistema **no cubre** el caso, o lo cubre mal para esta tarea puntual | **Parar y proponer.** Requiere decisión humana. Esta es la única puerta al rediseño |

Sobre **C**, que es lo que se pidió al citar este documento: la propuesta se escribe, no se aplica.
Incluye qué patrón falta, qué pantallas además de esta lo necesitarían, y qué costo tiene incorporarlo
al sistema frente a resolverlo local. Un patrón nuevo que solo sirve a una pantalla casi siempre es un
síntoma de que la tarea está mal modelada, no de que falte un componente.

**Un rediseño que no pasó por C es un rediseño no autorizado.** Si al terminar la clasificación no hay
ningún hallazgo en C, la respuesta correcta es que la pantalla no necesita rediseño, y decirlo.

---

## 7. Entregable

Un solo archivo, `docs/revision-ux-<pantalla>-<fecha>.md`:

```
1. Alcance          qué se revisó, en qué anchos, en qué temas, con qué sesión, qué quedó sin cubrir
2. Documentos       bases de conocimiento cargadas y versión
3. Resumen          tres a cinco líneas. Lo que un lector que no sigue leyendo tiene que saber
4. Hallazgos        tabla: id · eje · categoría A/B/C · severidad · criterio o regla · evidencia · reparación
5. Plan             orden de reparación, con lo que entra en esta corrida y lo que no
6. Propuestas C     una por hallazgo, con alternativa y costo. Cada una es una decisión pendiente
7. Cobertura        estados que no se pudieron provocar y por qué
```

La tabla de hallazgos es lo importante; el resto es contexto. Si el informe tiene más prosa que tabla,
está mal escrito.

---

## 8. Fases y puntos de parada

**Fase 1 — Observar.** Nada de código. Navegar, provocar los estados, medir, capturar. Termina con el
informe de §7 completo hasta el punto 4. **Parar y mostrarlo.**

**Fase 2 — Plan.** Con el informe aprobado, escribir el plan de reparación: qué hallazgos entran, en qué
orden, qué archivos toca cada uno. **Parar y mostrarlo.**

**Fase 3 — Reparar.** Solo los A, y los B con reparación prescripta. Después de cada bloque de cambios:
volver a correr las mediciones del §4.3 sobre lo tocado y adjuntar el antes/después. **Máximo tres
iteraciones**; si al tercer intento un hallazgo sigue abierto, se documenta y se para. Los ciclos largos
de ajuste fino de espaciados no convergen y consumen la sesión.

**Fase 4 — Verificar.** Recorrer la lista de criterios de aceptación del sistema de diseño, si existe, y
declarar cada uno cumplido o no. Un criterio que no se pudo verificar se declara así; no se marca
cumplido por omisión.

Los C nunca se implementan en la misma corrida en que se descubren.

---

## 9. Restricciones duras

- **No cambiar comportamiento.** Nombres de campo, identificadores, rutas, contratos de datos y manejadores
  quedan como están. Si un hallazgo exige tocarlos, es un C.
- **No agregar dependencias** de frontend.
- **No crear archivos CSS nuevos** cuando hay un sistema de diseño vigente. Las pantallas componen lo que
  existe.
- **No introducir estética que el producto no tiene.** Si al terminar la pantalla no se parece a sus
  hermanas, la reparación falló aunque cada hallazgo individual esté resuelto.
- **No tocar pantallas fuera del alcance declarado**, aunque tengan el mismo defecto. Se anota que lo
  tienen.
- **No borrar ni reescribir la evidencia** de una corrida anterior. Los informes se acumulan.

---

## 10. Anti-patrones del revisor

| Anti-patrón | Cómo se detecta |
| --- | --- |
| **Opinión sin medida** | Un hallazgo sin captura, valor ni línea de código |
| **Modernizar** | Aparecen gradientes, vidrio esmerilado, sombras nuevas o una paleta que nadie pidió |
| **Reparar el defecto del sistema en la pantalla** | Un `<style>` suelto que corrige algo que está mal para todos |
| **Auditar el estado de carga creyendo que es la pantalla** | El informe describe esqueletos y marcadores |
| **Un solo estado** | Se revisó «con datos» y nada más. Los otros tres son los que cuestan caro después |
| **Un solo ancho** | Se revisó a 1440 y se declaró adaptable |
| **Un solo tema** | Se revisó en claro y la mitad de los contrastes del oscuro quedó sin ver |
| **Heurística de adorno** | Se cita a Nielsen sin nombrar qué tarea de esta pantalla se entorpece |
| **Rediseñar sin pasar por C** | Se cambió la estructura de la pantalla sin que ninguna propuesta haya sido aprobada |
| **Informe sin cobertura** | No dice qué quedó sin revisar. Siempre queda algo |

---

## 11. Si no hay sistema de diseño

El procedimiento sigue valiendo, con dos cambios: la categoría A desaparece —no hay contra qué
conformarse— y todo lo que sería B o C se vuelve una sola pregunta previa, que se responde **antes** de
tocar ninguna pantalla: *¿qué es lo mínimo que hay que fijar para que dos pantallas hechas por dos
personas distintas se parezcan?* Escala de espaciado, escala tipográfica, tokens de color semánticos e
inventario de los componentes que **ya existen** en el código. Eso se escribe primero, se aprueba, y
recién después empieza la fase 1.

Sin ese paso, cada pantalla revisada converge a una estética distinta y la revisión número tres deshace
la número uno.
