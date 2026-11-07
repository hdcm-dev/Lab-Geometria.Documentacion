# 02 · Requerimientos: necesidades de negocio, capacidades y alcance

> **Propósito:** qué se pidió y por qué. Cubre la visión del producto, las nueve necesidades de negocio (NB-00001 a NB-00009), las capacidades F-01 a F-26 con su prioridad MoSCoW, las exclusiones X-n, la compatibilidad de plataformas, las reglas de arquitectura de nivel producto RA-01 a RA-03 y las asunciones del intake.
> **Fuente primaria:** `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` (versión 5.1, 2026-09-15, Aprobado). Las categorías `SDD/Docs/00-Contexto/` y `SDD/Docs/01-Necesidades-Negocio/` derivan de él; ante conflicto, rige el intake.
> **No cubre:** en qué etapa se entrega cada capacidad ni su avance → `03`; reglas RN/INV/RC del dominio → `05`; ADR que implementan → `15`; métricas de puertas técnicas → `11`.
> Revisión indexada: `Lab-Geometria` main `5f07b12`. Rutas relativas a la raíz del repo.

---

## 1. Fuentes de este índice

| Documento | Ruta | Versión / fecha | Qué aporta |
|---|---|---|---|
| Intake del producto | `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` | 5.1 · 2026-09-15 · Aprobado | §1–§3 problema y valor, §4 MoSCoW, §9 exclusiones, §10 restricciones, §14 RA-01..03, §22 asunciones |
| Visión de producto | `SDD/Docs/00-Contexto/Vision-Producto.md` | 1.7 · Aprobado | Problema, stakeholders, visión, OBJ-01..04, métricas, R-01..R-09, riesgos |
| Alcance de producto | `SDD/Docs/00-Contexto/Alcance-Producto.md` | 1.7 · Aprobado | Alcance incluido/excluido, entregables, ambientes, supuestos, criterios de aceptación |
| Compatibilidad de plataformas | `SDD/Docs/00-Contexto/Compatibilidad-Plataformas.md` | 1.6 · 2026-08-14 · Aprobado | Matrices de ejecución, navegador y construcción; mediciones PT-01 |
| Catálogo de necesidades | `SDD/Docs/01-Necesidades-Negocio/Necesidades-Negocio.md` | 1.7 (catálogo NB 1.4) · 2026-08-11 · Aprobado | Catálogo NB, recorte (fusiones/particiones), trazabilidad F→NB→CU |
| Fichas NB | `SDD/Docs/01-Necesidades-Negocio/Necesidades-De-Negocio/NB-0000[1-9]-*.md` | Estado Aprobado (las nueve) | Dolor, criterios de éxito y prioridad por necesidad |

## 2. Visión y problema

| Tema | Resumen | Fuente |
|---|---|---|
| Problema | La Actividad 1 (WinForms + `Describir()` → JSON) termina en el circuito «modelar → copiar → pegar → mirar» (copiar el texto del TextBox, pegarlo en una página estática y verlo en 3D): sin identidad, persistencia ni entrega | Intake §1; `Vision-Producto.md` §1 |
| Problema de fondo | Los ejemplos de la actividad emiten valores calculados incorrectos (área del cubo `4·l²` en vez de `6·l²`; volumen del ortoedro) | Intake §1 |
| Promesa central | «El trabajo del alumno queda guardado, tiene dueño, tiene estado y se entrega», sin cambiar una coma del JSON | Intake §3 |
| Stakeholders | PO = docente (también lead técnico, único dev humano y administrador); alumno; cátedra; agente IA como implementador; `equipo_n = 1` | Intake §2; `Vision-Producto.md` §2 |
| Visión «a 3 años» | Sin fecha; se expresa por grado de compromiso: comprometido (§4.1), candidato (§4.2), no previsto (§4.3), sin horizonte de calendario (§4.4) | `Vision-Producto.md` §4 |
| Objetivos SMART | OBJ-01 8 de 8 etapas (`a`–`h`); OBJ-02 ≥ 80 % de alumnos con un trabajo `Pendiente`+; OBJ-03 100 % de `Pendiente` con desenlace; OBJ-04 ≥ 1 advertencia declarado/derivado por alumno | `Vision-Producto.md` §5–§6; Intake §8 |

### 2.1 Diferenciadores (D-n del intake)

