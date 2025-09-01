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
import { axios_config, phoneCodeCustomStyles } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import { useRouter } from "next/navigation";
import countries from "world-countries";
import dynamic from "next/dynamic";
import { StylesConfig } from "react-select";
const SelectReact = dynamic(() => import("react-select"), { ssr: false });


export const customStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f5f5f5" : "#f5f5f5",
    "&:hover": {
      backgroundColor: "#e4e4e7",
    },
    padding: "3px 4px",
    direction: "rtl",
    fontFamily: "inherit",
    fontSize: "14px",
    border: 0,
    width: "180px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#f0f0f0"
        : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
    cursor: "pointer",
    fontFamily: "inherit",
  }),
  singleValue: (base) => ({
    ...base,
    direction: "rtl",
    fontFamily: "inherit",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),

};

const allCountries = countries.map((country) => ({
  name: country.name.common,
  flag: country.flag,
  code: country.cca2,
  phone_code: country.idd.root
    ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
    : "",
}));

const schema = yup
  .object({
    name: yup
      .string()
      .required("ادخل الاسم")
      .min(3, "الاسم لا يجب ان يقل عن ٣ احرف"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    country_code: yup.string().required("ادخل كود الدولة"),
    password: yup.string().required("ادخل كلمة المرور"),
    password_confirmation: yup
      .string()
      .required("ادخل تأكيد كلمة المرور")
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة"),
    role: yup.string().required("إختر الوظيفة"),
    image: yup
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

export const CreateClient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const onSubmit = (data: FormData) => CreateClient.mutate(data);

  const CreateClient = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("name", submitData.name);
      formdata.append("email", submitData.email);
      formdata.append("role", submitData.role);
      formdata.append("phone", submitData.phone);
      formdata.append("country_code", submitData.country_code);
      formdata.append("password", submitData.password);
      formdata.append(
        "password_confirmation",
        submitData.password_confirmation
      );
      {
        submitData.image && formdata.append("image", submitData.image[0]);
      }

      return postData("client/store", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message && typeof data.message === "object" && !Array.isArray(data.message)) {
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
        router.push('/settings/clients')
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

    const { data, isLoading } = useQuery({
        queryKey: AllQueryKeys.GetAllCountries,
        queryFn: async () => await fetchClient(`client/countries`, axios_config),
    });

    const { data: rolesData, isLoading: isRolesLoading } = useQuery({
        queryFn: async () => await fetchClient(`client/get/roles`, axios_config),
        queryKey: AllQueryKeys.GetAllRoles,
    });

  return isLoading ? (
    <Loader />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Input
        label="الاسم"
        placeholder="نص الكتابه"
        type="text"
        {...register("name")}
        isInvalid={!!errors.name?.message}
        errorMessage={errors.name?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="البريد الإلكتروني"
        placeholder="نص الكتابه"
        type="text"
        {...register("email")}
        isInvalid={!!errors.email?.message}
        errorMessage={errors.email?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
        />
        <Input
          label="رقم الهاتف"
          placeholder="نص الكتابه"
          type="text"
          {...register("phone")}
          isInvalid={!!errors.phone?.message}
          errorMessage={errors.phone?.message}
          labelPlacement="outside"
          classNames={{
            label: "text-[#272727] font-bold text-sm",
            inputWrapper: "shadow-none",
            base: "mb-4",
          }}
          endContent={
            <Controller
              name="country_code"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectReact
                  placeholder="(+)"
                  {...field}
                  options={allCountries.map((country: any) => ({
                    value: country.phone_code,
                    label: (
                      <div className="flex items-center gap-2">
                        <Avatar
                          className="w-6 h-4"
                          radius="none"
                          src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                          alt={country.name}
                        />
                        <span>
                          {country.name} ({country.phone_code})
                        </span>
                      </div>
                    ),
                  }))}
                  styles={phoneCodeCustomStyles}
                  isSearchable
                  onChange={(option: any) => field.onChange(option?.value)}
                  value={
                    field.value
                      ? {
                        value: field.value,
                        label: (
                          <div className="flex items-center gap-2">
                            <Avatar
                              className="w-6 h-4"
                              radius="none"
                              src={`https://flagcdn.com/w20/${allCountries.find(
                                (c: any) => c.phone_code === field.value
                              )?.code.toLowerCase()}.png`}
                              alt={
                                allCountries.find(
                                  (c: any) => c.phone_code === field.value
                                )?.name
                              }
                            />
                            <span>
                              {
                                allCountries.find(
                                  (c: any) => c.phone_code === field.value
                                )?.name
                              }{" "}
                              ({field.value})
                            </span>
                          </div>
                        ),
                      }
                      : null
                  }
                />
              )}
            />
          }
        />
        <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="الوظيفة"
                        selectedKeys={field.value ? [field.value] : [""]}
                        onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys)[0]);
                        }}
                        placeholder="اختر الوظيفة"
                        classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          base: "mb-4",
                          value: "text-[#87878C] text-sm",
                        }}
                        isDisabled={isRolesLoading || rolesData?.data.length === 0}
                        isInvalid={!!errors?.role?.message}
                        errorMessage={errors?.role?.message as string}
                        labelPlacement="outside"
                      >
                        {(rolesData?.data as { id: number; name: string }[])?.map(
                          (role) => <SelectItem key={role.name}>{role.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
      <Input
        label="كلمة المرور"
        placeholder="نص الكتابه"
        type="password"
        {...register("password")}
        isInvalid={!!errors.password?.message}
        errorMessage={errors.password?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="تأكيد كلمة المرور"
        placeholder="نص الكتابه"
        type="password"
        {...register("password_confirmation")}
        isInvalid={!!errors.password_confirmation?.message}
        errorMessage={errors.password_confirmation?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />


      <Controller
        name="image"
        control={control}
        render={({ field, fieldState }) => (
          <DropzoneField
            value={(field.value as any) || []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            description={"تحميل صورة"}
          />
        )}
      />

      <div className="flex items-center justify-end gap-4 mt-8">
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
          isDisabled={CreateClient?.isPending}
        >
          {CreateClient?.isPending && <Spinner color="white" size="sm" />}
          التالي
        </Button>
      </div>
    </form>
  );
};
