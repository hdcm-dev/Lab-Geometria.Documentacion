# 13 · Samples ejecutables por capa y nivel

> **Propósito:** ubicar los 20 samples de `samples/`, qué demuestra cada uno, cómo se corre, contra qué snapshot se compara y qué documento de la categoría `10-Examples` lo gobierna; más la colección de peticiones reproducible (`CU-00012`, muestra `S-2`) y el reporte de hallazgos que produjeron los samples.
> **Fuente primaria:** `samples/README.md` 2.3 (2026-09-13) y los `README.md` de cada carpeta; `SDD/Docs/Unidades-Entrega/*/10-Examples/`; `SDD/Docs/Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md`.
> **Revisión:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** la puerta que exige que todos estén en la solución (`scripts/verify-solution-tree.sh` → índice 11); las capas que ilustran (04 arquitectura, 05 dominio, 06 HTTP, 07 persistencia, 08 seguridad, 09 front, 10 visor).

---

## 1. Panorama

| Dato | Valor | Fuente |
| --- | --- | --- |
| Carpetas | **20**, una por contrato de verificación | `samples/README.md` §1, §3 |
| Reparto | Domain 3 · Contracts 3 · Application 3 · Infrastructure 3 · Api **4** · Visor 3 · Web 1 (3×5+4+1) | `samples/README.md` §3 |
| Con código y corriendo | **17** | `samples/README.md` cabecera y §1 |
| En esqueleto | **3** (`contracts/01..03`): README y comando previsto, sin código | `samples/contracts/*/README.md` |
| Estructura | `samples/<proyecto>/<NN-slug>/` — nivel extra de espacio de nombres por proyecto de código, desvío declarado de `Rules-Examples.md` §2.3 | `samples/README.md` §2 |
| En la solución | Las 20: 9 `Sample.*.csproj` construidos (domain, application, infrastructure) + 11 nodos `Microsoft.Build.NoTargets/3.7.56` inertes (visor, api, contracts, web) | `samples/README.md` §1; `samples/api/01-basico/Sample.Api.Basico.csproj` |
| Decisión que lo origina | DC-5 del PO (2026-09-11): todo proyecto bajo el árbol de solución | `samples/README.md` §1 |
| Gobierno | `PRODUCT-INTAKE` §16.1 y `Rules-Examples.md` §2.1 | `samples/README.md` encabezado |

### 1.1 Árbol

```
samples/
├── README.md                  # índice de las 20 carpetas (2.3)
├── domain/        01-basico · 02-intermedio · 03-avanzado          # dotnet run, construidos con la .sln
├── application/   01-basico · 02-intermedio · 03-avanzado          # dotnet run, dobles en memoria
├── infrastructure/01-basico · 02-intermedio · 03-avanzado          # dotnet run, 02/03 con almacén propio
├── contracts/     01-basico · 02-intermedio · 03-avanzado          # ESQUELETO
├── api/           01-basico · 02-intermedio · 03-avanzado · 04-cliente-http-basico   # bash run.sh contra el servicio
├── visor/         01-basico · 02-intermedio · 03-avanzado          # npm run verify (Playwright 1.48.0)
└── web/           01-datos-seed                                    # bash run.sh, siembra
```

### 1.2 Anatomía repetida de una carpeta

| Pieza | Dónde aparece | Papel |
| --- | --- | --- |
| `README.md` | todas | copia corta de §1, §3 y §4 del documento gobernante; estado y fecha de la última corrida |
| `Program.cs` + `Actos/`/`Recorrido/` (+ `Bitacora.cs` sólo en domain y application) | domain, application; infrastructure/02–03 con `Actos/` sin `Bitacora.cs`; `infrastructure/01-basico` sólo `Program.cs`, `Escenarios/`, `tests/` | recorrido en actos numerados que imprime la bitácora |
| `tests/SalidaEsperada.cs` | domain, application, infrastructure | comparación contra el snapshot de §6 (corre siempre desde `H-13`) |
| `Dobles/` (`RelojFijo`, repositorios en memoria, `ValidadorDeFigurasDeclarado`) | application/01..03 | sustitutos de los puertos |
| `Escenarios/` · `cuerpos/` · `datos/` (`E1.txt`…`E8.txt`) | 11 carpetas en 5f07b12 (api/01, api/02, api/04, application/02, domain/02, infrastructure/01, infrastructure/02, visor/01–03, web/01); `samples/README.md` §5 todavía dice «siete» (divergencia: índice 19) | escenarios del intake §20 transcriptos sin modificación |
| `run.sh` + `peticiones/` o `coleccion/` + `esperado/salida.txt` | api/01 (`peticiones/`), api/02 (`coleccion/`); api/03 lleva `Actos/` + `almacenes/` + `esperado/`; web/01 lleva `datos/` + `verificacion/esperado.txt` | guion HTTP con `curl` y su snapshot |
| `escapar.awk` | api/01, 02, 04; web/01 | escapa el texto del escenario para el cuerpo JSON |
| `index.html` + `anfitrion.js` + `tests/*.mjs` + `package.json` | visor | página anfitriona y verificación con Playwright |
| `Sample.<Segmento>.<Nivel>.csproj` | todas | proyecto real o nodo inerte de solución |

