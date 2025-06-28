"use client";

import { Avatar, Input, Button, image, addToast, ModalFooter } from "@heroui/react";
import { Loader } from "@/components/global/Loader";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@heroui/react";
import { JoditInput } from "@/components/global/JoditInput";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useParams } from 'next/navigation';


type feedbacksProps = {
    feedbackData?: any;
    isLoadingfeedback: boolean;
    client_id: number;
};

export const Feedbacks = ({ feedbackData, isLoadingfeedback, client_id }: feedbacksProps) => {
    const params = useParams();
    const user_id = params.id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState("");

    const AddFeedback = useMutation({
        mutationFn: (submitData: { feedback: string }) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            if (typeof user_id === 'string') {
                formdata.append("user_id", user_id);
            } 
            formdata.append("client_id", client_id.toString());
            formdata.append("feedback", submitData.feedback);

            return postData("client/add/feedback", formdata, myHeaders);
        },
        onSuccess: (data) => {
            if (data.message !== "success") {
                addToast({
                    title: "error",
                    color: "danger",
                });
            } else {
                addToast({
                    title: data?.message,
                    color: "success",
                });
                setIsModalOpen(false);
                setFeedback("");
            }
        },
        onError: (error) => {
            console.log(" error ===>>", error);
            addToast({
                title: "عذرا حدث خطأ ما",
                color: "danger",
            });
        },
    });
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
                                    {feedback.maker}
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
            <button className="flex justify-end items-center gap-1 pt-4" onClick={() => {setIsModalOpen(true); }}>
                <Add size="24" variant="Outline" className="text-primary" />
                <span className="text-center justify-start text-primary text-sm font-bold">إضافة ملاحظة</span>
            </button>
            <Modal
                isOpen={isModalOpen}
                scrollBehavior="inside"
                size="4xl"
                onOpenChange={(open) => {
                    if (!open) {
                        setIsModalOpen(false);
                    }
                }}
            >
                <ModalContent>
                    {(closeModal) => (
                        <>
                            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                                أضافة ملاحظة
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">الملاحظة</label>
                                    <textarea
                                        className="w-full border rounded-md p-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="أدخل الملاحظة هنا"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        color="primary"
                                        className="text-white"
                                        onClick={() => AddFeedback.mutate({ feedback })}
                                    >
                                        حفظ
                                    </Button>
                                </div>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
