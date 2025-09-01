"use client";
import { Edit2 } from "iconsax-reactjs";

import { Avatar, Input, Button, image, addToast, Switch, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
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
import Link from "next/link";
import ConfirmModal from "@/components/global/ConfirmModal";

type paymentDetailsProps = {
  data: {
    data: {
      id: number;
      title_ar: string;
      title_en: string;
      image: string;
      created_at: string;
      how_to_use: string;
      keys: { pay_on: string; max_value: string }[];
      status: "active" | "inactive";
    };
  };
};

const schema = yup
  .object({
    title_ar: yup
      .string()
      .required("ادخل الاسم بالعربية")
      .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),

    title_en: yup
      .string()
      .required("ادخل الاسم بالإنجليزية")
      .min(3, "الاسم لا يجب أن يقل عن ٣ أحرف"),

    image: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
    how_to_use: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
    qr_image: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),

    keys: yup
      .array()
      .of(
        yup.object().shape({
          pay_on: yup.string().required("رقم الهاتف مطلوب"),
          max_value: yup.string().required("القيمة القصوى مطلوبة"),
        })
      )
      .min(1, "يجب إضافة مفتاح واحد على الأقل").required(),
    status: yup.string().oneOf(["active", "inactive"]).required(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const PaymentMethodDetails = ({ data }: paymentDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const [editField, setEditField] = useState<string | null>(null);
  const { control, handleSubmit, getValues, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title_ar: data?.data?.title_ar || "",
      title_en: data?.data?.title_en || "",
      keys: data?.data?.keys || [],
      status:  data?.data?.status || "",
    },
  });

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payment", id],
    queryFn: async () =>
      await fetchClient(`client/payment/method/show/${id}`, axios_config),
  });

  const onSubmit = (data: FormData) => UpdatePaymentMethods.mutate(data);

  const UpdatePaymentMethods = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("ar[title]", submitData.title_ar);
      formdata.append("en[title]", submitData.title_en);
      if (submitData.image?.length) {
        formdata.append("image", submitData.image[0]);
      }
      if (submitData.how_to_use?.length) {
        formdata.append("how_to_use", submitData.how_to_use[0]);
      }
      if (submitData.status) {
        formdata.append("status", submitData.status);
      }
      submitData.keys?.forEach((key: any, index: number) => {
        formdata.append(`keys[${index}][pay_on]`, key.pay_on);
        formdata.append(`keys[${index}][max_value]`, key.max_value);
      });

      return postData(
        `client/payment/method/update/${data.data.id}`,
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
        queryClient.invalidateQueries({ queryKey: ["payment", id] });
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

  const [confirmAction, setConfirmAction] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"active" | "inactive" | null>(null);

  const handleConfirmRemove = () => {
  if (!pendingStatus) return;
  UpdatePaymentMethods.mutate({
    ...getValues(),
    status: pendingStatus,
  });
  setConfirmAction(false);
  setPendingStatus(null);
};

  return isLoading ? (
    <Loader />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <form>
              <ModalHeader className="font-bold">إضافة وسيلة دفع جديدة</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4 w-full">
                    <span className="text-[#5E5E5E] text-sm font-bold">الدفع على</span>
                    
                      <Controller
                      name={`keys.${paymentData?.data?.keys?.length ? paymentData.data.keys.length : 0}.pay_on`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="نص الكتابة" type="text" />
                        )}
                      />

                    <span className="text-[#5E5E5E] text-sm font-bold">أقصى قيمة</span>
                     <Controller
                        name={`keys.${paymentData?.data?.keys?.length ? paymentData.data.keys.length : 0}.max_value`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="نص الكتابة" type="number" />
                        )}
                      />
                  </div>
                </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button color="primary" className="text-white" onPress={() => {UpdatePaymentMethods.mutate(getValues()); setIsOpen(false)}} isLoading={UpdatePaymentMethods.isPending}>
                  حفظ
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
        <ConfirmModal
          open={confirmAction}
          onCancel={() => {
            setConfirmAction(false);
            setPendingStatus(null);
            setValue("status", watch("status") === "active" ? "inactive" : "active");
          }}
          onConfirm={handleConfirmRemove}
          title="تأكيد تغير الحالة"
          message="هل أنت متأكد من أنك تريد تغير حالة وسيلة الدفع؟"
        />

        <div>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${field.value === "inactive" ? "text-warning" : "text-gray-500"
                    }`}
                >
                  inactive
                </span>

                <Switch
                  isSelected={field.value === "active"}
                  onValueChange={(selected) => {
                    const newStatus = selected ? "active" : "inactive";
                    setPendingStatus(newStatus);
                    field.onChange(newStatus);
                    setConfirmAction(true);
                  }}
                  color="success"
                />

                <span
                  className={`text-sm font-bold ${field.value === "active" ? "text-green-600" : "text-gray-500"
                    }`}
                >
                  active
                </span>
              </div>
            )}
          />
         
        </div>
        <div className="flex justify-end">
          <Button
            onPress={() => setIsOpen(true)}
            className="text-white font-semibold text-sm px-6 rounded-md bg-primary"
          >
            اضافة وسيلة دفع جديدة
          </Button>
        </div>
        <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الاسم</span>
          {editField === "name" ? (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="title_ar"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="الاسم بالعربية" size="sm" />
                  )}
                />
                <Controller
                  name="title_en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="الاسم بالإنجليزية"
                      size="sm"
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <span className="text-black-text font-bold text-[15px]">
              {`${paymentData?.data?.title_ar} / ${paymentData?.data?.title_en}`}
            </span>
          )}
        </div>

        {editField === "name" ? (
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
            onClick={() => setEditField("name")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            تاريخ الإنشاء
          </span>
          <span className="text-black-text font-bold text-[15px]">
            {formatDate(paymentData?.data?.created_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">الصورة</span>
          {editField === "image" ? (
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <DropzoneField
                  value={field.value as any}
                  onChange={field.onChange}
                  description="تحميل صورة جديدة"
                />
              )}
            />
          ) : (
            <Avatar
              size="lg"
              radius="sm"
              showFallback
              src={paymentData?.data?.image}
              name={paymentData?.data?.name}
            />
          )}
        </div>

        {editField === "image" ? (
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
            onClick={() => setEditField("image")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>
      <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
        <div className="flex flex-col gap-4">
          <span className="text-[#5E5E5E] text-sm font-bold">
            كيفية الاستخدام
          </span>
          {editField === "how_to_use" ? (
            <Controller
              name="how_to_use"
              control={control}
              render={({ field }) => (
                <DropzoneField
                  value={field.value as any}
                  onChange={field.onChange}
                  description="تحميل صورة جديدة"
                />
              )}
            />
          ) : paymentData?.data?.how_to_use ? (
            <Link href={paymentData?.data?.how_to_use} className="text-primary">
              رايط الاستخدام
            </Link>
          ) : (
            "لا يوجد"
          )}
        </div>

        {editField === "how_to_use" ? (
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
            onClick={() => setEditField("how_to_use")}
            className="flex items-center gap-1 text-sm font-bold"
          >
            <Edit2 size={18} />
            تعديل
          </button>
        )}
      </div>

        {paymentData?.data?.keys?.map((_: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke"
          >
            <div className="flex flex-col gap-4 w-full">
              <span className="text-[#5E5E5E] text-sm font-bold">الدفع على</span>
              {editField === `key-${index}` ? (
                <Controller
                  name={`keys.${index}.pay_on`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="نص الكتابة" type="text" />
                  )}
                />
              ) : (
                <span className="text-black-text font-bold text-[15px]">
                  {paymentData?.data?.keys[index]?.pay_on}
                </span>
              )}

              <span className="text-[#5E5E5E] text-sm font-bold">أقصى قيمة</span>
              {editField === `key-${index}` ? (
                <Controller
                  name={`keys.${index}.max_value`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="نص الكتابة" type="number" />
                  )}
                />
              ) : (
                <span className="text-black-text font-bold text-[15px]">
                  {paymentData?.data?.keys[index]?.max_value}
                </span>
              )}
            </div>

            <div className="flex gap-2 items-center">
              {editField === `key-${index}` ? (
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
                <>
                  <button
                    type="button"
                    onClick={() => setEditField(`key-${index}`)}
                    className="flex items-center gap-1 text-sm font-bold"
                  >
                    <Edit2 size={18} />
                    تعديل
                  </button>

                    <button
                      type="button"
                      className="flex items-center gap-1 text-sm font-bold text-red-500"
                      onClick={() => {
                        const currentKeys = getValues("keys") || [];
                        const updatedKeys = currentKeys.filter((_: any, i: number) => i !== index);

                        setValue("keys", updatedKeys, { shouldValidate: true });

                        UpdatePaymentMethods.mutate({
                          ...getValues(),
                          keys: updatedKeys,
                        });
                      }}
                    >
                      حذف
                    </button>
                </>
              )}
            </div>
          </div>
        ))}

    </form>
  );
};
