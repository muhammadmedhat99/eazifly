"use client";

import React, { useEffect, useState } from "react";
import { Card, Edit2, SearchNormal1 } from "iconsax-reactjs";
import Link from "next/link";
import {
  Avatar,
  AvatarGroup,
  Button,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import { Options } from "@/components/global/Icons";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Loader } from "@/components/global/Loader";
import TableComponent from "@/components/global/Table";
import { formatDate } from "@/lib/helper";
import { CustomPagination } from "@/components/global/Pagination";
import { User } from "@heroui/react";
import { Reports } from "@/components/pages/students/student-details/tabs/ProgramTabs/reports";
import AddTeacherModal from "@/components/pages/programs/details/tabs/AddTeacherModal";
import AddProgram from "./AddProgram";

const columns = [
  { name: "", uid: "avatar" },
  { name: "إسم الطالب", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكتروني", uid: "email" },
  { name: "موعد التجديد", uid: "expire_date" },
  { name: "تجديد الاشتراك بعد", uid: "DaysToExpire" },
];

const sessionsColumns = [
  { name: "تاريخ المحاضره", uid: "session_date" },
  { name: "وقت المحاضره", uid: "session_time" },
  { name: "مدة المحاضره", uid: "duration" },
  { name: "الطلاب", uid: "users" },
  { name: "حالة المحاضره", uid: "status" },
];

interface Program {
  id: number;
  title: string;
  number_of_students: number;
  renew_percentage: number;
  price_per_hour: string;
}

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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const instructor_id = params.id;
  const [nameSearch, setNameSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  const [tabsState, setTabsState] = useState<{
    [programId: number]: {
      selectedTab: string;
      search: string;
      sessions: any[];
      isSessionsLoading: boolean;
      meta?: any;
      students: any[];
      isStudentsLoading: boolean;
      metaStudents?: any;
      assignments: any[];
      isAssignmentsLoading: boolean;
      metaAssignments?: any;
      exams: any[];
      isExamsLoading: boolean;
      metaExams?: any;
      reports: any[];
      isReportsLoading: boolean;
      metaReports?: any;
    };
  }>({});

  const handleTabChange = (programId: number, tabKey: string) => {
    setTabsState((prev) => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {
          selectedTab: "program-lectures",
          search: "",
          students: [],
          isStudentsLoading: false,
        }),
        selectedTab: tabKey,
      },
    }));

    if (tabKey === "students") {
      fetchStudents(programId);
    } else if (tabKey === "assignments") {
      fetchAssignments(programId);
    } else if (tabKey === "exams") {
      fetchExams(programId);
    } else if (tabKey === "reports") {
      fetchReports(programId);
    } else if (tabKey === "program-lectures") {
      setCurrentPage(1);
      fetchSessions(programId);
    }
  };

  const fetchSessions = async (programId: number, page: number = 1) => {
    setTabsState((prev) => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        isSessionsLoading: true,
      },
    }));

    try {
      const queryString = buildQueryParams(programId, page);
      const res = await fetchClient(
        `client/instructor/program/sessions?${queryString}`,
        axios_config
      );

      const formattedSessions =
        res?.data?.map((item: any) => ({
          id: item.id,
          session_date: item.session_date,
          session_time: item.session_time,
          duration: `${item.duration} دقيقة`,
          users: (
            <AvatarGroup isBordered max={3}>
              {item?.users?.map((user: any) => (
                <Avatar
                  key={user?.id}
                  src={user?.user_image}
                  name={user?.user_name}
                  showFallback
                />
              ))}
            </AvatarGroup>
          ),
          status: {
            name: item.status?.label || "N/A",
            color:
              item?.status?.color === "info" ? "warning" : item?.status?.color,
          },
        })) || [];

      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          sessions: formattedSessions,
          isSessionsLoading: false,
          meta: res?.meta || null,
        },
      }));
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          sessions: [],
          isSessionsLoading: false,
          meta: null,
        },
      }));
    }
  };

  const fetchStudents = async (programId: number, page: number = 1) => {
    setTabsState((prev) => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        isStudentsLoading: true,
      },
    }));

    try {
      const res = await fetchClient(
        `client/instructor/user/subscriptions?program_id=${programId}&instructor_id=${instructor_id}&per_page=5&page=${page}`,
        axios_config
      );

      const formattedStudents =
        res?.data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          avatar: item.image,
          phone: item.phone,
          email: item.email,
          created_at: item.user_created_at,
          expire_date: item.expire_date,
          DaysToExpire: `${item.DaysToExpire} يوم`,
        })) || [];

      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          students: formattedStudents,
          isStudentsLoading: false,
          metaStudents: res?.meta || null,
        },
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          students: [],
          isStudentsLoading: false,
          metaStudents: null,
        },
      }));
    }
  };

  const fetchAssignments = async (programId: number, page: number = 1) => {
    setTabsState((prev) => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        isAssignmentsLoading: true,
      },
    }));

    try {
      const res = await fetchClient(
        `client/instructor/assignment?program_id=${programId}&instructor_id=${instructor_id}&per_page=5&page=${page}`,
        axios_config
      );

      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          assignments: res?.data || [],
          isAssignmentsLoading: false,
          metaAssignments: res?.meta || null,
        },
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          assignments: [],
          isAssignmentsLoading: false,
          metaAssignments: null,
        },
      }));
    }
  };

  const fetchExams = async (programId: number, page: number = 1) => {
    setTabsState((prev) => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        isExamsLoading: true,
      },
    }));

    try {
      const res = await fetchClient(
        `client/instructor/quizzes?program_id=${programId}&instructor_id=${instructor_id}&per_page=5&page=${page}`,
        axios_config
      );

      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          exams: res?.data || [],
          isExamsLoading: false,
          metaExams: res?.meta || null,
        },
      }));
    } catch (error) {
      console.error("Error fetching exams:", error);
      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          exams: [],
          isExamsLoading: false,
          metaExams: null,
        },
      }));
    }
  };

  const fetchReports = async (programId: number, page: number = 1) => {
    setTabsState((prev) => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        isReportsLoading: true,
      },
    }));

    try {
      const res = await fetchClient(
        `client/instructor/reports/${instructor_id}/?program_id=${programId}&per_page=5&page=${page}`,
        axios_config
      );

      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          reports: res || [],
          isReportsLoading: false,
          metaReports: res?.meta || null,
        },
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      setTabsState((prev) => ({
        ...prev,
        [programId]: {
          ...(prev[programId] || {}),
          reports: [],
          isReportsLoading: false,
          metaReports: null,
        },
      }));
    }
  };

  useEffect(() => {
    Object.entries(tabsState).forEach(([programId, tabState]) => {
      const fetchMap: Record<string, (id: number, page: number) => void> = {
        "program-lectures": fetchSessions,
        students: fetchStudents,
        assignments: fetchAssignments,
        exams: fetchExams,
        reports: fetchReports,
      };

      const fetchFn = fetchMap[tabState.selectedTab];
      if (fetchFn) {
        fetchFn(Number(programId), currentPage);
      }
    });
  }, [nameSearch, dateSearch, currentPage]);

  const { data, isLoading } = useQuery({
    queryKey: [`GetInstructorPrograms`],
    queryFn: async () =>
      await fetchClient(
        `client/instructor/programs/${instructor_id}`,
        axios_config
      ),
  });

  useEffect(() => {
    if (data?.data) {
      data.data.forEach((program: Program) => {
        setTabsState((prev) => {
          if (!prev[program.id]) {
            fetchSessions(program.id);
            return {
              ...prev,
              [program.id]: {
                selectedTab: "program-lectures",
                search: "",
                students: [],
                isStudentsLoading: false,
                sessions: [],
                isSessionsLoading: true,
                assignments: [],
                isAssignmentsLoading: false,
                exams: [],
                isExamsLoading: false,
                reports: [],
                isReportsLoading: false,
                metaReports: null,
              },
            };
          }
          return prev;
        });
      });
    }
  }, [data]);

  const buildQueryParams = (programId: number, page: number = 1) => {
    if (!instructor_id) return "";
    const params = new URLSearchParams({
      program_id: programId.toString(),
      instructor_id: instructor_id.toString(),
      per_page: "5",
      page: page.toString(),
    });
    if (nameSearch) params.append("name", nameSearch);
    if (dateSearch) params.append("date", dateSearch);
    return params.toString();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        data.data.length > 0 && <div className="p-4 grid grid-cols-1 gap-5">
          {data.data.map((program: Program, index: number) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-stroke"
            >
              <div className="p-5 bg-white rounded-xl outline outline-1 outline-blue-600">
                <div className="flex flex-col gap-2">
                  <span className="text-primary text-sm font-bold">
                    إسم البرنامج
                  </span>
                  <span className="text-[#272727] text-sm font-bold">
                    {program.title}
                  </span>
                </div>
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                    <div className="flex flex-col gap-4">
                      <span className="text-[#5E5E5E] text-sm font-bold text-primary">
                        عدد الطلاب المشتركين
                      </span>
                      <span className="text-black-text font-bold text-[15px]">
                        {program.number_of_students}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                    <div className="flex flex-col gap-4">
                      <span className="text-[#5E5E5E] text-sm font-bold text-primary">
                        سعر ساعة البرنامج
                      </span>
                      <span className="text-black-text font-bold text-[15px]">
                        {program.price_per_hour} ج.م
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-main p-5 rounded-xl border border-stroke">
                    <div className="flex flex-col gap-4">
                      <span className="text-[#5E5E5E] text-sm font-bold text-primary">
                        نسبة التجديد
                      </span>
                      <span className="text-black-text font-bold text-[15px]">
                        {program.renew_percentage} %
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Search Box */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-64">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <SearchNormal1
                            size="18"
                            className="text-gray-400"
                            variant="Outline"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="بحث بالاسم..."
                          className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                          value={nameSearch}
                          onChange={(e) => setNameSearch(e.target.value)}
                        />
                      </div>

                      <div className="relative w-64">
                        <input
                          type="date"
                          className="w-full py-2 h-11 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                          value={dateSearch}
                          onChange={(e) => setDateSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="p-2 bg-white rounded-lg border border-stroke">
                      <div className="flex w-full flex-col">
                        <Tabs
                          aria-label="Options"
                          color="primary"
                          size="lg"
                          className="w-full text-[#272727]"
                          selectedKey={
                            tabsState[program.id]?.selectedTab ||
                            "program-lectures"
                          }
                          onSelectionChange={(key) =>
                            handleTabChange(program.id, key.toString())
                          }
                        >
                          <Tab
                            key="program-lectures"
                            title={
                              <span className="text-xs font-bold group-data-[selected=true]:text-white">
                                محاضرات البرنامج
                              </span>
                            }
                          />
                          <Tab
                            key="students"
                            title={
                              <span className="text-xs font-bold group-data-[selected=true]:text-white">
                                الطلاب المشتركين
                              </span>
                            }
                          />
                          <Tab
                            key="reports"
                            title={
                              <span className="text-xs font-bold group-data-[selected=true]:text-white">
                                التقارير
                              </span>
                            }
                          />
                          <Tab
                            key="assignments"
                            title={
                              <span className="text-xs font-bold group-data-[selected=true]:text-white">
                                التسليمات
                              </span>
                            }
                          />
                          <Tab
                            key="exams"
                            title={
                              <span className="text-xs font-bold group-data-[selected=true]:text-white">
                                الإمتحانات
                              </span>
                            }
                          />
                        </Tabs>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    {tabsState[program.id]?.selectedTab ===
                      "program-lectures" &&
                      (tabsState[program.id]?.isSessionsLoading ? (
                        <Loader />
                      ) : (
                        <>
                          <TableComponent
                            columns={sessionsColumns}
                            data={tabsState[program.id]?.sessions}
                            ActionsComponent={OptionsComponent}
                          />
                          <div className="my-10 px-6">
                            <CustomPagination
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              last_page={tabsState[program.id]?.meta?.last_page}
                              total={tabsState[program.id]?.meta?.total}
                            />
                          </div>
                        </>
                      ))}
                    {tabsState[program.id]?.selectedTab === "students" &&
                      (tabsState[program.id]?.isStudentsLoading ? (
                        <Loader />
                      ) : (
                        <>
                          <TableComponent
                            columns={columns}
                            data={tabsState[program.id]?.students}
                            ActionsComponent={OptionsComponent}
                          />
                          <div className="my-10 px-6">
                            <CustomPagination
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              last_page={
                                tabsState[program.id]?.metaStudents?.last_page
                              }
                              total={tabsState[program.id]?.metaStudents?.total}
                            />
                          </div>
                        </>
                      ))}
                    {tabsState[program.id]?.selectedTab === "reports" &&
                      (tabsState[program.id]?.isReportsLoading ? (
                        <Loader />
                      ) : (
                        <div>
                          <Reports
                            reportData={tabsState[program.id]?.reports}
                            isLoadingReport={
                              tabsState[program.id]?.isReportsLoading
                            }
                          />
                        </div>
                      ))}
                    {tabsState[program.id]?.selectedTab === "assignments" &&
                      (tabsState[program.id]?.isAssignmentsLoading ? (
                        <Loader />
                      ) : (
                        <div className="flex flex-col gap-2">
                          {tabsState[program.id]?.assignments?.map(
                            (assignment, index) => (
                              <div
                                key={index}
                                className={`flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke overflow-x-auto gap-8}`}
                              >
                                <div className="flex items-center gap-20 w-full whitespace-nowrap">
                                  <div className="flex items-center gap-20 md:w-1/2">
                                    <div className="flex flex-col gap-4 items-center w-1/3">
                                      <span className="text-[#5E5E5E] text-sm font-bold">
                                        اسم التسليم
                                      </span>
                                      <span className="text-black-text font-bold text-[15px]">
                                        {assignment.title}
                                      </span>
                                    </div>
                                    <div className="flex flex-col gap-4 items-center w-1/3 ">
                                      <span className="text-[#5E5E5E] text-sm font-bold">
                                        موعد التسليم
                                      </span>
                                      <span className="text-black-text font-bold text-[15px]">
                                        {assignment.created_at
                                          ? formatDate(assignment.created_at)
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="flex flex-col gap-4 items-center w-1/3 ">
                                      <span className="text-[#5E5E5E] text-sm font-bold">
                                        حالة التسليم
                                      </span>
                                      <span
                                        className={`text-center text-sm font-bold ${
                                          assignment.status === "corrected"
                                            ? "text-[#0A9C71]"
                                            : assignment.status === "pending"
                                              ? "text-yellow-500"
                                              : "text-[#EF4444]"
                                        }`}
                                      >
                                        {assignment.status}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex justify-end md:w-1/2">
                                    <User
                                      avatarProps={{
                                        radius: "full",
                                        src: assignment.user.image ?? undefined,
                                        size: "sm",
                                      }}
                                      description={
                                        <span className="text-sm font-bold text-[#3D5066]">
                                          {assignment.user.name}
                                        </span>
                                      }
                                      name={
                                        <span className="text-primary text-start text-xs font-bold">
                                          {/* {formatDate(assignment.created_at)} */}
                                        </span>
                                      }
                                    ></User>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                          <div className="my-8 px-6">
                            <CustomPagination
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              last_page={
                                tabsState[program.id]?.metaAssignments
                                  ?.last_page
                              }
                              total={
                                tabsState[program.id]?.metaAssignments?.total
                              }
                            />
                          </div>
                        </div>
                      ))}
                    {tabsState[program.id]?.selectedTab === "exams" &&
                      (tabsState[program.id]?.isExamsLoading ? (
                        <Loader />
                      ) : (
                        <div className="flex flex-col gap-2">
                          {tabsState[program.id]?.exams?.map((exam, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke overflow-x-auto gap-8`}
                            >
                              <div className="flex flex-col gap-4 w-full whitespace-nowrap">
                                <div className="flex items-center justify-between">
                                  <span className="text-black-text text-sm font-bold">
                                    {exam.quiz_title || "null"}
                                  </span>
                                  <div className="flex flex-col items-center gap-3">
                                    <Chip
                                      className="capitalize px-4 min-w-24 text-center"
                                      color={"success"}
                                      variant="flat"
                                      size="sm"
                                    >
                                      <span
                                        className={`text-[#0A9C71] font-bold`}
                                      >
                                        {exam?.status}
                                      </span>
                                    </Chip>
                                    <span className="text-black-text text-sm font-bold">
                                      {formatDate(exam.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="my-8 px-6">
                            <CustomPagination
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              last_page={
                                tabsState[program.id]?.metaExams?.last_page
                              }
                              total={tabsState[program.id]?.metaExams?.total}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
 
      )}
      <div className="flex justify-end p-4">
        <Button
          onPress={() => setModalOpen(true)}
          className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
        >
          إضافة برنامج
        </Button>
      </div>
      <AddProgram
        isOpen={modalOpen}
        onClose={()=>setModalOpen(false)}
      /> 
    </>
  );
};
