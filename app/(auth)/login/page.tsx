"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Image from "next/image";

import myImage from "@/public/img/static/image.png";
import { Button, Input } from "@heroui/react";

const schema = yup
  .object({
    firstName: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormData) => console.log(data);

  return (
    <div className="bg-[#E9EFF7] flex items-center justify-center w-screen h-screen">
      <Image src={myImage} width={500} height={500} alt="login image" />

      <div className="flex flex-col gap-2">
        <p></p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="البريد الإلكتروني او رقم الهاتف"
          placeholder="نص الكتابه"
          type="text"
          {...register("firstName")}
          isInvalid={!!errors.firstName?.message}
          errorMessage={errors.firstName?.message}
          labelPlacement="outside"
        />
        <Input
          label="كلمة المرور"
          placeholder="نص الكتابه"
          type="password"
          {...register("password")}
          isInvalid={!!errors.password?.message}
          errorMessage={errors.password?.message}
          labelPlacement="outside"
        />

        <Button variant="solid" type="submit">
          تأكيد
        </Button>
      </form>
    </div>
  );
}
