# ia-db — Fábrica de Geometría (`Lab-Geometria`)

> **Instrucción para IA.** Este archivo es el **punto de entrada único** a la base de conocimiento
> del repositorio `Lab-Geometria`. Leelo primero y completo; después cargá **sólo** los uno o dos
> índices que la tabla de navegación indique para tu tarea. No recorras el repositorio entero ni
> cargues el corpus `SDD/` completo: son **1.889 archivos versionados**, 1.330 de ellos bajo `SDD/`
> y 679 en carpetas `_legacy/`. Cada afirmación de los índices cita su fuente con ruta relativa a la
> raíz de `Lab-Geometria`: cuando necesites el detalle, abrí esa fuente, no el árbol. Si la fuente
> contradice al índice, **manda la fuente**.

---

## 1. Tabla de navegación

| Necesitás saber… | Leé este índice |
| --- | --- |
| Visión, stack, decisiones clave y el mapa completo «pregunta → índice» | [`indexes/00_MASTER-INDEX.md`](indexes/00_MASTER-INDEX.md) |
| Dónde vive cada documento de `SDD/` y qué autoridad tiene sobre otro | [`indexes/01_Corpus-Documental-SDD.md`](indexes/01_Corpus-Documental-SDD.md) |
| Qué se pidió: necesidades `NB-n`, capacidades `F-01..F-26`, exclusiones, `RA-01..03` | [`indexes/02_Requerimientos-Necesidades-Y-Alcance.md`](indexes/02_Requerimientos-Necesidades-Y-Alcance.md) |
| En qué etapa está, backlog, y la lista única de lo que queda abierto | [`indexes/03_Roadmap-Avance-Backlog-Y-Pendientes.md`](indexes/03_Roadmap-Avance-Backlog-Y-Pendientes.md) |
| Unidades de entrega, los 7 proyectos, el grafo, la composición y el arranque | [`indexes/04_Arquitectura-Y-Proyectos.md`](indexes/04_Arquitectura-Y-Proyectos.md) |
| Entidades, invariantes, reglas de negocio e interpretación declarado/derivado | [`indexes/05_Dominio-Interpretacion-Y-Reglas-De-Negocio.md`](indexes/05_Dominio-Interpretacion-Y-Reglas-De-Negocio.md) |
| Rutas `/v1/`, tipos de `Contracts`, `ErrorCode`, OpenAPI y deprecación | [`indexes/06_Superficie-HTTP-Y-Contratos.md`](indexes/06_Superficie-HTTP-Y-Contratos.md) |
| Almacén SQLite, migraciones, respaldo y restauración | [`indexes/07_Persistencia-Y-Almacen.md`](indexes/07_Persistencia-Y-Almacen.md) |
| Identidad, credenciales, acceso firmado, límite de tasa, cabeceras y sesión | [`indexes/08_Seguridad-Identidad-Y-Sesion.md`](indexes/08_Seguridad-Identidad-Y-Sesion.md) |
| Pantallas Blazor, cliente hacia el servicio, experiencia de uso y maquetas | [`indexes/09_Front-Web-Y-Experiencia-De-Uso.md`](indexes/09_Front-Web-Y-Experiencia-De-Uso.md) |
| El visor 3D: fachada, bundle TypeScript/three.js y su verificación | [`indexes/10_Visor-3D.md`](indexes/10_Visor-3D.md) |
| Baterías de prueba, puertas `QG`/`verify-*`/`PT` e instrumentos de `tools/` | [`indexes/11_Pruebas-Puertas-Y-Calidad.md`](indexes/11_Pruebas-Puertas-Y-Calidad.md) |
| Construir, configurar, versionar, imágenes, workflows y desplegar | [`indexes/12_DevOps-Construccion-Versionado-Y-Despliegue.md`](indexes/12_DevOps-Construccion-Versionado-Y-Despliegue.md) |
| Los 20 samples ejecutables y la colección de peticiones | [`indexes/13_Samples-Ejecutables.md`](indexes/13_Samples-Ejecutables.md) |
| Cómo se nombra algo y qué significa cada término | [`indexes/14_Glosario-Y-Nomenclatura.md`](indexes/14_Glosario-Y-Nomenclatura.md) |
| Las 60 ADR vivas y las decisiones del Product Owner | [`indexes/15_Decisiones-ADR.md`](indexes/15_Decisiones-ADR.md) |
| Mesas de expertos, auditorías y reanudaciones | [`indexes/16_Mesas-Auditorias-Y-Reanudaciones.md`](indexes/16_Mesas-Auditorias-Y-Reanudaciones.md) |
| Migraciones normativas del marco SDD, `_legacy/` y el expediente 0001 | [`indexes/17_Migraciones-Normativas-Y-Expedientes.md`](indexes/17_Migraciones-Normativas-Y-Expedientes.md) |
| Cómo trabaja un agente: construir, probar, límites, merge delegado, eventualidades | [`indexes/18_Forma-De-Trabajo-Y-Agentes.md`](indexes/18_Forma-De-Trabajo-Y-Agentes.md) |
| Qué se recontó al indexar y qué divergencias entre fuentes quedaron abiertas | [`indexes/19_Observaciones-Del-Indexado.md`](indexes/19_Observaciones-Del-Indexado.md) |

