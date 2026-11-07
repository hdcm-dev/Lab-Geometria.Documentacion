# 14 · Glosario y norma de nomenclatura

> **Propósito:** ubicar la norma que separa el idioma de los identificadores (inglés) del idioma del texto (castellano), su glosario de correspondencia concepto→identificador, y el vocabulario canónico de los glosarios funcionales y de experiencia de las dos unidades de entrega más el glosario rápido del corpus.
> **Fuente primaria:** `SDD/Docs/Producto/Norma-De-Nomenclatura.md` (cabecera: «**Fecha:** 2026-08-31», sin campo de versión; el control de cambios §9 llega a la 1.31 del 2026-09-14; estado Aprobado, 2391 líneas; ver `19` N-9). Fuentes secundarias: los cuatro `Glosario-*.md` de `SDD/Docs/Unidades-Entrega/*/0[23]-*/`, `SDD/Docs/README.md` §9 y `SDD/Docs/00-Contexto/Vision-Producto.md` §9 (glosario raíz).
> **Revisión indexada:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** familias de identificadores documentales (`CU`, `RN`, `QG`, `CV`, renumeraciones) y migraciones → `17`; convenciones de commits/PR y comentarios → `18`; el comportamiento de cada concepto → índice de su dominio (`05`–`10`).

---

## 1. Mapa de fuentes

