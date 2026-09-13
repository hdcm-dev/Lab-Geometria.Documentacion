# Contrato de entrada — Mesa UX/UI del laboratorio (ciclo 1)

Forma de `Mesa-Evaluadora.md` §2, especializada por `00_marco/Mesa-UX-UI.md`.

```yaml
objeto:
  artefacto: interfaz en ejecución
  instancia: https://aplicada.somee.com   (front Blazor Interactive Server)
  maqueta: PROG2/Geometria/Lab-Geometria/SDD/Maquetas/GeometriaFactory-Web
  sistema_visual:
    - src/GeometriaFactory.Web/wwwroot/css/app.css        (909 líneas, prefijo .gf-)
    - SDD/Maquetas/GeometriaFactory-Web/assets/css/Estilos-Maqueta.css (886 líneas, prefijo .mq-)
  version: main @ 42ffb80
  capas_derivadas: [SDD/Docs/Producto/**/03-UX-UI-DX, tests/GeometriaFactory.E2ETests]

objetivo: >
  Que las proporciones tipográficas, la ubicación de los controles y los criterios de
  dimensionamiento dejen de ser inadecuados, y que ninguna acción declarada quede sin efecto
  alcanzable desde el front.

restricciones_duras:
  - No se cambia la identidad visual: paleta, marca y familia tipográfica quedan como están.
  - No se toca `PROMPTs/` fuera de este `OUTPUTs/`.
  - No se reescribe `SDD/Docs/_legacy/` ni `SDD/Intake/_legacy/`.
  - No se tocan los contenedores `gf-api`, `gf-web`, `gf-back`, `gf-tunnel`.
  - Paridad obligatoria: todo cambio de token o de componente se aplica a las DOS hojas.
  - Sobre el laboratorio desplegado sólo se actúa en cuentas y trabajos sembrados por la mesa.

decisiones_cerradas:
  - Azul-verde de marca `#0F6E56` y familia `system-ui`: aprobadas (Línea-Base-Visual, 2026-08-11).
  - Blazor Interactive Server con la pantalla de ingreso en render estático: `Web ADR-03`.
  - Orden y nombre de las pantallas: los fija la maqueta aprobada.

fuera_de_alcance:
  - Rediseño de la identidad, cambio de framework, cambio de arquitectura.
  - El despliegue del backend (fuera de alcance del proyecto por decisión del Product Owner).
  - El visor 3D como motor: se juzga su encuadre en la pantalla, no su geometría.

umbral_de_calidad: bloquean el cierre S1 y S2
presupuesto: { ciclos_max: 2, hallazgos_max_por_comision: 7 }

medios:
  A_navegador: tools/medios/web.sh   (Chromium en contenedor; PNG + TXT con errores de consola)
  A_sonda:     script node contra el mismo contenedor, para medir geometría y tipografía
  B_movil:     tools/medios/movil.sh (moto e6, 360 px)  — recurso único, se usa serializado
  maqueta:     http://127.0.0.1:18077  (contenedor `gf-maqueta`, sólo lectura)

sin_observar:
  - Motores distintos de Chromium (Firefox y WebKit sólo por la suite E2E, no por captura).
  - Densidades y tamaños de pantalla fuera de 1440x900, 390x844 y el móvil real de 360 px.
  - Lectores de pantalla reales.
```

## Credenciales que la mesa puede usar

| Papel | Credencial | Límite |
|---|---|---|
| Administrador / docente | `fernandofilipuzzi.utn@gmail.com` · `fernando486` | Sólo acciones sobre cuentas y trabajos sembrados por la mesa |
| Alumno | los que cada comisión registre, con correo `…@mesa-ux.invalid` | — |
