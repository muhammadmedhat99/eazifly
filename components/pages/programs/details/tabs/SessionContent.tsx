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
import { Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, addToast, ModalFooter, Input, RadioGroup, Radio, Switch } from "@heroui/react";
import { Options } from "@/components/global/Icons";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import Link from "next/link";
import { formatDate } from "@/lib/helper";
import { axios_config } from "@/lib/const";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Trash } from "iconsax-reactjs";

type Field = {
  title: string;
  duration: string;
  type: string;
};


export const SessionContent = ({ data }: any) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageParams = useParams();
  const program_id = pageParams.id;
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<Field | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const { data: contentData, isLoading } = useQuery({
        queryFn: async () =>
          await fetchClient(`client/program/session/content/${program_id}`, axios_config),
        queryKey: ["GetSessionContent", program_id]
      });

  const [fields, setFields] = useState<Field[]>([
    { title: "", duration: "", type: "required" },
  ]);

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

  const handleSubmit = () => {
    const payload = {
      program_id,
      title: fields.map((f) => f.title),
      duration: fields.map((f) => f.duration),
      type: fields.map((f) => f.type),
    };
    AddContent.mutate(payload);
  };


  const AddContent = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/program/store/session/content`,
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
        setIsModalOpen(false)
        queryClient.invalidateQueries({
          queryKey: ["GetSessionContent", program_id],
          refetchType: "active",
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

  const handleEdit = (session: any) => {
    setEditId(session.id);
    setEditField({
      title: session.title,
      duration: session.duration,
      type: session.type,
    });
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
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: response?.message,
          color: "success",
        });
        setIsEditModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["GetSessionContent", program_id],
          refetchType: "active",
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

  const handleUpdateSubmit = () => {
    if (!editId || !editField) return;
    const payload = {
      id: editId,
      body: {
        program_id,
        title: editField.title,
        duration: editField.duration,
        type: editField.type,
      },
    };
    UpdateContent.mutate(payload);
  };


  return (
    <div className="p-4 space-y-4">
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
        <div className="flex justify-between pt-4 mb-4 flex-wrap gap-4">
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
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-md bg-primary"
            >
              أضافة محتوى
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contentData?.data?.map((session: any) => (
          <div
            key={session.id}
              className="border border-stroke rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-base sm:text-lg text-gray-800">
                  {session.title}
                </h3>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => handleEdit(session)}
                >
                  تعديل
                </Button>
              </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-bold text-gray-600">المدة: </span>
                {session.duration}
              </p>
              <p>
                <span className="font-bold text-gray-600">النوع: </span>
                {session.type}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-gray-500 border-t pt-2">
              <span>
                أضيف في{" "}
                {session.created_at ? formatDate(session.created_at) : "null"}
              </span>
            </div>
          </div>
        ))}
        </div>

        {/* Modal */}
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
                          onChange={(e) =>
                            handleChange(index, "title", e.target.value)
                          }
                          placeholder="أدخل العنوان"
                          labelPlacement="outside"
                          variant="bordered"
                          classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                          }}
                        />

                        <Input
                          label="المدة"
                          type="number"
                          value={field.duration}
                          onChange={(e) =>
                            handleChange(index, "duration", e.target.value)
                          }
                          placeholder="أدخل المدة"
                          variant="bordered"
                          labelPlacement="outside"
                          classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                          }}
                        />

                        <RadioGroup
                          label="النوع"
                          value={field.type}
                          onValueChange={(val) =>
                            handleChange(index, "type", val)
                          }
                          orientation="horizontal"
                          classNames={{
                            label: "text-[#272727] font-bold text-sm",
                          }}
                        >
                          <Radio value="required">إجباري</Radio>
                          <Radio value="optional">اختياري</Radio>
                        </RadioGroup>
                      </div>
                    ))}

                    <Button
                      variant="flat"
                      color="primary"
                      onClick={handleAddFields}
                    >
                      + إضافة
                    </Button>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                      type="submit"
                      color="primary"
                      className="text-white"
                      onClick={handleSubmit}
                      isLoading={AddContent.isPending}
                    >
                      حفظ
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) setIsEditModalOpen(false);
          }}
        >
          <ModalContent>
            <>
              <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
                تعديل المحتوى
              </ModalHeader>

              <ModalBody>
                {editField && (
                  <div className="flex flex-col gap-6">
                    <Input
                      label="العنوان"
                      value={editField.title}
                      onChange={(e) =>
                        setEditField({ ...editField, title: e.target.value })
                      }
                      placeholder="أدخل العنوان"
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-[#272727] font-bold text-sm",
                        inputWrapper: "shadow-none",
                      }}
                    />

                    <Input
                      label="المدة"
                      type="number"
                      value={editField.duration}
                      onChange={(e) =>
                        setEditField({ ...editField, duration: e.target.value })
                      }
                      placeholder="أدخل المدة"
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-[#272727] font-bold text-sm",
                        inputWrapper: "shadow-none",
                      }}
                    />

                    <RadioGroup
                      label="النوع"
                      value={editField.type}
                      onValueChange={(val) =>
                        setEditField({ ...editField, type: val })
                      }
                      orientation="horizontal"
                      classNames={{
                        label: "text-[#272727] font-bold text-sm",
                      }}
                    >
                      <Radio value="required">إجباري</Radio>
                      <Radio value="optional">اختياري</Radio>
                    </RadioGroup>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  type="submit"
                  color="primary"
                  className="text-white"
                  onClick={handleUpdateSubmit}
                  isLoading={UpdateContent.isPending}
                >
                  حفظ التعديلات
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

