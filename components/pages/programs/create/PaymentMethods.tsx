"use client";

import { addToast, Avatar, Button, cn, Switch } from "@heroui/react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { Loader } from "@/components/global/Loader";
import { getCookie } from "cookies-next";
import { EmptyWalletChange, Wallet } from "iconsax-reactjs";

// Helper to generate dynamic schema based on fetched payment methods
const createPaymentMethodsSchema = (data: any[]) => {
  const schemaFields: Record<string, any> = {};
  data?.forEach((method) => {
    schemaFields[method.id] = yup.boolean().default(false);
  });
  return yup.object().shape(schemaFields);
};

// Define form data type
type PaymentMethodsFormData = Record<string, boolean>;

// Extract only the selected payment method IDs
const extractSelectedPaymentMethodIds = (
  formData: PaymentMethodsFormData
): string[] =>
  Object.entries(formData)
    .filter(([, selected]) => selected)
    .map(([id]) => id);

export const PaymentMethods = ({
  setActiveStep,
  programId,
  initialData,
  mode
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
  initialData?: any;
  mode?: string;
}) => {
  
  
  const { data: paymentMethods, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/payment/method`, axios_config),
    queryKey: AllQueryKeys.GetAllPaymentMethods,
  });

  // Schema based on fetched methods
  const dynamicSchema = useMemo(() => {
    return createPaymentMethodsSchema(paymentMethods?.data || []);
  }, [paymentMethods?.data]);

  // Default form values
  const defaultValues = useMemo(() => {
  const defaults: Record<string, boolean> = {};

  const selectedIds =
    initialData?.data?.payment_methods?.map(
      (pm: { id: number | string }) => pm.id?.toString()
    ) || [];

  paymentMethods?.data?.forEach((method: { id: number | string }) => {
    defaults[method.id.toString()] = selectedIds.includes(method.id.toString());
  });

  return defaults;
}, [paymentMethods?.data, initialData]);
console.log('defaultValues', defaultValues);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<PaymentMethodsFormData>({
    resolver: yupResolver(dynamicSchema),
    defaultValues,
  });

  useEffect(() => {
    if (paymentMethods?.data) {
      reset(defaultValues);
    }
  }, [paymentMethods?.data, initialData, defaultValues, reset]);

  const onSubmit = async (data: PaymentMethodsFormData) => {
    assignPaymentMethodsMutation.mutate(data);
  };

  const handleCancel = () => reset(defaultValues);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const assignPaymentMethodsMutation = useMutation({
    mutationFn: (submitData: PaymentMethodsFormData) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      const allowedMethods = extractSelectedPaymentMethodIds(submitData);

      const formData = {
        program_id: programId,
        payment_methods: allowedMethods?.map((method) => {
          return { payment_method_id: method };
        }),
      };

      return postData(
        "client/program/assign/payment/methods/to/program",
        JSON.stringify(formData),
        myHeaders
      );
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error Adding Payment Methods: ${data.message}`,
          color: "danger",
        });
      } else {
        setActiveStep(3);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-3 px-4 py-6"
    >
      {isLoading ? (
        <Loader />
      ) : (
        paymentMethods?.data?.map(
          (item: {
            id: string;
            title: string;
            image: string;
            description: string;
          }) => (
            <Controller
              key={item.id}
              name={`${item.id}`}
              control={control}
              render={({ field }) => (
                <>
                  <Switch
                    color="success"
                    onChange={(e) => field.onChange(e.target.checked)}
                     isSelected={field.value}
                    classNames={{
                      base: cn(
                        "flex flex-row-reverse w-full bg-content1 hover:bg-content2 items-center border border-stroke max-w-full",
                        "justify-between cursor-pointer rounded-2xl gap-2 p-4",
                        "data-[selected=true]:border-success"
                      ),
                      wrapper: "p-0 h-4 overflow-visible",
                      thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-success",
                        "group-data-[selected=true]:ms-6",
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ms-4"
                      ),
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={item?.image}
                        size="md"
                        radius="sm"
                        alt={item.title}
                        fallback={<EmptyWalletChange />}
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-black-text">
                          {item.title}
                        </p>

                        <p
                          className="font-bold text-xs text-title/60"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    </div>
                  </Switch>
                  {errors[item.id] && (
                    <span className="text-danger text-xs font-bold">
                      {errors[item.id]?.message}
                    </span>
                  )}
                </>
              )}
            />
          )
        )
      )}

      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          type="button"
          onPress={handleCancel}
          variant="bordered"
          color="primary"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          isLoading={assignPaymentMethodsMutation.isPending}
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
