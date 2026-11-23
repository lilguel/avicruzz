import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Subtitles } from "./components/Subtitles";
import { C, NEON } from "./theme";
import { LEAD, SCENES, SCENE_STARTS } from "./timing";
import { Hook } from "./scenes/Hook";
import { ChapterDivider } from "./scenes/ChapterDivider";
import { StackedCards } from "./scenes/StackedCards";
import { Dashboard } from "./scenes/Dashboard";
import { ImpactQuote } from "./scenes/ImpactQuote";
import { Outro } from "./scenes/Outro";

// Orden = orden de SCENES (data/script.json). `accent` = color del subtítulo.
const ORDER: { Visual: React.FC; accent: string }[] = [
  { Visual: Hook, accent: NEON.cyan },
  { Visual: ChapterDivider, accent: NEON.blue },
  { Visual: StackedCards, accent: NEON.cyan },
  { Visual: Dashboard, accent: NEON.blue },
  { Visual: ImpactQuote, accent: NEON.blue },
  { Visual: Outro, accent: NEON.blue },
];

export const Video: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    {SCENES.map((s, i) => {
      const { Visual, accent } = ORDER[i];
      return (
        <Sequence key={s.id} from={SCENE_STARTS[i]} durationInFrames={s.frames}>
          <Visual />
          <Subtitles sceneIdx={i} accent={accent} />
          <Sequence from={LEAD}>
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
