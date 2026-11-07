# 10 · Visor 3D: fachada, bundle TypeScript/three.js y su verificación

> **Propósito:** ubicar el proyecto de código `visor/` (fachada, contrato de tipos, capa de dibujo), su contrato de fachada y los casos de uso CU-12001..12007, cómo se genera y entrega el bundle, y sus bancos de verificación propios.
> **Fuente primaria:** `visor/src/` (código) y `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/02-Especificacion-Funcional/Definicion-Contrato-De-Fachada.md` (contrato).
> **Revisión:** Lab-Geometria `main` 5f07b12 · ia-db 4.0 · 2026-11-01.
> **No cubre:** las ADR 12001..12006 y 10008 como decisiones → `15_Decisiones-ADR.md`; la puerta `verify-viewer-lifecycle` y las mediciones PT-02/PT-03 → `11_Pruebas-Puertas-Y-Calidad.md`; las pantallas que embeben el visor → `09_Front-Web-Y-Experiencia-De-Uso.md`; el lugar del visor en el grafo de proyectos → `04_Arquitectura-Y-Proyectos.md`.

---

## 1. Árbol del proyecto `visor/` (archivos versionados)

```
visor/
├── geometriafactory-visor.csproj   # nodo de solución INERTE (SDK NoTargets): lista fuentes por glob, no construye
├── package.json                    # scripts build / build:dev / typecheck; única dependencia: three 0.169.0
├── package-lock.json               # bloqueo para `npm ci` reproducible
├── tsconfig.json                   # ES2020, strict, declaration, sourceMap, outDir dist/
├── webpack.config.js               # biblioteca en window.GeometriaFactoryViewer, sin externals, presupuesto 560 KiB
├── src/
│   ├── main.ts                     # capa 2: fachada pública (6 funciones + liveInstanceCount)
│   ├── contract.ts                 # tipos que cruzan la frontera (Piece, DrawOutcome, ViewerOptions, MotionOptions)
│   └── viewer/                     # capa 3: dibujo tridimensional
│       ├── README.md               # por qué la carpeta se llama viewer/ (Norma §6.11)
│       ├── instance.ts             # ViewerInstance: renderer, escena, cámara, disposición, selección, movimiento, liberación
│       ├── meshes.ts               # meshFor(): malla o motivo, por tipo de figura
│       └── palette.ts              # colores leídos de tokens CSS con respaldo
└── verification/                   # bancos de medición sobre el bundle construido (no superficie del producto)
    ├── lifecycle.html / .mjs       # PT-02: 10 ciclos crear/liberar
    └── stage-g.html / .mjs         # criterios de la transición g → h que sólo ve un navegador
```

Fuente: `git ls-files visor` (15 archivos). `dist/` y `node_modules/` no están versionados.

## 2. Capas del visor

| Capa | Dónde | Responsabilidad | Fuente |
| --- | --- | --- | --- |
| 1 · Anfitrión | Front Blazor (fuera de `visor/`) | Invoca la fachada, dibuja controles, consulta movimiento reducido del sistema | `Definicion-Contrato-De-Fachada.md` §3.3; pantallas → índice 09 |
| 2 · Fachada | `visor/src/main.ts` | Valida argumentos, resuelve la instancia por id, delega; no dibuja | `visor/src/main.ts` (encabezado) |
| 3 · Dibujo | `visor/src/viewer/` | Mallas, escena, cámara, bucle de animación | `visor/src/viewer/instance.ts`, `meshes.ts`, `palette.ts` |

Regla transversal declarada en el código: el bundle **no hace red, no tiene identidad y no lee configuración** (RA-02); la única dependencia es three.js empaquetado (PT-03). Fuente: `visor/src/main.ts`.

## 3. Fachada pública (`visor/src/main.ts`)

Expuesta como `window.GeometriaFactoryViewer` (`visor/webpack.config.js`, `library.type: 'window'`). Las instancias viven en un `Map<string, ViewerInstance>`; ids `visor-N` correlativos.

