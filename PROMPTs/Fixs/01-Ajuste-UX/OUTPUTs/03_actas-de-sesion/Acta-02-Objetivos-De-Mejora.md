# Acta 02 — Objetivos de mejora

**Fecha**: 2026-09-02 · **Ciclo**: 1 · **Emite**: moderador de objetivos (`Mesa-UX-UI.md` §4.6).
**No vota.** Su función es una sola: impedir que una mesa de experiencia de usuario produzca una
lista de gustos.

## 0. La regla que se aplicó para escribir esta lista

> «Que se vea mejor» no es un objetivo. Un objetivo tiene un **instrumento** —qué se mide, con qué,
> y qué valor lo da por cumplido— y ese instrumento se puede correr antes y después.

Cada objetivo de abajo salió de convertir una frase del pedido del Product Owner, o un chequeo
mecánico fallado, en algo medible. Los que no se pudieron convertir están al final, en §3, dichos
como lo que son: intenciones sin instrumento, que no gobiernan el ciclo.

## 1. Objetivos con instrumento

### `O-1` · La jerarquía tipográfica se tiene que poder ver

| | |
|---|---|
| **Nace de** | «las proporciones de los tamaños de letras […] son inadecuadas» (pedido del PO) y `C-1` |
| **Estado hoy** | cinco tamaños, cuatro razones distintas (1,214 · 1,077 · 1,083 · 1,091), rango total 1,545 |
| **Instrumento** | sonda que lee `getComputedStyle` de título, subtítulo, cuerpo, etiqueta y meta en cinco pantallas |
| **Se da por cumplido cuando** | la escala tiene **una razón declarada y constante**, y la razón entre el título de pantalla y el cuerpo es **≥ 1,5** |
| **Fundamento** | una diferencia de tamaño por debajo de ~1,1 no se lee como jerarquía sino como error de composición; es el criterio detrás de las escalas modulares de uso corriente (cuarta mayor 1,333, quinta 1,5) |

### `O-2` · El cuerpo de texto tiene que ser legible en el dispositivo desde el que se entra

| | |
|---|---|
| **Nace de** | `C-1`, y del hecho de que el alumno entra desde el teléfono |
| **Estado hoy** | cuerpo 13 px; los campos de formulario heredan ese tamaño |
| **Instrumento** | sonda sobre `/ingreso`, `/registro-de-cuenta` y `/trabajo-nuevo` a 390 px |
| **Se da por cumplido cuando** | el cuerpo base es **≥ 16 px** y **ningún campo de entrada** queda por debajo de 16 px |
| **Fundamento** | Safari en iOS **hace zoom automático** sobre un campo cuyo texto mide menos de 16 px, y deja la página desencuadrada al salir del campo. No es una preferencia estética: es un comportamiento del navegador |

### `O-3` · El ritmo de espaciado tiene que tener un criterio, y cumplirlo

| | |
|---|---|
| **Nace de** | `C-2`: la hoja se declara «escala base 4» y tres de sus nueve pasos no son múltiplos de 4 |
| **Instrumento** | `grep` de los `--space-*` y verificación aritmética |
| **Se da por cumplido cuando** | **todo paso es múltiplo de la base declarada**, y la cantidad de pasos baja lo suficiente como para que elegir entre dos sea una decisión y no una tirada |

### `O-4` · El anillo de foco tiene que significar «acá estás y acá podés actuar»

| | |
|---|---|
| **Nace de** | `C-3` |
| **Instrumento** | sonda que lee `document.activeElement` y `:focus-visible` al cargar, en seis pantallas |
| **Se da por cumplido cuando** | **ningún elemento no interactivo** queda con anillo al cargar, **y** el anuncio de pantalla nueva a la tecnología asistiva **sigue funcionando** (o sea: no se resuelve borrando `FocusOnNavigate`) |

### `O-5` · El texto largo tiene que tener una medida de línea, y el contenido un tope

