import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  addToast,
  Input,
  Spinner,
  Switch
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { postData } from "@/lib/utils";
import { useParams } from 'next/navigation';
import { LocalizedTextArea } from "@/components/global/LocalizedField";
import { AllQueryKeys } from "@/keys";

const locales = ["ar", "en"] as const;

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter_id: string;
}

const schema = yup.object({
    localizedFields: yup
        .object()
        .shape(
            Object.fromEntries(
                locales.map((lang) => [
                    lang,
                    yup.object({
                        title: yup.string().required("ادخل العنوان"),
                        description: yup.string().required("ادخل الوصف"),
                    }),
                ])
            )
        )
        .required(),

    is_finished: yup
        .string()
        .oneOf(["user", "instructor"], "القيمة يجب أن تكون user أو instructor")
        .required("اختار إنهاء من قبل"),

    points: yup
        .number()
        .required("ادخل النقاط"),
});

type FormData = yup.InferType<typeof schema>;

export default function CreateProgramLesson({
  isOpen,
  onClose,
  chapter_id,
}: ContentModalProps) {
  const queryClient = useQueryClient();

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

    const onSubmit = (data: FormData) => CreateLesson.mutate(data);

    const CreateLesson = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            if(chapter_id){
                formdata.append(`chapter_id`, chapter_id.toString());
            }
            formdata.append(`is_finished`, submitData.is_finished);
            formdata.append(`points`, submitData.points.toString());
            locales.forEach((locale) => {
                const localeData = submitData.localizedFields[locale];
                formdata.append(`${locale}[title]`, localeData.title);
                formdata.append(`${locale}[description]`, localeData.description);
            });

            return postData("client/program/lessons/store", formdata, myHeaders);
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
                queryClient.invalidateQueries({ queryKey: AllQueryKeys.GetAllProgramContents });
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

  return (
    <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}  onOpenChange={(open) => !open && onClose()} size="4xl">
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              إضافة درس 
            </ModalHeader>

            <ModalBody>
                          <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
                          >
                              <div className="col-span-2 mb-4">
                                  <Controller
                                      name="is_finished"
                                      control={control}
                                      render={({ field }) => (
                                          <div className="flex items-center gap-3">
                                              <span
                                                  className={`text-sm font-bold ${field.value === "user" ? "text-warning" : "text-gray-500"
                                                      }`}
                                              >
                                                  إنهاء من قبل الطالب 
                                              </span>

                                              <Switch
                                                  isSelected={field.value === "instructor"}
                                                  onValueChange={(selected) =>
                                                      field.onChange(selected ? "instructor" : "user")
                                                  }
                                                  color="success"
                                              />

                                              <span
                                                  className={`text-sm font-bold ${field.value === "instructor" ? "text-green-600" : "text-gray-500"
                                                      }`}
                                              >
                                                  إنهاء من قبل المعلم 
                                              </span>
                                          </div>
                                      )}
                                  />

                              </div>
                              <Input
                                  label="العنوان بالعربية"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("localizedFields.ar.title")}
                                  isInvalid={!!errors?.localizedFields?.ar?.title}
                                  errorMessage={errors?.localizedFields?.ar?.title?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <Input
                                  label="العنوان بالإنجليزية"
                                  placeholder="نص الكتابه"
                                  type="text"
                                  {...register("localizedFields.en.title")}
                                  isInvalid={!!errors?.localizedFields?.en?.title}
                                  errorMessage={errors?.localizedFields?.en?.title?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />
                              <div className="md:col-span-2">
                                  <LocalizedTextArea
                                      control={control}
                                      name="description"
                                      label="وصف الدرس"
                                  />
                              </div>
                              <Input
                                  label="النقاط"
                                  placeholder="نص الكتابه"
                                  type="number"
                                  {...register("points")}
                                  isInvalid={!!errors.points?.message}
                                  errorMessage={errors.points?.message}
                                  labelPlacement="outside"
                                  classNames={{
                                      label: "text-[#272727] font-bold text-sm",
                                      inputWrapper: "shadow-none",
                                      base: "mb-4",
                                  }}
                              />

                              <div className="flex items-center justify-end gap-4 mt-8 col-span-2">
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
                                      isDisabled={CreateLesson?.isPending}
                                  >
                                      {CreateLesson?.isPending && <Spinner color="white" size="sm" />}
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
