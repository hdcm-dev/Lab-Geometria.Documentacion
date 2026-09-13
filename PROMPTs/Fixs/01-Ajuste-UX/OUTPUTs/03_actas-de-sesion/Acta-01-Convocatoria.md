# Acta 01 — Sesión de convocatoria

**Fecha**: 2026-09-02 · **Ciclo**: 1 · **Marco**: `00_marco/Mesa-UX-UI.md` §5-bis, sobre
`Mesa-Evaluadora.md` §5.1c · **Objeto**: la interfaz en ejecución de `aplicada.somee.com` y su
maqueta aprobada.

## 1. Apertura

Se declara el contrato de entrada (`01_contrato-y-base/Contrato-De-Entrada.md`) y se lo da por
completo: los ocho campos están. Se dejan asentadas las dos restricciones que gobiernan todo el
ciclo, porque son las que más fácil se olvidan a mitad de camino:

- **La identidad visual no se toca.** Paleta, marca y familia tipográfica están en
  `decisiones_cerradas`. Cambiar la **escala de tamaños** dentro de la misma familia **no** es
  cambiar la identidad, y por §6-bis del marco la mesa lo resuelve sola: es exactamente lo que el
  Product Owner pidió.
- **Sobre el laboratorio desplegado sólo se actúa en lo que la mesa sembró.** Hay trabajos de tres
  personas reales de la comisión. Se los mira; no se los toca.

## 2. Base mecánica

Se leen los resultados de `01_contrato-y-base/Chequeos-Mecanicos.md`. Tres de los cinco chequeos
fallan, y los tres con ancla ejecutable o literal:

| Chequeo | Resultado | Capa de origen |
|---|---|---|
| C-1 escala tipográfica | FALLA (`E1`) | 2 · tokens |
| C-2 ritmo de espaciado | FALLA (`E2`) | 2 · tokens |
| C-3 anillo de foco en el título | FALLA (`E1`) | 3 · componente |
| C-4 errores de consola | PASA | — |
| C-5 paridad maqueta ↔ producto | FALLA parcial (`E1`) | 4 y 5 |

**La mesa toma nota de lo que esto significa antes de convocar a nadie.** El defecto que el Product
Owner describió como «las proporciones de los tamaños de letras» **no vive en ninguna pantalla**:
vive en cinco líneas de tokens que las trece pantallas consumen. Cualquier comisión que proponga
corregirlo pantalla por pantalla estará parcheando aguas abajo, y §5.5 del marco base obliga a
rechazar ese parche aunque funcione.

## 3. Barrido de señales

El relevador —sin voto y sin capacidad de emitir hallazgos— recorre el objeto y lista lo observable:

| Señal | Ubicación |
|---|---|
| Más de un tamaño de letra declarado en tokens | `app.css:90-94` · `Estilos-Maqueta.css:83-87` |
| Escala de espaciado de nueve pasos | `app.css:97-99` |
| Trece pantallas con más de un control cada una | `Components/Pages/*.razor`, 15 rutas `@page` |
| Dos papeles con recorridos distintos | `NAV-08` alumno, `NAV-09` administrador (`SignIn.razor:12-13`) |
| Acciones de un papel sobre datos de otro | `/cuentas` (habilitar, bloquear, dar de baja, resetear), `/trabajos/{id}` (resolver) |
| Foco programático y navegación mejorada | `Routes.razor:28`, `wwwroot/interaction/surface-interaction.js` |
| Render estático para una superficie y circuito interactivo para el resto | `SignIn.razor` cabecera, `Web ADR-03` |
| Maqueta HTML aprobada, con línea de base visual fechada | `SDD/Maquetas/GeometriaFactory-Web/`, `Linea-Base-Visual.md` §7 |
| Estado de red y reconexión representados en la interfaz | `DegradedStateOverlay.razor`, `Estado-Degradado-Y-Reconexion.html` |
| Visor tridimensional embebido en una pantalla | `wwwroot/js/geometriafactory-visor.js` |
| Suite de extremo a extremo ya existente | `tests/GeometriaFactory.E2ETests`, `.github/workflows/e2e.yml` |

## 4. Votación de la composición

Los cinco jueces votan por especialidad propuesta. Mayoría simple; ante empate se convoca.

