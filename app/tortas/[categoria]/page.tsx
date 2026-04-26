import { redirect } from "next/navigation";

export default async function TortasCategoriaRedirect({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  redirect(`/productos/${categoria}`);
}
