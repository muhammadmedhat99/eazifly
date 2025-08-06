import { Button, Input, Select, SelectItem } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { JoditInput } from "@/components/global/JoditInput";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";

const colorPalettes = [
  ["#d5e8d4", "#b7dbb4", "#9cc69b", "#7dbf8e"],     
  ["#dbeeff", "#b6d4ff", "#9db8ff", "#7e91ff"],      
  ["#e2e2e2", "#bfbfbf", "#8f8f8f", "#4d4d4d"],     
  ["#fcd5ce", "#f8a5a5", "#f28482", "#f76e6e"],     
  ["#f8f0fc", "#e0bbf3", "#d291bc", "#957dad"],     
  ["#009688", "#00BCD4", "#8BC34A", "#CDDC39"],      
  ["#fff3cd", "#ffeeba", "#ffc107", "#ffca2c"],     
  ["#d1c4e9", "#b39ddb", "#9575cd", "#7e57c2"],
];

const schema = yup
  .object({
    main_logo: yup
      .mixed<File[]>()
      .test("fileType", "الرجاء تحميل ملف صحيح", (value) => value && value.length > 0)
      .required("الرجاء تحميل ملف"),
    selectedPalette: yup
      .number()
      .typeError("برجاء اختيار ألوان المنصة")
      .required("برجاء اختيار ألوان المنصة"),
    brand_name: yup
      .string()
      .required("ادخل إسم المنصة")
      .min(3, "إسم المنصة لا يجب ان يقل عن ٣ احرف"),
    main_font_url: yup.string().required("إختر نوع الخط"),
    bio: yup.string().required("ادخل تعريف مختصر للمنصة"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    facebook: yup.string().nullable().default(""),  
    instagram: yup.string().nullable().default(""),  
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const GeneralSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedPalette: 0,
    },
  });

  useEffect(() => {
    const fetchImageAsFile = async () => {
      const response = await fetch("/img/logo/logo.svg");
      const blob = await response.blob();
      const file = new File([blob], "logo.svg", { type: blob.type });
      setValue("main_logo", [file]);
    };

    fetchImageAsFile();
  }, [setValue]);

  const onSubmit = (data: FormData) => {
    console.log("data:", data);
  };

  const { data: settingsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/setting`, axios_config),
    queryKey: AllQueryKeys.GetAllSettings,
  });
  console.log(settingsData)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2 p-8">
      <div>
        <label className="text-[#272727] font-bold text-sm mb-2 block">
          شعار المنصة
        </label>
        <div className="w-96 p-2 bg-[#F0F0F0] rounded-2xl inline-flex flex-col justify-start items-start gap-3">
          <div className="self-stretch h-40 relative bg-white rounded-lg overflow-hidden flex justify-center items-center">
            <Controller
              name="main_logo"
              control={control}
              render={({ field, fieldState }) => (
                <DropzoneField
                  value={field.value || []}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  label="الصورة"
                  description="تحميل صورة"
                />
              )}
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-[#272727] font-bold text-sm mb-2 block">
          ألوان المنصة
        </label>
        <Controller
        name="selectedPalette"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-4 gap-4">
            {colorPalettes.map((palette, index) => (
              <div
                key={index}
                onClick={() => field.onChange(index)}
                className={`flex gap-2 px-3 py-4 bg-[#F8F9FA] rounded-lg cursor-pointer transition-all ${
                  field.value === index
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-300"
                }`}
              >
                {palette.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      />
      </div>
      <Input
        label="إسم المنصة"
        placeholder="نص الكتابه"
        type="text"
        {...register("brand_name")}
        isInvalid={!!errors.brand_name?.message}
        errorMessage={errors.brand_name?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Controller
        name="main_font_url"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            label="نوع الخط"
            labelPlacement="outside"
            placeholder="اختر نوع الخط"
            isInvalid={!!errors.main_font_url?.message}
            errorMessage={errors.main_font_url?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "1", label: "sans" },
              { key: "2", label: "arabic" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />
      <div className="col-span-2">
        <Controller
        name="bio"
        control={control}
        render={({ field, fieldState }) => (
          <JoditInput
            value={field.value || ""}
            onChange={field.onChange}
            label="تعريف مختصر للمنصة"
            error={fieldState.error?.message}
          />
        )}
      />
      </div>

      <div className="-mx-9 w-[calc(100%+4.5rem)] h-px bg-[#2563EB] col-span-2" />

      <span className="text-[#272727] text-base font-bold col-span-2">
        روابط وسائل التواصل
      </span>

      <Input
        label="البريد الإلكتروني"
        placeholder="نص الكتابه"
        type="text"
        {...register("email")}
        isInvalid={!!errors.email?.message}
        errorMessage={errors.email?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="رقم الهاتف"
        placeholder="نص الكتابه"
        type="text"
        {...register("phone")}
        isInvalid={!!errors.phone?.message}
        errorMessage={errors.phone?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="فيسبوك"
        placeholder="نص الكتابه"
        type="text"
        {...register("facebook")}
        isInvalid={!!errors.facebook?.message}
        errorMessage={errors.facebook?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="الإنستجرام"
        placeholder="نص الكتابه"
        type="text"
        {...register("instagram")}
        isInvalid={!!errors.instagram?.message}
        errorMessage={errors.instagram?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />

      <div className="flex items-center justify-end gap-4 col-span-2">
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
        >
          حفظ
        </Button>
      </div>
    </form>

  );
};
