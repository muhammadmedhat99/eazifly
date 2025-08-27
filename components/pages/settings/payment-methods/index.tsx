"use client";

import React, { useContext, useMemo, useState } from "react";
import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import {
  addToast,
  avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { CustomPagination } from "@/components/global/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";
import { Loader } from "@/components/global/Loader";
import { formatDate } from "@/lib/helper";
import ConfirmModal from "@/components/global/ConfirmModal";
import { getCookie } from "cookies-next";

const columns = [
    { name: "الصورة", uid: "avatar" },
    { name: "وسيلة الدفع", uid: "name" },
    { name: "الحالة", uid: "status" },
    { name: <Options />, uid: "actions" },
];

const OptionsComponent = ({ id, currentStatus }: { id: number; currentStatus: "active" | "inactive" }) => {
  const [confirmAction, setConfirmAction] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"active" | "inactive" | null>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const queryClient = useQueryClient();


  const handleChangeStatusClick = () => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setPendingStatus(newStatus);
    setCurrentId(id);
    setConfirmAction(true);
  };

  const UpdatePaymentMethods = useMutation({
    mutationFn: ({ id, status }: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("status", status);

      return postData(`client/payment/method/update/${id}`, formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({ title: "error", color: "danger" });
      } else {
        addToast({ title: data?.message, color: "success" });
        queryClient.invalidateQueries({ queryKey: AllQueryKeys.GetAllPaymentMethods });
      }
    },
    onError: () => {
      addToast({ title: "عذرا حدث خطأ ما", color: "danger" });
    },
  });


  return (
    <>
      <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
        <DropdownTrigger>
          <button>
            <Options />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem href={`/settings/payment-methods/${id}`} key="show">
            عرض البيانات
          </DropdownItem>
          <DropdownItem key="actions" onClick={handleChangeStatusClick}>
            تغير الحالة
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ConfirmModal
        open={confirmAction}
        onCancel={() => {
          setConfirmAction(false);
          setPendingStatus(null);
          setCurrentId(null);
        }}
        onConfirm={() => {
          if (!pendingStatus || !currentId) return;
          UpdatePaymentMethods.mutate({
            status: pendingStatus,
            id: currentId,
          });
          setConfirmAction(false);
          setPendingStatus(null);
          setCurrentId(null);
        }}
        title="تأكيد تغير الحالة"
        message="هل أنت متأكد من أنك تريد تغير حالة وسيلة الدفع؟"
      />

    </>
  );
};

export const AllPaymentMethods = () => {
  const [nameSearch, setNameSearch] = useState("");
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  if (debouncedNameSearch) {
    params.name = debouncedNameSearch;
  }

  const { data: paymentMethodsData, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/payment/method`, {
        ...axios_config,
        params,
      }),
    queryKey: AllQueryKeys.GetAllPaymentMethods
  });

  const formattedData =
    paymentMethodsData?.data?.map((item: any) => ({
      id: item.id,
      avatar: item.image,
      name: item.title || "N/A",
      status: {
        name: item.status || "N/A",
        color:
          item?.status === "active"
            ? "success"
            : "warning",
      },
      currentStatus: item.status,
      created_at: formatDate(item.created_at) || "N/A",
    })) || [];

  return (
    <>
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="relative md:min-w-80">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1 size="18" className="text-gray-400" variant="Outline" />
            </div>
            <input
              type="text"
              placeholder="بحث بالاسم..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="primary"
                className="text-primary font-semibold gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                ترتيب حسب
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="show">الإسم</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Button
            id="all"
            variant="flat"
            color={selectedStatus === "all" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            الكل
          </Button>
          <Button
            id="active"
            variant="flat"
            color={selectedStatus === "active" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            نشط
          </Button>
          <Button
            id="new"
            variant="flat"
            color={selectedStatus === "new" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            جديد
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <TableComponent
          columns={columns}
          data={formattedData}
            ActionsComponent={({ id, currentStatus }) => (
              <OptionsComponent id={id} currentStatus={currentStatus} />
            )}
          />
      )}

      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={paymentMethodsData?.meta?.last_page}
          total={paymentMethodsData?.meta?.total}
        />
      </div>
    </>
  );
};
