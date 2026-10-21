import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        The page you were looking for doesn&rsquo;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/explorer" variant="secondary">
          Open the Eclipse Explorer
        </ButtonLink>
      </div>
    </Container>
  );
}
