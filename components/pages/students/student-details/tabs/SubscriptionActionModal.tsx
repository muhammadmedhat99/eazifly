"use client";

import { DropzoneField } from "@/components/global/DropZoneField";
import { fetchClient, postData } from "@/lib/utils";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, ModalContent, addToast, Tabs, Tab, Checkbox } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { axios_config } from "@/lib/const";
import ProgramChangeComponent from "./ProgramChangeComponent";

interface SubscriptionActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onActionSuccess?: () => void;
    action: string | null;
    subscription_id: any;
    programId: number | null;
    user_id: string;
    children_users: {
        user_id: string;
        name: string;
        age: string;
        image: string;
    }[]
}

export default function SubscriptionActionModal({
    isOpen,
    onClose,
    action,
    programId,
    user_id,
    children_users,
    onActionSuccess,
    subscription_id
}: SubscriptionActionModalProps) {
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            paid: "",
            image: [],
            days: ""
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ["GetProgramData"],
        queryFn: async () => await fetchClient(`client/plans/${programId}`, axios_config),
    });
    
    const [selectedTab, setSelectedTab] = useState<string>(
        data?.data?.subscripe_days?.[0] || ""
    );
    
    const renderContent = () => {
        switch (action) {
            case "renew":
                return (
                    <div className="flex flex-col gap-3">
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <DropzoneField
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="صورة التحويل"
                                    description="تحميل صورة جديدة"
                                />
                            )}
                        />
                        <Controller
                            name="paid"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="قيمة التحويل"
                                    placeholder="نص الكتابة"
                                    labelPlacement="outside"
                                    endContent={
                                        <span className="text-black-text font-bold text-sm">
                                            ج.م
                                        </span>
                                    }
                                    classNames={{
                                        label: "text-[#272727] font-bold text-sm",
                                        inputWrapper: "shadow-none",
                                    }}
                                />
                            )}
                        />
                    </div>
                );
            case "Pause":
                return (
                    <div className="flex flex-col gap-3">
                        <Controller
                            name="days"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    max={30}
                                    label="مدة الإيقاف"
                                    placeholder="نص الكتابة"
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-[#272727] font-bold text-sm",
                                        inputWrapper: "shadow-none",
                                    }}
                                />
                            )}
                        />
                    </div>
                );
            case "extend":
                return (
                    <div className="flex flex-col gap-3">
                        <Controller
                            name="days"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    max={30}
                                    label="مدة التمديد"
                                    placeholder="نص الكتابة"
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-[#272727] font-bold text-sm",
                                        inputWrapper: "shadow-none",
                                    }}
                                />
                            )}
                        />
                    </div>
                );
            case "change":
                return (
                    <ProgramChangeComponent
                        children_users={children_users}
                        data={data?.data}
                        control={control}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        program_id={programId}
                    />
                );
            default:
                return null;
        }
    };

    const actionsMap: Record<
        string,
        {
            endpoint: string;
            buildFormData: (data: any, programId: number, userId: string) => FormData;
        }
    > = {
        renew: {
            endpoint: "client/order/renew",
            buildFormData: (data, programId, userId) => {
                const formdata = new FormData();
                formdata.append("paid", data.paid);
                if (data.image?.[0]) {
                    formdata.append("image", data.image[0]);
                }
                formdata.append("program_id", programId.toString());
                formdata.append("user_id", userId);
                formdata.append("subscription_id", subscription_id);
                return formdata;
            },
        },

        Pause: {
            endpoint: "client/subscription/freeze",
            buildFormData: (data, programId, userId) => {
                const formdata = new FormData();
                formdata.append("days", data.days);
                formdata.append("program_id", programId.toString());
                formdata.append("user_id", userId);
                formdata.append("subscription_id", subscription_id);
                return formdata;
            },
        },

        extend: {
            endpoint: "client/subscription/extension",
            buildFormData: (data, programId, userId) => {
                const formdata = new FormData();
                formdata.append("days", data.days);
                formdata.append("program_id", programId.toString());
                formdata.append("user_id", userId);
                formdata.append("subscription_id", subscription_id);
                return formdata;
            },
        },

        change: {
            endpoint: "client/subscription/change",
            buildFormData: (data, programId, userId) => {
                const formdata = new FormData();

                formdata.append("program_id", programId?.toString() || "");
                formdata.append("user_id", userId);
                formdata.append("paid", data.paid || "");
                formdata.append("student_number", data.student_number || "");
                formdata.append("subscription_id", subscription_id);

                if (data.image?.[0]) {
                    formdata.append("image", data.image[0]);
                }

                if (data.plan_id) {
                    formdata.append("plan_id", data.plan_id.toString());
                }

                if (data.users_ids?.length > 0) {
                    data.users_ids.forEach((id: string, index: number) => {
                        formdata.append(`users_ids[${index}]`, id);
                    });
                }

                return formdata;
            },
        },

    };

    const createPlanMutation = useMutation({
        mutationFn: async (payload: any) => {
            const myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = new FormData();
            formdata.append("subscripe_days", payload.subscripe_days);
            formdata.append("program_id", payload.program_id);
            formdata.append("number_of_session_per_week", payload.number_of_session_per_week);
            formdata.append("duration", payload.duration);

            return await postData("client/program/plan", formdata, myHeaders);
        },
        onSuccess: (data, variables) => {
            if (data?.status === 404) {
                addToast({
                    title: data.message || "الخطة غير موجودة",
                    color: "warning",
                });
                return; 
            }

            const planId = data?.data?.id;

            const finalFormValues = {
                ...variables.originalData,
                plan_id: planId,
            };

            handleAction.mutate(finalFormValues);
        },
        onError: (error) => {
            console.log("error create plan ===>", error);
            addToast({
                title: "عذرا حدث خطأ ما",
                color: "danger",
            });
        },
    });
    
    const handleAction = useMutation({
        mutationFn: (submitData: any) => {
            if (!action || !programId) return Promise.reject("Missing data");

            const config = actionsMap[action];

            if (!config) return Promise.reject("Unknown action");

            const myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = config.buildFormData(
                submitData,
                programId,
                user_id
            );

            return postData(config.endpoint, formdata, myHeaders);
        },
        onSuccess: (data) => {
            if (data.message !== "success") {
                addToast({
                    title: data?.message,
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                reset();
                onClose();
                onActionSuccess?.();
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


    const onSubmit = (data: any) => {
        if (action === "change") {
            createPlanMutation.mutate({
                subscripe_days: data.subscripe_days,
                program_id: programId,
                number_of_session_per_week: data.number_of_session_per_week,
                duration: data.duration,
                originalData: data,
            });
        } else {
            handleAction.mutate(data);
        }
    };

    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    return (
        <Modal isOpen={isOpen} scrollBehavior={scrollBehavior} onOpenChange={(open) => !open && onClose()} size={action === "change" ? "4xl" : "xl"}>
            <ModalContent>
                <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                    {action ? getActionTitle(action) : "إجراء"}
                </ModalHeader>
                <ModalBody>{renderContent()}</ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="solid" className="text-white" onPress={onClose}>
                        إلغاء
                    </Button>
                    <Button isLoading={handleAction.isPending} color="primary" variant="solid" className="text-white" onPress={() => handleSubmit(onSubmit)()}>
                        حفظ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

function getActionTitle(action: string) {
    switch (action) {
        case "renew":
            return "تجديد الاشتراك";
        case "Pause":
            return "إيقاف مؤقت";
        case "extend":
            return "تمديد الاشتراك";
        case "change":
            return "تغيير إشتراك برنامج";
        case "cancel":
            return "إنهاء الاشتراك";
        default:
            return "";
    }
}
