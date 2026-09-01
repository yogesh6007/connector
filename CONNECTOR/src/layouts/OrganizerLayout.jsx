import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Sidebar } from '../components/sidebar/Sidebar';

export const OrganizerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex max-w-full min-w-0">
        {/* Sidebar Component */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-20 pb-6 lg:pl-72 transition-all overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
