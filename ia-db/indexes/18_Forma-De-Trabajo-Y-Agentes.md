# 18 · Forma de trabajo: contrato de agentes, convenciones, delegación y eventualidades

> **Propósito:** cómo se trabaja en Lab-Geometria (main `5f07b12`): qué hace un agente para construir, probar y cerrar un cambio, qué convenciones sigue, qué no toca sin confirmación humana, cómo se delega el merge y dónde se asientan las eventualidades del entorno.
> **Fuente primaria:** `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md` (fuente) y `AGENTS.md` (derivado). Complementan: `SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md`, `.editorconfig`, `README.md`.
> **Revisión indexada:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01. Rutas relativas a la raíz del repo.
> **No cubre:** la norma de nombres y su tabla §6 (→ `14_Glosario-Y-Nomenclatura.md`), los workflows de CI (→ `12_DevOps-Construccion-Versionado-Y-Despliegue.md`), el changelog como registro de avance (→ `03_Roadmap-Avance-Backlog-Y-Pendientes.md`), las puertas y su medición (→ `11_Pruebas-Puertas-Y-Calidad.md`).

---

## 1. Fuente y derivado

| Documento | Rol | Versión / estado | Regla |
| --- | --- | --- | --- |
| `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md` | **Fuente** (`DOC-PRODUCTO-CONTRATO-AGENTES-01`, owner AG-00110, Momento 2) | Frontmatter `version: "1.0"`, `last_review: 2026-08-30`; el control de cambios registra 1.1 (2026-09-14) | Si divergen, manda el contrato y `AGENTS.md` se regenera |
| `AGENTS.md` (raíz) | **Derivado** | Sin versión propia; último cambio `be83e8e` (delegación del merge, 2026-10-27) | «No editar acá»; se refresca en cada corrida del Momento 2 |
| `_legacy/2026-09-14/Contrato-Agentes-v1.0.md` | Estado anterior citado por la 1.1 (ruta relativa a la carpeta del contrato) | — | Versionado en `SDD/Docs/Producto/11-Documentacion/_legacy/2026-09-14/Contrato-Agentes-v1.0.md` (frontmatter 1.0, 2026-08-30) |

Historia del contrato (`Contrato-Agentes.md` §Control de cambios):

| Versión | Fecha | Qué cambió |
| --- | --- | --- |
| 1.0 | 2026-08-30 | Emisión inicial; cierra `I-02`, único bloqueante del incremento `I-1` de la Fase I (los siete puntos de `Rules-Documentacion.md` §4.2) |
| 1.1 | 2026-09-14 | Por R-18 de la mesa 2026-09-14: E2E fuera de `test.sh`; contenedores protegidos pasan a `lab-geometria-web/api`; merge del agente; §7 corrige 8 de 10 documentos citados que no existían (`DD-R9-2`) |

Commits que tocaron `AGENTS.md` (`git log -- AGENTS.md`): `9058ce5` (cierra I-02 e I-01), `160770d` (el contrato dice lo que corre), `be83e8e` (asienta la delegación del merge, 2026-10-27).

## 2. Qué es el repositorio (para un agente)

| Punto | Contenido | Fuente |
| --- | --- | --- |
| Producto | Fábrica de Geometría: el alumno pega el JSON de su programa; el sistema interpreta, reconstruye, señala discrepancias declarado/derivado y dibuja en 3D; el docente revisa | `Contrato-Agentes.md` §1 |
| Forma | 2 unidades de entrega (`GeometriaFactory-Api`, `GeometriaFactory-Web`) sobre 7 proyectos; detalle → índice 04 | `Contrato-Agentes.md` §1 |
| Stack | C# / .NET 10, EF Core sobre SQLite, TypeScript + webpack (visor) | `AGENTS.md` §Qué es |
| Corpus | `SDD/Docs/` gobierna el código, con sus propias reglas de identificador, versión y trazabilidad; mapa → índice 01 | `Contrato-Agentes.md` §1 |

## 3. Ciclo de trabajo del agente

### 3.1 Construir

