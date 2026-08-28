import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OrganizerSidebar from '../components/sidebar/OrganizerSidebar';
import OrganizerNavbar from '../components/navbar/OrganizerNavbar';
import ToastContainer from '../components/common/ToastContainer';

export default function OrganizerLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen z-30">
        <OrganizerSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-white z-10 shadow-2xl">
            <OrganizerSidebar isMobile={true} onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <OrganizerNavbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