**Convención de escenarios:** extensión `.txt` y no `.json`, porque `E-2` no es JSON estrictamente válido (comas finales) — `samples/README.md` §5.

---

## 2. Las 20 carpetas

Estado = última corrida declarada en `samples/README.md` §3 (líneas que coinciden con §6 del documento gobernante).

### 2.1 Domain (`GeometriaFactory-Domain`)

| Carpeta | Qué muestra | Comando | Sonda | Estado | Gobernante |
| --- | --- | --- | --- | --- | --- |
| `samples/domain/01-basico/` | Ciclo de vida de una cuenta: configurar administrador, alta de alumno, habilitar con provisoria, admisibilidad | `dotnet run --project samples/domain/01-basico` | VER-01 · SD-01 | CONFORME 10/10 · 2026-09-12 | `…/GeometriaFactory-Api/10-Examples/ejemplo-01-basico-dominio.md` |
| `samples/domain/02-intermedio/` | Un trabajo real: constitución, adopción de piezas y observaciones (interpretación), envío; escenarios E1, E3–E6, E8 | `dotnet run --project samples/domain/02-intermedio` | VER-02 · SD-02 | CONFORME 13/13 · 2026-09-12 | `…/ejemplo-02-intermedio-dominio.md` |
| `samples/domain/03-avanzado/` | Acceso, alcance del administrador, desenlace, reseteo; `Inspeccion/` sobre la superficie tipada (condiciones tipadas, dependencias salientes, sin reloj ni conjunto) | `dotnet run --project samples/domain/03-avanzado` | VER-03 · SD-03 | CONFORME 13/13 · 2026-09-12 | `…/ejemplo-03-avanzado-dominio.md` |

### 2.2 Application (`GeometriaFactory-Application`)

| Carpeta | Qué muestra | Comando | Sonda | Estado | Gobernante |
| --- | --- | --- | --- | --- | --- |
| `samples/application/01-basico/` | La cuenta entra: alta, administrador, cambio de credencial y la guarda de admisibilidad | `dotnet run --project samples/application/01-basico` | VER-01 · SD-01 | CONFORME 12/12 · 2026-09-12 | `…/ejemplo-01-basico-aplicacion.md` |
| `samples/application/02-intermedio/` | Los ocho trabajos del alumno: cargar y reeditar, enviar interpretado, consultar lo propio, eliminar (E1–E8 + `ResultadosDeclarados.cs`) | `dotnet run --project samples/application/02-intermedio` | VER-02 · SD-02 | CONFORME 14/14 · 2026-09-12 | `…/ejemplo-02-intermedio-aplicacion.md` |
| `samples/application/03-avanzado/` | El administrador: gobierno de cuentas, revisión de la comisión (`Semilla/ComisionDeEjemplo.cs`), desenlace, reseteo | `dotnet run --project samples/application/03-avanzado` | VER-03 · SD-03 | CONFORME 15/15 · 2026-09-12 | `…/ejemplo-03-avanzado-aplicacion.md` |

### 2.3 Infrastructure (`GeometriaFactory-Infrastructure`)

