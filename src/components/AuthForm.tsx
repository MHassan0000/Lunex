"use client";

import { useState } from "react";
import Link from "next/link";
import SocialProviders from "./SocialProviders";
import { useRouter } from "next/navigation";

type Props = {
  mode: "sign-in" | "sign-up";
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; userId?: string } | void>;
};

export default function AuthForm({ mode, onSubmit }: Props) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const result = await onSubmit(formData);

      if (result?.ok) router.push("/");
    } catch (e) {
      console.log("error", e);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-8 shadow-2xl">
      <div className="text-center">
        <p className="text-sm text-[--color-dark-500]">
          {mode === "sign-in" ? "Don’t have an account? " : "Already have an account? "}
          <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="text-[--color-neon-blue] hover:underline">
            {mode === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </p>
        <h1 className="mt-3 font-rajdhani text-3xl font-bold text-white">
          {mode === "sign-in" ? "Welcome Back!" : "Join Lunex Today!"}
        </h1>
        <p className="mt-1 text-sm text-[--color-light-300]">
          {mode === "sign-in"
            ? "Sign in to access your gear"
            : "Create your account to level up your tech"}
        </p>
      </div>

      <SocialProviders variant={mode} />

      <div className="flex items-center gap-4">
        <hr className="h-px w-full border-0 bg-[--color-dark-700]" />
        <span className="shrink-0 text-xs text-[--color-dark-500]">
          Or {mode === "sign-in" ? "sign in" : "sign up"} with
        </span>
        <hr className="h-px w-full border-0 bg-[--color-dark-700]" />
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        {mode === "sign-up" && (
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-medium text-[--color-light-300]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 text-white placeholder:text-[--color-dark-500] focus:border-[--color-neon-blue] focus:outline-none focus:ring-1 focus:ring-[--color-neon-blue]"
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-medium text-[--color-light-300]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-full rounded-lg border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 text-white placeholder:text-[--color-dark-500] focus:border-[--color-neon-blue] focus:outline-none focus:ring-1 focus:ring-[--color-neon-blue]"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-medium text-[--color-light-300]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="minimum 8 characters"
              className="w-full rounded-lg border border-[--color-dark-700] bg-[--color-dark-900] px-4 py-3 pr-12 text-white placeholder:text-[--color-dark-500] focus:border-[--color-neon-blue] focus:outline-none focus:ring-1 focus:ring-[--color-neon-blue]"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 text-xs text-[--color-dark-500] hover:text-white"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-[--color-neon-blue] px-6 py-3 font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] focus:outline-none focus:ring-2 focus:ring-[--color-neon-blue]"
        >
          {mode === "sign-in" ? "Sign In" : "Sign Up"}
        </button>

        {mode === "sign-up" && (
          <p className="text-center text-xs text-[--color-dark-500]">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[--color-neon-blue] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[--color-neon-blue] hover:underline">
              Privacy Policy
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
