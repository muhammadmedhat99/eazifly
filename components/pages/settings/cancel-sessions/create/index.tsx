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
import React from "react";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";

const schema = yup
    .object({
        name_ar: yup
            .string()
            .required("ادخل الاسم بالعربية")
            .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),

        name_en: yup
            .string()
            .required("ادخل الاسم بالإنجليزية")
            .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),
        type: yup
              .string()
              .required("برجاء اختيار جهة العرض"),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

export const CreateCancelSessionsReason = () => {
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
    const onSubmit = (data: FormData) => CreateReason.mutate(data);

    const CreateReason = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();
            formdata.append("ar[title]", submitData.name_ar);
            formdata.append("en[title]", submitData.name_en);
            formdata.append("type", submitData.type);

            return postData("client/reason/cancel/session/store", formdata, myHeaders);
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
                router.push('/settings/cancel-sessions')
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


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
        >
            <Input
                label="السبب بالعربية"
                placeholder="نص الكتابه"
                type="text"
                {...register("name_ar")}
                isInvalid={!!errors.name_ar?.message}
                errorMessage={errors.name_ar?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
            />
            <Input
                label="السبب بالإنجليزية"
                placeholder="نص الكتابه"
                type="text"
                {...register("name_en")}
                isInvalid={!!errors.name_en?.message}
                errorMessage={errors.name_en?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
            />

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
                        label="جهة العرض"
                        labelPlacement="outside"
                        placeholder="اختر جهة العرض"
                        isInvalid={!!errors.type?.message}
                        errorMessage={errors.type?.message}
                        classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            base: "mb-4",
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
                    isDisabled={CreateReason?.isPending}
                >
                    {CreateReason?.isPending && <Spinner color="white" size="sm" />}
                    التالي
                </Button>
            </div>
        </form>
    );
};
