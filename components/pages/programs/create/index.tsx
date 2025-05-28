"use client";

import React, { useState } from "react";
import { InformationForm } from "./InformationForm";
import { TeacherAndContent } from "./TeacherAndContent";
import { PaymentMethods } from "./PaymentMethods";
import { Subscriptions } from "./Subscriptions";

export const CreateProgram = () => {
  const [activeStep, setActiveStep] = useState(3);

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
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 0 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              البيانات الاساسيه
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 1 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              المعلمين و المحتوي
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 2 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              وسائل الدفع
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 3 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              الإشتراكات و المواعيد
            </div>
            <span className="w-20 h-px bg-stroke"></span>
          </div>
          <div className="flex items-center">
            <div
              className={`px-5 py-2 text-sm flex items-center justify-between rounded-full border ${activeStep >= 4 ? "text-primary border-primary cursor-pointer bg-primary/10 opacity-100" : "text-gray-600 bg-main border-stroke"} font-bold`}
            >
              المراجعة و النشر
            </div>
          </div>
        </div>
      </div>

      {(() => {
        switch (activeStep) {
          case 0:
            return <InformationForm setActiveStep={setActiveStep} />;
          case 1:
            return <TeacherAndContent setActiveStep={setActiveStep} />;
          case 2:
            return <PaymentMethods setActiveStep={setActiveStep} />;
          case 3:
            return <Subscriptions setActiveStep={setActiveStep} />;
          case 4:
            return <span>review and publish</span>;
          default:
            return null;
        }
      })()}
    </div>
  );
};
