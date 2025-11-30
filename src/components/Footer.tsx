import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: ["Smartphones", "Laptops", "Tablets", "Audio", "Wearables"],
  },
  {
    title: "Support",
    links: ["Contact Us", "Shipping Info", "Returns", "Warranty", "FAQ"],
  },
  {
    title: "Company",
    links: ["About Lunex", "Careers", "Press", "Sustainability"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-[--color-dark-950] border-t border-[--color-dark-700] text-[--color-light-300] relative overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[--color-neon-purple] to-transparent opacity-50"></div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="flex flex-col items-start gap-4 md:col-span-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[--color-neon-purple] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <Image src="/images/circuit1bg.png" alt="logo" width={50} height={50} className="relative z-10" />
              </div>
              <span className="font-rajdhani text-2xl font-bold tracking-wider text-white group-hover:text-glow-purple transition-all">LUNEX</span>
            </Link>
            <p className="text-sm text-[--color-dark-500] max-w-xs leading-relaxed">
              Premium electronics and gadgets for the modern digital warrior. <br />
              <span className="text-[--color-neon-purple]">Level up your tech game.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-rajdhani text-lg font-bold text-white uppercase tracking-wider border-b border-[--color-neon-purple]/30 pb-2 inline-block">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-[--color-light-300]/70 hover:text-[--color-neon-blue] hover:text-glow transition-all hover:pl-1"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[--color-dark-700] bg-[--color-dark-900] relative">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-[--color-dark-500] sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span>© 2025 Lunex Tech. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[--color-neon-purple] transition-colors hover:text-glow-purple">Twitter</Link>
            <Link href="#" className="hover:text-[--color-neon-purple] transition-colors hover:text-glow-purple">Instagram</Link>
            <Link href="#" className="hover:text-[--color-neon-purple] transition-colors hover:text-glow-purple">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
