import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Beyond OS website.",
};

export default function TermsPage() {
  return (
    <main className="border-b border-line pb-24 pt-16">
      <Container className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">Beyond OS</p>
        <h1 className="mt-4 text-4xl tracking-[-0.04em]">Terms of Service</h1>
        <div className="mt-8 space-y-5 text-[15px] leading-7 text-[#bdbdb8]">
          <p>
            This website presents Beyond OS services for hospitality businesses. Concept studies,
            sample workspaces, and figures on the site are illustrative. They are not a live
            product and not a promise of a specific result.
          </p>
          <p>
            Project scope, pricing, and delivery are agreed in a separate proposal. Using this
            site does not create a client agreement.
          </p>
          <p>
            Beyond Georgia and Beyond Supply are related parts of the same ecosystem. Links to
            those sites leave this one.
          </p>
          <p>© 2026 BEYONDOS. All rights reserved.</p>
        </div>
      </Container>
    </main>
  );
}
