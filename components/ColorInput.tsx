"use client";

import { useState, useEffect, useRef } from "react";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function ColorInput({ value, onChange, error }: ColorInputProps) {
  const [draft, setDraft] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync draft when external value changes (e.g. initial)
  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setDraft(raw);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(raw), 300);
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="color-input"
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Base color
      </label>
      <input
        id="color-input"
        type="text"
        value={draft}
        onChange={handleChange}
        placeholder="#3b82f6 or oklch(0.6 0.22 250)"
        spellCheck={false}
        className={`w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none transition-colors focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-300 dark:border-red-600"
            : "border-zinc-300 focus:border-indigo-400 focus:ring-indigo-200 dark:border-zinc-600 dark:focus:border-indigo-500"
        } bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100`}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
