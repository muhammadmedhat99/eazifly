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
  Spinner
} from "@heroui/react";
import { useState } from "react";
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

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProgram({
  isOpen,
  onClose,
}: StudentModalProps) {
  const params = useParams();
  const teacherId = params.id;
  const queryClient = useQueryClient();

  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<any>({
    });;

    const onSubmit = async (data: any) => {
        assignInstructorsMutation.mutate(data);
    };

    const assignInstructorsMutation = useMutation({
        mutationFn: (submitData: any) => {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = {
                program_id: submitData.program_id,
                instructor_id: [teacherId],
                amount_per_hour: [submitData.amount_per_hour],
            };

            return postData(
                "client/program/attach/assign/instructor",
                JSON.stringify(formdata),
                myHeaders
            );
        },
        onSuccess: (data: any) => {
            if (data.status !== 200 && data.status !== 201) {
                addToast({
                    title: `Error adding teacher: ${data.message}`,
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                queryClient.invalidateQueries({ queryKey: [`GetInstructorPrograms`] });
                onClose();
            }
        },
        onError: (error: Error) => {
            console.error("Error adding teacher:", error);
            addToast({
                title: "عذرا حدث خطأ ما",
                color: "danger",
            });
        },
    });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data: programs, isLoading: programsLoading } = useQuery({
        queryFn: async () => await fetchClient(`client/program`, axios_config),
        queryKey: AllQueryKeys.GetAllPrograms(debouncedSearch, 1),
    });
    

  return (
    <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}  onOpenChange={(open) => !open && onClose()} size="4xl">
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              أضافة برنامج 
            </ModalHeader>

            <ModalBody>
                          <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="grid grid-cols-1 gap-4 p-6"
                          >
                              <div
                                      className="grid grid-cols-3 gap-4 mb-6 p-4 border border-gray-200 rounded-lg"
                                  >
                                      {/* Teacher Select */}
                                      <div className="col-span-2">
                                          <Controller
                                              name={`program_id`}
                                              control={control}
                                              render={({ field }) => (
                                                  <Select
                                                      {...field}
                                                      selectedKeys={field.value ? [field.value] : [""]}
                                                      onSelectionChange={(keys) => {
                                                          field.onChange(Array.from(keys)[0]);
                                                      }}
                                                      label="أختر البرنامج"
                                                      labelPlacement="outside"
                                                      placeholder="حدد البرنامج المناسب"
                                                      isInvalid={!!errors.program_id?.message}
                                                      errorMessage={errors.program_id?.message}
                                                      isLoading={programsLoading}
                                                      classNames={{
                                                          label: "text-[#272727] font-bold text-sm",
                                                          base: "mb-4",
                                                          value: "text-[#87878C] text-sm",
                                                      }}
                                                      scrollShadowProps={{
                                                          isEnabled: false,
                                                      }}
                                                      maxListboxHeight={200}
                                                  >
                                                      {programs.data?.map(
                                                          (item: { id: string; title: string }) => (
                                                              <SelectItem key={item.id}>{item.title}</SelectItem>
                                                          )
                                                      )}
                                                  </Select>
                                              )}
                                          />
                                      </div>

                                      {/* Hour Rate Input */}
                                      <div className="flex items-start gap-2">
                                          <Input
                                              label="سعر الساعة"
                                              placeholder="سعر الساعة"
                                              type="text"
                                              {...register(`amount_per_hour`)}
                                              isInvalid={!!errors.amount_per_hour?.message}
                                              errorMessage={errors.amount_per_hour?.message}
                                              labelPlacement="outside"
                                              classNames={{
                                                  label: "text-[#272727] font-bold text-sm",
                                                  inputWrapper: "shadow-none",
                                                  base: "mb-4",
                                              }}
                                              endContent={<span className="font-semibold text-sm">ج.م</span>}
                                          />

                                      </div>
                                  </div>
                              
                              <div className="flex items-center justify-end gap-4 mt-8">
                                  <Button
                                      type="button"
                                      onPress={() => onClose()}
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
                                      isDisabled={assignInstructorsMutation?.isPending}
                                  >
                                      {assignInstructorsMutation?.isPending && <Spinner color="white" size="sm" />}
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
