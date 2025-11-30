"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { User, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchOverlay from "@/components/SearchOverlay";
import { useCartStore } from "@/store/cart";
import { getCartCount } from "@/lib/actions/cart";

const NAV_LINKS = [
  { label: "Smartphones", href: "/products?category=smartphones" },
  { label: "Laptops", href: "/products?category=laptops" },
  { label: "Audio", href: "/products?category=headphones" },
  { label: "Wearables", href: "/products?category=smartwatches" },
  { label: "Accessories", href: "/products?category=accessories" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { count, setCount } = useCartStore();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const c = await getCartCount();
        setCount(c);
      } catch (e) {
        console.error("Failed to fetch cart count", e);
      }
    };
    fetchCount();
  }, [setCount]);



  return (
    <>
      <header className="sticky top-0 z-50 glass-panel-rpg border-b border-[--color-neon-purple]/20">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          <Link href="/" aria-label="Lunex Home" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[--color-neon-purple] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <Image src="/images/circuit1bg.png" alt="logo" width={60} height={60} className="relative z-10" />
            </div>
            <span className="font-rajdhani text-2xl font-bold tracking-wider text-white group-hover:text-glow-purple transition-all">LUNEX</span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-bold uppercase tracking-widest text-[--color-light-300] transition-all hover:text-[--color-neon-purple] hover:text-glow-purple relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[--color-neon-purple] transition-all group-hover:w-full box-shadow-[0_0_10px_var(--color-neon-purple)]"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[--color-light-300] transition-colors hover:text-[--color-neon-blue] hover:text-glow"
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="text-[--color-light-300] transition-colors hover:text-[--color-neon-green] hover:text-glow flex items-center gap-2 group">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[--color-neon-green] transition-colors"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
              <span className="font-rajdhani font-bold group-hover:text-[--color-neon-green] transition-colors">Cart ({count})</span>
            </Link>

            {session ? (
              <Link href="/account" className="relative h-9 w-9 overflow-hidden rounded-full border border-[--color-dark-700] transition hover:border-[--color-neon-purple] hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                {session.user.image ? (
                  <Image src={session.user.image} alt={session.user.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[--color-dark-800] text-[--color-light-300]">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="relative overflow-hidden rounded-sm bg-[--color-dark-800] border border-[--color-neon-purple] px-6 py-2 text-sm font-bold text-[--color-neon-purple] hover:text-white transition-all hover:bg-[--color-neon-purple] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] tracking-widest uppercase group"
              >
                <span className="relative z-10">Login</span>
              </Link>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-[--color-light-300] hover:text-[--color-neon-purple] md:hidden"
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
          className={`border-t border-[--color-neon-purple]/20 bg-[--color-dark-950]/95 backdrop-blur-xl md:hidden ${open ? "block" : "hidden"}`}
        >
          <ul className="space-y-2 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-2 text-base font-bold uppercase tracking-wider text-[--color-light-300] hover:text-[--color-neon-purple] hover:text-glow-purple border-l-2 border-transparent hover:border-[--color-neon-purple] pl-2 transition-all"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between pt-4 border-t border-[--color-dark-700] mt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setIsSearchOpen(true);
                }}
                className="text-[--color-light-300] flex items-center gap-2 hover:text-[--color-neon-blue]"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
              <Link href="/cart" className="text-[--color-neon-green] font-rajdhani font-bold hover:text-glow">Cart ({count})</Link>
            </li>
            <li className="pt-2">
              {session ? (
                <Link href="/account" className="block py-2 text-base font-medium text-white hover:text-[--color-neon-purple]" onClick={() => setOpen(false)}>Account</Link>
              ) : (
                <Link href="/sign-in" className="block py-2 text-base font-bold uppercase tracking-wider text-[--color-neon-purple] hover:text-white" onClick={() => setOpen(false)}>Login</Link>
              )}
            </li>
          </ul>
        </div>
      </header>

      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
