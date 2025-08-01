"use client";

import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";

type BreadCrumbProps = {
  items: {
    id: number;
    name: string;
    link?: string;
  }[];
  children?: React.ReactNode;
};

export const BreadCrumb = ({ items, children }: BreadCrumbProps) => {
  return (
    <div className="bg-main border-b border-stroke px-4 sm:h-[60px] flex items-center md:justify-between flex-wrap gap-4 gap-4 py-4 sm:py-0">
      <Breadcrumbs>
        {items?.map((item) => (
          <BreadcrumbItem
            href={item?.link}
            key={item?.id}
            className="font-bold"
          >
            {item?.name}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      {children}
    </div>
  );
};
