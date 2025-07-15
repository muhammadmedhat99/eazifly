"use client";
import { Add, ArrowLeft2, ArrowRight2, Trash } from "iconsax-reactjs";
import { Loader } from "@/components/global/Loader";
import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { Appointments } from "./appointments";
import { Assignments } from "./assignments";
import { Feedbacks } from "./feedbacks";
import { Reports } from "./reports";
import { getCookie } from "cookies-next";
import ConfirmModal from "@/components/global/ConfirmModal";
import AddSubaccountModal from "./AddSubaccountModal";

type appointmentsProps = {
  subaccountData?: any;
  isLoadingsubaccount: boolean;
  program_id: number;
  refetchSubaccounts?: () => void;
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
};

export const Subaccounts = ({
  subaccountData,
  isLoadingsubaccount,
  program_id,
  refetchSubaccounts,
  data,
}: appointmentsProps) => {
  const [selectedTab, setSelectedTab] = useState("appointments");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const ClientId = getCookie("client_id") as string;

  const students = subaccountData?.data || [];

  const handleNext = () => {
    if (currentIndex < students.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const currentStudent = students[currentIndex];
  const hasCurrentStudent = !!currentStudent?.id;


  const { data: appointmentData, isLoading: isLoadingappointment } = useQuery({
    queryKey: ["subaccountAppointments", currentStudent?.id, program_id],
    queryFn: async () =>
      await fetchClient(`client/user/appointments/${currentStudent.id}`, {
        ...axios_config,
        params: {
          program_id: program_id,
        },
      }),
    enabled: selectedTab === "appointments" && hasCurrentStudent,
  });

  const { data: reportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ["subaccountReports", currentStudent?.id, program_id],
    queryFn: async () =>
      await fetchClient(`client/user/program/reports`, {
        ...axios_config,
        params: {
          user_id: currentStudent.id,
          program_id: program_id,
        },
      }),
    enabled: selectedTab === "appointments" && hasCurrentStudent,
  });

  const { data: assignmentData, isLoading: isLoadingassignment } = useQuery({
    queryKey: ["subaccountssignments", currentStudent?.id, program_id],
    queryFn: async () =>
      await fetchClient(`client/user/assignment/${currentStudent.id}`, {
        ...axios_config,
        params: {
          program_id: program_id,
        },
      }),
    enabled: selectedTab === "appointments" && hasCurrentStudent,
  });

  const { data: feedbackData, isLoading: isLoadingfeedback } = useQuery({
    queryKey: ["subaccountfeedbacks", currentStudent?.id, program_id],
    queryFn: async () =>
      await fetchClient(`client/user/feedback/${currentStudent.id}`, {
        ...axios_config,
        params: {
          program_id: program_id,
        },
      }),
    enabled: selectedTab === "appointments" && hasCurrentStudent,
  });

   const handleRemove = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      var formdata = new FormData();
      formdata.append("program_id", program_id.toString());
      formdata.append("user_id", currentStudent.id);

      return postData("client/remove/user/from/program", formdata, myHeaders);
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
        refetchSubaccounts?.();
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
    handleRemove.mutate();
    setConfirmAction(false);
  };

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
                    className={
                      currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                    }
                  />
                </button>
                <span>
                  {currentIndex + 1} / {students.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === students.length - 1}
                >
                  <ArrowLeft2
                    size="24"
                    variant="Bold"
                    className={
                      currentIndex === students.length - 1
                        ? "opacity-30 cursor-not-allowed"
                        : ""
                    }
                  />
                </button>
              </div>
            </div>

            {/* Student Info */}
            <div className="flex flex-col gap-3 items-start">
              <span className="text-[#5E5E5E] text-sm font-bold">
                إسم الطالب
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">
                  {currentStudent.first_name} {currentStudent.last_name}
                </span>
                <button onClick={() => setConfirmAction(true)}>
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
                  tabList:
                    "bg-[#EAF0FD] p-1.5 border border-primary border-opacity-50",
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
                client_id={+ClientId}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center">
          لا توجد بيانات حالية للعرض
        </div>
      )}
      <button
        className="flex justify-end items-center gap-1 pt-4"
        onClick={()=> setModalOpen(true)}
      >
        <Add size="24" variant="Outline" className="text-primary" />
        <span className="text-center justify-start text-primary text-sm font-bold">
          إضافة حساب فرعي
        </span>
      </button>
      <ConfirmModal
        open={confirmAction}
        title={"حذف اشتراك الطالب"}
        message={"هل أنت متأكد أنك تريد إلغاء الاشتراك؟"}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(false)}
      />
      <AddSubaccountModal isOpen={modalOpen}
        onClose={() => setModalOpen(false)} data={data} />
    </div>
  );
};
