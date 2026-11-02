/**
 * Slovenské pomenovanie času na ciferníku.
 *
 * Systém, ktorý appka učí (rovnaký, aký sa používa v bežnej slovenčine):
 *   celá hodina        9:00  → deväť hodín
 *   štvrť              9:15  → štvrť na desať        (hovoríme smerom k ďalšej hodine)
 *   pol                9:30  → pol desiatej
 *   trištvrte          9:45  → trištvrte na desať
 *   minúty po celej    9:10  → desať minút po deviatej
 *   minúty pred celou  9:50  → desať minút pred desiatou
 */

export type Time = { h: number; m: number };

/** Číslovka v akuzatíve — „štvrť na **jednu**“, „trištvrte na **desať**“. */
const ACC: Record<number, string> = {
  1: "jednu",
  2: "dve",
  3: "tri",
  4: "štyri",
  5: "päť",
  6: "šesť",
  7: "sedem",
  8: "osem",
  9: "deväť",
  10: "desať",
  11: "jedenásť",
  12: "dvanásť",
};

/** Celá hodina — „deväť hodín“, „jedna hodina“, „dve hodiny“. */
const FULL: Record<number, string> = {
  1: "jedna hodina",
  2: "dve hodiny",
  3: "tri hodiny",
  4: "štyri hodiny",
  5: "päť hodín",
  6: "šesť hodín",
  7: "sedem hodín",
  8: "osem hodín",
  9: "deväť hodín",
  10: "desať hodín",
  11: "jedenásť hodín",
  12: "dvanásť hodín",
};

/** Radová číslovka v genitíve/lokáli — „pol **deviatej**“, „po **deviatej**“. */
const ORD_GEN: Record<number, string> = {
  1: "prvej",
  2: "druhej",
  3: "tretej",
  4: "štvrtej",
  5: "piatej",
  6: "šiestej",
  7: "siedmej",
  8: "ôsmej",
  9: "deviatej",
  10: "desiatej",
  11: "jedenástej",
  12: "dvanástej",
};

/** Radová číslovka v inštrumentáli — „pred **deviatou**“. */
const ORD_INS: Record<number, string> = {
  1: "prvou",
  2: "druhou",
  3: "treťou",
  4: "štvrtou",
  5: "piatou",
  6: "šiestou",
  7: "siedmou",
  8: "ôsmou",
  9: "deviatou",
  10: "desiatou",
  11: "jedenástou",
  12: "dvanástou",
};

const MIN_WORD: Record<number, string> = { 5: "päť", 10: "desať", 20: "dvadsať", 25: "dvadsaťpäť" };

/** Hodina na ciferníku je 1–12; 0 aj 12 znamená dvanásť. */
export const clockHour = (h: number) => ((((h % 12) + 12) % 12) || 12);
export const nextHour = (h: number) => clockHour(clockHour(h) + 1);

/** Čas slovom, tak ako ho povie dieťa. */
export function timeWords({ h, m }: Time): string {
  const hour = clockHour(h);
  const nxt = nextHour(hour);
  if (m === 0) return FULL[hour];
  if (m === 15) return `štvrť na ${ACC[nxt]}`;
  if (m === 30) return `pol ${ORD_GEN[nxt]}`;
  if (m === 45) return `trištvrte na ${ACC[nxt]}`;
  if (m < 30) return `${MIN_WORD[m]} minút po ${ORD_GEN[hour]}`;
  return `${MIN_WORD[60 - m]} minút pred ${ORD_INS[nxt]}`;
}

/** Digitálne, do vyhodnotenia: 9:05. */
export const digital = ({ h, m }: Time) => `${clockHour(h)}:${String(m).padStart(2, "0")}`;

export const sameTime = (a: Time, b: Time) => clockHour(a.h) === clockHour(b.h) && a.m === b.m;

/* ------------------------------------------------------------------ úrovne */

export type Level = "cele" | "pol" | "stvrte" | "minuty";

export const LEVELS: { value: Level; label: string; hint: string; minutes: number[] }[] = [
  { value: "cele", label: "Celé hodiny", hint: "deväť hodín", minutes: [0] },
  { value: "pol", label: "Celé a pol", hint: "pol desiatej", minutes: [0, 30] },
  { value: "stvrte", label: "Aj štvrťhodiny", hint: "trištvrte na desať", minutes: [0, 15, 30, 45] },
  { value: "minuty", label: "Aj po piatich minútach", hint: "desať minút po deviatej", minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] },
];

export const levelDef = (l: Level) => LEVELS.find((x) => x.value === l) ?? LEVELS[2];

/* ------------------------------------------------------- vysvetlenie chyby */

/** Na ktoré číslo ukazuje veľká ručička. */
const minuteTarget = (m: number) => m / 5 || 12;

/** Kde stojí malá ručička a kde veľká — to, čo si má dieťa na ciferníku všimnúť. */
export function readHands(t: Time): string[] {
  const hour = clockHour(t.h);
  const nxt = nextHour(hour);
  const small =
    t.m === 0
      ? `Malá ručička ukazuje priamo na ${hour}.`
      : t.m === 30
        ? `Malá ručička je presne v polovici medzi ${hour} a ${nxt}.`
        : `Malá ručička je medzi ${hour} a ${nxt} — bližšie k ${t.m < 30 ? hour : nxt}.`;
  const big = t.m === 0 ? "Veľká ručička stojí na 12, takže je presne celá hodina." : `Veľká ručička ukazuje na ${minuteTarget(t.m)}, to je ${t.m} minút.`;
  return [small, big];
}

