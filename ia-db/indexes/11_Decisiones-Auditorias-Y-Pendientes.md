# 11 · Decisiones, auditorías y lo que queda abierto

> **Propósito.** Qué se decidió, quién lo decidió, dónde está escrito, y qué sigue sin decidir.
> **Fuente primaria.** Los tres directorios `Adrs/`, `SDD/Docs/Audit/` (107 informes),
> `SDD/Docs/README.md` §8, `Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md`, `changelog.md`
> y el historial de git. Verificado el 2026-09-11 sobre `89f3ab3`.

---

## 1. Cómo se decide en este producto

**Cada decisión la toma el proyecto de código que puede sostenerla**, y las que alcanzan a más de
uno se toman **desde el productor**, citadas y no reabiertas por los consumidores. Por eso no hay
una capa de «decisiones de nivel producto» por encima: las tres candidatas naturales —estilo de
composición, versionado inter-proyecto y estrategia de comunicación— están resueltas en el
productor de cada contrato (`Vista-Producto.md` §5).

**Lo que sí es normativo de nivel producto son las tres reglas de arquitectura del intake §14**
(`RA-01`, `RA-02`, `RA-03`), que **no las decide ninguna ADR: las recibe**.

**Y lo que decide el Product Owner** es otra cosa: los puntos de control de etapa, las asunciones,
y las fusiones. Está en `Audit/A3-Decisiones-Del-Product-Owner.md` y en los informes `D1`, `D5`.

## 2. Las 53 ADR

| Bloque | Proyecto | Cuántas | Temas |
| --- | --- | --- | --- |
| `ADR-000xx` | `Api` | 8 | Host delgado · formato de intercambio · credencial firmada y guardia transversal · dos traducciones con tabla única · sin paginación con reingreso declarado · composición de raíz · arranque en dos fases · sin versionado de rutas |
| `ADR-020xx` | `Domain` | 6 | Modelo rico con invariantes · guardas y resultados tipados · estabilidad de la superficie · frontera de autenticación · **guarda única de admisibilidad** · el dominio no lee el reloj ni el conjunto |
| `ADR-040xx` | `Application` | 6 | Inversión de dependencias · **los cuatro puertos** · estabilidad · **orden fijo de las cuatro comprobaciones** · un caso de uso una unidad de trabajo · resultado tipado y catálogo cerrado |
| `ADR-060xx` | `Infrastructure` | 7 | Adaptadores por puerto · escritor único · comparación de correos y su índice · derivación de clave anclada · provisoria no adivinable · lectura tolerante y tabla de derivación · transformaciones al arrancar con linaje inmutable |
| `ADR-080xx` | `Contracts` (nivel producto) | 8 | Tipos planos · tipo de error único con conjunto cerrado · versionado por compilación compartida · regla de exposición de la frontera · listado separado del detalle · **el visor recibe piezas y no el texto** · el aviso de selección va en las opciones · el explorador no se publica solo |
| `ADR-100xx` | `Web` | 7 | Render en el servidor · sin estado propio · credencial de sesión en el circuito · tres capas de presentación · **estado degradado como superficie** · aislamiento del visor tras su fachada · dirección del servicio desde configuración |
| `ADR-120xx` | `Visor` | 6 | Tres capas con fachada plana · seis funciones planas · **visualizador puro sin red ni identidad** · motor de dibujo empaquetado · disposición determinista por índice · bundle generado y versionado |
| `ADR-140xx` | Producto (migración) | 5 | Archivado central de la migración · familias propias del intake · **dirección del backend por IP dinámica, actualizada a mano** (aceptada el 2026-08-18) · **ítem obligatorio sin objeto se declara «no aplica»** · familias acuñadas por el destino |

Las cinco que más se citan al discutir algo nuevo: `ADR-08002` (nadie inventa códigos),
`ADR-00004` (una sola tabla de traducción), `ADR-08006` (el visor recibe piezas), `ADR-12003`
(visualizador puro, medido sobre el bundle) y `ADR-14004` (**un ítem obligatorio sin objeto se
declara «no aplica» con su condición de reapertura**, en lugar de inventarle contenido).

**`ADR-14003` es la que el PR #186 pone en tensión**: `Dockerfile.web` la cita como «el
apartamiento» que la imagen retira —la dirección reescrita dentro del artefacto publicado—, pero
ninguna ADR nueva ni ninguna emisión de la 14003 registra ese cambio.

