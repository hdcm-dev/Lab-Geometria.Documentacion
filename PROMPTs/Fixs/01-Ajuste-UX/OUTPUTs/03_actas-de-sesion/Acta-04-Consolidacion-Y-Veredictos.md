# Acta 04 — Consolidación y veredictos

**Fecha**: 2026-09-02 · **Ciclo**: 1 · **Consolida**: el consultor de documentación (no vota).
**Juzga**: los cinco jueces, hallazgo por hallazgo, con fundamento por voto.

## 1. Qué entró

**Nueve informes**: seis comisiones de especialidad (`A`–`F`) y tres usuarios estándar
(`US-1`, `US-2`, `US-3`). **63 hallazgos** emitidos, más `P-01`, que nace del peritaje del
Acta 03 y que ninguna comisión podía emitir sola.

Las nueve fuentes trabajaron a ciegas. Eso es lo que le da valor a lo que sigue: **cuatro
defectos fueron encontrados por separado por un experto que los midió y por un usuario que se
tropezó con ellos**, y esa coincidencia es la evidencia más fuerte que produjo el ciclo.

| Defecto | Quién lo midió | Quién se tropezó |
|---|---|---|
| El título lleva anillo de foco y parece un campo de texto | `E-01` (sonda: `activeElement` es el `H1`) | `US1-06`, `US2-06`, `US3-02` — los tres creyeron que era un campo para completar |
| Aprobar no acusa recibo | `D-01` (captura antes/después) | `US3-01` — «aprobé y no me enteré» |
| No se declara qué formato espera el trabajo | `C-01` | `US1-03`, `US3-05` — uno acertó al tercer intento, el otro copiando de un trabajo ajeno |
| Cambiar la contraseña expulsa al formulario | `C-03` | `US3-07` — «tuve que entrar dos veces» |

## 2. Deduplicación por raíz

Los 64 hallazgos se agrupan en **18 raíces**. La columna «capa» decide dónde se puede parchear:
un parche que no ataca la capa más alta que contiene el defecto se rechaza aunque funcione
(`Mesa-UX-UI.md` §1-bis).

| Raíz | Capa | Hallazgos que la comparten |
|---|---|---|
| `R-01` No hay escala tipográfica | **2 · tokens** | `A-02` `A-03` `A-06` `A-07` · `C-1` mecánico |
| `R-02` El ritmo de espaciado se contradice | **2 · tokens** | `A-05` · `C-2` mecánico |
| `R-03` Roles tipográficos invertidos: el encabezado es el texto más chico | 3 · componente | `A-01` `F-01` |
| `R-04` Sin tope de ancho ni medida de línea | 3 | `B-01` `A-04` |
| `R-05` Las tablas hermanas no comparten retícula y las acciones no caben | 3 | `B-02` `B-03` `B-05` |
| `R-06` En angosto la acción destructiva sube al primer lugar | 3 | `B-04` |
| `R-07` La identidad de la persona se derrama de la barra lateral | 3 · 5 | `B-06` `F-07` |
| `R-08` Anillo de foco sobre un elemento no interactivo | 3 | `E-01` `US1-06` `US2-06` `US3-02` · `C-3` mecánico |
| `R-09` El recorrido de teclado empieza después de la navegación | 5 | `E-02` `E-03` |
| `R-10` Contraste por debajo del piso | 3 | `E-04` `E-05` |
| `R-11` **El producto afirma lo que no hizo** | 5 · 3 | **`P-01`** `US1-05` `US2-04` `US2-02'` `C-01` `US1-03` `US3-05` |
| `R-12` Las acciones de resolución no acusan recibo | 5 | `D-01` `US3-01` |
| `R-13` No hay camino para corregir desde donde se lee la observación | 5 | `C-04` `US2-01` `C-05` `US2-03` |
| `R-14` El primer ingreso afirma un reseteo que no ocurrió | 5 | `C-02` `US1-01` `US1-02` `D-06` |
| `R-15` Entregar es irreversible y no se avisa | 5 | `C-06` `US3-04` |
| `R-16` Terminar el cambio de contraseña expulsa al formulario | 5 | `C-03` `US3-07` |
| `R-17` Divergencias de paridad y sello de versión | 4 · 5 | `F-02` `F-03` `F-04` `F-05` `F-06` |
| `R-18` Sueltos sin raíz común | varias | `C-07` `D-02` `D-03` `D-04` `D-05` `D-07` `E-06` `E-07` `B-07` `US2-05` `US2-07` `US3-03` `US3-06` |

## 3. Contradicciones entre informes, resueltas antes de votar

Una sola, y se resolvió con el peritaje del **Acta 03**, no con una votación: `US-1` y `US-2`
afirmaban que el producto no dibuja y no señala el error de fórmula; la comisión C afirmaba que sí.
**Las tres estaban bien medidas y las tres incompletas.** El experimento de dos envíos que cambia
una sola variable mostró que el producto hace lo que promete cuando puede leer la figura, y que
cuando no puede **emite tres señales de éxito y ninguna de aviso**. De ahí sale `P-01`, y con él la
raíz `R-11`.

Consecuencia: `US2-02` queda **refutado tal como estaba redactado** y reformulado. Es el único
hallazgo del ciclo que no sobrevivió a su verificación, y queda registrado como tal.

## 4. Veredictos

Quórum de cinco en todos los ítems. Votos: **Ev** evidencia · **Im** impacto · **CB** costo-beneficio
· **Co** coherencia histórica · **Ri** riesgo.

