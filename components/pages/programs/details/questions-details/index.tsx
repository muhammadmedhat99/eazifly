"use client";
import { Edit2, Trash } from "iconsax-reactjs";

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
import { AllQueryKeys } from "@/keys";

type QuestionDetailsProps = {
    data: {
        data: {
            id: number;
            title_ar: string;
            title_en: string;
            program: {
                id: number;
                title: string;
            };
            user_type: string;
            type: string;
            options: {
                id: number;
                title: string;
                title_ar: string;
                title_en: string;
            }[];
        };
    };
};

const schema = yup
    .object({
        title_en: yup
            .string()
            .required("ادخل العنوان بالعربية")
            .min(3, "العنوان لا يجب أن يقل عن ٣ أحرف"),

        title_ar: yup
            .string()
            .required("ادخل العنوان بالإنجليزية")
            .min(3, "العنوان لا يجب أن يقل عن ٣ أحرف"),
        program_id: yup.number().required("اختر البرنامج"),
        user_type: yup.string().required("اختر نوع المستخدم"),
        type: yup.string().required("اختر النوع"),
        options: yup.array().of(
            yup.object({
                ar: yup.object({
                    title: yup.string().required("ادخل الخيار بالعربية")
                }),
                en: yup.object({
                    title: yup.string().required("ادخل الخيار بالإنجليزية")
                })
            })
        )
    })
    .required();

type FormData = yup.InferType<typeof schema>;

