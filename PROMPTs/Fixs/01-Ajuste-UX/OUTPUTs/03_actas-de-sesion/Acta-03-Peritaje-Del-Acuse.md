# Acta 03 — Peritaje: la contradicción entre `US-1`, `US-2` y la comisión C

**Fecha**: 2026-09-02 · **Ciclo**: 1 · **Convocado por**: el relator, al detectar una contradicción
**entre informes** (marco base §4.2: las contradicciones entre especialistas se elevan como ítem
separado). **Perito**: el orquestador de la mesa, que **no vota**.

## 1. La contradicción

| Quién | Qué afirmó |
|---|---|
| Comisión C, a 1440 px | «Previsualizar **dibuja el cubo**»; el recorrido completo cierra bien |
| `US-1`, a 390 px | «Me dice que dibujó y **no dibuja**»: «Se dibujaron las 1 figuras» con el área vacía |
| `US-2`, a 1440 px | Dejó **a propósito** un cubo de lado 4 con volumen 48 y el producto contestó «El texto se interpretó y **no salió ninguna observación**» |

Tres agentes independientes, dos afirmando que el producto no hace lo que promete y uno afirmando
que sí. Ninguno de los tres podía tener razón sobre el otro sin medirlo, así que la mesa midió.

## 2. Qué dice el código antes de mirar la pantalla

`src/GeometriaFactory.Infrastructure/Figures/LocalFigureValidator.cs:311-337`, la regla que decide
si hay discrepancia, con su comentario literal:

```
/// SIN LOS DOS VALORES NO HAY DISCREPANCIA QUE DECLARAR. Si el texto no trae el valor, o si el
/// tipo no permite derivarlo con lo que el texto trae, **no se compara**: una advertencia
/// contra un valor que nadie calculó afirmaría una discrepancia inventada.
private static bool Discrepant(double? declared, double? derived) =>
    declared is not null && derived is not null && Math.Abs(...) > ComparisonTolerance;
```

Y `:391`, de dónde sale la arista del cubo:

```
private static double? CubeEdge(IReadOnlyList<Component> components, double? length) =>
    length ?? components.FirstOrDefault(c => c.Role == ComponentRole.Face)?.DeclaredLength;
```

La regla es **correcta y está bien fundada**. Un cubo cuyo texto no trae `Largo` ni `Caras` no tiene
arista derivable, de modo que no hay con qué comparar el volumen. Nada de esto es un defecto.

**La pregunta que el peritaje tiene que contestar es otra**: qué le dice el producto a la persona
cuando no pudo derivar nada.

## 3. El experimento

Cuenta sembrada por el perito: `perito-574944bd@mesa-ux.invalid`. **Dos envíos, con la misma figura
mal declarada**, cambiando únicamente las claves del texto. Misma pantalla, mismo ancho, misma
sesión, con un minuto de diferencia.

| | Envío A — claves del contrato | Envío B — claves inventadas |
|---|---|---|
| Texto | `{"Tipo":"Cubo","Caras":[…6 caras de Largo 3…],"Area":54,"Volumen":99}` | `{"Tipo":"Cubo","Lado":4,"Area":96,"Volumen":48}` |
| Volumen correcto | 27 | 64 |
| Volumen declarado | **99** (mal) | **48** (mal) |
| Identificador | `ef8c76b8-cdd6-400c-a162-8818056ea9e7` | `5c65ebf4-7589-458c-8166-a8e8d62d4e4a` |
| **Escena** | **dibuja el cubo** | **vacía** |
| **Observaciones** | «Tu programa declara **99.00** · La geometría da **27.00**» | «El texto se interpretó y **no salió ninguna observación**» |
| **Acuse al pie** | «Se dibujaron las 1 figuras del trabajo.» | «Se dibujaron las 1 figuras del trabajo.» |
| Errores de consola | ninguno | ninguno |
| `canvas` | 809×606, contexto `webgl` | 809×606, contexto `webgl` |

Evidencia versionada: `05_evidencia/peritaje/p-20-visor-contrato-1440.png`,
`p-20-visor-inventadas-1440.png`, y sus gemelas a 390 px; guiones `p-alumno.js`, `p-claves.js`,
`p-visor.js`.

## 4. Veredicto del peritaje

**El producto hace lo que promete, y lo hace muy bien, cuando puede leer la figura.** El envío A es
el valor central del producto funcionando: pone el número del alumno al lado del número de la
geometría, y el cubo se dibuja. Nada de lo que el ciclo proponga puede poner eso en riesgo.

**Lo que falla es lo otro, y es una sola cosa dicha en tres lugares**: el producto **no distingue
«lo verifiqué y está bien» de «no pude verificar nada»**. Con la figura ilegible:

1. **Interpretación** — dice «El texto se interpretó y quedó entregado», sin decir que de esa figura
   no leyó ninguna dimensión.
2. **Observaciones** — dice «no salió ninguna observación», que la persona lee como «mis números
   están bien». `US-2` lo dijo exactamente así: *«las dos cajas se contradicen y no sé a cuál
   creerle»*.
3. **Acuse del dibujo** — **afirma haber dibujado una figura que no dibujó.**

El tercero es el más grave porque es literalmente falso, y porque es el caso que el trabajo previo
`la-pantalla-no-afirma-lo-que-no-dibujo` (fusionado el 2026-09-02) declaraba resuelto. **No lo está
para esta entrada**: el contador cuenta figuras del texto, no mallas puestas en la escena.

## 5. Consecuencias para los informes

| Hallazgo | Qué le pasa |
|---|---|
| `US2-02` «el producto no señala el error de fórmula» | **Refutado tal como está redactado.** El envío A lo señala. Se reformula: *el producto no avisa cuando no pudo verificar.* |
| `US1-05` «me dice que dibujó y no dibuja» | **Confirmado, y ampliado**: no depende del ancho —ocurre igual a 1440 px—, depende de que la figura sea ilegible. |
| `US2-04` «el área vacía y abajo dice que dibujó 2 figuras» | **Confirmado**, misma raíz. |
| `C-01` «la pantalla no dice qué formato espera» | **Confirmado y ascendido**: no es una molestia de redacción. Es la causa de los tres anteriores. Un alumno que inventa las claves recibe tres señales de éxito y ningún aviso. |
| Comisión C, «el visor dibuja» | **Confirmado.** C usó el texto de `samples/`, que trae las claves del contrato. |

**Nace un hallazgo del peritaje**, que ninguna comisión podía emitir sola porque cada una vio un
tercio:

> **`P-01` · S1 · E1 · capa 5 (superficie) y capa 3 (caso de uso).** Ante una figura de la que no se
> pudo leer ninguna dimensión, el producto emite tres señales de éxito —interpretación, ausencia de
> observaciones y acuse de dibujo— y ninguna de aviso; el acuse de dibujo, además, **afirma un hecho
> falso**. El valor central declarado del producto —volver visible el error de fórmula— queda
> silenciosamente desactivado justo para el alumno que más lo necesita: el que todavía no acertó el
> formato.

## 6. Una nota sobre el método, porque se pagó cara

Ninguna comisión se equivocó. Cada una midió bien lo que tenía delante y **las tres conclusiones
eran incompatibles porque las tres estaban incompletas**. Lo que las reconcilió no fue discutir:
fue un experimento de dos envíos que cambia **una sola** variable. El marco base §4.2 pide
exactamente esto —elevar la contradicción como ítem separado en vez de dejar que el jurado elija
un informe— y esta es la primera vez en el ciclo que hizo falta.
