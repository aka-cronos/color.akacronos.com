"use client";

import { useState, useMemo } from "react";
import { parseColor, generatePalette, generateDarkPalette, generateNeutralPalette } from "@/lib/color";
import type { PaletteStep } from "@/lib/color";
import { ColorInput } from "@/components/ColorInput";
import { PaletteGrid } from "@/components/PaletteGrid";
import { ExportPanel } from "@/components/ExportPanel";

const DEFAULT_INPUT = "#3b82f6";
const PALETTE_NAME = "color";

interface PaletteResult {
  steps: PaletteStep[];
  darkSteps: PaletteStep[];
  neutralSteps: PaletteStep[];
  error: string | null;
}

export default function Home() {
  const [colorInput, setColorInput] = useState(DEFAULT_INPUT);

  const { steps, darkSteps, neutralSteps, error } = useMemo<PaletteResult>(() => {
    const baseColor = parseColor(colorInput);
    if (!baseColor) {
      return {
        steps: [],
        darkSteps: [],
        neutralSteps: [],
        error: colorInput.trim()
          ? "Invalid color. Use a hex code like #3b82f6 or oklch(0.6 0.22 250)."
          : null,
      };
    }
    try {
      return {
        steps: generatePalette(baseColor),
        darkSteps: generateDarkPalette(baseColor),
        neutralSteps: generateNeutralPalette(baseColor),
        error: null,
      };
    } catch {
      return { steps: [], darkSteps: [], neutralSteps: [], error: "Failed to generate palette." };
    }
  }, [colorInput]);

  const hasPalette = steps.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Color Palette Generator
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Generate an 11-step Tailwind-style palette in OKLCH with APCA contrast scores.
          </p>
        </header>

        {/* Input */}
        <div className="max-w-md">
          <ColorInput
            value={colorInput}
            onChange={setColorInput}
            error={error}
          />
        </div>

        {/* Palettes */}
        {hasPalette && (
          <>
            <PaletteGrid label="Light palette" steps={steps} />
            <PaletteGrid label="Dark palette" steps={darkSteps} />
            <PaletteGrid label="Neutral palette" steps={neutralSteps} />
            <ExportPanel
              paletteName={PALETTE_NAME}
              steps={steps}
              darkSteps={darkSteps}
              neutralSteps={neutralSteps}
            />
          </>
        )}

        {/* Empty state */}
        {!hasPalette && !error && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Enter a color above to generate a palette.
          </p>
        )}
      </div>
    </div>
  );
}
