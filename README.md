# Lab-Geometria.Documentacion

Documentación de **Fábrica de Geometría** (`PROG2/Geometria/Lab-Geometria`): la base de
conocimiento [`ia-db/`](ia-db/README.md), los análisis de [`Analisis/`](Analisis/) y el registro
de cambios [`changelog.md`](changelog.md). `PROMPTs/` es del Product Owner: se lee, no se escribe.

---

## Entrega

### Delegación del merge al agente

Rige
[`Knowledge-Conformacion-Pull-Request-Automatico`](/IA/IA.Knowledge.Base/Knowledges/Knowledge-Conformacion-Pull-Request-Automatico.md)
2.0, §3.1.

| | |
| --- | --- |
| **Decidió** | Fernando Filipuzzi, responsable del laboratorio (PO) |
| **Fecha** | 2026-10-26 10:04 -0300 |
| **Canal** | `PROMPTs/Indexado/Crear-Indexado.md`, invocado en una conversación con el agente en Claude Code (VS Code) |
| **Literal** | «Al finalizar actualizar, changelog, stage, commits y push siguiendo este conocimiento `/IA/IA.Knowledge.Base/Knowledges/Knowledge-Conformacion-Pull-Request-Automatico.md`» |
| **SHA-256 del literal** | `16056bfac6b92f209c643df5fb6e925c4eec78f9c43ffe44c4fadba38957658b` |
| **Qué delega** | El agente que conduce la unidad abre el pull request, publica el informe con el enlace, lo fusiona si la guarda G1–G4 pasa y no hay reserva, borra la rama remota y deja `main` local al día |
| **Techo de espera de la guarda** | 20 minutos |
| **Intervalo de relectura** | 20 segundos |
| **Excepción** | Si el PO plantea un cuestionamiento particular sobre una unidad, o aparece alguna reserva de §3.4 (decisión que no le toca al agente, efecto no medido, cambio irreversible no verificado, guarda que no pasa, falla que ya estaba en `main`), el agente no fusiona: entrega el enlace y el merge vuelve al PO |
| **Revocación** | Por unidad, con sólo decirlo, sin derogar esta delegación |

El techo y el intervalo los propuso el agente, porque el PO delegó sin fijar valores; son los mismos
de `Lab-E2E.WebBlazor.Documentacion`. El PO puede cambiarlos editando esta tabla.

### Control `Verificar`

[`.github/workflows/verificar.yml`](.github/workflows/verificar.yml) corre en cada pull request y en
cada push a `main` el guion [`.github/scripts/verificar.py`](.github/scripts/verificar.py): enlaces
internos que resuelven (fuera de `PROMPTs/`) y forma de la `ia-db` según el Profile
`Knowledge-Indexing` —entrada única con manifiesto y versión, índices `NN_` con título numerado y
cabecera—. Es la corrida de controles que la guarda G3 lee.