## 3. Las auditorías de fase

Cada fase de especificación la cerró un auditor **invocado desde cero, sin participación en la
generación**. Todas están aprobadas.

| Fase | Alcance | Dictamen |
| --- | --- | --- |
| A | `00-Contexto`, `01-Necesidades-Negocio` | Aprobado con observaciones (`A-00-01-r3`) |
| B | `02` y `03`, por proyecto | Siete informes; el de `Api` **rechazado en r1 con 17 hallazgos** y **aprobado el mismo día en r2** |
| B2 | Validación visual de maqueta | Rechazado en r1, **aprobado en r2** |
| C | `05-Arquitectura-Tecnica` | Aprobado (r2) |
| D | `06` y `07` | Aprobado |
| E | `08-Calidad-Y-Pruebas` | Aprobado (r2) |
| F | `09-Devops` | Aprobado |
| G | `10-Examples` | Aprobado (r2) |
| H | Consolidado final | `H-Final-Consolidado-r1` |
| I | Examples de `Domain` | `I-1-…` e `I-2-…` |

**Siete migraciones normativas del framework**: 6.0 → 8.6, 8.6 → 8.11, 8.11 → 9.9, 9.9 → 9.10,
9.10 → 9.12, 9.12 → 10.0 y **10.0 → 13.3**, cada una con su plan y su informe.

## 4. Las mesas de evaluación

Una **mesa** se convoca **por condición y no por calendario**: hay corpus previo, el estado está
leído, y hay una decisión de alcance por tomar. Un caso que cumple la condición y no tiene
orquestador que la convoque **se convoca igual**.

| Mesa | Qué la fundó | Qué dejó |
| --- | --- | --- |
| `Mesa-2026-08-27` | Pendientes vencidos | Detectó tres filas vencidas por un evento que no podía cerrarlas — y **les dio un evento posterior en lugar de advertir que la medición existía desde hacía catorce días**. Es el hallazgo `HM-02`, reporte 17 al framework |
| `Mesa-2026-08-29` | Nomenclatura | El tramo `R-4`: renumerado de `QG` y `CV` al mapa de bloques |
| `Mesa-2026-08-31` / `-B` | Estado del corpus | `M-01` a `M-05`: tres puntos «abiertos» que ya estaban cerrados, y el **plan de mejora integral** con hallazgos `MI-NN` |
| `Mesa-2026-09-01-C` | «El botón que no hacía nada», **reportado tres veces y declarado cerrado dos** | `H-1` **cierto y grave**: las claves de protección de datos eran efímeras. `H-2` —que eso explique el botón muerto— **plausible, no probado**. Y un refutador de las tres afirmaciones falsas que se hicieron ese día |
| `Mesa-2026-09-02` | «El socket» | `V-1` el socket **no se puede arreglar desde el producto** · `V-2` **no es la causa** de que el desenlace no se aplique · `V-3` **sí es la causa de la ventana muerta**. Y `A-1` **se ejecutó y no dio resultado, y queda escrito así** |

Las dos mesas de UX/UI (2026-09-02 y 2026-09-03) están en `changelog.md` y en
`evidencia/2026-09-02-mesa-ux/`, no en `Audit/`.

**Lo que las mesas dejaron como método**, y vale más que sus veredictos: **contar sobre el
instrumento**, **abrir la fuente antes de citarla**, y **cuando dos mediciones del mismo hecho no
coinciden, no se elige la que conviene** —en este repositorio suele estar mal la más elaborada—.

## 5. Lo que queda abierto

### 5.1 De nivel producto

| Punto | Estado | Evento de cierre |
| --- | --- | --- |
| **El caudal de 20 peticiones por minuto** | **Provisorio, y su fundamento ya no existe.** Se derivaba de «una comisión operando durante una clase»; al cerrarse `D5` por **incognoscible** el 2026-08-20, ese fundamento se cayó | `PT-05`, en la fase `i` |
| **`PT-05` · el acceso desde la red de la facultad** | **SIN MEDIR.** El formulario existe en blanco a propósito: declara que la pregunta está hecha y sin responder | La fase `i`, midiendo. **El criterio `I-4` no exige que dé bien: exige que se documente sea cual sea** |
| **Cuatro asuntos aparcados en la fase `i` que no la necesitan** | Son **decisiones del Product Owner que se pueden tomar hoy**. Están ahí porque el último punto de control es el destino por defecto de todo lo que no tiene evento propio | El Product Owner, cuando quiera |
| La imagen construida en destino y el dominio propio | Se miden solas al desplegar | Fase `i` |
| **Dos vías de publicación del front coexisten** — FTP al hosting (`deploy-front-ftp.yml`) e imagen de contenedor (`Dockerfile.web`) — y ninguna fuente dice cuál es la del despliegue ni si la otra se retira | Nuevo desde el 2026-09-06; ver O-9 | El Product Owner |

