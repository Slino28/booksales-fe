import Icon from "./Icon";
import { STATUS_PESANAN } from "../../utils/format";

export function Spinner({ label = "Memuat..." }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {label}
    </div>
  );
}

export function ErrorNote({ children, onRetry }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <span>{children}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold underline">
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function SuccessNote({ children }) {
  if (!children) return null;
  return (
    <div
      role="status"
      className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon = "book", title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h2 className="mt-4 font-judul text-xl font-bold text-slate-900">{title}</h2>
      {children && <p className="mt-1 max-w-sm text-sm text-slate-500">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_PESANAN[status] ?? { label: status, style: "bg-slate-100 text-slate-700" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.style}`}>
      {meta.label}
    </span>
  );
}

/** Tombol - [angka] + untuk mengubah jumlah. */
export function QuantityStepper({ value, max, onChange, size = "md" }) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
      <button
        type="button"
        aria-label="Kurangi jumlah"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className={`${box} flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40`}
      >
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={`${box} flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40`}
      >
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}
