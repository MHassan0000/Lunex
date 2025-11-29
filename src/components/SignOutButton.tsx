"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-[--color-dark-700] bg-[--color-dark-800] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[--color-light-300] transition hover:border-[--color-neon-red] hover:text-[--color-neon-red] hover:shadow-[0_0_15px_rgba(255,59,48,0.2)]"
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </button>
    );
}
