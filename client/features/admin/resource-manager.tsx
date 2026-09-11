"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { admin } from "@/services/api";
import { useAdminResource } from "@/services/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE_VALUE = "__none__";

const humanize = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

function inferType(value: unknown): string {
  if (value === null || value === undefined) return "text";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "json";
  return "text";
}

interface InferredField {
  key: string;
  type: string;
  required: boolean;
}

function inferFields(data: Record<string, unknown>[]): InferredField[] {
  if (data.length === 0) return [];
  const keys = new Set<string>();
  for (const row of data) {
    for (const key of Object.keys(row)) {
      keys.add(key);
    }
  }
  return Array.from(keys)
    .filter((k) => !["createdAt", "updatedAt", "id"].includes(k))
    .map((key) => {
      const sampleValues = data.slice(0, 10).map((r) => r[key]);
      const types = sampleValues.map(inferType);
      const dominant = types.reduce((a, b) => (a === b ? a : "text"), "text");
      const hasNonNull = sampleValues.some((v) => v != null && v !== "");
      return { key, type: dominant, required: false };
    });
}

function valueToString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return value.join("\n");
    return JSON.stringify(value, null, 2);
  }
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function parseValue(raw: string, originalType: string): unknown {
  if (raw.trim() === "") return null;
  if (originalType === "boolean") return raw === "true";
  if (originalType === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  }
  if (originalType === "array") {
    if (raw.startsWith("[")) {
      try { return JSON.parse(raw); } catch { return raw.split("\n").map(s => s.trim()).filter(Boolean); }
    }
    return raw.split("\n").map(s => s.trim()).filter(Boolean);
  }
  if (originalType === "json") {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

export function ResourceManager({ resource, label }: { resource: string; label: string }) {
  const [query, setQuery] = useState("");
  const debouncedSearch = useDebounce(query.trim(), 300);
  const { data = [], isLoading, isFetching } = useAdminResource(resource, debouncedSearch);

  const fields = useMemo(() => inferFields(data), [data]);

  const [mode, setMode] = useState<{ type: "edit"; record: Record<string, unknown> } | { type: "create" } | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const invalidate = () => {
    // Handled by React Query automatically
  };

  const primary = (row: Record<string, unknown>) =>
    String(row.name ?? row.title ?? row.question ?? row.exam ?? row.id ?? "");

  const remove = async (id: string) => {
    try {
      await admin.remove(resource, id);
      toast.success(`${label} item deleted`);
      invalidate();
    } catch (error) {
      toast.error("Delete failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${data.length} records`}
          </p>
        </div>
        <Button variant="gradient" onClick={() => setMode({ type: "create" })}>
          <Plus className="h-4 w-4" /> Add {label.replace(/s$/, "")}
        </Button>
      </div>

      {mode && (
        <ResourceForm
          resource={resource}
          label={label}
          fields={fields}
          initial={mode.type === "edit" ? mode.record : undefined}
          onDone={() => {
            setMode(null);
            invalidate();
          }}
          onCancel={() => setMode(null)}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b p-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="h-8 border-0 shadow-none focus-visible:ring-0"
            />
            {query && (
              <Button variant="ghost" size="icon-sm" onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-4 w-4" />
              </Button>
            )}
            {isFetching && <Skeleton className="h-4 w-16" />}
          </div>

          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <XCircle className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {query ? "No records match your search." : "No records found."}
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {data.map((row) => (
                <li key={row.id as string} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{primary(row)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <code className="text-[10px]">id:</code> {String(row.id)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setMode({ type: "edit", record: row as Record<string, unknown> })}
                    aria-label={`Edit ${primary(row)}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {confirmingId === row.id ? (
                    <div className="flex items-center gap-1">
                      <Button variant="destructive" size="sm" onClick={() => remove(row.id as string)}>
                        <CheckCircle2 className="h-4 w-4" /> Confirm
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setConfirmingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setConfirmingId(row.id as string)}
                      aria-label={`Delete ${primary(row)}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceForm({
  resource,
  label,
  fields,
  initial,
  onDone,
  onCancel,
}: {
  resource: string;
  label: string;
  fields: InferredField[];
  initial?: Record<string, unknown>;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.key] = valueToString(initial?.[f.key] ?? (f.key === "programs" || f.key === "tags" ? [] : null));
    }
    return init;
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const buildPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (isEdit && f.key === "id") continue;
      payload[f.key] = parseValue(values[f.key], f.type);
    }
    return payload;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await admin.update(resource, initial!.id as string, payload);
        toast.success(`${label} item updated`);
      } else {
        await admin.create(resource, payload);
        toast.success(`${label} item created`);
      }
      onDone();
    } catch (error) {
      toast.error("Save failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/[0.03]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {isEdit ? `Edit ${label.replace(/s$/, "")}` : `New ${label.replace(/s$/, "")}`}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="Close form">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const isNumber = f.type === "number";
            const isBoolean = f.type === "boolean";
            const isTextarea = f.type === "array" || f.type === "json" || f.key === "description";
            const fullWidth = isTextarea || f.key === "description";

            if (isBoolean) {
              return (
                <div key={f.key} className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
                  <Label htmlFor={`f-${f.key}`}>{humanize(f.key)}</Label>
                  <Switch
                    id={`f-${f.key}`}
                    checked={values[f.key] === "true"}
                    onCheckedChange={(c) => set(f.key, c ? "true" : "false")}
                  />
                </div>
              );
            }

            return (
              <div key={f.key} className={cn("space-y-1.5", fullWidth && "sm:col-span-2")}>
                <Label htmlFor={`f-${f.key}`}>
                  {humanize(f.key)}
                  {f.type === "array" && <Badge variant="outline" className="ml-2 text-[9px]">one per line</Badge>}
                  {f.type === "json" && <Badge variant="outline" className="ml-2 text-[9px]">JSON</Badge>}
                </Label>
                {isTextarea ? (
                  <Textarea
                    id={`f-${f.key}`}
                    value={values[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    rows={f.key === "description" ? 3 : 5}
                    className={cn(f.type === "json" && "font-mono text-xs")}
                  />
                ) : (
                  <Input
                    id={`f-${f.key}`}
                    type={isNumber ? "number" : "text"}
                    value={values[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-2 border-t pt-4 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={submitting}>
              <Save className="h-4 w-4" /> {submitting ? "Saving…" : isEdit ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
