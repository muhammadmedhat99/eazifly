"use client";

import React, { useState } from "react";

import { CustomPagination } from "@/components/global/Pagination";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { MainInformation } from "./tabs/MainInformation";
import { ProgramTeachers } from "./tabs/ProgramTeachers";
import { ProgramSubscriptions } from "./tabs/ProgramSubscriptions";
import { ProgramContent } from "./tabs/ProgramContent";
import { ProgramGoals } from "./tabs/ProgramGoals";
import { ProgramStatistics } from "./tabs/ProgramStatistics";

export const ProgramDetails = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "w-full bg-main py-5 rounded-none border-b border-b-stroke",
          tab: "w-fit",
          cursor: "hidden",
          tabContent:
            "text-[#5E5E5E] text-sm font-bold group-data-[selected=true]:text-primary",
          panel: "p-0",
        }}
      >
        <Tab key="info" title="بيانات البرنامج">
          <MainInformation />
        </Tab>
        <Tab key="program_teachers" title="المعلمين المشتركين">
          <ProgramTeachers />
        </Tab>
        <Tab key="subscriptions" title="أنواع الأشتراكات">
          <ProgramSubscriptions />
        </Tab>
        <Tab key="content" title="محتوي البرنامج">
          <ProgramContent />
        </Tab>
        <Tab key="goals" title="أهداف البرنامج">
          <ProgramGoals />
        </Tab>
        <Tab key="statistics" title="الإحصائيات">
          <ProgramStatistics />
        </Tab>
      </Tabs>
    </div>
  );
};
