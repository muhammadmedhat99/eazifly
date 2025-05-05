import { Sidebar } from "@/components/layout/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="bg-light h-[74px] bg-main"></div>
        {children}
      </div>
    </div>
  );
}
