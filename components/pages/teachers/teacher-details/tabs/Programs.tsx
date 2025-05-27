"use client";

import React, { useState } from "react";
import { Card, Edit2, SearchNormal1 } from "iconsax-reactjs";
import Link from "next/link";
import { Avatar, AvatarGroup, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs } from "@heroui/react";
import { Options } from "@/components/global/Icons";

const OptionsComponent = () => {
      return (
        <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
          <DropdownTrigger>
            <button>
              <Options />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit">تعديل</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    };

export const Programs = () => {
    const [search, setSearch] = useState("");
    const [selectedTab, setSelectedTab] = useState<string>("upcoming-lectures");

    return (
        <div className="p-4">
            <div className="p-4 bg-white rounded-lg border border-stroke">
                <div className="p-5 bg-white rounded-xl outline outline-1 outline-blue-600">
                    <div className="flex flex-col gap-2">
                        <span className="text-primary text-sm font-bold">إسم البرنامج</span>
                        <span className="text-[#272727] text-sm font-bold">برنامج مادة الرياضيات للصف السادس</span>
                    </div>
                    <div className="py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                            <div className="flex flex-col gap-4">
                                <span className="text-[#5E5E5E] text-sm font-bold text-primary">عدد الطلاب المشتركين</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    12
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                            <div className="flex flex-col gap-4">
                                <span className="text-[#5E5E5E] text-sm font-bold text-primary">عدد الطلاب المشتركين</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    12
                                </span>
                            </div>
                            <Link href="#" className="flex items-center gap-1">
                                <Edit2 size={18} className="text-primary" />
                            </Link>
                        </div>
                        <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                            <div className="flex flex-col gap-4">
                                <span className="text-[#5E5E5E] text-sm font-bold text-primary">نسبة التجديد</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    78.3 %
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                            <div className="flex flex-col gap-4">
                                <span className="text-primary text-sm font-bold">حالة البرنامج</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#0A9C71] rounded-2xl" />
                                    <div
                                        className={`text-[#0A9C71] font-bold text-[15px]`}
                                    >
                                        نشط
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Search Box */}
                            <div className="relative min-w-80">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <SearchNormal1 size="18" className="text-gray-400" variant="Outline" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="أكتب للبحث..."
                                    className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Tabs */}
                            <div className="p-2 bg-white rounded-lg border border-stroke">
                                <div className="flex w-full flex-col">
                                    <Tabs
                                        aria-label="Options"
                                        color="primary"
                                        size="lg"
                                        className="w-full text-[#272727]"
                                        selectedKey={selectedTab}
                                         onSelectionChange={(key) => setSelectedTab(key.toString())} 
                                    >
                                        <Tab key="upcoming-lectures" title={<span className="text-xs font-bold group-data-[selected=true]:text-white">المحاضرات القادمة</span>} />
                                        <Tab key="program-lectures" title={<span className="text-xs font-bold group-data-[selected=true]:text-white">محاضرات البرنامج</span>} />
                                        <Tab key="students" title={<span className="text-xs font-bold group-data-[selected=true]:text-white">الطلاب المشتركين</span>} />
                                        <Tab key="reports" title={<span className="text-xs font-bold group-data-[selected=true]:text-white">التقارير</span>} />
                                        <Tab key="exams" title={<span className="text-xs font-bold group-data-[selected=true]:text-white">الإمتحانات</span>} />
                                    </Tabs>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            {selectedTab === "upcoming-lectures" && (
                               <div className="flex flex-col justify-start gap-2">
                                    <div className="p-4 bg-white rounded-lg border border-stroke flex justify-between items-center">
                                        <div className="flex flex-col justify-start items-center gap-1">
                                            <div className="text-xs font-bold font text-[#3D5066]">تاريخ المحاضرة</div>
                                            <div className="text-center justify-start text-sm font-bold font text-[#272727]">الإثنين 12-3-2025</div>
                                        </div>
                                        <div className="flex flex-col justify-start items-center gap-1">
                                            <div className="text-xs font-bold font text-[#3D5066]">وقت المحاضرة</div>
                                            <div className="text-center justify-start text-sm font-bold font text-[#272727]">12 :30 PM</div>
                                        </div>
                                        <div className="flex flex-col justify-start items-center gap-1">
                                            <div className="text-xs font-bold font text-[#3D5066]">مدة المحاضرة</div>
                                            <div className="text-center justify-start text-sm font-bold font text-[#272727]">45 دقيقة</div>
                                        </div>
                                        <div className="flex flex-col justify-start items-center gap-1">
                                            <div className="text-xs font-bold font text-[#3D5066]">الطلاب</div>
                                            <AvatarGroup isBordered max={3}>
                                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                                            </AvatarGroup>
                                        </div>
                                        <OptionsComponent/>
                                    </div>
                                </div>
                            )}
                            {selectedTab === "program-lectures" && (
                                <div>
                                    <h2 className="text-lg font-bold mb-2">محاضرات البرنامج</h2>
                                    {/* محتوى محاضرات البرنامج */}
                                </div>
                            )}
                            {selectedTab === "students" && (
                                <div>
                                    <h2 className="text-lg font-bold mb-2">الطلاب المشتركين</h2>
                                    {/* محتوى الطلاب المشتركين */}
                                </div>
                            )}
                            {selectedTab === "reports" && (
                                <div>
                                    <h2 className="text-lg font-bold mb-2">التقارير</h2>
                                    {/* محتوى التقارير */}
                                </div>
                            )}
                            {selectedTab === "exams" && (
                                <div>
                                    <h2 className="text-lg font-bold mb-2">الإمتحانات</h2>
                                    {/* محتوى الإمتحانات */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
