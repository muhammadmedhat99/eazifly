import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  cn,
  Input,
  Radio,
  RadioGroup,
  Select as HeroSelect,
  SelectItem,
} from "@heroui/react";
import Select from "@/components/global/ClientOnlySelect";
import { customStyles } from "@/lib/const";
import { subscriptionsSchema, SubscriptionsFormData } from "./schemas";

type Option = {
  value: string;
  label: string;
};

const options: Option[] = [
  { value: "1", label: "السبت" },
  { value: "2", label: "الأحد" },
  { value: "3", label: "الاثنين" },
  { value: "4", label: "الثلاثاء" },
  { value: "5", label: "الاربعاء" },
  { value: "6", label: "الخميس" },
  { value: "7", label: "الجمعة" },
];

const lessonDurationOptions = [
  { key: "1", label: "30 دقيقه" },
  { key: "2", label: "60 دقيقه" },
  { key: "3", label: "90 دقيقه" },
  { key: "4", label: "120 دقيقه" },
];

export const Subscriptions = ({
  setActiveStep,
  programId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  programId: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SubscriptionsFormData>({
    resolver: yupResolver(subscriptionsSchema),
    defaultValues: {
      subscription_plan: "",
      subscription_type: "",
      subscription_price: "",
      sell_price: "",
      number_of_lessons: "",
      lesson_duration: "",
      lessons_days: [],
      repeated_table: "",
    },
  });

  const onSubmit = async (data: SubscriptionsFormData) => {
    try {
      console.log("Subscriptions Data:", data);
      console.log("Program ID:", programId);

      // Here you would typically send the data to your API
      // const response = await updateProgramSubscriptions(programId, data);

      // If successful, move to next step
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving subscriptions:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleCancel = () => {
    reset();
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 p-5 border border-stroke rounded-xl">
        <Controller
          name="subscription_plan"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              value={field.value}
              onChange={(key) => field.onChange(key)}
              isInvalid={!!errors.subscription_plan?.message}
              errorMessage={errors.subscription_plan?.message}
              label="خطة الإشتراك"
              classNames={{
                wrapper: "flex-row",
                label: "text-[#272727] font-bold text-sm",
                base: "mb-4",
              }}
            >
              <Radio
                value="per_month"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                شهري
              </Radio>
              <Radio
                value="3_months"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                3 شهور
              </Radio>
              <Radio
                value="6_month"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                6 شهور
              </Radio>
              <Radio
                value="year"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                سنوي
              </Radio>
            </RadioGroup>
          )}
        />

        <Controller
          name="subscription_type"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              value={field.value}
              onChange={(key) => field.onChange(key)}
              isInvalid={!!errors.subscription_type?.message}
              errorMessage={errors.subscription_type?.message}
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
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                فردي
              </Radio>
              <Radio
                value="group"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                مجموعة
              </Radio>
              <Radio
                value="family"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-between font-bold flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "text-xs group-data-[selected=true]:text-primary",
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
          {...register("subscription_price")}
          isInvalid={!!errors.subscription_price?.message}
          errorMessage={errors.subscription_price?.message}
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
          {...register("sell_price")}
          isInvalid={!!errors.sell_price?.message}
          errorMessage={errors.sell_price?.message}
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
          {...register("number_of_lessons")}
          isInvalid={!!errors.number_of_lessons?.message}
          errorMessage={errors.number_of_lessons?.message}
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
          name="lesson_duration"
          control={control}
          render={({ field }) => (
            <HeroSelect
              {...field}
              selectedKeys={field.value ? [field.value] : [""]}
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys)[0]);
              }}
              label="مدة المحاضره"
              labelPlacement="outside"
              placeholder="اختر مدة المحاضرة"
              isInvalid={!!errors.lesson_duration?.message}
              errorMessage={errors.lesson_duration?.message}
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                base: "mb-4",
                value: "text-[#87878C] text-sm",
              }}
            >
              {lessonDurationOptions.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </HeroSelect>
          )}
        />

        <Controller
          name="lessons_days"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <label className="text-[#272727] font-bold text-sm mb-1">
                أيام الأسبوع
              </label>
              <Select
                {...field}
                id="lessons_days"
                placeholder="أختر الأيام المناسبة"
                options={options}
                isMulti={true}
                styles={customStyles}
                isClearable
                value={options.filter((opt) =>
                  field.value?.includes(opt.value)
                )}
                onChange={(selected) =>
                  field.onChange(
                    (selected as Option[])?.map((opt) => opt.value) || []
                  )
                }
              />
              {errors?.lessons_days?.message && (
                <p className="text-xs text-danger">
                  {errors.lessons_days.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="repeated_table"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              value={field.value}
              onChange={(key) => field.onChange(key)}
              isInvalid={!!errors.repeated_table?.message}
              errorMessage={errors.repeated_table?.message}
              label="جدول متكرر"
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
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-center font-bold flex-1",
                    "flex-row-reverse max-w-[200px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-1 border-stroke",
                    "data-[selected=true]:border-primary data-[selected=true]:bg-primary/20"
                  ),
                  control: "hidden outline-none",
                  wrapper: "hidden",
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                نعم
              </Radio>
              <Radio
                value="group"
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-background hover:bg-primary/20 items-center justify-center font-bold flex-1",
                    "flex-row-reverse max-w-[200px] cursor-pointer rounded-lg gap-4 px-4 py-2 border-1 border-stroke",
                    "data-[selected=true]:border-primary data-[selected=true]:bg-primary/20"
                  ),
                  control: "hidden outline-none",
                  wrapper: "hidden",
                  label: "text-xs group-data-[selected=true]:text-primary",
                }}
              >
                لا
              </Radio>
            </RadioGroup>
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          type="button"
          onPress={handleCancel}
          variant="solid"
          color="default"
          className="text-white bg-gray-500"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
