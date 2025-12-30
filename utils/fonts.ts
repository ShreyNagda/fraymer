import {
  Pacifico,
  DM_Serif_Display,
  Dancing_Script,
  Inter,
  Roboto,
  Roboto_Condensed,
  Montserrat_Alternates,
} from "next/font/google";

export const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

export const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const roboto_condensed = Roboto_Condensed({
  weight: "400",
  subsets: ["latin"],
});

export const monteserrat = Montserrat_Alternates({
  weight: "400",
  subsets: ["latin"],
});

export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const dmSerif = DM_Serif_Display({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
});

export const dancingScript = Dancing_Script({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const fontList = [
  { name: "Dancing Script", font: dancingScript, secondary: roboto },
  { name: "Pacifico", font: pacifico, secondary: inter },
  { name: "DM Serif", font: dmSerif, secondary: dmSerif },
  { name: "Roboto", font: monteserrat, secondary: roboto_condensed },
];
export default fontList;
