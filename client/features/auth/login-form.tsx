"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, LogIn } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/services/api";
import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type Form = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }: Form) => {
    setSubmitting(true);
    try {
      const { token, user } = await auth.login(email, password);
      setAuth(token, user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push(user.role === "admin" ? "/admin" : "/");
      router.refresh();
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Please check your credentials.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="mb-5" />
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue your Sandarbh journey.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <PasswordInput id="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={submitting}>
              <LogIn className="h-4 w-4" /> {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium text-primary">
              <ShieldCheck className="h-4 w-4" /> Admin demo access
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Email <code className="rounded bg-muted px-1 py-0.5 text-xs">admin@sandarbh.com</code> · Password{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">admin123</code>
            </p>
          </div> */}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              Create one <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
