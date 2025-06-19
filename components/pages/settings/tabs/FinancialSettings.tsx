import { Button, Input } from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";
import { Edit2, EmptyWalletChange } from "iconsax-reactjs";
import PaymentModal from "../PaymentModal";
import { fetchClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";

interface PaymentMethod {
  id: number;
  image: string;
  title: string;
  description: string;
  how_to_use: string;
  how_to_use_type: string;
}

export const FinancialSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const { data: paymentData, isLoading } = useQuery({
    queryFn: async () => await fetchClient(`client/payment/method`, axios_config),
    queryKey: ["GetPaymentMethods"],
  });

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

      {isLoading ? (
        <Loader />
      ) : (
        paymentData?.data?.map((item: PaymentMethod) => (
          <div
            key={item.id}
            className="flex justify-between relative touch-none tap-highlight-transparent select-none w-full bg-content1 items-center border border-stroke max-w-full justify-between rounded-2xl gap-2 p-4 data-[selected=true]:border-success"
          >
            <div className="flex items-center gap-2">
              {item.image ? (
                <Image
                  src={item.image}
                  width={32}
                  height={32}
                  alt="instapay"
                />
              ) : <EmptyWalletChange size={32} />}
              <div className="flex flex-col gap-1">
                <p className="font-bold text-black-text">{item.title}</p>
                <p className="font-bold text-xs text-title/60">
                  {item.description}
                </p>
              </div>
            </div>
            <Button
              onPress={handleOpenModal}
              className="flex items-center gap-1 text-primary bg-transparent hover:bg-transparent active:bg-transparent shadow-none border-none"
            >
              <Edit2 size={18} />
              <span className="text-sm font-bold">تعديل</span>
            </Button>
          </div>
        ))
      )}

    </div>
  );
};
