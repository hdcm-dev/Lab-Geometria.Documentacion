# 15 · Decisiones de arquitectura (ADR) y decisiones del Product Owner

> **Propósito:** catálogo de las 60 ADR vivas del producto (estado, fecha, quién supera a quién, fuente), los registros `Decisiones-Arquitectura.md` de cada unidad, las decisiones del Product Owner `D1`–`D11`, el registro de frases retiradas y los apartamientos declarados del marco.
> **Fuente primaria:** `SDD/Docs/Producto/Adrs/`, `SDD/Docs/Unidades-Entrega/*/05-Arquitectura-Tecnica/Adrs/` y `Decisiones-Arquitectura.md`, `SDD/Docs/Audit/A3-Decisiones-Del-Product-Owner.md`, `SDD/Docs/Audit/Decisiones-Y-Frases-Retiradas.md`, `SDD/Docs/Audit/D1-Confirmacion-De-Asunciones.md`, `SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md`.
> **Revisión:** Lab-Geometria `main` `5f07b12` · ia-db 4.0 · 2026-11-01.
> **No cubre:** el mecanismo que cada ADR gobierna (ver índice del dominio en la columna «Mecanismo en»), ni las mesas que las propusieron (16), ni las ADR archivadas en `_legacy/` (17).

---

## 1. Magnitudes

| Grupo | Carpeta | ADR | Series |
|---|---|---|---|
| Producto | `SDD/Docs/Producto/Adrs/` | 13 | 08001–08008 (contratos inter-unidad), 14001–14005 (apartamientos del marco) |
| GeometriaFactory-Api | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/` | 31 | 00001–00012 (Api), 02001–02006 (Domain), 04001–04006 (Application), 06001–06007 (Infrastructure) |
| GeometriaFactory-Web | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Adrs/` | 16 | 10001–10010 (Web), 12001–12006 (Visor) |
| **Total** | | **60** | Recuento por `git ls-files` sobre `5f07b12`, excluido `_legacy/` |

Convención de serie: los dos primeros dígitos son el bloque del proyecto de código o del ámbito (00 Api, 02 Domain, 04 Application, 06 Infrastructure, 08 Contracts/producto, 10 Web, 12 Visor, 14 apartamientos). Origen de esa numeración: índice 17.

Estados en uso: **Aprobado**, **Aceptado** (sinónimos de vigente; los de 2026-08-16 en adelante suelen decir «Aceptado»), **Superado parcialmente** (sólo ADR-00008), **RETIRADO** (sólo ADR-14005). Ningún archivo ADR dice «Propuesta»; los registros `Decisiones-Arquitectura.md` sí listan 39 como «Propuesto» (ver §10 divergencia 5).

---

## 2. Relaciones de superación y retiro

| ADR | Relación | Con | Alcance | Fuente |
|---|---|---|---|---|
| ADR-00008 | Superada parcialmente por | ADR-00010 (2026-09-12) | Deroga la regla 1 de §2 (sin versión en la ruta); las reglas 2–5 (despliegue conjunto) subsisten | `…/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/ADR-00010-…md` §2.3 |
| ADR-14005 | **Retirada** el 2026-08-29 sin haber sido aceptada | — | El PO renumeró las dos familias al mapa de bloques del destino; el apartamiento dejó de hacer falta | `SDD/Docs/Producto/Adrs/ADR-14005-…md` §0 |
| ADR-00009 | Supera una premisa (no una ADR) | «No hay clientes de terceros» (intake ≤ 4.2) | Aviso de lectura en ADR-08003 1.2, en ADR-00008 (blockquote «Aviso de lectura (2026-09-12)») y en ADR-00002 1.2 (§2 regla 5 deja de fundarse en la premisa) (tarea BT-00027) | `SDD/Docs/Producto/Adrs/ADR-08003-…md` control de cambios 1.2 |

No hay otras cadenas «supera/superada por» declaradas en las cabeceras de las 60 ADR.

---

