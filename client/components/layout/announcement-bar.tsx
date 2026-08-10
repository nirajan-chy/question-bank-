"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-50 border-b bg-brand-gradient text-white">
      <div className="container flex items-center justify-center gap-2 py-2 text-center text-xs font-medium md:text-sm">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        <p className="truncate">
          NEB Class 12 mock tests are live —{" "}
          <Link href="/mock-tests" className="underline underline-offset-2 hover:opacity-90">
            start practicing free →
          </Link>
        </p>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss announcement"
          className="ml-2 shrink-0 rounded-full p-0.5 opacity-80 transition-opacity hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
