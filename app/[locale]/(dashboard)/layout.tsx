import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ClientActions } from "@/components/layout/ClientActions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar for large screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full">
        {/* Header with mobile menu toggle */}
        <Header>
          <ClientActions />
        </Header>

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
