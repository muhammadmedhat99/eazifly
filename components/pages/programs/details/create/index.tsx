"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "iconsax-reactjs";

type Option = {
  ar: { title: string };
  en: { title: string };
};

type FormData = {
  title_ar: string;
  title_en: string;
  program_id: number;
  user_type: "user" | "client" | "instructor";
  type: "text" | "number" | "multiple_choice";
  options?: Option[];
};

const schema: yup.ObjectSchema<FormData> = yup.object({
  title_ar: yup
    .string()
    .required("ادخل العنوان بالعربية")
    .min(3, "العنوان لا يجب أن يقل عن ٣ أحرف"),

  title_en: yup
    .string()
    .required("ادخل العنوان بالإنجليزية")
    .min(3, "العنوان لا يجب أن يقل عن ٣ أحرف"),

  type: yup
    .mixed<FormData["type"]>()
    .required("اختر نوع السؤال")
    .oneOf(["text", "number", "multiple_choice"], "نوع السؤال غير صحيح"),

  options: yup
    .array(
      yup.object({
        ar: yup.object({
          title: yup
            .string()
            .required("ادخل العنوان بالعربية")
            .min(1, "لا يمكن أن يكون فارغ"),
        }),
        en: yup.object({
          title: yup
            .string()
            .required("ادخل العنوان بالإنجليزية")
            .min(1, "لا يمكن أن يكون فارغ"),
        }),
      })
    )
    .when("type", {
      is: "multiple_choice",
      then: (schema) =>
        schema.min(2, "يجب إدخال خيارين على الأقل").required("ادخل الخيارات"),
      otherwise: (schema) => schema.strip(),
    }),
}) as yup.ObjectSchema<FormData>;

export const CreateQuestions = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const params = useParams();
  const program_id = params.id;

  const queryClient = useQueryClient();
  
  const typeValue = watch("type");
  const [optionsCount, setOptionsCount] = useState(0);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const handleOptionsCountChange = (count: number) => {
    const num = Number(count) || 0;
    setOptionsCount(num);

    setValue("options", []);
    for (let i = 0; i < num; i++) {
      append({ ar: { title: "" }, en: { title: "" } });
    }
  };

  const router = useRouter();
  const onSubmit = (data: FormData) => CreateQuestion.mutate(data);

  const CreateQuestion = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      const formdata = new FormData();
      formdata.append("ar[title]", submitData.title_ar);
      formdata.append("en[title]", submitData.title_en);
      if(program_id){
        formdata.append("program_id", program_id.toString());
      }
      formdata.append("user_type", "instructor");
      formdata.append("type", submitData.type);
      if (submitData.type === "multiple_choice" && submitData.options) {
        submitData.options.forEach((option, index) => {
          formdata.append(`options[${index}][ar][title]`, option.ar.title);
          formdata.append(`options[${index}][en][title]`, option.en.title);
        });
      }

      return postData(
        "client/report/question/method/store",
        formdata,
        myHeaders
      );
    },
    onSuccess: (data) => {
      if (
        data.message &&
        typeof data.message === "object" &&
        !Array.isArray(data.message)
      ) {
        const messagesObj = data.message as Record<string, string[]>;

        Object.entries(messagesObj).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            addToast({
              title: `${field}: ${msg}`,
              color: "danger",
            });
          });
        });
      } else if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: AllQueryKeys.GetAllQuestionsData });
        router.push(`/programs/${program_id}`);
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

  const { data: programData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/program?status=published`, axios_config),
    queryKey: AllQueryKeys.GetAllPrograms("", 1),
  });

  React.useEffect(() => {
    if (typeValue === "multiple_choice" && fields.length === 0) {
      append({ ar: { title: "" }, en: { title: "" } });
      append({ ar: { title: "" }, en: { title: "" } });
    }
  }, [typeValue, fields.length, append]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      {/* الاسم بالعربية */}
      <Input
        label="العنوان بالعربية"
        placeholder="أدخل العنوان"
        type="text"
        {...register("title_ar")}
        isInvalid={!!errors.title_ar?.message}
        errorMessage={errors.title_ar?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />

      {/* الاسم بالإنجليزية */}
      <Input
        label="العنوان بالإنجليزية"
        placeholder="أدخل العنوان"
        type="text"
        {...register("title_en")}
        isInvalid={!!errors.title_en?.message}
        errorMessage={errors.title_en?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />

      {/* نوع السؤال */}
      <Select
        label="نوع السؤال"
        placeholder="اختر النوع"
        {...register("type")}
        isInvalid={!!errors.type?.message}
        errorMessage={errors.type?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          base: "mb-4",
        }}
      >
        <SelectItem key="text">نص</SelectItem>
        <SelectItem key="number">رقم</SelectItem>
        <SelectItem key="multiple_choice">اختيار من متعدد</SelectItem>
      </Select>

      {typeValue === "multiple_choice" && (
        <div className="col-span-2 flex flex-col gap-4">
          <label className="text-[#272727] font-bold text-sm">
            الاختيارات
          </label>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="col-span-2 flex gap-4 items-center"
            >
              <div className="grid grid-cols-2 gap-2 border p-2 rounded flex-1">
                <Input
                  placeholder="العنوان بالعربية"
                  {...register(`options.${index}.ar.title`)}
                />
                <Input
                  placeholder="العنوان بالإنجليزية"
                  {...register(`options.${index}.en.title`)}
                />
              </div>

              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={() => remove(index)}
                isDisabled={index < 2} 
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <Trash color="red" size="20" />
              </Button>
            </div>
          ))}
          <div className="flex justify-center col-span-2">
            <Button
              type="button"
              variant="light"
              color="primary"
              onPress={() => append({ ar: { title: "" }, en: { title: "" } })}
              className="col-span-2"
            >
              + إضافة اختيار
            </Button>
          </div>
        </div>
      )}


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
          isDisabled={CreateQuestion?.isPending}
        >
          {CreateQuestion?.isPending && <Spinner color="white" size="sm" />}
          حفظ
        </Button>
      </div>
    </form>
  );
};
