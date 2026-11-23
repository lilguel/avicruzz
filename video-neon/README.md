# Dark Neon Explainer · "3 generaciones: lo bueno, lo malo y mi opinión" (Remotion)

1080×1920 · 60 fps · ~47 s · voz `es-MX-JorgeNeural` (edge-tts).

| Escena | Archivo |
|---|---|
| 1 Gancho (líneas + orbes) | `src/scenes/Hook.tsx` |
| 2 Divisor de capítulo (blanco) | `src/scenes/ChapterDivider.tsx` |
| 3 Tarjetas apiladas | `src/scenes/StackedCards.tsx` (contenido: `CARDS`) + `src/components/DeckCard.tsx` |
| 4 Dashboard + cámara + focus box | `src/scenes/Dashboard.tsx` (datos: `GROUPS`, cámara: `cams`, cajas: `boxes`) |
| 5 Frase de impacto (blur) | `src/scenes/ImpactQuote.tsx` |
| 6 Outro / CTA | `src/scenes/Outro.tsx` (marca: `BRAND` en `src/theme.ts`) |

Colores: `src/theme.ts` (`NEON`, `C`). Guion y velocidad de voz: `data/script.json`.
Los cambios de tarjeta, los movimientos de cámara y los recuadros se enganchan a palabras de la narración (`wordFrame(escena, "palabra")`), así siguen sincronizados si cambias el texto.

```bash
npm install && pip install edge-tts
npm run voice     # regenera audio + tiempos
npm run studio    # vista previa
npm run render    # → out/neon-generaciones.mp4
```
Los valores del dashboard son una estimación ilustrativa (opinión), y así se indica en pantalla.
