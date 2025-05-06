"use client";

import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { ArrowLeft2 } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/const";

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

      {/* Main wrapper that maps original routes in order */}
      <div className="flex flex-col">
        {routes.map((item) => {
          const Icon = item.icon;
          const hasSubRoutes = item.sub_routes && item.sub_routes.length > 0;

          // Render AccordionItem if sub_routes exist
          if (hasSubRoutes) {
            return (
              <Accordion
                key={item.id}
                selectionMode="multiple"
                variant="splitted"
              >
                <AccordionItem
                  aria-label={`Accordion ${item.id}`}
                  title={
                    <div className="flex items-center gap-1.5">
                      <Icon size={18} />
                      <span className="text-[13px] font-bold">{item.name}</span>
                    </div>
                  }
                  classNames={{
                    trigger: "justify-between px-0.5 py-3",
                    content: "px-3 pt-0 pb-3",
                    indicator:
                      "duration-300 -rotate-90 data-[open=true]:rotate-90 w-3 h-3",
                  }}
                >
                  <div className="flex gap-2 flex-col">
                    {item.sub_routes.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={`${item.route}${subItem.route}`}
                        className="flex items-center gap-1 duration-300 hover:px-1"
                      >
                        <ArrowLeft2 size={12} />
                        <span className="text-[12px] font-semibold">
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            );
          }

          // Render direct Link if no sub_routes
          return (
            <Link
              key={item.id}
              href={item.route}
              className="flex items-center gap-1.5 px-5 py-3 hover:bg-muted transition-all duration-300"
            >
              <Icon size={18} />
              <span className="text-[13px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
