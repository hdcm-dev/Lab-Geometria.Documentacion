# 11 · Pruebas, puertas de calidad, puertas técnicas e instrumentos de medición

> **Propósito.** Ubicar cada batería de pruebas, cada puerta (QG-xx, guiones `verify-*`, PT-01..PT-05) y cada instrumento de medición de `tools/`, con lo que mide y dónde vive su texto vinculante.
> **Fuente primaria.** `tests/`, `scripts/` (test, coverage, pruebas-e2e, lib-puerta, verify-*), `tools/`, `SDD/Docs/Unidades-Entrega/*/08-Calidad-Y-Pruebas/` y las mediciones de `SDD/Docs/Producto/` y `SDD/Docs/Audit/`.
> **Revisión.** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01. Rutas relativas al repo.
> **No cubre.** Workflows de CI e imagen E2E (→ 12), avance y cierre de etapas (→ 03), el visor por dentro (→ 10), las mesas que pidieron cada instrumento (→ 16).

---

## 1. Mapa rápido

| Necesitás… | Andá a |
| --- | --- |
| Correr la batería | `scripts/test.sh` (§2) |
| Medir cobertura y pirámide | `scripts/coverage.sh` → `tools/informe-cobertura.cs` (§3) |
| Correr E2E con navegador | `scripts/pruebas-e2e.sh` + `pruebas-e2e.runsettings` (§2.4) |
| Saber si una etapa pasa | `scripts/verify-stage-<x>.sh` (§5) |
| El texto vinculante de un QG | `Estrategia-Calidad.md` §3 de la unidad (§4) |
| Una puerta técnica PT | §6 |
| Un instrumento puntual | §7 |
| Trazabilidad CU/RN/NFR ↔ prueba | `Matriz-Cobertura-Pruebas.md` de la unidad (§8) |

---

## 2. Las cuatro baterías

Conteo **recontado sobre 5f07b12** con `grep` de atributos (`[Fact]`/`[Theory]` en xUnit; `[Test]`/`[TestCaseSource]` en NUnit). Un `[Theory]` con `[InlineData]` produce más casos en ejecución que métodos; el número de casos ejecutados **no se verificó corriendo** la batería.

| Proyecto | Marco | Métodos de prueba | `[InlineData]` | Referencia a | Fuente |
| --- | --- | ---: | ---: | --- | --- |
| `GeometriaFactory.Domain.Tests` | xUnit + coverlet | 67 | 40 | Domain | `tests/GeometriaFactory.Domain.Tests/` |
| `GeometriaFactory.Application.Tests` | xUnit + coverlet | 54 | 11 | Application | `tests/GeometriaFactory.Application.Tests/` |
| `GeometriaFactory.Integration.Tests` | xUnit + coverlet + `Mvc.Testing` | 240 | 86 | Api, Web, Contracts (Infrastructure por transitividad) | `tests/GeometriaFactory.Integration.Tests/` |
| `GeometriaFactory.E2ETests` | NUnit + `Microsoft.Playwright.NUnit` | 28 métodos (32 casos según su doc) | — | ninguno: navegador contra el producto publicado | `tests/GeometriaFactory.E2ETests/` |

No hay proyecto de pruebas propio de Infrastructure ni de Contracts: se ejercen desde Integration (`.csproj` de cada batería).

### 2.1 Domain.Tests

| Clase | Métodos | Qué cuida |
| --- | ---: | --- |
| `WorkTests` | 30 | Trabajo: estados, desenlace, texto, invariantes |
| `AccountLifecycleTests` | 18 | Ciclo de vida de la cuenta (habilitar, bloquear, baja, reseteo) |
| `AccountTests` | 12 | Cuenta: creación y reglas |
| `DependencyGateTests` | 7 | Puerta de dependencias: Domain no referencia capas externas |

### 2.2 Application.Tests

| Clase | Métodos | Qué cuida |
| --- | ---: | --- |
| `WorkUseCaseTests` | 23 | Casos de uso de trabajos |
| `AccountLifecycleUseCaseTests` | 18 | Casos de uso del ciclo de vida de cuentas |
| `AccountUseCaseTests` | 10 | Casos de uso de cuentas |
| `PortGateTests` | 3 | Application referencia sólo Domain, no referencia web ni acceso a datos, y declara los 4 puertos (sin cita de QG en el archivo; cercano a QG-05 de Application, `Estrategia-Calidad.md` Api §3.3; no comprueba puerto→adaptador de QG-10 de Api) |

