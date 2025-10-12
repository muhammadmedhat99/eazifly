import { formatDate } from "@/lib/helper";
import { Chip, User } from "@heroui/react";
import Link from "next/link";
import React from "react";

const responseStatusMap: Record<string, string> = {
  responded: "تم الرد",
  not_responded: "غير متاح",
};

const renewalStatusMap: Record<string, string> = {
  renew: "تم التجديد",
  connected: "تم التواصل",
  not_renewed: "لم يتم التجديد",
  postpone: "تم التأجيل",
};

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
      {[...studentInfo.communications].reverse().map((action) => (
        <div
          key={action.id}
          className="bg-[#F8F9FA] px-5 py-4 rounded-xl border border-stroke flex flex-col gap-4"
        >
          {/* Row 1: Status + User */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center items-start gap-1">
              <span className="text-[#272727] text-base font-bold">
                {responseStatusMap[action.response_status] || action.response_status}
              </span>
              <span className="text-[#3D5066] text-sm font-bold">
                {renewalStatusMap[action.renewal_status] || action.renewal_status}
              </span>
            </div>

            <Link href={"#"}>
              <User
                avatarProps={{
                  radius: "full",
                  src: action.client_image ?? undefined,
                  size: "sm",
                }}
                description={
                  <span className="text-sm font-bold text-[#3D5066]">
                    {action.client_name}
                  </span>
                }
                name={
                  <span className="text-primary text-start text-xs font-bold">
                    {formatDate(action.created_at)}
                  </span>
                }
              />
            </Link>
          </div>
          {/* Row 2: Reminder Info */}
          <div className="flex flex-col gap-6">
            {/* Reminder Info */}
           {action.reminder === "true" && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">التذكير</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {action.reminder === "true" ? "نعم" : "لا"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">نوع التذكير</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {action.reminder_type ?? "-"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">تاريخ التذكير</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {action.reminder_date ? formatDate(action.reminder_date) : "-"}
                </p>
              </div>
            </div>)}

            {/* Student Responses */}
            {action.user_response && action.user_response.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500 font-medium">ردود الطالب</span>
                <div className="flex flex-wrap gap-2">
                  {action.user_response.map((resp) => (
                    <Chip
                      key={resp.id}
                      className="capitalize px-4 min-w-24 text-center"
                      color="success"
                      variant="flat"
                    >
                      <span className="text-green-600 font-bold">{resp.title}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            )}


            {/* Note */}
            {action.note && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                <span className="text-xs text-gray-500 font-medium">ملاحظة</span>
                <div
                  className="text-sm text-gray-800 font-medium leading-relaxed mt-2"
                  dangerouslySetInnerHTML={{ __html: action.note }}
                />
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
};
