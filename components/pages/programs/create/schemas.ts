import * as yup from "yup";

const languages = ["ar", "en"] as const;

const localizedStringSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  label: yup.string().required("Label is required"),
  goals: yup.string().required("Goals is required"),
  content: yup.string().required("Content is required"),
});

const localizedSubscriptionSchema = yup.object().shape({
  title: yup.string().notRequired(),
  label: yup.string().notRequired(),
  description: yup.string().notRequired(),
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
    .mixed()
    .test("file-required", "الرجاء تحميل ملف", (value) => {
      if (!value) return false;
      // Handle both array and object formats
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value !== null) {
        // Check if it's a FileList-like object
        return Object.keys(value).length > 0;
      }
      return false;
    })
    .required("الرجاء تحميل ملف"),
  cover: yup
    .mixed()
    .test("file-required", "الرجاء تحميل ملف", (value) => {
      if (!value) return false;
      // Handle both array and object formats
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value !== null) {
        // Check if it's a FileList-like object
        return Object.keys(value).length > 0;
      }
      return false;
    })
    .required("الرجاء تحميل ملف"),
  special_for: yup
    .string()
    .oneOf(["adult", "child"])
    .required("اختر الفئة المناسبة"),
  specialization_id: yup.string().required("اختر التخصص"),
  meeting_host_id: yup.string().required("اختر الاستضافة"),
  slug: yup.string().required("ادخل slug الخاص ب البرنامج"),
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
  subscriptions: yup
    .array()
    .of(
      yup.object().shape({
        localizedFields: yup
          .object()
          .shape({
            ar: localizedSubscriptionSchema,
            en: localizedSubscriptionSchema,
          })
          .notRequired(),
        subscription_plan: yup
          .string()
          .required("يجب اختيار خطة الإشتراك"),
        subscription_type: yup
          .string()
          .required("يجب اختيار نوع الإشتراك")
          .oneOf(["single", "family"], "نوع الإشتراك غير صحيح"),
        sell_price: yup
          .string()
          .required("يجب إدخال سعر البيع")
          .matches(/^\d+(\.\d{1,2})?$/, "سعر الإشتراك يجب أن يكون رقماً صحيحاً")
          .test(
            'price-comparison',
            'سعر البيع يجب أن يكون أقل من أو يساوي سعر الإشتراك',
            function (value) {
              const { subscription_price } = this.parent;
              if (!value || !subscription_price) return true;
              return parseFloat(value) <= parseFloat(subscription_price);
            }
          ),
        subscription_price: yup
          .string()
          .required("يجب إدخال سعر الإشتراك")
          .matches(/^\d+(\.\d{1,2})?$/, "سعر الإشتراك يجب أن يكون رقماً صحيحاً"),
        number_of_lessons: yup
          .string()
          .required("يجب إدخال عدد حصص البرنامج")
          .matches(/^\d+$/, "عدد الحصص يجب أن يكون رقماً صحيحاً"),
        lesson_duration: yup
          .string()
          .required("يجب اختيار مدة المحاضرة"),
        is_special_plan: yup.string().default("false"),
      })
    )
    .min(1, "يجب إضافة اشتراك واحد على الأقل")
    .required("يجب إضافة الاشتراكات"),
});

export type InformationFormData = yup.InferType<typeof informationFormSchema>;
export type TeacherAndContentFormData = yup.InferType<typeof teacherAndContentSchema>;
export type PaymentMethodsFormData = yup.InferType<typeof paymentMethodsSchema>;
export type SubscriptionsFormData = yup.InferType<typeof subscriptionsSchema>;