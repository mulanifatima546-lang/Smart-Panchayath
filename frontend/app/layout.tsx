import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { PanchayatProvider } from "@/context/panchayat.context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Panchayath",
  description:
    "A web application for managing panchayath activities and services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-[#333] bg-gray-900 flex flex-col">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <PanchayatProvider>{children}</PanchayatProvider>

          <Toaster position="top-right" />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
