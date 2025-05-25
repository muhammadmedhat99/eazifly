import React from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  cn,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";

import Select from "@/components/global/ClientOnlySelect";
import { customStyles } from "@/lib/const";
import WeeklyWorkingHours from "./WeeklyWorkingHours";

type Option = {
  value: string;
  label: string;
};
const options: Option[] = [
  {
    value: "1",
    label: "مستوي 1",
  },
  {
    value: "2",
    label: "مستوي 2",
  },
  {
    value: "3",
    label: "مستوي 3",
  },
];

const ageOptions: Option[] = [
  { value: "6-10", label: "من 6 إلى 10 سنوات" },
  { value: "11-14", label: "من 11 إلى 14 سنة" },
  { value: "15-18", label: "من 15 إلى 18 سنة" },
];

const schema = yup
  .object({
    experience: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد سنوات الخبرة"),
    education_level: yup.array()
      .of(yup.string())
      .min(1, "اخترالمستويات الدراسية")
      .required("اخترالمستويات الدراسية"),
    female_age_group: yup.array()
      .of(yup.string())
      .min(1, "اختر الفئات العمرية")
      .required("اختر الفئات العمرية"),
    male_age_group: yup.array()
      .of(yup.string())
      .min(1, "اختر الفئات العمرية")
      .required("اختر الفئات العمرية"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const SpecialtiesForm = ({
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

  const onSubmit = (data: FormData) => {
    console.log(data)
    setActiveStep(2);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Input
        label="عدد سنوات الخبرة"
        placeholder="نص الكتابه"
        type="text"
        {...register("experience")}
        isInvalid={!!errors.experience?.message}
        errorMessage={errors.experience?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />

      <Controller
        name="education_level"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-[#272727] font-bold text-sm">
              المستويات الدراسية
            </label>
            <Select
              {...field}
              id="education_level"
              placeholder="اختر المستويات الدراسية"
              options={options}
              isMulti={true}
              styles={customStyles}
              isClearable
              value={options.filter((opt) => field.value?.includes(opt.value))}
              onChange={(selected) =>
                field.onChange((selected as Option[]).map((opt) => opt.value))
              }
            />
            <p className="text-xs text-danger">
              {errors?.education_level?.message}
            </p>
          </div>
        )}
      />

      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[#272727] font-bold text-sm">الفئات العمرية</label>
        
        <div className="border p-4 rounded-lg bg-gray-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            {/* الإناث */}
            <Controller
              name="female_age_group"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2 flex-1 items-center">
                  <label className="text-[#272727] font-bold text-sm">إناث</label>
                  <Select
                    {...field}
                    id="female_age_group"
                    placeholder="اختر الفئة العمرية"
                    options={ageOptions}
                    isMulti={true}
                    isClearable
                    styles={customStyles}
                    value={ageOptions.filter((opt) => field.value?.includes(opt.value))}
                    onChange={(newValue) => {
                      const selected = newValue as Option[] | null;
                      const values = selected?.map((opt) => opt.value) || [];
                      field.onChange(values);
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-danger">{errors?.female_age_group?.message}</p>
                </div>
              )}
            />

            {/* الذكور */}
            <Controller
              name="male_age_group"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2 flex-1 items-center">
                  <label className="text-[#272727] font-bold text-sm">ذكور</label>
                  <Select
                    {...field}
                    id="male_age_group"
                    placeholder="اختر الفئة العمرية"
                    options={ageOptions}
                    isMulti={true}
                    isClearable
                    styles={customStyles}
                    value={ageOptions.filter((opt) => field.value?.includes(opt.value))}
                    onChange={(newValue) => {
                      const selected = newValue as Option[] | null;
                      const values = selected?.map((opt) => opt.value) || [];
                      field.onChange(values);
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-danger">{errors?.male_age_group?.message}</p>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <WeeklyWorkingHours/>

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
          التالي
        </Button>
      </div>
    </form>
  );
};
