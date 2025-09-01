"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import {
  Button,
  CalendarDate,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  SearchNormal1,
} from "iconsax-reactjs";
import { CustomPagination } from "@/components/global/Pagination";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { Loader } from "@/components/global/Loader";
import { parseDate, today } from "@internationalized/date";
import TableSkeleton from "@/components/global/TableSkeleton";

import { formatDate } from "@/lib/helper";

const columns = [
  { name: "", uid: "avatar" },
  { name: "الطالب", uid: "name" },
  { name: "المعلم", uid: "instructor" },
  { name: "تاريخ الحصة", uid: "session_date" },
  { name: "البرامج التابع للحصة", uid: "program" },
  { name: "موعد تجديد الطالب", uid: "session_time" },
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
        <DropdownItem href={`/sessions/${id}`} key="show">
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

export const AllSessions = () => {
  const [nameSearch, setNameSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<any>(today("UTC"));
  const debouncedDateSearch = useDebounce(selectedDate, 500);

  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);

  const params: Record<string, string | number | boolean> = {
    page: currentPage,
  };

  if (selectedInstructorId) {
    params.instructor_id = selectedInstructorId;
  } else if (debouncedNameSearch) {
    params.name = debouncedNameSearch;
  } else {
    params.parent = "true";
  }

  if (debouncedNameSearch) {
    params.name = debouncedNameSearch;
  }

  if (!debouncedNameSearch) {
    params.parent = "true";
  }

  if (debouncedDateSearch) {
    params.date = debouncedDateSearch.toString();
  }

  const { data: sessionsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/all/sessions`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllSessions(
      debouncedNameSearch,
      debouncedDateSearch.toString(),
      currentPage
    ),
  });

  const formattedData =
    sessionsData?.data?.map((item: any) => ({
      id: item.id,
      avatar: item.users[0]?.user_image || null,
      name: item.users[0]?.user_name || "N/A",
      instructor: item.instructor || "N/A",
      session_date: item.session_date || "N/A",
      program: item.program_title || "N/A",
      status: {
        name: item.status?.label || "N/A",
        key: item.status?.key || null,
        color:
          item?.status?.color === "info"
            ? "warning"
            : item?.status?.color || "danger",
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

      return (aVal || "")
        .toString()
        .localeCompare((bVal || "").toString(), "ar");
    });
  }, [filteredData, sortKey]);

  const { data: teachersData, isLoading: isTeachersLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/instructors`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllInstructors("", "", 1),
  });

  const filteredTeachers =
    teachersData?.data?.filter((t: any) =>
      t.name.toLowerCase().includes(nameSearch.toLowerCase())
    ) || [];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dayName = (date: CalendarDate) => {
    const jsDate = new Date(date.toString());
    return new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(jsDate);
  };

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:min-w-48" ref={dropdownRef}>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchNormal1
                  size="18"
                  className="text-gray-400"
                  variant="Outline"
                />
              </div>
              <input
                type="text"
                placeholder="بحث باسم المعلم..."
                className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                value={nameSearch}
                onChange={(e) => {
                  setNameSearch(e.target.value);
                  setShowDropdown(true);
                  setSelectedInstructorId(null);
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {showDropdown && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                  {isTeachersLoading ? (
                    <li className="px-4 py-2 text-gray-500 text-sm">
                      جاري التحميل...
                    </li>
                  ) : filteredTeachers.length ? (
                    filteredTeachers.map((teacher: any) => (
                      <li
                        key={teacher.id}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setNameSearch(teacher.name);
                          setSelectedInstructorId(teacher.id);
                          setShowDropdown(false);
                        }}
                      >
                        <img
                          src={teacher.image}
                          alt={teacher.name}
                          className="w-6 h-6 rounded-full"
                        />
                        {teacher.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 text-sm">
                      لا يوجد نتائج
                    </li>
                  )}
                </ul>
              )}
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

        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg shadow-md text-center w-28">
            {dayName(selectedDate)}
          </div>
          <button
            onClick={() => {
              console.log("h", selectedDate.toString());

              setSelectedDate(selectedDate.subtract({ days: 1 }));
            }}
            className="font-semibold w-fit p-0 bg-primary/10 rounded p-3 rounded-lg"
          >
            <ArrowRight2 size={14} color={"blue"} />
          </button>
          <DatePicker
            className="max-w-[284px]"
            value={selectedDate}
            onChange={setSelectedDate}
          />
          <button
            onClick={() => {
              // 🆕 Move one day forward
              setSelectedDate(selectedDate.add({ days: 1 }));
            }}
            className="font-semibold w-fit p-0 bg-primary/10 rounded p-3 rounded-lg"
          >
            <ArrowLeft2 size={14} color={"blue"} />
          </button>
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
            id="finished"
            variant="flat"
            color={selectedStatus === "finished" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            حضور
          </Button>
          <Button
            id="missed"
            variant="flat"
            color={selectedStatus === "missed" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            غياب
          </Button>
          <Button
            id="canceled"
            variant="flat"
            color={selectedStatus === "canceled" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            ملغية
          </Button>
          <Button
            id="ended"
            variant="flat"
            color={selectedStatus === "ended" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            انتهت
          </Button>
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton columns={columns} rows={6} />
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
          last_page={sessionsData?.meta?.last_page}
          total={sessionsData?.meta?.total}
        />
      </div>
    </>
  );
};
