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
    .mixed()
    .test("file-required", "الرجاء تحميل صورة صحيحة", (value) => {
      if (!value) return false;
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length > 0;
      }
      return false;
    })
    .required("الرجاء تحميل صورة"),

  how_to_use: yup
    .mixed()
    .test("file-required", "الرجاء تحميل ملف الاستخدام", (value) => {
      if (!value) return false;
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length > 0;
      }
      return false;
    })
    .required("الرجاء تحميل ملف الاستخدام"),
});

export type PaymentFormData = yup.InferType<typeof paymentFormSchema>;