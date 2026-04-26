import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70 pt-12 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8 border-b border-cream/10">
          <div>
            <p className="font-display text-2xl font-semibold text-cream mb-2">
              Elia Pastelería
            </p>
            <p className="text-sm text-cream/50 max-w-xs">
              Cookies decoradas y porciones de torta artesanales elaboradas con amor en Buenos Aires.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/productos" className="hover:text-cream transition-colors">Productos</Link>
            <Link href="/galeria" className="hover:text-cream transition-colors">Galería</Link>
            <Link href="/nosotras" className="hover:text-cream transition-colors">Sobre mí</Link>
            <Link href="/preguntas" className="hover:text-cream transition-colors">Preguntas</Link>
            <Link href="/encargo" className="hover:text-cream transition-colors">Hacer encargo</Link>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/eliapasteleria"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              @eliapasteleria
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-cream/30">
          <p>© {new Date().getFullYear()} Elia Pastelería. Todos los derechos reservados.</p>
          <p className="font-accent italic">Hecho con amor en Argentina</p>
        </div>
      </div>
    </footer>
  );
}