| Carpeta | Qué muestra | Comando | Sonda | Estado | Gobernante |
| --- | --- | --- | --- | --- | --- |
| `samples/infrastructure/01-basico/` | Leer el texto del alumno y verificar sus números sin abrir el almacén (E1–E8; es la muestra `S-3`) | `dotnet run --project samples/infrastructure/01-basico` | VER-01 · SD-01 | CONFORME 13/13 · 2026-09-12 | `…/ejemplo-01-basico-infraestructura.md` |
| `samples/infrastructure/02-intermedio/` | El almacén: materializar, consultar con recorte, retirar, arrastrar, cuentas (`Almacen.cs`, `Contexto.cs`) | `dotnet run --project samples/infrastructure/02-intermedio` | VER-02 · SD-02 | CONFORME 14/14 · 2026-09-12 (almacén propio) | `…/ejemplo-02-intermedio-infraestructura.md` |
| `samples/infrastructure/03-avanzado/` | Mecanismos que no guardan: derivar y verificar credencial, provisoria, acceso firmado, reloj, preparar almacén; inspección `SinSecretosEnLaFuente` | `dotnet run --project samples/infrastructure/03-avanzado` | VER-03 · SD-03 | CONFORME 18/18 · 2026-09-12 (almacén propio) | `…/ejemplo-03-avanzado-infraestructura.md` |

### 2.4 Contracts (`GeometriaFactory-Contracts`) — esqueleto

| Carpeta | Tema declarado | Comando previsto | Estado |
| --- | --- | --- | --- |
| `samples/contracts/01-basico/` | Frontera de sesión y de cuentas: cuatro campos y ninguno que filtre | `dotnet run --project samples/contracts/01-basico` | Esqueleto — sin código |
| `samples/contracts/02-intermedio/` | Trabajo, listado y detalle: texto original intacto, proyección que no arrastra | `dotnet run --project samples/contracts/02-intermedio` | Esqueleto — sin código |
| `samples/contracts/03-avanzado/` | Error, desenlace y reseteo: quince códigos vivos | `dotnet run --project samples/contracts/03-avanzado` | Esqueleto — sin código |

Sin documento gobernante propio: la categoría 10 se emite por unidad de entrega y Contracts es de las dos (`samples/README.md` §1). Enlace roto a `SDD/Docs/Proyectos/…`: ver índice 19, O-7.

### 2.5 Api (`GeometriaFactory-Api`)

| Carpeta | Qué muestra | Comando | Sonda | Estado | Gobernante |
| --- | --- | --- | --- | --- | --- |
| `samples/api/01-basico/` | Canje, guardia y envío que no verifica (E5, E8) en seis peticiones (`peticiones/01..06`); `esperado/codigos-del-contrato.txt` | `bash samples/api/01-basico/run.sh` (exige `reset-db` + `run-api` + clave por entorno) | VER-01 · SD-01 | 11/13 con divergencias declaradas · 2026-08-30 | `…/ejemplo-01-basico-api.md` |
| `samples/api/02-intermedio/` | **Colección de peticiones reproducible** (`S-2`, `CU-00012`): ocho pasos en `coleccion/1..8` | `bash samples/api/02-intermedio/run.sh` | VER-02 · SD-02 | 22/23 · 2026-08-30 | `…/ejemplo-02-intermedio-api.md` |
| `samples/api/03-avanzado/` | Composición de raíz y arranque en dos fases: actos de arranque sano/detenido, salud, inspección de composición; `almacenes/almacen.cs` | `bash samples/api/03-avanzado/run.sh` | VER-03 · SD-03 | 9/10 · 2026-08-31 (única divergencia: `503` de A-16 sin camino) | `…/ejemplo-03-avanzado-api.md` |
| `samples/api/04-cliente-http-basico/` | Cliente propio contra `/v1/` **sin el repositorio**: descubrir el contrato en `/openapi/v1.json`, canjear, listar, enviar E1 y alcanzar la cuota leyendo el `429` con `Retry-After` (lo que VER-00004 verifica y los otros tres no pueden — `…/GeometriaFactory-Api/10-Examples/README.md` §3); `verificar.sh` compara contra snapshot | `API_EMAIL=... API_PASSWORD=... bash samples/api/04-cliente-http-basico/run.sh` (sólo `curl`, `bash`, `awk`, `sed`) | VER-00004 · SD-00004 | CONFORME 6/6 · 2026-09-13 (servicio en 5081, copia fuera del repo) | `…/ejemplo-04-cliente-http-basico-api.md` |

Variables de entorno leídas por los guiones: `GF_API_BASE` (api/01–02, web/01), `GF_API_PUERTO` (api/03, `run.sh` l. 18), `API_TOPE_CUOTA`, `API_BASE_URL`, `API_EMAIL`, `API_PASSWORD` (api/04) — `samples/api/*/run.sh`, `samples/web/01-datos-seed/run.sh`. Ninguna contraseña real escrita: las claves se producen al correr y la provisoria la devuelve el servicio (`samples/api/02-intermedio/run.sh` cabecera). Direcciones escritas: api/03 usa `http://127.0.0.1:$puerto` (l. 19) y api/04 usa por omisión la de producción `https://api-geometria.aplicada.stream` (`run.sh` l. 29, declarada en su README).

