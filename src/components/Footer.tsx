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
    <footer className="bg-[--color-dark-950] border-t border-[--color-dark-700] text-[--color-light-300]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="flex flex-col items-start gap-4 md:col-span-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div>
                <Image src="/images/circuit1.png" alt="logo" width={50} height={50} />
              </div>
              <span className="font-rajdhani text-2xl font-bold tracking-wider text-white">LUNEX</span>
            </Link>
            <p className="text-sm text-[--color-dark-500] max-w-xs">
              Premium electronics and gadgets for the modern digital warrior. Level up your tech game.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-rajdhani text-lg font-bold text-white uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-[--color-dark-500] hover:text-[--color-neon-blue] hover:text-glow transition-colors"
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

      <div className="border-t border-[--color-dark-700] bg-[--color-dark-900]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-[--color-dark-500] sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span>© 2025 Lunex Tech. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
