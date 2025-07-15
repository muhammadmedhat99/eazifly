import Image from "next/image";
import React from "react";

type MainInformationProps = {
  data: {
    id: number;
    title: string;
    label: string;
    specialization: string;
    category: string;
    content: string;
    description: string;
    image: string;
    cover: string;
    duration: string;
    goals: string;
    number_of_students: number;
    number_of_lessons: number;
    payment_methods: {
      id: number;
      title: string;
    }[];
  };
};

export const ProgramContent = ({ data }: MainInformationProps) => {
  return (
    <div className="bg-main p-5 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* main info  */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col">
          <h3 className="text-primary mb-2 font-bold">صورة البرنامج</h3>
          <div>
            <Image
              src={data.image}
              width={450}
              height={450}
              alt="login image"
              className="w-full h-full flex-1 object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 col-span-2">
        <div className="flex flex-col">
          <h3 className="text-primary mb-2 font-bold">صورة الغلاف</h3>
          <div>
            <Image
              src={data.cover || ""}
              width={450}
              height={450}
              alt="login image"
              className="w-full h-full flex-1 object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* descriptiuon  */}
      <div className="col-span-3">
        <h2 className="text-right text-primary font-bold mb-4">وصف البرنامج</h2>

        <div className="mb-6">
          <p className="text-title text-sm">{data.description}</p>
        </div>
      </div>

      {/* Program goals Section */}
      <div className="col-span-3">
        <h2 className="text-right text-primary font-bold mb-4">
          أهداف البرنامج
        </h2>

        <div className="mb-6">
          <p className="text-title text-sm">{data.goals}</p>
        </div>
      </div>
    </div>
  );
};
