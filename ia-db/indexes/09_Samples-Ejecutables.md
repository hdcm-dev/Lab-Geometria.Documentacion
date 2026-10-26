# 09 · Samples ejecutables — el camino más rápido para entender una capa

> **Propósito.** Qué muestra cada sample, cuál corre y cuál no, cómo se invoca cada clase y qué
> dicen sus README contra lo que hay en el árbol: el mejor lugar para ver qué hace **de verdad**
> una capa.
> **Fuente primaria.** `samples/README.md` 2.3, los veinte `samples/<capa>/<nivel>/README.md`, las
> categorías `10-Examples` de las dos unidades de entrega
> (`SDD/Docs/Unidades-Entrega/GeometriaFactory-{Api,Web}/10-Examples/`) y
> `SDD/Docs/Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md` 11.0. Archivos contados con
> `git ls-files samples` (238 archivos versionados, 82 `.cs`).
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. Qué son

`samples/` es la materialización en código de la categoría **10-Examples**: la categoría documenta
el sample y el código vive acá, gobernado desde §16.1 del `PRODUCT-INTAKE` (`samples/README.md`
cabecera). **Los samples corren y se comparan contra el §6 de su documento**, y donde no coinciden
lo declaran renglón por renglón con su motivo (`AGENTS.md` línea 90: «Es el lugar más rápido para
entender qué hace de verdad una capa»).

**Un segmento por proyecto de código.** `Rules-Examples.md` §2.3 supone un proyecto por
repositorio; acá hay siete, de modo que la estructura es `samples/<proyecto>/<XX-slug>/` para que
las carpetas base no colisionen. Es carpeta extra y no renombre de las base, que es lo único que
§2.3 admite (`samples/README.md` §2).

**Archivos de escenario en `.txt`, nunca `.json`**: el texto de `E-2` no es JSON estrictamente
válido (dos comas finales) y una herramienta que lo reformatee rompería la comparación carácter
por carácter que exige `RN-08` (`samples/README.md` §5).

## 2. Los veinte, y cuáles tienen código

Veinte carpetas `samples/<segmento>/<NN-…>` (contadas con `git ls-files samples | awk -F/ '{print
$2"/"$3}' | sort -u`), una por contrato de verificación: 3 de Domain, 3 de Contracts, 3 de
Application, 3 de Infrastructure, **4** de Api, 3 del Visor y 1 de Web.

