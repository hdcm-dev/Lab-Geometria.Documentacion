# Acta 05 — Cierre del ciclo 1

**Fecha**: 2026-09-02 · **Criterio de parada aplicado**: no quedan hallazgos abiertos por encima
del umbral de calidad (`S1` y `S2`), salvo los que la mesa declaró como deuda con motivo.

```yaml
cierre:
  version_final: rama `la-escala-que-se-puede-ver`, PR #183 sobre `main @ 42ffb80`
  ciclos_ejecutados: 1
  panel:
    convocados:
      - "A · tipografía, escala y densidad: 7 hallazgos, 6 procedentes"
      - "B · composición, ubicación y dimensionamiento: 7 hallazgos, 7 procedentes"
      - "C · flujo del alumno: 7 hallazgos, 6 procedentes"
      - "D · administración y prestabilidad: 7 hallazgos, 2 procedentes en este ciclo"
      - "E · accesibilidad y comportamiento: 7 hallazgos, 4 procedentes"
      - "F · paridad maqueta ↔ producto: 7 hallazgos, 1 procedente"
      - "US-1 · alumno primera vez: 7 tropiezos"
      - "US-2 · alumno que vuelve: 7 tropiezos"
      - "US-3 · docente semanal: 7 tropiezos"
    descartados:
      - "rendimiento y costo: señal presente pero ajena al objetivo; el encuadre del visor lo tomó B"
      - "seguridad y privacidad: cubierta por la suite de integración; no es lo que se pidió mirar"
      - "datos y dominio: los estados del trabajo son decisión cerrada del intake"
    ad_hoc: []
    postergados_por_cupo: []
    aporte_nulo: []
  hallazgos: { detectados: 64, procedentes: 47, aplicados: 47, revertidos: 0, refutados: 1 }
  medios_usados:
    - "Medio A · Chromium en contenedor: 9 comisiones, ~150 registros PNG + TXT"
    - "sondas propias de `getComputedStyle` y `getBoundingClientRect` en 6 comisiones"
    - "laboratorio completo levantado por la mesa: servicio de datos + artefacto publicado"
  sin_observar:
    - "Firefox y WebKit: sólo por la suite E2E, no por captura"
    - "El móvil real de 360 px: ninguna comisión llegó a usarlo; la serialización lo dejó fuera"
    - "Lectores de pantalla reales"
    - "`/mi-contrasena` a 1440 px por la comisión A: dos tiempos de espera agotados"
  deuda_declarada:
    - "R-17 · paridad y sello de versión: la maqueta declara tres huecos y una iteración 5 que no ocurrió"
    - "R-09 · E-03, el foco se pierde solo a ~1,5 s en superficies interactivas: causa en el circuito"
    - "R-18 · trece hallazgos S3/S4 sueltos, con E-06 (aviso de corte tardío) dependiendo del hospedaje"
  escaladas_pendientes: []
  capas_a_revalidar:
    - "SDD/Docs/Producto/**/03-UX-UI-DX: los wireframes describen la escala anterior"
    - "SDD/Maquetas/GeometriaFactory-Web/README.md: su iteración 5 sigue pendiente"
```

## 1. Lo que este ciclo demostró sobre su propio método

**El panel a ciegas no fue una formalidad.** Cuatro defectos los encontraron por separado un
experto que los midió y un usuario que se tropezó con ellos, y esa coincidencia es la evidencia más
fuerte que produjo el ciclo. El caso más nítido: la comisión E midió con sonda que
`document.activeElement` era el `h1` y que `:focus-visible` daba verdadero; los tres usuarios
estándar, que no vieron una línea de código, escribieron por su cuenta que el título **parecía un
campo de texto para completar**. Ninguno de los dos hallazgos, solo, habría justificado el parche
con la misma fuerza.

**La contradicción valió más que el acuerdo.** El único punto donde tres informes se contradecían
resultó ser el hallazgo `S1` del ciclo. Ninguno estaba equivocado: los tres estaban incompletos, y
lo que los reconcilió no fue deliberar sino un experimento de dos envíos que cambia **una** variable.

**Un hallazgo se refutó, y queda escrito.** `US2-02` —«el producto no señala el error de fórmula»—
es falso: el producto lo señala, y muy bien. Lo que hay debajo es peor y distinto, y sólo se
encontró porque el peritaje fue a verificar en vez de a confirmar.

**Dos parches los corrigió la captura del parche anterior**, no un razonamiento: la columna de
acciones que en retícula fija quedó en 10 px, y el `<strong>` que partió una banda en tres
columnas. Las dos veces el código era defendible leyéndolo.

## 2. Lo que no se hizo, y no por olvido

- **No se tocó la identidad visual.** Ni un color, ni la familia tipográfica, ni la marca.
- **No se inventó ninguna acción que el dominio no tiene.** `US-2` pedía corregir desde la pantalla
  del trabajo rechazado; `Work.cs:475` sólo admite editar un borrador. Lo que faltaba no era el
  botón: era **decir qué se puede hacer en cada estado**.
- **No se quitó `FocusOnNavigate`.** Habría apagado el anillo y también el anuncio de pantalla nueva
  a la tecnología asistiva. Se acotó la regla del anillo, que es donde nacía el defecto.
- **No se declaró aplicado nada sin volver a mirarlo.** Cada parche tiene su captura posterior, al
  mismo encuadre que la anterior, versionada en `evidencia/2026-09-02-mesa-ux/`.

## 3. Sobre las pruebas de extremo a extremo

El pedido incluía que existieran, corriendo desde GitHub con Playwright .NET. **Ya existían** —
`tests/GeometriaFactory.E2ETests`, `.github/workflows/e2e.yml`, tres navegadores contra el sitio
publicado— y este ciclo las usó y las amplió: un caso nuevo, `FiguraQueNoSePudoLeerTests`, con sus
tres afirmaciones **probadas en rojo** antes del arreglo, y una afirmación agregada a
`ResolucionDelTrabajoTests` que cubre el acuse de recibo.

## 4. Recomendación para el ciclo 2

En este orden, por rendimiento esperado:

1. **`E-03`**, con la medición que el jurado pidió: en qué momento del ciclo de vida del circuito se
   descarta el nodo enfocado.
2. **La iteración 5 de la maqueta**, que es lo que destraba `R-17` y con él el chequeo `C-5`. Es
   decisión del Product Owner, no de la mesa.
3. **El móvil real de 360 px**, que ninguna comisión llegó a usar y es el dispositivo desde el que
   entra el alumno.
