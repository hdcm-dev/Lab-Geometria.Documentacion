# 10 · Glosario y nomenclatura — cómo se nombra algo antes de escribirlo

> **Propósito.** La regla de nombres del producto y el vocabulario del dominio, para escribir un
> identificador, un texto de pantalla o una cita del corpus sin inventar.
> **Fuente primaria.** `SDD/Docs/Producto/Norma-De-Nomenclatura.md` (2.391 líneas; última fila de
> control de cambios: **1.31 del 2026-09-14**), `AGENTS.md` líneas 36–37, `SDD/Docs/README.md` §9,
> `SDD/Docs/00-Contexto/Vision-Producto.md` §9 y los glosarios de cada unidad de entrega.
> **Vigencia.** Verificado el 2026-10-26 sobre la revisión `4b114d7`.

---

## 1. La regla, en una línea

> **Identificadores de código en inglés; texto para personas en castellano.**
> (`AGENTS.md`:36 · norma §3 y §4)

Y su corolario operativo, que es el que se rompe:

> **Si un concepto no está en el glosario de §6, no se traduce por criterio propio: se agrega
> primero.** (norma §6.1)

| Corolario de §6.1 | Qué exige |
| --- | --- |
| 1 · Un concepto, un nombre | Dos identificadores castellanos del mismo concepto se **unifican** en un nombre inglés (§6.9) |
| 2 · Un nombre, un concepto | `Pendiente` son dos conceptos → `Pending` (cuenta) y `Submitted` (trabajo) |
| 3 · Los códigos conservan su forma | `SCREAMING_SNAKE_CASE`, palabras inglesas con `_`, sin artículos ni preposiciones sueltas, **sin prefijo de proyecto y sin `CONTRATO_`** |
| 4 · Agregar una fila es un acto declarado | Con entrada en el control de cambios (§9 de la norma) |

**La frontera, dicha por la norma §4**: «si lo lee una persona, castellano; si lo lee una
herramienta, inglés». Los identificadores documentales (`CU-XX`, `RN-XX`, `BT-XX`, `ADR-XX`) se
mantienen como están: no los lee ningún compilador.

## 2. Las formas del código (norma §3)

| Qué | Forma | Ejemplo de la norma |
| --- | --- | --- |
| Espacios de nombres | `PascalCase`, segmentos con `.` | `GeometriaFactory.Domain.Entities` |
| Clases, `record`, `struct`, enumeraciones y sus miembros | `PascalCase` | `AccountStatus.Enabled` |
| Interfaces | `PascalCase` con prefijo `I` | `IWorkRepository` |
| Propiedades y métodos públicos | `PascalCase` | `PasswordHash`, `OriginalJson` |
| Parámetros y variables locales · campos privados | `camelCase` · `_camelCase` | `accountId` · `_clock` |
| TypeScript | `camelCase`; `PascalCase` para clases | `loadPieces` |
| Archivo de código | Igual al tipo que contiene | `Account.cs` |

**Tres reglas de forma** (norma §3): la raíz es `GeometriaFactory` y no cambia; el proyecto ya es
la capa (nada de `GeometriaFactory.Domain.Domain`); **un solo nivel de subsegmento, y el espacio
de nombres coincide con la carpeta**. **Y la de superficies derivadas** (§6.11): toda carpeta y
todo archivo bajo `src/`, `tests/` o `visor/` va en inglés; la regla castellana `Título-Con-Guiones`
rige **sólo** los archivos de `SDD/`. La raíz `visor/` del proyecto de código **no** se renombra;
la carpeta de la capa 3 sí (`visor/src/viewer/`).

**Texto en castellano** (norma §4): documentación, comentarios de código —el lector es un alumno de
Programación 2—, mensajes y rótulos con tildes, commits. El catálogo de condiciones **no transporta
texto de presentación**: lo compone quien expone.

## 3. La zona de frontera: las tres decisiones tomadas

Tomadas por el Product Owner el **2026-08-12** (norma §5; registradas también en el intake §23,
que «las registra, no las redeclara»). Las tres son **un identificador que también es dato**.

