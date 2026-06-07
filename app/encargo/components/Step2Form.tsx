"use client";
import { useOrderStore } from "@/lib/store";
import { SITE } from "@/lib/siteConfig";
import MapEmbed from "@/components/layout/MapEmbed";

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
    deliveryMethod,
    shippingAddress,
    shippingDisclaimerAccepted,
    setCustomerField,
    setDelivery,
    setShippingAddress,
    setDisclaimer,
  } = useOrderStore();

  const isShipping = deliveryMethod === "shipping";
  const canContinue =
    customerName.trim() &&
    customerPhone.trim() &&
    customerNeighborhood.trim() &&
    (!isShipping || (shippingAddress.trim() && shippingDisclaimerAccepted));

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
        Tus datos y la entrega
      </h2>
      <p className="text-sm text-ink-muted font-body mb-8">
        Necesitamos estos datos para coordinar tu pedido.
      </p>

      {/* Método de entrega */}
      <div className="mb-8">
        <label className="block text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
          ¿Cómo querés recibirlo?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDelivery("pickup")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 ${
              !isShipping ? "border-teal bg-teal/5" : "border-black/8 hover:border-teal/40"
            }`}
          >
            <p className="font-body text-sm font-medium text-ink">🏠 Retiro en el local</p>
            <p className="font-body text-xs text-ink-muted mt-0.5">Sin costo</p>
          </button>
          <button
            type="button"
            onClick={() => setDelivery("shipping")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 ${
              isShipping ? "border-teal bg-teal/5" : "border-black/8 hover:border-teal/40"
            }`}
          >
            <p className="font-body text-sm font-medium text-ink">🛵 Envío a domicilio</p>
            <p className="font-body text-xs text-ink-muted mt-0.5">Vía Rappi / Uber</p>
          </button>
        </div>
      </div>

      {/* Bloque retiro: dirección + mapa */}
      {!isShipping && (
        <div className="mb-8 bg-cream-deep rounded-2xl p-4">
          <p className="font-body text-sm font-medium text-ink mb-1">Retirás en:</p>
          <p className="font-body text-sm text-ink-muted">{SITE.address}</p>
          <p className="font-body text-xs text-ink-muted mb-3">{SITE.hours}</p>
          <MapEmbed heightClass="h-44" />
        </div>
      )}

      {/* Bloque envío: dirección + disclaimer */}
      {isShipping && (
        <div className="mb-8 space-y-4">
          <div>
            <label className="block text-xs text-ink-muted font-body uppercase tracking-wider mb-2">
              Dirección de envío *
            </label>
            <input
              type="text"
              value={shippingAddress}
              placeholder="Calle, número, piso/depto, localidad"
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm font-body text-ink bg-surface placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all"
            />
          </div>
          <label className="flex items-start gap-3 bg-amber-50 border border-amber-200/60 rounded-xl p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={shippingDisclaimerAccepted}
              onChange={(e) => setDisclaimer(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-teal shrink-0"
            />
            <span className="text-xs text-amber-800 font-body leading-relaxed">
              Entiendo que el envío se realiza a través de una plataforma externa
              (Rappi, Uber u otra) y que <strong>la pastelería no se hace responsable
              por inconvenientes ocurridos durante el envío</strong> (demoras, daños o
              extravíos), ya que el traslado lo realiza un tercero.
            </span>
          </label>
        </div>
      )}

      {/* Datos de contacto */}
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
            Detalles / diseño
          </label>
          <textarea
            value={customerMessage}
            placeholder="Contanos qué tenés en mente: temática, colores, mensaje en la torta... Todo suma."
            onChange={(e) => setCustomerField("customerMessage", e.target.value)}
            rows={4}
            className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm font-body text-ink bg-surface placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all resize-none"
          />
          <p className="text-xs text-ink-muted/60 font-body mt-1.5">
            Para imágenes de referencia, podés enviarlas por WhatsApp al confirmar.
          </p>
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
