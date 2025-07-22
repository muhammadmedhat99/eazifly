"use client";
import { Options } from "@/components/global/Icons";
import { Loader } from "@/components/global/Loader";
import { CustomPagination } from "@/components/global/Pagination";
import TableComponent from "@/components/global/Table";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { fetchClient } from "@/lib/utils";
import {
  Avatar,
  AvatarGroup,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";

const columns = [
  { name: "صورة البرنامج", uid: "image" },
  { name: "إسم البرنامج", uid: "program_name" },
  { name: "المعلمين المشتركين", uid: "related_teachers" },
  { name: "عدد الطلاب المشتركين", uid: "all_students" },
  { name: "عدد الحصص", uid: "number_of_lessons" },
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
        <DropdownItem href={`/programs/${id}`} key="show">
          عرض البيانات
        </DropdownItem>
        <DropdownItem href={`/programs/update/${id}`} key="edit">تعديل البيانات</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const AllPrograms = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allPrograms, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(
        `client/program?search=${debouncedSearch}&page=${currentPage}`,
        axios_config
      ),
    queryKey: AllQueryKeys.GetAllPrograms(debouncedSearch, currentPage),
  });

  const tableData = allPrograms?.data?.map((item: any) => ({
    id: item?.id,
    image: (
      <Image
        src={item?.image || "/img/static/program_image.png"}
        alt="table image"
        width={1440}
        height={120}
        className="h-10 w-full object-cover"
      />
    ),
    program_name: item?.title || "N/A",
    related_teachers: (
      <AvatarGroup isBordered max={3}>
        {item?.instructurs?.map((instructor: any) => (
          <Avatar
            key={instructor?.id}
            src={instructor?.image}
            name={instructor?.name}
            showFallback
          />
        ))}
      </AvatarGroup>
    ),
    all_students: item?.number_of_students,
    number_of_lessons: item?.number_of_sessions,
    status: {
      name: item.status?.label || "N/A",
      key: item.status?.key || null,
      color:
        item?.status?.color || null,
    },
  }));

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
        <>
          <TableComponent
            columns={columns}
            data={tableData}
            ActionsComponent={OptionsComponent}
          />

          <div className="my-10 px-6">
            <CustomPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              last_page={allPrograms?.meta?.last_page}
              total={allPrograms?.meta?.total}
            />
          </div>
        </>
      )}
    </>
  );
};
