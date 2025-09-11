"use client";

import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { ArrowLeft2 } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { axios_config, routes } from "@/lib/const";
import { fetchClient } from "@/lib/utils";

export const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const [counts, setCounts] = React.useState<{ new_orders?: number }>({});

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetchClient("client/count/data", axios_config);
        setCounts(res);
      } catch (err) {
        console.error("Error fetching counts", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="md:w-[200px] bg-main md:border-e md:border-stroke min-h-screen">
      <Image
        src="/img/logo/logo.svg"
        alt="logo"
        width={200}
        height={74}
        className="mb-4"
      />

      <div className="flex flex-col">
        {routes.map((item) => {
          const Icon = item.icon;
          const hasSubRoutes = item.sub_routes && item.sub_routes.length > 0;

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
                    base: "shadow-none px-2.5",
                    trigger: "justify-between px-0.5 py-3 shadow-none",
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
                        onClick={onLinkClick}
                        className="flex items-center gap-1 duration-300 hover:px-1"
                      >
                        <ArrowLeft2 size={12} />
                        <span className="text-[12px] font-semibold flex items-center gap-2">
                          {subItem.name}
                          {subItem.route === "/subscriptions" &&
                          counts?.new_orders ? (
                            <span className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold">
                              {counts.new_orders}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.route}
              onClick={onLinkClick}
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
