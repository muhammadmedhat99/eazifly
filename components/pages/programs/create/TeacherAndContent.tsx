"use client";

import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { TeacherAndContentFormData, teacherAndContentSchema } from "./schemas";

interface TeacherAndContentProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
  specializationId: string;
  specializationName?: string; // Add this to display the specialization name
}

export const TeacherAndContent = ({
  setActiveStep,
  programId,
  specializationId,
  specializationName = "التخصص المحدد", // Default fallback
}: TeacherAndContentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<TeacherAndContentFormData>({
    resolver: yupResolver(teacherAndContentSchema),
    defaultValues: {
      specialization_id: specializationId,
      teachers: [{ teacher_id: "", hour_rate: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teachers",
  });

  const onSubmit = async (data: TeacherAndContentFormData) => {
    try {
      const formData = new FormData();
      formData.append("program_id", programId);
      formData.append("specialization_id", data.specialization_id);

      // Add teachers array
      data.teachers.forEach((teacher, index) => {
        formData.append(`teachers[${index}][teacher_id]`, teacher.teacher_id);
        formData.append(`teachers[${index}][hour_rate]`, teacher.hour_rate);
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
      {/* Disabled Specialization Select */}
      <div className="col-span-3">
        <Controller
          name="specialization_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isDisabled={true}
              selectedKeys={[specializationId]}
              label="التخصص"
              labelPlacement="outside"
              placeholder="التخصص المحدد"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                base: "mb-4",
                value: "text-[#87878C] text-sm",
              }}
            >
              <SelectItem key={specializationId}>
                {specializationName}
              </SelectItem>
            </Select>
          )}
        />
      </div>

      <div className="col-span-3 bg-primary h-px my-5" />

      {/* Teachers Array Fields */}
      <div className="col-span-3">
        <h3 className="text-[#272727] font-bold text-lg mb-4">المعلمين</h3>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-3 gap-4 mb-6 p-4 border border-gray-200 rounded-lg"
          >
            {/* Teacher Select */}
            <div className="col-span-2">
              <Controller
                name={`teachers.${index}.teacher_id`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    selectedKeys={field.value ? [field.value] : [""]}
                    onSelectionChange={(keys) => {
                      field.onChange(Array.from(keys)[0]);
                    }}
                    label="أختر المعلم"
                    labelPlacement="outside"
                    placeholder="حدد المعلم المناسب"
                    isInvalid={!!errors.teachers?.[index]?.teacher_id?.message}
                    errorMessage={errors.teachers?.[index]?.teacher_id?.message}
                    classNames={{
                      label: "text-[#272727] font-bold text-sm",
                      base: "mb-4",
                      value: "text-[#87878C] text-sm",
                    }}
                  >
                    {[
                      { key: "1", label: "محمد علي" },
                      { key: "2", label: "محمد محمد" },
                      { key: "3", label: "أحمد حسن" },
                      { key: "4", label: "فاطمة أحمد" },
                    ].map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            {/* Hour Rate Input */}
            <div className="flex items-start gap-2">
              <Input
                label="سعر الساعة"
                placeholder="سعر الساعة"
                type="text"
                {...register(`teachers.${index}.hour_rate`)}
                isInvalid={!!errors.teachers?.[index]?.hour_rate?.message}
                errorMessage={errors.teachers?.[index]?.hour_rate?.message}
                labelPlacement="outside"
                classNames={{
                  label: "text-[#272727] font-bold text-sm",
                  inputWrapper: "shadow-none",
                  base: "mb-4",
                }}
                endContent={<span className="font-semibold text-sm">ج.م</span>}
              />

              {/* Remove Button - Only show if more than one teacher */}
              {fields.length > 1 && (
                <Button
                  type="button"
                  onPress={() => remove(index)}
                  variant="light"
                  color="danger"
                  size="sm"
                  className="mt-6"
                >
                  حذف
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add Teacher Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => append({ teacher_id: "", hour_rate: "" })}
            className="text-primary font-semibold text-sm hover:underline"
          >
            إضافة معلم آخر
          </button>
        </div>
      </div>

      {/* Form Actions */}
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
