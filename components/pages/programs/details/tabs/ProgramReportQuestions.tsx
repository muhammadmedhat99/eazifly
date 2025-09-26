"use client";

import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, addToast } from "@heroui/react";
import { Options } from "@/components/global/Icons";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import Link from "next/link";
import { formatDate } from "@/lib/helper";

const OptionsComponent = ({ row }: { row: any }) => {
  return (
    <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
      <DropdownTrigger>
        <button>
          <Options />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href={`/programs/${row.programId}/report-questions/${row.id}`} key="show">
          عرض البيانات
        </DropdownItem>
        <DropdownItem key="actions">الإجراءات</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
        <DropdownItem key="add-to-course">تعيين علي برنامج</DropdownItem>
        <DropdownItem key="send-mail">إرسال رسالة</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

// ===== Sortable Card Component =====
const SortableCard = ({ row }: { row: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const router = useRouter();
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-stroke rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() =>
        router.push(`/programs/${row.programId}/report-questions/${row.id}`)
      }
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-base sm:text-lg text-gray-800">
          {row.name}
        </h3>

        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            ☰
          </span>

          {/* Options Dropdown (click works normally now) */}
          <OptionsComponent row={row} />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-bold text-gray-600">نوع السؤال: </span>
          {row.type || "-"}
        </p>
        <p>
          <span className="font-bold text-gray-600">البرنامج: </span>
          {row.program || "-"}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500 border-t pt-2">
        <span>أضيف في {formatDate(row.created_at)}</span>
      </div>
    </div>
  );
};

// ===== Main Component =====
export const ProgramReportQuestions = ({ data }: any) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageParams = useParams();
  const program_id = pageParams.id;

  const [items, setItems] = useState(
    data?.data?.map((item: any) => ({
      id: item.id.toString(),
      name: item.title,
      type: item.type,
      program: item.program?.title,
      user_type: item.user_type,
      created_at: item.created_at,
      programId: item.program?.id,
      status: item.status,
    })) || []
  );

  const [isChanged, setIsChanged] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("active");

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev: any) => {
        const oldIndex = prev.findIndex((i: any) => i.id === active.id);
        const newIndex = prev.findIndex((i: any) => i.id === over.id);
        const newArr = arrayMove(prev, oldIndex, newIndex);
        setIsChanged(true);
        return newArr;
      });
    }
  };

  const handleSave = () => {
    const orderedIds = items.map((i: any) => i.id);

    const payload = {
      questions: orderedIds.map((id: string, index: number) => ({
        question_id: Number(id),
        sort_order: index + 1,
      })),
    };

    UpdateOrder.mutate(payload);
    setIsChanged(false);
  };

  const UpdateOrder = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/sort/report/questions`,
        JSON.stringify(payload),
        myHeaders
      );
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: response?.message,
          color: "success",
        });
        queryClient.invalidateQueries({
          queryKey: AllQueryKeys.GetAllSpecializations,
        });
      }
    },
    onError: () => {
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const filteredItems =
    selectedStatus === "all"
      ? items
      : items.filter((item: any) =>
          selectedStatus === "active"
            ? item.status === "active"
            : item.status === "inactive"
        );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between pt-4 flex-wrap gap-4">
        <div className="flex gap-2">
          <Button
            variant="flat"
            color={selectedStatus === "all" ? "primary" : "default"}
            className="font-semibold"
            onPress={() => setSelectedStatus("all")}
          >
            الكل
          </Button>
          <Button
            variant="flat"
            color={selectedStatus === "active" ? "primary" : "default"}
            className="font-semibold"
            onPress={() => setSelectedStatus("active")}
          >
            نشط
          </Button>
          <Button
            variant="flat"
            color={selectedStatus === "inactive" ? "primary" : "default"}
            className="font-semibold"
            onPress={() => setSelectedStatus("inactive")}
          >
            غير نشط
          </Button>
        </div>
        <div className="flex items-center gap-4">
          {isChanged && (
            <Button
              color="primary"
              className="px-6 font-semibold text-white"
              onPress={handleSave}
            >
              حفظ الترتيب
            </Button>
          )}
          <Link
            href={`/programs/${program_id}/report-questions/create`}
            className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
          >
            أضافة سؤال
          </Link>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredItems.map((i: any) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredItems.map((row: any) => (
            <SortableCard key={row.id} row={row} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

