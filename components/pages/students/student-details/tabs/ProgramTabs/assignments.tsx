"use client";

import { formatDate } from "@/lib/helper";
import { Loader } from "@/components/global/Loader";

type assignmentsProps = {
  assignmentData?: any;
  isLoadingassignment: boolean; 
}; 

export const Assignments = ({ assignmentData, isLoadingassignment }: assignmentsProps) => {
    return (
        <div className="flex flex-col gap-2">
            {isLoadingassignment ? (
                <Loader />
            ) : assignmentData.data && assignmentData.data.length > 0 ? (
                assignmentData.data.map((appointment: any, appointmentIndex: number) => (
                    <div key={appointmentIndex} className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke">
                        <div className="flex items-center gap-20">
                            <div className="flex flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">اسم التسليم</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {appointment.title}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">موعد التسليم</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {formatDate(appointment.deadline)} 
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">حالة التسليم</span>
                                    {appointment.is_uploaded ? (
                                        <span className="text-center text-[#0A9C71] text-sm font-bold">
                                            تم التسليم
                                        </span>
                                    ) : (
                                        <span className="text-center text-[#EF4444] text-sm font-bold">
                                            لم يتم التسليم
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-sm text-gray-500 text-center">لا توجد بيانات حالية للعرض</div>
            )}

        </div>
    );
};
