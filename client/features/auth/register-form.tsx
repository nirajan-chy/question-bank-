"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/services/api";
import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import { OAuthButtons } from "./oauth-buttons";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Form = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ name, email, password }: Form) => {
    setSubmitting(true);
    try {
      const { token, user } = await auth.register(name, email, password);
      setAuth(token, user);
      toast.success("Account created!", { description: `Welcome to PrashnaHub, ${user.name.split(" ")[0]}!` });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="mb-5" />
        <h1 className="font-display text-2xl font-bold">Join PrashnaHub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a free account to ask questions and track your progress.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <OAuthButtons />

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              or sign up with email
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Sujan Adhikari" autoComplete="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" placeholder="At least 6 characters" autoComplete="new-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={submitting}>
              <UserPlus className="h-4 w-4" /> {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
