import type { Metadata } from "next";
import "./globals.css";
import { CommunityProvider } from "@/context/CommunityContext";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { NotificationToast } from "@/components/layout/NotificationToast";

export const metadata: Metadata = {
  title: "NEXUS • Community Intelligence System",
  description:
    "Action-driven digital community platform bringing people, opportunities, activities, and collaboration together in one connected ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080A0D] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-200">
        <CommunityProvider>
          <NavigationHeader />
          <main className="flex-1 pb-16">{children}</main>
          <NotificationToast />
          
          {/* Subtle High-Signal Footer */}
          <footer className="border-t border-[#181E29] bg-[#07090C] py-6 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>NEXUS v0.1 • Aleropath Connect Grand Finale Prototype</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>Identity Bound</span>
                <span>•</span>
                <span>Spatial Graph Active</span>
                <span>•</span>
                <span>Zero Vanity Noise</span>
              </div>
            </div>
          </footer>
        </CommunityProvider>
      </body>
    </html>
  );
}