| Id | Qué decide | ¿Cambia un contrato? |
| --- | --- | --- |
| `F-01` | **Las seis funciones de la fachada del visor** van en inglés | No: nunca estuvieron fijadas |
| `F-02` | **Valores de conjuntos cerrados**: identificador en inglés, **etiqueta en castellano** | Sí en la forma persistida, con costo cero cuando se decidió |
| `F-03` | **Códigos de condición y de contrato** en inglés y **sin `CONTRATO_`** | **Sí, y así se declara** |

**Lo que no es frontera: el dato del alumno** (norma §5.4). Las claves `Tipo`, `Tapas`, `Bases`,
`Radio`, `Largo`, `Ancho`, `Area`, `Volumen` y los valores `Cilindro`, `Cubo`, `Ortoedro`,
`Rectangulo`, `Cuadrado`, `Circulo`, `RectanguloDesarrollado` los emite el programa de la
Actividad 1 y **no se tocan**. El tipo de C# que los lee se llama en inglés y **mapea explícitamente**
al literal castellano: en el árbol, ese mapeo vive en
`src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs` (p. ej. línea 490,
`("Tapas", ComponentRole.Cap)`).

## 4. El glosario de correspondencia: dónde buscar

`Norma-De-Nomenclatura.md` §6 **es la fuente única de la correspondencia**: ningún otro documento
la redeclara. Cada fila lleva cuatro columnas —castellano, inglés, clase y **dónde está declarado
el concepto**—; la cuarta es la que permite verificar la fila (`V-1` de §7) en lugar de creerle.

| Sección | Contenido |
| --- | --- |
| §6.1 – §6.2 | La regla y su cobertura, contada |
| §6.3 | Clase 1 · Interfaces y puertos (5) |
| §6.4 | Clase 2 · Entidades y tipos (31), con los siete tipos de figura marcados `no se renombra` |
| §6.5 | Clase 3 · Miembros y propiedades (2) |
| §6.6 | Clase 4 · Las seis funciones de la fachada (6) |
| §6.7 | Clase 5 · Valores de conjuntos cerrados (10 identificadores en 11 filas) |
| §6.8 | Clase 6 · Códigos: 42 de `Domain`, 12 propios de `Application`, 15 propios de `Infrastructure`, 7 de `Visor`, 4 retirados, **22** `CONTRATO_*` (§6.8.6) y 2 huérfanos sin traducir (§6.8.7) |
| §6.9 | Las dos unificaciones y los cuatro pares homónimos contrato/interno |
| §6.10 | Los 18 espacios de nombres (16 subsegmentos distintos) |
| §6.11 | Las cinco superficies derivadas (carpetas y archivos) |
| §6.12 – §6.25 | Agregados por etapa, **fuera de los 155**: `b`, `c`, marca de sesión, `d` (servicio e interfaz), interacción de superficie, guardián de aprovisionamiento, `e` (servicio e interfaz), validador de `f`, `ADR-08006`, capa 3 del visor, superficie HTTP documentada, árbol del texto |
| **§6.26** | **Nueva desde la 3.0**: los trece atributos `data-gf-*` autorizados por la mesa del 2026-09-14 (`R-11`, escalada `E-6`) |

**Cobertura, por la tabla de §6.2**: 155 en las seis clases, y por fuera de ellos 5 superficies
derivadas más 675 agregados por etapa (5 + 214 + 109 + 39 + 36 + 41 + 19 + 8 + 47 + 27 + 44 + 5 +
44 + 10 + 14 + 13). La suma la hace este índice; la norma da cada fila por separado.

**Tres cifras de la norma que quedaron una atrás de su propia tabla** (detalle en el índice 12):
§6.8.6 tiene **22** filas `CONTRATO_*`, pero §5 (tabla y §5.3), §6.2 y el título de §6.8 siguen
diciendo 21 de contrato, 101 en la clase 6 y 155 en total —la 1.30 lo admite para el intake y no
lo corrige en el resto—; la regla de §6.1 y el control `V-1` cuentan «diecisiete tablas» hasta
§6.20 y no nombran §6.21–§6.26; y la cabecera dice `Fecha: 2026-08-31` con la 1.31 del 2026-09-14
en el control de cambios.

