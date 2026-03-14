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
  title: "Code Master Pro",
  description: "Practice coding problems, track your progress, and prepare for technical interviews at top tech companies.",
  keywords: ["Code Master Pro", "LeetCode", "coding interviews", "algorithm practice", "data structures", "technical interviews", "Google interview", "Amazon interview", "Microsoft interview"],
  authors: [{ name: "Code Master Pro Team" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Code Master Pro",
    description: "Practice coding problems and prepare for technical interviews",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 600,
        height: 600,
        alt: "Code Master Pro logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Master Pro",
    description: "Master coding interviews with practice problems",
    images: ["/logo.svg"],
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
