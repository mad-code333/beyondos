import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const bars = [42, 68, 54, 88, 46, 72, 58, 92, 64, 78];

export function Capabilities() {
  return (
    <section className="section-pad border-t border-line" id="capabilities">
      <Container>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="glass relative min-h-[340px] overflow-hidden p-6 md:p-8">
            <div className="mb-8 flex items-end gap-2">
              {bars.map((height, index) => (
                <div
                  key={height + index}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#3a3a3a] to-[#ecece8]"
                  style={{ height: `${height}px`, opacity: 0.55 + (index % 3) * 0.15 }}
                />
              ))}
            </div>
            <div className="absolute left-6 top-6 flex gap-2 text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
              <span className="rounded-full border border-line px-2 py-1">Revenue $53,000</span>
              <span className="rounded-full border border-line px-2 py-1">Occupancy 86%</span>
            </div>
            <h3 className="mt-6 text-2xl tracking-[-0.03em]">Custom software development</h3>
            <p className="mt-2 max-w-md text-[14px] text-muted">
              Tailored software that fits your hotel or restaurant, streamlines the day and
              leaves room to grow.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="glass flex min-h-[340px] flex-col justify-between p-6 md:p-8">
            <div className="mx-auto w-full max-w-[220px] rounded-[28px] border border-line bg-[#0c0c0c] p-4">
              <div className="mb-4 flex justify-between text-[9px] text-[#6f6f6f]">
                <span>9:41</span>
                <span>beyond</span>
              </div>
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-line text-[12px]">
                b
              </div>
              {["Room 204 · Checked in", "Order #4821 · Shipped", "Lead · Follow-up today"].map(
                (item) => (
                  <div
                    key={item}
                    className="mb-2 rounded-xl border border-line px-3 py-2 text-[11px] text-[#d4d4d0]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <div>
              <h3 className="text-2xl tracking-[-0.03em]">Mobile-ready platforms</h3>
              <p className="mt-2 text-[14px] text-muted">
                Every platform we build works in the pocket of your staff and guests — on any
                device.
              </p>
            </div>
          </Reveal>

          <Reveal className="glass flex min-h-[280px] flex-col justify-end p-6 md:p-8">
            <div className="mb-8 grid h-24 w-24 place-items-center rounded-full border border-line text-lg">
              Ai
            </div>
            <h3 className="text-2xl tracking-[-0.03em]">AI-assisted operations</h3>
            <p className="mt-2 max-w-sm text-[14px] text-muted">
              Forecast demand, route leads and draft replies so the team stays with the guest.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="glass p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
              <span>Your transactions</span>
              <span>Today</span>
            </div>
            {[
              ["Suite 12 · 3 nights", "+$1,240"],
              ["Order #4821", "+$318"],
              ["Restaurant · Table 7", "+$96"],
              ["Refund · Order #4790", "−$42"],
            ].map(([label, amount]) => (
              <div
                key={label}
                className="flex items-center justify-between border-t border-line py-3 text-[13px]"
              >
                <span className="text-[#d4d4d0]">{label}</span>
                <span className={amount.startsWith("−") ? "text-[#c9a0a0]" : "text-[#d8d8d4]"}>
                  {amount}
                </span>
              </div>
            ))}
            <h3 className="mt-6 text-2xl tracking-[-0.03em]">Real-time reporting</h3>
            <p className="mt-2 text-[14px] text-muted">
              Revenue, orders and occupancy, live across every location.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
