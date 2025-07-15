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
  addToast,
  DatePicker,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";

import Select from "@/components/global/ClientOnlySelect";
import { axios_config, customStyles } from "@/lib/const";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const createSchema = (paymentRequired: number) =>
  yup.object({
    payment_methods: yup
      .string()
      .required("اختر وسيلة دفع"),

    payment_amount: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال المبلغ المدفوع")
      .test(
        "match-expected",
        `يجب أن يكون المبلغ المدفوع هو ${paymentRequired} ج.م`,
        (value) => value === paymentRequired
      ),

    start_date: yup
      .string()
      .required("اختر تاريخ البدء"),

    recept: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
  });

type FormData = {
  payment_methods: string;
  payment_amount: number;
  start_date: string;
  recept: FileList;
};

export const PaymentForm = ({
  setActiveStep,
  studentCount,
  programId,
  planData,
  userId,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  studentCount: string;
  programId: string;
  planData: any;
  userId: string;
}) => {
    const paymentRequired = Number(studentCount) * Number(planData.discount_price || 0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(createSchema(paymentRequired)),
    });

    const router = useRouter();
    
    const onSubmit = (data: FormData) => CreatePlan.mutate(data);

    const CreatePlan = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append("user_id", userId);
            formdata.append("plan_id", planData?.id);
            formdata.append("start_date", submitData.start_date.toString());
            formdata.append("paid", submitData.payment_amount.toString());
            formdata.append("student_number", studentCount);
            {
                submitData.recept && formdata.append("image", submitData.recept[0]);
            }
            formdata.append("program_id", programId);
            formdata.append("payment_method_id", submitData.payment_methods);

            return postData("client/assign/program/to/user", formdata, myHeaders);
        },
        onSuccess: (data) => {
            if (data.message !== "success") {
                addToast({
                    title: data?.message,
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                reset();
                router.push('/students')
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

    const { data, isLoading } = useQuery({
        queryKey: ['GetPaymentMethods', programId],
        queryFn: async () => await fetchClient(`client/program/show/${programId}`, axios_config),
        enabled: !!programId,
    });

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
      >
          <Controller
              name="payment_methods"
              control={control}
              render={({ field }) => (
                  <HeroSelect
                      {...field}
                     selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                          const id = Array.from(keys)[0];
                          field.onChange(id);
                      }}
                      label="طرق الدفع"
                      labelPlacement="outside"
                      placeholder="اختر طرق الدفع"
                      isInvalid={!!errors.payment_methods?.message}
                      errorMessage={errors.payment_methods?.message}
                      classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          base: "mb-4",
                          value: "text-[#87878C] text-sm",
                      }}
                  >
                      {data?.data?.payment_methods?.map((item: any) => (
                          <SelectItem key={`${item.id}`}>{item.title}</SelectItem>
                      ))}
                  </HeroSelect>
              )}
          />

          <Input
              label="المبلغ المطلوب"
              placeholder="نص الكتابه"
              type="text"
              value={paymentRequired.toString()}
              disabled
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
              name="start_date"
              control={control}
              render={({ field }) => (
                  <div className="flex flex-col gap-1">
                      <label className="text-[#272727] font-bold text-sm">تاريخ البدء</label>
                      <Input
                          type="datetime-local"
                          {...field}
                      />
                      {errors.start_date?.message && (
                          <span className="text-red-500 text-xs mt-1">{errors.start_date.message}</span>
                      )}
                  </div>
              )}
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
              >
                  {/* {CreateStudent?.isPending && <Spinner color="white" size="sm" />} */}
                  التالي
              </Button>
          </div>
      </form>
  );
};
