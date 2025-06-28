"use client";

import { Options } from "@/components/global/Icons";
import { Loader } from "@/components/global/Loader";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { formatDate } from "@/lib/helper";
import { fetchClient, postData } from "@/lib/utils";
import {
  addToast,
  Avatar,
  Button,
  Card,
  CardBody,
  Progress,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@heroui/react";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import Link from "next/link";
import React, { useState } from "react";
import { Reports } from "./ProgramTabs/reports";
import { Appointments } from "./ProgramTabs/appointments";
import { Assignments } from "./ProgramTabs/assignments";
import { Feedbacks } from "./ProgramTabs/feedbacks";
import { useParams } from "next/navigation";
import { Subaccounts } from "./ProgramTabs/Subaccounts";

type StudentDetailsProps = {
  subscriptionsData: {
    data: {
      id: number;
      program_id: number;
      program: string;
      price: number;
      instructor: {
        id: number;
        name: string;
        image: string;
      };
      DaysToExpire: number;
      subscription_date: string;
      expire_date: string;
      student_number: number;
      missed_sessions: number;
      completed_sessions: number;
    }[];
  };
  client_id: number;
};

export const Programs = ({
  subscriptionsData,
  client_id,
}: StudentDetailsProps) => {
  const params = useParams();
  const user_id = params.id;

  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);
  const [selectedInstructors, setSelectedInstructors] = useState<
    Record<number, any>
  >({});

  const instructorsResults = useQueries({
    queries: subscriptionsData.data.map((subscription) => ({
      queryKey: ["instructors", subscription.id],
      queryFn: async () =>
        await fetchClient("client/program/instructors", {
          ...axios_config,
          params: {
            instructor_id: subscription.instructor.id,
            program_id: subscription.program_id,
            user_id: subscription.student_number,
          },
        }),
    })),
  });

  const changeInstructor = useMutation({
    mutationFn: (submitData: FormData) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formData = new FormData();
      formData.append("user_id", submitData.get("user_id") as string);
      formData.append(
        "instructor_id",
        submitData.get("instructor_id") as string
      );
      formData.append("program_id", submitData.get("program_id") as string);

      return postData("client/change/instructor", formData, myHeaders);
    },

    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "حدث خطأ أثناء التغيير",
          color: "danger",
        });
      } else {
        addToast({
          title: "تم تغيير المعلم بنجاح",
          color: "success",
        });
      }
    },

    onError: (error) => {
      console.log("error ===>>", error);
      addToast({
        title: "عذراً، حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const onSubmit = (subscription: any) => {
    const selected = selectedInstructors[subscription.id];

    if (!selected) {
      addToast({
        title: "من فضلك اختر معلم أولاً",
        color: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("user_id", subscription.student_number.toString());
    formData.append("instructor_id", selected.id.toString());
    formData.append("program_id", subscription.program_id.toString());

    changeInstructor.mutate(formData);
    setEditModeIndex(null);
  };

  const reportsResults = useQueries({
    queries: subscriptionsData.data.map((subscription) => ({
      queryKey: ["programReports", subscription.id],
      queryFn: async () =>
        await fetchClient("client/user/program/reports", {
          ...axios_config,
          params: {
            user_id: user_id,
            program_id: subscription.program_id,
          },
        }),
    })),
  });

  const appointmentsResults = useQueries({
    queries: subscriptionsData.data.map((subscription) => ({
      queryKey: ["programappointments", subscription.id],
      queryFn: async () =>
        await fetchClient(`client/user/appointments/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
          },
        }),
    })),
  });

  const assignmentsResults = useQueries({
    queries: subscriptionsData.data.map((subscription) => ({
      queryKey: ["programassignments", subscription.id],
      queryFn: async () =>
        await fetchClient(`client/user/assignment/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
          },
        }),
    })),
  });

  const feedbacksResults = useQueries({
    queries: subscriptionsData.data.map((subscription) => ({
      queryKey: ["programfeedbacks", subscription.id],
      queryFn: async () =>
        await fetchClient(`client/user/feedback/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
          },
        }),
    })),
  });

  const subaccountsResults = useQueries({
    queries: subscriptionsData.data.map((subscription) => ({
      queryKey: ["programsubaccounts", subscription.id],
      queryFn: async () =>
        await fetchClient(`client/children/users/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
          },
        }),
    })),
  });

  return (
    <div className="grid grid-cols-1 gap-8">
      {subscriptionsData?.data?.map((subscription, index) => {
        const reportResult = reportsResults[index];
        const reportData = reportResult?.data;
        const isLoadingReport = reportResult?.isLoading;

        const appointmentResult = appointmentsResults[index];
        const appointmentData = appointmentResult?.data;
        const isLoadingappointment = appointmentResult?.isLoading;

        const assignmentResult = assignmentsResults[index];
        const assignmentData = assignmentResult?.data;
        const isLoadingassignment = assignmentResult?.isLoading;

        const feedbackResult = feedbacksResults[index];
        const feedbackData = feedbackResult?.data;
        const isLoadingfeedback = feedbackResult?.isLoading;

        const subaccountResult = subaccountsResults[index];
        const subaccountData = subaccountResult?.data;
        const isLoadingsubaccount = subaccountResult?.isLoading;

        const instructorsData = instructorsResults[index]?.data?.data ?? [];
        const isLoadingInstructors = instructorsResults[index]?.isLoading;

        const subscriptionDate = subscription.subscription_date;
        const expireDate = subscription.expire_date;
        const daysToExpire = subscription.DaysToExpire;

        let progressValue = 0;

        if (subscriptionDate && expireDate && daysToExpire !== undefined) {
          const start = new Date(subscriptionDate);
          const end = new Date(expireDate);

          const totalMs = end.getTime() - start.getTime();
          const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));

          const usedDays = totalDays - daysToExpire;
          progressValue = Math.round((usedDays / totalDays) * 100);
        }

        return (
          <div
            key={index}
            className="bg-main border border-stroke rounded-lg p-5"
          >
            <div className="grid grid-cols-4 gap-2 mb-10">
              <div className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke">
                <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                    إسم البرنامج
                  </span>
                  <div className="text-black-text font-bold text-[15px]">
                    {subscription.program}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between bg-background p-5 rounded-2xl border border-stroke">
                <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                    سعر الإشتراك
                  </span>
                  <div className="text-black-text font-bold text-[15px]">
                    {subscription.price}
                  </div>
                </div>
                <Link href="#" className="flex items-center gap-1">
                  <span className="text-sm font-bold text-black-text">ج.م</span>
                </Link>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl border border-stroke bg-background col-span-2">
                <div className="flex flex-col gap-4 w-1/2">
                  <span className="text-primary text-sm font-bold">الإسم</span>
                  {editModeIndex === index ? (
                    <Select
                      selectedKeys={
                        selectedInstructors[subscription.id]?.id
                          ? [String(selectedInstructors[subscription.id].id)]
                          : []
                      }
                      label="اختر المعلم"
                      onSelectionChange={(keys) => {
                        const selectedId = Number(Array.from(keys)[0]);
                        const selected = instructorsData.find(
                          (i: any) => i.id === selectedId
                        );

                        setSelectedInstructors((prev) => ({
                          ...prev,
                          [subscription.id]: selected,
                        }));
                      }}
                    >
                      {instructorsData.map((inst: any) => (
                        <SelectItem key={inst.id.toString()}>
                          {inst.name_en}
                        </SelectItem>
                      ))}
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        src={
                          selectedInstructors[subscription.id]?.image ||
                          subscription.instructor?.image
                        }
                      />
                      <span className="text-black-text font-bold text-[15px]">
                        {selectedInstructors[subscription.id]?.name_en ||
                          subscription.instructor?.name}
                      </span>
                    </div>
                  )}
                </div>
                {editModeIndex === index ? (
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="text-white mt-2"
                    type="button"
                    onPress={() => onSubmit(subscription)}
                    isLoading={changeInstructor.isPending}
                  >
                    حفظ
                  </Button>
                ) : (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditModeIndex(index);
                    }}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm font-bold text-primary">
                      تغير المعلم
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center flex-col">
              <Tabs
                aria-label="sub-tabs"
                classNames={{
                  cursor: "bg-primary",
                  tabContent:
                    "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
                  tabList: "bg-[#EAF0FD]",
                }}
              >
                {subscriptionsData?.data?.length > 0 && (
                  <Tab
                    key="subscription-details"
                    title="تفاصيل الإشتراك و التجديد"
                    className="w-full"
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex-1">
                        <Progress
                          className="min-w-96 w-full"
                          label={`متبقي ${subscription.DaysToExpire} يوم علي تجديد الإشتراك`}
                          value={progressValue}
                          classNames={{
                            label: "text-sm font-semibold text-black-text",
                            track: "bg-primary/30",
                          }}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm font-semibold text-title">
                            تاريخ الإشتراك
                            <br />
                            {subscription.subscription_date}
                          </div>

                          <div className="flex gap-4">
                            <div className="text-sm font-semibold text-title text-center">
                              عدد الحصص الفائتة
                              <br />
                              <span className="text-primary">
                                {subscription.missed_sessions}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-title text-center">
                              عدد الحصص المكتملة
                              <br />
                              <span className="text-primary">
                                {subscription.completed_sessions}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-title text-center">
                              عدد الطلاب
                              <br />
                              <span className="text-primary">
                                {subscription.student_number}
                              </span>
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-title">
                            تاريخ الإنتهاء
                            <br />
                            {subscription.expire_date}
                          </div>
                        </div>
                      </div>
                      <Options />
                    </div>
                  </Tab>
                )}

                {appointmentData?.data?.length > 0 && (
                  <Tab className="w-full" key="appointments" title="المواعيد">
                    <Appointments
                      appointmentData={appointmentData}
                      isLoadingappointment={isLoadingappointment}
                    />
                  </Tab>
                )}

                {assignmentData?.data?.length > 0 && (
                  <Tab className="w-full" key="assignments" title="التسليمات">
                    <Assignments
                      isLoadingassignment={isLoadingassignment}
                      assignmentData={assignmentData}
                    />
                  </Tab>
                )}

                {reportData?.data?.length > 0 && (
                  <Tab className="w-full" key="reports" title="التقارير">
                    <Reports
                      isLoadingReport={isLoadingReport}
                      reportData={reportData}
                    />
                  </Tab>
                )}

                {feedbackData?.data?.length > 0 && (
                  <Tab className="w-full" key="feedbacks" title="الملاحظات">
                    <Feedbacks
                      isLoadingfeedback={isLoadingfeedback}
                      feedbackData={feedbackData}
                      client_id={client_id}
                    />
                  </Tab>
                )}

                {subaccountData?.data?.length > 0 && (
                  <Tab
                    className="w-full"
                    key="subaccounts"
                    title="الحسابات الفرعية"
                  >
                    <Subaccounts
                      subaccountData={subaccountData}
                      isLoadingsubaccount={isLoadingsubaccount}
                      program_id={subscription?.program_id}
                    />
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>
        );
      })}
    </div>
  );
};
