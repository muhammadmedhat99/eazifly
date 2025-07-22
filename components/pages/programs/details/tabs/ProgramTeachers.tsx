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
  { name: "", uid: "avatar" },
  { name: "الاسم", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكترونى", uid: "email" },
  { name: "تاريخ التقديم", uid: "created_at" },
  { name: "التخصص", uid: "specializations" },
  { name: "سعر الساعة", uid: "amount_per_hour" },
  { name: "الحالة", uid: "status" },
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

type Instructor = {
  id: number;
  name_en: string;
  name_ar: string;
  phone: string;
  status: string;
  email: string;
  whats_app: string;
  created_at: string;
  address: string;
  age: string;
  experience_years: string;
  gender: string;
  can_approve_question: string;
  image: string;
  specializations: any[];
  instructor_payment_method_id: number;
  amount_per_hour: string;
};
type InstructorsProps = {
  teachersData: Instructor[];
};

export const ProgramTeachers = ({ teachersData }: InstructorsProps) => {

  const tableData = teachersData?.map((item: any) => ({
    id: item.id,
    avatar: item.image,
    name: item.name_ar || item.name_en,
    phone: item.phone,
    email: item.email,
    amount_per_hour: item.amount_per_hour,
    created_at: new Date(item.created_at).toLocaleDateString("ar-EG"),
    specializations:
        item.specializations?.length > 0
          ? `${item.specializations[0]?.title}${item.specializations.length > 1 ? ` (+${item.specializations.length})` : ""}`
          : "N/A",
    status: {
      name: item.status.label || "N/A",
      color: item?.status?.color ,
    },
  }));

  return (
    <div className="bg-main">
      <TableComponent
        columns={columns}
        data={tableData}
        ActionsComponent={OptionsComponent}
      />
    </div>
  );
};
