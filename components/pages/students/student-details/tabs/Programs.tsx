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
  Chip,
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
import { useParams } from "next/navigation";
import { Subaccounts } from "./ProgramTabs/Subaccounts";
import SubscriptionActionModal from "./SubscriptionActionModal";
import ConfirmModal from "@/components/global/ConfirmModal";
import { Teachers } from "./ProgramTabs/teachers";

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
      parent_id: string; 
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
  main_subscription_id: number;
  program: string;
  price: number;
  subscription_status: {
    label: string;
    color: string;
    key: string;
  };
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
  isParent,
}: {
  id: number;
  user_id: any;
  children_users: ChildUser[];
  subscription_status: string;
  refetchSubscriptions: () => void;
  isParent: boolean;
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
      <Dropdown isDisabled={!isParent} classNames={{ base: "max-w-40", content: "min-w-36" }}>
        <DropdownTrigger>
          <button className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-100">
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
      queryKey: ["instructors", subscription.main_subscription_id],
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

  const teachersResults = useQueries({
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
      queryKey: ["programteachers", subscription.main_subscription_id],
      queryFn: async () =>
        await fetchClient(
          `client/subscription/user/instructors/${subscription.main_subscription_id}`,
          axios_config
        ),
    })),
  });

  const handleManualRefetch = () => {
    teachersResults.forEach((query) => query.refetch());
  };

  const subaccountsResults = useQueries({
    queries: subscriptionsData.data.map((subscription: Subscription) => ({
      queryKey: ["programsubaccounts", subscription.main_subscription_id],
      queryFn: async () =>
        await fetchClient(`client/children/users/${user_id}`, {
          ...axios_config,
          params: {
            program_id: subscription.program_id,
            subscription_id: subscription.main_subscription_id,
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
          const teacherResult = teachersResults[index];
          const teacherData: { data: any[] } = hasDataArray(teacherResult?.data)
            ? teacherResult.data
            : { data: [] };
          const isLoadingteacher = teacherResult?.isLoading;

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
                <div className="flex items-center justify-between bg-background p-3 md:p-5 rounded-2xl border border-stroke">
                  <div className="flex flex-col gap-4">
                    <span className="text-primary text-sm font-bold">
                      إسم البرنامج
                    </span>
                    <div className="text-black-text font-bold text-[15px]">
                      {subscription.program}
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between bg-background p-3 md:p-5 rounded-2xl border border-stroke">
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

                <div className="flex items-center justify-between p-3 md:p-5 rounded-2xl border border-stroke bg-background">
                  <div className="flex flex-col gap-4 w-1/2">
                    <span className="text-primary text-sm font-bold whitespace-nowrap">
                      {data.data?.parent_name ? "الحساب الأساسي" : "عدد الطلاب المشتركين"}
                    </span>

                    {data.data?.parent_name ? (
                      <Link href={`/students/${data.data.parent_id}`} className="text-primary font-bold text-[15px] underline">
                        {data.data.parent_name}
                      </Link>
                    ) : (subaccountData as any)?.data ? (
                      <div className="text-black-text font-bold text-[15px]">
                        {(subaccountData as any)?.data?.length} من {subscription.student_number}
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between bg-background p-3 md:p-5 rounded-2xl border border-stroke">
                  <div className="flex flex-col gap-4">
                    <span className="text-primary text-sm font-bold">
                      حالة الإشتراك
                    </span>
                    <Chip
                      className="capitalize px-4 min-w-24 text-center"
                      color={subscription?.subscription_status?.color as any}
                      variant="flat"
                    >
                      <span
                        className={`text-${subscription?.subscription_status?.color} font-bold`}
                      >
                        {subscription?.subscription_status?.label}
                      </span>
                    </Chip>
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
                      <div className="flex items-center justify-between gap-2 w-full overflow-x-auto">
                        <div className="flex-1">
                          <div className="flex flex-col gap-2 items-start">
                            <div className="flex justify-between items-center w-full">
                              <label className="text-sm font-semibold text-black-text">{`متبقي ${subscription.DaysToExpire} يوم علي تجديد الإشتراك`}</label>
                              <ActionsComponent
                                id={subscription.program_id}
                                user_id={user_id}
                                children_users={subscription.children_users}
                                subscription_status={subscription.subscription_status.key}
                                refetchSubscriptions={refetch}
                                isParent={data.data.parent_id === null}
                              />
                            </div>
                            <Progress
                              className="w-full"
                              value={progressValue}
                              classNames={{
                                label: "text-sm font-semibold text-black-text mb-3 sm:mb-0",
                                track: "bg-primary/30",
                              }}
                            />
                            
                          </div>

                          <div className="hidden md:flex items-center justify-between mt-5 md:mt-3 gap-2">
                            <div className="text-sm font-semibold text-title whitespace-nowrap">
                              تاريخ الإشتراك
                              <br />
                              {subscription.subscription_date}
                            </div>

                            <div className="flex gap-4">
                              <div className="text-sm font-semibold text-title text-center whitespace-nowrap">
                                عدد الحصص الفائتة
                                <br />
                                <span className="text-primary">
                                  {subscription.missed_sessions}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-title text-center whitespace-nowrap">
                                عدد الحصص المكتملة
                                <br />
                                <span className="text-primary">
                                  {subscription.completed_sessions}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-title text-center whitespace-nowrap">
                                عدد الطلاب
                                <br />
                                <span className="text-primary">
                                  {subscription.student_number}
                                </span>
                              </div>
                            </div>

                            <div className="text-sm font-semibold text-title whitespace-nowrap">
                              تاريخ الإنتهاء
                              <br />
                              {subscription.expire_date}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-5 md:hidden">
                            <div className="text-sm font-semibold text-title whitespace-nowrap">
                              تاريخ الإشتراك
                              <br />
                              {subscription.subscription_date}
                            </div>


                              <div className="text-sm font-semibold text-title whitespace-nowrap">
                                عدد الحصص الفائتة
                                <br />
                                <span className="text-primary">
                                  {subscription.missed_sessions}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-title whitespace-nowrap">
                                عدد الحصص المكتملة
                                <br />
                                <span className="text-primary">
                                  {subscription.completed_sessions}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-title whitespace-nowrap">
                                عدد الطلاب
                                <br />
                                <span className="text-primary">
                                  {subscription.student_number}
                                </span>
                              </div>


                            <div className="text-sm font-semibold text-title whitespace-nowrap">
                              تاريخ الإنتهاء
                              <br />
                              {subscription.expire_date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  )}

                  {teacherData.data.length > 0 && (
                    <Tab className="w-full" key="teachers" title="المعلمين">
                      <Teachers
                        teachersData={teacherData}
                        isLoadingteachers={isLoadingteacher}
                        handleManualRefetch={handleManualRefetch}
                        data={data}
                      />
                    </Tab>
                  )}

                  <Tab className="w-full" key="subaccounts" title="الطلاب">
                    <Subaccounts
                      subaccountData={subaccountData}
                      isLoadingsubaccount={isLoadingsubaccount}
                      program_id={subscription?.program_id}
                      refetchSubaccounts={subaccountResult?.refetch}
                      data={data}
                      student_number={subscription.student_number}
                      refetchTeachers={teacherResult?.refetch}
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
