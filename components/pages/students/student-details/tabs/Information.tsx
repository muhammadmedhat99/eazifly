"use client";
import { Edit2 } from "iconsax-reactjs";

import { Avatar, Input, Button, image, addToast } from "@heroui/react";
import { formatDate } from "@/lib/helper";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import * as yup from "yup";

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
    };
  };
  onUpdated?: any;
};

const schema = yup
  .object({
    first_name: yup
      .string()
      .required("ادخل الاسم الأول")
      .min(3, "الاسم الأول لا يجب ان يقل عن ٣ احرف"),
    last_name: yup
      .string()
      .required("ادخل الاسم الأخير")
      .min(3, "الاسم الأخير لا يجب ان يقل عن ٣ احرف"),
    user_name: yup
      .string()
      .required("ادخل اسم المستخدم")
      .min(3, "اسم المستخدم لا يجب ان يقل عن ٣ احرف"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    whats_app: yup.string().required("ادخل رقم الواتس آب"),
    password: yup.string().required("ادخل كلمة المرور"),
    password_confirmation: yup
      .string()
      .required("ادخل تأكيد كلمة المرور")
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة"),
    gender: yup.string().required("برجاء اختيار الجنس"),
    age: yup.string().required("ادخل العمر"),
    country: yup.string().required("إختر الدولة"),
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

export const Information = ({ data, onUpdated }: StudentDetailsProps) => {
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      first_name: data?.data?.first_name || "",
      last_name: data?.data?.last_name || "",
      email: data?.data?.email || "",
      phone: data?.data?.phone || "",
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
      formdata.append("first_name", submitData.first_name);
      formdata.append("last_name", submitData.last_name);
      formdata.append("user_name", submitData.user_name);
      formdata.append("email", submitData.email);
      formdata.append("phone", submitData.phone);
      formdata.append("whats_app", data.data.whats_app);
      formdata.append("gender", data.data.gender);
      formdata.append("age", data.data.age);
      {
        submitData.image && formdata.append("image", submitData.image[0]);
      }

      return postData(
        `client/user/update/${data.data.id}`,
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الإسم</span>
          {editField === "name" ? (
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

              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="الاسم الأول" size="sm" />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="اسم العائلة" size="sm" />
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                showFallback
                name={`${data?.data?.first_name} ${data?.data?.last_name}`}
                src={data?.data?.image}
              />
              <span className="text-black-text font-bold text-[15px]">
                {`${data?.data?.first_name} ${data?.data?.last_name}`}
              </span>
            </div>
          )}
        </div>

        {editField === "name" ? (
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
            onClick={() => setEditField("name")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            البريد الإلكتروني
          </span>
          {editField === "email" ? (
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="البريد الإلكتروني" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.email}
            </span>
          )}
        </div>

        {editField === "email" ? (
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
            onClick={() => setEditField("email")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تاريخ الإنشاء
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {formatDate(data?.data?.created_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">رقم الهاتف</span>
          {editField === "phone" ? (
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="رقم الهاتف" size="sm" />
              )}
            />
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
          <span className="text-[#5E5E5E] text-sm font-bold">الحالة</span>
          <div
            className={`text-${data?.data?.status_label?.color === "info" ? "warning" : data?.data?.status_label?.color}
              bg-${data?.data?.status_label?.color === "info" ? "warning" : data?.data?.status_label?.color} bg-opacity-10
              px-5 py-1 rounded-3xl font-bold text-[15px]`}
          >
            {data?.data?.status_label?.label}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end">
        <Button color="primary" variant="solid" className="text-white">
          إرسال رسالة
        </Button>
      </div>
    </form>
  );
};
