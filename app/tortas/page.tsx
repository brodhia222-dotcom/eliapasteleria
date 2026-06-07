import { redirect } from "next/navigation";

// Las tortas ahora viven en /productos (filtro "Tortas").
export default function TortasRedirect() {
  redirect("/productos");
}
