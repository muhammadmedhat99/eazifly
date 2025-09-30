"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Input,
  RadioGroup,
  Radio,
  Switch,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { formatDate } from "@/lib/helper";
import { Trash } from "iconsax-reactjs";
import { AllQueryKeys } from "@/keys";
import { Controller, useForm } from "react-hook-form";

type Field = {
  title: string;
  duration: string;
  type: string;
};

// ===== Sortable Card =====
const SortableCard = ({ session, onEdit, onToggleStatus }: { session: any; onEdit: (s: any) => void;  onToggleStatus: (s: any) => void; }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: session.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-stroke rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-base sm:text-lg text-gray-800">
          {session.title}
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
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => onEdit(session)}
          >
            تعديل
          </Button>
          <Button
            size="sm"
            variant="flat"
            color={session.status === "active" ? "danger" : "success"}
            onPress={() => onToggleStatus(session)}
          >
            {session.status === "active" ? "أرشفة" : "نشر"}
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-bold text-gray-600">المدة: </span>
          {session.duration} دقيقة
        </p>
        <p>
          <span className="font-bold text-gray-600">النوع: </span>
          {session.type}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500 border-t pt-2">
        <span>
          أضيف في {session.created_at ? formatDate(session.created_at) : "null"}
        </span>
      </div>
    </div>
  );
};