| | |
|---|---|
| **Nace de** | contenido de borde a borde a 1440 px, observado en `adm-comision-1440.png` |
| **Instrumento** | sonda que mide el ancho en `ch` de los bloques de texto y el ancho del envoltorio principal |
| **Se da por cumplido cuando** | ningún bloque de texto corrido supera **~75 caracteres por renglón** y el envoltorio del contenido tiene un tope declarado |
| **Fundamento** | la medida de línea larga rompe el retorno de renglón: al final de la línea el ojo pierde cuál es la siguiente |

### `O-6` · Las acciones de una fila tienen que estar ordenadas y la destructiva separada

| | |
|---|---|
| **Nace de** | `adm-cuentas-1440.png`: «Bloquear», «Resetear la contraseña» y «Dar de baja» envueltas en dos renglones, con la destructiva pegada a las neutras |
| **Instrumento** | captura al mismo encuadre, antes y después, más medición de anchos de botón |
| **Se da por cumplido cuando** | hay **una sola jerarquía visual declarada** (primaria / secundaria / destructiva), la destructiva está **separada** de las neutras, y las acciones de filas hermanas **empiezan en la misma abscisa** |

### `O-7` · Ninguna acción declarada del administrador puede quedar sin efecto

| | |
|---|---|
| **Nace de** | el reporte del Product Owner: «los trabajos quedan en pendiente y el administrador no puede aprobarlos o retirarlos» |
| **Instrumento** | recorrido de la comisión D sobre un trabajo **sembrado por la mesa**, con captura antes y después de cada acción, **más** la suite `tests/GeometriaFactory.E2ETests` corriendo desde GitHub |
| **Se da por cumplido cuando** | cada acción que la pantalla ofrece produce un cambio observable en el listado, **y** ese recorrido está cubierto por una prueba que corre sola |

### `O-8` · La corrección no puede romper la paridad

| | |
|---|---|
| **Nace de** | `C-5` y de la regla de paridad de `Mesa-UX-UI.md` §1-bis |
| **Instrumento** | `diff` byte a byte de la capa nueva en los dos árboles, más captura del mismo encuadre en maqueta y producto |
| **Se da por cumplido cuando** | el archivo nuevo es **idéntico** en `SDD/Maquetas/…/assets/css/` y en `src/GeometriaFactory.Web/wwwroot/css/`, y las dos capturas coinciden |
| **Consecuencia de diseño** | los prefijos de clase difieren (`.mq-` en la maqueta, `.gf-` en el producto), de modo que la capa nueva tiene que **nombrar los dos** para poder ser idéntica. Es la condición que decide su forma antes de escribirla |

## 2. Lo que estos ocho objetivos NO incluyen, a propósito

- **No hay un objetivo de «rediseño».** El contrato de entrada pone la identidad visual en
  `decisiones_cerradas`. Ocho objetivos que se cumplen sin cambiar un color ni una familia
  tipográfica es exactamente el alcance que el Product Owner pidió.
- **No hay un objetivo de cobertura de pruebas.** `O-7` pide que el recorrido del administrador esté
  cubierto, no que suba un número.

## 3. Intenciones sin instrumento, dichas como tales

Van acá para que nadie las presente después como objetivos cumplidos:

- «Que sea más intuitivo.» Sólo los usuarios estándar pueden convertir esto en algo verificable, y
  lo hacen de una manera: declarando un objetivo antes de empezar y diciendo dónde se detuvieron.
  Por eso `US-1`, `US-2` y `US-3` entran al ciclo, y por eso entran **sin leer el código**.
- «Que se vea profesional.» Sin instrumento. No gobierna nada.

## 4. Momento de entrega

Este acta se le entrega a las comisiones **después** de que emitan su informe. Un objetivo conocido
de antemano sesga lo que se busca: la comisión encuentra lo que el objetivo nombra y deja de mirar
lo demás.
