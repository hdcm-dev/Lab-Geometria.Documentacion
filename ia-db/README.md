# ia-db — Fábrica de Geometría (`Lab-Geometria`)

> **Instrucción para IA.** Este archivo es el **punto de entrada único** a la base de conocimiento
> del proyecto `Lab-Geometria`. Leelo primero y completo; después cargá **sólo** los uno o dos
> índices que la tabla de navegación indique para tu tarea. No recorras el repositorio entero
> (**1.888 archivos** versionados) ni cargues el corpus `SDD/` completo: son **1.329 archivos**,
> **650** de ellos vivos (149.243 líneas), y todo lo que necesitás para ubicarte está destilado acá.
> Cada afirmación de estos índices referencia su fuente: cuando necesites el detalle, abrí la fuente
> que el índice nombra, no el árbol.

---

## 1. Tabla de navegación

| Necesitás saber… | Leé este índice |
| --- | --- |
| Qué es el producto, con qué stack, en qué estado está cada etapa (incluida la `i` abierta y la `k` cerrada), qué etiquetas hay y cuánto mide | [`indexes/00_MASTER-INDEX.md`](indexes/00_MASTER-INDEX.md) |
| Dónde vive cada documento del corpus `SDD/` —intake, manifiesto, las dos unidades, `Audit/`, el expediente `0001`— y qué autoridad tiene cada uno | [`indexes/01_Corpus-Documental-SDD.md`](indexes/01_Corpus-Documental-SDD.md) |
| Cómo está partido el código: los siete proyectos, el grafo con la clase de cada arista, los **31** de la solución, la configuración compartida y cómo se hablan las dos unidades | [`indexes/02_Arquitectura-Y-Proyectos.md`](indexes/02_Arquitectura-Y-Proyectos.md) |
| Las cinco entidades, los conjuntos cerrados, los nueve invariantes, las dieciséis reglas, las tres máquinas de estado, el catálogo de condiciones y la derivación de valores | [`indexes/03_Dominio-Y-Reglas-De-Negocio.md`](indexes/03_Dominio-Y-Reglas-De-Negocio.md) |
| Los diecisiete puntos de acceso bajo `/v1/`, los tipos que viajan, los códigos de error y su traducción, el límite de tasa, las cabeceras y el documento OpenAPI | [`indexes/04_Superficie-HTTP-Y-Contratos.md`](indexes/04_Superficie-HTTP-Y-Contratos.md) |
| Las quince rutas del front, su tubería y sus guardianes, la sesión, el sistema visual, el sello de versión, el aviso de datos personales y el bundle del visor | [`indexes/05_Front-Web-Y-Visor-3D.md`](indexes/05_Front-Web-Y-Visor-3D.md) |
| El almacén y su esquema, el arranque, el respaldo, la firma del acceso, la revocación, la cuota de intentos, el origen real, las cabeceras de seguridad, las imágenes sin root y los datos personales | [`indexes/06_Persistencia-Y-Seguridad.md`](indexes/06_Persistencia-Y-Seguridad.md) |
| Las cuatro baterías y cuántas pruebas tiene cada una, las puertas `QG-*`, técnicas, de etapa y de árbol, sus umbrales y qué corre en CI | [`indexes/07_Pruebas-Y-Puertas-De-Calidad.md`](indexes/07_Pruebas-Y-Puertas-De-Calidad.md) |
| Cómo se construye, se corre y se publica: los guiones, **las tres imágenes**, `compose.yaml` (que no es el despliegue), la publicación real, la regla de etiquetar y los tres flujos | [`indexes/08_DevOps-Construccion-Y-Despliegue.md`](indexes/08_DevOps-Construccion-Y-Despliegue.md) |
| Los **veinte** samples de `samples/`, cuáles tienen código, cómo se corre cada clase y qué declaran sus README contra el árbol | [`indexes/09_Samples-Ejecutables.md`](indexes/09_Samples-Ejecutables.md) |
| Cómo se nombra algo antes de escribirlo, el contraste de la norma con el árbol y qué significa cada término o familia de identificador | [`indexes/10_Glosario-Y-Nomenclatura.md`](indexes/10_Glosario-Y-Nomenclatura.md) |
| Las 59 ADR, las auditorías de fase, las migraciones normativas, las mesas y lo que queda abierto | [`indexes/11_Decisiones-Auditorias-Y-Pendientes.md`](indexes/11_Decisiones-Auditorias-Y-Pendientes.md) |
| Qué se verificó al construir esta base, con qué instrumento, y las 74 divergencias registradas (O-1 a O-74) | [`indexes/12_Observaciones-Del-Indexado.md`](indexes/12_Observaciones-Del-Indexado.md) |

