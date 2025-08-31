import React from "react";
import { BreadCrumb } from "@/components/global/BreadCrumb";
import { getTranslations } from "next-intl/server";
import { AllSessions } from "@/components/pages/sessions";



export default async function page() {
  const t = await getTranslations('StudentsPage');

  const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "الحصص",
  },
];

  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
      </BreadCrumb>

      <AllSessions />
    </div>
  );
}