---

## 2. Resumen ejecutivo

| Campo | Valor |
| --- | --- |
| Proyecto | **Fábrica de Geometría** — «el laboratorio» de la cátedra de Programación 2; repositorio público de consulta |
| Tipo | Laboratorio de cátedra: **2 unidades de entrega** (`GeometriaFactory-Api`, servicio de datos REST; `GeometriaFactory-Web`, front público con el visor) sobre **7 proyectos de código** |
| Stack | C# sobre **.NET 10** · ASP.NET Core con JWT Bearer y OpenAPI/Scalar · **Blazor** con render en el servidor · **EF Core 10.0.11 sobre SQLite** · visor en **TypeScript 5.6 + webpack 5.95 + three.js 0.169** · pruebas xUnit y NUnit/Playwright · versión por **MinVer** |
| Repositorio indexado | `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión **`5f07b12`** (fusión del PR #234, 2026-10-27); última etiqueta `v1.2.0` |
| Repositorio de esta base | `PROG2/Geometria/Lab-Geometria.Documentacion` (`ia-db/`) |
| Versión de esta base | **4.0** · generada el 2026-11-01 |
| Estado | Fases `a`–`h` y `k` (API pública `/v1/`) **cerradas**; `i` (despliegue real) **realizada el 2026-09-06 y no cerrada** (falta `PT-05` y el circuito presenciado desde la facultad) |
| Marco documental | **SDD**, procedencia 13.16; el corpus `SDD/Docs/` gobierna el repositorio |

**Función principal.** El alumno pega el texto JSON que emite su propio programa; el producto lo
interpreta, reconstruye las figuras, **señala las discrepancias entre el valor declarado y el que se
deriva de las dimensiones** y las dibuja en 3D. El docente habilita cuentas, revisa lo que la comisión
entregó y deja su desenlace (`AGENTS.md`; `SDD/Docs/README.md` §1).

**Arquitectura en una línea.** El navegador sólo habla con el front Blazor, que llama **servidor a
servidor** con credencial firmada al servicio de datos bajo `/v1/`, dueño del dato y de las reglas
sobre un único archivo SQLite; el visor 3D es un bundle **sin red, configuración ni identidad**
(`RA-01..03`, intake §14).

---

## 3. Estructura

### 3.1 Esta base

```text
ia-db/
├── README.md                                       ← Punto de entrada único (este archivo)
└── indexes/
    ├── 00_MASTER-INDEX.md                          Visión, stack, decisiones clave, pregunta → índice
    ├── 01_Corpus-Documental-SDD.md                 Mapa y autoridad del árbol SDD/
    ├── 02_Requerimientos-Necesidades-Y-Alcance.md  NB, F-nn, X-n, RA, asunciones
    ├── 03_Roadmap-Avance-Backlog-Y-Pendientes.md   Fases, changelog, backlog, abiertos
    ├── 04_Arquitectura-Y-Proyectos.md              Unidades, proyectos, grafo, arranque
    ├── 05_Dominio-Interpretacion-Y-Reglas-De-Negocio.md  Entidades, INV, RN, RC, validador
    ├── 06_Superficie-HTTP-Y-Contratos.md           /v1/, Contracts, ErrorCode, OpenAPI
    ├── 07_Persistencia-Y-Almacen.md                DbContext, migraciones, respaldo
    ├── 08_Seguridad-Identidad-Y-Sesion.md          Credencial, token, tasa, cabeceras, sesión
    ├── 09_Front-Web-Y-Experiencia-De-Uso.md        Pantallas, cliente, UX, maquetas
    ├── 10_Visor-3D.md                              Fachada, bundle, verificación
    ├── 11_Pruebas-Puertas-Y-Calidad.md             Baterías, QG, verify-*, PT, tools/
    ├── 12_DevOps-Construccion-Versionado-Y-Despliegue.md  Build, config, imágenes, CI, despliegue
    ├── 13_Samples-Ejecutables.md                   Los 20 samples
    ├── 14_Glosario-Y-Nomenclatura.md               Norma de nombres y vocabulario
    ├── 15_Decisiones-ADR.md                        60 ADR y decisiones del PO
    ├── 16_Mesas-Auditorias-Y-Reanudaciones.md      Mesas, auditorías, reanudaciones
    ├── 17_Migraciones-Normativas-Y-Expedientes.md  Migraciones SDD, _legacy, EXP-0001
    ├── 18_Forma-De-Trabajo-Y-Agentes.md            Contrato de agentes, límites, merge
    └── 19_Observaciones-Del-Indexado.md            Recuentos y divergencias
