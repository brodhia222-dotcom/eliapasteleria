"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="py-24 px-6 bg-ink text-cream overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1600&q=60"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-teal text-xs uppercase tracking-widest font-body mb-4"
        >
          ¿Tenés algo en mente?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight"
        >
          Tu fecha perfecta
          <br />
          <em className="not-italic text-teal">te está esperando</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="font-body text-cream/70 text-lg mb-10"
        >
          Mirá las fechas disponibles y reservá la tuya antes de que se llene el calendario.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <Link
            href="/encargo"
            className="inline-flex items-center gap-2 bg-teal text-white font-medium px-8 py-4 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95 text-base"
          >
            Reservar fecha →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
