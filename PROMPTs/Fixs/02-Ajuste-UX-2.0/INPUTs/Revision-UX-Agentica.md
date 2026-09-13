# Revisión de diseño y experiencia — procedimiento agéntico

**Invocación:** Ejecutar `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Fixs/02-Ajuste-UX-2.0/INPUTs/Revision-UX-Agentica.md` sobre <proyecto>
**Requiere:** MCP de navegador registrado en la sesión
**Produce:** `docs/revision-ux/<proyecto>-<fecha>.md` con hallazgos, evidencia y clasificación

---

## 1. Parámetros

Lo único obligatorio es el **proyecto**. Todo lo demás lo inferís y lo confirmás.

| Parámetro | Por defecto |
| --- | --- |
| `proyecto` | — obligatorio |
| `pantallas` | Todas las rutas alcanzables desde el menú, máximo 8. Si son más, pedí la lista |
| `alcance` | `auditar`. Los otros valores: `auditar y reparar`, `auditar y rediseñar` |
| `sesión` | La del navegador, si ya está logueado. Si no, pedí credenciales de prueba |
| `temas` | Todos los que declare el sistema de diseño |

Antes de arrancar, **enunciá qué entendiste** —proyecto, cómo lo vas a levantar, qué pantallas, con qué
usuario— y esperá confirmación. Una corrida contra la app equivocada o con el usuario sin permisos es la
forma más cara de perder una sesión.

---

## 2. Levantar el proyecto

Buscá cómo se arranca, en este orden: `compose.yaml` / `docker-compose.yml`, `Makefile`, `Taskfile`,
el `README`, y por último la configuración de arranque del framework. **Proponé el comando y esperá el
visto bueno** antes de ejecutarlo.

No corras migraciones ni sembrado de datos por tu cuenta si no está claro contra qué base apuntan.

Una vez arrancado, **verificá que responde** antes de seguir: consultá la URL base hasta que devuelva
algo, con un tope de intentos. Si no levanta, **pará**: reportá el error de arranque y no audites nada.
Un informe sobre una pantalla de error 500 es ruido.

Al terminar, bajá lo que levantaste vos. Lo que ya estaba corriendo, dejalo.

---

## 3. El navegador

Asumí que hay un MCP de navegador disponible y usalo. Si no lo hay, **pará y decilo** — no lo suplantes
con `curl` ni con peticiones HTTP. En una app que hidrata en el cliente, lo que devuelve el primer `GET`
es un estado de carga: esqueletos y marcadores. Auditar eso produce un informe entero sobre pantallas
que no existen.

Esperá a que el circuito termine antes de mirar nada.

---

## 4. La regla de orden: primero a ciegas

**No leas el código fuente de las pantallas hasta terminar la fase 5.**

El motivo es la única cosa de este documento que, si se saltea, invalida el resultado entero: un agente
que leyó el componente sabe dónde está cada control, qué campos son condicionales y qué hace cada botón.
Después de eso **no puede juzgar si la pantalla es intuitiva**, porque ya no le falta la información que
le faltaría a un usuario nuevo. Va a declarar todo evidente.

El orden es: navegar a ciegas y registrar dónde dudaste → recién ahí abrir el código para explicar por
qué. La confusión se observa una sola vez y no se puede recuperar.

---

## 5. Recorrido exploratorio

### 5.1 Definí las tareas

Antes de tocar el navegador, escribí **de tres a cinco tareas** que un usuario real vendría a hacer a
esta pantalla, en el vocabulario del usuario y no en el del código. «Dar de alta una credencial de FCM
para una app nueva», no «probar el formulario de carga».

Si no podés escribir las tareas mirando solo el nombre de la pantalla y el menú, ese ya es el primer
hallazgo: la pantalla no comunica para qué sirve.

### 5.2 Ejecutá cada tarea como quien no la conoce

Andá a la pantalla e intentá completar la tarea. En cada paso donde tuviste que decidir algo, respondé
las cuatro preguntas del **recorrido cognitivo**:

1. ¿El usuario iba a intentar el efecto correcto? *(¿sabe qué tiene que lograr acá?)*
2. ¿Iba a notar que la acción correcta está disponible? *(¿el control es visible y se lee como control?)*
3. ¿Iba a asociar esa acción con el efecto que busca? *(¿el rótulo dice lo que hace?)*
4. Después de actuar, ¿iba a entender que progresó? *(¿la pantalla le contestó?)*

