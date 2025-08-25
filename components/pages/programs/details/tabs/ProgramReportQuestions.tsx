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
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const columns = [
  { name: "عنوان السؤال", uid: "name" },
  { name: "نوع السؤال", uid: "type" },
  { name: "البرنامج", uid: "program" },
  { name: "نوع المستخدم", uid: "user_type" },
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

export const ProgramReportQuestions = ({ data, isLoading }: any) => {
  const [nameSearch, setNameSearch] = useState("");
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const pageParams = useParams();
  const program_id = pageParams.id;

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  if (debouncedNameSearch) {
    params.name = debouncedNameSearch;
  }

  const formattedData =
    data?.data?.map((item: any) => ({
      id: item.id,
      name: item.title,
      type: item.type || "",
      program: item.program?.title || "",
      discount_type: item.discount_type || "",
      user_type: item.user_type || "",
      created_at: formatDate(item.created_at) || "",
      programId: item.program?.id,
    })) || [];

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

        <Link
            href={`/programs/${program_id}/report-questions/create`}
            className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
          >
            أضافة سؤال  
        </Link>

      </div>
      {isLoading ? (
        <Loader />  
      ) : (
        <TableComponent
          columns={columns}
          data={formattedData}
          ActionsComponent={OptionsComponent}
          handleRowClick={(row: any) =>
            router.push(`/programs/${row.programId}/report-questions/${row.id}`)
        }
        />
      )}

      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={data?.meta?.last_page}
          total={data?.meta?.total}
        />
      </div>
    </>
  );
};
