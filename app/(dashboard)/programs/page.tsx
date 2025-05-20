import { BreadCrumb } from "@/components/global/BreadCrumb";
import { AllPrograms } from "@/components/pages/programs";
import Link from "next/link";
import React from "react";
const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "البرامج",
  },
];
export default function ProgramsPage() {
  return (
    <>
      <BreadCrumb items={BreadCrumbItems}>
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="text-title font-semibold text-sm px-6 py-2 rounded-md bg-input"
          >
            تصدير البيانات
          </Link>
          <Link
            href="/programs/create"
            className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
          >
            انشاء برنامج جديد
          </Link>
        </div>
      </BreadCrumb>

      <AllPrograms />
    </>
  );
}
