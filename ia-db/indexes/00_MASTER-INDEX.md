# 00 · Índice maestro — visión, stack, decisiones clave y mapa de navegación

> **Propósito.** Dar en una sola lectura qué es la Fábrica de Geometría, con qué está hecha, qué
> decisiones la gobiernan y en qué estado está; y, sobre todo, **a qué índice ir según la pregunta**.
> No desarrolla ningún dominio: cada fila remite al índice `01`–`19` que lo cubre.
> **Fuente primaria.** `SDD/Docs/README.md` (2.9), `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md`
> (7.1), `AGENTS.md`, `Directory.Build.props`, `visor/package.json`, `changelog.md` y el historial git.
> **Revisión indexada.** `Lab-Geometria` `main` `5f07b12` (PR #234, 2026-10-27) · ia-db 4.0 · 2026-11-01.
> Rutas relativas a la raíz del repositorio `Lab-Geometria`.

---

## 1. El producto en cinco renglones

El alumno de Programación 2 pega el texto JSON que emite su propio programa; el producto **lo
interpreta, reconstruye las figuras, señala las discrepancias entre el valor declarado y el derivado
de las dimensiones, y las dibuja en tres dimensiones**. El docente habilita cuentas, revisa lo que la
comisión entregó y deja su desenlace (`AGENTS.md` «Qué es este repositorio»; `SDD/Docs/README.md` §1).
El par declarado/derivado —el error de fórmula que hoy pasa desapercibido— es el motivo de existir del
producto. La audiencia son dos personas del aula (alumno y docente); desde la fase `k` la Api expone
además un contrato público bajo `/v1/` (detalle: `02`, `06`).

## 2. Ficha

| Campo | Valor | Fuente |
| --- | --- | --- |
| Producto | **Fábrica de Geometría** («el laboratorio» de la cátedra), público de consulta | `README.md`, `SDD/Docs/README.md` §1 |
| Tipo | Laboratorio de cátedra: **2 unidades de entrega** sobre **7 proyectos de código** | `PRODUCT-MANIFEST` §2.A/§2.B |
| Lenguaje y plataforma | C# sobre **.NET 10** (`net10.0`, `TreatWarningsAsErrors`, `Nullable`, `InvariantGlobalization`) | `Directory.Build.props` |
| Servicio de datos | ASP.NET Core (rutas `Map{Get,Post,Delete}` bajo `/v1`), JWT Bearer, OpenAPI + Scalar 2.16.20 | `src/GeometriaFactory.Api/GeometriaFactory.Api.csproj` |
| Persistencia | **EF Core 10.0.11 sobre SQLite**, archivo único, escritor único | `src/GeometriaFactory.Infrastructure/*.csproj`, `ADR-06002` |
| Front | **Blazor** con render en el servidor y circuito interactivo | `ADR-10001` |
| Visor 3D | **TypeScript 5.6.3 + webpack 5.95.0 + three.js 0.169.0**, proyecto `NoTargets` | `visor/package.json`, `visor/geometriafactory-visor.csproj` |
| Pruebas | xUnit (Domain, Application, Integration) + NUnit con `Microsoft.Playwright.NUnit` (E2E) | `tests/*/*.csproj` → índice `11` |
| Versionado | **MinVer 8.0.0** desde etiquetas `v*`; última `v1.2.0` (HEAD = `v1.2.0-5-g5f07b12`) | `Directory.Build.props`, `git describe --tags` |
| Despliegue | Contenedores (`deploy/Dockerfile`, `deploy/Dockerfile.web`) en el servidor propio tras túnel con dominio propio; FTP como canal alternativo manual | índice `12` §10 |
| Marco documental | **SDD**, procedencia **13.16** (vive en `IA/IA.SDD`, no se copia al repo) | `PRODUCT-MANIFEST` §1.1 |

## 3. Composición en una mirada

```text
Navegador ──HTTP (circuito interactivo)──▶ GeometriaFactory-Web (Blazor Server + bundle del visor)
                                   │  HTTP servidor-a-servidor, credencial firmada, /v1/
                                   ▼
                            GeometriaFactory-Api ──EF Core──▶ SQLite (archivo único)
Referencias (7 ProjectReference + 1 activo de construcción):
  Application → Domain · Infrastructure → Domain, Application · Api → Application, Infrastructure, Contracts
  Web → Contracts · visor ─(bundle, scripts/build-visor.sh)─▶ Web
```

Detalle del grafo, orden topológico y arranque: `04`. El diagrama resume `PRODUCT-MANIFEST` §2.C/§3
y los `ProjectReference` de `src/*/*.csproj`.

## 4. Decisiones clave (sólo el titular; el catálogo de 60 ADR está en `15`)

| Decisión | Fuente | Mecanismo en |
| --- | --- | --- |
| `RA-01` Ningún guion del navegador invoca el servicio de datos | intake §14 | `02`, `09` |
| `RA-02` El bundle del visor es un **visualizador puro** (sin red, configuración ni identidad) | intake §14; `ADR-12003` | `10` |
| `RA-03` Todo lo que el navegador obtiene del backend pasa por el front; ningún mensaje expone un servicio interno | intake §14; `ADR-00004` | `06`, `09` |
| Host delgado; composición de raíz como único lugar de ensamblado | `ADR-00001` | `04` |
| Modelo de dominio rico, invariantes explícitas, cero dependencias | `ADR-02001` | `05` |
| Archivo único, escritor único, una unidad de trabajo por operación | `ADR-06002` | `07` |
| Derivación de clave anclada, parámetros versionados junto al valor | `ADR-06004` | `08` |
| La Api autentica **personas**, no aplicaciones | `ADR-00009` | `08` |
| Versión en la ruta, sólo el MAJOR (`/v{MAJOR}/`); supera en parte a `ADR-00008` | `ADR-00010` | `06` |
| Autorregistro por dominios que declara el despliegue; canje protegido por cuenta | `ADR-00012`, `ADR-00011` | `08` |
| Render en el servidor con circuito interactivo; una sola salida al servicio de datos | `ADR-10001` | `09` |
| La ayuda de usuario acompaña sin resolver el trabajo (última ADR, 2026-10-27) | `ADR-10010` | `09` |
| La versión la calcula MinVer desde etiquetas; nada la escribe a mano | `Directory.Build.props` (mesa 2026-09-12, `D-03`) | `12` |
| Merge del PR por el agente, por delegación del PO, con guardas G1–G4 | `AGENTS.md` «Delegación del merge» | `18` |

## 5. Estado en una línea por fase

| Fase | Estado a `5f07b12` |
| --- | --- |
| `a`–`h` (andamiaje → circuito de revisión) | **Cerradas**; OK del PO de las ocho el 2026-08-18 |
| `i` · Despliegue real | **Realizada (2026-09-06) y no cerrada**: faltan `PT-05` desde la facultad y el circuito presenciado |
| `j…` · Agregados (F-15..F-17) | No planificada |
| `k` · API pública `/v1/` y versionado | **Cerrada** con OK del PO el 2026-09-13 (`v1.0.0`, `v1.1.x`) |

Fuentes: `SDD/Docs/README.md` §7.2, `SDD/Docs/00-Contexto/Roadmap-Producto.md`. Tabla completa,
criterios y lista única de pendientes: `03`. Lo fusionado después de la última entrada del
`changelog.md` (2026-09-15): PR #235 y #234 del 2026-10-27, sólo documentales (`19` N-1).

---

## 6. Mapa de navegación: pregunta → índice

### 6.1 Producto, alcance y avance

| Si la pregunta es… | Índice |
| --- | --- |
| ¿Qué necesidad de negocio cubre, qué capacidades `F-nn` tiene y cuáles quedaron fuera? | [`02_Requerimientos-Necesidades-Y-Alcance.md`](02_Requerimientos-Necesidades-Y-Alcance.md) |
| ¿Qué dicen `RA-01..03`, las exclusiones `X-n` o las asunciones del intake? | `02` |
| ¿En qué etapa está, qué cerró cada una, con qué PR y qué falta para cerrar `i`? | [`03_Roadmap-Avance-Backlog-Y-Pendientes.md`](03_Roadmap-Avance-Backlog-Y-Pendientes.md) |
| ¿Qué queda abierto hoy y quién lo cierra? (lista consolidada única) | `03` §8 |
| ¿Dónde están las historias `HU`, las tareas `BT-000nn`, el DoR y el Mini-Plan? | `03` §6–§7 |

### 6.2 Código y arquitectura

| Si la pregunta es… | Índice |
| --- | --- |
| ¿Cuáles son los 7 proyectos, sus capas, el grafo y el orden de construcción? | [`04_Arquitectura-Y-Proyectos.md`](04_Arquitectura-Y-Proyectos.md) |
| ¿Cómo arranca cada `Program.cs`, la composición de raíz y el arranque en dos fases? | `04` §11–§13 |
| ¿Qué entidades, valores, invariantes `INV`, reglas `RN`/`RC` y máquinas de estado hay? | [`05_Dominio-Interpretacion-Y-Reglas-De-Negocio.md`](05_Dominio-Interpretacion-Y-Reglas-De-Negocio.md) |
| ¿Cómo se interpreta el texto del alumno y se compara declarado contra derivado? | `05` §9 |
| ¿Qué rutas expone la Api bajo `/v1/`, qué tipos viajan y qué `ErrorCode` devuelve? | [`06_Superficie-HTTP-Y-Contratos.md`](06_Superficie-HTTP-Y-Contratos.md) |
| ¿Cómo se traduce un motivo de Application a código HTTP? ¿Qué política de deprecación rige? | `06` §7, §13 |
| ¿Dónde y cómo se guarda; qué migraciones hay; cómo se respalda y restaura? | [`07_Persistencia-Y-Almacen.md`](07_Persistencia-Y-Almacen.md) |
| ¿Cómo se autentica, se firma el acceso, se revoca, se limita la tasa y se sostiene la sesión? | [`08_Seguridad-Identidad-Y-Sesion.md`](08_Seguridad-Identidad-Y-Sesion.md) |
| ¿Qué pantallas hay (15 `@page`), qué componentes y cómo llama el front al servicio? | [`09_Front-Web-Y-Experiencia-De-Uso.md`](09_Front-Web-Y-Experiencia-De-Uso.md) |
| ¿Qué dicen los wireframes, la línea base visual, las maquetas HTML y la ayuda de usuario? | `09` §8–§9 |
| ¿Cómo funciona el visor 3D, su fachada de seis funciones y cómo se genera el bundle? | [`10_Visor-3D.md`](10_Visor-3D.md) |

### 6.3 Calidad, entrega y ejemplos

| Si la pregunta es… | Índice |
| --- | --- |
| ¿Qué baterías de prueba hay, qué puertas `QG`/`verify-*`/`PT` y cómo se corre cada una? | [`11_Pruebas-Puertas-Y-Calidad.md`](11_Pruebas-Puertas-Y-Calidad.md) |
| ¿Cómo se construye, qué variables pide, qué imágenes hay y qué hace cada workflow? | [`12_DevOps-Construccion-Versionado-Y-Despliegue.md`](12_DevOps-Construccion-Versionado-Y-Despliegue.md) |
| ¿Cómo se despliega en el servidor propio, cómo se vuelve atrás y qué es el canal FTP? | `12` §10 |
| ¿Cómo lo levanto en limpio en mi máquina? | `12` §13 |
| ¿Hay un ejemplo que corra para una capa dada, y qué colección de peticiones existe? | [`13_Samples-Ejecutables.md`](13_Samples-Ejecutables.md) |

### 6.4 Lenguaje, decisiones y proceso

| Si la pregunta es… | Índice |
| --- | --- |
| ¿Cómo se nombra un concepto en código? ¿Qué significa un término? | [`14_Glosario-Y-Nomenclatura.md`](14_Glosario-Y-Nomenclatura.md) |
| ¿Qué ADR rige un tema, cuál supera a cuál, qué decidió el PO (`D1`–`D11`)? | [`15_Decisiones-ADR.md`](15_Decisiones-ADR.md) |
| ¿Qué mesa o auditoría encontró algo, y cómo terminó? ¿Qué es una reanudación? | [`16_Mesas-Auditorias-Y-Reanudaciones.md`](16_Mesas-Auditorias-Y-Reanudaciones.md) |
| ¿Qué migración normativa produjo una carpeta `_legacy/`? ¿Qué es el expediente 0001? | [`17_Migraciones-Normativas-Y-Expedientes.md`](17_Migraciones-Normativas-Y-Expedientes.md) |
| ¿Qué tiene que hacer un agente antes de terminar un cambio, qué no toca y cómo fusiona? | [`18_Forma-De-Trabajo-Y-Agentes.md`](18_Forma-De-Trabajo-Y-Agentes.md) |
| ¿Le pasó a alguien este problema de entorno (puerto, permisos, herramienta)? | `18` §7 (bitácora `EVE-xxxxx`) |
| ¿Dónde está un documento del corpus `SDD/` y qué autoridad tiene sobre otro? | [`01_Corpus-Documental-SDD.md`](01_Corpus-Documental-SDD.md) |
| ¿Qué cifras se recontaron y qué divergencias entre fuentes quedaron a la vista? | [`19_Observaciones-Del-Indexado.md`](19_Observaciones-Del-Indexado.md) |

## 7. Rutas de lectura por tarea (entrada + 1–2 índices)

| Tarea | Leer |
| --- | --- |
| Agregar o cambiar un endpoint | `06` → `05` (regla) → `11` (puertas) |
| Cambiar una regla de interpretación o de estado de un trabajo | `05` → `11` |
| Tocar una pantalla o la ayuda de usuario | `09` → `14` (nombres) |
| Tocar el visor | `10` → `11` (ciclo del visor, PT-02/PT-03) |
| Cambiar el esquema | `07` → `12` (respaldo antes de desplegar) |
| Tocar autenticación, sesión o límite de tasa | `08` → `06` |
| Desplegar o volver atrás | `12` §10 → `07` §8 |
| Preparar un PR | `18` → `11` |
| Proponer una decisión | `15` → `16` |
| Ubicar un documento histórico | `17` → `01` |

## 8. Lo que más cuesta si no se sabe

| Hecho | Fuente | Detalle en |
| --- | --- | --- |
| En desarrollo el servicio escucha en **5080**, no en 8080: la configuración de Kestrel gana sobre `ASPNETCORE_URLS`; publicar `-p <libre>:5080` (las imágenes de `deploy/` exponen 8080) | `AGENTS.md` «Notas del entorno»; `src/GeometriaFactory.Api/appsettings.Development.json` | `12` §5, §7 |
| Sin `ConnectionStrings__Store` el servicio no arranca, a propósito | `scripts/store-path.sh`, `appsettings*` | `07` §8, `12` §5 |
| `AccessToken__SigningKey` (secreto, ≥ 32 bytes) no está en el repo ni en la imagen; sin ella el servicio no arranca | `scripts/run-api.sh`; `Guia-Publicacion-Image-Docker.md` §2.2 | `08` §4, `12` §5 |
| `TreatWarningsAsErrors`: una advertencia detiene la construcción (`QG-01`) | `Directory.Build.props` | `11`, `12` |
| `lab-geometria-web` y `lab-geometria-api` son el despliegue real del PO: ni `exec`, ni reinicio, ni lectura de volúmenes | `AGENTS.md` «Límites» | `18` §5 |
| La imagen del SDK no trae `jq`, `python3` ni `sqlite3`; no se agregan | `AGENTS.md` «Notas del entorno» | `18` |
| `coverage.sh` sale 2 si no pudo medir: **2 no es aprobación** | `AGENTS.md` «Probar» | `11` §3 |

## 9. Vigencia

Todo lo que esta base declara vale sobre `5f07b12`. Para el avance vivo, la fuente es
`changelog.md` y el historial git; cuando difieren, **gana el historial** (regla de `changelog.md`,
`03` §4). Para saber qué cambió después, ver el manifiesto de [`../README.md`](../README.md).

## 10. Regla de entrega de la documentación (expediente 0003)

Entrada agregada el 2026-11-02 sobre Lab-Geometria `main` `e1b21c8`, fuera de la regeneración de la 3.0
(que sigue midiendo `89f3ab3`).

| Pieza | Dónde | Qué fija |
| --- | --- | --- |
| Regla de entrega, `RD-GEO-002` | Lab-Geometria · [`docs-as-code/regla-de-entrega.md`](https://github.com/hdcm-dev/Lab-Geometria/blob/main/docs-as-code/regla-de-entrega.md) (texto en `:27-32`) | Todo documento de estos dos repositorios públicos lleva `delivery: publico`; el agente hereda la audiencia de su usuario y por este canal sólo recibe `publico` |
| Registro de audiencias, `AUD-GEO-001` | Lab-Geometria · [`docs-as-code/AUD-geometria.md`](https://github.com/hdcm-dev/Lab-Geometria/blob/main/docs-as-code/AUD-geometria.md) | A quién se entrega cada pieza, con qué nivel y dónde se cumple |

Texto de la regla, el mismo que en `regla-de-entrega.md:27-32`:

```text
Regla de entrega (expediente 0003). En Lab-Geometria y Lab-Geometria.Documentacion, ambos públicos, todo
documento lleva `delivery: publico`; no se crean piezas `producto`, `restringido` ni `interno`. El agente
hereda la audiencia de su usuario y por este canal sólo recibe `publico`. La ayuda de uso explica el campo
y el formato; la discrepancia la comenta la capa de pistas (expediente 0002) y la ayuda no la duplica.
La forma de la API es pública cuando `Documentacion:Publicada` está encendida (/openapi/v1.json,
/documentacion); su instantánea la regenera la automatización. Control: `delivery-publico` en docs.yml.
```

Esta base es material `publico`. El control `delivery-publico` corre en Lab-Geometria
(`scripts/docs-local.sh:87`); este repositorio no tiene compuerta propia.
