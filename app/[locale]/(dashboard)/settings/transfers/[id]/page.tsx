import { BreadCrumb } from "@/components/global/BreadCrumb";
import { TransferDetails } from "@/components/pages/settings/transfers/transfer-details";
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

  const transferData = (await fetchData(`client/instructor/payment/method/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "طرق التحويل",
      link: "/settings/transfers",
    },
    {
      id: 3,
      name: "بيانات طريقة التحويل",
    },
    {
      id: 4,
      name:
        `${transferData?.data?.title}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <TransferDetails data={transferData} />
    </>
  );
}
