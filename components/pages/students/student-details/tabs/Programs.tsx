import { Options } from "@/components/global/Icons";
import { Avatar, Card, CardBody, Progress, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import React from "react";

export const Programs = () => {
  return (
    <div className="bg-main border border-stroke rounded-lg p-5">
      <div className="grid grid-cols-4 gap-2 mb-10">
        <div className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke">
          <div className="flex flex-col gap-4">
            <span className="text-primary text-sm font-bold">إسم البرنامج</span>
            <div className="text-black-text font-bold text-[15px]">
              برنامج مادة الرياضيات للصف السادس
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between bg-background p-5 rounded-2xl border border-stroke">
          <div className="flex flex-col gap-4">
            <span className="text-primary text-sm font-bold">سعر الإشتراك</span>
            <div className="text-black-text font-bold text-[15px]">2000</div>
          </div>
          <Link href="#" className="flex items-center gap-1">
            <span className="text-sm font-bold text-black-text">ج.م</span>
          </Link>
        </div>
        <div className="flex items-center justify-between p-5 rounded-2xl border border-stroke bg-background col-span-2">
          <div className="flex flex-col gap-4">
            <span className="text-primary text-sm font-bold">الإسم</span>
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
            <span className="text-sm font-bold text-primary">تغير المعلم</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center flex-col">
        <Tabs
          aria-label="sub-tabs"
          classNames={{
            cursor: "bg-primary",
            tabContent:
              "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
            tabList: "bg-[#EAF0FD]",
          }}
        >
          <Tab
            key="subscription-details"
            title="تفاصيل الإشتراك و التجديد"
            className="w-full"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex-1">
                <Progress
                  className="min-w-96 w-full"
                  label="متبقي 30 يوم علي تجديد الإشتراك"
                  value={55}
                  classNames={{
                    label: "text-sm font-semibold text-black-text",
                    track: "bg-primary/30",
                  }}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm font-semibold text-title">
                    تاريخ الإشتراك
                    <br />
                    12-4-2025
                  </div>

                  <div className="flex gap-4">
                    <div className="text-sm font-semibold text-title text-center">
                      عدد الحصص الفائتة
                      <br />
                      <span className="text-primary">4</span>
                    </div>
                    <div className="text-sm font-semibold text-title text-center">
                      عدد الحصص المكتملة
                      <br />
                      <span className="text-primary">20 / 16</span>
                    </div>
                    <div className="text-sm font-semibold text-title text-center">
                      عدد الطلاب
                      <br />
                      <span className="text-primary">1 / 4</span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-title">
                    تاريخ الإنتهاء
                    <br />
                    12-4-2026
                  </div>
                </div>
              </div>
              <Options />
            </div>
          </Tab>
          <Tab key="reports" title="التقارير" className="w-full">
            <div className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke mb-3">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-black-text text-sm font-bold">
                    إسم البرنامج
                  </span>
                  <span className="text-black-text text-sm font-bold">
                    12-4-2026
                  </span>
                </div>
                <div className="text-title font-bold text-sm">
                  مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال
                  النص. مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من
                  خلال النص.
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke mb-3">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-black-text text-sm font-bold">
                    إسم البرنامج
                  </span>
                  <span className="text-black-text text-sm font-bold">
                    12-4-2026
                  </span>
                </div>
                <div className="text-title font-bold text-sm">
                  مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال
                  النص. مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من
                  خلال النص.
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
