# 12 · Observaciones del indexado — qué se verificó y qué no cuadró

> **Propósito.** Dejar por escrito qué se contó sobre el instrumento al construir esta base, y las
> divergencias que aparecieron entre el corpus y el árbol. **Ninguna se resolvió acá**: este índice
> las registra con su evidencia y las deja a quien corresponda.
> **Fecha de la verificación.** 2026-09-11, contra `main` en la revisión `89f3ab3` (2026-09-06).
> La base anterior (2.0) se verificó el 2026-09-06 contra `f527e5a`; entre las dos revisiones hay
> dos commits, `6fa6844` y su fusión `89f3ab3`, que agregan un único archivo: `deploy/Dockerfile.web`.

---

## 1. Qué se verificó, y con qué

| Afirmación | Instrumento |
| --- | --- |
| Los siete proyectos y sus ocho aristas | `GeometriaFactory.sln`, los `ProjectReference` de los seis `.csproj`, `scripts/build-visor.sh` |
| Los diecisiete puntos de acceso | Las diecisiete llamadas `Map{Get,Post,Delete}` de `src/GeometriaFactory.Api/Endpoints/` y sus catorce constantes de ruta |
| Los quince códigos del contrato | `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs`, contando `public const string` |
| Los treinta y siete códigos de condición | `src/GeometriaFactory.Domain/Values/ConditionCode.cs`, ídem |
| Los conjuntos cerrados y sus valores | `src/GeometriaFactory.Domain/Values/*.cs` |
| Los campos y operaciones de las cinco entidades | `src/GeometriaFactory.Domain/Entities/*.cs` |
| La tabla de traducción y sus códigos de respuesta | `src/GeometriaFactory.Api/Endpoints/ContractTranslation.cs`, línea por línea |
| Las quince rutas del front y el orden de la tubería | Las directivas `@page` de `Components/Pages/` y `Program.cs` líneas 193–238 |
| Las seis funciones de la fachada | Los `export function` de `visor/src/main.ts` |
| Las versiones de paquetes | Los `PackageReference` de los `.csproj` y `visor/package.json` |
| Los parámetros de seguridad | `PasswordDerivation.cs`, `SigningOptions.cs`, `AccessTokenIssuer.cs` |
| Los umbrales de cobertura | `tools/informe-cobertura.cs`, tabla `umbral` |
| Las cuatro baterías y sus métodos | Atributos `[Fact]`/`[Theory]`/`[Test]`/`[TestCaseSource]` en `tests/`, excluido `bin/` |
| Los criterios de las puertas de etapa | El encabezado de cada `scripts/verify-stage-*.sh` |
| Las 53 ADR, 48 casos de uso, 16 reglas, 144 historias, 107 informes | Recuento de archivos en `SDD/Docs/`, excluido `_legacy/` |
| El estado de los samples | `git ls-files` por directorio en `samples/` |
| Las dos imágenes, la composición y los tres flujos | `deploy/*`, `.github/workflows/*.yml`, y `git show 6fa6844` |

**Lo que no se verificó, y se declara**: no se corrió ninguna batería, ninguna puerta, ningún
sample ni ninguna construcción de imagen durante este indexado. Las cifras de resultado que esta
base publica —«522 pruebas pasan», «los cinco controles conformes», «501.676 bytes de bundle»—
**se citan de `changelog.md` y del mensaje del commit `6fa6844` con su fecha, no se remidieron**.
Tampoco se abrió el repositorio `Container.Lab-Geometria`, así que la guarda `${API_BASE_URL:?…}`
que `Dockerfile.web` dice que vive allá **no está comprobada**.

## 2. Las divergencias entre el corpus y el árbol

Ninguna es un defecto de ejecución: **son recuentos o registros que envejecieron en un documento y
no en otro**, que es exactamente el riesgo `RI-06` que el propio producto tiene declarado. Las
ocho primeras vienen de la base 2.0 y **se volvieron a comprobar el 2026-09-11: las ocho siguen
vigentes**. La novena es nueva.

### O-1 · `Vista-Producto.md` §1 declara quince puntos de acceso, y hay diecisiete

**Hecho.** La tabla de magnitudes de `Vista-Producto.md` **1.9** (línea 71) dice «Puntos de acceso
de la superficie HTTP: 15». `Contratos-REST.md` **1.5**, del 2026-08-31, ya dice **diecisiete**, y
el código expone diecisiete. **`Contratos-REST` se corrigió y la vista no se enteró.**

**Interpretación.** Es el mismo patrón del reporte 21: una decisión se propagó al documento
productor y no al que lo cita. La vista misma advierte, en su §7 `RI-06`, que este es el defecto
con más historia del producto.

