import { BreadCrumb } from "@/components/global/BreadCrumb";
import { SessionsDetails } from "@/components/pages/settings/sessions-time/sessions-details";
import { fetchData } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";
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

  const SessionsData = (await fetchData(`client/plan/session/time/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "مدة المحاضرات",
      link: "/settings/sessions-time",
    },
    {
      id: 3,
      name: "مدة المحاضرة",
    },
    {
      id: 4,
      name:
        `${SessionsData?.data?.title_ar}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <SessionsDetails data={SessionsData} />
    </>
  );
}