| Raíz | Sev | Ev | Im | CB | Co | Ri | Resultado | Fundamento del voto que decide |
|---|---|---|---|---|---|---|---|---|
| `R-11` | **S1** | P | P | P | P | P | **PROCEDE 5-0** | Ri: «el parche sólo agrega aviso, no quita función; revertible en una línea». Im: «es el valor declarado del producto, desactivado justo para quien más lo necesita» |
| `R-03` | **S1** | P | P | P | P | P | **PROCEDE 5-0** | Ev: «medido en el navegador y contrastado contra la maqueta, que emite 14 px en caja mixta» |
| `R-01` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Co: «no reabre una decisión cerrada: la identidad son paleta y familia, y ninguna se toca» |
| `R-02` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Ev: «el archivo se contradice a sí mismo por escrito; no hace falta opinar» |
| `R-04` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Im: «1136 px entre el dato y su botón es un dato medido, no una impresión» |
| `R-05` | S2 | P | P | P | P | P | **PROCEDE 5-0** | CB: «cinco abscisas distintas para la misma columna se corrigen con retícula declarada» |
| `R-06` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Ri: «la destructiva en el primer lugar del pulgar es riesgo, no estética» |
| `R-08` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Ev: «tres usuarios estándar, ciegos entre sí, lo leyeron como campo de texto» |
| `R-10` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Ev: «2,04:1 contra un piso de 4,5:1; es aritmética» |
| `R-12` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Im: «es el origen del reporte del Product Owner sobreviviendo a un producto que ya funciona» |
| `R-14` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Ev: «el producto afirma un hecho falso sobre lo que hizo el docente» |
| `R-13` | S2 | P | P | P | **N** | P | **PROCEDE 4-1** | Co votó `NO_PROCEDE`: «`Vista-De-Trabajo.html` de la maqueta tampoco ofrece corregir». La mayoría: la maqueta tiene tres huecos declarados y éste es uno; manda la evidencia |
| `R-15` | S2 | P | P | P | P | P | **PROCEDE 5-0** | Ri: «el aviso es aditivo; no cambia qué se puede hacer, sólo cuándo se entera» |
| `R-16` | S3 | P | P | **N** | P | P | **PROCEDE 4-1** | CB votó `NO_PROCEDE` por costo de sesión; la mayoría: dos usuarios independientes lo sufrieron |
| `R-07` | S3 | P | P | P | P | P | **PROCEDE 5-0** | — |
| `R-09` | S2 | P | P | **N** | P | **N** | **INSUFICIENTE 3-2** | Ri: «`E-03` describe pérdida de foco a 1,5 s en superficies interactivas y su causa está en el circuito, no en la hoja; un parche a ciegas puede empeorarlo». Vuelve al ciclo 2 con pedido concreto. La mitad que **sí** procede —el orden del enlace de salto— se absorbe en `R-08` |
| `R-17` | S3 | P | **N** | **N** | P | P | **NO_APLICAR 2-3** | El `README.md` de la maqueta declara sus tres huecos y su vía: «una iteración 5» que no ocurrió. Corregir el producto contra una maqueta que el propio Product Owner dejó a medias sería parchear contra una fuente que no manda. **Deuda declarada**, salvo `F-02` (dos formatos de la misma fecha en la misma pantalla), que se aprueba suelto 5-0 |
| `R-18` | S3/S4 | — | — | — | — | — | **Diferido al ciclo 2** | Trece hallazgos sueltos, ninguno S1 ni S2 salvo `E-06`, que depende del hospedaje y no de la hoja |

**Chequeo de homogeneidad** (`Mesa-Evaluadora.md` §9): 14 de 18 ítems se votaron 5-0, o sea el
**78 %**, por debajo del umbral del 80 % que marcaría el ciclo como sospechoso. Los cuatro ítems con
disenso son los cuatro donde el disenso importaba. El abogado del diablo revisó los `NO_APLICAR` y
sostuvo el de `R-17`.

## 5. Chequeo obligatorio de capa de origen

Antes de aprobar ningún parche (`Mesa-Evaluadora.md` §5.5): **¿corrige en la capa donde nació?**

- `R-01` y `R-02` nacen en los **tokens**. Un parche que arreglara la tipografía pantalla por
  pantalla se rechaza. Se corrigen **los cinco tokens de tamaño y los nueve de espaciado**, y con
  eso cambian las trece pantallas a la vez.
- `R-03` a `R-10` nacen en **reglas de componente**. Se corrigen ahí, no en las superficies.
- `R-11` a `R-16` nacen en **superficies**. Ahí se corrigen.

## 6. La decisión de forma que condiciona todo el lote

El precedente disponible —el `escala.css` del Fix 04 de otro producto— **no se adopta acá**, y el
motivo es medible: este repositorio tiene una puerta, `scripts/verify-visual-system.sh`, cuyo
control `C-4` exige que **los tokens de `app.css` sean exactamente los de la maqueta, nombre por
nombre y valor por valor**. Corrida antes de tocar nada: *«CONFORME · 50 tokens, idénticos a los de
la maqueta»*.

Una capa de override encima dejaría esa puerta **mirando los tokens viejos**: seguiría diciendo
«conforme» sobre valores que ya no gobiernan nada. La garantía que hoy existe se convertiría en
ruido.

> **Los tokens se editan en su lugar, en los dos archivos, con el mismo valor.** La puerta que ya
> vigila la paridad es la que va a verificar el parche, en vez de quedarse ciega frente a él.

Las reglas de componente no pueden ser byte a byte idénticas —la maqueta usa el prefijo `.mq-` y el
producto el `.gf-`—, así que ahí la paridad es **de intención y de valor**, y se verifica con la
captura del mismo encuadre en los dos.
