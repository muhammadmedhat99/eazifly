import { Accordion, AccordionItem, Button } from "@heroui/react";
import { ArrowLeft2 } from "iconsax-reactjs";
import React from "react";

export const ProgramGoals = () => {
  return (
    <div className="bg-main py-2">
      <div className="flex items-center justify-between p-5 border-b border-b-stroke">
        <div className="flex flex-col gap-2">
          <div className="text-primary text-xs font-semibold">هدف البرنامج</div>
          <div className="text-black-title text-sm font-bold">
            حفظ القران الكريم
          </div>
        </div>

        <Button
          variant="flat"
          color="primary"
          className="font-semibold text-primary"
        >
          إضافة هدف أخر +
        </Button>
      </div>

      <div className="py-5">
        <Accordion
          variant="splitted"
          itemClasses={{
            base: "shadow-none border border-stroke bg-background",
          }}
        >
          <AccordionItem
            key="1"
            aria-label="Accordion-item-1"
            title={
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black-text">
                  أصناف الناس في العبادة
                </span>
                <span className="text-sm font-bold text-primary">20 نقطة</span>
              </div>
            }
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="mb-6">
              <h3 className="font-semibold text-black-text mb-2">
                1 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
              </h3>
              <p className="text-title text-sm">
                هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>

              <h2 className="text-right text-primary font-bold mt-4">
                الأهداف الفرعية
              </h2>
              <p className="text-title text-sm">
                1- هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>
              <p className="text-title text-sm">
                2- هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>

              <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex-[2] relative">
                  <h3 className="text-primary mb-2 font-bold">
                    المواد التعليمية
                  </h3>
                  <div className="overflow-hidden rounded-lg h-40">
                    <img
                      src="https://placehold.co/800x400"
                      alt="Program"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-primary mb-2 font-bold">نسبة الهدف</h3>
                  <span>20 %</span>
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-primary mb-2 font-bold">
                    هل يستطيع الطالب إنهاء الهدف بنفسة ؟
                  </h3>
                  <span>نعم</span>
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion-item-2"
            title={
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black-text">
                  أصناف الناس في العبادة
                </span>
                <span className="text-sm font-bold text-primary">20 نقطة</span>
              </div>
            }
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="mb-6">
              <h3 className="font-semibold text-black-text mb-2">
                1 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
              </h3>
              <p className="text-title text-sm">
                هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>

              <h2 className="text-right text-primary font-bold mt-4">
                الأهداف الفرعية
              </h2>
              <p className="text-title text-sm">
                1- هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>
              <p className="text-title text-sm">
                2- هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>

              <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex-[2] relative">
                  <h3 className="text-primary mb-2 font-bold">
                    المواد التعليمية
                  </h3>
                  <div className="overflow-hidden rounded-lg h-40">
                    <img
                      src="https://placehold.co/800x400"
                      alt="Program"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-primary mb-2 font-bold">نسبة الهدف</h3>
                  <span>20 %</span>
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-primary mb-2 font-bold">
                    هل يستطيع الطالب إنهاء الهدف بنفسة ؟
                  </h3>
                  <span>نعم</span>
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion-item-3"
            title={
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black-text">
                  أصناف الناس في العبادة
                </span>
                <span className="text-sm font-bold text-primary">20 نقطة</span>
              </div>
            }
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="mb-6">
              <h3 className="font-semibold text-black-text mb-2">
                1 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
              </h3>
              <p className="text-title text-sm">
                هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>

              <h2 className="text-right text-primary font-bold mt-4">
                الأهداف الفرعية
              </h2>
              <p className="text-title text-sm">
                1- هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>
              <p className="text-title text-sm">
                2- هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا
                النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
                جزء من عملية تحسين تجربة المستخدم خلال النص.
              </p>

              <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex-[2] relative">
                  <h3 className="text-primary mb-2 font-bold">
                    المواد التعليمية
                  </h3>
                  <div className="overflow-hidden rounded-lg h-40">
                    <img
                      src="https://placehold.co/800x400"
                      alt="Program"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-primary mb-2 font-bold">نسبة الهدف</h3>
                  <span>20 %</span>
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-primary mb-2 font-bold">
                    هل يستطيع الطالب إنهاء الهدف بنفسة ؟
                  </h3>
                  <span>نعم</span>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