| Función (código) | Nombre en el contrato | Firma real | Devuelve | CU | Fuente contrato |
| --- | --- | --- | --- | --- | --- |
| `initialize` | `inicializar` | `(element: HTMLElement, options?: ViewerOptions)` | id `string`; `''` si falla | CU-12001 | §4.1 |
| `loadPieces` | `cargarPiezas` | `(id, pieces: readonly Piece[])` | `DrawOutcome { drawn, undrawn }` | CU-12002 | §4.2 |
| `selectPiece` | `seleccionarPieza` | `(id, index: number)` | `void` | CU-12003 | §4.3 |
| `resize` | `redimensionar` | `(id)` | `void` | CU-12004 | §4.4 |
| `destroy` | `destruir` | `(id)` | `void` | CU-12005 | §4.5 |
| `setMotion` | `establecerMovimiento` | `(id, options: MotionOptions)` | `void` | CU-12007 | §4.6 |
| `liveInstanceCount` | — (no es superficie) | `()` | `number` | — | instrumento de PT-02, no séptima función (`visor/src/main.ts`) |

Notas del código:
- `loadPieces` se llamaba `loadJson` y recibía el texto; cambió el 2026-08-16 por ADR-08006 (recibe piezas ya reconstruidas). Fuente: `visor/src/main.ts`.
- **Los errores se devuelven y no se lanzan**: `console.warn('[visor] <función>: <CÓDIGO>')`. Fuente: `visor/src/main.ts` (`report`).
- `destroy` dos veces sobre la misma instancia no es error (la segunda informa `UNKNOWN_INSTANCE`). Fuente: `visor/src/main.ts`.
- El aviso de selección en escena es `ViewerOptions.onPieceSelected` (ADR-08007), «única vía del visor hacia su anfitrión», en opciones y no como séptima función. Fuente: `visor/src/contract.ts`.

## 4. Tipos de la frontera (`visor/src/contract.ts`)

| Tipo | Campos | Nota |
| --- | --- | --- |
| `PieceComponent` | `position`, `role`, `type`, `declaredLength/Width/Radius/Area?` | componente de una pieza |
| `Piece` | `position`, `type`, `declared/derivedArea?`, `declared/derivedVolume?`, `components[]`, `declaredLength/Width/Radius?` | dimensiones propias sólo en planas del conjunto raíz |
| `UndrawnPiece` | `position`, `reason` | pieza no dibujada con motivo |
| `DrawOutcome` | `drawn: number[]`, `undrawn: UndrawnPiece[]` | «ninguna pieza desaparece sin quedar enumerada» |
| `ViewerOptions` | `background?`, `onPieceSelected?(position)` | opciones de `initialize` |
| `MotionOptions` | `cameraOrbit: boolean`, `pieceSpin: boolean` | dos movimientos gobernados por separado (F-25) |

## 5. Capa de dibujo (`visor/src/viewer/`)

### 5.1 `ViewerInstance` (`instance.ts`)

| Aspecto | Comportamiento | Fuente |
| --- | --- | --- |
| Construcción | `WebGLRenderer` (antialias), `Scene`, grilla `GridHelper(60, 30)` opacidad 0.45, `PerspectiveCamera(50)`, luz ambiente 0.75 + direccional 1.1; escuchas de puntero; arranca el bucle | `instance.ts` constructor |
| `load` | Libera lo anterior; ordena por `position` (no por llegada); fila con paso proporcional al tamaño de cada figura (aire = máx(25 % del tamaño, 0.5)); figuras apoyadas sobre la grilla; encuadra | `instance.ts` `load` |
| Encuadre | Calculado desde la caja real de la escena: distancia `r / sen(½ ángulo) × 1.25`; vista de frente y desde arriba | `instance.ts` `frameCamera` |
| `select` | Resalte exclusivo por `emissive` con color de marca × 0.45; `false` si la posición no está dibujada | `instance.ts` `select` |
| Selección en escena | Raycast al soltar el puntero sin arrastre → `onPieceSelected(position)` | `instance.ts` `onPointerUp`, `pieceAt` |
| `resize` | `setSize(clientWidth‖1, clientHeight‖1)` y recalcula aspecto | `instance.ts` `resize` |
| `setMotion` | Reemplaza el estado; órbita de cámara y giro de piezas; ambos se detienen mientras se arrastra | `instance.ts` `setMotion`, `start` |
| `dispose` | Cancela el bucle, quita escuchas, libera mallas, grilla, escena, `renderer.dispose()` + `forceContextLoss()`, saca el lienzo del DOM | `instance.ts` `dispose` |
| `liveMeshCount` | Contador de mallas vivas, sólo para PT-02 | `instance.ts` |

