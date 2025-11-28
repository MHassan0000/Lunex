"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { getAllProducts } from "@/lib/actions/product";
import Link from "next/link";
import Image from "next/image";
import { X, Search, Loader2, ArrowRight } from "lucide-react";

type SearchResult = {
    id: string;
    name: string;
    imageUrl: string | null;
    minPrice: number | null;
    subtitle?: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: Props) {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 500);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Sync with URL on mount if needed, or just keep local
    // For this requirement: "type should automatically appear in the searchparams in the url"

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            // Focus input?
        } else {
            document.body.style.overflow = "";
            setQuery("");
            setResults([]);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                // Clear URL param if empty?
                // router.replace(pathname); 
                return;
            }

            startTransition(async () => {
                // Update URL
                // We probably don't want to navigate to /products page immediately, 
                // but the prompt says "type should automatically appear in the searchparams in the url"
                // This might imply we are ON the search page or just updating the current URL?
                // Updating current URL might trigger page reloads if not careful.
                // Let's just fetch data for the overlay first.

                try {
                    // We reuse getAllProducts but we need to map the result
                    const res = await getAllProducts({
                        search: debouncedQuery,
                        page: 1,
                        limit: 8,
                        sort: "newest",
                        brandSlugs: [],
                        categorySlugs: [],
                        storageSlugs: [],
                        ramSlugs: [],
                        colorSlugs: [],
                        priceRanges: []
                    });
                    setResults(res.products);
                } catch (error) {
                    console.error("Search error:", error);
                }
            });
        };

        performSearch();
    }, [debouncedQuery]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[--color-dark-950]/95 backdrop-blur-xl animate-fade-in" onKeyDown={handleKeyDown}>
            {/* Header / Search Bar */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <div className="flex items-center justify-end mb-8">
                    <button onClick={onClose} className="text-[--color-light-300] hover:text-white transition-colors">
                        <span className="sr-only">Close</span>
                        <X className="h-8 w-8" />
                    </button>
                </div>

                <div className="relative mx-auto max-w-3xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-[--color-dark-400]" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="w-full rounded-full border-2 border-[--color-dark-700] bg-[--color-dark-900] py-4 pl-14 pr-12 text-xl text-white placeholder-[--color-dark-400] focus:border-[--color-neon-blue] focus:outline-none focus:ring-0 transition-all"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[--color-dark-400] hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 pb-20">
                <div className="container mx-auto max-w-5xl">
                    {isPending ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-[--color-neon-blue]" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    onClick={onClose}
                                    className="group flex flex-col rounded-xl bg-[--color-dark-900] p-4 transition-all hover:bg-[--color-dark-800] hover:shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[--color-dark-950] mb-4">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[--color-dark-500]">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-rajdhani text-lg font-bold text-white group-hover:text-[--color-neon-blue] transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-[--color-dark-400] mb-2">{product.subtitle}</p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="font-bold text-[--color-light-300]">
                                            ${product.minPrice?.toFixed(2) ?? "N/A"}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : query.trim() ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-[--color-dark-400]">No results found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-[--color-dark-400]">Start typing to search...</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="flex justify-center mt-12">
                            <Link
                                href={`/products?search=${encodeURIComponent(debouncedQuery)}`}
                                onClick={onClose}
                                className="flex items-center gap-2 text-[--color-neon-blue] hover:text-white transition-colors font-bold"
                            >
                                View all results <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
