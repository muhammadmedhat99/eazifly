import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Tabs,
  Tab,
  Input,
  Avatar,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import AddStudentModal from "../../AddStudentModal";
import { Add } from "iconsax-reactjs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const schema = yup
  .object({
    first_name: yup.string().required("ادخل الاسم الأول").min(3),
    last_name: yup.string().required("ادخل الاسم الأخير").min(3),
    user_name: yup.string().required("ادخل اسم المستخدم").min(3),
    email: yup.string().email().required("ادخل بريد إلكتروني"),
    phone: yup.string().required("ادخل رقم الهاتف"),
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

export default function AddSubaccountModal({
  isOpen,
  onClose,
  data: programData,
}: StudentModalProps) {
  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");
  const [modalOpen, setModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [tabKey, setTabKey] = useState("fixed");

  const { data, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllCountries,
    queryFn: async () => await fetchClient(`client/countries`, axios_config),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleRowClick = () => {
    setModalOpen(true);
  };

  const handleRadioChange = (childId: number) => {
    setSelectedChildId(childId);
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={scrollBehavior}
      onOpenChange={(open) => !open && onClose()}
      size="4xl"
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              أضافة حساب فرعي
            </ModalHeader>

            <ModalBody>
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="bg-main p-5 border border-stroke rounded-lg">
                    <AddStudentModal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      student={studentDetails}
                    />

                    <div className="flex justify-end mb-5">
                      <Button
                        onPress={handleRowClick}
                        variant="flat"
                        className="text-primary font-bold bg-white"
                      >
                        <Add />
                        إضافة طالب جديد
                      </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {programData.data?.childrens?.map((child: any, index: number) => (
                        <div
                          key={index}
                          className="bg-background rounded-lg flex items-center justify-between p-4"
                        >
                          {/* Radio Button */}
                          <div className="flex items-center gap-3 w-1/12">
                            <input
                              type="radio"
                              name="selectedChild"
                              checked={selectedChildId === child.id}
                              onChange={() => handleRadioChange(child.id)}
                              className="w-4 h-4 accent-primary"
                            />
                          </div>

                          {/* Name */}
                          <div className="flex flex-col gap-2 w-5/12">
                            <span className="text-sm font-bold text-title">الإسم</span>
                            <div className="flex items-center gap-2">
                              <Avatar size="sm" src={child.image} />
                              <span className="text-black-text font-bold text-[15px]">
                                {child.first_name + " " + child.last_name}
                              </span>
                            </div>
                          </div>

                          {/* Age */}
                          <div className="flex flex-col gap-2 w-5/12">
                            <span className="text-sm font-bold text-title">السن</span>
                            <span className="font-bold text-black-text">
                              {child.age} عام
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 py-4">
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
                      type="button"
                      onPress={() => setStep(2)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                      isDisabled={selectedChildId === null}
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <Tabs
                    selectedKey={tabKey}
                    onSelectionChange={(key) => setTabKey(key as string)}
                    aria-label="sub-tabs"
                    classNames={{
                      cursor: "bg-primary",
                      tabContent:
                        "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
                      tabList: "bg-[#EAF0FD] w-full",
                    }}
                  >
                    <Tab key="fixed" title="مواعيد ثابتة" className="w-full p-5">
                      <div className="flex flex-col gap-4 mt-4">
                        <Input
                            label="تاريخ الموعد"
                            placeholder="نص الكتابه"
                            type="date"
                            labelPlacement="outside"
                            classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                            base: "mb-4",
                            }}
                        />
                        <Input
                            label="وقت الموعد"
                            placeholder="نص الكتابه"
                            type="time"
                            labelPlacement="outside"
                            classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                            base: "mb-4",
                            }}
                        />
                      </div>
                    </Tab>

                    <Tab key="flexible" title="مواعيد مرنة" className="w-full p-5">
                      <div className="flex flex-col gap-4 mt-4">
                        <Input
                            label="تاريخ الموعد"
                            placeholder="نص الكتابه"
                            type="date"
                            labelPlacement="outside"
                            classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                            base: "mb-4",
                            }}
                        />
                        <Input
                            label="وقت الموعد"
                            placeholder="نص الكتابه"
                            type="time"
                            labelPlacement="outside"
                            classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            inputWrapper: "shadow-none",
                            base: "mb-4",
                            }}
                        />
                      </div>
                    </Tab>
                  </Tabs>

                  <div className="flex justify-end gap-4 py-4">
                    <Button
                      type="button"
                      onPress={() => setStep(1)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                    >
                      رحوع
                    </Button>
                    <Button
                      type="button"
                      onPress={() => setStep(3)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                      isDisabled={selectedChildId === null}
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="flex flex-col gap-4">
                    <span className="text-lg font-bold text-title mb-4">
                      إضافة معلم
                    </span>

                    <Controller
                        name={`teachers`}
                        control={control}
                        render={({ field }) => (
                        <Select
                            {...field}
                            selectedKeys={field.value ? [field.value] : [""]}
                            onSelectionChange={(keys) => {
                            field.onChange(Array.from(keys)[0]);
                            }}
                            label="أختر المعلم"
                            labelPlacement="outside"
                            placeholder="حدد المعلم المناسب"
                            // isInvalid={!!errors.teachers?.[index]?.teacher_id?.message}
                            // errorMessage={errors.teachers?.[index]?.teacher_id?.message}
                            // isLoading={instructorsLoading}
                            classNames={{
                            label: "text-[#272727] font-bold text-sm",
                            base: "mb-4",
                            value: "text-[#87878C] text-sm",
                            }}
                            scrollShadowProps={{
                            isEnabled: false,
                            }}
                            maxListboxHeight={200}
                        >
                            {/* {instructors?.data?.map(
                            (item: { id: string; name_ar: string }) => (
                                <SelectItem key={item.id}>{item.name_ar}</SelectItem>
                            )
                            )} */}
                        </Select>
                        )}
                    />

                    <div className="flex justify-end gap-4 py-4">
                    <Button
                      type="button"
                      onPress={() => setStep(2)}
                      variant="solid"
                      color="primary"
                      className="text-white"
                    >
                      رحوع
                    </Button>
                    <Button
                      type="submit"
                      variant="solid"
                      color="primary"
                      className="text-white"
                      isDisabled={selectedChildId === null}
                    >
                      حفظ
                    </Button>
                  </div>
                  </div>
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
