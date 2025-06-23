"use client";

import { Tabs, Tab } from "@heroui/react";

import { Information } from "./tabs/Information";
import { TimelineDemo } from "./tabs/Timeline";
import { Programs } from "./tabs/Programs";
import { RelatedStudents } from "./tabs/RelatedStudents";
import { useState } from "react";

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

export const StudentDetails = ({ data, subscriptionsData }: StudentDetailsProps) => {
const [studentData, setStudentData] = useState(data.data);
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
          <Information data={{ data: studentData }} onUpdated={setStudentData} />
        </Tab>
        <Tab key="programs" title="البرامج و اللإشتراكات">
          <Programs subscriptionsData={subscriptionsData} />
        </Tab>
        <Tab key="actions" title="الإجراءات السابقة">
          <TimelineDemo />
        </Tab>
        <Tab key="other" title="الطلاب التابعين">
          <RelatedStudents data={data} />
        </Tab>
      </Tabs>
    </div>
  );
};
