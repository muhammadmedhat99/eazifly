"use client";
import { Button, Pagination } from "@heroui/react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import React, { useState } from "react";

type CustomPaginationProps = {
  currentPage?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
  last_page?: number;
};

export const CustomPagination = ({
  currentPage,
  setCurrentPage,
  total,
  last_page,
}: CustomPaginationProps) => {
  return (
    <div className="flex items-center justify-end gap-5">
      <p className="text-sm text-title font-bold">عرض 1 - 10 من {total}</p>
      <Button
        size="sm"
        variant="flat"
        isDisabled={currentPage === 1}
        onPress={() => {
          setCurrentPage &&
            setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
        }}
        className="size-9 min-w-[unset]"
      >
        <ArrowRight2 />
      </Button>
      <Pagination
        color="primary"
        variant="light"
        page={currentPage}
        total={last_page || 10}
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
        isDisabled={currentPage === last_page}
        onPress={() => {
          setCurrentPage &&
            setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev));
        }}
        className="size-9 min-w-[unset]"
      >
        <ArrowLeft2 />
      </Button>
    </div>
  );
};
