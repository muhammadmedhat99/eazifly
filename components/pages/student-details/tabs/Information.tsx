"use client";
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";

import { Avatar, Button } from "@heroui/react";
export const Information = () => {
  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الإسم</span>
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />

            <span className="text-black-text font-bold text-[15px]">
              عبدالرحمن محمود الجندي
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
            Ahmed.ali12@gmail.com
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
            12-4-2023
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
            +201004443303
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
          <div className="text-success bg-success/10 px-5 py-1 rounded-3xl font-bold text-[15px]">
            نشط
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
