"use client";

import { Tabs, Tab } from "@heroui/react";

import { Information } from "./tabs/Information";
import { TimelineDemo } from "./tabs/Timeline";
import { Programs } from "./tabs/Programs";
import { RelatedStudents } from "./tabs/RelatedStudents";

export const StudentDetails = () => {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "w-full bg-main py-5",
          tab: "w-fit",
          cursor: "hidden",
          tabContent:
            "text-[#5E5E5E] text-sm font-bold group-data-[selected=true]:text-primary",
        }}
      >
        <Tab key="info" title="البيانات الشخصية">
          <Information />
        </Tab>
        <Tab key="programs" title="البرامج و اللإشتراكات">
          <Programs />
        </Tab>
        <Tab key="actions" title="الإجراءات السابقة">
          <TimelineDemo />
        </Tab>
        <Tab key="other" title="الطلاب التابعين">
          <RelatedStudents />
        </Tab>
      </Tabs>
    </div>
  );
};
