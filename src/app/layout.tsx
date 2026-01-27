import type { Metadata } from "next";
import { Geist, Geist_Mono, Bungee } from "next/font/google"; // Changed import
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bungee = Bungee({ // Added Bungee
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HEMS Labs | Bridging Hyper-Local Culture with High-Tech Solutions",
  description:
    "HEMS Labs is a venture studio building the infrastructure for student life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bungee.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
