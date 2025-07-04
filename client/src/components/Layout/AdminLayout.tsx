import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/Layout/Header";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  // Open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // If the viewport size changes, reset the default
  useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        <Header /> {/*  ⬅  no props needed now */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            side="left"
            variant="sidebar"
            collapsible={isMobile ? "offcanvas" : "icon"}
          />
          {/* Everything here automatically shifts when the
              sidebar collapses/expands */}
          <SidebarInset className="p-4 md:p-8 overflow-y-auto">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
