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
    User
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useParams } from 'next/navigation';

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    refetchSubscriptions: () => void;
}

export default function ChangeTeacherModal({
    isOpen,
    onClose,
    student,
    refetchSubscriptions
}: StudentModalProps) {
    const params = useParams();
    const user_id = params.id;

    const users: any = [];

    if (student?.main_user) {
        users.push({
            ...student.main_user,
            isMain: true,
        });
    }

    if (Array.isArray(student?.children_users)) {
        users.push(
            ...student.children_users.map((child: any) => ({
                ...child,
                isMain: false,
            }))
        );
    }

    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");
    const [selectedStudent, setSelectedStudent] = useState("all");
    const [step, setStep] = useState(1);
    const [selectedReasons, setSelectedReasons] = useState<number[]>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["GetReasons"],
        queryFn: async () => await fetchClient(`client/reason/change/instructor`, axios_config),
    });

    const [sessionsDates, setSessionsDates] = useState<any[]>([]);
    const [availabilities, setAvailabilities] = useState<any>(null);

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
        if (student?.program_id && student?.main_user?.user_id) {
            fetchSessionsDates.mutate({
                program_id: student.program_id,
                user_id: student.main_user.user_id,
            });
        }
    }, [student]);

    useEffect(() => {
        if (sessionsDates.length > 0 && student?.program_id) {
            fetchAvailabilities.mutate({
                program_id: student.program_id,
                appointments: sessionsDates,
            });
        }
    }, [sessionsDates, student]);

    const ChangeInstructor = useMutation({
        mutationFn: (payload: any) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            myHeaders.append("Content-Type", "application/json");

            return postData(
                "client/change/instructor",
                JSON.stringify(payload),
                myHeaders
            );
        },
        onSuccess: (data) => {
            addToast({
                title: data?.message || "تم تغيير المعلم بنجاح",
                color: "success",
            });
            onClose();
            refetchSubscriptions()
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
                            ? "تغيير معلم"
                            : step === 2
                                ? "برجاء إختيار سبب لتغير المعلم"
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
                                            <label className="text-[#272727] font-bold text-sm">
                                                اختر الطالب
                                            </label>

                                            {users.map((user: any) => (
                                                <Button
                                                    key={user.user_id}
                                                    id={user.user_id}
                                                    variant="flat"
                                                    color={
                                                        selectedStudent === String(user.user_id)
                                                            ? "primary"
                                                            : undefined
                                                    }
                                                    className={`font-semibold border flex justify-start p-8 ${selectedStudent === String(user.user_id)
                                                            ? "border-primary"
                                                            : "border-gray-300"
                                                        }`}
                                                    onPress={(e) => setSelectedStudent(e.target.id)}
                                                >
                                                    <User
                                                        avatarProps={{
                                                            radius: "full",
                                                            src: user.image,
                                                            size: "md",
                                                        }}
                                                        description={
                                                            <span className="text-sm font-bold text-[#3D5066]">
                                                                عام {user.age}
                                                            </span>
                                                        }
                                                        name={
                                                            <span className="text-start font-bold">
                                                                {user.name}
                                                            </span>
                                                        }
                                                    />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
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

                                {/* STEP 3 */}
                                {step === 3 && (
                                    <div className="grid grid-cols-1 gap-4 p-4">
                                        <div className="grid grid-cols-3 gap-3">

                                            {availabilities?.data?.length > 0 ? (
                                                availabilities.data.map((instructor: any) => (
                                                    <Button
                                                        key={instructor.id}
                                                        id={String(instructor.id)}
                                                        variant="flat"
                                                        color={
                                                            selectedInstructor === String(instructor.id)
                                                                ? "primary"
                                                                : undefined
                                                        }
                                                        className={`h-[170px] font-semibold border flex flex-col justify-center items-center ${selectedInstructor === String(instructor.id)
                                                                ? "border-primary"
                                                                : "border-gray-300"
                                                            }`}
                                                        onPress={(e) =>
                                                            setSelectedInstructor(e.target.id)
                                                        }
                                                    >
                                                        <Avatar src={instructor.image}
                                                            size="lg"
                                                            radius="md"
                                                            alt={instructor.name_ar} />

                                                        <span className="text-start font-bold">
                                                            {instructor.name_ar}
                                                        </span>
                                                    </Button>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">
                                                    لا يوجد معلمين متاحين
                                                </span>
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
                                        isDisabled={selectedStudent === "all"}
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
                                        onPress={() => setStep(3)}
                                        isDisabled={selectedReasons.length === 0}
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
                                        isDisabled={
                                            ChangeInstructor?.isPending ||
                                            !selectedInstructor
                                        }
                                        onPress={() => {
                                            ChangeInstructor.mutate({
                                                reason_to_change_instructor_ids: selectedReasons,
                                                instructor_id: Number(selectedInstructor),
                                                program_id: student.program_id,
                                                old_instructor_id: student?.instructor?.id,
                                                user_id: Number(selectedStudent),
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
