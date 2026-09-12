# ia-db — Fábrica de Geometría (`Lab-Geometria`)

> **Instrucción para IA.** Este archivo es el **punto de entrada único** a la base de conocimiento
> del proyecto `Lab-Geometria`. Leelo primero y completo; después cargá **sólo** los uno o dos
> índices que la tabla de navegación indique para tu tarea. No recorras el repositorio entero ni
> cargues el corpus `SDD/` completo: son **1.147 archivos**, 542 de ellos vivos, y todo lo que
> necesitás para ubicarte está destilado acá. Cada afirmación de estos índices referencia su
> fuente: cuando necesites el detalle, abrí la fuente que el índice nombra, no el árbol.

---

## 1. Tabla de navegación

| Necesitás saber… | Leé este índice |
| --- | --- |
| Qué es el producto, con qué stack, en qué estado está y cuánto mide | [`indexes/00_MASTER-INDEX.md`](indexes/00_MASTER-INDEX.md) |
| Dónde vive cada documento del corpus `SDD/` y qué autoridad tiene cada uno | [`indexes/01_Corpus-Documental-SDD.md`](indexes/01_Corpus-Documental-SDD.md) |
| Cómo está partido el código: los siete proyectos, sus capas, su grafo y su orden de construcción | [`indexes/02_Arquitectura-Y-Proyectos.md`](indexes/02_Arquitectura-Y-Proyectos.md) |
| Entidades, conjuntos cerrados, invariantes, reglas de negocio y cómo se derivan los valores | [`indexes/03_Dominio-Y-Reglas-De-Negocio.md`](indexes/03_Dominio-Y-Reglas-De-Negocio.md) |
| Las rutas HTTP, los tipos que viajan, los códigos de error y su traducción | [`indexes/04_Superficie-HTTP-Y-Contratos.md`](indexes/04_Superficie-HTTP-Y-Contratos.md) |
| Las pantallas, sus guardianes de sesión, el sistema visual y la fachada del visor 3D | [`indexes/05_Front-Web-Y-Visor-3D.md`](indexes/05_Front-Web-Y-Visor-3D.md) |
| Cómo se persiste, cómo se migra el esquema, cómo se respalda y cómo se firma el acceso | [`indexes/06_Persistencia-Y-Seguridad.md`](indexes/06_Persistencia-Y-Seguridad.md) |
| Las cuatro baterías, las puertas de calidad, sus umbrales y cómo se corre cada instrumento | [`indexes/07_Pruebas-Y-Puertas-De-Calidad.md`](indexes/07_Pruebas-Y-Puertas-De-Calidad.md) |
| Cómo se construye, se corre y se publica; los guiones, **las dos imágenes** y los flujos | [`indexes/08_DevOps-Construccion-Y-Despliegue.md`](indexes/08_DevOps-Construccion-Y-Despliegue.md) |
| Los ejemplos ejecutables de `samples/` y qué muestra cada uno | [`indexes/09_Samples-Ejecutables.md`](indexes/09_Samples-Ejecutables.md) |
| Cómo se nombra algo antes de escribirlo, y qué significa cada término | [`indexes/10_Glosario-Y-Nomenclatura.md`](indexes/10_Glosario-Y-Nomenclatura.md) |
| Las decisiones tomadas, las auditorías, las mesas y lo que queda abierto | [`indexes/11_Decisiones-Auditorias-Y-Pendientes.md`](indexes/11_Decisiones-Auditorias-Y-Pendientes.md) |
| Qué se verificó al construir esta base y qué divergencias quedaron a la vista | [`indexes/12_Observaciones-Del-Indexado.md`](indexes/12_Observaciones-Del-Indexado.md) |

---

## 2. Resumen ejecutivo

| Campo | Valor |
| --- | --- |
| Producto | **Fábrica de Geometría** — la cátedra lo llama «el laboratorio» |
| Repositorio indexado | `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión `89f3ab3` (PR #186, 2026-09-06) |
| Repositorio de esta base | `PROG2/Geometria/Lab-Geometria.Documentacion` |
| Tipo | Laboratorio de cátedra: **dos unidades desplegables** sobre **siete proyectos de código** |
| Stack | C# sobre **.NET 10** — ASP.NET Core en el servicio de datos, **Blazor Interactive Server** en el front —, **EF Core 10 sobre SQLite**, y **TypeScript + webpack 5 + three.js 0.169** en el visor |
| Estado | **Ocho de nueve etapas cerradas.** La `i`, el despliegue real, está planificada y no ejecutada. Después de la `h` entraron la batería de extremo a extremo, dos mesas de UX/UI y, el 2026-09-06, la imagen de contenedor del front |
| Marco documental | Framework **SDD**, que vive en `IA/IA.SDD` y no se copia al repositorio |

**Qué hace.** El alumno de Programación 2 pega el texto que emite su propio programa; el producto
lo interpreta, reconstruye las figuras, **señala las discrepancias entre el valor que el alumno
declaró y el que se deriva de las dimensiones**, y las dibuja en tres dimensiones. El docente
habilita cuentas, revisa lo que la comisión entregó y deja su desenlace. Ese par
declarado/derivado —el error de fórmula que hoy pasa desapercibido— es el motivo de existir del
producto.

**Cómo está armado, en una línea.** Un servicio de datos REST en el servidor propio, que sostiene
el dato y las reglas sobre una única base SQLite; un front público que es el **único punto de
contacto del navegador** y que llama al servicio **servidor a servidor** con credencial firmada; y
un bundle de visor 3D que es un **visualizador puro**: sin red, sin configuración y sin identidad.

---

## 3. Estructura de esta base

```text
ia-db/
├── README.md                            ← Punto de entrada único (este archivo)
└── indexes/
    ├── 00_MASTER-INDEX.md               Producto, stack, estado, magnitudes
    ├── 01_Corpus-Documental-SDD.md      Mapa del corpus `SDD/`
    ├── 02_Arquitectura-Y-Proyectos.md   Proyectos, capas, grafo, transversales
    ├── 03_Dominio-Y-Reglas-De-Negocio.md Entidades, invariantes, reglas, derivación
    ├── 04_Superficie-HTTP-Y-Contratos.md Rutas, tipos, códigos, traducción
    ├── 05_Front-Web-Y-Visor-3D.md       Pantallas, guardianes, sistema visual, fachada
    ├── 06_Persistencia-Y-Seguridad.md   Almacén, esquema, respaldo, credenciales
    ├── 07_Pruebas-Y-Puertas-De-Calidad.md Baterías, puertas, umbrales, instrumentos
    ├── 08_DevOps-Construccion-Y-Despliegue.md Guiones, las dos imágenes, flujos, publicación
    ├── 09_Samples-Ejecutables.md        Los diecinueve samples
    ├── 10_Glosario-Y-Nomenclatura.md    Norma de nombres y vocabulario
    ├── 11_Decisiones-Auditorias-Y-Pendientes.md ADR, auditorías, mesas, abiertos
    └── 12_Observaciones-Del-Indexado.md Lo verificado y lo que no cuadró