| Comando | Qué hace | Fuente |
| --- | --- | --- |
| `bash scripts/build.sh` | Bundle del visor + solución, `Release`; termina en 0 y sin advertencias (`TreatWarningsAsErrors` en `Directory.Build.props`) | `Contrato-Agentes.md` §2 |
| `bash scripts/build-visor.sh` | Sólo el bundle del visor (→ índice 10) | `Contrato-Agentes.md` §2 |
| `bash scripts/verify-explicit-configuration.sh` | Comprueba la regla «la configuración se declara siempre y en los dos lados» | `Contrato-Agentes.md` §2 |

### 3.2 Probar

| Comando | Qué hace | Fuente |
| --- | --- | --- |
| `bash scripts/test.sh` | `dotnet test GeometriaFactory.sln -c Release`: Domain, Application, Integration | `Contrato-Agentes.md` §3 |
| `bash scripts/pruebas-e2e.sh` | Cuarta batería (E2E), **fuera** de `test.sh`; producto entero + navegador en contenedor | `Contrato-Agentes.md` §3 |
| `dotnet test tests/GeometriaFactory.Domain.Tests -c Release` | Subconjunto por proyecto | `AGENTS.md` §Probar |
| `bash scripts/coverage.sh` | Cobertura y sus dos puertas: **0** pasan, **1** alguna no, **2** no se pudo medir (el 2 no es aprobación) | `Contrato-Agentes.md` §3 |

Baterías, conteos y puertas → índice 11.

### 3.3 Antes de terminar un cambio (en este orden)

| Paso | Esperado |
| --- | --- |
| `bash scripts/build.sh` | 0 y sin advertencias |
| `bash scripts/test.sh` | 0 |
| `bash scripts/coverage.sh` | 0 (2 no es aprobación) |
| `git status --short` | El árbol dice sólo lo que se tocó |
| `scripts/verify-stage-<letra>.sh` | Sólo si el cambio toca una etapa con puerta propia; existen `c`…`i` en `scripts/` |
| Bitácora de eventualidades | Si el entorno se resistió (puerto, permiso, herramienta): entrada con `intentos_descartados` (§7) |

Fuente: `Contrato-Agentes.md` §5; `AGENTS.md` §Antes de terminar.

## 4. Convenciones

| Convención | Regla | Fuente |
| --- | --- | --- |
| Idioma | Identificadores en inglés, texto para personas en castellano; un concepto ausente de la tabla §6 de la norma **se agrega primero** (norma → índice 14) | `Contrato-Agentes.md` §4 |
| Códigos de condición | En inglés, sin prefijo `CONTRATO_`, declarados en `ConditionCode.cs` y sus tres pares por capa; no se acuña uno sin catálogo (catálogo → índice 05) | `Contrato-Agentes.md` §4 |
| Comentarios | El porqué, no el qué; se conservan los «esto se probó y falló» | `Contrato-Agentes.md` §4 |
| Commits | Título de una línea; cuerpo = qué se decidió y con qué fundamento, no qué archivos; **sin acentos en el cuerpo** | `Contrato-Agentes.md` §4 |
| Pull requests | Una unidad de trabajo por PR; si dos son inseparables se declaran ambas y cuál es revertible sin la otra | `Contrato-Agentes.md` §4 |
| Mediciones discordantes | No se elige la que conviene: se revisan las dos; «suele estar mal la más elaborada» | `Contrato-Agentes.md` §6 (cierre) |

### 4.1 `.editorconfig`

Encabezado: «Apartamiento AP-01 (Plan-Etapa-A.md §2.3): puerta de estilo única para los seis proyectos» (el texto dice seis; el contrato habla de siete proyectos, ver §8).

| Sección | Reglas |
| --- | --- |
| `[*]` | `root = true`; `utf-8`, `lf`, newline final, espacios, `indent_size = 4`, recorta espacios finales |
| `[*.{json,yml,yaml,ts,js,md}]` | `indent_size = 2` |
| `[*.md]` | `trim_trailing_whitespace = false` |
| `[*.{cs,razor}]` | `indent_size = 4`; reglas de nombres (severidad `warning`, que con `TreatWarningsAsErrors` frena) |
| ↳ interfaces | prefijo `I` + PascalCase (`interfaces_start_with_i`) |
| ↳ campos privados | `_camelCase` (`private_fields_underscore_camel_case`) |
| `[*.sh]` | `indent_size = 2`, `lf` |

