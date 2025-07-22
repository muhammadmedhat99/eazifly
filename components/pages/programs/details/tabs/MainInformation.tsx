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
import PaymentMethodsUpdateModal from "./PaymentMethodsUpdateModal";
import { Loader } from "@/components/global/Loader";

type MainInformationProps = {
  data: {
    id: number;
    title: string;
    label: string;
    specialization: string;
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
    host: {
      id: number;
      title: string;
    };
    status: {
      label: string;
      key: string;
      color: string;
    };
  };
};

export const MainInformation = ({ data }: MainInformationProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      addToast({ title: "Copied to clipboard!", color: "success" });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
    {Object.keys(data || {}).length > 0 ? (
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PaymentMethodsUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={data}
      /> 
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">إسم البرنامج</div>
        <div className="text-black-text font-bold text-[15px]">
          {data.title}
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">الحالة</div>
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
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">عنوان البرنامج</div>
        <div className="text-black-text font-bold text-[15px]">
          {data.label}
        </div>
      </div>
      {/* Main Card  */}

      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">التخصص</div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-primary/10 py-2 px-4 rounded-xl text-primary font-bold text-sm">
            {data.specialization}
          </div>
        </div>
      </div>
      {/* Main Card  */}
      {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-primary font-bold">وسائل الدفع</div>
          <div className="flex items-center gap-3 flex-wrap">
            {data.payment_methods.map((method) => (
              <div
                className="bg-primary/10 py-2 px-4 rounded-xl text-primary font-bold text-sm"
                key={method.id}
              >
                {method.title}
              </div>
            ))}
          </div>
        </div>
        <Button
          onPress={()=>setModalOpen(true)}
          className="flex items-center gap-1 text-primary bg-transparent hover:bg-transparent active:bg-transparent shadow-none border-none"
        >
          <Edit2 size={18} />
          <span className="text-sm font-bold">تعديل</span>
        </Button>
      </div>
      {/* Main Card  */}
       {/* Main Card  */}
      <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
        <div className="text-primary font-bold">الاستضافة</div>
        {data?.host && <div
          className="bg-primary/10 py-2 px-4 rounded-xl text-primary font-bold text-sm w-fit"
          key={data?.host?.id}
        >
          {data?.host?.title}
        </div>}
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
    ) : <Loader/>}
    </>
  );
};
