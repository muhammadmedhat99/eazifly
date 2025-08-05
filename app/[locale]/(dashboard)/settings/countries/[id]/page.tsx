import { BreadCrumb } from "@/components/global/BreadCrumb";
import { CountryDetails } from "@/components/pages/settings/countries/country-details";
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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['country', id],
    queryFn: () => fetchData(`client/country/show/${id}`, token?.value),
  });

  const countryData = (await fetchData(`client/country/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "الدول",
      link: "/settings/countries",
    },
    {
      id: 3,
      name: "بيانات الدولة",
    },
    {
      id: 4,
      name:
        `${countryData?.data?.name_ar}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <CountryDetails data={countryData} />
    </>
  );
}
