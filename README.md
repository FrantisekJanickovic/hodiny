# Koľko je hodín?

Appka na učenie hodín z ciferníka pre deti. Bez prihlasovania a bez databázy — všetko beží v prehliadači.

## Ako to funguje

1. Úvodná obrazovka s tlačidlom **Začať tréning**
2. Výber: aký ciferník (12 čísel / 4 čísla / bez čísel), čo trénovať (celé hodiny → pol → štvrte → po piatich minútach) a koľko cvičení
3. Tréning: presne vykreslený ciferník a štyri možnosti slovom (`pol desiatej`, `trištvrte na jedenásť`, `deväť hodín`…)
4. Pri chybe appka vysvetlí, kde stoja ručičky a podľa akého pravidla sa čas pomenoval
5. Na konci skóre a prehľad chýb

## Štruktúra

| Súbor                         | Čo robí                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| `src/lib/time.ts`             | slovenské pomenovanie času, úrovne, generovanie otázok a vysvetlenie chýb    |
| `src/components/clock.tsx`    | SVG ciferník s presnými uhlami ručičiek, tri varianty                        |
| `src/app/vyber/page.tsx`      | obrazovka s nastavením tréningu                                              |
| `src/app/trening/runner.tsx`  | priebeh tréningu a vyhodnotenie                                              |

Nesprávne možnosti nie sú náhodné časy, ale chyby, ktoré deti naozaj robia: o hodinu vedľa
(`pol deviatej` namiesto `pol desiatej`), opačný smer (`štvrť` ↔ `trištvrte`) a zamenené ručičky.

## Vývoj

```bash
npm install
npm run dev
```

Nasadené na Verceli, build z vetvy `main`.
