"use client";

import { Avatar, Input, Button, image, addToast } from "@heroui/react";
import { Loader } from "@/components/global/Loader";

type feedbacksProps = {
  feedbackData?: any;
  isLoadingfeedback: boolean;
};

export const Feedbacks = ({ feedbackData, isLoadingfeedback }: feedbacksProps) => {
    return (
        <div className="flex flex-col gap-2">
            {isLoadingfeedback ? (
                <Loader />
            ) : feedbackData.data && feedbackData.data.length > 0 ? (
                feedbackData.data.map((feedback: any, feedbackIndex: number) => (
                    <div key={feedbackIndex} className="flex items-center justify-between bg-background p-5 rounded-2xl border border-stroke">
                            <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size="sm"
                                    src={feedback.image} />
                                <span className="text-black-text font-bold text-[15px]">
                                    {feedback.maker }
                                </span>
                            </div>
                                <span className="text-[#5E5E5E] text-sm font-bold">{feedback.feedback}</span>
                            </div>
                            <div>
                            <span
                                className="text-sm font-bold text-[#5E5E5E]"
                            >
                                {feedback.date}
                            </span>
                            </div>              
                    </div>
                ))
            ) : (
                <div className="text-sm text-gray-500 text-center">لا توجد بيانات حالية للعرض</div>
            )}

        </div>
    );
};
