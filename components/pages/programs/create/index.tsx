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
import { fetchClient, fetchData } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { axios_config } from "@/lib/const";
import { useParams } from "next/navigation";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-reactjs";

interface CreateProgramProps {
  initialData?: any;
  mode?: "create" | "edit";
}

const stepNames = [
  "البيانات الاساسيه",
  "المعلمين و المحتوي",
  "وسائل الدفع",
  "الإشتراكات و المواعيد",
  "المراجعة و النشر",
];


export const CreateProgram = ({
  mode = "create",
}: CreateProgramProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [programId, setProgramId] = useState<string>("");
  const [specializationId, setSpecializationId] = useState<string>("");

  const params = useParams();
  const program_id = params.id;

  const { data: initialData } = useQuery({
    queryKey: ['programData', program_id],
    queryFn: () => fetchClient(`client/program/show/${program_id}`, axios_config),
    enabled: !!program_id
  });

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
      <div className="hidden md:flex flex-col gap-4 items-center justify-center mb-10">
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 md:gap-5 items-center">
          {[1, 2, 3, 4, 5].map((step, index) => (
            <div
              key={index}
              className={`font-bold text-xs md:text-sm text-center w-10 md:w-[200px] ${activeStep >= index ? "text-primary" : "text-stroke"
                }`}
            >
              {step}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
          {[
            "البيانات الاساسيه",
            "المعلمين و المحتوي",
            "وسائل الدفع",
            "الإشتراكات و المواعيد",
            "المراجعة و النشر",
          ].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                onClick={() => programId && setActiveStep(index)}
                className={`px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm rounded-full border transition duration-200
              ${activeStep >= index
                    ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100"
                    : "text-gray-600 bg-main border-stroke"
                  }
              font-bold ${!programId && activeStep !== index
                    ? "cursor-not-allowed opacity-50"
                    : programId
                      ? "cursor-pointer"
                      : ""
                  }`}
              >
                {label}
              </div>

              {index !== 4 && (
                <span className="hidden md:inline-block w-20 h-px bg-stroke mx-2"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex md:hidden items-center justify-between px-4">
        <button
          onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
          disabled
          className={`p-2 text-primary ${activeStep === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
        >
          <ArrowCircleRight size="32" />
        </button>

        <div
          className={`px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm rounded-full border transition duration-200 text-primary border-primary cursor-pointer bg-primary/10 opacity-100 font-bold`}
        >
          {stepNames[activeStep]}
        </div>

        <button
          onClick={() => setActiveStep((prev) => Math.min(prev + 1, 4))}
          disabled
          className={`p-2 text-primary ${activeStep === 4 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
        >
          <ArrowCircleLeft size="32" />
        </button>
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
