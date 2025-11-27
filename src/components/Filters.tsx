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
          className="rounded-md border border-[--color-dark-700] bg-[--color-dark-800] px-3 py-2 text-sm font-medium text-white"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          Filters
        </button>
        <button className="text-xs text-[--color-neon-blue] underline" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <aside className="sticky top-24 hidden h-fit min-w-60 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800]/50 backdrop-blur-sm p-4 md:block">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">Filters</h3>
          <button className="text-xs text-[--color-neon-blue] hover:text-white transition-colors" onClick={clearAll}>
            Clear all
          </button>
        </div>

        <Group title={`Brand ${activeCounts.brand ? `(${activeCounts.brand})` : ""}`} k="brand">
          <ul className="space-y-2">
            {BRANDS.map((b) => {
              const checked = getArrayParam(search, "brand").includes(b);
              return (
                <li key={b} className="flex items-center gap-2">
                  <input
                    id={`brand-${b}`}
                    type="checkbox"
                    className="h-4 w-4 accent-[--color-neon-blue] bg-[--color-dark-900] border-[--color-dark-500]"
                    checked={checked}
                    onChange={() => onToggle("brand", b)}
                  />
                  <label htmlFor={`brand-${b}`} className="text-sm text-[--color-light-300] hover:text-white cursor-pointer">
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
                  <label className={`flex cursor-pointer items-center justify-center rounded border px-2 py-1 text-xs transition-all ${checked
                      ? "border-[--color-neon-blue] bg-[--color-neon-blue]/20 text-[--color-neon-blue]"
                      : "border-[--color-dark-700] bg-[--color-dark-900] text-[--color-dark-500] hover:border-[--color-light-300]"
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
                  <label className={`flex cursor-pointer items-center justify-center rounded border px-2 py-1 text-xs transition-all ${checked
                      ? "border-[--color-neon-purple] bg-[--color-neon-purple]/20 text-[--color-neon-purple]"
                      : "border-[--color-dark-700] bg-[--color-dark-900] text-[--color-dark-500] hover:border-[--color-light-300]"
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
                <li key={c} className="flex items-center gap-2">
                  <input
                    id={`color-${c}`}
                    type="checkbox"
                    className="h-4 w-4 accent-[--color-neon-blue]"
                    checked={checked}
                    onChange={() => onToggle("color", c)}
                  />
                  <label htmlFor={`color-${c}`} className="text-sm text-[--color-light-300] capitalize hover:text-white cursor-pointer">
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
                <li key={p.id} className="flex items-center gap-2">
                  <input
                    id={`price-${p.id}`}
                    type="checkbox"
                    className="h-4 w-4 accent-[--color-neon-green]"
                    checked={checked}
                    onChange={() => onToggle("price", p.id)}
                  />
                  <label htmlFor={`price-${p.id}`} className="text-sm text-[--color-light-300] hover:text-white cursor-pointer">
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[80%] overflow-auto bg-[--color-dark-900] p-4 shadow-xl border-r border-[--color-dark-700]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-rajdhani text-xl font-bold text-white">Filters</h3>
              <button className="text-xs text-[--color-neon-blue]" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <div className="md:hidden">
              <Group title="Brand" k="brand">
                <ul className="space-y-2">
                  {BRANDS.map((b) => {
                    const checked = getArrayParam(search, "brand").includes(b);
                    return (
                      <li key={b} className="flex items-center gap-2">
                        <input
                          id={`m-brand-${b}`}
                          type="checkbox"
                          className="h-4 w-4 accent-[--color-neon-blue]"
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
                        <label className={`flex cursor-pointer items-center justify-center rounded border px-2 py-1 text-xs transition-all ${checked
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
                        <label className={`flex cursor-pointer items-center justify-center rounded border px-2 py-1 text-xs transition-all ${checked
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
                      <li key={c} className="flex items-center gap-2">
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
                      <li key={p.id} className="flex items-center gap-2">
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
