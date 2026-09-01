# 01 · Corpus documental `SDD/`

> **Propósito:** decir dónde vive cada documento del corpus que gobierna el repositorio y qué
> gobierna cada categoría, para poder abrir **una** fuente en vez de recorrer 1.143 archivos.
> **Fuente primaria:** el árbol de `Lab-Geometria/SDD/` y `SDD/Docs/README.md` §4.

---

## 1. Por qué el corpus manda

**El repositorio no es sólo código.** `SDD/Docs/` es el corpus que lo gobierna y tiene sus propias
reglas: cada documento declara su versión, su estado, su autor, su **trazabilidad upstream** (de qué
documentos deriva) y su **downstream** (a quiénes alimenta). Un cambio de código que contradice al
corpus **no gana por ser código**: o se corrige el código, o el desalineamiento se eleva.

**Recuento** (medido el 2026-08-31): **538** archivos vigentes y **605** en carpetas `_legacy/`.
El `_legacy/` es registro histórico versionado por fecha — se lee, **no se reescribe**.

---

## 2. Mapa de primer nivel

```
SDD/
├── Intake/          Documentos HUMANOS. Se leen, no se corrigen; lo desalineado se ELEVA
│   ├── PRODUCT-INTAKE-Fabrica-De-Geometria.md      El pedido original y sus §§ citados por todo el corpus
│   └── PRODUCT-MANIFEST-Fabrica-De-Geometria.md    Composición del producto: unidades y proyectos
├── Docs/
│   ├── README.md                    Punto de entrada del corpus (v2.5, 2026-08-30)
│   ├── Handoff-Checkout.md          Traspaso entre sesiones/agentes
│   ├── 00-Contexto/                 Visión, alcance, roadmap, compatibilidad de plataformas
│   ├── 01-Necesidades-Negocio/      Las nueve necesidades NB-00001 a NB-00009
│   ├── Producto/                    Nivel producto: vista, pipeline, norma de nombres, ADRs, contratos inter-unidad
│   ├── Audit/                       104 informes de auditoría, migración, mesas y mediciones
│   └── Unidades-Entrega/            Categorías 02 a 11 de las DOS unidades de entrega
└── Maquetas/GeometriaFactory-Web/   Maqueta HTML validada del front (13 archivos + assets)
```

---

## 3. Nivel producto — `SDD/Docs/`

| Documento | Qué fija |
| --- | --- |
| `00-Contexto/Vision-Producto.md` | Identidad, problema, audiencia y glosario del dominio del cliente (§9) |
| `00-Contexto/Alcance-Producto.md` | Qué entra y qué no entra al producto |
| `00-Contexto/Roadmap-Producto.md` | **Única fuente del roadmap**: las nueve etapas y sus criterios de transición (§5.2), y la regla de puertas (§2.2) |
| `00-Contexto/Compatibilidad-Plataformas.md` | Matriz de plataformas y capacidades del navegador |
| `01-Necesidades-Negocio/` | Las nueve `NB-0000X`, una por archivo, más su documento madre |
| `Producto/Vista-Producto.md` | Mapa de proyectos, grafo de dependencias, contratos inter-proyecto, riesgos de integración |
| `Producto/Pipeline-Producto.md` | Orden de construcción, matriz de build, versionado, rollback coordinado |
| `Producto/Norma-De-Nomenclatura.md` | La norma de nombres y su glosario de diecisiete tablas (§6) |
| `Producto/Plan-Etapa-A.md` | El árbol de archivos exacto de la etapa `a` y sus apartamientos declarados |
| `Producto/Medicion-Puertas-Tecnicas-PT-02-PT-03.md` | Medición de `PT-02` y `PT-03`: **las dos pasan** |
| `Producto/Adrs/` | **13 ADR de nivel producto**: familias `ADR-080XX` (contratos y frontera) y `ADR-140XX` (migración y despliegue) |
| `Producto/Contratos-Inter-Unidad/` | **8 contratos `CU-080XX`** que cruzan la frontera entre las dos unidades, más `Contratos-Abstractions.md` |
| `Producto/11-Documentacion/Contrato-Agentes.md` | **Fuente de `AGENTS.md`**, que es derivado y no se edita |
| `Producto/11-Documentacion/Bitacora-Eventualidades.md` | Las **ocho** eventualidades `EVE-0000X` del entorno, con lo que se probó y no funcionó |

---

## 4. Nivel unidad de entrega — `SDD/Docs/Unidades-Entrega/<unidad>/`

Las dos unidades comparten la misma numeración de categorías. `04-Prompts-AI` está **omitida por
gating** en las dos.

