"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Image,
} from "@heroui/react";
import { useState } from "react";

export const SalaryDetails = ({ data }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<"bonus" | "deduction" | null>(null);
  const [value, setValue] = useState("");

  const handleOpen = (type: "bonus" | "deduction") => {
    setModalType(type);
    setValue("");
    onOpen();
  };

  const handleSubmit = () => {
    console.log(
      `تم إضافة ${modalType === "bonus" ? "حافز" : "خصم"} بقيمة: ${value}`
    );
    onClose();
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-5">
      <div className="flex flex-col gap-5 bg-main p-5 rounded-2xl border border-stroke w-1/2 mx-auto">
        {/* البرامج */}
        {data?.data?.programs?.map((program: any) => {
          const totalCredit = program.transactions.reduce(
            (sum: number, t: any) => sum + (t.credit || 0),
            0
          );
          const totalDebit = program.transactions.reduce(
            (sum: number, t: any) => sum + (t.debit || 0),
            0
          );
          const net = totalCredit - totalDebit;

          // ✅ إجمالي الساعات
          const totalHours = program.transactions.reduce(
            (sum: number, t: any) => sum + Number(t.duration || 0) / 60,
            0
          );

          // سعر الساعة (الاضافات / اجمالي الساعات)
          const hourRate = totalHours > 0 ? totalCredit / totalHours : 0;


          return (
            <div
              key={program.program_id}
              className="flex flex-col gap-3 pb-4 border-b border-stroke"
            >
              <span className="text-[#5E5E5E] text-sm font-bold">
                اسم البرنامج
              </span>
              <div className="flex items-center gap-3">
                {program.program_image && (
                  <Image
                    src={program.program_image}
                    alt={program.program_name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
                <span className="text-black-text font-bold text-[15px]">
                  {program.program_name}
                </span>
              </div>

              <div className="flex flex-col gap-2 pl-3 mt-2 ps-5">
                <div className="flex justify-between">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    اجمالي الساعات
                  </span>
                  <span className="text-black font-bold text-[15px]">
                    {totalHours} ساعة
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    سعر ساعة البرنامج
                  </span>
                  <span className="text-black font-bold text-[15px]">
                    {hourRate.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    الإضافات
                  </span>
                  <span className="text-green-600 font-bold text-[15px]">
                    +{Number(totalCredit)} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    الخصومات
                  </span>
                  <span className="text-red-600 font-bold text-[15px]">
                    -{Number(totalDebit)} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E5E5E] text-sm font-bold">
                    الإجمالي
                  </span>
                  <span className="text-black-text font-bold text-[15px]">
                    {net} ج.م
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* الملخص */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between">
            <span className="text-[#5E5E5E] text-sm font-bold">اجمالي الساعات</span>
            <span className="text-black font-bold text-[15px]">
              {data?.data?.total?.duration / 60} ساعة
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5E5E5E] text-sm font-bold">الإضافات</span>
            <span className="text-green-600 font-bold text-[15px]">
              +{data?.data?.total?.credit} ج.م
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5E5E5E] text-sm font-bold">الخصومات</span>
            <span className="text-red-600 font-bold text-[15px]">
              -{data?.data?.total?.debit} ج.م
            </span>
          </div>
          <div className="flex justify-between border-t border-stroke pt-2">
            <span className="text-[#5E5E5E] text-sm font-bold">
              الإجمالي الكلي
            </span>
            <span className="text-black-text font-bold text-[15px]">
              {data?.data?.total?.credit - data?.data?.total?.debit} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex items-center justify-end gap-4 mt-8">
        <Button variant="solid" color="primary" className="text-white">
          موافقة
        </Button>
        <Button
          onPress={() => handleOpen("bonus")}
          variant="flat"
          color="success"
        >
          إضافة حافز
        </Button>
        <Button
          onPress={() => handleOpen("deduction")}
          variant="flat"
          color="danger"
        >
          إضافة خصم
        </Button>
      </div>

      {/* المودال */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {modalType === "bonus" ? "إضافة حافز" : "إضافة خصم"}
          </ModalHeader>
          <ModalBody>
            <Input
              type="number"
              label="المبلغ"
              placeholder="أدخل المبلغ"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              إلغاء
            </Button>
            <Button
              color="primary"
              className="text-white"
              onPress={handleSubmit}
            >
              حفظ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
