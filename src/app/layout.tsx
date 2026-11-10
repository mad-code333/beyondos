import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Orbitron } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beyond OS — Built around your business.",
    template: "%s — Beyond OS",
  },
  description:
    "Beyond OS builds CRM, restaurant OMS, hotel HMS, websites and digital growth for hospitality — connected to Beyond Georgia and Beyond Supply.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body id="top" className="min-h-full bg-bg text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