```

### 3.2 El repositorio indexado (primer nivel, archivos versionados en `5f07b12`)

```text
Lab-Geometria/
├── README.md, AGENTS.md, changelog.md   Puntero · contrato de agentes derivado · registro de avance (→ 18, 03)
├── GeometriaFactory.sln, Directory.Build.props, *.runsettings, .editorconfig   Solución y propiedades comunes (→ 04, 11, 12)
├── .config/ (1) · .devcontainer/ (1) · .github/ (3)   Herramientas dotnet, entorno de desarrollo, workflows (→ 12)
├── .publish-web-offline.htm             Página de mantenimiento del canal FTP (→ 12)
├── SDD/ (1330)                          Corpus que gobierna el producto: Docs/, Intake/, Expedientes/, Maquetas/ (→ 01)
├── src/ (182)                           Seis proyectos .NET: Domain, Contracts, Application, Infrastructure, Api, Web (→ 04)
├── visor/ (15)                          Séptimo proyecto: bundle TypeScript/three.js (→ 10)
├── tests/ (63)                          Cuatro baterías: Domain, Application, Integration, E2E (→ 11)
├── samples/ (238)                       20 ejemplos ejecutables por capa y nivel (→ 13)
├── scripts/ (27) · tools/ (13)          Guiones de construir/correr/puertas e instrumentos de medición (→ 11, 12)
├── deploy/ (4)                          Dockerfile del servicio, del front, de E2E y compose.yaml de verificación (→ 12)
└── .vscode/ (2)                         Excluido por Profile
```

Recuentos: `git -C Lab-Geometria ls-files <ruta> | wc -l` sobre `5f07b12`.

---

## 4. Restricciones para un agente que use esta base

- **Esta base se lee; el repositorio se cambia por sus propias reglas.** Antes de tocar
  `Lab-Geometria`, leer `AGENTS.md` (derivado de
  `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`, que manda si divergen) → índice `18`.
- **`PROMPTs/` de cualquier repositorio es del Product Owner.** Se lee, no se escribe.
- **`_legacy/` es registro histórico.** No se reescribe: le haría decir a una emisión vieja algo que
  no dijo. Esta base lo cuenta y ubica (`01`, `17`) pero no indexa su contenido.
- **El intake y los requerimientos técnicos son documentos humanos.** Lo desalineado se eleva, no se
  corrige. `PRODUCT-MANIFEST` y los apartamientos se declaran, no se ejercen por conveniencia.
- **El almacén de trabajo no se toca con rutinas destructivas sin archivo propio** (el 2026-08-15 una
  corrida de guiones se llevó una cuenta).
- **Los contenedores `lab-geometria-web` y `lab-geometria-api` son el despliegue real del PO**: ni
  `exec`, ni reinicio, ni lectura de sus volúmenes. Un servicio de prueba se levanta aparte, con puerto
  libre y almacén propio.
- **El merge lo hace el agente, por delegación del PO** (2026-08-31, reafirmada 2026-09-14, ampliada
  por escrito 2026-10-27), con las guardas **G1–G4**: PR abierto sin conflicto, `mergeable_state`
  `clean`, controles en verde sobre el SHA de la cabeza, merge commit atado a ese SHA; después se borra
  la rama y se comprueba el 404. Techo de espera 60 min, relectura cada 60 s. Ante un cuestionamiento
  particular o una decisión irreversible con efecto externo, se para y se hace manual (`AGENTS.md`,
  «Delegación del merge»; índice `18` §6).
- **Cuando dos mediciones del mismo hecho no coinciden, no se elige la que conviene**: se revisan las
  dos. Las divergencias conocidas están en `19` y **no se resuelven desde esta base**.
- **Los índices tienen fecha.** Valen sobre `5f07b12`; el avance vivo es `changelog.md` más el
  historial git, y cuando difieren **gana el historial** (`19` N-1: los PR #234 y #235 no tienen
  entrada en el changelog).
- **Esta base no se edita a mano por partes sueltas**: se actualiza con el prompt del manifiesto,
  que también ajusta versión y fecha.

---

## Manifiesto de generación

- Generado por : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Iniciar-Indexado.md`,
  invocado desde `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Indexado/Crear-Indexado.md`
  («Leer y ejecutar `Iniciar-Indexado.md` de `/PROG2/Geometria/Lab-Geometria` y deja la indexación
  en `/PROG2/Geometria/Lab-Geometria.Documentacion/ia-db`»)
