"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, ReactNode } from "react";
import { AlertCircle, ArrowLeft, ImageIcon, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#22D3EE]/60 disabled:cursor-not-allowed disabled:opacity-60";

export function AdminPageHeader({
  title,
  description,
  backHref,
  actionHref,
  actionLabel,
  actionIcon,
  children,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        {backHref ? (
          <Link href={backHref} className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : null}
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
        </div>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#22D3EE] px-4 py-2.5 text-sm font-semibold text-[#000918] transition-colors hover:bg-[#1bb8d1]">
          {actionIcon ?? <Plus className="h-4 w-4" />}
          {actionLabel}
        </Link>
      ) : children}
    </div>
  );
}

export function AdminPanel({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#000c24] p-6">
      {title || description ? (
        <div className="mb-5">
          {title ? <h3 className="text-base font-bold text-white">{title}</h3> : null}
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function AdminError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function AdminEmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-slate-400">
      <div className="mb-3 text-white/20">{icon ?? <ImageIcon className="h-12 w-12" />}</div>
      <p className="font-medium text-slate-300">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#000c24]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">{children}</table>
      </div>
    </div>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  dir,
  placeholder,
  min,
  max,
  disabled,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  dir?: "rtl" | "ltr";
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label} {required ? <span className="text-red-400">*</span> : null}
      </span>
      <input
        className={inputClass}
        dir={dir}
        disabled={disabled}
        max={max}
        min={min}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  required,
  dir,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  dir?: "rtl" | "ltr";
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label} {required ? <span className="text-red-400">*</span> : null}
      </span>
      <textarea className={inputClass} dir={dir} required={required} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function AdminSelect({
  label,
  value,
  onChange,
  required,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label} {required ? <span className="text-red-400">*</span> : null}
      </span>
      <select className={inputClass} required={required} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

export function AdminToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input className="h-5 w-5 accent-[#22D3EE]" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

export function LanguageTabs({
  en,
  ar,
}: {
  en: ReactNode;
  ar: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs">EN</span>
          English
        </h4>
        {en}
      </div>
      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs">AR</span>
          Arabic
        </h4>
        {ar}
      </div>
    </div>
  );
}

export function SubmitButton({ loading, saved, label = "Save Changes" }: { loading?: boolean; saved?: boolean; label?: string }) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-6 py-3 text-sm font-bold text-[#000918] transition-colors hover:bg-[#1bb8d1] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={loading}
      type="submit"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
      {loading ? "Saving..." : saved ? "Saved" : label}
    </button>
  );
}

export function DeleteButton({ loading, label = "Delete", onClick }: { loading?: boolean; label?: string; onClick: () => void }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:opacity-60"
      disabled={loading}
      onClick={onClick}
      type="button"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {label}
    </button>
  );
}

export function ImagePicker({
  label,
  currentUrl,
  file,
  onChange,
  compact,
}: {
  label: string;
  currentUrl?: string | null;
  file?: File | null;
  onChange: (file: File | null) => void;
  compact?: boolean;
}) {
  const preview = file ? URL.createObjectURL(file) : currentUrl || "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-300">{label}</span>
      <label className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/10 bg-white/[0.03] transition-colors hover:border-[#22D3EE]/40 ${compact ? "h-28" : "h-40"}`}>
        {preview ? (
          <Image src={preview} alt={label} width={420} height={220} className="h-full w-full object-contain" unoptimized />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm text-slate-500">
            <Upload className="h-5 w-5" />
            Upload image
          </span>
        )}
        <input accept="image/*" className="hidden" type="file" onChange={handleChange} />
      </label>
      {file || currentUrl ? (
        <button className="text-xs text-red-400 transition-colors hover:text-red-300" type="button" onClick={() => onChange(null)}>
          Clear selected image
        </button>
      ) : null}
    </div>
  );
}

