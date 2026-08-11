"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  FileText,
  Loader2,
  Send,
  Square,
  Sparkles,
  User,
  BookOpen,
} from "lucide-react";
import { streamChat, type ChatStreamEvent } from "@/services/api";
import { useRagChatHistory, useRagDocuments } from "@/services/queries";
import type { RagMessage, RagSource } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ChatEntry = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  streaming?: boolean;
};

const SUGGESTIONS = [
  {
    icon: BookOpen,
    text: "Summarize the key topics in my documents",
  },
  {
    icon: Sparkles,
    text: "What are the most important definitions?",
  },
  {
    icon: Bot,
    text: "Explain the main concepts step by step",
  },
  {
    icon: FileText,
    text: "Create a quick revision summary",
  },
];

export function ChatPanel() {
  const { data: history } = useRagChatHistory();
  const { data: documents } = useRagDocuments();
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [scope, setScope] = useState<string>("all");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!history) return;
    setMessages(
      history.map((m: RagMessage) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        sources: m.sources ?? undefined,
      }))
    );
  }, [history]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (question: string) => {
    const text = question.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `q-${Date.now()}`, role: "user", content: text },
    ]);
    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, role: "assistant", content: "", streaming: true },
    ]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(
        text,
        scope === "all" ? null : [scope],
        (event: ChatStreamEvent) => {
          if (event.type === "delta") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.streaming) {
                last.content += event.data.text;
              }
              return next;
            });
          } else if (event.type === "sources") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.streaming) last.sources = event.data.sources;
              return next;
            });
          } else if (event.type === "error") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.streaming) last.content = `\u26a0\ufe0f ${event.data.message}`;
              return next;
            });
          }
        },
        controller.signal
      );
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.streaming) last.content = `\u26a0\ufe0f ${(err as Error).message}`;
          return next;
        });
      }
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.streaming ? { ...m, streaming: false } : m))
      );
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">AI Study Assistant</p>
              <p className="text-[11px] text-muted-foreground">
                Answers grounded in your documents
              </p>
            </div>
          </div>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="h-8 w-52 text-xs">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {(documents ?? [])
                .filter((d) => d.status === "ready")
                .map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.filename}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[520px]">
          <div className="space-y-5 p-5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center pt-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
                  <Bot className="h-8 w-8" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  Ask anything about your documents
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
                  The AI reads your uploaded material and gives you grounded answers with
                  numbered citations you can verify.
                </p>
                <div className="mx-auto mt-6 grid max-w-md gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.text}
                      type="button"
                      className="group flex items-start gap-2.5 rounded-xl border bg-background/60 px-3.5 py-3 text-left text-xs transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                      onClick={() => send(s.text)}
                      disabled={streaming}
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <s.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className="flex gap-3">
                {/* Avatar */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    m.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-brand-gradient text-white shadow-sm"
                  )}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </span>

                {/* Bubble */}
                <div className="min-w-0 max-w-[85%]">
                  <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">
                    {m.role === "user" ? "You" : "AI Assistant"}
                  </p>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tl-md"
                        : "border bg-card rounded-tl-md"
                    )}
                  >
                    {m.content ||
                      (m.streaming && (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading your
                          documents\u2026
                        </span>
                      ))}
                    {m.streaming && m.content && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
                    )}
                  </div>

                  {/* Sources */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/40 px-2.5 py-1.5 text-xs"
                          >
                            <span className="font-medium text-foreground">
                              {s.document_name}
                            </span>
                            {s.page && (
                              <span className="text-muted-foreground">
                                p.{s.page}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                      {m.sources[0]?.snippet && (
                        <div className="mt-1 rounded-lg bg-muted/30 px-3 py-2 text-xs italic text-muted-foreground leading-relaxed">
                          &ldquo;{m.sources[0].snippet}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t bg-muted/20 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a question about your documents\u2026"
              className="max-h-32 min-h-[48px] flex-1 resize-none rounded-xl border bg-background/80"
              disabled={streaming}
            />
            {streaming ? (
              <Button
                size="icon"
                variant="destructive"
                onClick={stop}
                aria-label="Stop generating"
                className="rounded-xl"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => send(input)}
                disabled={!input.trim()}
                aria-label="Send question"
                className="rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Answers are grounded strictly in your uploaded documents
          </p>
        </div>
      </Card>

      {/* Tips sidebar */}
      <div className="space-y-4">
        <Card className="p-5">
          <h4 className="text-sm font-semibold">How it works</h4>
          <ul className="mt-3 space-y-3">
            {[
              {
                step: "1",
                text: "Your documents are split into small searchable chunks",
              },
              {
                step: "2",
                text: "When you ask a question, the AI finds the most relevant chunks",
              },
              {
                step: "3",
                text: "It generates an answer using only those chunks, with citations",
              },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                  {item.step}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-semibold">Tips</h4>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground leading-relaxed">
            <li>Ask follow-up: &ldquo;compare&rdquo;, &ldquo;define&rdquo;, &ldquo;give examples&rdquo;</li>
            <li>Restrict to one document with the dropdown above</li>
            <li>Every answer cites the exact document and page</li>
            <li>If the answer isn&apos;t in your material, the AI will say so</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
