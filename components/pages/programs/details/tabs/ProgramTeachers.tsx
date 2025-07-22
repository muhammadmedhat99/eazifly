"use client";

import { Options } from "@/components/global/Icons";
import TableComponent from "@/components/global/Table";
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useState } from "react";
import AddTeacherModal from "./AddTeacherModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { axios_config } from "@/lib/const";
import { fetchClient, postData } from "@/lib/utils";
import { Loader } from "@/components/global/Loader";
import { getCookie } from "cookies-next";
import ConfirmModal from "@/components/global/ConfirmModal";

const columns = [
  { name: "", uid: "avatar" },
  { name: "الاسم", uid: "name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "البريد الإلكترونى", uid: "email" },
  { name: "تاريخ التقديم", uid: "created_at" },
  { name: "التخصص", uid: "specializations" },
  { name: "سعر الساعة", uid: "amount_per_hour" },
  { name: "الحالة", uid: "status" },
  { name: "", uid: "delete" },
];

const OptionsComponent = ({ id }: { id: number }) => {
  return (
    <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
      <DropdownTrigger>
        <button>
          <Options />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="actions">تعديل السعر</DropdownItem>
        <DropdownItem key="delete">حذف</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

type Instructor = {
  id: number;
  name_en: string;
  name_ar: string;
  phone: string;
  status: string;
  email: string;
  whats_app: string;
  created_at: string;
  address: string;
  age: string;
  experience_years: string;
  gender: string;
  can_approve_question: string;
  image: string;
  specializations: any[];
  instructor_payment_method_id: number;
  amount_per_hour: string;
};
type InstructorsProps = {
  teachersData: Instructor[];
};

export const ProgramTeachers = ({ teachersData }: InstructorsProps) => {

  const [modalOpen, setModalOpen] = useState(false);
  const params = useParams();
  const programId = params.id;
  const queryClient = useQueryClient();


  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleRemove = useMutation({
    mutationFn: (item: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("program_id", programId.toString());
      formdata.append("instructor_id", item.id); // من الـ item

      return postData("client/program/remove/assign/instructor", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: data?.message, color: "success" });
        queryClient.invalidateQueries({ queryKey: ["GetProgramDetails", programId] });
      }
    },
    onError: () => {
      addToast({ title: "عذرا حدث خطأ ما", color: "danger" });
    },
  });

  const handleConfirmRemove = () => {
    if (selectedItem) {
      handleRemove.mutate(selectedItem);
      setConfirmAction(false);
      setSelectedItem(null);
    }
  };

  const tableData = teachersData?.map((item: any) => ({
    id: item.id,
    avatar: item.image,
    name: item.name_ar || item.name_en,
    phone: item.phone,
    email: item.email,
    amount_per_hour: item.amount_per_hour,
    created_at: new Date(item.created_at).toLocaleDateString("ar-EG"),
    specializations:
        item.specializations?.length > 0
          ? `${item.specializations[0]?.title}${item.specializations.length > 1 ? ` (+${item.specializations.length})` : ""}`
          : "N/A",
    status: {
      name: item.status.label || "N/A",
      color: item?.status?.color ,
    },
  })) ?? [];;

  return (
    <div className="bg-main">
      <ConfirmModal
        open={confirmAction}
        onCancel={() => {
          setConfirmAction(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmRemove}
        title="تأكيد الحذف"
        message="هل أنت متأكد من أنك تريد حذف هذا المدرس من البرنامج؟"
      />
      <TableComponent
        columns={columns}
        data={tableData}
        ActionsComponent={OptionsComponent}
        setConfirmAction={setConfirmAction}
        setSelectedItem={setSelectedItem}
      />
      <div className="flex justify-end p-4">
        <Button
        onPress={()=>setModalOpen(true)}
          className="text-white font-semibold text-sm px-6 py-2 rounded-md bg-primary"
        >
          إضافة معلم
        </Button>
      </div>
      <AddTeacherModal
        isOpen={modalOpen}
        onClose={()=>setModalOpen(false)}
        tableTeachers={tableData}
      />
    </div>
  );
};