// ===== Main Component =====
export const SessionContent = ({ data }: any) => {
  const queryClient = useQueryClient();
  const pageParams = useParams();
  const program_id = pageParams.id;

  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [isEnabled, setIsEnabled] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>([{ title: "", duration: "", type: "required" }]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<Field | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const [items, setItems] = useState<any[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  const filteredItems = items.filter((s: any) => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "active") return s.status === "active";
    if (selectedStatus === "inactive") return s.status !== "active";
    return true;
  });

  // ===== Fetch Data =====
  const { data: contentData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/program/session/content/${program_id}`, axios_config),
    queryKey: ["GetSessionContent", program_id],
  });

  useEffect(() => {
    if (contentData?.data) {
      const sorted = [...contentData.data].sort(
        (a, b) => Number(a.sort) - Number(b.sort)
      );
      setItems(sorted.map((s: any) => ({ ...s, id: s.id.toString() })));
    }
  }, [contentData]);

  // ===== Add Content =====
  const AddContent = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(`client/program/store/session/content`, JSON.stringify(payload), myHeaders);
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: response?.message, color: "success" });
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["GetSessionContent", program_id] });
      }
    },
    onError: () => addToast({ title: "عذرا حدث خطأ ما", color: "danger" }),
  });

  const handleSubmit = () => {
    const payload = {
      program_id,
      title: fields.map((f) => f.title),
      duration: fields.map((f) => f.duration),
      type: fields.map((f) => f.type),
    };
    AddContent.mutate(payload);
  };

  // ===== Edit Content =====
  const handleEdit = (session: any) => {
    setEditId(session.id);
    setEditField({ title: session.title, duration: session.duration, type: session.type });
    setIsEditModalOpen(true);
  };

  const UpdateContent = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/program/session/content/update/${payload.id}`,
        JSON.stringify(payload.body),
        myHeaders
      );
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: response?.message, color: "success" });
        setIsEditModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["GetSessionContent", program_id] });
      }
    },
    onError: () => addToast({ title: "عذرا حدث خطأ ما", color: "danger" }),
  });

  const handleUpdateSubmit = () => {
    if (!editId || !editField) return;
    const payload = {
      id: editId,
      body: { program_id, ...editField },
    };
    UpdateContent.mutate(payload);
  };

  // ===== Drag & Drop =====
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

  const UpdateOrder = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/program/session/content/change/sort/${program_id}`,
        JSON.stringify(payload),
        myHeaders
      );
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: response?.message, color: "success" });
        setIsChanged(false);
        queryClient.invalidateQueries({ queryKey: ["GetSessionContent", program_id] });
      }
    },
    onError: () => addToast({ title: "عذرا حدث خطأ ما", color: "danger" }),
  });

  const handleSaveOrder = () => {
    const orderedIds = items.map((i: any, index: number) => ({
      content_id: Number(i.id),
      sort: index + 1,
    }));
    UpdateOrder.mutate({ contents: orderedIds });
  };

  // ===== Helpers =====
  const handleChange = (index: number, key: keyof Field, value: string) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleAddFields = () => {
    setFields([...fields, { title: "", duration: "", type: "required" }]);
  };

  const handleRemoveField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const ToggleStatus = useMutation({
    mutationFn: async (session: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/program/session/content/change/status/${session.id}`,
        JSON.stringify({ program_id }),
        myHeaders
      );
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: "تم تحديث الحالة", color: "success" });
        queryClient.invalidateQueries({ queryKey: ["GetSessionContent", program_id] });
      }
    },
    onError: () => addToast({ title: "عذرا حدث خطأ ما", color: "danger" }),
  });

  const { control } = useForm();

  const { data: sessionPeriods, isLoading: sessionPeriodsLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/plan/session/time`, axios_config),
    queryKey: AllQueryKeys.GetAllSessionTimes,
  });

  // ===== Render =====
  return (
    <div className="p-4 space-y-4">
      {/* Switch */}
      <div className="flex justify-start">
        <Switch
          isSelected={isEnabled}
          onValueChange={setIsEnabled}
          color="primary"
          className="font-bold text-base sm:text-lg text-gray-800"
        >
          تفعيل محتوى الحصة
        </Switch>
      </div>

      <div className={`${!isEnabled ? "pointer-events-none opacity-50" : ""}`}>
        {/* Filters + Actions */}
        <div className="flex justify-between pt-4 mb-4 flex-wrap gap-4">
          <div className="flex gap-2">
            <Button
              variant="flat"
              color={selectedStatus === "all" ? "primary" : "default"}
              onPress={() => setSelectedStatus("all")}
            >
              الكل
            </Button>
            <Button
              variant="flat"
              color={selectedStatus === "active" ? "primary" : "default"}
              onPress={() => setSelectedStatus("active")}
            >
              نشط
            </Button>
            <Button
              variant="flat"
              color={selectedStatus === "inactive" ? "primary" : "default"}
              onPress={() => setSelectedStatus("inactive")}
            >
              غير نشط
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {isChanged && (
              <Button
                className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
                onPress={handleSaveOrder}
                isLoading={UpdateOrder.isPending}
              >
                حفظ الترتيب
              </Button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
            >
              أضافة محتوى
            </button>
          </div>
        </div>

        {/* List */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((session: any) => (
                <SortableCard key={session.id} session={session} onEdit={handleEdit} onToggleStatus={(s) => ToggleStatus.mutate(s)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Modal */}
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} scrollBehavior="inside" size="4xl">
          <ModalContent>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              أضافة محتوى
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg"
                  >
                    {fields.length > 1 && (
                      <button
                        onClick={() => handleRemoveField(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <Trash size={14} />
                      </button>
                    )}

                    <Input
                      label="العنوان"
                      value={field.title}
                      onChange={(e) => handleChange(index, "title", e.target.value)}
                      placeholder="أدخل العنوان"
                      labelPlacement="outside"
                      variant="bordered"
                    />

                    <Controller
                      name={`fields.${index}.duration`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          selectedKeys={field.value ? new Set([String(field.value)]) : new Set()}
                          onSelectionChange={(keys: any) => {
                            const selectedVal = Array.from(keys)[0] as string | undefined;
                            field.onChange(selectedVal); // يخزن في RHF
                            handleChange(index, "duration", selectedVal || ""); // يخزن في fields
                          }}
                          label="المدة"
                          labelPlacement="outside"
                          placeholder="اختر المدة"
                          classNames={{
                            trigger:
                              "bg-white border rounded-xl shadow-none data-[hover=true]:bg-white",
                          }}
                          radius="none"
                          renderValue={(selectedItems) =>
                            selectedItems.length ? selectedItems[0]?.props?.children : "اختر مدة المحاضرة"
                          }
                        >
                          {sessionPeriods?.data.map(
                            (item: { id: string; time: string; title: string }) => (
                              <SelectItem key={item.time}>
                                {item.time} دقيقة
                              </SelectItem>
                            )
                          )}
                        </Select>
                      )}
                    />

                    <RadioGroup
                      label="النوع"
                      value={field.type}
                      onValueChange={(val) => handleChange(index, "type", val)}
                      orientation="horizontal"
                    >
                      <Radio value="required">إجباري</Radio>
                      <Radio value="optional">اختياري</Radio>
                    </RadioGroup>
                  </div>
                ))}
                <Button variant="flat" color="primary" onClick={handleAddFields}>
                  + إضافة
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="text-white" onClick={handleSubmit} isLoading={AddContent.isPending}>
                حفظ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <ModalContent>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              تعديل المحتوى
            </ModalHeader>
            <ModalBody>
              {editField && (
                <div className="flex flex-col gap-6">
                  <Input
                    label="العنوان"
                    value={editField.title}
                    onChange={(e) => setEditField({ ...editField, title: e.target.value })}
                    placeholder="أدخل العنوان"
                    variant="bordered"
                    labelPlacement="outside"
                  />

                  <Select
                    selectedKeys={
                      editField?.duration ? new Set([String(editField.duration)]) : new Set()
                    }
                    onSelectionChange={(keys: any) => {
                      const selectedVal = Array.from(keys)[0] as string | undefined;
                      setEditField((prev) =>
                        prev ? { ...prev, duration: selectedVal || "" } : prev
                      );
                    }}
                    label="المدة"
                    labelPlacement="outside"
                    placeholder="اختر المدة"
                    classNames={{
                      trigger:
                        "bg-white border rounded-xl shadow-none data-[hover=true]:bg-white",
                    }}
                    radius="none"
                    renderValue={(selectedItems) =>
                      selectedItems.length
                        ? selectedItems[0]?.props?.children
                        : "اختر مدة المحاضرة"
                    }
                  >
                    {sessionPeriods?.data.map(
                      (item: { id: string; time: string; title: string }) => (
                        <SelectItem key={item.time}>{item.time} دقيقة</SelectItem>
                      )
                    )}
                  </Select>


                  <RadioGroup
                    label="النوع"
                    value={editField.type}
                    onValueChange={(val) => setEditField({ ...editField, type: val })}
                    orientation="horizontal"
                  >
                    <Radio value="required">إجباري</Radio>
                    <Radio value="optional">اختياري</Radio>
                  </RadioGroup>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="text-white" onClick={handleUpdateSubmit} isLoading={UpdateContent.isPending}>
                حفظ التعديلات
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
