"use client";
import { Button, Pagination } from "@heroui/react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import React, { useState } from "react";

export const CustomPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex items-center justify-end gap-5">
      <p className="text-sm text-title font-bold">عرض 1 - 10 من 120</p>
      <Button
        size="sm"
        variant="flat"
        onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
        className="size-9 min-w-[unset]"
      >
        <ArrowRight2 />
      </Button>
      <Pagination
        color="primary"
        variant="light"
        page={currentPage}
        total={10}
        onChange={setCurrentPage}
        radius="sm"
        classNames={{
          item: "font-semibold",
          cursor: "text-white font-semibold",
        }}
      />
      <Button
        size="sm"
        variant="flat"
        onPress={() => setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev))}
        className="size-9 min-w-[unset]"
      >
        <ArrowLeft2 />
      </Button>
    </div>
  );
};