### 5.2 Mallas por tipo (`meshes.ts`)

| Tipo | Geometría three.js | De dónde sale cada medida | Escenario citado |
| --- | --- | --- | --- |
| `Cube` | `BoxGeometry(a,a,a)` | `Largo` del componente `Face` | E-3 |
| `Orthohedron` | `BoxGeometry` | `Largo`/`Ancho` de `Base`; altura = dimensión del `Lateral` que no es lado de la base (tolerancia 0.01) | E-1, E-7 |
| `Cylinder` | `CylinderGeometry(r,r,h,48)` | radio de `Cap`; altura = `Largo` de `Side` | E-1 |
| `Rectangle` / `Square` | `PlaneGeometry` | propias de la figura, o del primer componente | E-7 |
| `Circle` | `CircleGeometry(r,48)` | radio propio, o del primer componente | — |

- `MeshOutcome` es **unión discriminada** (malla o motivo), desde 2026-08-30; retiró el respaldo `'UNKNOWN'`. Fuente: `meshes.ts`, `instance.ts`.
- Motivos por pieza: `NON_DRAWABLE_TYPE`, `UNREADABLE_DIMENSION`. Un cero es medida legible (E-6), con `MINIMUM_EXTENT = 0.0001`. Fuente: `meshes.ts`.
- Material `MeshStandardMaterial` (metalness 0.05, roughness 0.65). Fuente: `meshes.ts`.

### 5.3 Paleta (`palette.ts`)

Colores leídos de tokens CSS del catálogo de diseño con respaldo para la página suelta; **cada tipo tiene su color, no se deriva del índice**.

| Uso | Token | Respaldo |
| --- | --- | --- |
| Fondo | `--color-background-secondary` | `#F1F1EF` |
| Grilla | `--color-border-secondary` | `#D9D9D4` |
| Selección / Orthohedron | `--color-brand-primary` | `#0F6E56` |
| Cylinder | `--color-accent-module-d` | `#185FA5` |
| Cube | `--color-accent-module-c` | `#854F0B` |
| Rectangle | `--color-accent-module-b` | `#534AB7` |
| Square | `--color-text-secondary` | `#5C5C57` |
| Circle | `--color-brand-primary-dark` | `#04342C` |

Fuente: `visor/src/viewer/palette.ts`. El sistema visual del producto → índice 09.

## 6. Contrato de fachada (documento)

`SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/02-Especificacion-Funcional/Definicion-Contrato-De-Fachada.md`

| Sección | Contenido |
| --- | --- |
| §2 | Vocabulario: componente anfitrión, elemento de dibujo, instancia, piezas reconstruidas; «texto del trabajo» retirado por ADR-08006 |
| §3.1 | Ciclo de vida de una instancia |
| §3.2 | Garantías G-1 cero red (medida con los dos movimientos prendidos) · G-2 cero persistencia · G-3 sin configuración propia · G-4 aislamiento · G-5 sin fallo silencioso · G-6 determinismo de posición · G-7 terminación controlada |
| §3.3 | Lo que la fachada no hace y quién sí |
| §4.1–§4.6 | Las seis funciones (firma, recibe, devuelve, garantiza, no hace, CU) |
| §5 | Identificador, resultado de dibujo, tipos dibujables, disposición determinista, gobierno del movimiento (§5.5) |
| §6 | Siete códigos de condición |
| §7–§9 | Compatibilidad de versión pública, trazabilidad (NB-00006, NB-00004), control de cambios |

