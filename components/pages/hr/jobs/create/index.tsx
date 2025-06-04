"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  addToast,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Avatar,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import React from "react";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import Image from "next/image";
import { JoditInput } from "@/components/global/JoditInput";

const schema = yup
  .object({
    title: yup
      .string()
      .required("ادخل عنوان الوظيفة"),
    department: yup
      .string()
      .required("برجاء اختيار القسم"),
    job_type: yup
      .string()
      .required("ادخل اسم المستخدم")
      .min(3, "اسم المستخدم لا يجب ان يقل عن ٣ احرف"),
    required_employees_count: yup
      .string()
      .required("ادخل عدد الموظفين المطلوبين"),
    work_location: yup.string().required("ادخل مكان العمل"),
    hiring_date: yup.string().required("ادخل تاريخ التعيين"),
    job_description: yup.string().required("ادخل وصف الوظيفة"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const CreateJob = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  const { data, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllCountries,
    queryFn: async () => await fetchClient(`client/countries`, axios_config),
  });

  return isLoading ? (
    <Loader />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Input
        label="عنوان الوظيفة"
        placeholder="نص الكتابه"
        type="text"
        {...register("title")}
        isInvalid={!!errors.title?.message}
        errorMessage={errors.title?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              field.onChange(Array.from(keys)[0]);
              console.log(Array.from(keys)[0]);
            }}
            label="القسم"
            labelPlacement="outside"
            placeholder="اختر القسم"
            isInvalid={!!errors.department?.message}
            errorMessage={errors.department?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "1", label: "قسم 1" },
              { key: "2", label: "قسم 2" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Input
        label="نوع التوظيف"
        placeholder="نص الكتابه"
        type="text"
        {...register("job_type")}
        isInvalid={!!errors.job_type?.message}
        errorMessage={errors.job_type?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="عدد الموظفين المطلوبين"
        placeholder="نص الكتابه"
        type="text"
        {...register("required_employees_count")}
        isInvalid={!!errors.required_employees_count?.message}
        errorMessage={errors.required_employees_count?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="مكان العمل"
        placeholder="نص الكتابه"
        type="text"
        {...register("work_location")}
        isInvalid={!!errors.work_location?.message}
        errorMessage={errors.work_location?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="تاريخ التعيين"
        placeholder="نص الكتابه"
        type="date"
        {...register("hiring_date")}
        isInvalid={!!errors.hiring_date?.message}
        errorMessage={errors.hiring_date?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
       <div className="col-span-2">
        <Controller
          name="job_description"
          control={control}
          render={({ field, fieldState }) => (
            <JoditInput
              value={field.value || ""}
              onChange={field.onChange}
              label="وصف الوظيفة"
              error={fieldState.error?.message}
            />
          )}
        />
       </div>
       
      <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
        <Button
          type="button"
          onPress={() => reset()}
          variant="solid"
          color="primary"
          className="text-white"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
        >
          نشر
        </Button>
      </div>
    </form>
  );
};
