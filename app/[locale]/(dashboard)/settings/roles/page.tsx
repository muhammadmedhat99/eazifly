import React from "react";
import Link from "next/link";

import { BreadCrumb } from "@/components/global/BreadCrumb";
import { AllRoles } from "@/components/pages/settings/roles";

const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "الإعدادات",
    link: "/settings/general"
  },
  {
    id: 3,
    name: "إعدادات الوظائف",
  },
];

export default function page() {
  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
      <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/settings/roles/create"
            className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
          >
            أضافة وظيفة 
          </Link>
        </div>
      </BreadCrumb>

      <AllRoles />
    </div>
  );
}