| Fuente (ruta relativa al repo) | Qué aporta | Versión · fecha · estado |
| --- | --- | --- |
| `SDD/Docs/Producto/Norma-De-Nomenclatura.md` | Norma de idioma + glosario de correspondencia (§6, 26 tablas/subsecciones) + controles `V-1..V-7` + plan de renombre `R-n` | cabecera 2026-08-31 · control de cambios hasta 1.31 (2026-09-14) · Aprobado |
| `SDD/Docs/Audit/Observacion-Desviacion-De-Nomenclatura.md` | Origen: cómo el corpus se salió del estándar (citado por la norma §1) | — |
| `SDD/Docs/00-Contexto/Vision-Producto.md` §9 | **Glosario raíz** de la cadena de trazabilidad; 02 y 03 referencian, no redefinen | — |
| `SDD/Docs/README.md` §9 | Glosario rápido: 21 términos de lectura | — |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/02-Especificacion-Funcional/Glosario-Funcional.md` | Vocabulario funcional de Api, Domain, Application, Infrastructure (504 líneas) | 2.0 · 2026-08-16 · Propuesto |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/03-UX-UI-DX/Glosario-UX.md` | Vocabulario de experiencia del desarrollador de esos cuatro proyectos (474 líneas) | 2.1 · 2026-08-16 · Propuesto |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/02-Especificacion-Funcional/Glosario-Funcional.md` | Vocabulario funcional de Web y Visor (227 líneas) | 2.0 · 2026-08-16 · Propuesto |
| `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/03-UX-UI-DX/Glosario-UX.md` | Vocabulario de superficie de Web y de DX del visor; palabras prohibidas (294 líneas) | 2.1 · 2026-08-16 · Propuesto |

Estructura de los glosarios de unidad: todos abren con §0 cómo leer · §1 alcance por proyecto de código · §2 términos que la categoría acuña · §3 términos con más de un referente. Después difieren: los dos de `GeometriaFactory-Api` siguen con §4 términos referenciados y no redefinidos y el control de cambios; `GeometriaFactory-Web/02-.../Glosario-Funcional.md` agrega §5 tabla de términos que acuña (Visor) y §6 control de cambios; `GeometriaFactory-Web/03-.../Glosario-UX.md` pone en §4 las palabras de superficie que no usa, §5 los referenciados y §6 el control de cambios. Cada proyecto de código lleva su propio bloque dentro del archivo de su unidad.

---

## 2. La norma en una tabla

Fuente: `SDD/Docs/Producto/Norma-De-Nomenclatura.md` §1, §3, §4.

| Zona | Regla | Sección |
| --- | --- | --- |
| Zona 1 · identificadores de código | **Inglés**, siempre. Lo que lee un compilador o intérprete | §3 |
| Zona 2 · texto | **Castellano** rioplatense neutro técnico, con tildes y eñes. Lo que lee una persona | §4 |
| Frontera | Identificador que **también es dato** (se persiste, viaja o lo invoca otro extremo): decidido por el PO el 2026-08-12 (`F-01..F-03`) | §5 |
| Dato del alumno | Las claves y valores del JSON de la Actividad 1 **no se tocan** (no son identificadores del producto) | §5.4 |

Regla de una línea (§4): *si lo lee una persona, castellano; si lo lee una herramienta, inglés.*

### 2.1 Forma de los identificadores (§3)

| Qué | Forma | Ejemplo de la norma |
| --- | --- | --- |
| Espacios de nombres | `PascalCase`, segmentos con `.` | `GeometriaFactory.Domain.Entities` |
| Clases, `record`, `struct` | `PascalCase` | `Account`, `Work` |
| Interfaces | `PascalCase` con prefijo `I` | `IWorkRepository` |
| Enumeraciones y miembros | `PascalCase` | `AccountStatus.Enabled` |
| Propiedades y métodos públicos | `PascalCase` | `PasswordHash` |
| Parámetros y locales | `camelCase` | `accountId` |
| Campos privados | `_camelCase` | `_clock` |
| TypeScript | `camelCase`; `PascalCase` para clases | `loadPieces` |
| Archivo de código | Igual al tipo | `Account.cs` |

Reglas de forma: (1) la raíz `GeometriaFactory` no cambia; (2) el proyecto ya es la capa — nada de `GeometriaFactory.Domain.Domain`; (3) un solo nivel de subsegmento, y el espacio de nombres coincide con la carpeta.

### 2.2 Zona de texto (§4)

| Qué | Idioma / forma |
| --- | --- |
| Documentación `SDD/` | Castellano (invariante `D1` de las auditorías) |
| Nombres de archivo de documentación | Castellano ASCII `Título-Con-Guiones` (sin tildes en el nombre) |
| Comentarios de código | Castellano (producto didáctico para Programación 2) |
| Mensajes al usuario, rótulos, etiquetas | Castellano con tildes; el catálogo de condiciones **no transporta texto**: lo compone quien expone |
| Commits y registros técnicos | Castellano |
| Identificadores documentales (`CU-`, `RN-`, `BT-`, `ADR-`) | Se mantienen (no los lee un compilador) → detalle en `17` |

### 2.3 Cinco formas de un identificador escrito en un documento (§4.1)

| Forma | ¿Se renombra? |
| --- | --- |
| Cita textual (entre `«»`) | Nunca |
| Reporte de fuente ajena | Sólo si la fuente se renombra, en el mismo tramo |
| Registro histórico (control de cambios, hallazgo) | Nunca |
| Otro concepto con el mismo nombre (homónimo) | Nunca |
| Uso propio | Sí |

---

## 3. Las tres decisiones de frontera (§5)

Fuente: `SDD/Docs/Producto/Norma-De-Nomenclatura.md` §5.1–§5.3. El razonamiento de cada ADR que las aplica vive en `15`.

| Frontera | Decisión del PO (2026-08-12) | ¿Cambia contrato? | Correspondencia |
| --- | --- | --- | --- |
| `F-01` Fachada del visor | `F-01a`: las seis funciones van a inglés | No (nunca estuvieron fijadas) | §6.6 |
| `F-02` Conjuntos cerrados | `F-02a`: identificador en inglés, **etiqueta en castellano**, traducción en un solo lugar (`GeometriaFactory.Web.Services`) | Sí en lo persistido, con costo cero entonces (no había base poblada) | §6.7 |
| `F-03` Códigos de condición y de contrato | Los 101 a inglés (80 internos + 21 `CONTRATO_*`); **se elimina el prefijo `CONTRATO_`**; forma `SCREAMING_SNAKE_CASE` sin artículos ni prefijo de proyecto | **Sí, declarado como cambio de contrato** | §6.8 |

Alternativas descartadas registradas: `F-01b`, `F-02b`, `F-02c`, `F-03b`, `F-03c` (§5).

---

## 4. Glosario de correspondencia (§6)

**Regla del glosario (§6.1):** si un concepto no está en la tabla, **no se traduce por criterio propio: se agrega primero**. Corolarios: (1) un concepto, un nombre; (2) un nombre, un concepto (`Pendiente` → `Pending` / `Submitted`); (3) códigos conservan forma y cambian de idioma, sin `CONTRATO_`; (4) agregar una fila es un acto declarado en el control de cambios. Cada fila: castellano · inglés · clase · dónde está declarado. **La tabla es la fuente única**: ningún otro documento la redeclara.

### 4.1 Mapa de secciones

| Sección | Contenido | Origen |
| --- | --- | --- |
| §6.3 | Clase 1 · interfaces y puertos (5) | Base de 155 |
| §6.4 | Clase 2 · entidades, tablas, tipos de figura, tipos y adaptadores (31) | Base de 155 |
| §6.5 | Clase 3 · miembros y propiedades (2) | Base de 155 |
| §6.6 | Clase 4 · seis funciones de la fachada (6) | Base de 155 |
| §6.7 | Clase 5 · valores de conjuntos cerrados (10) | Base de 155 |
| §6.8.1–6.8.7 | Clase 6 · códigos de condición y de contrato (101): Domain 42, Application 12, Infrastructure 15, Visor 7, 4 internos retirados, 22 de Contracts (título de §6.8.6 tras la 1.30), 2 huérfanos sin traducir; la suma de los cinco grupos da 102 y la norma no actualizó el total 101 ni la fila «21» de §6.2 (ver `19` N-8) | Base de 155 |
| §6.9 | Dos unificaciones y cuatro coincidencias de nombre | — |
| §6.10 | 18 espacios de nombres (16 subsegmentos) | `Plan-Etapa-A.md` §1.3 |
| §6.11 | Superficies derivadas: carpetas y nombres de archivo | 1.2 |
| §6.12 | Etapa `b` de Web: tipos de componente, miembros, iconos, clases CSS/animación | 1.6 |
| §6.13 | Etapa `c`: tipos, miembros, subsegmento | 1.7 |
| §6.14 | Sesión por marca de navegador | 1.8 |
| §6.15 / §6.16 | Etapa `d` (servicio) / interfaz de la etapa `d` | 1.12 / 1.13 |
| §6.17 | Interacción de superficie autorizada (funciones del guion, atributos de marcado) | 1.14 |
| §6.18 | Guardián de aprovisionamiento | 1.15 |
| §6.19 / §6.20 | Etapa `e` (servicio) / interfaz de la etapa `e` | 1.16 / 1.17 |
| §6.21 | Validador de figuras, etapa `f` (incluye valores de `FigureType` y `ComponentRole`) | 1.18 |
| §6.22 | Agregados por `ADR-08006` (el visor recibe piezas reconstruidas) | 1.19 |
| §6.23 | Capa 3 del visor y su anfitrión, etapa `g` | 1.21 |
| §6.24 | Documentación de la superficie HTTP, etapa `g` (`ADR-08008`) | 1.22 |
| §6.25 | Árbol del texto, etapa `g` | 1.23 |
| §6.26 | Trece atributos `data-gf-*` autorizados por la mesa del 2026-09-14 (lista cerrada que lee `scripts/verify-stage-c.sh`). **Deuda declarada:** cuatro familias quedan en castellano (`escena-*`, `preparando`, `servicio`, `fecha-no-representable`) contra la regla de identificadores en inglés; `E-6` manda autorizarlas tal como están, sin renombrar | 1.31 |

### 4.2 Correspondencias núcleo (verificadas contra el código)

| Castellano | Identificador | Clase | Fuente norma | Verificado en |
| --- | --- | --- | --- | --- |
| `IRepositorioTrabajos` | `IWorkRepository` | Puerto | §6.3 | `src/GeometriaFactory.Application/Ports/IWorkRepository.cs` |
| `IRepositorioCuentas` | `IAccountRepository` | Puerto | §6.3 | `src/GeometriaFactory.Application/Ports/` |
| `IValidadorFiguras` | `IFigureValidator` | Puerto | §6.3 | idem |
| `IRelojDelSistema` | `ISystemClock` | Puerto | §6.3 | `src/GeometriaFactory.Api/Composition/CompositionRoot.cs` |
| `Cuenta` / `Trabajo` / `Pieza` / `Componente` / `Observacion` | `Account` / `Work` / `Piece` / `Component` / `Observation` | Entidad (unificada con tablas `ALUMNO`…`OBSERVACION` de RT §7.1) | §6.4, §6.9 | `src/GeometriaFactory.Domain/Entities/` |
| `Papel` / `EstadoDeCuenta` / `EstadoDeTrabajo` / `EspecieDeObservacion` | `Role` / `AccountStatus` / `WorkStatus` / `ObservationKind` | Conjunto cerrado | §6.4 | `src/GeometriaFactory.Domain/Values/` |
| `ValidadorFigurasLocal` | `LocalFigureValidator` | Adaptador | §6.4 | `src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` |
| `ComposicionDeRaiz` / `ArranqueEnDosFases` | `CompositionRoot` / `TwoPhaseStartup` | Composición / arranque | §6.4 | `src/GeometriaFactory.Api/Composition/` |
| `ClienteDelServicioDeDatos` | `DataServiceClient` | Cliente del front | §6.4 | → `09` |
| `VisorDeGeometriaFactory` | `GeometriaFactoryViewer` | Biblioteca expuesta en `window` | §6.4 | `visor/verification/lifecycle.mjs` |

**Fachada del visor (§6.6):** `inicializar`→`initialize`, `cargarPiezas`→`loadPieces` (antes `cargarJson`, renombrada 2026-08-16 por `ADR-08006`), `seleccionarPieza`→`selectPiece`, `redimensionar`→`resize`, `destruir`→`destroy`, `establecerMovimiento`→`setMotion` (presente en `visor/src/main.ts`). Detalle → `10`.

**Valores de conjuntos cerrados (§6.7), identificador · etiqueta:**

| Conjunto | Valores |
| --- | --- |
| `Role` | `Student` «Alumno» · `Administrator` «Administrador» |
| `AccountStatus` | `Pending` «Pendiente» · `Enabled` «Habilitado» · `Blocked` «Bloqueado» |
| `WorkStatus` | `Draft` «Borrador» · `Submitted` «Pendiente» · `Approved` «Finalizado» · `Rejected` «Rechazado» |
| `ObservationKind` | `Warning` «Advertencia» · `ValidationError` «Error de validación» |

`Pendiente` ocupa dos filas: **`Pending` (cuenta) y `Submitted` (trabajo) son deliberadamente distintos** (§6.7; corolario 2 de §6.1).

**`FigureType` y `ComponentRole` (§6.21.2, vigente en código):** `Cilindro`→`Cylinder`, `Cubo`→`Cube`, `Ortoedro`→`Orthohedron`, `Rectangulo`→`Rectangle`, `Cuadrado`→`Square`, `Circulo`→`Circle`, `RectanguloDesarrollado`→`DevelopedRectangle` (sólo como `Lado` del cilindro); `Tapa`→`Cap`, `Cara`→`Face`, `Base`/`Lateral` homónimos, `Lado`→`Side`. Código: `src/GeometriaFactory.Domain/Values/FigureType.cs`, `ComponentRole.cs`. El literal castellano del JSON **no se renombra** (§5.4). Divergencia con §6.4 → `19` N-10.

**Unificaciones y homónimos (§6.9):** `CUENTA_DE_ADMINISTRADOR_NO_ADMITE_BAJA` + `OPERACION_NO_APLICABLE_A_LA_CUENTA_DE_ADMINISTRADOR` → `OPERATION_NOT_APPLICABLE_TO_ADMINISTRATOR_ACCOUNT` (`src/GeometriaFactory.Domain/Values/ConditionCode.cs`). Cuatro nombres compartidos contrato/interno sin colisión (el tipo los separa): `REQUIRED_FIELD_MISSING`, `EMAIL_ALREADY_REGISTERED`, `ADMINISTRATOR_ALREADY_CONFIGURED`, `WORK_NOT_FOUND`. La prueba de inspección compara contra **su** catálogo, no contra nombres (control `V-5`).

**Espacios de nombres (§6.10):** `Domain.{Entities,Values,Guards}`, `Contracts.{Accounts,Works,Service}`, `Application.{Ports,Accounts,Works}`, `Infrastructure.{Persistence,Security,Validation,Time}` (según la norma), `Api.{Endpoints,Composition}`, `Web.{Components,Services,Integration}`. En el código el adaptador de figuras vive en `GeometriaFactory.Infrastructure.Figures` (`src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs`), sin fila en la norma, y `Contracts.Errors` existe (`src/GeometriaFactory.Contracts/Errors/`), agregado por §6.13 (1.7) y no listado en §6.10: ver `19` N-7. Nota: en prosa se dice «punto de acceso», no «endpoint», aunque el espacio sea `Api.Endpoints`.

Último agregado a la clase 6: `CONTRATO_DOMINIO_DE_CORREO_NO_ADMITIDO` → `EMAIL_DOMAIN_NOT_ADMITTED` (1.30, `Api ADR-00012`; presente en `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs`). Catálogos completos de códigos → `05` (internos) y `06` (`ErrorCode`).

---

## 5. Verificación y renombre (§7, §8)

| Control | Qué verifica |
| --- | --- |
| `V-1` | Todo identificador declarado resuelve contra una fila del glosario |
| `V-2` | Ningún identificador nuevo en castellano |
| `V-3` | Todo valor de conjunto cerrado tiene identificador **y** etiqueta castellana |
| `V-4` | Cuadre del renombre contra una lista previa de lo que **no** se renombra |
| `V-5` | Catálogo contra tipo, no contra nombre (homónimos de §6.9) |
| `V-6` | Carpetas y archivos bajo `src/`, `tests/`, `visor/` en inglés |
| `V-7` | Argumentos a favor del nombre anterior se conservan marcados como superados |

Plan de renombre (§8): tramos `R-1`, `R-1b`, `R-2`…; los restantes se **suspendieron** por decisión del PO el 2026-08-13 (1.5); la tabla §8.1 asigna `R-2b` a la clase 2 (entidades y tablas), `R-3` a la clase 4 (fachada, `F-01`), `R-4` a la clase 5 (`F-02`) y `R-5` a la clase 6 (los 101 códigos, `F-03`). El recuadro de la reactivación del 2026-08-29 llama en cambio «`R-3`» a los códigos de condición (`F-03`), lo reactiva y lo cierra (`R-3a`..`R-3e`), y declara que `R-2b`, `R-4` y `R-5` siguen suspendidos. Contradicción interna de la norma → `19` N-6. El «tramo `R-4`» del 2026-08-29 es otra cosa: renumerado de `QG`/`CV` → `17`.

---

## 6. Glosario rápido del corpus (`SDD/Docs/README.md` §9)

21 términos; no reemplaza a los glosarios de categoría. Remite al glosario raíz `SDD/Docs/00-Contexto/Vision-Producto.md` §9.

| Término | En una línea |
| --- | --- |
| Trabajo | Unidad que carga el alumno: nombre, fecha, descripción y texto con piezas; identificador y estado propios |
| Estado del trabajo | `Borrador`, `Pendiente`, `Finalizado`, `Rechazado` |
| Enviar | Única acción de guardado del alumno; interpreta y decide el estado |
| Pieza | Figura del conjunto raíz; identidad = posición |
| Componente | Figura plana de una pieza: tapa, cara, base, lateral o lado |
| Observación | Advertencia o error de validación |
| Advertencia | Declarado ≠ derivado; no impide `Pendiente` |
| Error de validación | Impide interpretar; deja `Borrador` con errores localizados |
| Valor declarado / derivado | El del texto vs. el recalculado; hace visible el error de fórmula |
| Aprobar y rechazar | Decisiones exclusivas del administrador sobre un trabajo `Pendiente` |
| Comentario | Texto opcional del administrador; no es calificación ni observación |
| Actividad 1 | TP de la cátedra que emite el dato; fuera del producto |
| Laboratorio | Nombre corriente del producto en la cátedra |
| Etapa / Punto de control | Tramo de construcción / detención a la espera del OK del PO |
| Puerta técnica | Verificación de viabilidad que condiciona la planificación |
| Proyecto de código | Unidad de compilación declarada en el manifiesto |
| Unidad desplegable | Proceso desplegado aparte: front y servicio de datos |
| Puerto | Contrato de casos de uso que implementan los adaptadores |
| Fachada del visor | Las seis funciones del bundle; único punto de extensión declarado |
| Escenario | `E-1`..`E-8`, datos del intake; no se inventan datos de prueba |

### 6.1 Glosario raíz (`SDD/Docs/00-Contexto/Vision-Producto.md` §9)

Términos raíz que no están en el glosario rápido (§9.1/§9.2):

| Término | En una línea |
| --- | --- |
| `Describir()` | Método de cada figura de la Actividad 1 que devuelve su texto; no cumple estrictamente JSON; vocabulario de la cátedra |
| Tapa | Círculos que cierran un cilindro; en el ortoedro se usa erróneamente para las bases, y eso impide hoy dibujarlos |
| Rectángulo desarrollado | Superficie lateral del cilindro desenrollada |
| Coma final | Coma antes del cierre de un conjunto; el formato estricto la rechaza; se tolera por diseño |
| Fallo silencioso | Error sin mensaje (la figura no aparece); lo que el producto viene a eliminar |
| Hito interno / demostrable | Etapa validada por el equipo sin mostrar / recorrida delante del cliente |
| Fase del roadmap | Lleva la letra de su etapa; desde la 1.11 del roadmap hay fases (`k`) sin etapa homónima en el intake |
| Capacidad | Ítem `F-XX` del alcance con prioridad; no es sinónimo de caso de uso |

**Resolución del choque de vocabulario (§9.3, vinculante por el intake §12.1):** «proyecto de código» designa sólo una unidad de compilación; **«proyecto» a secas no se usa**; las unidades emisoras de la Actividad 1 se nombran `Ejemplo1` y `Ejemplo2`, nunca con el término normativo. «Unidad de entrega» no choca: son las dos piezas desplegables (§9.2), y el Trabajo del alumno no es unidad de entrega.

---

## 7. Vocabulario por unidad (términos que cada categoría acuña)

Sólo el término; la definición operativa está en la fuente (§2 de cada glosario).

### 7.1 `GeometriaFactory-Api` · funcional (`.../GeometriaFactory-Api/02-Especificacion-Funcional/Glosario-Funcional.md`)

| Proyecto | Términos acuñados (§2.x) |
| --- | --- |
| Api (§2.1) | Punto de acceso (15, `A-XX`) · Superficie HTTP · Código de respuesta (10) · Código del contrato (17 en la 2.0) · Las dos traducciones (motivo→código→HTTP) · Guardia de admisión · Papel exigido · Composición de raíz · Arranque detenido · Ruta propuesta · Colección de peticiones · Señal que no es un fallo · Hueco del conjunto cerrado |
| Domain (§2.2) | Alumno · Papel · Estado de cuenta · Credencial derivada · Admisibilidad de la cuenta · Camino de alta · Baja de la cuenta · Contraseña provisoria · Marca de cambio de contraseña pendiente · Reseteo de contraseña · Texto original · Posición de pieza · Familia plana o volumétrica · Especie de observación · Desenlace · Alcance del administrador · Consumidor de la biblioteca · Sujeto de la regla |
| Application (§2.3) | Puerto (de repositorio de trabajos, de cuentas, de validación de figuras, de reloj) · Consumidor de los casos de uso · Verificación de pertenencia · Verificación de facultad · Cambio forzado · Alcance de consulta · Unidad de trabajo · Motivo · Doble · Metadato de orquestación |
| Infrastructure (§2.4) | Adaptador · Almacén · Trampa del formato · Lectura tolerante · Existencia contra veracidad · Operador estricto · Posición reservada · Cantidad de figuras del conjunto raíz · Valor derivado… |

Polisemias declaradas (§3): Acceso, Código, Punto (Api); Trabajo, Pieza, `Pendiente`, Rol (Domain/Application); Repositorio, Validador, Derivado (Infrastructure).

### 7.2 `GeometriaFactory-Api` · experiencia (`.../GeometriaFactory-Api/03-UX-UI-DX/Glosario-UX.md`)

Vocabulario de **experiencia del desarrollador**: superficie pública de cada capa, consumidor/implementador/mantenedor/operador, rol de intervención, entrada del catálogo, familia empobrecida, diagnóstico accionable, categoría de error, negativa por pertenencia/facultad/alcance, traducción prohibida, frontera de autorización, forma de terminación, terminación degradada, rechazo inalcanzable por construcción, tramo de onboarding, quick-start, primer resultado exitoso, TTFS, TTFV, modo de documentación. Polisemias (§3): Error, Consumidor, Mensaje, Negativa, Atajo.

### 7.3 `GeometriaFactory-Web` · funcional (`.../GeometriaFactory-Web/02-Especificacion-Funcional/Glosario-Funcional.md`)

| Proyecto | Términos acuñados |
| --- | --- |
| Web (§2.1) | Pieza pública · Pieza de datos · Circuito · Estado del circuito · Marca de sesión · Estado degradado · Cartel de reconexión · Panel · Ruta protegida · Vista de trabajo · Árbol de la estructura · Componente anfitrión del visualizador · Previsualización · Contraseña provisoria · Cambio de contraseña pendiente · Cambio forzado · Reseteo de contraseña · Confirmación escrita · Acción única de guardado · Retiro de un trabajo · Papel · Situación de cuenta · Desenlace · Elemento de dibujo |
| Visor (§5.1) | Tabla propia de términos acuñados del visor |

Polisemias (§3): Vista, Pieza, `Pendiente` (Web); «Pieza» (Visor). «Resultado de la interpretación» y «Órbita» son precisiones que la fuente declara expresamente **no** polisemia (bloque del Visor de §3, apartados titulados «precisión que no es polisemia declarada»).

### 7.4 `GeometriaFactory-Web` · experiencia (`.../GeometriaFactory-Web/03-UX-UI-DX/Glosario-UX.md`)

| Proyecto | Términos acuñados |
| --- | --- |
| Web (§2.1) | Superficie · Nombre canónico de superficie · Superficie alojada · Movimiento automático de la escena · Shell (acceso / trabajo) · Bloque · Insignia de estado · Fila de trabajo · Banda de resultado · Aviso de indisponibilidad · Estado vacío explicado · Estado de superficie · Requisito declarado · Confirmación escrita · Sello de versión · Detalle de diagnóstico · Orientación posterior · Punto de quiebre angosto (768 px, marcado `[ASUNCIÓN]` en la fuente) · Versión angosta |
| Visor (§2.2) | Rol de intervención · Developer integrador / mantenedor del bundle · Superficie pública · Recorrido de integración · Tramo de onboarding · Objetivo verificable · Quick-start · Ciclo corto de construcción · Modo de documentación · Lectura por sección · Entrada de catálogo · Diagnóstico accionable · Acción del lado del anfitrión · Alcance de la condición · Gate de cero red · Fuga de la fachada · TTFS · TTFV |

**Palabras que la superficie no usa (§4.1):**

| No se escribe | Se escribe |
| --- | --- |
| Pantalla | superficie |
| Vista, sin calificar | vista de trabajo / superficie / ruta / componente |
| Rol | papel |
| Estado, para una cuenta | situación de cuenta |
| Modal, toast, tooltip, wizard, breakpoint, layout | equivalente castellano del catálogo |
| `Pendiente` sin calificar | cuenta `Pendiente` / trabajo en estado `Pendiente` |
| Pieza, para un servicio | pieza pública / pieza de datos |
| Proyecto, a secas | proyecto de código |
| Calificación, nota, puntaje | comentario; desenlace |
| Error, para una advertencia | advertencia / observación |

---

## 8. Observaciones del indexado

Las divergencias entre fuentes de este dominio viven en `19_Observaciones-Del-Indexado.md` §3, entradas N-6 a N-12 (renombre `R-n` de §8, espacios de nombres §6.10 contra el código, total de códigos 101/102, cabecera de la norma, `Box`/`Orthohedron` en §6.4 contra §6.21.2, rango de §6.1, literales `CONTRATO_*` en comentarios y vigencia de los glosarios de unidad en estado Propuesto).
