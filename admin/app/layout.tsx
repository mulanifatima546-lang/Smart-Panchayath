import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Typography } from "@mui/material";
import { AdminProvider } from "@/context/admin.contex";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminProvider>
          <section className="md:block hidden">{children}</section>
        </AdminProvider>
        <div className="flex h-screen px-10 text-center md:hidden justify-center items-center">
          <Typography variant="h6">
            You can access admin panel only through Desktop
          </Typography>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
