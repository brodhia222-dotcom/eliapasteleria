"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Elegí tus cookies",
    description:
      "Navegá el catálogo y elegí el tipo de producto, la presentación y los detalles del diseño que imaginás. Si necesitás inspiración, te ayudamos.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8c-8.84 0-16 5.37-16 12 0 3.5 1.9 6.67 5 9l-2 7 8-3.5c1.6.5 3.3.5 5 .5 8.84 0 16-5.37 16-12S32.84 8 24 8z" />
        <path d="M17 22h14M17 27h8" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Reservá tu fecha",
    description:
      "Seleccioná la fecha de entrega en el calendario. Si está disponible, la fecha queda reservada para vos.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="10" width="32" height="30" rx="4" />
        <path d="M8 20h32M16 8v6M32 8v6" />
        <circle cx="24" cy="31" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Recibís tu encargo",
    description:
      "Elaboramos tus cookies o porciones artesanalmente y las entregamos en la fecha pactada. Coordinamos los detalles por WhatsApp.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l4 8h8l-6.5 5.5 2.5 8.5L24 23l-8 5 2.5-8.5L12 14h8z" />
        <path d="M24 28v14M16 38l8 4 8-4" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 px-6 bg-cream-deep overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading con reveal dramático */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            >
              <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
                El proceso
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight">
                Simple y transparente
              </h2>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <Link
              href="/encargo"
              className="text-sm font-body font-medium text-teal hover:text-teal-d transition-colors underline underline-offset-4 self-start md:self-auto"
            >
              Hacer mi encargo →
            </Link>
          </motion.div>
        </div>

        {/* Cards con perspectiva 3D en la entrada */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: "1200px" }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ y: 80, opacity: 0, scale: 0.88, rotateX: 15 }}
              whileInView={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 18,
                delay: i * 0.18,
              }}
              style={{ transformOrigin: "50% 0%" }}
              className="h-full"
            >
            <motion.div
              initial={{ boxShadow: "0 0 0 0 rgba(212,103,58,0)" }}
              whileInView={{ boxShadow: "0 8px 32px -8px rgba(212,103,58,0.2)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.18 + 0.5 }}
              style={{
                animation: `float ${3 + i * 0.6}s ease-in-out infinite ${i * 0.9}s`,
              }}
              className="bg-surface rounded-2xl p-8 border border-black/5 relative overflow-hidden group h-full"
            >
              {/* Accent top */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-teal" />

              {/* Step badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-xs font-semibold text-teal/40 tracking-widest uppercase">
                  Paso {step.number}
                </span>
                <span className="w-8 h-8 rounded-full bg-teal/8 flex items-center justify-center">
                  <span className="font-display text-xs font-semibold text-teal">
                    {step.number}
                  </span>
                </span>
              </div>

              {/* Icon */}
              <div className="text-teal mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 origin-left">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-ink-muted leading-relaxed">
                {step.description}
              </p>

              {/* Decorative corner number */}
              <div className="absolute -bottom-4 -right-2 font-display text-8xl font-semibold text-black/3 select-none pointer-events-none">
                {step.number}
              </div>
            </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