### O-2 · `Vista-Producto.md` §1 declara cincuenta ADR, y hay cincuenta y tres

**Hecho.** La tabla dice «ADR: 50 — nivel Producto 10, `Api` 27, `Web` 13». Los recuentos de `Api` y
`Web` cuadran. **`SDD/Docs/Producto/Adrs/` tiene trece archivos vivos**: `ADR-08001` a `ADR-08008`
(ocho) y `ADR-14001` a `ADR-14005` (cinco).

**Interpretación.** Las cinco `ADR-140xx` son de la migración normativa y entraron después del
último recuento. No cambian ninguna decisión técnica del producto.

### O-3 · `ErrorCode` tiene quince constantes contra diecisiete códigos vivos del contrato

**Hecho.** `Contratos-REST.md` §5 declara **diecisiete códigos vivos** sobre veinte emitidos.
`ErrorCode.cs` declara **quince constantes**, y su comentario (línea 22) sigue diciendo que los
del desenlace «son de la etapa `h`». **La etapa `h` está cerrada desde el 2026-08-31**, y los dos
códigos no se escribieron: `ContractTranslation.cs` cubre el desenlace reusando
`StateForbidsUpdate` y `OperationAdminOnly`, con su fundamento escrito ahí mismo —`409` y no
`403` porque quien pide **tiene** la facultad—.

**Interpretación.** Puede ser una decisión deliberada que nunca volvió al contrato, o un hueco. **No
se resuelve acá**: lo que sí es hecho es que el comentario del ensamblado quedó describiendo un
estado que ya no es el del producto.

### O-4 · `SDD/README.md` afirma que `Docs/` está vacía

**Hecho.** `SDD/README.md` (línea 13) dice «`Docs/` está **vacía**: la documentación de
especificación todavía no se generó», y su tabla de estado da el manifiesto y la generación de
`Docs/` como pendientes. `SDD/Docs/` tiene **542 archivos vivos** y ocho fases auditadas.

**Interpretación.** Es el README de arranque del framework, escrito antes de la primera generación
y nunca reemitido. Es inofensivo para quien entra por `Docs/README.md`, y engañoso para quien entra
por `SDD/`.

### O-5 · `AGENTS.md` remite a tres documentos que no existen

**Hecho.** Su tabla «a dónde ir, por intención» cita
`Producto/11-Documentacion/Vision-General-Sistema.md`, `Guia-Inicio-Rapido.md` y
`Guia-Despliegue.md`. **Ninguno de los tres está en el árbol**: ese directorio tiene `README.md`,
`Contrato-Agentes.md` y `Bitacora-Eventualidades.md`.

**Interpretación.** Es coherente con el estado declarado: la categoría `11-Documentacion` está
**planificada**, no emitida. `AGENTS.md` se regenera desde `Contrato-Agentes.md`, así que la
corrección va allá y no acá.

### O-6 · `samples/README.md` declara que las diecinueve carpetas están sin código

**Hecho.** `samples/README.md`, fechado el 2026-08-11, declara «Estado de todas las carpetas:
**Esqueleto — sin código**» y «los diecinueve comandos previstos todavía no resuelven». **Dieciséis
de los diecinueve tienen código hoy** (entre 9 y 22 archivos versionados cada uno); los tres de
`contracts/` siguen siendo sólo README.

**Interpretación.** El README es de la pasada de diseño y la pasada de ejecución no volvió sobre él.
El corpus sí registra los dieciséis: `Audit/Reporte-Hallazgos-De-Los-Samples-2026-08-30.md`.

### O-7 · Diez READMEs de `samples/` apuntan a un árbol que ya no existe

**Hecho.** Diez de los diecinueve citan documentos bajo `SDD/Docs/Proyectos/<Proyecto>/10-Examples/`
(`grep -l 'SDD/Docs/Proyectos/' samples/*/*/README.md`). **Ese árbol lo reemplazó
`Unidades-Entrega/` en la migración 6.0 → 8.6.** Son enlaces colgados; `samples/README.md` también
los tiene.

**Interpretación.** Es la misma clase de residuo que la migración 8.6 → 8.11 reparó en el README
raíz; en `samples/` no se hizo el barrido.

### O-8 · La batería de extremo a extremo no está en la solución

**Hecho.** `GeometriaFactory.sln` declara nueve proyectos: seis de `src/` y tres de `tests/`.
`tests/GeometriaFactory.E2ETests` **no está**. Se compila y corre por ruta directa, tanto en
`scripts/pruebas-e2e.sh` como en `.github/workflows/e2e.yml`.

