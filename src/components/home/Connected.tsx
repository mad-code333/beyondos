import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Connected() {
  return (
    <section className="section-pad border-t border-line" id="ecosystem">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            — Designed to work together
          </p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
            One business.
            <span className="mt-2 block text-[#b7b7b2]">A connected way forward.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted">
            Your website starts the conversation. Your software carries it through. Your brand
            and growth strategy bring people back. Beyond Georgia brings travelers. Beyond Supply
            equips the venue. Beyond OS runs the operation.
          </p>
          <Button href="/#approach" variant="line" className="mt-8">
            How we connect the dots ↗
          </Button>
        </Reveal>
        <Reveal delay={0.08} className="relative flex min-h-[280px] items-center justify-center">
          <div className="orbit-ring" />
          <div className="orbit-ring" />
          <div className="orbit-ring" />
          <div className="glass relative z-10 grid h-28 w-28 place-items-center text-xl tracking-[-0.04em]">
            b/os
          </div>
          <p className="absolute bottom-2 text-[10px] uppercase tracking-[0.18em] text-[#6f6f6f]">
            Operations ↔ Experience ↔ Growth
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
