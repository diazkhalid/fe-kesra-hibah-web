import PemohonNavbar from "@/features/pemohon-dashboard/components/Navbar";
import PemohonSidebar from "@/features/pemohon-dashboard/components/Sidebar";
import React from "react";

export default function PemohonDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar Kiri */}
      <PemohonSidebar unreadNotifications={2} />

      {/* Kolom Kanan: Navbar Atas + Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <PemohonNavbar />

        <main className="flex-1">
          <div className="mx-auto px-4 sm:px-6 lg:px-6 py-6 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
