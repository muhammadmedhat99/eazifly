"use client";

import React from "react";

import { Accordion, AccordionItem } from "@heroui/react";
import { Profile2User } from "iconsax-reactjs";

export const Sidebar = () => {
  return (
    <div className="w-[200px] bg-main border-e border-stroke min-h-screen">
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
            content: "px-6 py-2",
          }}
        >
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores,
          repellat.
        </AccordionItem>
      </Accordion>
    </div>
  );
};
