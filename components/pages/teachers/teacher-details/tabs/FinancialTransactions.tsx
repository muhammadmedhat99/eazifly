"use client";

import { Options } from "@/components/global/Icons";
import TableComponent from "@/components/global/Table";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { fetchClient } from "@/lib/utils";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Loader } from "@/components/global/Loader";
import { useParams } from 'next/navigation';

const columns = [
    { name: "النوع", uid: "type" },
    { name: "تاريخ الطلب", uid: "created_at" },
    { name: "قيمة الطلب", uid: "amount" }, 
    { name: "طريقة الدفع", uid: "instructor_payment_method" }, 
    { name: "حالة الطلب", uid: "status" },
    { name: <Options />, uid: "actions" },
];

const OptionsComponent = () => {
      return (
        <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
          <DropdownTrigger>
            <button>
              <Options />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit">تعديل</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    };

export const FinancialTransactions = () => {
  const params = useParams();
  const teacher_id = params.id;
  const { data: teachersData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/withdrawal/request?instructor_id=${teacher_id}`, axios_config),
    queryKey: ["GetWithdrawalRequests", teacher_id],
  });

const formattedData =
  teachersData?.data?.map((item: any) => {
    let statusInfo = {};
    switch (item.status) {
      case "approved":
        statusInfo = { color: "success", name: "تم التحويل" };
        break;
      case "pending":
        statusInfo = { color: "warning", name: "جاري المراجعة" };
        break;
      case "rejected":
        statusInfo = { color: "danger", name: "ملغي" };
        break;
      default:
        statusInfo = { color: "default", name: "غير معروف" };
        break;
    }

    return {
      id: item.id,
      type: (
        <div className="flex flex-col items-center">
          <img src="/icons/arrow-right.svg" alt="icon" className="mb-1" />
          {item.type || "طلب تحويل"}
        </div>
      ),
     created_at: item.created_at 
  ? new Date(item.created_at).toISOString().slice(0, 16).replace('T', ' ') 
  : "N/A",
      amount: item.amount ? `${item.amount} ج.م` : "N/A",
      instructor_payment_method: item.instructor_payment_method || "N/A",
      status: statusInfo,
    };
  }) || [];
  
  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : formattedData && formattedData.length > 0 ? (
          <TableComponent
            columns={columns}
            data={formattedData}
            ActionsComponent={OptionsComponent}
          />
        ) : (
          <div className="text-sm text-gray-500 text-center">
            لا توجد معاملات مالية 
          </div>
        )
      }

    </>
  );
};
