import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const legalLink =
  "rounded-sm transition hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white";

export function Footer() {
  const solutions = services.filter((service) =>
    ["crm", "oms", "hms"].includes(service.slug),
  );
  const digital = services.filter((service) =>
    ["web", "growth"].includes(service.slug),
  );

  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="relative border-b border-line bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,255,255,0.09),transparent_65%)]">
        <Container className="flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <p className="pill">Hospitality software · Beyond ecosystem</p>
          <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.04em] text-[#f1f1ee] md:text-6xl">
            Let&apos;s build something that moves you forward.
          </h2>
          <p className="max-w-xl text-[15px] text-muted">
            Tell us where you are today. Explore what better could look like for your
            hotel or restaurant — with Beyond Georgia and Beyond Supply in the same orbit.
          </p>
          <Button href="/#contact" className="mt-2 px-7 py-3.5 text-[13px]">
            Book a free consultation
          </Button>
        </Container>
      </div>

      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line bg-soft text-[12px] font-semibold">
              b
            </span>
            <span className="text-[14px]">
              beyond<span className="text-muted">OS</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-[13px] text-muted">
            Hospitality software · Web experiences · Digital growth
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
            Tbilisi, Georgia · 41.7151° N / 44.8271° E
          </p>
        </div>

        <div>
          <div className="mb-4 text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
            Solutions
          </div>
          <ul className="space-y-3 text-[13px] text-[#bdbdb8]">
            {solutions.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="hover:text-white">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
            Services
          </div>
          <ul className="space-y-3 text-[13px] text-[#bdbdb8]">
            {digital.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="hover:text-white">
                  {service.name}
                  {service.slug === "growth" ? " & Branding" : ""}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contact" className="hover:text-white">
                Start a conversation ↗
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
            Explore
          </div>
          <ul className="space-y-3 text-[13px] text-[#bdbdb8]">
            <li>
              <Link href="/#work" className="hover:text-white">
                Selected work
              </Link>
            </li>
            <li>
              <Link href="/#approach" className="hover:text-white">
                Our approach
              </Link>
            </li>
            <li>
              <Link href="/#insights" className="hover:text-white">
                Insights
              </Link>
            </li>
            <li>
              <a
                href="https://beyondgeorgia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Beyond Georgia ↗
              </a>
            </li>
            <li>
              <span className="text-[#7a7a76]">Beyond Supply · soon</span>
            </li>
          </ul>
        </div>
      </Container>

      <section aria-label="Human and machine" className="bg-[#f2f2f2]">
        <div aria-hidden="true" className="h-16 bg-gradient-to-b from-[#080808] to-[#f2f2f2]" />
        <div className="relative aspect-[16/9] w-full sm:aspect-[2.05/1] lg:aspect-[2.45/1]">
          <Image
            src="/footer-hands.jpg"
            alt="A robotic hand and a human hand reaching toward each other"
            fill
            sizes="100vw"
            className="object-cover object-[center_52%]"
          />
        </div>
      </section>

      <div className="bg-[#080808]">
        <Container className="grid gap-3 py-5 text-[12px] text-[#9a9a96] sm:grid-cols-3 sm:items-center">
          <p>© 2026 BEYONDOS. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-5 sm:justify-center">
            <Link href="/privacy" className={legalLink}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={legalLink}>
              Terms of Service
            </Link>
          </nav>
          <Link href="/#top" className={`${legalLink} sm:justify-self-end`}>
            Back to top ↑
          </Link>
        </Container>
      </div>
    </footer>
  );
}
