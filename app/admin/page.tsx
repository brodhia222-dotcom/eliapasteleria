"use client";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { useCalendarStore } from "@/lib/store";
import { MONTH_NAMES_ES } from "@/lib/calendarUtils";

export default function AdminPage() {
  const { blockedDates } = useCalendarStore();

  const blocked = Object.entries(blockedDates)
    .filter(([, reason]) => reason === "admin")
    .map(([date]) => date)
    .sort();

  function parseDate(d: string) {
    const [, m, day] = d.split("-").map(Number);
    return `${day} de ${MONTH_NAMES_ES[m - 1]}`;
  }

  return (
    <div className="min-h-[100dvh] bg-cream pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-2">
            Panel admin
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink">
            Gestión de calendario
          </h1>
          <p className="text-ink-muted font-body mt-2 text-sm">
            Bloqueá las fechas que ya tienen pedido por WhatsApp u otros canales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <BookingCalendar adminMode />

          <div>
            <h2 className="font-display text-xl font-semibold text-ink mb-5">
              Fechas bloqueadas
            </h2>
            {blocked.length === 0 ? (
              <p className="text-ink-muted text-sm font-body">
                No hay fechas bloqueadas manualmente.
              </p>
            ) : (
              <ul className="space-y-2">
                {blocked.map((date) => (
                  <li
                    key={date}
                    className="flex items-center justify-between bg-surface border border-black/5 rounded-xl px-4 py-3"
                  >
                    <span className="font-body text-sm text-ink">{parseDate(date)}</span>
                    <span className="text-xs text-red-500 font-medium bg-red-50 px-2.5 py-1 rounded-full">
                      Bloqueado
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 p-4 bg-teal/5 border border-teal/20 rounded-xl">
              <p className="text-xs text-ink-muted font-body leading-relaxed">
                <strong className="text-ink">¿Cómo funciona?</strong><br />
                Hacé clic en cualquier fecha del calendario para bloquearla.
                Al hacer clic de nuevo, se desbloquea. Los cambios se guardan
                automáticamente y se reflejan en el formulario de encargo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
