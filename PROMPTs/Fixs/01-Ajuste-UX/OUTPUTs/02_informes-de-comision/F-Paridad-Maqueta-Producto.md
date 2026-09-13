# Informe — Paridad maqueta ↔ producto (F)

## Mandato y alcance observado

Miré **toda diferencia entre la maqueta aprobada y el producto desplegado, en las dos
direcciones**: componentes, textos literales, estados representados y las dos hojas de estilo.
No propongo diseño nuevo.

**Medios.** Medio A (`tools/medios/web.sh`, Chromium en contenedor, 1440x900, `--full`), con el
mismo ancho y el mismo encuadre en los dos lados. Maqueta: `http://127.0.0.1:18077` (contenedor
`gf-maqueta`). Producto: `https://aplicada.somee.com`, que es la `instancia` del contrato de
entrada; para calibrar tomé además `http://127.0.0.1:5090/ingreso` y da el mismo texto. Entré como
administrador con la credencial del contrato. Además fabriqué dos comparaciones normalizadas de las
hojas (`:root` y nombres de clase), descritas en el §Registros.

**Pantallas observadas — las once de la maqueta.** Del producto: `/ingreso`,
`/registro-de-cuenta`, `/aprovisionamiento-inicial`, `/estado`, `/cuentas`, `/entrega-comision`,
`/mi-contrasena`, `/mis-trabajos`, `/trabajo-nuevo` y un `/trabajos/{id}` (el trabajo «Cubo de la
mesa UX D», sembrado por la Comisión D; sólo lectura, no ejecuté ninguna acción sobre él).

**Lo que NO llegué a observar, y por qué.**

- **Las superficies del alumno del producto.** `/mis-trabajos` y `/trabajo-nuevo` con sesión de
  administrador **no dibujan el panel**: dibujan una nota que remite a la entrega de la comisión
  (apartamiento 3 declarado en `StudentWorkPanel.razor:47-51`). Sin cuenta de alumno propia no
  puedo comparar `Panel-De-Trabajos-Del-Alumno.html` ni `Envio-De-Trabajo.html` ni
  `Vista-De-Trabajo.html` contra su equivalente vivo. **No supongo nada sobre ellas**: lo que digo
  de la vista de trabajo sale de la variante de administrador, que es la de
  `Resolucion-Del-Trabajo.html`.
- **`/aprovisionamiento-inicial`**: el producto redirige a `/ingreso` (el laboratorio ya está
  aprovisionado), así que `Aprovisionamiento-Inicial.html` no tiene contra qué compararse.
- **El estado degradado y la reconexión**: `Estado-Degradado-Y-Reconexion.html` representa una
  superposición que sólo aparece al cortarse el circuito. No provoqué el corte —el contrato me
  limita a lo que sembré— así que la comparé por código, no por captura.
- **El estado `Pendiente` de la resolución del trabajo**: el único trabajo sembrado por la mesa que
  pude abrir ya estaba `Finalizado`, así que vi la variante «ya tiene desenlace» y no los botones
  Aprobar/Rechazar que muestra la maqueta.
- **`/trabajos/{id}/editar`, `/credencial-propia/establecer`, `/credencial-propia/cambio-obligado`
  y `/no-encontrado`**: no observadas.
- Un solo ancho (1440x900) y un solo motor (Chromium). El móvil de 360 px no lo usé.

---

## Hallazgos

