"use client";

import { Options } from "@/components/global/Icons";
import { Avatar, Button } from "@heroui/react";
import { Add } from "iconsax-reactjs";
import React, { useState } from "react";
import AddStudentModal from "../AddStudentModal";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useParams } from "next/navigation";
import { Loader } from "@/components/global/Loader";

type StudentDetailsProps = {
  data: {
    data: {
      id: number;
      first_name: string;
      last_name: string;
      user_name: string;
      email: string;
      phone: string;
      whats_app: string;
      image: string;
      created_at: string;
      status_label: {
        label: string;
        color: string;
      };
      childrens: {
        id: number;
        first_name: string;
        last_name: string;
        user_name: string;
        email: string;
        phone: string;
        whats_app: string;
        image: string;
        gender: string;
        age: string;
        status_label: {
          label: string;
          color: string;
        };
        programs: any[];
        chat_id: number;
      }[];
    };
  };
};

export const RelatedStudents = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null)

  const params = useParams();
  const user_id = params.id;

  const handleRowClick = (student: any) => {
    setModalOpen(true);
  }

  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ["client", user_id],
    queryFn: async () => await fetchClient(`client/user/show/${user_id}`, axios_config),
  });

  return (
    isLoading ? <Loader /> : (
      <div className="bg-main p-5 border border-stroke rounded-lg">
      <AddStudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={studentDetails}
        refetch= {refetch}
      />
      <div className="flex justify-end mb-5">
        <Button onPress={handleRowClick} variant="flat" className="text-primary font-bold bg-white">
          <Add />
          إضافة طالب جديد
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {userData?.data?.childrens?.map((child: any, index: number) =>
        (
          <div key={index} className="bg-background rounded-lg flex items-center justify-between p-4">
            <div className="flex flex-col gap-2 w-1/2">
              <span className="text-sm font-bold text-title">الإسم</span>
              <div className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  src={child.image}
                />

                <span className="text-black-text font-bold text-[15px]">
                  {child.first_name + " " + child.last_name}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-1/2">
              <span className="text-sm font-bold text-title">السن </span>
              <span className="font-bold text-black-text">{child.age} عام </span>
            </div>

            <Options />
          </div>
        ))}
      </div>
    </div>
    )
  );
};
