// ============================================================================
// Capa de acceso a PEDIDOS
// ----------------------------------------------------------------------------
// Fase 1: simulación local (no persiste ni envía mails). La fecha se bloquea
// vía el store del calendario en el componente.
// Fase 2: POST /api/orders → inserta en Supabase, bloquea la fecha y dispara
//         los dos emails con Resend; el server devuelve el Order persistido.
// ============================================================================
import type { Order } from "../orderTypes";

export async function createOrder(order: Order): Promise<Order> {
  const saved: Order = {
    ...order,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  // Simula latencia de red para que la UI maneje el estado async desde ya.
  await new Promise((r) => setTimeout(r, 300));
  return saved;

  // --- Fase 2 (Supabase + Resend) -------------------------------------------
  // const res = await fetch("/api/orders", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(order),
  // });
  // if (!res.ok) throw new Error("No se pudo registrar el pedido");
  // return (await res.json()) as Order;
}
