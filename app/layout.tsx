import { Cinzel_Decorative, Philosopher, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  preload: false,
});

const philosopher = Philosopher({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

const dmSans = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="en"
      className={`${cinzelDecorative.variable} ${philosopher.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex h-svh overflow-hidden">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-y-auto transition-colors duration-300">
              <Navbar />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
