"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Imágenes distintas a las del catálogo — fondo dramático para el hero
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=90",
    alt: "Cookies decoradas artesanales",
  },
  {
    src: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1920&q=90",
    alt: "Galletas decoradas con glasé real",
  },
  {
    src: "https://images.unsplash.com/photo-1607920592519-bab4d4db3a2e?w=1920&q=90",
    alt: "Cookies pintadas a mano",
  },
  {
    src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1920&q=90",
    alt: "Porciones de torta artesanales",
  },
  {
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1920&q=90",
    alt: "Caja regalo de cookies especiales",
  },
];

const SLIDE_DURATION = 3500;
const EASE = [0.32, 0.72, 0, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.8, ease: EASE },
  }),
};

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Slideshow con transición pan + fade */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: "4%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "-4%" }}
            transition={{ duration: 1.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0"
          >
            {/* Ken Burns zoom en la imagen activa */}
            <motion.img
              src={SLIDES[current].src}
              alt={SLIDES[current].alt}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: SLIDE_DURATION / 1000 + 2, ease: "linear" }}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlays de profundidad */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/30 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28 w-full">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest font-body mb-6"
          >
            <span className="w-8 h-px bg-teal" />
            Pastelería artesanal · Buenos Aires
            <span className="w-8 h-px bg-teal" />
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-display text-5xl md:text-7xl font-semibold text-white leading-[1.05] tracking-tight mb-6"
          >
            Cada cookie es
            <br />
            <em className="not-italic text-teal">una historia</em>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-body text-lg text-white/80 leading-relaxed mb-10 max-w-lg mx-auto"
          >
            Cookies artesanales y porciones de torta decoradas para tus momentos especiales.
            Cada pieza pintada a mano con amor en Buenos Aires.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/encargo"
              className="inline-flex items-center justify-center gap-2 bg-teal text-white font-medium px-8 py-4 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95 text-base"
            >
              Hacer mi encargo
              <span>→</span>
            </Link>
            <Link
              href="/productos"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-base"
            >
              Ver catálogo
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Dots + número de slide */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full ${
              i === current
                ? "w-8 h-1.5 bg-teal"
                : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </motion.div>

      {/* Contador de slide — esquina inferior derecha */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 right-6 z-10 hidden md:flex items-center gap-2"
      >
        <span className="font-body text-xs text-white/50 tabular-nums">
          0{current + 1}
        </span>
        <span className="w-8 h-px bg-white/20" />
        <span className="font-body text-xs text-white/30 tabular-nums">
          0{SLIDES.length}
        </span>
      </motion.div>
    </section>
  );
}
