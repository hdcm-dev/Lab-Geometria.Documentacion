# 00 · Índice maestro — Fábrica de Geometría

> **Propósito:** dar la visión general del producto —qué es, cómo está compuesto, con qué stack y
> en qué estado— en una sola lectura, y repartir el resto del conocimiento entre los índices
> temáticos.
> **Fuente primaria:** `Lab-Geometria/SDD/Docs/README.md` **2.5** (2026-08-30) y
> `Lab-Geometria/AGENTS.md`, derivado de `SDD/Docs/Producto/11-Documentacion/Contrato-Agentes.md`.

---

## 1. Identidad del producto

**Fábrica de Geometría** es un laboratorio de la cátedra de Programación 2. El alumno pega el texto
JSON que emite su propio programa de la **Actividad 1**; el sistema lo interpreta, reconstruye las
figuras, señala las discrepancias entre lo **declarado** y lo **derivado**, y las dibuja en tres
dimensiones. El docente revisa y resuelve.

El problema que el producto vuelve visible: los **valores calculados que el programa del alumno
emite mal** en casos concretos y reproducibles. El producto los muestra como par
*valor declarado / valor derivado* sobre el trabajo del propio alumno.

La audiencia son **dos personas concretas del aula** —el alumno y el docente—. No hay integradores
externos, ni auditoría, ni clientes de terceros. Esa audiencia acotada explica buena parte de las
decisiones técnicas: una sola instancia, un solo curso, un solo administrador, sin versionado de
rutas y sin escalera de ambientes.

Detalle: `SDD/Docs/00-Contexto/Vision-Producto.md` y `SDD/Docs/00-Contexto/Alcance-Producto.md`.

---

## 2. Los dos ejes: entrega y construcción

El producto distingue lo que **se despliega** de lo que **se compila**. Confundirlos es el defecto
que el modelo de dos ejes existe para hacer imposible.

### 2.1 Eje de entrega — dos unidades

| Unidad de entrega | Tipo (D8) | Rol | Integra con |
| --- | --- | --- | --- |
| `GeometriaFactory-Api` (principal) | `rest-api` | Host en el servidor propio: puntos de acceso, credencial firmada, preparación del almacén al arrancar. Sostiene el dato, las reglas y la única base de datos | — |
| `GeometriaFactory-Web` | `web-monolith` | Front en el hosting público; único punto de contacto del navegador | `GeometriaFactory-Api`, por HTTP con credencial firmada, servidor a servidor |

Ninguna de las dos es `redistribuible`.

### 2.2 Eje de construcción — siete proyectos de código

| Proyecto | Identidad de código | Rol | Depende de |
| --- | --- | --- | --- |
| Api | `GeometriaFactory.Api` | Host REST: puntos de acceso, autenticación, composición de raíz | Application, Infrastructure, Contracts |
| Application | `GeometriaFactory.Application` | Casos de uso y los cuatro puertos | Domain |
| Domain | `GeometriaFactory.Domain` | Entidades e invariantes; centro de la regla de dependencias | — |
| Infrastructure | `GeometriaFactory.Infrastructure` | Adaptadores de los cuatro puertos, seguridad, validador de figuras | Application, Domain |
| Contracts | `GeometriaFactory.Contracts` | Tipos de transferencia. **Único proyecto compartido** | — |
| Web | `GeometriaFactory.Web` | Front: páginas y componentes. Hoja del grafo | Contracts, Visor |
| Visor | `geometriafactory-visor` | Bundle 3D; visualizador puro | — |

Seis se construyen con un solo comando en `GeometriaFactory.sln`. **El visor no está en la
solución**: es un proyecto Node independiente, y por eso su carpeta vive en la raíz (`visor/`) y no
bajo `src/`, para que las dos cadenas de herramientas no compartan raíz.

**La arista `Web → Api` es de integración y no de compilación**: el front llama al servicio de datos
en ejecución y no lo referencia al compilar. Las aristas de compilación son **ocho**, de dos clases:
siete referencias de proyecto y `Visor → Web`, el bundle que copia `scripts/build-visor.sh`
(cerrado el 2026-08-31 en `SDD/Docs/Producto/Vista-Producto.md` §3.1).

