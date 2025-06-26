"use client";
import { Edit2 } from "iconsax-reactjs";
import { Loader } from "@/components/global/Loader";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";

type appointmentsProps = {
  appointmentData?: any;
  isLoadingappointment: boolean;
};

const schema = yup
  .object({
    session_date: yup.string().required("ادخل تاريخ المحاضرة"),
    session_time: yup.string().required("ادخل وقت المحاضرة"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const Appointments = ({ appointmentData, isLoadingappointment }: appointmentsProps) => {
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => ChangeAppointment.mutate(data);

    const ChangeAppointment = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append("meeting_session_id", selectedAppointment.id);
            formdata.append("session_date", submitData.session_date);
            formdata.append("session_time", submitData.session_time);

            return postData("client/change/appointment", formdata, myHeaders);
        },
        onSuccess: (data) => {
            if (data.status === 201) {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                reset();
                setIsModalOpen(false);
            } else if (data.status === 422) {
                const msg =
                    data.message?.appointments?.[0];
                addToast({
                    title: msg,
                    color: "warning",
                });
            } else {
                addToast({
                    title: "عذرا حدث خطأ ما",
                    color: "danger",
                });
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

    return (
        <div className="flex flex-col gap-2">
            {isLoadingappointment ? (
                <Loader />
            ) : appointmentData.data && appointmentData.data.length > 0 ? (
                appointmentData.data.map((appointment: any, appointmentIndex: number) => (
                    <div key={appointmentIndex} className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke">
                        <div className="flex items-center gap-20">
                            <div className="flex flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">تاريخ المحاضرة</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {appointment.session_date}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">وقت المحاضرة</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {appointment.session_time} 
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">مدة المحاضرة</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {appointment.duration} دقيقة
                                </span>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setIsModalOpen(true);
                                }}
                                type="button"
                                className="flex items-center gap-1 text-sm font-bold text-[#5E5E5E]"
                            >
                                <Edit2 size={18} />
                                تعديل
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-sm text-gray-500 text-center">لا توجد بيانات حالية للعرض</div>
            )}
            <Modal
                isOpen={isModalOpen}
                scrollBehavior="inside"
                size="4xl"
                onOpenChange={(open) => {
                    if (!open) {
                        setIsModalOpen(false);
                        setSelectedAppointment(null);
                    }
                }}
            >
                <ModalContent>
                    {(closeModal) => (
                        <>
                            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                                تغير بيانات محاضرة
                            </ModalHeader>
                            <ModalBody>
                                <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="grid grid-cols-1 gap-4 p-6"
                          >
                                    <Input
                                        label="تاريخ المحاضرة"
                                        placeholder="نص الكتابه"
                                        type="date"
                                        {...register("session_date")}
                                        isInvalid={!!errors.session_date?.message}
                                        errorMessage={errors.session_date?.message}
                                        labelPlacement="outside"
                                        classNames={{
                                            label: "text-[#272727] font-bold text-sm",
                                            inputWrapper: "shadow-none",
                                            base: "mb-4",
                                        }}
                                    />
                                    <Input
                                        label="وقت المحاضرة"
                                        placeholder="نص الكتابه"
                                        type="time"
                                        {...register("session_time")}
                                        isInvalid={!!errors.session_time?.message}
                                        errorMessage={errors.session_time?.message}
                                        labelPlacement="outside"
                                        classNames={{
                                            label: "text-[#272727] font-bold text-sm",
                                            inputWrapper: "shadow-none",
                                            base: "mb-4",
                                        }}
                                    />
                                    <div className="flex items-center justify-end gap-4 mt-8">
                                     <Button
                                      type="submit"
                                      variant="solid"
                                      color="primary"
                                      className="text-white"
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
        </div>
    );
};
