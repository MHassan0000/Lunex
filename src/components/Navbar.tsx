"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Smartphones", href: "/products?category=smartphones" },
  { label: "Laptops", href: "/products?category=laptops" },
  { label: "Audio", href: "/products?category=headphones" },
  { label: "Wearables", href: "/products?category=smartwatches" },
  { label: "Accessories", href: "/products?category=accessories" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[--color-dark-950]/80 backdrop-blur-md border-b border-[--color-dark-700]">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/" aria-label="Lunex Home" className="flex items-center gap-2 group">
          <div>
            <Image src="/images/circuit1.png" alt="logo" width={50} height={50} />
          </div>
          <span className="font-rajdhani text-2xl font-bold tracking-wider text-white group-hover:text-glow transition-all">LUNEX</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium uppercase tracking-widest text-[--color-light-300] transition-colors hover:text-[--color-neon-blue] hover:text-glow"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button className="text-[--color-light-300] transition-colors hover:text-white hover:text-glow">
            <span className="sr-only">Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button className="text-[--color-light-300] transition-colors hover:text-[--color-neon-green] hover:text-glow flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="font-rajdhani font-bold">CART (2)</span>
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-[--color-light-300] hover:text-white md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`}></span>
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </div>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`border-t border-[--color-dark-700] bg-[--color-dark-900] md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="space-y-2 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 text-base font-medium text-[--color-light-300] hover:text-[--color-neon-blue]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-between pt-4 border-t border-[--color-dark-700] mt-2">
            <button className="text-[--color-light-300]">Search</button>
            <button className="text-[--color-neon-green]">Cart (2)</button>
          </li>
        </ul>
      </div>
    </header>
  );
}
