"use client";
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";
import { addToast, Avatar, AvatarGroup, Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import ConfirmModal from "@/components/global/ConfirmModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

const fields = [
  { key: "name_ar", label: "الإسم بالعربية" },
  { key: "name_en", label: "الإسم بالإنجليزية" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "age", label: "العمر" },
  { key: "whats_app", label: "الواتساب" },
  { key: "address", label: "العنوان" },
];

type InstructorData = {
  [key: string]: any;
  id: number;
  name_en: string;
  name_ar: string;
  name: string;
  phone: string;
  email: string;
  whats_app: string;
  created_at: string;
  address: string;
  age: string;
  experience_years: string;
  gender: string;
  image: string;
};

type RequestDetailsProps = {
  data: {
    data: {
      [key: string]: any;
      id: number;
      name_ar: string;
      name_en: string;
      image: string | null;
      status: string;
      reason: string;
      phone: string;
      email: string;
      address: string | null;
      whats_app: string;
      age: string | null;
      instructor_data: InstructorData;
    }
  }
};

export const SessionRequestDetails = ({ data }: RequestDetailsProps) => {    
  const [confirmAction, setConfirmAction] = useState(false);
  const [action, setAction] = useState<"approved" | "canceled" | null>(null);
  const router = useRouter();

  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    if (!action) return;
    UpdateInstructor.mutate();
  };

  const UpdateInstructor = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      if(action){
        formdata.append("status", action);
      }

      return postData(
        `client/change/session/request/${data.data.id}`,
        formdata,
        myHeaders
      );
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
        router.push(`/teachers/requests/sessions`);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 gap-5">
      <ConfirmModal
        open={confirmAction}
        onCancel={() => setConfirmAction(false)}
        onConfirm={() => {
          if (action) {
            UpdateInstructor.mutate();
          }
          setConfirmAction(false);
        }}
        title={action === "approved" ? "تأكيد الموافقة" : "تأكيد الرفض"}
        message={
          action === "approved"
            ? "هل أنت متأكد من أنك تريد الموافقة على هذا الطلب ؟"
            : "هل أنت متأكد من أنك تريد رفض هذا الطلب ؟"
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            إسم المعلم
          </h3>
          <span
            className="font-semibold text-gray-800"
          >
            {data.data.session.instructor}
          </span>
        </div>
        {data.data.session?.users?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md">
            <h3 className="text-sm font-bold text-gray-700 mb-3">المستخدمين</h3>
            <div className="flex flex-wrap gap-4">
              <AvatarGroup isBordered max={3}>
                {data.data.session?.users?.map((user: any) => (
                  <Avatar
                    title={user?.user_name}
                    key={user?.id}
                    src={user?.user_image}
                    name={user?.user_name}
                    showFallback
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>
        )}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3">
          سبب الطلب
          </h3>
          <span
            className="font-semibold text-gray-800"
          >
            {data.data.reason}
          </span>
        </div>
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3">
          البرنامج
          </h3>
          <span
            className="font-semibold text-gray-800"
          >
            {data.data.session.program_title}
          </span>
        </div>
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3">
          تاريخ المحاضرة
          </h3>
          <span
            className="font-semibold text-gray-800"
          >
            {data.data.session.session_date}
          </span>
        </div>
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3">
          وقت المحاضرة
          </h3>
          <span
            className="font-semibold text-gray-800"
          >
            {data.data.session.session_time}
          </span>
        </div>
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md col-span-2"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3">
          ملاحظات
          </h3>
          <span
            className="font-semibold text-gray-800"
          >
            {data.data.notes}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
        <Button
          type="button"
          variant="solid"
          color="danger"
          className="text-white"
          onPress={() => {
            setAction("canceled");
            setConfirmAction(true);
          }}
          isDisabled={UpdateInstructor?.isPending}
          
        >
          رفض
        </Button>
        <Button
          type="button"
          variant="solid"
          color="primary"
          className="text-white"
          onPress={() => {
            setAction("approved");
            setConfirmAction(true);
          }}
          isDisabled={UpdateInstructor?.isPending}
        >
          {UpdateInstructor?.isPending && <Spinner color="white" size="sm" />}
          موافقة
        </Button>
      </div>

    </form>
  );
};
