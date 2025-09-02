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
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { getCookie } from "cookies-next";
import React from "react";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";


const schema = yup
    .object({
        name: yup
            .string()
            .required("ادخل الاسم")
            .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),

    })
    .required();

type FormData = yup.InferType<typeof schema>;

export const InformationForm = ({ setActiveStep, setRoleId }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => CreateRole.mutate(data);

    const CreateRole = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = new FormData();
            formdata.append("name", submitData.name);

            return postData("client/create/role", formdata, myHeaders);
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
                    title: data?.message,
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                setActiveStep(1);
                setRoleId(data?.data?.id);
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
        <div className="grid grid-cols-1 gap-3 px-4 py-6">
            <div className="flex flex-col relative touch-none tap-highlight-transparent select-none w-full bg-content1 border border-stroke max-w-full justify-between rounded-2xl gap-5 p-4 data-[selected=true]:border-success">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
                >
                    <Input
                        label="الاسم"
                        placeholder="نص الكتابه"
                        type="text"
                        {...register("name")}
                        isInvalid={!!errors.name?.message}
                        errorMessage={errors.name?.message}
                        labelPlacement="outside"
                        classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                            base: "mb-40",
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
                            isDisabled={CreateRole?.isPending}
                        >
                            {CreateRole?.isPending && <Spinner color="white" size="sm" />}
                            التالي
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
