"use client";
import { useMemo, useState } from "react";
import { useCalendarStore } from "@/lib/store";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  toISODate,
  isStrictlyPast,
  meetsLeadTime,
  isTooFar,
  DAY_NAMES_ES,
} from "@/lib/calendarUtils";
import { getSpecialDatesMap } from "@/lib/data/specialDates";
import CalendarHeader from "./CalendarHeader";
import CalendarCell from "./CalendarCell";

interface Props {
  adminMode?: boolean;
  onDateSelect?: (dateStr: string) => void;
  /** Anticipación mínima requerida por el producto elegido (horas). */
  minLeadHours?: number;
}

export default function BookingCalendar({
  adminMode = false,
  onDateSelect,
  minLeadHours = 0,
}: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const {
    selectedDate,
    setSelectedDate,
    isBlocked,
    getBlockReason,
    blockDate,
    unblockDate,
  } = useCalendarStore();

  const specialMap = useMemo(() => getSpecialDatesMap(), []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function handlePrev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function handleNext() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function handleCellClick(dateStr: string) {
    if (adminMode) {
      if (isBlocked(dateStr)) unblockDate(dateStr);
      else blockDate(dateStr, "admin");
      return;
    }
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
    onDateSelect?.(dateStr);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayStr = toISODate(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="bg-surface rounded-2xl border border-black/5 p-6 w-full max-w-sm">
      <CalendarHeader
        year={year}
        month={month}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Legend */}
      {!adminMode && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5 text-xs text-ink-muted font-body">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage/60" /> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Ocupado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#6CA7D4" }} />
            Fecha especial
          </span>
        </div>
      )}
      {adminMode && (
        <p className="text-xs text-ink-muted font-body mb-5">
          Hacé clic en una fecha para bloquearla o desbloquearla.
        </p>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES_ES.map((d) => (
          <p key={d} className="text-center text-[11px] text-ink-muted/60 font-body font-medium">
            {d}
          </p>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = toISODate(year, month, day);
          const blocked = isBlocked(dateStr);
          const reason = getBlockReason(dateStr);
          const past = isStrictlyPast(dateStr);
          const tooSoon = !adminMode && !meetsLeadTime(dateStr, minLeadHours);
          const tooFar = isTooFar(dateStr, 60);
          const special = specialMap[dateStr];
          return (
            <CalendarCell
              key={dateStr}
              day={day}
              dateStr={dateStr}
              isPast={past}
              isTooSoon={tooSoon}
              isTooFar={tooFar}
              isBlocked={blocked}
              blockReason={reason}
              isSelected={selectedDate === dateStr}
              isToday={dateStr === todayStr}
              onClick={handleCellClick}
              adminMode={adminMode}
              isSpecial={!!special}
              specialColor={special?.color}
              specialTitle={special ? `${special.title} — ${special.includes}` : undefined}
            />
          );
        })}
      </div>

      {/* Selected date display */}
      {!adminMode && selectedDate && (
        <div className="mt-5 pt-4 border-t border-black/5">
          <p className="text-xs text-ink-muted font-body mb-1">Fecha seleccionada</p>
          <p className="font-display font-semibold text-ink">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
