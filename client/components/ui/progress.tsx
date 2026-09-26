"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/**
 * `value` is clamped to 0–100 so an out-of-range figure can never push the
 * indicator outside the track, and it is forwarded to the Radix root so the
 * bar exposes a correct `aria-valuenow` / `value` range to assistive tech.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, "value"> & {
    value?: number;
    indicatorClassName?: string;
  }
>(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={clamped}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 bg-primary transition-transform duration-300", indicatorClassName)}
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
