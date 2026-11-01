"use client";

import Image from "next/image";
import Link from "next/link";
import "./hero.css";

const serviceLinks = [
  { href: "/services/crm", label: "CRM" },
  { href: "/services/oms", label: "Restaurant OMS" },
  { href: "/services/hms", label: "Hotel HMS" },
  { href: "/services/web", label: "Web Development" },
  { href: "/services/growth", label: "Digital Growth" },
];

export function Hero() {
  return (
    <>
      <section className="studio-hero studio-hero-split" aria-label="Beyond OS">
        <div className="split-hero">
          <div className="split-copy">
            <p className="mono studio-kicker">Tbilisi · Hotels & restaurants</p>

            <h1 className="studio-welcome">
              The desk.
              <br />
              The floor.
              <br />
              One
              <br />
              guest.
            </h1>

            <p className="studio-lead">
              Software, websites and growth for the hotels and restaurants you already run.
            </p>

            <div className="studio-actions">
              <Link className="studio-pill studio-pill-solid" href="#property">
                See the stack <i aria-hidden="true">→</i>
              </Link>
            </div>

            <nav className="studio-nav" aria-label="Services">
              {serviceLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="split-stage">
            <div className="split-ring" aria-hidden="true" />

            <figure className="split-window back">
              <Image
                src="/media/suite.jpg"
                alt="A boutique hotel bedroom in morning light, linen and a chair by the window."
                fill
                sizes="(max-width: 800px) 80vw, 34vw"
                priority
              />
              <figcaption>The stay, before arrival</figcaption>
            </figure>

            <figure className="split-window front">
              <span className="split-chrome">
                <i />
                <i />
                <i />
                beyond · the property
              </span>
              <Image
                src="/media/dining.jpg"
                alt="A restaurant dining room set for service, warm light on empty tables."
                fill
                sizes="(max-width: 800px) 86vw, 38vw"
                priority
              />
              <figcaption>
                <strong>The room.</strong>
                <span>One picture of service.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="studio-statement wrap">
        <p>
          The software that matters is the software the desk, the floor and the kitchen{" "}
          <strong>actually use.</strong>
        </p>
      </section>
    </>
  );
}
