"use client";
import { Edit2 } from "iconsax-reactjs";

import { Avatar, Input, Button, image, addToast } from "@heroui/react";
import { formatDate } from "@/lib/helper";
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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


type TransferDetailsProps = {
    data: {
        data: {
            id: number;
            title: string,
            title_ar: string;
            title_en: string;
            created_at: string;
            payment_methods_information: {
                columns: string[];
            };
        };
    };
};

export const TransferDetails = ({ data }: TransferDetailsProps) => {
    const { languages } = useLanguages();

    const schema = yup
            .object({
                title: yup.string().required("ادخل الاسم"),
                image: yup
                      .mixed<FileList>()
                      .test(
                        "fileType",
                        "الرجاء تحميل ملف صحيح",
                        (value) => value && value.length > 0
                      )
                      .required("الرجاء تحميل ملف"),
                payment_methods_information: yup.object({
                    columns: yup
                        .array()
                        .of(
                            yup
                                .string()
                                .trim()
                                .required("هذا العمود مطلوب")
                        )
                        .min(1, "يجب إدخال عمود واحد على الأقل"),
                }),
            })
            .required();

    type FormData = {
        title: string;
        image: FileList;
        payment_methods_information: {
            columns: any[];
        };
    };


    const params = useParams();
    const id = params.id;
    const queryClient = useQueryClient();
    const [editField, setEditField] = useState<string | null>(null);
    const { control, handleSubmit, watch, reset, register } = useForm<FormData>({
        defaultValues: {
            title: data?.data?.title || "",

            payment_methods_information: {
                columns: data?.data?.payment_methods_information?.columns || []
            },
  },
    });

    useEffect(() => {
        if (data?.data) {
            reset({
                title: data.data.title,
                payment_methods_information: {
                    columns: data.data.payment_methods_information?.columns || [],
                },
            });
        }
    }, [data, reset]);

    const { fields, append, remove } = useFieldArray<FormData>({
        control,
         name: "payment_methods_information.columns",
    });


    const { data: transferData, isLoading } = useQuery({
        queryKey: ['transfer', id],
        queryFn: async () => await fetchClient(`client/instructor/payment/method/show/${id}`, axios_config),
    });

    const onSubmit = (data: FormData) => UpdateTransfer.mutate(data);

    const UpdateTransfer = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append(`title`, submitData.title);
            if(submitData.payment_methods_information.columns) {
                submitData.payment_methods_information.columns.forEach((col: string, index: number) => {
                formdata.append(`payment_methods_information[columns][${index}]`, col);
            });
            }
            if (submitData.image?.length) {
                formdata.append("image", submitData.image[0]);
            }

            return postData(
                `client/instructor/payment/method/update/${data.data.id}`,
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
                queryClient.invalidateQueries({ queryKey: ['transfer', id] });
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
                             <Controller
                                 name="title"
                                 control={control}
                                 render={({ field }) => (
                                     <Input {...field} placeholder="الاسم" size="sm" />
                                 )}
                             />
                    ) : (
                        <span className="text-black-text font-bold text-[15px]">
                            {`${transferData?.data?.title}`}
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
                                 src={transferData?.data?.image}
                                 name={transferData?.data?.name}
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

                 <div className="flex flex-col gap-4 bg-main p-5 rounded-2xl border border-stroke">
                     <span className="text-[#5E5E5E] text-sm font-bold">بيانات الدفع</span>

                     {editField === "columns" ? (
                         <div className="flex flex-col gap-3">
                             {fields.map((field, index) => (
                                 <div key={field.id} className="flex items-center gap-2">
                                     <Input
                                         {...register(`payment_methods_information.columns.${index}` as const)}
                                         defaultValue={transferData?.data?.payment_methods_information?.columns?.[index] ?? ""}
                                         placeholder="اسم العمود"
                                         className="flex-1"
                                     />
                                     <Button type="button" color="danger" variant="flat" onPress={() => remove(index)}>
                                         ×
                                     </Button>
                                 </div>
                             ))}
                             <Button type="button" color="primary" variant="flat" onPress={() => append("")}>
                                 + إضافة عمود
                             </Button>

                             <Button size="sm" color="primary" variant="solid" className="text-white self-end" type="submit">
                                 حفظ
                             </Button>
                         </div>
                     ) : (
                         <div className="flex flex-wrap gap-2">
                             {transferData?.data?.payment_methods_information?.columns?.map((col: string, i: number) => (
                                 <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold">
                                     {col}
                                 </span>
                             ))}

                             <button
                                 type="button"
                                 onClick={() => setEditField("columns")}
                                 className="flex items-center gap-1 text-sm font-bold"
                             >
                                 <Edit2 size={18} />
                                 تعديل
                             </button>
                         </div>
                     )}
                 </div>


        </form>
    );
};
