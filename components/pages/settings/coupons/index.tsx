"use client";

import React, { useMemo, useState } from "react";
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
import { formatDate } from "@/lib/helper";

const columns = [
  { name: "كود الخصم", uid: "code" },
  { name: "قيمة الخصم", uid: "discount" },
  { name: "نوع الخصم", uid: "discount_type" },
  { name: "تاريخ الانتهاء", uid: "expire_date" },
  { name: "عدد مرات الاستخدام", uid: "times_used" },
  { name: "تم استخدامه مسبقًا", uid: "already_used" },
  { name: "الحالة", uid: "status" },
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

export const AllCoupons = () => {
  const [nameSearch, setNameSearch] = useState("");
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  if (debouncedNameSearch) {
    params.name = debouncedNameSearch;
  }

  const { data: couponsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/coupon`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllSpecializations
  });

  const formattedData =
    couponsData?.data?.map((item: any) => ({
      id: item.id,
      code: item.code || "",
      discount: item.discount || "",
      discount_type: item.discount_type || "",
      expire_date: item.expire_date || "",
      times_used: item.times_used || "",
      already_used: item.already_used || "",
      status: {
        name: item.status || "N/A",
        color:
          item?.status === "inactive"
            ? "warning"
            : "success",
      },
    })) || [];

  const filteredData = useMemo(() => {
    if (selectedStatus === "all") return formattedData;

    return formattedData?.filter((item: any) => {
      const userStatusKey = item?.status?.name;

      return userStatusKey === selectedStatus;
    });
  }, [formattedData, selectedStatus]);

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="relative md:min-w-80">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1 size="18" className="text-gray-400" variant="Outline" />
            </div>
            <input
              type="text"
              placeholder="بحث..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
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
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Button
            id="all"
            variant="flat"
            color={selectedStatus === "all" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            الكل
          </Button>
          <Button
            id="active"
            variant="flat"
            color={selectedStatus === "active" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            نشط
          </Button>
          <Button
            id="inactive"
            variant="flat"
            color={selectedStatus === "inactive" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => {
              setSelectedStatus(e.target.id);
            }}
          >
            مؤرشف
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <TableComponent
          columns={columns}
          data={filteredData}
          ActionsComponent={OptionsComponent}
        />
      )}

      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={couponsData?.meta?.last_page}
          total={couponsData?.meta?.total}
        />
      </div>
    </>
  );
};
