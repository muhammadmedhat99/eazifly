"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { Loader } from "@/components/global/Loader";
import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import { CustomPagination } from "@/components/global/Pagination";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { formatDate } from "@/lib/helper";

const columns = [
  { name: "", uid: "avatar" },
  { name: "إسم المعلم", uid: "name" },
  { name: "الحصة", uid: "session_link" },
  { name: "سبب الطلب", uid: "reason" },
  { name: "البرنامج", uid: "program_title" },
  { name: "تاريخ المحاضرة", uid: "session_date" },
  { name: "وقت المحاضرة", uid: "session_time" },
  { name: <Options />, uid: "actions" },
];

const OptionsComponent = ({ id }: { id: number }) => {
  return (
    <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
      <DropdownTrigger>
        <button>
          <Options />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href={`/requests/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const SessionsRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  const { data: teachersRequests, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/instructor/request/to/cancel/session`, {
        ...axios_config,
        params,
      }),
    queryKey: ["getall"],
  });

  const formattedData =
    teachersRequests?.data?.map((item: any) => ({
      id: item.id,
      name: item.session.instructor || "N/A",
      reason: item.reason || "N/A",
      session_date: item.session.session_date || "N/A",
      session_link: item.session.id || "N/A",
      session_time: item.session.session_time || "N/A",
      program_title: item.session.program_title || "N/A",
      avatar: item.session.instructor_image || "N/A",
      created_at: formatDate(item.created_at) || "N/A",
    })) || [];

  return (
   <>
  {isLoading ? (
    <Loader />
  ) : formattedData.length === 0 ? (
    <span className="text-gray-500 block text-center my-6">
      لا يوجد طلبات
    </span>
  ) : (
    <TableComponent
      columns={columns}
      data={formattedData}
      ActionsComponent={OptionsComponent}
    />
  )}

  <div className="my-10 px-6">
    <CustomPagination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      last_page={teachersRequests?.meta?.last_page}
      total={teachersRequests?.meta?.total}
    />
  </div>
</>
  );
};
