import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProviderWrapper } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product & Category Manager",
  description: "A modern admin dashboard for managing products and categories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          <div className="flex h-screen relative">
            <Sidebar />
            <main className="flex-1 overflow-y-auto md:ml-0">
              <div className="md:hidden h-16" /> {/* Spacer for mobile menu button */}
              {children}
            </main>
            <MobileSidebar />
          </div>
          <Toaster />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
