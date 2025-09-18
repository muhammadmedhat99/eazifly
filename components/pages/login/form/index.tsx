"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { addToast, Avatar, Button, Checkbox, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/utils";
import { getToken } from "firebase/messaging";
import { messaging } from "../../../../firebase";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import countries from "world-countries";
import { whitePhoneCodeCustomStyles } from "@/lib/const";
const SelectReact = dynamic(() => import("react-select"), { ssr: false });

const allCountries = countries.map((country) => ({
  name: country.name.common,
  flag: country.flag,
  code: country.cca2,
  phone_code: country.idd.root
    ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
    : "",
}))


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
    phone: emailOrEgyptPhoneSchema.required(
      "برجاء إدخال رقم هاتف "
    ),
    password: yup
      .string()
      .required("من فضلك قم بإدخال كلمة المرور")
      .min(5, "كلمة المرور لا يجب ان تقل عن ٥ احرف"),
    country_code: yup.string().required("برجاء إختيار كود الدولة"),
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

  const retrieveFcmToken = async (registration: ServiceWorkerRegistration): Promise<string | null> => {
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
      } else if (registration.active) {
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      return token;
    } catch (error) {
      console.error("❌ Error getting FCM token:", error);
      return 'empty';
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
            inputWrapper: "shadow-none border-stroke border-1 ps-3 pe-0",
            base: "mb-4",
          }}
          variant="bordered"
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
                  styles={whitePhoneCodeCustomStyles}
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
      <div>
        {errors.country_code && (
          <p className="text-red-500 text-xs mt-1">
            {errors.country_code.message}
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
