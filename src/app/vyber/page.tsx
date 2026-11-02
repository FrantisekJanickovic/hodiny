"use client";

import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, FACES, type Face } from "@/components/clock";
import { Card, Chips, buttonClass, cx } from "@/components/ui";
import { LEVELS, type Level } from "@/lib/time";

const COUNTS = [5, 10, 15, 20, 30];
const STORE = "hodiny.vyber";

/** Ukážkový čas pre každý ciferník — na jednej vidno, aké ťažké to bude. */
const PREVIEW = { h: 7, m: 40 };

export default function Vyber() {
  const router = useRouter();
  const [face, setFace] = useState<Face>("12");
  const [level, setLevel] = useState<Level>("stvrte");
  const [count, setCount] = useState(10);

  // posledná voľba sa pamätá, aby dieťa nemuselo klikať to isté dookola
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const v = JSON.parse(raw) as { face?: Face; level?: Level; count?: number };
      if (FACES.some((f) => f.value === v.face)) setFace(v.face!);
      if (LEVELS.some((l) => l.value === v.level)) setLevel(v.level!);
      if (v.count && COUNTS.includes(v.count)) setCount(v.count);
    } catch {
      /* prvé spustenie alebo zakázané úložisko — ostanú predvolené hodnoty */
    }
  }, []);

  function start() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ face, level, count }));
    } catch {
      /* nevadí, voľba sa len nezapamätá */
    }
    router.push(`/trening?cifernik=${face}&uroven=${level}&pocet=${count}`);
  }

  return (
    <main className="flex-1 flex flex-col p-5 max-w-xl w-full mx-auto safe-bottom">
      <header className="flex items-center gap-2 pt-1">
        <Link href="/" aria-label="Späť na úvod" className={buttonClass("ghost", "sm")}>
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-black">Nastav si tréning</h1>
      </header>

      <div className="space-y-6 mt-6">
        <section>
          <h2 className="text-lg font-black mb-3">Aký ciferník?</h2>
          <div className="grid grid-cols-3 gap-3">
            {FACES.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={face === f.value}
                onClick={() => setFace(f.value)}
                className={cx(
                  "rounded-3xl bg-card border-2 border-b-[6px] p-2 pb-3 flex flex-col items-center gap-1 transition",
                  face === f.value ? "border-sun-deep bg-sun-soft" : "border-line hover:border-mist",
                )}
              >
                <Clock time={PREVIEW} face={f.value} size={92} />
                <span className="text-xs font-black leading-tight text-center">{f.label}</span>
                <span className="text-[11px] text-slate font-semibold leading-tight text-center">{f.hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black mb-3">Čo trénovať?</h2>
          <div className="space-y-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                aria-pressed={level === l.value}
                onClick={() => setLevel(l.value)}
                className={cx(
                  "w-full rounded-2xl border-2 border-b-4 px-4 py-3 flex items-baseline gap-2 text-left transition",
                  level === l.value ? "border-sun-deep bg-sun-soft" : "border-line bg-card hover:border-mist",
                )}
              >
                <span className="font-black text-base">{l.label}</span>
                <span className="text-sm text-slate font-semibold">napr. {l.hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black mb-3">Koľko cvičení?</h2>
          <Chips value={count} onChange={setCount} ariaLabel="Počet cvičení" options={COUNTS.map((c) => ({ value: c, label: c }))} />
        </section>

        <Card className="p-4">
          <p className="text-sm text-slate font-semibold">
            Ciferník ti ukáže čas a ty vyberieš zo štyroch možností tú správnu. Pri chybe ti appka vysvetlí, ako sa čas číta.
          </p>
        </Card>
      </div>

      <button type="button" onClick={start} className={buttonClass("sun", "xl", "mt-7")}>
        <Play className="size-6" /> Spustiť tréning
      </button>
    </main>
  );
}