| ID | Diferenciador | Fuente |
|---|---|---|
| D-1 | El JSON se acepta tal como lo emite el programa del alumno (comas finales, `Tapas`, `Cuadrado`/`Rectangulo`) | Intake §3 |
| D-2 | Se señalan discrepancias declarado/derivado, sin corregir ni rechazar | Intake §3 |
| D-3 | Los ortoedros se dibujan (hoy no ocurre) | Intake §3 |
| D-4 | Previsualización 3D y árbol JSON dentro de la aplicación, para alumno y administrador | Intake §3 |
| D-5 | El administrador ve, filtra y agrupa todos los trabajos por alumno | Intake §3 |

## 3. Necesidades de negocio NB-00001 a NB-00009

| ID | Necesidad | MoSCoW | Capacidades | CU previstas (Api; Web) | Ficha |
|---|---|---|---|---|---|
| NB-00001 | Control de admisión y de bajas del laboratorio | Must | F-01, F-03 | 15; 3 | `SDD/Docs/01-Necesidades-Negocio/Necesidades-De-Negocio/NB-00001-Control-De-Admision-Al-Laboratorio.md` |
| NB-00002 | Identidad propia del alumno sin canal de correo | Must | F-02, F-04, F-05, F-26 | 15; 4 | `…/NB-00002-Identidad-Propia-Del-Alumno-Sin-Correo.md` |
| NB-00003 | Trabajo con dueño, estado y persistencia | Must | F-06, F-07, F-08 | 14; 2 | `…/NB-00003-Trabajo-Con-Dueno-Estado-Y-Persistencia.md` |
| NB-00004 | Interpretación fiel del dato del alumno, con el error localizado | Must | F-09, F-22 | 10; 2 | `…/NB-00004-Interpretacion-Fiel-Del-Dato-Del-Alumno.md` |
| NB-00005 | Visibilidad del error de cálculo sobre el trabajo propio | Must | F-10 | 4; 2 | `…/NB-00005-Visibilidad-Del-Error-De-Calculo.md` |
| NB-00006 | Visualización del trabajo dentro del producto | Must | F-11, F-13, F-25 | 3; 8 | `…/NB-00006-Visualizacion-Dentro-Del-Producto.md` |
| NB-00007 | Revisión de la comisión desde un solo lugar | Must | F-12, F-15 | 4; 3 | `…/NB-00007-Revision-De-La-Comision-En-Un-Solo-Lugar.md` |
| NB-00008 | Alcance del laboratorio desde el aula | Should | F-14 | 3; 1 | `…/NB-00008-Alcance-Del-Laboratorio-Desde-El-Aula.md` |
| NB-00009 | Desenlace explícito de la entrega | Must | F-21, F-23, F-24 | 9; 3 | `…/NB-00009-Desenlace-Explicito-De-La-Entrega.md` |

Fuente del catálogo: `SDD/Docs/01-Necesidades-Negocio/Necesidades-Negocio.md` §2 y §5.1.

### 3.1 Criterio de recorte