### F-01 · La celda del nombre de cuenta se dibuja con el estilo del encabezado de tabla: en versalitas grises sobre fondo de cabecera

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/AccountsPanel.razor:315` · pantalla
  `/cuentas`, 1440x900
- **Evidencia**: nivel **E2**, cita literal de los dos lados.
  - Producto — `AccountsPanel.razor:315`: `<th scope="row">` **sin ninguna clase**. Por eso le pega
    `app.css:420-427`: `.gf-table th { … font-size: var(--type-meta-size); letter-spacing: .04em;`
    **`text-transform: uppercase;`** `color: var(--color-text-secondary); background:
    var(--color-background-tertiary); }`.
  - Maqueta — `assets/js/Maqueta.js:1324`: `'<th scope="row" class="mq-body-strong mq-th-plano
    mq-th-plano--cuerpo">' + esc(t.nombre) + '</th>'`, que es exactamente el juego de clases que
    apaga la versalita y devuelve el cuerpo (`Estilos-Maqueta.css`, `.mq-th-plano`).
  - Medición comparada (**E1**): `f-maq-panel-de-cuentas.png` muestra «Ana Diaz» en cuerpo normal;
    `f-viv-cuentas.png` muestra «ADOLFO VERA», «COMISION DEEUX» en versalita chica y gris, con la
    primera columna teñida del fondo de cabecera. En el mismo producto, el desplegable de filtro de
    `/entrega-comision` dice «Comision DeeUx»: el dato **no** está en mayúsculas, el estilo lo pone.
- **Severidad**: S2   **Confianza**: 0.97
- **Impacto si no se corrige**: la columna que identifica a la persona es la menos legible de la
  tabla y parece un encabezado repetido, y el nombre del alumno queda deformado en la única
  pantalla donde el docente lo usa para decidir a quién habilita.
- **Propuesta de dirección**: que la celda de identificación de fila del panel de cuentas se dibuje
  con el mismo tratamiento tipográfico que la maqueta ya declara y que las otras dos tablas del
  producto sí usan. Nota para el cuerpo auditor: `ClassSubmissionList.razor:199` lleva
  `gf-th-plain gf-th-plain--body` pero **le falta `gf-body-strong`**, que la maqueta y
  `StudentWorkPanel.razor:225` sí llevan; es la misma familia de defecto, un grado más leve.

