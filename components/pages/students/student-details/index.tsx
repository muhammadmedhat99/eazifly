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
          <Programs subscriptionsData={subscriptionsData} client_id={client_id} data={data}/>
        </Tab>
        <Tab key="actions" title="الإجراءات السابقة">
          <TimelineDemo actionsData={actionsData} />
        </Tab>
        <Tab key="other" title="الطلاب التابعين">
          <RelatedStudents data={data} />
        </Tab>
      </Tabs>
    </div>
  );
};
