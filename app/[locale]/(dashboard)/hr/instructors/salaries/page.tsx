import React from "react";
import Link from "next/link";

import { BreadCrumb } from "@/components/global/BreadCrumb";
import { AllStudents } from "@/components/pages/students";
import { getTranslations } from "next-intl/server";
import { Salaries } from "@/components/pages/salaries";



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
    name: "الموارد البشرية",
  },
  {
    id: 3,
    name: "رواتب المعلمين",
  },
];

  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
      </BreadCrumb>

      <Salaries />
    </div>
  );
}
