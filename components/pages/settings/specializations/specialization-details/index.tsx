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

type SpecializationDetailsProps = {
    data: {
        data: {
            id: number;
            title: string,
            title_ar: string;
            title_en: string;
            created_at: string
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
    })
    .required();


type FormData = yup.InferType<typeof schema>;

export const SpecializationDetails = ({ data }: SpecializationDetailsProps) => {
    const params = useParams();
    const id = params.id;
    const queryClient = useQueryClient();
    const [editField, setEditField] = useState<string | null>(null);
    const { control, handleSubmit, watch } = useForm<FormData>({
        defaultValues: {
            title_ar: data?.data?.title_ar || "",
            title_en: data?.data?.title_en || "",
        },
    });

    const { data: specializationData, isLoading } = useQuery({
        queryKey: ['specialization', id],
        queryFn: async () => await fetchClient(`client/Specialization/show/${id}`, axios_config),
    });

    const onSubmit = (data: FormData) => UpdateSpecialization.mutate(data);

    const UpdateSpecialization = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append("ar[title]", submitData.title_ar);
            formdata.append("en[title]", submitData.title_en);


            return postData(
                `client/Specialization/update/${data.data.id}`,
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
                queryClient.invalidateQueries({ queryKey: ['specialization', id] });
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
                            {`${specializationData?.data?.title_ar} / ${specializationData?.data?.title_en}`}
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
                    <span className="text-[#5E5E5E] text-sm font-bold">تاريخ الإنشاء</span>
                    <span className="text-black-text font-bold text-[15px]">
                        {formatDate(specializationData?.data?.created_at)}
                    </span>
                </div>
            </div>

        </form>
    );
};
