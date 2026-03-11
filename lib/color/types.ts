export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export interface ApcaResult {
  lc: number;
  textColor: "white" | "black";
  passes75: boolean;
  passes60: boolean;
  passes45: boolean;
}

export interface PaletteStep {
  name: string;
  oklch: OklchColor;
  hex: string;
  cssOklch: string;
  apca: ApcaResult;
  isBase: boolean;
}

export interface Palette {
  name: string;
  steps: PaletteStep[];
  darkSteps: PaletteStep[];
  baseColor: OklchColor;
}
