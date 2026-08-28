import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navbar/PublicNavbar';
import ToastContainer from '../components/common/ToastContainer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 w-full overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
