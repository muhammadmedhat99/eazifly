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
import { useParams } from "next/navigation";

type StudentDetailsProps = {
    data: {
        data: {
            id: number;
            first_name: string;
            last_name: string;
            user_name: string;
            email: string;
            phone: string;
            whats_app: string;
            image: string;
            created_at: string;
            status_label: {
                label: string;
                color: string;
            };
            childrens: {
                id: number;
                first_name: string;
                last_name: string;
                user_name: string;
                email: string;
                phone: string;
                whats_app: string;
                image: string;
                gender: string;
                age: string;
                status_label: {
                    label: string;
                    color: string;
                };
                programs: any[];
                chat_id: number;
            }[];
        };
    };
};

const statusOptions: any = {
    all: "الكل",
    pending: "قيد الانتظار",
    started: "بدأت",
    ended: "انتهت",
    canceled: "تم الإلغاء",
    missed: "فائتة",
    finished: "مكتملة",
};


const columns = [
    { name: "", uid: "avatar" },
    { name: "الطالب", uid: "name_link" },
    { name: "المعلم", uid: "instructor_link" },
    { name: "تاريخ الحصة", uid: "session_date" },
    { name: "ميعاد الحصة", uid: "session_time" },
    { name: "البرنامج التابع للحصة", uid: "program" },
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

export const Sessions = ({ data }: StudentDetailsProps) => {
    const param = useParams();
    const user_id = param.id;
    const [nameSearch, setNameSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const debouncedNameSearch = useDebounce(nameSearch, 500);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentSearch, setStudentSearch] = useState("");
    const [programSearch, setProgramSearch] = useState("");
    const [showProgramDropdown, setShowProgramDropdown] = useState(false);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);
    const [selecteStudentId, setSelecteStudentId] = useState<number | null>(null);
    const debouncedProgramSearch = useDebounce(programSearch, 500);

    const params: Record<string, string | number | boolean> = {
        page: currentPage,
    };

    if (selecteStudentId !== null) {
        params.user_id = selecteStudentId;
    }

    if (selectedInstructorId !== null) {
        params.instructor_id = selectedInstructorId;
    }

    if (selectedProgramId !== null) {
        params.program_id = selectedProgramId;
    }

    if (debouncedNameSearch) {
        params.name = debouncedNameSearch;
    }


    if (selectedStatus !== "all") {
        params.status = selectedStatus;
    }


    const { data: sessionsData, isLoading } = useQuery({
        queryFn: async () =>
            await fetchClient(`client/user/get/sessions/with/child/${user_id}`, {
                ...axios_config,
                params,
            }),
        queryKey: AllQueryKeys.GetStudentSessions(
            debouncedNameSearch,
            currentPage,
            selectedStatus,
            selecteStudentId,
            selectedInstructorId,
            selectedProgramId,


        ),
    });

    const formattedData =
        sessionsData?.data?.map((item: any) => ({
            id: item.id,
            avatar: item.users[0]?.user_image || null,
            name_link: item.users[0]?.user_name || "N/A",
            user_id: item.users[0]?.id || null,
            instructor_id: item.instructor_id || null,
            instructor_link: item.instructor || "N/A",
            session_date: item.session_date || "N/A",
            session_time: item.session_time || "N/A",
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


    const { data: teachersData, isLoading: isTeachersLoading } = useQuery({
        queryFn: async () =>
            await fetchClient(`client/instructors?status=active&per_page=9999`, {
                ...axios_config,
                params,
            }),
        queryKey: AllQueryKeys.GetAllInstructors("", "", "", 1),
    });

    const { data: programsData, isLoading: isProgramsLoading } = useQuery({
        queryFn: async () =>
            await fetchClient(`client/program?status=published&per_page=9999`, {
                ...axios_config,
                params: { name: debouncedProgramSearch },
            }),
        queryKey: AllQueryKeys.GetAllPrograms("", 1),
    });

    const filteredTeachers =
        teachersData?.data?.filter((t: any) =>
            (t?.name || "").toLowerCase().includes((nameSearch || "").toLowerCase())
        ) || [];

    const studentDropdownRef = useRef<HTMLDivElement>(null);
    const instructorDropdownRef = useRef<HTMLDivElement>(null);
    const programDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                studentDropdownRef.current &&
                !studentDropdownRef.current.contains(event.target as Node)
            ) {
                setShowStudentDropdown(false);
            }
            if (
                instructorDropdownRef.current &&
                !instructorDropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }

            if (
                programDropdownRef.current &&
                !programDropdownRef.current.contains(event.target as Node)
            ) {
                setShowProgramDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="p-4 flex items-center justify-between flex-wrap sm:flex-nowrap gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="relative md:min-w-24" ref={studentDropdownRef}>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <SearchNormal1
                                    size="18"
                                    className="text-gray-400"
                                    variant="Outline"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="بحث باسم الطالب..."
                                className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                                value={studentSearch}
                                onChange={(e) => {
                                    setStudentSearch(e.target.value);
                                    setShowStudentDropdown(true);
                                    setSelecteStudentId(null);
                                }}
                                onFocus={() => setShowStudentDropdown(true)}
                            />

                            {showStudentDropdown && (
                                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                    {data?.data?.childrens?.length ? (
                                        data?.data?.childrens.map((student: any) => (
                                            <li
                                                key={student.id}
                                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                onClick={() => {
                                                    setStudentSearch(`${student.first_name} ${student.last_name}`);
                                                    setSelecteStudentId(student.id);
                                                    setShowStudentDropdown(false);
                                                }}
                                            >
                                                {student.image && (
                                                    <img
                                                        src={student.image}
                                                        alt={student.title}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                {`${student.first_name} ${student.last_name}`}
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
                        <div className="relative md:min-w-24" ref={instructorDropdownRef}>
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
                        <div className="relative md:min-w-24" ref={programDropdownRef}>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <SearchNormal1
                                    size="18"
                                    className="text-gray-400"
                                    variant="Outline"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="بحث باسم البرنامج..."
                                className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                                value={programSearch}
                                onChange={(e) => {
                                    setProgramSearch(e.target.value);
                                    setShowProgramDropdown(true);
                                    setSelectedProgramId(null);
                                }}
                                onFocus={() => setShowProgramDropdown(true)}
                            />

                            {showProgramDropdown && (
                                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                    {isProgramsLoading ? (
                                        <li className="px-4 py-2 text-gray-500 text-sm">
                                            جاري التحميل...
                                        </li>
                                    ) : programsData?.data?.length ? (
                                        programsData.data.map((program: any) => (
                                            <li
                                                key={program.id}
                                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                onClick={() => {
                                                    setProgramSearch(program.title);
                                                    setSelectedProgramId(program.id);
                                                    setShowProgramDropdown(false);
                                                }}
                                            >
                                                {program.image && (
                                                    <img
                                                        src={program.image}
                                                        alt={program.title}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                {program.title}
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
                </div>

            </div>
            {isLoading ? (
                <TableSkeleton columns={columns} rows={6} />
            ) : (
                <TableComponent
                    columns={columns}
                    data={formattedData}
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
