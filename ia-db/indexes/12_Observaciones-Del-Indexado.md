# 12 · Observaciones del indexado

> **Propósito:** dejar por escrito qué se verificó al construir esta base, con qué comando, y qué
> divergencias entre documento y árbol quedaron a la vista. **Son hechos medidos, no juicios sobre
> el producto**: quien las lea decide qué hacer con ellas.
> **Fecha de medición:** 2026-08-31, sobre `main` en `da9b07c`.

---

## 1. Qué se verificó, y cómo

| Afirmación de los índices | Cómo se verificó |
| --- | --- |
| Siete proyectos de código y sus dependencias | `GeometriaFactory.sln` y las `ProjectReference` de los seis `.csproj` |
| Rutas y verbos de los diecisiete puntos de acceso | Constantes `…Route` y llamadas `Map*` de `src/GeometriaFactory.Api/Endpoints/` |
| Quince códigos de error del conjunto cerrado | Recuento de `public const string` en `Contracts/Errors/ErrorCode.cs` |
| Conjuntos cerrados del dominio y sus valores | Los `enum` de `Domain/Values/` |
| Umbrales de `QG-03` | Diccionario `umbral` de `tools/informe-cobertura.cs` |
| Volumen de las baterías | Recuento de `[Fact]`/`[Theory]` por archivo |
| Versiones de paquetes | `PackageReference` de `src/*/*.csproj` y `visor/package.json` |
| Puertos y variables de entorno | `.devcontainer/devcontainer.json`, `appsettings*.json`, `deploy/Dockerfile`, `deploy/compose.yaml` |
| Estado de las etapas y de las categorías | `SDD/Docs/README.md` §7 (v2.5, 2026-08-30) contrastado con `git log` |
| Estado de los samples | La línea «Estado de esta carpeta» de los diecinueve `README.md` |
| Recuento del corpus | `find SDD -type f`, separando `_legacy/` |

**Lo que NO se verificó, y por lo tanto ningún índice lo afirma:** que la construcción, la batería y
la cobertura pasen hoy. No se corrieron `build.sh`, `test.sh` ni `coverage.sh` — el indexado no
modifica ni ejecuta el proyecto. Los estados de puertas que los índices citan son **los que el
corpus declara**, con su fecha.

---

## 2. Divergencias documento ↔ árbol

### `OBS-01` · `samples/README.md` declara un estado que ya no es el de sus carpetas

**Hecho.** El README general de `samples/` está fechado el **2026-08-11** y dice «Estado de todas
las carpetas: **Esqueleto — sin código**» y «**No hay código, y ninguna carpeta afirma lo
contrario**». Medido carpeta por carpeta: **dieciséis de las diecinueve declaran «Implementado»** y
cuatro además «verificado»; sólo las tres de `contracts/` siguen en esqueleto.

**Alcance.** Un agente que lea sólo el README general concluye que no hay ejemplos que correr.

### `OBS-02` · `AGENTS.md` dirige a tres documentos que no existen

**Hecho.** Su tabla «A dónde ir, por intención» apunta a
`SDD/Docs/Producto/11-Documentacion/Vision-General-Sistema.md`, `Guia-Inicio-Rapido.md` y
`Guia-Despliegue.md`. **Los tres archivos no están en el árbol.** El README de esa categoría los
declara en estado **`Planificado`** (§3.1) y dice que **todas** las celdas de su tabla por intención
apuntan hoy a documentos planificados; su redacción es trabajo de la Fase J.

**Alcance.** Las tres primeras filas de la tabla de `AGENTS.md` no resuelven; la cuarta —la bitácora
de eventualidades— y las siguientes —contratos REST, samples, norma de nomenclatura— sí.

### `OBS-03` · Los README de `samples/` enlazan a un árbol documental que ya no existe

**Hecho.** El README general enlaza **19 veces** a
`SDD/Docs/Proyectos/<proyecto>/10-Examples/…`, y los README de carpeta hacen lo mismo con sus sondas de sensado. **La carpeta `SDD/Docs/Proyectos/` no existe**: la
documentación por proyecto se consolidó bajo `SDD/Docs/Unidades-Entrega/<unidad>/`. Algunos README
ya conviven con las dos formas — `samples/api/01-basico/README.md` enlaza su documento gobernante
por la ruta nueva y su sonda de sensado por la vieja.

**Alcance.** Los enlaces rotos son de navegación, no de contenido: los documentos existen, con otra
ruta.

### `OBS-04` · El comentario de `ErrorCode.cs` describe el estado de la etapa `e`

**Hecho.** El `remark` de `Contracts/Errors/ErrorCode.cs` dice que faltan «los dos del desenlace»
porque «ese punto es de la etapa `h`, y escribir sus códigos ahora declararía condiciones que
ninguna petición de esta superficie puede producir». **La etapa `h` está cerrada**, `A-15` existe, y
el desenlace **no acuñó códigos nuevos**: `ContractTranslation.WorkStateForbidsOutcome` reutiliza
`STATE_FORBIDS_UPDATE` con `409`, y la falta de facultad sale por `OPERATION_ADMIN_ONLY`.

**Alcance.** El conjunto cerrado está completo y coherente; lo que quedó viejo es la explicación de
por qué faltan dos códigos que ya se decidió no acuñar.

### `OBS-05` · El puerto no es el mismo en desarrollo y en la imagen

**Hecho, y no es un defecto: es la fuente de una confusión que ya costó tiempo.**
`AGENTS.md` y `EVE-00001` advierten que «el servicio escucha en **5080**, no en 8080: la
configuración de Kestrel gana sobre `ASPNETCORE_URLS`». Eso vale **en desarrollo**: el extremo 5080
lo declara `appsettings.Development.json`. **La imagen de despliegue no lo lleva** —`appsettings.json`
no declara Kestrel— y su `ENV ASPNETCORE_URLS=http://+:8080` manda: `deploy/Dockerfile` expone
**8080** y `compose.yaml` publica `${API_PORT:-8080}:8080`.

**Regla práctica:** contra el árbol de trabajo, 5080; contra la imagen construida, 8080.

---

## 3. Archivos presentes en el árbol y ausentes del control de versiones

Verificado con `git check-ignore`: los tres están **ignorados** por el `.gitignore` del proyecto, de
modo que no son suciedad versionada, pero sí ocupan el árbol de trabajo y aparecen en cualquier
recorrido de archivos.

| Archivo | Regla que lo ignora |
| --- | --- |
| `src/GeometriaFactory.Api/geometriafactory.db` (+ `-shm`, `-wal`) | `.gitignore:451` `geometriafactory*.db` |
| `src/GeometriaFactory.Api/core.306` | `.gitignore:459` `core.*` |
| `src/GeometriaFactory.Web/core.33` | `.gitignore:459` `core.*` |

El almacén dentro del árbol es exactamente el defecto que el comentario de `appsettings.json`
describe como resuelto en la etapa `d` — el archivo que quedó es anterior a esa corrección, o
producto de una corrida que no exportó `ConnectionStrings__Store`.

---

## 4. Qué hacer con esta lista

Ninguna observación se corrigió: **el indexado no modifica el proyecto indexado**, y tres de las
cinco tocan documentos —`samples/README.md`, `AGENTS.md`— que son **derivados** o del Product Owner.
`AGENTS.md` en particular **no se edita**: se regenera desde
`SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`.

Cuando alguna se resuelva, **borrala de este índice** y actualizá la fecha del manifiesto: un
inventario de divergencias que conserva las ya cerradas es exactamente el defecto que la §8 del
`README.md` del corpus documentó sobre sí misma.
