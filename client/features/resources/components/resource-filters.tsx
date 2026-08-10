"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const levelOptions = [
  "All levels",
  "NEB · Class 12",
  "CTEVT",
  "Bachelor · TU",
  "Bachelor · PU",
  "Bachelor · KU",
  "Bachelor",
  "Master",
] as const;

export function ResourceFilters({
  query,
  onQuery,
  level,
  onLevel,
  sort,
  onSort,
  className,
}: {
  query: string;
  onQuery: (v: string) => void;
  level: string;
  onLevel: (v: string) => void;
  sort: string;
  onSort: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", className)}>
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        className="w-full lg:w-72"
      />
      <div className="flex flex-wrap gap-3">
        <Select value={level} onValueChange={onLevel}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={onSort}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="recent">Newest</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
