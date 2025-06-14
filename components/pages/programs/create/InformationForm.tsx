"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import {
  Button,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  Switch,
  Input,
  cn,
  addToast,
} from "@heroui/react";
import {
  LocalizedField,
  LocalizedTextArea,
} from "@/components/global/LocalizedField";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { useQuery, useMutation } from "@tanstack/react-query";
import { informationFormSchema } from "./schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCookie } from "cookies-next";

interface Specialization {
  id: string;
  title: string;
}

interface FormData {
  why_us: boolean;
  learning_track: boolean;
  slug: string;
  limit_users: number;
  specialization_id: string;
  special_for: NonNullable<"adult" | "child" | undefined>;
  image: FileList;
  localizedFields: {
    [key: string]: {
      title: string;
      label: string;
      goals: string;
      content: string;
    };
  };
}

const locales = ["ar", "en"];

const defaultValues: Partial<FormData> = {
  why_us: false,
  learning_track: false,
  slug: "",
  limit_users: 0,
  localizedFields: locales.reduce(
    (acc, locale) => ({
      ...acc,
      [locale]: { title: "", label: "", goals: "", content: "" },
    }),
    {}
  ),
};

export const InformationForm = ({
  setActiveStep,
  onProgramCreated,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  onProgramCreated: (id: string, specId: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(informationFormSchema),
    defaultValues,
  });

  const { data: specializations, isLoading: loadingSpecializations } = useQuery(
    {
      queryFn: async () =>
        await fetchClient(`client/Specializations`, axios_config),
      queryKey: AllQueryKeys.GetAllSpecializations,
    }
  );

  const createFormData = (submitData: FormData): FormData => {
    const formdata = new FormData();

    // Add localized fields
    locales.forEach((locale) => {
      const localeData = submitData.localizedFields[locale];
      formdata.append(`${locale}[title]`, localeData.title);
      formdata.append(`${locale}[label]`, localeData.label);
      formdata.append(`${locale}[goals]`, localeData.goals);
      formdata.append(`${locale}[content]`, localeData.content);
    });

    // Add other fields
    formdata.append("why_us", submitData.why_us.toString());
    formdata.append("learning_track", submitData.learning_track.toString());
    formdata.append("special_for", submitData.special_for);
    formdata.append("specialization_id", submitData.specialization_id);
    formdata.append("slug", submitData.slug);
    formdata.append("limit_users", submitData.limit_users.toString());

    // Add image if exists
    if (submitData.image && submitData.image.length > 0) {
      formdata.append("image", submitData.image[0]);
    }

    return formdata as any;
  };

  const createProgramMutation = useMutation({
    mutationFn: (submitData: FormData) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = createFormData(submitData);
      return postData("client/program/store", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error creating program: ${data.message}`,
          color: "danger",
        });
      } else {
        onProgramCreated(data.id, data.specialization_id);
        addToast({
          title: data?.message,
          color: "success",
        });
      }
    },
    onError: (error) => {
      console.error("Error creating program:", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createProgramMutation.mutate(data);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-4 py-14 px-8"
    >
      {/* Program Name */}
      <LocalizedField control={control} name="title" label="إسم البرنامج" />

      {/* Program Label */}
      <LocalizedField control={control} name="label" label="عنوان البرنامج" />

      {/* Slug Field */}
      <div className="col-span-2">
        <Input
          {...register("slug")}
          label="Slug"
          labelPlacement="outside"
          placeholder="program-slug"
          isInvalid={!!errors.slug?.message}
          errorMessage={errors.slug?.message}
          classNames={{
            label: "text-[#272727] font-bold text-sm",
            base: "mb-4",
            input: "text-[#87878C] text-sm",
          }}
        />
      </div>

      {/* Limit Users Field */}
      <div className="col-span-2">
        <Input
          {...register("limit_users", { valueAsNumber: true })}
          type="number"
          label="عدد المستخدمين"
          labelPlacement="outside"
          placeholder="0"
          min={0}
          isInvalid={!!errors.limit_users?.message}
          errorMessage={errors.limit_users?.message}
          classNames={{
            label: "text-[#272727] font-bold text-sm",
            base: "mb-4",
            input: "text-[#87878C] text-sm",
          }}
        />
      </div>

      {/* Program Content */}
      <div className="col-span-2">
        <LocalizedTextArea
          control={control}
          name="content"
          label="محتوي البرنامج"
        />
      </div>

      {/* Program Goals */}
      <div className="col-span-2">
        <LocalizedTextArea
          control={control}
          name="goals"
          label="اهداف البرنامج"
        />
      </div>

      {/* Specialization Select */}
      <div className="col-span-2">
        <Controller
          name="specialization_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys)[0]);
              }}
              label="التخصص"
              labelPlacement="outside"
              placeholder="اختر التخصص"
              isInvalid={!!errors.specialization_id?.message}
              errorMessage={errors.specialization_id?.message}
              isLoading={loadingSpecializations}
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
              ))}
            </Select>
          )}
        />
      </div>

      {/* Special For Radio Group */}
      <div className="col-span-2">
        <Controller
          name="special_for"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              isInvalid={!!errors.special_for?.message}
              errorMessage={errors.special_for?.message}
              label="الفئة المستهدفة"
              classNames={{
                wrapper: "flex-row",
                label: "text-[#272727] font-bold text-sm",
                base: "mb-4",
              }}
            >
              <Radio
                value="adult"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[200px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                البالغين
              </Radio>
              <Radio
                value="child"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[200px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                الأطفال
              </Radio>
            </RadioGroup>
          )}
        />
      </div>

      {/* Program Image */}
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

      {/* Switches Container */}
      <div className="flex items-center justify-between gap-8">
        {/* Why Us Switch */}
        <div className="flex-1">
          <Controller
            name="why_us"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label className="text-[#272727] font-bold text-sm">
                  لماذا نحن؟
                </label>
                <Switch
                  onChange={(e) => field.onChange(e.target.checked)}
                  color="success"
                  isSelected={field.value}
                />
                {errors.why_us && (
                  <span className="text-danger text-xs font-bold">
                    {errors.why_us.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        {/* Learning Track Switch */}
        <div className="flex-1">
          <Controller
            name="learning_track"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label className="text-[#272727] font-bold text-sm">
                  مسار التعلم؟
                </label>
                <Switch
                  onChange={(e) => field.onChange(e.target.checked)}
                  color="success"
                  isSelected={field.value}
                />
                {errors.learning_track && (
                  <span className="text-danger text-xs font-bold">
                    {errors.learning_track.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 mt-8 col-span-4">
        <Button
          type="button"
          onPress={handleReset}
          variant="solid"
          color="primary"
          className="text-white"
          isDisabled={createProgramMutation.isPending}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          isLoading={createProgramMutation.isPending}
        >
          {createProgramMutation.isPending ? "جاري الحفظ..." : "التالي"}
        </Button>
      </div>
    </form>
  );
};
