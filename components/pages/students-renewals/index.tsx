"use client";

import React, { useState } from "react";

import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { CustomPagination } from "@/components/global/Pagination";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { Loader } from "@/components/global/Loader";

import { formatDate } from "@/lib/helper";

const columns = [
  { name: "إسم الطالب", uid: "name" },
  { name: "بيانات التواصل", uid: "phone" },
  { name: "أخر موعد تواصل", uid: "last_contact" },
  { name: "قيمة التجديد", uid: "renewal_amount" },
  { name: "موعد التجديد", uid: "renewal_date" },
  { name: "متوسط أيام التجديد", uid: "avg_renewal_days" },
  { name: "حالة التجديد", uid: "status" },
  { name: <Options />, uid: "actions" },
];

const OptionsComponent = ({ id }: { id: number }) => {
  return (
    <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
      <DropdownTrigger>
        <button>
          <Options />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href={`/students/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
        <DropdownItem key="send-alert">إرسال تنبيه</DropdownItem>
        <DropdownItem key="send-message">إرسال رسالة</DropdownItem>
        <DropdownItem key="pause-user">إيقاف مؤقت</DropdownItem>
        <DropdownItem key="delete-user">حذف</DropdownItem>
        <DropdownItem key="extend-subscription">تمديد الإشتراك</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const Renewals = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState("1");

  const isLoading = false; 

  const formattedData = [
  {
    id: 1,
    name: "أحمد علي",
    avatar: null,
    phone: "01012345678",
    email: "ahmed@example.com",
    renewal_date: "بعد 3 يوم",
    last_contact: "2025-06-05",
    renewal_amount: "200",
    avg_renewal_days: "+ 3 يوم",
    status: {
      name: "سيتم التجديد",
      color: "success",
    },
  },
  {
    id: 2,
    name: "سارة محمد",
    avatar: null,
    phone: "01198765432",
    email: "sara@example.com",
    renewal_date: "12-2-2025",
    last_contact: "2025-06-07",
    renewal_amount: "150",
    avg_renewal_days: "-3 يوم",
    status: {
      name: "سيتم الإلغاء",
      color: "danger",
    },
  },
];

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative min-w-80">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1
                size="18"
                className="text-gray-400"
                variant="Outline"
              />
            </div>
            <input
              type="text"
              placeholder="بحث..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="primary"
                className="text-primary font-semibold gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                ترتيب حسب
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">الإسم</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="default"
                className="text-[#3D5066] font-bold text-sm gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                حالة الإشتراك 
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="default"
                className="text-[#3D5066] font-bold text-sm gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                البرنامج
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="default"
                className="text-[#3D5066] font-bold text-sm gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                حالة التجديد
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <TableComponent
          columns={columns}
          data={formattedData}
          ActionsComponent={OptionsComponent}
        />
      )}

      <div className="my-10 px-6">
        <CustomPagination />
      </div>
    </>
  );
};
