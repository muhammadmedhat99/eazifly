import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ProgramDetails } from "@/components/pages/programs/details";
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
    link: "/programs",
  },
  {
    id: 3,
    name: "تفاصيل البرنامج",
  },
];

export default function page() {
  return (
    <>
      <BreadCrumb items={BreadCrumbItems}>
        <div className="flex items-center gap-2">
          <Link
            href="/programs/create"
            className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
          >
            انشاء برنامج جديد
          </Link>
        </div>
      </BreadCrumb>

      <ProgramDetails />
    </>
  );
}
