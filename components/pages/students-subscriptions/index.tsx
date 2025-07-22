"use client";

import React, { useMemo, useState, useCallback } from "react";

import { useDebounce } from "@/lib/hooks/useDebounce";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { CustomPagination } from "@/components/global/Pagination";
import { Options } from "@/components/global/Icons";
import TableComponent from "@/components/global/Table";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import { formatDate } from "@/lib/helper";

const columns = [
  { name: "رقم الطلب", uid: "num" },
  { name: "إسم الطالب", uid: "name" },
  { name: "نوع الطلب", uid: "request_type" },
  { name: "نوع الإشتراك", uid: "type" },
  { name: "إسم البرنامج", uid: "courses" },
  { name: "قيمة الإشتراك", uid: "price" },
  { name: "تاريخ الطلب", uid: "created_at" },
  { name: "حالة الطلب", uid: "order_status" },
  { name: <Options />, uid: "actions" },
];

// Add a type for subscription items
interface SubscriptionItem {
  id: number;
  num: number;
  name: string;
  request_type: {
    name: string;
    key: string | null;
    color: string;
  };
  type: string;
  courses: string;
  price: string;
  created_at: string;
  order_status: {
    name: string;
    key: string | null;
    color: string;
  };
  avatar: string;
}

const OptionsComponent = ({ id }: { id: number }) => {
  return (
    <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
      <DropdownTrigger>
        <button>
          <Options />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="show" href={`/students/subscriptions/${id}`}>
          عرض الطلب
        </DropdownItem>
        <DropdownItem key="approve">موافقة</DropdownItem>
        <DropdownItem key="decline">رفض</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
        <DropdownItem key="send-message">إرسال رسالة</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const AllStudentsSubscriptions = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  if (debouncedSearch) {
    params.name = debouncedSearch;
  }
  if (selectedType && selectedType !== "all") {
    params.type = selectedType;
  }
  if (selectedStatus && selectedStatus !== "all") {
    params.status = selectedStatus;
  }

  const { data: studentsSubscriptions, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/order`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllStudentSubscriptions(
      debouncedSearch,
      selectedType,
      selectedStatus,
      currentPage
    ),
  });

  const formattedData: SubscriptionItem[] =
    studentsSubscriptions?.data.map((item: any) => ({
      id: item.id,
      num: item.id,
      name: item.user.name,
      request_type: {
        name: item?.type.label,
        key: item.type?.key || null,
        color: item?.type.color === "primary" ? "primary" : "success",
      },
      type: item?.subscription_type || "N/A",
      courses: item.order_details[0]?.program || "N/A",
      price: `${item.total_after_discount} ${item.currency || ""}`,
      created_at: formatDate(item?.created_at) || "N/A",
      order_status: {
        name: item.status.label || "N/A",
        key: item.status?.key || null,
        color: item.status.color,
      },
      avatar: item.image || "N/A",
    })) || [];

  const filteredData = useMemo(() => {
    return formattedData.filter((item: SubscriptionItem) => {
      let statusMatch = true;
      let typeMatch = true;

      if (selectedStatus && selectedStatus !== "all") {
        const userStatusKey = item?.order_status?.key;
        statusMatch = userStatusKey === selectedStatus;
      }

      if (selectedType && selectedType !== "all") {
        const userTypeKey = item?.request_type?.key;
        typeMatch = userTypeKey === selectedType;
      }

      return statusMatch && typeMatch;
    });
  }, [formattedData, selectedStatus, selectedType]);

  const sortedData = useMemo(() => {
    let dataToSort = [...filteredData];

    if (!sortKey) return dataToSort;

    return dataToSort.sort((a, b) => {
      let aVal = a[sortKey as keyof SubscriptionItem];
      let bVal = b[sortKey as keyof SubscriptionItem];

      if (sortKey === "status") {
        aVal = a.order_status?.name || "";
        bVal = b.order_status?.name || "";
        return (aVal as string).localeCompare(bVal as string, "ar");
      }

      if (sortKey === "created_at") {
        return (
          new Date(bVal as string).getTime() -
          new Date(aVal as string).getTime()
        );
      }

      if (sortKey === "courses") {
        aVal = a.courses || "";
        bVal = b.courses || "";
        return (aVal as string).localeCompare(bVal as string, "ar");
      }

      if (sortKey === "price") {
        const getPriceValue = (priceStr: any) => {
          if (!priceStr) return 0;
          const match = priceStr.match(/[\d,.]+/);
          return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
        };

        const aPrice = getPriceValue(a.price);
        const bPrice = getPriceValue(b.price);
        return aPrice - bPrice;
      }

      return (aVal || "")
        .toString()
        .localeCompare((bVal || "").toString(), "ar");
    });
  }, [filteredData, sortKey]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleSortKey = useCallback((key: string | number) => {
    setSortKey(key as string);
  }, []);

  const handleTypeChange = useCallback((key: string | number) => {
    setSelectedType(key as string);
  }, []);

  const handleStatusChange = useCallback((key: string | number) => {
    setSelectedStatus(key as string);
  }, []);

  return (
    <div>
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
              placeholder="بحث بالإسم..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={search}
              onChange={handleSearchChange}
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
            <DropdownMenu aria-label="Static Actions" onAction={handleSortKey}>
              <DropdownItem key="name">الإسم</DropdownItem>
              <DropdownItem key="courses">إسم البرنامج</DropdownItem>
              <DropdownItem key="price">قيمة الإشتراك</DropdownItem>
              <DropdownItem key="created_at">تاريخ الطلب</DropdownItem>
              <DropdownItem key="status">الحالة</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button variant="flat" className="font-semibold" radius="sm">
                حالة مرسل الطلب
                <ArrowDown2 size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static type" onAction={handleTypeChange}>
              <DropdownItem key="all">الكل</DropdownItem>
              <DropdownItem key="new">جديد</DropdownItem>
              <DropdownItem key="renew">تجديد</DropdownItem>
              <DropdownItem key="upgrade">ترقية</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button variant="flat" className="font-semibold" radius="sm">
                حالة الطلب
                <ArrowDown2 size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={handleStatusChange}
            >
              <DropdownItem key="all">الكل</DropdownItem>
              <DropdownItem key="approved">موافق عليه</DropdownItem>
              <DropdownItem key="new">جديد</DropdownItem>
              <DropdownItem key="canceled">ملغي</DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          last_page={studentsSubscriptions?.meta?.last_page}
          total={studentsSubscriptions?.meta?.total}
        />
      </div>
    </div>
  );
};