### 4.1 Las correspondencias que más se usan, contra el código

| Concepto | En el corpus (castellano) | En el código | Dónde está en el árbol |
| --- | --- | --- | --- |
| Papel | `Alumno`, `Administrador` | `Role.Student`, `Role.Administrator` | `src/GeometriaFactory.Domain/Values/Role.cs` |
| Situación de cuenta | `Pendiente`, `Habilitado`, `Bloqueado` | `AccountStatus.Pending`, `Enabled`, `Blocked` | `…/Domain/Values/AccountStatus.cs` |
| Estado del trabajo | `Borrador`, `Pendiente`, `Finalizado`, `Rechazado` | `WorkStatus.Draft`, **`Submitted`**, **`Approved`**, `Rejected` | `…/Domain/Values/WorkStatus.cs` |
| Especie de observación | `Advertencia`, `Error de validación` | `ObservationKind.Warning`, `ValidationError` | `…/Domain/Values/ObservationKind.cs` |
| Tipo de figura (§6.21.2) | `Cilindro` … `RectanguloDesarrollado` | `FigureType.Cylinder`, `Cube`, `Orthohedron`, `Rectangle`, `Square`, `Circle`, `DevelopedRectangle` | `…/Domain/Values/FigureType.cs` |
| Papel del componente (§6.21.2) | `Tapa`, `Cara`, `Base`, `Lateral`, `Lado` | `ComponentRole.Cap`, `Face`, `Base`, `Lateral`, `Side` | `…/Domain/Values/ComponentRole.cs` |
| Puertos (§6.3) | `IRepositorioTrabajos`, `IValidadorFiguras`, `IRelojDelSistema`, `IRepositorioCuentas` | `IWorkRepository`, `IFigureValidator`, `ISystemClock`, `IAccountRepository` | `src/GeometriaFactory.Application/Ports/` |
| Fachada del visor (§6.6) | `inicializar`, `cargarPiezas`, `seleccionarPieza`, `redimensionar`, `destruir`, `establecerMovimiento` | `initialize`, `loadPieces`, `selectPiece`, `resize`, `destroy`, `setMotion` | `visor/src/main.ts`:45–120 |
| Biblioteca en `window` (§6.4) | `VisorDeGeometriaFactory` | `GeometriaFactoryViewer` | `visor/webpack.config.js`:14 |

**Tres trampas de la tabla.** «Finalizado» es `Approved`, no `Finished`: es el desenlace de
aprobación (§6.7). `Base` y `Lateral` son **homónimos declarados** castellano/inglés (§6.21.2).
`Lado` (`Side`) **no es** `Lateral`: es el papel del `RectanguloDesarrollado` del cilindro.

### 4.2 Los códigos del contrato

Los 16 valores de `src/GeometriaFactory.Contracts/Errors/ErrorCode.cs` son constantes `string` en
inglés sin prefijo (`REQUIRED_FIELD_MISSING`, `INVALID_CREDENTIALS`, …, `UNCLASSIFIED_ERROR`).
**Lo nuevo desde la 3.0**: `EMAIL_DOMAIN_NOT_ADMITTED` (norma 1.30, §6.8.6; `Api ADR-00012`, el
autorregistro admite sólo los dominios que el despliegue declara). Los cuatro pares que quedan con
el mismo nombre en el contrato y en un catálogo interno —`REQUIRED_FIELD_MISSING`,
`EMAIL_ALREADY_REGISTERED`, `ADMINISTRATOR_ALREADY_CONFIGURED`, `WORK_NOT_FOUND`— **no son
colisión**: los separa el tipo que los contiene (§6.9), y por eso `V-5` compara **contra el
catálogo**, no contra el conjunto de nombres. El detalle de cada código y su traducción a respuesta
HTTP está en [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md).

### 4.3 Los prefijos del front

