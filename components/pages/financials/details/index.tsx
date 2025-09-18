"use client";

import {
  Button,
  Card,
  CardBody,
  Radio,
  RadioGroup,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";

export const FinancialSalaryDetails = () => {
  const [selected, setSelected] = useState("1");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");

  const methods = [
    {
      id: "1",
      type: "MasterCard",
      number: "**** 9942",
      expiry: "06/2026",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    },
    {
      id: "2",
      type: "MasterCard",
      number: "**** 9995",
      expiry: "06/2026",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    },
    {
      id: "3",
      type: "Visa",
      number: "**** 9998",
      expiry: "06/2026",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    },
  ];

  const handleConfirm = () => {
    const method = methods.find((m) => m.id === selected);
    console.log("✅ تم الصرف", {
      method,
      amount,
    });
    onClose();
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-5">
      {/* الكارت الأول */}
      <div className="flex flex-col gap-5 bg-main p-5 rounded-2xl border border-stroke w-1/2 mx-auto">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold">اسم البرنامج</span>
          <span className="text-black-text font-bold text-[15px]">
            {`الرياضيات الصف الاول`}
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">اجمالي الساعات</span>
          <span className="text-black-text font-bold text-[15px]">{`20 ساعة`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">سعر ساعة البرنامج</span>
          <span className="text-black-text font-bold text-[15px]">{`400 ج.م`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">الإجمالي</span>
          <span className="text-black-text font-bold text-[15px]">{`6000 ج.م`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">الخصومات</span>
          <span className="text-black-text font-bold text-[15px]">{`300 ج.م`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
            الإجمالي بعد الخصومات
          </span>
          <span className="text-black-text font-bold text-[15px]">{`5000 ج.م`}</span>
        </div>
      </div>

      {/* الكارت التاني */}
      <div className="flex flex-col gap-5 bg-main p-5 rounded-2xl border border-stroke w-1/2 mx-auto">
        <div className="flex flex-col gap-2">
          <span className="text-[#5E5E5E] text-sm font-bold">اسم البرنامج</span>
          <span className="text-black-text font-bold text-[15px]">
            {`الرياضيات الصف الاول`}
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">اجمالي الساعات</span>
          <span className="text-black-text font-bold text-[15px]">{`20 ساعة`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">سعر ساعة البرنامج</span>
          <span className="text-black-text font-bold text-[15px]">{`400 ج.م`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">الإجمالي</span>
          <span className="text-black-text font-bold text-[15px]">{`6000 ج.م`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">الخصومات</span>
          <span className="text-black-text font-bold text-[15px]">{`300 ج.م`}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[#5E5E5E] text-sm font-bold">
            الإجمالي بعد الخصومات
          </span>
          <span className="text-black-text font-bold text-[15px]">{`5000 ج.م`}</span>
        </div>
      </div>

      {/* اختيار طريقة الدفع */}
      <div className="flex flex-col gap-5 bg-main p-5 rounded-2xl border border-stroke w-1/2 mx-auto">
        <div className="text-[#5E5E5E] text-sm font-bold">اختر طريقة الدفع</div>
        <RadioGroup value={selected} onValueChange={setSelected} className="gap-4">
          {methods.map((method) => (
            <Radio
              key={method.id}
              value={method.id}
              classNames={{
                base: "w-full",
                label: "w-full",
              }}
            >
              <Card
                shadow="sm"
                radius="lg"
                className={`w-full transition ${
                  selected === method.id ? "border-2 border-primary" : ""
                }`}
              >
                <CardBody className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-48">
                    <img
                      src={method.logo}
                      alt={method.type}
                      className="w-12 h-auto"
                    />
                    <div>
                      <div className="font-semibold">{method.type}</div>
                      <div className="text-default-500">{method.number}</div>
                      <div className="text-small text-default-400">
                        Expiry: {method.expiry}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Radio>
          ))}
        </RadioGroup>
      </div>

      {/* زرار تم الصرف */}
      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          variant="solid"
          color="primary"
          className="text-white"
          onPress={onOpen}
        >
          تم الصرف
        </Button>
      </div>

      {/* مودال إدخال الرقم */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>تأكيد عملية الصرف</ModalHeader>
          <ModalBody>
            <Input
              type="number"
              label="المبلغ المصروف"
              placeholder="أدخل المبلغ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              إلغاء
            </Button>
            <Button color="primary" className="text-white" onPress={handleConfirm}>
              تأكيد
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
