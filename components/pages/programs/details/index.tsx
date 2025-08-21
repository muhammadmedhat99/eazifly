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
import { axios_config } from "@/lib/const";
import { fetchClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ProgramReportQuestions } from "./tabs/ProgramReportQuestions";
import { AllQueryKeys } from "@/keys";

type ProgramDetailsProps = {
  data: {
    data: {
      id: number;
      title: string;
      label: string;
      specialization: string;
      category: string;
      content: string;
      description: string;
      image: string;
      duration: string;
      goals: string;
      cover: string;
      number_of_students: number;
      number_of_lessons: number;
      payment_methods: {
        id: number;
        title: string;
      }[];
      host: {
      id: number;
      title: string;
    };
      status: {
        label: string;
        key: string;
        color: string;
      };
      instructors: {
        id: number;
        name_en: string;
        name_ar: string;
        phone: string;
        status: string;
        email: string;
        whats_app: string;
        created_at: string;
        address: string;
        age: string;
        experience_years: string;
        gender: string;
        can_approve_question: string;
        image: string;
        specializations: any[];
        instructor_payment_method_id: number;
        amount_per_hour: string;
      }[];
      plans: {
        id: number;
        title: string | null;
        program: string;
        label: string | null;
        description: string | null;
        currency: string | null;
        price: string;
        discount_price: string;
        subscripe_days: string;
        duration: string;
        number_of_session_per_week: string;
        is_special_plan: boolean;
        type: string;
        plan_title: string | null;
        subscription_plan: string;
      }[];
    };
  };
};

export const ProgramDetails = () => {
    const params = useParams();
    const programId = params.id;
    const { data, refetch } = useQuery({
      queryKey: ["GetProgramDetails", programId],
      queryFn: async () => await fetchClient(`client/program/show/${programId}`, axios_config),
    });
    const { data: questionsData, isLoading } = useQuery({
        queryFn: async () =>
          await fetchClient(`client/report/question/method?program_id=${programId}`, {
            ...axios_config,
            params,
          }),
        queryKey: AllQueryKeys.GetAllSpecializations
      });
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
          <MainInformation data={data?.data} refetch={refetch} />
        </Tab>
        <Tab key="program_teachers" title="المعلمين المشتركين">
          <ProgramTeachers teachersData={data?.data?.instructors} />
        </Tab>
        <Tab key="subscriptions" title="أنواع الأشتراكات">
          <ProgramSubscriptions subscriptionsData={data?.data?.plans} />
        </Tab>
        <Tab key="content" title="محتوي البرنامج">
          <ProgramContent data={data?.data} />
        </Tab>
        <Tab key="goals" title="أهداف البرنامج">
          <ProgramGoals />
        </Tab>
        <Tab key="report-questions" title="أسئلة التقارير">
          <ProgramReportQuestions data={questionsData} isLoading={isLoading} />
        </Tab>
        <Tab key="statistics" title="الإحصائيات">
          <ProgramStatistics />
        </Tab>
      </Tabs>
    </div>
  );
};
