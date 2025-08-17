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
import { LocalizedField } from "@/components/global/LocalizedField";
import { useLanguages } from "@/lib/hooks/useLanguages";


export const CreateCountries = () => {
    const { languages } = useLanguages();

    const schema = yup.object({
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
    });

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
    const onSubmit = (data: FormData) => CreateCountry.mutate(data);

    const CreateCountry = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();
            languages.forEach((locale: string) => {
                const localeData = submitData.localizedFields[locale];
                formdata.append(`${locale}[name]`, localeData.name);
            });
            formdata.append("country_code", submitData.country_code);
            formdata.append("phone_code", `+${submitData.phone_code.replace(/^\+/, "")}`);

            if (submitData.image?.length) {
                formdata.append("image", submitData.image[0]);
            }


            return postData("client/country/store", formdata, myHeaders);
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
                router.push('/settings/countries')
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
            className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
        >
           <LocalizedField control={control} name="name" label="الاسم" />
            <Input
                label="كود الدولة"
                placeholder="نص الكتابه"
                type="text"
                {...register("country_code")}
                isInvalid={!!errors.country_code?.message}
                errorMessage={errors.country_code?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
            />
            <Input
                label="مفتاح الدولة"
                placeholder="نص الكتابه"
                type="text"
                {...register("phone_code")}
                isInvalid={!!errors.phone_code?.message}
                errorMessage={errors.phone_code?.message}
                labelPlacement="outside"
                startContent={<span className="text-gray-500">+</span>}
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
                    isDisabled={CreateCountry?.isPending}
                >
                    {CreateCountry?.isPending && <Spinner color="white" size="sm" />}
                    التالي
                </Button>
            </div>
        </form>
    );
};
