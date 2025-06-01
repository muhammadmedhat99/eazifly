"use client";

import { useState } from "react";
import { InformationForm } from "./InformationForm";
import { SpecialtiesForm } from "./SpecialtiesForm";
import { AttachmentsForm } from "./AttachmentsForm";
import { WorkingHoursForm } from "./WorkingHoursForm";

type CreateTeacherProps = {
  Specializations: any;
};

export const CreateTeacher = ({ Specializations }: CreateTeacherProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  return (
    <div className="bg-main py-10">
      <div className="flex items-center justify-center">
        <span
          className={`font-bold text-xs text-center mb-2 w-[134px] ${activeStep === 0 ? "text-primary" : "text-stroke"}`}
        >
          1
        </span>
        <span
          className={`w-16 h-px opacity-0 ${activeStep === 0 ? "bg-stroke" : "bg-primary"}`}
        ></span>
        <span
          className={`font-bold text-xs text-center mb-2 w-[78px] ${activeStep === 1 ? "text-primary" : "text-stroke"}`}
        >
          2
        </span>
        <span
          className={`w-[7rem] h-px opacity-0 ${activeStep === 1 ? "bg-stroke" : "bg-primary"}`}
        ></span>
        <span
          className={`font-bold text-xs text-center mb-2 w-[78px] ${activeStep === 2 ? "text-primary" : "text-stroke"}`}
        >
          3
        </span>
        <span
          className={`w-[7rem] h-px opacity-0 ${activeStep === 2 ? "bg-stroke" : "bg-primary"}`}
        ></span>
        <span
          className={`font-bold text-xs text-center mb-2 w-[78px] ${activeStep === 3 ? "text-primary" : "text-stroke"}`}
        >
          4
        </span>
      </div>
      <div className="flex items-center justify-center">
        <div
          className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep === 0 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
        >
          البيانات الاساسيه
        </div>
        <span
          className={`w-10 h-px ${activeStep === 1 ? "bg-primary" : "bg-stroke"}`}
        ></span>
        <div
          className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep === 1 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
        >
          التخصص والخبرات
        </div>
        <span
          className={`w-10 h-px ${activeStep === 2 ? "bg-primary" : "bg-stroke"}`}
        ></span>
        <div
          className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep === 2 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
        >
          ساعات العمل
        </div>
        <span
          className={`w-10 h-px ${activeStep === 3 ? "bg-primary" : "bg-stroke"}`}
        ></span>
        <div
          className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep === 3 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
        >
          الملفات و المرفقات
        </div>
      </div>
      {(() => {
        switch (activeStep) {
            case 0:
            return <InformationForm setActiveStep={setActiveStep} setTeacherId={setTeacherId} />;
            case 1:
            return <SpecialtiesForm setActiveStep={setActiveStep} Specializations={Specializations} teacherId={teacherId} />;
            case 2:
            return <WorkingHoursForm setActiveStep={setActiveStep} teacherId={teacherId}/>;
            case 3:
            return <AttachmentsForm setActiveStep={setActiveStep} />;
            default:
            return null;
        }
      })()}
    </div>
  );
};