---

## 2. Resumen ejecutivo

| Campo | Valor |
| --- | --- |
| Producto | **Fábrica de Geometría** — la cátedra lo llama «el laboratorio» |
| Repositorio indexado | `PROG2/Geometria/Lab-Geometria`, rama `main`, revisión `4b114d7` (fusión del PR #233, 2026-09-15), etiquetada `v1.2.0` |
| Repositorio de esta base | `PROG2/Geometria/Lab-Geometria.Documentacion` |
| Tipo | Laboratorio de cátedra, público de consulta: **dos unidades de entrega** (`GeometriaFactory-Api`, `GeometriaFactory-Web`) sobre **siete proyectos de código**; la solución agrupa **31** proyectos |
| Stack | C# sobre **.NET 10**, versión por **MinVer 8.0.0** — ASP.NET Core en el servicio de datos (`JwtBearer` y `OpenApi` 10.0.11, **Scalar.AspNetCore 2.16.20**), **Blazor Interactive Server** en el front (sin MudBlazor) —, **EF Core 10.0.11 sobre SQLite**, **TypeScript 5.6.3 + webpack 5.95.0 + three.js 0.169.0** en el visor; pruebas con xUnit 2.9.2, NUnit 4.2.2 + Playwright 1.49.0 y coverlet 6.0.4 |
| Estado | **Ocho etapas comprometidas cerradas (`a`–`h`)**; la **`i`, despliegue real, realizada desde el 2026-09-06 y abierta**: le faltan `PT-05` medida desde la facultad y el circuito presenciado con un alumno; la **`k`, API pública y versionado, cerrada** con OK del PO del 2026-09-13; `j…` sin especificar (00 §4) |
| Marco documental | Framework **SDD**, procedencia **13.16** desde la migración del 2026-09-13 (expediente `0001`); vive en `IA/IA.SDD` y no se copia al repositorio |

**Qué hace.** El alumno de Programación 2 pega el texto que emite su propio programa; el producto
lo interpreta, reconstruye las figuras, **señala las discrepancias entre el valor que el alumno
declaró y el que se deriva de las dimensiones**, y las dibuja en tres dimensiones. El docente
habilita cuentas, revisa lo que la comisión entregó y deja su desenlace. Ese par
declarado/derivado —el error de fórmula que hoy pasa desapercibido— es el motivo de existir del
producto (`SDD/Docs/README.md` §1, `AGENTS.md`).

**Cómo está armado, en una línea.** Un servicio de datos REST versionado en la ruta (`/v1/`), que
sostiene el dato y las reglas sobre una única base SQLite y autentica **personas**, no aplicaciones;
un front que es el **único punto de contacto del navegador** y que llama al servicio **servidor a
servidor** con credencial firmada; y un bundle de visor 3D que es un **visualizador puro**: sin red,
sin configuración y sin identidad. Desde el 2026-09-12 la API se ofrece también a aplicaciones
propias además del front (00 §1).

**Qué cambió desde la 3.0.** 204 commits entre `89f3ab3` y `4b114d7`: la fase `k` (contrato bajo
`/v1/`, MinVer, límite de tasa, OpenAPI y Scalar), todo el código bajo el árbol de solución
(`DC-5`), la migración normativa SDD 13.7 → 13.16, el retiro de `evidencia/` de la raíz y las mesas
de seguridad del 2026-09-14 y del 2026-09-15 (00 §4.2).

---

## 3. Estructura de esta base

```text
ia-db/
├── README.md                            ← Punto de entrada único (este archivo)
└── indexes/
    ├── 00_MASTER-INDEX.md               Producto, stack, etapas, etiquetas, magnitudes
    ├── 01_Corpus-Documental-SDD.md      Mapa del corpus `SDD/` y del expediente 0001
    ├── 02_Arquitectura-Y-Proyectos.md   Proyectos, grafo, los 31 de la solución, transversales
    ├── 03_Dominio-Y-Reglas-De-Negocio.md Entidades, invariantes, reglas, estados, derivación
    ├── 04_Superficie-HTTP-Y-Contratos.md Rutas `/v1/`, tipos, códigos, tasa, OpenAPI
    ├── 05_Front-Web-Y-Visor-3D.md       Rutas, tubería, sesión, sistema visual, sello, visor
    ├── 06_Persistencia-Y-Seguridad.md   Almacén, respaldo, credenciales, defensas de las mesas
    ├── 07_Pruebas-Y-Puertas-De-Calidad.md Baterías, puertas, umbrales, CI, instrumentos
    ├── 08_DevOps-Construccion-Y-Despliegue.md Guiones, las tres imágenes, flujos, publicación
    ├── 09_Samples-Ejecutables.md        Los veinte samples
    ├── 10_Glosario-Y-Nomenclatura.md    Norma de nombres, vocabulario y familias de ID
    ├── 11_Decisiones-Auditorias-Y-Pendientes.md ADR, auditorías, mesas, abiertos
    └── 12_Observaciones-Del-Indexado.md Lo verificado y lo que no cuadró (O-1 a O-74)
```

---

## 4. Restricciones para un agente que use esta base

Las siete primeras vienen de la tabla «Límites» de `AGENTS.md` (l.55–67) del repositorio indexado,
que a su vez **deriva de `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`**: si los dos
divergen, manda el contrato (`AGENTS.md` l.3–5).

- **`PROMPTs/` de cualquier repositorio es del Product Owner.** Se lee, no se escribe.
- **`SDD/Docs/_legacy/` es registro histórico.** Reescribirlo le hace decir a una emisión vieja
  algo que no dijo.
- **El intake y los requerimientos técnicos son documentos humanos.** Lo desalineado **se eleva, no
  se corrige**.
- **`PRODUCT-MANIFEST` y los apartamientos se declaran, no se ejercen por conveniencia.**
- **El almacén de trabajo no se toca con rutinas destructivas sin archivo propio.** El 2026-08-15
  una corrida de guiones se llevó una cuenta.
- **Los contenedores `lab-geometria-web` y `lab-geometria-api` son el despliegue real del Product
  Owner**: ni `exec`, ni reinicio, ni lectura de sus volúmenes. Un servicio de prueba se levanta
  aparte, con puerto libre y almacén propio. Los `gf-*` que nombraba la 3.0 ya no corren.
- **Fusionar un PR de `Lab-Geometria` y borrar su rama lo hace el agente**, por decisión del Product
  Owner (2026-08-31, reafirmada el 2026-09-14), **con los checks en verde y sin reserva. Con reserva,
  entrega el enlace y espera** (`AGENTS.md` l.65). La 3.0 decía que era del Product Owner: ya no lo
  dice la fuente.
- **Cuando dos mediciones del mismo hecho no coinciden, no se elige la que conviene**: se revisan
  las dos — y en este repositorio suele estar mal la más elaborada (`AGENTS.md` l.67).
- **Esta base no reemplaza a las fuentes.** Cuando la evidencia contradiga un índice, **manda la
  evidencia**: corregí el índice y anotalo en
  [`indexes/12_Observaciones-Del-Indexado.md`](indexes/12_Observaciones-Del-Indexado.md).
- **Los índices tienen fecha.** Todo lo que declaran vale al **2026-10-26** sobre la revisión
  `4b114d7`; para el avance vivo de la construcción la fuente es `changelog.md` y el historial del
  repositorio — y cuando no coinciden, **gana el historial** (`changelog.md` l.8). Qué versión corre
  hoy en producción no está en el repositorio: la informa `/salud` (00 §4.3).

---

## Manifiesto de generación

- Generado por : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Iniciar-Indexado.md`
  (invocado desde `/PROG2/Geometria/Lab-Geometria.Documentacion/PROMPTs/Indexado/Crear-Indexado.md`)
- Profile      : `/IA/PROMPTs/IA.Prompts/PromptFramework/Profiles/Knowledge-Indexing.md`
- Modo         : proyecto único, con destino explícito fuera del proyecto indexado
- Alcance      : `PROG2/Geometria/Lab-Geometria` (rama `main`, `4b114d7`, del 2026-09-15)
- Fuentes      : sólo lo versionado (`git ls-files`): `README.md`, `AGENTS.md`, `changelog.md`,
  `Directory.Build.props`, `.editorconfig`, `.gitignore`, `GeometriaFactory.sln`,
  `coverlet.runsettings`, `pruebas-e2e.runsettings`, `SDD/` (sin `_legacy/`; incluye `Intake/`,
  `Docs/` y `Expedientes/`), `src/`, `tests/`, `visor/` (`src/`, `verification/`, `package.json`,
  `webpack.config.js`, `tsconfig.json`, el `.csproj`), `samples/`, `scripts/`, `tools/`, `deploy/`
  (incluido `deploy/e2e/`), `.github/workflows/`, y el historial de git `89f3ab3..4b114d7`.
  `evidencia/` ya no está en el árbol (retirada en el PR #207): se citó desde el historial, sólo por
  nombre de carpeta
- Exclusiones  : `.git`, `.vscode`, `.devcontainer`, `.config`, `bin/`, `obj/`, `node_modules/`,
  `TestResults/`, `resultados-e2e/`, `visor/dist/`, `.publish-web/`, todo `_legacy/` (679 archivos,
  incluido `SDD/Docs/_legacy/`), `SDD/Maquetas/` (17, sólo se contaron), bases de datos, binarios e
  imágenes (de `evidencia/`, sólo nombres de carpeta), lo ignorado por el `.gitignore` del proyecto
  y la propia ia-db
- Generado     : 2026-10-26 · Versión: **4.0**
- Procedencia  : **regeneración completa** de la base 3.0 del 2026-09-11 (revisión `89f3ab3`),
  pedida por el Product Owner al invocar `Crear-Indexado.md`. Entre las dos revisiones hay **204
  commits** (`git rev-list --count 89f3ab3..4b114d7`), 46 fusiones de primer padre (PR #187 a #233)
  y 428 archivos cambiados. Método: **doce regeneradores**, uno por índice 00 a 11, sin copiar
  cifras de la 3.0; **dos escépticos por índice** (magnitudes y trazabilidad); corrección de lo
  confirmado; el índice 12 volvió a medir cada divergencia candidata; y un crítico de coherencia
  entre índices. Lo que cambió de contenido, además de la fase `k`, `DC-5`, la migración 13.16 y las
  mesas del 09-14 y 09-15:
  - 00: estado de `i` criterio por criterio (la puerta `verify-stage-i.sh` queda NO CONFORME mientras
    `PT-05` siga sin medir), desglose diario de los 204 commits, etiquetas `v1.0.0`–`v1.2.0`, y
    `Audit/` en 120 archivos (103 `.md` + 17 `.json`).
  - 01: el expediente `0001`, intake 3.4 → 5.1 y manifiesto 5.4 → 7.1; las líneas del corpus vivo
    recontadas (106.633 en los 580 `.md`, 149.243 en los 650 archivos).
  - 02: la solución de 9 a 31 proyectos; la herencia de `MinVer` desde `Directory.Build.props` en los
    proyectos «sin paquetes»; las once carpetas de samples fuera de `verify-solution-tree.sh`.
  - 03: autorregistro por dominio (`Api ADR-00012`, PR #220) y las seis guardas de argumento del
    dominio.
  - 04: rutas bajo `/v1/`, límite de tasa, cabeceras, OpenAPI y las tres respuestas sin código del contrato.
  - 05: tokens de `app.css` acotados al bloque `:root`, bundle generado por el `.csproj` sin `.map`.
  - 06: cascada de borrado, `CredentialChangedAt`, cuota de intentos (`ADR-00011`), origen real,
    cabeceras de seguridad, imágenes sin root, Ley 25.326.
  - 07: 389 métodos de prueba (E2E 28), la puerta de árbol y la de `i`.
  - 08: tres imágenes, `compose.yaml` como verificación, la publicación real (`R-13`) y etiquetar
    antes de desplegar.
  - 09: veinte samples (entra `api/04-cliente-http-basico`), 52 escenarios `E[1-8].txt`.
  - 10: 174 clases `.gf-*`, contraste de enums de la norma, familias de identificador acotadas.
  - 11: 59 ADR, la fase I de auditoría, la mesa delegada y las mesas 08-31 a 09-15.
  - 12 — **estado de las observaciones**: de las nueve de la 3.0, O-1, O-2 y O-3 siguen vigentes
    (O-2 creció; O-3 con magnitud nueva), O-4, O-5, O-6, O-8 y O-9 quedaron resueltas (PR #208,
    #218, #187, #187 y #188), y O-7 a medias; se suman **65 nuevas, O-10 a O-74** (O-46 registrada
    como `R-22`; O-52 como `RE-04`, pendiente).
- Actualizar   : `/IA/PROMPTs/IA.Prompts/Tool-Prompts/Indexado-Documentado/Actualizar-Indexado.md`
