"use client";

import React, { useState } from "react";
import { InformationForm } from "./InformationForm";
import { TeacherAndContent } from "./TeacherAndContent";
import { PaymentMethods } from "./PaymentMethods";
import { Subscriptions } from "./Subscriptions";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@heroui/react";

const languages = ["ar", "en"] as const;

const localizedStringSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  label: yup.string().required("Label is required"),
  goals: yup.string().required("Goals is required"),
  content: yup.string().required("Content is required"),
});

const schema = yup
  .object({
    localizedFields: yup
      .object()
      .shape(
        Object.fromEntries(
          languages.map((lang) => [lang, localizedStringSchema])
        )
      )
      .required(),

    image: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),

    // TeacherAndContent fields
    what_to_learn: yup
      .string()
      .required("ادخل ماذا سوف يتعلم الطلاب ما الدورة ؟"),
    program_benefits: yup.string().required("ادخل مزايا البرنامج"),
    courses: yup.string().required("أختر المواد العلمية"),
    instructor: yup.string().required("أختر المعلم المناسب"),
    hour_rate: yup.string().required("ادخل سعر ساعة المعلم"),
    files: yup
      .array()
      .of(
        yup.object().shape({
          file_name: yup.string().required("ادخل اسم الملف"),
          show_student: yup.boolean(),
          image: yup
            .mixed<FileList>()
            .test(
              "fileType",
              "الرجاء تحميل ملف صحيح",
              (value) => value && value.length > 0
            ),
        })
      )
      .required(),

    // PaymentMethods fields
    instant_payment: yup.boolean().required(),
    wallet_payment: yup.boolean().required(),
    instapay_Payment: yup.boolean().required(),

    // Subscriptions fields
    subscription_plan: yup.string().required("إختر خطة الاشتراك"),
    subscription_type: yup.string().required("إختر نوع الاشتراك"),
    subscription_price: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال المبلغ المدفوع"),
    sell_price: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال المبلغ المبيع"),
    number_of_lessons: yup
      .number()
      .typeError("الرجاء ادخال رقم صحيح")
      .positive("الرجاء ادخال رقم صحيح")
      .integer("الرجاء ادخال رقم صحيح")
      .required("الرجاء ادخال عدد الحصص"),
    lesson_duration: yup.string().required("اختر مدة الحصة"),
    lessons_days: yup
      .array()
      .of(yup.string())
      .min(1, "اختر يوم الحصة")
      .required("اختر يوم الحصة"),
    repeated_table: yup.string().required("اختر يوم الحصة"),
  })
  .required();

export type FormData = yup.InferType<typeof schema>;

export const CreateProgram = () => {
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      files: [{ file_name: "", show_student: false, image: undefined }],
      instant_payment: true,
      wallet_payment: true,
      instapay_Payment: true,
    },
  });

  const [activeStep, setActiveStep] = useState(0);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted with all data:", data);
    // Handle form submission here
  };
  return (
    <div className="bg-main py-10">
      <div className="flex flex-col gap-2 items-center justify-center mb-10">
        <div className="flex gap-5 items-center justify-between">
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 0 ? "text-primary" : "text-stroke"}`}
          >
            1
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 1 ? "text-primary" : "text-stroke"}`}
          >
            2
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 2 ? "text-primary" : "text-stroke"}`}
          >
            3
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 3 ? "text-primary" : "text-stroke"}`}
          >
            4
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 4 ? "text-primary" : "text-stroke"}`}
          >
            5
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <div
              onClick={() => setActiveStep(0)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 0 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              البيانات الاساسيه
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => setActiveStep(1)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 1 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              المعلمين و المحتوي
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => setActiveStep(2)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 2 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              وسائل الدفع
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => setActiveStep(3)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 3 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              الإشتراكات و المواعيد
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 4 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              المراجعة و النشر
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {(() => {
          switch (activeStep) {
            case 0:
              return (
                <InformationForm setActiveStep={setActiveStep} form={form} />
              );
            case 1:
              return (
                <TeacherAndContent setActiveStep={setActiveStep} form={form} />
              );
            case 2:
              return (
                <PaymentMethods setActiveStep={setActiveStep} form={form} />
              );
            case 3:
              return (
                <Subscriptions setActiveStep={setActiveStep} form={form} />
              );
            case 4:
              return (
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-4">مراجعة المعلومات</h2>
                  {/* Display summary of all form data */}
                  <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    className="text-white"
                  >
                    إرسال النموذج
                  </Button>
                </div>
              );
            default:
              return null;
          }
        })()}
      </form>
    </div>
  );
};
