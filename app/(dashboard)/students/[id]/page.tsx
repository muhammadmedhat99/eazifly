import { BreadCrumb } from "@/components/global/BreadCrumb";
import { StudentDetails } from "@/components/pages/student-details";
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
    name: "الطلاب",
    link: "/students",
  },
  {
    id: 3,
    name: "بيانات الطلاب",
  },
];

export default function page() {
  return (
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <StudentDetails />
    </>
  );
}
