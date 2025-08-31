import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ClientsDetails } from "@/components/pages/settings/clients/clients-details";
import { fetchData } from "@/lib/utils";
import { cookies } from "next/headers";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const clientsData = (await fetchData(`client/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "الموظفين",
      link: "/hr/clients",
    },
    {
      id: 3,
      name: "بيانات الموظفين",
    },
    {
      id: 4,
      name:
        `${clientsData?.data?.name}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <ClientsDetails data={clientsData} />
    </>
  );
}
