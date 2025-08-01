"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@heroui/react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { HamburgerMenu } from "iconsax-reactjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex">
      {/* Sidebar for large screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Drawer for mobile screens */}
      <Drawer
        placement="right"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
      >
        <DrawerContent>
          <Sidebar />
        </DrawerContent>
      </Drawer>

      <div className="flex flex-col w-full">
        {/* Header with mobile menu toggle */}
        <Header>
          <button className="block md:hidden p-2" onClick={onOpen}>
            <HamburgerMenu size={24} />
          </button>
        </Header>

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
