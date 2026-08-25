"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Styled markdown renderer shared by the admin editor preview and the
 * public reader dialog. Includes a subtle PrashnaHub watermark overlay.
 */
export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("relative text-sm leading-7 text-foreground", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden gap-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/black and green.png"
          alt=""
          className="w-[70vw] max-w-[600px] select-none opacity-[0.10]"
          style={{ filter: "grayscale(1)" }}
        />
        <span           className="select-none text-3xl font-display font-bold tracking-wide opacity-[0.06] text-foreground">
          PrashnaHub
        </span>
      </div>
      <div className="relative z-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, className: cls }) => <h1 className={cn("mt-6 mb-3 font-display text-2xl font-bold first:mt-0", cls)}>{children}</h1>,
            h2: ({ children, className: cls }) => <h2 className={cn("mt-6 mb-2 border-b pb-1 font-display text-xl font-bold first:mt-0", cls)}>{children}</h2>,
            h3: ({ children, className: cls }) => <h3 className={cn("mt-5 mb-2 font-display text-lg font-semibold first:mt-0", cls)}>{children}</h3>,
            h4: ({ children, className: cls }) => <h4 className={cn("mt-4 mb-1.5 font-semibold first:mt-0", cls)}>{children}</h4>,
            p: ({ children, className: cls }) => <p className={cn("my-3 leading-7", cls)}>{children}</p>,
            ul: ({ children, className: cls }) => <ul className={cn("my-3 list-disc space-y-1 pl-6", cls)}>{children}</ul>,
            ol: ({ children, className: cls }) => <ol className={cn("my-3 list-decimal space-y-1 pl-6", cls)}>{children}</ol>,
            li: ({ children, className: cls }) => <li className={cn("leading-7", cls)}>{children}</li>,
            a: ({ children, className: cls, ...rest }) => (
              <a className={cn("font-medium text-primary underline underline-offset-4", cls)} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
            ),
            blockquote: ({ children, className: cls }) => (
              <blockquote className={cn("my-3 rounded-r-lg border-l-4 border-primary/50 bg-muted/50 px-4 py-2 italic text-muted-foreground", cls)}>{children}</blockquote>
            ),
            hr: () => <hr className="my-6 border-dashed" />,
            table: ({ children, className: cls }) => (
              <div className="my-4 overflow-x-auto rounded-lg border">
                <table className={cn("w-full text-left text-xs [&_td]:border-b [&_td]:px-3 [&_td]:py-2 [&_th]:bg-muted/60 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold", cls)}>{children}</table>
              </div>
            ),
            code: ({ children, className: cls, ...rest }) =>
              String(cls ?? "").includes("language-") ? (
                <code className={cn("block overflow-x-auto rounded-lg bg-muted/70 p-4 font-mono text-xs", cls)} {...rest}>
                  {children}
                </code>
              ) : (
                <code className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-primary", cls)} {...rest}>
                  {children}
                </code>
              ),
            pre: ({ children, className: cls }) => <pre className={cn("my-4", cls)}>{children}</pre>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
