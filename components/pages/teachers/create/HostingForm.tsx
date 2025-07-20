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
import { CloudAdd, Wallet } from "iconsax-reactjs";


interface host {
  id: string;
  title: string;
}

export const HostingForm = ({
    setActiveStep,
    teacherId,
}: {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    teacherId: number | null;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({});

    const { data: hosts, isLoading: loadingHosts } = useQuery(
        {
          queryFn: async () =>
            await fetchClient(`client/program/hosts?type=manual`, axios_config),
          queryKey: AllQueryKeys.GetAllHost,
        }
      );

    const router = useRouter();

    const onSubmit = (formData: any) => {
        const meeting_host_ids: number[] = [];
        const links: string[] = [];

        hosts?.data.forEach((host: any) => {
            const linkValue = formData[`link_${host.id}`];
            if (linkValue && linkValue.trim() !== "") {
                meeting_host_ids.push(host.id);
                links.push(linkValue.trim());
            }
        });

        CreateHostLinks.mutate({
            instructor_id: teacherId ?? "",
            meeting_host_ids,
            links,
        });
    };

    const CreateHostLinks = useMutation({
        mutationFn: async (submitData: any) => {
            const myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            return postData("client/instructor/meeting/host/links", JSON.stringify(submitData), myHeaders);
        },
        onSuccess: (data) => {
            if (data.message !== "success") {
                addToast({ title: "error", color: "danger" });
            } else {
                addToast({ title: data?.message, color: "success" });
                reset();
                setActiveStep(3);
            }
        },
        onError: (error) => {
            console.log("error ===>>", error);
            addToast({ title: "عذرا حدث خطأ ما", color: "danger" });
        },
    });
    ;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="py-14 px-8 flex flex-col gap-4">
            {loadingHosts ? (
                <Loader />
            ) : (
                hosts?.data.map((host: any) => (
                    <div key={host.id} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold mb-1">الاستضافة</span>
                            <div className="flex items-center justify-between bg-main p-3 rounded-2xl border border-stroke">
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={host?.icon}
                                        size="md"
                                        radius="sm"
                                        alt={host.title}
                                        fallback={<CloudAdd />}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-black-text">{host.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Input
                            label="لينك الاستضافة"
                            placeholder="نص الكتابه"
                            type="text"
                            {...register(`link_${host.id}`)}
                            labelPlacement="outside"
                            classNames={{
                                label: "text-[#272727] font-bold text-sm",
                                inputWrapper: "shadow-none",
                                base: "",
                            }}
                        />
                    </div>
                ))
            )}

            <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
                <Button type="button" onPress={() => reset()} variant="solid" color="primary" className="text-white">
                    إلغاء
                </Button>
                <Button type="submit" variant="solid" color="primary" className="text-white">
                    التالي
                </Button>
            </div>
        </form>
    );
};
