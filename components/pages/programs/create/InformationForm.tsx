"use client";

import React from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DropzoneField } from "@/components/global/DropZoneField";
import { Button, Input } from "@heroui/react";
import { JoditInput } from "@/components/global/JoditInput";

const schema = yup
  .object({
    name: yup
      .string()
      .required("ادخل الاسم بالعربية")
      .min(3, "الاسم بالعربية لا يجب ان يقل عن ٣ احرف"),
    description: yup.string().required("ادخل الوصف"),
    image: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
    cover_image: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const InformationForm = ({
  setActiveStep,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
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
      className="grid grid-cols-1 gap-4 md:grid-cols-3 py-14 px-8"
    >
      <Controller
        name="image"
        control={control}
        render={({ field, fieldState }) => (
          <DropzoneField
            value={(field.value as any) || []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            label="صورة البرنامج"
          />
        )}
      />
      <div className="col-span-2">
        <Controller
          name="cover_image"
          control={control}
          render={({ field, fieldState }) => (
            <DropzoneField
              value={(field.value as any) || []}
              onChange={field.onChange}
              error={fieldState.error?.message}
              label="صورة الغلاف"
            />
          )}
        />
      </div>
      <Input
        label="إسم البرنامح"
        placeholder="نص الكتابه"
        type="text"
        {...register("name")}
        isInvalid={!!errors.name?.message}
        errorMessage={errors.name?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4 col-span-2",
        }}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <JoditInput
            value={field.value || ""}
            onChange={field.onChange}
            label="وصف البرنامج"
            error={fieldState.error?.message}
          />
        )}
      />

      <div className="flex items-center justify-end gap-4 mt-8 col-span-3">
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
          // isDisabled={CreateStudent?.isPending}
        >
          {/* {CreateStudent?.isPending && <Spinner color="white" size="sm" />} */}
          التالي
        </Button>
      </div>
    </form>
  );
};
