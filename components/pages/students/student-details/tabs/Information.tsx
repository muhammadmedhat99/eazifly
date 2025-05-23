"use client";
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";

import { Avatar, Button } from "@heroui/react";
import { formatDate } from "@/lib/helper";
type StudentDetailsProps = {
  data: {
    data: {
      id: number;
      first_name: string;
      last_name: string;
      user_name: string;
      email: string;
      phone: string;
      whats_app: string;
      image: string;
      created_at: string;
      status_label: {
        label: string;
        color: string;
      };
    };
  };
};
export const Information = ({ data }: StudentDetailsProps) => {
  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الإسم</span>
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              showFallback
              name={data?.data?.first_name + " " + data?.data?.last_name}
              src={data?.data?.image}
            />

            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.first_name + " " + data?.data?.last_name}
            </span>
          </div>
        </div>
        <Link href="#" className="flex items-center gap-1">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Link>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            البريد الإلكتروني
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.email}
          </span>
        </div>
        <Link href="#" className="flex items-center gap-1">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Link>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تاريخ الإنشاء
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {formatDate(data?.data?.created_at)}
          </span>
        </div>
        <Link href="#" className="flex items-center gap-1">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Link>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">رقم الهاتف</span>
          <span className="text-black-text font-bold text-[15px]">
            {data?.data?.phone}
          </span>
        </div>
        <Link href="#" className="flex items-center gap-1">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Link>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الحالة</span>
          <div
            className={`text-${data?.data?.status_label?.color === "info" ? "warning" : data?.data?.status_label?.color} 
            bg-${data?.data?.status_label?.color === "info" ? "warning" : data?.data?.status_label?.color} bg-opacity-10
              px-5 py-1 rounded-3xl font-bold text-[15px]`}
          >
            {data?.data?.status_label?.label}
          </div>
        </div>
        <Link href="#" className="flex items-center gap-1">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Link>
      </div>

      <div className="flex items-end justify-end">
        <Button color="primary" variant="solid" className="text-white">
          إرسال رسالة
        </Button>
      </div>
    </div>
  );
};
