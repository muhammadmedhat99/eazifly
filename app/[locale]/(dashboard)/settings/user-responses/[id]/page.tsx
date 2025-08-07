import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ResponseDetails } from "@/components/pages/settings/user-responses/response-details";
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

  const respnseData = (await fetchData(`client/user/response/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "الردود",
      link: "/settings/user-responses",
    },
    {
      id: 3,
      name: "بيانات الرد",
    },
    {
      id: 4,
      name:
        `${respnseData?.data?.title_ar}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <ResponseDetails data={respnseData} />
    </>
  );
}
