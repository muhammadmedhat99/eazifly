"use client";

import React from "react";

import { Controller, UseFormReturn } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import { Button, Input } from "@heroui/react";
import { JoditInput } from "@/components/global/JoditInput";

import { FormData } from "@/components/pages/programs/create";
import {
  LocalizedField,
  LocalizedTextArea,
} from "@/components/global/LocalizedField";

export const InformationForm = ({
  setActiveStep,
  form,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturn<FormData>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const onSubmit = (data: FormData) => console.log(data);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-4 py-14 px-8"
    >
      <LocalizedField control={control} name="title" label="إسم البرنامج" />

      <LocalizedField control={control} name="label" label="عنوان البرنامج" />

      <div className="col-span-2">
        <LocalizedTextArea
          control={control}
          name="content"
          label="محتوي البرنامج"
        />
      </div>
      <div className="col-span-2">
        <LocalizedTextArea
          control={control}
          name="goals"
          label="اهداف البرنامج"
        />
      </div>

      <div className="col-span-2">
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
      </div>

      <div className="flex items-center justify-end gap-4 mt-8 col-span-4">
        <Button
          type="button"
          onPress={() => form.reset()}
          variant="solid"
          color="primary"
          className="text-white"
        >
          إلغاء
        </Button>
        <Button
          type="button"
          variant="solid"
          color="primary"
          className="text-white"
          onPress={() => setActiveStep((prev) => prev + 1)}
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
