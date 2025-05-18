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
  { name: "إسم الطالب", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكتروني", uid: "email" },
  { name: "البرامج الملحق بها", uid: "programs" },
  { name: "موعد التجديد", uid: "renew_date" },
  { name: "أخر ظهور", uid: "last_active" },
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
        <DropdownItem href={`/students/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
        <DropdownItem key="edit">تعديل البيانات</DropdownItem>
        <DropdownItem key="add-to-course">إلحاق ببرنامج</DropdownItem>
        <DropdownItem key="change-password">تغيير كلمة المرور</DropdownItem>
        <DropdownItem key="send-mail">إرسال رسالة</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const AllStudents = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState("1");

  const { data: studentsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/user?search=${debouncedSearch}`, axios_config),
    queryKey: AllQueryKeys.GetAllUsers(debouncedSearch),
  });
  console.log(" studentsData ===>>", studentsData);

  const formattedData =
    studentsData?.data?.map((item: any) => ({
      id: item.id,
      name: `${item.first_name} ${item.last_name}`,
      avatar: item.image,
      phone: item.phone,
      email: item.email,
      programs:
        `${item.programs[0]?.title} ${item.programs.length > 1 ? `(+${item.programs.length})` : ""}` ||
        "N/A",
      renew_date: item.renew_date || "N/A",
      last_active: item.last_active || "N/A",
      status: item.status?.title || "N/A",
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
                تاريخ تجديد الإشتراك
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
            الكل
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
            نشط
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
            متوقف
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
            ملغي
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
        />
      )}

      <div className="my-10 px-6">
        <CustomPagination />
      </div>
    </>
  );
};
