import type { Time } from "@/lib/time";
import { clockHour } from "@/lib/time";

export type Face = "12" | "4" | "0";

export const FACES: { value: Face; label: string; hint: string }[] = [
  { value: "12", label: "So všetkými číslami", hint: "1 až 12 — najjednoduchšie" },
  { value: "4", label: "So štyrmi číslami", hint: "len 12, 3, 6 a 9" },
  { value: "0", label: "Bez čísel", hint: "najväčšia výzva" },
];

const C = 120; // stred
const R_RING = 112;
const R_TICK = 100;
const R_NUM = 70; // čísla sedia pod ryskami, nie na nich

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const at = (deg: number, r: number) => ({ x: C + r * Math.cos(rad(deg)), y: C + r * Math.sin(rad(deg)) });

/**
 * Presne vykreslený ciferník. Uhly sú skutočné, nie približné:
 * hodinová ručička sa hýbe aj počas hodiny (9:30 → presne medzi 9 a 10),
 * minútová o 6° za minútu.
 */
export function Clock({ time, face = "12", size = 280, className }: { time: Time; face?: Face; size?: number; className?: string }) {
  const hour = clockHour(time.h);
  const hourDeg = (hour % 12) * 30 + time.m * 0.5;
  const minDeg = time.m * 6;
  const numbers = face === "12" ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : face === "4" ? [12, 3, 6, 9] : [];

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Ciferník, malá ručička medzi ${hour} a ${(hour % 12) + 1}, veľká ručička na ${time.m / 5 || 12}`}
    >
      {/* telo hodín */}
      <circle cx={C} cy={C} r={R_RING} fill="var(--color-card)" stroke="var(--color-sun)" strokeWidth="11" />
      <circle cx={C} cy={C} r={R_RING - 7} fill="none" stroke="var(--color-sun-soft)" strokeWidth="3" />

      {/* minútové a hodinové rysky */}
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const a = at(i * 6, R_TICK);
        const b = at(i * 6, big ? R_TICK - 12 : R_TICK - 6);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={big ? "var(--color-ink)" : "var(--color-line)"}
            strokeWidth={big ? 4 : 2}
            strokeLinecap="round"
          />
        );
      })}

      {/* čísla */}
      {numbers.map((n) => {
        const p = at(n * 30, R_NUM);
        return (
          <text
            key={n}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="23"
            fontWeight="900"
            fill="var(--color-ink)"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {n}
          </text>
        );
      })}

      {/* hodinová ručička: krátka a tlstá */}
      <g transform={`rotate(${hourDeg} ${C} ${C})`}>
        <line x1={C} y1={C + 14} x2={C} y2={C - 54} stroke="var(--color-sky)" strokeWidth="11" strokeLinecap="round" />
      </g>
      {/* minútová ručička: dlhá a tenšia */}
      <g transform={`rotate(${minDeg} ${C} ${C})`}>
        <line x1={C} y1={C + 18} x2={C} y2={C - 90} stroke="var(--color-tomato)" strokeWidth="7" strokeLinecap="round" />
      </g>

      <circle cx={C} cy={C} r="9" fill="var(--color-ink)" />
      <circle cx={C} cy={C} r="3.5" fill="var(--color-card)" />
    </svg>
  );
}

/** Pripomienka, ktorá ručička je ktorá — deti si to mýlia najčastejšie. */
export function HandLegend() {
  return (
    <div className="flex items-center justify-center gap-4 text-sm font-bold text-slate">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-[7px] w-5 rounded-full bg-sky" /> malá = hodiny
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-[5px] w-8 rounded-full bg-tomato" /> veľká = minúty
      </span>
    </div>
  );
}
