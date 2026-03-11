"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import type { PaletteStep } from "@/lib/color";
import { exportCss, exportTailwind, exportJson } from "@/lib/color";

type Tab = "css" | "tailwind" | "json";

interface ExportPanelProps {
  paletteName: string;
  steps: PaletteStep[];
  darkSteps: PaletteStep[];
}

export function ExportPanel({ paletteName, steps, darkSteps }: ExportPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("css");

  const content =
    activeTab === "css"
      ? exportCss(paletteName, steps, darkSteps)
      : activeTab === "tailwind"
      ? exportTailwind(paletteName, steps)
      : exportJson(paletteName, steps);

  const tabs: { id: Tab; label: string }[] = [
    { id: "css", label: "CSS" },
    { id: "tailwind", label: "Tailwind v4" },
    { id: "json", label: "JSON" },
  ];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Export
        </h2>
        <CopyButton text={content} />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-200 dark:bg-zinc-900">
        <code>{content}</code>
      </pre>
    </section>
  );
}
