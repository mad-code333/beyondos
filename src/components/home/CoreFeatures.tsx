import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const bars = [36, 58, 48, 84, 40, 70, 52, 90];

export function CoreFeatures() {
  return (
    <section className="section-pad border-t border-line" id="features">
      <Container>
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-md text-4xl font-medium tracking-[-0.045em] md:text-5xl">
            Discover our core software features
          </h2>
          <Button href="/#services" variant="line">
            View all features ↗
          </Button>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h3 className="text-2xl tracking-[-0.03em]">Custom dashboard creation</h3>
            <p className="mt-3 max-w-md text-[14px] text-muted">
              Dashboards that put revenue, occupancy and orders in one calm view.
            </p>
            <ul className="mt-5 space-y-2 text-[13px] text-[#d0d0cc]">
              <li>✓ Real-time analytics for instant insight</li>
              <li>✓ Intuitive interface for the front desk and floor</li>
              <li>✓ Widgets you can shape to the property</li>
            </ul>
          </Reveal>
          <Reveal delay={0.05} className="glass p-6">
            <div className="mb-4 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[#8a8a86]">
              <span>Pages / Dashboard</span>
              <span>86% occupancy</span>
            </div>
            <div className="flex h-40 items-end gap-2">
              {bars.map((height, index) => (
                <div
                  key={height + index}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#4a4a4a] to-[#f1f1ee]"
                  style={{ height }}
                />
              ))}
            </div>
          </Reveal>

          <Reveal className="glass grid min-h-[220px] place-items-center p-8">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white text-sm font-semibold text-black">
              b
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-[#bdbdb8]">
              {["POS", "OTA", "SMS", "Mail", "PMS", "CRM"].map((item) => (
                <span key={item} className="rounded-xl border border-line px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="text-2xl tracking-[-0.03em]">Third-party integration</h3>
            <p className="mt-3 max-w-md text-[14px] text-muted">
              Connect payments, channel managers, accounting and messaging without copy-paste.
            </p>
            <ul className="mt-5 space-y-2 text-[13px] text-[#d0d0cc]">
              <li>✓ Ready-made connectors for hospitality stacks</li>
              <li>✓ Secure, monitored data sync</li>
              <li>✓ Custom APIs when you need them</li>
            </ul>
          </Reveal>

          <Reveal>
            <h3 className="text-2xl tracking-[-0.03em]">Workflow automation</h3>
            <p className="mt-3 max-w-md text-[14px] text-muted">
              Bookings, orders and leads trigger the next step automatically.
            </p>
            <ul className="mt-5 space-y-2 text-[13px] text-[#d0d0cc]">
              <li>✓ Visual rules your team can edit</li>
              <li>✓ Alerts by email, SMS or WhatsApp</li>
              <li>✓ A full trail of every action</li>
            </ul>
          </Reveal>
          <Reveal delay={0.05} className="rounded-[22px] border border-line bg-[#0e0e0e] p-5">
            {[
              "New booking",
              "Assign room",
              "Notify housekeeping",
              "Send welcome message",
            ].map((step, index) => (
              <div
                key={step}
                className="mb-2 flex items-center justify-between rounded-xl border border-line px-4 py-3 text-[13px]"
              >
                <span>
                  {index + 1}. {step}
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#6f6f6f]">
                  {index === 3 ? "✓" : "Auto"}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
