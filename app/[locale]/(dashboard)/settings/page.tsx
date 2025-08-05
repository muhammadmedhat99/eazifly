import React from "react";
import Link from "next/link";

import { BreadCrumb } from "@/components/global/BreadCrumb";
import { Settings } from "@/components/pages/settings";

const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "الإعدادات",
    link: "/settings"
  },
];

export default function page() {
  return (
    <div>
      <BreadCrumb items={BreadCrumbItems}>
      </BreadCrumb>

      <Settings />
    </div>
  );
}
