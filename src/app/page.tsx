import { Play } from "lucide-react";
import Link from "next/link";
import { Clock, HandLegend } from "@/components/clock";
import { buttonClass } from "@/components/ui";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-5 safe-bottom">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-black leading-tight">Koľko je hodín?</h1>
        <p className="text-slate font-semibold mt-2">Nauč sa čítať ciferník — celé hodiny, štvrť, pol aj trištvrte.</p>

        <div className="my-7 flex justify-center">
          <Clock time={{ h: 10, m: 10 }} face="12" size={288} className="drop-shadow-sm" />
        </div>

        <HandLegend />

        <Link href="/vyber" className={buttonClass("sun", "xl", "mt-8")}>
          <Play className="size-6" /> Začať tréning
        </Link>
      </div>
    </main>
  );
}
