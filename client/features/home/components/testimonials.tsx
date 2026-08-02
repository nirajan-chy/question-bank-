"use client";

import { Star, Quote } from "lucide-react";
import { useTestimonials } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Testimonials() {
  const { data: testimonials, isPending } = useTestimonials();

  if (isPending) {
    return (
      <section className="border-y bg-muted/30 py-16 md:py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Testimonials"
            title="Students who made it"
            description="Real results from real students across Nepal."
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border bg-card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) return null;

  return (
    <section className="border-y bg-muted/30 py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Testimonials"
          title="Students who made it"
          description="Real results from real students across Nepal."
          align="center"
        />
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <figure className="relative flex h-full flex-col rounded-2xl border bg-background p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < t.rating ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 text-muted"}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                  <Avatar>
                    <AvatarFallback className="bg-brand-gradient text-white">{t.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <Badge variant="success" className="shrink-0 text-[10px]">
                    {t.achievement}
                  </Badge>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
