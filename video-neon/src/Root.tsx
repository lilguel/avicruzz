import { Composition } from "remotion";
import "./fonts";
import { Video } from "./Video";
import { FPS, TOTAL_FRAMES } from "./timing";
import { H, W } from "./theme";

export const Root = () => (
  <Composition id="Video" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
