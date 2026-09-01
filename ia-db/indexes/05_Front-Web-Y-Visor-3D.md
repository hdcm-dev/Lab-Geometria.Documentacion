# 05 · Front Blazor y visor 3D

> **Propósito:** las superficies que ve una persona, los guardianes que deciden qué puede alcanzar,
> y la fachada de seis funciones con la que el front habla con el visor.
> **Fuente primaria:** `src/GeometriaFactory.Web/`, `visor/src/` y
> `SDD/Docs/Unidades-Entrega/GeometriaFactory-Web/` (categorías 03 y 05).

---

## 1. Las once superficies y sus rutas

`Linea-Base-Visual.md` §2 define once superficies `SUP-XX`; el mapa de rutas vive en
`src/GeometriaFactory.Web/Routes.razor`, que las comenta una por una.

| `SUP` | Superficie | Ruta | Shell |
| --- | --- | --- | --- |
| `SUP-01` | Aprovisionamiento inicial | `/aprovisionamiento-inicial` | Acceso |
| `SUP-02` | Registro de cuenta | `/registro-de-cuenta` | Acceso |
| `SUP-03` | Ingreso | `/ingreso` | Acceso |
| `SUP-04` | Credencial propia | `/credencial-propia/establecer`, `/credencial-propia/cambio-obligado`, `/mi-contrasena` | Acceso / Trabajo |
| `SUP-05` | Panel de trabajos del alumno | `/mis-trabajos` | Trabajo |
| `SUP-06` | Envío de trabajo | `/trabajo-nuevo`, `/trabajos/{WorkId}/editar` | Trabajo |
| `SUP-07` | Vista de trabajo | `/trabajos/{WorkId}` | Trabajo |
| `SUP-08` | Resolución del trabajo | **sin ruta** — alojada dentro de `SUP-07` | — |
| `SUP-09` | Panel de cuentas | `/cuentas` | Trabajo |
| `SUP-10` | Listado de la comisión | `/entrega-comision` | Trabajo |
| `SUP-11` | Estado degradado y reconexión | **sin ruta** — se superpone a los dos shells | — |

Fuera de la línea de base: `/` resuelve el destino inicial (`NAV-01`, `NAV-03`), `/estado` es
andamiaje de la etapa `a` y `/no-encontrado` atiende la reejecución de `UseStatusCodePagesWithReExecute`.

**El layout por defecto es el shell de acceso**: si una superficie nueva se olvida de declarar el
suyo, cae en el armazón que no promete navegación, que es el error barato de los dos.

## 2. Estructura del proyecto

```
Components/Layout/   AccessShell · WorkShell · MainLayout
Components/Pages/    16 componentes de página: las rutas de la tabla más las dos superficies de «no encontrado»
Components/Shared/   DegradedStateOverlay · Icon · StagePlaceholder · VersionSeal
Components/Work/     JsonTree (el árbol del texto) · WorkResolution (el desenlace)
Integration/         DataServiceClient — la ÚNICA salida hacia el servicio de datos
                     DataServiceOutcome — resultado, o el error del contrato
Services/            los middlewares y el estado de sesión (§3)
wwwroot/             css/app.css, css/scaffold.css, interaction/surface-interaction.js
                     js/geometriafactory-visor.js — el bundle COPIADO desde visor/dist
```

Decisiones: render en el servidor con circuito interactivo (`ADR-10001`), **sin estado propio y sin
persistencia** (`ADR-10002`), credencial de sesión en el estado del circuito (`ADR-10003`), tres
capas de presentación (`ADR-10004`), estado degradado como superficie (`ADR-10005`), aislamiento del
visor tras su fachada (`ADR-10006`) y dirección del servicio de datos desde configuración
(`ADR-10007`).

## 3. Sesión y guardianes

