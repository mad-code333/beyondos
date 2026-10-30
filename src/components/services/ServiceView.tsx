import Link from "next/link";
import { getRelatedServices, type Service } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceDemo } from "@/components/services/ServiceDemo";

export function ServiceView({ service }: { service: Service }) {
  const related = getRelatedServices(service.slug);

  return (
    <main>
      <section className="border-b border-line py-16 md:py-24">
        <Container>
          <Link href="/services" className="text-[12px] text-[#8a8a86] hover:text-white">
            ← All services
          </Link>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            {service.number} / {service.category}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-0.045em] md:text-6xl">
            {service.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-7 text-muted">{service.heroLead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#contact">Let&apos;s talk ↗</Button>
            <Button href="#concept" variant="ghost">
              Explore the concept ↓
            </Button>
          </div>
        </Container>
      </section>

      <section className="section-pad border-b border-line">
        <Container>
          <Reveal>
            <h2 className="max-w-2xl text-3xl tracking-[-0.04em] md:text-5xl">
              {service.tagline}
            </h2>
            <p className="mt-4 text-[14px] text-muted">
              Designed around the real work of a hospitality business.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {service.features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <article className="h-full rounded-[22px] border border-line bg-[#0e0e0e] p-6">
                  <div className="text-[11px] tracking-[0.14em] text-[#6f6f6f]">0{index + 1}</div>
                  <h3 className="mt-4 text-[20px] tracking-[-0.03em]">{feature.title}</h3>
                  <p className="mt-3 text-[14px] text-muted">{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-pad border-b border-line" id="concept">
        <Container>
          <Reveal className="mb-8">
            <h2 className="text-3xl tracking-[-0.04em] md:text-5xl">{service.tagline}</h2>
            <p className="mt-4 max-w-xl text-[14px] text-muted">
              A sample workspace for {service.shortName}. Move through the concept and see how the
              day could feel.
            </p>
          </Reveal>
          <ServiceDemo service={service} />
        </Container>
      </section>

      <section className="section-pad border-b border-line">
        <Container>
          <h2 className="text-3xl tracking-[-0.04em] md:text-5xl">Built with you. Around your business.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {service.steps.map((step, index) => (
              <article key={step.title} className="border-t border-line pt-5">
                <div className="text-[11px] text-[#6f6f6f]">0{index + 1}</div>
                <h3 className="mt-3 text-[20px]">{step.title}</h3>
                <p className="mt-2 text-[14px] text-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <h2 className="text-3xl tracking-[-0.04em]">What comes next?</h2>
          <div className="mt-8 grid gap-3">
            {related.map((item, index) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="group grid grid-cols-[48px_1fr_24px] items-center gap-4 rounded-2xl border border-line px-4 py-5 transition hover:bg-soft md:px-6"
              >
                <span className="text-[12px] text-[#6f6f6f]">0{index + 1}</span>
                <span>
                  <span className="block text-[18px]">{item.name}</span>
                  <span className="mt-1 block text-[13px] text-muted">{item.summary}</span>
                </span>
                <span className="text-[#6f6f6f] transition group-hover:text-white">↗</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
