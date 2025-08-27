"use client";

import React, { useEffect, useState } from "react";

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
import StudentModal from "./StudentModal";

const columns = [
  { name: "إسم الطالب", uid: "renewal_student_name" },
  { name: "بيانات التواصل", uid: "contact_info" },
  { name: "أخر موعد تواصل", uid: "last_contact_days" },
  { name: "قيمة التجديد", uid: "renewal_amount" },
  { name: "موعد التجديد", uid: "renewal_date" },
  { name: "متوسط أيام التجديد", uid: "avg_renewal_days" },
  { name: "حالة التجديد", uid: "status" },
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
        <DropdownItem key="send-alert">إرسال تنبيه</DropdownItem>
        <DropdownItem key="send-message">إرسال رسالة</DropdownItem>
        <DropdownItem key="pause-user">إيقاف مؤقت</DropdownItem>
        <DropdownItem key="delete-user">حذف</DropdownItem>
        <DropdownItem key="extend-subscription">تمديد الإشتراك</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const Renewals = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1);
  
    const params: Record<string, string | number> = {
      page: currentPage,
    };

  const handleRowClick = (student: any) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  useEffect(() => {
  const fetchStudentDetails = async () => {
    if (selectedStudent?.id) {
      try {
        const res = await fetchClient(
          `client/user/subscriptions/details/${selectedStudent.id}`,
          axios_config
        );
        setStudentDetails(res.data); 
      } catch (error) {
        console.error("error while fetching data:", error);
        setStudentDetails(null);
      }
    }
  };

  if (modalOpen) {
    fetchStudentDetails();
  }
}, [selectedStudent, modalOpen]);

  const { data: renewalsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/user/subscriptions?search=${debouncedSearch}`, axios_config),
    queryKey: AllQueryKeys.GetAllUsers(debouncedSearch, '', currentPage),
  });

  const formattedData =
    renewalsData?.data?.map((item: any) => ({
      user_name: item.user_name,
      user_email: item.user_email,
      user_phone: item.user_phone,
      user_image: item.user_image,
      total_sessions: item.total_sessions,
      total_children: item.total_children,
      id: item.id,
      user_id: item.user_id,
      renewal_student_name: item.user_name,
      subscripe_date: item.subscripe_date ? formatDate(item.subscripe_date) : null,
      contact_info: {
      phone: item.user_phone,
      email: item.user_email,
      },
      last_contact_date: item.last_contact_date
        ? formatDate(item.last_contact_date)
        : null,
      last_contact_days: item.last_contact_days,
      renewal_amount: item.subscriped_price,
      renewal_date: item.expire_date ? formatDate(item.expire_date) : null,
      expire_date: item.expire_date,
      avg_renewal_days: item.average_renewal_days,
      subscription_status: {
        name: item.subscription_status?.status || "N/A",
        color:
          item?.subscription_status?.color === "dark"
            ? "danger"
            : item?.subscription_status?.color,
      },
      status: {
        name: item.renewal_status?.status || "N/A",
        color:
          item?.renewal_status?.color === "dark"
            ? "danger"
            : item?.renewal_status?.color,
      },
      status_label: {
        label: item.status_label?.label || "N/A",
        color:
          item?.status_label?.color === "dark"
            ? "danger"
            : item?.status_label?.color,
      },
    })).reverse() || [];

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative md:min-w-80 w-48">
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
              <DropdownItem key="date">أخر موعد تواصل</DropdownItem>
              <DropdownItem key="price">قيمة التجديد</DropdownItem>
              <DropdownItem key="status">حالة التجديد</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <TableComponent
          columns={columns}
          data={formattedData}
          ActionsComponent={OptionsComponent}
          handleRowClick={handleRowClick}
        />
      )}
      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={studentDetails}
      />

      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={renewalsData?.meta?.last_page}
          total={renewalsData?.meta?.total}
        />
      </div>
    </>
  );
};
