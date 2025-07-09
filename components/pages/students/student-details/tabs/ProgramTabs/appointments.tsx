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
    Select,
    SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";

type appointmentsProps = {
    appointmentData?: any;
    isLoadingappointment: boolean;
};

const schema = yup
    .object({
        session_date: yup.string().required("اختار يوم وتاريخ المحاضرة"),
        session_time: yup.string().required("اختار وقت المحاضرة"),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

type ChangeAppointmentData = FormData & {
    start_time: string;
    end_time: string;
    full_date: string;
    day: string;
};

export const Appointments = ({ appointmentData, isLoadingappointment }: appointmentsProps) => {
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const queryClient = useQueryClient();

    const { data: AilabilitiesSessions, isLoading } = useQuery({
        enabled: !!selectedAppointment,
        queryKey: ["GetavAilabilitiesSessions"],
        queryFn: async () => await fetchClient(`client/session/availabilities/time/${selectedAppointment.instructor_id}?duration=${selectedAppointment.duration}`, axios_config),
    });

    const dayOptions = AilabilitiesSessions?.data
        ? Object.entries(AilabilitiesSessions.data).map(([day, slots]) => {
            return {
                label: `${day} - ${slots[0].full_date}`,
                value: day,
            };
        })
        : [];

    const timeOptions = selectedDay
        ? AilabilitiesSessions?.data?.[selectedDay]?.map((slot) => ({
            label: `من ${slot.start_time} الي ${slot.end_time}`,
            value: JSON.stringify({
                start_time: slot.start_time,
                full_date: slot.full_date,
            }),
        })) || []
        : [];

    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        const { start_time, end_time, full_date } = JSON.parse(data.session_time);
        const day = data.session_date;

        const payload: ChangeAppointmentData = {
            ...data,
            start_time,
            end_time,
            full_date,
            day,
        };

        ChangeAppointment.mutate(payload);
    };

    const ChangeAppointment = useMutation({
        mutationFn: (submitData: ChangeAppointmentData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            formdata.append("session_date", submitData.full_date);
            formdata.append("session_time", submitData.start_time);
            formdata.append("day", submitData.day);

            return postData(`client/change/session/date/${selectedAppointment.id}`, formdata, myHeaders);
        },
        onSuccess: (data) => {
            if (data.status === 201) {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                reset();
                setIsModalOpen(false);
                queryClient.invalidateQueries({
                queryKey: ["programappointments"],
            });
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
                                تغير مواعيد محاضرة
                            </ModalHeader>
                            <ModalBody>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="grid grid-cols-1 gap-4 p-6"
                                >
                                    <Controller
                                        control={control}
                                        name="session_date"
                                        rules={{ required: "اختار يوم وتاريخ المحاضرة" }}
                                        render={({ field }) => (
                                            <Select
                                                label="تاريخ المحاضرة"
                                                placeholder="اختار"
                                                items={dayOptions}
                                                value={field.value || ""}
                                                onSelectionChange={(keys) => {
                                                    const selectedValue: any = Array.from(keys)[0];
                                                    field.onChange(selectedValue);
                                                    setSelectedDay(selectedValue);
                                                    reset({
                                                        session_date: selectedValue,
                                                        session_time: "",
                                                    });
                                                }}
                                                isLoading={isLoading}
                                                isInvalid={!!errors.session_date?.message}
                                                errorMessage={errors.session_date?.message}
                                                labelPlacement="outside"
                                                classNames={{
                                                    label: "text-[#272727] font-bold text-sm",
                                                    trigger: "shadow-none",
                                                    base: "mb-4",
                                                }}
                                            >
                                                {(item) => (
                                                    <SelectItem key={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                )}
                                            </Select>
                                        )}
                                    />

                                    <Controller
                                        control={control}
                                        name="session_time"
                                        rules={{ required: "وقت المحاضرة" }}
                                        render={({ field }) => (
                                            <Select
                                                label="اختار وقت المحاضرة"
                                                placeholder="اختار"
                                                items={timeOptions}
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                isDisabled={!selectedDay || timeOptions.length === 0}
                                                isInvalid={!!errors.session_time?.message}
                                                errorMessage={errors.session_time?.message}
                                                labelPlacement="outside"
                                                classNames={{
                                                    label: "text-[#272727] font-bold text-sm",
                                                    trigger: "shadow-none",
                                                    base: "mb-4",
                                                }}
                                            >
                                                {(item: any) => (
                                                    <SelectItem key={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                )}
                                            </Select>
                                        )}
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
