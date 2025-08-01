"use client";

import React, { useEffect } from "react";
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
import { informationFormSchema, type InformationFormData } from "./schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCookie } from "cookies-next";

const locales = ["ar", "en"] as const;

interface InformationFormProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  onProgramCreated: (id: string, specId: string) => void;
  initialData?: any;
  mode?: string;
}

interface Specialization {
  id: string;
  title: string;
}

interface host {
  id: string;
  title: string;
}

const defaultValues: Partial<InformationFormData> = {
  slug: "",
  limit_users: 0,
  localizedFields: locales.reduce(
    (acc, locale) => ({
      ...acc,
      [locale]: { title: "", label: "", goals: "", content: "" },
    }),
    {} as InformationFormData["localizedFields"]
  ),
};

export const InformationForm = ({
  setActiveStep,
  onProgramCreated,
  initialData,
  mode,
}: InformationFormProps) => {
  function mapInitialDataToDefaultValues(data: any): InformationFormData {
    return {
      localizedFields: {
        ar: {
          title: data.data.title || "",
          label: data.data.label || "",
          goals: data.data.goals || "",
          content: data.data.content || "",
        },
        en: {
          title: data.data.title || "",
          label: data.data.label || "",
          goals: data.data.goals || "",
          content: data.data.content || "",
        },
      },
      slug: data.data.slug || "",
      limit_users: Number(data.data.limit_users || 0),
      specialization_id: data.data.specialization_id
        ? String(data.data.specialization_id)
        : "",
      meeting_host_id: data.data.host.id ? String(data.data.host.id) : "",
      special_for: data.data.special_for || "",
      image: data.data.image
        ? [
            {
              name: "image",
              preview: data.data.image,
            },
          ]
        : [],
      cover: data.data.cover
        ? [
            {
              name: "cover",
              preview: data.data.cover,
            },
          ]
        : [],
    };
  }

  const mappedDefaults = initialData
    ? mapInitialDataToDefaultValues(initialData)
    : {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
  } = useForm<InformationFormData>({
    resolver: yupResolver(informationFormSchema),
    defaultValues: mappedDefaults,
  });

  useEffect(() => {
    if (initialData) {
      reset(mapInitialDataToDefaultValues(initialData));
    }
  }, [initialData, reset]);

  const { data: specializations, isLoading: loadingSpecializations } = useQuery(
    {
      queryFn: async (): Promise<{ data: Specialization[] }> =>
        await fetchClient(`client/Specializations`, axios_config),
      queryKey: AllQueryKeys.GetAllSpecializations,
    }
  );

  const { data: hosts, isLoading: loadingHosts } = useQuery({
    queryFn: async (): Promise<{ data: Specialization[] }> =>
      await fetchClient(`client/program/hosts`, axios_config),
    queryKey: AllQueryKeys.GetAllHost,
  });

  const createFormData = (submitData: InformationFormData): FormData => {
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
    formdata.append("special_for", submitData.special_for);
    formdata.append("specialization_id", submitData.specialization_id);
    formdata.append("meeting_host_id", submitData.meeting_host_id);
    formdata.append("slug", submitData.slug);
    formdata.append("limit_users", submitData.limit_users.toString());

    // Add image if exists
    if (
      submitData.image &&
      submitData.image.length > 0 &&
      submitData.image[0] instanceof File
    ) {
      formdata.append("image", submitData.image[0]);
    }

    if (
      submitData.cover &&
      submitData.cover.length > 0 &&
      submitData.cover[0] instanceof File
    ) {
      formdata.append("cover", submitData.cover[0]);
    }

    return formdata;
  };

  const createProgramMutation = useMutation({
    mutationFn: (submitData: InformationFormData) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = createFormData(submitData);
      return postData("client/program/store", formdata, myHeaders);
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error creating program: ${data.message}`,
          color: "danger",
        });
      } else {
        onProgramCreated(data.data.id, getValues("specialization_id"));
        setActiveStep(1);
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

  const updateProgramMutation = useMutation({
    mutationFn: (submitData: InformationFormData) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = createFormData(submitData);
      return postData(
        `client/program/update/${initialData?.data.id}`,
        formdata,
        myHeaders
      );
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error updating program: ${data.message}`,
          color: "danger",
        });
      } else {
        onProgramCreated(data.data.id, getValues("specialization_id"));
        setActiveStep(1);
        addToast({
          title: data?.message,
          color: "success",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Error updating program:", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: InformationFormData) => {
    if (mode === "edit") {
      updateProgramMutation.mutate(data);
    } else {
      createProgramMutation.mutate(data);
    }
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
                const selectedKey = Array.from(keys)[0] as string;
                field.onChange(selectedKey);
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
              )) ?? []}
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

      {/* hosts Select */}
      <div className="col-span-4">
        <Controller
          name="meeting_host_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                field.onChange(selectedKey);
              }}
              label="الاستضافة"
              labelPlacement="outside"
              placeholder="اختر الاستضافة"
              isInvalid={!!errors.meeting_host_id?.message}
              errorMessage={errors.meeting_host_id?.message}
              isLoading={loadingHosts}
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                base: "mb-4",
                value: "text-[#87878C] text-sm",
              }}
            >
              {hosts?.data?.map((host: host) => (
                <SelectItem key={host.id}>{host.title}</SelectItem>
              )) ?? []}
            </Select>
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
              value={field.value ? Array.from(field.value) : []}
              onChange={(files) => {
                // Convert FileWithPreview[] back to FileList-like object
                const dt = new DataTransfer();
                files.forEach((file) => {
                  if (file instanceof File) {
                    dt.items.add(file);
                  }
                });
                field.onChange(dt.files);
              }}
              error={fieldState.error?.message}
              label="صورة البرنامج"
            />
          )}
        />
      </div>

      {/* Program cover */}
      <div className="col-span-2">
        <Controller
          name="cover"
          control={control}
          render={({ field, fieldState }) => (
            <DropzoneField
              value={field.value ? Array.from(field.value) : []}
              onChange={(files) => {
                // Convert FileWithPreview[] back to FileList-like object
                const dt = new DataTransfer();
                files.forEach((file) => {
                  if (file instanceof File) {
                    dt.items.add(file);
                  }
                });
                field.onChange(dt.files);
              }}
              error={fieldState.error?.message}
              label="صورة الغلاف"
            />
          )}
        />
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
