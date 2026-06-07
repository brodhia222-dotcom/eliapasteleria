import { SITE } from "@/lib/siteConfig";

interface Props {
  /** Altura del mapa (clases tailwind), por defecto compacto. */
  heightClass?: string;
  className?: string;
}

/**
 * iFrame de Google Maps. Mientras `SITE.mapEmbedSrc` esté vacío, muestra un
 * placeholder indicando dónde irá el mapa (para tenerlo ubicado en el layout).
 */
export default function MapEmbed({ heightClass = "h-56", className = "" }: Props) {
  if (SITE.mapEmbedSrc) {
    return (
      <iframe
        src={SITE.mapEmbedSrc}
        title={`Ubicación de ${SITE.brand}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`w-full ${heightClass} rounded-2xl border-0 ${className}`}
        allowFullScreen
      />
    );
  }

  return (
    <div
      className={`w-full ${heightClass} rounded-2xl border border-dashed border-black/15 bg-cream-deep flex flex-col items-center justify-center text-center px-6 ${className}`}
    >
      <span className="text-2xl mb-2">📍</span>
      <p className="font-body text-sm font-medium text-ink">Acá va el mapa de Google</p>
      <p className="font-body text-xs text-ink-muted mt-1 max-w-xs">
        {SITE.address}
      </p>
      <p className="font-body text-[11px] text-ink-muted/60 mt-2">
        (Pegá el iframe de Google Maps en lib/siteConfig.ts)
      </p>
    </div>
  );
}