Un «no» en cualquiera de las cuatro es un hallazgo, y las cuatro fallan de maneras distintas: la 2 y la
3 se arreglan con rótulos y jerarquía, la 1 con arquitectura de información, la 4 con estados y
retroalimentación. Anotá cuál falló, no «es poco intuitivo».

### 5.3 Registrá la fricción mientras pasa

Llevá una bitácora de la corrida. Todo esto es evidencia y se pierde si no se anota en el momento:

- Dónde dudaste antes de hacer clic, y entre qué opciones.
- Qué probaste que no funcionó.
- Qué campo llenaste sin saber qué esperaba.
- Qué te sorprendió del resultado.
- Cuántos pasos te llevó la tarea contra los que necesitaba.

**Tu propia dificultad para operar la pantalla es un dato, no una molestia del montaje.** Si navegás por
el árbol de accesibilidad y te trabás porque un botón no tiene nombre, ese es exactamente el punto donde
se traba un lector de pantalla. Reportalo como hallazgo, no lo esquives probando por coordenadas.

---

## 6. Los cuatro estados

Después del recorrido, provocá a propósito lo que no se ve navegando normal. Estos cuatro estados
esconden la mayoría de los defectos y ninguno aparece en una captura de la pantalla feliz:

| Estado | Cómo se provoca |
| --- | --- |
| **Formulario en error** | Enviar vacío. Después, un valor inválido en cada campo con validación |
| **Vacío / sin resultados** | Filtrar por algo que no exista. Entrar con el recurso sin registros |
| **Carga** | Ralentizar la red y capturar antes de que resuelva |
| **Acción en curso** | Disparar la acción con la red ralentizada: verificar que el control quedó inhabilitado |

Si alguno no se puede provocar, va a la sección de cobertura del informe. No se declara cumplido por
omisión.

**Higiene:** las acciones destructivas se ejecutan solo contra registros que creaste vos en la misma
corrida. Si no podés garantizarlo, auditá el estado sin dispararlo y anotá el hueco.

---

## 7. Dos carriles: lo que se ve y lo que se mide

Son instrumentos distintos y detectan cosas disjuntas. La regla que los ordena:

> **La captura genera hipótesis. La medición confirma hallazgos. Nada entra al informe con evidencia
> solo visual.**

Esto no es formalismo. Mirando una imagen no se distingue 4,3:1 de 4,6:1, pero se puede afirmar con
total convicción que hay un problema de contraste y errarle. Lo mismo con tamaños de objetivo y
alineaciones.

**Lo que solo ve la captura** —y hay que mirarla para encontrarlo—: jerarquía plana, agrupamiento que no
corresponde al contenido, anchos de campo arbitrarios sin grilla, peso visual desproporcionado respecto
de la frecuencia de uso, densidad, texto que se parte donde había lugar.

**Lo que solo da la medición:** contraste sobre color computado, orden y visibilidad del foco, atributos
accesibles, ancho exacto donde se rompe el layout, errores de consola, valores literales donde debería
haber tokens.

Mediciones obligatorias, en todos los temas que existan:

- **Recorrido de teclado completo**, registrando el elemento activo en cada parada. Anillo invisible,
  salto de orden o control inalcanzable son hallazgos.
- **Contraste computado**, no el token que creías estar usando.
- **Censo de atributos:** nombre accesible en controles de solo ícono, regiones vivas para lo que cambia
  sin recargar, marca del ítem de menú activo, estado de expansión sincronizado con la realidad.
- **Consola limpia** durante todo el recorrido.

---

## 8. Presupuesto de capturas

Cada imagen cuesta entre mil y dos mil tokens. La matriz completa no entra y, si entra, te deja sin
contexto para razonar.

- **Medición:** matriz completa. Es texto y es barata.
- **Captura:** muestra. Anchos mínimo y máximo, cada tema, estado con datos y estado de error. Se
  profundiza solo donde la medición marcó algo.
- Capturá **el viewport, no la página entera**. Recortá regiones cuando el hallazgo es local.
- Anchos de prueba: si el sistema declara sus umbrales, probá **en el umbral y un pixel a cada lado** —
  ahí es donde rompe, no en el medio del rango.