**De diez asuntos atados a la fase `i`, seis la necesitan y cuatro no**
(`Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md`).

### 5.2 De la construcción

| Punto | Dónde |
| --- | --- |
| La acción primaria del envío queda fuera de la primera pantalla (ordenada 1061 a 1440×900). **Cerrarlo pide una decisión, no un ajuste fino** | `changelog.md`, entrada del 2026-09-03 |
| En «Entrega de la comisión», un alumno filtrado sin entregas muestra el vacío de colección y no el de filtro | Ídem; fuera del alcance aprobado y sin tocar |
| `H-2` de la mesa del 2026-09-01-C: que las claves efímeras expliquen el botón muerto | **Plausible, no probado.** La causa se reparó; la explicación no se demostró |
| La ventana muerta del circuito | El anfitrión **no ofrece WebSocket** y no se puede arreglar desde el producto (`V-1`/`V-3` de la mesa del 2026-09-02). **Un contenedor propio del front sí podría ofrecerlo**, y es un efecto del PR #186 que nadie midió todavía |
| La imagen del front arranca sana sin `ApiBaseUrl` configurada | Declarado en `Dockerfile.web`; la guarda vive en `Container.Lab-Geometria`, fuera de este repositorio |

### 5.3 Documentación

| Punto | Estado |
| --- | --- |
| Categoría `11-Documentacion` | **Planificada.** Hay plan documental y no contenido: por eso `AGENTS.md` cita tres guías que todavía no existen |
| `PRODUCT-INTAKE` §16 describe `deploy/compose.yaml` como despliegue en destino | **Elevado.** Corregirlo es escritura controlada sobre documento humano |
| `CHANGELOG.md` en `SDD/Docs/` no se emite | **Apartamiento declarado**: el repositorio ya lleva `changelog.md` en la raíz, y un segundo archivo sería una segunda fuente de verdad |
| **El PR #186 (`Dockerfile.web`) no tiene entrada en `changelog.md`** ni documento en `Web/09-Devops/` | **Sin registrar.** `changelog.md` se actualiza «en la rama de la etapa y no después de la fusión», y esa rama se fusionó sin tocarlo. El historial de git es la única fuente |

## 6. Lo que este producto aprendió sobre sus propios pendientes

De los ocho puntos que `Docs/README.md` §8 llegó a listar, **seis se cerraron sin que nadie tocara
esa tabla**, y en tres casos el desenlace ya vivía en el árbol mientras la fila los declaraba
abiertos. **Ninguno se perdió por estar mal argumentado**: se perdieron porque **un resumen
derivado no tiene forma de saber que su fuente cambió**.

Tres veces en un mismo día se midió el mismo patrón: `D1` se confirmó y no volvió al §22 que
planteaba la pregunta; `PT-01.a` se midió y no volvió a los nueve documentos que la declaraban
abierta; `PA-01` se cerró y su desenlace no bajó a los diez lugares que seguían pidiendo la versión
de una biblioteca que el producto había decidido no tener. **Desde afuera, una decisión bien tomada
y una bien tomada *y propagada* se ven idénticas.** Está elevado al framework como el **reporte
21**, y `scripts/verify-propagacion.sh` es la compuerta que existe para atraparlo.

**Un punto abierto que no bloquea no es un punto barato: es uno que nadie vuelve a mirar.** La
discrepancia del grafo de dependencias estuvo abierta veintiún días, elevada al Product Owner, y
**no era suya**: era una pregunta con respuesta en los `.csproj`.

**Y el PR #186 es la versión más reciente del mismo patrón, en la otra dirección**: una decisión
de construcción bien tomada y bien explicada en su propio archivo, que no bajó al registro de
cambios ni al corpus que la debería declarar.
