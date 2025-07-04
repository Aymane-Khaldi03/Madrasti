import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Layout/Header';
import { Sidebar } from '@/components/ui/sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar
          openMobile={isMobile ? sidebarOpen : false}
          collapsed={!isMobile && !sidebarOpen}
          setOpenMobile={setSidebarOpen}
        />
        <main className="flex-1 p-4 md:p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 