"use client";

import { formatDate } from "@/lib/helper";
import { Loader } from "@/components/global/Loader";

type ReportsProps = {
  reportData?: any;
  isLoadingReport: boolean;
};

export const Reports = ({ reportData, isLoadingReport }: ReportsProps) => {
    return (
        <>
            {isLoadingReport ? (
                <Loader />
            ) : reportData.data && reportData.data.length > 0 ? (
                reportData.data.map((report: any, reportIndex: number) => (
                    <div
                        key={reportIndex}
                        className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke mb-3"
                    >
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between">
                                <span className="text-black-text text-sm font-bold">
                                    {report.report_maker_type === "instructor"
                                        ? `تقرير للطالب (${report.report_for_name}) من المعلم (${report.report_maker_name})`
                                        : report.report_maker_type === "client"
                                            ? `تقرير للطالب (${report.report_for_name}) من الإدارة (${report.report_maker_name})`
                                            : null}
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

        </>
    );
};
