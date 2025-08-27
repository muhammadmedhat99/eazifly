"use client";

import {
  addToast,
  Button,
  Input,
  Spinner,
  Switch,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { getCookie } from "cookies-next";
import { Loader } from "@/components/global/Loader";
import { useParams } from "next/navigation";
import ConfirmModal from "@/components/global/ConfirmModal"; // تأكدي من مكانه

const schema = yup
  .object({
    geidea_api_merchant_Key: yup.string().required("ادخل Api Merchant Key"),
    geidea_api_secret: yup.string().required("ادخل Api Secret"),
    test_geidea_api_merchant_Key: yup.string().required("ادخل Api Merchant Key"),
    test_geidea_api_secret: yup.string().required("ادخل Api Secret"),
    mail_name: yup.string().required("ادخل البريد الإلكتروني"),
    mail_password: yup.string().required("ادخل كلمة المرور"),
    geidea_status: yup
      .string()
      .oneOf(["test", "production"], "القيمة يجب أن تكون test أو production")
      .required("اختار حالة جيديا"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ExternalServicesDetails = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      test_geidea_api_merchant_Key: "",
      test_geidea_api_secret: "",
      geidea_api_merchant_Key: "",
      geidea_api_secret: "",
      mail_name: "",
      mail_password: "",
      geidea_status: "test",
    },
  });

  const { data: settingData, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllSettings,
    queryFn: async () => await fetchClient(`client/setting`, axios_config),
  });

  const [isEditing, setIsEditing] = useState(false);

  const [confirmAction, setConfirmAction] = useState(false);
  const [confirmType, setConfirmType] = useState<"form" | "switch" | null>(null);

  useEffect(() => {
    if (settingData) {
      const merchantKey = settingData.data.find((item: any) => item.key === "geidea_api_merchant_Key")?.value;
      const secret = settingData.data.find((item: any) => item.key === "geidea_api_secret")?.value;
      const testMerchantKey = settingData.data.find((item: any) => item.key === "test_geidea_api_merchant_Key")?.value;
      const testSecret = settingData.data.find((item: any) => item.key === "test_geidea_api_secret")?.value;
      const mail = settingData.data.find((item: any) => item.key === "mail_name")?.value;
      const password = settingData.data.find((item: any) => item.key === "mail_password")?.value;
      const geideaStatus = settingData.data.find((item: any) => item.key === "geidea_status")?.value;

      reset({
        geidea_api_merchant_Key: merchantKey || "",
        geidea_api_secret: secret || "",
        test_geidea_api_merchant_Key: testMerchantKey || "",
        test_geidea_api_secret: testSecret || "",
        mail_name: mail || "",
        mail_password: password || "",
        geidea_status: geideaStatus || "test",
      });
    }
  }, [settingData, reset]);

  const updateSettings = useMutation({
    mutationFn: (submitData: FormData) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const payload = {
        settings: Object.entries(submitData).map(([key, value]) => ({
          key,
          value,
          label_name: key,
        })),
      };

      return postData("client/setting/update", JSON.stringify(payload), myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: "تم التعديل بنجاح", color: "success" });
        setIsEditing(false);
      }
    },
    onError: () => {
      addToast({ title: "عذرا حدث خطأ ما", color: "danger" });
    },
  });

  const params = useParams();
  const service_id = params.id;

  const handleConfirm = () => {
    if (confirmType === "form") {
      updateSettings.mutate(getValues());
    } else if (confirmType === "switch") {
      const current = getValues("geidea_status");
      const newStatus = current === "test" ? "production" : "test";
      updateSettings.mutate({ ...getValues(), geidea_status: newStatus });
    }
    setConfirmAction(false);
    setConfirmType(null);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="px-4 py-6">
      <div className="touch-none tap-highlight-transparent select-none w-full bg-content1 border border-stroke max-w-full rounded-2xl gap-5 p-4">
        {service_id === "geidea" && (
          <div className="mb-6">
            <Controller
              name="geidea_status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${field.value === "test" ? "text-warning" : "text-gray-500"}`}>Test</span>

                  <Switch
                    isSelected={field.value === "production"}
                    onValueChange={(selected) => {
                      const newStatus = selected ? "production" : "test";
                      setConfirmType("switch");
                      setConfirmAction(true);
                      field.onChange(newStatus);
                    }}
                    color="success"
                  />

                  <span className={`text-sm font-bold ${field.value === "production" ? "text-green-600" : "text-gray-500"}`}>Production</span>
                </div>
              )}
            />
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {service_id === "geidea" && (
            <>
              <Input label="Test Api Merchant Key" labelPlacement="outside" {...register("test_geidea_api_merchant_Key")} isDisabled={!isEditing} errorMessage={errors.test_geidea_api_merchant_Key?.message} />
              <Input label="Test Api Secret" labelPlacement="outside" {...register("test_geidea_api_secret")} isDisabled={!isEditing} errorMessage={errors.test_geidea_api_secret?.message} />
              <Input label="Api Merchant Key" labelPlacement="outside" {...register("geidea_api_merchant_Key")} isDisabled={!isEditing} errorMessage={errors.geidea_api_merchant_Key?.message} />
              <Input label="Api Secret"  labelPlacement="outside"{...register("geidea_api_secret")} isDisabled={!isEditing} errorMessage={errors.geidea_api_secret?.message} />
            </>
          )}

          {service_id === "mail" && (
            <>
              <Input label="البريد الإلكتروني"  labelPlacement="outside"{...register("mail_name")} isDisabled={!isEditing} errorMessage={errors.mail_name?.message} />
              <Input label="كلمة المرور"  labelPlacement="outside"{...register("mail_password")} isDisabled={!isEditing} errorMessage={errors.mail_password?.message} />
            </>
          )}

          <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
            {!isEditing ? (
              <Button className="text-white" onPress={() => setIsEditing(true)} color="primary">
                تعديل
              </Button>
            ) : (
              <>
                <Button
                  onPress={() => {
                    setConfirmType("form");
                    setConfirmAction(true);
                  }}
                  color="primary"
                  variant="solid"
                  isDisabled={updateSettings.isPending}
                >
                  {updateSettings.isPending && <Spinner color="white" className="text-white" size="sm" />} حفظ
                </Button>
                <Button onPress={() => setIsEditing(false)} color="danger" className="text-white">
                  إلغاء
                </Button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmAction}
        onCancel={() => {
          setConfirmAction(false);
          setConfirmType(null);
        }}
        onConfirm={handleConfirm}
        title={confirmType === "form" ? "تأكيد التعديل" : "تأكيد تغيير الحالة"}
        message={
          confirmType === "form"
            ? "هل أنت متأكد من حفظ التعديلات؟"
            : "هل أنت متأكد من تغيير حالة جيديا؟"
        }
      />
    </div>
  );
};
