import { Header } from "@/components/layout/Header";
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
        <Header />
        {children}
      </div>
    </div>
  );
}
