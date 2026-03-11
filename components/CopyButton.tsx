"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      } ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