| Prefijo | Qué nombra | Contado en el árbol |
| --- | --- | --- |
| `gf-` | Clases CSS y de animación (§6.12.4 y agregados posteriores) | **174** clases `.gf-*` distintas, todas en `wwwroot/css/app.css` (dos son elementos BEM `__`: `gf-scene-motion__note`, `gf-scene-motion__option`); `scaffold.css` no declara ninguna |
| `data-gf-*` | Atributos de marcado: los que el guion lee y las marcas de estado | **30** en la lista cerrada `AUTORIZADOS` de `scripts/verify-stage-c.sh`:272–279; **27** aparecen literales en `.razor` y `.js` de `src/GeometriaFactory.Web` |

**La deuda declarada de §6.26**: seis de los trece atributos nuevos están en castellano, en cuatro
familias —`escena-*` (acuse, dibujada, sin-dibujar), `preparando`, `servicio`,
`fecha-no-representable`—. La norma **no los renombra**: `E-6` mandó autorizarlos tal como están, y
queda como deuda con evento («la próxima unidad que toque esos componentes»).

## 5. Contraste de la norma con el árbol

Medido sobre `git ls-files` en `4b114d7`. Lo que no cuadra va también al
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md).

| Lo que la norma declara | Lo que hay | Cuadra |
| --- | --- | --- |
| §6.10: 18 espacios de nombres, un solo nivel de subsegmento | 21 espacios de nombres distintos en los 139 `.cs` de `src/`; dos con **dos niveles**: `Infrastructure.Persistence.Migrations` (11 archivos) e `Infrastructure.Persistence.Configurations` (5) | No |
| §6.10: `GeometriaFactory.Infrastructure.Validation` | No existe; el validador vive en `GeometriaFactory.Infrastructure.Figures` (`LocalFigureValidator.cs`), sin fila en la norma | No |
| §6.11: componente `FigureViewer` / `FigureViewer.razor` (capa 1 del visor) | Ningún tipo ni archivo `FigureViewer` en `src/` ni `tests/`; el único uso de `GeometriaFactoryViewer` en `src/` está en `wwwroot/interaction/surface-interaction.js` | No |
| §6.11: todo archivo bajo `tests/` en inglés | `tests/GeometriaFactory.E2ETests/`: sus **13** `.cs` tienen nombre castellano (`IngresoTests.cs`, `BancoLocal.cs`, `ResolucionDelTrabajoTests.cs`…) y carpeta `Infraestructura/`; la norma no menciona la batería E2E | No |
| §6.11: `Configurations/`, `Pages/`, `viewer/` | Existen: `Persistence/Configurations/`, `Components/Pages/`, `visor/src/viewer/` | Sí |
| §6.7 y §6.21: valores de conjuntos cerrados | Los seis enums de `Domain/Values/` que nombra la norma (de los ocho de esa carpeta; `WorkOperation` y `WorkOutcome` no van en §6.7 ni §6.21, sino en §6.19.1–§6.19.2, y no se contrastaron acá) coinciden fila por fila (§4.1) | Sí |
| §6.6: las seis funciones | `visor/src/main.ts` exporta las seis con esos nombres | Sí |

**Lo que la norma no cubre, y conviene no buscarlo ahí.** Ni los segmentos de ruta HTTP —que son
castellanos: `/v1/cuentas`, `/v1/trabajos/{id}/desenlace`, `/salud` (`Contratos-REST.md` §3.1)—
ni los nombres de despliegue: `Dockerfile.web`, la etapa `visor` (`deploy/Dockerfile.web`:37), los
contenedores `lab-geometria-web` y `lab-geometria-api` que protege `AGENTS.md`, `MinVer` y el
prefijo `/v1/`. `grep -c` sobre la norma da **0** para todos ellos. No son identificadores de
código en el sentido de §2.2; se anota para que nadie los busque en §6.

## 6. El vocabulario del dominio

El **glosario raíz** es `Vision-Producto.md` §9 (21 términos en §9.1 y 6 en §9.2): «las categorías
02 y 03 referencian sus términos en lugar de redefinirlos». `SDD/Docs/README.md` §9 los resume en
21 líneas.

