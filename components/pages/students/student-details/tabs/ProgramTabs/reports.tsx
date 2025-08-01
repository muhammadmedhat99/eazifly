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
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";

type ReportsProps = {
  reportData?: any;
  isLoadingReport: boolean;
};

export const Reports = ({ reportData, isLoadingReport }: ReportsProps) => { 
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: reportDetails, isLoading: isDetailsLoading } = useQuery({
        enabled: !!selectedAssignment && isModalOpen,
        queryKey: [
            "reportDetails",
            selectedAssignment?.report_maker_type,
            selectedAssignment?.report_for_type,
            selectedAssignment?.report_maker_id,
            selectedAssignment?.report_for_id,
            selectedAssignment?.meeting_session_id,
        ],
        queryFn: async () =>
            await fetchClient("client/report/questions", {
                ...axios_config,
                params: {
                    report_maker_type: selectedAssignment?.report_maker_type,
                    report_for_type: selectedAssignment?.report_for_type,
                    report_maker_id: selectedAssignment?.report_maker_id,
                    report_for_id: selectedAssignment?.report_for_id,
                    meeting_session_id: selectedAssignment?.meeting_session_id,
                },
            }),
    });

    return (
        <div className="flex flex-col gap-2">
            {isLoadingReport ? (
                <Loader />
            ) : reportData.data && reportData.data.length > 0 ? (
                reportData.data.map((report: any, reportIndex: number) => (
                    <div
                        key={reportIndex}
                        className={`flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke overflow-x-auto gap-8 cursor-pointer hover:bg-gray-100`}
                        onClick={() => {
                            setSelectedAssignment(report);
                            setIsModalOpen(true);
                        }}
                    >
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between gap-8 whitespace-nowrap">
                                <span className="text-black-text text-sm font-bold">
                                    {
                                        report.report_maker_type === "instructor"
                                            ? `تقرير للطالب (${report.report_for_name}) من المعلم (${report.report_maker_name})`
                                            : report.report_maker_type === "client"
                                                ? `تقرير للطالب (${report.report_for_name}) من الإدارة (${report.report_maker_name})`
                                                : report.report_maker_type === "user"
                                                    ? `تقرير من الطالب (${report.report_maker_name}) إلى المعلم (${report.report_for_name})`
                                                    : null
                                    }
                                </span>
                                <span className="text-black-text text-sm font-bold">
                                    {formatDate(report.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-sm text-gray-500 text-center">لا توجد تقارير</div>
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
                                        <span className="text-[#5E5E5E] text-sm font-bold">تقرير إلي</span>
                                        <span className="text-sm font-bold">
                                            {selectedAssignment.report_for_name}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3 items-start items-center">
                                        <span className="text-[#5E5E5E] text-sm font-bold">تاريخ الإنشاء</span>
                                        <span className="text-sm font-bold">
                                            {formatDate(selectedAssignment.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody className="space-y-4 text-sm text-[#333] px-10 py-6">
                                {isDetailsLoading ? (
                                    <Loader />
                                ) : reportDetails?.data?.length > 0 ? (
                                    reportDetails.data.map((detail: any, index: number) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="font-bold mb-1 text-primary">
                                                {detail.report_question.title}
                                            </div>
                                            <div className="text-black">
                                                {detail.report_question.type === "multiple_choice"
                                                    ? detail.report_question.options.find(
                                                        (opt: any) => String(opt.id) === String(detail.report_question_answer_id)
                                                    )?.title || "بدون إجابة"
                                                    : detail.answer || "بدون إجابة"}
                                            </div>
                                            {detail.note && (
                                                <div className="mt-2 text-gray-600 text-xs">
                                                    {detail.note}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">لا توجد تفاصيل</div>
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
