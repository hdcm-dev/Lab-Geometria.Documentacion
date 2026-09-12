# 01 · El corpus documental `SDD/` — dónde vive cada cosa y qué gobierna

> **Propósito.** Que un agente encuentre el documento que decide algo sin recorrer 542 archivos.
> Este índice **no resume el contenido de los documentos**: dice dónde están y qué autoridad
> tiene cada uno.
> **Fuente primaria.** `SDD/README.md`, `SDD/Docs/README.md` 2.5 §4, y el árbol de `SDD/` en la
> revisión `89f3ab3`, contado el 2026-09-11.

---

## 1. Cómo está partido el corpus

`SDD/` son los artefactos del **Framework SDD**; el framework mismo vive en `IA/IA.SDD` y **no se
copia acá**: las reglas, plantillas y master-prompts se leen desde allá.

```text
SDD/
├── Intake/          ← Los dos documentos de entrada: el intake y el manifiesto derivado
├── Maquetas/        ← Once maquetas HTML de validación visual del front (Fase B2) + assets
└── Docs/            ← Todo lo generado: producto, unidades de entrega y auditoría
    ├── 00-Contexto/               visión, alcance, roadmap, compatibilidad
    ├── 01-Necesidades-Negocio/    NB-00001 a NB-00009
    ├── Producto/                  vista, pipeline, norma de nombres, ADR de producto
    ├── Audit/                     107 informes: fases, migraciones, mesas, mediciones
    └── Unidades-Entrega/
        ├── GeometriaFactory-Api/  categorías 02, 03, 05, 06, 07, 08, 09, 10, 11
        └── GeometriaFactory-Web/  las mismas nueve
```

**El árbol cuelga de la unidad de entrega y no del proyecto de código** desde la migración 6.0 →
8.6. Los siete proyectos de código **no tienen árbol documental propio**: su contenido está
consolidado dentro de la unidad que componen, con una subsección por proyecto.

**`_legacy/` es registro histórico y no se reescribe.** De los 1.147 archivos de `SDD/`, **542
están vivos** y los otros 605 son emisiones archivadas. Todo lo que este índice nombra es vivo.

**La categoría `04-Prompts-AI` no existe en ninguna unidad**: ningún proyecto usa modelos de
lenguaje y la omisión está declarada en el manifiesto (`Docs/README.md` §4).

## 2. La entrada: el intake y el manifiesto

| Documento | Qué es | Quién lo escribe |
| --- | --- | --- |
| `Intake/PRODUCT-INTAKE-Fabrica-De-Geometria.md` | **El documento humano de entrada.** Declara el problema, las restricciones, las nueve invariantes (§14), los ocho escenarios de datos (§20) y los umbrales de asunción (§22) | El Product Owner, asistido por agente |
| `Intake/PRODUCT-MANIFEST-Fabrica-De-Geometria.md` | La composición derivada: las dos unidades, los siete proyectos, el grafo y las validaciones bloqueantes | El orquestador, con confirmación humana |

**Los dos son documento humano en el sentido operativo: lo desalineado se eleva, no se corrige**
(`AGENTS.md`, tabla de límites).

## 3. Nivel producto

| Ruta | Qué gobierna |
| --- | --- |
| `Docs/README.md` **2.5** | README raíz del producto: identidad, dos ejes, estado por categoría y por etapa, **y §8, «lo que todavía no está decidido»** |
| `Docs/Producto/Vista-Producto.md` **1.9** | El mapa que ninguna categoría `05` puede dar sola: proyectos, **grafo de dependencias**, los seis contratos de frontera, lo transversal y los riesgos de integración. **Referencia, no reescribe** |
| `Docs/Producto/Pipeline-Producto.md` | Orden de construcción y de salida del producto entero; §3.1 fija la regla de configuración explícita |
| `Docs/Producto/Plan-Etapa-A.md` | El plan del andamiaje, y donde se declara el apartamiento `AP-01` (`Directory.Build.props` compartido) |
| `Docs/Producto/Norma-De-Nomenclatura.md` | **La fuente de nombres.** Ver [`10_Glosario-Y-Nomenclatura.md`](10_Glosario-Y-Nomenclatura.md) |
| `Docs/Producto/Medicion-Puertas-Tecnicas-PT-02-PT-03.md` | Las dos puertas técnicas medidas sobre el bundle del visor |
| `Docs/Producto/Adrs/` (13) | Las ADR de frontera: `ADR-08001` a `ADR-08008` (contratos compartidos) y `ADR-14001` a `ADR-14005` (migración y nomenclatura) |
| `Docs/Producto/Contratos-Inter-Unidad/` (10) | `Contratos-Abstractions.md`, `README.md` y los ocho contratos `CU-08001` a `CU-08008` que cruzan entre las dos unidades |
| `Docs/Producto/11-Documentacion/` (3) | `README.md` (plan documental), `Contrato-Agentes.md` —**del que se regenera `AGENTS.md`**— y `Bitacora-Eventualidades.md` |
| `Docs/00-Contexto/` (5) | `Vision-Producto.md`, `Alcance-Producto.md`, `Roadmap-Producto.md` —**única fuente del roadmap**—, `Compatibilidad-Plataformas.md` y su `README.md` |
| `Docs/01-Necesidades-Negocio/` | Las nueve necesidades `NB-00001` a `NB-00009` |
| `Docs/Handoff-Checkout.md` | El traspaso: qué queda hecho, qué queda con salvedad |

