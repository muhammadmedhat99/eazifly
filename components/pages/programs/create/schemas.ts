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
});

export const paymentMethodsSchema = yup.object({
  instant_payment: yup.boolean().required(),
  wallet_payment: yup.boolean().required(),
  instapay_Payment: yup.boolean().required(),
});

export const subscriptionsSchema = yup.object({
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
});