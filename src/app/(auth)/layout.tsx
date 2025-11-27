export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[--color-dark-950]">
      <header className="border-b border-[--color-dark-700] bg-[--color-dark-900] px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[--color-neon-blue] font-rajdhani text-xl font-bold text-black">
            L
          </div>
          <span className="font-rajdhani text-xl font-bold text-white">Lunex</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm text-[--color-light-300]">
              Join thousands of tech enthusiasts who trust Lunex for their gadget needs.
            </p>
          </div>
          {children}
        </div>
      </main>
      <footer className="border-t border-[--color-dark-700] bg-[--color-dark-900] px-4 py-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs text-[--color-dark-500]">© 2025 Lunex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
