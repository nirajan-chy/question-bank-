"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Rocket, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Users,
    title: "Free for every Nepali student",
    text: "Core resources — notes, question banks, past papers and community Q&A — are completely free. Premium tools exist only to sustain the platform, never to gate learning.",
  },
  {
    icon: BookOpen,
    title: "Curriculum-first content",
    text: "Everything is mapped to the CDC, NEB, CTEVT and university syllabi (TU, KU, PU, Purbanchal). You study exactly what your board expects — nothing more, nothing missing.",
  },
  {
    icon: Rocket,
    title: "Built for real exams",
    text: "Question banks and mock tests mirror the actual paper pattern and marking scheme, so your practice transfers directly to the exam hall.",
  },
  {
    icon: Heart,
    title: "Made by students, for students",
    text: "Notes are written by toppers and reviewed by teachers. We keep what works and fix what doesn't — because we use PrashnaHub ourselves.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "A shared Google Drive",
    text: "Started as a folder of scanned notes and old questions passed between classmates in Kathmandu.",
  },
  {
    year: "2021",
    title: "PrashnaHub goes online",
    text: "The first version of the platform launched with notes and past papers for SEE and NEB Class 12.",
  },
  {
    year: "2023",
    title: "Community Q&A opens",
    text: "Students across Nepal started answering each other's questions — answers now number in the tens of thousands.",
  },
  {
    year: "2025",
    title: "Mock tests and AI study tools",
    text: "Full-syllabus mock tests, question banks and a self-learning center with AI-powered Q&A joined the platform.",
  },
  {
    year: "2026",
    title: "Your reference for every exam",
    text: "Serving hundreds of thousands of students across Nepal, with TU, KU, PU, Purbanchal, CTEVT and NEB covered.",
  },
];



export function AboutSections() {
  return (
    <>
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <Badge variant="gradient">Why PrashnaHub</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Four promises we keep</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <Badge variant="gradient">Our journey</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">From a shared folder to a movement</h2>
          </div>
          <div className="mx-auto max-w-3xl">
            {timeline.map((t, i) => (
              <div key={t.year} className="relative flex gap-6 pb-10 last:pb-0">
                {i < timeline.length - 1 && <span className="absolute left-[15px] top-9 h-full w-px bg-border" />}
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-primary">{t.year}</p>
                  <h3 className="mt-1 font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <Card className="relative overflow-hidden border-primary/20 bg-brand-gradient p-10 text-center text-white md:p-14">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium">
                <Award className="h-3.5 w-3.5" /> Join the movement
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-bold md:text-3xl">
                If you study in Nepal, PrashnaHub is your reference.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
                Create a free account, bookmark your syllabus, and study with the questions that actually appear in your exams.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/classes">Browse by class</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                  <Link href="/contact">Get in touch</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