- Profile      : `/IA/PROMPTs/IA.Prompts/PromptFramework/Profiles/Knowledge-Indexing.md`
- Modo         : proyecto único, con destino explícito fuera del proyecto indexado
- Alcance      : `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión `5f07b12`
  (`5f07b129f55524a83d3eec605765d67178469599`, «Merge pull request #234», 2026-10-27 10:26:38 -0300)
- Fuentes      : sólo archivos versionados (`git ls-files`, 1.889): raíz (`README.md`, `AGENTS.md`,
  `changelog.md`, `GeometriaFactory.sln`, `Directory.Build.props`, `coverlet.runsettings`,
  `pruebas-e2e.runsettings`, `.editorconfig`, `.gitignore`, `.publish-web-offline.htm`), `.config/`,
  `.devcontainer/`, `.github/workflows/`, `SDD/` (`Docs/`, `Intake/`, `Expedientes/`, `Maquetas/`;
  sin contenido de `_legacy/`), `src/`, `visor/`, `tests/`, `samples/`, `scripts/`, `tools/`, `deploy/`
- Exclusiones  : `.git`; `.vscode/` (2 archivos, IDE por Profile); dependencias y artefactos de build
  (`node_modules/`, `bin/`, `obj/`, `dist/`, `publish/`, `TestResults/`: no versionados); binarios,
  imágenes y bases de datos (ninguno versionado); el **contenido** de las 679 entradas bajo `_legacy/`
  (626 en `SDD/Docs/`, 53 en `SDD/Intake/`), que sólo se cuentan y ubican; lo ignorado por `.gitignore`;
  la propia ia-db (vive en otro repositorio)
- Generado     : 2026-11-01 · Versión: **4.0**
- Procedencia  : **regeneración completa** (elegida por el PO en lugar de actualizar) de la 3.0 del
  2026-09-11, que indexaba `89f3ab3` (PR #186, 2026-09-06). Entre ambas revisiones hay **209 commits**
  (64 fusiones) y **430 archivos** cambiados (`git diff --name-only 89f3ab3 5f07b12`); `evidencia/`
  se retiró de la raíz (`3662bf9`, 2026-09-13). El mapa pasó de 13 a 20 índices con numeración nueva;
  el estado de las observaciones O-1..O-9 de la 3.0 y las nuevas N-1..N-12 están en `19`
- Regenerar    : volver a ejecutar `Crear-Indexado.md` (→ `Iniciar-Indexado.md` + Profile) sobre la
  revisión de `main` que se quiera; reemplaza esta base entera y sube la versión mayor
- Actualizar   : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Actualizar-Indexado.md`,
  invocado desde `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Indexado/Actualizar-Indexado.md`,
  partiendo de `git -C Lab-Geometria diff --name-only 5f07b12..main` (y `git log 5f07b12..main`) y
  tocando sólo los índices cuya ruta cambió según la tabla de abajo; al terminar, sumar 0.1 a la
  versión, fijar la fecha y la nueva revisión en este manifiesto y revisar `19`

