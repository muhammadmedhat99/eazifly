"use client";

import React, { useState } from "react";

import Image from "next/image";

import {
  Accordion,
  AccordionItem,
  addToast,
  Avatar,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { ArrowLeft2 } from "iconsax-reactjs";
import { formatDate } from "@/lib/helper";
import { User } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { useParams } from 'next/navigation';

type OrderDetailsProps = {
  data: {
    data: {
      id: number;
      user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        image: string;
      };
      type: {
        label: string;
        color: string;
      };
      subscription_type: string;
      created_at: string;
      payment_method: string;
      image: string;
      order_details: {
        id: number;
        title: string;
        program: string;
        label: string;
        description: string;
        currency: string;
        price: string;
        discount_price: string;
        subscripe_days: string;
        duration: string;
        number_of_session_per_week: string;
        is_special_plan: boolean;
        type: string;
        plan_title: string;
      }[];
      order_notes: {
        id: number;
        type: string;
        maker: {
          name: string;
          image: string;
        };
        title: string;
        description: string;
        image: string;
        created_at: string;
      }[];
    };
  };
};

export const StudentsSubscriptionDetails = ({ data }: OrderDetailsProps) => {
  const [paidValue, setPaidValue] = useState("");
  const params = useParams();
  const order_id = params.id;

  const ChangeOrderStatus = useMutation({
    mutationFn: (submitData: { status: string; paid: string }) => {   
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("status", submitData.status);
      formdata.append("paid", submitData.paid);

      return postData(
        `client/order/change/status/${order_id}`,
        formdata,
        myHeaders
      );
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
        setPaidValue('')
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
    <>
      <div className="p-8">
        <Accordion variant="splitted">
          <AccordionItem
            key="1"
            aria-label="بيانات الطالب"
            title="بيانات الطالب"
            classNames={{
              title: "font-bold text-black-text text-[15px]",
              base: "shadow-none border border-stroke",
            }}
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="py-5 grid grid-cols-5 gap-4">
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">الإسم</span>

                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    src={data?.data.user.image}
                  />

                  <span className="text-black-text font-bold text-[15px]">
                    {data?.data.user.name}
                  </span>
                </div>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  البريد الإلكتروني
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  {data?.data.user.email}
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  رقم الهاتف
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  {data?.data.user.phone}
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  تاريخ الإنشاء
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  {formatDate(data?.data.created_at)}
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  نوع الطلب
                </span>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full bg-${data?.data.type.color}`}></span>
                  <span className={`text-${data?.data.type.color} font-bold text-[15px]`}>
                    {data?.data.type.label}
                  </span>
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="بيانات الطلب"
            title="بيانات الطلب"
            classNames={{
              title: "font-bold text-black-text text-[15px]",
              base: "shadow-none border border-stroke",
            }}
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="py-5 grid grid-cols-5 gap-4">
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  وسيلة الدفع
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  {data?.data.payment_method}
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  خطة اللإشتراك
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  {data?.data.order_details[0].plan_title}
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  مدة الحصة
                </span>

                <span className="text-black-text font-bold text-[15px]">
                  {data?.data.order_details[0].duration} دقيقة
                </span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  عدد الحصص الأسبوعية
                </span>

                <span className="text-black-text font-bold text-[15px]">{data?.data.order_details[0].number_of_session_per_week}</span>
              </div>
              <div className="bg-stroke flex flex-col gap-2 px-5 py-4 rounded-lg">
                <span className="text-[#5E5E5E] text-sm font-bold">
                  قيمة الإشتراك
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-primary font-bold text-[15px]">
                    {data?.data.order_details[0].discount_price}
                  </span>
                  <span className="text-primary font-bold text-[15px]">
                    ج.م
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-primary font-bold text-sm">
                  صورة التحويل
                </span>
                <div className="overflow-hidden rounded-lg">
                  {data?.data.image ? (
                    <Image
                      src={data.data.image}
                      alt="bill image"
                      width={1024}
                      height={337}
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="إجراءات الطلب السابقة"
            title="إجراءات الطلب السابقة"
            classNames={{
              title: "font-bold text-black-text text-[15px]",
              base: "shadow-none border border-stroke",
            }}
            indicator={<ArrowLeft2 variant="Bold" color="#2563EB" />}
          >
            <div className="py-5 flex flex-col gap-2">
              {data.data.order_notes.map((note, noteIndex) => (
                <div
                key={noteIndex}
                className="flex justify-between items-start bg-background p-5 rounded-2xl border border-stroke"
              >
                <div className="flex flex-col gap-4">

                  <span className="text-black-text font-bold text-[15px]">
                    {note.title}
                  </span>
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    {note.description}
                    </span>
                    {note.image && <Image
                      src={note.image}
                      alt="image"
                      width={200}
                      height={74}
                    />}
                  </div>
                <div className="flex flex-col justify-between items-end">
                  <span className="text-sm font-bold text-primary">
                    {formatDate(note.created_at)}
                  </span>
                    <User
                      avatarProps={{ radius: "full", src: note.maker.image, size: "sm" }}
                      name={
                        <span className="text-sm font-bold text-[#272727]">{note.maker.name}</span>
                      }
                    ></User>
                </div>
              </div>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="bg-stroke p-5 flex gap-3 flex-col">
        <div className="max-w-md">
          <Input
            type="text"
            label="أدخل قيمة التحويل يدوي"
            labelPlacement="outside"
            placeholder="نص الكتابة"
            endContent={<span className="text-black-text font-bold">ج.م</span>}
            classNames={{ label: "text-black-text font-semibold text-sm" }}
            value={paidValue}
            onChange={(e) => setPaidValue(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="solid"
            color="primary"
            className="text-white"
            onPress={() => {
              ChangeOrderStatus.mutate({
                status: "canceled",
                paid: paidValue,
              });
            }}>
            رفض الطلب
          </Button>
          <Button variant="solid" color="primary" className="text-white">
            إرسال رسالة
          </Button>
          <Button
            variant="solid"
            color="primary"
            className="text-white"
            onPress={() => {
              ChangeOrderStatus.mutate({
                status: "approved",
                paid: paidValue,
              });
            }}>
            الموافقة علي الطلب
          </Button>
          <Button variant="solid" color="primary" className="text-white">
           إضافة ملاحظة
          </Button>
        </div>
      </div>
    </>
  );
};
