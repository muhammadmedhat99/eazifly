"use client";

import { Card, CardBody } from "@heroui/react";
import { TickCircle } from "iconsax-reactjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDate } from "@/lib/helper";

dayjs.extend(relativeTime);

type ContentItem = {
  id: number;
  program_id: number;
  program: string;
  title: string;
  description: string | null;
  duration: string;
  type: string;
  status: string;
  sort: string;
  created_at: string | null;
  checked: boolean;
  action_created_at: string | null;
};

type Props = {
  data: ContentItem[];
};

export default function Timeline({ data = [] }: Props) {
    console.log(data);
    
  const sortedData = [...data]?.sort((a, b) => {
    if (a.action_created_at && b.action_created_at) {
      return (
        new Date(a.action_created_at).getTime() -
        new Date(b.action_created_at).getTime()
      );
    }
    if (a.action_created_at) return -1;
    if (b.action_created_at) return 1;
    return Number(a.sort) - Number(b.sort);
  });

  return (
    <div className="relative pr-8">
      {/* الخط العمودي */}
      <div className="absolute top-0 right-2 w-[2px] bg-gray-300 h-full"></div>

      <div className="space-y-8">
        {sortedData.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4">
            {/* الدائرة */}
            <div className="absolute -right-6 translate-x-1/2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center 
                  ${
                    item.checked
                      ? item.type === "optional"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
              >
                <TickCircle size={16} />
              </span>
            </div>

            {/* المحتوى */}
            <div className="mr-4 w-full">
              <Card
                className={`shadow-sm rounded-lg ${
                  item.checked ? "" : "bg-gray-100"
                }`}
              >
                <CardBody>
                  <div className="flex flex-col items-start">
                    <div className="flex justify-between items-center w-full">
                      <h3
                        className={`font-semibold ${
                          item.checked ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {item.action_created_at
                          ? formatDate(item.action_created_at)
                          : "لم يبدأ"}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        item.checked ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      المدة: {item.duration} دقيقة
                    </p>
                  </div>
                  <span
                    className={`mt-3 text-xs px-2 py-1 rounded-full w-fit ${
                      item.checked
                        ? item.type === "optional"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {item.type}
                  </span>
                </CardBody>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
