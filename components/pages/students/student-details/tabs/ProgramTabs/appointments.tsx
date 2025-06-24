"use client";
import { Edit2 } from "iconsax-reactjs";
import { Loader } from "@/components/global/Loader";

type appointmentsProps = {
  appointmentData?: any;
  isLoadingappointment: boolean;
};

export const Appointments = ({ appointmentData, isLoadingappointment }: appointmentsProps) => {
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

        </div>
    );
};
