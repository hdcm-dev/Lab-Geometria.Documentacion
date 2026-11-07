# 19 · Observaciones del indexado — qué se verificó y qué no cuadró

> **Propósito.** Registrar qué se recontó sobre el instrumento al construir la 4.0 y las divergencias
> entre corpus, `changelog.md`, historial git y código. **Ninguna se resuelve acá**: se registran con
> sus dos fuentes y quedan para quien corresponda. No repite contenido de dominio (va a 01–18).
> **Fuente primaria.** `git ls-files`, `git log 89f3ab3..5f07b12`, `changelog.md`,
> `SDD/Docs/README.md` §7.3, `SDD/Docs/Producto/Vista-Producto.md` §1.1 y el código citado en cada fila.
> **Revisión.** `main` en `5f07b12` (PR #234, 2026-10-27). Verificado el 2026-11-01. La 3.0 se
> verificó sobre `89f3ab3` (2026-09-06): entre ambas hay **209 commits** (64 fusiones) y
> **430 archivos** cambiados (`git diff --stat 89f3ab3 5f07b12`).

---

## 1. Magnitudes recontadas, con su instrumento

| Magnitud | Valor en `5f07b12` | Instrumento |
| --- | --- | --- |
| Archivos versionados | 1889 | `git ls-files \| wc -l` |
| … de ellos bajo `_legacy/` | 679 (contados, no indexados por contenido) | `git ls-files \| grep -c _legacy/` |
| Archivos de `SDD/Docs/` vivos / `_legacy` | 578 / 626 | `git ls-files SDD/Docs` con y sin `_legacy` |
| Archivos vivos bajo alguna `Audit/` | 120 | `git ls-files \| grep -v _legacy \| grep -c Audit/` |
| ADR vivas | 60 = Producto 13 · Api 31 · Web 16 | archivos `ADR-*` por unidad, excluido `_legacy/` |
| Casos de uso | 48 | archivos `CU-*` vivos en `SDD/Docs/` |
| Puntos de acceso HTTP | 17 | llamadas `Map{Get,Post,Delete}` en `src/GeometriaFactory.Api/` |
| Constantes de `ErrorCode` | 16 | `public const string` en `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs` |
| Códigos de condición | 37 | ídem en `src/GeometriaFactory.Domain/Values/ConditionCode.cs` |
| Atributos de prueba (`[Fact]`/`[Theory]`/`[Test]`/`[TestCaseSource]`) | Domain 67 · Application 54 · Integration 240 · E2E 29 | `grep` sobre `tests/**/*.cs` versionados |
| Proyectos en la solución | 31 entradas `.csproj` (incluye E2E, visor y samples) | `grep -c .csproj GeometriaFactory.sln` |
| Samples | 20 carpetas; 17 con código; 3 de `contracts/` con README + nodo `.csproj` sin código (`Microsoft.Build.NoTargets`, en el `.sln`) | `git ls-files samples` por carpeta |
| Workflows / archivos de `deploy/` | 3 / 4 | `git ls-files .github deploy` |
| `.vscode/` | 2 archivos, excluidos por Profile | `git ls-files .vscode` |

**Lo no verificado, y se declara.** No se corrió ninguna batería, puerta, sample ni construcción de
imagen. Las cifras de resultado («522 pruebas pasan», `changelog.md` línea 1062; «311 pruebas en
verde», línea 761) **se citan, no se remidieron**. El recuento de atributos de §1 (390) **no es
comparable** con ellas: una `[Theory]` o un `[TestCaseSource]` produce varios casos. No se abrió
`Container.Lab-Geometria`, así que lo que `deploy/Dockerfile.web` delega a esa composición sigue sin
comprobar.

## 2. Estado de las observaciones O-1..O-9 de la 3.0

| Id | Observación (3.0) | Estado en `5f07b12` | Evidencia |
| --- | --- | --- | --- |
| O-1 | `Vista-Producto` declara 15 puntos de acceso; hay 17 | **Vigente** | `SDD/Docs/Producto/Vista-Producto.md` línea 71 («15») vs `Contratos-REST.md` §3 («diecisiete») y 17 `Map*` |
| O-2 | `Vista-Producto` declara 50 ADR | **Vigente y agravada**: hay 60 (13/31/16) | `Vista-Producto.md` línea 69 vs recuento de §1 |
| O-3 | `ErrorCode` con 15 constantes contra 17 vivos | **Cambió de forma** → ver N-2 | `ErrorCode.cs` líneas 16–26 |
| O-4 | `SDD/README.md` afirma que `Docs/` está vacía | **Resuelta** el 2026-09-13 (parche PR-09) | `SDD/README.md` línea 10; `SDD/Docs/Audit/Mesa-2026-09-13-ciclo-2.md` |
| O-5 | `AGENTS.md` remite a tres documentos inexistentes | **Resuelta**: ahora declara «no está emitido» y remite a fuentes que existen | `AGENTS.md` líneas 90–92; `git ls-files SDD/Docs/Producto/11-Documentacion` |
| O-6 | `samples/README.md` declara todas las carpetas sin código | **Resuelta**: «diecisiete implementadas… tres en esqueleto», cuadra con el árbol | `samples/README.md` líneas 5, 14, 77 |
| O-7 | READMEs de `samples/` apuntan a `SDD/Docs/Proyectos/` (árbol reemplazado) | **Vigente**: 9 enlaces colgados en 6 READMEs — `api/01..03` (línea 9, `SD-0x`) y `contracts/01..03` (líneas 7 y 9). Otros 5 archivos (`samples/README.md` línea 100, `domain/01..03` línea 7, `visor/01-basico` línea 43) sólo nombran la ruta en notas de corrección, no enlazan a ella | `grep -n 'SDD/Docs/Proyectos/' samples/*/*/README.md samples/README.md`, leído enlace por enlace |
| O-8 | La batería E2E no está en la solución | **Resuelta**: `GeometriaFactory.E2ETests` está en el `.sln` | `GeometriaFactory.sln` línea 54 |
| O-9 | `deploy/Dockerfile.web` sin registro documental | **Resuelta en el registro**; queda abierta la parte de composición → N-4 | `changelog.md` líneas 1092, 1123, 1940 |

## 3. Observaciones nuevas de la 4.0

### N-1 · `changelog.md` no registra lo fusionado el 2026-10-27

**Hecho.** La última fecha de `changelog.md` es 2026-09-15 y su último commit también
(`git log -1 -- changelog.md`). Después se fusionaron el PR #235 (`be83e8e`, asiento de la
delegación del merge) y el PR #234 (`046a3a9`, `ADR-10010` de la ayuda de usuario):
`grep -c 'ADR-10010\|Ayuda' changelog.md` → 0.
**Fuentes en tensión.** `git log 89f3ab3..5f07b12` vs la regla «gana el historial» de `changelog.md`
(índice 03). Ambos cambios son sólo documentales: `git show --stat 046a3a9` toca 3 documentos bajo
`SDD/Docs` (`Experiencia-De-Uso.md`, `ADR-10010`, `Decisiones-Arquitectura.md`) y `git show --stat be83e8e`
sólo `AGENTS.md`. Lo **no decidible desde el árbol** es si un cambio documental exige entrada en el
changelog; se marca.

