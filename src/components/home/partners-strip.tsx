"use client";

import Image from "next/image";
import { confirmedPartners } from "@/data/partners";
import { useLanguage } from "@/context/language-context";

export function PartnersStrip() {
  const { t } = useLanguage();
  const partners = confirmedPartners();

  return (
    <section className="border-b border-line bg-ivory">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
            {t.home.partnersEyebrow}
          </p>
          {partners.length === 0 ? (
            <p className="max-w-2xl text-xs leading-relaxed text-muted sm:text-right">
              {t.home.partnersEmpty}
            </p>
          ) : (
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
              {partners.map((partner) => (
                <li key={partner.id}>
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Image
                        src={partner.logoPath as string}
                        alt={partner.name}
                        width={140}
                        height={40}
                        className="h-8 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <Image
                      src={partner.logoPath as string}
                      alt={partner.name}
                      width={140}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
