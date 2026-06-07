import Link from "next/link";
import { SITE } from "@/lib/siteConfig";
import { whatsappLink } from "@/lib/whatsappUtils";
import MapEmbed from "@/components/layout/MapEmbed";

export default function NosotrasPage() {
  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="Elia — pastelera artesanal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-teal text-white rounded-2xl px-5 py-3 hidden md:block">
              <p className="font-display text-sm font-semibold">Buenos Aires, Argentina</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-teal text-xs uppercase tracking-widest font-body mb-4">
              Sobre mí
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-2">
              Hola, soy Elia
            </h1>
            <p className="font-accent italic text-ink-muted text-xl mb-8">
              — la pastelera detrás de cada cookie
            </p>

            <div className="space-y-4 font-body text-ink-muted leading-relaxed text-sm">
              <p>
                Empecé decorando cookies como hobby y en algún punto dejó de ser un hobby
                para convertirse en mi trabajo. Lo que más me gusta de este oficio es que
                cada pieza es única: nunca hago dos cookies exactamente iguales.
              </p>
              <p>
                Me especialicé en royal icing y sugar art. Trabajo desde casa, elaborando
                cada pieza de manera artesanal — desde la masa hasta el último detalle
                pintado a mano. Sin intermediarios, sin atajos.
              </p>
              <p>
                Si tenés algo en mente, aunque sea una idea vaga, escribime. Juntas podemos
                convertirlo en algo dulce que cuente tu historia.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/encargo"
                className="inline-flex items-center gap-2 bg-teal text-white font-medium px-7 py-3.5 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95 text-sm"
              >
                Hacer un encargo →
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-black/10 text-ink font-medium px-7 py-3.5 rounded-full hover:border-ink transition-colors text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="mt-20">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
            Dónde estamos
          </p>
          <h2 className="font-display text-3xl font-semibold text-ink tracking-tight mb-2">
            Ubicación y retiro
          </h2>
          <p className="font-body text-ink-muted text-sm mb-6 max-w-lg">
            Podés retirar tu pedido por el local o coordinar un envío a domicilio.
            {" "}
            {SITE.address} · {SITE.hours}.
          </p>
          <MapEmbed heightClass="h-80" />
        </div>
      </div>
    </div>
  );
}