| Capa · nivel | Qué muestra | Archivos | Estado declarado en su README |
| --- | --- | --- | --- |
| `domain/01-basico` | Ciclo de vida de una cuenta, de la configuración del administrador a la admisibilidad | 9 | Implementado y verificado (2026-08-29) |
| `domain/02-intermedio` | Un trabajo real del alumno: constitución, adopción de la interpretación y envío | 16 | Implementado y verificado (2026-08-29) |
| `domain/03-avanzado` | Acceso, alcance del administrador y desenlace, con la superficie tipada bajo inspección | 13 | Implementado y verificado (2026-08-29) |
| `application/01-basico` | La cuenta entra al laboratorio: alta, administrador, credencial y **la guarda que corta primero** | 12 | 12/12 con §6 |
| `application/02-intermedio` | Los ocho trabajos del alumno: carga, envío interpretado, consulta y retiro | 22 | 14/14 |
| `application/03-avanzado` | El administrador: gobierno de las cuentas, revisión de la comisión, desenlace y reseteo | 14 | 15/15 |
| `infrastructure/01-basico` | Leer el texto del alumno y verificar sus números, **sin abrir el almacén** | 12 | 13/13 «a la primera» |
| `infrastructure/02-intermedio` | El almacén: guardar, recuperar con el recorte ya decidido, retirar y arrastrar | 15 | 14/14 |
| `infrastructure/03-avanzado` | Los mecanismos que no guardan nada: credencial, provisoria, acceso firmado, reloj y arranque | 11 | 18/18; las dos inspecciones de umbral cero dan 0 |
| `api/01-basico` | El canje, la guardia y **el envío que no verifica: por qué esa respuesta es exitosa** | 14 | 13/13 |
| `api/02-intermedio` | **La colección de peticiones reproducible**: los ocho escenarios contra la superficie ensamblada | 21 | 22/23; la que no coincide es contradicción del propio documento |
| `api/03-avanzado` | Composición de raíz y arranque en dos fases: qué pasa antes de la primera petición | 10 | 9/10; la divergencia es el `503` de `A-16`, sin camino y declarado |
| `api/04-cliente-http-basico` | **Nuevo.** Un cliente propio contra `/v1/`, sin el código fuente | 10 | 6/6 (2026-09-13, servicio de la rama en `127.0.0.1:5081`) |
| `visor/01-basico` | La página integradora mínima: crear la escena, dibujar `E-1` y liberar | 10 | 9/9 |
| `visor/02-intermedio` | Árbol y escena **sincronizados por índice**, y ninguna pieza que desaparezca sin aviso | 13 | 16/16 (documento 2.1, acto `[15]`) |
| `visor/03-avanzado` | Las seis funciones sin backend, con los dos movimientos prendidos y **el contador de red en cero** | 15 | 17/17 |
| `web/01-datos-seed` | Datos seed: la comisión desde la que arranca el guion de demostración | 14 | 13/13, sin divergencias |
| `contracts/01-basico` | La frontera de sesión y de cuentas: cuatro campos y ninguno que filtre | 2 | **Esqueleto — sin código** |
| `contracts/02-intermedio` | Trabajo, listado y detalle: el texto original que viaja intacto y la proyección que no arrastra | 2 | **Esqueleto — sin código** |
| `contracts/03-avanzado` | Error, desenlace y reseteo: quince códigos vivos y una frontera que no filtra | 2 | **Esqueleto — sin código** |

Fuente de «Qué muestra»: la primera línea de cada README. «Estado»: su renglón `**Estado de esta
carpeta:**`. Los conteos N/N coinciden con las líneas del snapshot donde es un archivo de texto
(`wc -l`: `api/01` 13, `api/02` 23, `api/03` 10, `api/04` 6, `visor/01` 9, `visor/02` 16,
`visor/03` 17, `web/01` 13). Los de dominio no dan N/N en su renglón de estado; `samples/README.md`
§3 sí: `CONFORME 10/10`, `13/13` y `13/13` al 2026-09-12.

**Diecisiete con código, tres sin él** (`samples/README.md` cabecera: «diecisiete implementadas y
corriendo; tres en esqueleto»). Los dos archivos de cada `contracts/` son su README y su nodo de
solución inerte; ninguno afirma tener código. **`contracts/` no tiene documento gobernante
propio**: la categoría 10 se emite por unidad de entrega y `Contracts` es proyecto de código de las
dos (`samples/README.md` §1). Los documentos gobernantes son diecisiete: trece `ejemplo-*.md` en
`GeometriaFactory-Api/10-Examples/` y cuatro en `GeometriaFactory-Web/10-Examples/`.

### 2.1 Las últimas corridas declaradas

| Fecha | Qué se corrió | Fuente |
| --- | --- | --- |
| 2026-08-30 | Los dieciséis originales, primera implementación: cinco exactos, once con divergencias | Reporte de hallazgos §2 |
| 2026-08-30/31 | Corrección de los §6 (documentos a 2.0) hasta que «los dieciséis samples cierran hoy sin divergencias» | Reporte 4.0; `api/03` de 7/10 a 9/10 en el 6.0 |
| 2026-09-12 | Doce re-corridos al entrar a la solución (domain, application, infrastructure y visor) | `samples/README.md` §1 y §3 |
| 2026-09-13 | `api/04-cliente-http-basico`, desde una copia fuera del repositorio | README del sample, cabecera y §4 |

