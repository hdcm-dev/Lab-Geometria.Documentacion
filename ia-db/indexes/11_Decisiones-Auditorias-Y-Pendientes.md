# 11 · Decisiones, auditorías y lo que queda abierto

> **Propósito:** dónde está registrada cada decisión, quién la auditó y qué sigue sin decidir — para
> no reabrir lo cerrado ni dar por cerrado lo que sigue vivo.
> **Fuente primaria:** `SDD/Docs/Audit/` (104 documentos), `SDD/Docs/README.md` §8 y los `Adrs/` de
> producto y de las dos unidades.

---

## 1. Las decisiones de arquitectura

**Cincuenta y tres ADR** repartidos en tres ámbitos. La familia numérica identifica el ámbito:

| Familia | Ámbito | Cantidad | Dónde |
| --- | --- | --- | --- |
| `ADR-080XX` | Contratos y frontera entre unidades | 8 | `Producto/Adrs/` |
| `ADR-140XX` | Migración normativa y despliegue | 5 | `Producto/Adrs/` |
| `ADR-000XX` | Host REST (`Api`) | 8 | `Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/` |
| `ADR-020XX` | Dominio | 6 | ídem |
| `ADR-040XX` | Casos de uso y puertos | 6 | ídem |
| `ADR-060XX` | Infraestructura | 7 | ídem |
| `ADR-100XX` | Front Blazor | 7 | `Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Adrs/` |
| `ADR-120XX` | Visor 3D | 6 | ídem |

Las **de nivel producto** que más se citan: `ADR-08006` (el visor recibe piezas reconstruidas y no
el texto), `ADR-08002` (tipo de error único con conjunto cerrado), `ADR-08004` (regla de exposición
de la frontera), `ADR-14003` (dirección del backend por IP dinámica) y `ADR-14004` (**un ítem
obligatorio sin objeto se declara NO APLICA**, con su condición de reapertura).

## 2. Las decisiones del Product Owner

`Audit/A3-Decisiones-Del-Product-Owner.md` es el registro; **pero no siempre se enteró de los
cierres**, y eso importa al leerlo.

| Id | Qué | Desenlace |
| --- | --- | --- |
| `D1` | Los umbrales rotulados como asunción —coberturas, latencias, caudal, arranque en frío— | **Confirmados el 2026-08-26.** Cerró doce filas vencidas y volvió **bloqueantes** diez puertas |
| `D5` | El volumen de la comisión: cuántos alumnos | **Cerrada el 2026-08-20 por INCOGNOSCIBLE**: el dato no se sabe ni se puede saber de antemano, y **no se fija número**. `A3` no lo registró |

## 3. Las auditorías

Un auditor independiente, **invocado desde cero en cada fase y sin participación en la generación**.
Los informes viven en `Audit/` con la forma `<fase>-<categorías>-<ámbito>-r<ronda>.md`:

| Serie | Alcance |
| --- | --- |
| `A-00-01-*` | Contexto y necesidades de negocio (3 rondas) |
| `B-02-03-*` | Especificación funcional y UX de los siete proyectos (2 a 3 rondas cada uno) |
| `B2-Maqueta-*` | La maqueta del front |
| `C-05-*`, `D-06-07-*`, `E-08-*`, `F-09-*`, `G-10-*` | Arquitectura, backlog, calidad, devops y ejemplos |
| `H-Final-Consolidado-r1` | El consolidado |
| `Coherencia-Corpus-r1/r2` | Coherencia del corpus completo |

El rechazo de Fase B de `GeometriaFactory-Api` —diecisiete hallazgos, 2026-08-11— **se cerró el
mismo día** con dictamen APROBADO en la ronda 2.

**Siete migraciones normativas**, seis cerradas (6.0 → 8.6 → 8.11 → 9.9 → 9.10 → 9.12 → 10.0) y la
séptima **en curso** (10.0 → 13.3), cada una con su plan y su informe en `Audit/`.

**Las mesas de evaluación** —`Mesa-2026-08-27.md`, `Mesa-2026-08-29.md`, `Mesa-2026-08-31.md` y
`Mesa-2026-08-31-B.md`— son revisiones colegiadas del estado del producto; de la del 2026-08-31
salió el `Plan-Mejora-Integral-2026-08-31.md`, con doce hallazgos y quince unidades de trabajo.

## 4. La bitácora de eventualidades

`Producto/11-Documentacion/Bitacora-Eventualidades.md` — **ocho entradas**, cada una con lo que se
probó y **no** funcionó. Antes de pelear con el entorno, mirala:

| Id | Qué |
| --- | --- |
| `EVE-00001` | El servicio ignora `ASPNETCORE_URLS` y escucha en 5080 |
| `EVE-00002` | El contenedor deja archivos de root en el árbol |
| `EVE-00003` | SQLite en WAL deja tres archivos y no uno |
| `EVE-00004` | Una página abierta con `file://` no puede leer sus archivos vecinos ni cargar módulos |
| `EVE-00005` | La imagen del SDK no trae `jq`, `python3` ni `sqlite3` |
| `EVE-00006` | Una aplicación de un solo archivo necesita `#:project`, y `JsonSerializer` la rompe |
| `EVE-00007` | El puerto del servicio colisiona con el despliegue local del Product Owner |
| `EVE-00008` | Una batería en verde reportada como puerta en rojo |

---

## 5. Lo que queda abierto al 2026-08-31

**Un solo punto abierto de nivel producto.**

| Punto | Por qué sigue vivo | Evento de cierre |
| --- | --- | --- |
| **El caudal de 20 peticiones por minuto queda PROVISORIO, y su fundamento ya no existe.** Se derivaba de «una comisión operando durante una clase»; al cerrarse `D5` **por incognoscible**, ese fundamento se cayó. El número se conserva como referencia y **no está validado por nada** | No hay decisión que lo conteste: se resuelve **midiendo** | **`PT-05`**, en la fase `i` · Despliegue real |

Cerrados el mismo 2026-08-31, y **ninguno se cerró decidiendo — los tres se cerraron mirando**: las
aristas de compilación (son ocho), las marcas `[A VERIFICAR]` (71 apariciones vivas → cinco
incógnitas, no ocho marcas) y los hallazgos de los samples (cero vivos).

### 5.1 La lección que esa sección dejó, y que conviene heredar

De los ocho puntos que llegó a listar, **seis se cerraron sin que nadie tocara la tabla**, y en tres
casos el desenlace ya vivía en el árbol mientras la fila seguía declarándolos abiertos. Ninguno se
perdió por estar mal argumentado: se perdieron porque **un resumen derivado no tiene forma de saber
que su fuente cambió**. Está elevado al framework como el **reporte 21**.

**Aplicado a esta ia-db:** antes de repetir un pendiente de este índice, **abrí la fuente que lo
declara**. Si el árbol ya lo cerró, corregí el índice — es exactamente el caso que la regla de
sincronización cubre.

## 6. La fase `i`, que es lo que falta

`Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md` acota qué contesta y qué no. Su puerta está
escrita —`scripts/verify-stage-i.sh`, siete criterios, entre ellos que la publicación del front sea
**reproducible**— y `Audit/Medicion-PT-05.md` está en **SIN MEDIR**. El acto de desplegar es manual
y del Product Owner.
