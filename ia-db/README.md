# ia-db — Fábrica de Geometría (`Lab-Geometria`)

> **Instrucción para IA.** Este archivo es el **punto de entrada único** a la base de conocimiento
> del proyecto `Lab-Geometria`. Leelo primero y completo; después cargá **sólo** los uno o dos
> índices que la tabla de navegación indique para tu tarea. No recorras el repositorio entero ni
> cargues el corpus `SDD/Docs/` completo: son **1.143 archivos**, y todo lo que necesitás para
> ubicarte está destilado acá. Cada afirmación de estos índices referencia su fuente: cuando
> necesites el detalle, abrí la fuente que el índice nombra, no el árbol.

---

## 1. Tabla de navegación

| Necesitás saber… | Leé este índice |
| --- | --- |
| Qué es el producto, con qué stack, en qué estado está | [`indexes/00_MASTER-INDEX.md`](indexes/00_MASTER-INDEX.md) |
| Dónde vive cada documento del corpus `SDD/` y qué gobierna cada categoría | [`indexes/01_Corpus-Documental-SDD.md`](indexes/01_Corpus-Documental-SDD.md) |
| Cómo está partido el código: los siete proyectos, las capas y sus dependencias | [`indexes/02_Arquitectura-Y-Proyectos.md`](indexes/02_Arquitectura-Y-Proyectos.md) |
| Entidades, conjuntos cerrados, invariantes y reglas de negocio | [`indexes/03_Dominio-Y-Reglas-De-Negocio.md`](indexes/03_Dominio-Y-Reglas-De-Negocio.md) |
| Los puntos de acceso HTTP, los tipos de transferencia y los códigos de error | [`indexes/04_Superficie-HTTP-Y-Contratos.md`](indexes/04_Superficie-HTTP-Y-Contratos.md) |
| Las pantallas del front, sus guardianes de sesión y la fachada del visor 3D | [`indexes/05_Front-Web-Y-Visor-3D.md`](indexes/05_Front-Web-Y-Visor-3D.md) |
| Cómo se persiste, cómo se migra el esquema y cómo se firma el acceso | [`indexes/06_Persistencia-Y-Seguridad.md`](indexes/06_Persistencia-Y-Seguridad.md) |
| Las cuatro baterías de prueba, las puertas de calidad y sus umbrales | [`indexes/07_Pruebas-Y-Puertas-De-Calidad.md`](indexes/07_Pruebas-Y-Puertas-De-Calidad.md) |
| Cómo se construye, se corre y se despliega; los guiones y los contenedores | [`indexes/08_DevOps-Construccion-Y-Despliegue.md`](indexes/08_DevOps-Construccion-Y-Despliegue.md) |
| Los ejemplos ejecutables de `samples/` y qué muestra cada uno | [`indexes/09_Samples-Ejecutables.md`](indexes/09_Samples-Ejecutables.md) |
| Cómo se nombra algo antes de escribirlo, y qué significa cada término | [`indexes/10_Glosario-Y-Nomenclatura.md`](indexes/10_Glosario-Y-Nomenclatura.md) |
| Las decisiones tomadas, las auditorías y lo que queda abierto | [`indexes/11_Decisiones-Auditorias-Y-Pendientes.md`](indexes/11_Decisiones-Auditorias-Y-Pendientes.md) |
| Qué se verificó al construir esta base y qué divergencias quedaron a la vista | [`indexes/12_Observaciones-Del-Indexado.md`](indexes/12_Observaciones-Del-Indexado.md) |

---

## 2. Resumen ejecutivo

| Campo | Valor |
| --- | --- |
| Producto | **Fábrica de Geometría** (la cátedra lo nombra «el laboratorio») |
| Repositorio indexado | `PROG2/Geometria/Lab-Geometria` · rama `main` |
| Repositorio de esta base | `PROG2/Geometria/Lab-Geometria.Documentacion` |
| Tipo | Laboratorio de cátedra: dos unidades desplegables sobre siete proyectos de código |
| Stack | C# sobre **.NET 10** — ASP.NET Core en el servicio de datos, Blazor Interactive Server en el front —, **EF Core sobre SQLite**, **TypeScript + webpack + three.js** en el visor |
| Estado | Documentación aprobada por categoría (salvo `11-Documentacion`, **planificada**); construcción con las etapas `a` a `h` **cerradas** y la `i` (despliegue real) **planificada y no ejecutada** |
| Audiencia | Dos personas del aula: el **alumno** de la comisión y el **docente**/administrador. Sin integradores externos |

**Qué hace.** En la Actividad 1 de Programación 2 el alumno escribe un programa que modela figuras
y las describe en un texto JSON. Hoy ese texto se pega en una página suelta y se mira: no hay
identidad, ni persistencia, ni entrega. Fábrica de Geometría cierra esa cadena adentro de un solo
producto — el alumno se registra sin correo de verificación, carga su trabajo, lo envía, ve la
**interpretación con sus observaciones** y lo mira en tres dimensiones; el docente habilita
cuentas, revisa lo que entregó la comisión y deja su desenlace. El valor central del producto es
volver visible el **error de fórmula**: mostrar juntos el **valor declarado** por el programa del
alumno y el **valor derivado** que el producto recalcula.

