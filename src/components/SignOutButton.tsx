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
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[--color-dark-600] bg-[--color-dark-700] px-4 py-2 text-sm font-medium text-[--color-light-300] transition hover:bg-[--color-dark-600] hover:text-white"
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </button>
    );
}
