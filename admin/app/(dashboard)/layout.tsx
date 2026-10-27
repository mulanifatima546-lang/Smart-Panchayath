"use client";

import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <div className="z-30 shrink-0">
        <Nav />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden h-full w-65 shrink-0 md:block">
          <Sidebar />
        </aside>

        <main className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto border-l border-gray-200 bg-gray-50 p-4 md:p-6">
          <div className="mx-auto w-full max-w-[1600px] pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
