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

const columns = [
  { name: "رقم الطلب", uid: "num" },
  { name: "إسم الطالب", uid: "name" },
  { name: "حالة  مرسل الطلب", uid: "subscription_status" },
  { name: "نوع الإشتراك", uid: "type" },
  { name: "إسم البرنامج", uid: "courses" },
  { name: "قيمة الإشتراك", uid: "price" },
  { name: "تاريخ الطلب", uid: "date" },
  { name: "حالة الطلب", uid: "order_status" },
  { name: <Options />, uid: "actions" },
];

const data = [
  {
    id: 1,
    num: "37676",
    name: "أحمد علي",
    subscription_status: { name: "جديد", color: "success" },
    type: "فردي",
    courses: "برنامج مادة الرياضيات للصف السادس",
    price: "450",
    date: "12-2-2025",
    order_status: { name: "جديد", color: "success" },
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    num: "87826",
    name: "خالد تركي",
    subscription_status: { name: "تجديد الإشتراك", color: "primary" },
    type: "عائلي",
    courses: "برنامج مادة الرياضيات للصف السادس",
    price: "450",
    date: "12-2-2025",
    order_status: { name: "معلق", color: "warning" },
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
  },
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
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">جديد</DropdownItem>
              <DropdownItem key="edit">تجديد الإشتراك</DropdownItem>
              <DropdownItem key="add-to-course">إلغاء الإشتراك</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button variant="flat" className="font-semibold" radius="sm">
                حالة الطلب
                <ArrowDown2 size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">جديد</DropdownItem>
              <DropdownItem key="edit">معلق</DropdownItem>
              <DropdownItem key="add-to-course">تم الإشتراك</DropdownItem>
              <DropdownItem key="change-password">مرفوض</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <TableComponent
        columns={columns}
        data={data}
        ActionsComponent={OptionsComponent}
      />

      <div className="my-10 px-6">
        <CustomPagination />
      </div>
    </div>
  );
};
