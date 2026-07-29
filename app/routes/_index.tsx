/**
 * FŐOLDAL — Persuade. Világ: modern zöldségpiac-tábla (lásd DESIGN.md).
 * THESIS: a könyv a piac „mai kiemelt tétele". A ROST és az UMAMI két
 * párhuzamos stand-sáv, amely a kiemelt tábla könyvében olvad egybe.
 */
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Money} from '@shopify/hydrogen';
import {MockShopNotice} from '~/components/MockShopNotice';

const PRODUCT_HANDLE = 'rost-es-umami';
const AUTHORS = 'Szabó Adrienn & Keve Márton';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Rost és Umami — a piac mai kiemelt tétele'},
    {
      name: 'description',
      content:
        'Rost és Umami: az egészséges íz-tudomány szakácskönyve. Rendeld elő.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const product = await context.storefront
    .query(HOMEPAGE_PRODUCT_QUERY)
    .then((res) => res.product)
    .catch(() => null);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    product,
  };
}

export default function Homepage() {
  const {isShopLinked, product} = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {isShopLinked ? null : (
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <MockShopNotice />
        </div>
      )}
      <Hero product={product} />
      <WhySection />
      <BookGallery />
      <ClosingBand />
    </div>
  );
}

function Hero({
  product,
}: {
  product: Awaited<ReturnType<typeof loader>>['product'];
}) {
  const price = product?.priceRange?.minVariantPrice;
  const cover = product?.featuredImage?.url ?? '/book-cover.png';
  const coverAlt =
    product?.featuredImage?.altText ?? 'A Rost és Umami szakácskönyv borítója';
  const title = product?.title ?? 'Rost és Umami';

  return (
    <section aria-label="Bemutatkozás">
      {/* Két sáv, ami lejjebb egybeolvad */}
      <div className="relative grid md:grid-cols-2">
        <div className="stream bg-board text-chalk paint-texture">
          <span className="kicker text-amber">01 · A tápláló alap</span>
          <div>
            <p className="stream-word">ROST</p>
            <p className="mt-3 max-w-xs font-body text-lg font-semibold">
              Növényi rostok az emésztésért és a tartós teltségérzetért.
            </p>
          </div>
        </div>
        <div className="stream bg-terracotta text-chalk paint-texture">
          <span className="kicker text-right">02 · A mély íz</span>
          <div className="md:text-right md:items-end md:flex md:flex-col">
            <p className="stream-word">UMAMI</p>
            <p className="mt-3 max-w-xs font-body text-lg font-semibold">
              Az ötödik íz: a sós-savas, telt mélység, amitől finom lesz.
            </p>
          </div>
        </div>
        <span className="merge-chevron" aria-hidden="true" />
      </div>

      {/* Kiemelt tétel — a két sáv összeér a könyvben */}
      <div className="bg-surface text-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-14 md:grid-cols-[1.1fr_0.9fr] md:pb-20 md:pt-16">
          <div>
            <span className="kicker text-terracotta-deep">Mai kiemelt tétel</span>
            <h1 className="mt-3 text-ink text-[clamp(2.8rem,7vw,5.5rem)]">
              {title}
            </h1>
            <p className="mt-3 font-body text-lg text-ink/70">
              Szakácskönyv · {AUTHORS}
            </p>
            <p className="mt-6 max-w-md font-body text-xl text-ink/80">
              Egészséges, mégis igazán finom: a rost és az umami tudatos
              párosítása egyetlen szakácskönyvben.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to={`/products/${PRODUCT_HANDLE}`} className="btn-market">
                Előrendelés →
              </Link>
              {price ? (
                <span className="price-tag">
                  <Money data={price} />
                </span>
              ) : (
                <span className="price-tag" title="Végleges ár hamarosan">
                  Ár hamarosan
                </span>
              )}
            </div>

            <p className="reassure-line">
              Várható megjelenés és szállítás:{' '}
              <strong>2026. december</strong>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="crate">
              <img src={cover} alt={coverAlt} />
              <span
                className="stamp absolute bottom-4 right-4 z-10 bg-amber text-ink"
                aria-hidden="true"
              >
                Elő&shy;rendelés
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <span className="kicker text-terracotta-deep">Két alapanyag, egy tál</span>
          <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)]">
            Miért rost <span className="text-terracotta">és</span> umami?
          </h2>
          <p className="mt-4 font-body text-lg text-ink/75">
            A legtöbb „egészséges" konyha vagy tápláló, vagy finom. Ez a könyv a
            kettőt köti össze — a rost adja a tartást, az umami az ízt.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="why-card border border-ink/15 bg-olive/10">
            <h3 className="why-card-title font-display text-2xl text-ink">
              A rost dolga
            </h3>
            <ul className="tick-list tick-leaf font-body text-ink">
              <li>Növényi alapú fogások, sok zöldséggel és hüvelyessel.</li>
              <li>Lassabb emésztés, tartósabb teltségérzet.</li>
              <li>Egyszerű, hétköznapi hozzávalókból.</li>
            </ul>
          </div>
          <div className="why-card border border-ink/15 bg-terracotta/10">
            <h3 className="why-card-title font-display text-2xl text-ink">
              Az umami dolga
            </h3>
            <ul className="tick-list tick-cocoa font-body text-ink">
              <li>Az ötödik íz: mély, sós-savas telítettség.</li>
              <li>Kevesebb sóval is karakteres, gazdag ízvilág.</li>
              <li>Technikák, amitől a növényi étel is kielégítő lesz.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookGallery() {
  const plates = [
    {src: '/book-1.jpg', plate: 'I'},
    {src: '/book-2.jpg', plate: 'II'},
    {src: '/book-3.jpg', plate: 'III'},
  ];
  return (
    <section className="bg-board text-chalk paint-texture">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker text-amber">Betekintés</span>
            <h2 className="mt-3 text-chalk text-[clamp(2rem,4.5vw,3.2rem)]">
              Képek a könyvből
            </h2>
          </div>
          <p className="max-w-sm font-body text-lg text-chalk/80">
            Bepillantás a receptekbe és az ízek világába — ahogy a könyvben is
            látni fogod.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plates.map(({src, plate}, i) => (
            <div key={src} className="gallery-card text-ink">
              <figure>
                <img src={src} alt={`Belső oldal a Rost és Umami könyvből (${plate})`} />
              </figure>
              <figcaption className="gallery-cap">
                <span className="kicker text-ink/60">A könyvből</span>
                <span className="gallery-plate">{plate}</span>
              </figcaption>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingBand() {
  return (
    <section className="bg-terracotta text-chalk paint-texture">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div>
          <h2 className="text-chalk text-[clamp(2rem,5vw,3.6rem)]">
            Kóstolj bele — és rendeld elő.
          </h2>
          <p className="mt-3 max-w-md font-body text-lg text-chalk/85">
            Vidd haza a piac mai kiemelt tételét.
          </p>
        </div>
        <Link to={`/products/${PRODUCT_HANDLE}`} className="btn-market">
          Előrendelés →
        </Link>
      </div>
    </section>
  );
}

const HOMEPAGE_PRODUCT_QUERY = `#graphql
  query HomepageProduct($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: "rost-es-umami") {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  }
` as const;
