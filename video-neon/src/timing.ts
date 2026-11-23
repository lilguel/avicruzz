import timing from "../data/timing.json";

export type Word = { text: string; display: string; start: number; end: number };
export type Keyword = {
  text: string;
  anchor: string;
  color: "g1" | "g2" | "g3" | "white" | "rainbow";
  at: number;
  append?: boolean;
};
export type SceneTiming = {
  id: string;
  title: string;
  audio: string;
  audioSeconds: number;
  frames: number;
  words: Word[];
  keywords: Keyword[];
};

export const FPS: number = timing.fps;
export const LEAD: number = Math.round(timing.leadSeconds * FPS);
export const SCENES = timing.scenes as unknown as SceneTiming[];
export const TOTAL_FRAMES: number = timing.totalFrames;

export const SCENE_STARTS: number[] = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].frames);
  return acc;
}, []);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]/g, "");

/** Frame (local a la escena) en que se empieza a decir una palabra de la narración. */
export function wordFrame(sceneIdx: number, word: string, nth = 0): number {
  const target = norm(word);
  const hits = SCENES[sceneIdx].words.filter((w) => norm(w.text) === target);
  const w = hits[nth];
  if (!w) throw new Error(`Palabra "${word}" (#${nth}) no está en la escena ${sceneIdx + 1}`);
  return LEAD + Math.round(w.start * FPS);
}
