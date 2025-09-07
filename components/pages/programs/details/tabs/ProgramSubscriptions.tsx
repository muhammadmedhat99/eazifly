"use client";

import { Options } from "@/components/global/Icons";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { fetchClient, postData } from "@/lib/utils";
import {
  addToast,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const plansColumns = [
  { name: "خطة الاشتراك", uid: "subscription_plan" },
  { name: "العنوان", uid: "subscription_title" },
  { name: "سعر الاشتراك", uid: "price" },
  { name: "سعر البيع", uid: "discount_price" },
  { name: "عدد الحصص", uid: "number_of_session_per_week" },
  { name: "مدة المحاضرة", uid: "duration" },
  { name: "نوع الاشتراك", uid: "type" },
  { name: "الباقة المميزة", uid: "is_special_plan" },
  { name: "الإجراءات", uid: "actions" },
];

type subscription = {
  id: number;
  title: string | null;
  program: string;
  label: string | null;
  description: string | null;
  currency: string | null;
  price: string;
  discount_price: string;
  subscripe_days: string;
  duration: string;
  number_of_session_per_week: string;
  is_special_plan: boolean;
  type: string;
  plan_title: string | null;
  subscription_plan: string;
};

type subscriptionsProps = {
  subscriptionsData: subscription[];
};

export const ProgramSubscriptions = ({ subscriptionsData }: subscriptionsProps) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const params = useParams();
  const program_id = params.id;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();


  const { data: subscriptionPeriods, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/plan/subscription/period`, axios_config),
    queryKey: AllQueryKeys.GetAllSubscriptionPeriods,
  });

  const plansTableData = subscriptionsData?.map((item: any) => ({
    id: item.id,
    type: item.type,
    subscription_title: item.title || "لا يوجد",
    discount_price: item.discount_price,
    price: item.price,
    number_of_session_per_week: item.number_of_session_per_week,
    duration: item.duration,
    subscription_plan: item.subscription_plan,
    is_special_plan: item.is_special_plan,
  }));

  const handleEdit = (id: number, row: any) => {
    const matchedPeriod = subscriptionPeriods?.data?.find(
      (p: any) => p.title === row.subscription_plan
    );

    setEditingRow(id);
    setEditedData({
      ...row,
      subscription_plan: matchedPeriod ? matchedPeriod.days : row.subscription_plan,
    });
  };

  const handleSave = (id: number) => {
    setEditingRow(null);
    addSubscriptionToProgram.mutate(editedData);
  };

  const addSubscriptionToProgram = useMutation({
    mutationFn: (submitData: any) => {    
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formData = {
        plans: [
          {
            program_id: program_id,
            subscripe_days: submitData?.subscription_plan,
            discount_price: submitData?.discount_price,
            price: submitData?.price,
            duration: submitData?.duration,
            number_of_session_per_week: submitData?.number_of_session_per_week,
            type: submitData?.type,
            is_special_plan: submitData?.is_special_plan,
            plan_id: submitData?.id,
          },
        ],
      };


      return postData("client/program/plan/update", JSON.stringify(formData), myHeaders);
      
    },
    onSuccess: (data: any) => {
      if (data.status !== 200 && data.status !== 201) {
        addToast({
          title: `Error Submitting Subscription Plan: ${data.message}`,
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["GetProgramDetails", program_id] });
      }
    },
    onError: (error: Error) => {
      console.error("Error submitting program:", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const renderCell = (item: any, columnKey: any) => {
    const isEditing = editingRow === item.id;

    if (columnKey === "actions") {
      return isEditing ? (
        <div className="flex gap-2">
          <Button size="sm" color="success" className="text-white" onPress={() => handleSave(item.id)}>
            حفظ
          </Button>
          <Button size="sm" color="danger" className="text-white"  onPress={handleCancel}>
            إلغاء
          </Button>
        </div>
      ) : (
        <Button size="sm" color="primary" className="text-white" onPress={() => handleEdit(item.id, item)}>
          تعديل
        </Button>
      );
    }

    if (isEditing) {
      if (columnKey === "is_special_plan") {
        return (
          <Switch
            isSelected={editedData[columnKey]}
            color="success"
            onValueChange={(val) =>
              setEditedData((prev: any) => ({ ...prev, [columnKey]: val }))
            }
          />
        );
      }

      if (columnKey === "subscription_plan") {
        return (
          <Controller
            name={`subscriptions.${item.id}.subscription_plan`}
            control={control}
            defaultValue={
              subscriptionPeriods?.data?.find(
                (p: any) => p.days === editedData?.subscription_plan
              )?.days  || ""
            }
            render={({ field }) => (
              <Select
                placeholder="إختر"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  field.onChange(val);
                  setEditedData((prev: any) => ({ ...prev, subscription_plan: val }));
                }}
                radius="none"
                classNames={{
                  trigger:
                    "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
                }}
              >
                {subscriptionPeriods?.data?.map((period: any) => (
                  <SelectItem key={period.days}>{period.title}</SelectItem>
                ))}
              </Select>
            )}
          />
        );
      }

      if (columnKey === "type") {
        return (
          <Controller
            name={`subscriptions.${item.id}.subscription_type`}
            control={control}
            defaultValue={editedData?.type || ""}
            render={({ field }) => (
              <Select
                placeholder="إختر"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  field.onChange(val);
                  setEditedData((prev: any) => ({ ...prev, type: val }));
                }}
                radius="none"
                classNames={{
                  trigger:
                    "bg-white shadow-none data-[hover=true]:bg-white min-w-[106px]",
                }}
              >
                <SelectItem key="single">فردي</SelectItem>
                <SelectItem key="family">عائلة</SelectItem>
              </Select>
            )}
          />
        );
      }

      return (
        <Input
          size="sm"
          value={editedData[columnKey] || ""}
          onChange={(e) =>
            setEditedData((prev: any) => ({ ...prev, [columnKey]: e.target.value }))
          }
        />
      );
    }

    if (columnKey === "is_special_plan") {
      return (
        <Switch isSelected={item[columnKey]} color="success" isReadOnly />
      );
    }

    if (columnKey === "price" || columnKey === "discount_price") {
      return <span>{item[columnKey]} ج.م</span>;
    }

    if (columnKey === "duration") {
      return <span>{item[columnKey]} دقيقة</span>;
    }

    return <span>{item[columnKey]}</span>;
  };

  return (
    <div className="bg-main">
      <div className="w-full overflow-x-auto px-4 sm:px-0">
        <Table
          removeWrapper
          aria-label="Editable table"
          dir="rtl"
          classNames={{
            th: "bg-primary/10 text-primary font-bold text-sm first:ps-5 h-[64px]",
            tr: "h-[52px] border-b border-b-stroke",
          }}
        >
          <TableHeader columns={plansColumns}>
            {(column: any) => (
              <TableColumn key={column.uid} align="start" className="text-start">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={plansTableData || []}>
            {(item: any) => (
              <TableRow key={item.id} className="cursor-pointer">
                {(columnKey) => (
                  <TableCell className="text-sm font-semibold text-light">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
