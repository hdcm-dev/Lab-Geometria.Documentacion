# 07 · Pruebas y puertas de calidad

> **Propósito:** qué se prueba, dónde, con qué instrumento se mide y qué puerta detiene el trabajo.
> **Fuente primaria:** `tests/`, `scripts/coverage.sh`, `tools/informe-cobertura.cs`,
> `coverlet.runsettings` y `SDD/Docs/Unidades-Entrega/*/08-Calidad-Y-Pruebas/`.

---

## 1. Las tres baterías

**xUnit 2.9.2** sobre `Microsoft.NET.Test.Sdk` 17.12.0, con `Microsoft.AspNetCore.Mvc.Testing`
10.0.11 en la de integración y `coverlet.collector` 6.0.4 en las tres.

| Batería | Qué cubre | Métodos anotados |
| --- | --- | --- |
| `GeometriaFactory.Domain.Tests` | Entidades, invariantes, ciclo de vida de cuenta y de trabajo, y `DependencyGateTests` — la **puerta de la regla de dependencias** | 67 |
| `GeometriaFactory.Application.Tests` | Casos de uso de cuentas y de trabajos, y `PortGateTests` — la puerta de la frontera de puertos | 51 |
| `GeometriaFactory.Integration.Tests` | La superficie HTTP real, el front, la seguridad, el validador de figuras y el almacén | 190 |

Recuento de `[Fact]`/`[Theory]` medido el 2026-08-31; **el número de casos ejecutados es mayor**,
porque cada `[Theory]` corre con sus datos. Para el número real, `scripts/test.sh`.

**Piezas de apoyo de la batería de integración**, útiles para escribir una prueba nueva:
`DataServiceHarness` (levanta el servicio), `PublicPieceHarness` (levanta el front) y `Scenarios`
(los **ocho escenarios `E-1` a `E-8`** que el intake transcribe: **no se inventan datos de prueba**).

Grupos que conviene conocer por nombre: `WorkSurfaceTests` (31) y `WorkWebSurfaceTests` (13) para
los trabajos; `AccountLifecycleSurfaceTests` (16) y `AccountLifecycleWebSurfaceTests` (8) para las
cuentas; `FigureValidatorBatteryTests` (14) y `FigureDerivationTests` (9) para la interpretación;
`SecurityGuardsTests` (11), `SessionCookieTests` (7), `ProvisioningGateTests` (11) y
`PanelSessionGateTests` (6) para las guardias; `ContractCoverageTests` y
`ApiDocumentationSurfaceTests` para el contrato y su descripción.

---

## 2. Las cuatro puertas de calidad

| Puerta | Qué exige | Instrumento |
| --- | --- | --- |
| `QG-01` | Construcción en 0 **y sin advertencias** | `Directory.Build.props` + `scripts/build.sh` |
| `QG-02` | Batería entera en verde; 0 deshabilitadas sin motivo escrito | `scripts/test.sh` (Release) |
| `QG-03` | Cobertura de líneas y ramas **por proyecto de código** | `scripts/coverage.sh` + `tools/informe-cobertura.cs` |
| `QG-04` | Reparto de la pirámide: **60 % integración / 40 % unitarias** | ídem |

### 2.1 Umbrales de `QG-03`

Transcriptos del intake §22 (asunción `A-3`) y **confirmados por la decisión `D1` del 2026-08-26**,
que volvió bloqueantes a `QG-03` y `QG-04`:

| Proyecto | Líneas | Ramas |
| --- | --- | --- |
| `GeometriaFactory.Domain` | 90 % | 85 % |
| `GeometriaFactory.Application` | 85 % | 80 % |
| `GeometriaFactory.Infrastructure` | 85 % | 80 % |
| `GeometriaFactory.Api` | 75 % | 70 % |
| `Contracts` y `Web` | **sin umbral de líneas**: sus puertas son de otra forma | — |

### 2.2 Cómo se lee el resultado

`scripts/coverage.sh` sale **0** (las dos puertas pasan), **1** (alguna no pasa) o **2** (**no se
pudo medir** — la batería falló o el recolector no dejó informe). **El `2` no es aprobación.**
`QG-02` frena antes que `QG-03`: no se mide cobertura sobre rojo.

