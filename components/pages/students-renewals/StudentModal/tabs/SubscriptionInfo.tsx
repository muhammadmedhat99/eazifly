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
    total_sessions: {
      finished: number;
      missed: number;
      canceled: number;
      all_sessions: number;
    };
    total_children: number;
    user_whats_app: string;
    program_name: string;
    last_contact_date: string;
    last_contact_days: number;
    subscriped_price: string;
    expire_date: string;
    days_to_expire: string;
    average_renewal_days: number;
    renewal_amount: string;
    renewal_status: {
      status: string;
      color: string;
    };
    status_label: {
      label: string;
      color: string;
    };
    plan: string;
    subscription_type: string;
    student_number: string;
    subscripe_days: {
      title: string;
    };
    duration: string;
  };
};

export const SubscriptionInfo = ({studentInfo} : StudentDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">خطة الإشتراك</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.subscripe_days.title}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">نوع الإشتراك</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.subscription_type}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">عدد الأفراد</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.student_number}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">إسم البرنامج</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.program_name}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">عدد الحصص</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.total_sessions.all_sessions}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">مدة الحصة</span>
          <span className="text-black-text font-bold text-[15px]">
            {studentInfo.duration} دقيقة
          </span>
        </div>
      </div>

    </div>
  );
};
