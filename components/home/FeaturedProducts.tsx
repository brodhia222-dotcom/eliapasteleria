"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFeaturedItems } from "@/lib/data/products";
import { priceFrom, formatARS } from "@/lib/pricing";

const CARD_INITIAL = [
  { x: -70, y: 40, rotate: -2 },
  { x: 0, y: 80, rotate: 0 },
  { x: 70, y: 40, rotate: 2 },
];

const FEATURED = getFeaturedItems();

export default function FeaturedProducts() {
  return (
    <section className="py-28 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            >
              <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
                Nuestros productos
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight">
                Para cada antojo
              </h2>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <Link
              href="/productos"
              className="text-sm text-ink-muted hover:text-teal transition-colors font-body underline underline-offset-4 self-start md:self-auto"
            >
              Ver todo el catálogo →
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{
                x: CARD_INITIAL[i].x,
                y: CARD_INITIAL[i].y,
                opacity: 0,
                scale: 0.92,
                rotate: CARD_INITIAL[i].rotate,
              }}
              whileInView={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: i * 0.1 }}
            >
              <Link href="/productos" className="group block">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-all duration-500" />
                  {item.leadHours <= 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-sage text-white text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        Siempre disponible
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink mb-1 group-hover:text-teal transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-sm text-ink-muted font-body line-clamp-1">{item.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-ink-muted font-body">Desde</p>
                    <p className="font-display text-lg font-semibold text-teal">
                      {formatARS(priceFrom(item))}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
