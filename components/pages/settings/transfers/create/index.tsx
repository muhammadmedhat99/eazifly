"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    addToast,
    Button,
    Input,
    Select,
    SelectItem,
    Spinner,
    Avatar,
} from "@heroui/react";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import { useRouter } from "next/navigation";


export const CreateTransfers = () => {
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


    type FormData = yup.InferType<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const router = useRouter();

    const [columns, setColumns] = useState<string[]>([""]);

    const addColumn = () => setColumns([...columns, ""]);
    const removeColumn = (index: number) =>
        setColumns(columns.filter((_, i) => i !== index));

    const onSubmit = (data: any) => {
        const payload = {
            title: data.title,
            image: data.image,
            payment_methods_information: {
                columns: columns.filter((c) => c.trim() !== ""), 
            },
        };

        CreateTransfer.mutate(payload);
    };

    const CreateTransfer = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();

            formdata.append(`title`, submitData.title);
            submitData.payment_methods_information.columns.forEach((col: string, index: number) => {
                formdata.append(`payment_methods_information[columns][${index}]`, col);
            });
            if (submitData.image?.length) {
                formdata.append("image", submitData.image[0]);
            }


            return postData("client/instructor/payment/method/store", formdata, myHeaders);
        },
        onSuccess: (data) => {
            if (data.message && typeof data.message === "object" && !Array.isArray(data.message)) {
                const messagesObj = data.message as Record<string, string[]>;

                Object.entries(messagesObj).forEach(([field, messages]) => {
                    messages.forEach((msg) => {
                        addToast({
                            title: `${field}: ${msg}`,
                            color: "danger",
                        });
                    });
                });
            } else if (data.message !== "success") {
                addToast({
                    title: "error",
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                router.push('/settings/transfers')
            }
        },
        onError: (error) => {
            console.log(" error ===>>", error);
            addToast({
                title: "عذرا حدث خطأ ما",
                color: "danger",
            });
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: AllQueryKeys.GetAllCountries,
        queryFn: async () => await fetchClient(`client/countries`, axios_config),
    });

    return isLoading ? (
        <Loader />
    ) : (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 py-14 px-8"
        >
            <Input
                label="الاسم"
                placeholder="نص الكتابه"
                type="text"
                {...register("title")}
                isInvalid={!!errors.title?.message}
                errorMessage={errors.title?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
                />

                <Controller
                    name="image"
                    control={control}
                    render={({ field, fieldState }) => (
                        <DropzoneField
                            value={(field.value as any) || []}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            label="الصورة"
                            description="تحميل صورة"
                        />
                    )}
                />

            {/* Dynamic Columns */}
            <div className="col-span-2">
                <label className="text-[#272727] font-bold text-sm mb-2 block">
                    بيانات الدفع
                </label>
                {columns.map((col, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                            value={col}
                            onChange={(e) => {
                                const newCols = [...columns];
                                newCols[index] = e.target.value;
                                setColumns(newCols);
                            }}
                            placeholder="اكتب العمود"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            color="danger"
                            variant="flat"
                            onPress={() => removeColumn(index)}
                        >
                            ×
                        </Button>
                    </div>
                ))}
                <Button type="button" color="primary" variant="flat" onPress={addColumn}>
                    + إضافة
                </Button>
            </div>

            <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
                <Button
                    type="button"
                    onPress={() => reset()}
                    variant="solid"
                    color="primary"
                    className="text-white"
                >
                    إلغاء
                </Button>
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    className="text-white"
                    isDisabled={CreateTransfer?.isPending}
                >
                    {CreateTransfer?.isPending && <Spinner color="white" size="sm" />}
                    التالي
                </Button>
            </div>
        </form>
    );
};
