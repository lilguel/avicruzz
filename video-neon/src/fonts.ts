import { continueRender, delayRender } from "remotion";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";

const handle = delayRender("Cargando fuentes");
Promise.all([
  document.fonts.load("500 40px 'Plus Jakarta Sans'"),
  document.fonts.load("700 40px 'Plus Jakarta Sans'"),
  document.fonts.load("800 40px 'Plus Jakarta Sans'"),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
