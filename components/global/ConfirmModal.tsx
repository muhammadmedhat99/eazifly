"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
} from "@heroui/react";
import { Danger } from "iconsax-reactjs";

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title,
  message,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={(open) => !open && onCancel()}
      size="md"
      className="rounded-2xl"
      placement="center"
    >
      <ModalContent>
        {/* العنوان */}
        <ModalHeader className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500">
            <Danger className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            {title || "تأكيد"}
          </h2>
        </ModalHeader>

        {/* الرسالة */}
        <ModalBody className="text-center text-gray-600 font-medium text-sm">
          {message || "هل أنت متأكد من تنفيذ هذا الإجراء؟"}
        </ModalBody>

        {/* الأزرار */}
        <ModalFooter className="flex justify-center gap-4">
          <Button
            color="default"
            variant="flat"
            className="px-6 rounded-xl"
            onPress={onCancel}
          >
            إلغاء
          </Button>
          <Button
            color="danger"
            variant="solid"
            className="px-6 rounded-xl text-white"
            onPress={onConfirm}
          >
            تأكيد
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
