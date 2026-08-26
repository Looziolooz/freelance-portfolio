import { it } from "./langs/it";
import { en } from "./langs/en";
import { sv } from "./langs/sv";

export type Lang = "it" | "en" | "sv";

// Le tre lingue vivono in moduli separati (vedi langs/): il client ne carica
// una sola, il server le vuole tutte (agent-md, llms.txt, test di parita').
// Questo file resta l'ingresso unico lato server e per i tipi.
export const dict: Record<Lang, Record<string, string>> = { it, en, sv };

export function barberiaT(lang: string): (key: string, vars?: Record<string, string | number>) => string {
  const d = dict[lang as Lang] ?? dict.en
  return (key: string, vars?: Record<string, string | number>) => {
    const val = d[key]
    if (!val) return key
    if (!vars) return val
    return val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""))
  }
}
