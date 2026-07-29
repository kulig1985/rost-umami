# Telepítési leírás — Rost és Umami (Hydrogen) VPS-re

Docker + Caddy (auto‑HTTPS) telepítés saját VPS‑re. Ez a fájl egy **checklist / workflow** —
menj végig rajta fentről lefelé. Jelölés: **🤖** = a kód/repó része (kész) · **👤** = neked kell
elvégezni (nincs hozzá gépi hozzáférés: Shopify admin, DNS, VPS, titkok).

- **Runtime:** Shopify Oxygen Worker app (Hydrogen 2026.4, mini‑oxygen/workerd). Production kiszolgálás:
  `shopify hydrogen preview` (port 3000). **Nem** sima Node szerver.
- **Domain:** `rost-umami.kebodev.hu` — a `.env` `SITE_DOMAIN` változójából, bármikor cserélhető.
- **Checkout:** a myshopify domainen (`rost-es-umami.myshopify.com`), nem kell Shopify Plus.
- **Git remote:** `https://github.com/kulig1985/rost-umami.git`.

---

## 0) Architektúra
```
Internet → Caddy (Docker, :80/:443, auto-TLS a {$SITE_DOMAIN}-ra)
             └─ reverse_proxy → app:3000  (Docker "web" háló)
                                  └─ socat 0.0.0.0:3000 → 127.0.0.1:3001
                                       └─ shopify hydrogen preview (mini-oxygen, :3001)
```
A `socat` azért kell, mert a mini‑oxygen alapból localhostra köt. Ha a `preview` tud 0.0.0.0‑ra kötni
(lásd „Ellenőrizendő" rész), a socat elhagyható.

## Fájlok a repóban (🤖 kész)
`Dockerfile` · `docker-entrypoint.sh` · `.dockerignore` · `docker-compose.yml` · `Caddyfile` ·
`.env.example` · `DEPLOY.md`. A `.env` **nincs** a gitben (`.gitignore`).

---

## FÁZIS B — 👤 Shopify admin
A tokenek/ID‑k a **Headless** sales channel storefrontjában vannak
(Admin → Sales channels → Headless → a storefrontod).

- [ ] **Storefront API** szekció:
  - [ ] `PUBLIC_STOREFRONT_API_TOKEN` (Public token)
  - [ ] `PRIVATE_STOREFRONT_API_TOKEN` (Private token) — **ellenőrizd**, hogy privát Storefront token
        (ne Admin `shpat_`); ha kell, generálj újat
- [ ] **Customer Account API** szekció (+ Settings → Customer accounts: „new customer accounts" be):
  - [ ] `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` (Client ID)
  - [ ] `PUBLIC_CUSTOMER_ACCOUNT_API_URL` (az ott megjelenő Customer Account API endpoint/URL)
  - [ ] `SHOP_ID` = a numerikus shop id — a fenti URL‑ben benne van, vagy `{ shop { id } }`
        (`gid://shopify/Shop/<SHOP_ID>`)
- [ ] `PUBLIC_STOREFRONT_ID` — **Headless‑nél nincs** (Hydrogen‑channel érték); csak analytics
      használja → **hagyd üresen**, minden más működik nélküle
  - [ ] **Callback URI:** `https://rost-umami.kebodev.hu/account/authorize`
  - [ ] **JavaScript origin:** `https://rost-umami.kebodev.hu`
  - [ ] **Logout URI:** `https://rost-umami.kebodev.hu`
- [ ] **Termék közzététele** a Headless (Storefront API) channelre: `rost-es-umami`
- [ ] **Navigáció** (Online Store → Navigation): legyen `main-menu` és `footer` handle‑ű menü
- [ ] **Checkout/jelszó:** checkout a myshopify domainen marad. Ha az Online Store jelszava
      akadályozza a checkoutot: Online Store → Preferences → jelszó ki

## FÁZIS C — 👤 VPS + DNS + indítás
- [ ] VPS (Ubuntu 22.04/24.04); a **80** és **443** portok nyitva
- [ ] **DNS:** `rost-umami.kebodev.hu` **A rekord → VPS publikus IP**
- [ ] Docker: `curl -fsSL https://get.docker.com | sh`
- [ ] Kód (a saját mappádba, pl. `~/shopify`):
      ```bash
      cd ~/shopify
      git clone https://github.com/kulig1985/rost-umami.git
      cd rost-umami
      ```
- [ ] `.env` a VPS‑en (NEM gitből):
      ```bash
      cp .env.example .env
      # töltsd ki a B fázis értékeivel, majd:
      openssl rand -hex 32   # → ez legyen a SESSION_SECRET
      chmod 600 .env
      ```
- [ ] Indítás: `docker compose up -d --build`
- [ ] A Caddy automatikusan lekéri a Let's Encrypt certet (80/443 + DNS kell hozzá)
- [ ] Logok: `docker compose logs -f app` · `docker compose logs -f caddy`

## FÁZIS D — Verifikáció
- [ ] `curl -I https://rost-umami.kebodev.hu` → `200` + érvényes TLS cert
- [ ] Főoldal + `/products/rost-es-umami` + galéria képek töltenek; fejléc/lábléc menü megjelenik
- [ ] Kosár → „Tovább a pénztárhoz" → myshopify checkout
- [ ] `/account/login` → Shopify OAuth → `/account/authorize` → belépve
      (ha `redirect_uri` hiba: a callback pontosan egyezzen, és a Caddy `X-Forwarded-Proto: https`‑t küldjön)
- [ ] `docker compose logs app` → nincs `SESSION_SECRET ... not set`

---

## Env változók (honnan)
| Változó | Típus | Forrás |
|---|---|---|
| `SESSION_SECRET` | secret | `openssl rand -hex 32` (kötelező, e nélkül a szerver hibázik) |
| `PUBLIC_STORE_DOMAIN` | public | `rost-es-umami.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | public | Headless → Public token |
| `PRIVATE_STOREFRONT_API_TOKEN` | secret | Headless → Private token (ellenőrizni) |
| `PUBLIC_CHECKOUT_DOMAIN` | public | `rost-es-umami.myshopify.com` |
| `PUBLIC_STOREFRONT_ID` | public (opcionális) | Headless‑nél nincs → üresen; csak analytics |
| `SHOP_ID` | public | Customer Account API URL‑ből, vagy `{ shop { id } }` |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | public | Customer Account API → Client ID |
| `PUBLIC_CUSTOMER_ACCOUNT_API_URL` | public | Customer Account API → API URL |
| `SITE_DOMAIN` | deploy | `rost-umami.kebodev.hu` |
| `NODE_ENV` | runtime | `production` |

## Domaincsere (env‑ből)
1. Új DNS A rekord → VPS IP
2. `.env`: `SITE_DOMAIN=<új domain>`
3. `docker compose up -d` (a Caddy új certet kér)
4. Shopify admin → Customer Account API: az új domain redirect URI‑jainak felvétele
   (`/account/authorize`, origin, logout). A kódban nincs bedrótozott domain, más nem változik.

## Frissítés / újradeploy
```bash
cd ~/shopify/rost-umami
git pull
docker compose up -d --build
```

## Ellenőrizendő futtatáskor („ne feltételezz semmit")
- `npx shopify hydrogen preview --help` (CLI 3.93.2): ha van 0.0.0.0/host kötés flag →
  a socat elhagyható, a `preview --port 3000` közvetlenül köthet (akkor a `docker-entrypoint.sh`
  egyszerűsíthető és a Dockerfile `EXPOSE 3000` marad).
- A `preview` az image‑ben előre buildelt `dist`‑et szolgálja‑e ki, konténerben login/link nélkül.
- A mini‑oxygen felveszi‑e az env‑et (a `SESSION_SECRET` hiánya a gyors füstteszt).
- OAuth: a Caddy `X-Forwarded-Proto: https` fejléce alapján épüljön https `redirect_uri`.
- A `PRIVATE_STOREFRONT_API_TOKEN` valóban privát Storefront token‑e (a `shpat_` prefix gyanús).

## Megjegyzés
- A locale a kódban `HU/HU` (`app/lib/context.ts`) — magyar nyelv és HUF a Storefront API válaszokban.
