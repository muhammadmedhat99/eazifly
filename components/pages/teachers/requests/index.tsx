"use client";

import { Tabs, Tab } from "@heroui/react";
import { ProfileRequests } from "./tabs/ProfileRequests";
import { SessionsRequests } from "./tabs/SessionsRequests";
import { usePathname, useRouter } from "next/navigation";


export const TeacherRequests = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex w-full flex-col">
      <Tabs
        selectedKey={pathname.includes("sessions") ? "sessions" : "info"}
        onSelectionChange={(key) => router.push(`/teachers/requests/${key}`)}
        aria-label="Options"
        classNames={{
          tabList: "w-full bg-main py-5",
          tab: "w-fit",
          cursor: "hidden",
          tabContent:
            "text-[#5E5E5E] text-sm font-bold group-data-[selected=true]:text-primary group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-primary pb-2",
          panel: "p-0"
        }}
      >
        <Tab key="info" title="طلبات تعديل بيانات المعلمين">
          <ProfileRequests />
        </Tab>
        <Tab key="sessions" title="طلبات إلغاء حصص">
          <SessionsRequests />
        </Tab>
      </Tabs>
    </div>
  );
};
