"use client";

import { Options } from "@/components/global/Icons";
import TableComponent from "@/components/global/Table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
} from "@heroui/react";

const plansColumns = [
  { name: "خطة الاشتراك", uid: "subscription_plan" },
  { name: "سعر الاشتراك", uid: "price" },
  { name: "سعر البيع", uid: "discount_price" },
  { name: "عدد الحصص", uid: "number_of_session_per_week" },
  { name: "مدة المحاضرة", uid: "duration" },
  { name: "نوع الاشتراك", uid: "type" },
  { name: "الباقة المميزة", uid: "is_special_plan" },
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

type subscription = {
  id: number;
  title: string | null;
  program: string;
  label: string | null;
  description: string | null;
  currency: string | null;
  price: string;
  discount_price: string;
  subscripe_days: string;
  duration: string;
  number_of_session_per_week: string;
  is_special_plan: boolean;
  type: string;
  plan_title: string | null;
  subscription_plan: string;
};
type subscriptionsProps = {
  subscriptionsData: subscription[];
};

export const ProgramSubscriptions = ({ subscriptionsData }: subscriptionsProps) => {
  const plansTableData = subscriptionsData?.map((item: any) => ({
    id: item.id,
    type: item.type,
    discount_price: item.discount_price + " ج.م",
    price: item.price + " ج.م",
    number_of_session_per_week: item.number_of_session_per_week,
    duration: item.duration + "دقيقة",
    subscription_plan: item.subscription_plan,
    is_special_plan: item.is_special_plan ? (<Switch
      isSelected={true}
      color="success"
    />) : (<Switch
      isSelected={false}
      color="success"
    />),
  }));
  return (
    <div className="bg-main">
      <TableComponent
        columns={plansColumns}
        data={plansTableData}
        ActionsComponent={OptionsComponent}
      />
    </div>
  );
};
