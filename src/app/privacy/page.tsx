import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Beyond OS handles information you share with us.",
};

export default function PrivacyPage() {
  return (
    <main className="border-b border-line pb-24 pt-32">
      <Container className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">Beyond OS</p>
        <h1 className="mt-4 text-4xl tracking-[-0.04em]">Privacy Policy</h1>
        <div className="mt-8 space-y-5 text-[15px] leading-7 text-[#bdbdb8]">
          <p>
            Beyond OS builds software, websites, and growth work for hotels and restaurants. This
            page explains what happens to information you share on this site.
          </p>
          <p>
            The contact form on this site is a local preview. It does not send your message to a
            server or store it. When a live form is connected, we will use your name, business,
            email, and message only to reply to your enquiry.
          </p>
          <p>
            We do not sell personal information. We do not use this marketing site to track guests
            of hotels or restaurants.
          </p>
          <p>Questions about privacy can be sent through the contact section on the homepage.</p>
        </div>
      </Container>
    </main>
  );
}
