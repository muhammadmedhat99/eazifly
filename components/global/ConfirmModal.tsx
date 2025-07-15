"use client";

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ModalContent } from "@heroui/react";

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
    <Modal isOpen={open} onOpenChange={(open) => !open && onCancel()} size="md">
      <ModalContent>
        <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
          {title || "تأكيد"}
        </ModalHeader>
        <ModalBody className="text-[#272727] font-bold text-sm">
          {message || "هل أنت متأكد من تنفيذ هذا الإجراء؟"}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="solid" className="text-white" onPress={onCancel}>
            إلغاء
          </Button>
          <Button color="primary" variant="solid" className="text-white" onPress={onConfirm}>
            تأكيد
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
