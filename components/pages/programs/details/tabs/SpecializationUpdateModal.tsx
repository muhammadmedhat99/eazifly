import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Tabs,
    Tab,
    addToast,
    Input,
    Select,
    SelectItem,
    Avatar,
    Spinner,
    Switch,
    cn
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useParams } from 'next/navigation';
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Loader } from "@/components/global/Loader";
import { EmptyWalletChange } from "iconsax-reactjs";


interface SpecializationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}
interface Specialization {
    id: string;
    title: string;
}

// Define form data type
type SpecializationMethodsFormData = Record<string, boolean>;

const schema = yup.object().shape({
  specialization_id: yup
    .array()
    .of(yup.string().required())
    .min(1, "يجب اختيار تخصص واحد على الأقل"),
});

export default function SpecializationUpdateModal({
  isOpen,
  onClose,
  initialData
}: SpecializationModalProps) {
  const params = useParams();
  const programId = params.id;
  const queryClient = useQueryClient();

  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    function mapInitialDataToDefaultValues(data: any) {
        return {
            specialization_id: data.specialization_id
                ? Array.isArray(data.specialization_id)
                    ? data.specialization_id.map(String)
                    : [String(data.specialization_id)]
                : [],
        };
    }

  const mappedDefaults = initialData
    ? mapInitialDataToDefaultValues(initialData)
    : {};

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: mappedDefaults,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (initialData) {
      reset(mapInitialDataToDefaultValues(initialData));
    }
  }, [initialData, reset]);

    const onSubmit = async (data: SpecializationMethodsFormData) => {
        updateProgramMutation.mutate(data);
    };


    const updateProgramMutation = useMutation({
        mutationFn: (submitData: any) => {
            console.log('submitData', submitData);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = new FormData();
            submitData.specialization_id.forEach((id: string) => {
                formdata.append("specialization_id[]", id);
            });

            return postData(
                `client/program/normal/update/${programId}`,
                formdata,
                myHeaders
            );
        },
        onSuccess: (data: any) => {
            if (data.status !== 200 && data.status !== 201) {
                addToast({
                    title: `Error updating program: ${data.message}`,
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                queryClient.invalidateQueries({ queryKey: ["GetProgramDetails", programId] });
                onClose()
            }
        },
        onError: (error: Error) => {
            console.error("Error updating program:", error);
            addToast({
                title: "عذرا حدث خطأ ما",
                color: "danger",
            });
        },
    });

    const { data: specializations, isLoading: loadingSpecializations } = useQuery(
        {
            queryFn: async (): Promise<{ data: Specialization[] }> =>
                await fetchClient(`client/Specializations`, axios_config),
            queryKey: AllQueryKeys.GetAllSpecializations,
        }
    );

    return (
        <Modal isOpen={isOpen} scrollBehavior={scrollBehavior} onOpenChange={(open) => !open && onClose()} size="4xl">
            <ModalContent>
                {(closeModal) => (
                    <>
                        <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                            التخصصات
                        </ModalHeader>

                        <ModalBody>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="grid grid-cols-1 gap-3 px-4 py-6"
                            >
                                {loadingSpecializations ? (
                                    <Loader />
                                ) : (
                                    <Controller
                                        name="specialization_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                label="التخصصات"
                                                labelPlacement="outside"
                                                placeholder="اختر التخصصات"
                                                selectionMode="multiple"
                                                selectedKeys={field.value}
                                                onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                                                isInvalid={!!errors.specialization_id?.message}
                                                errorMessage={errors.specialization_id?.message as string}
                                                classNames={{
                                                    label: "text-[#272727] font-bold text-sm",
                                                    base: "mb-4",
                                                    value: "text-[#87878C] text-sm",
                                                }}
                                            >
                                                {specializations?.data?.map((specialization: Specialization) => (
                                                    <SelectItem key={specialization.id}>
                                                        {specialization.title}
                                                    </SelectItem>
                                                )) ?? []}
                                            </Select>
                                        )}
                                    />

                                )}

                                <div className="flex items-center justify-end gap-4 mt-8">
                                    <Button
                                        type="button"
                                        onPress={onClose}
                                        variant="bordered"
                                        color="primary"
                                    >
                                        إلغاء
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        color="primary"
                                        className="text-white"
                                        isLoading={updateProgramMutation.isPending}
                                    >
                                        التالي
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
