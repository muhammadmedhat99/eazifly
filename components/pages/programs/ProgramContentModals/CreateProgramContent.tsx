import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  addToast,
  Input,
  Spinner
} from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
}

const schema = yup.object({
  localizedFields: yup
    .object()
    .shape(
      Object.fromEntries(
        locales.map((lang) =>
          [lang, yup.object({
            title: yup.string().required("ادخل العنوان"),
            description: yup.string().required("ادخل الوصف"),
          })]
        )
      )
    )
    .required(),
});

type FormData = yup.InferType<typeof schema>;

export default function CreateProgramContent({
  isOpen,
  onClose,
}: ContentModalProps) {
  const params = useParams();
  const program_id = params.id;
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

    const onSubmit = (data: FormData) => CreateContent.mutate(data);

    const CreateContent = useMutation({
        mutationFn: (submitData: FormData) => {
            var myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
            var formdata = new FormData();
            if(program_id){
                formdata.append(`program_id`, program_id.toString());
            }
            locales.forEach((locale) => {
                const localeData = submitData.localizedFields[locale];
                formdata.append(`${locale}[title]`, localeData.title);
                formdata.append(`${locale}[description]`, localeData.description);
            });

            return postData("client/program/contents/store", formdata, myHeaders);
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
              إضافة هدف 
            </ModalHeader>

            <ModalBody>
                          <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="grid grid-cols-1 gap-4 md:grid-cols-2 py-14 px-8"
                          >
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
                                      label="وصف الهدف"
                                  />
                              </div>

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
                                      isDisabled={CreateContent?.isPending}
                                  >
                                      {CreateContent?.isPending && <Spinner color="white" size="sm" />}
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
