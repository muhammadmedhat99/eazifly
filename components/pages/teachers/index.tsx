"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  { name: "", uid: "avatar" },
  { name: "إسم المعلم", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "رقم واتساب", uid: "whats_app" },
  { name: "التخصصات", uid: "specializations" },
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
  const [nameSearch, setNameSearch] = useState("");
const [phoneSearch, setPhoneSearch] = useState("");
const debouncedNameSearch = useDebounce(nameSearch, 500);
const debouncedPhoneSearch = useDebounce(phoneSearch, 500);
const [selectedStatus, setSelectedStatus] = useState("all");
const [currentPage, setCurrentPage] = useState(1);

const params: Record<string, string | number> = {
  page: currentPage,
};

if (debouncedNameSearch) {
  params.name = debouncedNameSearch;
}

if (debouncedPhoneSearch) {
  params.phone = debouncedPhoneSearch;
}

if (selectedStatus !== "all") {
  params.status = selectedStatus;
}

const { data: teachersData, isLoading } = useQuery({
  queryFn: async () =>
    await fetchClient(`client/instructors`, {
      ...axios_config,
      params,
    }),
  queryKey: AllQueryKeys.GetAllInstructors(
    debouncedNameSearch,
    debouncedPhoneSearch,
    selectedStatus,
    currentPage
  ),
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
        ? `${item.specializations[0]?.title}${
            item.specializations.length > 1
              ? ` (+${item.specializations.length})`
              : ""
          }`
        : "N/A",
    working_hours:
      item.AvailabilityTime?.length > 0
        ? `${item.AvailabilityTime[0].day} ${item.AvailabilityTime[0].start_time} - ${item.AvailabilityTime[0].end_time}`
        : "N/A",
    status: {
      name: item.status?.label || "N/A",
      key: item.status?.key || null,
      color: item?.status?.color || "",
    },
  })).reverse() || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="relative md:w-48">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1 size="18" className="text-gray-400" variant="Outline" />
            </div>
            <input
              type="text"
              placeholder="بحث بالاسم..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div className="relative md:w-48">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1 size="18" className="text-gray-400" variant="Outline" />
            </div>
            <input
              type="text"
              placeholder="بحث برقم الهاتف..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
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
            id="all"
            variant="flat"
            color={selectedStatus === "all" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            الكل
          </Button>
          <Button
            id="active"
            variant="flat"
            color={selectedStatus === "active" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            نشط
          </Button>
          <Button
            id="new"
            variant="flat"
            color={selectedStatus === "new" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            جديد
          </Button>
          <Button
            id="Hold"
            variant="flat"
            color={selectedStatus === "Hold" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            معلق
          </Button>
          <Button
            id="in_review"
            variant="flat"
            color={selectedStatus === "in_review" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            تحت المراجعة
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
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={teachersData?.meta?.last_page}
          total={teachersData?.meta?.total}
        />
      </div>
    </>
  );
};
