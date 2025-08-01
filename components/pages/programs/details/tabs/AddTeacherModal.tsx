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
import { TeacherAndContentFormData, teacherAndContentSchema } from "../../create/schemas";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableTeachers: any;
}

export default function AddTeacherModal({
  isOpen,
  onClose,
  tableTeachers
}: StudentModalProps) {
  const params = useParams();
  const programId = params.id;
  const queryClient = useQueryClient();

  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

    let defaultValues: TeacherAndContentFormData = {
      specialization_id: "1",
      teachers: [{ teacher_id: "", hour_rate: "" }],
    };
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<TeacherAndContentFormData>({
        resolver: yupResolver(teacherAndContentSchema),
        defaultValues,
    });;

    const onSubmit = async (data: TeacherAndContentFormData) => {
        assignInstructorsMutation.mutate(data);
    };

    const assignInstructorsMutation = useMutation({
        mutationFn: (submitData: TeacherAndContentFormData) => {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = {
                program_id: programId,
                instructor_id: submitData.teachers.map((teacher) => teacher.teacher_id),
                amount_per_hour: submitData.teachers.map(
                    (teacher) => teacher.hour_rate
                ),
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
                queryClient.invalidateQueries({ queryKey: ["GetProgramDetails", programId] });
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

    const { data: instructors, isLoading: instructorsLoading } = useQuery({
        queryFn: async () => await fetchClient(`client/program/related/instructors?program_id=${programId}`, axios_config),
        queryKey: ["GetRelatedInstructores", programId],
    });
    
    const filteredInstructors = (instructors?.data || []).filter(
        (instructor: any) =>
            !tableTeachers.some((teacher: any) => teacher.id === instructor.id)
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: "teachers",
    });

  return (
    <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}  onOpenChange={(open) => !open && onClose()} size="4xl">
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              أضافة معلم 
            </ModalHeader>

            <ModalBody>
                          <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="grid grid-cols-1 gap-4 p-6"
                          >
                              {fields.map((field, index) => (
                                  <div
                                      key={field.id}
                                      className="grid grid-cols-3 gap-4 mb-6 p-4 border border-gray-200 rounded-lg"
                                  >
                                      {/* Teacher Select */}
                                      <div className="col-span-2">
                                          <Controller
                                              name={`teachers.${index}.teacher_id`}
                                              control={control}
                                              render={({ field }) => (
                                                  <Select
                                                      {...field}
                                                      selectedKeys={field.value ? [field.value] : [""]}
                                                      onSelectionChange={(keys) => {
                                                          field.onChange(Array.from(keys)[0]);
                                                      }}
                                                      label="أختر المعلم"
                                                      labelPlacement="outside"
                                                      placeholder="حدد المعلم المناسب"
                                                      isInvalid={!!errors.teachers?.[index]?.teacher_id?.message}
                                                      errorMessage={errors.teachers?.[index]?.teacher_id?.message}
                                                      isLoading={instructorsLoading}
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
                                                      {filteredInstructors?.map(
                                                          (item: { id: string; name_ar: string }) => (
                                                              <SelectItem key={item.id}>{item.name_ar}</SelectItem>
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
                                              {...register(`teachers.${index}.hour_rate`)}
                                              isInvalid={!!errors.teachers?.[index]?.hour_rate?.message}
                                              errorMessage={errors.teachers?.[index]?.hour_rate?.message}
                                              labelPlacement="outside"
                                              classNames={{
                                                  label: "text-[#272727] font-bold text-sm",
                                                  inputWrapper: "shadow-none",
                                                  base: "mb-4",
                                              }}
                                              endContent={<span className="font-semibold text-sm">ج.م</span>}
                                          />

                                          {/* Remove Button - Only show if more than one teacher */}
                                          {fields.length > 1 && (
                                              <Button
                                                  type="button"
                                                  onPress={() => remove(index)}
                                                  variant="light"
                                                  color="danger"
                                                  size="sm"
                                                  className="mt-6"
                                              >
                                                  حذف
                                              </Button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                              
                              {/* Add Teacher Button */}
                              <div className="text-center">
                                  <button
                                      type="button"
                                      onClick={() => append({ teacher_id: "", hour_rate: "" })}
                                      className="text-primary font-semibold text-sm hover:underline"
                                  >
                                      إضافة معلم آخر
                                  </button>
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
