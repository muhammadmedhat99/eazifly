import React from "react";

export const ProgramContent = () => {
  return (
    <div className="bg-main -mx-1">
      {/* main info  */}
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full relative">
          <h3 className="text-primary mb-2 font-bold">صورة البرنامج</h3>
          <div className="overflow-hidden rounded-lg h-40">
            <img
              src="https://placehold.co/800x400"
              alt="Program"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-full relative">
          <h3 className="text-primary mb-2 font-bold">صورة الفائدة</h3>
          <div className="overflow-hidden rounded-lg h-40">
            <img
              src="https://placehold.co/800x400"
              alt="Audience"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* descriptiuon  */}
      <div className="p-4 ">
        <h2 className="text-right text-primary font-bold mb-4">وصف البرنامج</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-black-text mb-2">
            1 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
          </h3>
          <p className="text-title text-sm">
            هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
            جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو جزء من
            عملية تحسين تجربة المستخدم خلال النص.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-black-text mb-2">
            2 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
          </h3>
          <p className="text-title text-sm">
            هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
            جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو جزء من
            عملية تحسين تجربة المستخدم خلال النص.
          </p>
        </div>
      </div>

      {/* What Students Will Learn Section */}
      <div className="p-4 ">
        <h2 className="text-right text-primary font-bold mb-4">
          ماذا سوف يتعلم الطلاب في الدورة ؟
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-black-text mb-2">
            1 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
          </h3>
          <p className="text-title text-sm">
            هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
            جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو جزء من
            عملية تحسين تجربة المستخدم خلال النص.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-black-text mb-2">
            2 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
          </h3>
          <p className="text-title text-sm">
            هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
            جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو جزء من
            عملية تحسين تجربة المستخدم خلال النص.
          </p>
        </div>
      </div>

      {/* Program Benefits Section */}
      <div className="p-4 ">
        <h2 className="text-right text-primary font-bold mb-4">
          مزايا البرنامج
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-black-text mb-2">
            1 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
          </h3>
          <p className="text-title text-sm">
            هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
            جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو جزء من
            عملية تحسين تجربة المستخدم خلال النص.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-black-text mb-2">
            2 - هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص
          </h3>
          <p className="text-title text-sm">
            هذا النص هو جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو
            جزء من عملية تحسين تجربة المستخدم خلال النص. هذا النص هو جزء من
            عملية تحسين تجربة المستخدم خلال النص.
          </p>
        </div>
      </div>

      {/* Instructor Profiles Section */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <h3 className="text-primary font-bold mb-2">إسم للف</h3>
          <div className="overflow-hidden rounded-lg h-40">
            <img
              src="https://placehold.co/400x400"
              alt="Instructor 1"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-primary font-bold mb-2">إسم للف</h3>
          <div className="overflow-hidden rounded-lg h-40">
            <img
              src="https://placehold.co/400x400"
              alt="Instructor 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-primary font-bold mb-2">إسم للف</h3>
          <div className="overflow-hidden rounded-lg h-40">
            <img
              src="https://placehold.co/400x400"
              alt="Instructor 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