### N-2 · Códigos vivos: el código dice 18, el contrato dice 18 y 17, la vista dice 17; y dos códigos del desenlace no existen en el código

**Hecho (recuento).** Tres puntas:
- `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs`: 16 `public const string`; su comentario (líneas 16–26)
  dice «Son dieciocho vivos» y atribuye los dos faltantes al desenlace «de la etapa `h`».
- `SDD/Docs/Producto/Contratos-Inter-Unidad/Contratos-Abstractions.md` §5.1 (línea 103): «Los dieciocho
  códigos vivos», 18 filas, con `EMAIL_DOMAIN_NOT_ADMITTED` desde el 2026-09-14 (línea 128). El **mismo**
  documento se contradice: §5.2 (línea 143) dice «diecisiete vivos», y también el índice (línea 23) y las
  líneas 59 y 83; su control de cambios 1.4 (línea 202) declara que no propagó el recuento.
- `Contratos-REST.md` §5 («los diecisiete códigos») y `SDD/Docs/Producto/Vista-Producto.md` línea 72
  («17 vivos sobre 20 emitidos»), que cita como fuente justamente `Contratos-Abstractions.md` §5.1 (18).

**Hecho (desenlace).** `Contratos-Abstractions.md` §5.1 declara vivos `STATE_FORBIDS_OUTCOME` (fila 12,
línea 120) y `OUTCOME_ADMIN_ONLY` (fila 13, línea 121) para `CU-08006`/`CU-08007`. El código no los tiene:
`grep` sobre `src/` sólo los encuentra en el comentario de `ErrorCode.cs` (líneas 20–21).
`src/GeometriaFactory.Api/Endpoints/ContractTranslation.cs` traduce los motivos del desenlace a
`ErrorCode.OperationAdminOnly` (`ConditionCode.OutcomeRequiresAdministratorRole`, línea 154) y a
`ErrorCode.StateForbidsUpdate` (`WorkStateForbidsOutcome`, línea 246). El contrato declara para el
desenlace códigos que la Api nunca emite.
**Además**, la única explicación de su ausencia es el comentario de `ErrorCode.cs`, que trata la etapa `h`
como futura, cerrada desde el 2026-08-31 (índice 03); `ContractTranslation.cs` sólo fundamenta el reuso de
403/409, no la ausencia de los dos códigos (herencia de O-3).

