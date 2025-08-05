import { BreadCrumb } from "@/components/global/BreadCrumb";
import { CountryDetails } from "@/components/pages/settings/countries/country-details";
import { SpecializationDetails } from "@/components/pages/settings/specializations/specialization-details";
import { StudentDetails } from "@/components/pages/students/student-details";
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

  const specializationData = (await fetchData(`client/Specialization/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "التخصصات",
      link: "/settings/specializations",
    },
    {
      id: 3,
      name: "بيانات التخصص",
    },
    {
      id: 4,
      name:
        `${specializationData?.data?.title_ar}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <SpecializationDetails data={specializationData} />
    </>
  );
}
