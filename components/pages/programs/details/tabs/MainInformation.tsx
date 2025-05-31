"use client";

import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from "@heroui/react";
import { Copy } from "iconsax-reactjs";
import React from "react";

type MainInformationProps = {
  mainData: {
    id: number;
    title: string;
    label: string;
    category: string;
    content: string;
    description: string;
    image: string;
    duration: string;
    goals: string;
    number_of_students: number;
    number_of_lessons: number;
    payment_methods: {
      id: number;
      title: string;
    }[];
  };
};

export const MainInformation = ({ mainData }: MainInformationProps) => {
  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      addToast({ title: "Copied to clipboard!", color: "success" });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">إسم البرنامج</div>
        <div className="text-black-text font-bold text-[15px]">
          {mainData.title}
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">عدد ساعات البرنامج</div>
        <div className="text-black-text font-bold text-[15px] flex items-center justify-between">
          <span>24</span>
          <span>ساعة</span>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">سعر الساعة</div>
        <div className="text-black-text font-bold text-[15px] flex items-center justify-between">
          <span>120</span>
          <span>ج.م</span>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">عدد الحصص</div>
        <div className="text-black-text font-bold text-[15px] flex items-center justify-between">
          <span>{mainData?.number_of_lessons}</span>
          <span>حصة</span>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">الطلاب المشتركين</div>
        <div className="text-black-text font-bold text-[15px] flex items-center justify-between">
          <span>{mainData.number_of_students}</span>
          <span>طالب</span>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">حالة البرنامج</div>
        <div className="text-success font-bold text-[15px]">
          <span className="bg-success size-2 rounded-full inline-block me-1.5" />
          <span>جاري</span>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">المواد العلمية</div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-primary/10 py-2 px-4 rounded-xl text-primary font-bold text-sm">
            {mainData.category}
          </div>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">وسائل الدفع</div>
        <div className="flex items-center gap-3 flex-wrap">
          {mainData.payment_methods.map((method) => (
            <div
              className="bg-primary/10 py-2 px-4 rounded-xl text-primary font-bold text-sm"
              key={method.id}
            >
              {method.title}
            </div>
          ))}
        </div>
      </div>
      {/* Main Card  */}

      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2 lg:col-span-2">
        <div className="text-primary font-bold">انواع الدفع</div>

        <Table
          aria-label="Example static collection table"
          classNames={{
            wrapper: "shadow-none px-0",
            th: "bg-white text-primary text-md",
            tr: "border-b border-b-stroke h-20",
          }}
        >
          <TableHeader>
            <TableColumn>
              <span></span>
            </TableColumn>
            <TableColumn>الرابط</TableColumn>
            <TableColumn>نوع الدفع</TableColumn>
            <TableColumn>إظهار نوع الدفع</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell className="font-bold text-primary">
                صفحة الدفع الرئيسة
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">www.medium.com</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => handleCopy("www.medium.com")}
                  >
                    <Copy className="text-primary" variant="Bold" />
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold text-sm">عادي</TableCell>
              <TableCell>
                <Switch
                  defaultSelected
                  aria-label="Automatic updates"
                  color="success"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
