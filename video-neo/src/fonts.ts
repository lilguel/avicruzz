import { continueRender, delayRender } from "remotion";
import "@fontsource/archivo-black/latin-400.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";

const handle = delayRender("Cargando fuentes");
Promise.all([
  document.fonts.load("400 40px 'Archivo Black'"),
  document.fonts.load("700 40px Montserrat"),
  document.fonts.load("800 40px Montserrat"),
  document.fonts.load("500 30px 'JetBrains Mono'"),
  document.fonts.load("700 30px 'JetBrains Mono'"),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