Los samples de `api/01`, `api/02`, `api/03` y `web/01` **no se re-corrieron el 2026-09-12**: su
última corrida declarada es del 2026-08-30/31 (`samples/README.md` §3), anterior al prefijo `/v1/`
(`de0b73b`, 2026-09-12). Ese commit reescribió las peticiones de `api/01` (seis archivos y
`run.sh`), `api/02` (los ocho de `coleccion/`) y `web/01/run.sh` —16 archivos bajo `samples/`,
medido con `git show --stat de0b73b -- samples`—, y no tocó `api/03`. Que hoy pasen contra `/v1/`
**no está verificado** por corrida alguna citada en el árbol.

Las dos corridas de evidencia del 2026-09-12 y 2026-09-13 que cita `samples/README.md` §1 ya no
están en el árbol: se citan como `git show 3662bf9^:evidencia/…`, porque `evidencia/` se retiró por
decisión del Product Owner (PR #207; control de cambios 2.3).

## 3. Las tres muestras nombradas del intake §18

`samples/README.md` §4: §18 nombra tres demostraciones por su papel, **no son el conjunto de las
carpetas**.

| Muestra | Qué es | Dónde vive |
| --- | --- | --- |
| `S-1` | Página integradora sin backend, que prueba el punto de extensión | Las **tres** carpetas de `visor/`, que son sus tres partes |
| `S-2` | Colección de peticiones HTTP de la API | `api/02-intermedio/` (y su caso de uso `CU-00012` en `GeometriaFactory-Api/10-Examples/`) |
| `S-3` | Juego de datos de los ocho escenarios, en archivos sueltos | Los archivos de escenario de `infrastructure/01-basico/` |

## 4. Cómo se corre cada clase

| Clase | Invocación | Qué trae la carpeta |
| --- | --- | --- |
| .NET (`domain`, `application`, `infrastructure`) | `dotnet run --project samples/<capa>/<nivel>` | `Sample.<Capa>.<Nivel>.csproj` (`Microsoft.NET.Sdk`, `OutputType` `Exe`, `ProjectReference` a `src/`), la comparación en `tests/SalidaEsperada.cs`, y según el caso `Actos/`, `Dobles/`, `Escenarios/`, `Recorrido/`, `Inspeccion/`, `Inspecciones/` o `Semilla/` |
| API contra un servicio levantado (`api/01`, `api/02`) | `GF_API_BASE=http://127.0.0.1:5080 bash samples/api/<nivel>/run.sh` (sin `GF_API_BASE` no arranca) | `peticiones/` (seis, en `api/01`) o `coleccion/` (ocho, en `api/02`), `cuerpos/` con los escenarios y `escapar.awk`, `esperado/salida.txt`; `api/01` además `esperado/codigos-del-contrato.txt` |
| API que se levanta sola (`api/03`) | `bash samples/api/03-avanzado/run.sh` (puerto `GF_API_PUERTO`, por omisión 5080) | Arranca el servicio **dos veces** —almacén sano y uno de linaje desconocido, que no debe llegar a escuchar— en un directorio propio que borra al terminar; `Actos/`, `almacenes/` (`almacen.cs`, `linaje-desconocido.md`), `esperado/` |
| Cliente externo (`api/04`) | `API_EMAIL=... API_PASSWORD=... bash samples/api/04-cliente-http-basico/run.sh`; `API_BASE_URL` por omisión `https://api-geometria.aplicada.stream` | `run.sh`, `verificar.sh`, `peticiones/` (3), `cuerpos/E1.txt` y `escapar.awk`, `esperado/salida.txt` |
| Datos seed (`web/01-datos-seed`) | `GF_API_BASE=... bash samples/web/01-datos-seed/run.sh` (exige `run-api` y `reset-db`) | `datos/E1.txt` … `E8.txt` y `escapar.awk`, `identidades.env.ejemplo` (identidades ficticias que `run.sh` carga), `verificacion/esperado.txt` |
| Visor | `bash scripts/build-visor.sh && npm --prefix samples/visor/<nivel> run verify` | Página integradora (`index.html` + `anfitrion.js`), `package.json` cuyo `verify` corre `node tests/*.mjs` (uno en `01` y `02`, cuatro encadenados en `03`), `datos/`, `esperado/salida.txt` |

**`esperado/` no es universal**: los .NET comparan contra `tests/SalidaEsperada.cs` y `web/01`
contra `verificacion/esperado.txt`.

**El escapador `escapar.awk` existe en cuatro carpetas** (`api/01`, `api/02`, `api/04`, `web/01`)
porque los samples no usan `jq`: `api/04` lo dice explícito («ni `jq`, ni `.NET`, ni el
repositorio»).

**El servicio de los samples de `api/` escucha en 5080** (`api/01/run.sh` línea 20,
`api/03/run.sh` línea 18). Los contenedores `gf-api`, `gf-web`, `gf-back` y `gf-tunnel` son del
Product Owner y no se tocan (`scripts/pruebas-e2e.sh` línea 32).

**Los datos del visor van en dos archivos, con documento que explica por qué**
(`samples/visor/01-basico/datos/POR-QUE-DOS-ARCHIVOS.md`): `E1.txt` es lo que el alumno pega y
`E1-piezas.js` las piezas ya reconstruidas, que es lo que el visor recibe (`ADR-08006`).

## 5. El sample nuevo: `api/04-cliente-http-basico`

Entró el 2026-09-13 (`9413dfc`, `BT-00034`), gobernado por `ejemplo-04-cliente-http-basico-api.md`
1.0, contrato `VER-00004`, sonda `SD-00004`. Es **el cliente de referencia de una aplicación
propia** y **el único que corre sin el repositorio**: se copia la carpeta y alcanza con `curl`,
`bash`, `awk` y `sed`; no tiene ruta hacia `src/`, `scripts/` ni `SDD/` (README §2 y §4).

| Paso | Petición | Qué verifica |
| --- | --- | --- |
| 1 · contrato | `GET /openapi/v1.json` | `200`; **17** operaciones, **16** bajo `/v1/` y una exenta, `/salud` |
| 2 · canje | `POST /v1/auth/token` con las credenciales de una persona (`ADR-00009`: no hay clave de cliente) | `200`, acceso firmado recibido (no se imprime), papel `Student` |
| 3 · listado | `GET /v1/trabajos` con `Bearer` | `200` y una lista |
| 4 · envío | `POST /v1/trabajos` con `E-1` como texto | `201`, `Pendiente`, **2 advertencias**, 0 errores |
| 5 · cuota | `GET /v1/trabajos` en bucle, tope 130 | `429` con `Retry-After` entre 1 y 60 y sin cuerpo (`Contratos-REST.md` §4.1) |

La sexta línea es el pie; `verificar.sh` compara las seis contra `esperado/salida.txt`. **El paso 5
gasta la cuota de la persona a propósito** (sesenta por minuto por omisión). Exige un alumno ya
habilitado: el sample no crea cuentas. Lo que dejó a la vista (README §5): `E-1` queda en
`Pendiente` y no en `Borrador`; el `429` llegó en la petición 61 de la ventana; y el documento
OpenAPI dice `"version": "1.0.0"` mientras `/salud` dice `1.1.0+…`, porque es la versión del
documento y no del producto.

## 6. Los samples en el árbol de solución

| Forma | Carpetas | Archivo de proyecto |
| --- | --- | --- |
| Construidos con la solución (desde 2026-09-12, `6cc6f86`) | Las **nueve** de `domain/`, `application/`, `infrastructure/` | `Sample.<Capa>.<Nivel>.csproj`, `Microsoft.NET.Sdk` |
| Nodos inertes (desde 2026-09-13, `252809a`) | Las **once** de `visor/`, `api/`, `contracts/`, `web/` | `Sample.<Segmento>.<Nivel>.csproj` con `Sdk="Microsoft.Build.NoTargets/3.7.56"`, `EnableDefaultItems=false` y un único `None Include="**/*"` sin `bin/`, `obj/`, `node_modules/` |

Contado: 20 `.csproj` bajo `samples/` (9 `Microsoft.NET.Sdk`, 11 `NoTargets`), y los veinte
nombrados en `GeometriaFactory.sln`. Los nodos inertes **no tienen `Exec`, `Target` ni
`ProjectReference`**: el sample se sigue corriendo con su comando y el nodo sólo lo muestra
(`samples/README.md` §1). Es la decisión DC-5 del Product Owner del 2026-09-11; la aplicación del
2026-09-12 dejó afuera las once y nada lo notó, de modo que desde el 2026-09-13
`scripts/verify-solution-tree.sh` (controles A-2, A-3 y A-5 sobre samples) lo sostiene: **una
carpeta nueva entra con su nodo, en el mismo cambio**. La puerta y la solución entera están en
[`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) y
[`02_Arquitectura-Y-Proyectos.md`](02_Arquitectura-Y-Proyectos.md).

El nodo de cada `contracts/` declara en su comentario que, cuando el sample tenga código C#, «se
reemplaza por un `.csproj` construido con la solución, como los de `domain/`».

## 7. Lo que los samples encontraron

| Hallazgo | Qué fue | Fuente |
| --- | --- | --- |
| Hueco del contrato (`H-03`) | `api/03` contó sobre el OpenAPI publicado **diecisiete operaciones contra dieciséis declaradas**; la sobrante era `POST /interpretaciones`, contrapartida de `ADR-08006` que el barrido había llevado a la categoría 02 y no a la 05 ni a la 10. Se adoptó en `Contratos-REST.md` 1.5 | Reporte, línea 104 y fila 6.0 (2026-08-31) |
| El instrumento no comparaba (`H-13`) | Siete de los nueve samples .NET comparaban sólo detrás de `--verificar` y devolvían cero sin comparar con el comando declarado; ahora la comparación corre siempre | Reporte fila 4.0 |
| `E-1` en `Pendiente` | El envío de `E-1` deja el trabajo `Pendiente` con dos advertencias, distinto de `E-5` y `E-8`, que quedan en `Borrador` | `api/04` README §5 |

Estado del reporte: **catorce hallazgos emitidos, doce cerrados, dos retirados (`H-04`, `H-07`),
cero vivos** (`Reporte-Hallazgos-De-Los-Samples-2026-08-30.md` 11.0, §0). El detalle de cada
hallazgo y su decisión es de [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).

## 8. Lo que los README declaran y el árbol no sostiene

Medido sobre `4b114d7`; el detalle va en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).

| Qué | Medición |
| --- | --- |
| `samples/README.md` §3 da a `api/01-basico` «11/13 con divergencias declaradas · 2026-08-30 (reporte §2)» | El README del sample dice «las 13 líneas coinciden con §6» y el reporte 2.0 «su sample en 13/13»: la fila cita el primer recuento, ya superado |
| La fila de `web/01-datos-seed` en `samples/README.md` §3 | La celda de estado quedó en la línea 76, aparte de la fila (línea 75): la tabla se rompe al renderizar |
| `samples/README.md` §5: los escenarios `.txt` se guardan «en las siete carpetas que los usan» | `git ls-files samples \| grep -E '/E[1-8]\.txt$'`: **52 archivos en once carpetas** (`api/01` 2, `api/02` 8, `api/04` 1, `application/02` 8, `domain/02` 6, `infrastructure/01` 8, `infrastructure/02` 3, `visor/01` 1, `visor/02` 5, `visor/03` 2, `web/01` 8); ningún `.json` de escenario (los tres `.json` son `package.json` del visor) |
| `contracts/0N` declaran `dotnet run --project samples/contracts/0N` como comando previsto | El proyecto en esas carpetas es `NoTargets`, que no produce ejecutable: el comando no corre un sample hoy (coherente con «esqueleto», no ejecutado) |

## 9. Cómo entrar

| Si querés… | Entrá por |
| --- | --- |
| Ver qué hace el dominio sin infraestructura | `domain/01-basico` → `03-avanzado` |
| Ver la guarda y los casos de uso | `application/01-basico` |
| Reproducir los ocho escenarios contra la API | `api/02-intermedio` (`S-2`) |
| Escribir un cliente propio | `api/04-cliente-http-basico` |
| Entender el visor sin backend | `visor/01-basico` → `03-avanzado` (`S-1`) |
| Cargar la comisión de demostración | `web/01-datos-seed` |
