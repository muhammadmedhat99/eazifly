"use client";
import { Edit2, Trash } from "iconsax-reactjs";
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
import { useState, useMemo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { CustomPagination } from "@/components/global/Pagination";

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

export const Teachers = ({
  appointmentData,
  isLoadingappointment,
}: appointmentsProps) => {
    console.log('appointmentData', appointmentData);
    
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: AilabilitiesSessions, isLoading } = useQuery({
    enabled: !!selectedAppointment,
    queryKey: ["GetavAilabilitiesSessions"],
    queryFn: async () =>
      await fetchClient(
        `client/session/availabilities/time/${selectedAppointment.instructor_id}?duration=${selectedAppointment.duration}`,
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

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
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
        queryClient.invalidateQueries({
          queryKey: ["programappointments"],
        });
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


  return (
    <div className="flex flex-col gap-2">
      {isLoadingappointment ? (
        <Loader />
      ) : appointmentData.data && appointmentData.data.length > 0 ? (
        appointmentData.data.map(
          (appointment: any, appointmentIndex: number) => (
            <div
              key={appointmentIndex}
              className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke"
            >
              <div className="flex items-center gap-20">
                <div className="flex flex-col gap-4 items-center">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    إسم المعلم
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                    {appointment?.instructor?.name_ar}
                  </span>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    إسم الطالب
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                    {appointment?.user?.first_name} {appointment?.user?.last_name}
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
                  تغير المعلم
                </button>
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-sm text-gray-500 text-center">
          لا توجد بيانات حالية للعرض
        </div>
      )}

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
