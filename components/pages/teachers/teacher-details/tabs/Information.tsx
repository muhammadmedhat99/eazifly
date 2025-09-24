"use client";
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";

import { addToast, Avatar, Button, Input, Select, SelectItem } from "@heroui/react";
import WeeklyWorkingHours from "./WeeklyWorkingHours";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useParams, useRouter } from "next/navigation";

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
    };
  };
  onUpdated?: any;
};
const schema = yup
  .object({
    name_ar: yup
      .string()
      .required("ادخل الاسم بالعربية")
      .min(3, "الاسم بالعربية لا يجب ان يقل عن ٣ احرف"),
    name_en: yup
      .string()
      .required("ادخل الاسم الأخير")
      .min(3, "الاسم بالإنجليزية لا يجب ان يقل عن ٣ احرف"),
    address: yup.string().required("ادخل العنوان"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    whats_app: yup.string().required("ادخل رقم الواتس آب"),
    gender: yup.string().required("برجاء اختيار النوع"),
    age: yup.string().required("ادخل العمر"),
    image: yup
      .mixed<File[]>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const Information = ({ data, onUpdated  }: TeacherDetailsProps) => {
  const router = useRouter();
  const params = useParams();
  const instructor_id = params.id;
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, watch } = useForm<FormData>({
      defaultValues: {
      name_ar: data?.data?.name_ar || "",
      name_en: data?.data?.name_en || "",
      phone: data?.data?.phone || "",
      whats_app: data?.data?.whats_app || "",
      address: data?.data?.address || "",
      age: data?.data?.age || "",
      gender: data?.data?.gender || "",
      image: []
      },
    });

  const onSubmit = (data: FormData) => UpdateStudent.mutate(data);

  const UpdateStudent = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("name_ar", submitData.name_ar);
      formdata.append("name_en", submitData.name_en);
      formdata.append("email", data.data.email);
      formdata.append("phone", submitData.phone);
      formdata.append("whats_app", submitData.whats_app);
      formdata.append("gender",submitData.gender);
      formdata.append("address",submitData.address);
      formdata.append("age", submitData.age);
      formdata.append("can_approve_question", data.data.can_approve_question);
      if (submitData.image?.[0]) {
        formdata.append("image", submitData.image[0]);
      }

      return postData(
        `client/instructor/update/${data.data.id}`,
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
        onUpdated?.(data.data);
      }
      setEditField(null);
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

   const CheckOrCreateChat = useMutation({
    mutationFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("sender_type", "Client");
      formdata.append("sender_id", getCookie("client_id") as string);
      formdata.append("receiver_type", "Instructor ");
      formdata.append("receiver_id", instructor_id as string);
      formdata.append("type", "group");

      return postData("client/check/chat", formdata, myHeaders);
    },
    onSuccess: (response) => {
      if (response?.data?.id) {
        router.push(`/messages/${response.data.id}?user=${instructor_id}`);
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الإسم بالعربية</span>
          {editField === "name_ar" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <DropzoneField
                    value={field.value}
                    onChange={field.onChange}
                    description="تحميل صورة جديدة"
                  />
                )}
              />
              <Controller
                name="name_ar"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="الاسم بالعربية" size="sm" />
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              showFallback
              name={data?.data?.name_ar}
              src={data?.data?.image}
            />

            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.name_ar}
            </span>
          </div>
          )}
        </div>
        {editField === "name_ar" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("name_ar")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>
      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الإسم بالإنجليزية</span>
          {editField === "name_en" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <DropzoneField
                    value={field.value}
                    onChange={field.onChange}
                    description="تحميل صورة جديدة"
                  />
                )}
              />
              <Controller
                name="name_en"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="الاسم بالإنجليزية" size="sm" />
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                showFallback
                name={data?.data?.name_en}
                src={data?.data?.image}
              />

              <span className="text-black-text font-bold text-[15px]">
                {data?.data?.name_en}
              </span>
            </div>
          )}
        </div>
        {editField === "name_en" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("name_en")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">رقم الهاتف</span>
          {editField === "phone" ? (
            <div
              style={{ "direction": "ltr" }}
              className={`
      shadow-none border-stroke border rounded-lg px-3 py-2 flex items-center
      focus-within:border-primary transition dir-ltr
    `}
            >
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "برجاء إدخال رقم هاتف",
                  validate: (value) =>
                    isValidPhoneNumber(value || "") || "رقم الهاتف غير صحيح",
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    defaultCountry="EG"
                    value={field.value}
                    onChange={field.onChange}
                    international
                    countryCallingCodeEditable={false}
                    placeholder="ادخل رقم الهاتف"
                    className="flex-1 text-sm outline-none border-0 focus:ring-0"
                  />
                )}
              />

            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.phone}
            </span>
          )}
        </div>

        {editField === "phone" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("phone")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">رقم الواتس آب</span>
          {editField === "whats_app" ? (
            <div
              style={{ "direction": "ltr" }}
              className={`
      shadow-none border-stroke border rounded-lg px-3 py-2 flex items-center
      focus-within:border-primary transition dir-ltr
    `}
            >
              <Controller
                name="whats_app"
                control={control}
                rules={{
                  required: "برجاء إدخال رقم هاتف",
                  validate: (value) =>
                    isValidPhoneNumber(value || "") || "رقم الهاتف غير صحيح",
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    defaultCountry="EG"
                    value={field.value}
                    onChange={field.onChange}
                    international
                    countryCallingCodeEditable={false}
                    placeholder="ادخل رقم الهاتف"
                    className="flex-1 text-sm outline-none border-0 focus:ring-0"
                  />
                )}
              />

            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.whats_app}
            </span>
          )}
        </div>

        {editField === "whats_app" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("whats_app")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">العنوان</span>
          {editField === "address" ? (
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="العنوان" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.address}
            </span>
          )}
        </div>

        {editField === "address" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("address")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">العمر</span>
          {editField === "age" ? (
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="العمر" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.age}
            </span>
          )}
        </div>

        {editField === "age" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("age")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-[#5E5E5E] text-sm font-bold">النوع</span>
          {editField === "gender" ? (
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  selectedKeys={field.value ? [field.value] : [""]}
                  labelPlacement="outside"
                  placeholder="اختر النوع"
                  classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    base: "mb-4",
                    value: "text-[#87878C] text-sm",
                  }}
                >
                  {[
                    { key: "male", label: "ذكر" },
                    { key: "female", label: "انثي" },
                  ].map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.gender}
            </span>
          )}
        </div>

        {editField === "gender" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("gender")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الحالة</span>
          <div
            className={`
                text-${data?.data?.status_label?.color === "info" 
                ? "warning" 
                : data?.data?.status_label?.color || "primary"} 
                bg-${data?.data?.status_label?.color === "info" 
                ? "warning" 
                : data?.data?.status_label?.color || "primary"} bg-opacity-10
                px-5 py-1 rounded-3xl font-bold text-[15px]
            `}
            >
            {data?.data?.status_label?.label || "نشط"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
            <span className="text-[#5E5E5E] text-sm font-bold text-primary">
            التخصصات
            </span>
            <span className="text-black-text font-bold text-[15px]">
            {data?.data?.specializations?.map((specialization) => specialization.title).join("، ") || "لا يوجد تخصصات"}
            </span>
        </div>
      </div>

      <div className="flex items-end justify-end md:col-span-2">
        <Button
          color="primary"
          variant="solid"
          className="text-white"
          onPress={() => CheckOrCreateChat.mutate()}
          isLoading={CheckOrCreateChat.isPending}
        >
          إرسال رسالة
        </Button>
      </div>

      <div className="md:col-span-2 flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">مواعيد العمل</span>
          <WeeklyWorkingHours/>
        </div>
      </div>

    </form>
  );
};
