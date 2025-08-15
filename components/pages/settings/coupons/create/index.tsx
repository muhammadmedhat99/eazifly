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
        code: yup
            .string()
            .required("ادخل كود الخصم")
            .min(3, "كود الخصم لا يجب أن يقل عن ٣ أحرف"),

        discount: yup
            .number()
            .typeError("ادخل قيمة الخصم")
            .required("ادخل قيمة الخصم")
            .min(1, "قيمة الخصم يجب أن تكون أكبر من صفر"),

        discount_type: yup
            .string()
            .required("اختر نوع الخصم")
            .oneOf(["fixed", "percentage"], "نوع الخصم غير صحيح"),

        expire_date: yup
            .date()
            .typeError("ادخل تاريخ صحيح")
            .required("ادخل تاريخ الانتهاء"),

        times_used: yup
            .number()
            .typeError("ادخل عدد مرات الاستخدام")
            .required("ادخل عدد مرات الاستخدام")
            .min(0, "لا يمكن أن يكون أقل من صفر"),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

export const CreateCoupons = () => {
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
    const onSubmit = (data: FormData) => CreateCoupon.mutate(data);

    const CreateCoupon = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();
            formdata.append("code", submitData.code);
            formdata.append("discount", submitData.discount.toString());
            formdata.append("discount_type", submitData.discount_type);
            const expireDate = new Date(submitData.expire_date)
                .toISOString()
                .split("T")[0];
            formdata.append("expire_date", expireDate);
            formdata.append("times_used", submitData.times_used.toString())

            return postData("client/coupon/store", formdata, myHeaders);
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
                router.push('/settings/coupons')
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
            {/* كود الخصم */}
            <Input
                label="كود الخصم"
                placeholder="أدخل كود الخصم"
                type="text"
                {...register("code")}
                isInvalid={!!errors.code?.message}
                errorMessage={errors.code?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
            />

            {/* قيمة الخصم */}
            <Input
                label="قيمة الخصم"
                placeholder="أدخل قيمة الخصم"
                type="number"
                {...register("discount")}
                isInvalid={!!errors.discount?.message}
                errorMessage={errors.discount?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
            />

            {/* نوع الخصم */}
            <Select
                label="نوع الخصم"
                placeholder="اختر نوع الخصم"
                {...register("discount_type")}
                isInvalid={!!errors.discount_type?.message}
                errorMessage={errors.discount_type?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    base: "mb-4",
                }}
            >
                <SelectItem key="fixed">
                    ثابت
                </SelectItem>
                <SelectItem key="percentage">
                    نسبة مئوية
                </SelectItem>
            </Select>

            {/* تاريخ الانتهاء */}
            <Input
                label="تاريخ الانتهاء"
                type="date"
                {...register("expire_date")}
                isInvalid={!!errors.expire_date?.message}
                errorMessage={errors.expire_date?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
            />

            {/* عدد مرات الاستخدام */}
            <Input
                label="عدد مرات الاستخدام"
                placeholder="0"
                type="number"
                {...register("times_used")}
                isInvalid={!!errors.times_used?.message}
                errorMessage={errors.times_used?.message}
                labelPlacement="outside"
                classNames={{
                    label: "text-[#272727] font-bold text-sm",
                    inputWrapper: "shadow-none",
                    base: "mb-4",
                }}
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
                    isDisabled={CreateCoupon?.isPending}
                >
                    {CreateCoupon?.isPending && <Spinner color="white" size="sm" />}
                    حفظ
                </Button>
            </div>
        </form>
    );
};
