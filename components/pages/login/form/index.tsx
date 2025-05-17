"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { addToast, Button, Checkbox, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/utils";

const emailOrEgyptPhoneSchema = yup
  .string()
  .test(
    "is-email-or-egypt-phone",
    "برجاء إدخال بريد إلكتروني صحيح او رقم هاتف صحيح",
    (value) => {
      if (!value) return false;

      // Email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Egyptian phone number regex (accepts formats like +201234567890, 01234567890, 00201234567890)
      const egyptPhoneRegex = /^(\+20|0020|0)?1[0-9]{9}$/;

      return emailRegex.test(value) || egyptPhoneRegex.test(value);
    }
  );

const schema = yup
  .object({
    phone: emailOrEgyptPhoneSchema.required(
      "برجاء إدخال بريد إلكتروني او رقم هاتف "
    ),
    password: yup
      .string()
      .required("من فضلك قم بإدخال كلمة المرور")
      .min(5, "كلمة المرور لا يجب ان تقل عن ٥ احرف"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormData) => login.mutate(data);

  const login = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      var formdata = new FormData();
      formdata.append("phone", submitData.phone);
      formdata.append("password", submitData.password);
      return postData("client/login", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: data?.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          variant: "solid",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          variant: "solid",
          color: "success",
        });
        reset({ phone: "", password: "" });
        document.cookie = `token=${data?.data?.token}; path=/;`;
        window.location.href = "/";
      }
    },
    onError: () => {
      addToast({
        title: "عذرا حدث خطأ ما",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        variant: "solid",
        color: "danger",
      });
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        label="البريد الإلكتروني او رقم الهاتف"
        placeholder="نص الكتابه"
        type="text"
        {...register("phone")}
        isInvalid={!!errors.phone?.message}
        errorMessage={errors.phone?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none border-stroke border-1",
          base: "mb-4",
        }}
        variant="bordered"
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
          inputWrapper: "shadow-none border-stroke border-1",
        }}
        variant="bordered"
      />
      <div className="flex items-center justify-between">
        <Checkbox defaultSelected>تذكرني</Checkbox>
        <Link href="/" className="text-primary text-xs font-semibold underline">
          نسيت كلمة المرور ؟
        </Link>
      </div>
      <Button
        variant="solid"
        type="submit"
        color="primary"
        fullWidth
        isDisabled={login?.isPending}
      >
        {login?.isPending && <Spinner color="white" />}
        تسجيل الدخول
      </Button>
    </form>
  );
};
