"use client";

import React, { useState } from "react";
import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import {
  avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { CustomPagination } from "@/components/global/Pagination";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { Loader } from "@/components/global/Loader";

const columns = [
    { name: "إسم المعلم", uid: "name" },
    { name: "رقم الهاتف", uid: "phone" },
    { name: "رقم واتساب", uid: "whats_app" }, 
    { name: "التخصصات", uid: "specializations" },
    { name: "ساعات العمل", uid: "working_hours" },
    { name: "الحالة", uid: "status" },
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
        <DropdownItem href={`/teachers/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
        <DropdownItem key="actions">الإجراءات</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
        <DropdownItem key="add-to-course">تعيين علي برنامج</DropdownItem>
        <DropdownItem key="send-mail">إرسال رسالة</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const AllTeachers = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState("1");
  
  const { data: teachersData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/instructors?search=${debouncedSearch}`, axios_config),
    queryKey: AllQueryKeys.GetAllUsers(debouncedSearch),
  });

  const formattedData =
    teachersData?.data?.map((item: any) => ({
        id: item.id,
        name: item.name_ar || item.name_en || "N/A",
        avatar: item.image,
        phone: item.phone || "N/A",
        whats_app: item.whats_app || "N/A",
        specializations:
            item.specializations?.length > 0
                ? `${item.specializations[0]?.title}${item.specializations.length > 1 ? ` (+${item.specializations.length})` : ""}`
                : "N/A",
        working_hours:
            item.AvailabilityTime?.length > 0
                ? `${item.AvailabilityTime[0].day} ${item.AvailabilityTime[0].start_time} - ${item.AvailabilityTime[0].end_time}`
                : "N/A",
        status: item.status || { name: "N/A", color: "primary" },
    })) || [];

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative min-w-80">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1
                size="18"
                className="text-gray-400"
                variant="Outline"
              />
            </div>
            <input
              type="text"
              placeholder="بحث..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="primary"
                className="text-primary font-semibold gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                ترتيب حسب
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">الإسم</DropdownItem>
              <DropdownItem key="edit">رقم الهاتف</DropdownItem>
              <DropdownItem key="add-to-course">التقييم</DropdownItem>
              <DropdownItem key="change-password">
                التخصصات
              </DropdownItem>
              <DropdownItem key="send-mail">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Button
            id="1"
            variant="flat"
            color={selectedStatus === "1" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            جديد
          </Button>
          <Button
            id="2"
            variant="flat"
            color={selectedStatus === "2" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            معلق
          </Button>
          <Button
            id="3"
            variant="flat"
            color={selectedStatus === "3" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            تم الإشتراك
          </Button>
          <Button
            id="4"
            variant="flat"
            color={selectedStatus === "4" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            مرفوض
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <TableComponent
          columns={columns}
          data={formattedData}
          ActionsComponent={OptionsComponent}
          selectable={true}
        />
      )}

      <div className="my-10 px-6">
        <CustomPagination />
      </div>
    </>
  );
};
