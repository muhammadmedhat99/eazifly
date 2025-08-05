import { BreadCrumb } from "@/components/global/BreadCrumb";
import { ProgramDetails } from "@/components/pages/programs/details";
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
    name: "البرامج",
    link: "/programs",
  },
  {
    id: 3,
    name: "تفاصيل البرنامج",
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
  const data = await fetchData(`client/program/show/${id}`, token?.value);
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
          <Link
            href={`/programs/update/${id}`}
            className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
          >
            تعديل البيانات
          </Link>
        </div>
      </BreadCrumb>

      <ProgramDetails />
    </>
  );
}
