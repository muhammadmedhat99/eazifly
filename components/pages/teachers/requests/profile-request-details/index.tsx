"use client";
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";
import { addToast, Avatar, Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
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

export const ProfileRequestDetails = ({ data }: RequestDetailsProps) => {
  const [confirmAction, setConfirmAction] = useState(false);
  const [action, setAction] = useState<"approved" | "rejected" | null>(null);
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
        `client/instructor/update/profile/${data.data.id}`,
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
        router.push(`/teachers/requests`);
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
        onCancel={() => {
          setConfirmAction(false);
        }}
        onConfirm={() => {
          setAction("rejected");     
          UpdateInstructor.mutate();  
          setConfirmAction(false);
        }}
        title="تأكيد الرفض"
        message="هل أنت متأكد من أنك تريد رفض هذا الطلب ؟"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, index) => {
          const oldValue = data?.data?.instructor_data?.[field.key] ?? "-";
          const newValue = data?.data?.[field.key] ?? "-";
          const changed = oldValue !== newValue;

          return (
            <div
              key={field.key}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md 
              ${index === fields.length - 1 ? "md:col-span-2" : ""}`}
            >
              {/* عنوان الحقل */}
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                {field.label}
              </h3>

              {/* القيم */}
              <div className="flex flex-col gap-1">
                {changed && (
                  <span className="text-gray-400 text-sm line-through">
                    {oldValue}
                  </span>
                )}
                <span
                  className={`font-semibold ${changed ? "text-primary" : "text-gray-800"
                    }`}
                >
                  {newValue}
                </span>
              </div>
            </div>
          );
        })}
        {(data?.data?.image || data?.data?.instructor_data?.image) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md col-span-2">
            <h3 className="text-sm font-bold text-gray-700 mb-3">الصورة</h3>
            <div className="flex gap-8">
              {data?.data?.instructor_data?.image && (
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={data.data.instructor_data.image}
                    alt="Old Image"
                    width={120}
                    height={120}
                    className="rounded-xl border border-gray-300 object-cover"
                  />
                  <span className="text-xs font-semibold text-gray-600">القديمة</span>
                </div>
              )}

              {data?.data?.image && (
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={data.data.image}
                    alt="New Image"
                    width={120}
                    height={120}
                    className="rounded-xl border-2 border-green-500 object-cover"
                  />
                  <span className="text-xs font-semibold text-green-600">الجديدة</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
        <Button
          type="button"
          variant="solid"
          color="danger"
          className="text-white"
          onPress={() => {
            setAction("rejected");
            setConfirmAction(true);
          }}
          isDisabled={UpdateInstructor?.isPending}
        >
          رفض
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          onPress={() => setAction("approved")}
          isDisabled={UpdateInstructor?.isPending}
        >
          {UpdateInstructor?.isPending && <Spinner color="white" size="sm" />}
          موافقة
        </Button>
      </div>

    </form>
  );
};
