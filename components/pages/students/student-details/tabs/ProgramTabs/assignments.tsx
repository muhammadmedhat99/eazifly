"use client";

import { formatDate } from "@/lib/helper";
import { Loader } from "@/components/global/Loader";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

type assignmentsProps = {
  assignmentData?: any;
  isLoadingassignment: boolean; 
}; 

export const Assignments = ({ assignmentData, isLoadingassignment }: assignmentsProps) => {
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            {isLoadingassignment ? (
                <Loader />
            ) : assignmentData.data && assignmentData.data.length > 0 ? (
                assignmentData.data.map((appointment: any, appointmentIndex: number) => (
                    <div
                        key={appointmentIndex}
                        className={`flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke overflow-x-auto gap-8 ${appointment.is_uploaded ? "cursor-pointer hover:bg-gray-100" : ""
                            }`}
                        onClick={() => {
                            if (appointment.is_uploaded) {
                                setSelectedAssignment(appointment);
                                setIsModalOpen(true);
                            }
                        }}
                    >
                        <div className="flex items-center gap-20 whitespace-nowrap">
                            <div className="flex flex-1 flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">اسم التسليم</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {appointment.title}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">موعد التسليم</span>
                                <span className="text-black-text font-bold text-[15px]">
                                    {formatDate(appointment.deadline)} 
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col gap-4 items-center">
                                <span className="text-[#5E5E5E] text-sm font-bold">حالة التسليم</span>
                                    {appointment.is_uploaded ? (
                                        <span className="text-center text-[#0A9C71] text-sm font-bold">
                                            تم التسليم
                                        </span>
                                    ) : (
                                        <span className="text-center text-[#EF4444] text-sm font-bold">
                                            لم يتم التسليم
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-sm text-gray-500 text-center">لا توجد بيانات حالية للعرض</div>
            )}

            <Modal
                isOpen={isModalOpen}
                scrollBehavior="inside"
                size="4xl"
                onOpenChange={(open) => {
                    if (!open) {
                        setIsModalOpen(false);
                        setSelectedAssignment(null);
                    }
                }}
            >
                <ModalContent>
                    {(closeModal) => (
                        <>
                            <ModalHeader className="p-0">
                                <div className="bg-background border-b rounded-t-xl flex items-center justify-between w-full px-10 py-5">
                                    <div className="flex flex-col gap-3 items-start items-center">
                                        <span className="text-[#5E5E5E] text-sm font-bold">إسم التسليم</span>
                                        <span className="text-sm font-bold">
                                            {selectedAssignment.title}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3 items-start items-center">
                                        <span className="text-[#5E5E5E] text-sm font-bold">موعد التسليم</span>
                                        <span className="text-sm font-bold">
                                            {formatDate(selectedAssignment.deadline)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3 items-start items-center">
                                        <span className="text-[#5E5E5E] text-sm font-bold">حالة التسليم</span>
                                        <span className="text-[#0A9C71] text-sm font-bold text-center">
                                            تم التسليم
                                        </span>
                                    </div>
                                </div>
                            </ModalHeader>

                            <ModalBody className="space-y-4 text-sm text-[#333] px-10 py-6">
                                <div className="flex flex-col gap-4">
                                    <span className="text-primary text-sm font-bold">{selectedAssignment.text || 'null'} {`؟`}</span>
                                    <div className="text-black font-bold text-[15px]">
                                        {selectedAssignment.answer || 'null'}
                                    </div>
                                    {selectedAssignment?.file && (
                                    <div>
                                        <span className="text-black text-sm font-bold">الملف:</span>{" "}
                                        <a
                                            href={selectedAssignment.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            عرض الملف
                                        </a>
                                    </div>
                                    )}
                                    {selectedAssignment?.user_voice_note && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-black text-sm font-bold whitespace-nowrap">الملف الصوتي:</span>
                                            <audio controls src="/path/to/audio.mp3" />
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