| Tipo | Contenido | Fuente |
|---|---|---|
| Fusiones | Capacidades con el mismo dolor central se agrupan en una NB (tabla de arriba) | `Necesidades-Negocio.md` §3.1 |
| Particiones | NB-00001/00002 (docente vs alumno); 00004/00005 (interpretar vs verificar); 00006/00007 (ver vs revisar); 00007/00009 (ver entrega vs decidir); 00008 (acceso, no funcional) | `Necesidades-Negocio.md` §3.2 |
| Sin NB propia | F-13, F-25 → absorbidas en NB-00006; F-26 → NB-00002; F-15 → NB-00007; F-16/F-17 sin NB (Could, X-6); F-18/19/20 sin NB (Won't) | `Necesidades-Negocio.md` §3.3 |
| Conteo | 19 capacidades Must Have, todas cubiertas por 8 NB | `Necesidades-Negocio.md` §3, §5.1 |
| Dependencias y trazabilidad a CU y métricas | Mapa NB↔NB, métrica→NB, NB→CU emitido | `Necesidades-Negocio.md` §4, §5.2–§5.4 |

## 4. Capacidades F-01 a F-26 (MoSCoW)

Fuente: `SDD/Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` §4 (columna «Origen» con RF-n y decisiones fechadas). La etapa de entrega vive en `03`.

| ID | Capacidad (resumen) | MoSCoW | NB |
|---|---|---|---|
| F-01 | Configurar el administrador en el primer arranque, sólo si no existe | Must | 00001 |
| F-02 | Registro de alumno (correo, nombre, apellido) sin elegir contraseña | Must | 00002 |
| F-03 | Habilitar, bloquear, rehabilitar y dar de baja física cuentas | Must | 00001 |
| F-04 | Establecer contraseña en el primer ingreso efectivo, con provisoria del sistema, sin correo | Must | 00002 |
| F-05 | Inicio/cierre de sesión y cambio de contraseña exigiendo la actual | Must | 00002 |
| F-06 | Cargar un trabajo (nombre, fecha, descripción, JSON) con identificador propio | Must | 00003 |
| F-07 | Reeditar y eliminar sólo en `Borrador` (DECISIÓN 2026-08-08) | Must | 00003 |
| F-08 | Listar trabajos propios con estado `Borrador`/`Pendiente`/`Finalizado`/`Rechazado` | Must | 00003 |
| F-09 | Validar el JSON con la tolerancia del emisor real; error con índice de figura y campo | Must | 00004 |
| F-10 | Verificar `Area` y `Volumen` desde las dimensiones; advertencias no bloqueantes | Must | 00005 |
| F-11 | Previsualización 3D y árbol JSON colapsable | Must | 00006 |
| F-12 | Listado del administrador (excepto `Borrador`), agrupado y filtrado por alumno | Must | 00007 |
| F-13 | Sincronización árbol ⇄ escena por índice y disposición determinista (sube a Must el 2026-08-10) | Must | 00006 |
| F-14 | Despliegue real en i7infra por túnel bajo `geometria.aplicada.stream`, PT-05 desde la facultad (DECISIÓN 2026-09-06; FTP a somee queda como alternativa sin disparador) | Should | 00008 |
| F-15 | Panel de resumen: trabajos por alumno y por estado | Could | 00007 |
| F-16 | Exportar el trabajo (JSON original y captura) | Could | — |
| F-17 | Modo despiece | Could | — |
| F-18 | Correo y recuperación de contraseña olvidada | Won't v1 | — |
| F-19 | Múltiples administradores y permisos finos | Won't v1 | — |
| F-20 | Edición del JSON del alumno desde la aplicación | Won't v1 | — |
| F-21 | Comentario escrito del administrador al aprobar o rechazar (pasó de Won't a Must el 2026-08-08) | Must | 00009 |
| F-22 | **Enviar**: interpreta; si verifica → `Pendiente`, si no → queda en `Borrador` con errores | Must | 00004 |
| F-23 | Aprobar (`Finalizado`) o rechazar (`Rechazado`), terminales, sólo administrador | Must | 00009 |
| F-24 | El administrador elimina cualquier trabajo que ve, borrado físico | Must | 00009 |
| F-25 | Movimiento automático de la escena: órbita y giro con controles independientes, se detienen al arrastrar | Must | 00006 |
| F-26 | Resetear la contraseña de un alumno desde el panel; provisoria producida por el sistema | Must | 00002 |

Capacidades con prioridad menor (F-14..F-17) y su lectura «prioridad ≠ etapa»: `SDD/Docs/00-Contexto/Alcance-Producto.md` §4.2. Criterios de aceptación del producto (checklist por capacidad): `Alcance-Producto.md` §8.

## 5. Exclusiones X-1 a X-10

Fuente: Intake §9; reexpresadas en `SDD/Docs/00-Contexto/Alcance-Producto.md` §5.

| ID | Exclusión | Estado | Reingreso |
|---|---|---|---|
| X-1 | Notificaciones por correo | Vigente | No previsto |
| X-2 | Recuperación de contraseña olvidada | **Retirada 2026-08-09** (la sustituye F-26) | — |
| X-3 | Múltiples administradores, roles, permisos finos | Vigente | No previsto |
| X-4 | Corrección/edición del JSON del alumno | Vigente (se funda en RN-02008) | No previsto: contradice la premisa |
| X-5 | Calificación o devolución escrita | **Retirada 2026-08-08** (entra F-21; la calificación con nota sigue excluida) | — |
| X-6 | Despiece, exportar imágenes, URL compartible del visor | Vigente | Candidato etapa `i` |
| X-7 | Ambientación a un problema real | Vigente | Candidato etapa `i` |
| X-8 | Segundo factor de autenticación | Vigente | No previsto |
| X-9 | Pasarela `/api/*` en el front | Vigente; especificada para adoptarse sin rediseño (justificación: RT §2.4); reevaluada 2026-09-12 por `E-02`, sigue sin hacer falta | Si aparece descarga de archivos, carga directa desde el navegador o migración a WebAssembly, o si una aplicación propia de otro origen resulta ser JavaScript de navegador que el front deba intermediar (Intake §9; `Alcance-Producto.md` §5 repite casi la misma condición) |
| X-10 | Túnel saliente con dominio propio para el backend | **Realizada el 2026-09-06** según el intake (ver F-14) | — |

> Divergencia: `Alcance-Producto.md` §5 todavía presenta X-10 como exclusión con sus contras y no como realizada; el intake (fuente que rige) la da por realizada. Se registra en `19`.

## 6. Restricciones del cliente

| Restricción | Resumen | Fuente |
|---|---|---|
| Sin fecha objetivo | El avance se mide por etapas cerradas | Intake §10; `Vision-Producto.md` §7 R-01 |
| Sin presupuesto | Infraestructura de costo cero declarado | Intake §10; R-02 |
| Red de la facultad | Bloquea direcciones dinámicas; ordena la topología | Intake §10; R-03 |
| Hosting gratuito sin estado | Los datos no viven en el hosting público | Intake §10; R-04 |
| Servidor propio sin IP fija | Se admite IP directa; DDNS recomendado | Intake §10; R-05 |
| Host de desarrollo sin SDK .NET | Todo ocurre en Dev Container | Intake §10 |
| Formato de entrada no negociable | El servicio se adapta al JSON de `Describir()` | Intake §10; R-06 |
| Despliegue manual del backend | Lo ejecuta el docente | Intake §10; R-07 |
| Etapas en serie | Sin OK explícito no se avanza | Intake §10; R-08 |
| Normativa | Sin compliance sectorial; sí aplica Ley 25.326 (datos personales) | Intake §10 (R-09 de la visión dice «no aplica ninguna normativa»: ver `19`) |
| Tratamiento de datos personales | Se guardan correo, nombre y apellido del alumno y sus trabajos; finalidad: identificar a la persona y sus trabajos en el laboratorio de la cátedra; acceden el docente (administrador) y la persona sobre lo suyo; no se envían correos ni se comparten datos; retención mientras exista la cuenta (la baja borra la cuenta y todos sus trabajos); respaldos antes de cada despliegue y al cierre de cada cuatrimestre, conservados como máximo un cuatrimestre (`PD-04`, `Mesa-2026-09-15.md` D-4); corrección y supresión se piden al docente | Intake §10 (Ley 25.326 arts. 4, 6 y 16) |

Riesgos de negocio: Intake §11; `Vision-Producto.md` §8.

## 7. Reglas de arquitectura de nivel producto (RA-01 a RA-03)

Fuente: Intake §14 (tabla «Tres reglas de arquitectura… de nivel producto»). Su materialización en código y ADR → `04`, `08`, `10`, `15`.

| Regla | Enunciado | Por qué es de producto |
|---|---|---|
| RA-01 | Ningún JavaScript del navegador invoca la API | Sostiene: sin contenido mixto, sin CORS, sin exponer la IP del servidor propio. Sigue vigente para `GeometriaFactory.Web` tras `E-02` [DECISIÓN 2026-09-12]: la API se expone públicamente a otras aplicaciones propias, no al navegador del front; se reevalúa (CORS sólo para esa ruta ajena) si aparece una aplicación propia que sea JavaScript de navegador de otro origen (`D-01` cerrado por `ADR-00009`) |
| RA-02 | El bundle del visor es un visualizador puro: sin configuración, sin red, sin conocimiento del sistema | Hace imposible violar RA-01 desde el navegador |
| RA-03 | Todo lo que el navegador obtenga del backend pasa por el front | Descargas, imágenes y redirecciones desde el dominio del front; errores sin direcciones internas |

## 8. Compatibilidad de plataformas

Fuente: `SDD/Docs/00-Contexto/Compatibilidad-Plataformas.md`. Ante conflicto entre matrices rige la regla de su §1.2.

| Matriz | Contenido | Sección |
|---|---|---|
| Servidor de datos | `net10.0` sobre Linux, en contenedor, servidor propio | §1.2, §2.1 |
| Pieza pública (Web) | `net10.0` sujeto al hosting (verificado por PT-01.a) | §2.1, §2.6 |
| Proyectos de código | Domain/Application/Infrastructure/Contracts/Api `net10.0` Linux; Contracts se carga en los dos procesos; Visor = script estático, Node LTS sólo en construcción | §2.1 |
| Navegador | Por capacidad, no por versión: WebGL obligatorio; WebSockets o repliegue a long polling; HTTPS | §2.2 |
| Construcción | Dev Container (host sin SDK), Node LTS anclado, CI del proveedor para la pieza pública | §2.3 |
| Resultados medidos | PT-01.b transporte: en desarrollo WebSockets con repliegue a long polling (§2.4); sobre el hosting real WebSockets no se ofrece (sólo ServerSentEvents y LongPolling), producción corre en long polling, semáforo «Amarillo, y estable» (§2.6), PT-01.c 20 min sin reconexión y corte de red, PT-01.a sobre el hosting real | §2.4–§2.6 (detalle de medición → `11`) |
| Restricciones, alternativas, estado por plataforma | — | §3–§5 |

## 9. Asunciones e incógnitas del intake

Fuente: Intake §22; reexpresadas en `SDD/Docs/00-Contexto/Alcance-Producto.md` §6.

| ID | Contenido | Estado declarado |
|---|---|---|
| A-1 | Nombre «Fábrica de Geometría», raíz de código `GeometriaFactory` | Resuelta (PO, 2026-08-08) |
| A-2 | Targets de las cuatro métricas de negocio (8 de 8 etapas, ≥ 80 %, …) | Confirmada por `D1` 2026-08-26 |
| A-3 | Coberturas mínimas por proyecto (90/85 Domain, 85/80 Application, …, pirámide 60/40 en Api) | Confirmada por `D1` 2026-08-26 |
| A-4 | Gates no basados en cobertura de líneas para Contracts, Web y Visor | Confirmada por `D1` 2026-08-26 |
| A-5 | NFR numéricos (500 ms, 200 ms, p99 500 ms, 20 pet/min) | Confirmada en umbrales, con excepción declarada del caudal |

| Incógnita `[A VERIFICAR]` | Estado en el intake |
|---|---|
| Capacidades del hosting gratuito | Resuelta 2026-08-13 (PT-01.a 200, `net10.0`) |
| Versión de MudBlazor | Sin objeto 2026-08-31 (no se introdujo) |
| Imagen construida en destino desde Git | Viva (fase `i`, BT-00026) |
| Dominio propio para el túnel | Marcada «viva, atada a X-10» — contradice X-10 realizada (ver `19`) |
| Volumen de la comisión | Cerrada por incognoscible 2026-08-20 |

> Intake §22 da A-2..A-5 por confirmadas, pero siguen diciendo «pendiente de confirmación»: `Alcance-Producto.md` §6.1, el propio intake §8 («quedan sujetos a confirmación del Product Owner (§22, A-2)», divergencia interna §8 vs §22), `Vision-Producto.md` §5 y `Necesidades-Negocio.md` §6. Rige el intake §22.

## 10. Lo no verificable o divergente (remitido a `19`)

| Punto | Fuentes en conflicto |
|---|---|
| Estado de las NB: «Propuesto» en el catálogo vs «Aprobado» en cada ficha | `Necesidades-Negocio.md` §2 vs `NB-0000n-*.md` |
| X-10 realizada vs exclusión vigente | Intake §9 vs `Alcance-Producto.md` §5 |
| Incógnita «dominio propio» viva vs X-10 realizada | Intake §22 vs Intake §9/F-14 |
| A-2..A-5 confirmadas vs pendientes | Intake §22 vs `Alcance-Producto.md` §6.1, Intake §8, `Vision-Producto.md` §5 y `Necesidades-Negocio.md` §6 |
| Normativa: Ley 25.326 aplica vs «ninguna normativa» | Intake §10 vs `Vision-Producto.md` §7 R-09 |
