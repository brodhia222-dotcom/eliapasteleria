import { DateBlockReason } from "@/lib/store";

interface Props {
  day: number;
  dateStr: string;
  isPast: boolean;
  isTooSoon: boolean;
  isTooFar: boolean;
  isBlocked: boolean;
  blockReason: DateBlockReason | null;
  isSelected: boolean;
  isToday: boolean;
  onClick: (dateStr: string) => void;
  adminMode?: boolean;
  isSpecial?: boolean;
  specialColor?: string;
  specialTitle?: string;
}

export default function CalendarCell({
  day,
  dateStr,
  isPast,
  isTooSoon,
  isTooFar,
  isBlocked,
  blockReason,
  isSelected,
  isToday,
  onClick,
  adminMode = false,
  isSpecial = false,
  specialColor,
  specialTitle,
}: Props) {
  const isUnavailable = !adminMode && (isPast || isTooSoon || isTooFar || isBlocked);
  const selectable = !isUnavailable || adminMode;

  const baseClasses =
    "relative w-10 h-10 mx-auto flex items-center justify-center rounded-full text-sm font-body font-medium transition-all duration-200 select-none";

  let stateClasses = "";
  let dotColor = "";

  if (isSelected) {
    stateClasses = "bg-teal text-white ring-2 ring-teal ring-offset-2";
  } else if (adminMode && isBlocked) {
    stateClasses = "bg-red-100 text-red-600 cursor-pointer hover:bg-red-200";
  } else if (!adminMode && isBlocked) {
    stateClasses = "text-ink-muted/40 line-through cursor-not-allowed";
    dotColor = blockReason === "order" ? "bg-amber-400" : "bg-red-400";
  } else if (isPast || isTooSoon) {
    stateClasses = "text-ink-muted/30 cursor-not-allowed";
  } else if (isTooFar) {
    stateClasses = "text-ink-muted/30 cursor-not-allowed";
  } else if (isToday) {
    stateClasses = "text-teal font-semibold cursor-pointer hover:bg-cream-deep";
  } else {
    stateClasses = "text-ink cursor-pointer hover:bg-teal/10 hover:text-teal";
    dotColor = "bg-sage/60";
  }

  // Resaltado de fecha especial: anillo + dot del color de la fecha (si la
  // celda no está seleccionada). Aplica también en admin para que se vea.
  const showSpecial = isSpecial && !isSelected && (selectable || adminMode);

  const title = isSpecial
    ? specialTitle
    : isBlocked
    ? blockReason === "admin"
      ? "Fecha ocupada"
      : "Pedido confirmado"
    : undefined;

  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <button
        onClick={() => selectable && onClick(dateStr)}
        disabled={isUnavailable && !adminMode}
        className={`${baseClasses} ${stateClasses}`}
        style={showSpecial ? { boxShadow: `inset 0 0 0 1.5px ${specialColor}` } : undefined}
        aria-label={`${day}${isSpecial ? ` — ${specialTitle ?? "fecha especial"}` : ""}${
          isBlocked ? " — no disponible" : ""
        }`}
        title={title}
      >
        {day}
      </button>
      {showSpecial ? (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: specialColor }}
        />
      ) : (
        dotColor && !isSelected && <span className={`w-1 h-1 rounded-full ${dotColor}`} />
      )}
    </div>
  );
}
