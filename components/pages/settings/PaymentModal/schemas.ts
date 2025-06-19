import * as yup from "yup";

const languages = ["ar", "en"] as const;

export const paymentFormSchema = yup.object({
  localizedFields: yup
    .object()
    .shape(
      Object.fromEntries(
        languages.map((lang) =>
          [lang, yup.object({
            title: yup.string().required("ادخل العنوان"),
            description: yup.string().required("ادخل الوصف"),
          })]
        )
      )
    )
    .required(),

  image: yup
    .mixed<FileList>()
    .test("fileType", "الرجاء تحميل صورة صحيحة", (value) => value && value.length > 0)
    .required("الرجاء تحميل صورة"),

  how_to_use: yup
    .mixed<FileList>()
    .test("fileType", "الرجاء تحميل ملف الاستخدام", (value) => value && value.length > 0)
    .required("الرجاء تحميل ملف الاستخدام"),
});

export type PaymentFormData = yup.InferType<typeof paymentFormSchema>;