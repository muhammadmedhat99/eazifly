import { BreadCrumb } from "@/components/global/BreadCrumb";
import { TeacherDetails } from "@/components/pages/teachers/teacher-details";
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
  const data = await fetchData(`client/instructor/show/${id}`, token?.value);

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
      name: "بيانات المعلم",
    },
    {
      id: 4,
      name:
        `${data?.data?.name_ar}` || "بيانات المعلم",
    },
  ];
  return (
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <TeacherDetails data={data} />
    </>
  );
}