`api/04` entró el 2026-09-13 por `BT-00034` (fase k) — `samples/README.md` §1 y control de cambios 2.1.

### 2.6 Visor (`GeometriaFactory-Visor`)

| Carpeta | Qué muestra | Comando | Sonda | Estado | Gobernante |
| --- | --- | --- | --- | --- | --- |
| `samples/visor/01-basico/` | Página integradora mínima: crear la escena, dibujar E-1, liberar (`datos/POR-QUE-DOS-ARCHIVOS.md`) | `bash scripts/build-visor.sh && npm --prefix samples/visor/01-basico run verify` | VER-01 · SD-13 | CONFORME 9/9 · 2026-09-12 | `…/GeometriaFactory-Web/10-Examples/ejemplo-01-basico.md` |
| `samples/visor/02-intermedio/` | Árbol y escena sincronizados por índice; ninguna pieza desaparece sin aviso (E2, E5–E8) | íd. con `02-intermedio` | VER-02 · SD-14 | CONFORME 16/16 · 2026-09-12 (doc 2.1, acto `[15]` `onPieceSelected`) | `…/ejemplo-02-intermedio.md` |
| `samples/visor/03-avanzado/` | Seis funciones sin backend, dos movimientos prendidos, contador de red en cero; pruebas `gobierno-del-movimiento`, `puertas-tecnicas`, `seis-funciones-sin-backend`, `comparar` | íd. con `03-avanzado` | VER-03 · SD-15 | CONFORME 17/17 · 2026-09-12 | `…/ejemplo-03-avanzado.md` |

Las tres carpetas son las tres partes de la muestra `S-1` (página integradora sin backend) — `samples/README.md` §4.

### 2.7 Web (`GeometriaFactory-Web`)

| Carpeta | Qué muestra | Comando | Sonda | Estado | Gobernante |
| --- | --- | --- | --- | --- | --- |
| `samples/web/01-datos-seed/` | Siembra el dato de la demostración: un docente, dos alumnos, ocho escenarios enviados y dos resueltos; sin navegador ni front construido | `bash samples/web/01-datos-seed/run.sh` (exige `run-api` y `reset-db`; identidades ficticias en `identidades.env.ejemplo`, dominio `ejemplo.edu`) | VER-01 · SD-62 | 13/13 sin divergencias · 2026-08-30 | `…/GeometriaFactory-Web/10-Examples/ejemplo-01-datos-seed.md` 1.1 |

Snapshot: `samples/web/01-datos-seed/verificacion/esperado.txt`.

---

## 3. Muestras nombradas del intake §18

| Muestra | Qué es | Dónde vive |
| --- | --- | --- |
| `S-1` | Página integradora sin backend (punto de extensión) | `samples/visor/01..03` |
| `S-2` | Colección de peticiones HTTP de la API | `samples/api/02-intermedio/` |
| `S-3` | Juego de datos de los ocho escenarios en archivos sueltos | `samples/infrastructure/01-basico/Escenarios/` |

Fuente: `samples/README.md` §4.

---

## 4. Colección de peticiones reproducible (`CU-00012`)

