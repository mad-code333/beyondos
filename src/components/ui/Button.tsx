import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "line";
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[12px] tracking-[0.04em] transition-all duration-300",
    variant === "primary" &&
      "bg-[#f1f1ee] text-[#080808] hover:bg-white hover:scale-[1.02]",
    variant === "ghost" &&
      "border border-line bg-transparent text-[#f1f1ee] hover:bg-soft",
    variant === "line" &&
      "border border-line bg-soft text-[#d8d8d4] hover:border-white/30 hover:text-white",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
