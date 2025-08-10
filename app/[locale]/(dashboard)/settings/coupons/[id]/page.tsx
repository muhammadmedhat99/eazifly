import { BreadCrumb } from "@/components/global/BreadCrumb";
import { CouponsDetails } from "@/components/pages/settings/coupons/coupons-details";
import { fetchData } from "@/lib/utils";
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

  const couponsData = (await fetchData(`client/coupon/show/${id}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "كوبونات الخصم",
      link: "/settings/coupons",
    },
    {
      id: 3,
      name: "كوبون الخصم",
    },
    {
      id: 4,
      name:
        `${couponsData?.data?.code}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <CouponsDetails data={couponsData} />
    </>
  );
}