### 6.1 Códigos de condición (§6) y su presencia en el código

| Código | Cuándo (contrato) | En `visor/src/` |
| --- | --- | --- |
| `GRAPHICS_CAPABILITY_MISSING` | sin capacidad 3D; no se crea instancia | `main.ts` (catch en `initialize`) |
| `INVALID_CANVAS_ELEMENT` C-1 | elemento inválido en `inicializar` | `main.ts` (sólo valida `appendChild`) |
| `INVALID_CANVAS_ELEMENT` C-2 | tamaño cero en `redimensionar` | no hallado (ver §9) |
| `UNKNOWN_INSTANCE` | id inexistente o liberado | `main.ts` (cinco funciones) |
| `UNREADABLE_TEXT` | texto sin piezas | no hallado (ver §9) |
| `NON_DRAWABLE_TYPE` | tipo fuera de los seis | `meshes.ts` |
| `UNREADABLE_DIMENSION` | falta la medida (0.00 no cuenta) | `meshes.ts` |
| `INDEX_OUT_OF_RANGE` | índice no dibujado | `main.ts` (`selectPiece`) |

## 7. Casos de uso CU-12001..12007

Carpeta: `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/05-Arquitectura-Tecnica/Contrato-Componente-Visor/`. Su `README.md` aclara que **no son casos de uso de la unidad**: describen la API del componente; el actor es el portal. Lo que hace la persona está en CU-10007 (índice 09). Viven en la unidad Web porque el visor sólo compone esa unidad.

| CU | Título | Versión · fecha | Función | Archivo |
| --- | --- | --- | --- | --- |
| CU-12001 | Inicializar una instancia del visor sobre un elemento de dibujo | 1.1 · 2026-08-08 | `initialize` | `CU-12001-Inicializar-Instancia-Del-Visor.md` |
| CU-12002 | Cargar el texto del trabajo y dibujar sus piezas | 1.1 · 2026-08-09 | `loadPieces` | `CU-12002-Cargar-El-Texto-Del-Trabajo-Y-Dibujar.md` |
| CU-12003 | Seleccionar una pieza por su índice | 1.2 · 2026-08-11 | `selectPiece` | `CU-12003-Seleccionar-Una-Pieza-Por-Su-Indice.md` |
| CU-12004 | Redimensionar la escena al elemento de dibujo | 1.1 · 2026-08-08 | `resize` | `CU-12004-Redimensionar-La-Escena.md` |
| CU-12005 | Destruir la instancia y liberar sus recursos | 1.1 · 2026-08-08 | `destroy` | `CU-12005-Destruir-La-Instancia-Y-Liberar-Recursos.md` |
| CU-12006 | Ejercitar la fachada completa sin backend | 1.1 · 2026-08-08 | las seis (sample S-1) | `CU-12006-Ejercitar-La-Fachada-Sin-Backend.md` |
| CU-12007 | Gobernar el movimiento automático de la escena sobre una instancia viva | 1.2 · 2026-08-09 | `setMotion` | `CU-12007-Gobernar-El-Movimiento-Automatico-De-La-Escena.md` |

Todos en estado Aprobado, autor AG-02, estructura propósito/actores/precondiciones/flujos/excepciones/postcondiciones. El sample S-1 y su ejecución → índice 13.

## 8. Generación y entrega del bundle

### 8.1 Cadena de construcción

