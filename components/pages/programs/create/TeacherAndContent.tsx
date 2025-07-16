"use client";

import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addToast, Button, Input, Select, SelectItem } from "@heroui/react";
import { TeacherAndContentFormData, teacherAndContentSchema } from "./schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { getCookie } from "cookies-next";

interface TeacherAndContentProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
  specializationId: string;
  specializationName?: string;
  initialData?: any;
  mode?: string;
}
interface Specialization {
  id: string;
  title: string;
}
export const TeacherAndContent = ({
  setActiveStep,
  programId,
  specializationId,
  specializationName = "التخصص المحدد",
  initialData,
  mode
}: TeacherAndContentProps) => {
  const { data: specializations, isLoading: loadingSpecializations } = useQuery(
    {
      queryFn: async (): Promise<{ data: Specialization[] }> =>
        await fetchClient(`client/Specializations`, axios_config),
      queryKey: AllQueryKeys.GetAllSpecializations,
    }
  );
  const { data: instructors, isLoading: instructorsLoading } = useQuery({
    queryFn: async () => await fetchClient(`client/program/related/instructors?program_id=${programId}`, axios_config),
    queryKey: ["GetRelatedInstructores", programId],
  });

  let defaultValues: TeacherAndContentFormData = {
    specialization_id: specializationId,
    teachers: [{ teacher_id: "", hour_rate: "" }],
  };

  if (initialData.data?.instructors?.length) {
    defaultValues.teachers = initialData.data.instructors.map((instructor: any) => ({
      teacher_id: instructor.id?.toString() || "",
      hour_rate: instructor.amount_per_hour?.toString() || "",
    }));
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<TeacherAndContentFormData>({
    resolver: yupResolver(teacherAndContentSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData?.data.instructors?.length) {
      reset({
        specialization_id: specializationId,
        teachers: initialData.data.instructors.map((instructor: any) => ({
          teacher_id: instructor.id?.toString() || "",
          hour_rate: instructor.amount_per_hour?.toString() || "",
        })),
      });
    }
  }, [initialData, reset, specializationId]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "teachers",
  });

  const onSubmit = async (data: TeacherAndContentFormData) => {
    assignInstructorsMutation.mutate(data);
  };

  const assignInstructorsMutation = useMutation({
    mutationFn: (submitData: TeacherAndContentFormData) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = {
        program_id: programId,
        specialization_id: submitData.specialization_id,
        instructor_id: submitData.teachers.map((teacher) => teacher.teacher_id),
        amount_per_hour: submitData.teachers.map(
          (teacher) => teacher.hour_rate
        ),
      };

      return postData(
        "client/program/assign/instructor",
        JSON.stringify(formdata),
        myHeaders
      );
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error creating program: ${data.message}`,
          color: "danger",
        });
      } else {
        setActiveStep(2);
        addToast({
          title: data?.message,
          color: "success",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Error creating program:", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

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
              isLoading={loadingSpecializations}
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
              {specializations?.data?.map((specialization: Specialization) => (
                <SelectItem key={specialization.id}>
                  {specialization.title}
                </SelectItem>
              )) ?? []}
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
                    isLoading={instructorsLoading}
                    classNames={{
                      label: "text-[#272727] font-bold text-sm",
                      base: "mb-4",
                      value: "text-[#87878C] text-sm",
                    }}
                    scrollShadowProps={{
                      isEnabled: false,
                    }}
                    maxListboxHeight={200}
                  >
                    {instructors?.data?.map(
                      (item: { id: string; name_ar: string }) => (
                        <SelectItem key={item.id}>{item.name_ar}</SelectItem>
                      )
                    )}
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
          variant="bordered"
          color="primary"
          isDisabled={assignInstructorsMutation.isPending}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          isLoading={assignInstructorsMutation.isPending}
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
