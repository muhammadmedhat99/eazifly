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
import { axios_config } from "@/lib/const";
import { fetchClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { MainInformation } from "./tabs/MainInformation";
import { Assignments } from "./tabs/Assignments";
import { Reports } from "./tabs/Reports";


export const SessionDetails = () => {
    const params = useParams();
    const sessionId = params.id;
    const { data, refetch } = useQuery({
      queryKey: ["GetSessionDetails", sessionId],
      queryFn: async () => await fetchClient(`client/session/show/${sessionId}`, axios_config),
    });
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
        <Tab key="info" title="تفاصيل الحصة">
          <MainInformation data={data?.data} refetch={refetch} />
        </Tab>
        <Tab key="program_teachers" title="التسليمات">
          <Assignments />
        </Tab>
        <Tab key="subscriptions" title="التقارير">
          <Reports/>
        </Tab>
        <Tab key="session" title="تسجيل الحصة" isDisabled>
          
        </Tab>
      </Tabs>
    </div>
  );
};
