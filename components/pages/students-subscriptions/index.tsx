"use client";

import React, { useState } from "react";

import { useDebounce } from "@/lib/hooks/useDebounce";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { CustomPagination } from "@/components/global/Pagination";
import { Options } from "@/components/global/Icons";
import TableComponent from "@/components/global/Table";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import { formatDate } from "@/lib/helper";

const columns = [
  { name: "رقم الطلب", uid: "num" },
  { name: "إسم الطالب", uid: "name" },
  { name: "نوع الطلب", uid: "request_type" },
  { name: "نوع الإشتراك", uid: "type" },
  { name: "إسم البرنامج", uid: "courses" },
  { name: "قيمة الإشتراك", uid: "price" },
  { name: "تاريخ الطلب", uid: "created_at" },
  { name: "حالة الطلب", uid: "order_status" },
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
        <DropdownItem key="show" href={`/students/subscriptions/${id}`}>
          عرض الطلب
        </DropdownItem>
        <DropdownItem key="approve">موافقة</DropdownItem>
        <DropdownItem key="decline">رفض</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
        <DropdownItem key="send-message">إرسال رسالة</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export const AllStudentsSubscriptions = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const params = new URLSearchParams();

  if (debouncedSearch) {
    params.append("search", debouncedSearch);
  }
  if (selectedType) {
    params.append("type", selectedType);
  }
  if (selectedStatus) {
    params.append("status", selectedStatus);
  }

  const queryString = params.toString();

  const { data: studentsSubscriptions, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(
        `client/order?${queryString}`,
        axios_config
      ),
    queryKey: AllQueryKeys.GetAllStudentSubscriptions(
      debouncedSearch,
      selectedType,
      selectedStatus
    ),
  });

  const formattedData =
  studentsSubscriptions?.data
    ?.filter((item: any) => {
      if (selectedStatus === "approved") {
        return true;
      }
      return item.status?.key !== "approved";
    })
    .map((item: any) => ({
      id: item.id,
      num: item.id,
      name: `${item.first_name} ${item.last_name}`,
      request_type: {
        name: item?.type.label,
        color: item?.type.color === "primary" ? "primary" : "success",
      },
      type: item?.subscription_type || "N/A",
      courses: item.order_details[0]?.program || "N/A",
      price: `${item.total_after_discount} ${item.currency}`,
      created_at: formatDate(item?.created_at) || "N/A",
      order_status: {
        name: item.status.label || "N/A",
        color: item.status.color,
      },
      avatar: item.image || "N/A",
    })) || [];

  return (
    <div>
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
              <DropdownItem key="edit">رقم الهاتف</DropdownItem>
              <DropdownItem key="add-to-course">التقييم</DropdownItem>
              <DropdownItem key="change-password">
                تاريخ تجديد الإشتراك
              </DropdownItem>
              <DropdownItem key="send-mail">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button variant="flat" className="font-semibold" radius="sm">
                حالة مرسل الطلب
                <ArrowDown2 size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static type"
              onAction={(key) => setSelectedType(key as string)}
            >
              <DropdownItem key="new">جديد</DropdownItem>
              <DropdownItem key="renew">تجديد</DropdownItem>
              <DropdownItem key="upgrade">ترقية</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button variant="flat" className="font-semibold" radius="sm">
                حالة الطلب
                <ArrowDown2 size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(key) => setSelectedStatus(key as string)}
            >
              <DropdownItem key="approved">موافق عليه</DropdownItem>
              <DropdownItem key="new">جديد</DropdownItem>
              <DropdownItem key="canceled">ملغي</DropdownItem>
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
    </div>
  );
};
