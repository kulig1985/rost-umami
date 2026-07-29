# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Elsődlegesen egészség-fókuszú vásárlók: olyanok, akiknek a táplálkozás, emésztés,
teltségérzet és a tudatos étkezés a fő szempont. Magyar nyelvű közönség. A vásárlás
tipikus helyzete: egy egyedülálló szakácskönyv előrendelése online, mobilon vagy
laptopon, felfedezés/ajánlás nyomán. Az ajándékvásárlás másodlagos, de reális eset.

## Product Purpose

Egyetlen termék: a "Rost és Umami" szakácskönyv webshopja. A cél az előrendelés
ösztönzése és a könyv megértetése: miért érdemes megvenni. Siker = előrendelés.

## Positioning

Íz-tudomány + egészség. A könyv tudatosan párosítja a **rostot** (emésztés,
teltségérzet, tápláló növényi alapok) és az **umamit** (az ötödik íz, a mély, sós-
savas telítettség), hogy az egészséges étel egyszerre legyen tápláló és igazán finom.
Nem nosztalgikus/rusztikus recepteskönyv, hanem modern, kicsit "nerd", tudományosan
megalapozott megközelítés. Egy szomszédos termék nem másolhatja ezt a rost+umami
kettős mechanizmust mint fő ígéretet.

## Operating Context

Hydrogen (React Router 7) storefront, Shopify Storefront API. A főoldal a Persuade
felület: egyetlen termék hero + előrendelés CTA + betekintés a könyvbe. Termékoldal,
statikus oldalak (pages), kosár-fiók. Magyar UI.

## Capabilities and Constraints

- Egytermékes bolt, handle: `rost-es-umami`. Előrendelés = termékoldalra / kosárba.
- Storefront API-ból jön a cím, ár, borító; a bolt jelenleg mock (nincs linkelve),
  ezért a felületnek null-safe fallbackkel is működnie kell.
- Meglévő képi eszközök: `public/book-cover.png`, `public/book-1.jpg`,
  `public/book-2.jpg`, `public/book-3.jpg` (borító + 3 belső részlet).
- Nyelv: magyar.

## Brand Commitments

- Név: **Rost és Umami**.
- Szerzők (fix, nem kitalálható): **Szabó Adrienn és Keve Márton**.

## Evidence on Hand

- Borító és 3 belső fotó (public/). Egyéb valódi tartalom (fülszöveg, receptnevek,
  oldalszám) nincs rögzítve — nem szabad kitalálni tényként; illusztratív tartalom
  csak egyértelműen jelölt helykitöltőként.
- **Nem rögzített, kitalálni tilos:** ár, oldalszám, megjelenési/szállítási dátum,
  vélemények, példányszám. Ezek jelölt helykitöltőként jelenhetnek meg, a cserélendők
  listájával.

## Product Principles

1. Az előrendelés a cél — az elsődleges akció mindig látható és egyértelmű.
2. A rost+umami kettős a fő üzenet; a felület ezt tegye érthetővé, ne díszítse el.
3. Egészség-fókusz: a tartalom táplálkozási logikája fontosabb, mint a dekoráció.
4. Egyetlen termék — a bolt a könyv köré épül, nem katalógus.
5. Kereskedelmi tények (ár, dátum) csak valós adatból; egyébként jelölt helykitöltő.