Fuente: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/10-Examples/CU-00012-Ejercitar-La-Superficie-Con-La-Coleccion-De-Peticiones-Reproducible.md` 1.4 (Aprobado). Implementación: `samples/api/02-intermedio/run.sh` + `coleccion/`.

**Reproducibilidad:** 3 pasos sobre un máximo de 5 (intake §18): reiniciar el almacén → correr el servicio → ejecutar la colección (§4).

| # | Archivo | Qué ejercita | Puntos de acceso |
| --- | --- | --- | --- |
| 1 | `coleccion/1-administrador` | Configurar administrador y comprobar que un segundo intento no procede (INV-05) | A-03 |
| 2 | `coleccion/2-cuenta-de-alumno` | Registrar, habilitar (devuelve provisoria) y cambiar contraseña | A-02, A-01, A-06, A-07, A-05 |
| 3 | `coleccion/3-canje-de-los-dos-papeles` | Canjear como alumno y como administrador | A-01 |
| 4 | `coleccion/4-envio-de-los-ocho` | Enviar los ocho escenarios como cuerpo (`cuerpos/E1..E8.txt`) | A-10 |
| 5 | `coleccion/5-listado-y-detalle` | Listar y abrir detalle con los dos papeles | A-13, A-14 |
| 6 | `coleccion/6-desenlace` | Aprobar uno y rechazar otro, con y sin comentario | A-15 |
| 7 | `coleccion/7-caminos-prohibidos` | Forzar contra la superficie lo que las reglas prohíben (bloqueante del intake) | A-12, A-15, A-11 |
| 8 | `coleccion/8-reseteo-y-confinamiento` | Resetear y comprobar confinamiento al cambio | A-09, A-05, A-13 |

| Criterio | Exige | Fuente |
| --- | --- | --- |
| CA-01 | 3 pasos desde clon limpio dentro del entorno contenido | `CU-00012` §8 |
| CA-02 | Cuerpos idénticos a los escenarios del intake §20 (0 inventados, 0 modificados) | íd. |
| CA-03 | 8 envíos, 8 éxitos, 6 en `Pendiente` y 2 en `Borrador` | íd. |
| CA-04 | Dos corridas con reinicio entre medio dan el mismo resultado | íd. |
| CA-05 | El paso 7 fuerza eliminación fuera de `Borrador`, eliminación ajena y desenlace indebido | íd. |
| CA-06 | Tras el reseteo la guardia rechaza; tras el cambio, la misma petición procede | íd. |
| CA-07 | 0 claves de firma, contraseñas reales o direcciones de producción en los archivos | íd. |
| CA-08 | Ejercita 13 de 15 puntos (A-01..03, A-05..07, A-09..15); A-08 y A-16 se declaran fuera | íd. |

---

## 5. Documentos `10-Examples` por unidad

Cada `ejemplo-*.md` sigue las diez secciones de `Rules-Examples.md` §4.2: 1 Objetivo · 2 Nivel · 3 Prerequisites · 4 Cómo correrlo · 5 Estructura del código · 6 **Qué esperar** (el snapshot que se compara) · 7 Variaciones · 8 Trazabilidad · 9 Contrato de verificación · 10 Control de cambios (`…/ejemplo-01-basico-api.md`).

### 5.1 `GeometriaFactory-Api/10-Examples/` (README 2.1, 2026-09-13)

Advertencia (README de 10-Examples Api §2): los `CU-00001`..`CU-00012` de las filas 01–03 son de la numeración previa al renumerado a `CU-00021`–`CU-00029`; en 5f07b12 los `CU-00001`..`CU-00008` sólo existen en `SDD/Docs/_legacy/2026-08-16-consolidacion-8.5/GeometriaFactory-Api/`. El 04 usa la vigente.

| Documento | Carpeta | Setup | CU ilustrados |
| --- | --- | --- | --- |
| `ejemplo-01-basico-api.md` | `samples/api/01-basico/` | 5-10 min | CU-00001, CU-00002, CU-00009 |
| `ejemplo-02-intermedio-api.md` | `samples/api/02-intermedio/` | 5-10 min | CU-00003..00008, CU-00012 |
| `ejemplo-03-avanzado-api.md` | `samples/api/03-avanzado/` | 10-15 min | CU-00010, CU-00011 |
| `ejemplo-04-cliente-http-basico-api.md` | `samples/api/04-cliente-http-basico/` | 2-5 min | CU-00022, CU-00026, CU-00028 |
| `ejemplo-0N-<nivel>-dominio.md` (×3) | `samples/domain/0N-*` | — | ver documento |
| `ejemplo-0N-<nivel>-aplicacion.md` (×3) | `samples/application/0N-*` | — | ver documento |
| `ejemplo-0N-<nivel>-infraestructura.md` (×3) | `samples/infrastructure/0N-*` | — | ver documento |
| `CU-00012-…Coleccion-De-Peticiones-Reproducible.md` | `samples/api/02-intermedio/` | — | (§4 de este índice) |

Decisiones del README: los cuatro `ejemplo-01-basico` **no se consolidaron** (cuatro contratos distintos; salida S4) y se renombraron `ejemplo-0N-<nivel>-<proyecto>.md`; lo absorbido por la fusión M10 está en `_legacy/2026-08-16-consolidacion-m10/` (§0). Cobertura declarada: 12/12 casos de uso y 8/8 escenarios (§2). Fuente: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/10-Examples/README.md`.

### 5.2 `GeometriaFactory-Web/10-Examples/`

