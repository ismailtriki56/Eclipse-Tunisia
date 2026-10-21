import Image from "next/image";
import { cn } from "@/lib/cn";
import { imageCredit, type ImageAsset } from "@/data/images";

/**
 * A photograph with its licence credit.
 *
 * Every image on the site comes from Wikimedia Commons under a Creative
 * Commons licence that requires attribution, so the credit is rendered as
 * part of the figure rather than hidden in a separate page.
 */
export function Figure({
  asset,
  className,
  imageClassName,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  caption,
}: {
  asset: ImageAsset;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  caption?: string;
}) {
  return (
    <figure className={cn("group relative", className)}>
      <div className="relative overflow-hidden rounded-xl bg-sand">
        <Image
          src={asset.url}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
            imageClassName,
          )}
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[0.7rem] leading-relaxed text-muted">
        {caption ? <span className="text-ink">{caption}</span> : null}
        <a
          href={asset.page}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-navy"
        >
          {imageCredit(asset)}
        </a>
        <span>· Wikimedia Commons</span>
      </figcaption>
    </figure>
  );
}
