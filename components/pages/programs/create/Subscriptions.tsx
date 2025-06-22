import React, { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Button,
  cn,
  Input,
  Radio,
  RadioGroup,
  Select as HeroSelect,
  SelectItem,
  Accordion,
  AccordionItem,
  addToast,
} from "@heroui/react";

import { subscriptionsSchema, SubscriptionsFormData } from "./schemas";
import {
  LocalizedField,
  LocalizedTextArea,
} from "@/components/global/LocalizedField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { AddSquare, CloseCircle } from "iconsax-reactjs";
import { getCookie } from "cookies-next";

const locales = ["ar", "en"] as const;

export const Subscriptions = ({
  setActiveStep,
  programId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
}) => {
  // Changed to store selected values for each subscription index
  const [selectedValues, setSelectedValues] = useState<{
    [key: number]: Set<string>;
  }>({});

  const { data: subscriptionPeriods, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/plan/subscription/period`, axios_config),
    queryKey: AllQueryKeys.GetAllSubscriptionPeriods,
  });
  const { data: sessionPeriods, isLoading: sessionPeriodsLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/plan/session/time`, axios_config),
    queryKey: AllQueryKeys.GetAllSessionTimes,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<SubscriptionsFormData>({
    resolver: yupResolver(subscriptionsSchema),
    defaultValues: {
      subscriptions: [
        {
          localizedFields: locales.reduce(
            (acc, locale) => ({
              ...acc,
              [locale]: { title: "", label: "", description: "" },
            }),
            {} as any
          ),
          subscription_plan: "",
          subscription_type: "",
          subscription_price: "",
          sell_price: "",
          number_of_lessons: "",
          lesson_duration: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subscriptions",
  });

  // Helper function to get selected value for a specific index
  const getSelectedValue = (index: number) => {
    const currentValue = watch(`subscriptions.${index}.lesson_duration`);
    return currentValue
      ? new Set([currentValue])
      : selectedValues[index] || new Set();
  };

  // Helper function to update selected value for a specific index
  const updateSelectedValue = (index: number, keys: Set<string>) => {
    setSelectedValues((prev) => ({
      ...prev,
      [index]: keys,
    }));
  };

  const onSubmit = async (data: SubscriptionsFormData) => {
    addSubscriptionToProgram.mutate(data);
  };

  const handleCancel = () => {
    reset();
    setSelectedValues({}); // Reset selected values
  };

  const addNewSubscription = () => {
    append({
      localizedFields: locales.reduce(
        (acc, locale) => ({
          ...acc,
          [locale]: { title: "", label: "", description: "" },
        }),
        {} as any
      ),
      subscription_plan: "",
      subscription_type: "",
      subscription_price: "",
      sell_price: "",
      number_of_lessons: "",
      lesson_duration: "",
      is_special_plan: "false",
    });
  };

  const addSubscriptionToProgram = useMutation({
    mutationFn: (submitData: SubscriptionsFormData) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formData = {
        plans: submitData?.subscriptions?.map((item) => ({
          program_id: programId,
          ...item.localizedFields,
          subscripe_days: item?.subscription_plan,
          price: item?.sell_price,
          discount_price: item.subscription_price,
          duration: item.lesson_duration,
          number_of_session_per_week: item.number_of_lessons,
          type: item.subscription_type,
          is_special_plan: false,
        })),
      };

      return postData(
        "client/program/plan/store",
        JSON.stringify(formData),
        myHeaders
      );
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error Adding Subscription Plan: ${data.message}`,
          color: "danger",
        });
      } else {
        setActiveStep(4);
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-5">
      <Accordion
        defaultExpandedKeys={[0, 1]}
        variant="splitted"
        className="mb-6"
      >
        {fields.map((item, index) => (
          <AccordionItem
            key={index}
            aria-label={`Subscription ${index + 1}`}
            title={
              <div className="flex">
                <span>الاشتراك {index + 1}</span>
              </div>
            }
            classNames={{ base: "shadow-none border border-stroke" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 p-5">
              <LocalizedField
                control={control}
                name={`subscriptions.${index}.localizedFields`}
                fieldName="title"
                label="Title"
              />

              <LocalizedField
                control={control}
                name={`subscriptions.${index}.localizedFields`}
                fieldName="label"
                label="Label"
              />

              <LocalizedTextArea
                control={control}
                name={`subscriptions.${index}.localizedFields`}
                fieldName="description"
                label="Description"
                className=""
              />

              <Controller
                name={`subscriptions.${index}.subscription_plan`}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    isInvalid={
                      !!errors.subscriptions?.[index]?.subscription_plan
                        ?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.subscription_plan?.message
                    }
                    label="خطة الإشتراك"
                    classNames={{
                      wrapper: "flex-row",
                      label: "text-[#272727] font-bold text-sm",
                      base: "mb-4",
                    }}
                  >
                    {subscriptionPeriods?.data?.map((period: any) => (
                      <Radio
                        key={period.days}
                        value={period.days}
                        classNames={{
                          base: cn(
                            "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                            "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                            "data-[selected=true]:border-primary"
                          ),
                          label:
                            "text-xs group-data-[selected=true]:text-primary",
                        }}
                      >
                        {period.title}
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              />

              <Controller
                name={`subscriptions.${index}.subscription_type`}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    isInvalid={
                      !!errors.subscriptions?.[index]?.subscription_type
                        ?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.subscription_type?.message
                    }
                    label="نوع الإشتراك"
                    classNames={{
                      wrapper: "flex-row",
                      label: "text-[#272727] font-bold text-sm",
                      base: "mb-4",
                    }}
                  >
                    <Radio
                      value="single"
                      classNames={{
                        base: cn(
                          "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                        label:
                          "text-xs group-data-[selected=true]:text-primary",
                      }}
                    >
                      فردي
                    </Radio>

                    <Radio
                      value="family"
                      classNames={{
                        base: cn(
                          "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                        label:
                          "text-xs group-data-[selected=true]:text-primary",
                      }}
                    >
                      عائلة
                    </Radio>
                  </RadioGroup>
                )}
              />

              <Input
                label="سعر الإشتراك"
                placeholder="أكتب السعر المناسب"
                type="text"
                {...register(`subscriptions.${index}.subscription_price`)}
                isInvalid={
                  !!errors.subscriptions?.[index]?.subscription_price?.message
                }
                errorMessage={
                  errors.subscriptions?.[index]?.subscription_price?.message
                }
                labelPlacement="outside"
                classNames={{
                  label: "text-[#272727] font-bold text-sm",
                  inputWrapper: "shadow-none",
                  base: "mb-4",
                }}
                endContent={
                  <span className="text-black-text font-bold text-sm">ج.م</span>
                }
              />

              <Input
                label="سعر البيع"
                placeholder="أكتب السعر المناسب"
                type="text"
                {...register(`subscriptions.${index}.sell_price`)}
                isInvalid={!!errors.subscriptions?.[index]?.sell_price?.message}
                errorMessage={
                  errors.subscriptions?.[index]?.sell_price?.message
                }
                labelPlacement="outside"
                classNames={{
                  label: "text-[#272727] font-bold text-sm",
                  inputWrapper: "shadow-none",
                  base: "mb-4",
                }}
                endContent={
                  <span className="text-black-text font-bold text-sm">ج.م</span>
                }
              />

              <Input
                label="عدد حصص البرنامج"
                placeholder="نص الكتابه"
                type="text"
                {...register(`subscriptions.${index}.number_of_lessons`)}
                isInvalid={
                  !!errors.subscriptions?.[index]?.number_of_lessons?.message
                }
                errorMessage={
                  errors.subscriptions?.[index]?.number_of_lessons?.message
                }
                labelPlacement="outside"
                classNames={{
                  label: "text-[#272727] font-bold text-sm",
                  inputWrapper: "shadow-none",
                  base: "mb-4",
                }}
                endContent={
                  <span className="text-black-text font-bold text-sm">حصه</span>
                }
              />

              <Controller
                name={`subscriptions.${index}.lesson_duration`}
                control={control}
                render={({ field }) => (
                  <HeroSelect
                    selectedKeys={
                      field.value ? new Set([String(field.value)]) : new Set()
                    }
                    onSelectionChange={(keys: any) => {
                      const selectedVal = Array.from(keys)[0] as string;
                      field.onChange(selectedVal || "");
                    }}
                    label="مدة المحاضره"
                    labelPlacement="outside"
                    placeholder="اختر مدة المحاضرة"
                    isInvalid={
                      !!errors.subscriptions?.[index]?.lesson_duration?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.lesson_duration?.message
                    }
                    classNames={{
                      label: "text-[#272727] font-bold text-sm",
                      base: "mb-4",
                      value: "text-[#87878C] text-sm",
                    }}
                    renderValue={(selectedItems) => {
                      // selectedItems is an array of the selected item objects
                      if (!selectedItems.length) return "اختر مدة المحاضرة";
                      const selected = selectedItems[0];
                      return (
                        <div className="flex items-center">
                          <span>{selected?.props?.children[1]}</span>
                          <span>{selected?.props?.children[0]}</span>
                        </div>
                      );
                    }}
                  >
                    {sessionPeriods?.data.map(
                      (item: { id: string; time: string; title: string }) => (
                        <SelectItem key={item.id}>
                          {item.time}
                          {item.title}
                        </SelectItem>
                      )
                    )}
                  </HeroSelect>
                )}
              />

              <Controller
                name={`subscriptions.${index}.is_special_plan`}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    isInvalid={!!errors.subscriptions?.[index]?.message}
                    errorMessage={errors.subscriptions?.[index]?.message}
                    label="خطة مميزه"
                    classNames={{
                      wrapper: "flex-row",
                      label: "text-[#272727] font-bold text-sm",
                      base: "mb-4",
                    }}
                  >
                    <Radio
                      value={"true"}
                      classNames={{
                        base: cn(
                          "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-center font-bold flex-1",
                          "flex-row-reverse max-w-[200px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-1 border-stroke",
                          "data-[selected=true]:border-primary data-[selected=true]:bg-primary/20"
                        ),
                        control: "hidden outline-none",
                        wrapper: "hidden",
                        label:
                          "text-xs group-data-[selected=true]:text-primary",
                      }}
                    >
                      نعم
                    </Radio>
                    <Radio
                      value={"false"}
                      classNames={{
                        base: cn(
                          "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-center font-bold flex-1",
                          "flex-row-reverse max-w-[200px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-1 border-stroke",
                          "data-[selected=true]:border-primary data-[selected=true]:bg-primary/20"
                        ),
                        control: "hidden outline-none",
                        wrapper: "hidden",
                        label:
                          "text-xs group-data-[selected=true]:text-primary",
                      }}
                    >
                      لا
                    </Radio>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="col-span-2 flex items-center justify-end mb-5 me-5">
              {fields.length > 1 && (
                <Button
                  type="button"
                  size="md"
                  color="danger"
                  variant="bordered"
                  onPress={() => {
                    // Clean up selected value when removing subscription
                    setSelectedValues((prev) => {
                      const newValues = { ...prev };
                      delete newValues[index];
                      return newValues;
                    });
                    remove(index);
                  }}
                  className=""
                >
                  <span>حذف</span>
                  <CloseCircle size={20} />
                </Button>
              )}
            </div>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex items-center justify-center my-10">
        <Button variant="light" color="primary" onPress={addNewSubscription}>
          <AddSquare />
          <span className="font-bold">إضافه إشتراك جديد</span>
        </Button>
      </div>

      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          type="button"
          onPress={handleCancel}
          variant="bordered"
          color="primary"
          isDisabled={addSubscriptionToProgram.isPending}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          isLoading={addSubscriptionToProgram.isPending}
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
