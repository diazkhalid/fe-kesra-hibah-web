import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/shared/fonts";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";

export const metadata: Metadata = {
  title: "Pengajuan Hibah Kabupaten Sumbawa",
  description:
    "Portal resmi layanan pengajuan, verifikasi, dan pemantauan dana hibah Pemerintah Kabupaten Sumbawa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${poppins.className} bg-slate-50 text-slate-800 antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer></Footer>
      </body>
    </html>
  );
}
