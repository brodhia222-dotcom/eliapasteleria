"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { getNextSpecialDate } from "@/lib/data/specialDates";
import { formatDateES } from "@/lib/calendarUtils";

export default function SpecialDateBanner() {
  const next = getNextSpecialDate();
  if (!next) return null;

  return (
    <section className="px-6 bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="max-w-7xl mx-auto mt-12 rounded-3xl border bg-surface p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5"
        style={{ borderColor: `${next.color}55` }}
      >
        <span
          className="self-start md:self-auto text-[11px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full text-white shrink-0"
          style={{ backgroundColor: next.color }}
        >
          {next.badge}
        </span>

        <div className="flex-1">
          <p className="font-body text-xs uppercase tracking-widest text-ink-muted mb-1">
            Próxima fecha especial
          </p>
          <p className="font-display text-2xl font-semibold text-ink leading-tight">
            {next.title}
          </p>
          <p className="font-body text-sm text-ink-muted mt-1">
            <span className="font-medium text-ink">{formatDateES(next.date)}</span> · {next.includes}
          </p>
        </div>

        <Link
          href={next.ctaProductSlug ? `/encargo?producto=${next.ctaProductSlug}` : "/encargo"}
          className="inline-flex items-center justify-center gap-2 bg-teal text-white font-medium px-7 py-3.5 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95 text-sm shrink-0"
        >
          Reservar para esta fecha →
        </Link>
      </motion.div>
    </section>
  );
}
