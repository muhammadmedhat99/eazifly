import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ExternalServicesDetails } from "@/components/pages/settings/Settings/external-services-details";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "الإعدادات",
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <ExternalServicesDetails />
    </>
  );
}
