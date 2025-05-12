import { BreadCrumb } from "@/components/global/BreadCrumb";
import { StudentsSubscriptionDetails } from "@/components/pages/students-subscriptions-details";
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

export default function page() {
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

      <StudentsSubscriptionDetails />
    </>
  );
}
