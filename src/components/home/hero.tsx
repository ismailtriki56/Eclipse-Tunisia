import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "@/components/home/countdown";
import { images } from "@/data/images";
import { site } from "@/lib/site";
import { eclipseFacts } from "@/lib/eclipse/destinations";

export function Hero() {
  const hero = images.tozeurSunset;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <Image
          src={hero.url}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            <span aria-hidden className="h-px w-10 rule-gradient" />
            {site.eventDate}
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ivory text-balance sm:text-6xl lg:text-7xl">
            Six minutes and twenty-three seconds of totality, straight across
            Tunisia.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80 text-pretty">
            The path of totality crosses the country from the Algerian border
            to the Gulf of Gabès. This site computes the exact circumstances
            for every location in Tunisia from the NASA GSFC eclipse
            catalogue — no guesswork, no approximations.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/explorer" size="lg" variant="inverse">
              Open the Eclipse Explorer
            </ButtonLink>
            <ButtonLink href="/destinations" size="lg" variant="outline">
              Compare destinations
            </ButtonLink>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/15 pt-10 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/50">
              Time remaining until greatest eclipse
            </p>
            <Countdown
              target={site.greatestEclipseUtc}
              className="mt-4"
            />
            <p className="mt-3 text-sm text-ivory/60">
              Greatest eclipse at {eclipseFacts.greatestEclipseUT} over Egypt
              and the Middle East — {eclipseFacts.greatestEclipseLocal}.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:gap-x-14">
            {[
              { term: "Magnitude", detail: eclipseFacts.magnitude.toFixed(3) },
              { term: "Path width", detail: `${eclipseFacts.pathWidthKm} km` },
              { term: "Longest totality", detail: eclipseFacts.centralDuration },
              { term: "Saros series", detail: `#${eclipseFacts.saros}` },
            ].map((item) => (
              <div key={item.term}>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                  {item.term}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ivory">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
