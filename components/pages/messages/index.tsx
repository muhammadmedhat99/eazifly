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
    User,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";

export const Messages = () => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [selectedStatus, setSelectedStatus] = useState("1");

    return (
        <>
            <div className="p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative md:min-w-80">
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
                        مقروء
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
                        غير مقروء
                    </Button>
                </div>
            </div>

            
                <>
                    <div className="bg-main">
                        <div className="flex justify-between border-b p-5">
                            <div className="flex items-center gap-3">
                                <span className="text-red-500 font-bold text-sm">جديد</span>
                                <User
                                    avatarProps={{
                                        radius: "full",
                                        src: "",
                                        size: "md",
                                    }}
                                    description={
                                        <span className="text-sm font-semibold text-[#3D5066]">
                                            {`مثال رسالة`}
                                        </span>
                                    }
                                    name={
                                        <span className="text-start text-sm font-bold">
                                            {'احمد محمد'}
                                        </span>
                                    }
                                />
                            </div>
                            <span className="text-start text-xs font-bold text-[#3D5066]">
                                Feb 2025 11:45pm
                            </span>
                        </div>
                        <div className="flex justify-between border-b p-5">
                            <div className="flex items-center gap-3">
                                <span className="text-red-500 font-bold text-sm">جديد</span>
                                <User
                                    avatarProps={{
                                        radius: "full",
                                        src: "",
                                        size: "md",
                                    }}
                                    description={
                                        <span className="text-sm font-semibold text-[#3D5066]">
                                            {`مثال رسالة`}
                                        </span>
                                    }
                                    name={
                                        <span className="text-start text-sm font-bold">
                                            {'احمد محمد'}
                                        </span>
                                    }
                                />
                            </div>
                            <span className="text-start text-xs font-bold text-[#3D5066]">
                                Feb 2025 11:45pm
                            </span>
                        </div>
                    </div>
                </>
        </>
    );
};
