import { formatDate } from "@/lib/helper";
import { User } from "@heroui/react";
import Link from "next/link";
import React from "react";

type StudentDetailsProps = {
  studentInfo: {
    id: number;
    communications: {
    id: number;
    user_id: string;
    client_name: string;
    client_image: string | null;
    communication_type: string;
    response_status: string;
    renewal_status: string;
    reminder: string;
    reminder_type: string;
    reminder_date: string;
    subscripe_expire_date: string;
    note: string;
    subscription_id: string;
    user_response: {
      id: number;
      title: string;
    }[];
    created_at: string;
  }[];
  };
};

export const PreviousActions = ({studentInfo} : StudentDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {studentInfo.communications.map((action) => (
        <div key={action.id} className="bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke flex items-center justify-between">
          <div className="flex flex-col justify-center items-start gap-1">
            <span className="justify-start text-[#272727] text-base font-bold ">
              {action.response_status}
            </span>
            <span className="justify-start text-[#3D5066] text-sm font-bold">
              {action.renewal_status}
            </span>
          </div>
          <Link href={'#'}>
            <User
              avatarProps={{ radius: "full",  src: action.client_image ?? undefined, size: "sm" }}
              description={
                <span className="text-sm font-bold text-[#3D5066]">{action.client_name}</span>
              }
              name={
                <span className="text-primary text-start text-xs font-bold">
                  {formatDate(action.created_at)}
                </span>
              }
            ></User>
          </Link>
        </div>
      ))}
    </div>
  );
};
