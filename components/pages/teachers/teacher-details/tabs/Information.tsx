"use client";
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";

import { Avatar, Button } from "@heroui/react";
import WeeklyWorkingHours from "./WeeklyWorkingHours";
type TeacherDetailsProps = {
  data: {
   data: {
      id: number;
      name_en: string;
      name_ar: string;
      phone: string;
      whats_app: string;
      address: string;
      age: string;
      gender: string;
      can_approve_question: string;
      image: string;
      instructor_payment_method_id: number;
      status_label: {
        label: string;
        color: string;
      };
      specializations: {
        id: number;
        title: string;
      }[];
    };
  };
};
export const Information = ({ data }: TeacherDetailsProps) => {
  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الإسم بالعربية</span>
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              showFallback
              name={data?.data?.name_ar}
              src={data?.data?.image}
            />

            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.name_ar}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الإسم بالإنجليزية</span>
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              showFallback
              name={data?.data?.name_en}
              src={data?.data?.image}
            />

            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.name_en}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">رقم الهاتف</span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.phone}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">رقم الواتس آب</span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.whats_app}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">العنوان</span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.address}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">العمر</span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.age}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الجنس</span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.gender}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الحالة</span>
          <div
            className={`
                text-${data?.data?.status_label?.color === "info" 
                ? "warning" 
                : data?.data?.status_label?.color || "primary"} 
                bg-${data?.data?.status_label?.color === "info" 
                ? "warning" 
                : data?.data?.status_label?.color || "primary"} bg-opacity-10
                px-5 py-1 rounded-3xl font-bold text-[15px]
            `}
            >
            {data?.data?.status_label?.label || "نشط"}
          </div>
        </div>
        <Link href="#" className="flex items-center gap-1">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Link>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
            <span className="text-[#5E5E5E] text-sm font-bold text-primary">
            التخصصات
            </span>
            <span className="text-black-text font-bold text-[15px]">
            {data?.data?.specializations?.map((specialization) => specialization.title).join("، ") || "لا يوجد تخصصات"}
            </span>
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">مواعيد العمل</span>
          <WeeklyWorkingHours/>
        </div>
      </div>

    </div>
  );
};
