import { GenConfig } from "./GenScene";

// ============ CONTENIDO DE LAS 3 GENERACIONES (editar textos aquí) ============
// `at` = palabra de la narración en la que aparece cada ítem (data/script.json)

export const GEN1: GenConfig = {
  sceneIdx: 1,
  step: 1,
  pill: "SIN IA",
  introTitle: "A MANO",
  tones: ["paper", "violet", "coal"],
  meter: { value: 0, note: "SOLO LIBROS, FOROS Y PACIENCIA" },
  win: {
    intro: { title: "gen1.sh", lines: [
      { t: "$ man python", k: "cmd" },
      { t: "$ buscar 'error 500'", k: "cmd" },
      { t: "…foro de 2009: sin respuesta", k: "out" },
    ] },
    good: { title: "bueno.sh", lines: [
      { t: "$ git blame main.py", k: "cmd" },
      { t: "✓ ahora sí entiendo cómo funciona", k: "ok" },
    ] },
    bad: { title: "malo.sh", lines: [
      { t: "$ sleep 6h  # buscando en foros", k: "cmd" },
      { t: "✗ 1 error · 6 horas perdidas", k: "err" },
    ] },
  },
  good: [
    { text: "FUNDAMENTOS SÓLIDOS", at: "fundamentos" },
    { text: "PACIENCIA PARA DEPURAR", at: "paciencia" },
  ],
  bad: [
    { text: "LENTITUD", at: "lentitud" },
    { text: "HORAS PERDIDAS EN FOROS", at: "horas" },
  ],
};

export const GEN2: GenConfig = {
  sceneIdx: 2,
  step: 2,
  pill: "CON IA",
  introTitle: "IA EN EL BOLSILLO",
  tones: ["coal", "paper", "violet"],
  meter: { value: 0.6, note: "UN ASISTENTE EN CADA TAREA" },
  win: {
    intro: { title: "gen2.chat", lines: [
      { t: "> resuelve mi tarea", k: "cmd" },
      { t: "✓ listo en 3 segundos", k: "ok" },
    ] },
    good: { title: "bueno.chat", lines: [
      { t: "> explícame por qué", k: "cmd" },
      { t: "✓ semanas de teoría → 3 segundos", k: "ok" },
    ] },
    bad: { title: "malo.chat", lines: [
      { t: "> hazlo por mí (copiar)", k: "cmd" },
      { t: "✗ entregado… sin entender nada", k: "err" },
    ] },
  },
  good: [
    { text: "ENTIENDES EN SEGUNDOS", at: "entiendes" },
    { text: "ANTES: SEMANAS", at: "semanas" },
  ],
  bad: [
    { text: "COPIAR SIN ENTENDER", at: "copiar" },
    { text: "ESCUELA DE OTRA ÉPOCA", at: "escuela" },
  ],
};

export const GEN3: GenConfig = {
  sceneIdx: 3,
  step: 3,
  pill: "IA NATIVA",
  introTitle: "IA DESDE EL INICIO",
  tones: ["violet", "paper", "coal"],
  meter: { value: 1, note: "LA IA ESTÁ EN CADA CLASE" },
  win: {
    intro: { title: "gen3.sh", lines: [
      { t: "$ ai design --system", k: "cmd" },
      { t: "✓ 6 módulos en paralelo", k: "ok" },
    ] },
    good: { title: "bueno.sh", lines: [
      { t: "$ review --verify", k: "cmd" },
      { t: "✓ diseñado · verificado · dirigido", k: "ok" },
    ] },
    bad: { title: "malo.sh", lines: [
      { t: "$ ai deploy --trust", k: "cmd" },
      { t: "✗ error… dicho con total seguridad", k: "err" },
    ] },
  },
  good: [
    { text: "DISEÑAS SISTEMAS", at: "diseñas" },
    { text: "VERIFICAS LO QUE PRODUCE", at: "verificas" },
    { text: "DIRIGES", at: "diriges" },
  ],
  bad: [
    { text: "NADIE SABE QUÉ ENSEÑAR", at: "nadie" },
    { text: "LA IA SE EQUIVOCA SEGURA", at: "equivoca" },
  ],
};
