"use client";

import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { resolveContentAsset } from "@/lib/utils";
import { cn } from "@/lib/utils";

type MarkdownViewerProps = {
  content: string;
  /** Directory of the .md file under /content — relative images resolve against it. */
  basePath?: string;
  className?: string;
};

/**
 * Renders past-question Markdown (headings, lists, tables, code, math,
 * diagrams) with the same visual language as the rest of the site.
 */
export function MarkdownViewer({ content, basePath, className }: MarkdownViewerProps) {
  return (
    <div className={cn("max-w-none text-sm leading-relaxed sm:text-base", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        urlTransform={(url) => resolveContentAsset(basePath, url)}
        components={{
          h1: (p) => (
            <h1
              className="mt-8 border-b pb-2 font-display text-2xl font-bold first:mt-0"
              {...p}
            />
          ),
          h2: (p) => (
            <h2
              className="mt-8 border-b border-primary/20 pb-1.5 font-display text-xl font-bold text-primary first:mt-0"
              {...p}
            />
          ),
          h3: (p) => <h3 className="mt-6 font-display text-lg font-semibold" {...p} />,
          h4: (p) => <h4 className="mt-5 font-semibold" {...p} />,
          p: (p) => <p className="my-3" {...p} />,
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          em: (p) => <em {...p} />,
          ul: (p) => <ul className="my-3 list-disc space-y-1 pl-6" {...p} />,
          ol: (p) => <ol className="my-3 list-decimal space-y-1 pl-6" {...p} />,
          li: (p) => <li className="pl-1" {...p} />,
          blockquote: (p) => (
            <blockquote
              className="my-4 rounded-r-lg border-l-4 border-primary/40 bg-muted/40 px-4 py-2 italic text-muted-foreground"
              {...p}
            />
          ),
          a: (p) => <a className="font-medium text-primary underline underline-offset-2" {...p} />,
          hr: () => <hr className="my-6 border-border" />,
          table: (p) => (
            <div className="my-4 overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-sm" {...p} />
            </div>
          ),
          thead: (p) => <thead className="bg-muted/60" {...p} />,
          th: (p) => <th className="border-b px-3 py-2 font-semibold" {...p} />,
          td: (p) => <td className="border-b px-3 py-2 align-top" {...p} />,
          code: ({ className: cls, children, ...rest }) =>
            // Inline code vs fenced block (react-markdown adds language-* only for blocks)
            typeof cls === "string" && cls.includes("language-") ? (
              <code className={cn("block p-0 font-mono", cls)} {...rest}>
                {children}
              </code>
            ) : (
              <code
                className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
                {...rest}
              >
                {children}
              </code>
            ),
          pre: (p) => (
            <pre
              className="my-4 overflow-x-auto rounded-xl border bg-muted/50 p-4 text-[0.85em] leading-relaxed"
              {...p}
            />
          ),
          img: (p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={p.alt ?? ""}
              className="mx-auto my-4 max-w-full rounded-xl border shadow-sm"
              loading="lazy"
              {...p}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
