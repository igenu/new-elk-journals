import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          isChangePasswordOpen={isChangePasswordOpen}
          setIsChangePasswordOpen={setIsChangePasswordOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#f0f4f8] to-[#e8eef5] p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