## 4. `GeometriaFactory-Api` — la unidad del servicio de datos

| Categoría | Documentos que más se consultan |
| --- | --- |
| `02-Especificacion-Funcional` | `Definicion-Superficie-HTTP.md` (**la superficie se decide acá**), `Definicion-Modelo-De-Dominio.md`, `Definicion-Contrato-Del-Validador-De-Figuras.md`, `Glosario-Funcional.md`, `Especificacion-Funcional.md` |
| `02/Casos-De-Uso/` (9 de los 23 de la unidad) | `CU-00021` a `CU-00029`: alta de cuenta, ingreso, gobierno de cuentas, reseteo, configuración del administrador, envío, eliminación, listado y detalle, desenlace |
| `02/Reglas-De-Negocio/` (16) | `RN-02001` a `RN-02016` — ver [`03_Dominio-Y-Reglas-De-Negocio.md`](03_Dominio-Y-Reglas-De-Negocio.md) |
| `02/Modelo-Datos/` | `Modelo-Conceptual.md` y `reglas-conceptuales-de-modelo/` |
| `03-UX-UI-DX` (5) | `DX-Error-Messages.md` §1.4 es **el único lugar donde `RA-03` se puede violar hacia afuera**; `DX-Developer-Experience.md`, `Guia-Onboarding-Developer.md`, `Glosario-UX.md` |
| `05-Arquitectura-Tecnica` | `Arquitectura-Unidad-Entrega.md`, **`Contratos-REST.md` 1.5** (los diecisiete puntos de acceso), `Contratos-Abstractions.md`, `Modelo-Datos-Logico.md`, `Flujo-Ejecucion.md`, `Decisiones-Arquitectura.md` |
| `05/Adrs/` (27) | Bloques `000xx` Api (8), `020xx` Domain (6), `040xx` Application (6), `060xx` Infrastructure (7) |
| `05/Operaciones-Internas/` (13 CU) | Los casos de uso que no son de la superficie: `CU-00009` a `CU-00011` (traducción, composición, arranque) y `CU-06001` a `CU-06010` (interpretación, verificación de valores, almacén, seguridad, reloj, preparación) |
| `06-Backlog-Tecnico` | 114 historias `US-000xx`, más `Backlog-Tecnico.md`, `Product-Backlog.md` y `Definition-Of-Ready.md` |
| `08-Calidad-Y-Pruebas` (9) | `Estrategia-Calidad.md`, `Estrategia-Testing.md`, `Criterios-Validacion.md` (**`CV-00002`, la batería obligatoria de diez casos**), `Matriz-Cobertura-Pruebas.md`, `Matriz-Sensado-Deriva.md`, `Plan-Pruebas.md`, `Casos-Prueba-Referenciales.md`, `Definition-Of-Done.md` |
| `09-Devops` (6) | `Pipeline-CI-CD.md`, `Entornos-Deploy.md`, `Estrategia-Versionado.md`, `Guia-Publicacion-Image-Docker.md`, `Supply-Chain-Seguridad.md` |
| `10-Examples` (14) | Los doce documentos `ejemplo-NN-<nivel>-<capa>.md` y `CU-00012`, el de la colección reproducible |
| `11-Documentacion` (1) | Sólo el `README.md` con el plan: la categoría está **planificada**, no emitida |

## 5. `GeometriaFactory-Web` — la unidad del front

