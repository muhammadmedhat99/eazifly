import { formatDate } from "@/lib/helper";
import { Avatar } from "@heroui/react";
import React from "react";

type StudentDetailsProps = {
  studentInfo: {
    id: number;
    user_image: string,
    subscripe_date: string;
    subscription_status: {
      status: string;
      color: string;
    };
    user_id: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    total_sessions: number;
    total_children: number;
    user_whats_app: string;
    program_name: string;
    last_contact_date: string;
    last_contact_days: number;
    subscriped_price: string;
    expire_date: string;
    days_to_expire: string;
    average_renewal_days: number;
    plan_price: string;
    renewal_status: {
      status: string;
      color: string;
    };
    status_label: {
      label: string;
      color: string;
    };
  };
};

export const PersonalInfo = ({studentInfo} : StudentDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">إسم الطالب</span>
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              showFallback
              name={studentInfo.user_name}
              src={studentInfo.user_image}
            />

            <span className="text-black-text font-bold text-[15px]">
              {studentInfo.user_name}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">البريد الإلكتروني</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.user_email}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">رقم الهاتف</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.user_phone}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">تاريخ الإلتحاق</span>
          <span className="text-black-text font-bold text-[15px]">
            {formatDate(studentInfo.subscripe_date)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">قيمة التجديد</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.plan_price}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">حالة الطالب</span>
          <div
            className={`
                text-${studentInfo?.status_label?.color} 
                bg-${studentInfo?.status_label?.color} bg-opacity-10
                px-5 py-1 rounded-3xl font-bold text-[15px]
            `}
            >
            {studentInfo?.status_label?.label || "نشط"}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">إجمالي حصص الطالب</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.total_sessions}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الطلاب التابعين</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.total_children} طالب
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">أخر موعد تم التواصل فية مع الطالب</span>
          <div className="flex justify-between">
            <span className="text-black-text font-bold text-[15px]">
              {studentInfo.last_contact_date
                ? formatDate(studentInfo.last_contact_date)
                : null}
          </span>
          <span className="text-black-text font-bold text-[15px]">
            منذ {studentInfo.last_contact_days} يوم
          </span>
          </div>
        </div>
      </div>
    </div>
  );
};
