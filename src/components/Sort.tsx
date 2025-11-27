"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setParam } from "@/lib/utils/query";
import { useMemo } from "react";

const OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Performance (High to Low)", value: "performance_desc" },
  { label: "Release Year (Newest)", value: "year_desc" },
] as const;

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);
  const selected = searchParams.get("sort") ?? "featured";

  const onChange = (value: string) => {
    const withSort = setParam(pathname, search, "sort", value);
    const withPageReset = setParam(pathname, new URL(withSort, "http://dummy").search, "page", "1");
    router.push(withPageReset, { scroll: false });
  };

  return (
    <label className="inline-flex items-center gap-3">
      <span className="text-sm font-medium text-[--color-dark-500] uppercase tracking-wider">Sort by</span>
      <div className="relative">
        <select
          className="appearance-none rounded-md border border-[--color-dark-700] bg-[--color-dark-900] pl-3 pr-8 py-2 text-sm text-white focus:border-[--color-neon-blue] focus:outline-none focus:ring-1 focus:ring-[--color-neon-blue]"
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort products"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[--color-dark-500]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </label>
  );
}
