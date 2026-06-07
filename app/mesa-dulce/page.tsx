import { redirect } from "next/navigation";

// Mesa dulce se quitó del catálogo por ahora; redirigimos a productos.
export default function MesaDulceRedirect() {
  redirect("/productos");
}
