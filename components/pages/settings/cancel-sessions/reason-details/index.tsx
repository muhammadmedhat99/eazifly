"use client";
import { Edit2 } from "iconsax-reactjs";

import { Avatar, Input, Button, image, addToast, Select, SelectItem } from "@heroui/react";
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

const typeMapping: Record<string, string> = {
  user: "الطالب",
  instructor: "المعلم",
  both: "كلاهما",
};

type ReasonDetailsProps = {
    data: {
        data: {
            id: number;
            title: string,
            title_ar: string;
            title_en: string;
            created_at: string;
            type: string;
        };
    };
};

const schema = yup
    .object({
        title_en: yup
            .string()
            .required("ادخل الاسم بالعربية")
            .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),

        title_ar: yup
            .string()
            .required("ادخل الاسم بالإنجليزية")
            .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),
        type: yup
            .string()
            .required("برجاء اختيار جهة العرض"),
    })
    .required();


type FormData = yup.InferType<typeof schema>;

export const ReasonDetails = ({ data }: ReasonDetailsProps) => {
    const params = useParams();
    const id = params.id;
    const queryClient = useQueryClient();
    const [editField, setEditField] = useState<string | null>(null);
    const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            title_ar: data?.data?.title_ar || "",
            title_en: data?.data?.title_en || "",
            type: data?.data?.type || "",
        },
    });

    const { data: cancelSessionReasons, isLoading } = useQuery({
        queryKey: ['cancelSessionReasons', id],
        queryFn: async () => await fetchClient(`client/reason/cancel/session/show/${id}`, axios_config),
    });

    const onSubmit = (data: FormData) => UpdateReason.mutate(data);

    const UpdateReason = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append("ar[title]", submitData.title_ar);
            formdata.append("en[title]", submitData.title_en);
            formdata.append("type", submitData.type);

            return postData(
                `client/reason/cancel/session/update/${data.data.id}`,
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
                queryClient.invalidateQueries({ queryKey: ['cancelSessionReasons', id] });
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
                                <Controller
                                    name="title_ar"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="الاسم بالعربية" size="sm" />
                                    )}
                                />
                                <Controller
                                    name="title_en"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="الاسم بالإنجليزية" size="sm" />
                                    )}
                                />
                            </div>
                        </div>
                    ) : (
                        <span className="text-black-text font-bold text-[15px]">
                            {`${cancelSessionReasons?.data?.title_ar} / ${cancelSessionReasons?.data?.title_en}`}
                        </span>
                    )}
                </div>

                {editField === "name" ? (
                    <Button size="sm" color="primary" variant="solid" className="text-white" type="submit">
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
                    <span className="text-[#5E5E5E] text-sm font-bold">جهة العرض</span>
                         {editField === "type" ? (
                             <Controller
                                 name="type"
                                 control={control}
                                 render={({ field }) => (
                                     <Select
                                         {...field}
                                         selectedKeys={field.value ? [field.value] : [""]}
                                         onSelectionChange={(keys) => {
                                             field.onChange(Array.from(keys)[0]);
                                         }}
                                         placeholder="اختر جهة العرض"
                                         isInvalid={!!errors.type?.message}
                                         errorMessage={errors.type?.message}
                                         classNames={{
                                             label: "text-[#272727] font-bold text-sm",
                                             base: "w-48",
                                             value: "text-[#87878C] text-sm",
                                         }}
                                     >
                                         {[
                                             { key: "user", label: "الطالب" },
                                             { key: "instructor", label: "المعلم" },
                                             { key: "both", label: "كلاهما" },
                                         ].map((item) => (
                                             <SelectItem key={item.key}>{item.label}</SelectItem>
                                         ))}
                                     </Select>
                                 )}
                             />
                         ) : (
                             <span className="text-black-text font-bold text-[15px]">
                            {typeMapping[cancelSessionReasons.data.type] || "N/A"}
                        </span>
                    )}
                </div>

                {editField === "type" ? (
                    <Button size="sm" color="primary" variant="solid" className="text-white" type="submit">
                        حفظ
                    </Button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setEditField("type")}
                        className="flex items-center gap-1 text-sm font-bold"
                    >
                        <Edit2 size={18} />
                        تعديل
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                <div className="flex flex-col gap-4">
                    <span className="text-[#5E5E5E] text-sm font-bold">تاريخ الإنشاء</span>
                    <span className="text-black-text font-bold text-[15px]">
                        {formatDate(cancelSessionReasons?.data?.created_at)}
                    </span>
                </div>
            </div>

        </form>
    );
};
