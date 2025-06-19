"use client";

import React, { useState } from "react";

import TableComponent from "@/components/global/Table";
import { Options } from "@/components/global/Icons";
import {
  Tab,
  Tabs,
} from "@heroui/react";
import { GeneralSettings } from "./tabs/GeneralSettings";
import { FinancialSettings } from "./tabs/FinancialSettings";
import { Permissions } from "./tabs/Permissions";
import { SubscriptionSettings } from "./tabs/SubscriptionSettings";
import { LearningResources } from "./tabs/LearningResources";
import { AdsAndVisibility } from "./tabs/AdsAndVisibility";
import { ExternalServices } from "./tabs/ExternalServices";

export const Settings = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("1");

  return (
    <div className="flex w-full flex-col bg-main">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "w-full bg-main py-5",
          tab: "w-fit",
          cursor: "hidden",
          tabContent:
            "text-[#5E5E5E] text-sm font-bold group-data-[selected=true]:text-primary",
        }}
      >
        <Tab key="general_settings" title="الإعدادات العامة">
        <GeneralSettings />
        </Tab>
        <Tab key="financial_settings" title="الإعدادات المالية">
        <FinancialSettings />
        </Tab>
        <Tab key="permissions" title="الصلاحيات">
        <Permissions />
        </Tab>
        <Tab key="subscription_renewal_settings" title="إعدادات تجديد الإشتراكات">
        <SubscriptionSettings />
        </Tab>
        <Tab key="learning_resources" title="المصادر التعليمية">
        <LearningResources />
        </Tab>
        <Tab key="ads_and_visibility" title="تحسين الظهور والإعلانات">
        <AdsAndVisibility />
        </Tab>
        <Tab key="external_services" title="الربط مع خدمات خارجية">
        <ExternalServices />
        </Tab>
      </Tabs>
    </div>
  );
};
