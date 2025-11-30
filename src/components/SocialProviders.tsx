import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Props = { variant?: "sign-in" | "sign-up" };

export default function SocialProviders({ variant = "sign-in" }: Props) {
  const handleSocialSignIn = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    }, {
      onSuccess: () => {
        // toast.success(`Signed in with ${provider}`);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => handleSocialSignIn("google")}
        className="flex w-full items-center justify-center gap-3 rounded-sm border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:border-[--color-neon-blue] hover:text-[--color-neon-blue] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[--color-neon-blue]"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Google`}
      >
        <Image src="/icons/google.svg" alt="" width={18} height={18} />
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        onClick={() => handleSocialSignIn("github")}
        className="flex w-full items-center justify-center gap-3 rounded-sm border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:border-[--color-neon-blue] hover:text-[--color-neon-blue] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[--color-neon-blue]"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with GitHub`}
      >
        <Image src="/icons/github.svg" alt="github" width={18} height={18} className="invert" />
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
}