Las reglas de nombres citan `Norma-De-Nomenclatura.md` §3 (→ índice 14).

## 5. Límites: qué no se toca sin confirmación humana

| Límite | Por qué | Fuente |
| --- | --- | --- |
| `PROMPTs/` de cualquier repositorio | Es del Product Owner: se lee, no se escribe | `Contrato-Agentes.md` §6 |
| `SDD/Docs/_legacy/` | Registro histórico; reescribirlo falsea una emisión vieja (qué produjo cada carpeta → índice 17) | `Contrato-Agentes.md` §6 |
| Intake y requerimientos técnicos | Documentos humanos; lo desalineado **se eleva, no se corrige** | `Contrato-Agentes.md` §6 |
| `PRODUCT-MANIFEST` y decisiones de `Root-Rules.md` §11 | Un apartamiento se declara, no se ejerce por conveniencia | `Contrato-Agentes.md` §6 |
| Almacén de trabajo | Incidente 2026-08-15 (una corrida se llevó la cuenta de administrador); rutina destructiva = **archivo propio**; ver `scripts/store-path.sh` (→ índice 07) | `Contrato-Agentes.md` §6 |
| Contenedores `lab-geometria-web` y `lab-geometria-api` | Despliegue real del PO: ni `exec`, ni reinicio, ni lectura de volúmenes; un servicio de prueba va aparte, puerto libre, almacén propio. Hasta 2026-09-14 la fila nombraba `gf-api`, `gf-web`, `gf-back`, `gf-tunnel` | `Contrato-Agentes.md` §6 |
| Fusionar PR y borrar rama | **Lo hace el agente** (decisión del PO 2026-08-31, reafirmada 2026-09-14) con checks en verde y sin reserva; con reserva, entrega el enlace y espera; nunca con un check en rojo | `Contrato-Agentes.md` §6; `AGENTS.md` §Límites |

## 6. Delegación del merge (guardas G1–G4)

Asiento de `Knowledge-Conformacion-Pull-Request-Automatico` §3.1, presente **sólo en `AGENTS.md`** (commit `be83e8e`), no en la fuente (ver §8).

| Elemento | Contenido | Fuente |
| --- | --- | --- |
| Fecha y responsable | Decidida por el PO el 2026-08-31, reafirmada 2026-09-14, ampliada por escrito 2026-10-27; la ejerce el agente que conduce la unidad | `AGENTS.md` §Delegación del merge |
| Testimonio | Literal del PO del 2026-10-27 (evitar «preguntas y confirmaciones tontas»; orquestación autónoma por subagentes) | `AGENTS.md` §Delegación del merge |
| G1–G4 | PR abierto y sin conflicto; `mergeable_state` `clean`; controles en verde sobre el SHA de la cabeza; merge commit atado a ese SHA. Después: borrar la rama y comprobar el 404 | `AGENTS.md` §Delegación del merge |
| Techo / intervalo | 60 min por PR / relectura cada 60 s | `AGENTS.md` §Delegación del merge |
| Excepción | Cuestionamiento particular sobre la unidad o decisión irreversible con efecto externo → manual; revocable por unidad sin derogar el asiento | `AGENTS.md` §Delegación del merge |

Los workflows que producen los checks → índice 12.

## 7. Bitácora de eventualidades (`EVE-xxxxx`)

`SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md` (`DOC-PRODUCTO-BITACORA-EVENTUALIDADES-01`, v1.1, 2026-08-30; instrumento `Rules-Documentacion.md` §0.6 y §4.2).

| Regla | Contenido | Sección |
| --- | --- | --- |
| Naturaleza | Buffer de captura, no destino; ninguna se cierra sin `destino` (o `No absorbida` con motivo) | §1 |
| Campo clave | `intentos_descartados`: lo probado que no funcionó | §1 |
| No es deriva | La deriva mide contra una línea base; la eventualidad es un hecho imprevisto del entorno | §1 |
| Nace poblada | Emitida 2026-08-30 para cerrar `I-01`; entradas reales de los samples (2026-08-27..30) | §2 |
| Campos | `ambito`, `fecha`, `momento`, `sintoma`, `causa`, `resolucion`, `intentos_descartados`, `destino` | §3 |