---

## 9. Marco de evaluación

### 9.1 Accesibilidad — piso WCAG 2.2 AA

Los criterios que más se rompen en paneles de administración:

**1.4.3** contraste 4,5:1 (3:1 en texto grande) · **1.4.11** 3:1 en bordes de control e íconos con
significado · **2.1.1** todo alcanzable por teclado · **2.4.7** foco visible · **2.4.11** foco no
tapado por encabezados fijos · **2.5.8** objetivo mínimo 24×24 px CSS — los botones de solo ícono en
filas de tabla son el caso que falla · **3.3.1 / 3.3.2 / 3.3.3** el error es texto, no solo un borde
rojo · **4.1.2** nombre, rol y valor · **4.1.3** mensajes de estado anunciados · más
`prefers-reduced-motion` respetado, incluida la conmutación de tema.

Cada hallazgo cita número de criterio, selector y valor medido.

### 9.2 Experiencia

Marco, en orden de rendimiento real:

- **Heurísticas de Nielsen**, sobre todo: visibilidad del estado del sistema, prevención del error antes
  que mensaje de error, reconocer en vez de recordar, y minimalismo entendido como *quitar lo que
  compite*, no como adornar.
- **ISO 9241-110**: adecuación a la tarea, autodescripción, conformidad con expectativas, tolerancia al
  error.
- **Divulgación progresiva**: un campo que solo aplica a una rama de la elección no se muestra en las
  otras. Es la mejora de mayor rendimiento en formularios con tipos condicionales, y casi siempre está
  pendiente.
- **Jerarquía visual**: proximidad y semejanza; peso visual proporcional a la **frecuencia de uso**, no
  a la gravedad. Una acción destructiva y rara no puede ser lo más pesado de la pantalla.
- **Formularios**: una pregunta por línea salvo que dos sean naturalmente una; etiquetas arriba;
  obligatorios marcados de una sola manera; ayuda antes del error.
- **Fitts** para tamaño y cercanía de lo frecuente; **Hick** para no ofrecer catorce opciones donde hay
  tres decisiones.

Dos advertencias, porque son los dos lugares donde esto se vuelve palabrería: «7±2» no es una regla de
diseño de interfaces y no se cita como tal; y una heurística sin un caso concreto de esta pantalla es
decoración del informe. **Cada hallazgo nombra la tarea que entorpece.**

### 9.3 Umbral de reporte

Entra al informe lo que cumple las tres: **es observable** (captura, valor medido o línea de código),
**afecta la tarea** (se puede nombrar qué le cuesta más al usuario), **tiene reparación enunciable**
(aunque la decisión no sea tuya).

«Se ve viejo» no cumple ninguna.

---

## 10. Clasificación por origen

Recién acá abrís el código. Cada hallazgo va a **una** categoría, y de esto depende dónde se repara.

| | Situación | Qué se hace |
| --- | --- | --- |
| **A** | La pantalla **no usa bien** el sistema de diseño. El sistema ya resuelve el caso y la pantalla lo esquivó | **Reparar en la pantalla.** No requiere aprobación: es alinear con lo ya decidido |
| **B** | La pantalla usa bien el sistema y **el sistema está mal** | **No reproducirlo.** Si el documento del sistema prescribe reparación local, aplicarla. Si no, registrar contra el sistema. **Nunca** se corrige con estilos sueltos en una pantalla |
| **C** | El sistema **no cubre** el caso, o lo cubre mal para esta tarea | **Parar y proponer.** Requiere decisión humana |

Si hay un sistema de diseño caracterizado en una base de conocimiento, cargala antes de clasificar y
prestá atención a los anti-patrones marcados como **defectos del artefacto**: esos son B por definición,
y confundirlos con A lleva a reparar en el lugar equivocado, pantalla por pantalla, para siempre.

**C es la única puerta al rediseño, y la propuesta se escribe, no se aplica.** Incluye qué patrón falta,
qué otras pantallas lo necesitarían y qué cuesta incorporarlo al sistema frente a resolverlo local. Un
patrón nuevo que solo sirve a una pantalla suele ser síntoma de que la tarea está mal modelada.

Si al terminar no hay ningún C, la respuesta correcta es que la pantalla no necesita rediseño, y se dice.

---

## 11. Entregable

