# Expediente — Mesa evaluadora UX/UI del laboratorio

Ejecución de `Realizar-Ajuste-UX.md`, el **2026-09-02**, sobre `Lab-Geometria @ 42ffb80` y sobre
`https://aplicada.somee.com`.

## Por dónde entrar

| Si querés… | Leé |
|---|---|
| Ver qué cambió y por qué, en una página | [`03_actas-de-sesion/Acta-05-Cierre.md`](03_actas-de-sesion/Acta-05-Cierre.md) |
| El hallazgo más grave, y cómo se resolvió una contradicción entre tres observadores | [`03_actas-de-sesion/Acta-03-Peritaje-Del-Acuse.md`](03_actas-de-sesion/Acta-03-Peritaje-Del-Acuse.md) |
| Qué se midió antes de que nadie opinara | [`01_contrato-y-base/Chequeos-Mecanicos.md`](01_contrato-y-base/Chequeos-Mecanicos.md) |
| El plan, sus implicancias evaluadas, y qué quedó sin aplicar | [`04_plan-y-parches/Plan-De-Mejoras-Y-Sus-Implicancias.md`](04_plan-y-parches/Plan-De-Mejoras-Y-Sus-Implicancias.md) |
| Los 64 hallazgos con su evidencia | [`02_informes-de-comision/`](02_informes-de-comision/) |
| Cómo se compuso la mesa, y por qué así | [`00_marco/Mesa-UX-UI.md`](00_marco/Mesa-UX-UI.md) |
| Las capturas de antes y después | [`05_evidencia/`](05_evidencia/) |

## La mesa

Se compuso modificando `PROMPTs/Base/Mesa-Evaluadora.md` para un objeto distinto: el marco base
juzga **artefactos de especificación** y esta mesa juzga **una interfaz en ejecución**. Lo que
cambió está en la §0 del marco nuevo; lo que no se redefinió rige tal como está en el base.

**Seis comisiones de especialidad** —tipografía y escala · composición y dimensionamiento · flujo
del alumno · administración y prestabilidad · accesibilidad y comportamiento .NET/Blazor · paridad
maqueta ↔ producto— y **tres usuarios estándar** que no pueden leer código y sólo dicen dónde se
trabaron. Trabajaron **a ciegas y en paralelo**, cada uno con su propio navegador. Cinco jueces con
funciones objetivo distintas, dos moderadores que no votan, un consultor de documentación que
verifica cada cita, y un cuerpo auditor que diseña los parches y **no vota su aprobación**.

## Resultado

**64 hallazgos · 18 raíces · 47 correcciones aplicadas · 1 hallazgo refutado · 3 deudas declaradas
con motivo · 0 escaladas.**

Todo verificado con captura del mismo encuadre antes y después, 522 pruebas en verde, y los cinco
controles de `verify-visual-system.sh` conformes. Entregado en el pull request
[#183](https://github.com/hdcm-dev/Lab-Geometria/pull/183).
