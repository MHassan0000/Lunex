import Image from "next/image";
import Link from "next/link";

type BadgeTone = "blue" | "purple" | "green" | "red";

export type CardProps = {
  title: string;
  subtitle?: string;
  imageSrc: string;
  price?: number | string;
  href: string;
  badge?: { label: string; tone?: BadgeTone };
  specs?: { ram?: string; storage?: string };
  className?: string;
};

const badgeStyles: Record<BadgeTone, string> = {
  blue: "bg-[--color-neon-blue]/10 text-[--color-neon-blue] border-[--color-neon-blue] animate-glow",
  purple: "bg-[--color-neon-purple]/10 text-[--color-neon-purple] border-[--color-neon-purple]",
  green: "bg-[--color-neon-green]/10 text-[--color-neon-green] border-[--color-neon-green]",
  red: "bg-[--color-neon-red]/10 text-[--color-neon-red] border-[--color-neon-red]",
};

export default function Card({
  title,
  subtitle,
  imageSrc,
  price,
  href,
  badge,
  specs,
  className = "",
}: CardProps) {
  const tone = badge?.tone || "blue";

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-[--color-dark-800] border border-[--color-dark-700] transition-all duration-300 hover:translate-y-[-4px] hover:border-[--color-neon-purple] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] ${className}`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute left-3 top-3 z-10">
          <span
            className={`rounded-sm border px-2 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md ${badgeStyles[tone]}`}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[--color-dark-900]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-dark-950] via-transparent to-transparent opacity-60" />

        {/* Tech Overlay on Hover */}
        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-0 bg-cover mix-blend-overlay transition-opacity duration-300 group-hover:opacity-30" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4 relative">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[--color-dark-700]/50 to-transparent -mr-4 -mt-4 rotate-45 group-hover:from-[--color-neon-purple]/30 transition-colors" />

        {/* Subtitle/Brand */}
        {subtitle && (
          <p className="text-xs font-bold uppercase tracking-widest text-[--color-neon-blue] group-hover:text-[--color-neon-purple] transition-colors">
            {subtitle}
          </p>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 font-rajdhani text-xl font-bold text-white transition-colors group-hover:text-glow-purple">
          {title}
        </h3>

        {/* Specs */}
        {specs && (specs.ram || specs.storage) && (
          <div className="flex gap-2 text-xs text-[--color-dark-500] font-mono mt-1">
            {specs.ram && <span className="rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]/50 px-2 py-0.5">{specs.ram}</span>}
            {specs.storage && <span className="rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]/50 px-2 py-0.5">{specs.storage}</span>}
          </div>
        )}

        {/* Price */}
        {price !== undefined && (
          <div className="mt-auto pt-3 border-t border-[--color-dark-700]/50 flex items-center justify-between">
            <p className="font-rajdhani text-2xl font-bold text-white group-hover:text-[--color-neon-green] transition-colors">
              {typeof price === "number" ? `$${price.toFixed(2)}` : price}
            </p>
            <span className="text-[--color-neon-purple] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              →
            </span>
          </div>
        )}
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[--color-neon-blue] via-[--color-neon-purple] to-[--color-neon-blue] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}
