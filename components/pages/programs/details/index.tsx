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

export const ProgramDetails = () => {
  const [search, setSearch] = useState("");
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
          nsajndsaj
        </Tab>
        <Tab key="programs" title="البرامج">
          sdassada
        </Tab>
        <Tab key="transactions" title="المعاملات المالية">
          dafmskalmfa
        </Tab>
        <Tab key="statistics" title="الأحصائيات">
          lsa;md;lasm
        </Tab>
        <Tab key="reports" title="تقارير المعلمين">
          lsa;md;lasm
        </Tab>
      </Tabs>
    </div>
  );
};
