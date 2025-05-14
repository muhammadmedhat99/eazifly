"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button, DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";

const schema = yup
  .object({
    full_name: yup
      .string()
      .required("ادخل الاسم بالكامل")
      .min(3, "الاسم بالكامل لا يجب ان يقل عن ٣ احرف"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    type: yup.string().required("برجاء اختيار الجنس"),
    birth_date: yup.string().required("ادخل تاريخ الميلاد"),
    country: yup.string().required("إختر الدولة"),
    file: yup.mixed().required("الرجاء تحميل ملف"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const InformationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Input
        label="الاسم بالكامل"
        placeholder="نص الكتابه"
        type="text"
        {...register("full_name")}
        isInvalid={!!errors.full_name?.message}
        errorMessage={errors.full_name?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
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
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              field.onChange(Array.from(keys)[0]);
              console.log(Array.from(keys)[0]);
            }}
            label="الجنس"
            labelPlacement="outside"
            placeholder="اختر الجنس"
            isInvalid={!!errors.type?.message}
            errorMessage={errors.type?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "1", label: "ذكر" },
              { key: "2", label: "انثي" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="birth_date"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="تاريخ الميلاد"
            labelPlacement="outside"
            value={field.value ? (field.value as any) : null}
            onChange={field.onChange}
            isInvalid={!!errors.birth_date?.message}
            errorMessage={errors.birth_date?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
            }}
          />
        )}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            label="الدولة"
            labelPlacement="outside"
            placeholder="اختر الدولة"
            isInvalid={!!errors.country?.message}
            errorMessage={errors.country?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "1", label: "مصر" },
              { key: "2", label: "المملكة العربيه السعوديه" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="file"
        control={control}
        render={({ field, fieldState }) => (
          <DropzoneField
            value={(field.value as any) || []}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <div className="flex items-center justify-end gap-4 mt-8">
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
          التالي
        </Button>
      </div>
    </form>
  );
};
