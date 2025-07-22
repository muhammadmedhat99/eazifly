'use client'

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { addToast, Button } from "@heroui/react";

const daysOfWeek = [
  'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'
];
const dayNamesEnglish = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

type FormValues = {
  workingHours: {
    day: string;
    timeSlots: { from: string; to: string }[];
  }[];
};

export const WorkingHoursForm =({
  setActiveStep,
  teacherId
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  teacherId: number | null;
}) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      workingHours: daysOfWeek.map((day) => ({
        day,
        timeSlots: [],
      })),
    },
  });

  const CreateAvailability = useMutation({
    mutationFn: async (formData: FormValues) => {
      const availability = formData.workingHours
        .filter(day => day.timeSlots.length > 0)
        .map((day, index) => ({
          day: dayNamesEnglish[index],
          time_slots: day.timeSlots.map(slot => ({
            start_time: slot.from,
            end_time: slot.to,
          })),
        }));

      const body = {
        instructor_id: teacherId,
        availability,
      };

      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        "client/instructor/availability/time",
        JSON.stringify(body),
        myHeaders
      );
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "خطأ",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        reset();
        setActiveStep(4);
      }
    },
    onError: (error) => {
      console.log("error ===>>", error);
      addToast({
        title: "عذرا، حدث خطأ",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    CreateAvailability.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 col-span-2 py-14 px-8">
      <label className="text-[#272727] font-bold text-sm">ساعات العمل الأسبوعية</label>
      <div className="border p-4 rounded-lg bg-gray-50">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="flex items-center gap-2 mb-4">
            <label className="text-[#272727] font-bold text-sm w-20">{day}</label>
            <Controller
              control={control}
              name={`workingHours.${dayIndex}.timeSlots`}
              render={({ field: timeSlotsField }) => (
                <>
                  {timeSlotsField.value.length === 0 ? (
                    <div className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0.5 text-sm font-bold">
                      غير متاح
                    </div>
                  ) : (
                    timeSlotsField.value.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex gap-2">
                        <input
                          type="time"
                          value={slot.from}
                          onChange={(e) =>
                            timeSlotsField.onChange([
                              ...timeSlotsField.value.slice(0, slotIndex),
                              { ...slot, from: e.target.value },
                              ...timeSlotsField.value.slice(slotIndex + 1),
                            ])
                          }
                          className="px-6 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                        />
                        <input
                          type="time"
                          value={slot.to}
                          onChange={(e) =>
                            timeSlotsField.onChange([
                              ...timeSlotsField.value.slice(0, slotIndex),
                              { ...slot, to: e.target.value },
                              ...timeSlotsField.value.slice(slotIndex + 1),
                            ])
                          }
                          className="px-6 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                        />
                      </div>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      timeSlotsField.onChange([
                        ...timeSlotsField.value,
                        { from: "00:00", to: "00:00" },
                      ])
                    }
                  >
                    <svg width="36" height="37" viewBox="0 0 36 37" fill="none">
                      <path d="M17.9998 26.8346C22.5832 26.8346 26.3332 23.0846 26.3332 18.5013C26.3332 13.918 22.5832 10.168 17.9998 10.168C13.4165 10.168 9.6665 13.918 9.6665 18.5013C9.6665 23.0846 13.4165 26.8346 17.9998 26.8346Z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14.6665 18.5H21.3332" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 21.8346V15.168" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
        <Button
          type="button"
          onPress={() => reset()}
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
        >
          التالي
        </Button>
      </div>
    </form>
  );
};
