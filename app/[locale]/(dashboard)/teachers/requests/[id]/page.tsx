import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ProfileRequestDetails } from "@/components/pages/teachers/requests/profile-request-details";
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
  const data = await fetchData(`client/instructor/update/profile/requests/${id}`, token?.value);

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
       link: "/teachers/requests",
    },
    {
      id: 4,
      name:
        `${data?.data?.instructor_data?.name}` || "بيانات المعلم",
    },
  ];
  return (
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <ProfileRequestDetails data= {data}/>
    </>
  );
}
