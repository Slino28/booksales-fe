const baseInput =
  "block h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 dark:bg-[#121B33] dark:text-white dark:placeholder:text-slate-500";

const normalInput =
  "border-slate-300 focus:border-kobalt focus:ring-kobalt/20 dark:border-[#25324F]";

const errorInput =
  "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400";

/**
 * Satu kolom isian: label, input, dan pesan error.
 * - rightSlot: elemen di dalam sisi kanan input (misalnya tombol tampilkan password)
 * - valid: tampilkan tanda centang kalau isinya sudah benar
 */
export default function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  valid = false,
  placeholder,
  autoComplete,
  rightSlot,
}) {
  const errorId = `${name}-error`;
  const hasRight = Boolean(rightSlot) || valid;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-100"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={`${baseInput} ${error ? errorInput : normalInput} ${
            hasRight ? "pr-24" : ""
          }`}
        />

        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
            {rightSlot}
          </div>
        )}

        {valid && !rightSlot && (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600"
          >
            <path d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
