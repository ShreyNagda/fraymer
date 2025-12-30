import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { roboto } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "Fraymer - Capture. Frame. Cherish.",
  description: "Create Polaroids, save memories in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased `}>
        <main className="min-h-svh flex flex-col justify-center ">
          {children}
        </main>
        <Toaster closeButton />
      </body>
    </html>
  );
}
