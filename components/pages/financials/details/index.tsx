"use client";

import ConfirmModal from "@/components/global/ConfirmModal";
import { Loader } from "@/components/global/Loader";
import { axios_config } from "@/lib/const";
import { fetchClient, postData } from "@/lib/utils";
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
  Chip,
  addToast,
  Card,
  CardBody,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useState } from "react";

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

export const FinancialSalaryDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<"bonus" | "deduction" | null>(null);
  const [value, setValue] = useState("");
  const [confirmAction, setConfirmAction] = useState(false);
  const [selected, setSelected] = useState("1");
  const [amount, setAmount] = useState("");

  const params = useParams();
  const salary_id = params.id;

  const { data, isLoading, refetch } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/get/salary/${salary_id}`, {
        ...axios_config,
        params,
      }),
    queryKey: ['salaryDetails', salary_id],
  });

const handleConfirm = () => {
  setConfirmAction(true);
};

const TransferSalary = useMutation({
  mutationFn: () => {
    const myHeaders = new Headers();
    myHeaders.append("local", "ar");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

    const formdata = new FormData();
    formdata.append("status", "transferred");
    formdata.append("amount", amount);

    return postData(
      `client/change/instructor/total/salary/status/${salary_id}`,
      formdata,
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
        title: "تم التحويل بنجاح",
        color: "success",
      });
      refetch();
      setConfirmAction(false);
      onClose(); 
    }
  },
  onError: () => {
    addToast({
      title: "عذرا حدث خطأ ما",
      color: "danger",
    });
  },
});

const handleConfirmAction = () => {
  TransferSalary.mutate();
};
  
  return (
    isLoading ? (<Loader />) : (
      <div className="p-5 grid grid-cols-1 gap-5">
      <ConfirmModal
        open={confirmAction}
        title={"تأكيد عملية الصرف"}
        message={`هل أنت متأكد من صرف مبلغ ${amount} ج.م ؟`}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(false)}
      />
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
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-black-text font-bold text-[15px]">
                    {data?.data?.total.instructor}
                  </span>
                  <span className="text-[#5E5E5E] text-sm font-semibold">
                    {data?.data?.total?.release_date &&
                      new Date(data.data.total.release_date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                      })}
                  </span>
                </div>

                {/* الحالة Chip */}
                <Chip
                  className="capitalize px-4 min-w-24 text-center"
                  color={data?.data?.total?.status?.color}
                  variant="flat"
                >
                  <span className={`text-${data?.data?.total?.status?.color} font-bold`}>
                    {data?.data?.total?.status?.label}
                  </span>
                </Chip>
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
          onPress={onOpen}
          disabled={data?.data?.total.status.key !== "approved"}
           className={data?.data?.total.status.key !== "approved"
        ? "opacity-50 cursor-not-allowed text-gray-500 text-white"
        : "hover:opacity-90 text-white"}
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
    )
  );
};
