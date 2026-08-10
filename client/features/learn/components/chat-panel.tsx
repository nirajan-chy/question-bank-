"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Send, Square, Sparkles } from "lucide-react";
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
  "Summarize the key topics in my documents",
  "What are the most important definitions?",
  "Explain the main concepts as if I'm new to this subject",
  "Create a quick revision summary of chapter one",
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
    setMessages((prev) => [...prev, { id: `q-${Date.now()}`, role: "user", content: text }]);
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
              if (last?.streaming) last.content = `⚠️ ${event.data.message}`;
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
          if (last?.streaming) last.content = `⚠️ ${(err as Error).message}`;
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
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Chat with your material
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

        <ScrollArea className="h-[520px]">
          <div className="space-y-4 p-4">
            {messages.length === 0 && (
              <div className="space-y-3 pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  Ask anything about your uploaded documents. Answers include numbered citations
                  into your own material.
                </p>
                <div className="mx-auto grid max-w-md gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      className="justify-start text-left text-xs"
                      onClick={() => send(s)}
                      disabled={streaming}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border bg-card"
                  )}
                >
                  {m.content || (m.streaming && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading your documents…
                    </span>
                  ))}
                  {m.streaming && m.content && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 border-t pt-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Sources
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {m.sources.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>
                              <span className="font-medium text-foreground">{s.document_name}</span>
                              {s.page ? ` · page ${s.page}` : ""}
                              <p className="mt-0.5 line-clamp-2 italic">{"\u201C"}{s.snippet}{"\u201D"}</p>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a question about your documents… (Enter to send)"
              className="max-h-32 min-h-[52px] flex-1 resize-none"
              disabled={streaming}
            />
            {streaming ? (
              <Button size="icon" variant="secondary" onClick={stop} aria-label="Stop generating">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="icon" onClick={() => send(input)} disabled={!input.trim()} aria-label="Send question">
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Answers are grounded strictly in your uploaded documents.
          </p>
        </div>
      </Card>

      <Card className="h-fit p-5">
        <p className="text-sm font-semibold">Tips</p>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed text-muted-foreground">
          <li>Ask follow-up details like {"\u201C"}compare{"\u201D"}, {"\u201C"}define{"\u201D"}, {"\u201C"}give examples{"\u201D"}.</li>
          <li>Restrict a question to one document with the dropdown above the chat.</li>
          <li>Every answer cites the exact document and page it came from.</li>
          <li>If the answer {"isn't"} in your material, the assistant will say so instead of guessing.</li>
        </ul>
      </Card>
    </div>
  );
}