### F-02 · La misma fecha del mismo trabajo se muestra en dos formatos distintos en la misma pantalla del producto

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Pages/WorkView.razor:128` contra `:175` ·
  pantalla `/trabajos/{id}`, 1440x900
- **Evidencia**: nivel **E2** + **E1**.
  - Producto, cabecera — `WorkView.razor:128`: `<p class="gf-caption gf-num gf-margin-top-1">`
    `@_work.DeclaredDate · @OwnerName</p>` — imprime el dato **crudo**.
  - Producto, ficha — `WorkView.razor:175`: `<dt>Fecha del trabajo</dt><dd class="gf-num">`
    `@DeclaredDateText.ToDisplay(_work.DeclaredDate)</dd>` — imprime el dato **formateado**.
  - Registro del medio `f-viv-trabajo-resolucion.txt`: la cabecera dice `2026-09-02 · Comision
    DeeUx` y catorce líneas más abajo la ficha dice `Fecha del trabajo` / `02/09/2026`.
  - Maqueta — `f-maq-resolucion-del-trabajo.txt`: cabecera `12/08/2026 · Ana Diaz · 3 piezas · 2
    advertencias` y ficha `12/08/2026`. **Un solo formato, el de la maqueta.**
- **Severidad**: S2   **Confianza**: 0.98
- **Impacto si no se corrige**: el alumno y el docente leen dos fechas con forma distinta en la
  misma pantalla y tienen que comprobar que son la misma; y el formato ISO de la cabecera no es el
  que el resto del producto usa en ninguna otra parte.
- **Propuesta de dirección**: que la fecha declarada se muestre con la misma forma en todos los
  lugares donde aparece, la que la maqueta fija.

### F-03 · El sello de versión del producto es un texto inerte que dice «no identificada», y el botón de diagnóstico que la maqueta declara existe en la hoja pero ninguna superficie lo usa

- **Capa de origen**: 5 superficie (con residuo en la capa 3, componente)
- **Ubicación**: `src/GeometriaFactory.Web/Components/Shared/VersionSeal.razor:14-16` ·
  `wwwroot/css/app.css:745` y `:750` · todas las pantallas, 1440x900
- **Evidencia**: nivel **E2** + **E1**.
  - Producto — `VersionSeal.razor:14-16`, el componente **entero**:
    `<div class="gf-seal"><span class="gf-meta">Versión no identificada</span></div>`.
  - Maqueta — `assets/js/Maqueta.js:215-216`: `'<div class="mq-sello" data-mq-sello>' +`
    `'<button type="button" class="mq-sello-boton" aria-expanded="false" aria-controls="…">'`,
    con panel `.mq-diagnostico` y un «copiar para reportar» (`Maqueta.js:242-243`).
  - **Componente huérfano**: `.gf-seal-button` (`app.css:745`) y `.gf-diagnostics` (`app.css:750`,
    `:757`) están escritos en la hoja del producto y **no los referencia ningún `.razor`**
    (`grep -rn 'gf-seal-button\|gf-diagnostics' src/` sólo devuelve las líneas de `app.css`).
  - **La afirmación del sello es dudosa**: `VersionSeal.razor:9-12` justifica el texto porque «la
    identidad no pudo derivarse de la construcción», pero `f-viv-estado.txt` muestra que el propio
    producto publica `Versión del servicio` / `1.0.0+b6577d6e6c39da4dc0f681683b7febfaecfb2efb`.
  - Capturas: `f-maq-ingreso.png` dice «Versión 1.4.2» con subrayado punteado de control; 
    `f-viv-ingreso.png` dice «VERSIÓN NO IDENTIFICADA» en texto plano.
- **Severidad**: S3   **Confianza**: 0.9
- **Impacto si no se corrige**: nadie que reporte un problema puede decir sobre qué versión lo vio,
  que es la única función del sello; y la hoja del producto arrastra un componente muerto que la
  próxima persona que la lea va a creer vivo.
- **Propuesta de dirección**: que el sello alcance el estado que la maqueta representa por defecto
  —identidad legible y detalle copiable—, o que se declare por escrito que la etapa `b` lo deja
  así y que las dos reglas huérfanas de la hoja se retiren mientras tanto. **Cuál manda lo dirime
  el jurado**: el texto del producto está justificado en su propio comentario, pero la maqueta
  aprobada representa el otro estado.

### F-04 · El botón «Mostrar la contraseña» está en la maqueta y no existe en ninguna pantalla del producto

- **Capa de origen**: 5 superficie
- **Ubicación**: `SDD/Maquetas/GeometriaFactory-Web/Ingreso.html:85` · pantalla `/ingreso`, 1440x900
- **Evidencia**: nivel **E2** + **E1**.
  - Maqueta — `Ingreso.html:85`: `aria-pressed="false" data-mq-ver-clave>Mostrar la contraseña</button>`,
    y `Ingreso.html:133` alterna el rótulo a `'Ocultar la contraseña'`.
  - Producto — `grep -rn 'Mostrar la contraseña' src/` **no devuelve ninguna línea**. No está en
    `SignIn.razor`, ni en `OwnCredentialChange.razor`, ni en `OwnCredentialSetup.razor`, ni en
    `OwnCredentialForcedChange.razor`.
  - `f-maq-ingreso.txt` lista ` Mostrar la contraseña` entre «Contraseña» e «Ingresar»;
    `f-viv-ingreso.txt` pasa de «Contraseña» a «Ingresar» sin nada en el medio. Las dos capturas
    `.png` lo confirman a la misma escala.
- **Severidad**: S3   **Confianza**: 0.99
- **Impacto si no se corrige**: quien escribe mal la contraseña no tiene forma de verla, y el
  producto no tiene recuperación por correo: el costo de un tipeo es pedirle al docente un reseteo.
- **Propuesta de dirección**: que el control de revelado que la maqueta aprobó exista en las
  pantallas donde se escribe una contraseña, o que su ausencia quede como decisión escrita.

### F-05 · El producto agrega un botón «Filtrar» en tres pantallas que la maqueta filtra sin botón, y el propio código declara que ese apartamiento no fue autorizado

- **Capa de origen**: 5 superficie
- **Ubicación**: `AccountsPanel.razor:274`, `ClassSubmissionList.razor:131`,
  `StudentWorkPanel.razor:184` · pantallas `/cuentas`, `/entrega-comision`, `/mis-trabajos`
- **Evidencia**: nivel **E2**, cita literal de los dos lados.
  - Producto, las tres iguales: `<button type="submit" class="gf-btn gf-btn--secondary">Filtrar</button>`.
  - Maqueta: `grep -rn 'Filtrar' SDD/Maquetas/GeometriaFactory-Web/*.html assets/js/*.js` **no
    devuelve nada**; `f-maq-panel-de-cuentas.txt` y `f-maq-panel-de-trabajos-del-alumno.txt` van de
    «Situación de la cuenta / todas / …» directo a la tabla.
  - **La divergencia está declarada y declarada como no autorizada** —
    `StudentWorkPanel.razor:41-46`: «**LA BÚSQUEDA Y EL FILTRO VIAJAN POR LA DIRECCIÓN**, en lugar
    de acotar en el navegador lo ya recibido, que es lo que el wireframe §3 pide. Es el mismo
    apartamiento que `AccountsPanel` declaró y que sigue abierto: **no entró en lo que el Product
    Owner autorizó del guion**».
  - `f-viv-cuentas.png` muestra el botón alineado con el desplegable.
- **Severidad**: S3   **Confianza**: 0.95
- **Impacto si no se corrige**: hay un control por pantalla que la línea de base visual no tiene y
  que nadie aprobó, y el filtrado deja de ser inmediato en las tres listas del laboratorio.
- **Propuesta de dirección**: cerrar el apartamiento en una de las dos direcciones —filtrado sin
  botón como pide el wireframe, o autorización escrita del botón y su incorporación a la maqueta—
  pero no dejarlo abierto por tercera vez.

### F-06 · El armazón del producto lleva una banda de estado del servicio que la maqueta no representa en ningún estado

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Layout/WorkShell.razor:114` · todas las
  pantallas con sesión, 1440x900
- **Evidencia**: nivel **E2** + **E1**.
  - Producto — `WorkShell.razor:114`: `Servicio de datos en línea · comprobado a las
    @_servicio.Momento.ToLocalTime().ToString("HH:mm:ss")`.
  - Maqueta: `grep -rn 'Servicio de datos' SDD/Maquetas/GeometriaFactory-Web/` **no devuelve nada**;
    y la barra de validación de la maqueta, que enumera veintitrés estados representados
    (`f-maq-ingreso.txt`), incluye «Indisponible (el servicio de datos no responde)» pero **no** un
    estado «en línea» con marca de tiempo.
  - `f-viv-cuentas.png` la muestra sobre el título de la página, por encima del `h1`.
- **Severidad**: S3   **Confianza**: 0.85
- **Impacto si no se corrige**: la primera línea de contenido de toda pantalla con sesión es un
  dato de diagnóstico que la línea de base visual no previó, y desplaza el título de la página.
- **Propuesta de dirección**: **no puedo determinar cuál manda y lo propongo al jurado.** La banda
  puede ser una mejora legítima posterior a la aprobación (el `README.md:19-20` de la maqueta dice
  que ésta «no es documentación viva», que «es la línea de base de un momento»), o un elemento de
  diagnóstico que se filtró a la superficie del usuario. Si se conserva, tiene que entrar en la
  maqueta; si no, tiene que salir de las nueve pantallas.

### F-07 · La barra lateral del producto identifica a la persona con su correo entero, donde la maqueta pone su nombre; a 1440x900 el correo se recorta

- **Capa de origen**: 5 superficie
- **Ubicación**: `src/GeometriaFactory.Web/Components/Layout/WorkShell.razor:65` · todas las
  pantallas con sesión, 1440x900
- **Evidencia**: nivel **E2** + **E1**.
  - Producto — `WorkShell.razor:65`: `<span class="gf-sidebar-person">@Session.Email</span>`.
  - Maqueta — `assets/js/Maqueta.js:193`: `'<span class="mq-sidebar-persona">' + esc(nombre) + '</span>'`,
    donde `nombre` es «Docente» o «Ana Diaz» según el papel.
  - `f-maq-panel-de-cuentas.txt` da `Docente` / `Administrador`; `f-viv-cuentas.txt` da
    `fernandofilipuzzi.utn@gmail.com` / `Administrador`.
  - Medición comparada: en `f-viv-cuentas.png` el correo **se corta en el borde de la barra**
    («fernandofilipuzzi.utn@gmail.» sin cerrar); en `f-maq-panel-de-cuentas.png` el nombre entra
    entero con margen de sobra.
- **Severidad**: S3   **Confianza**: 0.92
- **Impacto si no se corrige**: el único lugar donde se comprueba con qué cuenta se está trabajando
  muestra un texto truncado, y el correo del docente queda a la vista en toda proyección o captura
  de pantalla de la clase.
- **Propuesta de dirección**: que el rótulo de identidad muestre lo que la maqueta declara —el
  nombre de la persona— o, si el nombre no está disponible en la sesión, que se decida por escrito
  qué se muestra y que ese texto entre en el ancho de la barra.

---

### Tenía más de siete: las cuatro que dejé fuera por severidad

Lo declaro como pide §4 de las Instrucciones Comunes.

1. **La cabecera del trabajo perdió «N piezas · N advertencias» y el bloque perdió su recuento.**
   Maqueta: `12/08/2026 · Ana Diaz · 3 piezas · 2 advertencias` y `OBSERVACIONES (2)`. Producto:
   `2026-09-02 · Comision DeeUx` (`WorkView.razor:128`) y `Observaciones` sin número
   (`WorkView.razor:193`). La ausencia **está declarada** para las columnas de la tabla
   (`StudentWorkPanel.razor:33-41`, con la contradicción entre `Contracts CU-04` y `Application
   CU-06` elevada al Product Owner), pero **esa declaración no cubre la cabecera ni el título del
   bloque**.
2. **El árbol cambió de objeto y de rótulo**: maqueta «Árbol de la estructura» con nodos de pieza
   (`Maqueta.js:1499`); producto «Árbol del texto» con nodos de JSON (`WorkView.razor:358-372`).
   **Declarado, con motivo escrito** (intake §20, citado en el propio componente): acá la maqueta
   es la que quedó vieja.
3. **Tres superficies del producto no tienen contraparte en la maqueta**: `/mi-contrasena`
   (la única maqueta de credencial, `Credencial-Propia.html`, es el alta «Elegí tu contraseña»),
   `/credencial-propia/cambio-obligado`, y `/estado`, que además se presenta a sí misma como
   «Andamiaje de la etapa a» (`f-viv-estado.txt`). Y el reseteo de contraseña —la operación
   «Resetear la contraseña» que el producto ofrece en `/cuentas` y que la maqueta no tiene— es uno
   de los **tres huecos declarados en la aprobación**: `SDD/Maquetas/GeometriaFactory-Web/README.md:9`
   dice que se aprueba «con sus tres huecos declarados: la sexta función de la fachada, **el
   reseteo de contraseña** y la provisoria al habilitar no fueron validados visualmente, y su vía
   es una iteración 5». Esa iteración 5 no ocurrió.
4. **Textos donde la maqueta es la desactualizada, no el producto.** En `/ingreso` la maqueta dice
   «pedile al docente que te dé de alta otra vez. Tené en cuenta que **eso borra también tus
   trabajos**» y el producto dice «pedile al docente que te la resetee. Te va a dar una provisoria
   y vas a elegir una nueva al entrar. **No perdés ninguno de tus trabajos**». Los dos textos se
   contradicen y **el del producto es el que describe lo que el producto hace**. Lo registro para
   que nadie «corrija» el producto hacia la maqueta. (De paso, y fuera de mi mandato: el producto
   escribe «Se dibujaron las 1 figuras del trabajo», `WorkView.razor:338`.)

---

## Lo que revisé y está bien (máximo 3)

1. **Los tokens de `:root` son idénticos, token por token.** Normalicé los dos bloques (una
   declaración por línea, espacios colapsados, ordenadas) y el `diff` sale **vacío**: 50
   declaraciones de un lado, 50 del otro, mismos nombres y mismos valores. La regla de paridad del
   marco §1-bis se está cumpliendo en la capa 2. Es el resultado más tranquilizador de este informe.
2. **La correspondencia de componentes entre las dos hojas es casi total.** De 176 clases `.mq-*` y
   170 `.gf-*`, el mapeo castellano↔inglés empareja todas salvo las que **sólo tienen sentido en la
   maqueta** —`mq-barra-validacion`, `mq-conmutador`, `mq-panel-fachada` con sus cinco `mq-fa-*`, y
   `mq-portada`/`mq-prosa`/`mq-lista-superficies` de `index.html`, todas rotuladas «NO FORMA PARTE
   DEL PRODUCTO»— y las que el producto necesita de más para el ciclo de reconexión de Blazor
   (`gf-reconnect-*`) y para el movimiento de la escena (`gf-scene-motion-*`). El único residuo real
   es el de F-03.
3. **`Registro-De-Cuenta.html` y `/registro-de-cuenta` dicen exactamente lo mismo.** Comparé
   `f-maq-registro-de-cuenta.txt` con `f-viv-registro-de-cuenta.txt` línea por línea: título,
   párrafo de espera, los tres rótulos, el botón y el enlace de vuelta coinciden literalmente. La
   única diferencia es el sello de versión, que ya está en F-03.

---

## Solicitudes de convocatoria

- **A la Comisión E (accesibilidad y comportamiento).** En el producto, el `h1` recibe el anillo de
  foco **al cargar la página**, sin que nadie lo haya enfocado: se ve como un recuadro verde
  alrededor de «Ingresar al laboratorio» en `f-viv-ingreso.png` y alrededor de «Cuentas de la
  comisión» en `f-viv-cuentas.png`. La maqueta no lo hace en la misma captura y al mismo ancho.
  Es el chequeo mecánico **C-3** del marco §3-bis y no es de mi mandato; lo paso con las dos
  imágenes.
- **A la Comisión B (composición y dimensionamiento).** El botón extra de F-05 y la operación
  «Resetear la contraseña» hacen que cada fila de `/cuentas` envuelva sus operaciones en dos
  renglones: la tabla del producto ocupa aproximadamente el doble de alto por fila que la de la
  maqueta a igual ancho (`f-viv-cuentas.png` contra `f-maq-panel-de-cuentas.png`). La densidad es
  de B, no mía; dejo las dos capturas como insumo.
- **Al Product Owner, por la vía del jurado.** La iteración 5 de la maqueta —la que cerraría los
  tres huecos declarados en `README.md:9`— no ocurrió, y el producto ya lleva desplegado al menos
  uno de esos tres (el reseteo de contraseña). Mientras no ocurra, el chequeo C-5 no puede dar
  verde sobre esas superficies.

---

## Registros producidos

**Maqueta** (`http://127.0.0.1:18077`, 1440x900, `--full`) — cada uno con su `.png` y su `.txt`:

| Archivo | Qué muestra |
|---|---|
| `f-maq-ingreso.*` | Ingreso con «Mostrar la contraseña» y «Versión 1.4.2» (F-03, F-04) |
| `f-maq-registro-de-cuenta.*` | Registro; base de la coincidencia literal del punto 3 de «está bien» |
| `f-maq-panel-de-cuentas.*` | Panel de cuentas: nombre en cuerpo, sin botón «Filtrar», «Docente» en la barra (F-01, F-05, F-07) |
| `f-maq-panel-de-trabajos-del-alumno.*` | Panel del alumno con columnas PIEZAS y ADVERTENCIAS y sin «Filtrar» |
| `f-maq-listado-de-la-comision.*` | Entrega de la comisión, agrupada por alumno |
| `f-maq-vista-de-trabajo.*` | Vista del alumno: cabecera con piezas y advertencias, «Árbol de la estructura» |
| `f-maq-resolucion-del-trabajo.*` | Vista del administrador en estado Pendiente, con Aprobar/Rechazar/Retirar (F-02) |
| `f-maq-envio-de-trabajo.*` | Trabajo nuevo con previsualización |
| `f-maq-credencial-propia.*` | «Elegí tu contraseña» — el alta, no el cambio |
| `f-maq-aprovisionamiento-inicial.*` | Aprovisionamiento inicial; sin equivalente observable |
| `f-maq-estado-degradado-y-reconexion.*` | La superposición de estado degradado sobre el panel del alumno |

**Producto** (`https://aplicada.somee.com`, 1440x900, `--full`, sesión de administrador):

| Archivo | Qué muestra |
|---|---|
| `f-viv-ingreso.*` | Ingreso sin botón de revelado, «VERSIÓN NO IDENTIFICADA», anillo de foco en el `h1` |
| `f-viv-ingreso-local.*` | El mismo texto en `127.0.0.1:5090`: la divergencia no es del despliegue |
| `f-viv-registro-de-cuenta.*` | Registro, literalmente igual a la maqueta salvo el sello |
| `f-viv-aprovisionamiento-inicial.*` | La redirección a `/ingreso` que impide la comparación |
| `f-viv-estado.*` | `/estado`, «Andamiaje de la etapa a», con la versión real del servicio (F-03) |
| `f-viv-cuentas.*` | Nombre en versalita gris, «Filtrar», «Resetear la contraseña», correo truncado en la barra (F-01, F-05, F-06, F-07) |
| `f-viv-entrega-comision.*` | Entrega de la comisión con «Filtrar» y los grupos por alumno |
| `f-viv-mi-contrasena.*` | `/mi-contrasena`, superficie sin contraparte en la maqueta |
| `f-viv-mis-trabajos.*` | La nota de papel equivocado: por qué no pude observar el panel del alumno |
| `f-viv-trabajo-nuevo.*` | Ídem para el envío de trabajo |
| `f-viv-trabajo-resolucion.*` | «Cubo de la mesa UX D» ya finalizado: las dos fechas en dos formatos (F-02) |

**Comparaciones de hojas** (fabricadas por esta comisión, dejadas en `tools/medios/out/` con el prefijo `f-`):

- `f-root-maq.txt` / `f-root-viv.txt` (y `f-diff-root.txt`, de 0 bytes) — los dos bloques `:root` normalizados y ordenados. `diff -u`
  entre ellos: **vacío**. Reproducible con
  `awk '/^:root *\{/{f=1} f{print} f&&/^\}/{exit}' <hoja> | grep -oE '^\s*--[a-z0-9-]+:\s*[^;]+;' | sed -E 's/^\s+//; s/:\s+/: /' | sort`.
- `f-cls-maq.txt` / `f-cls-viv.txt` — los nombres de clase de cada hoja, sin prefijo, ordenados y
  únicos (176 y 170). `comm -23` y `comm -13` sobre ellos dan las dos listas de exclusivas que
  fundan el punto 2 de «lo que revisé y está bien» y el residuo de F-03.
