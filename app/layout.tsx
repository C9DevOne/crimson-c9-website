import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CrimsonC9",
  description: "Change Through Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex h-svh overflow-hidden">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-y-auto">
              <header className="flex h-12 shrink-0 items-center px-4">
                <SidebarTrigger className="-ml-1" />
              </header>
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