## 3. ADR de producto (13)

Ruta base: `SDD/Docs/Producto/Adrs/`.

| ADR | Decisión (título abreviado) | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 08001 | Tipos de transferencia planos, sin comportamiento ni dependencias | Aprobado | 2026-08-10 | 06 |
| 08002 | Un único tipo de error con conjunto cerrado de 17 códigos | Aprobado | 2026-08-12 | 06 |
| 08003 | Versionado por compilación compartida y despliegue conjunto, sin versionado de rutas | Aprobado (aviso 1.2: premisa superada por ADR-00009) | 2026-08-12 | 06, 12 |
| 08004 | Regla de exposición: lista cerrada de lo que nunca cruza la frontera | Aprobado | 2026-08-10 | 06 |
| 08005 | Proyección de listado separada del detalle; el comentario como bloque propio | Aprobado | 2026-08-10 | 06 |
| 08006 | El visor recibe piezas reconstruidas, no el texto del alumno | Aceptado | 2026-08-16 | 10 |
| 08007 | El aviso de selección va en las opciones, no en una séptima función | Aceptado | 2026-08-16 | 10 |
| 08008 | La superficie HTTP se describe; el explorador no se publica solo | Aceptado | 2026-08-16 | 06 |
| 14001 | Archivado central de la migración (no por carpeta) — apartamiento | Aceptado | 2026-08-16 | 17 |
| 14002 | Familias propias del intake conservan su ancho de origen — apartamiento | Aceptado | 2026-08-16 | 14, 17 |
| 14003 | Dirección del backend como IP pública dinámica, actualizada a mano — apartamiento | Aceptado (PO 2026-08-18) | 2026-08-18 | 12 |
| 14004 | Ítem obligatorio sin objeto se declara «no aplica», no se difiere — apartamiento | Aceptado (PO 2026-08-26) | 2026-08-24 | 01 |
| 14005 | Familias acuñadas por el destino con ámbito de proyecto — apartamiento | **RETIRADO** | 2026-08-29 | 17 |

---

## 4. ADR de GeometriaFactory-Api (31)