**Interpretación.** Es coherente y probablemente deliberado —`scripts/test.sh` y `coverage.sh`
corren sobre la solución, y una batería que necesita navegador no debe entrar en la medición de
`QG-02` ni de `QG-03`—. `Web/08/Pruebas-Extremo-A-Extremo.md` habla de **«las tres baterías de
la solución»**, con lo que da la exclusión por sabida, pero **no se encontró su fundamento escrito
ni ahí ni en ninguna ADR**. Queda como pregunta, no como hallazgo.

### O-9 · `deploy/Dockerfile.web` existe y ninguna fuente documental lo registra — **nueva**

**Hecho.** El PR #186 «Dockerizar el front» (`6fa6844`, 2026-09-06 21:37, fusionado en
`89f3ab3` siete minutos después) agrega `deploy/Dockerfile.web`, 118 líneas, y nada más.
Comprobado con `git diff --stat f527e5a..HEAD`. Al 2026-09-11:

- `changelog.md` no lo menciona: su última entrada sigue siendo la del 2026-09-03
  (`grep -c 'Dockerizar\|Dockerfile.web' changelog.md` → 0), y el archivo no se modificó desde el
  2026-09-04.
- Ningún documento vivo de `SDD/` lo menciona (`grep -rl` sobre `SDD/Docs`, excluido `_legacy/`,
  → vacío). `Web/09-Devops/` sigue teniendo sólo la guía de publicación por FTP y la del bundle.
- `deploy/compose.yaml` no incluye el servicio del front.
- `.github/workflows/deploy-front-ftp.yml` sigue activo y sin cambios, y `e2e.yml` sigue
  encadenado a él. El encabezado de `Dockerfile.web` dice «hasta hoy el front se publicaba por
  transferencia al hosting externo», en pasado, pero nada retira esa vía.
- El propio archivo declara una limitación —la imagen lleva `ApiBaseUrl` de desarrollo horneado
  y arranca sana sin configurar— y ubica la guarda en la composición de `Container.Lab-Geometria`,
  que no está en este repositorio.
- El mensaje del commit declara tres verificaciones hechas «contra el equipo»; ninguna dejó
  captura en `evidencia/`.

**Interpretación.** Es una decisión de construcción bien fundamentada en su propio archivo y
**huérfana de registro**: contradice la regla del producto de que `changelog.md` es «la única
fuente del avance de construcción» y se actualiza en la rama antes de fusionar. Que las dos vías
de publicación coexistan sin que una fuente diga cuál manda es un punto abierto de nivel producto
(índice 11 §5.1). **No es alcance de un indexado escribir ninguna de esas entradas.**

## 3. Lo que sí cuadró, y conviene decirlo

- **Los diecisiete puntos de acceso del código coinciden exactamente con `Contratos-REST.md` 1.5**,
  incluido `A-18`, que fue lo que el sample `api/03-avanzado` levantó contando sobre el documento
  OpenAPI que el servicio publica.
- **Las ocho aristas de compilación coinciden con los `.csproj`**, arista por arista, con la clase
  de cada una rotulada.
- **Los 48 casos de uso coinciden con el desglose de `Vista-Producto.md`** —`Api` 23, `Web` 17,
  Producto 8—, contados archivo por archivo.
- **Las 16 reglas de negocio y los 9 invariantes coinciden** entre el intake, la categoría 02 y el
  código.
- **Los umbrales de cobertura del guion coinciden con los que `D1` confirmó.**
- **La escala vive en los tokens de `app.css` y no en una hoja aparte**, que es lo que el control
  `C-4` exige.
- **La tabla de derivación por tipo de figura de `ADR-06006` coincide con `LocalFigureValidator`**,
  incluidos los componentes que cada sólido exige.
- **`Dockerfile.web` es coherente con el código que describe**: `Program.cs` lee `ApiBaseUrl` de
  `IConfiguration` y lanza si falta, `appsettings.json` trae `http://localhost:5080/`, y
  `wwwroot/js/*.js` está ignorado — las tres afirmaciones del encabezado se comprobaron.

## 4. Cómo tratar estas observaciones

**La evidencia manda sobre el índice**: si al abrir una fuente contradice algo que esta base
afirma, **vale la fuente**, y la corrección se anota acá. Y a la inversa: ninguna de las nueve
divergencias de §2 se corrigió en el corpus desde esta base — **escribir sobre `SDD/`,
`changelog.md` o `samples/` no es alcance de un indexado**, y sobre el intake y los requerimientos
técnicos ni siquiera es alcance de un agente.
