import { BreadCrumb } from "@/components/global/BreadCrumb";
import { Messages } from "@/components/pages/messages";
import React from "react";
const BreadCrumbItems = [
  {
    id: 1,
    name: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    name: "الرسائل",
  },
];
export default function page() {
  return (
    <>
      <BreadCrumb items={BreadCrumbItems}>
      </BreadCrumb>

      <Messages />
    </>
  );
}
