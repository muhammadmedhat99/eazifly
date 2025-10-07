import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ReasonDetails } from "@/components/pages/settings/change-instructor/reason-details";
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

  const reasonData = (await fetchData(`client/reason/change/instructor/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "أسباب تغيير المعلم",
      link: "/settings/change-instructor",
    },
    {
      id: 3,
      name: "بيانات السبب",
    },
    {
      id: 4,
      name:
        `${reasonData?.data?.title_ar}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <ReasonDetails data={reasonData} />
    </>
  );
}
