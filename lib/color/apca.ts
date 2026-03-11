import { APCAcontrast } from "apca-w3";
import { oklchToY } from "./gamut";
import type { OklchColor, ApcaResult } from "./types";

/**
 * Compute APCA contrast score for a swatch background color.
 * Tests both white text (Y=1) and black text (Y=0) and reports the winner.
 */
export function computeApca(bgOklch: OklchColor): ApcaResult {
  const bgY = oklchToY(bgOklch);

  // APCAcontrast(txtY, bgY) → Lc value (signed), takes pre-computed linear Y
  const lcWhite = APCAcontrast(1.0, bgY);
  const lcBlack = APCAcontrast(0.0, bgY);

  const absWhite = Math.abs(lcWhite);
  const absBlack = Math.abs(lcBlack);

  const lc = absWhite >= absBlack ? absWhite : absBlack;
  const textColor: "white" | "black" = absWhite >= absBlack ? "white" : "black";

  return {
    lc,
    textColor,
    passes75: lc >= 75,
    passes60: lc >= 60,
    passes45: lc >= 45,
  };
}
