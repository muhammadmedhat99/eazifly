"use client";
import { Add, Edit2, Trash } from "iconsax-reactjs";
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
  Tabs,
  Tab,
  Spinner,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { CustomPagination } from "@/components/global/Pagination";
import { AllQueryKeys } from "@/keys";
import { useParams, useRouter } from "next/navigation";
import { Options } from "@/components/global/Icons";

const OptionsComponent = ({ id }: { id: number }) => {
  return (
    <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
      <DropdownTrigger>
        <button className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-100">
          <Options />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href={`/sessions/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const weekDays = [
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الاثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
  { key: "saturday", label: "السبت" },
];

type appointmentsProps = {
  appointmentData?: any;
  isLoadingappointment: boolean;
  expire_date: any;
  currentStudent : any;
  refetch: any;
  program_id: any;
  subscription: any;
  teachersData: any;
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

type FixedSession = { weekday: string; time: string };
type FlexibleSession = { date: string; time: string };

interface AppointmentForm {
  fixed_sessions: FixedSession[];
  flexible_sessions: FlexibleSession[];
}

export const Appointments = ({
  appointmentData,
  isLoadingappointment,
  expire_date,
  currentStudent,
  refetch,
  program_id,
  subscription,
  teachersData
}: appointmentsProps) => {
  const router = useRouter();
  const params = useParams();
  const user_id = params.id;
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCompensateModalOpen, setIsCompensateModalOpen] = useState(false);

  const [sessionsDates, setSessionsDates] = useState<any[]>([]);

  const [tabKey, setTabKey] = useState("fixed");

  const instructorId = teachersData?.data?.find(
    (t: any) => t.user.id === currentStudent.id
  )?.instructor?.id;

  const { data: AilabilitiesSessions, isLoading } = useQuery({
    enabled: !!selectedAppointment,
    queryKey: ["GetavAilabilitiesSessions"],
    queryFn: async () =>
      await fetchClient(
        `client/session/availabilities/time/${selectedAppointment.instructor_id}?duration=${selectedAppointment.duration}&expire_date=${expire_date}`,
        axios_config
      ),
  });

  type Slot = {
    start_time: string;
    end_time: string;
    full_date: string;
  };

  const dayOptions = useMemo(() => {
    if (!AilabilitiesSessions?.data) return [];
    return Object.entries(AilabilitiesSessions.data).map(
      ([day, slotsUnknown]) => {
        const slotArr = slotsUnknown as Slot[];
        return {
          label: `${day} - ${slotArr[0]?.full_date ?? ""}`,
          value: day,
        };
      }
    );
  }, [AilabilitiesSessions]);

  const timeOptions = useMemo(() => {
    if (!selectedDay) return [];
    const slots = (AilabilitiesSessions?.data?.[selectedDay] ?? []) as Slot[];
    return slots.map((slot) => ({
      label: `من ${slot.start_time} الي ${slot.end_time}`,
      value: JSON.stringify({
        start_time: slot.start_time,
        end_time: slot.end_time,
        full_date: slot.full_date,
      }),
    }));
  }, [AilabilitiesSessions, selectedDay]);

  const { data: cancelSessionsReasons } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/reason/cancel/session`, axios_config),
    queryKey: AllQueryKeys.GetAllSpecializations
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const {
  control: controlCompensate,
  handleSubmit: handleSubmitCompensate,
  formState: { errors: errorsCompensate },
} = useForm<any>();

  const {
    control: controlAppointments,
    handleSubmit: handleSubmitAppointments,
    watch: watchAppointments,
    reset: resetAppointments,
  } = useForm<AppointmentForm>({
    defaultValues: {
      fixed_sessions: [],
      flexible_sessions: [],
    },
  });

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

      return postData(
        `client/change/session/date/${selectedAppointment.id}`,
        formdata,
        myHeaders
      );
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        addToast({
          title: data?.message,
          color: "success",
        });
        reset();
        setIsModalOpen(false);
        refetch();
      } else if (data.status === 422) {
        const msg = data.message?.appointments?.[0];
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

  const onSubmit = useCallback(
    (data: FormData) => {
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
    },
    [ChangeAppointment]
  );

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsModalOpen(false);
      setSelectedAppointment(null);
    }
  }, []);

  const handleDayChange = useCallback(
    (keys: any, fieldOnChange: (value: any) => void) => {
      const selectedValue: any = Array.from(keys)[0];
      fieldOnChange(selectedValue);
      setSelectedDay(selectedValue);
      reset({
        session_date: selectedValue,
        session_time: "",
      });
    },
    [reset]
  );

  const CancelAppointment = useMutation({
    mutationFn: async (payload: { meeting_session_id: number; reason_to_cancel_session_ids: number[] }) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("meeting_session_id", payload.meeting_session_id.toString());
      payload.reason_to_cancel_session_ids.forEach((id) =>
        formdata.append("reason_to_cancel_session_ids[]", id.toString())
      );

      return postData(`client/cancel/session`, formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        addToast({
          title: data?.message,
          color: "success",
        });
        setIsCancelModalOpen(false);
        setSelectedReasons([]);
        refetch();
      } else {
        addToast({
          title: "عذرا حدث خطأ ما",
          color: "danger",
        });
      }
    },
    onError: () => {
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const { data: subscriptionDetails, isLoading: isSubscriptionDetailsLoading } = useQuery({
    queryKey: ["Getsubscription"],
    queryFn: async () =>
      await fetchClient(`client/subscription/details`, {
        ...axios_config,
        params: {
          program_id: program_id,
          user_id,
          selected_user_id: 10458,
        },
      }),
    enabled: !!program_id && !!currentStudent?.id,
  });

  const ChangeAppointments = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      const endpoint =
        tabKey === "fixed"
          ? "client/edit/program/sessions/with/weekly/appointments"
          : "client/edit/program/sessions/with/manual/appointments";

      return postData(endpoint, JSON.stringify(payload), myHeaders);
    },
    onSuccess: (data) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: data.message.appointments[0],
          color: "danger",
        });
      } else {
        addToast({
        title: data?.message || "تم تعديل المواعيد بنجاح",
        color: "success",
      });
      setModalOpen(false);
      refetch();
      }
    },
    onError: (error) => {
      console.error("Error changing appointments", error);
      addToast({
        title: "حدث خطأ أثناء تعديل المواعيد",
        color: "danger",
      });
    },
  });

  const [selectedCompensateDay, setSelectedCompensateDay] = useState<string | null>(null);
  const [compensateTimeOptions, setCompensateTimeOptions] = useState<any[]>([]);

  const handleCompensateDayChange = (keys: any, onChange: (val: any) => void) => {
    const day = Array.from(keys)[0] as string;
    setSelectedCompensateDay(day);
    onChange(day);

    if (CompensateAvailabilities?.data?.[day]) {
      const slots = CompensateAvailabilities.data[day] as Slot[];
      setCompensateTimeOptions(
        slots.map((slot) => ({
          label: `${slot.start_time} - ${slot.end_time}`,
          value: slot.start_time,
          start_time: slot.start_time,
          end_time: slot.end_time,
          full_date: slot.full_date,
        }))
      );
    } else {
      setCompensateTimeOptions([]);
    }
  };

  const { data: CompensateAvailabilities, isLoading: isLoadingCompensate } = useQuery({
    enabled: !!instructorId,
    queryKey: ["CompensateAvailabilities", instructorId],
    queryFn: async () =>
      await fetchClient(
        `client/cancel/session/availabilities/time/${instructorId}?expire_date=${expire_date}&subscription_id=${subscription.main_subscription_id}`,
        axios_config
      ),
  });

  const compensateDayOptions = useMemo(() => {
    if (!CompensateAvailabilities?.data) return [];
    return Object.entries(CompensateAvailabilities.data).map(
      ([day, slotsUnknown]) => {
        const slotArr = slotsUnknown as Slot[];
        return {
          label: `${day} - ${slotArr[0]?.full_date ?? ""}`,
          value: day,
        };
      }
    );
  }, [CompensateAvailabilities]);


  const onCompensateSubmit = (data: any) => {
    compensateMutation.mutate(data);
  };

  const compensateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { compensate_date, compensate_time } = data;
      const selectedSlot = compensateTimeOptions.find(
        (t: any) => t.value === compensate_time
      );

      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      const payload = {
        user_id: currentStudent?.id,
        instructor_id: instructorId,
        program_id: program_id,
        start_time: selectedSlot?.start_time,
        end_time: selectedSlot?.end_time,
        full_date: selectedSlot?.full_date,
      };

      return await postData("client/compensation/cancel/session", JSON.stringify(payload), myHeaders);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        addToast({
        title: "success",
        color: "success",
      });
      refetch()
      setIsCompensateModalOpen(false);
      } else {
        addToast({
          title: data.message,
          color: "danger",
        });
      }
    },
    onError: (error: any) => {
      addToast({
        title: "حدث خطأ",
        color: "danger",
        description: error?.message || "من فضلك حاول مرة أخرى",
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      
      {isLoadingappointment ? (
        <Loader />
      ) : appointmentData.data && appointmentData.data.length > 0 ? (
        appointmentData.data.map(
          (appointment: any, appointmentIndex: number) => (
            <div
              key={appointmentIndex}
              className="relative flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke overflow-x-auto gap-8"
            >
              <div className="flex items-center gap-20 whitespace-nowrap">
                <div className="flex flex-col gap-4 items-center">
                  <span className="text-[#5E5E5E] text-sm font-bold">تاريخ المحاضرة</span>
                  <span className="text-black-text font-bold text-[15px]">
                    {appointment.session_date}
                  </span>
                </div>

                <div className="flex flex-col gap-4 items-center">
                  <span className="text-[#5E5E5E] text-sm font-bold">اليوم</span>
                  <span className="text-black-text font-bold text-[15px]">
                    {new Date(appointment.session_date).toLocaleDateString("ar-EG", {
                      weekday: "long",
                    })}
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

              <div className="flex items-end gap-5">
                {appointment?.status?.key === "pending" && (
                  <div className="flex gap-6 items-center">
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

                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsCancelModalOpen(true);
                      }}
                      type="button"
                      className="flex items-center gap-1 text-sm font-bold text-danger"
                    >
                      <Trash size={18} />
                      إلغاء
                    </button>
                  </div>
                )}

                <div>
                  <Chip
                    size="sm"
                    className="capitalize px-4 min-w-24 text-center"
                    color={appointment?.status?.color === "info" ? "warning" : appointment?.status?.color}
                    variant="flat"
                  >
                    <span
                      className={`text-${appointment?.status?.color === "info" ? "warning" : appointment?.status?.color
                        } font-bold`}
                    >
                      {appointment?.status?.label}
                    </span>
                  </Chip>
                </div>

                <div className="hidden md:block">
                  <OptionsComponent id={appointment.id} />
                </div>

                <div className="block md:hidden absolute top-3 left-3">
                  <OptionsComponent id={appointment.id} />
                </div>
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-sm text-gray-500 text-center">
          لا توجد بيانات حالية للعرض
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={handleOpenChange}
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
                        onSelectionChange={(keys) =>
                          handleDayChange(keys, field.onChange)
                        }
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
                          <SelectItem key={item.value}>{item.label}</SelectItem>
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
                          <SelectItem key={item.value}>{item.label}</SelectItem>
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
      <Modal
        isOpen={isCancelModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCancelModalOpen(false);
            setSelectedAppointment(null);
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
            هل تريد إلغاء المحاضرة؟
          </ModalHeader>
          <ModalBody className="flex flex-col gap-4 items-center mb-3">
            <div className="flex gap-4 items-center w-full">
              <Button
                color="primary"
                variant="bordered"
                className="w-full text-primary font-bold"
                onPress={() => {
                  setIsCancelModalOpen(false);
                  setIsModalOpen(true);
                }}
              >
                تحديد ميعاد آخر
              </Button>

              <Button
                color="danger"
                variant="bordered"
                className="w-full text-danger font-bold"
                onPress={() => {
                  setIsCancelModalOpen(false);
                  setIsReasonModalOpen(true);
                }}
              >
                تأكيد الإلغاء
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isReasonModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsReasonModalOpen(false);
            setSelectedReasons([]);
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
            اختر سبب/أسباب الإلغاء
          </ModalHeader>
          <ModalBody className="flex flex-col gap-6 mb-3">
            <div className="flex flex-col gap-3">
              {cancelSessionsReasons?.data?.map((reason: any) => (
                <label key={reason.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={reason.id}
                    checked={selectedReasons.includes(reason.id)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (e.target.checked) {
                        setSelectedReasons((prev) => [...prev, value]);
                      } else {
                        setSelectedReasons((prev) =>
                          prev.filter((id) => id !== value)
                        );
                      }
                    }}
                  />
                  <span>{reason.title_ar}</span>
                </label>
              ))}
            </div>

            <Button
              color="danger"
              variant="bordered"
              className="w-full text-danger font-bold"
              isLoading={CancelAppointment.isPending}
              isDisabled={selectedReasons.length === 0}
              onPress={() => {
                if (selectedAppointment?.id) {
                  CancelAppointment.mutate({
                    meeting_session_id: selectedAppointment.id,
                    reason_to_cancel_session_ids: selectedReasons,
                  });
                }
              }}
            >
              تأكيد الإلغاء
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isCompensateModalOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={setIsCompensateModalOpen}
      >
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                إضافة ميعاد
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmitCompensate(onCompensateSubmit)}
                  className="grid grid-cols-1 gap-4 p-6"
                >
                  {/* اختيار اليوم */}
                  <Controller
                    control={controlCompensate}
                    name="compensate_date"
                    rules={{ required: "اختار يوم وتاريخ المحاضرة" }}
                    render={({ field }) => (
                      <Select
                        label="تاريخ المحاضرة"
                        placeholder="اختار"
                        items={compensateDayOptions}
                        value={field.value || ""}
                        onSelectionChange={(keys) =>
                          handleCompensateDayChange(keys, field.onChange)
                        }
                        isLoading={isLoadingCompensate}
                        isInvalid={!!errorsCompensate.compensate_date?.message}
                        labelPlacement="outside"
                        classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          trigger: "shadow-none",
                          base: "mb-4",
                        }}
                      >
                        {(item) => (
                          <SelectItem key={item.value}>{item.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  {/* اختيار الوقت */}
                  <Controller
                    control={controlCompensate}
                    name="compensate_time"
                    rules={{ required: "وقت المحاضرة" }}
                    render={({ field }) => (
                      <Select
                        label="اختار وقت المحاضرة"
                        placeholder="اختار"
                        items={compensateTimeOptions}
                        value={field.value || ""}
                        onChange={field.onChange}
                        isDisabled={!selectedCompensateDay || compensateTimeOptions.length === 0}
                        isInvalid={!!errorsCompensate.compensate_time?.message}
                        labelPlacement="outside"
                        classNames={{
                          label: "text-[#272727] font-bold text-sm",
                          trigger: "shadow-none",
                          base: "mb-4",
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item.value}>{item.label}</SelectItem>
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
                      isLoading={compensateMutation.isPending}
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

      {/* تغيير المواعيد */}
      <Modal
        scrollBehavior="inside"
        isOpen={modalOpen}
        onOpenChange={(open) => !open && setModalOpen(false)}
        size="3xl"
      >
        <ModalContent>
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              اختر المواعيد المناسبة
            </ModalHeader>

            <ModalBody className="min-h-[300px]">
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
                {/* ---------------- مواعيد ثابتة ---------------- */}
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
                    defaultValue={subscriptionDetails?.data?.start_date?.split("T")[0]}
                  />

                  {(subscriptionDetails?.data?.number_of_session_per_week
                    ? Array.from({
                      length: Number(subscriptionDetails.data.number_of_session_per_week),
                    })
                    : []
                  ).map((_, index) => (
                    <div key={index} className="flex gap-4 mt-4">
                      {/* اليوم */}
                      <Controller
                        name={`fixed_sessions.${index}.weekday`}
                        control={controlAppointments}
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
                            classNames={{
                              label: "text-[#272727] font-bold text-sm",
                              base: "mb-4",
                              value: "text-[#87878C] text-sm",
                            }}
                          >
                            {weekDays.map((day: any) => (
                              <SelectItem key={day.key}>{day.label}</SelectItem>
                            ))}
                          </Select>
                        )}
                      />

                      {/* الوقت */}
                      <Controller
                        name={`fixed_sessions.${index}.time`}
                        control={controlAppointments}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="الوقت"
                            type="time"
                            labelPlacement="outside"
                            classNames={{
                              label: "text-[#272727] font-bold text-sm",
                              inputWrapper: "shadow-none",
                              base: "mb-4",
                            }}
                          />
                        )}
                      />
                    </div>
                  ))}
                </Tab>

                {/* ---------------- مواعيد مرنة ---------------- */}
                <Tab key="flexible" title="مواعيد مرنة" className="w-full p-5">
                  {(subscriptionDetails?.data?.number_of_sessions
                    ? Array.from({
                      length: Number(subscriptionDetails.data.number_of_sessions),
                    })
                    : []
                  ).map((_, index) => (
                    <div key={index} className="flex gap-4 mt-4">
                      {/* التاريخ */}
                      <Controller
                        name={`flexible_sessions.${index}.date`}
                        control={controlAppointments}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="الموعد"
                            type="date"
                            labelPlacement="outside"
                            classNames={{
                              label: "text-[#272727] font-bold text-sm",
                              inputWrapper: "shadow-none",
                              base: "mb-4",
                            }}
                          />
                        )}
                      />

                      {/* الوقت */}
                      <Controller
                        name={`flexible_sessions.${index}.time`}
                        control={controlAppointments}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="الوقت"
                            type="time"
                            labelPlacement="outside"
                            classNames={{
                              label: "text-[#272727] font-bold text-sm",
                              inputWrapper: "shadow-none",
                              base: "mb-4",
                            }}
                          />
                        )}
                      />
                    </div>
                  ))}
                </Tab>
              </Tabs>
            </ModalBody>

            <ModalFooter className="flex justify-center gap-4">
              <Button
                type="button"
                onPress={() => setModalOpen(false)}
                variant="solid"
                color="primary"
                className="text-white"
              >
                إلغاء
              </Button>

              <Button
                type="button"
                variant="solid"
                color="primary"
                className="text-white"
                isLoading={ChangeAppointments?.isPending}
                isDisabled={ChangeAppointments?.isPending}
                onPress={() => {
                  handleSubmitAppointments(() => {
                    const fixedSessions = watchAppointments("fixed_sessions");
                    const flexibleSessions = watchAppointments("flexible_sessions");

                    if (tabKey === "fixed") {
                      const weeklyAppointments: Record<string, string> = {};
                      fixedSessions?.forEach((session) => {
                        if (session?.weekday && session?.time) {
                          weeklyAppointments[session.weekday] = session.time;
                        }
                      });

                      ChangeAppointments.mutate({
                        user_id: currentStudent.id,
                        duration: Number(subscriptionDetails?.data?.duration),
                        program_id,
                        appointments: weeklyAppointments,
                        instructor_id: instructorId,
                      });
                    } else {
                      const manualAppointments =
                        flexibleSessions
                          ?.filter((s) => s.date && s.time)
                          .map((s) => ({
                            date: s.date,
                            time: s.time,
                          })) || [];

                      ChangeAppointments.mutate({
                        user_id: currentStudent.id,
                        duration: Number(subscriptionDetails?.data?.duration),
                        program_id,
                        appointments: manualAppointments,
                        instructor_id: instructorId,
                        expire_date: expire_date,
                      });
                    }
                  })();
                }}
              >
                تأكيد
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <div className="flex gap-4 items-center justify-end">
        <button
          className="flex justify-end items-center gap-1 pt-4"
          onClick={() => setModalOpen(true)}
        >
          <Add size="24" variant="Outline" className="text-primary" />
          <span className="text-center justify-start text-primary text-sm font-bold">
            تغيير المواعيد
          </span>
        </button>
        <button
          className="flex justify-end items-center gap-1 pt-4"
          onClick={() => {
            setIsCompensateModalOpen(true);
          }}
        >
          <Add size="24" variant="Outline" className="text-primary" />
          <span className="text-center justify-start text-primary text-sm font-bold">
            إضافة ميعاد
          </span>
        </button>

      </div>
      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={appointmentData?.meta?.last_page}
          total={appointmentData?.meta?.total}
        />
      </div>
    </div>
  );
};
