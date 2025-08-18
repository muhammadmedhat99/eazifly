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

const columns = [
  { name: "", uid: "avatar" },
  { name: "إسم المعلم", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "سبب الطلب", uid: "reason" },
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

export const ProfileRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  const { data: teachersRequests, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/instructor/update/profile/requests`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllInstructorsRequests(
      currentPage
    ),
  });

  const formattedData =
    teachersRequests?.data?.map((item: any) => ({
      id: item.id,
      name: item.instructor_data.name || "N/A",
      phone: item.instructor_data.phone || "N/A",
      reason: item.reason || "N/A",
      avatar: item.instructor_data.image || "N/A",
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
