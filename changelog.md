# Registro de cambios — Lab-Geometria.Documentacion

**Qué registra este documento.** Los cambios del repositorio de documentación de **Fábrica de
Geometría**: la base de conocimiento `ia-db/`, los análisis y las guías. **No registra el avance de
construcción del producto**, que vive en `Lab-Geometria/changelog.md` y es su única fuente.

**Cuando este documento y el historial del repositorio no coinciden, gana el historial** y la
diferencia se repara acá, nunca al revés.

---

## 2026-08-31 — Base de conocimiento `ia-db/` del proyecto `Lab-Geometria`

**Generada por** `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Iniciar-Indexado.md`,
invocada desde `PROMPTs/Indexado/Crear-Indexado.md`, bajo el Profile `Knowledge-Indexing`.
**Alcance:** `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión `da9b07c`.

### Agregado

- `ia-db/README.md` — punto de entrada único: instrucción para IA, tabla de navegación
  «Necesitás saber… → Leé este índice», resumen ejecutivo de una pantalla, árbol comentado del
  repositorio indexado, restricciones para el agente que consuma la base y **manifiesto de
  generación** con el que se la puede regenerar o actualizar sin información externa.
- `ia-db/indexes/00_MASTER-INDEX.md` — visión general: identidad del producto, los dos ejes
  —entrega y construcción—, stack por proyecto, estado de las nueve etapas y de las categorías
  documentales, las cuatro puertas de calidad y las convenciones que gobiernan todo cambio.
- Doce índices temáticos, uno por dominio y sin contenido duplicado entre ellos: corpus documental
  `SDD/`, arquitectura y proyectos de código, dominio y reglas de negocio, superficie HTTP y
  contratos, front Blazor y visor 3D, persistencia y seguridad, pruebas y puertas de calidad,
  construcción y despliegue, samples ejecutables, glosario y nomenclatura, decisiones y auditorías,
  y observaciones del indexado.

### Decisiones

- **Modo proyecto y no federado.** El prompt nombra un solo proyecto y un destino explícito, de modo
  que la base lleva `00_MASTER-INDEX.md` y no `00_WORKSPACE-INDEX.md`. Que el destino viva en otro
  repositorio no la vuelve federada: el alcance sigue siendo un proyecto.
- **Sin subagentes.** El Profile los pide para indexar varios proyectos en paralelo. Con uno solo la
  tarea es secuencial y el traspaso de contexto habria costado mas de lo que ahorraba.
- **Trece índices en lugar de menos y mas extensos**, con un dominio por índice y el presupuesto de
  300 a 500 lineas del Profile. El mas largo quedo en 174 lineas.
- **Un índice de observaciones que el Profile no exige.** `12_Observaciones-Del-Indexado.md` deja
  por escrito con que comando se verifico cada afirmacion y que divergencias documento contra arbol
  quedaron a la vista. Sin el, la base afirmaria cosas medidas y cosas heredadas sin distinguirlas,
  que es lo que `Rule-Evidences` prohibe.
- **No se corrieron las puertas.** No se ejecutaron `build.sh`, `test.sh` ni `coverage.sh`: el
  indexado no modifica ni ejecuta el proyecto indexado. Los estados de puerta que la base cita son
  los que el corpus declara, con su fecha, y ningun índice afirma que hoy pasen.

### Observaciones registradas, y ninguna corregida

El indexado no modifica el proyecto indexado, y tres de las cinco tocan documentos derivados o del
Product Owner. Quedan declaradas en `ia-db/indexes/12_Observaciones-Del-Indexado.md`:

| Id | Divergencia |
| --- | --- |
| `OBS-01` | `samples/README.md` declara las diecinueve carpetas en esqueleto; dieciseis dicen «Implementado» |
| `OBS-02` | La tabla por intencion de `AGENTS.md` dirige a tres documentos que no existen: estan en `Planificado` |
| `OBS-03` | Los README de `samples/` enlazan a `SDD/Docs/Proyectos/`, carpeta que ya no existe |
| `OBS-04` | El comentario de `ErrorCode.cs` explica una ausencia con una etapa que ya cerro |
| `OBS-05` | El puerto no es el mismo en desarrollo —5080— que en la imagen construida —8080— |

### Cómo mantenerla

Con `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Actualizar-Indexado.md`, que lee el
manifiesto, detecta lo cambiado desde su fecha y **actualiza sólo los índices afectados**. No se
reconstruye la base cuando alcanza una actualización parcial.
