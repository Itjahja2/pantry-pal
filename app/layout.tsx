import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pantry Pal",
  description: "Recipes and ingredients on hand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <ChatWidget />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
