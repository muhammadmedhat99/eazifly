"use client";
import { Edit2 } from "iconsax-reactjs";

import { Avatar, Input, Button, image, addToast } from "@heroui/react";
import { formatDate } from "@/lib/helper";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, fetchData, postData } from "@/lib/utils";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import { LocalizedField } from "@/components/global/LocalizedField";
import { useLanguages } from "@/lib/hooks/useLanguages";

type CountryDetailsProps = {
  data: {
    data: {
      id: number;
      name_ar: string;
      name_en: string;
      country_code: string;
      phone_code: string;
      image: string;
      created_at: string;
    };
  };
};


export const CountryDetails = ({ data }: CountryDetailsProps) => {
  const { languages } = useLanguages();

  const schema = yup
    .object({
      localizedFields: yup
        .object()
        .shape(
          Object.fromEntries(
            languages.map((lang: string) => [
              lang,
              yup.object({
                name: yup.string().required("ادخل الاسم"),
              }),
            ])
          )
        )
        .required(),

      country_code: yup.string().required("ادخل كود الدولة"),

      phone_code: yup
        .string()
        .required("ادخل مفتاح الدولة")
        .matches(/^[0-9]+$/, "يجب أن يحتوي على أرقام فقط"),

      image: yup
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

  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      localizedFields: {
        ar: {
          name: data.data.name_ar || "",
        },
        en: {
          name: data.data.name_en || "",
        },
      },
      country_code: data?.data?.country_code || "",
      phone_code: data?.data?.phone_code || "",
    },
  });

  const { data: countryData, isLoading } = useQuery({
    queryKey: ["country", id],
    queryFn: async () =>
      await fetchClient(`client/country/show/${id}`, axios_config),
  });

  const onSubmit = (data: FormData) => UpdateStudent.mutate(data);

  const UpdateStudent = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      languages.forEach((locale: string) => {
        const localeData = submitData.localizedFields[locale];
        formdata.append(`${locale}[name]`, localeData.name);
      });
      formdata.append("country_code", submitData.country_code);
      formdata.append(
        "phone_code",
        `+${submitData.phone_code.replace(/^\+/, "")}`
      );

      if (submitData.image?.length) {
        formdata.append("image", submitData.image[0]);
      }

      return postData(
        `client/country/update/${data.data.id}`,
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
        queryClient.invalidateQueries({ queryKey: ["country", id] });
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

  return isLoading ? (
    <Loader />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الاسم</span>
          {editField === "name" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <LocalizedField control={control} name="name" label="الاسم" />
              </div>
            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {countryData?.data?.name}
            </span>
          )}
        </div>

        {editField === "name" ? (
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
            onClick={() => setEditField("name")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">كود الدولة</span>
          {editField === "country_code" ? (
            <Controller
              name="country_code"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="كود الدولة" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {countryData?.data?.country_code}
            </span>
          )}
        </div>

        {editField === "country_code" ? (
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
            onClick={() => setEditField("country_code")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">مفتاح الدولة</span>
          {editField === "phone_code" ? (
            <Controller
              name="phone_code"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="مفتاح الدولة" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {countryData?.data?.phone_code}
            </span>
          )}
        </div>

        {editField === "phone_code" ? (
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
            onClick={() => setEditField("phone_code")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الصورة</span>
          {editField === "image" ? (
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <DropzoneField
                  value={field.value as any}
                  onChange={field.onChange}
                  description="تحميل صورة جديدة"
                />
              )}
            />
          ) : (
            <Avatar
              size="lg"
              radius="sm"
              showFallback
              src={countryData?.data?.image}
              name={countryData?.data?.name}
            />
          )}
        </div>

        {editField === "image" ? (
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
            onClick={() => setEditField("image")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تاريخ الإنشاء
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {formatDate(countryData?.data?.created_at)}
          </span>
        </div>
      </div>
    </form>
  );
};