| Término | Definición | Fuente |
| --- | --- | --- |
| **Trabajo** | Lo que carga el alumno: nombre, fecha, descripción y el texto con el conjunto de piezas, con identificador propio y estado. «Trabajo» a secas es siempre esto; el esfuerzo de construcción es «tarea» o «etapa» | Visión §9.1 |
| **Estado del trabajo** | Conjunto cerrado de cuatro: `Borrador` (único que el alumno edita y elimina), `Pendiente`, `Finalizado`, `Rechazado`. Los dos últimos son **terminales** | Visión §9.1 |
| **Enviar** | **La única acción de guardado del alumno**: interpreta el texto y decide el estado. No hay «guardar sin enviar», y por eso `Borrador` significa «el texto no verificó» | Visión §9.1 |
| **Pieza** | Cada figura del conjunto raíz; **su identidad es su posición**, porque el dato no trae identificador | Visión §9.1 |
| **Componente** | Figura plana que forma parte de una pieza: tapa, cara, base, lateral o lado | Visión §9.1 |
| **Observación** | Superordinado de lo que el producto emite al interpretar; agrupa la advertencia y el error de validación | Visión §9.1 |
| **Advertencia** | Discrepancia entre valor declarado y derivado. **No impide** pasar a `Pendiente` | Visión §9.1 |
| **Error de validación** | Defecto que impide interpretar el texto; deja el trabajo en `Borrador` con sus errores localizados | Visión §9.1 |
| **Valor declarado / derivado** | El que trae el texto y el que el producto recalcula. **El par es lo que hace visible el error de fórmula** | Visión §9.1 |
| **Aprobar / rechazar** · **Desenlace** | Las dos decisiones del administrador sobre un trabajo en `Pendiente`, su facultad exclusiva; «desenlace» es el término colectivo. **No** se usa para el resultado de interpretar un texto | Visión §9.1; Glosario-Funcional Web y Api |
| **Comentario** | Texto libre y opcional del administrador al resolver. **No es calificación ni observación**, ni los comentarios que el texto del alumno trae como sintaxis | Visión §9.1 |
| **Retiro de un trabajo** | La eliminación que ejerce el administrador sobre un trabajo en cualquiera de sus tres estados visibles; la del alumno se acota a `Borrador` | Glosario-Funcional Web |
| **Contraseña provisoria** | La que **el sistema produce** al habilitar (RN-02016) o al resetear (RN-02014); el administrador la comunica fuera del producto, se muestra una vez y deja la marca de **cambio de contraseña pendiente** | Glosario-Funcional Api:90; Web:57–58 |
| **Cambio forzado** | El cambio que hace, obligada, la persona a la que le resetearon la contraseña: mismo formulario que el voluntario, **sin salida** | Glosario-Funcional Web |
| **Papel** · **Situación de cuenta** | Conjunto cerrado de dos (alumno, administrador; **no se dice «rol»**) · de tres (pendiente, habilitada, bloqueada; «situación» para no chocar con el estado del trabajo) | Glosario-Funcional Web |
| **Pieza pública / pieza de datos** | Las dos piezas desplegables: el front, único contacto del navegador, y el servicio que sostiene dato y reglas. **Siempre calificadas** | Visión §9.2; Glosario-Funcional Web |
| **Estado degradado** · **Cartel de reconexión** | La pieza pública en pie sin datos porque la de datos no responde · el aviso de corte del tramo navegador–pieza pública. **No son lo mismo** | Glosario-Funcional Web |
| **Actividad 1** · **`Describir()`** | El trabajo práctico que emite el dato, fuera del producto · el método que devuelve cada figura como texto, que no cumple JSON estricto | Visión §9.1 |
| **Tapa** · **Rectángulo desarrollado** · **Coma final** | Los dos círculos del cilindro (y, erróneamente, las bases del ortoedro) · la superficie lateral del cilindro desenrollada · la coma antes del cierre que se tolera por diseño | Visión §9.1 |
| **Laboratorio** | Como la cátedra nombra al producto en uso; «de aula» acota alcance, no nombra | Visión §9.1 |
| **Etapa** · **Fase del roadmap** | Tramo de construcción del intake §15 con su punto de control · su homóloga del roadmap; desde la 1.11 hay fases sin etapa homónima (`k`) | Visión §9.2 |
| **Punto de control** · **Puerta técnica** | Detención obligatoria al cerrar una etapa, a la espera del OK del Product Owner · verificación de viabilidad (`PT-01` a `PT-05`) que detiene lo que depende de ella | Visión §9.1 y §9.2 |
| **Capacidad** | Ítem del alcance funcional del intake, `F-XX` (hay `F-01` a `F-26` citados en el corpus vivo); **no** es un caso de uso | Visión §9.2 |
| **Proyecto de código** · **Unidad desplegable** | Unidad de compilación (siete) · proceso que se despliega por separado (dos) | README §9; Visión §9.3 |
| **Puerto** · **Fachada del visor** | Contrato que define casos de uso e implementan adaptadores · las seis funciones que el anfitrión invoca del bundle, único punto de extensión declarado | README §9 |
| **Cliente** | Toda **aplicación propia** que actúa en nombre de una persona (otro front, una app MAUI, un script del docente). La API autentica personas, no aplicaciones | `Api ADR-00009` §2 |
| **Escenario** | Cada uno de los ocho juegos de datos `§20.E-1` a `§20.E-8` del intake. **No se inventan datos de prueba** | README §9; intake §20 |
| **Banco local** · **Laboratorio desplegado** | Los dos modos de la batería E2E: sin `URL_BASE` levanta el producto con almacén propio; con `URL_BASE` prueba el sitio publicado | `Web/08-Calidad-Y-Pruebas/Pruebas-Extremo-A-Extremo.md` §2 |
| **Mesa** | Registro de mesa de expertos en `Audit/Mesa-*.md` (12 en el árbol), con convocatoria y hallazgos; ocho votan con veredictos tipo `5-0` (no aparece en 08-31, 09-01-C, 09-02 ni 09-12-ciclo-2); las siete desde la 08-31-B declaran «Prefijo de familia» en la cabecera, las cinco anteriores (08-27, 08-29, 08-31, 09-01-C, 09-02) no | Cabeceras de `Audit/Mesa-*.md` |
| **Expediente** · **Actuación** | Carátula de un trámite con actuaciones foliadas que no se reescriben y evidencia con procedencia; hay uno, `EXP-0001` (migración a SDD 13.16) | `SDD/Expedientes/0001-Migracion-Normativa-A-13.16/README.md` |

