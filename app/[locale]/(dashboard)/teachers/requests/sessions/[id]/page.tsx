import { BreadCrumb } from "@/components/global/BreadCrumb";
import { SessionRequestDetails } from "@/components/pages/teachers/requests/session-request-details";
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
  const data = await fetchData(`client/instructor/request/to/cancel/session/${id}`, token?.value);

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "المعلمين",
      link: "/teachers",
    },
    {
      id: 3,
      name: "طلبات المعلمين",
       link: "/teachers/requests/sessions",
    },
    {
      id: 4,
      name:
        `${data?.data?.session?.instructor}` || "بيانات المعلم",
    },
  ];
  return (
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <SessionRequestDetails data= {data}/>
    </>
  );
}
