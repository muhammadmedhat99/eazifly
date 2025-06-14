"use client";

import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DropzoneField } from "@/components/global/DropZoneField";
import { Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import { JoditInput } from "@/components/global/JoditInput";
import { teacherAndContentSchema } from "./schemas";

export const TeacherAndContent = ({
  setActiveStep,
  programId,
  specializationId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
  specializationId: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(teacherAndContentSchema),
    defaultValues: {
      files: [{ file_name: "", show_student: false, image: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "files",
  });

  const selectedCourse = watch("courses");

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("program_id", programId);
      formData.append("specialization_id", specializationId);

      // Add all other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "files") {
          // Handle files array separately
          data.files.forEach((file: any, index: number) => {
            formData.append(`files[${index}][file_name]`, file.file_name);
            formData.append(
              `files[${index}][show_student]`,
              file.show_student.toString()
            );
            if (file.image && file.image.length > 0) {
              formData.append(`files[${index}][image]`, file.image[0]);
            }
          });
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch("/client/program/update-content", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update program content");
      }

      setActiveStep(2);
    } catch (error) {
      console.error("Error updating program content:", error);
      // Handle error
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-14 px-5 grid grid-cols-3 gap-5 items-start"
    >
      <div className="col-span-3">
        <Controller
          name="what_to_learn"
          control={control}
          render={({ field, fieldState }) => (
            <JoditInput
              value={field.value || ""}
              onChange={field.onChange}
              label="ماذا سوف يتعلم الطلاب ما الدورة ؟"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className="col-span-3">
        <Controller
          name="program_benefits"
          control={control}
          render={({ field, fieldState }) => (
            <JoditInput
              value={field.value || ""}
              onChange={field.onChange}
              label="مزايا البرنامج"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Controller
          name="courses"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              selectedKeys={field.value ? [field.value] : [""]}
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys)[0]);
                console.log(Array.from(keys)[0]);
              }}
              label="أختر المواد العلمية"
              labelPlacement="outside"
              placeholder="حدد المواد العلمية"
              isInvalid={!!errors.courses?.message}
              errorMessage={errors.courses?.message}
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                base: "mb-4",
                value: "text-[#87878C] text-sm",
              }}
            >
              {[
                { key: "1", label: "محاضرة رقم ٣" },
                { key: "2", label: "محاضرة رقم ٤" },
              ].map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
          )}
        />
        <span className="text-primary font-semibold text-sm">
          بأختيارك المواد العملية يمكنك إختيار المعلم المناسب
        </span>
      </div>

      <Controller
        name="instructor"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isDisabled={!selectedCourse}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              field.onChange(Array.from(keys)[0]);
              console.log(Array.from(keys)[0]);
            }}
            label="أختر المعلم المناسب"
            labelPlacement="outside"
            placeholder="حدد المعلم المناسب"
            isInvalid={!!errors.instructor?.message}
            errorMessage={errors.instructor?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "1", label: "محمد علي" },
              { key: "2", label: "محمد محمد" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Input
        label="سعر ساعة المعلم"
        placeholder="نص الكتابه"
        type="text"
        {...register("hour_rate")}
        isInvalid={!!errors.hour_rate?.message}
        errorMessage={errors.hour_rate?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
        endContent={<span className="font-semibold text-sm">ج.م</span>}
      />

      <div className="col-span-3 bg-primary h-px my-5" />

      {fields.map((field: any, index: number) => (
        <div className="flex flex-col gap-2" key={field.id}>
          <div className="flex gap-2">
            <Input
              placeholder="أضغط لكتابة أسم الملف"
              type="text"
              {...register(`files.${index}.file_name`)}
              isInvalid={!!errors.files?.[index]?.file_name?.message}
              errorMessage={errors.files?.[index]?.file_name?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />
            <div className="flex flex-col gap-1 -mt-2">
              <span className="text-[#272727] font-bold text-[10px]">
                عرض للطالب
              </span>
              <Controller
                name={`files.${index}.show_student`}
                control={control}
                render={({ field }) => (
                  <Switch
                    onChange={(e) => field.onChange(e.target.checked)}
                    color="primary"
                    aria-label="Automatic updates"
                    size="lg"
                  />
                )}
              />
            </div>
          </div>

          <Controller
            name={`files.${index}.image`}
            control={control}
            render={({ field, fieldState }) => (
              <DropzoneField
                value={(field.value as any) || []}
                onChange={field.onChange}
                error={fieldState.error?.message}
                label=""
              />
            )}
          />
        </div>
      ))}

      <div className="col-span-3 text-center">
        <button
          type="button"
          onClick={() =>
            append({ file_name: "", show_student: false, image: undefined })
          }
          className="text-primary font-semibold text-sm"
        >
          أضافة ملف أخر
        </button>
      </div>

      <div className="flex items-center justify-end gap-4 mt-8 col-span-3">
        <Button
          type="button"
          onPress={() => reset()}
          variant="solid"
          color="primary"
          className="text-white"
          isDisabled={isSubmitting}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          isLoading={isSubmitting}
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
