import { BreadCrumb } from "@/components/global/BreadCrumb";
import { StudentsSubscriptionDetails } from "@/components/pages/students-subscriptions-details";
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
    name: "الطلاب",
    link: "/students",
  },
  {
    id: 3,
    name: "طلبات الإشتراك",
    link: "/students/subscriptions",
  },
  {
    id: 4,
    name: "بيانات طلب الإشتراك",
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
  const data = await fetchData(`client/order/show/${id}`, token?.value);
  const client_id = cookieStore.get("client_id");
  
  return (
    <>
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

      <StudentsSubscriptionDetails data={data} client_id={ Number(client_id?.value)}/>
    </>
  );
}
