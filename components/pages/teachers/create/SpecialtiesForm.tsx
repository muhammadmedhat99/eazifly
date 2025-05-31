"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addToast,
  Button,
  Input,
} from "@heroui/react";
import Select from "@/components/global/ClientOnlySelect";
import { customStyles } from "@/lib/const";
import { CloseCircle } from "iconsax-reactjs";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

const schema = yup
  .object({
    experience: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد سنوات الخبرة"),
    specializations: yup.array()
      .of(yup.number())
      .min(1, "اخترالتخصصات")
      .required("اخترالتخصصات"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

type SpecialtiesFormProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  teacherId: number | null; 
  Specializations: {
    data: {
      id: number;
      title: string;
    }[];
    status: number;
    message: string;
  };
};

export const SpecialtiesForm = ({
  setActiveStep,
  teacherId,
  Specializations,
}: SpecialtiesFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [femalePeriods, setFemalePeriods] = useState([{ from: '', to: '' }]);
  const [malePeriods, setMalePeriods] = useState([{ from: '', to: '' }]);

  const handleInputChange = (
    gender: 'female' | 'male',
    index: number,
    field: 'from' | 'to',
    value: string
  ) => {
    const updated = gender === 'female' ? [...femalePeriods] : [...malePeriods];
    updated[index][field] = value;
    gender === 'female' ? setFemalePeriods(updated) : setMalePeriods(updated);
  };

  const handleAddPeriod = (gender: 'female' | 'male') => {
    gender === 'female'
      ? setFemalePeriods([...femalePeriods, { from: '', to: '' }])
      : setMalePeriods([...malePeriods, { from: '', to: '' }]);
  };

  const handleRemovePeriod = (gender: 'female' | 'male', index: number) => {
    gender === 'female'
      ? setFemalePeriods(femalePeriods.filter((_, i) => i !== index))
      : setMalePeriods(malePeriods.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => CreateSpecialization.mutate(data);

  const CreateSpecialization = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      const body = {
        instructor_id: teacherId,
        specialization_id: submitData.specializations,   
        experience_years: submitData.experience,
        female: femalePeriods.map(p => ({
          from: parseInt(p.from),
          to: parseInt(p.to),
        })),
        male: malePeriods.map(p => ({
          from: parseInt(p.from),
          to: parseInt(p.to),
        })),
      };
      return postData("client/instructor/Specialization/store", JSON.stringify(body), myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
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
        name="specializations"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-[#272727] font-bold text-sm">
              التخصصات
            </label>
            <Select
              {...field}
              id="specializations"
              placeholder="اختر التخصصات"
              options={Specializations.data.map((item) => ({
                value: item.id, 
                label: item.title,
              }))}
              isMulti={true}
              styles={customStyles}
              isClearable
              value={Specializations.data
                .map((item) => ({ value: item.id, label: item.title }))
                .filter((opt) => field.value?.includes(opt.value))}
              onChange={(selected) =>
                field.onChange((selected as Option[]).map((opt) => Number(opt.value))) 
              }
            />
            <p className="text-xs text-danger">
              {errors?.specializations?.message}
            </p>
          </div>
        )}
      />

      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[#272727] font-bold text-sm">الفئات العمرية</label>
        
        <div className="border p-4 rounded-lg bg-gray-50 flex flex-col gap-4">
          <div>
            <label className="text-[#272727] font-bold text-sm">إناث</label>
            {femalePeriods.map((period, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={period.from}
                  placeholder="من"
                  onChange={(e) => handleInputChange('female', index, 'from', e.target.value)}
                  className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0 text-sm font-semibold"
                />
                <input
                  type="number"
                  value={period.to}
                  placeholder="إلى"
                  onChange={(e) => handleInputChange('female', index, 'to', e.target.value)}
                  className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0 text-sm font-semibold"
                />
                <button className={`${femalePeriods.length === 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} disabled={femalePeriods.length === 1} type="button" onClick={() => handleRemovePeriod('female', index)}>
                  <CloseCircle size="24" color="#ff0000" />
                </button>
                {index === 0 && (
                  <button
                    type="button"
                    onClick={() => handleAddPeriod('female')}
                    className="ml-2"
                  >
                    <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9998 26.8346C22.5832 26.8346 26.3332 23.0846 26.3332 18.5013C26.3332 13.918 22.5832 10.168 17.9998 10.168C13.4165 10.168 9.6665 13.918 9.6665 18.5013C9.6665 23.0846 13.4165 26.8346 17.9998 26.8346Z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14.6665 18.5H21.3332" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18 21.8346V15.168" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
          </div>
          <div>
            <label className="text-[#272727] font-bold text-sm">ذكور</label>
            {malePeriods.map((period, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={period.from}
                  placeholder="من"
                  onChange={(e) => handleInputChange('male', index, 'from', e.target.value)}
                  className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0 text-sm font-semibold"
                />
                <input
                  type="number"
                  value={period.to}
                  placeholder="إلى"
                  onChange={(e) => handleInputChange('male', index, 'to', e.target.value)}
                  className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0 text-sm font-semibold"
                />
                <button className={`${malePeriods.length === 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} disabled={malePeriods.length === 1} type="button"
                onClick={() => handleRemovePeriod('male', index)}>
                  <CloseCircle size="24" color="#ff0000" />
                </button>
                {index === 0 && (
                  <button
                    type="button"
                    onClick={() => handleAddPeriod('male')}
                    className="ml-2"
                  >
                    <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9998 26.8346C22.5832 26.8346 26.3332 23.0846 26.3332 18.5013C26.3332 13.918 22.5832 10.168 17.9998 10.168C13.4165 10.168 9.6665 13.918 9.6665 18.5013C9.6665 23.0846 13.4165 26.8346 17.9998 26.8346Z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14.6665 18.5H21.3332" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18 21.8346V15.168" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
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
          التالي
        </Button>
      </div>
    </form>
  );
};
