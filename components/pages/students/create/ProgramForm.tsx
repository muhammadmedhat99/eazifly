import React from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  cn,
  Input,
  Radio,
  RadioGroup,
  Select as HeroSelect,
  SelectItem,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";

import Select from "@/components/global/ClientOnlySelect";
import { customStyles } from "@/lib/const";

type Option = {
  value: string;
  label: string;
};
const options: Option[] = [
  {
    value: "1",
    label: "30 دقيقه",
  },
  {
    value: "2",
    label: "60 دقيقه",
  },
  {
    value: "3",
    label: "90 دقيقه",
  },
  {
    value: "4",
    label: "120 دقيقه",
  },
];

const schema = yup
  .object({
    program: yup.string().required("اختر البرنامج"),
    number_of_students: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد الطلاب"),
    number_of_lessons: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد الحصص"),
    lesson_duration: yup.string().required("اختر مدة الحصة"),
    payment_methods: yup
      .array()
      .of(yup.string())
      .min(1, "اختر وسيلة دفع")
      .required("اختر وسيلة دفع"),
    payment_amount: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال المبلغ المدفوع"),
    payment_plan: yup.string().required("اختر خطة الدفع"),
    recept: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ProgramForm = ({
  setActiveStep,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      payment_methods: [],
    },
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
    >
      <Controller
        name="program"
        control={control}
        render={({ field }) => (
          <HeroSelect
            {...field}
            selectedKeys={field.value ? [field.value] : [""]}
            onSelectionChange={(keys) => {
              field.onChange(Array.from(keys)[0]);
            }}
            label="البرنامج"
            labelPlacement="outside"
            placeholder="اختر البرنامج"
            isInvalid={!!errors.program?.message}
            errorMessage={errors.program?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              {
                key: "1",
                label: "برنامج الدراسات الإجتماعيه للصف السادس الإبتدائي",
              },
              {
                key: "2",
                label: "برنامج الرياضيات العامة للصف الثالث الإعدادي",
              },
              {
                key: "3",
                label: "برنامج الرياضيات العامة للصف الثاني الإعدادي",
              },
              {
                key: "4",
                label: "برنامج الرياضيات العامة للصف الأول الإعدادي",
              },
              {
                key: "5",
                label: "برنامج الرياضيات العامة للصف الأول الثانوي",
              },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </HeroSelect>
        )}
      />

      <Controller
        name="payment_plan"
        control={control}
        render={({ field }) => (
          <RadioGroup
            {...field}
            value={field.value}
            onChange={(key) => {
              field.onChange(key);
            }}
            isInvalid={!!errors.payment_plan?.message}
            errorMessage={errors.payment_plan?.message}
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
            placeholder="اختر البرنامج"
            isInvalid={!!errors.lesson_duration?.message}
            errorMessage={errors.lesson_duration?.message}
            classNames={{
              label: "text-[#272727] font-bold text-sm",
              base: "mb-4",
              value: "text-[#87878C] text-sm",
            }}
          >
            {[
              {
                key: "1",
                label: "30 دقيقه",
              },
              {
                key: "2",
                label: "60 دقيقه",
              },
              {
                key: "3",
                label: "90 دقيقه",
              },
              {
                key: "4",
                label: "120 دقيقه",
              },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </HeroSelect>
        )}
      />
      <Controller
        name="payment_methods"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-[#272727] font-bold text-sm">
              طرق الدفع
            </label>
            <Select
              {...field}
              id="payment_methods"
              placeholder="اختر طرق الدفع"
              options={options}
              isMulti={true}
              styles={customStyles}
              isClearable
              value={options.filter((opt) => field.value?.includes(opt.value))}
              onChange={(selected) =>
                field.onChange((selected as Option[]).map((opt) => opt.value))
              }
            />
            <p className="text-xs text-danger">
              {errors?.payment_methods?.message}
            </p>
          </div>
        )}
      />

      <Input
        label="عدد الطلاب"
        placeholder="نص الكتابه"
        type="text"
        {...register("number_of_students")}
        isInvalid={!!errors.number_of_students?.message}
        errorMessage={errors.number_of_students?.message}
        labelPlacement="outside"
        classNames={{
          label: "text-[#272727] font-bold text-sm",
          inputWrapper: "shadow-none",
          base: "mb-4",
        }}
      />
      <Input
        label="المبلغ المدفوع"
        placeholder="نص الكتابه"
        type="text"
        {...register("payment_amount")}
        isInvalid={!!errors.payment_amount?.message}
        errorMessage={errors.payment_amount?.message}
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
      <Controller
        name="recept"
        control={control}
        render={({ field, fieldState }) => (
          <DropzoneField
            label="إيصال الدفع"
            value={(field.value as any) || []}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
        <Button
          type="button"
          onPress={() => reset()}
          variant="solid"
          color="primary"
          className="text-white"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="text-white"
          // isDisabled={CreateStudent?.isPending}
        >
          {/* {CreateStudent?.isPending && <Spinner color="white" size="sm" />} */}
          التالي
        </Button>
      </div>
    </form>
  );
};
