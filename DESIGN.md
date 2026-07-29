# Design

<!-- impeccable:design-schema 1 -->

## Direction contract (Rost és Umami — főoldal, Persuade)

**THESIS.** A szakácskönyv-webshop a piac „mai kiemelt tételeként" mutatja be a könyvet,
de meleg, **szerkesztői (editorial) prémium** kivitelben, a borító palettájára hangolva.
A struktúra (két sáv → kiemelt tétel → galéria → záró CTA) marad; a hangnem nyugodtabb,
fotó-központú. Elutasítja a geneikus wellness-brandinget és a poszter-szerű kemény
árnyékokat.

**OWN-WORLD.** A borító színvilága: domináns búza-krém (`#f5e3b5`), terrakotta márkaszín
(`#d84a13`), mély szilva tipográfia (`#3a1218`), visszafogott borostyán (`#eda62b`),
oliva csak takarékosan (`#5d8a32`). Bricolage Grotesque (700–800) a nagy szavakhoz/
címekhez, Hanken Grotesk a törzshöz. Anyagok: vékony 1px keretek, lágy árnyékok,
szögletes sarkok, sok levegő — az ételfotó a főszereplő.

**STORY.** A látogató két kontrasztos sávot lát (ROST = mély szilva, UMAMI = terrakotta),
amelyek egy világos „spotlight" mezőbe olvadnak, ahol a könyvborító áll → megérti, hogy
ez az egészséges íz-tudományos szakácskönyv (rost + umami) → előrendel.

**FIRST VIEWPORT.** Két sáv: balra ROST (mély szilva, krém szöveg, borostyán kicker),
jobbra UMAMI (terrakotta, krém szöveg); köztük egyetlen borostyán rombusz. Alatta világos
búza-krém spotlight: a valódi borító vékony kerettel + lágy árnyékkal, borostyán „MAI
AJÁNLAT" pecsét, terrakotta „ELŐRENDELÉS" gomb + borostyán árcímke. Az akció azonnal látszik.

**FORM.** Zöldséges / modern piac-tábla jelrendszer (kijelölt grounded irány, #7).
Staging: „két párhuzamos sáv, ami lejjebb egybeolvad" (narrative-scroll parallel-streams-
merge) — a ROST és UMAMI sávok fogják a különbségüket, majd a kiemelt tétel táblájában
összeolvadnak. Világ + staging egyetlen döntésként. Seed: c97f3884 / assigned #7.

## Durable system (a first build után pontosítandó)

- **Szín-stratégia:** Drenched / Committed. A szín egész régiókat birtokol (nem szórt
  akcentek): szekciónként teljes színmező (zöld hero, kréta tartalom, cékla galéria).
- **ROST = levélzöld, UMAMI = cékla-magenta** — ez a két jelentés stabil végig.
- **Tipó:** display = Bricolage Grotesque (700–800, festett tábla-szavak, árcímkék,
  enyhe ferdítés megengedett); body/adat = Hanken Grotesk. Serifet nem használunk.
- **Sarkok:** a festett-tábla logika miatt kis vagy nulla lekerekítés; a címkék ferde,
  bélyegzős érzetűek. Árnyék: valódi offset + lágy blur (mélység), nem lapos halo.
- **Nyelv:** magyar UI; a hangnem magabiztos, piaci, közvetlen.
- **Tények:** ár/dátum/oldalszám csak valós adatból; egyébként egyértelműen jelölt
  helykitöltő (lásd PRODUCT.md), a cserélendők listájával.

## Színrendszer (kétrétegű, szemantikus) — a borító palettája, editorial prémium

A „Rost és Umami" borító + az ételfotók színvilága. Domináns **búza-krém** háttér,
**terrakotta** elsődleges márkaszín, **mély szilva** tipográfia/sötét kontraszt,
**borostyán** visszafogott akcent, **oliva** csak takarékosan. Meleg, szerkesztői,
fotó-központú; vékony keretek, visszafogott árnyékok, szögletes sarkok. Se gradiens,
se glassmorphism, se nehéz árnyék, se túl sok kártya.

**Primitívek** (`app/styles/tailwind.css` `@theme` + `app.css` `:root`):
paper `#f5e3b5` (domináns háttér) · chalk `#fbf1d4` (emelt felület / világos szöveg) ·
cream-deep `#ecdcae` · ink `#3a1218` (tipográfia) · ink-soft `#6b4a44` ·
board `#3a1218` (sötét mezők) · board-deep `#2b0e12` · **terracotta `#d84a13`**
(elsődleges) · terracotta-deep `#a5350d` (hover / akcent-szöveg világoson) ·
**amber `#eda62b`** (akcent) · **olive `#5d8a32`** (takarékosan) · danger `#b3261e`.

**Szemantikus tokenek** (`:root`) — a komponensek EZEKET használják, nem a nyers hexeket:
- Felület: `--bg` (paper) · `--surface` (chalk) · `--surface-2` (cream-deep) ·
  `--surface-inverse` (board) · `--surface-inverse-2` (board-deep)
- Szöveg: `--text` (ink) · `--text-muted` (ink-soft) · `--text-inverse` (chalk) ·
  `--text-inverse-muted`
- Akció: `--primary` (terracotta) / `--primary-hover` (terracotta-deep) /
  `--on-primary` (chalk) · `--accent` (amber) / `--on-accent` (ink) ·
  `--secondary` (board) · `--link` (terracotta-deep, AA világoson)
- Keret: `--frame` (finom, ink/55%) · `--border` · `--divider` · `--hairline` ·
  `--divider-inverse` — mind vékony (1px)
- Tint/árnyék: `--tint`, `--tint-2`, `--overlay`, `--glow-amber`, `--shadow-color`,
  `--shadow-soft/-crate/-hover` (mind lágy, offset+blur; nincs kemény poszter-árnyék)
- Fókusz/kijelölés: `--focus` (terracotta-deep; sötét felületen `--focus-inverse` =
  amber) · `--select-bg` (amber) / `--select-text` (ink)
- Állapotok (bg + text + border trió, AA): success = olive, warning = amber,
  danger = `#b3261e`, info = terracotta-deep

**Szabályok:**
- Jelentés-kód: ROST-sáv = board (szilva), UMAMI-sáv = terracotta, kiemelt tétel =
  surface (világos spotlight a borítónak), galéria = board (a fotók a sötéten világítanak).
- A terrakotta közép-tónus → csak NAGY/félkövér szöveg rajta (krémmel); folyószöveg
  világos vagy sötét alapon. Meleg akcent-szöveg világoson `terracotta-deep`; az amber
  csak sötét felületen szöveg.
- Globális `:focus-visible` 3px gyűrű 2px offszettel; sötét/terrakotta felületeken
  `--focus` = amber.
- Terrakotta sávon a gomb borostyán variánsra vált (`.bg-terracotta .btn-market`).
- Fotó a fókusz: borító a világos spotlighton, ételfotók a sötét galéria-sávon; vékony
  1px keret + lágy árnyék, nincs vastag keret/kártya-halmozás.
- Nincs beégetett szín a komponensekben (kivéve a `:root` primitívek + egy nem
  használt `.overlay .light`).
