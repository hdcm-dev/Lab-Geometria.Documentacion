# 09 · Samples ejecutables

> **Propósito:** decir qué muestra cada ejemplo y con qué comando corre. **Es el lugar más rápido
> para entender qué hace de verdad una capa**, porque los ejemplos corren y se comparan renglón por
> renglón contra el §6 de su documento.
> **Fuente primaria:** `samples/` (el README de cada carpeta declara su estado y su comando) y las
> categorías `10-Examples` de las dos unidades de entrega.

---

## 1. Cómo está organizado, y por qué

`Rules-Examples.md` §2.3 fija la estructura de `/samples` **suponiendo un proyecto de código por
repositorio**. Este producto tiene **siete** en un solo repositorio, de modo que las carpetas base
colisionarían. Se agrega por eso **un nivel de espacio de nombres por proyecto**:
`/samples/<proyecto>/<XX-slug>/`. Es carpeta extra y **no renombre** de las base, que es lo único
que §2.3 admite ajustar, y está declarado en los siete `README.md` de la categoría 10.

**Diecinueve carpetas y diecinueve contratos de verificación**, uno a uno: 3 de Domain, 3 de
Contracts, 3 de Application, 3 de Infrastructure, 3 de Api, 3 del Visor y 1 de Web.

## 2. Estado al 2026-08-31

| Carpetas | Estado |
| --- | --- |
| **16** — todas menos `contracts/` | **Implementadas.** Corren en 0 y comparan su salida contra el §6 de su documento; donde no coinciden **lo declaran, renglón por renglón, con su motivo** |
| **3** — `contracts/01-basico`, `02-intermedio`, `03-avanzado` | **Esqueleto, sin código.** Sólo README y comando previsto |

`domain/01-basico`, `domain/02-intermedio`, `domain/03-avanzado` e `infrastructure/01-basico` están
además marcados como **verificados** (2026-08-29).

> El `samples/README.md` general sigue fechado el **2026-08-11** y declara «Estado de todas las
> carpetas: Esqueleto — sin código», que ya no es cierto para dieciséis de las diecinueve. Ver
> [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).

## 3. El catálogo

| Carpeta | Proyecto | Comando | Qué muestra |
| --- | --- | --- | --- |
| `domain/01-basico` | Domain | `dotnet run --project samples/domain/01-basico` | Entidades e invariantes básicas |
| `domain/02-intermedio` | Domain | ídem `02-intermedio` | Guardas y resultados tipados |
| `domain/03-avanzado` | Domain | ídem `03-avanzado` | Ciclo de vida completo |
| `contracts/01-basico` | Contracts | `dotnet run --project samples/contracts/01-basico` | La frontera de sesión y de cuentas: cuatro campos y ninguno que filtre. **Sin código** |
| `contracts/02-intermedio` · `03-avanzado` | Contracts | ídem | **Sin código** |
| `application/01-basico` … `03-avanzado` | Application | `dotnet run --project samples/application/<nivel>` | Casos de uso contra puertos falsos |
| `infrastructure/01-basico` … `03-avanzado` | Infrastructure | `dotnet run --project samples/infrastructure/<nivel>` | Adaptadores, contexto y almacén reales (`Almacen.cs`, `Contexto.cs` propios del sample) |
| `api/01-basico` | Api | `bash samples/api/01-basico/run.sh` | El canje, la guardia y el envío que no verifica: **por qué esa respuesta es exitosa** |
| `api/02-intermedio` · `03-avanzado` | Api | `bash samples/api/<nivel>/run.sh` | Superficie completa y casos de borde |
| `visor/01-basico` … `03-avanzado` | Visor | `bash scripts/build-visor.sh && npm --prefix samples/visor/<nivel> run verify` | La fachada ejercitada **sin backend**, con su anfitrión propio (`anfitrion.js` + `index.html`) |
| `web/01-datos-seed` | Web | `bash samples/web/01-datos-seed/run.sh` | La comisión desde la que arranca el guion de demostración (`identidades.env.ejemplo`) |

Cada carpeta declara además su **contrato de verificación** `VER-XX` y su **sonda de sensado**
`SD-XX`, que viven en la `Matriz-Sensado-Deriva.md` de la categoría 08 de su unidad.

## 4. Qué dejaron los samples al implementarse

La implementación de los dieciséis fue un instrumento de auditoría: corrió contra el producto real y
**emitió catorce hallazgos**. Al 2026-08-31: **doce cerrados, dos retirados, cero vivos**
(`SDD/Docs/Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md` §0, que es el índice vivo).

Los que cambiaron el producto y conviene conocer:

| Hallazgo | Qué cambió |
| --- | --- |
| `H-03` | `POST /interpretaciones` estaba expuesto y sin contrato → adoptado como **`A-18`** |
| `H-06` | El arranque detenido daba traza y síntoma → detenerse pasó a ser **una decisión, con salida `78`** |
| `H-09` | El código `UNKNOWN` acuñado aguas abajo → retirado; la unión discriminada lo volvió imposible |
| `H-10` | `RA-03` dependía de una variable de entorno → los dos entornos quedaron iguales |
| `H-11` | Un defecto no previsto daba `500` vacío → nació `ContractErrorHandler`, con cuatro pruebas |
| `H-13` | Siete samples no verificaban con su comando → la comparación corre siempre |
