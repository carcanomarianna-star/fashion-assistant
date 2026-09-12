import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Style Formula | Wardrobe Database & Outfit Assistant",
  description: "Closet-first styling toolkit based on Color + Shape + Finish.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Style Formula",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-editorial-50">
      <body className="h-full antialiased selection:bg-editorial-300 selection:text-editorial-900">
        <main className="min-h-screen pb-24 md:pb-12 max-w-lg mx-auto md:max-w-4xl bg-editorial-50 md:shadow-2xl md:border-x border-editorial-200 relative overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
