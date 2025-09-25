"use client";
import { Edit2 } from "iconsax-reactjs";

import {
  Avatar,
  Input,
  Button,
  addToast,
  Select,
  SelectItem,
} from "@heroui/react";
import { formatDate } from "@/lib/helper";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import * as yup from "yup";
import { axios_config } from "@/lib/const";
import { useParams } from "next/navigation";
import { Loader } from "@/components/global/Loader";
import { AllQueryKeys } from "@/keys";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

type StudentDetailsProps = {
  data: {
    data: {
      id: number;
      name: string;
      email: string;
      phone: string;
      image: string;
      created_at: string;
      roles: string[];
    };
  };
  onUpdated?: any;
};

const schema = yup
  .object({
    name: yup
      .string()
      .required("ادخل الاسم")
      .min(3, "الاسم لا يجب ان يقل عن ٣ احرف"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    password: yup.string().required("ادخل كلمة المرور"),
    password_confirmation: yup
      .string()
      .required("ادخل تأكيد كلمة المرور")
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة"),
    role: yup.string().required("إختر الوظيفة"),
    image: yup
      .mixed()
      .test("file-required", "الرجاء تحميل ملف صحيح", (value) => {
        if (!value) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object" && value !== null)
          return Object.keys(value).length > 0;
        return false;
      })
      .required("الرجاء تحميل ملف"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ClientsDetails = ({ data }: StudentDetailsProps) => {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      name: data?.data?.name || "",
      email: data?.data?.email || "",
      phone: data?.data?.phone || "",
      role: data?.data?.roles[0] || "",
      image: [],
    },
  });

  const { data: clientData, isLoading } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => await fetchClient(`client/show/${id}`, axios_config),
  });

  const onSubmit = (data: FormData) => UpdateClient.mutate(data);

  const UpdateClient = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("name", submitData.name);
      formdata.append("email", submitData.email);
      formdata.append("phone", submitData.phone);
      formdata.append("role", submitData.role);
      if (
        submitData.image &&
        Array.isArray(submitData.image) &&
        submitData.image[0] instanceof File
      ) {
        formdata.append("image", submitData.image[0]);
      }

      return postData(`client/update/${data.data.id}`, formdata, myHeaders);
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
        queryClient.invalidateQueries({ queryKey: ["client", id] });
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

  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryFn: async () => await fetchClient(`client/get/roles`, axios_config),
    queryKey: AllQueryKeys.GetAllRoles,
  });

  return isLoading ? (
    <Loader />
  ) : (
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
                    value={(field.value as any) || []}
                    onChange={(files) => field.onChange(files)}
                    description="تحميل صورة جديدة"
                  />
                )}
              />

              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="الاسم" size="sm" />
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                showFallback
                name={clientData?.data?.name}
                src={clientData?.data?.image}
              />
              <span className="text-black-text font-bold text-[15px]">
                {clientData?.data?.name}
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
              {clientData?.data?.email}
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
            {formatDate(clientData?.data?.created_at)}
          </span>
        </div>
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
              {clientData?.data?.phone}
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
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-[#5E5E5E] text-sm font-bold">الوظيفة</span>
          {editField === "role" ? (
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="الوظيفة"
                  selectedKeys={field.value ? [field.value] : [""]}
                  onSelectionChange={(keys) => {
                    field.onChange(Array.from(keys)[0]);
                  }}
                  placeholder="اختر الوظيفة"
                  classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    base: "mb-4",
                    value: "text-[#87878C] text-sm",
                  }}
                  isDisabled={isRolesLoading || rolesData?.data.length === 0}
                  labelPlacement="outside"
                >
                  {(rolesData?.data as { id: number; name: string }[])?.map(
                    (role) => (
                      <SelectItem key={role.name}>{role.name}</SelectItem>
                    )
                  )}
                </Select>
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {clientData?.data?.roles[0]}
            </span>
          )}
        </div>

        {editField === "role" ? (
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
            onClick={() => setEditField("role")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>
    </form>
  );
};
