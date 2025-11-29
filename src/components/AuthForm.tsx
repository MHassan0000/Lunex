"use client";

import { useState } from "react";
import Link from "next/link";
import SocialProviders from "./SocialProviders";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

type Props = {
  mode: "sign-in" | "sign-up";
};
export default function AuthForm({ mode }: Props) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (mode === "sign-in") {
        await authClient.signIn.email({
          email,
          password,
        }, {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          }
        });
      } else {
        await authClient.signUp.email({
          email,
          password,
          name,
        }, {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          }
        });
      }
    } catch (e) {
      console.log("error", e);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel-rpg p-8 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-[--color-dark-500]">
          {mode === "sign-in" ? "Don’t have an account? " : "Already have an account? "}
          <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="text-[--color-neon-blue] hover:text-white transition-colors hover:underline">
            {mode === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </p>
        <h1 className="mt-4 font-rajdhani text-4xl font-bold text-white uppercase tracking-widest text-glow-purple">
          {mode === "sign-in" ? "Welcome Back" : "Join Lunex"}
        </h1>
        <p className="mt-2 text-sm text-[--color-light-300] font-medium">
          {mode === "sign-in"
            ? "Authenticate to access your gear"
            : "Initialize your operative profile"}
        </p>
      </div>

      <SocialProviders variant={mode} />

      <div className="flex items-center gap-4 my-6">
        <hr className="h-px w-full border-0 bg-[--color-dark-700]" />
        <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-[--color-dark-500]">
          Or {mode === "sign-in" ? "sign in" : "sign up"} with
        </span>
        <hr className="h-px w-full border-0 bg-[--color-dark-700]" />
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="rounded-sm bg-red-500/10 p-3 text-sm font-bold text-red-500 border border-red-500/30 text-center uppercase tracking-wide">
            {error}
          </div>
        )}

        {mode === "sign-up" && (
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[--color-light-300]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="ENTER YOUR NAME"
              className="w-full rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]/50 px-4 py-3 text-white placeholder:text-[--color-dark-500] focus:border-[--color-neon-blue] focus:bg-[--color-dark-900] focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-mono text-sm"
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[--color-light-300]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="OPERATIVE@LUNEX.COM"
            className="w-full rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]/50 px-4 py-3 text-white placeholder:text-[--color-dark-500] focus:border-[--color-neon-blue] focus:bg-[--color-dark-900] focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-mono text-sm"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[--color-light-300]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]/50 px-4 py-3 pr-16 text-white placeholder:text-[--color-dark-500] focus:border-[--color-neon-blue] focus:bg-[--color-dark-900] focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-mono text-sm"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 text-xs font-bold uppercase tracking-wider text-[--color-dark-500] hover:text-[--color-neon-blue] transition-colors"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center rounded-sm bg-[--color-neon-blue] px-6 py-4 font-rajdhani font-bold text-lg text-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (mode === "sign-in" ? "Authenticate" : "Initialize")}
        </button>

        {mode === "sign-up" && (
          <p className="text-center text-xs text-[--color-dark-500] mt-4">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[--color-neon-blue] hover:underline hover:text-white transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[--color-neon-blue] hover:underline hover:text-white transition-colors">
              Privacy Policy
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
