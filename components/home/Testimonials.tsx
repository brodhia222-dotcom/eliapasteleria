"use client";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/mockData";

export default function Testimonials() {
  return (
    <section className="py-28 px-6 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading con clip-path reveal */}
        <div className="mb-16">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            >
              <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
                Trabajos realizados
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight">
                Lo que dicen las clientas
              </h2>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ y: 90, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 75,
                damping: 18,
                delay: i * 0.15,
              }}
              className="bg-surface border border-black/5 rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow duration-500"
            >
              {/* Work photo */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={t.imageUrl}
                  alt={t.occasion}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                {/* Overlay gradiente en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Product type badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-teal text-white text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {t.productType}
                  </span>
                </div>
              </div>

              {/* Text block */}
              <div className="p-6">
                <p className="font-body text-xs text-ink-muted uppercase tracking-wider mb-3">
                  {t.occasion}
                </p>
                <blockquote className="font-accent italic text-ink/80 leading-relaxed text-[1rem] mb-5">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2 pt-4 border-t border-black/5">
                  <div className="w-7 h-7 rounded-full bg-teal/15 flex items-center justify-center shrink-0">
                    <span className="font-display text-[11px] font-semibold text-teal">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-ink leading-none">
                      {t.name}
                    </p>
                    <p className="font-body text-xs text-ink-muted mt-0.5">{t.neighborhood}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
