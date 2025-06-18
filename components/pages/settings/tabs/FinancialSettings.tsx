import { Button, Input } from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";
import { Edit2 } from "iconsax-reactjs";
import PaymentModal from "../PaymentModal";


export const FinancialSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="flex justify-end">
        <Button
          onPress={handleOpenModal}
          className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
        >
          اضافة وسيلة دفع جديدة
        </Button>
      </div>
      <div className="flex justify-between relative touch-none tap-highlight-transparent select-none w-full bg-content1 items-center border border-stroke max-w-full justify-between rounded-2xl gap-2 p-4 data-[selected=true]:border-success">
        <div className="flex items-center gap-2">
          <Image
            src="/img/static/instapay.png"
            width={32}
            height={32}
            alt="instapay"
          />
          <div className="flex flex-col gap-1">
            <p className="font-bold text-black-text">تطبيق إنستا باي</p>
            <p className="font-bold text-xs text-title/60">
              مثال :هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال
              النص. مثال :هذا النص هو جزء من عملية تحسين{" "}
            </p>
          </div>
        </div>
        <Button onPress={handleOpenModal} className="flex items-center gap-1 text-primary bg-transparent hover:bg-transparent active:bg-transparent shadow-none border-none">
          <Edit2 size={18} />

          <span className="text-sm font-bold">تعديل</span>
        </Button>
      </div>
    </div>
  );
};
