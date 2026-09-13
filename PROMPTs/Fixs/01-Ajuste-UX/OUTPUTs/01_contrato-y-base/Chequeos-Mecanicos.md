# Base mecánica — los cinco chequeos de interfaz (ciclo 1)

Corridos el **2026-09-02** contra `main @ 42ffb80` y contra `https://aplicada.somee.com`, **antes**
de convocar a ninguna comisión (`Mesa-UX-UI.md` §3-bis). Lo que falla acá entra al jurado sin que
nadie opine.

| # | Chequeo | Resultado |
|---|---|---|
| C-1 | Existe una escala tipográfica | **FALLA** — `E1` |
| C-2 | Existe un ritmo de espaciado | **FALLA** — `E2` |
| C-3 | Ningún elemento no interactivo recibe el anillo de foco | **FALLA** — `E1` |
| C-4 | Ninguna pantalla arroja errores de consola | **PASA** — `E1` |
| C-5 | Paridad maqueta ↔ producto | **FALLA parcial** — `E1` (lo cuantifica la comisión F) |

---

## C-1 · No hay escala tipográfica. FALLA.

`src/GeometriaFactory.Web/wwwroot/css/app.css:90-94` (y sus gemelas
`SDD/Maquetas/…/Estilos-Maqueta.css:83-87`) declaran cinco tamaños:

```
--type-title-size:        17px
--type-body-strong-size:  14px
--type-body-size:         13px
--type-caption-size:      12px
--type-meta-size:         11px
```

Razones entre pasos consecutivos, calculadas:

| Paso | Razón |
|---|---|
| título / cuerpo fuerte | 1,214 |
| cuerpo fuerte / cuerpo | 1,077 |
| cuerpo / leyenda | 1,083 |
| leyenda / meta | 1,091 |

**Una escala es una razón constante.** Acá no hay razón: hay cuatro razones distintas, tres de
ellas por debajo de 1,10 —una diferencia de 1 px que el ojo no distingue como jerarquía, sólo como
irregularidad—. El rango completo, de la letra más chica a la más grande, es **1,545**: el título de
una pantalla es un 55 % más grande que la línea de pie más chica, y sólo un **31 % más grande que el
párrafo que lo sigue**.

Medido en la instancia desplegada con sonda (`document`, `getComputedStyle`), sobre
`https://aplicada.somee.com/ingreso`:

```json
{ "h1": { "txt": "Ingresar al laboratorio", "fs": "17px" }, "bodyFs": "13px" }
```

Es exactamente lo que el Product Owner señaló: *«las proporciones de los tamaños de letras […] son
inadecuadas»*. Queda medido, y deja de ser una impresión.

**Capa de origen: 2 (tokens).**

---

## C-2 · El ritmo de espaciado se contradice a sí mismo. FALLA.

`app.css:97-99` lleva este comentario literal:

```
/* --- espaciado (base §2.3, escala base 4) ------------------------------ */
--space-1:  4px; --space-2:  8px; --space-3: 12px; --space-4: 14px;
--space-5: 16px; --space-6: 18px; --space-7: 20px; --space-8: 22px;
--space-9: 28px;
```

Se declara **«escala base 4»** y **tres de sus nueve pasos no son múltiplos de 4**: `14`, `18` y
`22`. Del `--space-3` al `--space-8` la progresión avanza de 2 en 2, de modo que hay seis pasos
para cubrir 10 px: seis nombres distintos para diferencias que nadie puede ver ni elegir con
criterio. La razón entre pasos cae de 2,0 a 1,1 sin regla.

Una escala de espaciado con nueve pasos y sin criterio no ordena: **le da a cada autor nueve formas
igualmente defendibles de separar dos cosas**, y esa es la causa mecánica de que la ubicación de los
controles se sienta arbitraria.

**Capa de origen: 2 (tokens).**

---

## C-3 · El título de cada pantalla se dibuja con anillo de foco. FALLA.

Medición reproducible sobre `https://aplicada.somee.com/ingreso`, recién cargada y sin ninguna
interacción:

```json
{
  "activo": "H1#.gf-mt-5",
  "sospechosos": ["H1#.gf-mt-5 -> rgb(15, 110, 86) solid 2px | matches :focus-visible = true"],
  "h1": { "txt": "Ingresar al laboratorio", "fs": "17px", "tabindex": "-1", "esActivo": true }
}
```

La cadena causal, con las tres citas:

1. `src/GeometriaFactory.Web/Routes.razor:28` — `<FocusOnNavigate RouteData="@routeData" Selector="h1" />`
   pone `tabindex="-1"` en el `h1` y lo enfoca en cada navegación. Es correcto y es lo que hace que
   un lector de pantalla anuncie la pantalla nueva.
2. `wwwroot/css/app.css:151-155` — `:focus-visible { outline: 2px solid var(--color-brand-primary); }`
   no excluye a los elementos no interactivos.
3. Chromium resuelve `:focus-visible = true` para ese foco programático, y **pinta un rectángulo
   verde alrededor del título de toda pantalla apenas carga**.

Se ve en las capturas `viv-ingreso-1440.png`, `adm-comision-1440.png`, `adm-cuentas-1440.png` y
`adm-cuentas-390.png`: es la caja verde redondeada alrededor de «Ingresar al laboratorio»,
«Entrega de la comisión» y «Cuentas de la comisión».

Lo que hace caro este defecto no es el píxel: es que **gasta el único indicador de foco que tiene el
producto en un elemento que no hace nada**. La persona que se guía por el anillo aprende a
ignorarlo.

**Capa de origen: 3 (componente/hoja).** No se corrige quitando `FocusOnNavigate` —eso rompería el
anuncio de pantalla—: se corrige acotando la regla del anillo.

---

## C-4 · Errores de consola. PASA.

Barrido con el medio A sobre `/ingreso`, `/registro-de-cuenta`, `/entrega-comision` y `/cuentas`,
en sesión anónima y en sesión de administrador. Los cuatro `.txt` cierran con `--- errores ---
(ninguno)`. Las comisiones amplían el barrido a las pantallas del alumno.

---

## C-5 · Paridad maqueta ↔ producto. FALLA parcial.

Dos divergencias ya medidas, comparando `http://127.0.0.1:18077/Ingreso.html` con
`https://aplicada.somee.com/ingreso` al mismo ancho (`maq-ingreso-1440.png` frente a
`viv-ingreso-1440.png`):

| # | La maqueta | El producto |
|---|---|---|
| 1 | Botón **«Mostrar la contraseña»** bajo el campo | No existe |
| 2 | **«Versión 1.4.2»** | **«VERSIÓN NO IDENTIFICADA»** |

La segunda no es cosmética: el sello de versión existe para poder decir *qué* se está mirando
cuando algo falla, y hoy no lo dice. El inventario completo lo levanta la comisión F, que además
tiene que determinar, divergencia por divergencia, **cuál de los dos lados manda**.

**Capa de origen: 4 y 5.**

---

## Consecuencia para la convocatoria

C-1 y C-2 ubican el defecto principal en la **capa 2 (tokens)**, no en las pantallas. Eso decide la
forma del ciclo: **el parche central se escribe una vez y se instala en los dos árboles**, y las
pantallas se revisan después para ver qué de lo que hoy parece un defecto de pantalla era, en
realidad, el token.
