import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    addToast,
    Avatar,
    Spinner,
    User,
    Tabs,
    Tab,
    Input,
    Select,
    SelectItem
} from "@heroui/react";
import { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useParams } from 'next/navigation';
import { Controller, useForm } from "react-hook-form";

const weekDays = [
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الاثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
  { key: "saturday", label: "السبت" },
];

type FormData = {
  start_date: string;
  fixed_sessions: {
    weekday: string;
    time: string;
  }[];
  flexible_sessions: {
    date: string;
    time: string;
  }[];
};

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    teachersAndStudens: any;
    handleManualRefetch: any;
}

export default function ChangeTeacherModal({
    isOpen,
    onClose,
    teachersAndStudens,
    handleManualRefetch,
}: StudentModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        getValues,
        formState: { errors },
    } = useForm<FormData>();

    const params = useParams();
    const user_id = params.id;

    const users: any = [];

    const [scheduleChoice, setScheduleChoice] = useState<"same" | "new" | null>(null);
    const [skippedScheduleStep, setSkippedScheduleStep] = useState(false);

    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");
    const [step, setStep] = useState(1);
    const [selectedReasons, setSelectedReasons] = useState<number[]>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
    const [tabKey, setTabKey] = useState("fixed");
    const queryClient = new QueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["GetReasons"],
        queryFn: async () => await fetchClient(`client/reason/change/instructor`, axios_config),
    });

    const { data: subscriptionDetails, isLoading: isSubscriptionDetailsLoading } = useQuery({
        queryKey: ["GetsubscriptionDetails", teachersAndStudens, teachersAndStudens?.program_id],
        queryFn: async () => await fetchClient(`client/subscription/details?program_id=${teachersAndStudens?.program_id}&user_id=${user_id}&selected_user_id=${teachersAndStudens?.user.id}`, axios_config),
    });

    const [sessionsDates, setSessionsDates] = useState<any[]>([]);
    const [availabilities, setAvailabilities] = useState<any>(null);
    const [appointmentsList, setAppointmentsList] = useState([]);

    const fetchSessionsDates = useMutation({
        mutationFn: (submitData: { program_id: any; user_id: any }) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            var formdata = new FormData();
            formdata.append("program_id", submitData.program_id);
            formdata.append("user_id", submitData.user_id);

            return postData(
                "client/program/sessions/date",
                formdata,
                myHeaders
            );
        },
        onSuccess: (data) => {
            if (data?.data) {
                setSessionsDates(data.data);
            }
        },
    });

    const fetchAvailabilities = useMutation({
        mutationFn: (payload: { program_id: any; appointments: any[] }) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            myHeaders.append("Content-Type", "application/json");

            return postData(
                "client/get/program/availabilities-instructors",
                JSON.stringify(payload),
                myHeaders
            );
        },
        onSuccess: (data) => {
            setAvailabilities(data);
        },
        onError: (error) => {
            console.error("Error fetching availabilities", error);
        },
    });

    useEffect(() => {
        if (teachersAndStudens?.program_id && teachersAndStudens?.user?.id) {
            fetchSessionsDates.mutate({
                program_id: teachersAndStudens.program_id,
                user_id: teachersAndStudens.user.id,
            });
        }
    }, [teachersAndStudens?.program_id, teachersAndStudens?.user?.id]);

    useEffect(() => {
        if (
            Array.isArray(sessionsDates) &&
            sessionsDates.length > 0 &&
            teachersAndStudens?.program_id
        ) {
            fetchAvailabilities.mutate({
                program_id: teachersAndStudens.program_id,
                appointments: sessionsDates,
            });
        }
    }, [sessionsDates, teachersAndStudens?.program_id]);

    const AddWeeklyAppointment = useMutation({
        mutationFn: async () => {
            const headers = new Headers();
            headers.append("local", "ar");
            headers.append("Accept", "application/json");
            headers.append("Authorization", `Bearer ${getCookie("token")}`);

            const formData = new FormData();
            formData.append("user_id", String(teachersAndStudens.user.id));
            formData.append("start_date", String(watch("start_date")));
            formData.append("duration", String(subscriptionDetails?.data?.duration));
            formData.append("subscripe_days", String(subscriptionDetails?.data?.subscripe_days));
            formData.append("number_of_sessions", String(subscriptionDetails?.data?.number_of_sessions));

            const fixedSessions = getValues("fixed_sessions") || [];
            fixedSessions.forEach((session: { weekday: string; time: string }) => {
                if (session?.weekday && session?.time) {
                    formData.append(`appointments[${session.weekday}]`, session.time);
                }
            });

            const response = await postData("client/add/weekly/appointments", formData, headers);

            if (response?.message === "success" && Array.isArray(response?.data)) {
                const availabilitiesPayload = {
                    program_id: teachersAndStudens.program_id,
                    appointments: response.data,
                };

                setAppointmentsList(response.data);
                const formData = new FormData();
                formData.append("program_id", String(availabilitiesPayload.program_id));
                availabilitiesPayload.appointments.forEach((appointment: any, index: number) => {
                    formData.append(`appointments[${index}][start]`, appointment.start);
                    formData.append(`appointments[${index}][end]`, appointment.end);
                });

                const formHeaders = new Headers();
                formHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
                formHeaders.append("local", "ar");

                const availabilitiesResponse = await postData(
                    "client/get/program/availabilities-instructors",
                    formData,
                    formHeaders
                );
                if (availabilitiesResponse?.message === "success" && Array.isArray(availabilitiesResponse?.data)) {
                    setAvailabilities(availabilitiesResponse);
                }

            }

            return response;
        },
        onSuccess: (data) => {
            console.log("Data:", data);

            if (data?.status === 201) {
                addToast({
                    title: data?.message,
                    color: "success",
                });
            } else {
                addToast({
                    title: data?.message.appointments[0],
                    color: "warning",
                });
            }
        },
        onError: (error) => {
            console.error("Error:", error);
            addToast({
                title: "عذراً، حدث خطأ ما",
                color: "danger",
            });
        },
    });

    const GetAppointments = () => {
        AddWeeklyAppointment.mutate()
        setStep(4)
    }

    const ChangeInstructor = useMutation({
        mutationFn: (payload: any) => {
            const myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            myHeaders.append("Content-Type", "application/json");

            const endpoint =
                scheduleChoice === "new"
                    ? "client/change/instructor/with/new/dates"
                    : "client/change/instructor";

            return postData(endpoint, JSON.stringify(payload), myHeaders);
        },
        onSuccess: (data) => {
            addToast({
                title: data?.message || "تم تغيير المعلم بنجاح",
                color: "success",
            });
            onClose();
            handleManualRefetch();
        },
        onError: (error) => {
            console.error("Error changing instructor", error);
            addToast({
                title: "حدث خطأ أثناء تغيير المعلم",
                color: "danger",
            });
        },
    });

    const handleReasonToggle = (id: number) => {
        setSelectedReasons((prev) =>
            prev.includes(id)
                ? prev.filter((r) => r !== id)
                : [...prev, id]
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            scrollBehavior={scrollBehavior}
            onOpenChange={(open) => !open && onClose()}
            size="3xl"
        >
            <ModalContent>
                {(closeModal) => {
                    const modalTitle =
                        step === 1
                            ? "برجاء إختيار سبب لتغير المعلم"
                            : step === 2
                                ? "اختر نوع المواعيد"
                                : step === 3
                                    ? "اختر المواعيد المناسبة"
                                    : "برجاء إختيار المعلم الجديد";



                    const cancelButtonLabel = step === 1 ? "إلغاء" : "رجوع";

                    return (
                        <>
                            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                                {modalTitle}
                            </ModalHeader>

                            <ModalBody className="min-h-[300px]">

                                {/* STEP 1 */}
                                {step === 1 && (
                                    <div className="grid grid-cols-1 gap-4 p-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {data?.data?.length > 0 ? (
                                                data.data.map((reason: any) => (
                                                    <div
                                                        key={reason.id}
                                                        className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors duration-200 ${selectedReasons.includes(reason.id)
                                                            ? "bg-primary/10 text-primary"
                                                            : "bg-gray-100 text-[#272727]"
                                                            }`}
                                                        onClick={() => handleReasonToggle(reason.id)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedReasons.includes(reason.id)}
                                                            readOnly
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                        <span className="font-bold">{reason.title}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">
                                                    لا توجد أسباب متاحة
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="p-4 flex flex-col gap-4">
                                        <div
                                            className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors duration-200 ${scheduleChoice === "same"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-gray-100 text-[#272727]"
                                                }`}
                                            onClick={() => setScheduleChoice("same")}
                                        >
                                            <input
                                                type="radio"
                                                name="session_choice"
                                                checked={scheduleChoice === "same"}
                                                readOnly
                                                className="accent-primary w-4 h-4"
                                            />
                                            <span className="font-bold">اختيار محاضر بنفس المواعيد القديمة</span>
                                        </div>

                                        <div
                                            className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors duration-200 ${scheduleChoice === "new"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-gray-100 text-[#272727]"
                                                }`}
                                            onClick={() => setScheduleChoice("new")}
                                        >
                                            <input
                                                type="radio"
                                                name="session_choice"
                                                checked={scheduleChoice === "new"}
                                                readOnly
                                                className="accent-primary w-4 h-4"
                                            />
                                            <span className="font-bold">اختيار مواعيد جديدة</span>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <>
                                        <Tabs
                                            selectedKey={tabKey}
                                            onSelectionChange={(key) => setTabKey(key as string)}
                                            aria-label="sub-tabs"
                                            classNames={{
                                                cursor: "bg-primary",
                                                tabContent:
                                                    "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
                                                tabList: "bg-[#EAF0FD] w-full",
                                            }}
                                        >
                                            <Tab key="fixed" title="مواعيد ثابتة" className="w-full p-5">
                                                <Input
                                                    label="تاريخ البدء"
                                                    placeholder="نص الكتابه"
                                                    type="date"
                                                    labelPlacement="outside"
                                                    classNames={{
                                                        label: "text-[#272727] font-bold text-sm",
                                                        inputWrapper: "shadow-none",
                                                        base: "mb-4",
                                                    }}
                                                    {...register("start_date")}
                                                    defaultValue={subscriptionDetails?.data?.start_date?.split("T")[0]}
                                                />

                                                {(subscriptionDetails?.data?.number_of_session_per_week
                                                    ? Array.from({ length: Number(subscriptionDetails.data.number_of_session_per_week) })
                                                    : []
                                                ).map((_, index) => (
                                                    <div key={index} className="flex gap-4 mt-4">
                                                        {/* Day select */}
                                                        <Controller
                                                            name={`fixed_sessions.${index}.weekday`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    selectedKeys={field.value ? [field.value] : []}
                                                                    onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                                                                    label="اليوم"
                                                                    labelPlacement="outside"
                                                                    placeholder="اختر اليوم"
                                                                    isInvalid={!!errors?.fixed_sessions?.[index]?.weekday}
                                                                    errorMessage={errors?.fixed_sessions?.[index]?.weekday?.message}
                                                                    classNames={{
                                                                        label: "text-[#272727] font-bold text-sm",
                                                                        base: "mb-4",
                                                                        value: "text-[#87878C] text-sm",
                                                                    }}
                                                                >
                                                                    {weekDays.map((day) => (
                                                                        <SelectItem key={day.key}>{day.label}</SelectItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />

                                                        {/* Time input */}
                                                        <Input
                                                            label="الوقت"
                                                            placeholder="نص الكتابه"
                                                            type="time"
                                                            {...register(`fixed_sessions.${index}.time`)}
                                                            isInvalid={!!errors?.fixed_sessions?.[index]?.time}
                                                            errorMessage={errors?.fixed_sessions?.[index]?.time?.message}
                                                            labelPlacement="outside"
                                                            classNames={{
                                                                label: "text-[#272727] font-bold text-sm",
                                                                inputWrapper: "shadow-none",
                                                                base: "mb-4",
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </Tab>


                                            <Tab key="flexible" title="مواعيد مرنة" className="w-full p-5">
                                                {(subscriptionDetails?.data?.number_of_sessions
                                                    ? Array.from({ length: Number(subscriptionDetails.data.number_of_sessions) })
                                                    : []
                                                ).map((_, index) => (
                                                    <div key={index} className="flex gap-4 mt-4">
                                                        <Input
                                                            label="الموعد"
                                                            placeholder="نص الكتابه"
                                                            type="date"
                                                            {...register(`flexible_sessions.${index}.date`)}
                                                            isInvalid={!!errors?.flexible_sessions?.[index]?.date}
                                                            errorMessage={errors?.flexible_sessions?.[index]?.date?.message}
                                                            labelPlacement="outside"
                                                            classNames={{
                                                                label: "text-[#272727] font-bold text-sm",
                                                                inputWrapper: "shadow-none",
                                                                base: "mb-4",
                                                            }}
                                                        />
                                                        <Input
                                                            label="الوقت"
                                                            placeholder="نص الكتابه"
                                                            type="time"
                                                            {...register(`flexible_sessions.${index}.time`)}
                                                            isInvalid={!!errors?.flexible_sessions?.[index]?.time}
                                                            errorMessage={errors?.flexible_sessions?.[index]?.time?.message}
                                                            labelPlacement="outside"
                                                            classNames={{
                                                                label: "text-[#272727] font-bold text-sm",
                                                                inputWrapper: "shadow-none",
                                                                base: "mb-4",
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </Tab>

                                        </Tabs>
                                    </>
                                )}

                                {/* STEP 4 */}
                                {step === 4 && (
                                    <div className="grid grid-cols-1 gap-4 p-4">
                                        <div className="grid grid-cols-3 gap-3">
                                            {AddWeeklyAppointment.isPending ? (
                                                <div className="col-span-3 flex justify-center items-center h-[170px]">
                                                    <Spinner color="primary" size="lg" />
                                                </div>
                                            ) : availabilities?.data?.length > 0 ? (
                                                availabilities.data.map((instructor: any) => (
                                                    <Button
                                                        key={instructor.id}
                                                        id={String(instructor.id)}
                                                        variant="flat"
                                                        color={
                                                            selectedInstructor === String(instructor.id) ? "primary" : undefined
                                                        }
                                                        className={`h-[170px] font-semibold border flex flex-col justify-center items-center ${selectedInstructor === String(instructor.id)
                                                                ? "border-primary"
                                                                : "border-gray-300"
                                                            }`}
                                                        onPress={(e) => setSelectedInstructor(e.target.id)}
                                                    >
                                                        <Avatar
                                                            src={instructor.image}
                                                            size="lg"
                                                            radius="md"
                                                            alt={instructor.name_ar}
                                                        />
                                                        <span className="text-start font-bold">{instructor.name_ar}</span>
                                                    </Button>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">لا يوجد معلمين متاحين</span>
                                            )}
                                        </div>

                                    </div>
                                )}
                            </ModalBody>

                            <ModalFooter className="flex justify-center gap-4">
                                <Button
                                    type="button"
                                    onPress={() => {
                                        if (step === 1) {
                                            onClose();
                                        } else if (step === 4 && skippedScheduleStep) {
                                            setStep(2);
                                            setSkippedScheduleStep(false);
                                        } else {
                                            setStep((prev) => prev - 1);
                                        }
}}
                                    variant="solid"
                                    color="primary"
                                    className="text-white"
                                >
                                    {cancelButtonLabel}
                                </Button>


                                {step === 1 && (
                                    <Button
                                        type="button"
                                        variant="solid"
                                        color="primary"
                                        className="text-white"
                                        onPress={() => setStep(2)}
                                        isDisabled={selectedReasons.length === 0}
                                    >
                                        التالي
                                    </Button>
                                )}

                                {step === 2 && (
                                    <Button
                                        type="button"
                                        variant="solid"
                                        color="primary"
                                        className="text-white"
                                        onPress={() => {
                                            if (scheduleChoice === "same") {
                                                setSkippedScheduleStep(true)
                                                setStep(4);
                                            } else if (scheduleChoice === "new") {
                                                setStep(3);
                                            }
                                        }}
                                        isDisabled={!scheduleChoice}
                                    >
                                        التالي
                                    </Button>
                                )}
                                {step === 3 && (
                                    <Button
                                        type="button"
                                        variant="solid"
                                        color="primary"
                                        className="text-white"
                                        onPress={() => GetAppointments()}
                                        isDisabled={selectedReasons.length === 0}
                                    >
                                        التالي
                                    </Button>
                                )}

                                {step === 4 && (
                                    <Button
                                        type="button"
                                        variant="solid"
                                        color="primary"
                                        className="text-white"
                                        isDisabled={
                                            ChangeInstructor?.isPending ||
                                            !selectedInstructor
                                        }
                                        onPress={() => {
                                            ChangeInstructor.mutate({
                                                reason_to_change_instructor_ids: selectedReasons,
                                                instructor_id: Number(selectedInstructor),
                                                program_id: teachersAndStudens.program_id,
                                                old_instructor_id: teachersAndStudens?.instructor?.id,
                                                user_id: teachersAndStudens?.user?.id,
                                                sessions: sessionsDates,
                                            });
                                        }}
                                    >
                                        {ChangeInstructor?.isPending && (
                                            <Spinner color="white" size="sm" />
                                        )}
                                        تأكيد
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}
