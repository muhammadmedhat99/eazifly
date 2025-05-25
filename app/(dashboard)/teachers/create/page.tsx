import { CreateTeacher } from "@/components/pages/teachers/create";
import { BreadCrumb } from "@/components/global/BreadCrumb";
import React from "react";
import Link from "next/link";

const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "المعلمين",
    link: "/teachers"
  },
  {
    id: 3,
    name: "إضافة معلم جديد",
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
        </div>
      </BreadCrumb>
      <CreateTeacher />
    </div>
  );
}
