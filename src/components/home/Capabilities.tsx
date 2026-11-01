import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    title: "Custom software development",
    body: "Tailored software that fits your hotel or restaurant, streamlines the day and leaves room to grow.",
  },
  {
    title: "Mobile-ready platforms",
    body: "Every platform we build works in the pocket of your staff and guests — on any device.",
  },
  {
    title: "AI-assisted operations",
    body: "Forecast demand, route leads and draft replies so the team stays with the guest.",
  },
  {
    title: "Real-time reporting",
    body: "Revenue, orders and occupancy, live across every location.",
  },
];

export function Capabilities() {
  return (
    <section className="section-pad border-t border-line" id="capabilities">
      <Container>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index % 2 === 1 ? 0.06 : 0}
              className="glass p-6 md:p-8"
            >
              <h3 className="text-2xl tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-2 max-w-md text-[14px] text-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
