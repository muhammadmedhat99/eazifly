import { addToast, Button, Input, Spinner, Switch } from "@heroui/react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { getCookie } from "cookies-next";
import { Loader } from "@/components/global/Loader";

const schema = yup
  .object({
    geidea_api_merchant_Key: yup
      .string()
      .required("ادخل Api Merchant Key"),
    geidea_api_secret: yup
      .string()
      .required("ادخل Api Secret"),
    test_geidea_api_merchant_Key: yup
      .string()
      .required("ادخل Api Merchant Key"),
    test_geidea_api_secret: yup
      .string()
      .required("ادخل Api Secret"),
    mail_name: yup
      .string()
      .required("ادخل البريد الإلكتروني"),
    mail_password: yup
      .string()
      .required("ادخل كلمة المرور"),
    geidea_status: yup
      .string()
      .oneOf(["test", "production"], "القيمة يجب أن تكون test أو production")
      .required("اختار حالة جيديا"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ExternalServices = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      test_geidea_api_merchant_Key: "",
      test_geidea_api_secret: "",
      geidea_api_merchant_Key: "",
      geidea_api_secret: "",
      mail_name: "",
      mail_password: "",
    },
  });
  const { data: settingData, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllSettings,
    queryFn: async () => await fetchClient(`client/setting`, axios_config),
  });

  useEffect(() => {
    if (settingData) {
      const merchantKey = settingData.data.find(
        (item: any) => item.key === "geidea_api_merchant_Key"
      )?.value;

      const secret = settingData.data.find(
        (item: any) => item.key === "geidea_api_secret"
      )?.value;

      const testMerchantKey = settingData.data.find(
        (item: any) => item.key === "test_geidea_api_merchant_Key"
      )?.value;

      const testSecret = settingData.data.find(
        (item: any) => item.key === "test_geidea_api_secret"
      )?.value;

      const mail = settingData.data.find(
        (item: any) => item.key === "mail_name"
      )?.value;

      const password = settingData.data.find(
        (item: any) => item.key === "mail_password"
      )?.value;

      const geideaStatus = settingData.data.find(
        (item: any) => item.key === "geidea_status"
      )?.value;

      reset({
        geidea_api_merchant_Key: merchantKey || "",
        geidea_api_secret: secret || "",
        test_geidea_api_merchant_Key: testMerchantKey || "",
        test_geidea_api_secret: testSecret || "",
        mail_name: mail || "",
        mail_password: password || "",
        geidea_status: geideaStatus || "",
      });
    }
  }, [settingData, reset]);

  const onSubmit = (data: FormData) => updateSettings.mutate(data);

  const updateSettings = useMutation({
    mutationFn: (submitData: FormData) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const payload = {
        settings: [
          {
            key: "geidea_api_merchant_Key",
            value: submitData.geidea_api_merchant_Key,
            label_name: "geidea_api_merchant_Key",
          },
          {
            key: "geidea_api_secret",
            value: submitData.geidea_api_secret,
            label_name: "geidea_api_secret",
          },
          {
            key: "test_geidea_api_merchant_Key",
            value: submitData.test_geidea_api_merchant_Key,
            label_name: "test_geidea_api_merchant_Key",
          },
          {
            key: "test_geidea_api_secret",
            value: submitData.test_geidea_api_secret,
            label_name: "test_geidea_api_secret",
          },
          {
            key: "mail_name",
            value: submitData.mail_name,
            label_name: "mail_name",
          },
          {
            key: "mail_password",
            value: submitData.mail_password,
            label_name: "mail_password",
          },
          {
            key: "geidea_status",
            value: submitData.geidea_status,
            label_name: "geidea_status",
          },
        ],
      };

      return postData("client/setting/update", JSON.stringify(payload), myHeaders);
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
    isLoading ? (<Loader />) : (
      <div className="px-4 py-6">
        <div className="touch-none tap-highlight-transparent select-none w-full bg-content1 border border-stroke max-w-full rounded-2xl gap-5 p-4 data-[selected=true]:border-success">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <span className="text-[#272727] text-base font-bold col-span-2">
              بيانات وسيلة الدفع جيديا
            </span>

            <div className="col-span-2">
              <Controller
                name="geidea_status"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${field.value === "test" ? "text-warning" : "text-gray-500"
                        }`}
                    >
                      Test
                    </span>

                    <Switch
                      isSelected={field.value === "production"}
                      onValueChange={(selected) =>
                        field.onChange(selected ? "production" : "test")
                      }
                      color="success"
                    />

                    <span
                      className={`text-sm font-bold ${field.value === "production" ? "text-green-600" : "text-gray-500"
                        }`}
                    >
                      Production
                    </span>
                  </div>
                )}
              />

            </div>
            <Input
              label="Test Api Merchant Key"
              placeholder="نص الكتابه"
              type="text"
              {...register("test_geidea_api_merchant_Key")}
              isInvalid={!!errors.test_geidea_api_merchant_Key?.message}
              errorMessage={errors.test_geidea_api_merchant_Key?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />
            <Input
              label="Test Api Secret"
              placeholder="نص الكتابه"
              type="text"
              {...register("test_geidea_api_secret")}
              isInvalid={!!errors.test_geidea_api_secret?.message}
              errorMessage={errors.test_geidea_api_secret?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />
            <Input
              label="Api Merchant Key"
              placeholder="نص الكتابه"
              type="text"
              {...register("geidea_api_merchant_Key")}
              isInvalid={!!errors.geidea_api_merchant_Key?.message}
              errorMessage={errors.geidea_api_merchant_Key?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />
            <Input
              label="Api Secret"
              placeholder="نص الكتابه"
              type="text"
              {...register("geidea_api_secret")}
              isInvalid={!!errors.geidea_api_secret?.message}
              errorMessage={errors.geidea_api_secret?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />
            <div className="-mx-9 w-[calc(100%+4.5rem)] h-px bg-[#2563EB] col-span-2" />
            <span className="text-[#272727] text-base font-bold col-span-2">
              بيانات الايميل
            </span>

            <Input
              label="البريد الإلكتروني"
              placeholder="نص الكتابه"
              type="text"
              {...register("mail_name")}
              isInvalid={!!errors.mail_name?.message}
              errorMessage={errors.mail_name?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />
            <Input
              label="كلمة المرور"
              placeholder="نص الكتابه"
              type="text"
              {...register("mail_password")}
              isInvalid={!!errors.mail_password?.message}
              errorMessage={errors.mail_password?.message}
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                base: "mb-4",
              }}
            />

            <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
              <Button
                type="submit"
                variant="solid"
                color="primary"
                className="text-white"
                isDisabled={updateSettings?.isPending}
              >
                {updateSettings?.isPending && <Spinner color="white" size="sm" />}
                تعديل
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
