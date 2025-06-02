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
import { useRouter } from "next/navigation";

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
        files: yup
            .mixed<FileList>()
            .test(
                "fileType",
                "الرجاء تحميل ملف صحيح",
                (value) => {
                if (!value) return true; 
                return value.length > 0;
                }
            )
            .notRequired()
            })
    .required();

type FormData = yup.InferType<typeof schema>;

export const AttachmentsForm = ({
  setActiveStep,
  teacherId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  teacherId: number | null;
    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema) as any,
    });

    const router = useRouter();

    const onSubmit = (data: FormData) => CreateAttachments.mutate(data);

    const CreateAttachments = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            var formData = new FormData();

            if (teacherId !== null) {
                formData.append("instructor_id", teacherId.toString());
            } else {
                formData.append("instructor_id", "");
            }
            formData.append("cv", submitData.cv[0]);
            for (const file of Array.from(submitData.files ?? [])) {
            formData.append("files[]", file);
            }
            return postData("client/instructor/files", formData, myHeaders);
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
                router.push('/teachers');
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
                          description="تحميل ملف"
                      />
                  </div>
              )}
          />
          <Controller
              name="files"
              control={control}
              render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[#272727] font-bold text-sm">ملفات أخري</label>
                      <DropzoneField
                          value={(field.value as any) || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          description="تحميل ملف"
                          multiple={true}
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
