import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://datalens-frontend-steel.vercel.app"),
  title: "DataLens — AI CSV Analysis & Insights",
  description: "Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg"
  },
  openGraph: {
    title: "DataLens — AI CSV Analysis & Insights",
    description: "Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights.",
    url: "https://datalens-frontend-steel.vercel.app",
    siteName: "DataLens",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DataLens — AI CSV Analysis & Insights",
    description: "Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights."
  }
};

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark selection:bg-emerald-500/30 selection:text-white">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
