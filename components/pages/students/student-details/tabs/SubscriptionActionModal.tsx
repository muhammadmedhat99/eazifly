"use client";

import { DropzoneField } from "@/components/global/DropZoneField";
import { postData } from "@/lib/utils";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, ModalContent, addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

interface SubscriptionActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: string | null;
    subscriptionId: number | null;
    user_id: string;
}

export default function SubscriptionActionModal({
    isOpen,
    onClose,
    action,
    subscriptionId,
    user_id
}: SubscriptionActionModalProps) {
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            paid: "",
            image: []
        },
    });

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
                    <div className="space-y-4">
                        <Input label="مدة الإيقاف (بالأيام)" placeholder="مثلاً 30" />
                    </div>
                );
            case "extend":
                return (
                    <div className="space-y-4">
                        <Input label="عدد الأيام" placeholder="مثلاً 15" />
                    </div>
                );
            case "change":
                return (
                    <div className="space-y-4">
                        <Input label="نوع الاشتراك الجديد" placeholder="أدخل النوع" />
                    </div>
                );
            case "cancel":
                return (
                    <div className="space-y-4">
                        <Input label="سبب الإنهاء" placeholder="أدخل السبب" />
                    </div>
                );
            default:
                return null;
        }
    };

    const onSubmit = (data: any) => handleAction.mutate(data);

    const handleAction = useMutation({
        mutationFn: (submitData: any) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append("paid", submitData.paid);
            if (submitData.image?.[0]) {
                formdata.append("image", submitData.image[0]);
            }
            formdata.append("program_id", subscriptionId ? subscriptionId.toString() : "");
            formdata.append("user_id", user_id);
            return postData(`client/order/renew`, formdata, myHeaders);
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
                reset();
                onClose();
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

    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    return (
        <Modal isOpen={isOpen} scrollBehavior={scrollBehavior} onOpenChange={(open) => !open && onClose()} size="xl">
            <ModalContent>
                <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                    {action ? getActionTitle(action) : "إجراء"}
                </ModalHeader>
                <ModalBody>{renderContent()}</ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="solid" className="text-white" onPress={onClose}>
                        إلغاء
                    </Button>
                    <Button color="primary" variant="solid" className="text-white" onPress={() => handleSubmit(onSubmit)()}>
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
            return "تغيير الاشتراك";
        case "cancel":
            return "إنهاء الاشتراك";
        default:
            return "";
    }
}
