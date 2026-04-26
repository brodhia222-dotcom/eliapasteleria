"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const ROW_1 = [
  { id: 1, src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80", alt: "Cookies decoradas con royal icing" },
  { id: 2, src: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80", alt: "Galletas artesanales coloridas" },
  { id: 3, src: "https://images.unsplash.com/photo-1607920592519-bab4d4db3a2e?w=500&q=80", alt: "Cookies pintadas a mano" },
  { id: 4, src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80", alt: "Caja regalo de cookies" },
  { id: 5, src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500&q=80", alt: "Cupcakes artesanales decorados" },
];

const ROW_2 = [
  { id: 6, src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80", alt: "Porciones de torta artesanal" },
  { id: 7, src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80", alt: "Porción de torta ganache" },
  { id: 8, src: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&q=80", alt: "Torta decorada con flores" },
  { id: 9, src: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&q=80", alt: "Detalle de decoración artesanal" },
  { id: 10, src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80", alt: "Postre de cumpleaños decorado" },
];

function MarqueeRow({
  images,
  reverse = false,
  speed = 30,
}: {
  images: typeof ROW_1;
  reverse?: boolean;
  speed?: number;
}) {
  const [paused, setPaused] = useState(false);
  const doubled = [...images, ...images];
  const animStyle = {
    animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
    animationPlayState: paused ? "paused" : "running",
  };

  return (
    <div
      className="overflow-x-clip py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex w-max" style={animStyle}>
        {doubled.map((img, i) => (
          <div
            key={i}
            className="group relative flex-shrink-0 w-72 h-64 mr-4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.06] hover:z-10 hover:shadow-xl"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all duration-300 flex items-center justify-center">
              <p className="font-body text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4 drop-shadow-lg">
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GaleriaPage() {
  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
            Portfolio
          </p>
          <h1 className="font-display text-5xl font-semibold text-ink tracking-tight">
            Galería
          </h1>
          <p className="font-body text-ink-muted mt-3">
            Una muestra de cookies, porciones y cajas elaboradas para distintas ocasiones.
          </p>
        </motion.div>
      </div>

      {/* Marquee — edge to edge */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          <MarqueeRow images={ROW_1} reverse={false} speed={32} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.32, 0.72, 0, 1] }}
        >
          <MarqueeRow images={ROW_2} reverse={true} speed={28} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          <MarqueeRow
            images={[ROW_1[2], ROW_2[1], ROW_1[0], ROW_2[3], ROW_1[4]]}
            reverse={false}
            speed={36}
          />
        </motion.div>
      </div>

      {/* CTA Instagram */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-sm text-ink-muted mb-4">
            ¿Querés ver más? Seguinos en Instagram.
          </p>
          <a
            href="https://instagram.com/eliapasteleria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-ink font-medium text-sm hover:text-teal transition-colors underline underline-offset-4"
          >
            @eliapasteleria →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
