"use client";

import React, { useState } from "react";

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
  { name: "عنوان الوظيفة", uid: "title" },
  { name: "القسم", uid: "department" },
  { name: "حالة الوظيفة", uid: "status" },
  { name: "عدد ( الموظفين / المقدمين )", uid: "count" },
  { name: <Options />, uid: "actions" },
];

const staticData = [
  {
    id: 1,
    title: "مهندس برمجيات",
    department: "تكنولوجيا المعلومات",
    status: {
      name: "نشط",
      color: "success",
    },
    count: "20",
  },
  {
    id: 2,
    title: "مسؤول موارد بشرية",
    department: "الموارد البشرية",
    status: {
      name: "مشغولة",
      color: "danger",
    },
    count: "3",
  },
  {
    id: 3,
    title: "محاسب",
    department: "المالية",
    status: {
      name: "جاري البحث",
      color: "warning",
    },
    count: "2",
  },
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
        <DropdownItem href={`/hr/jobs/${id}`} key="show">
          عرض الموظفين
        </DropdownItem>
        <DropdownItem key="edit">تعديل</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const AllJobs = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("1");

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
              <DropdownItem key="show">عنوان الوظيفة</DropdownItem>
              <DropdownItem key="edit">القسم</DropdownItem>
              <DropdownItem key="add-to-course">حالة الوظيفة</DropdownItem>
              <DropdownItem key="change-password">
                عدد ( الموظفين / المقدمين )
              </DropdownItem>
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
            الوظائف المشغولة
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
            الوظائف الشاغرة
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
            جاري البحث
          </Button>
        </div>
      </div>

        <TableComponent
          columns={columns}
          data={staticData}
          ActionsComponent={OptionsComponent}
        />

      <div className="my-10 px-6">
        <CustomPagination />
      </div>
    </>
  );
};
