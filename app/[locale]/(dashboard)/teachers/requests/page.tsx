import { BreadCrumb } from "@/components/global/BreadCrumb";
import { TeacherRequests } from "@/components/pages/teachers/requests";
import { TeacherDetails } from "@/components/pages/teachers/teacher-details";
import { fetchData } from "@/lib/utils";
import { cookies } from "next/headers";
import React from "react";

export default async function page() {

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "المعلمين",
      link: "/teachers",
    },
    {
      id: 3,
      name: "طلبات المعلمين",
    },
  ];
  return (
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <TeacherRequests />
    </>
  );
}
