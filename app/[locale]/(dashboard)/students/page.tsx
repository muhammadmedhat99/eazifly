import React from "react";
import Link from "next/link";

import { BreadCrumb } from "@/components/global/BreadCrumb";
import { AllStudents } from "@/components/pages/students";
import { getTranslations } from "next-intl/server";



export default async function page() {
  const t = await getTranslations('StudentsPage');

  const BreadCrumbItems = [
  {
    id: 1,
    name: t("home.title"),
    link: "/",
  },
  {
    id: 2,
    name: "الطلاب",
  },
  {
    id: 3,
    name: "بيانات الطلاب",
    link: "/students",
  },
];

  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="#"
            className="text-title font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-input"
          >
            تصدير البيانات
          </Link>  
          <Link
            href="/students/create"
            className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
          >
            أضافة طالب جديد
          </Link>
        </div>
      </BreadCrumb>

      <AllStudents />
    </div>
  );
}
