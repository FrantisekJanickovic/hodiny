"use client";

import { ArrowRight, Check, House, RotateCcw, Settings2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Clock, FACES, HandLegend, type Face } from "@/components/clock";
import { Card, buttonClass, cx } from "@/components/ui";
import { playAnswer } from "@/lib/sounds";
import { LEVELS, type Level, type Question, type Time, buildQuiz, digital, levelDef, readHands, rule, timeWords, whyWrong } from "@/lib/time";

const PRAISE = ["Výborne!", "Presne tak!", "Správne!", "Paráda!", "To sedí!", "Bravó!", "Skvelé!"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const MARKS = ["A", "B", "C", "D"];

type Miss = { time: Time; picked: Time };

/**
 * Runner číta nastavenie z adresy a Session drží priebeh tréningu.
 * Session je zakľúčovaná podpisom nastavenia, takže nový tréning nikdy nepokračuje v starom.
 */
export default function Runner() {
  const params = useSearchParams();
  const face = (FACES.find((f) => f.value === params.get("cifernik"))?.value ?? "12") as Face;
  const level = (LEVELS.find((l) => l.value === params.get("uroven"))?.value ?? "stvrte") as Level;
  const count = Math.min(50, Math.max(1, Number(params.get("pocet")) || 10));
  const sig = `${face}|${level}|${count}`;
  return <Session key={sig} face={face} level={level} count={count} />;
}

function Session({ face, level, count }: { face: Face; level: Level; count: number }) {
  const [round, setRound] = useState(0); // „trénovať znova“ vyrobí nové otázky
  const [quiz, setQuiz] = useState<Question[]>(() => buildQuiz(count, level));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [misses, setMisses] = useState<Miss[]>([]);
  const [done, setDone] = useState(false);

  const q = quiz[index];

  function answer(i: number) {
    if (picked !== null) return;
    const correct = i === q.answer;
    setPicked(i);
    playAnswer(correct);
    if (!correct) setMisses((m) => [...m, { time: q.time, picked: q.options[i] }]);
  }

  function next() {
    if (index + 1 >= quiz.length) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  function again() {
    setQuiz(buildQuiz(count, level));
    setIndex(0);
    setPicked(null);
    setMisses([]);
    setDone(false);
    setRound(round + 1);
  }

  if (done) return <Summary count={quiz.length} misses={misses} face={face} level={level} onAgain={again} />;

  const correct = picked === q.answer;

  return (
    <main className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto safe-bottom" key={round}>
      <header className="flex items-center gap-3 pt-1">
        <div className="flex-1">
          <div className="h-2.5 rounded-full bg-line overflow-hidden">
            <div className="h-full rounded-full bg-sun transition-[width] duration-300" style={{ width: `${(index / quiz.length) * 100}%` }} />
          </div>
        </div>
        <span className="text-sm font-black text-slate tabular-nums">
          {index + 1} / {quiz.length}
        </span>
        <Link href="/" aria-label="Ukončiť tréning" className="inline-flex items-center justify-center size-8 rounded-full text-mist hover:text-ink hover:bg-ink/5">
          <X className="size-4" />
        </Link>
      </header>

      <div className="flex flex-col items-center mt-3">
        <Clock time={q.time} face={face} size={252} className={cx(picked !== null && (correct ? "anim-pop" : "anim-shake"))} />
        <div className="mt-2">
          <HandLegend />
        </div>
      </div>

      <h1 className="text-center text-xl font-black mt-4 mb-3">Koľko je hodín?</h1>

      <div className="space-y-2.5">
        {q.options.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => answer(i)}
            disabled={picked !== null}
            className={cx(
              "choice",
              picked !== null && i === q.answer && "choice-ok",
              picked === i && i !== q.answer && "choice-bad",
              picked !== null && i !== q.answer && picked !== i && "choice-dim",
            )}
          >
            <span className="choice-mark">{picked !== null && i === q.answer ? <Check className="size-5" /> : picked === i ? <X className="size-5" /> : MARKS[i]}</span>
            {timeWords(o)}
          </button>
        ))}
      </div>

      {picked !== null && (
        <div className="anim-rise mt-4">
          {correct ? (
            <p className="text-center text-xl font-black text-leaf">{pick(PRAISE)}</p>
          ) : (
            <Card className="p-4 border-tomato/30 bg-tomato-soft/40">
              <p className="text-lg font-black text-tomato">Toto nebolo ono.</p>
              <p className="font-bold mt-1">
                Na ciferníku je {digital(q.time)} — {timeWords(q.time)}.
              </p>
              <ul className="mt-2 space-y-1 text-[15px] text-ink-soft font-semibold">
                {readHands(q.time).map((l) => (
                  <li key={l}>· {l}</li>
                ))}
                <li>· {rule(q.time)}</li>
              </ul>
              <p className="mt-2 text-[15px] font-bold text-ink">{whyWrong(q.options[picked], q.time)}</p>
            </Card>
          )}
          <button type="button" onClick={next} className={buttonClass("primary", "xl", "mt-4")} autoFocus>
            {index + 1 >= quiz.length ? "Vyhodnotenie" : "Ďalšie"} <ArrowRight className="size-5" />
          </button>
        </div>
      )}
    </main>
  );
}

