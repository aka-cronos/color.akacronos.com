"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import type { PaletteStep } from "@/lib/color";
import { exportCss, exportTailwind, exportJson } from "@/lib/color";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as Tab)}
        className="flex flex-col gap-3"
      >
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-200 dark:bg-zinc-900">
              <code>
                {tab.id === "css"
                  ? exportCss(paletteName, steps, darkSteps)
                  : tab.id === "tailwind"
                    ? exportTailwind(paletteName, steps)
                    : exportJson(paletteName, steps)}
              </code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
