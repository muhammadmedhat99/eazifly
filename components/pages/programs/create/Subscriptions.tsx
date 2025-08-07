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
import { useRouter } from "next/navigation";

const locales = ["ar", "en"] as const;

export const Subscriptions = ({
  setActiveStep,
  programId,
  initialData,
  mode,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
  initialData?: any;
  mode?: string;
}) => {
  const mappedDefaults = {
    subscriptions:
      initialData?.data?.plans.length > 0
        ? initialData?.data?.plans.map((plan: any) => ({
            localizedFields: {
              ar: {
                title: plan.title_ar || "",
                label: plan.label_ar || "",
                description: plan.description_ar || "",
              },
              en: {
                title: plan.title_en || "",
                label: plan.label_en || "",
                description: plan.description_en || "",
              },
            },
            subscription_plan: plan.subscripe_days || "",
            subscription_type: plan.type || "",
            subscription_price: plan.price || "",
            sell_price: plan.discount_price || "",
            number_of_lessons: plan.number_of_session_per_week || "",
            lesson_duration: plan.duration || "",
            is_special_plan: plan.is_special_plan === true ? "true" : "false",
          }))
        : [
            {
              localizedFields: {
                ar: { title: "", label: "", description: "" },
                en: { title: "", label: "", description: "" },
              },
              subscription_plan: "",
              subscription_type: "",
              subscription_price: "",
              sell_price: "",
              number_of_lessons: "",
              lesson_duration: "",
              is_special_plan: "",
            },
          ],
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
    defaultValues: mappedDefaults,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subscriptions",
  });

  const [duplicateIndexes, setDuplicateIndexes] = useState<number[]>([]);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const [modalValidationError, setModalValidationError] = useState(false);

  const onSubmit = async (data: SubscriptionsFormData) => {
    const rows = data.subscriptions;
    const duplicates: number[] = [];
    const seen = new Map<string, number>();

    // تحقق التكرار
    rows.forEach((sub, index) => {
      const key = [
        sub.subscription_plan,
        sub.subscription_type,
        sub.sell_price,
        sub.number_of_lessons,
      ].join("|");

      if (seen.has(key)) {
        duplicates.push(index);
        duplicates.push(seen.get(key)!);
      } else {
        seen.set(key, index);
      }
    });

    if (duplicates.length > 0) {
      const uniqueDuplicates = Array.from(new Set(duplicates));
      setDuplicateIndexes(uniqueDuplicates);
      setDuplicateError(
        "يوجد اشتراكان مكرران بنفس البيانات، يرجى تعديل أحدهما."
      );
      return;
    } else {
      setDuplicateIndexes([]);
      setDuplicateError(null);
    }

    const specialPlanErrors: number[] = [];

    rows.forEach((sub, index) => {
      if (sub.is_special_plan === "true") {
        const localized = sub.localizedFields;
        const ar = localized?.ar;

        if (
          !ar?.title?.trim() ||
          !ar?.label?.trim() ||
          !ar?.description?.trim()
        ) {
          specialPlanErrors.push(index);
        }
      }
    });

    if (specialPlanErrors.length > 0) {
      setDuplicateError("يجب إدخال عنوان، وسم، ووصف للخطة المميزة.");
      setDuplicateIndexes(specialPlanErrors);
      return;
    }

    // إذا كل شيء تمام
    setDuplicateIndexes([]);
    setDuplicateError(null);

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
        plans: submitData?.subscriptions?.map((item, index) => {
          const base = {
            program_id: programId,
            subscripe_days: item?.subscription_plan,
            discount_price: item?.sell_price,
            price: item.subscription_price,
            duration: item.lesson_duration,
            number_of_session_per_week: item.number_of_lessons,
            type: item.subscription_type,
            is_special_plan: item?.is_special_plan === "true",
          };

          // Add localizedFields if it's a special plan
          if (item.is_special_plan === "true") {
            Object.assign(base, item.localizedFields);
          }

          // Add plan_id in edit mode
          if (mode === "edit") {
            return {
              ...base,
              plan_id: initialData?.data?.plans?.[index]?.id,
            };
          }

          return base;
        }),
      };

      const endpoint =
        mode === "edit"
          ? "client/program/plan/update"
          : "client/program/plan/store";

      return postData(endpoint, JSON.stringify(formData), myHeaders);
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error Submitting Subscription Plan: ${data.message}`,
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
      console.error("Error submitting program:", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const router = useRouter();

  const handleReset = () => {
    if (initialData?.data?.id) {
      router.push(`/programs/${initialData.data.id}`);
    } else {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5">
      <div className="flex flex-col overflow-x-auto whitespace-nowrap">
        <div className="flex items-center *:bg-primary/15  *:flex-1 *:px-4 *:py-5 *:border *:border-primary *:text-primary *:text-xs *:font-semibold">
          <div className="min-w-[140px]">خطة الإشتراك</div>
          <div className="min-w-[140px]">نوع الإشتراك</div>
          <div className="min-w-[140px]">سعر الإشتراك</div>
          <div className="min-w-[140px]">سعر البيع </div>
          <div className="min-w-[140px]"> عدد الحصص الإسبوعية </div>
          <div className="min-w-[140px]">مدة المحاضرة </div>
          <div className="min-w-[140px]">خطة مميزه؟ </div>
          {fields.length > 1 && <div className="min-w-[140px]">الإجراءات</div>}
        </div>
        {fields.map((item, index) => (
          <React.Fragment key={item.id}>
            <div
              className={
                "flex items-center *:flex-1 *:px-4 *:py-2 *:border *:border-[#EAF0FD] text-xs font-semibold" +
                (duplicateIndexes.includes(index)
                  ? " bg-red-50 border border-red-400"
                  : "")
              }
            >
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
                        "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
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
                        "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
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
                    "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
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
                    "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
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
                    "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
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
                        "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
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
                        <SelectItem key={item.time}>
                          {item.time} دقيقة
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
                      if (Array.from(keys)[0] === "true") {
                        setActiveIndex(index);
                        onOpen();
                      }
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
                        "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
                    }}
                  >
                    <SelectItem key="true">نعم</SelectItem>
                    <SelectItem key="false">لا</SelectItem>
                  </Select>
                )}
              />

              {fields.length > 1 && (
                <div className="text-center min-w-[140px]">
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
      {modalValidationError && (
        <div className="text-red-600 text-sm mt-4 font-semibold text-center">
          يجب إدخال عنوان ووصف واسم للخطة المميزة قبل المتابعة.
        </div>
      )}
      {isOpen && activeIndex !== null && (
        <div className="overflow-x-hidden">
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="4xl"
            className="overflow-x-hidden"
          >
            <ModalContent className="overflow-x-hidden">
              {() => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 p-5 max-h-[500px] max-w-full overflow-x-hidden">
                  <LocalizedField
                    control={control}
                    name={`subscriptions.${activeIndex}.localizedFields`}
                    fieldName="title"
                    label="Title"
                  />
                  <LocalizedField
                    control={control}
                    name={`subscriptions.${activeIndex}.localizedFields`}
                    fieldName="label"
                    label="Label"
                  />
                  <LocalizedTextArea
                    control={control}
                    name={`subscriptions.${activeIndex}.localizedFields`}
                    fieldName="description"
                    label="Description"
                  />
                  <div className="flex items-center justify-end gap-4 mt-8 md:col-span-2">
                    <Button
                      type="button"
                      onPress={onOpenChange}
                      variant="bordered"
                      color="primary"
                      isDisabled={addSubscriptionToProgram.isPending}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onPress={onOpenChange}
                      variant="solid"
                      color="primary"
                      className="text-white"
                    >
                      حفظ
                    </Button>
                  </div>
                </div>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}

      {duplicateError && (
        <div className="text-red-600 text-sm mt-4 font-semibold text-center">
          {duplicateError}
        </div>
      )}

      <div className="flex items-center justify-center my-10">
        <Button variant="light" color="primary" onPress={addNewSubscription}>
          <AddSquare />
          <span className="font-bold">إضافه إشتراك جديد</span>
        </Button>
      </div>

      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          type="button"
          onPress={handleReset}
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
