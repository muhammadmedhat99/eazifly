"use client";

import { addToast, Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { JoditInput } from "@/components/global/JoditInput";

const schema = yup.object({
    communication_type: yup
        .string()
        .required("برجاء اختيار وسيلة التواصل"),

    response_status: yup
        .string()
        .required("برجاء تحديد حالة رد الطالب"),

    user_response_id: yup
      .array()
      .of(yup.number())
      .min(1, "برجاء تحديد رد الطالب")
      .required("برجاء تحديد رد الطالب"),

    renewal_status: yup
        .string()
        .required("برجاء تحديد حالة التجديد"),

    reminder_type: yup
        .string()
        .required("برجاء اختيار وسيلة التذكير"),

    reminder_date: yup
        .string()
        .required("برجاء تحديد موعد التذكير"),
    note: yup.string().default(""),
    reminder: yup.boolean().default(false),
});

type FormData = yup.InferType<typeof schema>;

type StudentDetailsProps = {
  studentInfo: {
    id: number;
    subscripe_date: string;
    subscription_status: {
      status: string;
      color: string;
    };
    user_id: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_whats_app: string;
    program_name: string;
    last_contact_date: string;
    subscriped_price: string;
    expire_date: string;
    days_to_expire: string;
    average_renewal_days: number;
    renewal_status: {
      status: string;
      color: string;
    };
  };
};

export const Action = ({studentInfo} : StudentDetailsProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
      } = useForm<FormData>({
        resolver: yupResolver(schema),
      });
    
      const onSubmit = (data: FormData) => storeCommunication.mutate(data);
    
      const storeCommunication = useMutation({
        mutationFn: (submitData: FormData) => {
          var myHeaders = new Headers();
          myHeaders.append("local", "ar");
          myHeaders.append("Accept", "application/json");
          myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
          var formdata = new FormData();
          formdata.append("user_id", `${studentInfo.user_id}`);
          formdata.append("communication_type", submitData.communication_type);
          formdata.append("response_status", submitData.response_status);
          submitData.user_response_id.forEach((id) => {
            if (id !== undefined && id !== null) {
                formdata.append("user_response_id[]", id.toString());
            }
            });
          formdata.append("renewal_status", submitData.renewal_status);
          formdata.append("reminder_type", submitData.reminder_type);
          formdata.append("reminder_date", submitData.reminder_date);
          formdata.append("note", submitData.note);
          formdata.append("reminder", submitData.reminder.toString());
          formdata.append("subscription_id", `${studentInfo.id}`);
          formdata.append("subscripe_expire_date", `${studentInfo.expire_date}`);
    
          return postData("client/user/communication/store", formdata, myHeaders);
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
            reset();
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

      const { data, isLoading } = useQuery({
          queryKey: AllQueryKeys.GetAllResponses,
          queryFn: async () => await fetchClient(`client/user/response`, axios_config),
        });

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
          <Controller
              name="communication_type"
              control={control}
              render={({ field }) => (
                  <Select
                      {...field}
                      selectedKeys={field.value ? [field.value] : [""]}
                      onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys)[0]);
                          console.log(Array.from(keys)[0]);
                      }}
                      label="وسيلة التواصل"
                      labelPlacement="outside"
                      placeholder="اختر وسيلة التواصل"
                      isInvalid={!!errors.communication_type?.message}
                      errorMessage={errors.communication_type?.message}
                      classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          base: "mb-4",
                          value: "text-[#87878C] text-sm",
                      }}
                  >
                      {[
                          { key: "email", label: "إيميل" },
                          { key: "sms", label: "رسالة نصية" },
                          { key: "call", label: "مكالمة هاتفية" },
                          { key: "whatsapp", label: "واتساب" },
                      ].map((item) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                      ))}
                  </Select>
              )}
          />
          <Controller
              name="response_status"
              control={control}
              render={({ field }) => (
                  <Select
                      {...field}
                      selectedKeys={field.value ? [field.value] : [""]}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                      label="حالة رد الطالب"
                      labelPlacement="outside"
                      placeholder="اختر حالة الرد"
                      isInvalid={!!errors.response_status?.message}
                      errorMessage={errors.response_status?.message}
                      classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          base: "mb-4",
                          value: "text-[#87878C] text-sm",
                      }}
                  >
                      {[
                          { key: "responded", label: "تم الرد" },
                          { key: "not_responded", label: "غير متاح" },
                      ].map((item) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                      ))}
                  </Select>
              )}
          />

          <Controller
              name="user_response_id"
              control={control}
              render={({ field }) => {
                   const selected: string[] = (field.value ?? []).map(String);
                  return (
                      <Select
                          selectionMode="multiple"
                          selectedKeys={selected}
                          onSelectionChange={(keys) => {
                            const ids = Array.from(keys).map(Number);
                            field.onChange(ids);
                            }}
                          label="رد الطالب"
                          labelPlacement="outside"
                          placeholder="اختر الرد"
                          isInvalid={!!errors.user_response_id?.message}
                          errorMessage={errors.user_response_id?.message}
                          classNames={{
                              label: "text-[#272727] font-bold text-sm",
                              base: "mb-4",
                              value: "text-[#87878C] text-sm",
                          }}
                      >
                          {data?.data?.map((item: any) => (
                              <SelectItem key={`${item.id}`}>{item.title}</SelectItem>
                          ))}
                      </Select>

                  );
              }}
          />

          <Controller
              name="renewal_status"
              control={control}
              render={({ field }) => (
                  <Select
                      {...field}
                      selectedKeys={field.value ? [field.value] : [""]}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                      label="حالة التجديد"
                      labelPlacement="outside"
                      placeholder="اختر حالة التجديد"
                      isInvalid={!!errors.renewal_status?.message}
                      errorMessage={errors.renewal_status?.message}
                      classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          base: "mb-4",
                          value: "text-[#87878C] text-sm",
                      }}
                  >
                      {[
                          { key: "renew", label: "تم التجديد" },
                          { key: "connected", label: "تم التواصل" },
                          { key: "not_renewed", label: "لم يتم التجديد" },
                          { key: "postpone", label: "تم التأجيل" },
                      ].map((item) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                      ))}
                  </Select>
              )}
          />

          <div className="flex">
              <Controller
                  name="reminder"
                  control={control}
                  render={({ field }) => (
                      <div>
                          <label className="text-[#272727] font-bold text-sm mb-1 block">
                              أضافة تذكير
                          </label>
                          <Switch
                              isSelected={field.value}
                              onValueChange={field.onChange}
                              color="success"
                          />
                      </div>
                  )}
              />
              <Controller
                  name="reminder_type"
                  control={control}
                  render={({ field }) => (
                      <Select
                          {...field}
                          selectedKeys={field.value ? [field.value] : [""]}
                          onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                          label="وسيلة التذكير"
                          labelPlacement="outside"
                          placeholder="اختر وسيلة التذكير"
                          isInvalid={!!errors.reminder_type?.message}
                          errorMessage={errors.reminder_type?.message}
                          classNames={{
                              label: "text-[#272727] font-bold text-sm",
                              base: "mb-4",
                              value: "text-[#87878C] text-sm",
                          }}
                      >
                          {[
                              { key: "email", label: "إيميل" },
                              { key: "sms", label: "رسالة نصية" },
                              { key: "call", label: "مكالمة هاتفية" },
                              { key: "whatsapp", label: "واتساب" },
                          ].map((item) => (
                              <SelectItem key={item.key}>{item.label}</SelectItem>
                          ))}
                      </Select>
                  )}
              />
          </div>

          <Controller
              name="reminder_date"
              control={control}
              render={({ field }) => (
                  <div className="flex flex-col gap-1">
                      <label className="text-[#272727] font-bold text-sm">موعد التذكير</label>
                      <Input
                          type="datetime-local"
                          {...field}
                      />
                      {errors.reminder_date?.message && (
                          <span className="text-red-500 text-xs mt-1">{errors.reminder_date.message}</span>
                      )}
                  </div>
              )}
          />

          <div className="col-span-2">
              <Controller
                  name="note"
                  control={control}
                  render={({ field, fieldState }) => (
                      <JoditInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          label="ملاحظه إدارية"
                          error={fieldState.error?.message}
                      />
                  )}
              />
          </div>

          <div className="flex items-center justify-center gap-5 px-6 py-4 col-span-2">
              <Button
                  type="button"
                  //   onPress={closeModal}
                  variant="solid"
                  color="primary"
                  className="text-white w-36"
              >
                  إلغاء
              </Button>
              <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  className="text-white w-36"
              >
                  حفظ
              </Button>
          </div>
      </form>
  );
};
