"use client";

import { Tabs, Tab } from "@heroui/react";

import { Information } from "./tabs/Information";
import { Programs } from "./tabs/Programs";
import { FinancialTransactions } from "./tabs/FinancialTransactions";
import { Statistics } from "./tabs/Satistics";
import { TeacherReports } from "./tabs/TeacherReports";
import { useState } from "react";
import { Reports } from "../../students/student-details/tabs/ProgramTabs/reports";
import { Hostinglinks } from "./tabs/Hostinglinks";


type TeacherDetailsProps = {
  data: {
    data: {
      id: number;
      name_en: string;
      name_ar: string;
      phone: string;
      email: string;
      whats_app: string;
      address: string;
      age: string;
      gender: string;
      can_approve_question: string;
      image: string;
      instructor_payment_method_id: number;
      status_label: {
        label: string;
        color: string;
      };
      specializations: {
        id: number;
        title: string;
      }[];
      links: {
        id: number;
        title: string;
        icon: string,
        type: string,
        link: string,
      }[];
    };
  };
  reportsData: {
    data: {
      id: number;
      report_maker_type: string;
      report_maker_name: string;
      report_maker_image: string;
      report_for_type: string;
      report_for_name: string;
      report_for_image: string;
      program: string;
      report_question: string;
      report_question_answer: string;
      note: string;
      created_at: string;
    }[];
  };
};

export const TeacherDetails = ({ data, reportsData }: TeacherDetailsProps) => {
  const [teacherData, setTeacherData] = useState(data.data);
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "w-full bg-main py-5",
          tab: "w-fit",
          cursor: "hidden",
          tabContent:
            "text-[#5E5E5E] text-sm font-bold group-data-[selected=true]:text-primary group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-primary pb-2",
        }}
      >
         <Tab key="info" title="البيانات الشخصية">
            <Information data={{ data: teacherData }} onUpdated={setTeacherData} />
        </Tab>
        <Tab key="programs" title="البرامج">
            <Programs />
        </Tab>
        <Tab key="financial-transactions" title="المعاملات المالية">
            <FinancialTransactions />
        </Tab>
        <Tab key="statistics" title="الأحصائيات">
            <Statistics />
        </Tab>
        <Tab key="teacher-reports" title="تقارير المعلمين">
             <Reports
                reportData={reportsData}
                isLoadingReport={false}
              />
        </Tab>
        <Tab key="teacher-links" title="الاستضافات">
          <Hostinglinks
            data={{ data: teacherData }}
          />
        </Tab>
      </Tabs>
    </div>
  );
};
