"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/components/shared/motion";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSubscribed(true);
    toast.success("You're subscribed!", { description: "Study tips and exam alerts, every week." });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-secondary p-8 text-white md:p-14">
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl font-bold text-balance md:text-4xl">
                  Exam alerts & study tips, weekly.
                </h2>
                <p className="mt-3 max-w-md text-sm text-white/80 md:text-base">
                  Join 80,000+ Nepali students. Mock test reminders, scholarship deadlines and
                  topper strategies — straight to your inbox.
                </p>
              </div>
              <div>
                {subscribed ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <CheckCircle2 className="h-8 w-8 shrink-0" />
                    <div>
                      <p className="font-semibold">Welcome aboard!</p>
                      <p className="text-sm text-white/80">Check your inbox to confirm your subscription.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <Label htmlFor="newsletter-email" className="text-white/90">
                      Email address
                    </Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white"
                        {...register("email")}
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 shrink-0 bg-white text-secondary hover:bg-white/90"
                      >
                        <Mail className="h-4 w-4" />
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-amber-200">{errors.email.message}</p>
                    )}
                    <p className="text-xs text-white/60">
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
