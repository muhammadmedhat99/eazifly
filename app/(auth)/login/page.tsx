import Image from "next/image";

import myImage from "@/public/img/static/image.png";

import { LoginForm } from "@/components/pages/login/form";

export default function App() {
  return (
    <div className="bg-[#E9EFF7] flex items-center justify-between w-screen h-screen">
      <div className="flex flex-col gap-2 flex-1 px-14">
        <p className="text-xl font-bold">اهلا بعودتك مجددا ..!</p>
        <p className="text-[#5E5E5E] text-sm font-bold mb-10">
          سجل الدخول إلي حسابك للمتابعه في منصتنا التعليميه
        </p>
        <LoginForm />
      </div>
      <Image
        src={myImage}
        width={1024}
        height={1024}
        alt="login image"
        className="w-1/2 h-full flex-1 object-cover"
      />
    </div>
  );
}