| Categoría | `GeometriaFactory-Api` | `GeometriaFactory-Web` |
| --- | --- | --- |
| `02-Especificacion-Funcional` | 9 casos de uso `CU-000XX`, 16 reglas `RN-020XX`, 7 reglas conceptuales de modelo `RC-060XX`, modelo de dominio, superficie HTTP, contrato del validador | 10 casos de uso `CU-100XX`, contrato de fachada, glosario funcional |
| `03-UX-UI-DX` | Onboarding, DX, mensajes de error, glosario UX | Línea base visual, 11 wireframes, 3 representaciones, bitácora de validación de maqueta |
| `05-Arquitectura-Tecnica` | **27 ADR** (`ADR-000XX` Api, `ADR-020XX` Domain, `ADR-040XX` Application, `ADR-060XX` Infrastructure), 14 operaciones internas, `Contratos-REST.md`, modelo de datos lógico, flujo de ejecución | **13 ADR** (`ADR-100XX` Web, `ADR-120XX` Visor), 7 casos del contrato del visor `CU-120XX`, extensibilidad |
| `06-Backlog-Tecnico` | **228** historias de usuario | **60** historias de usuario |
| `07-Plan-Sprint` | Mini-plan | Mini-plan |
| `08-Calidad-Y-Pruebas` | Estrategia, plan, matriz de cobertura, matriz de sensado de deriva, DoD | Ídem, más guía de testing de extensibilidad |
| `09-Devops` | Entornos, versionado, publicación de imagen Docker, pipeline, cadena de suministro | Entornos, versionado, publicación del bundle del visor y del front por FTP, pipeline |
| `10-Examples` | 13 ejemplos + el caso de la colección de peticiones reproducible | 4 ejemplos |
| `11-Documentacion` | Sólo `README.md` — categoría **planificada** | Sólo `README.md` — categoría **planificada** |

---

## 5. Familias de identificadores del corpus

| Prefijo | Qué identifica | Dónde vive |
| --- | --- | --- |
| `NB-0000X` | Necesidad de negocio (nueve) | `01-Necesidades-Negocio/Necesidades-De-Negocio/` |
| `CU-000XX` / `CU-100XX` | Caso de uso de la unidad `Api` / de la unidad `Web` | `02-Especificacion-Funcional/Casos-De-Uso/` |
| `CU-060XX` / `CU-120XX` | Operación interna del servicio / caso del contrato del visor | `05-Arquitectura-Tecnica/` |
| `CU-080XX` | Contrato inter-unidad | `Producto/Contratos-Inter-Unidad/` |
| `RN-020XX` | Regla de negocio (dieciséis) | `02-Especificacion-Funcional/Reglas-De-Negocio/` |
| `RC-060XX` | Regla conceptual de modelo (siete) | `02-Especificacion-Funcional/Modelo-Datos/` |
| `ADR-XXXXX` | Decisión de arquitectura; el primer par de dígitos identifica el ámbito | `Adrs/` de producto y de cada unidad |
| `US-XX`, `BT-XX` | Historia de usuario y ítem de backlog técnico | `06-Backlog-Tecnico/` |
| `QG-0X`, `PT-0X` | Puerta de calidad y puerta técnica | `08-Calidad-Y-Pruebas/` y el roadmap |
| `EVE-0000X` | Eventualidad del entorno | `Producto/11-Documentacion/Bitacora-Eventualidades.md` |
| `AG-000XX` | Rol de agente responsable de una categoría | `Contrato-Agentes.md` |
| `E-1` a `E-8` | Escenario de datos del intake, usado como material de prueba | Intake §18 y `tests/.../Scenarios.cs` |

**El ancho de cinco dígitos de la familia `AG` viene de la migración 10.0 → 13.3** (`AG-00` →
`AG-00000`); la forma anterior se lee al revés para reconocerla en documentos viejos.

---

## 6. Cómo leer el corpus sin recorrerlo entero

1. Arrancá por `SDD/Docs/README.md` §4 (mapa) y §7 (estado).
2. Para una capacidad concreta, buscá su **caso de uso** en la categoría 02 de su unidad; el caso
   nombra las reglas `RN` y los contratos que lo alcanzan.
3. Para el **por qué** de una forma técnica, buscá el ADR de su ámbito en la categoría 05.
4. Para saber **si algo ya se decidió**, mirá `Audit/A3-Decisiones-Del-Product-Owner.md` y las
   mesas de evaluación — ver [`11_Decisiones-Auditorias-Y-Pendientes.md`](11_Decisiones-Auditorias-Y-Pendientes.md).
5. Para el estado real del código, `changelog.md` y el historial; **no** el README, que publica el
   resultado y no lo replica.