/** Pravidlo, podľa ktorého sa čas pomenoval. */
export function rule(t: Time): string {
  const hour = clockHour(t.h);
  const nxt = nextHour(hour);
  if (t.m === 0) return `Celá hodina sa povie jednoducho: ${timeWords(t)}.`;
  if (t.m === 15) return `Štvrť hodiny už prešla, a tak hovoríme smerom k ďalšej hodine: štvrť na ${ACC[nxt]}.`;
  if (t.m === 30) return `Pol cesty z ${hour} do ${nxt} — a pozor, hovorí sa „pol ${ORD_GEN[nxt]}“, teda smerom k ${nxt}, nie k ${hour}.`;
  if (t.m === 45) return `Do ${nxt} chýba už len štvrť hodiny, preto trištvrte na ${ACC[nxt]}.`;
  if (t.m < 30) return `Polovica ešte neprišla, tak počítame od ${hour}: ${timeWords(t)}.`;
  return `Bližšie je už ${nxt}, tak počítame, koľko do nej chýba: ${timeWords(t)}.`;
}

/** Prečo bola zvolená možnosť zlá — pomenuje konkrétnu chybu, nie len „zle“. */
export function whyWrong(picked: Time, correct: Time): string | null {
  const ph = clockHour(picked.h);
  const ch = clockHour(correct.h);
  if (sameTime(picked, correct)) return null;

  // zámena ručičiek: malá sa čítala ako veľká
  const swapped = { h: clockHour(minuteTarget(correct.m)), m: (ch % 12) * 5 };
  if (sameTime(picked, swapped)) return "Ručičky sú vymenené: malá a krátka ukazuje hodiny, veľká a dlhá minúty.";

  // o hodinu vedľa pri pol/štvrť/trištvrte — najčastejšia chyba
  if (picked.m === correct.m && (correct.m === 30 || correct.m === 15 || correct.m === 45)) {
    const word = correct.m === 30 ? "pol" : correct.m === 15 ? "štvrť" : "trištvrte";
    return `Si o hodinu vedľa. Pri „${word}“ sa hovorí smerom k hodine, ktorá ešte len príde — teda k ${nextHour(ch)}, nie k ${ch}.`;
  }

  // štvrť ↔ trištvrte, alebo „po“ ↔ „pred“: rovnaká vzdialenosť, opačný smer
  if (ph === ch && picked.m === 60 - correct.m) return "Vzdialenosť sedí, ale smer nie — pozri sa, na ktorej strane ciferníka stojí veľká ručička.";
  if (picked.m === correct.m) return `Minúty sú správne, len hodina nie. Malá ručička je medzi ${ch} a ${nextHour(ch)}.`;
  if (ph === ch) return "Hodina je správne, pomýlila ťa veľká ručička. Každé číslo na ciferníku je 5 minút.";
  return `Toto by bolo ${digital(picked)}, na ciferníku je ale ${digital(correct)}.`;
}

/* -------------------------------------------------------------- generovanie */

export type Question = { time: Time; options: Time[]; answer: number };

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const allTimes = (minutes: number[]): Time[] => {
  const out: Time[] = [];
  for (let h = 1; h <= 12; h++) for (const m of minutes) out.push({ h, m });
  return out;
};

/** Zmysluplné nesprávne možnosti: chyby, ktoré deti naozaj robia, nie náhodné časy. */
function distractors(t: Time, minutes: number[]): Time[] {
  const hour = clockHour(t.h);
  const pool: Time[] = [
    { h: nextHour(hour), m: t.m }, // o hodinu vedľa (pol deviatej ↔ pol desiatej)
    { h: clockHour(hour - 1), m: t.m },
    { h: hour, m: t.m === 0 ? 30 : 60 - t.m }, // opačný smer (štvrť ↔ trištvrte)
    { h: clockHour(minuteTarget(t.m)), m: (hour % 12) * 5 }, // zamenené ručičky
  ];
  const idx = minutes.indexOf(t.m);
  if (idx >= 0) {
    if (minutes[idx + 1] !== undefined) pool.push({ h: hour, m: minutes[idx + 1] });
    if (minutes[idx - 1] !== undefined) pool.push({ h: hour, m: minutes[idx - 1] });
  }

  const ok = (x: Time) => minutes.includes(x.m) && !sameTime(x, t);
  const out: Time[] = [];
  for (const cand of shuffle(pool.filter(ok))) if (!out.some((x) => sameTime(x, cand))) out.push(cand);
  // doplnenie náhodnými, ak špecifické chyby nestačia (napr. pri úrovni „celé hodiny“)
  for (const cand of shuffle(allTimes(minutes))) {
    if (out.length >= 3) break;
    if (ok(cand) && !out.some((x) => sameTime(x, cand))) out.push(cand);
  }
  return out.slice(0, 3);
}

/** Zadaný počet otázok; časy sa neopakujú, kým sa nevyčerpá celá zásoba. */
export function buildQuiz(count: number, level: Level): Question[] {
  const minutes = levelDef(level).minutes;
  const bag = shuffle(allTimes(minutes));
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    if (bag.length === 0) bag.push(...shuffle(allTimes(minutes)));
    const time = bag.pop()!;
    const options = shuffle([time, ...distractors(time, minutes)]);
    out.push({ time, options, answer: options.findIndex((o) => sameTime(o, time)) });
  }
  return out;
}
