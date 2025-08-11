import { BreadCrumb } from "@/components/global/BreadCrumb";
import { CountryDetails } from "@/components/pages/settings/countries/country-details";
import { RoleDetails } from "@/components/pages/settings/roles/role-details";
import { SpecializationDetails } from "@/components/pages/settings/specializations/specialization-details";
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

  const roleData = (await fetchData(`client/show/role/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "الوظائف",
      link: "/settings/roles",
    },
    {
      id: 3,
      name: "بيانات الوظيفة",
    },
    {
      id: 4,
      name:
        `${roleData?.data?.name}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <RoleDetails data={roleData} />
    </>
  );
}
