import { useState } from "react";
import TextField from "./TextField";
import { passwordStrength } from "../../utils/validators";

/**
 * Kolom password dengan tombol tampilkan/sembunyikan.
 * Kalau showStrength = true, batang kekuatan password ikut ditampilkan.
 */
export default function PasswordField({ showStrength = false, ...props }) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(props.value);

  return (
    <div>
      <TextField
        {...props}
        type={visible ? "text" : "password"}
        rightSlot={
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="rounded text-xs font-semibold text-kobalt hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-kobalt dark:text-[#7C93FF]"
          >
            {visible ? "Sembunyikan" : "Tampilkan"}
          </button>
        }
      />

      {showStrength && props.value && (
        <div className="mt-2" aria-live="polite">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full ${
                  step <= strength.score
                    ? strength.color
                    : "bg-slate-200 dark:bg-[#25324F]"
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Kekuatan password: {strength.label}
          </p>
        </div>
      )}
    </div>
  );
}