| ID | Ámbito | Fecha | Hecho → resolución | Destino |
| --- | --- | --- | --- | --- |
| `EVE-00001` | Api | 2026-08-30 | Kestrel gana sobre `ASPNETCORE_URLS`; publicar `-p <libre>:5080` | `Guia-Contenedor` |
| `EVE-00002` | producto | 2026-08-29 | Contenedor deja archivos de root; `-u "$(id -u):$(id -g)"` + `DOTNET_CLI_HOME` | `Guia-Contenedor` |
| `EVE-00003` | Infrastructure | 2026-08-29 | SQLite WAL deja `.db`, `-wal`, `-shm`; `ClearAllPools()` y borrar los tres | `Runbook-Operacion` |
| `EVE-00004` | Visor | 2026-08-30 | `file://` bloquea `fetch` y módulos ES; datos por `<script>` clásico | `Conceptos-Fundamentales` del visor |
| `EVE-00005` | producto | 2026-08-29 | SDK sin `jq`/`python3`/`sqlite3`; no se agregan: `escapar.awk` y apps C# de un archivo | `Guia-Contribucion` |
| `EVE-00006` | producto | 2026-08-30 | App de un archivo necesita `#:project`; `JsonSerializer` con reflexión da `IL2026`/`IL3050` como error | `Guia-Contribucion` |
| `EVE-00007` | producto | 2026-08-30 | Puerto colisiona con el despliegue del PO; contenedor y almacén propios (`ConnectionStrings__Store`) | `Guia-Contenedor` |
| `EVE-00008` | producto | 2026-08-30 | `coverage.sh` sale 2 con batería en verde: `TestResults/` acumulados matan el recolector; limpiarlos en cada proyecto | `Guia-Contribucion` (+ mejora candidata a `coverage.sh`) |

Triaje (§4): **ninguna cerrada**, todas con destino asignado y **pendientes de propagación**; tres de los cuatro documentos destino no existen (`Planificado`). `AGENTS.md` §Notas del entorno resume EVE-00001, 00002, 00005 y 00006.

## 8. Divergencias verificadas

| Divergencia | Fuente A | Fuente B |
| --- | --- | --- |
| Delegación G1–G4 (2026-10-27) está en el derivado y no en la fuente, contra la regla «manda el contrato» | `AGENTS.md` §Delegación del merge | `Contrato-Agentes.md` §6 (sin G1–G4) |
| Versión del contrato: frontmatter 1.0 / 2026-08-30 frente a control de cambios 1.1 / 2026-09-14 | `Contrato-Agentes.md` frontmatter | `Contrato-Agentes.md` §Control de cambios |
| `AGENTS.md` dice «las siete eventualidades»; la bitácora tiene ocho | `AGENTS.md` §Notas del entorno | `Bitacora-Eventualidades.md` §3 |
| EVE-00008 propone que `coverage.sh` borre `TestResults/` de cada proyecto; el guion sólo borra el de la raíz (`rm -rf TestResults`, línea 42) | `Bitacora-Eventualidades.md` EVE-00008 | `scripts/coverage.sh` |
| `.editorconfig` habla de «seis proyectos»; el contrato de siete | `.editorconfig` línea 1 | `Contrato-Agentes.md` §1 |

## 9. A dónde ir, por intención

La tabla «Quiero… → Documento» vive en `Contrato-Agentes.md` §7 (12 filas; `AGENTS.md` resume 7). Declara no emitidos (`DD-R9-2`): `Vision-General-Sistema.md`, `Guia-Inicio-Rapido.md`, `Guia-Despliegue.md`, `Runbook-Operacion.md`, `Recorrido-Codigo.md`, `Guia-Contribucion.md`, `Conceptos-Fundamentales.md`. Los destinos se indexan en 01 (corpus), 06 (Contratos-REST), 12 (onboarding y publicación), 13 (samples) y 14 (norma).

## 10. README raíz

`README.md` (9 líneas) es **un puntero y no replica estado**: estado → `SDD/Docs/README.md` §7; cambios del código → `changelog.md`; cómo trabajar → `AGENTS.md`. Se describe como «laboratorio de geometría de la cátedra, público de consulta».
