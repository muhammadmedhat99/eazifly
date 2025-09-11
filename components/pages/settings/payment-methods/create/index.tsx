"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { Trash } from "iconsax-reactjs";


export const CreatePaymentMethod = () => {
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
                .required(),

            image: yup
                .mixed<FileList>()
                .test(
                    "fileType",
                    "الرجاء تحميل ملف صحيح",
                    (value) => value && value.length > 0
                )
                .required("الرجاء تحميل ملف"),

            how_to_use: yup
                .mixed<FileList>()
                .test(
                    "fileType",
                    "الرجاء تحميل ملف صحيح",
                    (value) => value && value.length > 0
                )
                .required("الرجاء تحميل ملف"),

            qr_image: yup
                .mixed<FileList>()
                .test(
                    "fileType",
                    "الرجاء تحميل ملف صحيح",
                    (value) => value && value.length > 0
                )
                .required("الرجاء تحميل ملف"),

            keys: yup
                .array()
                .of(
                    yup.object().shape({
                        pay_on: yup.string().required("رقم الهاتف مطلوب"),
                        max_value: yup.string().required("القيمة القصوى مطلوبة"),
                    })
                )
                .min(1, "يجب إضافة مفتاح واحد على الأقل").required(),
        })
        .required();


    interface FormData {
        localizedFields: Record<string, { title: string }>;
        image: FileList;
        how_to_use: FileList;
        qr_image: FileList;
        keys: { pay_on: string; max_value: string }[];
        
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            keys: [{ pay_on: "", max_value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "keys",
    });

    const router = useRouter();
    const onSubmit = (data: FormData) => CreateSpecialization.mutate(data);

    const CreateSpecialization = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();
            formdata.append(`type`, 'manual');
            languages.forEach((locale: string) => {
                const localeData = submitData.localizedFields[locale];
                formdata.append(`${locale}[title]`, localeData.title);
            });
            if (submitData.image?.length) {
                formdata.append("image", submitData.image[0]);
            }
            if (submitData.qr_image?.length) {
                formdata.append("qr_image", submitData.qr_image[0]);
            }
            if (submitData.how_to_use?.length) {
                formdata.append("how_to_use", submitData.how_to_use[0]);
            }
            submitData.keys?.forEach((key: any, index: number) => {
                formdata.append(`keys[${index}][pay_on]`, key.pay_on);
                formdata.append(`keys[${index}][max_value]`, key.max_value);
            });

            return postData("client/payment/method/store", formdata, myHeaders);
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
                router.push('/settings/payment-methods')
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

    const { data: countriesData } = useQuery({
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
                <LocalizedField control={control} name="title" label="الاسم" />

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
                <Controller
                    name="how_to_use"
                    control={control}
                    render={({ field, fieldState }) => (
                        <DropzoneField
                            value={(field.value as any) || []}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            label="كيفية الاستخدام"
                            description="تحميل صورةاو ملف"
                        />
                    )}
                />

                <Controller
                    name="qr_image"
                    control={control}
                    render={({ field, fieldState }) => (
                        <DropzoneField
                            value={(field.value as any) || []}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            label="صورة QR"
                            description="تحميل صورة QR"
                        />
                    )}
                />

                <div className="col-span-2">
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 mb-3">
                            <Input
                                label="ادفع على"
                                placeholder="نص الكتابه"
                                type="text"
                                {...register(`keys.${index}.pay_on` as const)}
                                isInvalid={!!errors.keys?.[index]?.pay_on}
                                errorMessage={errors.keys?.[index]?.pay_on?.message}
                                labelPlacement="outside"
                                classNames={{
                                    label: "text-[#272727] font-bold text-sm",
                                    inputWrapper: "shadow-none",
                                    base: "mb-4",
                                }}
                                />
                            <Input
                                label="أقصى قيمة"
                                placeholder="نص الكتابه"
                                type="number"
                                {...register(`keys.${index}.max_value` as const)}
                                isInvalid={!!errors.keys?.[index]?.max_value}
                                errorMessage={errors.keys?.[index]?.max_value?.message}
                                labelPlacement="outside"
                                classNames={{
                                    label: "text-[#272727] font-bold text-sm",
                                    inputWrapper: "shadow-none",
                                    base: "mb-4",
                                }}
                            />

                            {fields.length > 1 && (
                                <button className="border border-danger rounded p-2" type="button" onClick={() => remove(index)}>
                                    <Trash color="red" size="16" />
                                </button>
                            )}
                        </div>
                    ))}

                    <Button  type="button" onPress={() => append({ pay_on: "", max_value: "" })}>
                        +
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
                    isDisabled={CreateSpecialization?.isPending}
                >
                    {CreateSpecialization?.isPending && <Spinner color="white" size="sm" />}
                    التالي
                </Button>
            </div>
        </form>
    );
};
