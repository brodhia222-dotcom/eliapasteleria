import { MONTH_NAMES_ES } from "@/lib/calendarUtils";

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ year, month, onPrev, onNext }: Props) {
  const now = new Date();
  const isPrevDisabled =
    year === now.getFullYear() && month === now.getMonth();

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-cream-deep hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mes anterior"
      >
        ←
      </button>
      <p className="font-display text-lg font-semibold text-ink tracking-tight">
        {MONTH_NAMES_ES[month]} {year}
      </p>
      <button
        onClick={onNext}
        className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-cream-deep hover:text-ink transition-colors"
        aria-label="Mes siguiente"
      >
        →
      </button>
    </div>
  );
}
