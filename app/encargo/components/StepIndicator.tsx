const STEPS = ["Fecha", "Tus datos", "Confirmar"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  done
                    ? "bg-teal text-white"
                    : active
                    ? "bg-ink text-white"
                    : "bg-black/8 text-ink-muted"
                }`}
              >
                {done ? "✓" : step}
              </div>
              <span
                className={`text-sm font-body hidden sm:block ${
                  active ? "text-ink font-medium" : "text-ink-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-8 sm:w-12 transition-colors duration-500 ${
                  done ? "bg-teal" : "bg-black/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
