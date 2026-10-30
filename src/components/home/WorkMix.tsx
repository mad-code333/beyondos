import { workItems } from "@/content/work";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const cases = [
  {
    initials: "KH",
    name: "Kartli Hotels",
    role: "Business software",
    quote:
      "Moving three properties onto one HMS changed the day. Check-in takes two minutes and housekeeping sees the same board as the front desk.",
    points: ["2 minute check-ins", "10 hours saved weekly", "One system for 3 hotels"],
    person: "Nino Beridze",
    title: "Operations Director",
  },
  {
    initials: "VG",
    name: "Vere Group",
    role: "Web development",
    quote:
      "The new booking engine paid for itself in a quarter. Guests book direct, and the site loads instantly even on hotel Wi-Fi.",
    points: ["41% more direct bookings", "0% commission on direct", "Lighthouse score 90"],
    person: "Daniel Okafor",
    title: "Head of Digital",
  },
  {
    initials: "MW",
    name: "Mtsvane Wine Bar",
    role: "Growth & branding",
    quote:
      "They rebuilt our brand and ran our socials. Empty Tuesdays became a waiting list, and reviews have never been better.",
    points: ["3× map views", "4.8★ average rating", "Doubled weekday covers"],
    person: "Mariam Kapanadze",
    title: "Founder",
  },
];

export function WorkMix() {
  return (
    <section className="section-pad border-t border-line" id="work">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            04 / Possibilities, made tangible
          </p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
            A glimpse of
            <span className="mt-2 block text-[#b7b7b2]">what comes next.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] text-muted">
            Case studies and concept work in one place — the systems we ship and the hospitality
            experiences they sit inside. Figures below are illustrative.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {workItems
            .filter((item) => item.kind === "case")
            .map((item, index) => (
              <Reveal key={item.id} delay={index * 0.06}>
                <article className="glass overflow-hidden p-3">
                  <div
                    className={`flex min-h-[240px] flex-col justify-between rounded-2xl bg-gradient-to-br ${item.accent} p-6`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#bdbdb8]">
                      {item.eyebrow}
                    </p>
                    <div>
                      <h3 className="text-3xl tracking-[-0.04em] md:text-4xl">{item.subtitle}</h3>
                      <p className="mt-2 text-[13px] text-[#c8c8c4]">{item.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4 px-3 py-5">
                    <div>
                      <h4 className="text-[18px] tracking-[-0.02em]">{item.title}</h4>
                      <p className="mt-1 text-[12px] text-muted">{item.tags.join(" · ")}</p>
                    </div>
                    <span className="text-[#8a8a86]">↗</span>
                  </div>
                </article>
              </Reveal>
            ))}
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">Case studies</p>
          <h3 className="mx-auto mt-3 max-w-xl text-3xl tracking-[-0.04em] md:text-5xl">
            Trusted by teams across hospitality.
          </h3>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {cases.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.05}>
              <article className="flex h-full flex-col rounded-[22px] border border-line bg-[#0e0e0e] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[11px] font-semibold text-black">
                      {item.initials}
                    </span>
                    <span className="text-[14px]">{item.name}</span>
                  </div>
                  <span className="text-[12px] text-[#d8d8d4]">5.0 ★</span>
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                  {item.role}
                </p>
                <p className="mt-3 flex-1 text-[14px] leading-6 text-[#d0d0cc]">“{item.quote}”</p>
                <p className="mt-5 text-[12px] text-[#bdbdb8]">Illustrative outcomes.</p>
                <ul className="mt-3 space-y-2 text-[13px] text-[#c8c8c4]">
                  {item.points.map((point) => (
                    <li key={point}>✓ {point}</li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-[10px]">
                    {item.person
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <div className="text-[13px]">{item.person}</div>
                    <div className="text-[11px] text-muted">{item.title}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
