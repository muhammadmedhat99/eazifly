"use client";

import { Button } from "@heroui/react";


export const SalaryDetails = () => {

  return (
    <div

      className="p-5 grid grid-cols-1 gap-5"
    >
      <div className="flex flex-col gap-5 bg-main p-5 rounded-2xl border border-stroke w-1/2 mx-auto">
      <div className="flex flex-col gap-2">
        <span className="text-[#5E5E5E] text-sm font-bold">
           اسم البرنامج
          </span>
          <span className="text-black-text font-bold text-[15px]">
              {`الرياضيات الصف الاول`}
            </span>
      </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
            اجمالي الساعات
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`20 ساعة`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
           سعر ساعة البرنامج
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`400 ج.م`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
           الإجمالي
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`6000 ج.م`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
           الخصومات
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`300 ج.م`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
            الإجمالي بعد الخصومات
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`5000 ج.م`}
            </span>
        </div>

     
      </div>
      <div className="flex flex-col gap-5 bg-main p-5 rounded-2xl border border-stroke w-1/2 mx-auto">
      <div className="flex flex-col gap-2">
        <span className="text-[#5E5E5E] text-sm font-bold">
           اسم البرنامج
          </span>
          <span className="text-black-text font-bold text-[15px]">
              {`الرياضيات الصف الاول`}
            </span>
      </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
            اجمالي الساعات
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`20 ساعة`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
           سعر ساعة البرنامج
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`400 ج.م`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
           الإجمالي
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`6000 ج.م`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
           الخصومات
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`300 ج.م`}
            </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
            الإجمالي بعد الخصومات
          </span>
           <span className="text-black-text font-bold text-[15px]">
              {`5000 ج.م`}
            </span>
        </div>

     
      </div>

      <div className="flex items-center justify-end gap-4 mt-8">
              
              <Button
                variant="solid"
                color="primary"
                className="text-white"

              >
                موافقة
              </Button>
            </div>

    </div>
  );
};
