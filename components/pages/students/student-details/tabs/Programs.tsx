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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import SubscriptionActionModal from "./SubscriptionActionModal";
import ConfirmModal from "@/components/global/ConfirmModal";
import ChangeTeacherModal from "./ChangeTeacherModal";

type StudentDetailsProps = {
  data: {
    data: {
      id: number;
      age: string;
      gender: string;
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
      };
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
      }[];
    }[];
  };
  client_id: number;
};

type ChildUser = {
  user_id: string;
  name: string;
  age: string;
  image: string;
};

interface Subscription {
  id: number;
  program_id: number;
  program: string;
  price: number;
  subscription_status: string;
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
  children_users: {
    user_id: string;
    name: string;
    age: string;
    image: string;
  }[];
}

const ActionsComponent = ({
  id,
  user_id,
  children_users,
  subscription_status,
  refetchSubscriptions,
}: {
  id: number;
  user_id: any;
  children_users: ChildUser[];
  subscription_status: any;
  refetchSubscriptions: () => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const handleActionClick = (actionKey: string) => {
    if (["cancel", "resume"].includes(actionKey)) {
      setConfirmAction(actionKey);
    } else {
      setSelectedAction(actionKey);
      setModalOpen(true);
    }
  };

  const confirmMessages: Record<string, string> = {
    cancel: "هل أنت متأكد أنك تريد إنهاء الاشتراك؟",
    resume: "هل أنت متأكد أنك تريد استئناف الاشتراك؟",
  };

  const handleCancel = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      var formdata = new FormData();
      formdata.append("program_id", id.toString());
      formdata.append("user_id", user_id);

      return postData("client/order/cancel", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        refetchSubscriptions();
      }
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const handleResume = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      var formdata = new FormData();
      formdata.append("program_id", id.toString());
      formdata.append("user_id", user_id);

      return postData("client/subscription/resume", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        refetchSubscriptions();
      }
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const handleConfirmAction = () => {
    if (confirmAction === "cancel") {
      handleCancel.mutate();
    } else if (confirmAction === "resume") {
      handleResume.mutate();
    }
    setConfirmAction(null);
  };

  return (
    <>
      <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
        <DropdownTrigger>
          <button>
            <Options />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {subscription_status === "cancelled" ? (
            <>
              <DropdownItem
                key="renew"
                onClick={() => handleActionClick("renew")}
              >
                تجديد
              </DropdownItem>
              <DropdownItem
                key="change"
                onClick={() => handleActionClick("change")}
              >
                تغيير الاشتراك
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem
                key="renew"
                onClick={() => handleActionClick("renew")}
              >
                تجديد
              </DropdownItem>
              <DropdownItem
                key="change"
                onClick={() => handleActionClick("change")}
              >
                تغيير الاشتراك
              </DropdownItem>
              {subscription_status !== "freeze" && (
                <DropdownItem
                  key="Pause"
                  onClick={() => handleActionClick("Pause")}
                >
                  إيقاف مؤقت
                </DropdownItem>
              )}
              {subscription_status === "freeze" && (
                <DropdownItem
                  key="resume"
                  onClick={() => handleActionClick("resume")}
                >
                  إستئناف الاشتراك
                </DropdownItem>
              )}
              <DropdownItem
                key="extend"
                onClick={() => handleActionClick("extend")}
              >
                تمديد الاشتراك
              </DropdownItem>
              <DropdownItem
                key="cancel"
                onClick={() => handleActionClick("cancel")}
              >
                إنهاء الاشتراك
              </DropdownItem>
            </>
          )}
        </DropdownMenu>
      </Dropdown>

      <SubscriptionActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={selectedAction}
        subscriptionId={id}
        user_id={user_id}
        children_users={children_users}
        onActionSuccess={() => {
          refetchSubscriptions();
          setModalOpen(false);
        }}
      />

      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction === "resume" ? "استئناف الاشتراك" : "إنهاء الاشتراك"
        }
        message={confirmAction ? confirmMessages[confirmAction] : ""}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export const Programs = ({
  subscriptionsData: initialSubscriptionsData,
  client_id,
  data,
}: StudentDetailsProps) => {
  const params = useParams();
  const user_id = params.id;
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedInstructors, setSelectedInstructors] = useState<
    Record<number, any>
  >({});

  const { data: subscriptionsData, refetch } = useQuery({
    queryKey: ["subscriptions", user_id],
    queryFn: () =>
      fetchClient(`client/user/subscriptions/${user_id}`, axios_config),
    initialData: initialSubscriptionsData,
  });

  const instructorsResults = useQueries({
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
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

  const reportsResults = useQueries({
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
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
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
      queryKey: ["programappointments", subscription.id],
      queryFn: async () =>
        await fetchClient(`client/user/upcoming/appointments/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
            per_page: 5,
          },
        }),
    })),
  });

  const allAppointmentsResults = useQueries({
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
      queryKey: ["programallappointments", subscription.id],
      queryFn: async () =>
        await fetchClient(`client/user/appointments/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
            per_page: 5,
          },
        }),
    })),
  });

  const assignmentsResults = useQueries({
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
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
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
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
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
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

  // Type guard to check if an object has a 'data' property that is an array
  function hasDataArray(obj: unknown): obj is { data: any[] } {
    return !!obj && typeof obj === "object" && Array.isArray((obj as any).data);
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {subscriptionsData?.data?.map(
        (subscription: Subscription, index: number) => {
          const reportResult = reportsResults[index];
          const reportData: { data: any[] } = hasDataArray(reportResult?.data)
            ? reportResult.data
            : { data: [] };
          const isLoadingReport = reportResult?.isLoading;

          const appointmentResult = appointmentsResults[index];
          const appointmentData: { data: any[] } = hasDataArray(
            appointmentResult?.data
          )
            ? appointmentResult.data
            : { data: [] };
          const isLoadingappointment = appointmentResult?.isLoading;

          const allappointmentResult = allAppointmentsResults[index];
          const allappointmentData: { data: any[] } = hasDataArray(
            allappointmentResult?.data
          )
            ? allappointmentResult.data
            : { data: [] };
          const isLoadingallappointment = allappointmentResult?.isLoading;

          const assignmentResult = assignmentsResults[index];
          const assignmentData: { data: any[] } = hasDataArray(
            assignmentResult?.data
          )
            ? assignmentResult.data
            : { data: [] };
          const isLoadingassignment = assignmentResult?.isLoading;

          const feedbackResult = feedbacksResults[index];
          const feedbackData: { data: any[] } = hasDataArray(
            feedbackResult?.data
          )
            ? feedbackResult.data
            : { data: [] };
          const isLoadingfeedback = feedbackResult?.isLoading;

          const subaccountResult = subaccountsResults[index];
          const subaccountData = subaccountResult?.data;
          const isLoadingsubaccount = subaccountResult?.isLoading;

          const instructorsData = instructorsResults[index]?.data ?? [];
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
              <ChangeTeacherModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                student={subscription}
                refetchSubscriptions={refetch}
              />
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
                    <span className="text-sm font-bold text-black-text">
                      ج.م
                    </span>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-5 rounded-2xl border border-stroke bg-background">
                  <div className="flex flex-col gap-4 w-1/2">
                    <span className="text-primary text-sm font-bold">
                      الإسم
                    </span>
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
                  </div>
                  <Link
                    href="#"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm font-bold text-primary">
                      تغير المعلم
                    </span>
                  </Link>
                </div>

                <div className="flex items-end justify-between bg-background p-5 rounded-2xl border border-stroke">
                  <div className="flex flex-col gap-4">
                    <span className="text-primary text-sm font-bold">
                      حالة الإشتراك
                    </span>
                    <div className="text-black-text font-bold text-[15px]">
                      {subscription.subscription_status}
                    </div>
                  </div>
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
                        <ActionsComponent
                          id={subscription.program_id}
                          user_id={user_id}
                          children_users={subscription.children_users}
                          subscription_status={subscription.subscription_status}
                          refetchSubscriptions={refetch}
                        />
                      </div>
                    </Tab>
                  )}

                  {appointmentData.data.length > 0 && (
                    <Tab className="w-full" key="appointments" title="المواعيد">
                      <Appointments
                        appointmentData={appointmentData}
                        isLoadingappointment={isLoadingappointment}
                      />
                    </Tab>
                  )}

                  {appointmentData.data.length > 0 && (
                    <Tab className="w-full" key="allAppointments" title="المحاضرات">
                      <Appointments
                        appointmentData={allappointmentData}
                        isLoadingappointment={isLoadingallappointment}
                      />
                    </Tab>
                  )}

                  {assignmentData.data.length > 0 && (
                    <Tab className="w-full" key="assignments" title="التسليمات">
                      <Assignments
                        isLoadingassignment={isLoadingassignment}
                        assignmentData={assignmentData}
                      />
                    </Tab>
                  )}

                  {reportData.data.length > 0 && (
                    <Tab className="w-full" key="reports" title="التقارير">
                      <Reports
                        isLoadingReport={isLoadingReport}
                        reportData={reportData}
                      />
                    </Tab>
                  )}

                  {feedbackData.data.length > 0 && (
                    <Tab className="w-full" key="feedbacks" title="الملاحظات">
                      <Feedbacks
                        isLoadingfeedback={isLoadingfeedback}
                        feedbackData={feedbackData}
                        client_id={client_id}
                        refetchFeedbacks={feedbackResult?.refetch}
                      />
                    </Tab>
                  )}

                  <Tab
                    className="w-full"
                    key="subaccounts"
                    title="الحسابات الفرعية"
                  >
                    <Subaccounts
                      subaccountData={subaccountData}
                      isLoadingsubaccount={isLoadingsubaccount}
                      program_id={subscription?.program_id}
                      refetchSubaccounts={subaccountResult?.refetch}
                      data={data}
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
