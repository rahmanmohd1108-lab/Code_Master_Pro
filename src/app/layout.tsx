import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeMaster Pro - Master Coding Interviews",
  description: "Practice coding problems, track your progress, and prepare for technical interviews at top tech companies. Similar to LeetCode with company-specific problem filtering.",
  keywords: ["CodeMaster Pro", "LeetCode", "coding interviews", "algorithm practice", "data structures", "technical interviews", "Google interview", "Amazon interview", "Microsoft interview"],
  authors: [{ name: "CodeMaster Pro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CodeMaster Pro - Master Coding Interviews",
    description: "Practice coding problems and prepare for technical interviews",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMaster Pro",
    description: "Master coding interviews with practice problems",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
