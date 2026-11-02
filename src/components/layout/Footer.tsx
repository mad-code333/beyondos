import Image from "next/image";
import Link from "next/link";
import { MotionToggle } from "./MotionToggle";
import "./footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-chrome">
        <div className="wrap footer-top">
          <div>
            <Link href="/" className="wordmark" aria-label="Beyond OS home">
              <span className="brand-icon">b</span>
              beyond
              <span className="os">os</span>
            </Link>
            <p className="footer-copy">
              Software, websites and growth
              <br />
              for hotels and restaurants.
              <br />
              Part of Beyond, in Tbilisi.
            </p>
            <span className="footer-coords">
              Tbilisi, Georgia · 41.7151° N / 44.8271° E
            </span>
          </div>

          <div className="footer-col">
            <span className="mono">Solutions</span>
            <Link href="/services/crm">CRM</Link>
            <Link href="/services/oms">Restaurant OMS</Link>
            <Link href="/services/hms">Hotel HMS</Link>
          </div>

          <div className="footer-col">
            <span className="mono">Services</span>
            <Link href="/services/web">Web Development</Link>
            <Link href="/services/growth">Digital Growth &amp; Branding</Link>
            <Link href="/#contact">Start a conversation ↗</Link>
          </div>

          <div className="footer-col">
            <span className="mono">Explore</span>
            <Link href="/#work">Selected work</Link>
            <Link href="/#approach">Our approach</Link>
            <Link href="/#insights">Insights</Link>
            <a href="https://www.beyondgeorgia.com/" target="_blank" rel="noopener noreferrer">
              Beyond Georgia ↗
            </a>
            <Link href="/#ecosystem">The ecosystem</Link>
          </div>
        </div>

        <div className="footer-bottom wrap">
          <span>© 2026 Beyond OS</span>
          <span>Tbilisi · Hotels, restaurants &amp; hospitality brands</span>
          <MotionToggle />
          <Link href="/#top">Back to top ↑</Link>
        </div>
      </div>

      <div className="footer-banner">
        <Image
          src="/footer-reach.jpg"
          alt="A mechanical hand and a human hand, almost meeting."
          fill
          sizes="100vw"
        />
      </div>
    </footer>
  );
}
