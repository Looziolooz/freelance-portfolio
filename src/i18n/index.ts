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

export const LANGS = ["it", "en", "sv"] as const;

export function isLang(v: string | null | undefined): v is Lang {
  return !!v && (LANGS as readonly string[]).includes(v);
}

/**
 * Which language a page should open in, and whether that choice is worth
 * remembering.
 *
 * Two explicit signals, strongest first: `?lang=` carried by the link itself,
 * then the choice saved on a previous visit. Sending looz.design to a Swedish
 * client used to mean sending the Italian site, because the language lived only
 * in localStorage and never in the URL; `?lang=sv` makes the link carry it.
 *
 * A parameter someone put in a link is still an EXPLICIT choice, so this does
 * not reintroduce the navigator.language auto-detect that made Googlebot index
 * English copy on pages declaring lang="it".
 *
 * `persist` is true only for the URL signal: opening a shared link also sets the
 * preference, so the recipient's next visit to a bare looz.design stays in the
 * language the link opened. A saved value needs no rewrite.
 */
export function resolveLang(
  fromUrl: string | null | undefined,
  saved: string | null | undefined,
): { lang: Lang; persist: boolean } | null {
  if (isLang(fromUrl)) return { lang: fromUrl, persist: true };
  if (isLang(saved)) return { lang: saved, persist: false };
  return null;
}
