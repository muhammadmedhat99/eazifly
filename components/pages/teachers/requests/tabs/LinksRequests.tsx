"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchClient, postData } from "@/lib/utils";
import { Loader } from "@/components/global/Loader";
import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import { CustomPagination } from "@/components/global/Pagination";
import { axios_config } from "@/lib/const";
import { getCookie } from "cookies-next";
import ConfirmModal from "@/components/global/ConfirmModal";


const columns = [
  { name: "", uid: "avatar" },
  { name: "إسم المعلم", uid: "instructor_name" },
  { name: "رقم الهاتف", uid: "phone" },
  { name: "الاستضافة", uid: "title" },
  { name: "الرابط", uid: "request_link" },
  { name: <Options />, uid: "actions" },
];

export const LinksRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(false);
  const [action, setAction] = useState<"active" | "inactive" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const params: Record<string, string | number> = {
    page: currentPage,
  };

  const { data: linksRequsts, isLoading, refetch } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/instructors/pending/links`, {
        ...axios_config,
        params,
      }),
    queryKey: ["linksRequsts", currentPage],
  });

  const updateLinkStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "active" | "inactive";
    }) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("status", status);

      return await postData(
        `client/instructors/links/status/${id}`,
        formdata,
        myHeaders
      );
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: data.message,
          color: "danger",
        });
      } else {
        addToast({
          title: data.message,
          color: "success",
        });
        refetch();
      }
    },
    onError: () => {
      addToast({
        title: "عذرا، حدث خطأ في الاتصال بالخادم",
        color: "danger",
      });
    },
  });

  // ✅ Dropdown actions
  const OptionsComponent = ({ id }: { id: number }) => {
    return (
      <Dropdown classNames={{ base: "max-w-40", content: "min-w-36" }}>
        <DropdownTrigger>
          <button>
            <Options />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="approve"
            onClick={() => {
              setSelectedId(id);
              setAction("active");
              setConfirmAction(true);
            }}
          >
            موافقة
          </DropdownItem>
          <DropdownItem
            key="reject"
            onClick={() => {
              setSelectedId(id);
              setAction("inactive");
              setConfirmAction(true);
            }}
          >
            رفض
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const formattedData =
    linksRequsts?.data?.map((item: any) => ({
      id: item.id,
      instructor_name: item.instructor_name || "N/A",
      phone: item.instructor_phone || "N/A",
      title: item.title || "N/A",
      request_link:
        item.link && item.link !== "N/A" ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {item.link}
          </a>
        ) : (
          "N/A"
        ),
      avatar: item.instructor_image || "N/A",
    })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : formattedData.length === 0 ? (
        <span className="text-gray-500 block text-center my-6">
          لا يوجد طلبات
        </span>
      ) : (
        <TableComponent
          columns={columns}
          data={formattedData}
          ActionsComponent={OptionsComponent}
          handleRowClick={() => {}}
        />
      )}

      <div className="my-10 px-6">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          last_page={linksRequsts?.meta?.last_page}
          total={linksRequsts?.meta?.total}
        />
      </div>

      {/* ✅ مودال التأكيد */}
      <ConfirmModal
        open={confirmAction}
        onCancel={() => setConfirmAction(false)}
        onConfirm={() => {
          if (selectedId && action) {
            updateLinkStatus.mutate({ id: selectedId, status: action });
          }
          setConfirmAction(false);
        }}
        title={action === "active" ? "تأكيد الموافقة" : "تأكيد الرفض"}
        message={
          action === "active"
            ? "هل أنت متأكد من أنك تريد الموافقة على هذا الطلب؟"
            : "هل أنت متأكد من أنك تريد رفض هذا الطلب؟"
        }
      />
    </>
  );
};
