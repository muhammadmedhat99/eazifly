import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  addToast,
  Input,
  Select,
  SelectItem,
  Avatar,
  Spinner
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { DropzoneField } from "@/components/global/DropZoneField";
import { useParams } from 'next/navigation';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

const schema = yup
  .object({
    first_name: yup
      .string()
      .required("ادخل الاسم الأول")
      .min(3, "الاسم الأول لا يجب ان يقل عن ٣ احرف"),
    last_name: yup
      .string()
      .required("ادخل الاسم الأخير")
      .min(3, "الاسم الأخير لا يجب ان يقل عن ٣ احرف"),
    user_name: yup
      .string()
      .required("ادخل اسم المستخدم")
      .min(3, "اسم المستخدم لا يجب ان يقل عن ٣ احرف"),
    email: yup
      .string()
      .email("ادخل بريد إلكتروني صحيح")
      .required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
    country_code: yup.string().required("ادخل كود الدولة"),
    whats_app: yup.string().required("ادخل رقم الواتس آب"),
    password: yup.string().required("ادخل كلمة المرور"),
    password_confirmation: yup
      .string()
      .required("ادخل تأكيد كلمة المرور")
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة"),
    gender: yup.string().required("برجاء اختيار الجنس"),
    age: yup.string().required("ادخل العمر"),
    country: yup.string().required("إختر الدولة"),
    image: yup
      .mixed<FileList>()
      .test(
        "fileType",
        "الرجاء تحميل ملف صحيح",
        (value) => value && value.length > 0
      )
      .required("الرجاء تحميل ملف"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function AddStudentModal({
  isOpen,
  onClose,
  student,
}: StudentModalProps) {
  const params = useParams();
  const user_id = params.id;

  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => CreateStudent.mutate(data);

  const CreateStudent = useMutation({
    mutationFn: (submitData: FormData) => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      if (typeof user_id === 'string') {
        formdata.append("parent_id", user_id);
      } 
      formdata.append("first_name", submitData.first_name);
      formdata.append("last_name", submitData.last_name);
      formdata.append("user_name", submitData.user_name);
      formdata.append("email", submitData.email);
      formdata.append("phone", submitData.phone);
      formdata.append("country_code", submitData.country_code);
      formdata.append("whats_app", submitData.whats_app);
      formdata.append("password", submitData.password);
      formdata.append(
        "password_confirmation",
        submitData.password_confirmation
      );
      formdata.append("gender", submitData.gender);
      formdata.append("age", submitData.age);
      formdata.append("country", submitData.country);
      {
        submitData.image && formdata.append("image", submitData.image[0]);
      }

      return postData("client/user/store", formdata, myHeaders);
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
        reset();
        onClose();
      }
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllCountries,
    queryFn: async () => await fetchClient(`client/countries`, axios_config),
  });


  return (
    <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}  onOpenChange={(open) => !open && onClose()} size="4xl">
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              أضافة طالب جديد
            </ModalHeader>

            <ModalBody>
                          <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
                          >
                              <Input
                                  label="الاسم الأول"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("first_name")}
                                  isInvalid={!!errors.first_name?.message}
                                  errorMessage={errors.first_name?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="الاسم الأخير"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("last_name")}
                                  isInvalid={!!errors.last_name?.message}
                                  errorMessage={errors.last_name?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="اسم المستخدم"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("user_name")}
                                  isInvalid={!!errors.user_name?.message}
                                  errorMessage={errors.user_name?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="البريد الإلكتروني"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("email")}
                                  isInvalid={!!errors.email?.message}
                                  errorMessage={errors.email?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                        label="رقم الهاتف"
                                        placeholder="نص الكتابه"
                                        type="text"
                                        {...register("phone")}
                                        isInvalid={!!errors.phone?.message}
                                        errorMessage={errors.phone?.message}
                                        labelPlacement="outside"
                                        classNames={{
                                          label: "text-[#272727] font-bold text-sm",
                                          inputWrapper: "shadow-none",
                                          base: "mb-4",
                                        }}
                                        endContent={
                                          data?.data?.length > 0 && (
                                            <Controller
                                              name="country_code"
                                              control={control}
                                              defaultValue=""
                                              render={({ field }) => (
                                                <Select
                                                  {...field}
                                                  selectedKeys={field.value ? [field.value] : []}
                                                  onSelectionChange={(keys) => {
                                                    const selectedKey = Array.from(keys)[0];
                                                    field.onChange(selectedKey);
                                                  }}
                                                  className="max-w-40 -me-3 bg-white"
                                                  isInvalid={!!errors.country_code?.message}
                                                  errorMessage={errors.country_code?.message}
                                                  classNames={{
                                                    trigger: "rounded-s-none border-1 shadow-none",
                                                    listbox: "w-full",
                                                    listboxWrapper: "w-full",
                                                  }}
                                                  variant="bordered"
                                                  renderValue={(items) =>
                                                    items?.map((item: any) => (
                                                      <div key={item.key} className="flex items-center gap-2">
                                                        {item.props.startContent}
                                                        <span>{item.props.children}</span>
                                                      </div>
                                                    ))
                                                  }
                                                >
                                                  {data?.data?.map((country: any) => (
                                                    <SelectItem
                                                      key={country.phone_code}
                                                      startContent={
                                                        <Avatar
                                                          className="w-6 h-4"
                                                          radius="none"
                                                          src={country?.image}
                                                          alt="country flag"
                                                        />
                                                      }
                                                      className="w-full"
                                                    >
                                                      {country.phone_code}
                                                    </SelectItem>
                                                  ))}
                                                </Select>
                                              )}
                                            />
                                          )
                                        }
                                      />
                              <Input
                                  label="رقم الواتس آب"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("whats_app")}
                                  isInvalid={!!errors.whats_app?.message}
                                  errorMessage={errors.whats_app?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="كلمة المرور"
                                  placeholder="نص الكتابه"
                                  type="password"
                                  {...register("password")}
                                  isInvalid={!!errors.password?.message}
                                  errorMessage={errors.password?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="تأكيد كلمة المرور"
                                  placeholder="نص الكتابه"
                                  type="password"
                                  {...register("password_confirmation")}
                                  isInvalid={!!errors.password_confirmation?.message}
                                  errorMessage={errors.password_confirmation?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="العمر"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("age")}
                                  isInvalid={!!errors.age?.message}
                                  errorMessage={errors.age?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Controller
                                  name="gender"
                                  control={control}
                                  render={({ field }) => (
                                      <Select
                                          {...field}
                                          selectedKeys={field.value ? [field.value] : [""]}
                                          onSelectionChange={(keys) => {
                                              field.onChange(Array.from(keys)[0]);
                                              console.log(Array.from(keys)[0]);
                                          }}
                                          label="الجنس"
                                          labelPlacement="outside"
                                          placeholder="اختر الجنس"
                                          isInvalid={!!errors.gender?.message}
                                          errorMessage={errors.gender?.message}
                                          classNames={{
                                              label: "text-[#272727] font-bold text-sm",
                                              base: "mb-4",
                                              value: "text-[#87878C] text-sm",
                                          }}
                                      >
                                          {[
                                              { key: "male", label: "ذكر" },
                                              { key: "female", label: "انثي" },
                                          ].map((item) => (
                                              <SelectItem key={item.key}>{item.label}</SelectItem>
                                          ))}
                                      </Select>
                                  )}
                              />

                              <Controller
                                  name="country"
                                  control={control}
                                  render={({ field }) => (
                                      <Select
                                          {...field}
                                          selectedKeys={field.value ? [field.value] : [""]}
                                          onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                                          label="الدولة"
                                          labelPlacement="outside"
                                          placeholder="اختر الدولة"
                                          isInvalid={!!errors.country?.message}
                                          errorMessage={errors.country?.message}
                                          classNames={{
                                              label: "text-[#272727] font-bold text-sm",
                                              base: "mb-4 col-span-2",
                                              value: "text-[#87878C] text-sm",
                                          }}
                                      >
                                          {[
                                              { key: "1", label: "مصر" },
                                              { key: "2", label: "المملكة العربيه السعوديه" },
                                          ].map((item) => (
                                              <SelectItem key={item.key}>{item.label}</SelectItem>
                                          ))}
                                      </Select>
                                  )}
                              />

                              <Controller
                                  name="image"
                                  control={control}
                                  render={({ field, fieldState }) => (
                                      <DropzoneField
                                          value={(field.value as any) || []}
                                          onChange={field.onChange}
                                          error={fieldState.error?.message}
                                      />
                                  )}
                              />

                              <div className="flex items-center justify-end gap-4 mt-8">
                                  <Button
                                      type="button"
                                      onPress={() => reset()}
                                      variant="solid"
                                      color="primary"
                                      className="text-white"
                                  >
                                      إلغاء
                                  </Button>
                                  <Button
                                      type="submit"
                                      variant="solid"
                                      color="primary"
                                      className="text-white"
                                      isDisabled={CreateStudent?.isPending}
                                  >
                                      {CreateStudent?.isPending && <Spinner color="white" size="sm" />}
                                      التالي
                                  </Button>
                              </div>
                          </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