| Documento | Carpeta | Nota |
| --- | --- | --- |
| `ejemplo-01-datos-seed.md` | `samples/web/01-datos-seed/` | único sample de la tabla maestra del README (§2); 10-15 min; CU-10005, CU-10006, CU-10008; 3/10 CU, 8/8 escenarios |
| `ejemplo-01-basico.md` | `samples/visor/01-basico/` | visor |
| `ejemplo-02-intermedio.md` | `samples/visor/02-intermedio/` | visor, 2.1 |
| `ejemplo-03-avanzado.md` | `samples/visor/03-avanzado/` | visor |

Por qué hay un sample de Web y no dos: §4 del README (progresión por capacidad, slug `datos-seed` de `Rules-Examples.md` §2.3 para `web-monolith`). Fuente: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/10-Examples/README.md`.

---

## 6. Reporte de hallazgos de los samples

Fuente: `SDD/Docs/Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md` (§0 es el único índice de estado). **14 emitidos: 12 cerrados, 2 retirados, 0 vivos.**

| # | Qué era | Estado |
| --- | --- | --- |
| H-01 | Una selección rechazada borraba la vigente (visor) | Cerrado 08-30 |
| H-02 | Apagar un movimiento no deshacía lo hecho → apagar es **detener** (PO) | Cerrado 08-30 |
| H-03 | `POST /interpretaciones` expuesto sin contrato → adoptado como A-18 | Cerrado 08-31 |
| H-04 | `Issue` devolvía `null` para dos fallas | Retirado |
| H-05 | Infraestructura declara 2 códigos y los ejemplos pedían 6 | Cerrado 08-30 |
| H-06 | Traza y síntoma en el arranque detenido → salida `78` | Cerrado 08-30 |
| H-07 | `401` sin código de contrato (deliberado por `Contratos-REST.md` §5.1) | Retirado |
| H-08 | El barrido de `ADR-08006` no llegó a la categoría 10 | Cerrado 08-30 |
| H-09 | Código `UNKNOWN` acuñado aguas abajo | Cerrado 08-30 |
| H-10 | `RA-03` dependía de una variable de entorno | Cerrado 08-30 |
| H-11 | Sin manejador: `500` vacío → `ContractErrorHandler` | Cerrado 08-30 |
| H-12 | Apartamientos sin forma de §11 → `ADR-00004` 2.0 §2.1 | Cerrado 08-31 |
| H-13 | Siete samples .NET no verificaban con su comando → comparación siempre, 9/9 CONFORME | Cerrado 08-30 |
| H-14 | Códigos de facultad sin traducción (15; 3 parcheados) | Cerrado 08-31 |

Tres abiertos **fuera del producto** que el reporte registra: matriz de propagación de ADR en el framework (Reporte 21), disparador (iii) de `ADR-00004` §2.1, y rol conciliador de la mesa (`Mesa-2026-08-31.md` §8bis) — reporte §0. El detalle de mesas va al índice 16; las ADR, al 15.

Recuento histórico del reporte §2 (16 samples al 2026-08-30): cinco cerraban exactos (los tres de domain, `infrastructure/01-basico`, `web/01-datos-seed`); el resto con divergencias declaradas; varias se absorbieron al pasar los §6 a 2.0, pero `samples/README.md` §3 sigue registrando api/01–03 con divergencias (11/13, 22/23, 9/10), con `ejemplo-01-basico-api.md` en 1.1 y `ejemplo-02-intermedio-api.md` en 1.0.

---

## 7. Observaciones verificadas al indexar

Las divergencias corpus/árbol/historial de los samples (enlaces a `SDD/Docs/Proyectos/…` en `contracts/01..03` y en «Sonda de sensado» de `api/01..03/README.md` l. 9; 13/13 frente a 11/13 en api/01; evidencia retirada a `git show 3662bf9^:evidencia/…`; «siete» carpetas de escenarios) se registran en el índice 19 (O-7 y siguientes), no aquí.

| Id | Observación | Fuentes |
| --- | --- | --- |
| O-13.3 | Los README de api/01–03 y application/01 rotulan el enlace con el nombre previo al renombre (`ejemplo-01-basico.md`) aunque la ruta apunta al nombre nuevo `…-api.md`/`…-aplicacion.md`. | `samples/api/0*/README.md`; `…/GeometriaFactory-Api/10-Examples/README.md` §0 |
| O-13.4 | No verificable en esta indexación: no se corrió ningún sample; los estados son los declarados (última corrida 2026-09-13). | `samples/README.md` §3 |
