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
  { name: "إسم المعلم", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكتروني", uid: "email" },
  { name: "عدد الطلاب المشتركين", uid: "teacher_students" },
  { name: "سعر الساعة", uid: "hour_rate" },
  { name: "الحالة", uid: "status" },
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
        <DropdownItem key="actions">تعديل السعر</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const data = [
  {
    id: 1,
    name: "أحمد علي",
    created_at: "12-2-2025",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    phone: "+201004443303",
    email: "Ahmed.ali12@gmail.com",
    teacher_students: "16 طالب",
    hour_rate: "120   ج.م",
    status: { name: "نشط", color: "success" },
  },
  {
    id: 2,
    name: "محمد علي",
    created_at: "12-2-2025",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    phone: "+201004443303",
    email: "Ahmed.ali12@gmail.com",
    teacher_students: "16 طالب",
    hour_rate: "120   ج.م",
    status: { name: "نشط", color: "success" },
  },
];

export const ProgramTeachers = () => {
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
