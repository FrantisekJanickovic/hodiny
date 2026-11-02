import { Suspense } from "react";
import Runner from "./runner";

export default function TreningPage() {
  return (
    <Suspense fallback={null}>
      <Runner />
    </Suspense>
  );
}
