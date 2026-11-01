import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ServiceView } from "@/components/services/ServiceView";
import { getService, services } from "@/content/services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.heroLead,
  };
}

export default function ServicePage({ params }: PageProps) {
  return (
    <Suspense fallback={<ServiceFallback />}>
      <ServicePageContent params={params} />
    </Suspense>
  );
}

async function ServicePageContent({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceView service={service} />;
}

function ServiceFallback() {
  return (
    <main>
      <section className="border-b border-line py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-8 h-3 w-32 rounded bg-white/10" />
          <div className="mt-6 h-12 max-w-xl rounded bg-white/10" />
          <div className="mt-4 h-16 max-w-md rounded bg-white/[0.06]" />
        </div>
      </section>
    </main>
  );
}
