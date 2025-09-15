"use client";

import React, { useMemo, useState } from "react";

import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import {
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

import { formatDate } from "@/lib/helper";

const columns = [
  { name: "", uid: "avatar" },
  { name: "الإسم", uid: "name" },
  { name: "الوظيفة", uid: "phone" },
  { name: "الراتب الأساسي", uid: "email" },
  { name: "إضافات", uid: "programs" },
  { name: "خصومات", uid: "last_active" },
  { name: "صافي الراتب", uid: "salary" },
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
      </DropdownMenu>
    </Dropdown>
  );
};

export const Salaries = () => {
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const debouncedPhoneSearch = useDebounce(phoneSearch, 500);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const params: Record<string, string | number | boolean> = {
    page: currentPage,
  };

  if (debouncedNameSearch) {
    params.name = debouncedNameSearch;
  }

  const { data: studentsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/user`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllUsers(
      debouncedNameSearch,
      debouncedPhoneSearch,
      currentPage
    ),
});

  let formattedData: any[] = [];

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-96">
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
            <DropdownMenu
              aria-label="Static Actions"
            >
              <DropdownItem key="name">الإسم</DropdownItem>
              <DropdownItem key="phone">رقم الهاتف</DropdownItem>
              <DropdownItem key="email">البريد الإلكتروني</DropdownItem>
              <DropdownItem key="last_active">أخر ظهور</DropdownItem>
              <DropdownItem key="status">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </div>

        <div className="flex gap-2 flex-wrap">
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
            تم الصرف
          </Button>
          <Button
            id="inactive"
            variant="flat"
            color={selectedStatus === "inactive" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            قيد المراجعة 
          </Button>
          <Button
            id="expired"
            variant="flat"
            color={selectedStatus === "expired" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            قادم
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
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={studentsData?.meta?.last_page}
          total={studentsData?.meta?.total}
        />
      </div>
    </>
  );
};