### 2.3 Las tres reglas de arquitectura de nivel producto

| Regla | Qué exige |
| --- | --- |
| `RA-01` | Ningún guion del navegador invoca el servicio de datos |
| `RA-02` | El bundle del visor es un visualizador puro: sin red, sin configuración y sin identidad |
| `RA-03` | Todo lo que el navegador obtiene del backend pasa por el front, y ningún mensaje expone la dirección de un servicio interno |

Se derivan de una restricción de red del intake §14 y no de una preferencia de estilo.

---

## 3. Stack por proyecto

| Proyecto | Stack | Dónde ejecuta |
| --- | --- | --- |
| Api | ASP.NET Core sobre .NET 10, credencial firmada (JWT) | Linux en contenedor, servidor propio |
| Web | ASP.NET Core sobre .NET 10, Blazor Interactive Server | Hosting público gratuito |
| Domain | C# sobre .NET 10, **sin dependencias** | Embebido |
| Application | C# sobre .NET 10, dependencia única del dominio | Embebido |
| Infrastructure | C# sobre .NET 10 con EF Core sobre SQLite | Embebido en el servicio de datos |
| Contracts | C# sobre .NET 10, tipos planos sin dependencias | En **los dos** procesos desplegables |
| Visor | TypeScript transpilado con webpack; el motor de dibujo entra en el bundle | El navegador, con capacidad 3D |

Paquetes anclados (verificado en los `.csproj`): `Microsoft.EntityFrameworkCore.Sqlite` **10.0.11**,
`Microsoft.AspNetCore.Authentication.JwtBearer` **10.0.11**, `Microsoft.AspNetCore.OpenApi`
**10.0.11**, `Microsoft.IdentityModel.JsonWebTokens` **8.22.0**, `Scalar.AspNetCore` **2.16.20**;
en el visor, `three` **0.169.0**, `webpack` **5.95.0**, `typescript` **5.6.3**.

---

## 4. Estado al 2026-08-31

### 4.1 Construcción — nueve etapas

| Etapa | Qué entregó | Estado |
| --- | --- | --- |
| `a` · Andamiaje | Esqueleto ambulante de las dos piezas, con `PT-01` y `PT-04` medidas | Cerrada |
| `b` · Cáscara pública | Las once superficies alcanzables y el sistema visual portado | Cerrada |
| `c` · Administrador | Identidad del administrador, sesión y cambio de contraseña, persistidos | Cerrada |
| `d` · Cuenta del alumno | Registro, habilitación con provisoria, primer ingreso y reseteo | Cerrada |
| `e` · Trabajos | Alta, listado, reedición, eliminación y el listado de la comisión | Cerrada |
| `f` · Interpretación | Interpretación del texto, batería obligatoria de diez casos, envío como única acción de guardado | Cerrada |
| `g` · Visualización 3D | Dibujo de las piezas reconstruidas y árbol del texto | Cerrada |
| `h` · Revisión | Aprobación y rechazo con comentario, y el desenlace visible para el alumno | Cerrada |
| `i` · Despliegue real | Su puerta está escrita (`scripts/verify-stage-i.sh`, siete criterios) y **la fase no ocurrió**; `Audit/Medicion-PT-05.md` en `SIN MEDIR` | **Planificada, no ejecutada** |

**La única fuente del avance es `changelog.md`** más el historial del repositorio. Cuando el
registro y el historial no coinciden, **gana el historial**.

### 4.2 Documentación

Todas las categorías están **Aprobadas** salvo dos: `04-Prompts-AI`, **omitida por gating**
(ninguna unidad usa modelos de lenguaje), y `11-Documentacion`, en estado **Planificado** en los
tres ámbitos. El árbol atravesó seis migraciones normativas cerradas y la séptima (10.0 → 13.3)
está en curso; los informes viven en `SDD/Docs/Audit/`.

---

## 5. Puertas y umbrales que condicionan todo cambio

