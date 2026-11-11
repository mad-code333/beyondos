"use client";

import dynamic from "next/dynamic";

const FooterParticles = dynamic(
  () =>
    import("./FooterParticles").then((mod) => ({
      default: mod.FooterParticles,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

type FooterCanvasProps = {
  text?: string;
};

/** Client boundary so canvas code never runs during SSR/prerender. */
export function FooterCanvas({ text = "beyond" }: FooterCanvasProps) {
  return <FooterParticles text={text} />;
}
