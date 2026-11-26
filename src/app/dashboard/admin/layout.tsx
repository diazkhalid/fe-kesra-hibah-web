import AdminNavbar from "@/features/admin-dashboard/components/Navbar";
import AdminSidebar from "@/features/admin-dashboard/components/Sidebar";
import React from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar Navigasi Admin */}
      <AdminSidebar pendingSubmissionsCount={5} />

      {/* Kolom Kanan: Navbar Admin + Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