### N-3 · `Vista-Producto` §1.1 se declara «contada sobre el instrumento», y tres filas no lo están

**Hecho.** `SDD/Docs/README.md` §7.3 deja de replicar magnitudes y remite a `Vista-Producto.md` como
fuente viva. Esa tabla mantiene tres filas que no cuadran: O-1 (línea 71), O-2 (línea 69) y N-2 (línea 72); sus filas de casos de uso (48), reglas (16),
invariantes (9) y fachada (6) **sí cuadran**. Es el riesgo `RI-06` del propio producto.

### N-4 · `deploy/compose.yaml` se declara de verificación; el intake y dos documentos lo describen como despliegue

**Hecho.** `deploy/compose.yaml` (líneas 1–9) se declara «COMPOSICIÓN DE VERIFICACIÓN — no es la de
despliegue»: sirve a `PT-04` y el despliegue vive en `Container.Lab-Geometria`; por eso declara sólo `api` y
`store` (líneas 42, 67), sin front, de forma deliberada. **Fuentes en tensión** (líneas 27–31 del mismo
archivo): el intake §16, `Pipeline-Producto.md` §4 y `Entornos-Deploy.md` §3 todavía lo describen como
«despliegue desde Git en destino». El contenido de `Container.Lab-Geometria` (fuera del repo) **no es
verificable aquí**; cuál vía manda vive en el índice 12.

### N-5 · `evidencia/` se retiró de la raíz

**Hecho.** `3662bf9` (2026-09-13) retira `evidencia/`; `git ls-tree 5f07b12` ya no la lista. Los
documentos que citaban capturas allí **no se barrieron en este indexado**: búsqueda pendiente, se
marca como no verificada.

### N-6 · Norma de nomenclatura: el tramo `R-3` nombra dos cosas

**Hecho.** `SDD/Docs/Producto/Norma-De-Nomenclatura.md` §8.1 asigna `R-3` a la clase 4 (seis funciones de la fachada, `F-01`) y `R-5` a la clase 6 (los 101 códigos; «El orden dentro de `R-5`, porque 101 códigos…»). El recuadro de la reactivación del 2026-08-29 en la misma §8 dice «`R-3` —los códigos de condición, que es `F-03`— se reactiva» y deja suspendidos `R-2b`, `R-4` y `R-5`. La norma no registra la contradicción. Índice afectado: `14` §5.

