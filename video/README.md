# Video "3 generaciones de ingenieros de software" (Remotion)

Video vertical 1080×1920 · 30 fps · ~86 s · voz `es-MX-JorgeNeural` (edge-tts).

## Estructura
```
data/script.json      ← GUION: textos de voz, velocidad, palabras clave en pantalla (editar aquí)
data/timing.json      ← generado: duración y tiempo de cada palabra por escena
TIEMPOS.md            ← generado: tabla de tiempos por escena (por si grabas tu propia voz)
scripts/generate_voice.py  ← genera audio + tiempos con edge-tts
public/audio/*.mp3    ← una pista por escena
src/theme.ts          ← COLORES, fuentes y zonas de layout
src/Video.tsx         ← ensamblado: fondo, escena, chip, palabras clave, subtítulos, audio
src/scenes/Scene1-5   ← ilustraciones animadas (SVG) de cada escena
src/components/       ← Keywords (texto cinético), Captions, Transitions, Icons, Background
```

## Flujo de trabajo
```bash
npm install
pip install edge-tts
npm run voice          # regenera audio + tiempos (si cambias textos o voz)
npm run studio         # vista previa interactiva
npm run render         # → out/tres-generaciones.mp4
```
Si no tienes Chrome para Remotion: `REMOTION_BROWSER=/ruta/a/chrome-headless-shell npm run render`.

## Cambios típicos
- **Colores**: `src/theme.ts` (`g1` ámbar, `g2` cian, `g3` violeta, `bg`).
- **Texto de la voz / velocidad / voz distinta**: `data/script.json` (`text`, `rate`) o `python3 scripts/generate_voice.py --voice es-BO-MarceloNeural`, luego `npm run render`. La duración de cada escena se ajusta sola al audio.
- **Palabras clave en pantalla**: `keywords` en `data/script.json`; `anchor` = palabra de la narración en la que aparece; `color` = g1/g2/g3/white/rainbow; `append: true` la apila con la anterior.
- **Animaciones por escena**: `src/scenes/SceneN.tsx` (los momentos se enganchan a palabras con `wordFrame(escena, "palabra")`, así siguen sincronizados si cambia la voz).
- **Zona segura TikTok**: `LAYOUT` en `src/theme.ts` (todo queda por encima de y≈1450 px).
