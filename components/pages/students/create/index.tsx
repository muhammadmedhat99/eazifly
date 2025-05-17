"use client";

import { useState } from "react";
import { InformationForm } from "./InformationForm";
import { ProgramForm } from "./ProgramForm";

export const CreateStudent = () => {
  const [activeStep, setActiveStep] = useState(1);
  return (
    <div className="bg-main py-10">
      <div className="flex items-center justify-center">
        <span
          className={`font-bold text-xs text-center mb-2 w-[134px] ${activeStep === 0 ? "text-primary" : "text-stroke"}`}
        >
          1
        </span>
        <span
          className={`w-10 h-px opacity-0 ${activeStep === 0 ? "bg-stroke" : "bg-primary"}`}
        ></span>
        <span
          className={`font-bold text-xs text-center mb-2 w-[78px] ${activeStep === 1 ? "text-primary" : "text-stroke"}`}
        >
          2
        </span>
      </div>
      <div className="flex items-center justify-center">
        <div
          className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep === 0 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
        >
          البيانات الاساسيه
        </div>
        <span
          className={`w-10 h-px ${activeStep === 0 ? "bg-stroke" : "bg-primary"}`}
        ></span>
        <div
          className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep === 1 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
        >
          البرامج
        </div>
      </div>
      {activeStep === 0 ? (
        <InformationForm setActiveStep={setActiveStep} />
      ) : (
        <ProgramForm setActiveStep={setActiveStep} />
      )}
    </div>
  );
};
