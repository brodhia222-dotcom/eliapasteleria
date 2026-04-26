"use client";
import { useOrderStore } from "@/lib/store";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Form({ onNext, onBack }: Props) {
  const {
    customerName,
    customerPhone,
    customerNeighborhood,
    customerMessage,
    setCustomerField,
  } = useOrderStore();

  const canContinue = customerName.trim() && customerPhone.trim() && customerNeighborhood.trim();

  const field = (label: string, key: string, value: string, placeholder: string, type = "text") => (
    <div>
      <label className="block text-xs text-ink-muted font-body uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setCustomerField(key, e.target.value)}
        className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm font-body text-ink bg-surface placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all"
      />
    </div>
  );

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-2xl font-semibold text-ink mb-2">
        Tus datos de contacto
      </h2>
      <p className="text-sm text-ink-muted font-body mb-8">
        Necesitamos estos datos para coordinar los detalles del pedido con vos.
      </p>

      <div className="space-y-5 mb-8">
        {field("Nombre completo *", "customerName", customerName, "Tu nombre")}
        <div>
          <label className="block text-xs text-ink-muted font-body uppercase tracking-wider mb-2">
            WhatsApp *
          </label>
          <div className="flex">
            <span className="flex items-center px-4 border border-r-0 border-black/10 rounded-l-xl bg-cream-deep text-ink-muted text-sm font-body">
              +54
            </span>
            <input
              type="tel"
              value={customerPhone}
              placeholder="11 2345 6789"
              onChange={(e) => setCustomerField("customerPhone", e.target.value)}
              className="flex-1 border border-black/10 rounded-r-xl px-4 py-3 text-sm font-body text-ink bg-surface placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all"
            />
          </div>
        </div>
        {field("Barrio / Localidad *", "customerNeighborhood", customerNeighborhood, "Palermo, CABA")}
        <div>
          <label className="block text-xs text-ink-muted font-body uppercase tracking-wider mb-2">
            Descripción del diseño
          </label>
          <textarea
            value={customerMessage}
            placeholder="Contame qué tenés en mente: temática, colores, personajes, estilo... Todo suma."
            onChange={(e) => setCustomerField("customerMessage", e.target.value)}
            rows={4}
            className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm font-body text-ink bg-surface placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-ink-muted font-body uppercase tracking-wider mb-2">
            Imagen de referencia
          </label>
          <div
            onClick={() =>
              alert(
                "La carga de imágenes estará disponible en la versión completa del sitio. Por ahora, podés enviarnos la imagen por WhatsApp al confirmar."
              )
            }
            className="w-full border border-dashed border-black/15 rounded-xl px-4 py-6 text-center cursor-pointer hover:border-teal/40 transition-colors"
          >
            <p className="text-sm text-ink-muted font-body">
              📎 Subir imagen de referencia
            </p>
            <p className="text-xs text-ink-muted/50 font-body mt-1">
              Disponible en versión completa
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-black/15 text-ink-muted font-body text-sm hover:border-ink hover:text-ink transition-colors"
        >
          ← Volver
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 bg-teal text-white font-medium py-3 rounded-full transition-all duration-300 hover:bg-teal-d active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Revisar pedido →
        </button>
      </div>
    </div>
  );
}
