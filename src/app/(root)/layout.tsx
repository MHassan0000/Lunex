import { Navbar, Footer } from "@/components";
import { WishlistSyncProvider } from "@/components/WishlistSync";
import { getCurrentUser } from "@/lib/auth/actions";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <WishlistSyncProvider isAuthenticated={!!user}>
      <Navbar />
      {children}
      <Footer />
    </WishlistSyncProvider>
  );
}
