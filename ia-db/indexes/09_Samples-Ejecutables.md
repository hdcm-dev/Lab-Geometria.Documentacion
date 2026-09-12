# 09 · Samples ejecutables — el camino más rápido para entender una capa

> **Propósito.** Qué muestra cada sample, cuál corre y cuál no, y por qué es el mejor lugar para
> ver qué hace **de verdad** una capa.
> **Fuente primaria.** `samples/`, `samples/README.md`, las categorías `10-Examples` de las dos
> unidades de entrega y `Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md`. Archivos contados
> con `git ls-files` el 2026-09-11 sobre `89f3ab3`.

---

## 1. Qué son

`samples/` es la materialización en código de la categoría **10-Examples**. La categoría documenta
el sample; el código vive acá. **Los samples corren y se comparan contra el §6 de su documento**, y
donde no coinciden **lo declaran, renglón por renglón, con su motivo**. Es lo que los hace útiles:
no ilustran la intención, muestran el comportamiento.

**Un segmento por proyecto de código.** La regla del framework supone un proyecto por repositorio;
acá hay siete, de modo que la estructura es `samples/<capa>/<nivel>/` para que las carpetas base no
colisionen. Es carpeta extra y no renombre de las base, que es lo único que la regla admite.

## 2. Los diecinueve, y cuáles tienen código

| Capa · nivel | Qué muestra | Archivos versionados | Estado |
| --- | --- | --- | --- |
| `domain/01-basico` | Ciclo de vida de una cuenta, de la configuración del administrador a la admisibilidad | 9 | Con código |
| `domain/02-intermedio` | Un trabajo real: constitución, adopción de la interpretación y envío | 16 | Con código |
| `domain/03-avanzado` | Acceso, alcance del administrador y desenlace, con la superficie tipada bajo inspección | 13 | Con código |
| `application/01-basico` | La cuenta entra al laboratorio: alta, administrador, credencial y **la guarda que corta primero** | 12 | Con código |
| `application/02-intermedio` | Los ocho trabajos del alumno: carga, envío interpretado, consulta y retiro | 22 | Con código |
| `application/03-avanzado` | El administrador: gobierno de cuentas, revisión, desenlace y reseteo | 14 | Con código |
| `infrastructure/01-basico` | Leer el texto del alumno y verificar sus números, **sin abrir el almacén** | 12 | Con código |
| `infrastructure/02-intermedio` | El almacén: guardar, recuperar con el recorte ya decidido, retirar y arrastrar | 15 | Con código |
| `infrastructure/03-avanzado` | Los mecanismos que no guardan nada: credencial, provisoria, acceso firmado, reloj y arranque | 11 | Con código |
| `api/01-basico` | El canje, la guardia y **el envío que no verifica: por qué esa respuesta es exitosa** | 13 | Con código, con `run.sh` |
| `api/02-intermedio` | **La colección de peticiones reproducible**: los ocho escenarios contra la superficie ensamblada | 20 | Con código, con `run.sh` |
| `api/03-avanzado` | Composición de raíz y arranque en dos fases: qué pasa antes de la primera petición | 9 | Con código, con `run.sh` |
| `visor/01-basico` | La página integradora mínima: crear la escena, dibujar `E-1` y liberar | 9 | Con código |
| `visor/02-intermedio` | Árbol y escena **sincronizados por índice**, y ninguna pieza que desaparezca sin aviso | 12 | Con código |
| `visor/03-avanzado` | Las seis funciones sin backend, con los dos movimientos prendidos y **el contador de red en cero** | 14 | Con código |
| `web/01-datos-seed` | La comisión desde la que arranca el guion de demostración | 13 | Con código, con `run.sh` |
| `contracts/01-basico` | La frontera de sesión y de cuentas: cuatro campos y ninguno que filtre | 1 | **Sólo README** |
| `contracts/02-intermedio` | Trabajo, listado y detalle: el texto original que viaja intacto y la proyección que no arrastra | 1 | **Sólo README** |
| `contracts/03-avanzado` | Error, desenlace y reseteo, y una frontera que no filtra | 1 | **Sólo README** |

**Dieciséis con código, tres sin él.** Los tres de `contracts/` siguen en el estado de esqueleto de
la pasada de diseño: llevan su README y su comando previsto, y **ninguno afirma lo contrario**.
Es coherente con lo que el corpus cuenta —dieciséis samples implementados— pero **no con
`samples/README.md`, que sigue diciendo que las diecinueve carpetas están sin código**; la
divergencia está en [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) O-6.

## 3. Las tres muestras nombradas del intake §18

| Muestra | Qué es | Dónde vive |
| --- | --- | --- |
| `S-1` | Página integradora sin backend, que prueba el punto de extensión | Las **tres** carpetas de `visor/`, que son sus tres partes |
| `S-2` | Colección de peticiones HTTP de la API | `api/02-intermedio/` |
| `S-3` | Juego de datos de los ocho escenarios, en archivos sueltos | Los archivos de escenario de `infrastructure/01-basico/` |

## 4. Cómo se corre cada clase

| Clase | Invocación |
| --- | --- |
| Samples .NET (`domain`, `application`, `infrastructure`) | `dotnet run --project samples/<capa>/<nivel>` (proyectos `Sample.<Capa>.<Nivel>.csproj`, con `Actos/`, `Dobles/`, `Escenarios/`, `Recorrido/` y `tests/` según el caso) |
| Samples de superficie (`api/*`, `web/01-datos-seed`) | `bash samples/<capa>/<nivel>/run.sh`, contra un servicio levantado |
| Samples del visor | `bash scripts/build-visor.sh && npm --prefix samples/visor/<nivel> run verify`: página integradora (`index.html` + `anfitrion.js`) con su `package.json` y su recorrido en `tests/*.mjs`, en el navegador |

**El servicio de los samples de `api/` escucha en 5080**, y hay que levantarlo aparte con almacén
propio: `gf-api` y `gf-web` son del Product Owner y no se tocan.

Cada sample lleva su directorio `esperado/`, con la salida contra la que se compara —por ejemplo
`samples/api/01-basico/esperado/salida.txt` y `codigos-del-contrato.txt`—, y `api/02-intermedio/`
trae los cuerpos de los ocho escenarios en `cuerpos/E1.txt` … `E8.txt` más `escapar.awk`, **el
escapador que existe porque la imagen del SDK no trae `jq` ni `python3`**. `api/03-avanzado/`
trae sus propios `almacenes/`.

**Los datos del visor van en dos archivos y hay un documento que explica por qué**
(`samples/visor/01-basico/datos/POR-QUE-DOS-ARCHIVOS.md`): `E1.txt` es lo que el alumno pega y
`E1-piezas.js` son las piezas ya reconstruidas, que es lo que el visor recibe (`ADR-08006`).

## 5. Lo que los samples encontraron

**El sample `api/03-avanzado` encontró un hueco del contrato**, contando sobre el documento OpenAPI
que el propio servicio publica: **el servicio exponía diecisiete operaciones contra dieciséis
declaradas** en `Contratos-REST.md`. El barrido de alcance de `ADR-08006` había llegado a la
categoría 02 y no a la 05. Se cerró con la emisión 1.5 de ese contrato, el 2026-08-31.

Los hallazgos que dejó la implementación de los samples están en
`Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md`: **catorce emitidos, doce cerrados, dos
retirados, cero vivos**.

**Es el mejor lugar para entrar a una capa**, y por eso `AGENTS.md` lo dice: los samples corren, y
donde no coinciden con su documento lo declaran por escrito.
