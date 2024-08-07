import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickup Monster",
  description: "Pickup Monster is a platform for organizing and participating in pickup games of all kinds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className='min-h-screen flex flex-col'>
          {/* toast */}
          <Toaster/>
          <header className='border-b sticky top-0 z-50 bg-white'>
            <Header/>
          </header>
          <div className='bg-[#F4F2ED] flex-1 w-full'>
            <main>{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