| Categoría | Documentos que más se consultan |
| --- | --- |
| `02-Especificacion-Funcional` | `Definicion-Contrato-De-Fachada.md` (las seis funciones del visor), `Glosario-Funcional.md`, `Especificacion-Funcional.md` |
| `02/Casos-De-Uso/` (10) | `CU-10001` a `CU-10010`, de registrar la cuenta a sostener el estado degradado |
| `03-UX-UI-DX` (23) | **`Experiencia-De-Uso.md` es el documento que las mesas de UX citan**; `Linea-Base-Visual.md`, `Glosario-UX.md`, `Contrato-Datos-Maqueta.md`, `Bitacora-Validacion-Maqueta.md`, once `Wireframes-*.md` y tres `Representacion-*.md` |
| `05-Arquitectura-Tecnica` | `Arquitectura-Unidad-Entrega.md`, `Contratos-Abstractions.md`, `Extensibilidad.md` (**el único punto de extensión declarado del producto**), `Flujo-Ejecucion.md`, `Decisiones-Arquitectura.md` |
| `05/Adrs/` (13) | Bloque `100xx` Web (7) y `120xx` Visor (6) |
| `05/Contrato-Componente-Visor/` (7 CU) | El contrato del bundle, aislado de su anfitrión: `CU-12001` a `CU-12007` de la fachada más su índice |
| `06-Backlog-Tecnico` | 30 historias |
| `08-Calidad-Y-Pruebas` (11) | Incluye `Pruebas-Extremo-A-Extremo.md` y `Guia-Testing-Extensibilidad.md` |
| `09-Devops` (7) | `Guia-Publicacion-Front-Ftp.md` y `Guia-Publicacion-Bundle-Visor.md`, más los cinco comunes. **Ninguno describe la imagen `deploy/Dockerfile.web`** (O-9 del índice 12) |
| `10-Examples` (5) | Cuatro ejemplos, uno de ellos el de datos seed |
| `11-Documentacion` (1) | Sólo el `README.md` con el plan |

**`SDD/Maquetas/GeometriaFactory-Web/`** guarda las once maquetas HTML aprobadas en la Fase B2.
`verify-visual-system.sh` control `C-4` exige que **los tokens de la maqueta y los del producto
digan exactamente lo mismo**, así que la maqueta no es decorado: es instrumento de una puerta.

## 6. `Docs/Audit/` — 107 informes, en seis familias

| Familia | Qué contiene |
| --- | --- |
| Fases `A`, `B`, `B2`, `C`, `D`, `E`, `F`, `G`, `H`, `I` | El informe que cierra cada fase de especificación, con su dictamen y sus rondas `-rN` |
| `Informe-Migracion-*` / `Plan-Migracion-*` | Las siete migraciones normativas del framework, de 6.0 → 8.6 a 10.0 → 13.3, más los registros `Migracion-*.json` de reconexión de citas |
| `Mesa-*` | Las mesas de evaluación convocadas por condición: `2026-08-27`, `08-29`, `08-31`, `08-31-B`, `09-01-C`, `09-02` |
| `Medicion-*` / `Inventario-*` | Mediciones puntuales y barridos: `PT-05`, pintado del listado, volumen de comisión, marcas `[A VERIFICAR]`, renombre `F03`, renumerado `R-4` |
| `Observacion-*` | Observaciones elevadas al framework, no al producto |
| `Estado-Del-Destino-*` | Los contrastes de estado que hizo el orquestador al reanudar |

Además: `A3-Decisiones-Del-Product-Owner.md`, `D1-Confirmacion-De-Asunciones.md`,
`Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md`, `Plan-Mejora-Integral-2026-08-31.md`,
`Reporte-Hallazgos-De-Los-Samples-2026-08-30.md`, `Reporte-Despliegue-Somee.md` y
`Evaluacion-Del-Codigo-2026-08-27.md`. El detalle de qué decidió cada uno está en
[`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).

## 7. Cómo leerlo, por intención

| Quiero… | Abro |
| --- | --- |
| entender el producto entero antes de tocar una parte | `Docs/README.md` → `Docs/Producto/Vista-Producto.md` |
| la superficie HTTP exacta | `Api/05-Arquitectura-Tecnica/Contratos-REST.md` |
| saber cómo se nombra algo antes de escribirlo | `Producto/Norma-De-Nomenclatura.md` §6 |
| saber si el entorno ya le falló a alguien | `Producto/11-Documentacion/Bitacora-Eventualidades.md` |
| el avance real de la construcción | `changelog.md`, en la raíz del repositorio de código — y `git log` cuando el changelog calla |
| qué queda abierto | `Docs/README.md` §8 y `Audit/Fase-i-Que-Contesta-Y-Que-No-2026-08-31.md` |

**Ningún rol debería empezar por la categoría de un proyecto de código suelto**: son siete y se
condicionan entre sí, y la mayoría de los defectos que la propia auditoría del producto registró
nacieron de leer una parte y afirmar algo del todo (`Docs/README.md` §5).