**Arquitectura en una línea.** Front Blazor (hosting público) → HTTP con credencial firmada →
servicio de datos ASP.NET Core (servidor propio) con arquitectura hexagonal —dominio sin
dependencias, casos de uso con cuatro puertos, adaptadores EF Core/SQLite— y un bundle de visor 3D
sin red que el front embebe.

---

## 3. Estructura del repositorio indexado

```
Lab-Geometria/
├── AGENTS.md            Contrato de trabajo del repositorio. DERIVADO: se regenera desde SDD
├── changelog.md         Única fuente del avance de construcción, por etapa
├── GeometriaFactory.sln Seis de los siete proyectos de código (el visor no está en la solución)
├── Directory.Build.props Puerta QG-01: net10.0 + TreatWarningsAsErrors para los seis
├── SDD/                 El corpus que gobierna el repositorio — 1.143 archivos (605 en _legacy)
│   ├── Intake/          Documentos humanos: PRODUCT-INTAKE y PRODUCT-MANIFEST. NO se corrigen
│   ├── Docs/            00-Contexto, 01-Necesidades-Negocio, Producto/, Audit/, Unidades-Entrega/
│   └── Maquetas/        Maqueta HTML validada del front
├── src/                 Los seis proyectos .NET: Domain, Contracts, Application, Infrastructure, Api, Web
├── tests/               Las tres baterías: Domain.Tests, Application.Tests, Integration.Tests
├── visor/               Proyecto Node independiente (TypeScript + webpack): el bundle 3D
├── samples/             Diecinueve carpetas de ejemplo, por proyecto de código y por nivel
├── scripts/             24 guiones: construir, probar, medir cobertura y las puertas de etapa
├── tools/               Instrumentos de medición puntuales (cobertura, pintado, volumen)
├── deploy/              Dockerfile del servicio e imagen de VERIFICACIÓN (no de despliegue)
└── .github/workflows/   Publicación del front por FTP al hosting público
```

---

## 4. Restricciones para un agente que consuma esta base

- **No escribir en `PROMPTs/`** de ningún repositorio: es del Product Owner, se lee y no se escribe.
- **No reescribir `SDD/Docs/_legacy/` ni `SDD/Intake/_legacy/`**: son registro histórico; corregirlos
  le haría decir a una emisión vieja algo que no dijo.
- **El intake y los requerimientos técnicos son documentos humanos**: lo desalineado **se eleva, no
  se corrige**.
- **No editar `AGENTS.md`**: es derivado de `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`.
- **No tocar los contenedores `gf-api`, `gf-web`, `gf-back`, `gf-tunnel`**: son el despliegue local
  del Product Owner. Un servicio de prueba se levanta aparte, con puerto libre y almacén propio.
- **No fusionar ni borrar ramas de pull request** sin decisión del Product Owner.
- **Esta base no reemplaza a las fuentes**: cuando la evidencia contradiga un índice, **manda la
  evidencia** — corregí el índice y anotalo en
  [`indexes/12_Observaciones-Del-Indexado.md`](indexes/12_Observaciones-Del-Indexado.md).
- **Los índices tienen fecha.** Todo lo que declaran vale al **2026-08-31**; para el avance vivo de
  la construcción la fuente es `changelog.md` y el historial del repositorio.

---

## Manifiesto de generación

- Generado por : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Iniciar-Indexado.md`
  (invocado desde `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Indexado/Crear-Indexado.md`)
- Profile      : `/IA/PROMPTs/IA.Prompts/PromptFramework/Profiles/Knowledge-Indexing.md`
- Modo         : proyecto único, con destino explícito fuera del proyecto indexado
- Alcance      : `PROG2/Geometria/Lab-Geometria` (rama `main`, `da9b07c`)
- Fuentes      : `README.md`, `AGENTS.md`, `changelog.md`, `Directory.Build.props`,
  `GeometriaFactory.sln`, `coverlet.runsettings`, `SDD/` (sin `_legacy/`), `src/`, `tests/`,
  `visor/src/`, `samples/`, `scripts/`, `tools/`, `deploy/`, `.github/workflows/`, `.devcontainer/`
- Exclusiones  : `.git`, `.vscode`, `bin/`, `obj/`, `node_modules/`, `TestResults/`, `visor/dist/`,
  `.publish-web/`, archivos de base de datos y todo lo ignorado por el `.gitignore` del proyecto
- Generado     : 2026-08-31 · Versión: 1.0
- Actualizado  : 2026-09-02 · Versión: 1.1 — `07` incorpora la **cuarta batería**, la de extremo a
  extremo (`tests/GeometriaFactory.E2ETests`), con sus dos modos de corrida, cómo se la ejecuta y
  qué NO puede ver. Es incremental: ningún otro índice cambió
- Actualizar   : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Actualizar-Indexado.md`
