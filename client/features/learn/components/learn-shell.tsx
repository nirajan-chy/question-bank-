"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpenCheck, BrainCircuit, FileUp, GraduationCap, MessageSquareText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { DocumentsPanel } from "./documents-panel";
import { ChatPanel } from "./chat-panel";
import { McqPanel } from "./mcq-panel";

export function LearnShell() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("documents");

  if (!user) {
    return (
      <div className="container flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <GraduationCap className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">Your private AI study room</h1>
        <p className="mt-3 text-muted-foreground">
          Upload your own notes, books and past papers — then ask questions and take quizzes that
          are generated only from <strong>your</strong> material.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/login">Sign in to start</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Create an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <BrainCircuit className="h-6 w-6" />
            </span>
            Self Learning Center
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Your private AI study room. Upload documents, get grounded answers with citations, and
            generate practice quizzes — everything powered only by your own material.
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="documents" className="gap-2">
            <FileUp className="h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquareText className="h-4 w-4" /> Ask AI
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-2">
            <BookOpenCheck className="h-4 w-4" /> Quiz Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <DocumentsPanel />
        </TabsContent>
        <TabsContent value="chat" className="mt-6">
          <ChatPanel />
        </TabsContent>
        <TabsContent value="quiz" className="mt-6">
          <McqPanel />
        </TabsContent>
      </Tabs>

      <Card className="mt-10 border-dashed p-6 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">How it works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            <strong>Upload</strong> your study material (PDF, DOCX or TXT) in the Documents tab.
          </li>
          <li>
            <strong>Ask AI</strong> questions about it — answers are generated strictly from your
            files, with numbered citations you can verify.
          </li>
          <li>
            <strong>Quiz Builder</strong> creates multiple-choice questions from your material at
            any difficulty, with instant scoring and explanations.
          </li>
        </ol>
      </Card>
    </div>
  );
}
