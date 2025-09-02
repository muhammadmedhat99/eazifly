import Image from "next/image";

import myImage from "@/public/img/static/image.png";

import { LoginForm } from "@/components/pages/login/form";

export default function App() {
  return (
    <div className="bg-[#E9EFF7] dark:bg-[#0b112c] flex flex-col md:flex-row items-center justify-between w-screen h-screen">
      <div className="flex flex-col gap-2 flex-1 px-6 md:px-14 py-8 md:py-0">
        <p className="text-xl md:text-2xl font-bold">اهلا بعودتك مجددا ..!</p>
        <p className="text-[#5E5E5E] text-sm md:text-base font-bold mb-6 md:mb-10">
          سجل الدخول إلي حسابك للمتابعه في منصتنا التعليميه
        </p>
        <LoginForm />
      </div>

      <Image
        src={myImage}
        width={1024}
        height={1024}
        alt="login image"
        className="hidden md:block w-1/2 h-full object-cover"
      />
    </div>
  );
}

