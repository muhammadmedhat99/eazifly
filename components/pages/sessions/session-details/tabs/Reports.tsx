"use client";

import { ArchiveAdd } from "iconsax-reactjs";
import React from "react";


export const Reports = () => {

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <ArchiveAdd size="80" className="text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600">
          لا يوجد تقارير حالياً
        </h2>
        <p className="text-gray-400">
          عندما يكون هناك تقارير ستظهر هنا
        </p>
      </div>
  );
};
