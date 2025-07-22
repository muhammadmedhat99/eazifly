import { Loader } from "@/components/global/Loader";
import { Avatar, Switch, User } from "@heroui/react";
import { CloudAdd } from "iconsax-reactjs";
import Link from "next/link";
import { report } from "process";
import React from "react";
import { Controller } from "react-hook-form";

type TeacherDetailsProps = {
  data: {
   data: {
      id: number;
      name_en: string;
      name_ar: string;
      phone: string;
      email: string;
      whats_app: string;
      address: string;
      age: string;
      gender: string;
      can_approve_question: string;
      image: string;
      instructor_payment_method_id: number;
      status_label: {
        label: string;
        color: string;
      };
      specializations: {
        id: number;
        title: string;
      }[];
    links: {
        id: number;
        title: string;
        icon: string,
        type: string,
        link: string,
      }[];
    };
  };
  onUpdated?: any;
}

export const Hostinglinks = ({ data }: TeacherDetailsProps) => {
  return (
        <div className="p-4 grid grid-cols-1 gap-4">
            {data?.data?.links && data.data.links.length > 0 ? (
                data?.data?.links?.map(
                    (item: any) => (
                        <div key={item.id} className="flex items-center justify-between bg-main p-3 rounded-2xl border border-stroke">
                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={item?.icon}
                                    size="md"
                                    radius="sm"
                                    alt={item.title}
                                    fallback={<CloudAdd />}
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold text-black-text">{item.title}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <a href={item.link} target="blank" className="font-bold text-primary underline">{item.link}</a>
                            </div>
                        </div>
                    )
                )
            ) : (
                <p className="text-sm text-gray-500 text-center">لا توجد روابط</p>
            )}
        </div>
    );
};
