import React from "react";
import WeeklyWorkingHours from "./WeeklyWorkingHours";

export const WorkingHours = () => {
    return (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                <div className="flex flex-col gap-4 w-full">
                    <span className="text-[#5E5E5E] text-sm font-bold text-primary">مواعيد العمل</span>
                    <WeeklyWorkingHours />
                </div>
            </div>
        </div>
    );
};