`docs/revision-ux/<proyecto>-<fecha>.md`:

```
1. Alcance        qué se levantó y cómo, qué pantallas, anchos, temas, usuario
2. Tareas         las de §5.1, con el resultado de cada una: completada, completada con fricción, fallida
3. Bitácora       la fricción registrada en §5.3, en crudo
4. Resumen        tres a cinco líneas. Lo que hay que saber si no se sigue leyendo
5. Hallazgos      tabla: id · eje · A/B/C · severidad · criterio · evidencia · reparación
6. Plan           qué entra en esta corrida y qué no
7. Propuestas C   una por hallazgo, con alternativa y costo. Decisiones pendientes
8. Cobertura      qué no se pudo provocar y por qué
```

Si el informe tiene más prosa que tabla, está mal escrito.

---

## 12. Fases y paradas

**Fase 1 — Arranque.** Levantar y verificar. **Parar si no responde.**

**Fase 2 — Recorrido a ciegas.** Tareas, navegación, recorrido cognitivo, bitácora. Sin leer código.

**Fase 3 — Estados y medición.** Los cuatro estados, teclado, contraste, atributos, consola.

**Fase 4 — Clasificación.** Ahora sí, el código. Informe completo hasta el punto 8. **Parar y mostrarlo.**

**Fase 5 — Reparar.** Solo con el informe aprobado, y solo los A y los B con reparación prescripta.
Después de cada bloque, repetir las mediciones sobre lo tocado y adjuntar antes/después. **Máximo tres
iteraciones**: si al tercer intento un hallazgo sigue abierto, se documenta y se para. Los ciclos de
ajuste fino de espaciados no convergen y consumen la sesión.

Los C nunca se implementan en la misma corrida en que se descubren.

---

## 13. Restricciones duras

- **No cambiar comportamiento.** Nombres de campo, identificadores, rutas, contratos y manejadores quedan
  como están. Si un hallazgo exige tocarlos, es un C.
- **No agregar dependencias** de frontend.
- **No crear archivos CSS nuevos** si hay sistema de diseño vigente. Las pantallas componen lo que existe.
- **No introducir estética que el producto no tiene.** Si al terminar la pantalla no se parece a sus
  hermanas, la reparación falló aunque cada hallazgo esté resuelto.
- **No tocar pantallas fuera del alcance**, aunque tengan el mismo defecto. Se anota que lo tienen.
- **No operar sobre datos que no sean de prueba.**

---

## 14. Anti-patrones del revisor

| Anti-patrón | Cómo se detecta |
| --- | --- |
| **Leer el código antes de navegar** | El informe declara todo evidente y la bitácora de fricción está vacía |
| **Opinión sin medida** | Un hallazgo sin captura, valor ni línea |
| **Confirmar contraste mirando** | Un número de contraste que no salió de una medición |
| **Modernizar** | Aparecen gradientes, vidrio esmerilado, sombras o una paleta que nadie pidió |
| **Reparar el defecto del sistema en la pantalla** | Estilos sueltos que corrigen algo que está mal para todos |
| **Auditar el estado de carga** | El informe describe esqueletos y marcadores |
| **Un solo estado, un solo ancho, un solo tema** | Se revisó «con datos» a 1440 en claro y se declaró terminado |
| **Esquivar la propia dificultad** | Se pasó a coordenadas cuando el árbol de accesibilidad no alcanzó, y no quedó registrado |
| **Heurística de adorno** | Se cita a Nielsen sin nombrar qué tarea de esta pantalla se entorpece |
| **Rediseñar sin pasar por C** | Cambió la estructura sin propuesta aprobada |
| **Informe sin cobertura** | No dice qué quedó sin revisar. Siempre queda algo |

---

## 15. Si no hay sistema de diseño

El procedimiento vale igual, con un cambio: la categoría A desaparece —no hay contra qué conformarse— y
antes de tocar ninguna pantalla hay que responder una pregunta previa: *¿qué es lo mínimo que hay que
fijar para que dos pantallas hechas por dos personas distintas se parezcan?* Escala de espaciado, escala
tipográfica, tokens de color semánticos e inventario de los componentes que **ya existen** en el código.
Se escribe, se aprueba, y recién ahí empieza la fase 1.

Sin ese paso, cada pantalla converge a una estética distinta y la revisión número tres deshace la número
uno.