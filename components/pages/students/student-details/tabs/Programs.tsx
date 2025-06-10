import { Options } from "@/components/global/Icons";
import { Avatar, Card, CardBody, Progress, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import React from "react";

type StudentDetailsProps = {
  subscriptionsData: {
    data: {
      id: number;
      program_id: number;
      program: string;
      price: number;
      instructor: {
        name: string;
        image: string;
      },
      DaysToExpire: number;
      subscription_date: string;
      expire_date: string;
      student_number: number;
      missed_sessions: number;
      completed_sessions: number;
    }[];
  }
};

export const Programs = ({ subscriptionsData }: StudentDetailsProps) => {
  return (
  <div className="grid grid-cols-1 gap-8">
    {subscriptionsData?.data?.map((subscription, index) => {
      const subscriptionDate = subscription.subscription_date;
      const expireDate = subscription.expire_date;
      const daysToExpire = subscription.DaysToExpire;

      let progressValue = 0;

      if (subscriptionDate && expireDate && daysToExpire !== undefined) {
        const start = new Date(subscriptionDate);
        const end = new Date(expireDate);

        const totalMs = end.getTime() - start.getTime();
        const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));

        const usedDays = totalDays - daysToExpire;
        progressValue = Math.round((usedDays / totalDays) * 100);
      }

      return (
        <div key={index} className="bg-main border border-stroke rounded-lg p-5">
          <div className="grid grid-cols-4 gap-2 mb-10">
            <div className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke">
              <div className="flex flex-col gap-4">
                <span className="text-primary text-sm font-bold">إسم البرنامج</span>
                <div className="text-black-text font-bold text-[15px]">
                  {subscription.program}
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between bg-background p-5 rounded-2xl border border-stroke">
              <div className="flex flex-col gap-4">
                <span className="text-primary text-sm font-bold">سعر الإشتراك</span>
                <div className="text-black-text font-bold text-[15px]">{subscription.price}</div>
              </div>
              <Link href="#" className="flex items-center gap-1">
                <span className="text-sm font-bold text-black-text">ج.م</span>
              </Link>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl border border-stroke bg-background col-span-2">
              <div className="flex flex-col gap-4">
                <span className="text-primary text-sm font-bold">الإسم</span>
                <div className="flex items-center gap-2">
                  <Avatar size="sm" src={subscription.instructor?.image} />
                  <span className="text-black-text font-bold text-[15px]">
                    {subscription.instructor?.name}
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
                tabContent: "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
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
                      label={`متبقي ${subscription.DaysToExpire} يوم علي تجديد الإشتراك`}
                      value={progressValue}
                      classNames={{
                        label: "text-sm font-semibold text-black-text",
                        track: "bg-primary/30",
                      }}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm font-semibold text-title">
                        تاريخ الإشتراك
                        <br />
                        {subscription.subscription_date}
                      </div>

                      <div className="flex gap-4">
                        <div className="text-sm font-semibold text-title text-center">
                          عدد الحصص الفائتة
                          <br />
                          <span className="text-primary">{subscription.missed_sessions}</span>
                        </div>
                        <div className="text-sm font-semibold text-title text-center">
                          عدد الحصص المكتملة
                          <br />
                          <span className="text-primary">{subscription.completed_sessions}</span>
                        </div>
                        <div className="text-sm font-semibold text-title text-center">
                          عدد الطلاب
                          <br />
                          <span className="text-primary">{subscription.student_number}</span>
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-title">
                        تاريخ الإنتهاء
                        <br />
                        {subscription.expire_date}
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
                      مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال النص.
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      );
    })}
  </div>
);

};
