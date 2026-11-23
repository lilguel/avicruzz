# Video neobrutalista · "3 generaciones: lo bueno y lo malo" (Remotion)

1080×1920 · 60 fps · ~47 s · voz `es-MX-JorgeNeural` (edge-tts).

```
data/script.json     ← GUION (texto de voz por escena y velocidad)
data/timing.json     ← generado: duración y tiempo de cada palabra
TIEMPOS.md           ← generado: tabla de tiempos por escena
src/theme.ts         ← PALETA (carbón/papel/violeta/lima/tinta), fuentes, zona segura
src/scenes/gens.ts   ← CONTENIDO de las 3 generaciones: terminal, ✓ lo bueno, ✗ lo malo, medidor de IA
src/scenes/Hook.tsx · GenScene.tsx · Summary.tsx   ← escenas
src/components/      ← Backdrop (halftone+cuadrícula), ui (tarjetas, terminal, sello), Subtitles, Transitions
```

```bash
npm install && pip install edge-tts
npm run voice     # regenera audio + tiempos
npm run studio    # vista previa
npm run render    # → out/neo-generaciones.mp4
```
Los ítems ✓/✗ y los cambios de fondo se enganchan a palabras de la narración (`at: "palabra"` en `gens.ts`), así que siguen sincronizados si cambias el guion. Si no hay Chrome: `REMOTION_BROWSER=/ruta/chrome-headless-shell`.
