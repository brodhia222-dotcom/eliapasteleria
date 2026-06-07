"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/mockData";
import { whatsappLink } from "@/lib/whatsappUtils";

export default function PreguntasPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
            FAQ
          </p>
          <h1 className="font-display text-5xl font-semibold text-ink tracking-tight">
            Preguntas frecuentes
          </h1>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = open === item.id;
            return (
              <div
                key={item.id}
                className="bg-surface border border-black/5 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="font-body font-medium text-ink text-sm">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="text-teal text-xl shrink-0"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <div className="px-6 pb-6">
                        <p className="font-body text-sm text-ink-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-teal/5 border border-teal/20 rounded-2xl p-8 text-center">
          <p className="font-body text-ink-muted mb-4">
            ¿No encontrás lo que buscás?
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal text-white font-medium px-6 py-3 rounded-full text-sm hover:bg-teal-d transition-colors"
          >
            Escribinos por WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
