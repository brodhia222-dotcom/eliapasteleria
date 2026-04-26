"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "./components/StepIndicator";
import Step1Calendar from "./components/Step1Calendar";
import Step2Form from "./components/Step2Form";
import Step3Summary from "./components/Step3Summary";
import SuccessScreen from "./components/SuccessScreen";

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function EncargoPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState(1);

  function goNext() { setDir(1); setStep((s) => s + 1); }
  function goBack() { setDir(-1); setStep((s) => s - 1); }
  function finish() { setDone(true); }

  return (
    <div className="min-h-[100dvh] bg-cream pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {!done && (
          <>
            <div className="mb-8">
              <p className="text-teal text-xs uppercase tracking-widest font-body mb-2">
                Hacé tu encargo
              </p>
              <h1 className="font-display text-4xl font-semibold text-ink">
                Arts & Cakes
              </h1>
            </div>
            <StepIndicator current={step} />
          </>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={done ? "done" : step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {done ? (
              <SuccessScreen />
            ) : step === 1 ? (
              <Step1Calendar onNext={goNext} />
            ) : step === 2 ? (
              <Step2Form onNext={goNext} onBack={goBack} />
            ) : (
              <Step3Summary onConfirm={finish} onBack={goBack} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
