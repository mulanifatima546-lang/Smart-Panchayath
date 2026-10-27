import { AdminProvider } from "@/context/admin.context";
import { PanchayatProvider } from "@/context/panchayat.context";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel • Smart Panchayath",
  description: "Admin panel for managing the Smart Panchayath application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen overflow-x-clip">
        <AppRouterCacheProvider>
          <AdminProvider>
            <PanchayatProvider>
              <section className="hidden min-h-screen w-full md:block">
                {children}
              </section>
            </PanchayatProvider>

            <div className="flex min-h-screen items-center justify-center px-6 text-center md:hidden">
              <h2 className="text-xl font-semibold text-slate-800">
                You can access the admin panel only through a desktop.
              </h2>
            </div>
          </AdminProvider>

          <Toaster position="top-right" />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
