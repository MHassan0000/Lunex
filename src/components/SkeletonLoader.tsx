export function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-[--color-dark-700] bg-[--color-dark-800]">
            <div className="skeleton aspect-square w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-6 w-1/3 rounded" />
            </div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
            <div className="skeleton aspect-square w-full rounded-xl" />
            <div className="space-y-6">
                <div className="skeleton h-8 w-3/4 rounded" />
                <div className="skeleton h-6 w-1/2 rounded" />
                <div className="skeleton h-12 w-full rounded" />
                <div className="skeleton h-12 w-full rounded" />
            </div>
        </div>
    );
}