### N-7 · Espacios de nombres: §6.10 contra el código

**Hecho.** §6.10 de la norma lista `GeometriaFactory.Infrastructure.Validation`; en el código no existe y el adaptador vive en `GeometriaFactory.Infrastructure.Figures` (`src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs`), sin fila en la norma. `GeometriaFactory.Contracts.Errors` existe (`src/GeometriaFactory.Contracts/Errors/`) y lo agrega §6.13 (1.7), no §6.10. Índice afectado: `14` §4.2.

### N-8 · Total de códigos de condición: 101 contra 102

**Hecho.** La 1.30 lleva el título de §6.8.6 a «Los 22 `CONTRATO_*`» al sumar `EMAIL_DOMAIN_NOT_ADMITTED`; la fila de §6.2 sigue en «21» y el total de la clase 6 sigue en 101, aunque 42+12+15+7+4+22 = 102. Índice afectado: `14` §4.1.

### N-9 · Cabecera de la norma sin versión

**Hecho.** La cabecera de `Norma-De-Nomenclatura.md` dice «**Fecha:** 2026-08-31» y no tiene campo de versión; la 1.31 (2026-09-14) sale sólo del control de cambios §9.

### N-10 · `Box`/`UnfoldedRectangle` en §6.4 contra §6.21.2

**Hecho.** §6.4 conserva `Ortoedro`→`Box` y `RectanguloDesarrollado`→`UnfoldedRectangle`; §6.21.2 fija `Orthohedron` y `DevelopedRectangle`, que es lo que usa `src/GeometriaFactory.Domain/Values/FigureType.cs`. No se halló marca de «superado» en §6.4.

### N-11 · Rango del glosario en §6.1

**Hecho.** La regla de §6.1 enumera «§6.3 a §6.8, §6.10, §6.11, §6.12, … §6.20» y «diecisiete tablas»; §6.21–§6.26 existen y no figuran en esa enumeración.

### N-12 · Literales `CONTRATO_*` y glosarios de unidad en estado Propuesto

**Hecho.** Persisten literales `CONTRATO_*` en comentarios XML (`src/GeometriaFactory.Api/Endpoints/ContractTranslation.cs`, `src/GeometriaFactory.Application/ApplicationResult.cs`): compatibles con §4.1 (cita/reporte), no verificados caso por caso. Los cuatro `Glosario-*.md` de `SDD/Docs/Unidades-Entrega/*` están en estado Propuesto, fechados 2026-08-16; su vigencia frente a las etapas `e`–`k` no se verificó término por término (p. ej. «Código del contrato» = 17 en la 2.0 frente a los 22 de §6.8.6 tras la 1.30).

## 4. Lo que sí cuadró

- 17 puntos de acceso del código = `Contratos-REST.md` §3.
- 48 casos de uso = `Vista-Producto.md` §1.1.
- `samples/README.md` = árbol real (20 carpetas, 17 con código).
- `AGENTS.md` ya no cita documentos inexistentes.
- `E2ETests` y las 20 carpetas de samples están en `GeometriaFactory.sln`.

## 5. Exclusiones aplicadas

| Excluido | Motivo | Fuente |
| --- | --- | --- |
| `.git`, `.vscode/` (2 archivos) | IDE/VCS, por Profile | `Knowledge-Indexing.md` |
| `bin/`, `obj/`, `dist/`, `publish/`, `node_modules/` | Artefactos/dependencias; no versionados | `.gitignore` |
| Contenido de `_legacy/` (679 archivos) | Archivo histórico: se cuenta y ubica (índices 01, 17) | `git ls-files` |
| Binarios, imágenes, bases | Sin contenido indexable | Profile |
| Lo ignorado por `.gitignore` (p. ej. `wwwroot/js/*.js`) | Sólo `git ls-files` | `.gitignore` |

## 6. Cómo tratar estas observaciones

**La fuente manda sobre el índice.** Ninguna divergencia se corrigió en el repo: escribir sobre
`SDD/`, `changelog.md`, `samples/` o el código no es alcance de un indexado.
