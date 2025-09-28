"use client";

import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, addToast, Button, Skeleton, Spinner, Tooltip } from "@heroui/react";
import { ArrowLeft2, Logout } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { axios_config, routes } from "@/lib/const";
import { fetchClient, postData } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import ConfirmModal from "../global/ConfirmModal";
import { getCookie } from "cookies-next";
import { fetchPermissions } from "@/lib/helper";
import { permissionsMap } from "@/lib/permissionsMap";

export const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const [counts, setCounts] = React.useState<{ new_orders?: number }>({});
  const [confirmAction, setConfirmAction] = useState(false);

  const [allowedRoutes, setAllowedRoutes] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  
  const token = getCookie("token")

  useEffect(() => {
    async function load() {
      if (!token) return;
      const perms = await fetchPermissions(token as string);

      const filtered = routes.map((route) => {
        if (!route.sub_routes) {
          return checkPermission(route, perms) ? route : null;
        }

        const subs = route.sub_routes.filter((sub) =>
          checkPermission({ route: route.route + sub.route }, perms)
        );

        return subs.length > 0 ? { ...route, sub_routes: subs } : null;
      }).filter(Boolean);

      setAllowedRoutes(filtered);
      setLoading(false);
    }

    load();
  }, [token]);

  function checkPermission(route: any, perms: string[]) {
    const required = permissionsMap[route.route];
    if (!required) return true;
    return perms.includes(required);
  }


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

  const logout = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      return postData("client/logout", null, myHeaders);
    },

    onSuccess: async (data) => {

      if (data.message !== "success") {
        addToast({
          title: data.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          variant: "solid",
          color: "danger",
        });
      } else {
        addToast({
          title: data.message,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          variant: "solid",
          color: "success",
        });

        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "client_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        window.location.href = "/login";
      }
    },


    onError: () => {
      addToast({
        title: "عذرا حدث خطأ ما",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        variant: "solid",
        color: "danger",
      });
    },
  });

  const handleConfirmAction = () => {
    logout.mutate();
    setConfirmAction(false);
  };

  return (
    <div className="md:w-[200px] bg-main md:border-e md:border-stroke h-full min-h-screen">
      <Image
        src="/img/logo/logo.svg"
        alt="logo"
        width={200}
        height={74}
        className="mb-4"
      />

      <div className="flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-2 px-4 py-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-3">
                <Skeleton className="w-5 h-5 rounded-md" /> 
                <Skeleton className="h-4 w-32 rounded-md" /> 
              </div>
            ))}
          </div>) : (
          allowedRoutes.map((item: any) => {
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
                    {item.sub_routes.map((subItem: any) => (
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
        })
        )}
        <div className="px-4 py-3 border-t">
          <button
            onClick={() => setConfirmAction(true)}
            className="flex items-center gap-1.5"
          >
             <Logout size="20" variant="Bulk" />
            <span className="text-[13px] font-semibold flex items-center gap-2">
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>
      <ConfirmModal
        open={confirmAction}
        title={'تسجيل الخروج'}
        message={"هل أنت متأكد أنك تريد تسجيل الخروج"}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(false)}
      />
    </div>
  );
};
