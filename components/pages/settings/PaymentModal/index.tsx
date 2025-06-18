import { DropzoneField } from "@/components/global/DropZoneField";
import { LocalizedTextArea } from "@/components/global/LocalizedField";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Tabs,
    Tab,
    Input
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const schema = yup
  .object({
    title_ar: yup
      .string()
      .required("ادخل العنوان")
      .min(3, "العنوان لا يجب ان يقل عن ٣ احرف"),
    title_en: yup
      .string()
      .required("ادخل العنوان")
      .min(3, "العنوان لا يجب ان يقل عن ٣ احرف"),
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
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function PaymentModal({
    isOpen,
    onClose,
}: PaymentModalProps) {
    const [selectedTab, setSelectedTab] = useState("info");
    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
      });

    const onSubmit = (data: FormData) => console.log(data)
    
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
                                    {...register("title_ar")}
                                    isInvalid={!!errors.title_ar?.message}
                                    errorMessage={errors.title_ar?.message}
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
                                    {...register("title_en")}
                                    isInvalid={!!errors.title_en?.message}
                                    errorMessage={errors.title_en?.message}
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
                                    >
                                        حفظ
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