Ruta base: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Adrs/`.

### 4.1 Serie 00 — proyecto Api

| ADR | Decisión | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 00001 | Host delgado; composición de raíz como único lugar de ensamblado | Aprobado | 2026-08-10 | 04 |
| 00002 | Formato de intercambio y su configuración, fijados para los dos extremos (cuerpo excedido: se rechaza, nunca se trunca) | Aprobado | 2026-08-10 | 06 |
| 00003 | Credencial firmada, papel por punto y guardia transversal (exactamente cuatro puntos fuera de la guardia) | Aprobado | 2026-09-14 | 08 |
| 00004 | Dos traducciones en orden, tabla única, sin inventar códigos | Aprobado | 2026-08-31 | 06 |
| 00005 | Sin paginación, con condición de reingreso declarada | Aprobado | 2026-08-10 | 06 |
| 00006 | Composición de raíz: ciclos de vida y configuración en un solo lugar | Aprobado | 2026-08-10 | 04, 12 |
| 00007 | Arranque en dos fases; punto de salud sin acceso | Aprobado | 2026-08-10 | 04, 07 |
| 00008 | Sin versionado de rutas; despliegue conjunto | **Superado parcialmente** por 00010 | 2026-08-10 | 06 |
| 00009 | La Api autentica personas, no aplicaciones | Aceptado | 2026-09-12 | 08 |
| 00010 | Versión en la ruta, sólo el MAJOR (`/v{MAJOR}/`) para la superficie pública | Aceptado | 2026-09-12 | 06 |
| 00011 | El canje se protege por cuenta; el origen tolera una comisión | Aceptado | 2026-09-14 | 08 |
| 00012 | El autorregistro admite los dominios que el despliegue declara | Aceptado | 2026-09-14 | 08 |

### 4.2 Serie 02 — Domain

| ADR | Decisión | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 02001 | Modelo de dominio rico, invariantes explícitas, cero dependencias | Aprobado | 2026-08-10 | 05 |
| 02002 | Superficie pública: guardas con resultado tipado, no excepciones | Aprobado | 2026-08-10 | 05 |
| 02003 | Versionado semántico sin publicación; estabilidad de la superficie | Aprobado | 2026-08-10 | 12 |
| 02004 | Frontera de autenticación: el dominio modela la condición, no el mecanismo | Aprobado | 2026-08-10 | 05, 08 |
| 02005 | Puerta única de admisibilidad para las guardas de acceso de la cuenta (INV-09) | Aprobado | 2026-08-10 | 05 |
| 02006 | El dominio no lee el reloj ni el conjunto: entran por parámetro | Aprobado | 2026-08-10 | 04, 05 |

### 4.3 Serie 04 — Application

| ADR | Decisión | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 04001 | Casos de uso con inversión de dependencias, una sola dependencia saliente | Aprobado | 2026-08-10 | 04 |
| 04002 | Cuatro puertos; qué significa que el cuarto no tenga nombre declarado | Aprobado | 2026-08-13 | 04 |
| 04003 | Versionado por compilación compartida; superficie de dos caras | Aprobado | 2026-08-10 | 12 |
| 04004 | Orden fijo de las cuatro comprobaciones de autorización, cada una en su capa | Aprobado | 2026-08-31 | 08 |
| 04005 | Un caso de uso, una unidad de trabajo | Aprobado | 2026-08-10 | 05, 07 |
| 04006 | Resultado tipado y catálogo cerrado de 36 condiciones | Aprobado | 2026-08-12 | 05 |

### 4.4 Serie 06 — Infrastructure

| ADR | Decisión | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 06001 | Un adaptador por puerto, sin repositorio genérico ni adaptador único | Aprobado | 2026-08-10 | 07 |
| 06002 | Archivo único, escritor único, una unidad de trabajo por operación | Aprobado | 2026-08-10 | 07 |
| 06003 | Criterio de comparación de correos y el índice que lo sostiene | Aprobado | 2026-08-10 | 07 |
| 06004 | Derivación de clave anclada, parámetros versionados junto al valor | Aprobado | 2026-08-10 | 08 |
| 06005 | Contraseña provisoria no adivinable, sin repetirse, transcribible de viva voz | Aprobado | 2026-08-10 | 08 |
| 06006 | Lectura tolerante en un solo lugar; tabla de derivación por tipo | Aprobado | 2026-08-10 | 05 |
| 06007 | Transformaciones de esquema al arrancar, linaje inmutable, arranque detenido | Aprobado | 2026-08-10 | 07 |

---

## 5. ADR de GeometriaFactory-Web (16)

Ruta base: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Adrs/`.

### 5.1 Serie 10 — Web

| ADR | Decisión | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 10001 | Render en el servidor con circuito interactivo; una sola salida al servicio de datos | Aprobado | 2026-08-10 | 09 |
| 10002 | Sin estado propio ni persistencia; se omite el modelo de datos lógico | Aprobado | 2026-08-10 | 09 |
| 10003 | Credencial de sesión en el estado del circuito; las rutas acotan sin hacer cumplir | Aprobado | 2026-08-15 | 08 |
| 10004 | Tres capas de presentación: ninguna superficie llega sola al servicio | Aprobado | 2026-08-10 | 09 |
| 10005 | Traductor único de condiciones; estado degradado como superficie | Aprobado | 2026-08-12 | 09 |
| 10006 | El visor se opera sólo por sus seis funciones; el front consulta el entorno | Aprobado | 2026-08-10 | 10 |
| 10007 | Dirección del servicio de datos desde configuración; el despliegue termina comprobando | Aprobado | 2026-08-10 | 12 |
| 10008 | El bundle del visor lo genera el proyecto del front, y es el único que lo genera | Aprobado | 2026-09-13 | 10 |
| 10009 | El front le dice al servicio de datos de dónde llegó el navegador | Aprobado | 2026-09-14 | 08 |
| 10010 | La ayuda de usuario acompaña sin resolver el trabajo | Aprobado por delegación (pedido del PO 2026-10-27) | 2026-10-27 | 09 |

