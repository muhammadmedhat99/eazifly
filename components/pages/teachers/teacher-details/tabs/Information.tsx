"use client";
import { CloseCircle, Edit2 } from "iconsax-reactjs";
import Link from "next/link";

import { addToast, Avatar, Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useParams, useRouter } from "next/navigation";
import { AllQueryKeys } from "@/keys";
import { axios_config, customStyles } from "@/lib/const";
import ReactSelect from "@/components/global/ClientOnlySelect";


type TeacherDetailsProps = {
  data: {
   data: {
      id: number;
      name_en: string;
      name_ar: string;
      phone: string;
      email: string;
      whats_app: string;
      address: string;
      age: string;
      gender: string;
      can_approve_question: string;
      image: string;
      instructor_payment_method_id: number;
      status_label: {
        label: string;
        color: string;
      };
      status: {
        label: string;
        color: string;
        key: string;
      };
      specializations: {
        id: number;
        title: string;
      }[];
    };
  };
  onUpdated?: any;
};
const schema = yup
  .object({
    name_ar: yup
      .string()
      .required("ادخل الاسم بالعربية")
      .min(3, "الاسم بالعربية لا يجب ان يقل عن ٣ احرف"),
    name_en: yup
      .string()
      .required("ادخل الاسم الأخير")
      .min(3, "الاسم بالإنجليزية لا يجب ان يقل عن ٣ احرف"),
    address: yup.string().required("ادخل العنوان"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    whats_app: yup.string().required("ادخل رقم الواتس آب"),
    gender: yup.string().required("برجاء اختيار النوع"),
    age: yup.string().required("ادخل العمر"),
    image: yup
      .mixed<File[]>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
    specializations: yup
      .array()
      .of(yup.number())
      .min(1, "اختر تخصص واحد على الأقل")
      .required("اختر التخصصات"),
    status: yup
      .string()
      .required("اختر الحالة"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const Information = ({ data, onUpdated  }: TeacherDetailsProps) => {
  console.log(data);
  
  const router = useRouter();
  const params = useParams();
  const instructor_id = params.id;
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, watch, getValues } = useForm<FormData>({
      defaultValues: {
      specializations: data?.data?.specializations?.map((s) => s.id) || [],
      name_ar: data?.data?.name_ar || "",
      name_en: data?.data?.name_en || "",
      phone: data?.data?.phone || "",
      whats_app: data?.data?.whats_app || "",
      address: data?.data?.address || "",
      age: data?.data?.age || "",
      gender: data?.data?.gender || "",
      image: [],
      status: data?.data?.status.key,
      },
    });

  const onSubmit = (data: FormData) => UpdateStudent.mutate(data);

  const UpdateStudent = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("name_ar", submitData.name_ar);
      formdata.append("name_en", submitData.name_en);
      formdata.append("email", data.data.email);
      formdata.append("phone", submitData.phone);
      formdata.append("whats_app", submitData.whats_app);
      formdata.append("gender",submitData.gender);
      formdata.append("address",submitData.address);
      formdata.append("age", submitData.age);
      formdata.append("can_approve_question", data.data.can_approve_question);
      if (submitData.image?.[0]) {
        formdata.append("image", submitData.image[0]);
      }

      return postData(
        `client/instructor/update/${data.data.id}`,
        formdata,
        myHeaders
      );
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        onUpdated?.(data.data);
      }
      setEditField(null);
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

   const CheckOrCreateChat = useMutation({
    mutationFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("sender_type", "Client");
      formdata.append("sender_id", getCookie("client_id") as string);
      formdata.append("receiver_type", "Instructor ");
      formdata.append("receiver_id", instructor_id as string);
      formdata.append("type", "group");

      return postData("client/check/chat", formdata, myHeaders);
    },
    onSuccess: (response) => {
      if (response?.data?.id) {
        router.push(`/messages/${response.data.id}?user=${instructor_id}`);
      }
    },
   });

  const { data: Specializations, isLoading: isSpecializationsLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllCountries,
    queryFn: async () => await fetchClient(`client/Specializations`, axios_config),
  });

  const UpdateSpecializations = useMutation({
    mutationFn: (payload: { instructor_id: number; specialization_id: number[] }) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/update/instructor/Specialization`,
        JSON.stringify(payload),
        myHeaders
      );
    },
    onSuccess: (res) => {
      if (res?.message === "success") {
        addToast({ title: res?.message, color: "success" });
        onUpdated?.(res.data);
        setEditField(null);
      } else {
        addToast({ title: "error", color: "danger" });
      }
    },
    onError: () => {
      addToast({ title: "خطأ أثناء الحفظ", color: "danger" });
    },
  });

  const { data: genderData, isLoading: isGenderDataLoading, refetch} = useQuery({
    queryKey: ["GetgenderData", instructor_id],
    queryFn: async () => await fetchClient(`client/instructor/get/max/gender/age/${instructor_id}`, axios_config),
  });

  useEffect(() => {
    if (genderData?.data) {
      const females = genderData.data
        .filter((i: any) => i.gender === "female")
        .map(({ from, to }: any) => ({ from, to }));

      const males = genderData.data
        .filter((i: any) => i.gender === "male")
        .map(({ from, to }: any) => ({ from, to }));

      setFemalePeriods(females.length ? females : [{ from: "", to: "" }]);
      setMalePeriods(males.length ? males : [{ from: "", to: "" }]);
    }
  }, [genderData]);

  const [malePeriods, setMalePeriods] = useState<{ from: string; to: string }[]>(
    genderData?.data
      ?.filter((i: any) => i.gender === "male")
      .map((i: any) => ({ from: i.from, to: i.to })) || [{ from: "", to: "" }]
  );
  const [femalePeriods, setFemalePeriods] = useState<
    { from: string; to: string }[]
  >(
    genderData?.data
      ?.filter((i: any) => i.gender === "female")
      .map((i: any) => ({ from: i.from, to: i.to })) || [{ from: "", to: "" }]
  );

  const handleAddPeriod = (gender: "male" | "female") => {
    gender === "male"
      ? setMalePeriods([...malePeriods, { from: "", to: "" }])
      : setFemalePeriods([...femalePeriods, { from: "", to: "" }]);
  };

  const handleRemovePeriod = (gender: "male" | "female", index: number) => {
    if (gender === "male") {
      if (malePeriods.length > 1)
        setMalePeriods(malePeriods.filter((_, i) => i !== index));
    } else {
      if (femalePeriods.length > 1)
        setFemalePeriods(femalePeriods.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (
    gender: "male" | "female",
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    if (gender === "male") {
      const updated = [...malePeriods];
      updated[index][field] = value;
      setMalePeriods(updated);
    } else {
      const updated = [...femalePeriods];
      updated[index][field] = value;
      setFemalePeriods(updated);
    }
  };

  const UpdateAgeGroups = useMutation({
    mutationFn: (payload: {
      instructor_id: number;
      female: { from: number; to: number }[];
      male: { from: number; to: number }[];
    }) => {

      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/instructor/get/max/gender/age`,
        JSON.stringify(payload),
        myHeaders
      );
    },
    onSuccess: (res) => {
      if (res?.message === "success") {
        addToast({
          title: res?.message,
          color: "success",
          timeout: 3000,
        });
        onUpdated?.(res.data);
        setEditField(null);
      } else {
        if (typeof res?.message === "object") {
          const errors = Object.entries(res.message)
            .map(([key, value]) => `${key === "female" ? "إناث" : "ذكور"}: ${(value as string[]).join("، ")}`)
            .join(" | ");

          addToast({
            title: "خطأ أثناء الحفظ",
            description: errors,
            color: "danger",
            timeout: 5000,
          });
        } else {
          addToast({
            title: res?.message || "حدث خطأ أثناء الحفظ",
            color: "danger",
            timeout: 3000,
          });
        }
      }
    },
  });

  const updateStatus = useMutation({
    mutationFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      const selectedStatus = getValues("status");
      formdata.append("status", selectedStatus);

      return postData(`client/instructor/update/status/${instructor_id}`, formdata, myHeaders);
    },
    onSuccess: (res) => {
      if (res?.message === "success") {
        addToast({ title: res?.message, color: "success" });
        onUpdated?.(res.data);
        setEditField(null);
      } else {
        addToast({ title: "error", color: "danger" });
      }
    },
    onError: () => {
      addToast({ title: "خطأ أثناء الحفظ", color: "danger" });
    },
   });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الإسم بالعربية</span>
          {editField === "name_ar" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <DropzoneField
                    value={field.value}
                    onChange={field.onChange}
                    description="تحميل صورة جديدة"
                  />
                )}
              />
              <Controller
                name="name_ar"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="الاسم بالعربية" size="sm" />
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              showFallback
              name={data?.data?.name_ar}
              src={data?.data?.image}
            />

            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.name_ar}
            </span>
          </div>
          )}
        </div>
        {editField === "name_ar" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("name_ar")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>
      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">الإسم بالإنجليزية</span>
          {editField === "name_en" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <DropzoneField
                    value={field.value}
                    onChange={field.onChange}
                    description="تحميل صورة جديدة"
                  />
                )}
              />
              <Controller
                name="name_en"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="الاسم بالإنجليزية" size="sm" />
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                showFallback
                name={data?.data?.name_en}
                src={data?.data?.image}
              />

              <span className="text-black-text font-bold text-[15px]">
                {data?.data?.name_en}
              </span>
            </div>
          )}
        </div>
        {editField === "name_en" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("name_en")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">رقم الهاتف</span>
          {editField === "phone" ? (
            <div
              style={{ "direction": "ltr" }}
              className={`
      shadow-none border-stroke border rounded-lg px-3 py-2 flex items-center
      focus-within:border-primary transition dir-ltr
    `}
            >
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "برجاء إدخال رقم هاتف",
                  validate: (value) =>
                    isValidPhoneNumber(value || "") || "رقم الهاتف غير صحيح",
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    defaultCountry="EG"
                    value={field.value}
                    onChange={field.onChange}
                    international
                    countryCallingCodeEditable={false}
                    placeholder="ادخل رقم الهاتف"
                    className="flex-1 text-sm outline-none border-0 focus:ring-0"
                  />
                )}
              />

            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.phone}
            </span>
          )}
        </div>

        {editField === "phone" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("phone")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">رقم الواتس آب</span>
          {editField === "whats_app" ? (
            <div
              style={{ "direction": "ltr" }}
              className={`
      shadow-none border-stroke border rounded-lg px-3 py-2 flex items-center
      focus-within:border-primary transition dir-ltr
    `}
            >
              <Controller
                name="whats_app"
                control={control}
                rules={{
                  required: "برجاء إدخال رقم هاتف",
                  validate: (value) =>
                    isValidPhoneNumber(value || "") || "رقم الهاتف غير صحيح",
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    defaultCountry="EG"
                    value={field.value}
                    onChange={field.onChange}
                    international
                    countryCallingCodeEditable={false}
                    placeholder="ادخل رقم الهاتف"
                    className="flex-1 text-sm outline-none border-0 focus:ring-0"
                  />
                )}
              />

            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.whats_app}
            </span>
          )}
        </div>

        {editField === "whats_app" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("whats_app")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">العنوان</span>
          {editField === "address" ? (
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="العنوان" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.address}
            </span>
          )}
        </div>

        {editField === "address" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("address")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">العمر</span>
          {editField === "age" ? (
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="العمر" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.age}
            </span>
          )}
        </div>

        {editField === "age" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("age")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-[#5E5E5E] text-sm font-bold">النوع</span>
          {editField === "gender" ? (
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  selectedKeys={field.value ? [field.value] : [""]}
                  labelPlacement="outside"
                  placeholder="اختر النوع"
                  classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    base: "mb-4",
                    value: "text-[#87878C] text-sm",
                  }}
                >
                  {[
                    { key: "male", label: "ذكر" },
                    { key: "female", label: "انثي" },
                  ].map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.gender}
            </span>
          )}
        </div>

        {editField === "gender" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("gender")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke mt-4">
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-[#5E5E5E] text-sm font-bold">الحالة</span>
          {editField === "status" ? (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  selectedKeys={field.value ? [field.value] : [""]}
                  labelPlacement="outside"
                  placeholder="اختر الحالة"
                  classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    base: "mb-4",
                    value: "text-[#87878C] text-sm",
                  }}
                >
                  {[
                    { key: "active", label: "نشط" },
                    { key: "fired", label: "مطرود" },
                    { key: "hold", label: "معلق" },
                    { key: "in_review", label: "تحت المراجعة" },
                  ].map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
              )}
            />
          ) : (
            <div
              className={`
          text-${data?.data?.status?.color === "info"
                  ? "warning"
                  : data?.data?.status?.color || "primary"
                } 
          bg-${data?.data?.status?.color === "info"
                  ? "warning"
                  : data?.data?.status?.color || "primary"
                } bg-opacity-10
          px-5 py-1 rounded-3xl font-bold text-[15px] w-fit
        `}
            >
                {{
                  active: "نشط",
                  fired: "مطرود",
                  hold: "معلق",
                  in_review: "تحت المراجعة",
                }[data?.data?.status?.key] || "نشط"}

            </div>
          )}
        </div>

        {editField === "status" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            onPress={()=> updateStatus.mutate()}
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("status")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      {/* الفئات العمرية */}
      <div className="flex flex-col bg-main p-5 rounded-2xl border border-stroke md:col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-[#5E5E5E] text-sm font-bold">الفئات العمرية</span>
          {editField === "ageGroups" ? (
            <Button
              size="sm"
              color="primary"
              variant="solid"
              className="text-white"
              type="button"
              onPress={() => {
                const payload = {
                  instructor_id: data.data.id,
                  female: femalePeriods.map((p) => ({
                    from: Number(p.from),
                    to: Number(p.to),
                  })),
                  male: malePeriods.map((p) => ({
                    from: Number(p.from),
                    to: Number(p.to),
                  })),
                };

                UpdateAgeGroups.mutate(payload);

              }}
            >
              حفظ
            </Button>
          ) : (
              <button
                type="button"
                onClick={() => setEditField("ageGroups")}
                className="flex items-center gap-1 text-sm font-bold"
              >
                <Edit2 size={18} />
                تعديل
              </button>
          )}
        </div>

        {editField === "ageGroups" ? (
          <div className="border p-4 rounded-lg bg-gray-50 flex flex-col gap-4 mt-4">
            {/* إناث */}
            <div>
              <label className="text-[#272727] font-bold text-sm">إناث</label>
              {femalePeriods.map((period, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="number"
                    value={period.from}
                    placeholder="من"
                    onChange={(e) =>
                      handleInputChange("female", index, "from", e.target.value)
                    }
                    className="px-6 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                  />
                  <input
                    type="number"
                    value={period.to}
                    placeholder="إلى"
                    onChange={(e) =>
                      handleInputChange("female", index, "to", e.target.value)
                    }
                    className="px-6 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                  />
                  <button
                    className={`${femalePeriods.length === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    disabled={femalePeriods.length === 1}
                    type="button"
                    onClick={() => handleRemovePeriod("female", index)}
                  >
                    <CloseCircle size="24" color="#ff0000" />
                  </button>
                  {index === 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddPeriod("female")}
                      className="ml-2 text-blue-600 text-lg"
                    >
                      ＋
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ذكور */}
            <div>
              <label className="text-[#272727] font-bold text-sm">ذكور</label>
              {malePeriods.map((period, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="number"
                    value={period.from}
                    placeholder="من"
                    onChange={(e) =>
                      handleInputChange("male", index, "from", e.target.value)
                    }
                    className="px-6 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                  />
                  <input
                    type="number"
                    value={period.to}
                    placeholder="إلى"
                    onChange={(e) =>
                      handleInputChange("male", index, "to", e.target.value)
                    }
                    className="px-6 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                  />
                  <button
                    className={`${malePeriods.length === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    disabled={malePeriods.length === 1}
                    type="button"
                    onClick={() => handleRemovePeriod("male", index)}
                  >
                    <CloseCircle size="24" color="#ff0000" />
                  </button>
                  {index === 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddPeriod("male")}
                      className="ml-2 text-blue-600 text-lg"
                    >
                      ＋
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
            <div className="flex flex-col gap-4 mt-4">
              {/* قسم الإناث */}
              <div className="bg-gray-50 border border-stroke rounded-lg p-4">
                <p className="text-[#272727] font-bold text-sm mb-2">إناث</p>
                {genderData?.data?.filter((i: any) => i.gender === "female")?.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {genderData.data
                      .filter((i: any) => i.gender === "female")
                      .map((i: any, index: number) => (
                        <li
                          key={index}
                          className="bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-1 font-semibold text-[#333]"
                        >
                          من {i.from} إلى {i.to}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm font-medium">لا يوجد</p>
                )}
              </div>

              {/* قسم الذكور */}
              <div className="bg-gray-50 border border-stroke rounded-lg p-4">
                <p className="text-[#272727] font-bold text-sm mb-2">ذكور</p>
                {genderData?.data?.filter((i: any) => i.gender === "male")?.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {genderData.data
                      .filter((i: any) => i.gender === "male")
                      .map((i: any, index: number) => (
                        <li
                          key={index}
                          className="bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-1 font-semibold text-[#333]"
                        >
                          من {i.from} إلى {i.to}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm font-medium">لا يوجد</p>
                )}
              </div>
            </div>

        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-[#5E5E5E] text-sm font-bold text-primary">
            التخصصات
          </span>

          {editField === "specializations" ? (
            <Controller
              name="specializations"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <ReactSelect
                    {...field}
                    id="specializations"
                    placeholder="اختر التخصصات"
                    options={Specializations.data.map((item: any) => ({
                      value: item.id,
                      label: item.title,
                    }))}
                    isMulti={true}
                    styles={customStyles}
                    isClearable
                    value={Specializations.data
                      .map((item: any) => ({ value: item.id, label: item.title }))
                      .filter((opt: any) => field.value?.includes(opt.value))}
                    onChange={(selected) =>
                      field.onChange((selected as any[]).map((opt) => Number(opt.value)))
                    }
                  />
                </div>
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.specializations?.map((specialization) => specialization.title).join("، ") ||
                "لا يوجد تخصصات"}
            </span>
          )}
        </div>

        {editField === "specializations" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="button"
            onPress={() => {
              const selected = (watch("specializations") ?? []).filter(
                (id): id is number => typeof id === "number"
              );
              UpdateSpecializations.mutate({
                instructor_id: data.data.id,
                specialization_id: selected, // IDs جاهزة
              });
            }}
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("specializations")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-end justify-end md:col-span-2">
        <Button
          color="primary"
          variant="solid"
          className="text-white"
          onPress={() => CheckOrCreateChat.mutate()}
          isLoading={CheckOrCreateChat.isPending}
        >
          إرسال رسالة
        </Button>
      </div>

    </form>
  );
};