```

---

## 4. Restricciones para un agente que use esta base

- **`PROMPTs/` de cualquier repositorio es del Product Owner.** Se lee, no se escribe.
- **`SDD/Docs/_legacy/` es registro histórico.** Reescribirlo le hace decir a una emisión vieja
  algo que no dijo.
- **El intake y los requerimientos técnicos son documentos humanos.** Lo desalineado **se eleva, no
  se corrige**.
- **`PRODUCT-MANIFEST` y los apartamientos se declaran, no se ejercen por conveniencia.**
- **El almacén de trabajo no se toca con rutinas destructivas sin archivo propio.** El 2026-08-15
  una corrida de guiones se llevó una cuenta.
- **Los contenedores `gf-api`, `gf-web`, `gf-back` y `gf-tunnel` son el despliegue local del
  Product Owner.** Un servicio de prueba se levanta aparte, con puerto libre y almacén propio.
- **Fusionar un pull request y borrar su rama son del Product Owner.** Se entrega el enlace y se
  espera.
- **Cuando dos mediciones del mismo hecho no coinciden, no se elige la que conviene**: se revisan
  las dos — y en este repositorio suele estar mal la más elaborada.
- **Esta base no reemplaza a las fuentes.** Cuando la evidencia contradiga un índice, **manda la
  evidencia**: corregí el índice y anotalo en
  [`indexes/12_Observaciones-Del-Indexado.md`](indexes/12_Observaciones-Del-Indexado.md).
- **Los índices tienen fecha.** Todo lo que declaran vale al **2026-09-11** sobre la revisión
  `89f3ab3`; para el avance vivo de la construcción la fuente es `changelog.md` y el historial del
  repositorio — y cuando no coinciden, **gana el historial** (ver O-9 del índice 12).

---

## Manifiesto de generación

- Generado por : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Iniciar-Indexado.md`
  (invocado desde `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Indexado/Crear-Indexado.md`)
- Profile      : `/IA/PROMPTs/IA.Prompts/PromptFramework/Profiles/Knowledge-Indexing.md`
- Modo         : proyecto único, con destino explícito fuera del proyecto indexado
- Alcance      : `PROG2/Geometria/Lab-Geometria` (rama `main`, `89f3ab3`, del 2026-09-06)
- Fuentes      : `README.md`, `AGENTS.md`, `changelog.md`, `Directory.Build.props`,
  `GeometriaFactory.sln`, `coverlet.runsettings`, `pruebas-e2e.runsettings`, `SDD/` (sin
  `_legacy/`), `src/`, `tests/`, `visor/src/` y `visor/verification/`, `samples/`, `scripts/`,
  `tools/`, `deploy/`, `.github/workflows/`, `evidencia/` (sólo los nombres de carpeta)
- Exclusiones  : `.git`, `.vscode`, `.devcontainer`, `.config`, `bin/`, `obj/`, `node_modules/`,
  `TestResults/`, `resultados-e2e/`, `visor/dist/`, `.publish-web/`, `SDD/Docs/_legacy/` y todo
  `_legacy/`, `SDD/Maquetas/` (sólo se contó), archivos de base de datos, y lo ignorado por el
  `.gitignore` del proyecto
- Generado     : 2026-09-11 · Versión: **3.0**
- Procedencia  : **regeneración completa** de la base 2.0 del 2026-09-06 (revisión `f527e5a`),
  pedida por el Product Owner al invocar `Crear-Indexado.md`. Entre las dos revisiones hay **dos
  commits** —el PR #186 «Dockerizar el front», que agrega sólo `deploy/Dockerfile.web`—. Cada
  magnitud de la 2.0 se volvió a contar sobre su instrumento y cada afirmación se volvió a abrir
  en su fuente; las ocho divergencias de la 2.0 siguen vigentes y se sumó una novena. Lo que
  cambió de contenido está en el índice 08 (§4, las dos imágenes), el 11 (§5.3) y el 12 (O-9)
- Actualizar   : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Actualizar-Indexado.md`
