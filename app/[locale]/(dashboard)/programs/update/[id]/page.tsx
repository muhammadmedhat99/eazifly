import { fetchData } from "@/lib/utils";
import { cookies } from "next/headers";
import { CreateProgram } from "@/components/pages/programs/create";

export default async function UpdateProgramPage({
  params,
}: {
  params: { id: string };
}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const data = await fetchData(`client/program/show/${id}`, token?.value);

  return (
    <CreateProgram initialData={data} mode="edit" />
  );
}