function Summary({
  count,
  misses,
  face,
  level,
  onAgain,
}: {
  count: number;
  misses: Miss[];
  face: Face;
  level: Level;
  onAgain: () => void;
}) {
  const ok = count - misses.length;
  const score = Math.round((ok / count) * 100);
  const title = score === 100 ? "Všetko správne!" : score >= 80 ? "Veľmi dobre!" : score >= 50 ? "Dobrý základ." : "Toto si ešte potrénujeme.";
  const note =
    score === 100
      ? "Ciferník ti už nič neskrýva."
      : misses.length === 1
        ? "Jedna chyba, nič hrozné — pozri si ju nižšie."
        : `Chýb bolo ${misses.length}. Pozri si ich nižšie a skús to znova.`;

  return (
    <main className="flex-1 flex flex-col p-5 max-w-md w-full mx-auto safe-bottom">
      <div className="text-center pt-6 anim-rise">
        <p className="text-6xl font-black tabular-nums">{score} %</p>
        <h1 className="text-2xl font-black mt-2">{title}</h1>
        <p className="text-slate font-semibold mt-1">
          {ok} z {count} správne. {note}
        </p>
      </div>

      {misses.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-black mb-3">Čo sa nepodarilo</h2>
          <div className="space-y-3">
            {misses.map((m, i) => (
              <Card key={i} className="p-3 flex items-center gap-3">
                <Clock time={m.time} face={face} size={104} className="shrink-0" />
                <div className="min-w-0">
                  <p className="font-black text-leaf leading-tight">{timeWords(m.time)}</p>
                  <p className="text-sm text-slate font-semibold mt-0.5">
                    tvoja odpoveď: <span className="text-tomato">{timeWords(m.picked)}</span>
                  </p>
                  <p className="text-sm text-ink-soft font-semibold mt-1 leading-snug">{whyWrong(m.picked, m.time)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="mt-7 space-y-2.5">
        <button type="button" onClick={onAgain} className={buttonClass("sun", "xl")}>
          <RotateCcw className="size-5" /> Trénovať znova
        </button>
        <div className="flex gap-2.5">
          <Link href="/vyber" className={buttonClass("outline", "lg", "flex-1")}>
            <Settings2 className="size-5" /> Nastavenie
          </Link>
          <Link href="/" className={buttonClass("outline", "lg", "flex-1")}>
            <House className="size-5" /> Domov
          </Link>
        </div>
        <p className="text-center text-xs text-slate font-semibold pt-1">
          {levelDef(level).label} · {FACES.find((f) => f.value === face)?.label}
        </p>
      </div>
    </main>
  );
}
