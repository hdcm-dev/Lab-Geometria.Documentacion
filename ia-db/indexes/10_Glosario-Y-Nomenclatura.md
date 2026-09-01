# 10 · Glosario y norma de nomenclatura

> **Propósito:** cómo se nombra algo **antes** de escribirlo, y qué significa cada término del
> producto, para no acuñar un nombre por criterio propio.
> **Fuente primaria:** `SDD/Docs/Producto/Norma-De-Nomenclatura.md` (v1.17, 2026-08-31) y
> `SDD/Docs/README.md` §9.

---

## 1. La norma, en tres reglas

1. **Identificadores de código en inglés; texto para personas en castellano.** Espacios de nombres,
   clases, métodos y variables van en inglés; todo lo que lee una persona va en castellano.
2. **La fuente de nombres es el §6 de la norma** — un glosario de **diecisiete tablas**. Un concepto
   que no está en la tabla **se agrega primero**; no se traduce por criterio propio.
3. **Los códigos de condición van en inglés, sin prefijo `CONTRATO_`, declarados en su catálogo.**
   No se acuña uno nuevo sin agregarlo.

### 1.1 Las tres decisiones de frontera, ya tomadas

| Id | Frontera | Desenlace |
| --- | --- | --- |
| `F-01` | Las seis funciones de la fachada del visor | Decidida: `initialize`, `loadPieces`, `selectPiece`, `resize`, `destroy`, `setMotion` |
| `F-02` | Los valores de los conjuntos cerrados | Decidida: llevan **el vocabulario del emisor** (`Cilindro`, `Tapa`, …) |
| `F-03` | Los códigos de condición y de contrato | Decidida, **y es cambio de contrato**: en inglés y sin el prefijo `CONTRATO_` |

**Lo que no es frontera y no se discute: el dato del alumno.** Sus claves llegan como llegan.

### 1.2 Los renombres suspendidos

El **2026-08-13** el Product Owner **suspendió los cinco tramos de renombre que quedaban**:
renombraban identificadores en documentos que describían código que todavía no existía, y el
glosario ya estaba completo para escribir ese código en inglés desde el primer archivo. La regla que
los reemplaza está en §8 de la norma. Un identificador **retirado conserva su fila con el motivo del
retiro** (§4.1 y §6.8.5).

---

## 2. Glosario del producto — veintiún términos

| Término | Definición |
| --- | --- |
| **Trabajo** | Unidad que carga el alumno: nombre, fecha, descripción y el texto con el conjunto de piezas, con identificador propio y estado |
| **Estado del trabajo** | Conjunto cerrado de cuatro valores: `Borrador`, `Pendiente`, `Finalizado`, `Rechazado` |
| **Enviar** | La **única** acción de guardado del alumno: interpreta el texto y decide el estado. No hay una acción separada de guardar sin enviar |
| **Pieza** | Cada figura del conjunto raíz del trabajo; **su identidad es su posición**, porque el dato no trae identificador propio |
| **Componente** | Figura plana que forma parte de una pieza: tapa, cara, base, lateral o lado |
| **Observación** | Lo que el producto emite al interpretar el texto; agrupa dos especies |
| **Advertencia** | Discrepancia entre un valor declarado y el derivado; **no impide** que el trabajo pase a `Pendiente` |
| **Error de validación** | Defecto que impide interpretar el texto como figuras; deja el trabajo en `Borrador` con sus errores localizados |
| **Valor declarado / valor derivado** | El que trae el texto del alumno y el que el producto recalcula; **el par es lo que hace visible el error de fórmula** |
| **Aprobar y rechazar** | Las dos decisiones del administrador sobre un trabajo en `Pendiente`; facultad exclusiva suya |
| **Comentario** | Texto libre y opcional que el administrador deja al resolver. No es una calificación ni una observación |
| **Actividad 1** | Trabajo práctico de la cátedra que emite el dato que este producto consume; **no forma parte del producto** |
| **Laboratorio** | Nombre corriente con el que la cátedra nombra a este producto en uso |
| **Etapa** | Cada tramo en que el intake descompone la construcción, con su punto de control al cierre |
| **Punto de control** | Detención obligatoria al cerrar una etapa, a la espera del **OK explícito** del Product Owner |
| **Puerta técnica** | Verificación de viabilidad que condiciona la planificación; la que no pasa **detiene** lo que depende de ella |
| **Proyecto de código** | Unidad de compilación, con su tipo, su rol y sus dependencias declaradas en el manifiesto |
| **Unidad desplegable** | Proceso que se despliega por separado; este producto tiene **dos** |
| **Puerto** | Contrato que la capa de casos de uso define y que la de adaptadores implementa; la dependencia se invierte |
| **Fachada del visor** | Las seis funciones que el anfitrión puede invocar del bundle; **el único punto de extensión declarado del producto** |
| **Escenario** | Cada uno de los ocho juegos de datos completos `E-1` a `E-8` que el intake transcribe y que el producto usa como material de prueba. **No se inventan datos de prueba** |

Glosarios adicionales, cuando el término no está acá: el del dominio del cliente en
`00-Contexto/Vision-Producto.md` §9; el funcional de cada unidad en su categoría 02
(`Glosario-Funcional.md`); y el de experiencia en `03-UX-UI-DX/Glosario-UX.md`.

---

## 3. Correspondencias que conviene tener a mano

| Identidad de código | Etiqueta para la persona |
| --- | --- |
| `Draft` / `Submitted` / `Approved` / `Rejected` | Borrador / Pendiente / Finalizado / Rechazado |
| `Student` / `Administrator` | Alumno / Administrador |
| `Pending` / `Enabled` / `Blocked` (cuenta) | Pendiente / Habilitada / Bloqueada |
| `Cap` / `Face` / `Base` / `Lateral` / `Side` | Tapa / Cara / Base / Lateral / Lado |
| `Work`, `Piece`, `Component`, `Observation`, `Account` | Trabajo, Pieza, Componente, Observación, Cuenta |

**Antes de acuñar un nombre nuevo**: buscalo en el §6 de la norma; si no está, **se agrega ahí
primero** y recién después se escribe el código.
