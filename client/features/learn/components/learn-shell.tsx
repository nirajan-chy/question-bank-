"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpenCheck,
  BrainCircuit,
  FileUp,
  GraduationCap,
  MessageSquareText,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { DocumentsPanel } from "./documents-panel";
import { ChatPanel } from "./chat-panel";
import { McqPanel } from "./mcq-panel";

const FEATURES = [
  {
    icon: FileUp,
    title: "Upload",
    desc: "PDF, DOCX or TXT — up to 100 MB each",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Sparkles,
    title: "Ask AI",
    desc: "Grounded answers with exact citations",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: BookOpenCheck,
    title: "Quiz",
    desc: "Auto-generated MCQs from your material",
    gradient: "from-fuchsia-500 to-pink-600",
  },
];

export function LearnShell() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [tab, setTab] = useState("documents");

  if (!hasHydrated) {
    return (
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-mesh-light opacity-40" />
        <div className="container flex min-h-[70vh] items-center justify-center py-20 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-mesh-light opacity-60" />
        <div className="container flex min-h-[70vh] max-w-2xl flex-col items-center justify-center py-20 text-center">
          <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <GraduationCap className="h-10 w-10" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
              AI
            </span>
          </span>
          <h1 className="mt-8 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your private{" "}
            <span className="text-gradient">AI study room</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            Upload your own notes, books and past papers — then ask questions and take quizzes
            generated <strong className="text-foreground">only from your material</strong>.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="gradient shadow-glow-sm" asChild>
              <Link href="/login">
                <Zap className="h-4 w-4" /> Sign in to start
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Create an account</Link>
            </Button>
          </div>
          <div className="mt-14 grid max-w-md grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <span
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-sm`}
                >
                  <f.icon className="h-5 w-5" />
                </span>
                <p className="mt-2 text-sm font-semibold">{f.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-mesh-light opacity-40" />

      <div className="container py-8 md:py-12">
        {/* Hero header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border bg-card/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient opacity-10 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow-sm">
                <BrainCircuit className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Self Learning Center
                </h1>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground leading-relaxed">
                  Upload documents, get grounded answers with citations, and generate practice
                  quizzes — everything powered only by your own material.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-success" />
              <span>Private to you</span>
            </div>
          </div>

          {/* Feature pills */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <span
                key={f.title}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-sm"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br ${f.gradient} text-white`}
                >
                  <f.icon className="h-3 w-3" />
                </span>
                {f.title}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-3 rounded-xl p-1">
            <TabsTrigger
              value="documents"
              className="gap-2 rounded-lg py-2.5 data-[state=active]:shadow-sm"
            >
              <FileUp className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="gap-2 rounded-lg py-2.5 data-[state=active]:shadow-sm"
            >
              <MessageSquareText className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="gap-2 rounded-lg py-2.5 data-[state=active]:shadow-sm"
            >
              <BookOpenCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz Builder</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-0">
            <DocumentsPanel />
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="quiz" className="mt-0">
            <McqPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
