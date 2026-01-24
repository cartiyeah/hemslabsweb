import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import PageTransitionProvider from "@/components/providers/PageTransitionProvider";
import Navigation from "@/components/layout/Navigation";
import SplashScreen from "@/components/effects/SplashScreen";
import CursorBubbleTrail from "@/components/effects/CursorBubbleTrail";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEMS Labs | Bridging Hyper-Local Culture with High-Tech Solutions",
  description:
    "HEMS Labs is a venture studio building the infrastructure for student life in Manipal. Events, Marketing, and AI-powered assistants.",
  keywords: [
    "HEMS Labs",
    "Manipal",
    "Events",
    "Marketing",
    "Bubbles AI",
    "Student Life",
  ],
  authors: [{ name: "HEMS Labs" }],
  openGraph: {
    title: "HEMS Labs",
    description: "Bridging Hyper-Local Culture with High-Tech Solutions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <CursorBubbleTrail />
          <SplashScreen />
          <Navigation />
          <PageTransitionProvider>
            <main>{children}</main>
          </PageTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