### 5.2 Serie 12 — Visor

| ADR | Decisión | Estado | Fecha | Mecanismo en |
|---|---|---|---|---|
| 12001 | Tres capas con fachada plana; motor de dibujo confinado a la capa interna | Aprobado | 2026-08-10 | 10 |
| 12002 | Seis funciones planas, siete garantías, siete códigos | Aprobado | 2026-08-10 | 10 |
| 12003 | Visualizador puro: cero red, persistencia, configuración e identidad (materializa RA-02) | Aprobado | 2026-08-10 | 10 |
| 12004 | Motor de dibujo empaquetado en el bundle y aislado tras la capa 3 (lo mide PT-03) | Aprobado | 2026-08-10 | 10, 11 |
| 12005 | Disposición determinista derivada del índice (de posición, no de orientación) | Aprobado | 2026-08-10 | 10 |
| 12006 | Bundle generado; su versionado es el del punto de extensión | Aprobado | 2026-09-12 | 10 |

---

## 6. Registros `Decisiones-Arquitectura.md`

| Unidad | Fuente | Líneas | Secciones útiles |
|---|---|---|---|
| GeometriaFactory-Api (Api, Infrastructure, Domain, Application) | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/05-Arquitectura-Tecnica/Decisiones-Arquitectura.md` | 247 | §1 índice de ADR por proyecto; §2 las cinco decisiones que exige el tipo `rest-api`; §3 categoría vacía y por qué; **§4 «Si la pregunta es… → la respuesta está en»** (tabla de ruteo pregunta→ADR; estados, fechas y recuentos desactualizados, ver §10 divergencia 5); §6 ADR vigentes de Domain/Application; §7 por qué son seis y no tres |
| GeometriaFactory-Web (Web, Visor) | `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Decisiones-Arquitectura.md` | 140 | §2 ADR vigentes; §3 las cinco decisiones exigidas (estilo, persistencia, autenticación, capas, errores); §4 por qué siete y no cinco; **§5 cobertura por categoría** (observabilidad y extensibilidad sin ADR en Web, con motivo); §6 por qué seis y no tres en Visor |

Uso recomendado: para una pregunta concreta («¿cuánto dura un acceso firmado?», «¿quién impone el límite del texto?») ir primero a la tabla §4 del registro de la Api, que remite a la ADR y a la sección exacta.

---

## 7. Decisiones del Product Owner (`A3`)

Fuente: `SDD/Docs/Audit/A3-Decisiones-Del-Product-Owner.md` (309 líneas). Presenta 57 pendientes agrupados en ocho decisiones (§2) más tres registradas fuera de ellas (§4).

| Id | Asunto | Desenlace | Fecha | Detalle |
|---|---|---|---|---|
| D1 | Confirmar valores `[ASUNCIÓN]` (A-2..A-5) | **Confirmada**, excepto el caudal (sale de PT-05) | 2026-08-26 | `SDD/Docs/Audit/D1-Confirmacion-De-Asunciones.md` |
| D2 | Unidad de estimación | **Retirada**: el producto no estima (ver D11) | 2026-08-25 | A3 §2, §4 |
| D3 | Vigencia del acceso firmado | **Reformulada por lectura**: 480 min por omisión | 2026-08-26 | A3 §2; mecanismo en 08 |
| D4 | Límite de tamaño del cuerpo | **Decidida**: valor por omisión del servidor | 2026-08-20 | A3 §2 (commit `b4a4804`) |
| D5 | Volumen de la comisión | **Cerrada por incognoscible** | 2026-08-20 | A3 §2 |
| D6 | Versión de plataforma del hosting | **Retirada**: ya contestada (PT-01.a, `net10.0`) | 2026-08-31 | A3 §2 |
| D7 | Herramienta que calcula la versión | **Diferida a la fase i** (la elige el equipo) | 2026-08-30 | A3 §2; ver §10 divergencia |
| D8 | *Mutation score* en el pipeline | **Decidida con un NO** | 2026-08-20 | A3 §2 |
| D9 | Formato del inventario de componentes | **CycloneDX, salida JSON** | 2026-08-24 (corte 09 de la migración 10.0→13.3) | A3 §4; mecanismo en 12 |
| D10 | Identificadores de puntos abiertos de la categoría 09 | `PD-NN`, ámbito el documento | 2026-08-24 | A3 §4 |
| D11 | Reconocimiento de que el producto no estima (`equipo_n = 1`) | Retira D2 | 2026-08-25 | A3 §4 |

A3 §1 lista además familias «cerrables leyendo» (versión de three `0.169.0` en `visor/package.json`, PBKDF2 en `Infrastructure/Security/PasswordDerivation.cs`, `EmailIdentity.Normalize`, 18 puntos de acceso, sin biblioteca de componentes) y §4bis cuatro puntos de categoría asignados al control de la fase i (respaldo, fecha de modificación de la cuenta, sello de desenlace como `UpdatedAt`, seis tipos reconstruibles). Lección declarada en A3 §4: «decidido que no» y «sin decidir» son indistinguibles en el árbol; para D4 y D8 el registro es la única fuente.

### 7.1 D1 en detalle

Fuente: `SDD/Docs/Audit/D1-Confirmacion-De-Asunciones.md` (156 líneas). Agrupa los valores por lo que gobiernan: §3.1 umbrales de latencia y arranque (A-5), §3.2 coberturas mínimas (A-3), §3.3 gates no de líneas (A-4), §3.4 métricas de negocio (A-2: 8 de 8 etapas, ≥ 80 % alumnos entregan, 100 % revisadas, ≥ 1 advertencia por alumno). Efecto: 12 filas vencidas cerradas y gates condicionados pasan a bloqueantes (QG-03/04/13 de Api, QG-03/07 de Domain, QG-03/10 de Application, QG-05/06/14 de Infrastructure); QG-14 de Api sólo en percentil, el caudal sigue condicionado. Medición de esos gates: índice 11.

---

## 8. Decisiones y frases retiradas

Fuente: `SDD/Docs/Audit/Decisiones-Y-Frases-Retiradas.md` (117 líneas). Registro leído por un guion (formato `id | decisión | patrón | dónde puede vivir | estado | dueño`): estado `pendiente` informa, `vigilada` falla si la frase reaparece. La compuerta que lo ejecuta: índice 11.

| id | Decisión o hecho | Estado |
|---|---|---|
| RE-01 | D4: valor por omisión del tamaño del cuerpo | pendiente |
| RE-02 | D8: mutation score no entra | pendiente |
| RE-03 | D3: vigencia 480 min | pendiente |
| RE-04 | D1: umbrales confirmados, puertas bloqueantes | pendiente |
| RE-05 | La cobertura se mide desde 2026-08-27 | pendiente |
| RE-06 | PT-01.a: el hosting soporta `net10.0` | vigilada |
| RE-07 | PA-01: no hay biblioteca de componentes | vigilada |
| RE-08 | MI-01: el respaldo existe | vigilada |
| RE-09 | MI-09: `/salud` evalúa el almacén en cada consulta | vigilada |

§3 del mismo documento registra ítems diferidos con disparador medible `DF-01`..`DF-09` (fragmento de retorno < 768 px, disco lleno, `restart` sin reacción a salud, peso del documento, `gf-notice`, `NotFoundPage` interactiva, `[StreamRendering]`, aviso de reconexión `failed/rejected` reabierto 2026-09-01, `box-sizing`).

---

## 9. Apartamientos declarados

Los apartamientos del marco (`Root-Rules.md` §11) son las ADR de la serie 14 (todas con «**Tipo:** Apartamiento declarado»).

| ADR | Apartamiento | Estado | Saltos sobrevividos / nota |
|---|---|---|---|
| 14001 | Archivado central de la migración 6.0→8.6 (sólo esa) | Aceptado | — |
| 14002 | Diez familias del intake conservan su ancho de origen | Aceptado | — |
| 14003 | Backend por IP pública dinámica, `API_BASE_URL` actualizada a mano | Aceptado, §6 campo 5 «vigente» | 3 (9.12→10.0, 10.0→13.3, 13.7→13.16); disparador: IP estática o DDNS |
| 14004 | Ítem obligatorio sin objeto → «no aplica» | Aceptado | disparador: que el marco incorpore la figura o se adopte IaC |
| 14005 | Familias acuñadas por el destino con ámbito de proyecto | Retirado sin aceptar | renumeradas al mapa de bloques |

El manifiesto (`SDD/Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md`) no tiene una sección propia de apartamientos: §1.1 (procedencia) registra el campo 7 de ADR-14001..14004 y los ítems diferidos `PA-09` (Api/06) y `PD-04` (Api/09) que rigen por default del PO; «Decisiones de reconciliación» declara **sin filas**; su control de cambios 5.1 (2026-08-25) registra que la revisión de apartamientos de §4.7 no se había ejecutado y se cerró en esa emisión. Detalle de las migraciones: índice 17.

---

## 10. Divergencias detectadas al indexar

| # | Fuente A | Fuente B | Observación |
|---|---|---|---|
| 1 | A3 §2 D7: «diferida a la fase i… no hay MinVer» | `Directory.Build.props`: «LA VERSIÓN LA CALCULA MINVER DESDE LAS ETIQUETAS» | La herramienta ya se eligió (MinVer) y A3 no registra el desenlace de D7; sí consta en ADR-00010 §2 punto 4, que remite a BT-00033 «(evento de etiqueta y MinVer)». Mecanismo: 12 |
| 2 | A3 §4bis: «No hay respaldo» | `Decisiones-Y-Frases-Retiradas.md` RE-08 (MI-01, 2026-08-31): el respaldo existe | A3 conserva una frase que el registro declara retirada (la regla vive en `SDD/Docs/Audit/`) |
| 3 | ADR-14003 §6 campo 5 «vigente» (IP dinámica a mano) | Despliegue real de la fase i (túnel y dominio, índice 12) | La ADR se revisó el 2026-09-13 (control de cambios 1.4, §6 campo 6): registra que el 2026-09-06 el producto realizó un canal que no depende de la dirección, que la revisión no decide y que el ADR de topología que la supere está asignado al PO (`Audit/Mesa-2026-09-12.md` §8). El disparador (§6 campo 4) sigue sin declararse cumplido |
| 4 | ADR-00008 «sin versionado de rutas» | ADR-00010 `/v{MAJOR}/` | Resuelto por la superación parcial declarada; ADR-08003 conserva el título «sin versionado de rutas» con aviso de lectura |
| 5 | Registros `Decisiones-Arquitectura.md` de Api y Web | Cabeceras de los archivos ADR | Los registros listan 39 ADR como «Propuesto» (Api: 00001–00007, 02001–02006, 04001–04006, 06001–06007; Web: 10001–10007, 12001–12006) y los archivos dicen «Aprobado». Fechas distintas: 00003 08-10/09-14, 00004 08-10/08-31, 00011 09-13/09-14, 04002 08-10/08-13, 04004 08-10/08-31, 04006 08-10/08-12, 10003 08-10/08-15, 10005 08-10/08-12, 10008 09-12/09-13, 12006 08-10/09-12 (registro/archivo). Recuentos viejos: Api §1.1 «Diez ADR» (tabla 12), §4.1 «las once», Web §2.1 «Siete ADR» (tabla 10). Título de ADR-04004: registro «en un único componente», archivo «cada una en su capa». Para estado y fecha rige el archivo ADR |

Consolidación de observaciones: índice 19.
