import React, { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Button,
  Input,
  SelectItem,
  AccordionItem,
  addToast,
  Select,
  useDisclosure,
  Modal,
  ModalContent,
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
import { AddSquare, Trash } from "iconsax-reactjs";
import { getCookie } from "cookies-next";

const locales = ["ar", "en"] as const;

export const Subscriptions = ({
  setActiveStep,
  programId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const onSubmit = async (data: SubscriptionsFormData) => {
    addSubscriptionToProgram.mutate(data);
  };

  const handleCancel = () => {
    reset();
    setSelectedValues({});
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
          subscripe_days: item?.subscription_plan,
          price: item?.sell_price,
          discount_price: item.subscription_price,
          duration: item.lesson_duration,
          number_of_session_per_week: item.number_of_lessons,
          type: item.subscription_type,
          is_special_plan: item?.is_special_plan,
          ...(item?.is_special_plan === "true" ? item.localizedFields : {}),
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
      <div className="flex flex-col">
        <div className="flex items-center *:bg-primary/15  *:flex-1 *:px-4 *:py-5 *:border *:border-primary *:text-primary *:text-xs *:font-semibold">
          <div>خطة الإشتراك</div>
          <div>نوع الإشتراك</div>
          <div>سعر الإشتراك</div>
          <div>سعر البيع </div>
          <div>عدد الحصص </div>
          <div>مدة المحاضرة </div>
          <div>خطة مميزه؟ </div>
          {fields.length > 1 && <div>الإجراءات</div>}
        </div>
        {fields.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex items-center *:flex-1 *:px-4 *:py-2 *:border *:border-[#EAF0FD] text-xs font-semibold">
              <Controller
                name={`subscriptions.${index}.subscription_plan`}
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="إختر"
                    selectedKeys={[field.value]}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    isInvalid={
                      !!errors.subscriptions?.[index]?.subscription_plan
                        ?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.subscription_plan?.message
                    }
                    radius="none"
                    classNames={{
                      trigger:
                        "bg-white shadow-none data-[hover=true]:bg-white",
                    }}
                  >
                    {subscriptionPeriods?.data?.map((period: any) => (
                      <SelectItem key={period.days}>{period.title}</SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                name={`subscriptions.${index}.subscription_type`}
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="إختر"
                    selectedKeys={[field.value]}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    isInvalid={
                      !!errors.subscriptions?.[index]?.subscription_type
                        ?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.subscription_type?.message
                    }
                    radius="none"
                    classNames={{
                      trigger:
                        "bg-white shadow-none data-[hover=true]:bg-white",
                    }}
                  >
                    <SelectItem key="single">فردي</SelectItem>
                    <SelectItem key="family">عائلة</SelectItem>
                  </Select>
                )}
              />

              <Input
                placeholder="أكتب هنا"
                type="text"
                {...register(`subscriptions.${index}.subscription_price`)}
                isInvalid={
                  !!errors.subscriptions?.[index]?.subscription_price?.message
                }
                errorMessage={
                  errors.subscriptions?.[index]?.subscription_price?.message
                }
                classNames={{
                  inputWrapper:
                    "bg-white shadow-none data-[hover=true]:bg-white",
                }}
                endContent={
                  <span className="text-black-text font-bold text-sm">ج.م</span>
                }
                radius="none"
              />

              <Input
                placeholder="أكتب هنا"
                type="text"
                {...register(`subscriptions.${index}.sell_price`)}
                isInvalid={!!errors.subscriptions?.[index]?.sell_price?.message}
                errorMessage={
                  errors.subscriptions?.[index]?.sell_price?.message
                }
                classNames={{
                  inputWrapper:
                    "bg-white shadow-none data-[hover=true]:bg-white",
                }}
                endContent={
                  <span className="text-black-text font-bold text-sm">ج.م</span>
                }
                radius="none"
              />

              <Input
                placeholder="أكتب هنا"
                type="text"
                {...register(`subscriptions.${index}.number_of_lessons`)}
                isInvalid={
                  !!errors.subscriptions?.[index]?.number_of_lessons?.message
                }
                errorMessage={
                  errors.subscriptions?.[index]?.number_of_lessons?.message
                }
                classNames={{
                  inputWrapper:
                    "bg-white shadow-none data-[hover=true]:bg-white",
                }}
                radius="none"
                endContent={
                  <span className="text-black-text font-bold text-sm">حصه</span>
                }
              />

              <Controller
                name={`subscriptions.${index}.lesson_duration`}
                control={control}
                render={({ field }) => (
                  <Select
                    selectedKeys={
                      field.value ? new Set([String(field.value)]) : new Set()
                    }
                    onSelectionChange={(keys: any) => {
                      const selectedVal = Array.from(keys)[0] as string;
                      field.onChange(selectedVal || "");
                    }}
                    placeholder="اختر"
                    isInvalid={
                      !!errors.subscriptions?.[index]?.lesson_duration?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.lesson_duration?.message
                    }
                    classNames={{
                      trigger:
                        "bg-white shadow-none data-[hover=true]:bg-white",
                    }}
                    radius="none"
                    renderValue={(selectedItems) => {
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
                  </Select>
                )}
              />

              <Controller
                name={`subscriptions.${index}.is_special_plan`}
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="إختر"
                    selectedKeys={[field.value]}
                    onSelectionChange={(keys) => {
                      field.onChange(Array.from(keys)[0]);
                      keys?.currentKey === "true" && onOpen();
                    }}
                    isInvalid={
                      !!errors.subscriptions?.[index]?.is_special_plan?.message
                    }
                    errorMessage={
                      errors.subscriptions?.[index]?.is_special_plan?.message
                    }
                    radius="none"
                    classNames={{
                      trigger:
                        "bg-white shadow-none data-[hover=true]:bg-white",
                    }}
                  >
                    <SelectItem key="true">نعم</SelectItem>
                    <SelectItem key="false">لا</SelectItem>
                  </Select>
                )}
              />

              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                size="4xl"
              >
                <ModalContent>
                  {(onClose) => (
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
                    </div>
                  )}
                </ModalContent>
              </Modal>

              {fields.length > 1 && (
                <div className="text-center">
                  <Button
                    type="button"
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setSelectedValues((prev) => {
                        const newValues = { ...prev };
                        delete newValues[index];
                        return newValues;
                      });
                      remove(index);
                    }}
                    className="border-none data-[hover=true]:bg-white/10"
                  >
                    <Trash size={20} />
                  </Button>
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

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
