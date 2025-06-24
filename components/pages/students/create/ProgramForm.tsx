"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  cn,
  Input,
  Radio,
  RadioGroup,
  Select as HeroSelect,
  SelectItem,
  addToast,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";

import Select from "@/components/global/ClientOnlySelect";
import { axios_config, customStyles } from "@/lib/const";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";

type Option = {
  value: string;
  label: string;
};
const options: Option[] = [
  {
    value: "1",
    label: "30 دقيقه",
  },
  {
    value: "2",
    label: "60 دقيقه",
  },
  {
    value: "3",
    label: "90 دقيقه",
  },
  {
    value: "4",
    label: "120 دقيقه",
  },
];

const schema = yup
  .object({
    program: yup.string().required("اختر البرنامج"),
    number_of_students: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد الطلاب"),
    number_of_lessons: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد الحصص"),
    lesson_duration: yup.string().required("اختر مدة الحصة"),
    payment_plan: yup.string().required("اختر خطة الدفع"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ProgramForm = ({
  setActiveStep, setStudentCount, setProgramId, setPlanData,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setStudentCount: (count: string) => void;
  setProgramId: (count: string) => void;
  setPlanData: (count: string) => void;
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = (data: FormData) => CreateProgram.mutate(data);

  const CreateProgram = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("subscripe_days", submitData.payment_plan.toString());
      formdata.append("program_id", submitData.program);
      formdata.append("number_of_session_per_week", submitData.number_of_lessons.toString());
      formdata.append("duration", submitData.lesson_duration);

      return postData("client/program/plan", formdata, myHeaders);
    },
    onSuccess: (data, variables) => {
      if (data.message !== "success") {
        addToast({
          title: data?.message,
          color: "warning",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        setPlanData(data?.data);
        setStudentCount(variables.number_of_students.toString());
        setProgramId(variables.program.toString());
        reset();
        setActiveStep(2);
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

  const { data: programData, isLoading: isProgramDataLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => await fetchClient(`client/program`, axios_config),
  });

  const { data: planData, isLoading: isPlanDataLoading } = useQuery({
    queryKey: ['plans', selectedProgramId],
    queryFn: async () => await fetchClient(`client/plans/${selectedProgramId}`, axios_config),
    enabled: !!selectedProgramId,
  });

  const months = planData?.data?.subscripe_months || [];
  const days = planData?.data?.subscripe_days || [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Controller
        name="program"
        control={control}
        render={({ field }) => (
          <HeroSelect
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              const id = Array.from(keys)[0];
              field.onChange(id);
              setSelectedProgramId(id);
            }}
            label="البرنامج"
            labelPlacement="outside"
            placeholder="اختر البرنامج"
            isInvalid={!!errors.program?.message}
            errorMessage={errors.program?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {programData?.data?.map((item: any) => (
              <SelectItem key={`${item.id}`}>{item.title}</SelectItem>
            ))}
          </HeroSelect>
        )}
      />

      <Controller
        name="payment_plan"
        control={control}
        render={({ field }) => (
          <RadioGroup
            {...field}
            value={field.value}
            onChange={(key) => field.onChange(key)}
            isInvalid={!!errors.payment_plan?.message}
            errorMessage={errors.payment_plan?.message}
            label="خطة الإشتراك"
            classNames={{
              wrapper: "flex-row",
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
            }}
          >
            {months.length && days.length ? (
              // ✅ لو عندك داتا من الـ API (dynamic)
              months.map((monthLabel, index) => (
                <Radio
                  key={days[index]} // value from subscripe_days
                  value={days[index]}
                  classNames={{
                    base: cn(
                      "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                      "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                      "data-[selected=true]:border-primary"
                    ),
                    label: "text-xs group-data-[selected=true]:text-primary",
                  }}
                >
                  {monthLabel}
                </Radio>
              ))
            ) : (
              <>
                <Radio value="per_month" isDisabled classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "cursor-not-allowed opacity-50"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}>
                  شهري
                </Radio>
                <Radio value="3_months" isDisabled classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "cursor-not-allowed opacity-50"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}>
                  3 شهور
                </Radio>
                <Radio value="6_month" isDisabled classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "cursor-not-allowed opacity-50"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}>
                  6 شهور
                </Radio>
                <Radio value="year" isDisabled classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "cursor-not-allowed opacity-50"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}>
                  سنوي
                </Radio>
              </>
            )}
          </RadioGroup>
        )}
      />

      <Controller
        name="number_of_lessons"
        control={control}
        render={({ field }) => (
          <HeroSelect
            {...field}
            isDisabled={!planData?.data?.number_of_session_per_week?.length}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            label="عدد حصص البرنامج"
            labelPlacement="outside"
            placeholder="اختر عدد الحصص"
            isInvalid={!!errors.number_of_lessons?.message}
            errorMessage={errors.number_of_lessons?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
            endContent={
              <span className="text-black-text font-bold text-sm">حصه</span>
            }
          >
            {(planData?.data?.number_of_session_per_week ?? []).map((num) => (
              <SelectItem key={num}>{num}</SelectItem>
            ))}
          </HeroSelect>
        )}
      />


      <Controller
        name="lesson_duration"
        control={control}
        render={({ field }) => (
          <HeroSelect
            {...field}
            isDisabled={!planData?.data?.duration?.length} // 👈 يتفتح بس لما توصل الداتا
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              field.onChange(Array.from(keys)[0]);
            }}
            label="مدة المحاضره"
            labelPlacement="outside"
            placeholder="اختر مدة المحاضرة"
            isInvalid={!!errors.lesson_duration?.message}
            errorMessage={errors.lesson_duration?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {(planData?.data?.duration ?? []).map((duration: string) => (
              <SelectItem key={duration}>{`${duration} دقيقة`}</SelectItem>
            ))}
          </HeroSelect>
        )}
      />


      <Input
        label="عدد الطلاب"
        placeholder="نص الكتابه"
        type="text"
        {...register("number_of_students")}
        isInvalid={!!errors.number_of_students?.message}
        errorMessage={errors.number_of_students?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
        disabled={!selectedProgramId}
      />

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
          // isDisabled={CreateStudent?.isPending}
        >
          {/* {CreateStudent?.isPending && <Spinner color="white" size="sm" />} */}
          التالي
        </Button>
      </div>
    </form>
  );
};
