"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface CollapsibleSectionProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  rightMeta?: React.ReactNode;
  className?: string;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  rightMeta,
  className = "",
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`border-b border-[--color-dark-700] ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus:outline-none group"
        aria-expanded={open}
      >
        <span className="font-rajdhani text-xl font-bold uppercase tracking-wider text-white group-hover:text-[--color-neon-blue] transition-colors">{title}</span>
        <span className="flex items-center gap-2">
          {rightMeta}
          <ChevronDown
            className={`h-5 w-5 text-[--color-dark-500] transition-transform duration-300 group-hover:text-[--color-neon-blue] ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          {children ? <div className="text-[--color-light-300]">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
