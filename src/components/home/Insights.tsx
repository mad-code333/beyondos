import { insights } from "@/content/insights";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Insights() {
  return (
    <section className="section-pad border-t border-line" id="insights">
      <Container>
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">Insights</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-medium tracking-[-0.045em] md:text-5xl">
            Notes on software & hospitality growth
          </h2>
          <p className="mt-4 text-[15px] text-muted">Practical guides from the projects we ship.</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {insights.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <article className="group">
                <div className="relative mb-5 h-[210px] overflow-hidden rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_80%,#2a2a2a,#111_70%)]">
                  {item.art === "glow" ? (
                    <div className="absolute inset-x-8 bottom-0 h-28 rounded-t-full bg-[radial-gradient(circle_at_50%_100%,#f4f4f0,transparent_70%)]" />
                  ) : null}
                  {item.art === "bars" ? (
                    <div className="absolute inset-x-8 bottom-8 flex items-end gap-3">
                      {[40, 64, 92, 120].map((height) => (
                        <div
                          key={height}
                          className="w-full rounded-t-md bg-gradient-to-t from-[#6a6a66] to-[#f1f1ee]"
                          style={{ height }}
                        />
                      ))}
                    </div>
                  ) : null}
                  {item.art === "orbit" ? (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="h-16 w-16 rounded-full bg-white" />
                      <div className="absolute h-28 w-44 rounded-full border border-white/30" />
                      <div className="absolute h-40 w-60 rounded-full border border-white/20" />
                    </div>
                  ) : null}
                </div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
                  {item.category} · {item.date}
                </p>
                <h3 className="mt-3 text-[20px] leading-snug tracking-[-0.03em] group-hover:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-muted">{item.excerpt}</p>
                <span className="mt-4 inline-flex text-[12px] text-[#d8d8d4]">Read article ↗</span>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
