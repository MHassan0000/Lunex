import Image from "next/image";
import Link from "next/link";

export type BadgeTone = "red" | "green" | "orange" | "blue" | "purple";

export interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  href?: string;
  badge?: { label: string; tone?: BadgeTone };
  className?: string;
  specs?: { label: string; value: string }[];
}

const toneToBg: Record<BadgeTone, string> = {
  red: "bg-[--color-neon-red] text-white shadow-[0_0_10px_var(--color-neon-red)]",
  green: "bg-[--color-neon-green] text-black shadow-[0_0_10px_var(--color-neon-green)]",
  orange: "bg-[--color-orange] text-white",
  blue: "bg-[--color-neon-blue] text-black shadow-[0_0_10px_var(--color-neon-blue)]",
  purple: "bg-[--color-neon-purple] text-white shadow-[0_0_10px_var(--color-neon-purple)]",
};

export default function Card({
  title,
  description,
  subtitle,
  meta,
  imageSrc,
  imageAlt = title,
  price,
  href,
  badge,
  className = "",
  specs,
}: CardProps) {
  const displayPrice =
    price === undefined ? undefined : typeof price === "number" ? `$${price.toFixed(2)}` : price;

  const content = (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-[--color-dark-800] border border-[--color-dark-700] transition-all duration-300 hover:border-[--color-neon-blue] hover:shadow-[0_0_15px_rgba(0,243,255,0.15)] ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[--color-dark-900]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {badge && (
          <span
            className={`absolute top-3 left-3 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider ${toneToBg[badge.tone ?? "blue"]
              }`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          {subtitle && (
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[--color-neon-blue]">
              {subtitle}
            </p>
          )}
          <h3 className="font-rajdhani text-xl font-bold leading-tight text-white group-hover:text-[--color-neon-blue] transition-colors">
            {title}
          </h3>
        </div>

        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-[--color-dark-500]">{description}</p>
        )}

        {specs && specs.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {specs.map((spec, i) => (
              <div
                key={i}
                className="rounded border border-[--color-dark-700] bg-[--color-dark-900] px-2 py-1 text-[10px] uppercase tracking-wide text-[--color-light-300]"
              >
                <span className="text-[--color-dark-500] mr-1">{spec.label}:</span>
                {spec.value}
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-[--color-dark-700] pt-4">
          <div className="flex flex-col">
            {meta && (
              <span className="text-xs text-[--color-dark-500]">
                {Array.isArray(meta) ? meta.join(" • ") : meta}
              </span>
            )}
          </div>
          {displayPrice && (
            <span className="font-rajdhani text-2xl font-bold text-white text-glow">
              {displayPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      aria-label={title}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue] rounded-xl"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
