import React from "react";
import Link from "next/link";

import { BreadCrumb } from "@/components/global/BreadCrumb";
import { AllTeachers } from "@/components/pages/teachers";

const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "المعلمين",
  },
];

export default function page() {
  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="text-title font-semibold text-sm px-6 py-2 rounded-md bg-input"
          >
            تصدير البيانات
          </Link>
          <Link
            href="/teachers/create"
            className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
          >
            أضافة معلم جديد
          </Link>
        </div>
      </BreadCrumb>

      <AllTeachers />
    </div>
  );
}
