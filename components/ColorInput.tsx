"use client";

import { useState, useEffect, useRef } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="color-input">Base color</FieldLabel>
      <Input
        id="color-input"
        type="text"
        value={draft}
        onChange={handleChange}
        placeholder="#3b82f6 or oklch(0.6 0.22 250)"
        spellCheck={false}
        aria-invalid={!!error}
        className="font-mono"
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
