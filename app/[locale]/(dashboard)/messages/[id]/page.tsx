import { BreadCrumb } from "@/components/global/BreadCrumb";
import { Chat } from "@/components/pages/messages/chat";
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

      <Chat />
    </>
  );
}
