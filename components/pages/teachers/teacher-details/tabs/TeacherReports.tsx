import { User } from "@heroui/react";
import Link from "next/link";
import { report } from "process";
import React from "react";

type TeacherDetailsProps = {
  reportsData: {
    data: {
      id: number;
      report_maker_type: string;
      report_maker_name: string;
      report_maker_image: string;
      report_for_type: string;
      report_for_name: string;
      report_for_image: string;
      program: string;
      report_question: string;
      report_question_answer: string;
      note: string;
      created_at: string;
    }[];
  };
};

export const TeacherReports = ({ reportsData }: TeacherDetailsProps) => {
  return (
    <div className="p-4 grid grid-cols-1 gap-4">
      {reportsData.data.map((report) => (
        <div key={report.id} className="p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#E5E7EB] flex items-center gap-5">
          <Link href={'#'}>
            <User
              avatarProps={{ radius: "full", src: report.report_maker_image, size: "sm" }}
              description={
                <span className="text-[#5E5E5E] text-start text-xs font-bold">
                  {new Date(report.created_at).toISOString().split("T")[0]}
                </span>
              }
              name={
                <span className="text-sm font-bold text-[#272727]">{report.report_maker_name}</span>
              }
            ></User>
          </Link>
          <div className="flex flex-col justify-center items-start gap-1">
            <span className="justify-start text-[#272727] text-sm font-bold ">
              {report.report_question}
            </span>
            <span className="justify-start text-[#3D5066] text-xs font-bold ">
              {report.report_question_answer}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
