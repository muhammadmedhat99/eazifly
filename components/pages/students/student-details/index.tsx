"use client";

import { Tabs, Tab, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@heroui/react";

import { Information } from "./tabs/Information";
import { TimelineDemo } from "./tabs/Timeline";
import { Programs } from "./tabs/Programs";
import { RelatedStudents } from "./tabs/RelatedStudents";
import { useState } from "react";
import { Sessions } from "./tabs/Sessions";
import { MenuIcon } from "@/components/global/Icons";

type StudentDetailsProps = {
  data: {
    data: {
      id: number;
      age:string;
      gender:string;
      first_name: string;
      last_name: string;
      user_name: string;
      email: string;
      phone: string;
      whats_app: string;
      image: string;
      created_at: string;
      parent_id : string;
      parent_name: string; 
      status_label: {
        label: string;
        color: string;
      };
      childrens: {
        id: number;
        first_name: string;
        last_name: string;
        user_name: string;
        email: string;
        phone: string;
        whats_app: string;
        image: string;
        gender: string;
         age: string;
        status_label: {
          label: string;
          color: string;
        };
        programs: any[];
        chat_id: number;
      }[];
    };
  };
  subscriptionsData: {
    data: {
      id: number;
      program_id: number;
      program: string;
      price: number;
      subscription_status: string;
      instructor: {
        id: number;
        name: string;
        image: string;
      },
      DaysToExpire: number;
      subscription_date: string;
      expire_date: string;
      student_number: number;
      missed_sessions: number;
      completed_sessions: number;
      children_users: {
        user_id: string;
        name: string;
        age: string;
        image: string;
      }[]
    }[];
  };
  actionsData: {
    data: {
      id: number;
      title: string,
      description: string,
      created_at: string,
      instructor: {
        id: number;
        name_ar: string;
        name_en: string;
        image: string;
      },
      user: {
        id: number;
        first_name: string;
        last_name: string;
        image: string;
      },
      client: {
        id: number;
        name: string;
        image: string;
      },
      
    }[];
  }
  client_id: number;
  
};

export const StudentDetails = ({ data, subscriptionsData, actionsData , client_id }: StudentDetailsProps) => {
  const [studentData, setStudentData] = useState(data.data);
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { key: "info", title: "البيانات الشخصية", content: <Information data={{ data: studentData }} onUpdated={setStudentData} /> },
    { key: "programs", title: "البرامج و اللإشتراكات", content: <Programs subscriptionsData={subscriptionsData} client_id={client_id} data={data} /> },
    { key: "actions", title: "الإجراءات السابقة", content: <TimelineDemo actionsData={actionsData} /> },
    { key: "other", title: "الطلاب التابعين", content: <RelatedStudents data={data} />, disabled: !!studentData?.parent_id },
    { key: "sessions", title: "الحصص", content: <Sessions data={data} /> },
  ];

  const visibleTabs = tabs.slice(0, 2);
  const hiddenTabs = tabs.slice(2);

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-wrap items-center bg-main py-3 px-3 gap-2 md:justify-start justify-between">

        <div className="flex gap-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              disabled={tab.disabled}
              className={`text-sm font-bold px-3 py-2 rounded-md transition-colors ${activeTab === tab.key ? "text-primary" : "text-[#5E5E5E]"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* ✅ Dropdown للموبايل فقط */}
        <div className="block md:hidden">
          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-100">
                <MenuIcon />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => setActiveTab(key.toString())}
              selectedKeys={[activeTab]}
            >
              {hiddenTabs.map((tab) => (
                <DropdownItem key={tab.key} isDisabled={tab.disabled}>
                  {tab.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* ✅ باقي التابات تظهر في الشاشات الكبيرة */}
        <div className="hidden md:flex gap-2">
          {hiddenTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              disabled={tab.disabled}
              className={`text-sm font-bold px-3 py-2 rounded-md transition-colors ${activeTab === tab.key ? "text-primary" : "text-[#5E5E5E]"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ محتوى التاب */}
      <div className="mt-4">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
};