| Ruta cambiada en `Lab-Geometria` | Índices a revisar |
| --- | --- |
| `SDD/Intake/` | `02`, `01`, `15` (apartamientos), `17` (si es migración) |
| `SDD/README.md`, `SDD/Docs/README.md`, `SDD/Docs/Handoff-Checkout.md`, alta o baja de una categoría | `01` |
| `SDD/Docs/00-Contexto/`, `changelog.md` | `03` (y `02` para la visión) |
| `SDD/Docs/01-Necesidades-Negocio/` | `02` |
| `SDD/Docs/Producto/Contratos-Inter-Unidad/` | `06` |
| `SDD/Docs/Producto/Medicion-Puertas-Tecnicas-*.md`, `SDD/Docs/Unidades-Entrega/*/08-Calidad-Y-Pruebas/` | `11` |
| `SDD/Docs/Unidades-Entrega/*/02-Especificacion-Funcional/` | `05` (Api), `09` (Web), `10` (fachada del visor) |
| `SDD/Docs/Unidades-Entrega/*/03-UX-UI-DX/` | `09` (y `06` si es la DX de la Api) |
| `SDD/Docs/Unidades-Entrega/*/05-Arquitectura-Tecnica/` | `04`, o el índice del mecanismo (`06`, `07`, `08`, `10`) |
| `SDD/Docs/Unidades-Entrega/*/09-Devops/` | `12` |
| `SDD/Docs/Unidades-Entrega/*/10-Examples/` | `13` |
| `SDD/Docs/Unidades-Entrega/*/06-Backlog-Tecnico/`, `07-Plan-Sprint/` | `03` |
| `SDD/Docs/**/Adrs/`, `Decisiones-Arquitectura.md` | `15` y el índice del mecanismo |
| `SDD/Docs/Audit/` | `16` (mesas/auditorías) o `17` (migraciones) |
| `SDD/Expedientes/` | `17` |
| `SDD/Docs/Producto/Norma-De-Nomenclatura.md`, `Glosario-*.md` | `14` |
| `SDD/Docs/Producto/11-Documentacion/`, `AGENTS.md`, `README.md`, `.editorconfig` | `18` |
| `SDD/Maquetas/`, `src/GeometriaFactory.Web/` | `09` (y `08` si toca `Services/Session*`) |
| `src/GeometriaFactory.Domain/`, `src/GeometriaFactory.Application/`, `src/GeometriaFactory.Infrastructure/Figures/` | `05` (y `04` si cambia el grafo) |
| `src/*/*.csproj`, `src/*/Program.cs`, `GeometriaFactory.sln` | `04` |
| `src/GeometriaFactory.Api/Endpoints/`, `src/GeometriaFactory.Contracts/` | `06` |
| `src/GeometriaFactory.Infrastructure/Persistence/` | `07` |
| `src/GeometriaFactory.Infrastructure/Security/`, `src/GeometriaFactory.Api/Composition/` | `08` (y `04`) |
| `visor/` | `10` |
| `tests/`, `scripts/verify-*`, `scripts/test.sh`, `scripts/coverage.sh`, `tools/`, `*.runsettings` | `11` |
| `Directory.Build.props`, `deploy/`, `.github/`, `.devcontainer/`, `.config/`, otros `scripts/` | `12` |
| `samples/` | `13` |
| Cualquier recuento que cambie | `00`, `19` y este README |
