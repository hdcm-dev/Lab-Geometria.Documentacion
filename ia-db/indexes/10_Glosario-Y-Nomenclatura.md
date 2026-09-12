# 10 · Glosario y nomenclatura — cómo se nombra algo antes de escribirlo

> **Propósito.** La regla de nombres del producto y el vocabulario del dominio, para escribir un
> identificador o un texto de pantalla sin inventar.
> **Fuente primaria.** `SDD/Docs/Producto/Norma-De-Nomenclatura.md` (2.364 líneas),
> `SDD/Docs/README.md` §9 y los glosarios funcionales de cada unidad. Verificado el 2026-09-11.

---

## 1. La regla, en una línea

> **Identificadores de código en inglés; texto para personas en castellano.**

Y su corolario operativo, que es el que se rompe:

> **Si un concepto no está en la tabla de §6, no se traduce por criterio propio: se agrega
> primero.**

Los códigos van en `SCREAMING_SNAKE_CASE`, con palabras inglesas separadas por `_`, sin artículos
ni preposiciones sueltas, **sin prefijo de proyecto y sin el prefijo `CONTRATO_`**, que la decisión
`F-03` eliminó del código conservándolo en la documentación.

**Cuatro corolarios**: un concepto, un nombre · un nombre, un concepto · los códigos conservan su
forma y cambian de idioma · **agregar una fila es un acto declarado**, con entrada en el control de
cambios.

## 2. La zona de frontera: las tres decisiones tomadas

Tomadas por el Product Owner el **2026-08-12**. La norma no las decide: las asienta y las hace
verificables.

| Id | Qué decide |
| --- | --- |
| `F-01` | **Las seis funciones de la fachada del visor** van en inglés |
| `F-02` | **Los valores de los conjuntos cerrados** van en inglés en el código; la pantalla los muestra en castellano |
| `F-03` | **Los códigos de condición y de contrato** van en inglés y **sin el prefijo `CONTRATO_`**. Es cambio de contrato |

**Lo que no es frontera y no se discute: el dato del alumno.** El texto que el alumno pega llega
con las claves que su programa emite, y el producto lo conserva íntegro (`RN-02008`).

## 3. El glosario: dónde buscar

`Norma-De-Nomenclatura.md` §6 cubre **155 identificadores** en seis clases, más las superficies
derivadas y los agregados por etapa. **Es la fuente única de la correspondencia**: ningún otro
documento la redeclara.

| Sección | Contenido |
| --- | --- |
| §6.1 – §6.2 | La regla del glosario y su cobertura, contada |
| §6.3 | Clase 1 · Interfaces y puertos (5) |
| §6.4 | Clase 2 · Entidades y tipos (31) |
| §6.5 | Clase 3 · Miembros y propiedades (2) |
| §6.6 | Clase 4 · Las seis funciones de la fachada (6) |
| §6.7 | Clase 5 · Valores de conjuntos cerrados (10) |
| §6.8 | Clase 6 · Códigos de condición y de contrato (101) |
| §6.9 | Las dos unificaciones y las cuatro coincidencias de nombre |
| §6.10 | Los espacios de nombres |
| §6.11 | Las superficies derivadas: carpetas y nombres de archivo |
| §6.12 – §6.25 | Los agregados por etapa, **fuera de los 155**: `b`, `c`, sesión por marca de navegador, `d` (servicio e interfaz), interacción de superficie autorizada, guardián de aprovisionamiento, `e` (servicio e interfaz), validador de figuras de `f`, `ADR-08006`, capa 3 del visor y su anfitrión de `g`, documentación de la superficie HTTP de `g`, y **el árbol del texto de `g` (§6.25)** |

**Cada fila lleva cuatro columnas**: castellano, inglés, clase y **dónde está declarado el
concepto**. La cuarta no es decorativa: permite verificar la fila contra su fuente en lugar de
creerle.

**La colisión que más conviene tener presente**: «Pendiente» son **dos conceptos** —el estado de
cuenta `Pending` y el estado de trabajo `Submitted`—, y §6.7 declara cuál va en cada contexto.

**Lo que la norma todavía no tiene**: ninguna sección agrega los nombres del PR #186
(`Dockerfile.web`, la etapa `visor`, `lab-geometria-api`). No son identificadores de código y la
norma no los exige; se anota para que nadie los busque ahí.

## 4. El vocabulario del dominio