| Especialidad propuesta | Señal que la justifica | Evid | Impacto | C/B | Coher | Riesgo | Resultado |
|---|---|---|---|---|---|---|---|
| **A · Tipografía, escala y densidad** | C-1, `app.css:90-94` | C | C | C | C | C | **CONVOCAR** 5-0 |
| **B · Composición, ubicación y dimensionamiento** | C-2 + trece pantallas con controles | C | C | C | C | C | **CONVOCAR** 5-0 |
| **C · Flujo del alumno** | dos papeles con recorrido propio | C | C | C | C | C | **CONVOCAR** 5-0 |
| **D · Administración y prestabilidad** | acciones de un papel sobre datos de otro + reporte del PO | C | C | C | C | C | **CONVOCAR** 5-0 |
| **E · Accesibilidad y comportamiento (.NET/Blazor)** | C-3 + foco programático + render mixto | C | C | C | C | C | **CONVOCAR** 5-0 |
| **F · Paridad maqueta ↔ producto** | C-5 + maqueta aprobada con fecha | C | C | C | C | C | **CONVOCAR** 5-0 |
| **Usuarios estándar `US-1` `US-2` `US-3`** | interfaz destinada a dos personas del aula sin formación técnica | C | C | C | C | C | **CONVOCAR** 5-0, en segunda tanda |
| Rendimiento y costo | el visor 3D y el circuito interactivo | NC | NC | NC | C | NC | **NO_CONVOCAR** 1-4 |
| Seguridad y privacidad | credenciales, papeles, datos personales de alumnos | NC | NC | NC | C | NC | **NO_CONVOCAR** 1-4 |
| Datos y dominio | entidades, estados del trabajo | NC | NC | NC | NC | NC | **NO_CONVOCAR** 0-5 |

### Fundamentos de los descartes, que es lo que después permite corregir el criterio

- **Rendimiento y costo — `NO_CONVOCAR` (1-4).** La señal está y es real, pero el objetivo del ciclo
  es la proporción y la ubicación, no la latencia. El juez de coherencia histórica votó `CONVOCAR`
  dejando asentado que el encuadre del visor dentro de su recuadro ya produjo un defecto propio
  (`la-escena-acompana-el-tamano`, fusionada), de modo que **la comisión B toma el encuadre del
  visor como parte de su mandato de dimensionamiento**, y la especialidad de rendimiento queda en
  cola para el ciclo 2.
- **Seguridad y privacidad — `NO_CONVOCAR` (1-4).** El aislamiento entre papeles ya tiene cobertura
  en la suite de integración y no es lo que el Product Owner pidió mirar. Queda registrado que **si
  alguna comisión encuentra una acción de un papel alcanzable desde el otro, eso es una solicitud de
  convocatoria en caliente** (§5.2 del base) y no un hallazgo de la comisión que lo vea.
- **Datos y dominio — `NO_CONVOCAR` (0-5).** Los estados del trabajo son una decisión cerrada del
  intake y no se reabren en un ciclo de interfaz.

**Techo de panel**: el marco base fija núcleo + 5 variables. La mesa **excede el techo a propósito y
lo declara**: seis comisiones más tres usuarios estándar. El fundamento es que los usuarios estándar
no son una especialidad —no compiten por el cupo de expertos—, y que la comisión F no detecta
defectos propios sino divergencias entre dos artefactos, función que en el marco base cumpliría el
relator. Se registra como apartamiento del §4.1.4 para que el cierre lo evalúe.

## 5. Serialización acordada

Las seis comisiones de especialidad trabajan **a ciegas y en paralelo**, cada una con su propio
medio y con prefijo propio de archivos (`a-` … `f-`), porque `tools/medios/out/` es compartido y un
nombre repetido borra el registro ajeno.

Los tres usuarios estándar entran en **segunda tanda**. El motivo es medible: nueve navegadores
simultáneos contra un alojamiento gratuito que además duerme las aplicaciones ociosas producirían
lentitud atribuible a la mesa y no al producto, y un usuario estándar cuyo hallazgo es «tardó» no
puede distinguir una cosa de la otra. La mesa prefiere esperar antes que fabricar un hallazgo falso.

## 6. Objetivos de mejora

Los fija el moderador de objetivos en `03_actas-de-sesion/Acta-02-Objetivos-De-Mejora.md`, y toda
comisión los recibe **después** de emitir su informe, no antes: un objetivo conocido de antemano
sesga lo que se busca.

## 7. Cierre de la sesión

Convocadas seis comisiones y tres usuarios estándar. Descartadas tres especialidades con motivo
asentado. Ninguna escalada. El ciclo queda abierto.
