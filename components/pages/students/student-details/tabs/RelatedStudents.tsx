import { Options } from "@/components/global/Icons";
import { Avatar, Button } from "@heroui/react";
import { Add } from "iconsax-reactjs";
import React from "react";

export const RelatedStudents = () => {
  return (
    <div className="bg-main p-5 border border-stroke rounded-lg">
      <div className="flex justify-end mb-5">
        <Button variant="flat" className="text-primary font-bold bg-white">
          <Add />
          إضافة طالب جديد
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {/* student card  */}
        <div className="bg-background rounded-lg flex items-center justify-between p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-title">الإسم</span>
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />

              <span className="text-black-text font-bold text-[15px]">
                عبدالرحمن محمود الجندي
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-title">السن </span>
            <span className="font-bold text-black-text">12 عام </span>
          </div>

          <Options />
        </div>
        {/* student card  */}
        {/* student card  */}
        <div className="bg-background rounded-lg flex items-center justify-between p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-title">الإسم</span>
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />

              <span className="text-black-text font-bold text-[15px]">
                عبدالرحمن محمود الجندي
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-title">السن </span>
            <span className="font-bold text-black-text">12 عام </span>
          </div>

          <Options />
        </div>
        {/* student card  */}
      </div>
    </div>
  );
};
