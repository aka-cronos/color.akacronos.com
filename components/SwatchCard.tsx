import type { PaletteStep } from "@/lib/color";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SwatchCardProps {
  step: PaletteStep;
}

function ApcaBadge({
  lc,
  passes75,
  passes60,
  passes45,
}: {
  lc: number;
  passes75: boolean;
  passes60: boolean;
  passes45: boolean;
}) {
  const colorClass = passes75
    ? "bg-green-500"
    : passes60
      ? "bg-yellow-500"
      : passes45
        ? "bg-orange-500"
        : "bg-red-500";

  return (
    <Badge className={`${colorClass} border-0 text-[10px] font-bold text-white`}>
      Lc {Math.round(lc)}
    </Badge>
  );
}

export function SwatchCard({ step }: SwatchCardProps) {
  const textStyle = {
    color: step.apca.textColor === "white" ? "#ffffff" : "#000000",
  };

  return (
    <Card className="overflow-hidden rounded-lg p-0 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      {/* Color block */}
      <div
        className="flex h-20 items-end justify-between p-2"
        style={{ background: step.cssOklch }}
      >
        <span className="text-xl font-bold leading-none" style={textStyle}>
          Aa
        </span>
        <ApcaBadge
          lc={step.apca.lc}
          passes75={step.apca.passes75}
          passes60={step.apca.passes60}
          passes45={step.apca.passes45}
        />
      </div>

      {/* Info */}
      <CardContent className="flex flex-col gap-0.5 bg-white px-2 py-1.5 dark:bg-zinc-900">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {step.name}
          </span>
          {step.isBase && (
            <Badge
              variant="secondary"
              className="rounded px-1 py-0 text-[9px] font-bold uppercase tracking-wide"
            >
              base
            </Badge>
          )}
        </div>
        <span className="truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          {step.hex}
        </span>
      </CardContent>
    </Card>
  );
}