| Pieza | Qué decide |
| --- | --- |
| `ProvisioningGateMiddleware` | **Guardián 1** de `ADR-10003` §2, con sus dos mitades: mientras no exista administrador, toda ruta desvía al aprovisionamiento; una vez que existe, el aprovisionamiento deja de ser alcanzable |
| `PanelSessionGateMiddleware` | **Guardián 2**: ninguna ruta del panel es accesible sin sesión; sin marca, desvía a `/ingreso` |
| `UnrestorableSessionMiddleware` | El estado «sesión no restablecible»: marca presente y testigo ausente (`EST-34`) |
| `StaleFormMiddleware` | Un envío que el marco no pudo verificar **no le muestra a la persona el error del marco** |
| `SessionTokenStore` | **El testigo firmado del servicio de datos vive acá y en ningún otro lado** |
| `SessionClaims` / `SessionState` | Lo único que la marca de sesión lleva adentro: identidad y papel |
| `SessionCookieDefaults` | Los valores fijos de la marca del navegador |
| `PendingCredentialChangeStore` | De quién es la cuenta en medio de un cambio forzado, del lado del servidor |
| `ProvisioningStateProbe` | Responde si ya hay administrador y **recuerda el sí para siempre**, para que el guardián 1 no cueste un viaje de red por petición |

**Ningún guion del navegador invoca el servicio de datos** (`RA-01`): la única salida es
`DataServiceClient`, servidor a servidor, con el testigo adjunto. La dirección llega por
configuración (`ApiBaseUrl`) y **nunca embebida**; el valor versionado en `appsettings.json` es el
del contenedor de desarrollo (`http://localhost:5080/`), y el real llega como secreto del
repositorio en la publicación.

---

## 4. El visor: fachada de seis funciones

Proyecto Node independiente en `visor/`: TypeScript 5.6.3, webpack 5.95.0, **three 0.169.0**
empaquetado (no por red de distribución — es lo que mide `PT-03`).

```
visor/src/contract.ts       Los tipos que cruzan la frontera. Es LO ÚNICO que el bundle sabe del dato
visor/src/main.ts           La fachada: valida argumentos, resuelve la instancia y delega
visor/src/viewer/           Capa 3: instance.ts, meshes.ts, palette.ts — construye mallas y gobierna la escena
visor/verification/         lifecycle.* y stage-g.*: los bancos con los que se miden PT-02 y la etapa `g`
```

| Función | Qué hace |
| --- | --- |
| `initialize(element, options?)` | Crea una instancia viva y **no dibuja nada hasta que le den piezas**. Devuelve su identificador |
| `loadPieces(id, pieces)` | Dibuja las piezas **ya reconstruidas** y devuelve `DrawOutcome` |
| `selectPiece(id, index)` | Selecciona por índice |
| `resize(id)` | Redimensiona la escena |
| `destroy(id)` | Libera geometrías, materiales y el contexto gráfico |
| `setMotion(id, options)` | Gobierna el movimiento automático |

Más `liveInstanceCount()`, que es la sonda con la que la verificación cuenta instancias vivas.

**Las tres invariantes del bundle**, comprobables sin leerlo entero:

- **No hace red, no tiene identidad y no lee configuración** (`RA-02`, `ADR-12003`): no importa
  ningún cliente, no conoce ninguna dirección, y todo lo que dibuja se lo dan por parámetro.
- **Recibe piezas reconstruidas y no el texto del alumno** (`ADR-08006`). `loadPieces` se llamaba
  `loadJson` hasta el 2026-08-16; el nombre cambió junto con la firma.
- **Los errores se devuelven y no se lanzan**: un anfitrión que pasa un identificador viejo tiene
  que poder seguir. Códigos: `UNKNOWN_INSTANCE`, `INVALID_CANVAS_ELEMENT`,
  `GRAPHICS_CAPABILITY_MISSING`, `INDEX_OUT_OF_RANGE`.

**`DrawOutcome` es la garantía central**: devuelve `drawn` y `undrawn`, y **ninguna pieza
desaparece sin quedar enumerada** con su posición y su motivo. El visualizador previo fallaba en
silencio y la persona veía dos figuras donde había pegado tres.

Otras decisiones del visor: tres capas con fachada plana (`ADR-12001`), superficie de seis
funciones planas (`ADR-12002`), motor de dibujo empaquetado y aislado (`ADR-12004`), **disposición
determinista derivada del índice** (`ADR-12005`) y bundle generado y versionado del punto de
extensión (`ADR-12006`). Los siete casos del contrato son `CU-12001` a `CU-12007`.

**El bundle se copia, no se referencia**: `scripts/build-visor.sh` empaqueta y deja el archivo en
`src/GeometriaFactory.Web/wwwroot/js/geometriafactory-visor.js`. Esa copia **es** la arista
`Visor → Web` del grafo de compilación.
