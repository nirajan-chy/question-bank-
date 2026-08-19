import type {
  RagDocument,
  RagSource,
  RagAnswer,
  RagMessage,
  McqGenerateRequest,
  McqQuiz,
  McqResult,
} from "@/types";

import { http, httpForm, getAuthToken, BASE_URL } from "../http";

export const learn = {
  documents: () => http<RagDocument[]>("/rag/documents"),
  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return httpForm<RagDocument>("/rag/documents", form);
  },
  deleteDocument: (id: string) => http<null>(`/rag/documents/${id}`, { method: "DELETE" }),

  chatHistory: (limit = 50) => http<RagMessage[]>(`/rag/chat/history?limit=${limit}`),
  ask: (question: string, documentIds?: string[] | null) =>
    http<RagAnswer>("/rag/chat", {
      method: "POST",
      body: JSON.stringify({ question, document_ids: documentIds ?? null, history: null }),
    }),

  mcqGenerate: (payload: McqGenerateRequest) =>
    http<McqQuiz>("/rag/mcq/generate", { method: "POST", body: JSON.stringify(payload) }),
  mcq: (id: string) => http<McqQuiz>(`/rag/mcq/${id}`),
  mcqSubmit: (id: string, answers: number[]) =>
    http<McqResult>(`/rag/mcq/${id}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
};

export type ChatStreamEvent =
  | { type: "meta"; data: { question: string } }
  | { type: "delta"; data: { text: string } }
  | { type: "sources"; data: { sources: RagSource[] } }
  | { type: "error"; data: { message: string } }
  | { type: "done"; data: Record<string, never> };

/** Stream a chat answer from the RAG service through the Express SSE proxy. */
export async function streamChat(
  question: string,
  documentIds: string[] | null,
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const headers = new Headers({ "Content-Type": "application/json" });
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}/rag/chat/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, document_ids: documentIds, history: null }),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parse = () => {
    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const lines = block.split("\n");
      const event = lines.find((l) => l.startsWith("event:"))?.slice(6).trim() ?? "message";
      const data = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!data) continue;
      try {
        onEvent({ type: event as ChatStreamEvent["type"], data: JSON.parse(data) } as ChatStreamEvent);
      } catch {
        // ignore malformed frames
      }
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    parse();
  }
  parse();
}