export const QuestionsDetails = ({ data }: QuestionDetailsProps) => {  
    const params = useParams();
    const id = params.questionId;
    const queryClient = useQueryClient();
    const [editField, setEditField] = useState<string | null>(null);

    const { control, handleSubmit, watch, setValue } = useForm<FormData>({
         defaultValues: {
            title_ar: data?.data?.title_ar,
            title_en: data?.data?.title_en,
            program_id: data?.data?.program.id || undefined,
            user_type: data?.data?.user_type || "client",
            type: data?.data?.type || "text",
            options: data?.data?.options?.map((opt: any) => ({
                ar: { title: opt.title_ar || "" },
                en: { title: opt.title_en || "" }
            })) || []
        }
    });

    const { data: questionData, isLoading } = useQuery({
        queryKey: ['report_question', id],
        queryFn: async () => await fetchClient(`client/report/question/method/show/${id}`, axios_config),
    });

    const onSubmit = (data: FormData) => UpdateQuestion.mutate(data);

    const UpdateQuestion = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();
            formdata.append("ar[title]", submitData.title_ar);
            formdata.append("en[title]", submitData.title_en);
            formdata.append("program_id", submitData.program_id.toString());
            formdata.append("user_type", submitData.user_type);
            formdata.append("type", submitData.type);
            if (submitData.type === "multiple_choice" && submitData.options) {
                submitData.options.forEach((option, index) => {
                    formdata.append(`options[${index}][ar][title]`, option.ar.title);
                    formdata.append(`options[${index}][en][title]`, option.en.title);
                });
            }

            return postData(
                `client/report/question/method/update/${id}`,
                formdata, 
                myHeaders
            );
        },
        onSuccess: (data) => {
            if (data.message !== "success") {
                addToast({ title: "error", color: "danger" });
            } else {
                addToast({ title: data?.message, color: "success" });
                queryClient.invalidateQueries({ queryKey: ['report_question', id] });
            }
            setEditField(null);
        },
        onError: (err) => {
            console.log(err);
            
            addToast({ title: "عذرا حدث خطأ ما", color: "danger" });
        },
    });

    const { data: programData } = useQuery({
            queryFn: async () =>
              await fetchClient(
                `client/program?status=published`,
                axios_config
              ),
            queryKey: AllQueryKeys.GetAllPrograms("", 1),
          });

     return (
         isLoading ? (<Loader />) : (
             <form
                 onSubmit={handleSubmit(onSubmit)}
                 className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
             >
                 {/* عنوان السؤال بالعربي */}
                 <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                     <div className="flex flex-col gap-4">
                         <span className="text-[#5E5E5E] text-sm font-bold">عنوان السؤال بالعربية</span>
                         {editField === "title_ar" ? (
                             <Controller
                                 name="title_ar"
                                 control={control}
                                 render={({ field }) => (
                                     <Input {...field} placeholder="أدخل عنوان السؤال بالعربي" size="sm" />
                                 )}
                             />
                         ) : (
                             <span className="text-black-text font-bold text-[15px]">
                                 {questionData?.data?.title_ar}
                             </span>
                         )}
                     </div>
                     {editField === "title_ar" ? (
                         <Button size="sm" color="primary" variant="solid" className="text-white" type="submit">
                             حفظ
                         </Button>
                     ) : (
                         <button
                             type="button"
                             onClick={() => setEditField("title_ar")}
                             className="flex items-center gap-1 text-sm font-bold"
                         >
                             <Edit2 size={18} />
                             تعديل
                         </button>
                     )}
                 </div>

                 {/* عنوان السؤال بالإنجليزي */}
                 <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                     <div className="flex flex-col gap-4">
                         <span className="text-[#5E5E5E] text-sm font-bold">عنوان السؤال بالإنجليزية</span>
                         {editField === "title_en" ? (
                             <Controller
                                 name="title_en"
                                 control={control}
                                 render={({ field }) => (
                                     <Input {...field} placeholder="Enter question title in English" size="sm" />
                                 )}
                             />
                         ) : (
                             <span className="text-black-text font-bold text-[15px]">
                                 {questionData?.data?.title_en}
                             </span>
                         )}
                     </div>
                     {editField === "title_en" ? (
                         <Button size="sm" color="primary" variant="solid" className="text-white" type="submit">
                             حفظ
                         </Button>
                     ) : (
                         <button
                             type="button"
                             onClick={() => setEditField("title_en")}
                             className="flex items-center gap-1 text-sm font-bold"
                         >
                             <Edit2 size={18} />
                             تعديل
                         </button>
                     )}
                 </div>

                 
                 {/* تاريخ الإنشاء */}
                 <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                     <div className="flex flex-col gap-4">
                         <span className="text-[#5E5E5E] text-sm font-bold">تاريخ الإنشاء</span>
                         <span className="text-black-text font-bold text-[15px]">
                             {new Date(questionData?.data?.created_at).toLocaleDateString("ar-EG")}
                         </span>
                     </div>
                 </div>

                 {/* نوع السؤال */}
                 <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                     <div className="flex flex-col gap-4 w-1/2">
                         <span className="text-[#5E5E5E] text-sm font-bold">نوع السؤال</span>
                             <span className="text-black-text font-bold text-[15px]">
                                 {questionData?.data?.type === "multiple_choice" ? "اختيار من متعدد" : 
                                 questionData?.data?.type === "text" ? "نص" : "رقم"} 
                             </span>
                     </div>
                 </div>

                 {/* الخيارات */}
                 {questionData?.data?.type === "multiple_choice" && (
                     <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke w-full">
                         <div className="flex flex-col gap-4 w-full">
                             <span className="text-[#5E5E5E] text-sm font-bold">الخيارات</span>

                             {editField === "options" ? (
                                 <div className="flex flex-col gap-3">
                                     {watch("options")?.map((option, index) => (
                                         <div
                                             key={index}
                                             className="flex gap-3 items-center w-full"
                                         >
                                             <input
                                                 type="text"
                                                 placeholder="الخيار بالعربية"
                                                 value={option.ar.title}
                                                 onChange={(e) => {
                                                     const updated = [...(watch("options") || [])];
                                                     updated[index].ar.title = e.target.value;
                                                     setValue("options", updated);
                                                 }}
                                                 className="border rounded-lg px-3 py-2 text-sm flex-1"
                                             />
                                             <input
                                                 type="text"
                                                 placeholder="الخيار بالإنجليزية"
                                                 value={option.en.title}
                                                 onChange={(e) => {
                                                    const updated = [...(watch("options") || [])];
                                                    updated[index].en.title = e.target.value;
                                                    setValue("options", updated);
                                                 }}
                                                 className="border rounded-lg px-3 py-2 text-sm flex-1"
                                             />
                                             <button
                                                 type="button"
                                                 onClick={() => {
                                                     const updated = [...(watch("options") || [])];
                                                     updated.splice(index, 1);
                                                     setValue("options", updated);
                                                 }}
                                                 className="text-white px-2 py-1 rounded-full text-xs"
                                             >
                                                 <Trash color="red" size="16" />
                                             </button>
                                         </div>
                                     ))}

                                     {/* زر إضافة خيار جديد */}
                                     <button
                                         type="button"
                                         onClick={() => {
                                             const updated = [...(watch("options") || [])];
                                             updated.push({ ar: { title: "" }, en: { title: "" } });
                                             setValue("options", updated);
                                         }}
                                         className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm w-fit"
                                     >
                                         + إضافة خيار
                                     </button>

                                     <div className="flex gap-2 mt-2">
                                         <Button
                                             size="sm"
                                             color="primary"
                                             variant="solid"
                                             className="text-white"
                                             type="submit"
                                         >
                                             حفظ
                                         </Button>
                                         <Button
                                             size="sm"
                                             color="danger"
                                             variant="light"
                                             onPress={() => setEditField(null)}
                                         >
                                             إلغاء
                                         </Button>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="flex items-center gap-3 flex-wrap justify-between">
                                     <div className="flex items-center gap-3 flex-wrap">
                                         {data.data.options.map((option: any) => (
                                             <div
                                                 className="bg-primary/10 py-2 px-4 rounded-xl text-primary font-bold text-sm"
                                                 key={option.id}
                                             >
                                                 {option.title}
                                             </div>
                                         ))}
                                     </div>
                                     <button
                                         type="button"
                                         onClick={() => {
                                             setValue(
                                                 "options",
                                                 data.data.options.map((opt: any) => ({
                                                     ar: { title: opt.title_ar },
                                                     en: { title: opt.title_en },
                                                 }))
                                             );
                                             setEditField("options");
                                         }}
                                         className="flex items-center gap-1 text-sm font-bold"
                                     >
                                         <Edit2 size={18} />
                                         تعديل
                                     </button>
                                 </div>
                             )}
                         </div>
                     </div>
                 )}
             </form>
             )
    );
};