| Paso | Qué | Fuente |
| --- | --- | --- |
| 1 | Quien dispara es `GeometriaFactory.Web.csproj`, target `BuildVisor` (Web ADR-10008), que corre el guion | `visor/geometriafactory-visor.csproj` (comentario); ADR → índice 15 |
| 2 | `scripts/build-visor.sh`: `npm ci` (o `npm install` si no hay lock) → `npm run build` | `scripts/build-visor.sh` |
| 3 | webpack + ts-loader: `visor/src/main.ts` → `dist/geometriafactory-visor.js` (sin `devtool` en la configuración: no se emite `.map`; `scripts/build-visor.sh` lo copia sólo si existiera) | `visor/webpack.config.js`, `visor/tsconfig.json`, `scripts/build-visor.sh` |
| 4 | Copia a `src/GeometriaFactory.Web/wwwroot/js/` | `scripts/build-visor.sh` |

- El `.csproj` del visor es **nodo inerte** (SDK `Microsoft.Build.NoTargets/3.7.56`, `EnableDefaultItems=false` para no arrastrar 6.592 ítems de `node_modules/`), sin `Exec` ni `ProjectReference`; existe por decisión del PO del 2026-09-11 de tener todo bajo la solución. La arista Visor→Web es activo de construcción. Fuente: `visor/geometriafactory-visor.csproj`.
- Corre dentro del contenedor de desarrollo (el host no tiene el kit). Criterio de éxito: QG-01 del visor. Fuente: `scripts/build-visor.sh`.
- Presupuesto de tamaño **declarado, no apagado**: `maxAssetSize`/`maxEntrypointSize` 560 KiB, a partir de 483 KiB medidos el 2026-08-16. Fuente: `visor/webpack.config.js`.

### 8.2 Versiones ancladas (`visor/package.json`)

| Paquete | Versión | Tipo |
| --- | --- | --- |
| three | 0.169.0 | dependencia |
| @types/three | 0.169.0 | dev |
| typescript | 5.6.3 | dev |
| webpack | 5.95.0 | dev |
| webpack-cli | 5.1.4 | dev |
| ts-loader | 9.5.1 | dev |

### 8.3 Guía de publicación

`SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/09-Devops/Guia-Publicacion-Bundle-Visor.md` (v1.0, 2026-08-11).

| § | Contenido |
| --- | --- |
| 0 | No hay publicación externa (no redistribuible, ADR-12006 §4): es **entrega interna** al `wwwroot/js` del front; tipo de artefacto `Bundle-Visor` sin prefijo de familia |
| 1 | Pre-requisitos sólo de entorno: contenedor, instalación desde lock, motor anclado, directorio destino; ningún secreto |
| 2 | Tres caminos: `scripts/build-visor.sh`, `scripts/build.sh`, workflow de publicación del front; stage `copiar` tras QG-04/05/06 |
| 3 | Cuatro verificaciones: 0 ediciones manuales (QG-09), reproducibilidad, S-1 6/6 sin backend, URL pública responde |
| 4 | Reversión por regeneración desde la etiqueta anterior, no por restauración |
| 5 | Cinco métricas de ADR-12006 §8, sin métricas de adopción |

Workflows y publicación del front → índice 12.

## 9. Bancos de verificación propios (`visor/verification/`)

Ambos cargan `../dist/geometriafactory-visor.js` **tal cual se sirve**, con Playwright + Chromium (`--use-gl=swiftshader`), y miden por la fachada pública; `stage-g.mjs` lo declara («Sólo por la FACHADA PÚBLICA»), mientras `lifecycle.mjs` usa además `visor.liveInstanceCount()` (línea 70), instrumento de PT-02 que no es superficie, y cuenta `document.querySelectorAll('canvas')`.

