"use client";
import { Options } from "@/components/global/Icons";
import { CustomPagination } from "@/components/global/Pagination";
import TableComponent from "@/components/global/Table";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Avatar,
  AvatarGroup,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";

const columns = [
  { name: "صورة الغلاف", uid: "image" },
  { name: "إسم البرنامج", uid: "program_name" },
  { name: "المعلمين المشتركين", uid: "related_teachers" },
  { name: "عدد الطلاب المشتركين", uid: "all_students" },
  { name: "عدد الحصص", uid: "number_of_lessons" },
  { name: "حالة البرنامج", uid: "order_status" },
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
        <DropdownItem key="edit">تعديل البيانات</DropdownItem>
        <DropdownItem key="add-to-course">إلحاق ببرنامج</DropdownItem>
        <DropdownItem key="change-password">تغيير كلمة المرور</DropdownItem>
        <DropdownItem key="send-mail">إرسال رسالة</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const data = [
  {
    id: "1",
    image: (
      <Image
        src="/img/static/program_image.png"
        alt="table image"
        width={1440}
        height={120}
        className="h-10 w-full object-cover"
      />
    ),
    program_name: "الرياضيات للصف السادس",
    related_teachers: (
      <AvatarGroup isBordered max={3}>
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
      </AvatarGroup>
    ),
    all_students: 10,
    number_of_lessons: 120,
    order_status: { name: "جاري", color: "success" },
  },
];

export const AllPrograms = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
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

      <TableComponent
        columns={columns}
        data={data}
        ActionsComponent={OptionsComponent}
      />

      <div className="my-10 px-6">
        <CustomPagination />
      </div>
    </>
  );
};
