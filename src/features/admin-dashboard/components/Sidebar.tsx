"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  Users,
  Settings,
  Landmark,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  exact?: boolean;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  pendingSubmissionsCount?: number;
}

export default function AdminSidebar({
  pendingSubmissionsCount = 5,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const MENU_GROUPS: NavGroup[] = [
    {
      category: "Utama",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      category: "Verifikasi & Laporan",
      items: [
        {
          label: "Data Pengajuan",
          href: "/dashboard/admin/data-pengajuan",
          icon: FileSpreadsheet,
          badge:
            pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
        },
        {
          label: "Laporan Hasil Verifikasi",
          href: "/dashboard/admin/laporan-verifikasi",
          icon: FileCheck2,
        },
      ],
    },
    {
      category: "Master & Sistem",
      items: [
        {
          label: "Data Pemohon",
          href: "/dashboard/admin/data-pemohon",
          icon: Users,
        },
        {
          label: "Pengaturan",
          href: "/dashboard/admin/pengaturan",
          icon: Settings,
        },
      ],
    },
  ];

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const renderSidebarContent = (mobile = false) => {
    const collapsed = !mobile && isCollapsed;

    return (
      <div className="flex flex-col h-full bg-white text-slate-700 select-none">
        {/* 1. HEADER BRAND ADMIN */}
        <div
          className={`flex items-center h-16 border-b border-slate-100 shrink-0 ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          <Link
            href="/dashboard/admin"
            onClick={() => mobile && setIsMobileOpen(false)}
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-app-primary text-white shadow-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Landmark className="w-4 h-4 text-app-secondary" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-app-secondary ring-2 ring-white" />
            </div>

            {!collapsed && (
              <div className="flex flex-col border-l border-slate-200 pl-2.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-app-primary leading-none">
                    E-Hibah
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-app-primary text-app-secondary text-[8.5px] font-extrabold uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 truncate mt-1">
                  Kabupaten Sumbawa
                </span>
              </div>
            )}
          </Link>

          {/* Tombol Collapse (Desktop) atau Close (Mobile) */}
          {mobile ? (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Tutup Menu"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            !collapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                aria-label="Perkecil Sidebar"
                title="Perkecil Sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-app-primary hover:bg-app-primary-50/70 transition-colors cursor-pointer"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )
          )}
        </div>

        {/* Tombol Expand saat Collapsed di Desktop */}
        {collapsed && (
          <div className="flex justify-center pt-3">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              aria-label="Perluas Sidebar"
              title="Perluas Sidebar"
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-app-primary-50 border border-slate-200/80 text-slate-500 hover:text-app-primary transition-colors cursor-pointer"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. MENU NAVIGASI BERDASARKAN KATEGORI */}
        <nav
          aria-label="Navigasi Dashboard Admin"
          className="flex-1 px-3 py-5 space-y-5 overflow-y-auto"
        >
          {MENU_GROUPS.map((group, groupIndex) => (
            <div key={group.category} className="space-y-1">
              {!collapsed ? (
                <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                  {group.category}
                </p>
              ) : (
                groupIndex > 0 && (
                  <div className="mx-2 my-2 border-t border-slate-100" />
                )
              )}

              {group.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => mobile && setIsMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                      collapsed
                        ? "justify-center p-2.5"
                        : "justify-between px-3 py-2.5"
                    } ${
                      active
                        ? "bg-app-primary-50/90 text-app-primary font-bold shadow-2xs ring-1 ring-app-primary-200/70"
                        : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {/* Indikator Pill Vertikal Sisi Kiri saat Aktif */}
                    {active && !collapsed && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-app-primary"
                      />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors shrink-0 ${
                          active
                            ? "bg-app-primary text-white shadow-2xs"
                            : "bg-slate-100/80 text-slate-500 group-hover:bg-app-primary-50 group-hover:text-app-primary"
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5 stroke-[2.2]" />
                      </div>

                      {!collapsed && (
                        <span className="text-xs truncate">{item.label}</span>
                      )}
                    </div>

                    {/* Badge Antrean Pengajuan Menunggu */}
                    {item.badge !== undefined && (
                      <>
                        {collapsed ? (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-app-secondary ring-2 ring-white" />
                        ) : (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold leading-none ${
                              active
                                ? "bg-app-secondary text-app-primary-950"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* 3. FOOTER IDENTITAS INSTANSI RINGKAS */}
        {!collapsed && (
          <div className="px-4 py-3.5 border-t border-slate-100 bg-slate-50/60 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-app-primary shrink-0" />
              <span className="truncate">Bagian Kesra Setda Kab. Sumbawa</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* FLOATING TRIGGER MOBILE */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Buka Menu Admin"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-app-primary text-white shadow-lg shadow-app-primary/30 border border-white/20 hover:bg-app-primary-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-app-secondary" />
        </button>
      </div>

      {/* DRAWER OVERLAY MOBILE */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            aria-hidden="true"
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          <aside className="relative w-64 max-w-[80vw] h-full z-10 shadow-2xl border-r border-slate-200">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* SIDEBAR DESKTOP (Sticky Full Height) */}
      <aside
        className={`hidden lg:block sticky top-0 h-screen shrink-0 transition-all duration-200 border-r border-slate-200/80 bg-white ${
          isCollapsed ? "w-[74px]" : "w-64"
        }`}
      >
        {renderSidebarContent(false)}
      </aside>
    </>
  );
}
