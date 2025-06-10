import { BreadCrumb } from "@/components/global/BreadCrumb";
import { StudentDetails } from "@/components/pages/students/student-details";
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
  const data = await fetchData(`client/user/show/${id}`, token?.value);
  const subscriptionsData = await fetchData(`client/user/subscriptions/${id}`, token?.value);

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "الطلاب",
      link: "/students",
    },
    {
      id: 3,
      name: "بيانات الطلاب",
    },
    {
      id: 4,
      name:
        `${data?.data?.first_name} ${data?.data?.last_name}` || "بيانات الطلاب",
    },
  ];
  return (
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <StudentDetails data={data} subscriptionsData={subscriptionsData} />
    </>
  );
}
