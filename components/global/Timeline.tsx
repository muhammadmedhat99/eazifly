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
};

type Props = {
  data: ContentItem[];
};

export default function Timeline({ data }: Props) {
    console.log(data);
    
  return (
      <div className="relative pr-8">
          {/* الخط العمودي */}
          <div className="absolute top-0 right-2 w-[2px] bg-gray-300 h-full"></div>

          <div className="space-y-8">
              {[...data]
                  .sort((a, b) => Number(a.sort) - Number(b.sort))
                  .map((item) => (
                      <div key={item.id} className="relative flex items-start gap-4">
                          {/* الدائرة فوق الخط */}
                          <div className="absolute -right-6 translate-x-1/2">
                              <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${item.type === "optional"
                                          ? "bg-blue-500 text-white"
                                          : "bg-green-500 text-white"
                                      }`}
                              >
                                  <TickCircle size={16} />
                              </span>
                          </div>

                          {/* المحتوى */}
                          <div className="mr-4 w-full">
                              <Card className="shadow-sm rounded-lg">
                                  <CardBody>
                                      <div className="flex flex-col items-start">
                                          <div className="flex justify-between items-center w-full">
                                              <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                              <span className="text-xs text-gray-500">
                                                  أضيف في{" "}
                                                  {item.created_at ? formatDate(item.created_at) : "null"}
                                              </span>
                                          </div>
                                          <p className="text-sm text-gray-600 mt-1">
                                              المدة: {item.duration} دقيقة
                                          </p>
                                      </div>
                                      <span
                                          className={`mt-3 text-xs px-2 py-1 rounded-full w-fit ${item.type === "optional"
                                                  ? "bg-blue-100 text-blue-600"
                                                  : "bg-green-100 text-green-600"
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
