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
import Image from "next/image";
import dynamic from "next/dynamic";
import countries from "world-countries";
const SelectReact = dynamic(() => import("react-select"), { ssr: false });

const allCountries = countries.map((country) => ({
  name: country.name.common,
  flag: country.flag,
  code: country.cca2,
  phone_code: country.idd.root
    ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
    : "",
}))

const schema = yup
  .object({
    first_name: yup
      .string()
      .required("ادخل الاسم الأول")
      .min(3, "الاسم الأول لا يجب ان يقل عن ٣ احرف"),
    last_name: yup
      .string()
      .required("ادخل الاسم الأخير")
      .min(3, "الاسم الأخير لا يجب ان يقل عن ٣ احرف"),
    user_name: yup
      .string()
      .required("ادخل اسم المستخدم")
      .min(3, "اسم المستخدم لا يجب ان يقل عن ٣ احرف"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    country_code: yup.string().required("ادخل كود الدولة"),
    whats_app_country_code: yup.string().required("ادخل كود الدولة"),
    whats_app: yup.string().required("ادخل رقم الواتس آب"),
    password: yup.string().required("ادخل كلمة المرور"),
    password_confirmation: yup
      .string()
      .required("ادخل تأكيد كلمة المرور")
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة"),
    gender: yup.string().required("برجاء اختيار النوع"),
    age: yup.string().required("ادخل العمر"),
    country: yup.string().required("إختر الدولة"),
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

export const InformationForm = ({
  setActiveStep,
  setUserId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setUserId: (count: string) => void;
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

  const onSubmit = (data: FormData) => CreateStudent.mutate(data);

  const CreateStudent = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("first_name", submitData.first_name);
      formdata.append("last_name", submitData.last_name);
      formdata.append("user_name", submitData.user_name);
      formdata.append("email", submitData.email);
      formdata.append("phone", submitData.phone);
      formdata.append("country_code", submitData.country_code);
      formdata.append("whats_app", submitData.whats_app);
      formdata.append("password", submitData.password);
      formdata.append(
        "password_confirmation",
        submitData.password_confirmation
      );
      formdata.append("gender", submitData.gender);
      formdata.append("age", submitData.age);
      formdata.append("country", submitData.country);
      {
        submitData.image && formdata.append("image", submitData.image[0]);
      }

      return postData("client/user/store", formdata, myHeaders);
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
        setUserId(data?.data?.id);
        reset();
        setActiveStep(1);
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

  return isLoading ? (
    <Loader />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Input
        label="الاسم الأول"
        placeholder="نص الكتابه"
        type="text"
        {...register("first_name")}
        isInvalid={!!errors.first_name?.message}
        errorMessage={errors.first_name?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="الاسم الأخير"
        placeholder="نص الكتابه"
        type="text"
        {...register("last_name")}
        isInvalid={!!errors.last_name?.message}
        errorMessage={errors.last_name?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="اسم المستخدم"
        placeholder="نص الكتابه"
        type="text"
        {...register("user_name")}
        isInvalid={!!errors.user_name?.message}
        errorMessage={errors.user_name?.message}
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
        <Input
        label="رقم الواتس آب"
        placeholder="نص الكتابه"
        type="text"
        {...register("whats_app")}
        isInvalid={!!errors.whats_app?.message}
        errorMessage={errors.whats_app?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
        endContent={
            data?.data?.length > 0 && (
              <Controller
              name="whats_app_country_code"
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
            )
          }
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
      <Input
        label="العمر"
        placeholder="نص الكتابه"
        type="text"
        {...register("age")}
        isInvalid={!!errors.age?.message}
        errorMessage={errors.age?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              field.onChange(Array.from(keys)[0]);
              console.log(Array.from(keys)[0]);
            }}
            label="النوع"
            labelPlacement="outside"
            placeholder="اختر النوع"
            isInvalid={!!errors.gender?.message}
            errorMessage={errors.gender?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "male", label: "ذكر" },
              { key: "female", label: "انثي" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      {/* <Controller
        name="birth_date"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="تاريخ الميلاد"
            labelPlacement="outside"
            value={field.value ? (field.value as any) : null}
            onChange={field.onChange}
            isInvalid={!!errors.birth_date?.message}
            errorMessage={errors.birth_date?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
            }}
          />
        )}
      /> */}

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            label="الدولة"
            labelPlacement="outside"
            placeholder="اختر الدولة"
            isInvalid={!!errors.country?.message}
            errorMessage={errors.country?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4 col-span-2",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              { key: "1", label: "مصر" },
              { key: "2", label: "المملكة العربيه السعوديه" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="image"
        control={control}
        render={({ field, fieldState }) => (
          <DropzoneField
            value={(field.value as any) || []}
            onChange={field.onChange}
            error={fieldState.error?.message}
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
          isDisabled={CreateStudent?.isPending}
        >
          {CreateStudent?.isPending && <Spinner color="white" size="sm" />}
          التالي
        </Button>
      </div>
    </form>
  );
};
