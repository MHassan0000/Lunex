"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getArrayParam, removeParams, toggleArrayParam } from "@/lib/utils/query";

const BRANDS = ["Apple", "Samsung", "Lenovo", "Sony", "Dell", "ASUS", "HP", "Google", "Xiaomi"];
const STORAGE = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
const RAM = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const COLORS = ["black", "white", "silver", "space-gray", "gold", "blue"];
const PRICES = [
  { id: "0-500", label: "$0 - $500" },
  { id: "500-1000", label: "$500 - $1000" },
  { id: "1000-2000", label: "$1000 - $2000" },
  { id: "2000-", label: "Over $2000" },
] as const;

type GroupKey = "brand" | "storage" | "ram" | "color" | "price";

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
    brand: true,
    storage: true,
    ram: true,
    color: true,
    price: true,
  });

  const activeCounts = {
    brand: getArrayParam(search, "brand").length,
    storage: getArrayParam(search, "storage").length,
    ram: getArrayParam(search, "ram").length,
    color: getArrayParam(search, "color").length,
    price: getArrayParam(search, "price").length,
  };

  useEffect(() => {
    setOpen(false);
  }, [search]);

  const onToggle = (key: GroupKey, value: string) => {
    const url = toggleArrayParam(pathname, search, key, value);
    router.push(url, { scroll: false });
  };

  const clearAll = () => {
    const url = removeParams(pathname, search, ["brand", "storage", "ram", "color", "price", "page"]);
    router.push(url, { scroll: false });
  };

  const Group = ({
    title,
    children,
    k,
  }: {
    title: string;
    children: import("react").ReactNode;
    k: GroupKey;
  }) => (
    <div className="border-b border-[--color-dark-700] py-4">
      <button
        className="flex w-full items-center justify-between text-sm font-medium text-white hover:text-[--color-neon-blue] transition-colors"
        onClick={() => setExpanded((s) => ({ ...s, [k]: !s[k] }))}
        aria-expanded={expanded[k]}
        aria-controls={`${k}-section`}
      >
        <span className="uppercase tracking-wider">{title}</span>
        <span className="text-[--color-neon-blue]">{expanded[k] ? "−" : "+"}</span>
      </button>
      <div id={`${k}-section`} className={`${expanded[k] ? "mt-3 block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between md:hidden">
        <button
          className="rounded-md border border-[--color-neon-purple] bg-[--color-dark-800] px-4 py-2 text-sm font-bold text-[--color-neon-purple] uppercase tracking-wider"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          Filters
        </button>
        <button className="text-xs text-[--color-neon-blue] hover:text-white underline" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <aside className="sticky top-24 hidden h-fit min-w-60 rounded-xl glass-panel-rpg p-6 md:block">
        <div className="mb-6 flex items-center justify-between border-b border-[--color-dark-700] pb-4">
          <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider text-glow-purple">Filters</h3>
          <button className="text-xs text-[--color-neon-blue] hover:text-white transition-colors uppercase tracking-wider font-bold" onClick={clearAll}>
            Clear all
          </button>
        </div>

        <Group title={`Brand ${activeCounts.brand ? `(${activeCounts.brand})` : ""}`} k="brand">
          <ul className="space-y-2">
            {BRANDS.map((b) => {
              const checked = getArrayParam(search, "brand").includes(b);
              return (
                <li key={b} className="flex items-center gap-3 group">
                  <div className="relative flex items-center">
                    <input
                      id={`brand-${b}`}
                      type="checkbox"
                      className="peer h-4 w-4 appearance-none rounded-sm border border-[--color-dark-500] bg-[--color-dark-900] checked:border-[--color-neon-blue] checked:bg-[--color-neon-blue] transition-all cursor-pointer"
                      checked={checked}
                      onChange={() => onToggle("brand", b)}
                    />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <label htmlFor={`brand-${b}`} className="text-sm text-[--color-light-300] group-hover:text-[--color-neon-blue] transition-colors cursor-pointer font-medium tracking-wide">
                    {b}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Storage ${activeCounts.storage ? `(${activeCounts.storage})` : ""}`} k="storage">
          <ul className="grid grid-cols-3 gap-2">
            {STORAGE.map((s) => {
              const checked = getArrayParam(search, "storage").includes(s);
              return (
                <li key={s}>
                  <label className={`flex cursor-pointer items-center justify-center rounded-sm border px-2 py-1.5 text-xs transition-all font-bold tracking-wider ${checked
                    ? "border-[--color-neon-blue] bg-[--color-neon-blue]/20 text-[--color-neon-blue] shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                    : "border-[--color-dark-700] bg-[--color-dark-900] text-[--color-dark-500] hover:border-[--color-neon-blue]/50 hover:text-[--color-light-300]"
                    }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => onToggle("storage", s)}
                    />
                    <span>{s}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`RAM ${activeCounts.ram ? `(${activeCounts.ram})` : ""}`} k="ram">
          <ul className="grid grid-cols-3 gap-2">
            {RAM.map((r) => {
              const checked = getArrayParam(search, "ram").includes(r);
              return (
                <li key={r}>
                  <label className={`flex cursor-pointer items-center justify-center rounded-sm border px-2 py-1.5 text-xs transition-all font-bold tracking-wider ${checked
                    ? "border-[--color-neon-purple] bg-[--color-neon-purple]/20 text-[--color-neon-purple] shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    : "border-[--color-dark-700] bg-[--color-dark-900] text-[--color-dark-500] hover:border-[--color-neon-purple]/50 hover:text-[--color-light-300]"
                    }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => onToggle("ram", r)}
                    />
                    <span>{r}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Color ${activeCounts.color ? `(${activeCounts.color})` : ""}`} k="color">
          <ul className="grid grid-cols-2 gap-2">
            {COLORS.map((c) => {
              const checked = getArrayParam(search, "color").includes(c);
              return (
                <li key={c} className="flex items-center gap-3 group">
                  <div className="relative flex items-center">
                    <input
                      id={`color-${c}`}
                      type="checkbox"
                      className="peer h-4 w-4 appearance-none rounded-full border border-[--color-dark-500] bg-[--color-dark-900] checked:border-[--color-neon-blue] checked:bg-[--color-neon-blue] transition-all cursor-pointer"
                      checked={checked}
                      onChange={() => onToggle("color", c)}
                    />
                    <div className={`absolute left-6 w-3 h-3 rounded-full border border-[--color-dark-700]`} style={{ backgroundColor: c === 'space-gray' ? '#4b5563' : c }} />
                  </div>
                  <label htmlFor={`color-${c}`} className="text-sm text-[--color-light-300] capitalize group-hover:text-white cursor-pointer pl-4">
                    {c.replace("-", " ")}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Price ${activeCounts.price ? `(${activeCounts.price})` : ""}`} k="price">
          <ul className="space-y-2">
            {PRICES.map((p) => {
              const checked = getArrayParam(search, "price").includes(p.id);
              return (
                <li key={p.id} className="flex items-center gap-3 group">
                  <div className="relative flex items-center">
                    <input
                      id={`price-${p.id}`}
                      type="checkbox"
                      className="peer h-4 w-4 appearance-none rounded-sm border border-[--color-dark-500] bg-[--color-dark-900] checked:border-[--color-neon-green] checked:bg-[--color-neon-green] transition-all cursor-pointer"
                      checked={checked}
                      onChange={() => onToggle("price", p.id)}
                    />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <label htmlFor={`price-${p.id}`} className="text-sm text-[--color-light-300] group-hover:text-[--color-neon-green] transition-colors cursor-pointer font-medium">
                    {p.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-auto bg-[--color-dark-900] p-6 shadow-2xl border-r border-[--color-neon-purple]/30">
            <div className="mb-6 flex items-center justify-between border-b border-[--color-dark-700] pb-4">
              <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider">Filters</h3>
              <button className="text-xs text-[--color-neon-blue] font-bold uppercase" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <div className="md:hidden space-y-6">
              <Group title="Brand" k="brand">
                <ul className="space-y-2">
                  {BRANDS.map((b) => {
                    const checked = getArrayParam(search, "brand").includes(b);
                    return (
                      <li key={b} className="flex items-center gap-3">
                        <input
                          id={`m-brand-${b}`}
                          type="checkbox"
                          className="h-4 w-4 accent-[--color-neon-blue] bg-[--color-dark-800]"
                          checked={checked}
                          onChange={() => onToggle("brand", b)}
                        />
                        <label htmlFor={`m-brand-${b}`} className="text-sm text-[--color-light-300]">
                          {b}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Storage" k="storage">
                <ul className="grid grid-cols-3 gap-2">
                  {STORAGE.map((s) => {
                    const checked = getArrayParam(search, "storage").includes(s);
                    return (
                      <li key={s}>
                        <label className={`flex cursor-pointer items-center justify-center rounded-sm border px-2 py-1.5 text-xs transition-all font-bold ${checked
                          ? "border-[--color-neon-blue] bg-[--color-neon-blue]/20 text-[--color-neon-blue]"
                          : "border-[--color-dark-700] bg-[--color-dark-900] text-[--color-dark-500]"
                          }`}>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checked}
                            onChange={() => onToggle("storage", s)}
                          />
                          <span>{s}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="RAM" k="ram">
                <ul className="grid grid-cols-3 gap-2">
                  {RAM.map((r) => {
                    const checked = getArrayParam(search, "ram").includes(r);
                    return (
                      <li key={r}>
                        <label className={`flex cursor-pointer items-center justify-center rounded-sm border px-2 py-1.5 text-xs transition-all font-bold ${checked
                          ? "border-[--color-neon-purple] bg-[--color-neon-purple]/20 text-[--color-neon-purple]"
                          : "border-[--color-dark-700] bg-[--color-dark-900] text-[--color-dark-500]"
                          }`}>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checked}
                            onChange={() => onToggle("ram", r)}
                          />
                          <span>{r}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Color" k="color">
                <ul className="grid grid-cols-2 gap-2">
                  {COLORS.map((c) => {
                    const checked = getArrayParam(search, "color").includes(c);
                    return (
                      <li key={c} className="flex items-center gap-3">
                        <input
                          id={`m-color-${c}`}
                          type="checkbox"
                          className="h-4 w-4 accent-[--color-neon-blue]"
                          checked={checked}
                          onChange={() => onToggle("color", c)}
                        />
                        <label htmlFor={`m-color-${c}`} className="text-sm text-[--color-light-300] capitalize">
                          {c.replace("-", " ")}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Price" k="price">
                <ul className="space-y-2">
                  {PRICES.map((p) => {
                    const checked = getArrayParam(search, "price").includes(p.id);
                    return (
                      <li key={p.id} className="flex items-center gap-3">
                        <input
                          id={`m-price-${p.id}`}
                          type="checkbox"
                          className="h-4 w-4 accent-[--color-neon-green]"
                          checked={checked}
                          onChange={() => onToggle("price", p.id)}
                        />
                        <label htmlFor={`m-price-${p.id}`} className="text-sm text-[--color-light-300]">
                          {p.label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
