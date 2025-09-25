"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from 'react';

import { addToast, Avatar, Button, Checkbox, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/utils";
import { getToken } from "firebase/messaging";
import { messaging } from "../../../../lib/FirebaseClient";
import { getCookie } from "cookies-next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";


const emailOrEgyptPhoneSchema = yup
  .string()
  .test(
    "is-email-or-egypt-phone",
    "برجاء إدخال رقم هاتف صحيح",
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
    phone: yup.string().required(
      "برجاء إدخال رقم هاتف "
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
    control
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => login.mutate(data);

  const retrieveFcmToken = async (
  registration: ServiceWorkerRegistration
): Promise<string | null> => {
  try {
    if (registration.installing) {
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener("statechange", function (e) {
          if ((e.target as ServiceWorker).state === "activated") {
            resolve();
          }
        });
      });
    } else if (registration.waiting) {
      await new Promise<void>((resolve) => {
        registration.waiting?.addEventListener("statechange", function (e) {
          if ((e.target as ServiceWorker).state === "activated") {
            resolve();
          }
        });
      });
    } else if (!registration.active) {
      return null;
    }

    if (messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      return token || null;
    }

    return null;
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};


  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    return registration;
  };
  
  const handleFcmTokenUpdate = async () => {
  if ("serviceWorker" in navigator) {
    
    try {
      const registration = await registerServiceWorker();

      const fcmToken = await retrieveFcmToken(registration);
      console.log('fcmToken:', fcmToken);
      
      if (fcmToken) {
        document.cookie = `fcm_token=${fcmToken}; path=/;`;

        const headers = new Headers();
        headers.append("local", "ar");
        headers.append("Accept", "application/json");
        headers.append("Authorization", `Bearer ${getCookie("token")}`);

        const formdata = new FormData();
        formdata.append("fcm_token", fcmToken);

        await postData("client/update/fcm/token", formdata, headers);
      }
    } catch (error) {
      console.error("Error while handling FCM token or Service Worker:", error);
    }
  }
};

  const getMessageString = (msg: any): string => {
  if (typeof msg === "string") return msg;
  if (typeof msg === "object") {
    return Object.values(msg)[0] as string;
  }
  return "حدث خطأ غير متوقع";
};

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

    onSuccess: async (data) => {
      const message = getMessageString(data?.message);

      if (message !== "success") {
        addToast({
          title: message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          variant: "solid",
          color: "danger",
        });
      } else {
        addToast({
          title: message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          variant: "solid",
          color: "success",
        });

        reset({ phone: "", password: "" });
        document.cookie = `token=${data?.data?.token}; path=/;`;
        document.cookie = `client_id=${data?.data?.id}; path=/;`;

        try {
          await handleFcmTokenUpdate();
          window.location.href = "/";
        } catch (err) {
          window.location.href = "/";
        }
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
      {/* Phone Input */}
      <div className="flex flex-col gap-1">
        <label className="text-[#272727] font-bold text-sm">رقم الهاتف</label>
        <div
        style ={{"direction" : "ltr"}}
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
