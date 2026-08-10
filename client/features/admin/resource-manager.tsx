"use client";

import { useMemo, useRef, useState } from "react";
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
import { useAdminResource, useAdminResourceMeta } from "@/services/queries";
import type { ResourceField } from "@/types";
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

const SKIP_FIELDS = new Set(["createdAt", "updatedAt"]);
const NONE_VALUE = "__none__";
const UPLOAD_FIELD_KEYS = new Set(["pdfUrl"]);

const humanize = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

const isNumberType = (t: string) => t === "INTEGER" || t === "FLOAT";
const isDateType = (t: string) => t === "DATE" || t === "DATEONLY";

function jsonbIsLines(value: unknown): boolean {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function fieldToInputValue(field: ResourceField, current: unknown, isEdit: boolean): string {
  const value = current ?? field.defaultValue;
  if (field.type === "BOOLEAN") return value === true ? "true" : "false";
  if (field.type === "JSONB") {
    if (jsonbIsLines(value)) return (value as string[]).join("\n");
    if (jsonbIsLines(field.defaultValue) && !isEdit) return (field.defaultValue as string[]).join("\n");
    return value == null ? "" : JSON.stringify(value, null, 2);
  }
  return value == null ? "" : String(value);
}

function parseFieldValue(raw: string, field: ResourceField): { value: unknown; error?: string } {
  if (field.type === "JSONB") {
    if (jsonbIsLines(field.defaultValue)) {
      return { value: raw.split("\n").map((s) => s.trim()).filter(Boolean) };
    }
    const trimmed = raw.trim();
    if (!trimmed) return { value: field.defaultValue ?? null };
    try {
      return { value: JSON.parse(trimmed) };
    } catch {
      return { value: null, error: "Invalid JSON" };
    }
  }
  if (field.type === "BOOLEAN") return { value: raw === "true" };
  if (isNumberType(field.type)) {
    if (raw.trim() === "") return { value: undefined };
    const n = Number(raw);
    return Number.isFinite(n) ? { value: n } : { value: undefined, error: "Must be a number" };
  }
  if (field.type === "ENUM" && raw === NONE_VALUE) return { value: undefined };
  return { value: raw };
}

export function ResourceManager({ resource, label }: { resource: string; label: string }) {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useAdminResource(resource);
  const { data: meta, isLoading: metaLoading } = useAdminResourceMeta(resource);

  const [mode, setMode] = useState<{ type: "edit"; record: Record<string, unknown> } | { type: "create" } | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fields = useMemo(
    () => (meta?.attributes ?? []).filter((f) => !SKIP_FIELDS.has(f.key)),
    [meta]
  );

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
          disabled={metaLoading || fields.length === 0}
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
  fields: ResourceField[];
  initial?: Record<string, unknown>;
  sampleId?: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.key] = fieldToInputValue(f, initial?.[f.key], isEdit);
    }
    return init;
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const buildPayload = (): { payload: Record<string, unknown>; error?: string } => {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (isEdit && f.primaryKey) continue;
      const { value, error } = parseFieldValue(values[f.key], f);
      if (error) return { payload, error };
      if (value === undefined) continue;
      payload[f.key] = value;
    }
    return { payload };
  };

  const validateCreate = () => {
    for (const f of fields) {
      if (f.type === "BOOLEAN" || f.type === "JSONB") continue;
      if (f.primaryKey && f.type === "UUID") continue;
      if (f.allowNull || f.defaultValue != null) continue;
      const raw = values[f.key];
      if (isNumberType(f.type)) {
        if (!raw?.trim()) return `${humanize(f.key)} is required`;
        continue;
      }
      if (!raw?.trim()) return `${humanize(f.key)} is required`;
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
            const isPk = f.primaryKey;
            if (UPLOAD_FIELD_KEYS.has(f.key)) {
              return (
                <FieldUpload
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  onChange={(v) => set(f.key, v)}
                  className="sm:col-span-2"
                />
              );
            }
            if (f.type === "BOOLEAN") {
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
            if (f.type === "ENUM") {
              return (
                <FieldSelect
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  required={!isEdit && !f.allowNull && f.defaultValue == null}
                  disabled={isEdit && isPk}
                  onChange={(v) => set(f.key, v)}
                />
              );
            }
            const fullWidth =
              f.type === "JSONB" || f.type === "TEXT" || f.type === "DATEONLY" || f.type === "DATE";
            return (
              <Field
                key={f.key}
                field={f}
                required={!isEdit && !f.allowNull && f.defaultValue == null}
                disabled={isEdit && isPk}
                value={values[f.key]}
                onChange={(v) => set(f.key, v)}
                placeholder={isPk && !isEdit ? (sampleId ? `e.g. ${sampleId}` : "unique id (slug-like)") : undefined}
                className={fullWidth ? "sm:col-span-2" : ""}
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
  field,
  required,
  disabled,
  value,
  onChange,
  placeholder,
  className,
}: {
  field: ResourceField;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const isTextarea = field.type === "TEXT" || field.type === "JSONB";
  const badge = field.type === "JSONB"
    ? jsonbIsLines(field.defaultValue)
      ? "one per line"
      : "JSON"
    : undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={`f-${field.key}`}>
        {humanize(field.key)}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {badge && <Badge variant="outline" className="ml-2 text-[9px]">{badge}</Badge>}
      </Label>
      {isTextarea ? (
        <Textarea
          id={`f-${field.key}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === "TEXT" ? 3 : 5}
          placeholder={field.type === "JSONB" ? 'e.g. [{"key": "value"}]' : placeholder}
          className={cn(field.type === "JSONB" && "font-mono text-xs")}
          disabled={disabled}
        />
      ) : (
        <Input
          id={`f-${field.key}`}
          type={isDateType(field.type) ? "date" : isNumberType(field.type) ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}

function FieldSelect({
  field,
  value,
  required,
  disabled,
  onChange,
}: {
  field: ResourceField;
  value: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const options = field.values ?? [];
  const showNone = !required;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`f-${field.key}`}>
        {humanize(field.key)}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={`f-${field.key}`}>
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          {showNone && <SelectItem value={NONE_VALUE}>—</SelectItem>}
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FieldUpload({
  field,
  value,
  onChange,
  className,
}: {
  field: ResourceField;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await admin.upload(file);
      onChange(result.url);
      toast.success("File uploaded", { description: result.filename });
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={`f-${field.key}`}>
        {humanize(field.key)}
        <Badge variant="outline" className="ml-2 text-[9px]">PDF upload</Badge>
      </Label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={`f-${field.key}`}
          type="file"
          accept="application/pdf"
          className="block w-full min-w-0 flex-1 text-sm text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={uploading}
        />
        {value ? (
          <a
            href={value.startsWith("http") ? value : `http://localhost:5000${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10"
          >
            View file
          </a>
        ) : null}
        {value ? (
          <Button variant="ghost" size="sm" onClick={() => onChange("")} type="button">
            <X className="h-4 w-4" /> Clear
          </Button>
        ) : null}
      </div>
      {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
    </div>
  );
}
