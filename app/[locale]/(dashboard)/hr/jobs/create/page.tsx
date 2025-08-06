import { BreadCrumb } from "@/components/global/BreadCrumb";
import { CreateJob } from "@/components/pages/hr/jobs/create";
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
    name: "الموارد البشرية",
  },
  {
    id: 3,
    name: "الوظائف",
    link: "/hr/jobs",
  },
  {
    id: 4,
    name: "إعلان وظيفة جديدة",
    link: "/hr/jobs/create",
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
      <CreateJob />
    </div>
  );
}
