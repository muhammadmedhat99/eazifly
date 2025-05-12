"use client";

import React from "react";

import Image from "next/image";

import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { ArrowLeft2 } from "iconsax-reactjs";

export const StudentsSubscriptionDetails = () => {
  return (
    <>
      <div className="p-8">
        <Accordion variant="splitted">
          <AccordionItem
            key="1"
            aria-label="بيانات الطالب"
            title="بيانات الطالب"
            classNames={{
              title: "font-bold text-black-text text-[15px]",
              base: "shadow-none border border-stroke",
            }}
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="py-5 grid grid-cols-5 gap-4">
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
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
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  البريد الإلكتروني
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  Ahmed.ali12@gmail.com
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  رقم الهاتف
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  +201004443303
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  تاريخ الإنشاء
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  12-4-2023
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  نوع الطلب
                </span>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary"></span>
                  <span className="text-primary font-bold text-[15px]">
                    تجديد الإشتراك
                  </span>
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="بيانات الطلب"
            title="بيانات الطلب"
            classNames={{
              title: "font-bold text-black-text text-[15px]",
              base: "shadow-none border border-stroke",
            }}
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="py-5 grid grid-cols-5 gap-4">
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  وسيلة الدفع
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  أنستا باي
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  خطة اللإشتراك
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  6 أشهر
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  مدة الحصة
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  30 دقيقة
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  عدد الحصص الأسبوعية
                </span>

                <span className="text-black-text font-bold text-[15px]">4</span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  قيمة الإشتراك
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-primary font-bold text-[15px]">
                    3500
                  </span>
                  <span className="text-primary font-bold text-[15px]">
                    ج.م
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-primary font-bold text-sm">
                  صورة التحويل
                </span>
                <div className="h-[337px] overflow-hidden rounded-lg">
                  <Image
                    src="/img/static/8d842570ac254505049a2bcf71f03b5af009cdba.png"
                    alt="bill image"
                    width={1024}
                    height={337}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="bg-stroke p-5 flex gap-3 flex-col">
        <div className="max-w-md">
          <Input
            type="text"
            label="أدخل قيمة التحويل يدوي"
            labelPlacement="outside"
            placeholder="نص الكتابة"
            endContent={<span className="text-black-text font-bold">ج.م</span>}
            classNames={{ label: "text-black-text font-semibold text-sm" }}
          />
        </div>

        <Textarea
          label="إضافة ملاحظة"
          labelPlacement="outside"
          placeholder="نص الكتابة"
          minRows={5}
          classNames={{ label: "text-black-text font-semibold text-sm" }}
        />

        <div className="flex items-center justify-end gap-3">
          <Button variant="solid" color="primary" className="text-white">
            رفض الطلب
          </Button>
          <Button variant="solid" color="primary" className="text-white">
            إرسال رسالة
          </Button>
          <Button variant="solid" color="primary" className="text-white">
            الموافقة علي الطلب
          </Button>
        </div>
      </div>
    </>
  );
};
