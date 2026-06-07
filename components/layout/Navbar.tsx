"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartCount } from "@/lib/cartStore";

const NAV_LINKS = [
  { label: "Productos", href: "/productos" },
  { label: "Galería", href: "/galeria" },
  { label: "Sobre mí", href: "/nosotras" },
  { label: "Preguntas", href: "/preguntas" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { lines, open } = useCartStore();
  const count = cartCount(lines);

  // Solo transparente sobre el hero de la home; en el resto siempre sólido
  const isTransparent = pathname === "/" && !scrolled;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const iconColor = isTransparent ? "text-white" : "text-ink";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-md shadow-sm border-b border-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-xl font-semibold tracking-tight transition-colors duration-500 ${
              isTransparent ? "text-white hover:text-white/80" : "text-ink hover:text-teal"
            }`}
          >
            Elia Pastelería
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-body group transition-colors duration-300 ${
                    isActive
                      ? isTransparent ? "text-white font-medium" : "text-teal font-medium"
                      : isTransparent ? "text-white/75 hover:text-white" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-0.5 origin-left transition-transform duration-300 ease-out ${
                      isTransparent ? "bg-white" : "bg-teal"
                    } ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Carrito + CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={open}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isTransparent ? "hover:bg-white/15" : "hover:bg-cream-deep"
              }`}
              aria-label="Abrir carrito"
            >
              <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-teal text-white text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <Link
              href="/encargo"
              className={`hidden md:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 active:scale-95 ${
                isTransparent
                  ? "bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25"
                  : "bg-teal text-white hover:bg-teal-d"
              }`}
            >
              Hacer pedido
              <span className="text-white/70">→</span>
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 relative"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className={`block w-6 h-px origin-center transition-colors duration-500 ${
                  isTransparent && !menuOpen ? "bg-white" : "bg-ink"
                }`}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className={`block w-6 h-px transition-colors duration-500 ${
                  isTransparent && !menuOpen ? "bg-white" : "bg-ink"
                }`}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className={`block w-6 h-px origin-center transition-colors duration-500 ${
                  isTransparent && !menuOpen ? "bg-white" : "bg-ink"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream/97 backdrop-blur-lg flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-4xl font-medium tracking-tight ${
                      pathname === link.href ? "text-teal" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="mt-4"
              >
                <Link
                  href="/encargo"
                  className="inline-flex items-center gap-2 bg-teal text-white font-medium px-7 py-3.5 rounded-full text-lg"
                >
                  Hacer pedido →
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