| Banco | Qué mide | Datos | Lo invoca | Fuente |
| --- | --- | --- | --- | --- |
| `lifecycle.html` + `lifecycle.mjs` | PT-02: 10 ciclos crear/cargar/liberar sin degradación; vigila avisos «Too many active WebGL contexts» / «context was lost»; usa `liveInstanceCount` | E-1 reconstruido (cilindro, cubo, ortoedro) | `scripts/verify-viewer-lifecycle.sh` | `visor/verification/lifecycle.mjs` |
| `stage-g.html` + `stage-g.mjs` | Criterios 1, 3, 4, 5 y 7 de la transición g→h (`Roadmap-Producto.md` §5.2): tres figuras dibujadas; misma disposición con piezas desordenadas; 0 peticiones externas; sincronía árbol↔escena por índice; movimientos separados que se detienen al arrastrar. Instrumento: comparación de píxeles del lienzo | E-1 reconstruido | `scripts/verify-stage-g.sh` | `visor/verification/stage-g.mjs` |

Las puertas en sí, sus resultados y PT-02/PT-03 → índice 11.

## 10. Divergencias observadas (código vs. contrato/docs)

Se registran aquí, con sus dos fuentes; `19_Observaciones-Del-Indexado.md` no las repite.

| # | Divergencia | Fuente A | Fuente B |
| --- | --- | --- | --- |
| V-1 | `selectPiece`, `resize`, `destroy` y `setMotion` devuelven `void`; el contrato declara confirmación o estado efectivo | `visor/src/main.ts` | `Definicion-Contrato-De-Fachada.md` §4.3–§4.6 |
| V-2 | `DrawOutcome` no trae «estructura del texto» ni «condición general»; `UNREADABLE_TEXT` no existe en el código (coherente con ADR-08006: ya no recibe texto) | `visor/src/contract.ts` | contrato §5.2, §6 |
| V-3 | `ViewerOptions` no tiene estado inicial de movimiento; la instancia nace con ambos apagados y el anfitrión debe llamar `setMotion` | `visor/src/contract.ts`, `instance.ts` | contrato §4.1 |
| V-4 | `setMotion` reemplaza ambos movimientos (`MotionOptions` exige los dos); el contrato dice que el no nombrado conserva su estado | `instance.ts` `setMotion` | contrato §4.6 |
| V-5 | `resize` no emite `INVALID_CANVAS_ELEMENT` C-2 (usa tamaño 1 como piso); `initialize` no valida tamaño nulo | `instance.ts`, `main.ts` | contrato §6 |
| V-6 | `visor/src/viewer/README.md` dice que la capa 3 «está vacía en la etapa a»; `package.json` y el comentario de cabecera de `webpack.config.js` describen el bundle «vacío pero real»: los tres quedaron atrás de la etapa g | `visor/src/viewer/README.md`, `visor/package.json`, `visor/webpack.config.js` (línea 4) | `visor/src/main.ts` («ETAPA g: la capa 3 existe») |
| V-7 | CU-12002 y CU-12006 siguen previos a ADR-08006 en título y cuerpo: CU-12002 invoca `cargarJson(id, texto)` (líneas 38, 52, 65, 91–95), tiene al «Texto del trabajo» como actor (40), devuelve «la estructura del texto» (57–58) y declara `UNREADABLE_TEXT` (76); CU-12006 CA-01 (línea 90) recorre `cargarJson` | `CU-12002-Cargar-El-Texto-Del-Trabajo-Y-Dibujar.md`, `CU-12006-Ejercitar-La-Fachada-Sin-Backend.md` | `visor/src/main.ts` (`loadPieces`), contrato §4.2 |
| V-8 | Al apagar el giro, las piezas no vuelven a su orientación de partida: `setMotion` sólo asigna `this.motion = options` | `visor/src/viewer/instance.ts` `setMotion` | contrato §5.5 regla 5, §4.6 |
| V-9 | Los movimientos no se detienen con la superficie no visible: no hay lógica de visibilidad y el bucle `requestAnimationFrame` sigue | `visor/src/viewer/instance.ts` | contrato §5.5 regla 6 |
| V-10 | `DrawOutcome.drawn` es `readonly number[]`: las dibujadas van sin su tipo | `visor/src/contract.ts` | contrato §4.2, §5.2 |

No verificado en este índice: ejecución real de los bancos (no se corrieron).
