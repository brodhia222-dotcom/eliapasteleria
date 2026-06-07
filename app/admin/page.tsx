"use client";
import { useState } from "react";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { useCalendarStore, useStockStore } from "@/lib/store";
import { MONTH_NAMES_ES, formatDateES } from "@/lib/calendarUtils";
import { getAllProducts } from "@/lib/data/products";
import { getSpecialDates } from "@/lib/data/specialDates";

type Tab = "fechas" | "especiales" | "stock";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("fechas");

  return (
    <div className="min-h-[100dvh] bg-cream pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-2">
            Panel admin
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink">
            Gestión del local
          </h1>
          <p className="text-ink-muted font-body mt-2 text-sm">
            Manejá las fechas disponibles, las fechas especiales y el stock de productos.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(
            [
              { id: "fechas", label: "Fechas" },
              { id: "especiales", label: "Fechas especiales" },
              { id: "stock", label: "Stock" },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                tab === t.id ? "bg-teal text-white" : "bg-cream-deep text-ink hover:bg-teal/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "fechas" && <FechasTab />}
        {tab === "especiales" && <EspecialesTab />}
        {tab === "stock" && <StockTab />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function FechasTab() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <BookingCalendar adminMode />

      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          Fechas bloqueadas manualmente
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
            <strong className="text-ink">¿Cómo funciona?</strong>
            <br />
            Hacé clic en cualquier fecha del calendario para bloquearla o desbloquearla.
            Los cambios se guardan automáticamente y se reflejan en el formulario de
            encargo.
          </p>
        </div>
      </div>
    </div>
  );
}

function EspecialesTab() {
  const special = getSpecialDates();
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink mb-5">
        Fechas especiales
      </h2>
      <ul className="space-y-2">
        {special.map((sd) => (
          <li
            key={sd.id}
            className="flex items-start gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3"
          >
            <span
              className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: sd.color }}
            />
            <div className="flex-1">
              <p className="font-body text-sm font-medium text-ink">{sd.title}</p>
              <p className="font-body text-xs text-ink-muted">
                {formatDateES(sd.date)} · {sd.includes}
              </p>
            </div>
            <span
              className="text-[11px] font-body font-medium px-2.5 py-1 rounded-full text-white shrink-0"
              style={{ backgroundColor: sd.color }}
            >
              {sd.badge}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-8 p-4 bg-teal/5 border border-teal/20 rounded-xl">
        <p className="text-xs text-ink-muted font-body leading-relaxed">
          Estas fechas se resaltan en el calendario y en la home. La edición (agregar /
          quitar fechas y definir qué se ofrece) se habilitará con el panel conectado a
          Supabase (Fase 2). Por ahora se configuran en <code>lib/mockData.ts</code>.
        </p>
      </div>
    </div>
  );
}

function StockTab() {
  const products = getAllProducts();
  const { isAvailable, setAvailable } = useStockStore();

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink mb-5">
        Disponibilidad de productos
      </h2>
      <p className="text-sm text-ink-muted font-body mb-6">
        Activá o desactivá productos y variedades. Lo que desactives no se podrá
        seleccionar en el formulario de encargo.
      </p>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="bg-surface border border-black/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-ink">{p.name}</p>
                <p className="font-body text-xs text-ink-muted capitalize">
                  {p.category.replace("-", " ")}
                </p>
              </div>
              <Toggle
                on={isAvailable(p.id)}
                onChange={(v) => setAvailable(p.id, null, v)}
              />
            </div>

            {p.kind === "stock" && p.varieties && (
              <div className="mt-3 pt-3 border-t border-black/5 space-y-2">
                {p.varieties.map((v) => (
                  <div key={v.id} className="flex items-center justify-between pl-2">
                    <span className="font-body text-xs text-ink-muted">{v.name}</span>
                    <Toggle
                      on={isAvailable(p.id, v.id)}
                      onChange={(val) => setAvailable(p.id, v.id, val)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        on ? "bg-teal" : "bg-black/15"
      }`}
      aria-pressed={on}
      aria-label={on ? "Disponible" : "Sin stock"}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
