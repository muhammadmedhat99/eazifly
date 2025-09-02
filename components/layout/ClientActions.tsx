"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@heroui/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HamburgerMenu } from "iconsax-reactjs";

export const ClientActions = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="block md:hidden p-2" onClick={onOpen}>
        <HamburgerMenu size={24} />
      </button>

      {/* Drawer for small screens */}
      <Drawer
        placement="right"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
      >
        <DrawerContent>
          <Sidebar onLinkClick={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
};
