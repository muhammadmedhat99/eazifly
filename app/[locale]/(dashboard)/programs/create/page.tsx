import { BreadCrumb } from "@/components/global/BreadCrumb";
import { CreateProgram } from "@/components/pages/programs/create";
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
    name: "إنشاء برنامج جديد",
  },
];
export default function page() {
  return (
    <div>
      <BreadCrumb items={BreadCrumbItems} />

      <CreateProgram />
    </div>
  );
}
