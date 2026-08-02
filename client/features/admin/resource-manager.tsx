"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type FieldType = "string" | "number" | "boolean" | "date" | "string-array" | "json";

type FieldDef = { key: string; type: FieldType };

const humanize = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

const DATE_RE = /^\d{4}-\d{2}-\d{2}/;
const isDateString = (v: unknown) => typeof v === "string" && DATE_RE.test(v);

function inferType(value: unknown): FieldType {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return "string-array";
    return "json";
  }
  if (value && typeof value === "object") return "json";
  if (isDateString(value)) return "date";
  return "string";
}

function inferFields(sample: Record<string, unknown>): FieldDef[] {
  return Object.entries(sample)
    .filter(([k]) => k !== "createdAt" && k !== "updatedAt" && k !== "id")
    .map(([key, value]) => ({ key, type: inferType(value) }));
}

function parseFieldValue(raw: string, type: FieldType): { value: unknown; error?: string } {
  if (type === "string-array") {
    return { value: raw.split("\n").map((s) => s.trim()).filter(Boolean) };
  }
  if (type === "json") {
    const trimmed = raw.trim();
    if (!trimmed) return { value: null };
    try {
      return { value: JSON.parse(trimmed) };
    } catch {
      return { value: null, error: "Invalid JSON" };
    }
  }
  if (type === "number") {
    if (raw.trim() === "") return { value: undefined };
    const n = Number(raw);
    return Number.isFinite(n) ? { value: n } : { value: undefined, error: "Must be a number" };
  }
  if (type === "boolean") return { value: raw === "true" };
  return { value: raw };
}

function fieldToInputValue(value: unknown, type: FieldType): string {
  if (type === "string-array") return (value as string[]).join("\n");
  if (type === "json") return value == null ? "" : JSON.stringify(value, null, 2);
  if (type === "boolean") return value === true ? "true" : "false";
  return value == null ? "" : String(value);
}

export function ResourceManager({ resource, label }: { resource: string; label: string }) {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useAdminResource(resource);

  const [mode, setMode] = useState<{ type: "edit"; record: Record<string, unknown> } | { type: "create" } | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fields = useMemo(() => (data.length > 0 ? inferFields(data[0]) : []), [data]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", resource] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [data, query]);

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

  const primary = (row: Record<string, unknown>) =>
    String(row.name ?? row.title ?? row.question ?? row.exam ?? row.id ?? "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${data.length} records`}
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => setMode({ type: "create" })}
          disabled={fields.length === 0}
        >
          <Plus className="h-4 w-4" /> Add {label.replace(/s$/, "")}
        </Button>
      </div>

      {mode && fields.length > 0 && (
        <ResourceForm
          resource={resource}
          label={label}
          fields={fields}
          initial={mode.type === "edit" ? mode.record : undefined}
          sampleId={mode.type === "create" ? (data[0]?.id as string) : undefined}
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
          </div>

          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <XCircle className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No records found.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((row) => (
                <li key={row.id as string} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{primary(row)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <code className="text-[10px]">id:</code> {String(row.id)}
                      {row.slug ? (
                        <>
                          {" "}· <code className="text-[10px]">slug:</code> {String(row.slug)}
                        </>
                      ) : null}
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
  sampleId,
  onDone,
  onCancel,
}: {
  resource: string;
  label: string;
  fields: FieldDef[];
  initial?: Record<string, unknown>;
  sampleId?: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.key] = fieldToInputValue(initial?.[f.key], f.type);
    }
    return init;
  });
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setJsonErrors((e) => ({ ...e, [key]: "" }));
  };

  const buildPayload = (): { payload: Record<string, unknown>; error?: string } => {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (isEdit && f.key === "id") continue;
      const { value, error } = parseFieldValue(values[f.key], f.type);
      if (error) return { payload, error };
      if (f.type === "number" && value === undefined) continue;
      payload[f.key] = value;
    }
    return { payload };
  };

  const validateCreate = () => {
    for (const f of fields) {
      if (f.type !== "string" && f.type !== "date") continue;
      if (f.key === "id") continue;
      if (!values[f.key]?.trim()) {
        return `${humanize(f.key)} is required`;
      }
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { payload, error } = buildPayload();
    if (error) {
      toast.error(error);
      return;
    }
    if (!isEdit) {
      const missing = validateCreate();
      if (missing) {
        toast.error(missing);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await admin.update(resource, initial!.id as string, payload);
        toast.success(`${label} item updated`);
      } else {
        await admin.create(resource, { id: values.id?.trim(), ...payload });
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
          {!isEdit && (
            <Field
              label="ID"
              required
              value={values.id ?? ""}
              onChange={(v) => set("id", v)}
              placeholder={sampleId ? `e.g. ${sampleId}` : "unique id (slug-like)"}
            />
          )}

          {fields.map((f) => {
            if (f.type === "boolean") {
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
              <Field
                key={f.key}
                label={humanize(f.key)}
                type={f.type}
                required={!isEdit && (f.type === "string" || f.type === "date")}
                value={values[f.key]}
                error={jsonErrors[f.key]}
                onChange={(v) => set(f.key, v)}
                className={f.type === "json" || f.type === "string-array" ? "sm:col-span-2" : ""}
              />
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

function Field({
  label: labelText,
  type = "string",
  required,
  value,
  onChange,
  placeholder,
  error,
  className,
}: {
  label: string;
  type?: FieldType;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}) {
  const isTextarea = type === "string-array" || type === "json";
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>
        {labelText}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {type === "json" && <Badge variant="outline" className="ml-2 text-[9px]">JSON</Badge>}
        {type === "string-array" && <Badge variant="outline" className="ml-2 text-[9px]">one per line</Badge>}
      </Label>
      {isTextarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={type === "json" ? 5 : 3}
          placeholder={type === "json" ? 'e.g. [{"key": "value"}]' : "one item per line"}
          className="font-mono text-xs"
        />
      ) : (
        <Input
          type={type === "date" ? "date" : type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
