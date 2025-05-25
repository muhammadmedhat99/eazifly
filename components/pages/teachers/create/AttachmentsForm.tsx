"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  addToast,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Avatar,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import React from "react";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import Image from "next/image";

const schema = yup
    .object({
        cv: yup
            .mixed<FileList>()
            .test(
                "fileType",
                "الرجاء تحميل ملف صحيح",
                (value) => value && value.length > 0
            )
            .required("الرجاء تحميل ملف"),
        qualification_data: yup
            .mixed<FileList>()
            .test(
                "fileType",
                "الرجاء تحميل ملف صحيح",
                (value) => value && value.length > 0
            )
            .required("الرجاء تحميل ملف"),
        other_file: yup
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

export const AttachmentsForm = ({
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
  };

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 py-14 px-8">
          <Controller
              name="cv"
              control={control}
              render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[#272727] font-bold text-sm">السيرة الذاتية 1</label>
                      <DropzoneField
                          value={(field.value as any) || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                      />
                  </div>
              )}
          />
          <Controller
              name="qualification_data"
              control={control}
              render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[#272727] font-bold text-sm">بيانات الموهل</label>
                      <DropzoneField
                          value={(field.value as any) || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                      />
                  </div>
              )}
          />
          <Controller
              name="other_file"
              control={control}
              render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[#272727] font-bold text-sm">ملف أخر</label>
                      <DropzoneField
                          value={(field.value as any) || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                      />
                  </div>
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
              >
                  التالي
              </Button>
          </div>
      </form>
  );
};