| Puerta | Qué exige | Instrumento |
| --- | --- | --- |
| `QG-01` | La construcción termina en 0 **y sin advertencias** | `Directory.Build.props` (`TreatWarningsAsErrors`) + `scripts/build.sh` |
| `QG-02` | La batería pasa entera, 0 rojas y 0 deshabilitadas sin motivo escrito | `scripts/test.sh` |
| `QG-03` | Cobertura de líneas y ramas por proyecto, contra los umbrales del intake §22 | `scripts/coverage.sh` |
| `QG-04` | Reparto de la pirámide: 60 % integración / 40 % unitarias | `scripts/coverage.sh` |
| `PT-01` a `PT-05` | Puertas técnicas de viabilidad; una puerta que no pasa **detiene** lo que depende de ella | ver [`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) |

`coverage.sh` sale **0** si las dos puertas pasan, **1** si alguna no pasa y **2** si **no se pudo
medir**. **El `2` no es aprobación.**

---

## 6. Convenciones que gobiernan cualquier cambio

- **Identificadores de código en inglés; texto para personas en castellano.** La fuente de nombres
  es `SDD/Docs/Producto/Norma-De-Nomenclatura.md` §6: un concepto que no está en la tabla **se
  agrega primero**, no se traduce por criterio propio.
- **Códigos de condición** en inglés, sin prefijo `CONTRATO_`, declarados en su catálogo. No se
  acuña uno nuevo sin agregarlo.
- **Comentarios: el porqué, no el qué.** Los que dicen «esto se probó y falló» se conservan.
- **Commits**: título en una línea; cuerpo con qué se decidió y con qué fundamento, sin acentos.
- **Una unidad de trabajo por pull request.**
- **Antes de cerrar un cambio**: `build.sh` (0 y sin advertencias) → `test.sh` (0) → `coverage.sh`
  (0) → `git status --short`; y si el cambio toca una etapa con puerta propia, además
  `scripts/verify-stage-<letra>.sh`.
- **Si el entorno se resistió** —un puerto, un permiso, una herramienta ausente—, la eventualidad va
  a `SDD/Docs/Producto/11-Documentacion/Bitacora-Eventualidades.md` **con lo que se probó y no
  funcionó**.

---

## 7. Mapa de índices

| Índice | Dominio |
| --- | --- |
| [`01_Corpus-Documental-SDD.md`](01_Corpus-Documental-SDD.md) | La estructura del corpus `SDD/` y qué gobierna cada categoría |
| [`02_Arquitectura-Y-Proyectos.md`](02_Arquitectura-Y-Proyectos.md) | Capas, carpetas de `src/`, grafo de dependencias |
| [`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md) | Entidades, conjuntos cerrados, casos de uso, reglas `RN` y necesidades `NB` |
| [`04_Superficie-HTTP-Y-Contratos.md`](04_Superficie-HTTP-Y-Contratos.md) | Rutas, DTOs, códigos de error, traducción de motivos |
| [`05_Front-Web-Y-Visor-3D.md`](05_Front-Web-Y-Visor-3D.md) | Superficies, guardianes, sesión y la fachada de seis funciones del visor |
| [`06_Persistencia-Y-Seguridad.md`](06_Persistencia-Y-Seguridad.md) | EF Core, migraciones, almacén, firma y derivación de credenciales |
| [`07_Pruebas-Y-Puertas-De-Calidad.md`](07_Pruebas-Y-Puertas-De-Calidad.md) | Las tres baterías, cobertura y las puertas de etapa |
| [`08_DevOps-Construccion-Y-Despliegue.md`](08_DevOps-Construccion-Y-Despliegue.md) | Guiones, contenedores, canalización y publicación |
| [`09_Samples-Ejecutables.md`](09_Samples-Ejecutables.md) | Los ejemplos por proyecto y nivel |
| [`10_Glosario-Y-Nomenclatura.md`](10_Glosario-Y-Nomenclatura.md) | Términos del dominio y la norma de nombres |
| [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md) | ADRs, auditorías, bitácora y lo que queda abierto |
| [`12_Observaciones-Del-Indexado.md`](12_Observaciones-Del-Indexado.md) | Qué se verificó y qué divergencias quedaron a la vista |
