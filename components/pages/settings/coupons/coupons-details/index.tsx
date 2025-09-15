"use client";
import { Edit2 } from "iconsax-reactjs";

import {
  Avatar,
  Input,
  Button,
  addToast,
  Select,
  SelectItem,
} from "@heroui/react";
import { formatDate } from "@/lib/helper";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, fetchData, postData } from "@/lib/utils";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";

type CouponDetailsProps = {
  data: {
    data: {
      id: number;
      code: string;
      discount: number;
      discount_type: "fixed" | "percentage";
      expire_date: string;
      times_used: string;
      already_used: string;
      created_at: string;
      status: string;
    };
  };
};

const schema = yup
  .object({
    code: yup
      .string()
      .required("ادخل كود الخصم")
      .min(3, "كود الخصم لا يجب أن يقل عن ٣ أحرف"),

    discount: yup
      .number()
      .typeError("ادخل قيمة الخصم")
      .required("ادخل قيمة الخصم")
      .min(1, "قيمة الخصم يجب أن تكون أكبر من صفر"),

    discount_type: yup
      .string()
      .required("اختر نوع الخصم")
      .oneOf(["fixed", "percentage"], "نوع الخصم غير صحيح"),

    expire_date: yup
      .string()
      .typeError("ادخل تاريخ صحيح")
      .required("ادخل تاريخ الانتهاء"),

    times_used: yup
      .number()
      .typeError("ادخل عدد مرات الاستخدام")
      .required("ادخل عدد مرات الاستخدام")
      .min(0, "لا يمكن أن يكون أقل من صفر"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const CouponsDetails = ({ data }: CouponDetailsProps) => {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      code: data?.data?.code || "",
      discount: data?.data?.discount ? Number(data.data.discount) : undefined,
      discount_type: data?.data?.discount_type || "",
      expire_date: data?.data?.expire_date || "",
      times_used: data?.data?.times_used
        ? Number(data.data.times_used)
        : undefined,
    },
  });

  const { data: couponData, isLoading } = useQuery({
    queryKey: ["coupon", id],
    queryFn: async () =>
      await fetchClient(`client/coupon/show/${id}`, axios_config),
  });

  const onSubmit = (data: FormData) => UpdateCoupon.mutate(data);

  const UpdateCoupon = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("code", submitData.code);
      formdata.append("discount", submitData.discount.toString());
      formdata.append("discount_type", submitData.discount_type);
      const expireDate = new Date(submitData.expire_date)
        .toISOString()
        .split("T")[0];
      formdata.append("expire_date", expireDate);
      formdata.append("times_used", submitData.times_used.toString());

      return postData(
        `client/coupon/update/${data.data.id}`,
        formdata,
        myHeaders
      );
    },
    onSuccess: (data) => {
      if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["coupon", id] });
      }
      setEditField(null);
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const handleStatusChange = () => {
    UpdateStatus.mutate();
  };

  const UpdateStatus = useMutation({
    mutationFn: () => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();

      return postData(
        `client/coupon/toggle/status/${id}`,
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
          title: response?.message,
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["coupon", id] });
      }
    },
    onError: () => {
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  return isLoading ? (
    <Loader />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* كود الخصم */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">كود الخصم</span>
          {editField === "code" ? (
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="أدخل كود الخصم" size="sm" />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {couponData?.data?.code}
            </span>
          )}
        </div>
        {editField === "code" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("code")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الحالة</span>
          <div
            className={`text-${data?.data?.status === "inactive" ? "warning" : "success"}
              bg-${data?.data?.status === "inactive" ? "warning" : "success"} bg-opacity-10
              px-5 py-1 rounded-3xl font-bold text-[15px]`}
          >
            {data?.data?.status}
          </div>
        </div>
          {data.data?.status === "inactive" && (
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-bold text-success"
              onClick={() => handleStatusChange()}
            >
              <Edit2 size={18} />
              نشر
            </button>
          )}
          {data.data?.status === "active" && (
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-bold text-warning"
              onClick={() => handleStatusChange()}
            >
              <Edit2 size={18} />
              أرشفة
            </button>
          )}
      </div>

      {/* قيمة الخصم */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">قيمة الخصم</span>
          {editField === "discount" ? (
            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="قيمة الخصم"
                  size="sm"
                  type="number"
                  value={field.value !== undefined ? String(field.value) : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {couponData?.data?.discount}
            </span>
          )}
        </div>
        {editField === "discount" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("discount")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      {/* نوع الخصم */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-[#5E5E5E] text-sm font-bold">نوع الخصم</span>
          {editField === "discount_type" ? (
            <Controller
              name="discount_type"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="اختر نوع الخصم"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) =>
                    field.onChange(Array.from(keys)[0])
                  }
                >
                  <SelectItem key="fixed">ثابت</SelectItem>
                  <SelectItem key="percentage">نسبة مئوية</SelectItem>
                </Select>
              )}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {couponData?.data?.discount_type === "fixed"
                ? "ثابت"
                : "نسبة مئوية"}
            </span>
          )}
        </div>
        {editField === "discount_type" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("discount_type")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      {/* تاريخ الانتهاء */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تاريخ الانتهاء
          </span>
          {editField === "expire_date" ? (
            <Controller
              name="expire_date"
              control={control}
              render={({ field }) => <Input {...field} type="date" size="sm" />}
            />
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {couponData?.data?.expire_date}
            </span>
          )}
        </div>
        {editField === "expire_date" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("expire_date")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      {/* عدد مرات الاستخدام */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            عدد مرات الاستخدام
          </span>
          {editField === "times_used" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="times_used"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="عدد مرات الاستخدام"
                      size="sm"
                      type="number"
                      value={
                        field.value !== undefined ? String(field.value) : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {couponData?.data?.times_used}
            </span>
          )}
        </div>

        {editField === "times_used" ? (
          <Button
            size="sm"
            color="primary"
            variant="solid"
            className="text-white"
            type="submit"
          >
            حفظ
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setEditField("times_used")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      {/* تم استخدامه مسبقًا */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تم استخدامه مسبقًا
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {couponData?.data?.already_used}
          </span>
        </div>
      </div>

      {/* تاريخ الإنشاء */}
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تاريخ الإنشاء
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {formatDate(couponData?.data?.created_at)}
          </span>
        </div>
      </div>
    </form>
  );
};
