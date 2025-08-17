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
import { title } from "process";

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

export const SpecializationDetails = ({ data }: SpecializationDetailsProps) => {
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
                                title: yup.string().required("ادخل الاسم"),
                            }),
                        ])
                    )
                )
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
                    title: data.data.title_ar || "",
                },
                en: {
                    title: data.data.title_en || "",
                },
            },
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
            languages.forEach((locale: string) => {
                const localeData = submitData.localizedFields[locale];
                formdata.append(`${locale}[title]`, localeData.title);
            });

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
                        <LocalizedField control={control} name="title" label="الاسم" />
                    ) : (
                        <span className="text-black-text font-bold text-[15px]">
                            {`${specializationData?.data?.title}`}
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
