import { continueRender, delayRender } from "remotion";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/montserrat/latin-900.css";
import "@fontsource/jetbrains-mono/latin-500.css";

const handle = delayRender("Cargando fuentes");
Promise.all([
  document.fonts.load("600 40px Montserrat"),
  document.fonts.load("700 40px Montserrat"),
  document.fonts.load("800 40px Montserrat"),
  document.fonts.load("900 40px Montserrat"),
  document.fonts.load("500 30px 'JetBrains Mono'"),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
