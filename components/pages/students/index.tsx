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
  { name: "إسم الطالب", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكتروني", uid: "email" },
  { name: "البرامج الملحق بها", uid: "programs" },
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
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const debouncedPhoneSearch = useDebounce(phoneSearch, 500);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
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
      renew_date: formatDate(item.created_at) || "N/A",
      last_active: item.last_active_at || "N/A",
      status: {
        name: item.status_label?.label || "N/A",
        key: item.status_label?.key || null,
        color:
          item?.status_label?.color === "info"
            ? "warning"
            : item?.status_label?.color || "danger",
      },
    })) || [];

  const filteredData = useMemo(() => {
    if (selectedStatus === "all") return formattedData;

    return formattedData.filter((item: any) => {
      const userStatusKey = item?.status?.key;

      return userStatusKey === selectedStatus;
    });
  }, [formattedData, selectedStatus]);

  const sortedData = useMemo(() => {
    let dataToSort = [...filteredData];

    if (!sortKey) return dataToSort;

    return dataToSort.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === "status") {
        aVal = a.status?.name || "";
        bVal = b.status?.name || "";
      }

      if (sortKey === "phone") {
        aVal = aVal || "";
        bVal = bVal || "";
        return aVal.localeCompare(bVal, "ar", { numeric: true });
      }

      if (sortKey === "last_active") {
        return new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      return (aVal || "").toString().localeCompare(
        (bVal || "").toString(),
        "ar"
      );
    });
  }, [filteredData, sortKey]);

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative w-48">
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

          <div className="relative w-48">
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
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(key) => setSortKey(key as string)}
            >
              <DropdownItem key="name">الإسم</DropdownItem>
              <DropdownItem key="phone">رقم الهاتف</DropdownItem>
              <DropdownItem key="email">البريد الإلكتروني</DropdownItem>
              <DropdownItem key="last_active">أخر ظهور</DropdownItem>
              <DropdownItem key="status">الحالة</DropdownItem>
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
            id="inactive"
            variant="flat"
            color={selectedStatus === "inactive" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            متوقف
          </Button>
          <Button
            id="expired"
            variant="flat"
            color={selectedStatus === "expired" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            منتهي
          </Button>
          <Button
            id="no_subscriptions"
            variant="flat"
            color={selectedStatus === "no_subscriptions" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            غير مشترك
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <TableComponent
          columns={columns}
          data={sortedData}
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
