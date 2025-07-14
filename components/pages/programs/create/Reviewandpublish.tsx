"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import {
  Button,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  Switch,
  Input,
  cn,
  addToast,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  avatar,
} from "@heroui/react";
import {
  LocalizedField,
  LocalizedTextArea,
} from "@/components/global/LocalizedField";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { useQuery, useMutation } from "@tanstack/react-query";
import { informationFormSchema, type InformationFormData } from "./schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCookie } from "cookies-next";
import Image from "next/image";
import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import { Loader } from "@/components/global/Loader";
import { useRouter } from "next/navigation";

const columns = [
{ name: "", uid: "avatar" },
  { name: "الاسم", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكترونى", uid: "email" },
  { name: "تاريخ التقديم", uid: "created_at" },
  { name: "التخصص", uid: "specializations" },
  { name: "الحالة", uid: "status" },
];

const plansColumns = [
  { name: "خطة الاشتراك", uid: "subscription_plan" },
  { name: "سعر الاشتراك", uid: "price" },
  { name: "سعر البيع", uid: "discount_price" },
  { name: "عدد الحصص", uid: "number_of_session_per_week" },
  { name: "مدة المحاضرة", uid: "duration" },
  { name: "نوع الاشتراك", uid: "type" },
  { name: "الباقة المميزة", uid: "is_special_plan" },
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
        <DropdownItem href={`/hr/jobs/${id}`} key="show">
          عرض الموظفين
        </DropdownItem>
        <DropdownItem key="edit">تعديل</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const Reviewandpublish = ({
    setActiveStep,
    programId,
}: {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    programId: string;
}) => {
    const router = useRouter();
    const { data, isLoading } = useQuery({
        queryFn: async () =>
            await fetchClient(
                `client/program/all/data/${programId}`,
                axios_config
            ),
        queryKey: ["GetProgramData", programId],
    });

    const tableData = data?.data?.instructurs?.map((item: any) => ({
        id: item.id,
        avatar: item.image,
        name: item.name_ar || item.name_en,
        phone: item.phone,
        email: item.email,
        created_at: new Date(item.created_at).toLocaleDateString("ar-EG"),
        specializations:
            item.specializations?.length > 0
                ? item.specializations.map((s: any) => s.name_ar).join(", ")
                : "غير محدد",
        status: {
            name: item.status || "N/A",
            color:
                item?.status?.color === "info"
                    ? "warning"
                    : item?.status_label?.color || "success",
        },
    }));

    const plansTableData = data?.data.plans?.map((item: any) => ({
        id: item.id,
        type: item.type,
        discount_price: item.discount_price + " ج.م",
        price: item.price + " ج.م",
        number_of_session_per_week: item.number_of_session_per_week,
        duration: item.duration + "دقيقة",
        subscription_plan: item.subscription_plan,
        is_special_plan: item.is_special_plan ? (<Switch
            isSelected={true}
            color="success"
        />) : (<Switch
            isSelected={false}
            color="success"
        />),
    }));

      const publishProgramMutation = useMutation({
        mutationFn: () => {
          const myHeaders = new Headers();
          myHeaders.append("Accept", "application/json");
          myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

          return postData(`client/program/publish/${programId}`, null, myHeaders);
        },
        onSuccess: (data: any) => {
          if (data.status !== 200 && data.status !== 201) {
            addToast({
              title: `Error publish program: ${data.message}`,
              color: "danger",
            });
          } else {
            addToast({
              title: data?.message,
              color: "success",
            });
            router.push('/programs')
          }
        },
        onError: (error: Error) => {
          console.error("Error publish program:", error);
          addToast({
            title: "عذرا حدث خطأ ما",
            color: "danger",
          });
        },
      });

    return isLoading ? (
        <Loader />
  ) : (
    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke col-span-3">
              <div className="flex flex-col gap-4">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                      صورة البرنامج
                  </span>
                  <Image
                      src={data.data.image}
                      width={350}
                      height={350}
                      alt="login image"
                      className="w-1/2 h-full flex-1 object-cover"
                  />
              </div>
          </div>
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
              <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                        إسم البرنامج 
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                      {data.data.title}
                  </span>
              </div>
          </div>
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
              <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                        عنوان البرنامج 
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                      {data.data.label}
                  </span>
              </div>
          </div>
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
              <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                        التخصص
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                      {data.data.specialization}
                  </span>
              </div>
          </div>
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke col-span-3">
              <div className="flex flex-col gap-4 w-full">
                  <span className="text-primary text-sm font-bold">
                        المعلمين
                  </span>
                  <TableComponent
                      columns={columns}
                      data={tableData}
                      ActionsComponent={OptionsComponent}
                  />
              </div>
          </div>
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke col-span-3">
              <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                        وصف البرنامج
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                      {data.data.description}
                  </span>
              </div>
          </div>
          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke col-span-3">
              <div className="flex flex-col gap-4">
                  <span className="text-primary text-sm font-bold">
                        وسائل الدفع
                  </span>
                  <div className="flex gap-2 items-center">
                    {data.data.payment_methods.map((method: any, index: number) => (
                    <Chip
                    key={index}
                      className="capitalize px-4 min-w-24 text-center"
                      color={'primary'}
                      variant="flat"
                  >
                      <span className={`text-primary font-bold`}>
                          {method.title}
                      </span>
                  </Chip>
                  ))}
                  </div>
              </div>
          </div>
             <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke col-span-3">
                 <div className="flex flex-col gap-4 w-full">
                     <span className="text-primary text-sm font-bold">
                         اسعار الاشتراكات
                     </span>
                     <TableComponent
                         columns={plansColumns}
                         data={plansTableData}
                         ActionsComponent={OptionsComponent}
                     />
                 </div>
             </div>
             {/* Action Buttons */}
                   <div className="flex items-center justify-end gap-4 mt-8 col-span-3">
                     <Button
                       type="button"
                       variant="solid"
                       color="primary"
                       className="text-white"
                     >
                       السابق
                     </Button>
                     <Button
                       type="button"
                       onPress={() => publishProgramMutation.mutate()}
                       variant="solid"
                       color="primary"
                       className="text-white"
                       isLoading={publishProgramMutation.isPending}
                     >
                       {publishProgramMutation.isPending ? "جاري النشر..." : "نشر البرنامج"}
                     </Button>
                   </div>
      </div>
  );
};

