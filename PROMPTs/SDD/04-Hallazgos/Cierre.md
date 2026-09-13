# Prompt — Cierre de la cadena de especificación y traspaso a codificación

## 1. Rol y objetivo

Sos el orquestador SDD de una corrida real sobre el destino `Repos-RPIs/RPI.VidelControl`.
La cadena de especificación está completa hasta la Fase H y **un audit final consolidado
devolvió `APROBADO CON OBSERVACIONES` con 26 hallazgos**, de los cuales cuatro ya se
corrigieron. Tu objetivo es cerrar los 22 restantes y llegar al check-out del §12 con un
resumen ejecutivo que sea **verdadero**, no completo-en-apariencia.

El criterio de éxito no es «no quedan hallazgos». Es: **cada afirmación del resumen
ejecutivo del handoff se puede reproducir corriendo un guion o abriendo un archivo.**

## 2. Reglas inviolables

1. **No inventar información.**
2. **Toda afirmación deberá estar respaldada por evidencias verificables.** Una evidencia es
   verificable cuando otro puede llegar a ella: ruta de archivo con línea, o comando que
   cualquiera puede correr y su salida.
3. **No introducir modificaciones en `IA/IA.SDD`** (el framework). Los reportes documentan;
   no reparan.
4. **Nunca escribir en carpetas `PROMPTs/` o `PROMPTS/`** de ningún repositorio.
5. **`Parana.Net` tiene credenciales**: nunca commitear esa carpeta, nunca `git add -A`.
6. Registro rioplatense declarativo, tildes correctas, sin emojis ni negritas decorativas.

## 3. Base de evidencia — verificada antes de escribir este prompt

Todo lo de esta tabla se comprobó con un comando. Reproducilo antes de usarlo si dudás.

| Hecho | Cómo se comprobó |
|---|---|
| La compuerta corre 9 comprobaciones y devuelve verde | `python3 SDD/Herramientas/Verificacion/compuerta.py` |
| El README raíz dice «verifica **siete** cosas mecánicas» | `Docs/README.md:111` |
| `recuentos.py` ancla **374** sondas y hay **376** | `Herramientas/Verificacion/recuentos.py:102` contra `.../VideoControl-Web/08-Calidad-Y-Pruebas/Matriz-Sensado-Deriva.md:21` |
| Hay **388** sondas en total, no 376 | 376 en Web + 3 en cada uno de los otros cuatro, contando filas `SD-` |
| Los **30** ADR están en `Propuesto` | `grep -h '^\*\*Estado:\*\*' Docs/Proyectos/*/05-*/Adrs/*.md \| sort \| uniq -c` |
| El manifiesto está en `Versión 1.1`, `2026-08-10`, `En revisión` | `Intake/PRODUCT-MANIFEST-*.md:16-18` |
| Hay **199** archivos modificados o sin rastrear en git | `git status --short \| wc -l` |
| El total declarado en el README no coincide con la suma de sus celdas | `Docs/README.md:56` contra sus tablas de `:62-81` |
| Los informes de audit de las fases **D a H no existen** | `ls Docs/Audit/` devuelve 7 archivos, el último de la Fase C |

**Recuentos del producto, verificados mecánicamente** por `Herramientas/Verificacion/trazabilidad.py`:
58 CU · 33 RN · 30 ADR · 55 US · 78 BT · 127 TC · 14 VER · 0 huérfanos.

## 4. El ciclo obligatorio, subtarea por subtarea

Para **cada** subtarea, en este orden y sin saltear pasos:

1. **Estimar la especialidad** que la subtarea necesita, y **justificarla en una oración**
   contra el contenido de la subtarea. Después mapearla al tipo de subagente disponible.
   *Sé honesto acerca del registro real:* los tipos disponibles son `general-purpose`,
   `Explore` y `claude`. La «especialidad» es el rol que definís en el prompt, no un tipo
   distinto de agente. No pretendas una taxonomía que no existe.
2. **Delegar**, con un prompt que incluya: las reglas de §2 completas, la evidencia de
   partida con sus rutas, los criterios de aceptación, y la exigencia explícita de un
   **resumen de trabajo** con la forma de §5.
