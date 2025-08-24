import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Tabs,
  Tab,
  Input,
  Avatar,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import AddStudentModal from "../../AddStudentModal";
import { Add } from "iconsax-reactjs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";

const weekDays = [
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الاثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
  { key: "saturday", label: "السبت" },
];

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  program_id: number;
  refetchSubaccounts?: () => void;
  refetchTeachers?: () => void;
}

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
  program_content_id: string;
};

export default function AddSubaccountModal({
  isOpen,
  onClose,
  data: programData,
  program_id,
  refetchSubaccounts,
  refetchTeachers,
}: StudentModalProps) {
  const [scrollBehavior, setScrollBehavior] = useState<
    "inside" | "normal" | "outside"
  >("inside");
  const [modalOpen, setModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [tabKey, setTabKey] = useState("fixed");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const handleRowClick = () => {
    setModalOpen(true);
  };

  const handleRadioChange = (childId: number) => {
    setSelectedChildId(childId);
  };

  const { data: childerns, isLoading: loadingchilderns } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/user/show/${user_id}?program_id=${program_id}`, axios_config),
    queryKey: ["GetChilderns"],
  });

  const { data: subscriptionDetails, isLoading: isSubscriptionDetailsLoading } =
    useQuery({
      queryKey: ["GetsubscriptionDetails", programData, program_id],
      queryFn: async () =>
        await fetchClient(
          `client/subscription/details?program_id=${program_id}&user_id=${programData.data.id}`,
          axios_config
        ),
    });

  const { data: programContent, isLoading: loadingProgramContent } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/program/contents/${program_id}`, axios_config),
    queryKey: ["GetProgramContent"],
  });

  const params = useParams();
  const user_id = params.id;
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(
    null
  );
  const [availableInstructors, setAvailableInstructors] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);

  const AddWeeklyAppointment = useMutation({
    mutationFn: async () => {
      const headers = new Headers();
      headers.append("local", "ar");
      headers.append("Accept", "application/json");
      headers.append("Authorization", `Bearer ${getCookie("token")}`);

      const formData = new FormData();
      formData.append("user_id", String(selectedChildId));
      formData.append("start_date", String(watch("start_date")));
      formData.append("duration", String(subscriptionDetails?.data?.duration));
      formData.append(
        "subscripe_days",
        String(subscriptionDetails?.data?.subscripe_days)
      );
      formData.append(
        "number_of_sessions",
        String(subscriptionDetails?.data?.number_of_sessions)
      );

      const fixedSessions = getValues("fixed_sessions") || [];
      fixedSessions.forEach((session: { weekday: string; time: string }) => {
        if (session?.weekday && session?.time) {
          formData.append(`appointments[${session.weekday}]`, session.time);
        }
      });

      const response = await postData(
        "client/add/weekly/appointments",
        formData,
        headers
      );

      if (response?.message === "success" && Array.isArray(response?.data)) {
        const availabilitiesPayload = {
          program_id: program_id,
          appointments: response.data,
        };

        setAppointmentsList(response.data);
        const formData = new FormData();
        formData.append("program_id", String(availabilitiesPayload.program_id));
        availabilitiesPayload.appointments.forEach(
          (appointment: any, index: number) => {
            formData.append(`appointments[${index}][start]`, appointment.start);
            formData.append(`appointments[${index}][end]`, appointment.end);
          }
        );

        const formHeaders = new Headers();
        formHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
        formHeaders.append("local", "ar");

        const availabilitiesResponse = await postData(
          "client/get/program/availabilities-instructors",
          formData,
          formHeaders
        );
        if (
          availabilitiesResponse?.message === "success" &&
          Array.isArray(availabilitiesResponse?.data)
        ) {
          setAvailableInstructors(availabilitiesResponse.data);
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
          title: "error",
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

  const handleSaveSession = async () => {
    if (!selectedInstructor) return;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${getCookie("token")}`);
    headers.append("local", "ar");

    const formData = new FormData();
    formData.append("program_id", String(program_id));
    formData.append("instructor_id", String(selectedInstructor));
    formData.append("user_id", String(selectedChildId));
    formData.append("parent_id", String(user_id));
    formData.append("duration", String(subscriptionDetails?.data?.duration));
    formData.append(
      "program_content_id",
      String(getValues("program_content_id"))
    );

    appointmentsList.forEach((appointment: any, index: number) => {
      formData.append(`appointments[${index}][start]`, appointment.start);
      formData.append(`appointments[${index}][end]`, appointment.end);
    });

    try {
      const response = await postData(
        "client/create/meeting/session",
        formData,
        headers
      );

      if (response?.message === "success") {
        addToast({
          title: response.message,
          color: "success",
        });
        onClose();
        refetchSubaccounts?.();
        refetchTeachers?.();
        queryClient.invalidateQueries({ queryKey: ["GetChilderns"] });
      } else {
        addToast({
          title: response.message,
          color: "danger",
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "حدث خطأ أثناء حفظ الجلسات",
        color: "danger",
      });
    }
  };

  const GetAppointments = () => {
    AddWeeklyAppointment.mutate();
    setStep(3);
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={scrollBehavior}
      onOpenChange={(open) => !open && onClose()}
      size="4xl"
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              أضافة حساب فرعي
            </ModalHeader>

            <ModalBody>
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="bg-main p-5 border border-stroke rounded-lg">
                    <AddStudentModal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      student={studentDetails}
                    />

                    <div className="flex justify-end mb-5">
                      <Button
                        onPress={handleRowClick}
                        variant="flat"
                        className="text-primary font-bold bg-white"
                      >
                        <Add />
                        إضافة طالب جديد
                      </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                       {childerns.data.show=== "true" && <div
                            className="bg-background rounded-lg flex items-center justify-between p-4"
                          >
                            {/* Radio Button */}
                            <div className="flex items-center gap-3 w-1/12">
                              <input
                                type="radio"
                                name="selectedChild"
                                checked={selectedChildId === childerns.data.id}
                                onChange={() => handleRadioChange(childerns.data.id)}
                                className="w-4 h-4 accent-primary"
                              />
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-2 w-5/12">
                              <span className="text-sm font-bold text-title">
                                الإسم
                              </span>
                              <div className="flex items-center gap-2">
                                <Avatar size="sm" src={childerns.data.image} />
                                <span className="text-black-text font-bold text-[15px]">
                                  {childerns.data.first_name + " " + childerns.data.last_name}
                                </span>
                              </div>
                            </div>

                            {/* Age */}
                            <div className="flex flex-col gap-2 w-5/12">
                              <span className="text-sm font-bold text-title">
                                السن
                              </span>
                              <span className="font-bold text-black-text">
                                {childerns.data.age} عام
                              </span>
                            </div>
                          </div>}
                      {childerns.data?.childrens?.map(
                        (child: any, index: number) => (
                          <div
                            key={index}
                            className="bg-background rounded-lg flex items-center justify-between p-4"
                          >
                            {/* Radio Button */}
                            <div className="flex items-center gap-3 w-1/12">
                              <input
                                type="radio"
                                name="selectedChild"
                                checked={selectedChildId === child.id}
                                onChange={() => handleRadioChange(child.id)}
                                className="w-4 h-4 accent-primary"
                              />
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-2 w-5/12">
                              <span className="text-sm font-bold text-title">
                                الإسم
                              </span>
                              <div className="flex items-center gap-2">
                                <Avatar size="sm" src={child.image} />
                                <span className="text-black-text font-bold text-[15px]">
                                  {child.first_name + " " + child.last_name}
                                </span>
                              </div>
                            </div>

                            {/* Age */}
                            <div className="flex flex-col gap-2 w-5/12">
                              <span className="text-sm font-bold text-title">
                                السن
                              </span>
                              <span className="font-bold text-black-text">
                                {child.age} عام
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 py-4">
                    <Button
                      type="button"
                      onPress={onClose}
                      variant="solid"
                      color="primary"
                      className="text-white"
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="button"
                      onPress={() => setStep(2)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                      isDisabled={selectedChildId === null}
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
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
                    <Tab
                      key="fixed"
                      title="مواعيد ثابتة"
                      className="w-full p-5"
                    >
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
                        defaultValue={
                          new Date().toISOString().split("T")[0]
                        }
                         min={new Date().toISOString().split("T")[0]}
                      />

                      {(subscriptionDetails?.data?.number_of_session_per_week
                        ? Array.from({
                            length: Number(
                              subscriptionDetails.data
                                .number_of_session_per_week
                            ),
                          })
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
                                onSelectionChange={(keys) =>
                                  field.onChange(Array.from(keys)[0])
                                }
                                label="اليوم"
                                labelPlacement="outside"
                                placeholder="اختر اليوم"
                                isInvalid={
                                  !!errors?.fixed_sessions?.[index]?.weekday
                                }
                                errorMessage={
                                  errors?.fixed_sessions?.[index]?.weekday
                                    ?.message
                                }
                                classNames={{
                                  label: "text-[#272727] font-bold text-sm",
                                  base: "mb-4",
                                  value: "text-[#87878C] text-sm",
                                }}
                              >
                                {weekDays.map((day) => (
                                  <SelectItem key={day.key}>
                                    {day.label}
                                  </SelectItem>
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
                            errorMessage={
                              errors?.fixed_sessions?.[index]?.time?.message
                            }
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

                    <Tab
                      key="flexible"
                      title="مواعيد مرنة"
                      className="w-full p-5"
                    >
                      {(subscriptionDetails?.data?.number_of_sessions
                        ? Array.from({
                            length: Number(
                              subscriptionDetails.data.number_of_sessions
                            ),
                          })
                        : []
                      ).map((_, index) => (
                        <div key={index} className="flex gap-4 mt-4">
                          <Input
                            label="الموعد"
                            placeholder="نص الكتابه"
                            type="date"
                            {...register(`flexible_sessions.${index}.date`)}
                            isInvalid={
                              !!errors?.flexible_sessions?.[index]?.date
                            }
                            errorMessage={
                              errors?.flexible_sessions?.[index]?.date?.message
                            }
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
                            isInvalid={
                              !!errors?.flexible_sessions?.[index]?.time
                            }
                            errorMessage={
                              errors?.flexible_sessions?.[index]?.time?.message
                            }
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

                  <div className="flex justify-end gap-4 py-4">
                    <Button
                      type="button"
                      onPress={() => setStep(1)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                    >
                      رجوع
                    </Button>
                    <Button
                      type="button"
                      onPress={() => GetAppointments()}
                      variant="solid"
                      color="primary"
                      className="text-white"
                      isDisabled={selectedChildId === null}
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <form onSubmit={handleSubmit(handleSaveSession)}>
                  <div className="grid grid-cols-1 gap-4 p-5">
                    <div className="grid grid-cols-3 gap-3">
                      {AddWeeklyAppointment.isPending ? (
                        <div className="flex gap-4">
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="h-[170px] w-[140px] border border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 gap-3"
                            >
                              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                          ))}
                        </div>
                      ) : availableInstructors.length > 0 ? (
                        availableInstructors.map((instructor: any) => (
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

                  <Controller
                    name="program_content_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        selectedKeys={field.value ? [String(field.value)] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          field.onChange(selectedKey);
                        }}
                        label="المحتوي"
                        labelPlacement="outside"
                        placeholder="اختر المحتوي"
                        isLoading={loadingProgramContent}
                        classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          base: "mb-4",
                          value: "text-[#87878C] text-sm",
                        }}
                      >
                        {programContent?.data?.map((specialization: any) => (
                          <SelectItem key={specialization.id}>
                            {specialization.title}
                          </SelectItem>
                        )) ?? []}
                      </Select>
                    )}
                  />

                  <div className="flex justify-end gap-4 py-4">
                    <Button
                      type="button"
                      onPress={() => setStep(2)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                    >
                      رجوع
                    </Button>

                    <Button
                      type="submit"
                      variant="solid"
                      color="primary"
                      className="text-white"
                      isDisabled={!selectedInstructor || !selectedChildId}
                    >
                      حفظ
                    </Button>
                  </div>
                </form>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
