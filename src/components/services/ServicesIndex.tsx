import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";

export function ServicesIndex() {
  return (
    <main>
      <section className="border-b border-line bg-[#080808]">
        <Container className="pb-12 pt-14 md:pb-16 md:pt-20">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            — The Beyond toolkit
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_minmax(240px,380px)] lg:items-end lg:gap-16">
            <h1 className="text-[64px] font-medium leading-[0.95] tracking-[-0.05em] text-[#f4f4f1] md:text-[96px] lg:text-[112px]">
              Services
            </h1>
            <div className="max-w-sm lg:justify-self-end lg:pb-3">
              <p className="text-[15px] leading-6 text-[#9a9a95]">
                Software to run your operation. Digital experiences to represent it. Growth to take
                it further. Pick a starting point.
              </p>
              <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-[#6f6f6b]">
                {String(services.length).padStart(2, "0")} services — one connected system
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
