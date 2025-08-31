"use client";

import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from "@heroui/react";
import { Copy, Edit2 } from "iconsax-reactjs";
import React, { useState } from "react";
import { Loader } from "@/components/global/Loader";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MainInformationProps = {
  data: {
    id: number;
    instructor: string;
    instructor_image: string;
    instructor_id: string; // أو number لو API بيرجع رقم
    users: {
      id: number;
      user_name: string;
      user_image: string;
    }[];
    meeting_url: string;
    day: string;
    session_date: string; 
    session_time: string;
    session_time_to: string;
    session_datetime: string; 
    duration: string;
    student_join_time: string | null;
    instructor_join_time: string | null;
    program_title: string;
    program_id: string;
    status: {
      label: string;
      key: string;
      color: string;
    };
  };
  refetch: () => void; 
};


export const MainInformation = ({ data, refetch }: MainInformationProps) => {

  return (
    <>
      {Object.keys(data || {}) ? (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">الطالب</div>
            <div className="text-black-text font-bold text-[15px]">
                {data?.users[0]?.user_name}
            </div>
          </div>

          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">المعلم</div>
            <div className="text-black-text font-bold text-[15px]">
              {data?.instructor}
            </div>
          </div>
          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">تاريخ الحصة</div>
            <div className="text-black-text font-bold text-[15px]">
              {data?.session_date}
            </div>
          </div>
          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">وقت الحصة</div>
            <div className="text-black-text font-bold text-[15px]">
                من {data?.session_time} إلى {data?.session_time_to}
            </div>
          </div>
          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">البرنامج التابع للحصة</div>
            <div className="text-black-text font-bold text-[15px]">
                {data?.program_title}
            </div>
          </div>

          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="text-[#5E5E5E] text-sm font-bold">الحالة</div>
              <div className="w-fit">
                <div
                  className={`text-${data?.status?.color}
                bg-${data?.status?.color} bg-opacity-10
                px-5 py-1 rounded-3xl font-bold text-[15px]`}
                >
                  {data?.status?.label}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">موعد تجديد الطالب</div>
            <div className="text-black-text font-bold text-[15px]">
                {''}
            </div>
          </div>
          <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
            <div className="text-[#5E5E5E] text-sm font-bold">رابط الحصة</div>
            <div className="text-black-text font-bold text-[15px]">
                {''}
            </div>
          </div>
        </div>
      ) : <Loader />}
    </>
  );
};
