import Image from "next/image";

type Props = { variant?: "sign-in" | "sign-up" };

export default function SocialProviders({ variant = "sign-in" }: Props) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 text-sm font-medium text-white transition-all hover:border-[--color-light-300] hover:bg-[--color-dark-800] focus:outline-none focus:ring-2 focus:ring-[--color-neon-blue]"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Google`}
      >
        <Image src="/google.svg" alt="" width={18} height={18} />
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 text-sm font-medium text-white transition-all hover:border-[--color-light-300] hover:bg-[--color-dark-800] focus:outline-none focus:ring-2 focus:ring-[--color-neon-blue]"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Apple`}
      >
        <Image src="/apple.svg" alt="" width={18} height={18} className="invert" />
        <span>Continue with Apple</span>
      </button>
    </div>
  );
}
