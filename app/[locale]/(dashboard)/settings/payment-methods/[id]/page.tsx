import { BreadCrumb } from "@/components/global/BreadCrumb";
import { PaymentMethodDetails } from "@/components/pages/settings/payment-methods/details";
import { fetchData } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const PaymentMethodData = (await fetchData(`client/payment/method/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "وسائل الدفع",
      link: "/settings/payment-methods",
    },
    {
      id: 3,
      name: "بيانات وسيلة الدفع",
    },
    {
      id: 4,
      name:
        `${PaymentMethodData?.data?.title_ar}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <PaymentMethodDetails data={PaymentMethodData} />
    </>
  );
}
