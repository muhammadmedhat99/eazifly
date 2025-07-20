"use client";

import React, { useState } from "react";
import { InformationForm } from "./InformationForm";
import { TeacherAndContent } from "./TeacherAndContent";
import { PaymentMethods } from "./PaymentMethods";
import { Subscriptions } from "./Subscriptions";
import { Button } from "@heroui/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { informationFormSchema } from "./schemas";
import { Reviewandpublish } from "./Reviewandpublish";

interface CreateProgramProps {
  initialData?: any; 
  mode?: "create" | "edit";
}

export const CreateProgram = ({
  initialData,
  mode = "create",
}: CreateProgramProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [programId, setProgramId] = useState<string>("");
  const [specializationId, setSpecializationId] = useState<string>("");

  const methods = useForm({
    resolver: yupResolver(informationFormSchema),
    defaultValues: initialData || {},
  });

  const handleProgramCreated = (id: string, specId: string) => {
    setProgramId(id);
    setSpecializationId(specId);
    setActiveStep(1);
  };

  return (
    <div className="bg-main py-10">
      <div className="flex flex-col gap-2 items-center justify-center mb-10">
        <div className="flex gap-5 items-center justify-between">
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 0 ? "text-primary" : "text-stroke"}`}
          >
            1
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 1 ? "text-primary" : "text-stroke"}`}
          >
            2
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 2 ? "text-primary" : "text-stroke"}`}
          >
            3
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 3 ? "text-primary" : "text-stroke"}`}
          >
            4
          </div>
          <div
            className={`font-bold text-xs w-[200px] text-center ${activeStep >= 4 ? "text-primary" : "text-stroke"}`}
          >
            5
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <div
              onClick={() => programId && setActiveStep(0)} // Only allow if program is created
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${
                activeStep >= 0
                  ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100"
                  : "text-gray-600 bg-main border-stroke"
              } font-bold ${!programId && activeStep !== 0 ? "cursor-not-allowed opacity-50" : ""}`}
            >
              البيانات الاساسيه
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => programId && setActiveStep(1)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${
                activeStep >= 1
                  ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100"
                  : "text-gray-600 bg-main border-stroke"
              } font-bold ${!programId ? "cursor-not-allowed opacity-50" : ""}`}
            >
              المعلمين و المحتوي
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => programId && setActiveStep(2)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${
                activeStep >= 2
                  ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100"
                  : "text-gray-600 bg-main border-stroke"
              } font-bold ${!programId ? "cursor-not-allowed opacity-50" : ""}`}
            >
              وسائل الدفع
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => programId && setActiveStep(3)}
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${
                activeStep >= 3
                  ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100"
                  : "text-gray-600 bg-main border-stroke"
              } font-bold ${!programId ? "cursor-not-allowed opacity-50" : ""}`}
            >
              الإشتراكات و المواعيد
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${
                activeStep >= 4
                  ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100"
                  : "text-gray-600 bg-main border-stroke"
              } font-bold ${!programId ? "cursor-not-allowed opacity-50" : ""}`}
            >
              المراجعة و النشر
            </div>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        {(() => {
          switch (activeStep) {
            case 0:
              return (
                <InformationForm
                  setActiveStep={setActiveStep}
                  onProgramCreated={handleProgramCreated}
                  initialData={initialData} 
                  mode={mode} 
                />
              );
            case 1:
              return (
                <TeacherAndContent
                  setActiveStep={setActiveStep}
                  programId={programId}
                  specializationId={specializationId}
                  initialData={initialData} 
                  mode={mode} 
                />
              );
            case 2:
              return (
                <>
                  <PaymentMethods
                    setActiveStep={setActiveStep}
                    programId={programId}
                    initialData={initialData}
                    mode={mode} 
                  />
                </>
              );
            case 3:
              return (
                <>
                  <Subscriptions
                    setActiveStep={setActiveStep}
                    programId={programId}
                    initialData={initialData}
                    mode={mode} 
                  />
                </>
              );
            case 4:
              return (
                <>
                  <Reviewandpublish
                    setActiveStep={setActiveStep}
                    programId={programId}
                  />
                </>
              );
            default:
              return null;
          }
        })()}
      </FormProvider>
    </div>
  );
};
