import type { Metadata } from "next";
import { ServicesIndex } from "@/components/services/ServicesIndex";

export const metadata: Metadata = {
  title: "Services",
  description:
    "CRM, restaurant OMS, hotel HMS, websites and digital growth — the Beyond OS toolkit for hospitality.",
};

export default function ServicesPage() {
  return <ServicesIndex />;
}
