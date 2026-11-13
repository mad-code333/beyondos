import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactEnquiry } from "@/components/home/ContactEnquiry";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Tell Beyond OS what is slowing your property down. Share interest in Starter, Growth, or Custom engagement and we will reply with fit and timeline shape.",
};

type ContactSearchParams = Promise<{ interest?: string }>;

function ContactFallback() {
  return (
    <main className="contact-page">
      <div className="wrap">
        <section className="contact-enquiry" aria-busy="true">
          <div className="contact-enquiry-copy">
            <p className="mono">Book a demo</p>
            <h1>Tell us what is slowing your property down.</h1>
            <p>Loading your enquiry options…</p>
          </div>
          <div className="contact-enquiry-form" aria-hidden="true" />
        </section>
      </div>
    </main>
  );
}

async function ContactContent({ searchParams }: { searchParams: ContactSearchParams }) {
  const params = await searchParams;
  const interest = params.interest ?? "starter";

  return (
    <main className="contact-page">
      <div className="wrap">
        <ContactEnquiry interest={interest} />
      </div>
    </main>
  );
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: ContactSearchParams;
}) {
  return (
    <Suspense fallback={<ContactFallback />}>
      <ContactContent searchParams={searchParams} />
    </Suspense>
  );
}
