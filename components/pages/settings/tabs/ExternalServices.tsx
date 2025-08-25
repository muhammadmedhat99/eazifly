"use client";

import { addToast, Avatar, Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, Switch } from "@heroui/react";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { Loader } from "@/components/global/Loader";
import { Google, Link, Message } from "iconsax-reactjs";
import { useRouter } from "next/navigation";


export const ExternalServices = () => {
  const { data: settingData, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllSettings,
    queryFn: async () => await fetchClient(`client/setting`, axios_config),
  });

  const geideaStatus = settingData?.data?.find(
    (item: any) => item.key === "geidea_status"
  )?.value;

  const router = useRouter();
  return (
    isLoading ? (<Loader />) : (
      <div className="px-4 py-6 grid gap-5 grid-cols-3">
        <Card key={'geidea'} className="w-full max-w-sm shadow-md border rounded-xl p-2 cursor-pointer" isPressable onClick={() => router.push(`/settings/general/geidea`)}> 
          <CardHeader className="flex justify-between items-start border-b">
            <div className="flex flex-col gap-3">
              <Avatar src="https://hossam.mallahsoft.com/storage/client/setting/1754915836.png" className="text-2xl text-[#4285F4]" />
              <div className="flex flex-col">
                <p className="text-md font-bold">Geidea</p>
              </div>
            </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-bold">geidea.net</p>
                <Link />
              </div>
          </CardHeader>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-bold ${geideaStatus === "test" ? "text-warning" : "text-gray-500"
                  }`}
              >
                Test
              </span>

              <Switch
                isSelected={geideaStatus === "production"}
                color="success"
              />

              <span
                className={`text-sm font-bold ${geideaStatus === "production" ? "text-green-600" : "text-gray-500"
                  }`}
              >
                Production
              </span>
            </div>
          </CardFooter>
        </Card>
        <Card key={'mail'} className="w-full max-w-sm shadow-md border rounded-xl p-2 cursor-pointer" isPressable onClick={() => router.push(`/settings/general/mail`)}> 
          <CardHeader className="flex justify-between items-start">
            <div className="flex flex-col gap-3">
              <Message size={'28'}/>
              <div className="flex flex-col">
                <p className="text-md font-bold">Mail</p>
              </div>
            </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-bold">google.com</p>
                <Link />
              </div>
          </CardHeader>
        </Card>
      </div>
    )
  );
};
