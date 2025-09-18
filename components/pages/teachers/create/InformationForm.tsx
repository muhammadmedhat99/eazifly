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
  Checkbox,
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
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
    name_ar: yup
      .string()
      .required("ادخل الاسم بالعربية")
      .min(3, "الاسم بالعربية لا يجب ان يقل عن ٣ احرف"),
    name_en: yup
      .string()
      .required("ادخل الاسم بالإنجليزية")
      .min(3, "الاسم بالإنجليزية لا يجب ان يقل عن ٣ احرف"),
    address: yup.string().required("ادخل العنوان"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    whats_app: yup.string().required("ادخل رقم الواتس آب"),
    password: yup.string().required("ادخل كلمة المرور"),
    password_confirmation: yup
      .string()
      .required("ادخل تأكيد كلمة المرور")
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة"),
    gender: yup.string().required("برجاء اختيار النوع"),
    age: yup.string().required("ادخل العمر"),
    country: yup.string().required("إختر الدولة"),
    can_approve_question: yup
      .boolean()
      .required("حدد إذا كان يمكنه الموافقة على الأسئلة"),
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
  setTeacherId
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setTeacherId: React.Dispatch<React.SetStateAction<number | null>>
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
      formdata.append("name_ar", submitData.name_ar);
      formdata.append("name_en", submitData.name_en);
      formdata.append("address", submitData.address);
      formdata.append("email", submitData.email);
      formdata.append("phone", submitData.phone);
      formdata.append("whats_app", submitData.whats_app);
      formdata.append("password", submitData.password);
      formdata.append(
        "password_confirmation",
        submitData.password_confirmation
      );
      formdata.append("gender", submitData.gender);
      formdata.append("age", submitData.age);
      formdata.append("country", submitData.country);
      formdata.append(
        "can_approve_question",
        submitData.can_approve_question ? "yes" : "no"
      );
      {
        submitData.image && formdata.append("image", submitData.image[0]);
      }

      return postData("client/instructor/store", formdata, myHeaders);
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
        setActiveStep(1);
        setTeacherId(data.data.id)
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
        label="الاسم بالعربية"
        placeholder="نص الكتابه"
        type="text"
        {...register("name_ar")}
        isInvalid={!!errors.name_ar?.message}
        errorMessage={errors.name_ar?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="الاسم بالإنجليزية"
        placeholder="نص الكتابه"
        type="text"
        {...register("name_en")}
        isInvalid={!!errors.name_en?.message}
        errorMessage={errors.name_en?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="العنوان"
        placeholder="نص الكتابه"
        type="text"
        {...register("address")}
        isInvalid={!!errors.address?.message}
        errorMessage={errors.address?.message}
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
        <div className="flex flex-col gap-1">
          <label className="text-[#272727] font-bold text-sm">رقم الهاتف</label>
          <div
            style={{ "direction": "ltr" }}
            className={`
      shadow-none border-stroke border rounded-lg px-3 py-2 flex items-center
      focus-within:border-primary transition dir-ltr
    `}
          >
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "برجاء إدخال رقم هاتف",
                validate: (value) =>
                  isValidPhoneNumber(value || "") || "رقم الهاتف غير صحيح",
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="EG"
                  value={field.value}
                  onChange={field.onChange}
                  international
                  countryCallingCodeEditable={false}
                  placeholder="ادخل رقم الهاتف"
                  className="flex-1 text-sm outline-none border-0 focus:ring-0"
                />
              )}
            />

          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#272727] font-bold text-sm">رقم الواتس آب</label>
          <div
            style={{ "direction": "ltr" }}
            className={`
      shadow-none border-stroke border rounded-lg px-3 py-2 flex items-center
      focus-within:border-primary transition dir-ltr
    `}
          >
            <Controller
              name="whats_app"
              control={control}
              rules={{
                required: "برجاء إدخال رقم هاتف",
                validate: (value) =>
                  isValidPhoneNumber(value || "") || "رقم الهاتف غير صحيح",
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="EG"
                  value={field.value}
                  onChange={field.onChange}
                  international
                  countryCallingCodeEditable={false}
                  placeholder="ادخل رقم الهاتف"
                  className="flex-1 text-sm outline-none border-0 focus:ring-0"
                />
              )}
            />

          </div>
          {errors.whats_app && (
            <p className="text-red-500 text-xs mt-1">
              {errors.whats_app.message}
            </p>
          )}
        </div>
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
              base: "mb-4",
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

      <div className="mb-4 flex flex-col justify-center">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            {...register("can_approve_question")}
            className="form-checkbox h-5 w-5 text-primary me-2"
          />
          <span className="ml-2 text-[#272727] font-bold text-sm">
            هل يمكنه الموافقة على الأسئلة؟
          </span>
        </label>

        {errors.can_approve_question?.message && (
          <p className="text-red-500 text-sm mt-1">
            {errors.can_approve_question.message}
          </p>
        )}
      </div>

      <Controller
        name="image"
        control={control}
        render={({ field, fieldState }) => (
          <DropzoneField
            value={(field.value as any) || []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            label="الصورة الشخصية"
            description="تحميل صورة"
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
