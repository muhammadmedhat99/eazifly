"use client";
import { Edit2, Trash } from "iconsax-reactjs";
import { Loader } from "@/components/global/Loader";
import { useState } from "react";
import { CustomPagination } from "@/components/global/Pagination";
import ChangeTeacherModal from "../ChangeTeacherModal";
import { useParams } from "next/navigation";

type teachersProps = {
  teachersData?: any;
  isLoadingteachers: boolean;
  handleManualRefetch: any;
  data: any;
};

export const Teachers = ({
  teachersData,
  isLoadingteachers,
  handleManualRefetch,
  data,
}: teachersProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const params = useParams();
  const user_id = params.id;

  return (
    <div className="flex flex-col gap-2">
      {isLoadingteachers ? (
        <Loader />
      ) : teachersData.data && teachersData.data.length > 0 ? (
        teachersData.data
          ?.filter((item: any) =>
            data.data.parent_id !== null ? item.user.id == user_id : true
          )
          .map((teacher: any, teacherIndex: number) => (
            <div
              key={teacherIndex}
              className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke overflow-x-auto gap-8"
            >
              <div className="flex items-center gap-20 md:w-1/2">
                <div className="flex flex-col gap-4 items-center whitespace-nowrap w-1/2">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    إسم المعلم
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                    {teacher?.instructor?.name_ar}
                  </span>
                </div>
                <div className="flex flex-col gap-4 items-center whitespace-nowrap w-1/2">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    إسم الطالب
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                    {teacher?.user?.first_name} {teacher?.user?.last_name}
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setModalOpen(true);
                  }}
                  type="button"
                  className="flex items-center gap-1 text-sm font-bold text-[#5E5E5E] whitespace-nowrap"
                >
                  <Edit2 size={18} />
                  تغير المعلم
                </button>
              </div>
              <ChangeTeacherModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                teachersAndStudens={selectedTeacher}
                handleManualRefetch={handleManualRefetch}
              />
            </div>
          ))
      ) : (
        <div className="text-sm text-gray-500 text-center">
          لا توجد بيانات حالية للعرض
        </div>
      )}

      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={teachersData?.meta?.last_page}
          total={teachersData?.meta?.total}
        />
      </div>
    </div>
  );
};
