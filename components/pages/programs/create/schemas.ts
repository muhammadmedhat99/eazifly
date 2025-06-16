import * as yup from "yup";

const languages = ["ar", "en"] as const;

const localizedStringSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  label: yup.string().required("Label is required"),
  goals: yup.string().required("Goals is required"),
  content: yup.string().required("Content is required"),
});

export const informationFormSchema = yup.object({
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
  why_us: yup.boolean().required(),
  learning_track: yup.boolean().required(),
  special_for: yup
    .string()
    .oneOf(["adult", "child"])
    .required("اختر الفئة المناسبة"),
  specialization_id: yup.string().required("اختر التخصص"),
  slug: yup.string().required("ادخل اسم البرنامج"),
  limit_users: yup.number().required("ادخل عدد المستخدمين"),
});

export const teacherAndContentSchema = yup.object({
  specialization_id: yup.string().required("اختر التخصص"),
  teachers: yup
    .array()
    .of(
      yup.object().shape({
        teacher_id: yup.string().required("أختر المعلم"),
        hour_rate: yup
          .string()
          .required("ادخل سعر ساعة المعلم")
          .matches(/^\d+(\.\d{1,2})?$/, "سعر الساعة يجب أن يكون رقماً صحيحاً"),
      })
    )
    .min(1, "يجب إضافة معلم واحد على الأقل")
    .required("يجب إضافة المعلمين"),
});

export const paymentMethodsSchema = yup.object().shape({
  instant_payment: yup.boolean().default(false),
  wallet_payment: yup.boolean().default(false),
  instapay_Payment: yup.boolean().default(false),
});

export const subscriptionsSchema = yup.object().shape({
  subscription_plan: yup
    .string()
    .required("يجب اختيار خطة الإشتراك")
    .oneOf(["per_month", "3_months", "6_month", "year"], "خطة الإشتراك غير صحيحة"),
  subscription_type: yup
    .string()
    .required("يجب اختيار نوع الإشتراك")
    .oneOf(["single", "group", "family"], "نوع الإشتراك غير صحيح"),
  subscription_price: yup
    .string()
    .required("يجب إدخال سعر الإشتراك")
    .matches(/^\d+(\.\d{1,2})?$/, "سعر الإشتراك يجب أن يكون رقماً صحيحاً"),
  sell_price: yup
    .string()
    .required("يجب إدخال سعر البيع")
    .matches(/^\d+(\.\d{1,2})?$/, "سعر البيع يجب أن يكون رقماً صحيحاً"),
  number_of_lessons: yup
    .string()
    .required("يجب إدخال عدد حصص البرنامج")
    .matches(/^\d+$/, "عدد الحصص يجب أن يكون رقماً صحيحاً"),
  lesson_duration: yup
    .string()
    .required("يجب اختيار مدة المحاضرة")
    .oneOf(["1", "2", "3", "4"], "مدة المحاضرة غير صحيحة"),
  lessons_days: yup
    .array()
    .of(yup.string())
    .min(1, "يجب اختيار يوم واحد على الأقل")
    .required("يجب اختيار أيام الأسبوع"),
  repeated_table: yup
    .string()
    .required("يجب اختيار نوع الجدول المتكرر")
    .oneOf(["single", "group"], "نوع الجدول المتكرر غير صحيح"),
});

export type InformationFormData = yup.InferType<typeof informationFormSchema>;
export type TeacherAndContentFormData = yup.InferType<typeof teacherAndContentSchema>;
export type PaymentMethodsFormData = yup.InferType<typeof paymentMethodsSchema>;
export type SubscriptionsFormData = yup.InferType<typeof subscriptionsSchema>;