**`coverlet.runsettings` excluye del denominador lo marcado con `GeneratedCodeAttribute`**, y sólo
eso. Medido el 2026-08-29 sobre `GeometriaFactory.Api`: **202 de sus 407 ramas** —la mitad— salían
del generador de comentarios XML de OpenAPI. Excluir de más también miente: una primera versión que
sumaba `CompilerGeneratedAttribute` dejó a `Application` en **6 ramas** y el porcentaje dejó de
medir nada.

---

## 3. Las puertas técnicas

| Puerta | Qué exige | Estado |
| --- | --- | --- |
| `PT-01` | Viabilidad de la plataforma del front sobre el hosting (`PT-01.a`) | Medida (2026-08-13) |
| `PT-02` | El visor funciona embebido y **diez navegaciones de ida y vuelta no lo degradan**: `destroy` libera geometrías, materiales y el contexto gráfico | **Pasa** |
| `PT-03` | El motor gráfico queda **dentro del paquete**, sin red de distribución externa | **Pasa** |
| `PT-04` | La imagen se construye, arranca, aplica transformaciones sobre base vacía y responde salud | Medida en la etapa `a` |
| `PT-05` | El caudal real, sobre uso real | **SIN MEDIR** — depende de la fase `i` |

Regla del roadmap §2.2: **una puerta que no pasa detiene la planificación de lo que depende de ella;
no se arrastra como deuda.**

`PT-02` se mide con navegador de verdad (`scripts/verify-viewer-lifecycle.sh`) y no de escritorio:
cada escena toma un contexto gráfico, el navegador permite pocos vivos —del orden de ocho a
dieciséis—, y si al salir no se libera **el navegador descarta el más viejo sin avisar**: la escena
se apaga sin error, sin excepción y sin nada en el registro.

---

## 4. Puertas de etapa

Un guion por etapa, que corre **contra los servicios de verdad** y dice qué prueba cubre qué
criterio:

| Guion | Criterios |
| --- | --- |
| `verify-navigation.sh` | Etapa `b`, criterio 1: las trece rutas responden 200 y devuelven su `<h1>` |
| `verify-visual-system.sh` | Etapa `b`, criterio 2: cinco controles de pasa/falla sobre el sistema visual |
| `verify-stage-c.sh` | 4 criterios: el administrador se configura en el primer arranque y sólo mientras no exista ninguno, y la sesión |
| `verify-stage-d.sh` | 10 criterios: ciclo de vida de la cuenta de alumno y reseteo |
| `verify-stage-e.sh` | 5 criterios: trabajo con dueño, estado e identificador, y listado del administrador |
| `verify-stage-f.sh` | 8 criterios: interpretación del texto real, con el envío como acción única |
| `verify-stage-g.sh` | 7 criterios: las tres figuras del escenario semilla se dibujan, ortoedro incluido, y diez navegaciones no degradan |
| `verify-stage-h.sh` | 7 criterios: aprobación y rechazo, y **cierra el alcance comprometido** |
| `verify-stage-i.sh` | 7 criterios del primer despliegue real. **Escrito; la fase no ocurrió** |
| `verify-explicit-configuration.sh` | La regla de configuración explícita del repositorio |
| `verify-viewer-lifecycle.sh` | `PT-02`, con navegador real |

`scripts/lib-puerta.sh` es la forma común de las puertas `d`, `e` y `f` — las tres hacen lo mismo, y
escribir el bucle tres veces habría creado tres lugares donde el formato de salida puede divergir.
Las puertas `c`, `g` y `h` no la usan.

---

## 5. Antes de dar por terminado un cambio

```bash
bash scripts/build.sh        # 0 y sin advertencias
bash scripts/test.sh         # 0
bash scripts/coverage.sh     # 0, y 2 NO es aprobación
git status --short           # el árbol dice sólo lo que se tocó
# y si el cambio toca una etapa con puerta propia:
bash scripts/verify-stage-<letra>.sh
```