### 2.3 Integration.Tests (agrupado por dominio)

| Grupo | Clases (métodos) | Índice del mecanismo |
| --- | --- | --- |
| Superficie de trabajos | `WorkSurfaceTests` (31), `WorkWebSurfaceTests` (13), `SurfaceInteractionTests` (4) | 05, 06, 09 |
| Ciclo de vida de cuentas | `AccountLifecycleSurfaceTests` (18), `AccountLifecycleWebSurfaceTests` (8), `AdministratorLifecycleTests` (6) | 05, 08 |
| Interpretación del texto | `FigureValidatorBatteryTests` (14), `FigureDerivationTests` (9), `TextTreeTests` (9), `FigureTextReadingTests` (3) | 05 |
| Seguridad y sesión | `RateLimitingTests` (17), `SecurityGuardsTests` (11), `ProvisioningGateTests` (11), `SessionCookieTests` (7), `PanelSessionGateTests` (6), `ProvisionalPasswordTests` (5), `ForcedPasswordChangeTests` (4), `ForcedPasswordChangeSurfaceTests` (4), `SessionCredentialTests` (4), `SigningKeyStartupTests` (4), `SecurityHeadersTests` (3), `BrowserOriginForwardingTests` (3), `RegistrationDomainTests` (3) | 08 |
| Contrato HTTP | `ContractRoutePrefixTests` (6), `ContractTranslationTests` (6), `ContractCoverageTests` (4), `ContractErrorHandlerTests` (4), `ApiDocumentationSurfaceTests` (5) | 06 |
| Almacén | `StoreHealthTests` (4), `StoreJournalModeTests` (2), `HealthEndpointStoreTests` (1), `CredentialChangedAtMigrationTests` (1) | 07 |
| Composición y arranque | `CompositionGateTests` (4), `VersionSealTests` (3), `DeclaredDateControlTests` (3) | 04, 09, 12 |
| Arneses (sin pruebas) | `DataServiceHarness.cs`, `PublicPieceHarness.cs`, `Scenarios.cs` (escenarios E-n como datos) | — |

### 2.4 E2ETests

| Clase | Casos (doc) | Qué deja de detectarse si se borra |
| --- | ---: | --- |
| `EstadoDelLaboratorioTests` | 5 | Claves de protección efímeras que rompían sesiones en silencio |
| `IngresoTests` | 3 | Ingreso roto |
| `NavegacionTests` | 10 (6 métodos, uno con `TestCaseSource`) | Destinos por papel, desvío sin sesión, 404, cierre de sesión |
| `RecorridoDelAlumnoTests` | 1 | Camino completo de registro a entrega |
| `ResolucionDelTrabajoTests` | 3 | Que «aprobar» aplique el desenlace |
| `VentanaMuertaTests` | 2 | Controles muertos mientras engancha el circuito |
| `FiguraQueNoSePudoLeerTests` | 2 | Afirmar un dibujo que no se hizo |
| `DisenoResponsivoTests` | 6 | Versión angosta (P0 `MI-02`, regla `R-06`) |

Infraestructura: `Infraestructura/BancoLocal.cs` (monta producto efímero), `ElLaboratorio.cs`, `PruebaE2E.cs` (base), `ArranqueDeLaSuite.cs`, `ParalelismoDelEnsamblado.cs`.

