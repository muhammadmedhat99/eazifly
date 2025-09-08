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
    <div className="flex h-screen">
      {/* Sidebar for large screens */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        {/* Header with mobile menu toggle */}
        <Header>
          <ClientActions />
        </Header>

        <div className="relative flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
