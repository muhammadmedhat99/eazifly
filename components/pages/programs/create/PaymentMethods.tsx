import { Button, cn, Switch } from "@heroui/react";
import { EmptyWalletChange, WalletMinus } from "iconsax-reactjs";
import Image from "next/image";

import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormData } from "@/components/pages/programs/create";

export const PaymentMethods = ({
  setActiveStep,
  form,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturn<FormData>;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-3 px-4 py-6"
    >
      <Controller
        name={`instant_payment`}
        control={control}
        render={({ field }) => (
          <>
            <Switch
              onChange={(e) => field.onChange(e.target.checked)}
              color="success"
              defaultSelected={field.value}
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
                  //selected
                  "group-data-[selected=true]:ms-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ms-4"
                ),
              }}
            >
              <div className="flex items-center gap-2">
                <WalletMinus size={32} />
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-black-text">دفع لحظي</p>
                  <p className="font-bold text-xs text-title/60">
                    مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال
                    النص. مثال :هذا النص هو جزء من عملية تحسين{" "}
                  </p>
                </div>
              </div>
            </Switch>
            <span className="text-danger text-xs font-bold">
              {errors.instant_payment && errors.instant_payment.message}
            </span>
          </>
        )}
      />
      <Controller
        name="wallet_payment"
        control={control}
        render={({ field }) => (
          <>
            <Switch
              color="success"
              onChange={(e) => field.onChange(e.target.checked)}
              defaultSelected={field.value}
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
                  //selected
                  "group-data-[selected=true]:ms-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ms-4"
                ),
              }}
            >
              <div className="flex items-center gap-2">
                <EmptyWalletChange size={32} />
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-black-text">محفظة الكترونية</p>
                  <p className="font-bold text-xs text-title/60">
                    مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال
                    النص. مثال :هذا النص هو جزء من عملية تحسين{" "}
                  </p>
                </div>
              </div>
            </Switch>
            <span className="text-danger text-xs font-bold">
              {errors.wallet_payment && errors.wallet_payment.message}
            </span>
          </>
        )}
      />

      <Controller
        name="instapay_Payment"
        control={control}
        render={({ field }) => (
          <>
            <Switch
              color="success"
              onChange={(e) => field.onChange(e.target.checked)}
              defaultSelected={field.value}
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
                  //selected
                  "group-data-[selected=true]:ms-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ms-4"
                ),
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/img/static/instapay.png"
                  width={32}
                  height={32}
                  alt="instapay"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-black-text">تطبيق إنستا باي</p>
                  <p className="font-bold text-xs text-title/60">
                    مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال
                    النص. مثال :هذا النص هو جزء من عملية تحسين{" "}
                  </p>
                </div>
              </div>
            </Switch>
            <span className="text-danger text-xs font-bold">
              {errors.instapay_Payment && errors.instapay_Payment.message}
            </span>
          </>
        )}
      />

      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          type="button"
          onPress={() => form.reset()}
          variant="solid"
          color="primary"
          className="text-white"
        >
          إلغاء
        </Button>
        <Button
          type="button"
          variant="solid"
          color="primary"
          className="text-white"
          onPress={() => setActiveStep((prev) => prev + 1)}
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
