import { redirect } from "next/navigation";

// El catálogo ahora es una sola página con filtros; ya no hay detalle por categoría.
export default function CategoriaRedirect() {
  redirect("/productos");
}
