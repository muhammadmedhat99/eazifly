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


interface HostModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}
interface host {
  id: string;
  title: string;
}

// Define form data type
type HostFormData = Record<string, boolean>;

const schema = yup.object().shape({
  meeting_host_id: yup
    .string()
    .required("يجب اختيار الاستضافة"),
});

export default function HostUpdateModal({
  isOpen,
  onClose,
  initialData
}: HostModalProps) {
  const params = useParams();
  const programId = params.id;
  const queryClient = useQueryClient();

  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

  function mapInitialDataToDefaultValues(data: any) {
    return {
      meeting_host_id: data.host.id ? String(data.host.id) : "",
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

    const onSubmit = async (data: HostFormData) => {
        updateProgramMutation.mutate(data);
    };

    const updateProgramMutation = useMutation({
        mutationFn: (submitData: any) => {
            console.log('submitData', submitData);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = new FormData();
            formdata.append("meeting_host_id", submitData.meeting_host_id);

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

    const { data: hosts, isLoading: loadingHosts } = useQuery({
        queryFn: async (): Promise<{ data: host[] }> =>
            await fetchClient(`client/program/hosts`, axios_config),
        queryKey: AllQueryKeys.GetAllHost,
    });

    return (
        <Modal isOpen={isOpen} scrollBehavior={scrollBehavior} onOpenChange={(open) => !open && onClose()} size="4xl">
            <ModalContent>
                {(closeModal) => (
                    <>
                        <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                            الاستضافة
                        </ModalHeader>

                        <ModalBody>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="grid grid-cols-1 gap-3 px-4 py-6"
                            >
                                {loadingHosts ? (
                                    <Loader />
                                ) : (
                                           <Controller
                                              name="meeting_host_id"
                                              control={control}
                                              render={({ field }) => (
                                                <Select
                                                  {...field}
                                                  selectedKeys={field.value ? [field.value] : []}
                                                  onSelectionChange={(keys) => {
                                                    const selectedKey = Array.from(keys)[0] as string;
                                                    field.onChange(selectedKey);
                                                  }}
                                                  label="الاستضافة"
                                                  labelPlacement="outside"
                                                  placeholder="اختر الاستضافة"
                                                  isInvalid={!!errors.meeting_host_id?.message}
                                                  errorMessage={errors.meeting_host_id?.message as string}
                                                  isLoading={loadingHosts}
                                                  classNames={{
                                                    label: "text-[#272727] font-bold text-sm",
                                                    base: "mb-4",
                                                    value: "text-[#87878C] text-sm",
                                                  }}
                                                >
                                                  {hosts?.data?.map((host: host) => (
                                                    <SelectItem key={host.id}>{host.title}</SelectItem>
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
