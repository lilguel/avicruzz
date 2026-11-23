import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { Keywords } from "./components/Keywords";
import { Captions } from "./components/Captions";
import { GenChip } from "./components/GenChip";
import { Transitions } from "./components/Transitions";
import { COLORS, LAYOUT, W } from "./theme";
import { LEAD, SCENES, SCENE_STARTS } from "./timing";
import { soft } from "./anim";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";

// ======= Configuración por escena (color de acento y generación) =======
const CONFIG: { accent: string; gen?: 1 | 2 | 3; Visual: React.FC }[] = [
  { accent: COLORS.white, Visual: Scene1 },
  { accent: COLORS.g1, gen: 1, Visual: Scene2 },
  { accent: COLORS.g2, gen: 2, Visual: Scene3 },
  { accent: COLORS.g3, gen: 3, Visual: Scene4 },
  { accent: COLORS.white, Visual: Scene5 },
];

const SceneShell: React.FC<{ idx: number }> = ({ idx }) => {
  const f = useCurrentFrame();
  const { accent, gen, Visual } = CONFIG[idx];
  const bgAccent = accent === COLORS.white ? COLORS.g2 : accent;
  const capAccent = accent === COLORS.white ? COLORS.g1 : accent;
  const intro = soft(f, 0);
  return (
    <AbsoluteFill>
      <Background accent={bgAccent} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: LAYOUT.stageTop,
          width: W,
          height: LAYOUT.stageH,
          transform: `scale(${0.94 + 0.06 * intro})`,
          transformOrigin: "50% 50%",
        }}
      >
        <Visual />
      </div>
      {gen && <GenChip gen={gen} />}
      <Keywords sceneIdx={idx} accent={bgAccent} />
      <Captions sceneIdx={idx} accent={capAccent} />
      <Sequence from={LEAD}>
        <Audio src={staticFile(SCENES[idx].audio)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    {SCENES.map((s, i) => (
      <Sequence key={s.id} from={SCENE_STARTS[i]} durationInFrames={s.frames}>
        <SceneShell idx={i} />
      </Sequence>
    ))}
    <Transitions />
  </AbsoluteFill>
);
