"use client";

import { Options } from "@/components/global/Icons";
import TableComponent from "@/components/global/Table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

const columns = [
  { name: "نوع الإشتراك", uid: "subscription_type" },
  { name: "سعر الإشتراك", uid: "subscription_price" },
  { name: "عدد الحصص", uid: "number_of_lessons" },
  { name: "مدة المحاضرة", uid: "lesson_duration" },
  { name: "نسبة الربح", uid: "profit" },
  { name: "نسبة التخفيض", uid: "discount" },
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
        <DropdownItem href={`/teachers/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
        <DropdownItem key="actions">الإجراءات</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
        <DropdownItem key="add-to-course">تعيين علي برنامج</DropdownItem>
        <DropdownItem key="send-mail">إرسال رسالة</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const data = [
  {
    id: 1,
    subscription_type: "شهري",
    subscription_price: "1200  ج.م",
    number_of_lessons: "42",
    lesson_duration: "30  دقيقة",
    profit: "20%",
    discount: "20%",
  },
  {
    id: 2,
    subscription_type: "3 أشهر",
    subscription_price: "1400  ج.م",
    number_of_lessons: "39",
    lesson_duration: "45  دقيقة",
    profit: "20%",
    discount: "20%",
  },
  {
    id: 3,
    subscription_type: "6 أشهر",
    subscription_price: "1400  ج.م",
    number_of_lessons: "34",
    lesson_duration: "45  دقيقة",
    profit: "10%",
    discount: "20%",
  },
];

export const ProgramSubscriptions = () => {
  return (
    <div className="-mx-1 bg-main">
      <TableComponent
        columns={columns}
        data={data}
        ActionsComponent={OptionsComponent}
      />
    </div>
  );
};
