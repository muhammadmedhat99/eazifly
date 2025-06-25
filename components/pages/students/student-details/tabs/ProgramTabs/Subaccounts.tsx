"use client";
import { ArrowLeft2, ArrowRight2, Trash } from "iconsax-reactjs";
import { Loader } from "@/components/global/Loader";
import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { Appointments } from "./appointments";
import { Assignments } from "./assignments";
import { Feedbacks } from "./feedbacks";
import { Reports } from "./reports";

type appointmentsProps = {
  subaccountData?: any;
  isLoadingsubaccount: boolean;
  program_id: number;
};

export const Subaccounts = ({ subaccountData, isLoadingsubaccount, program_id }: appointmentsProps) => {
  const [selectedTab, setSelectedTab] = useState("appointments");
  const [currentIndex, setCurrentIndex] = useState(0);

  const students = subaccountData?.data || [];

  const handleNext = () => {
    if (currentIndex < students.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const currentStudent = students[currentIndex];

  const {
    data: appointmentData,
    isLoading: isLoadingappointment,
    } = useQuery({
    queryKey: ["subaccountAppointments", currentStudent.id, program_id],
    queryFn: async () =>
        await fetchClient(`client/user/appointments/${currentStudent.id}`, {
        ...axios_config,
        params: {
            program_id: program_id,
        },
        }),
    enabled: selectedTab === "appointments" && !!currentStudent?.id,
    });

    const {
    data: reportData,
    isLoading: isLoadingReport,
    } = useQuery({
    queryKey: ["subaccountReports", currentStudent.id, program_id],
    queryFn: async () =>
        await fetchClient(`client/user/program/reports`, {
        ...axios_config,
        params: {
            user_id: currentStudent.id,
            program_id: program_id,
        },
        }),
    enabled: selectedTab === "reports" && !!currentStudent?.id,
    });

    const {
    data: assignmentData,
    isLoading: isLoadingassignment,
    } = useQuery({
    queryKey: ["subaccountssignments", currentStudent.id, program_id],
    queryFn: async () =>
        await fetchClient(`client/user/assignment/${currentStudent.id}`, {
        ...axios_config,
        params: {
            program_id: program_id,
        },
        }),
     enabled: selectedTab === "assignments" && !!currentStudent?.id,
    });

    const {
    data: feedbackData,
    isLoading: isLoadingfeedback,
    } = useQuery({
    queryKey: ["subaccountfeedbacks", currentStudent.id, program_id],
    queryFn: async () =>
        await fetchClient(`client/user/feedback/${currentStudent.id}`, {
        ...axios_config,
        params: {
            program_id: program_id,
        },
        }),
     enabled: selectedTab === "feedbacks" && !!currentStudent?.id,
    });

  return (
    <div className="flex flex-col gap-2">
      {isLoadingsubaccount ? (
        <Loader />
      ) : students.length > 0 ? (
        <div className="rounded-2xl border border-stroke flex flex-col">
          {/* Header Section */}
          <div className="flex items-center justify-between bg-background px-5 py-3 border-b">
            {/* Students & Pagination */}
            <div className="flex flex-col gap-3 items-center">
              <span className="text-sm font-bold">الطلاب</span>
              <div className="flex items-center gap-4">
                <button onClick={handlePrev} disabled={currentIndex === 0}>
                  <ArrowRight2
                    size="24"
                    variant="Bold"
                    className={currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}
                  />
                </button>
                <span>{currentIndex + 1} / {students.length}</span>
                <button onClick={handleNext} disabled={currentIndex === students.length - 1}>
                  <ArrowLeft2
                    size="24"
                    variant="Bold"
                    className={currentIndex === students.length - 1 ? "opacity-30 cursor-not-allowed" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Student Info */}
            <div className="flex flex-col gap-3 items-start">
              <span className="text-[#5E5E5E] text-sm font-bold">إسم الطالب</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">
                  {currentStudent.first_name} {currentStudent.last_name}
                </span>
                <button>
                  <Trash className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                aria-label="sub-tabss"
                classNames={{
                  cursor: "bg-primary",
                  tabContent:
                    "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
                  tabList: "bg-[#EAF0FD] p-1.5 border border-primary border-opacity-50",
                }}
              >
                <Tab key="appointments" title="المواعيد" />
                <Tab key="assignments" title="التسليمات" />
                <Tab key="reports" title="التقارير" />
                <Tab key="feedbacks" title="الملاحظات" />
              </Tabs>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5">
                {selectedTab === "appointments" && (
                    <Appointments
                        appointmentData={appointmentData}
                        isLoadingappointment={isLoadingappointment}
                    />
                )}
                {selectedTab === "assignments" && (
                    <Assignments
                        assignmentData={assignmentData} 
                        isLoadingassignment={isLoadingassignment}
                    />
                )}
                {selectedTab === "reports" && (
                    <Reports
                        reportData={reportData} 
                        isLoadingReport={isLoadingReport}
                    />
                )}
                {selectedTab === "feedbacks" && (
                    <Feedbacks
                        feedbackData={feedbackData} 
                        isLoadingfeedback={isLoadingfeedback}
                    />
                )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center">
          لا توجد بيانات حالية للعرض
        </div>
      )}
    </div>
  );
};
