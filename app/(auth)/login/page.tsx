"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Image from "next/image";

const schema = yup
  .object({
    firstName: yup.string().required(),
    age: yup.number().positive().integer().required(),
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
    <div className="bg-[#E9EFF7] flex items-center justify-center">
      <Image
        src="/img/static/image.png"
        width={500}
        height={500}
        alt="login image"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName")} />
        <p>{errors.firstName?.message}</p>

        <input {...register("age")} />
        <p>{errors.age?.message}</p>

        <input type="submit" />
      </form>
    </div>
  );
}