Los glosarios de categoría **no se reemplazan con éste**: cada unidad lleva el suyo en
`02-Especificacion-Funcional/Glosario-Funcional.md` (Api 504 líneas, Web 227) y en
`03-UX-UI-DX/Glosario-UX.md` (Api 474, Web 294). **Ninguno de los cuatro cambió entre `89f3ab3` y
`4b114d7`**, y el de Api arrastra cifras viejas en §2.1: «quince» puntos de acceso, «diez» códigos
de respuesta y «diecisiete» códigos del contrato, contra los 17 puntos y los 11 códigos que declara `Contratos-REST.md` (§3 y §4) y las 16
constantes de `ErrorCode.cs` (O-19 en
[`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md)).

## 7. Términos con más de un referente

| Palabra | Referentes y forma obligatoria | Fuente |
| --- | --- | --- |
| **Pendiente** | Cuenta registrada sin habilitar (`Pending`) · trabajo enviado a la espera de revisión (`Submitted`). **Siempre calificado**: «cuenta `Pendiente`», «trabajo en estado `Pendiente`»; la forma desnuda no se usa | Visión §9.2; norma §6.7 |
| **Pieza** | La figura del dominio (forma desnuda) · cada pieza desplegable (siempre «pieza pública», «pieza de datos») | Visión §9.2 |
| **Acceso** | «Acceso» a secas es el valor firmado · «punto de acceso» (`A-XX`) es una entrada de la superficie · la posibilidad de entrar es «admisibilidad» | Glosario-Funcional Api §3.1 |
| **Código** | «Código de respuesta» (número HTTP) · «código del contrato» · «proyecto/solución/repositorio de código». **«Código» a secas no se escribe** | Glosario-Funcional Api §3.2 |
| **Punto** | «Punto de acceso» · «punto de control» · «punto abierto», siempre completos | Glosario-Funcional Api §3.3 |
| **Proyecto** | «Proyecto de código» es sólo una unidad de compilación; **«proyecto» a secas no se usa**; `Ejemplo1` y `Ejemplo2` son las unidades de la Actividad 1 | Visión §9.3 |
| **Alumno / usuario** | «Alumno» es la **etiqueta** del papel `Student` en este despliegue; el papel es «usuario». Se declara la equivalencia y **no se renombra ningún uso** | `Api ADR-00009` §2 punto 4 |
| **Endpoint** | En prosa se dice «punto de acceso»; el espacio de nombres dice `Endpoints`. Es la separación §3/§4 funcionando | norma §6.10 |

## 8. Las familias de identificador del corpus

Para leer una cita sin buscar qué es cada prefijo. Conteos sobre el corpus vivo (633 archivos de
`SDD/` sin `_legacy/` ni `Maquetas/`).

| Familia | Qué nombra | Cuántos | Dónde vive |
| --- | --- | --- | --- |
| `NB-000NN` | Necesidad de negocio | 9 archivos | `01-Necesidades-Negocio/Necesidades-De-Negocio/` |
| `RN-020NN` | Regla de negocio | 16 (`RN-02001`–`RN-02016`) | `Api/02-Especificacion-Funcional/Reglas-De-Negocio/` |
| `INV-0N` | Invariante del dominio | 9 | Intake §17.1 (P.2 · Domain), transcriptos de `RT §7.3` |
| `RA-0N` | Regla de arquitectura de producto | 3 | Intake §14 |
| `RI-0N` | Riesgo de integración | 6 | `Producto/Vista-Producto.md` §7 |
| `CU-NNNNN` | Caso de uso | 48 archivos | Las `02/Casos-De-Uso/` y demás carpetas de casos de uso de cada unidad |
| `US-000NN` | Historia de usuario | 144 archivos | `06-Backlog-Tecnico/historias-usuario/` |
| `BT-000NN` | Tarea técnica | 35 archivos | `06-Backlog-Tecnico/tareas-tecnicas/` |
| `ADR-NNNNN` | Decisión de arquitectura | **59** archivos | Los tres `Adrs/` (Api, Web, Producto); el bloque dice de quién es |
| `A-NN` | Punto de acceso HTTP | 17 vivos (`A-01`–`A-18` sin `A-04`) | `Api/05/Contratos-REST.md` §3.1 |
| `QG-…` · `CV-…` | Puerta de calidad · criterio de validación | 74 `QG-NNNNN` y 41 `CV-NNNNN` distintos | `08-Calidad-Y-Pruebas/`, `09-Devops/` |
| `SD-NNNNN` · `VER-…` | Sonda de sensado de deriva · contrato de verificación de un sample | 101 `SD` distintos en las dos `Matriz-Sensado-Deriva.md` | Esas matrices y `10-Examples/`, `samples/` |
| `PT-0N` | Puerta técnica | 5 | `Roadmap-Producto.md` §2.2 |
| `F-NN` | Capacidad del intake | `F-01`–`F-26` citadas | Intake §4 |
| `RT-NN` · `RT §x` | Requisito técnico de la especificación de Web (13 filas) · sección del documento `Requerimientos-Tecnicos.md`, que vive fuera del repo | — | `Web/02/Especificacion-Funcional.md` §6 · intake, «Fuentes» |
| `EVE-000NN` | Eventualidad del entorno | 8 | `Producto/11-Documentacion/Bitacora-Eventualidades.md` |
| `AP-0N` | Apartamiento declarado | `AP-01`–`AP-04` citados | `Plan-Etapa-A.md` y el `PRODUCT-MANIFEST` |
| `C-N`, `I-N` | Criterios de las puertas de etapa (`C-1`–`C-5`, `I-1`–`I-7` citados en los guiones) | — | `scripts/verify-*.sh` |
| `F-0N`, `V-N`, `R-N` | Decisión de frontera · control de la norma (`V-1`–`V-7`) · tramo de renombre | — | Norma §5, §7, §8 |
| `D1`, `A3`, `D-0N` | Decisiones y asunciones del Product Owner | — | `Audit/A3-Decisiones-Del-Product-Owner.md`, `Audit/D1-Confirmacion-De-Asunciones.md` |
| Hallazgos de mesa | Las mesas desde la 2026-08-31-B declaran su prefijo: `MI-`, `RS-`, `RT-`, `MN-`, `RN8-`, `RN9-`, `RN10-`… | — | La cabecera «Prefijo de familia» de las siete `Audit/Mesa-*.md` desde la 2026-08-31-B |
| `EXP-NNNN` | Expediente | 1 (`EXP-0001`) | `SDD/Expedientes/` |
| `AG-000NN` | Rol de agente del framework SDD | 7 citados (`AG-00000`…`AG-00110`) | `SDD/Docs/README.md` §4 |
| `O-N` | Observación de esta base | — | [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) |

**Los bloques de `ADR`** dicen de qué proyecto es cada uno, y se recontaron: `00` Api (12), `02`
Domain (6), `04` Application (6), `06` Infrastructure (7), `08` Contracts (8, en `Producto/Adrs/`),
`10` Web (9), `12` Visor (6), `14` migración (5, en `Producto/Adrs/`). Los seis nuevos desde la 3.0
son `ADR-00009` a `ADR-00012` (Api) y `ADR-10008`, `ADR-10009` (Web). El renumerado a cinco dígitos lo hizo
el tramo `R-4` del 2026-08-29 (norma §8, recuadro inicial), y **las referencias cuyo bloque no
estaba en el texto conservan la forma vieja a propósito**, inventariadas en
`Audit/Inventario-Renumerado-R-4-2026-08-29.md`: en el corpus vivo conviven 637 ocurrencias de
`QG-NN` con 492 de `QG-NNNNN`, y 337 de `CV-NN` con 73 de `CV-NNNNN`.

## 9. Homónimos entre familias: leer con el documento al lado

Un mismo token nombra cosas distintas según el documento. **Ninguno está unificado**; lo que sigue
es medido y sirve para no confundirlos.

| Token | Qué nombra según dónde |
| --- | --- |
| `R-02` | Restricción «sin presupuesto monetario» (`Vision-Producto.md`:157) · riesgo de orden entre backlogs (`Plan-Etapa-A.md`:599) · hallazgo «partición de origen compartida» (`Audit/Mesa-2026-09-14.md`:135) · «el tramo front→API en claro» (intake:1110 y `Api ADR-00009` §2) |
| `R-N` / `R-NN` | Tramos de renombre de la norma (`R-1`…`R-5`, más `R-1b`, `R-2b`, `R-3a`…`R-3e` en §8 —`R-3b` y `R-3c` ejecutados el 2026-08-29—, y el `R-4` del renumerado, distinto del `R-4` de §8.1) · los 24 hallazgos `R-01`–`R-24` de la mesa del 2026-09-14 |
| `E-N` | Escenarios `§20.E-1`–`§20.E-8` del intake · escaladas `E-1`–`E-7` de la mesa del 2026-09-14 · `E-NNN`, evidencias de `EXP-0001` |
| `RT-06` | En la especificación de Web: «la pieza pública no guarda estado propio» (`Web/02/Especificacion-Funcional.md`:220) · en el intake (línea 548) y la norma §5.3: «los dos extremos se despliegan juntos ante un cambio de contrato» |
| `VER-` | Dos formas conviven: `VER-NN` y `VER-NNNNN`. En `samples/` hay 5 distintos de las dos formas (`VER-01`…`VER-03`, `VER-00004`, `VER-02001`); en el corpus vivo, 6 `VER-NN` y 17 `VER-NNNNN` |

## 10. Para escribir un nombre nuevo, en orden

1. Buscá el concepto en §6 de la norma (o en §4.1 de este índice para los frecuentes).
2. Si no está, **agregá la fila primero**, con su cuarta columna y su fila de control de cambios.
3. Escribí el identificador en inglés con la forma de §2; la etiqueta y el texto, en castellano.
4. Si es un `data-gf-*`, sumalo también a `AUTORIZADOS` de `scripts/verify-stage-c.sh` (puerta
   `C-4`): sin eso la puerta `c` queda en rojo, que es exactamente lo que pasó antes de §6.26.
5. Si es un código de condición, declaralo en su catálogo antes de emitirlo (`AGENTS.md`:37).
