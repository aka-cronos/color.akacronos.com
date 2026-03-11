import type { PaletteStep } from "./types";

/**
 * CSS custom properties with dark mode media query.
 */
export function exportCss(name: string, steps: PaletteStep[], darkSteps: PaletteStep[]): string {
  const lightVars = steps
    .map((s) => `  --color-${name}-${s.name}: ${s.cssOklch};`)
    .join("\n");
  const darkVars = darkSteps
    .map((s) => `    --color-${name}-${s.name}: ${s.cssOklch};`)
    .join("\n");

  return `:root {\n${lightVars}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkVars}\n  }\n}`;
}

/**
 * Tailwind v4 @theme block.
 */
export function exportTailwind(name: string, steps: PaletteStep[]): string {
  const vars = steps
    .map((s) => `  --color-${name}-${s.name}: ${s.cssOklch};`)
    .join("\n");
  return `@theme {\n${vars}\n}`;
}

/**
 * Style Dictionary–compatible JSON tokens.
 */
export function exportJson(name: string, steps: PaletteStep[]): string {
  const tokens: Record<string, { value: string; $type: string }> = {};
  for (const s of steps) {
    tokens[s.name] = { value: s.cssOklch, $type: "color" };
  }
  return JSON.stringify({ color: { [name]: tokens } }, null, 2);
}
