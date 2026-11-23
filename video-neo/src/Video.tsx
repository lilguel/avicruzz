import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Subtitles } from "./components/Subtitles";
import { Transitions } from "./components/Transitions";
import { C } from "./theme";
import { LEAD, SCENES, SCENE_STARTS } from "./timing";
import { Hook } from "./scenes/Hook";
import { GenScene } from "./scenes/GenScene";
import { Summary } from "./scenes/Summary";
import { GEN1, GEN2, GEN3 } from "./scenes/gens";

const VISUALS: React.FC[] = [Hook, () => <GenScene cfg={GEN1} />, () => <GenScene cfg={GEN2} />, () => <GenScene cfg={GEN3} />, Summary];

export const Video: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.coal }}>
    {SCENES.map((s, i) => {
      const V = VISUALS[i];
      return (
        <Sequence key={s.id} from={SCENE_STARTS[i]} durationInFrames={s.frames}>
          <V />
          <Subtitles sceneIdx={i} />
          <Sequence from={LEAD}>
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        </Sequence>
      );
    })}
    <Transitions />
  </AbsoluteFill>
);
