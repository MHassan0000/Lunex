import AuthForm from "@/components/AuthForm";
import DarkVeil from "@/components/DarkVeil";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center">
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>
      <div className="relative z-10">
        <AuthForm mode="sign-in" />
      </div>
    </main>
  );
}