**Dos modos**, conmutados por `URL_BASE`: banco local (sin secretos, almacén temporal) o laboratorio desplegado (exige `API_BASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`). Fuente: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/08-Calidad-Y-Pruebas/Pruebas-Extremo-A-Extremo.md` §2–§4.

---

## 3. Guiones y configuración de corrida

| Archivo | Qué hace | Detalle clave |
| --- | --- | --- |
| `scripts/test.sh` | Batería completa; mismo guion local y en CI | Éxito = 0 rojas y 0 deshabilitadas sin motivo (QG-02) |
| `scripts/coverage.sh` | Instrumento de `TC-00037`: QG-03 por capa (Domain/Application/Infrastructure), QG-04 y QG-06006 (validador, Infrastructure) | Sale 0 pasa · 1 alguna puerta no pasa · 2 no se pudo medir; no mide sobre rojo |
| `tools/informe-cobertura.cs` | Lee el XML cobertura y emite veredicto por proyecto | Umbrales líneas/ramas: Domain 90/85, Application 85/80, Infrastructure 85/80, Api 75/70; Contracts y Web sin umbral de líneas; validador `LocalFigureValidator.cs` 95 % líneas; pirámide 60 % integración |
| `coverlet.runsettings` | Excluye sólo `GeneratedCodeAttribute`, formato cobertura | Motivo medido 2026-08-29: 202 de 407 ramas de Api eran código generado de OpenAPI; excluir también `CompilerGenerated` dejaba Application en 6 ramas |
| `pruebas-e2e.runsettings` | Playwright: navegador `chromium` por defecto, timeout de 10 s | Navegador se pisa con `-- Playwright.BrowserName=firefox`; anfitrión sin WebSocket (long polling) justifica los 10 s |
| `scripts/pruebas-e2e.sh` | Camino declarado para correr la E2E | Origen de la imagen E2E → índice 12 |

---

## 4. Quality gates (QG-xx) por unidad y proyecto

**Texto vinculante:** `Estrategia-Calidad.md` §3 de cada unidad; los README de `08-Calidad-Y-Pruebas/` sólo resumen. La numeración `QG-01..` se repite por proyecto de código; el identificador completo lleva el prefijo del proyecto (p. ej. `QG-12004` = visor, gate 04; `QG-10001` = Web, gate 01).

### 4.1 GeometriaFactory-Api (`SDD/Docs/Unidades-Entrega/GeometriaFactory-Api/08-Calidad-Y-Pruebas/Estrategia-Calidad.md`)

Secciones §3.1 Api, §3.2 Domain, §3.3 Application, §3.4 Infrastructure. Gates de Api (15, resumidos en su `README.md` §4):

| Gate | Condición | Carácter |
| --- | --- | --- |
| QG-01 | Construcción en 0 y sin advertencias | Bloqueante |
| QG-02 | Batería entera en verde, incluida la del validador (10 casos) | Bloqueante |
| QG-03 | Cobertura 75 % líneas / 70 % ramas [ASUNCIÓN A-3] | Condicionado |
| QG-04 | Pirámide 60 % integración / 40 % unitarias [ASUNCIÓN] | Condicionado |
| QG-05 | Exactamente 4 de 15 puntos fuera de la guardia | Bloqueante |
| QG-06 | 16 de 17 códigos con destino, 1 sin él declarado | Bloqueante |
| QG-07 | 3 de 3 familias empobrecidas indistinguibles | Bloqueante |
| QG-08 | 0 respuestas con dirección, ruta, secreto o traza (RA-03) | Bloqueante |
| QG-09 | 0 diferencias y 0 truncamientos del texto | Bloqueante |
| QG-10 | 4 de 4 puertos con adaptador; 1 configuración de intercambio | Bloqueante, falla en construcción |
| QG-11 | 0 peticiones con almacén sin preparar | Bloqueante |
| QG-12 | 0 eliminaciones fuera de alcance al forzar la petición | Bloqueante |
| QG-13 | Arranque en frío < 30 s [ASUNCIÓN A-5] | Condicionado |
| QG-14 | p99 < 500 ms y 20 pet/min [ASUNCIÓN A-5] | Condicionado |
| QG-15 | Colección de peticiones en ≤ 5 pasos, 0 datos inventados | Bloqueante al cierre de etapa |

Domain, Application e Infrastructure tienen sus propios gates en §3.2–§3.4 (cobertura por capa con los umbrales de §3, puertas de dependencia/puertos, batería del validador §3.4/«diez casos»). Gates de cobertura que mide `scripts/coverage.sh` (fuente: `Estrategia-Calidad.md` Api, líneas 193, 214, 242, 243):

| Proyecto | Gate | Umbral |
| --- | --- | --- |
| Domain | QG-03 | 90 % líneas / 85 % ramas [ASUNCIÓN] |
| Application | QG-03 | 85 % líneas / 80 % ramas [ASUNCIÓN] |
| Infrastructure | QG-05 | 85 % líneas / 80 % ramas [ASUNCIÓN] |
| Infrastructure | QG-06 | 95 % líneas del validador de figuras [ASUNCIÓN] |

El resto de los gates de esas tres capas: consultar §3.2–§3.4 de la fuente (no tabulados aquí).

**Contracts (QG-08xxx):** `Estrategia-Calidad.md` de Api lo nombra entre sus proyectos pero no le dedica sección §3. Su definición vive sólo en `SDD/Docs/_legacy/2026-08-15-migracion-8.2/GeometriaFactory-Contracts/08-Calidad-Y-Pruebas/Estrategia-Calidad.md`, y el corpus vivo lo sigue citando como vinculante: `QG-08008` (despliegue conjunto ante cambio incompatible del contrato; `GeometriaFactory-Web/09-Devops/Pipeline-CI-CD.md:191`, `.../README.md:98`, `GeometriaFactory-Api/09-Devops/Estrategia-Versionado.md:389`) y `QG-08005` (100 % de tipos de transferencia ejercitados; `GeometriaFactory-Api/09-Devops/Pipeline-CI-CD.md:254`). `SDD/Docs/Audit/E-08-Calidad-Siete-Proyectos-r2.md:40` cuenta 77 gates en siete proyectos; este índice tabula Api, Web, visor y la cobertura por capa.

### 4.2 GeometriaFactory-Web (`SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/08-Calidad-Y-Pruebas/Estrategia-Calidad.md`)

**Web (§3.1)**

| Gate | Condición | Carácter |
| --- | --- | --- |
| QG-01 | Construcción sin advertencias | Bloqueante |
| QG-02 | Bundle del visor generado en el mismo flujo | Bloqueante |
| QG-03 | El flujo termina comprobando la dirección pública | Bloqueante |
| QG-04 | 100 % del guion de la etapa y anteriores [ASUNCIÓN A-4, sólo en la forma] | Bloqueante |
| QG-05 | 0 peticiones del navegador al servicio de datos (RA-01) | Bloqueante |
| QG-06 | 1 sola salida al servicio (cliente tipado) | Bloqueante |
| QG-07 | 0 apariciones de la credencial de sesión en el navegador | Bloqueante |
| QG-08 | 0 mensajes con dirección, ruta o traza (RA-03) | Bloqueante |
| QG-09 | 0 invocaciones al interior del bundle; sólo las 6 funciones (RA-02) | Bloqueante |
| QG-10 | 0 tráfico de circuito al interactuar con la escena | Bloqueante |
| QG-11 | 61 filas de `Matriz-Sensado-Deriva.md` verificadas, sin deriva mayor | Bloqueante al cierre de etapa |
| QG-12 | Peso del documento ≤ 110 % de la línea base en 2 superficies y 4 cortes | Bloqueante; instrumento `tools/medicion-pintado-del-listado.sh` |

Ningún gate de Web es condicionado (§3.1). Divergencia: el `README.md` §5 de Web dice «once» gates; `Estrategia-Calidad.md` tiene `QG-12` (→ 19).

**Visor (§3.2)**: QG-01 bundle sin errores · QG-02 = PT-03 · QG-03 = PT-02 · QG-04 cero red (RA-02) · QG-05 cero persistencia · QG-06 superficie exacta de 6 funciones bajo 1 nombre global · QG-07 sin fallo silencioso (G-5) · QG-08 exactamente 7 códigos de condición · QG-09 bundle nunca editado a mano. Sin gate de cobertura de líneas por decisión del intake §17.2.P.6.

---

## 5. Puertas de etapa y transversales (`scripts/verify-*.sh`)

### 5.1 Biblioteca común

`scripts/lib-puerta.sh` (104 líneas): forma común `puerta_abre` / `criterio "<id> <texto>" <pruebas…>` / `puerta_cierra`, cada criterio nombra sus pruebas una por una. La usan `d`, `e`, `f`; `g` y `h` toman sólo `puerta_no_corrieron` (impide verde sin haber corrido lo nombrado; mesa 2026-09-14, R-24); `c` no la usa (levanta y reinicia los dos servicios).

### 5.2 Puertas de etapa (criterios de `Roadmap-Producto.md` §5.2)

| Guion | Transición | Criterios | Forma |
| --- | --- | --- | --- |
| `verify-stage-c.sh` (409 l.) | c → d | C-1 admin sólo en primer arranque · C-2 cambio de contraseña persiste entre reinicios · C-3 esquema sobre base inexistente · C-4 credencial no observable; + guardianes de `Web ADR-03` §2 en `Production`; + controles 3.a–3.d del guion propio autorizado | Servicios reales |
| `verify-stage-d.sh` | d → e | D-1..D-10 ciclo de vida de la cuenta | `lib-puerta` |
| `verify-stage-e.sh` | e → f | E-1..E-5 trabajo con dueño, estado e identificador | `lib-puerta` |
| `verify-stage-f.sh` | f → g | F-1..F-8 interpretación del texto real | `lib-puerta` |
| `verify-stage-g.sh` | g → h | G-1..G-7: tres figuras, 10 navegaciones, disposición estable, 0 red, sincronía por índice, G-6 el administrador ve lo mismo que el alumno (superficie servida, no escena; medido en la batería), movimientos de F-25 | Navegador en contenedor |
| `verify-stage-h.sh` | h → i | H-1..H-7 resolución del trabajo; H-7 (OK de las ocho fases) no mecánico | Mixta |
| `verify-stage-i.sh` (317 l.) | i → j… | I-1..I-6 despliegue real: contenedores sellados por túnel, servidor a servidor, PT-05, circuito sobre lo desplegado, esquema, puertas anteriores siguen pasando | Contra despliegue |

### 5.3 Transversales

| Guion | Qué garantiza |
| --- | --- |
| `verify-navigation.sh` | Etapa `b`, criterio 1: todas las rutas del mapa de navegación alcanzables |
| `verify-visual-system.sh` | Etapa `b`, criterio 2: sistema visual adoptado, sin estilos sueltos |
| `verify-propagacion.sh` | Dirección inversa de la propagación documental |
| `verify-solution-tree.sh` | Árbol de solución (DC-5) |
| `verify-viewer-lifecycle.sh` | Medición de PT-02 sobre el paquete construido con navegador real |
| `verify-explicit-configuration.sh` | Regla de configuración explícita del repositorio |

---

## 6. Puertas técnicas PT-01..PT-05

Definición y momento: `SDD/Docs/Producto/Pipeline-Producto.md` (tabla de puertas técnicas); detalle de PT-01 y PT-04: `SDD/Docs/Producto/Plan-Etapa-A.md` (filas 3–7 y su cierre).

| PT | Qué valida | Cuándo | Estado / medición | Fuente |
| --- | --- | --- | --- | --- |
| PT-01 (a–d) | Modelo de front: a dirección pública, b transporte medido (el anfitrión no ofrece WebSocket → long polling), c 20 min sin reciclar sesión + reconexión, d salud con datos reales | Etapa a | Cerrada en etapa a | `Plan-Etapa-A.md` |
| PT-02 | Visor embebido; 10 navegaciones sin degradación | Antes de etapa g | **PASA** | `SDD/Docs/Producto/Medicion-Puertas-Tecnicas-PT-02-PT-03.md` §3; `scripts/verify-viewer-lifecycle.sh` |
| PT-03 | Motor gráfico dentro del bundle, sin CDN | Antes de etapa g | **PASA** | Ídem §2 |
| PT-04 | Imagen del backend construye, arranca, migra base vacía y responde salud desde el devcontainer | Etapa a | Cerrada en etapa a | `Plan-Etapa-A.md` |
| PT-05 | Topología completa en despliegue real, medida desde la red de la facultad (RN-B1) | Etapa i | **Sin resultado**: §3 y §4 del documento dicen «A completar» | `SDD/Docs/Audit/Medicion-PT-05.md` |

Si PT-05 falla, la topología se revisa en la fase i (Medicion-PT-05 §4). Seguimiento del pendiente → 03.

---

## 7. Instrumentos de `tools/`

| Instrumento | Pregunta que contesta | Origen |
| --- | --- | --- |
| `informe-cobertura.cs` | Cobertura por proyecto, validador y pirámide (§3) | QG-03/04/06 |
| `barrido-cobertura-de-contrato.cs` | Condiciones que el dominio emite y la Api no nombra | Seis ramas defensivas inalcanzables halladas al azar hasta 2026-08-31 |
| `captura-de-superficies.mjs` | Evidencia visual de las superficies | PO 2026-09-01: «no vi resultados funcionando» |
| `medicion-volumen-de-comision.sh` | p50/p99 y peso del listado de la comisión en el servicio | Punto abierto `D5` |
| `medicion-pintado-del-listado.sh` + `.mjs` | Primera pintura, filtro y peso del documento en la pieza pública (QG-12 de Web) | Lo que la medición del servicio no contesta |
| `sonda-circuito-en-el-anfitrion.mjs` | ¿El circuito de tiempo real engancha en el anfitrión? | Botón aprobar inerte en somee, 2026-09-01 |
| `verificar-resolucion-del-trabajo.sh` + `.mjs` | Monta laboratorio efímero, siembra datos y aprieta «Aprobar» | 511 pruebas en verde con el botón inerte |
| `verificar-acuse-de-la-escena.mjs` | La pantalla no afirma un dibujo sin 3D | Peritaje 2026-09-02 |
| `verificar-aviso-de-reconexion.mjs` | Los cinco tramos del aviso de reconexión | `failed`/`rejected` sin mostrarse (2026-08-31) |
| `verificar-escena-al-cambiar-de-tamano.mjs` | `resize` del visor se invoca al cambiar el recuadro | `resize` exportado y nunca llamado |
| `verificar-primer-arranque.mjs` | `/aprovisionamiento-inicial` por pantalla | Nunca probado por pantalla |

### 7.1 Mediciones registradas

| Medición | Resultado | Fuente |
| --- | --- | --- |
| Volumen del servicio (2026-08-31) | 1002 trabajos / 334 alumnos: p99 12,3 ms vs umbral 500 ms; 257 KB; PASA en los cuatro cortes | `SDD/Docs/Audit/Medicion-Volumen-De-Comision-2026-08-31.md` §0 |
| Pintado del listado (2026-08-31) | 300 trabajos: 483 ms (cruza los 400 ms del wireframe); 1002: 1579 ms y 1,2 MB; la mitigación «esqueleto por fila» no existe bajo ese modo de render | `SDD/Docs/Audit/Medicion-Pintado-Del-Listado-2026-08-31.md` §0, §3 |
| PT-02 / PT-03 | Pasan | `SDD/Docs/Producto/Medicion-Puertas-Tecnicas-PT-02-PT-03.md` |
| PT-05 | Pendiente de registrar | `SDD/Docs/Audit/Medicion-PT-05.md` |

---

## 8. Documentos de calidad por unidad (`08-Calidad-Y-Pruebas/`)

| Documento | Api (líneas) | Web (líneas) | Contenido |
| --- | ---: | ---: | --- |
| `README.md` | 148 | 154 | Orden de lectura, gates resumidos, recuentos sostenidos |
| `Estrategia-Calidad.md` | 380 | 216 | Atributos priorizados, **QG vinculantes**, roles, cadencia (Api: 4 proyectos; Web: Web + Visor) |
| `Estrategia-Testing.md` | 630 | 333 | Pirámide, cobertura por capa, tooling, GWT, fixtures, datos, ambiente |
| `Plan-Pruebas.md` | 367 | 201 | Entrada/salida, riesgos, plan por etapa (Web: también por momento) |
| `Matriz-Cobertura-Pruebas.md` | 671 | 339 | Trazabilidad CU/NFR/RN/punto de acceso/invariante (Api) o restricción/garantía/código (Web) ↔ tests; huecos |
| `Matriz-Sensado-Deriva.md` | 269 | 300 | Sondas contra la línea base; Web: 62 sondas (61 de línea base + `SD-10062`), 211 elementos |
| `Criterios-Validacion.md` | 369 | 219 | Criterios funcionales, no funcionales, regresión, código; Web §7 puertas técnicas |
| `Casos-Prueba-Referenciales.md` | 1784 | 801 | Catálogo TC-xxxxx; Api 130 TC (TC-00 37, TC-02 27, TC-04 31, TC-06 35), Web 56 (TC-10 35, TC-12 21) |
| `Definition-Of-Done.md` | 335 | 181 | DoD por capa y excepciones |
| `Pruebas-Extremo-A-Extremo.md` | — | 204 | Suite E2E (§2.4) |
| `Guia-Testing-Extensibilidad.md` | — | 119 | Batería de aceptación de un reemplazo del visor y funciones nuevas de fachada |

Recuentos que cada unidad sostiene (CU, puntos de acceso, códigos, NFR, criterios): `README.md` §5 (Api) y §6 (Web).

Auditorías de la categoría 08 (contexto, no vinculantes): `SDD/Docs/Audit/E-08-Calidad-Siete-Proyectos-r1.md` y `-r2.md` (77 gates verificados en r2 §4) → detalle de auditorías en 16.

---

## 9. Lo no verificado en este índice

| Ítem | Estado |
| --- | --- |
| Casos ejecutados por batería (con `[InlineData]`/`TestCaseSource` expandidos) | No se corrió la batería; sólo conteo estático de atributos |
| Cobertura actual por proyecto | No se ejecutó `scripts/coverage.sh` sobre 5f07b12 |
| Verde de las puertas `verify-*` en 5f07b12 | No ejecutadas al indexar |
| Total «511 pruebas» citado en `tools/verificar-resolucion-del-trabajo.mjs` | Cifra histórica (2026-09-01); el conteo estático actual de métodos es 389 (67+54+240+28) |
