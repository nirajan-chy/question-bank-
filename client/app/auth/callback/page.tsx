"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/services/api";
import { setAuthToken } from "@/services/http";
import { useAuthStore } from "@/store/use-auth-store";
import type { User } from "@/types";
import { Logo } from "@/components/shared/logo";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");
    const userParam = params.get("user");

    if (error) {
      toast.error("OAuth sign-in failed", { description: error });
      router.replace("/login");
      return;
    }

    if (!token) {
      toast.error("Missing token from OAuth provider");
      router.replace("/login");
      return;
    }

    setAuthToken(token);
    let user: User | undefined;
    try {
      if (userParam) user = JSON.parse(userParam) as User;
    } catch {
      user = undefined;
    }

    const finish = (u: User) => {
      setAuth(token, u);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
      router.replace(u.role === "admin" ? "/admin" : "/");
    };

    if (user) {
      finish(user);
      return;
    }

    (async () => {
      try {
        finish(await auth.me());
      } catch (err) {
        toast.error("Could not complete sign-in", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
        router.replace("/login");
      }
    })();
  }, [params, router, setAuth]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Logo className="mb-2" />
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Suspense>
        <CallbackContent />
      </Suspense>
    </section>
  );
}