| Término | Definición |
| --- | --- |
| **Trabajo** | Lo que carga el alumno: nombre, fecha, descripción y el texto con el conjunto de piezas, con identificador propio y estado |
| **Estado del trabajo** | Conjunto cerrado de cuatro: `Borrador`, `Pendiente`, `Finalizado`, `Rechazado` |
| **Enviar** | **La única acción de guardado del alumno**: interpreta el texto y decide el estado. No hay guardar sin enviar |
| **Pieza** | Cada figura del conjunto raíz; **su identidad es su posición**, porque el dato no trae identificador |
| **Componente** | Figura plana que forma parte de una pieza: tapa, cara, base, lateral o lado |
| **Observación** | Lo que el producto emite al interpretar; agrupa dos especies |
| **Advertencia** | Discrepancia entre un valor declarado y el derivado. **No impide** pasar a `Pendiente` |
| **Error de validación** | Defecto que impide interpretar el texto; deja el trabajo en `Borrador` con sus errores localizados |
| **Valor declarado / valor derivado** | El que trae el texto y el que el producto recalcula. **El par es lo que hace visible el error de fórmula** |
| **Aprobar / rechazar** | Las dos decisiones del administrador sobre un trabajo en `Pendiente`; su facultad exclusiva |
| **Comentario** | Texto libre y opcional del administrador al resolver. **No es una calificación ni una observación** |
| **Provisoria** | La contraseña que el sistema produce al habilitar o resetear; se muestra una vez y deja la marca de cambio pendiente |
| **Actividad 1** | El trabajo práctico de la cátedra que emite el dato. No forma parte del producto |
| **Laboratorio** | Como la cátedra nombra a este producto en uso |
| **Etapa** | Cada tramo de la construcción, con su punto de control al cierre |
| **Punto de control** | **Detención obligatoria** al cerrar una etapa, a la espera del OK explícito del Product Owner |
| **Puerta técnica** | Verificación de viabilidad que condiciona la planificación; la que no pasa detiene lo que depende de ella |
| **Proyecto de código** | Unidad de compilación, con su tipo, rol y dependencias declaradas |
| **Unidad desplegable** | Proceso que se despliega por separado. Acá son dos |
| **Puerto** | Contrato que define la capa de casos de uso y que implementa la de adaptadores; **la dependencia se invierte** |
| **Fachada del visor** | Las seis funciones que el anfitrión puede invocar del bundle. **Único punto de extensión declarado** |
| **Escenario** | Cada uno de los ocho juegos de datos `E-1` a `E-8` que el intake transcribe. **No se inventan datos de prueba** |
| **Banco local** | El modo de la batería de extremo a extremo que levanta el producto entero con almacén y puertos propios |
| **Mesa** | Instancia de evaluación convocada por condición y no por calendario, con veredictos escritos |

Los glosarios de categoría no se reemplazan con éste: el del dominio del cliente está en
`00-Contexto/Vision-Producto.md` §9, cada unidad lleva el suyo en su `02-Especificacion-Funcional/`
y el de experiencia de uso está en `Web/03-UX-UI-DX/Glosario-UX.md`.

## 5. Las familias de identificador del corpus

Para leer una cita del corpus sin buscar qué es cada prefijo:

| Familia | Qué nombra | Dónde vive |
| --- | --- | --- |
| `NB-000NN` | Necesidad de negocio (9) | `01-Necesidades-Negocio/` |
| `RN-020NN` | Regla de negocio (16) | `Api/02/Reglas-De-Negocio/` |
| `INV-0N` | Invariante del dominio (9) | `PRODUCT-INTAKE` §14 |
| `CU-XXXXX` | Caso de uso (48) | `02/Casos-De-Uso/`, `05/Operaciones-Internas/`, `05/Contrato-Componente-Visor/`, `Producto/Contratos-Inter-Unidad/`, `10-Examples/` |
| `US-000NN` | Historia de usuario (144) | `06-Backlog-Tecnico/historias-usuario/` |
| `ADR-XXXXX` | Decisión de arquitectura (53) | Los tres `Adrs/`; el bloque dice de quién es |
| `A-NN` | Punto de acceso HTTP (17 vivos) | `Contratos-REST.md` §3 |
| `QG-XXX` | Puerta de calidad | `08-Calidad-Y-Pruebas/` y `09-Devops/` |
| `CV-000NN` | Criterio de validación | `08/Criterios-Validacion.md` |
| `VER-NN` / `SD-NN` | Contrato de verificación / sonda de sensado de un sample | `10-Examples/` y `Matriz-Sensado-Deriva.md` |
| `PT-0N` | Puerta técnica de viabilidad | `Roadmap-Producto.md` §2.2 |
| `RA-0N` | Regla de arquitectura de nivel producto (3) | `PRODUCT-INTAKE` §14 |
| `RI-0N` | Riesgo de integración (6) | `Vista-Producto.md` §7 |
| `EVE-000NN` | Eventualidad del entorno (8) | `Bitacora-Eventualidades.md` |
| `AP-0N` | Apartamiento declarado | `Plan-Etapa-A.md` y el `PRODUCT-MANIFEST` |
| `C-N`, `I-N` | Criterio de una puerta de etapa o control del sistema visual | `scripts/verify-*.sh` |
| `D1`, `D5`, `A3`… | Decisiones del Product Owner | `Audit/A3-Decisiones-Del-Product-Owner.md` y `Audit/D1-…` |
| `H-N`, `V-N`, `M-NN`, `MI-NN`, `HM-NN` | Hallazgos y veredictos de las mesas | `Audit/Mesa-*.md` y `Plan-Mejora-Integral-2026-08-31.md` |
| `O-N` | Observación de esta base de conocimiento | [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) |
| `AG-000NN` | Rol de agente del framework SDD | `Docs/README.md` §4 |

**Los bloques de `ADR` y `QG`** dicen de qué proyecto es cada identificador: `00` Api, `02` Domain,
`04` Application, `06` Infrastructure, `08` Contracts, `10` Web, `12` Visor, `14` migración. El
renumerado a esa forma se hizo en el tramo `R-4` del 2026-08-29, y **las referencias cuyo bloque no
estaba en el texto conservan la forma vieja a propósito**, inventariadas en
`Audit/Inventario-Renumerado-R-4-2026-08-29.md`.
