# Lab-Geometria.Documentacion

Repositorio complementario de **Fábrica de Geometría**. El producto se versiona en [`Lab-Geometria`](https://github.com/hdcm-dev/Lab-Geometria); acá se lleva **cómo se lo especificó y cómo se lo sigue conduciendo**: los análisis fundacionales, los prompts con que se ejecutó el Framework SDD sobre el producto, los pedidos de capacidades y ajustes posteriores con su registro, y la base de conocimiento indexada `ia-db/`, que es la puerta de entrada de un agente al repositorio principal.

Este archivo es la superficie de entrada para un agente que llega sin contexto. Si venís a hacer algo concreto, andá directo a la [matriz de ruteo](#matriz-de-ruteo-por-intención).

---

## Los dos repositorios

El autor sigue un patrón fijo en todos sus proyectos: un **repositorio principal** que versiona el producto y un **repositorio complementario**, terminado en `.Documentacion`, que lleva el prompteo, la documentación de análisis y el indexado de ese producto.

| | `Lab-Geometria` (principal) | `Lab-Geometria.Documentacion` (este) |
| --- | --- | --- |
| **Qué es** | El producto: código, especificación SDD, samples, pruebas y despliegue | El origen del producto y su índice para agentes |
| **Qué se versiona** | `src/`, `visor/`, `tests/`, `samples/`, `scripts/`, `tools/`, `deploy/`, `ai-layer/`, `docs-as-code/`, `.github/` y el corpus `SDD/` (`Intake/`, `Docs/`, `Expedientes/`, `Maquetas/`), con su `changelog.md` por etapa | `Analisis/`, `PROMPTs/` e `ia-db/`, con su `changelog.md` |
| **Quién escribe** | Los agentes, cuando un prompt de acá lo ordena, bajo `AGENTS.md` | El dueño escribe `PROMPTs/` y `Analisis/`; los agentes, las `OUTPUTs/` de la unidad que ejecutan y la `ia-db/` cuando se la regenera |
| **Fuente de verdad** | El estado del producto: `SDD/Docs/README.md` y `changelog.md` más el historial de git | Ninguna sobre el producto. La `ia-db/` es un índice fechado: si contradice al repositorio principal, manda la fuente |

### Qué es Fábrica de Geometría

Un laboratorio de la cátedra de Programación 2, público de consulta. El alumno pega el JSON que emite su propio programa; el sistema lo interpreta, reconstruye las figuras, señala dónde no coincide lo declarado con lo derivado y las dibuja en 3D, y el docente revisa y resuelve (`Lab-Geometria/AGENTS.md`). Tiene dos unidades de entrega, `GeometriaFactory-Api` y `GeometriaFactory-Web`, sobre siete proyectos de código: seis .NET 10 con EF Core sobre SQLite y un visor TypeScript con three.js.

El producto aplica el **Framework SDD** ([`IA.SDD`](https://github.com/hdcm-dev/IA.SDD)), que vive en su propio repositorio y no se copia en ninguno de estos dos. La versión del framework con que está especificado la declara el manifiesto del producto, `Lab-Geometria/SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` §1.1.

### Los tres repositorios del modelo SDD

Este par es un caso del modelo de tres repositorios del framework (`IA.SDD/SDD/Guides/SDD-Getting-Started-Guide.md` §2):

| Rol en el modelo | Repositorio | Quién escribe |
| --- | --- | --- |
| Framework SDD, fuente de solo lectura | `IA.SDD` | Nadie, durante una corrida sobre el producto |
| Repositorio destino | `Lab-Geometria` | Los orquestadores y los agentes |
| Repositorio de documentación | `Lab-Geometria.Documentacion` | El dueño escribe `PROMPTs/` y `Analisis/`; los agentes, solo las `OUTPUTs/` y la `ia-db/`. El orquestador SDD no lo toca |

### El circuito entre los dos

```text
Lab-Geometria.Documentacion                            Lab-Geometria
───────────────────────────                            ─────────────
Analisis/                    contexto existente e idea
      │
      ▼
PROMPTs/SDD/02  INPUTs/      requerimientos RF y RT  ──►  SDD/Intake/ (intake y manifiesto)
PROMPTs/SDD/03               bootstrap del framework ──►  SDD/Docs/ fases A a H, auditorías, handoff
PROMPTs/SDD/05               reanudación             ──►  SDD/Docs/Audit/Estado-Del-Destino-*.md

PROMPTs/DEVs/Features/NN     capacidad nueva         ──►  rama, pull request y changelog.md
PROMPTs/DEVs/Fixs/NN         ajuste o corrección     ──►  rama, pull request y changelog.md
      └── OUTPUTs/           mesa, actas, plan, evidencia

ia-db/  ◄── PROMPTs/Indexado  índice del repositorio principal sobre una revisión fija de su main
```

El intake del producto declara este origen: sus tres fuentes, requerimientos funcionales, requerimientos técnicos y análisis, son «todas del repositorio de documentación `Lab-Geometria.Documentacion`» (`Lab-Geometria/SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md`, tabla de fuentes).

---

## Anatomía del repositorio

| Ruta | Qué contiene |
| --- | --- |
| [`ia-db/`](ia-db/README.md) | **La base de conocimiento indexada de `Lab-Geometria`.** Un `README.md` que es la entrada única, con la tabla «necesitás saber… → índice», las restricciones de trabajo y el manifiesto; debajo, `indexes/NN_Tema.md`. El manifiesto declara la versión de la base y la revisión de `main` que indexa |
| [`Analisis/`](Analisis/) | Los dos documentos fundacionales del 2026-08-08: `01-Analisis-Contexto-Existente`, el relevamiento integrado de la actividad 1 y del visor JSON 3D con el contrato JSON y sus hallazgos, y `02-Definicion-Ideas`, el plan del servicio que escribió el dueño: stack, despliegue, autenticación, funciones y etapas |
| [`PROMPTs/SDD/`](PROMPTs/SDD/) | La secuencia con que se ejecutó el framework sobre el producto: `01` crear el análisis, `02` integrar el intake con sus `INPUTs/` de requerimientos, `03` ejecutar el orquestador, `04` hallazgos y cierre (`03-Hallazgos.md` es la instrucción; `Cierre.md`, un modelo de cierre tomado de otra corrida), `05` reanudar el orquestador. `06-Catalogado` está reservado: su `README.md` está vacío |
| `PROMPTs/DEVs/Features/` | Pedidos de capacidad nueva sobre el producto. `01` diseñó las pruebas de extremo a extremo con Playwright |
| `PROMPTs/DEVs/Fixs/` | Pedidos de ajuste, con su registro en `OUTPUTs/`. `01-Ajuste-UX` es la primera mesa de UX/UI: marco, contrato, informes de comisión, actas, plan de mejoras y evidencia de antes y después, que entró como PR #183. `02-Ajuste-UX-2.0` es la segunda revisión agéntica, que entró como PR #185 |
| [`PROMPTs/Indexado/`](PROMPTs/Indexado/) | Los dos disparadores de la `ia-db/`: `Crear-Indexado.md` la regenera completa y `Actualizar-Indexado.md` la pone al día desde la revisión indexada. Los dos delegan en los tool-prompts de indexado de [`IA.Prompts`](https://github.com/hdcm-dev/IA.Prompts) (`Tool-Prompts/Indexado-Documentado/`), bajo el Profile `Knowledge-Indexing`: hace falta tenerlo clonado en el workspace |
| `PROMPTs/Analisis/`, `PROMPTs/Guides/` | Reservadas, con su `.gitkeep`, sin contenido todavía. `Guides/` en la raíz existe solo en el árbol local, sin versionar |
| [`changelog.md`](changelog.md) | El registro de este repositorio, por cambio relevante y con fecha. No todas las fusiones tienen entrada: si no coincide con el historial de git, gana el historial |

---

## La `ia-db/`

Es lo primero que un agente lee para trabajar sobre `Lab-Geometria` sin recorrerlo entero: el repositorio principal tiene cerca de dos mil archivos versionados, la mayoría bajo `SDD/`.

1. Leer [`ia-db/README.md`](ia-db/README.md) completo.
2. Abrir solo los uno o dos índices que su tabla de navegación indique.
3. Ir a las fuentes que el índice cita, con rutas relativas a la raíz de `Lab-Geometria`, para el detalle.
4. Antes de tocar el repositorio principal, leer su `AGENTS.md`.
5. Tratar la base como fechada. Antes de apoyarse en ella, comparar la revisión del manifiesto con el `main` vigente: lo que cambió después no está indexado, y en caso de diferencia manda la fuente.

**Regenerar o actualizar.** Una regeneración completa con `PROMPTs/Indexado/Crear-Indexado.md` reemplaza la base y sube la versión mayor. Una actualización con `PROMPTs/Indexado/Actualizar-Indexado.md` parte del `git diff` entre la revisión indexada y `main`, toca solo los índices que la tabla «ruta cambiada → índices a revisar» del manifiesto indique, y suma `0.1`. La base no se edita a mano por partes sueltas, y las divergencias que encuentra se registran en su índice de observaciones y no se resuelven desde ella.

---

## Matriz de ruteo por intención

| Vengo a… | Leé |
| --- | --- |
| Entender el producto o trabajar sobre su código | [`ia-db/README.md`](ia-db/README.md), y después `Lab-Geometria/AGENTS.md` |
| Saber en qué estado está el producto | `Lab-Geometria/SDD/Docs/README.md` y `Lab-Geometria/changelog.md`, no este repositorio |
| Entender de dónde salieron los requerimientos | [`Analisis/`](Analisis/) y los `INPUTs/` de [`PROMPTs/SDD/02-Ejecutar-Prompt-Integrador-Documento-Intake/`](PROMPTs/SDD/02-Ejecutar-Prompt-Integrador-Documento-Intake/) |
| Rehacer o continuar la especificación SDD | La secuencia de [`PROMPTs/SDD/`](PROMPTs/SDD/): `03` arranca el orquestador del framework y `05` lo reanuda sobre `Lab-Geometria` |
| Ver cómo se razonó un ajuste ya aplicado | Las `OUTPUTs/` de su unidad en `PROMPTs/DEVs/Fixs/`. En `01-Ajuste-UX`, su `OUTPUTs/README.md` es el índice de entrada |
| Pedir una capacidad o un ajuste nuevo | Una unidad nueva en `PROMPTs/DEVs/Features/` o `PROMPTs/DEVs/Fixs/`. La escribe el dueño |
| Poner al día la `ia-db/` | [`PROMPTs/Indexado/Actualizar-Indexado.md`](PROMPTs/Indexado/Actualizar-Indexado.md) |
| Saber qué cambió en este repositorio | [`changelog.md`](changelog.md) y `git log` |

---

## Convenciones

- **`PROMPTs/` es del dueño: se lee, no se escribe.** Un agente que ejecuta una unidad escribe solo en sus `OUTPUTs/`. El `.md` del prompt y los `INPUTs/` no se tocan.
- **Una carpeta por unidad de trabajo**, con prefijo de dos dígitos: `NN-Verbo-Objeto/`, con el tool-prompt adentro, `INPUTs/` para los insumos y `OUTPUTs/` para lo que produjo la corrida.
- **Forma habitual del tool-prompt** (los más viejos no la siguen del todo): `# Tool-Prompt — …`, la línea `> **Invocación**: Leer y ejecutar <ruta>`, el `**Overview**` y las secciones de contexto, objetivos, solicitudes y reglas. Las reglas que se repiten: no inventar información y toda afirmación respaldada por evidencia verificable.
- **Rutas desde la raíz del workspace**: los prompts escriben `/PROG2/Geometria/Lab-Geometria`, `/IA/SDD/IA.SDD`, y así con los demás.
- **Evidencia de antes y después, al mismo encuadre**, en los anchos que la unidad declare.
- **Repositorios públicos**: los dos lo son, y todo lo que entra se publica. Los repositorios privados, sus clientes, la infraestructura donde corren y las credenciales no deben escribirse acá; antes de un push, barrer lo nuevo con ese criterio.

---

## Estado del árbol

- **Mudanza sin commitear.** Los prompts de `PROMPTs/Features/` y `PROMPTs/Fixs/` se movieron a `PROMPTs/DEVs/Features/` y `PROMPTs/DEVs/Fixs/`, sin cambios de contenido. Este README describe el árbol nuevo. Siguen con la ruta anterior las líneas de invocación de esos prompts, el índice `16` de la `ia-db/` y las citas de `Lab-Geometria` en `changelog.md`, `src/GeometriaFactory.Web/wwwroot/css/app.css` y `SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css`.

---

## Entrega

### Delegación del merge al agente

Rige
[`Knowledge-Conformacion-Pull-Request-Automatico`](/IA/IA.Knowledge.Base/Knowledges/Knowledge-Conformacion-Pull-Request-Automatico.md)
2.0, §3.1.

| | |
| --- | --- |
| **Decidió** | Fernando Filipuzzi, responsable del laboratorio (PO) |
| **Fecha** | 2026-10-26 10:04 -0300 |
| **Canal** | `PROMPTs/Indexado/Crear-Indexado.md`, invocado en una conversación con el agente en Claude Code (VS Code) |
| **Literal** | «Al finalizar actualizar, changelog, stage, commits y push siguiendo este conocimiento `/IA/IA.Knowledge.Base/Knowledges/Knowledge-Conformacion-Pull-Request-Automatico.md`» |
| **SHA-256 del literal** | `16056bfac6b92f209c643df5fb6e925c4eec78f9c43ffe44c4fadba38957658b` |
| **Qué delega** | El agente que conduce la unidad abre el pull request, publica el informe con el enlace, lo fusiona si la guarda G1–G4 pasa y no hay reserva, borra la rama remota y deja `main` local al día |
| **Techo de espera de la guarda** | 20 minutos |
| **Intervalo de relectura** | 20 segundos |
| **Excepción** | Si el PO plantea un cuestionamiento particular sobre una unidad, o aparece alguna reserva de §3.4 (decisión que no le toca al agente, efecto no medido, cambio irreversible no verificado, guarda que no pasa, falla que ya estaba en `main`), el agente no fusiona: entrega el enlace y el merge vuelve al PO |
| **Revocación** | Por unidad, con sólo decirlo, sin derogar esta delegación |

El techo y el intervalo los propuso el agente, porque el PO delegó sin fijar valores; son los mismos
de `Lab-E2E.WebBlazor.Documentacion`. El PO puede cambiarlos editando esta tabla.

### Control `Verificar`

[`.github/workflows/verificar.yml`](.github/workflows/verificar.yml) corre en cada pull request y en
cada push a `main` el guion [`.github/scripts/verificar.py`](.github/scripts/verificar.py): enlaces
internos que resuelven (fuera de `PROMPTs/`) y forma de la `ia-db` según el Profile
`Knowledge-Indexing` —entrada única con manifiesto y versión, índices `NN_` con título numerado y
cabecera—. Es la corrida de controles que la guarda G3 lee.
