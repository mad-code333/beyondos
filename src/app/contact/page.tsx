import type { Metadata } from "next";
import { ContactEnquiry } from "@/components/home/ContactEnquiry";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Tell Beyond OS what is slowing your property down. Share interest in Starter, Growth, or Custom engagement and we will reply with fit and timeline shape.",
};

type ContactPageProps = {
  searchParams: Promise<{ interest?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
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