3. **Restricción dura para todo subagente: no edita ningún `.md` del árbol.** El motivo es
   concreto y verificable: la mayor parte de `SDD/Docs/` la emiten los siete generadores de
   `SDD/Herramientas/`, de modo que una edición directa se pierde en la siguiente corrida de
   `compuerta.py`. El subagente entrega **especificaciones de corrección**; el orquestador
   las aplica sobre el generador que corresponda.
4. **Evaluar lo entregado** contra los criterios de aceptación, uno por uno, antes de aplicar
   nada. Si una afirmación del subagente no trae evidencia verificable, **no se aplica**: se
   le pide la evidencia o se descarta y se dice que se descartó.
5. **Aplicar** las correcciones que sobrevivieron, sobre el generador y no sobre el documento.
6. **Comprobar**: `python3 SDD/Herramientas/Verificacion/compuerta.py` en verde, y la
   comprobación específica que la subtarea declaró.
7. **Recién entonces** pasar a la subtarea siguiente. Nunca dos subagentes a la vez sobre el
   mismo archivo.

**Si una subtarea revela una clase de defecto que un guion podría detectar, se agrega la
comprobación a la compuerta antes de cerrarla.** Es la lección medida de esta corrida: de
los 26 hallazgos del audit final, 21 eran mecanizables y ninguna de las comprobaciones
existentes los cubría.

## 5. Forma obligatoria del resumen que cada subagente entrega

```
VEREDICTO: <cumplió | cumplió parcialmente | no cumplió>
QUÉ HICE: <tres a seis líneas>
HALLAZGOS: por cada uno — qué, archivo:línea, evidencia que lo contradice, corrección propuesta
LO QUE NO PUDE VERIFICAR: <explícito, o «nada»>
COMPROBACIÓN: el comando exacto que el orquestador puede correr para confirmar cada hallazgo
```

Un resumen sin la última línea se rechaza y se pide de nuevo.

## 6. Las subtareas, en orden

| # | Subtarea | Hallazgos que cierra | Criterio de aceptación |
|---|---|---|---|
| S1 | Recuentos derivados y anclas del verificador | H-04, H-14, H-15, H-23, H-25 | Ningún recuento escrito difiere del contado; `recuentos.py` cubre las diez categorías |
| S2 | Los artefactos de la Fase H contra su regla | H-01, H-06, H-07, H-11, H-18 | Las ocho secciones de la vista y las diez del README cumplen; el gating D8 del índice 11 de Web es el que la regla fija |
| S3 | Plan documental: alcance, dueños y omisiones | H-19, H-20, H-21, H-22 | Ningún artefacto planificado sin dueño; ninguna omisión por gating sin registrar |
| S4 | El glosario del README contra el canónico y la 02 | H-16 | Ningún término del README acuñado *ex novo* ni en contradicción con la 02 |
| S5 | Los pendientes reales del handoff | H-02 | El bloque de pendientes enumera todos los hallazgos abiertos de los 7 informes, con su path |
| S6 | Registro de la historia de audits de las fases D a H | hueco propio | Existe un registro con qué rondas corrieron, veredicto y evidencia, y declara que los informes no se persistieron |
| S7 | Decisiones que exigen al Product Owner | H-05, H-08, H-10, H-12, H-17, H-24 | **No se delega ni se decide**: se compila y se pregunta |
| S8 | Check-out §12 y detención | — | Los diez bloques del resumen ejecutivo, todos derivados |

## 7. Qué NO hacer

- No promover ningún ADR, no confirmar el manifiesto, no commitear, no restituir
  `Legacy-Service/` y no tocar el intake: son de S7 y las decide el Product Owner.
- No escribir código bajo ninguna circunstancia sin la confirmación literal del §12.
- No reconstruir de memoria los informes de audit que no se persistieron: sería fabricar
  registros. S6 declara el hueco, no lo rellena.
- No declarar una subtarea cerrada sin la comprobación de §4.6.

## 8. Salida esperada al terminar

Para cada subtarea: la especialidad estimada con su justificación, el veredicto del
subagente, qué se aceptó y qué se descartó **con el motivo**, qué se aplicó y sobre qué
generador, y la comprobación que lo confirma. Al final, el resumen ejecutivo del §12 y la
detención a la espera de confirmación explícita.
