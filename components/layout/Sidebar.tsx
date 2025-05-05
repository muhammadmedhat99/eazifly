"use client";

import React from "react";

import { Accordion, AccordionItem } from "@heroui/react";
import { ArrowLeft2, Profile2User } from "iconsax-reactjs";
import Image from "next/image";

import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="w-[200px] bg-main border-e border-stroke min-h-screen">
      <Image
        src="/img/logo/logo.svg"
        alt="logo"
        width={200}
        height={74}
        className="mb-4"
      />
      <Accordion selectionMode="multiple" variant="splitted">
        <AccordionItem
          key="stydents"
          aria-label="Accordion 1"
          title={
            <div className="flex items-center gap-1">
              <Profile2User size={18} />
              <span className="text-sm font-bold">الطلاب</span>
            </div>
          }
          classNames={{
            trigger: "justify-between px-5 py-3",
            content: "px-6",
            indicator: "duration-300 -rotate-90 data-[open=true]:rotate-90",
          }}
        >
          <div className="flex gap-2 flex-col">
            <Link
              href="/students"
              className="flex items-center gap-1 duration-300 hover:ms-1"
            >
              <ArrowLeft2 size={12} />
              <span className="text-sm font-semibold">بيانات الطلاب</span>
            </Link>
            <Link
              href="/students"
              className="flex items-center gap-1 duration-300 hover:ms-1"
            >
              <ArrowLeft2 size={12} />
              <span className="text-sm font-semibold">اشتراكات الطلاب</span>
            </Link>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
