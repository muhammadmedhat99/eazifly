import React from "react";
import Link from "next/link";

import { BreadCrumb } from "@/components/global/BreadCrumb";
import { AllReportQuestions } from "@/components/pages/settings/report-questions";

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
    name: "أسئلة التقارير",
  },
];

export default function page() {
  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
      <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/settings/report-questions/create"
            className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
          >
            أضافة سؤال  
          </Link>
        </div>
      </BreadCrumb>

      <AllReportQuestions />
    </div>
  );
}
