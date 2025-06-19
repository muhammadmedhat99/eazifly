import { DropzoneField } from "@/components/global/DropZoneField";
import { LocalizedTextArea } from "@/components/global/LocalizedField";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    addToast
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { paymentFormSchema, type PaymentFormData } from "./schemas";

const locales = ["ar", "en"] as const;

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const defaultPaymentValues: Partial<PaymentFormData> = {
  localizedFields: locales.reduce(
    (acc, locale) => ({
      ...acc,
      [locale]: { title: "", description: "" },
    }),
    {} as PaymentFormData["localizedFields"]
  ),
};

export default function PaymentModal({
    isOpen,
    onClose,
}: PaymentModalProps) {
    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<PaymentFormData>({
        resolver: yupResolver(paymentFormSchema),
      });

    const createFormData = (submitData: PaymentFormData): FormData => {
        const formdata = new FormData();

        locales.forEach((locale) => {
            const localeData = submitData.localizedFields[locale];
            formdata.append(`${locale}[title]`, localeData.title);
            formdata.append(`${locale}[description]`, localeData.description);
        });

        if (submitData.image && submitData.image.length > 0) {
            formdata.append("image", submitData.image[0]);
        }
        if (submitData.how_to_use && submitData.how_to_use.length > 0) {
            formdata.append("how_to_use", submitData.how_to_use[0]);
        }

        return formdata;
    };

    const CreatePaymentMethod = useMutation({
        mutationFn: (submitData: PaymentFormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            const formdata = createFormData(submitData);
            return postData("client/payment/method/store", formdata, myHeaders);
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

    const onSubmit = (data: PaymentFormData) => CreatePaymentMethod.mutate(data);

    return (
        <Modal isOpen={isOpen} scrollBehavior={scrollBehavior} onOpenChange={(open) => !open && onClose()} size="4xl">
            <ModalContent>
                {(closeModal) => (
                    <>
                        <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                            اضافة وسيلة دفع جديدة
                        </ModalHeader>

                        <ModalBody>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <Input
                                    label="العنوان بالعربية"
                                    placeholder="نص الكتابه"
                                    type="text"
                                    {...register("localizedFields.ar.title")}
                                    isInvalid={!!errors?.localizedFields?.ar?.title}
                                    errorMessage={errors?.localizedFields?.ar?.title?.message}
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-[#272727] font-bold text-sm",
                                        inputWrapper: "shadow-none",
                                        base: "mb-4",
                                    }}
                                    />
                                <Input
                                    label="العنوان بالإنجليزية"
                                    placeholder="نص الكتابه"
                                    type="text"
                                    {...register("localizedFields.en.title")}
                                    isInvalid={!!errors?.localizedFields?.en?.title}
                                    errorMessage={errors?.localizedFields?.en?.title?.message}
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-[#272727] font-bold text-sm",
                                        inputWrapper: "shadow-none",
                                        base: "mb-4",
                                    }}
                                    />

                                <div className="col-span-2">
                                    <LocalizedTextArea
                                        control={control}
                                        name="description"
                                        label="الوصف"
                                    />
                                </div>
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
                                            label="كيقية الاستخدام"
                                            description="تحميل صورة او فيديو"
                                        />
                                    )}
                                />


                                <div className="flex items-center justify-center gap-5 px-6 py-4 col-span-2">
                                    <Button
                                        type="button"
                                        onPress={closeModal}
                                        variant="solid"
                                        color="primary"
                                        className="text-white w-36"
                                    >
                                        إلغاء
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        color="primary"
                                        className="text-white w-36"
                                        isLoading={CreatePaymentMethod.isPending}
                                    >
                                        {CreatePaymentMethod.isPending ? "جاري الحفظ..." : "حفظ"}
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
