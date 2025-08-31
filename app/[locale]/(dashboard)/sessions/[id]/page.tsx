import { BreadCrumb } from "@/components/global/BreadCrumb";
import { SessionDetails } from "@/components/pages/sessions/session-details";
import { fetchData } from "@/lib/utils";
import { cookies } from "next/headers";
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
    name: "الحصص",
    link: "/sessions",
  },
  {
    id: 3,
    name: "تفاصيل الحصة",
  },
];

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const data = await fetchData(`client/session/show/${id}`, token?.value);
  return (
    <>
      <BreadCrumb items={BreadCrumbItems}>
      </BreadCrumb>

      <SessionDetails/>
    </>
  );
}
